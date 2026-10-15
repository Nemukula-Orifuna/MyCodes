const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

/// Opens (and migrates) the SQLite database at `dbPath`. Pass ":memory:" for
/// tests so each test run starts from a clean, isolated database.
function openDb(dbPath) {
  if (dbPath !== ":memory:") {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS participants (
      address TEXT PRIMARY KEY,
      profile_json TEXT NOT NULL,
      profile_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS batches (
      batch_id TEXT PRIMARY KEY,
      details_json TEXT NOT NULL,
      data_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS prescriptions (
      prescription_ref TEXT PRIMARY KEY,
      details_json TEXT NOT NULL,
      prescription_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    -- One row per unit per supply-chain stage it has passed through
    -- (Manufacturer, Distributor, Wholesaler, Pharmacy, Dispensed). Each
    -- row is its own copy of the batch record as held at that checkpoint,
    -- independent of every other checkpoint's copy and of the canonical
    -- "batches" row - so a direct edit to one checkpoint's copy (see the
    -- tamper endpoint) cannot silently affect any other checkpoint, which
    -- is what lets a mismatch be localised to a single stage.
    CREATE TABLE IF NOT EXISTS batch_checkpoints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unit_id TEXT NOT NULL,
      batch_id TEXT NOT NULL,
      stage TEXT NOT NULL,
      actor TEXT,
      snapshot_json TEXT NOT NULL,
      record_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_batch_checkpoints_unit ON batch_checkpoints(unit_id);

    -- Records every direct edit made via the dev-only tamper endpoint, so a
    -- tampering demo can also show who/what/when changed off the back of
    -- the application (distinct from the blockchain's own custody log).
    CREATE TABLE IF NOT EXISTS checkpoint_audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      checkpoint_id INTEGER NOT NULL,
      unit_id TEXT NOT NULL,
      stage TEXT NOT NULL,
      field TEXT NOT NULL,
      old_value TEXT,
      new_value TEXT,
      changed_at INTEGER NOT NULL
    );
  `);

  return db;
}

module.exports = { openDb };
