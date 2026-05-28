const express = require("express");
const pool = require("../db/pool");
const { seedDemoData } = require("../services/seed.service");

const router = express.Router();

router.post("/reset", async (req, res) => {
  try {
    await pool.query("DELETE FROM pharmacovigilance_reports");
    await pool.query("DELETE FROM dispensations");
    await pool.query("DELETE FROM stock_movements");
    await pool.query("DELETE FROM blockchain_ledger");
    await pool.query("DELETE FROM batches");
    await pool.query("DELETE FROM medicines");
    await pool.query("DELETE FROM health_units");

    const data = await seedDemoData();

    res.json({
      message: "Demonstração FarmaChain recriada com sucesso.",
      data
    });
  } catch (error) {
    console.error("ERRO COMPLETO EM /api/demo/reset:", error);

    res.status(500).json({
      error: "Erro ao recriar demonstração.",
      details: error.message || String(error),
      code: error.code || null,
      table: error.table || null,
      constraint: error.constraint || null,
      hint: error.hint || null,
      suggestion:
        "Verifique se o banco foi inicializado com npm run init-db, se DATABASE_URL está correta e se as tabelas existem no PostgreSQL."
    });
  }
});

router.get("/summary", async (req, res) => {
  try {
    const units = await pool.query("SELECT COUNT(*) FROM health_units");
    const medicines = await pool.query("SELECT COUNT(*) FROM medicines");
    const batches = await pool.query("SELECT COUNT(*) FROM batches");
    const dispensations = await pool.query("SELECT COUNT(*) FROM dispensations");
    const ledger = await pool.query("SELECT COUNT(*) FROM blockchain_ledger");

    res.json({
      units: Number(units.rows[0].count),
      medicines: Number(medicines.rows[0].count),
      batches: Number(batches.rows[0].count),
      dispensations: Number(dispensations.rows[0].count),
      ledgerBlocks: Number(ledger.rows[0].count)
    });
  } catch (error) {
    console.error("ERRO COMPLETO EM /api/demo/summary:", error);

    res.status(500).json({
      error: "Erro ao gerar resumo.",
      details: error.message || String(error),
      code: error.code || null,
      table: error.table || null,
      hint: error.hint || null
    });
  }
});

module.exports = router;
