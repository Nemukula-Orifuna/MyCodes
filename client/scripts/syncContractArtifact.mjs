// Copies the Truffle-compiled contract artifact (ABI + per-network deployed
// address) into src/contracts/, where Vite can safely bundle it. Importing
// it directly from ../../build/contracts across the Vite project boundary
// works for a production build but is unreliable in `vite dev`, whose dev
// server restricts serving files outside its project root - so this copy
// step runs before both `dev` and `build` instead.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = join(__dirname, "..", "..", "build", "contracts", "PharmaSupplyChain.json");
const destDir = join(__dirname, "..", "src", "contracts");
const dest = join(destDir, "PharmaSupplyChain.json");

if (!existsSync(source)) {
  console.error(
    `Contract artifact not found at ${source}.\n` +
      `Run "npx truffle compile && npx truffle migrate --network development" from the repo root first.`
  );
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(source, dest);
console.log(`Synced contract artifact: ${source} -> ${dest}`);
