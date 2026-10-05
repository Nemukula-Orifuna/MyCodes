// caliper/scripts/make-contract-json.js - convert the Truffle artifact into Caliper's {name, abi, bytecode, gas}
const fs = require("fs"); const path = require("path");
const art = require(path.join(__dirname, "../../client/src/contracts/PharmaTrace.json"));
fs.mkdirSync(path.join(__dirname, "../contracts"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "../contracts/pharmatrace.json"),
  JSON.stringify({ name: "PharmaTrace", abi: art.abi, bytecode: art.bytecode, gas: 3500000 }, null, 2));
console.log("wrote caliper/contracts/pharmatrace.json");
