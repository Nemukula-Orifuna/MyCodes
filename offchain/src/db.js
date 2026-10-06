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
  `);

  return db;
}

module.exports = { openDb };
