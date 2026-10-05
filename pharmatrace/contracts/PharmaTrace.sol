// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol"; // OZ 4.9.6 (pragma ^0.8.0)

/// @title PharmaTrace - blockchain-based authentication of pharmaceutical packs
/// @notice Stores ONLY GS1 identifiers' hashes, keccak256 record hashes, custody history and status.
///         Human-readable product data stays off-chain; no personal/patient data is ever stored.
contract PharmaTrace is AccessControl {
    // ------------------------------------------------------------------ roles
    // DEFAULT_ADMIN_ROLE (from AccessControl) = regulator/admin who authorises actors.
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE  = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant WHOLESALER_ROLE   = keccak256("WHOLESALER_ROLE");
    bytes32 public constant PHARMACY_ROLE     = keccak256("PHARMACY_ROLE");
    bytes32 public constant INSPECTOR_ROLE    = keccak256("INSPECTOR_ROLE");

    // ------------------------------------------------------------------ types
    enum Stage  { Manufacturer, Distributor, Wholesaler, Pharmacy, Dispensed }
    enum Status { NotRegistered, Authentic, HashMismatch, Expired, AlreadyDispensed, Flagged }

    struct Custody {
        address from;     // address(0) for the registration entry
        address to;       // address(0) for the dispensing entry
        Stage   stage;    // stage reached by this movement
        uint64  timestamp; // block.timestamp
    }

    struct Product {
        bytes32 recordHash;      // keccak256 of the canonical off-chain record
        bytes32 batchKey;        // keccak256(abi.encode(gtin, batchNo)) - supports batch recalls
        address manufacturer;
        address currentHolder;
        uint64  expiry;          // unix seconds (end of expiry day, UTC)
        uint64  registeredAt;
        uint32  suspiciousScans; // scans after dispensing / at a non-holder pharmacy
        Stage   stage;
        bool    exists;
        bool    flagged;
    }

    // ------------------------------------------------------------------ storage
    mapping(bytes32 => Product)   private products;
    mapping(bytes32 => Custody[]) private custody;
    mapping(bytes32 => bool)      public  batchRegistered;

    // ------------------------------------------------------------------ events
    event ProductRegistered(bytes32 indexed productKey, string gtin, string batchNo, string serial,
                            uint64 expiry, bytes32 recordHash, address indexed manufacturer);
    event CustodyTransferred(bytes32 indexed productKey, address indexed from, address indexed to,
                             Stage stage, uint64 timestamp);
    event ProductDispensed(bytes32 indexed productKey, address indexed pharmacy, uint64 timestamp);
    event ProductScanned(bytes32 indexed productKey, address indexed scanner, Status status, uint64 timestamp);
    event CloneSuspected(bytes32 indexed productKey, address indexed scanner, uint32 suspiciousScans, uint64 timestamp);
    event ExpiredProductFlagged(bytes32 indexed productKey, address indexed reporter, uint64 expiry, uint64 timestamp);
    event ProductFlagged(bytes32 indexed productKey, address indexed inspector, string reason);
    // RoleGranted / RoleRevoked are emitted by AccessControl.

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); // deployer = regulator/admin
    }

    // ------------------------------------------------------------------ pure helpers
    /// @notice Unique unit identifier = GTIN + serial (GS1 AI 01 + AI 21).
    function productKeyOf(string memory gtin, string memory serial) public pure returns (bytes32) {
        return keccak256(abi.encode(gtin, serial));
    }

    /// @notice Same as web3.utils.soliditySha3({type:'string', value: canonicalJson}).
    function hashRecord(string calldata canonicalJson) external pure returns (bytes32) {
        return keccak256(bytes(canonicalJson));
    }

    // ------------------------------------------------------------------ manufacturer
    function registerProduct(
        string calldata gtin,
        string calldata batchNo,
        string calldata serial,
        uint64 expiry,
        bytes32 recordHash
    ) external onlyRole(MANUFACTURER_ROLE) returns (bytes32 key) {
        require(_isGtin14(gtin), "GTIN must be 14 digits");
        require(bytes(batchNo).length > 0 && bytes(batchNo).length <= 20, "Invalid batch number");
        require(bytes(serial).length > 0 && bytes(serial).length <= 20, "Invalid serial number");
        require(recordHash != bytes32(0), "Empty record hash");
        require(expiry > block.timestamp, "Already expired");

        key = productKeyOf(gtin, serial);
        require(!products[key].exists, "Duplicate identifier");

        bytes32 bKey = keccak256(abi.encode(gtin, batchNo));
        uint64 nowTs = uint64(block.timestamp);
        products[key] = Product({
            recordHash: recordHash, batchKey: bKey, manufacturer: msg.sender, currentHolder: msg.sender,
            expiry: expiry, registeredAt: nowTs, suspiciousScans: 0, stage: Stage.Manufacturer,
            exists: true, flagged: false
        });
        batchRegistered[bKey] = true;
        custody[key].push(Custody(address(0), msg.sender, Stage.Manufacturer, nowTs));

        emit ProductRegistered(key, gtin, batchNo, serial, expiry, recordHash, msg.sender);
    }

    // ------------------------------------------------------------------ custody
    /// @notice Only the current holder may transfer, and only to the NEXT stage's role holder.
    function transferCustody(string calldata gtin, string calldata serial, address to) external {
        bytes32 key = productKeyOf(gtin, serial);
        Product storage p = products[key];
        require(p.exists, "Not registered");
        require(!p.flagged, "Product flagged");
        require(p.currentHolder == msg.sender, "Caller is not current holder");
        require(p.stage < Stage.Pharmacy, "No further transfer");
        require(hasRole(_roleForStage(p.stage), msg.sender), "Holder role revoked");
        require(block.timestamp < p.expiry, "Product expired");

        Stage next = Stage(uint8(p.stage) + 1);
        require(hasRole(_roleForStage(next), to), "Recipient lacks role for next stage");

        p.currentHolder = to;
        p.stage = next;
        uint64 nowTs = uint64(block.timestamp);
        custody[key].push(Custody(msg.sender, to, next, nowTs));
        emit CustodyTransferred(key, msg.sender, to, next, nowTs);
    }

    // ------------------------------------------------------------------ pharmacy
    function dispense(string calldata gtin, string calldata serial) external onlyRole(PHARMACY_ROLE) {
        bytes32 key = productKeyOf(gtin, serial);
        Product storage p = products[key];
        require(p.exists, "Not registered");
        require(!p.flagged, "Product flagged");
        require(p.currentHolder == msg.sender, "Caller is not current holder");
        require(p.stage == Stage.Pharmacy, "Not at pharmacy stage");
        require(block.timestamp < p.expiry, "Product expired");

        p.stage = Stage.Dispensed;
        uint64 nowTs = uint64(block.timestamp);
        custody[key].push(Custody(msg.sender, address(0), Stage.Dispensed, nowTs));
        emit ProductDispensed(key, msg.sender, nowTs);
    }

    // ------------------------------------------------------------------ verification
    /// @notice Read-only authenticity check (eth_call). No gas cost to the caller.
    function verifyProduct(string calldata gtin, string calldata serial, bytes32 offChainHash)
        external view
        returns (Status status, Stage stage, address currentHolder, uint64 expiry, Custody[] memory history)
    {
        bytes32 key = productKeyOf(gtin, serial);
        Product storage p = products[key];
        return (_evaluate(p, offChainHash), p.stage, p.currentHolder, p.expiry, custody[key]);
    }

    /// @notice State-changing scan: records the result, flags clones and expired packs, emits events.
    function recordScan(string calldata gtin, string calldata serial, bytes32 offChainHash)
        external returns (Status status)
    {
        require(_isActor(msg.sender), "Caller is not an authorised actor");
        bytes32 key = productKeyOf(gtin, serial);
        Product storage p = products[key];
        status = _evaluate(p, offChainHash);
        uint64 nowTs = uint64(block.timestamp);

        if (p.exists) {
            // Cloned-QR defence: any scan after dispensing, or a scan by a pharmacy that is not
            // the current holder once the pack has reached the final (pharmacy) stage.
            bool otherPharmacy = p.stage == Stage.Pharmacy && msg.sender != p.currentHolder
                                 && hasRole(PHARMACY_ROLE, msg.sender);
            if (p.stage == Stage.Dispensed || otherPharmacy) {
                p.suspiciousScans += 1;
                p.flagged = true;
                status = Status.Flagged;
                emit CloneSuspected(key, msg.sender, p.suspiciousScans, nowTs);
            } else if (status == Status.Expired) {
                emit ExpiredProductFlagged(key, msg.sender, p.expiry, nowTs);
            }
        }
        emit ProductScanned(key, msg.sender, status, nowTs);
    }

    // ------------------------------------------------------------------ inspector
    function flagProduct(string calldata gtin, string calldata serial, string calldata reason)
        external onlyRole(INSPECTOR_ROLE)
    {
        bytes32 key = productKeyOf(gtin, serial);
        require(products[key].exists, "Not registered");
        products[key].flagged = true;
        emit ProductFlagged(key, msg.sender, reason);
    }

    function getHistory(string calldata gtin, string calldata serial) external view returns (Custody[] memory) {
        return custody[productKeyOf(gtin, serial)];
    }

    function getProduct(string calldata gtin, string calldata serial) external view returns (Product memory) {
        return products[productKeyOf(gtin, serial)];
    }

    // ------------------------------------------------------------------ internal
    function _evaluate(Product storage p, bytes32 offChainHash) internal view returns (Status) {
        if (!p.exists) return Status.NotRegistered;
        if (p.flagged) return Status.Flagged;
        if (offChainHash != p.recordHash) return Status.HashMismatch;
        if (p.stage == Stage.Dispensed) return Status.AlreadyDispensed;
        if (block.timestamp >= p.expiry) return Status.Expired;
        return Status.Authentic;
    }

    function _roleForStage(Stage s) internal pure returns (bytes32) {
        if (s == Stage.Manufacturer) return MANUFACTURER_ROLE;
        if (s == Stage.Distributor)  return DISTRIBUTOR_ROLE;
        if (s == Stage.Wholesaler)   return WHOLESALER_ROLE;
        if (s == Stage.Pharmacy)     return PHARMACY_ROLE;
        revert("No role for stage");
    }

    function _isActor(address a) internal view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, a) || hasRole(MANUFACTURER_ROLE, a) || hasRole(DISTRIBUTOR_ROLE, a)
            || hasRole(WHOLESALER_ROLE, a) || hasRole(PHARMACY_ROLE, a) || hasRole(INSPECTOR_ROLE, a);
    }

    function _isGtin14(string calldata g) internal pure returns (bool) {
        bytes calldata b = bytes(g);
        if (b.length != 14) return false;
        for (uint256 i = 0; i < 14; i++) {
            if (b[i] < 0x30 || b[i] > 0x39) return false;
        }
        return true;
    }
}
