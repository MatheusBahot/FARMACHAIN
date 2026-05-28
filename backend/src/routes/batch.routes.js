const express = require("express");
const pool = require("../db/pool");
const { createLedgerEvent } = require("../services/ledger.service");
const { generateTraceQrCode } = require("../services/qr.service");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        b.*,
        m.name AS medicine_name,
        m.active_ingredient,
        m.concentration,
        m.pharmaceutical_form,
        m.storage_temperature,
        h.name AS current_unit_name,
        h.district,
        h.address,
        h.latitude,
        h.longitude
      FROM batches b
      JOIN medicines m ON m.id = b.medicine_id
      LEFT JOIN health_units h ON h.id = b.current_unit_id
      ORDER BY b.created_at DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao listar lotes.",
      details: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        b.*,
        m.name AS medicine_name,
        m.active_ingredient,
        m.concentration,
        m.pharmaceutical_form,
        m.therapeutic_class,
        m.storage_temperature,
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
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Lote não encontrado."
      });
    }

    const qr = await generateTraceQrCode(id);

    res.json({
      batch: result.rows[0],
      qr
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar lote.",
      details: error.message
    });
  }
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

    if (
      !medicineId ||
      !batchNumber ||
      !manufacturer ||
      !distributor ||
      !manufacturingDate ||
      !expirationDate ||
      !quantityInitial ||
      !currentUnitId
    ) {
      return res.status(400).json({
        error: "Campos obrigatórios ausentes para cadastro do lote."
      });
    }

    const medicineResult = await pool.query(
      "SELECT * FROM medicines WHERE id = $1",
      [medicineId]
    );

    if (medicineResult.rows.length === 0) {
      return res.status(404).json({
        error: "Medicamento não encontrado."
      });
    }

    const unitResult = await pool.query(
      "SELECT * FROM health_units WHERE id = $1",
      [currentUnitId]
    );

    if (unitResult.rows.length === 0) {
      return res.status(404).json({
        error: "Unidade de saúde não encontrada."
      });
    }

    const medicine = medicineResult.rows[0];
    const unit = unitResult.rows[0];

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
        current_unit_id,
        status
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$7,$8,'ACTIVE')
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

    await pool.query(
      `
      INSERT INTO stock_movements
      (
        batch_id,
        from_unit_id,
        to_unit_id,
        movement_type,
        quantity,
        latitude,
        longitude,
        responsible,
        notes
      )
      VALUES
      ($1,NULL,$2,'BATCH_REGISTERED',$3,$4,$5,$6,$7)
      `,
      [
        batch.id,
        currentUnitId,
        Number(quantityInitial),
        unit.latitude,
        unit.longitude,
        "Sistema FarmaChain",
        "Lote cadastrado e recebido na unidade inicial."
      ]
    );

    const block = await createLedgerEvent({
      eventType: "REGISTER_BATCH",
      entityType: "batch",
      entityId: batch.id,
      payload: {
        batchId: batch.id,
        batchNumber: batch.batch_number,
        medicineId: medicine.id,
        medicineName: medicine.name,
        activeIngredient: medicine.active_ingredient,
        concentration: medicine.concentration,
        pharmaceuticalForm: medicine.pharmaceutical_form,
        storageTemperature: medicine.storage_temperature,
        manufacturer,
        distributor,
        manufacturingDate,
        expirationDate,
        quantityInitial: Number(quantityInitial),
        currentUnit: {
          id: unit.id,
          name: unit.name,
          district: unit.district,
          address: unit.address,
          gps: {
            latitude: unit.latitude,
            longitude: unit.longitude
          }
        }
      }
    });

    const qr = await generateTraceQrCode(batch.id);

    res.status(201).json({
      message: "Lote cadastrado com sucesso. QR Code gerado.",
      batch,
      qr,
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
