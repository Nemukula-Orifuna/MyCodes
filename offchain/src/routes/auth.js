const express = require("express");

// A fixed demo credential, not a real identity system - the system's actual
// security is the wallet connection and the smart contract's role checks.
// This gate only exists so a presenter has a familiar "log in" step before
// reaching the wallet-connect screen.
const DEMO_USERNAME = process.env.DEMO_LOGIN_USERNAME || "admin";
const DEMO_PASSWORD = process.env.DEMO_LOGIN_PASSWORD || "pharma2026";

function authRouter() {
  const router = express.Router();

  router.post("/login", (req, res) => {
    const { username, password } = req.body || {};
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "username and password are required" });
    }
    if (username !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
      return res.status(401).json({ error: "invalid username or password" });
    }
    return res.json({ ok: true });
  });

  return router;
}

module.exports = authRouter;
