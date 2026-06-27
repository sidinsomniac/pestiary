// Helper: turn a downloaded Google service-account JSON key into the
// GOOGLE_* lines for .env.local (with the private key escaped to one line).
//
// Usage:
//   node scripts/sheets-env-from-json.mjs "C:/Users/you/Downloads/your-key.json"
//
// Then copy the printed GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY
// lines into .env.local. (GOOGLE_SHEETS_ID comes from the Sheet URL — see below.)

import { readFileSync } from "fs";

const path = process.argv[2];
if (!path) {
  console.error('Pass the path to the JSON key file, e.g.\n  node scripts/sheets-env-from-json.mjs "C:/Users/you/Downloads/key.json"');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(path, "utf-8"));
} catch (e) {
  console.error(`Could not read/parse JSON at ${path}: ${e.message}`);
  process.exit(1);
}

if (!data.client_email || !data.private_key) {
  console.error("That JSON does not look like a service-account key (missing client_email / private_key).");
  process.exit(1);
}

// Escape real newlines to literal \n so the value fits on one line in .env.local.
const escapedKey = data.private_key.replace(/\n/g, "\\n");

console.log("\n# --- paste these two lines into .env.local ---\n");
console.log(`GOOGLE_SERVICE_ACCOUNT_EMAIL=${data.client_email}`);
console.log(`GOOGLE_PRIVATE_KEY="${escapedKey}"`);
console.log("\n# GOOGLE_SHEETS_ID is the part of your Sheet URL between /d/ and /edit");
