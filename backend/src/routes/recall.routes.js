const express = require("express");
const pool = require("../db/pool");
const { createLedgerEvent } = require("../services/ledger.service");

const router = express.Router();

router.post("/block/:batchId", async (req, res) => {
  try {
    const { batchId } = req.params;
    const { reason, responsible } = req.body;

    const batchResult = await pool.query(
      `
      SELECT
        b.*,
        m.name AS medicine_name,
        h.name AS unit_name,
        h.district
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

    await pool.query(
      "UPDATE batches SET status = 'BLOCKED' WHERE id = $1",
      [batchId]
    );

    const batch = batchResult.rows[0];

    const block = await createLedgerEvent({
      eventType: "RECALL_BLOCK_BATCH",
      entityType: "batch",
      entityId: batchId,
      payload: {
        batchId,
        batchNumber: batch.batch_number,
        medicineName: batch.medicine_name,
        reason,
        responsible,
        currentUnit: batch.unit_name,
        district: batch.district,
        previousStatus: batch.status,
        newStatus: "BLOCKED"
      }
    });

    res.json({
      message: "Lote bloqueado para recall ou investigação sanitária.",
      batchId,
      status: "BLOCKED",
      blockchainBlock: block
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao bloquear lote.",
      details: error.message
    });
  }
});

router.post("/release/:batchId", async (req, res) => {
  try {
    const { batchId } = req.params;
    const { reason, responsible } = req.body;

    await pool.query(
      "UPDATE batches SET status = 'ACTIVE' WHERE id = $1",
      [batchId]
    );

    const block = await createLedgerEvent({
      eventType: "RECALL_RELEASE_BATCH",
      entityType: "batch",
      entityId: batchId,
      payload: {
        batchId,
        reason,
        responsible,
        newStatus: "ACTIVE"
      }
    });

    res.json({
      message: "Lote liberado novamente.",
      batchId,
      status: "ACTIVE",
      blockchainBlock: block
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao liberar lote.",
      details: error.message
    });
  }
});

module.exports = router;
