// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/// @title PharmaSupplyChain
/// @notice Tracks custody of serialised pharmaceutical packs from manufacture
/// to dispensing, for a South African (SAHPRA-style) supply chain.
/// @dev POPIA compliance: only identifiers, addresses, enums, timestamps and
/// keccak256 hashes are stored on-chain. No names, patient data, or any
/// human-readable product information ever touches contract storage or
/// events. The off-chain service holds human-readable records; this contract
/// only ever sees their hashes. The contract holds no Ether, makes no
/// external calls, and every state-mutating function follows
/// checks-effects-interactions ordering.
contract PharmaSupplyChain {
    // --- Enums ---

    enum Role {
        None,
        Regulator,
        Manufacturer,
        Distributor,
        Wholesaler,
        Pharmacy
    }

    enum UnitStatus {
        None, // sentinel: unit does not exist
        Manufactured,
        InTransit,
        Received,
        Dispensed,
        Flagged
    }

    /// @dev Reason codes for SuspiciousActivity, one per attack category in
    /// the spec: already-dispensed, non-holder transfer/dispense, an
    /// operation touching a recalled batch, and an unknown unit ID.
    enum SuspiciousReason {
        NotHolder,
        RecalledBatch,
        AlreadyDispensed,
        UnknownUnit
    }

    // --- Array caps ---
    //
    // Both caps were set from gas measured directly on this contract (see a
    // 1/10/50/100-unit sweep in DESIGN_NOTES.md), against Ganache's default
    // 30,000,000 block gas limit (confirmed via `truffle migrate` output):
    //   - registerBatch's measured marginal cost is ~117,500 gas/unit (one
    //     Unit struct write + one CustodyRecord push + loop overhead), so
    //     MAX_BATCH_UNITS = 100 costs ~11.85M gas - 39.5% of the block limit,
    //     leaving room for other transactions in the same block.
    //   - initiateTransfer's measured marginal cost is ~65,200 gas/unit and
    //     acceptTransfer's is ~68,000 gas/unit (each unit needs a storage
    //     read-modify-write on an existing Unit plus a CustodyRecord push).
    //     MAX_TRANSFER_BATCH = 50 costs ~3.3-3.4M gas - about 11% of the
    //     block limit per call.
    uint256 public constant MAX_BATCH_UNITS = 100;
    uint256 public constant MAX_TRANSFER_BATCH = 50;

    // --- Storage ---

    struct Participant {
        Role role;
        bool active;
        bytes32 profileHash; // off-chain profile (e.g. licence number), hashed
    }

    struct Batch {
        address manufacturer;
        bytes32 dataHash; // off-chain product details, hashed
        uint64 manufactureDate;
        uint64 expiryDate;
        uint256 unitCount;
        bool recalled;
    }

    struct Unit {
        bytes32 batchId;
        address currentHolder;
        address pendingReceiver;
        UnitStatus status;
    }

    struct CustodyRecord {
        address from;
        address to;
        UnitStatus status;
        uint64 timestamp;
    }

    mapping(address => Participant) public participants;
    mapping(bytes32 => Batch) public batches;
    mapping(bytes32 => Unit) public units;
    mapping(bytes32 => CustodyRecord[]) private custodyHistory;

    // --- Events ---

    event ParticipantRegistered(address indexed account, Role role, bytes32 profileHash);
    event ParticipantSuspended(address indexed account);
    event ParticipantReinstated(address indexed account);
    event BatchRegistered(bytes32 indexed batchId, address indexed manufacturer, uint256 unitCount);
    event BatchRecalled(bytes32 indexed batchId);
    event CustodyChanged(bytes32 indexed unitId, address indexed from, address indexed to, UnitStatus status, uint64 timestamp);
    event TransferInitiated(bytes32 indexed unitId, address indexed from, address indexed to);
    event TransferAccepted(bytes32 indexed unitId, address indexed receiver);
    event Dispensed(bytes32 indexed unitId, address indexed pharmacy, bytes32 prescriptionHash);
    event SuspiciousActivity(bytes32 indexed unitId, address indexed actor, SuspiciousReason reasonCode);

    // --- Errors ---

    error Unauthorized();
    error NotRegistered();
    error AlreadyRegistered();
    error AlreadyActive();
    error AlreadySuspended();
    error BatchAlreadyExists();
    error BatchNotFound();
    error AlreadyRecalled();
    error InvalidArrayLength();
    error InvalidDates();
    error DuplicateUnit();
    error NoNextRole();
    error InvalidReceiver();
    error UnitNotFound();
    error NotPendingReceiver();
    error TransferNotPending();

    // --- Modifiers ---

    modifier onlyRegulator() {
        if (participants[msg.sender].role != Role.Regulator || !participants[msg.sender].active) revert Unauthorized();
        _;
    }

    modifier onlyActive() {
        if (!participants[msg.sender].active) revert Unauthorized();
        _;
    }

    modifier onlyRole(Role role_) {
        Participant memory p = participants[msg.sender];
        if (p.role != role_ || !p.active) revert Unauthorized();
        _;
    }

    // --- Construction ---

    constructor() {
        participants[msg.sender] = Participant(Role.Regulator, true, bytes32(0));
        emit ParticipantRegistered(msg.sender, Role.Regulator, bytes32(0));
    }

    // --- Participant management (Regulator only) ---

    function registerParticipant(address account, Role role_, bytes32 profileHash) external onlyRegulator {
        if (role_ == Role.None) revert Unauthorized();
        if (participants[account].role != Role.None) revert AlreadyRegistered();
        participants[account] = Participant(role_, true, profileHash);
        emit ParticipantRegistered(account, role_, profileHash);
    }

    function suspendParticipant(address account) external onlyRegulator {
        Participant storage p = participants[account];
        if (p.role == Role.None) revert NotRegistered();
        if (!p.active) revert AlreadySuspended();
        p.active = false;
        emit ParticipantSuspended(account);
    }

    function reinstateParticipant(address account) external onlyRegulator {
        Participant storage p = participants[account];
        if (p.role == Role.None) revert NotRegistered();
        if (p.active) revert AlreadyActive();
        p.active = true;
        emit ParticipantReinstated(account);
    }

    // --- Batch / unit creation (Manufacturer only) ---

    function registerBatch(
        bytes32 batchId,
        bytes32 dataHash,
        uint64 manufactureDate,
        uint64 expiryDate,
        uint256[] calldata serialNumbers
    ) external onlyRole(Role.Manufacturer) {
        if (batches[batchId].manufacturer != address(0)) revert BatchAlreadyExists();
        if (serialNumbers.length == 0 || serialNumbers.length > MAX_BATCH_UNITS) revert InvalidArrayLength();
        if (expiryDate <= manufactureDate) revert InvalidDates();

        batches[batchId] = Batch(msg.sender, dataHash, manufactureDate, expiryDate, serialNumbers.length, false);

        for (uint256 i = 0; i < serialNumbers.length; i++) {
            bytes32 unitId = keccak256(abi.encodePacked(batchId, serialNumbers[i]));
            if (units[unitId].status != UnitStatus.None) revert DuplicateUnit();

            units[unitId] = Unit(batchId, msg.sender, address(0), UnitStatus.Manufactured);
            custodyHistory[unitId].push(CustodyRecord(address(0), msg.sender, UnitStatus.Manufactured, uint64(block.timestamp)));
            emit CustodyChanged(unitId, address(0), msg.sender, UnitStatus.Manufactured, uint64(block.timestamp));
        }

        emit BatchRegistered(batchId, msg.sender, serialNumbers.length);
    }

    function recallBatch(bytes32 batchId) external onlyRegulator {
        Batch storage b = batches[batchId];
        if (b.manufacturer == address(0)) revert BatchNotFound();
        if (b.recalled) revert AlreadyRecalled();
        b.recalled = true;
        emit BatchRecalled(batchId);
    }

    // --- Custody transfer (two-step handover) ---

    function initiateTransfer(bytes32[] calldata unitIds, address to) external onlyActive {
        if (unitIds.length == 0 || unitIds.length > MAX_TRANSFER_BATCH) revert InvalidArrayLength();

        Role expectedRole = _nextRole(participants[msg.sender].role);
        Participant memory receiver = participants[to];
        if (receiver.role != expectedRole || !receiver.active) revert InvalidReceiver();

        for (uint256 i = 0; i < unitIds.length; i++) {
            bytes32 unitId = unitIds[i];
            Unit storage u = units[unitId];
            if (u.status == UnitStatus.None) revert UnitNotFound();

            // Counterfeit-detection cases below must NOT revert (a revert
            // rolls back the SuspiciousActivity event that is the evidence
            // of the attempt), so each flags the unit and moves on instead.
            if (u.currentHolder != msg.sender) {
                _flag(unitId, msg.sender, SuspiciousReason.NotHolder);
                continue;
            }
            if (batches[u.batchId].recalled) {
                _flag(unitId, msg.sender, SuspiciousReason.RecalledBatch);
                continue;
            }

            u.pendingReceiver = to;
            u.status = UnitStatus.InTransit;
            custodyHistory[unitId].push(CustodyRecord(msg.sender, to, UnitStatus.InTransit, uint64(block.timestamp)));
            emit CustodyChanged(unitId, msg.sender, to, UnitStatus.InTransit, uint64(block.timestamp));
            emit TransferInitiated(unitId, msg.sender, to);
        }
    }

    function acceptTransfer(bytes32[] calldata unitIds) external onlyActive {
        if (unitIds.length == 0 || unitIds.length > MAX_TRANSFER_BATCH) revert InvalidArrayLength();

        for (uint256 i = 0; i < unitIds.length; i++) {
            bytes32 unitId = unitIds[i];
            Unit storage u = units[unitId];
            if (u.status == UnitStatus.None) revert UnitNotFound();
            if (u.pendingReceiver != msg.sender) revert NotPendingReceiver();
            if (u.status != UnitStatus.InTransit) revert TransferNotPending();

            if (batches[u.batchId].recalled) {
                u.pendingReceiver = address(0);
                _flag(unitId, msg.sender, SuspiciousReason.RecalledBatch);
                continue;
            }

            address previousHolder = u.currentHolder;
            u.currentHolder = msg.sender;
            u.pendingReceiver = address(0);
            u.status = UnitStatus.Received;
            custodyHistory[unitId].push(CustodyRecord(previousHolder, msg.sender, UnitStatus.Received, uint64(block.timestamp)));
            emit CustodyChanged(unitId, previousHolder, msg.sender, UnitStatus.Received, uint64(block.timestamp));
            emit TransferAccepted(unitId, msg.sender);
        }
    }

    // --- Dispensing (Pharmacy holder only) ---

    function dispense(bytes32 unitId, bytes32 prescriptionHash) external onlyRole(Role.Pharmacy) returns (bool) {
        Unit storage u = units[unitId];

        if (u.status == UnitStatus.None) {
            // Unknown unit presented at dispense: cannot flag state that does
            // not exist, so this is the one suspicious case with no state
            // change at all - only the event is evidence.
            emit SuspiciousActivity(unitId, msg.sender, SuspiciousReason.UnknownUnit);
            return false;
        }
        if (u.status == UnitStatus.Dispensed) {
            _flag(unitId, msg.sender, SuspiciousReason.AlreadyDispensed);
            return false;
        }
        if (u.status == UnitStatus.Flagged) {
            emit SuspiciousActivity(unitId, msg.sender, SuspiciousReason.AlreadyDispensed);
            return false;
        }
        if (u.currentHolder != msg.sender) {
            _flag(unitId, msg.sender, SuspiciousReason.NotHolder);
            return false;
        }
        if (batches[u.batchId].recalled) {
            _flag(unitId, msg.sender, SuspiciousReason.RecalledBatch);
            return false;
        }

        u.status = UnitStatus.Dispensed;
        custodyHistory[unitId].push(CustodyRecord(msg.sender, address(0), UnitStatus.Dispensed, uint64(block.timestamp)));
        emit CustodyChanged(unitId, msg.sender, address(0), UnitStatus.Dispensed, uint64(block.timestamp));
        emit Dispensed(unitId, msg.sender, prescriptionHash);
        return true;
    }

    // --- Internal helpers ---

    function _flag(bytes32 unitId, address actor, SuspiciousReason reason) private {
        Unit storage u = units[unitId];
        u.status = UnitStatus.Flagged;
        custodyHistory[unitId].push(CustodyRecord(u.currentHolder, u.currentHolder, UnitStatus.Flagged, uint64(block.timestamp)));
        emit CustodyChanged(unitId, u.currentHolder, u.currentHolder, UnitStatus.Flagged, uint64(block.timestamp));
        emit SuspiciousActivity(unitId, actor, reason);
    }

    function _nextRole(Role role_) private pure returns (Role) {
        if (role_ == Role.Manufacturer) return Role.Distributor;
        if (role_ == Role.Distributor) return Role.Wholesaler;
        if (role_ == Role.Wholesaler) return Role.Pharmacy;
        revert NoNextRole();
    }

    // --- Views ---

    /// @notice Returns a verification snapshot for a unit.
    /// @dev LIMITATION: this is a `view` function, so it cannot write to
    /// storage - it cannot itself flag a counterfeit or record that a check
    /// happened. If a patient scans an unopened pack and this returns
    /// `Dispensed` or `Flagged`, that pack is almost certainly a clone (the
    /// genuine unit was already dispensed, or an anomaly was already caught
    /// on-chain), but the contract cannot act on a mere lookup - only
    /// dispense()/initiateTransfer()/acceptTransfer() detect and record
    /// anomalies. The frontend MUST present `Dispensed` and `Flagged` verify()
    /// results as counterfeit warnings to the patient; see README.md.
    function verify(bytes32 unitId)
        external
        view
        returns (
            bool exists,
            UnitStatus status,
            Role currentHolderRole,
            bytes32 batchId,
            bytes32 batchDataHash,
            uint64 batchExpiry,
            bool recalled,
            address manufacturer,
            uint256 historyLength
        )
    {
        Unit storage u = units[unitId];
        exists = u.status != UnitStatus.None;
        status = u.status;
        currentHolderRole = participants[u.currentHolder].role;
        batchId = u.batchId;
        Batch storage b = batches[u.batchId];
        batchDataHash = b.dataHash;
        batchExpiry = b.expiryDate;
        recalled = b.recalled;
        manufacturer = b.manufacturer;
        historyLength = custodyHistory[unitId].length;
    }

    function getHistory(bytes32 unitId) external view returns (CustodyRecord[] memory) {
        return custodyHistory[unitId];
    }
}
