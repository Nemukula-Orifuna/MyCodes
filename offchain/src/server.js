const path = require("path");
const { createApp } = require("./app");

const PORT = process.env.PORT || 4000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "data", "offchain.sqlite");

const { app } = createApp(DB_PATH);

app.listen(PORT, () => {
  console.log(`Off-chain service listening on port ${PORT} (db: ${DB_PATH})`);
});
