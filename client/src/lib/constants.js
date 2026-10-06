// Mirrors the Role and UnitStatus enums in PharmaSupplyChain.sol exactly -
// Solidity enums are returned to Web3.js as plain integers, so these maps
// are how the UI turns them back into labels.
export const ROLE_NAMES = ["None", "Regulator", "Manufacturer", "Distributor", "Wholesaler", "Pharmacy"];

export const ROLE = {
  NONE: 0,
  REGULATOR: 1,
  MANUFACTURER: 2,
  DISTRIBUTOR: 3,
  WHOLESALER: 4,
  PHARMACY: 5,
};

export const UNIT_STATUS_NAMES = ["None", "Manufactured", "InTransit", "Received", "Dispensed", "Flagged"];

export const UNIT_STATUS = {
  NONE: 0,
  MANUFACTURED: 1,
  IN_TRANSIT: 2,
  RECEIVED: 3,
  DISPENSED: 4,
  FLAGGED: 5,
};

export const SUSPICIOUS_REASON_NAMES = ["NotHolder", "RecalledBatch", "AlreadyDispensed", "UnknownUnit"];

// The custody order the contract enforces: Manufacturer -> Distributor ->
// Wholesaler -> Pharmacy -> dispensed to patient.
export const NEXT_ROLE = {
  [ROLE.MANUFACTURER]: ROLE.DISTRIBUTOR,
  [ROLE.DISTRIBUTOR]: ROLE.WHOLESALER,
  [ROLE.WHOLESALER]: ROLE.PHARMACY,
};

export const EXPECTED_CHAIN_ID = 1337;

export const ROLES_WITH_DASHBOARDS = [ROLE.REGULATOR, ROLE.MANUFACTURER, ROLE.DISTRIBUTOR, ROLE.WHOLESALER, ROLE.PHARMACY];
