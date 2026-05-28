const express = require("express");
const pool = require("../db/pool");
const { createLedgerEvent } = require("../services/ledger.service");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        p.*,
        b.batch_number,
        m.name AS medicine_name,
        m.active_ingredient
      FROM pharmacovigilance_reports p
      JOIN batches b ON b.id = p.batch_id
      JOIN medicines m ON m.id = b.medicine_id
      ORDER BY p.created_at DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao listar notificações.",
      details: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      batchId,
      dispensationId,
      patientHash,
      severity,
      eventDescription
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO pharmacovigilance_reports
      (
        batch_id,
        dispensation_id,
        patient_hash,
        severity,
        event_description,
        status
      )
      VALUES ($1, $2, $3, $4, $5, 'UNDER_REVIEW')
      RETURNING *
      `,
      [
        batchId,
        dispensationId || null,
        patientHash || null,
        severity,
        eventDescription
      ]
    );

    const report = result.rows[0];

    const block = await createLedgerEvent({
      eventType: "REPORT_ADVERSE_EVENT",
      entityType: "batch",
      entityId: batchId,
      payload: {
        reportId: report.id,
        batchId,
        dispensationId,
        patientHash,
        severity,
        eventDescription,
        status: report.status
      }
    });

    res.status(201).json({
      report,
      blockchainBlock: block
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao registrar farmacovigilância.",
      details: error.message
    });
  }
});

module.exports = router;
