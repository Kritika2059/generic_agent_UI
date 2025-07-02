const path = require("path");
const dotenvPath = path.resolve(__dirname, ".env");
require("dotenv").config({ path: dotenvPath });

const { Pool } = require("pg");
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
