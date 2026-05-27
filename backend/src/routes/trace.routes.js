const express = require("express");
const pool = require("../db/pool");
const { getLedgerByEntity, validateLedger } = require("../services/ledger.service");
const { generateTraceQrCode } = require("../services/qr.service");

const router = express.Router();

router.get("/batch/:batchId", async (req, res) => {
  try {
    const { batchId } = req.params;

    const batchResult = await pool.query(
      `
      SELECT
        b.*,
        m.name AS medicine_name,
        m.active_ingredient,
        m.concentration,
        m.pharmaceutical_form,
        m.therapeutic_class,
        m.rename_item,
        m.remume_item,
        h.name AS current_unit_name,
        h.district,
        h.address,
        h.latitude,
        h.longitude
      FROM batches b
      JOIN medicines m ON m.id = b.medicine_id
      LEFT JOIN health_units h ON h.id = b.current_unit_id
      WHERE b.id = $1
      `,
      [batchId]
    );

    if (batchResult.rows.length === 0) {
      return res.status(404).json({
        error: "Lote não encontrado."
      });
    }

    const batch = batchResult.rows[0];

    const movementsResult = await pool.query(
      `
      SELECT *
      FROM stock_movements
      WHERE batch_id = $1
      ORDER BY created_at ASC
      `,
      [batchId]
    );

    const dispensationsResult = await pool.query(
      `
      SELECT
        d.id,
        d.patient_hash,
        d.patient_encrypted_cpf,
        d.prescription_hash,
        d.quantity,
        d.pharmacist_name,
        d.pharmacist_crf,
        d.latitude,
        d.longitude,
        d.created_at,
        h.name AS health_unit_name,
        h.district,
        h.address
      FROM dispensations d
      JOIN health_units h ON h.id = d.health_unit_id
      WHERE d.batch_id = $1
      ORDER BY d.created_at ASC
      `,
      [batchId]
    );

    const ledger = await getLedgerByEntity(batchId);
    const validation = await validateLedger();
    const qr = await generateTraceQrCode(batchId);

    res.json({
      batch,
      movements: movementsResult.rows,
      dispensations: dispensationsResult.rows,
      blockchain: {
        valid: validation.valid,
        validation,
        events: ledger
      },
      qr
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao rastrear lote.",
      details: error.message
    });
  }
});

router.get("/validate-ledger", async (req, res) => {
  const validation = await validateLedger();
  res.json(validation);
});

module.exports = router;
