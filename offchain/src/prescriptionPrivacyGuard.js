// Patient identity must never be stored anywhere in this system (POPIA
// rule from the spec) - not on-chain, and not in the off-chain prescription
// record either. dispense() only ever sees a hash of the prescription
// reference. This guard is a defense-in-depth check at the API boundary: it
// rejects a prescription payload that contains a field name commonly used
// for patient-identifying data, recursively through nested objects/arrays.
const DENYLISTED_KEY_PATTERN = /patient|^name$|surname|idnumber|id_number|dob|dateofbirth|date_of_birth|contact|phone|cell|email|address/i;

function findDenylistedKey(value, pathPrefix = "") {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const found = findDenylistedKey(value[i], `${pathPrefix}[${i}]`);
      if (found) return found;
    }
    return null;
  }
  if (value !== null && typeof value === "object") {
    for (const key of Object.keys(value)) {
      if (DENYLISTED_KEY_PATTERN.test(key)) {
        return pathPrefix ? `${pathPrefix}.${key}` : key;
      }
      const found = findDenylistedKey(value[key], pathPrefix ? `${pathPrefix}.${key}` : key);
      if (found) return found;
    }
  }
  return null;
}

module.exports = { findDenylistedKey };
