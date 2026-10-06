const express = require("express");
const { openDb } = require("./db");
const participantsRouter = require("./routes/participants");
const batchesRouter = require("./routes/batches");
const prescriptionsRouter = require("./routes/prescriptions");

/// Builds the Express app against the given SQLite db path (or ":memory:"
/// for tests). This service never talks to the blockchain - it only stores
/// human-readable records and their keccak256 hash, for a caller (the
/// frontend, or a test) to compare against what is anchored on-chain. It is
/// never the source of truth for custody.
function createApp(dbPath) {
  const db = openDb(dbPath);
  const app = express();
  app.use(express.json());

  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api/participants", participantsRouter(db));
  app.use("/api/batches", batchesRouter(db));
  app.use("/api/prescriptions", prescriptionsRouter(db));

  app.use((req, res) => res.status(404).json({ error: "not found" }));
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(500).json({ error: "internal error", detail: err.message });
  });

  return { app, db };
}

module.exports = { createApp };
