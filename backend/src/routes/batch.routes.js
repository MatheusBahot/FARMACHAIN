const express = require("express");
const pool = require("../db/pool");
const { createLedgerEvent } = require("../services/ledger.service");
const { generateTraceQrCode } = require("../services/qr.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query(
    `
    SELECT
      b.*,
      m.name AS medicine_name,
      m.active_ingredient,
      h.name AS current_unit_name,
      h.district
    FROM batches b
    JOIN medicines m ON m.id = b.medicine_id
    LEFT JOIN health_units h ON h.id = b.current_unit_id
    ORDER BY b.created_at DESC
    `
  );

  res.json(result.rows);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `
    SELECT
      b.*,
      m.name AS medicine_name,
      m.active_ingredient,
      m.concentration,
      m.pharmaceutical_form,
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
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Lote não encontrado." });
  }

  const qr = await generateTraceQrCode(id);

  res.json({
    batch: result.rows[0],
    qr
  });
});

router.post("/", async (req, res) => {
  try {
    const {
      medicineId,
      batchNumber,
      manufacturer,
      distributor,
      manufacturingDate,
      expirationDate,
      quantityInitial,
      currentUnitId
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO batches
      (
        medicine_id,
        batch_number,
        manufacturer,
        distributor,
        manufacturing_date,
        expiration_date,
        quantity_initial,
        quantity_current,
        current_unit_id
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$7,$8)
      RETURNING *
      `,
      [
        medicineId,
        batchNumber,
        manufacturer,
        distributor,
        manufacturingDate,
        expirationDate,
        Number(quantityInitial),
        currentUnitId
      ]
    );

    const batch = result.rows[0];

    const block = await createLedgerEvent({
      eventType: "REGISTER_BATCH",
      entityType: "batch",
      entityId: batch.id,
      payload: batch
    });

    res.status(201).json({
      batch,
      blockchainBlock: block
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao cadastrar lote.",
      details: error.message
    });
  }
});

module.exports = router;
