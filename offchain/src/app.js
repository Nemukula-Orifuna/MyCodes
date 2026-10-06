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

  // This is a local development service (the frontend dev server and this
  // API run on different localhost ports), not an internet-facing one, so
  // reflecting the request origin is the standard dev-CORS pattern rather
  // than a security concern - without it, a browser blocks every request
  // from the Vite dev server's origin before it reaches any route below.
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });

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
