const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

router.get("/db", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        NOW() AS server_time,
        current_database() AS database,
        current_user AS user
    `);

    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    res.json({
      ok: true,
      connection: result.rows[0],
      tables: tables.rows.map((row) => row.table_name)
    });
  } catch (error) {
    console.error("ERRO EM /api/health/db:", error);

    res.status(500).json({
      ok: false,
      error: error.message || String(error),
      code: error.code || null,
      detail: error.detail || null,
      hint: error.hint || null
    });
  }
});

module.exports = router;
