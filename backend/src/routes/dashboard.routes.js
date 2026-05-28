const express = require("express");
const pool = require("../db/pool");
const { validateLedger } = require("../services/ledger.service");

const router = express.Router();

router.get("/executive", async (req, res) => {
  try {
    const medicines = await pool.query("SELECT COUNT(*) FROM medicines");
    const batches = await pool.query("SELECT COUNT(*) FROM batches");
    const activeBatches = await pool.query(
      "SELECT COUNT(*) FROM batches WHERE status = 'ACTIVE'"
    );
    const blockedBatches = await pool.query(
      "SELECT COUNT(*) FROM batches WHERE status = 'BLOCKED'"
    );
    const dispensations = await pool.query("SELECT COUNT(*) FROM dispensations");
    const reports = await pool.query("SELECT COUNT(*) FROM pharmacovigilance_reports");
    const blocks = await pool.query("SELECT COUNT(*) FROM blockchain_ledger");

    const expiring = await pool.query(
      `
      SELECT COUNT(*)
      FROM batches
      WHERE expiration_date <= CURRENT_DATE + INTERVAL '90 days'
        AND status = 'ACTIVE'
      `
    );

    const districts = await pool.query(
      `
      SELECT
        h.district,
        COUNT(DISTINCT h.id) AS units,
        COUNT(DISTINCT b.id) AS batches,
        COALESCE(SUM(b.quantity_current), 0) AS stock
      FROM health_units h
      LEFT JOIN batches b ON b.current_unit_id = h.id
      GROUP BY h.district
      ORDER BY h.district
      `
    );

    const topMedicines = await pool.query(
      `
      SELECT
        m.name,
        COALESCE(SUM(d.quantity), 0) AS total_dispensed
      FROM medicines m
      LEFT JOIN batches b ON b.medicine_id = m.id
      LEFT JOIN dispensations d ON d.batch_id = b.id
      GROUP BY m.name
      ORDER BY total_dispensed DESC
      LIMIT 5
      `
    );

    const ledgerValidation = await validateLedger();

    res.json({
      cards: {
        medicines: Number(medicines.rows[0].count),
        batches: Number(batches.rows[0].count),
        activeBatches: Number(activeBatches.rows[0].count),
        blockedBatches: Number(blockedBatches.rows[0].count),
        expiringBatches: Number(expiring.rows[0].count),
        dispensations: Number(dispensations.rows[0].count),
        pharmacovigilanceReports: Number(reports.rows[0].count),
        blockchainBlocks: Number(blocks.rows[0].count)
      },
      districts: districts.rows,
      topMedicines: topMedicines.rows,
      blockchain: ledgerValidation
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao carregar dashboard executivo.",
      details: error.message
    });
  }
});

module.exports = router;
