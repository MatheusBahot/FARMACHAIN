const { Pool } = require("pg");
require("dotenv").config();

let poolConfig;

if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
  poolConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  };
}

const pool = new Pool(poolConfig);

module.exports = pool;
