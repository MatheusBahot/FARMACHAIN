const express = require("express");
const pool = require("../db/pool");
const {
  hashCpf,
  encryptCpf,
  createDocumentHash
} = require("../services/crypto.service");
const { createLedgerEvent } = require("../services/ledger.service");

const router = express.Router();

router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      batchId,
      cpf,
      prescriptionText,
      quantity,
      pharmacistName,
      pharmacistCrf
    } = req.body;

    const batchResult = await client.query(
      `
      SELECT
        b.*,
        m.name AS medicine_name,
        h.id AS health_unit_id,
        h.name AS health_unit_name,
        h.district,
        h.address,
        h.latitude,
        h.longitude
      FROM batches b
      JOIN medicines m ON m.id = b.medicine_id
      JOIN health_units h ON h.id = b.current_unit_id
      WHERE b.id = $1
      FOR UPDATE
      `,
      [batchId]
    );

    if (batchResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Lote não encontrado." });
    }

    const batch = batchResult.rows[0];

    if (batch.status !== "ACTIVE") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: "Este lote não está ativo para dispensação.",
        status: batch.status
      });
    }

    if (Number(batch.quantity_current) < Number(quantity)) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: "Quantidade insuficiente no estoque.",
        available: batch.quantity_current
      });
    }

    const today = new Date();
    const expiration = new Date(batch.expiration_date);

    if (expiration < today) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: "Medicamento vencido. Dispensação bloqueada."
      });
    }

    const patientHash = hashCpf(cpf);
    const encryptedCpf = encryptCpf(cpf);
    const prescriptionHash = createDocumentHash(prescriptionText || "SEM_RECEITA_INFORMADA");

    const dispensationResult = await client.query(
      `
      INSERT INTO dispensations
      (
        batch_id,
        health_unit_id,
        patient_hash,
        patient_encrypted_cpf,
        prescription_hash,
        quantity,
        pharmacist_name,
        pharmacist_crf,
        latitude,
        longitude
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
      `,
      [
        batchId,
        batch.health_unit_id,
        patientHash,
        encryptedCpf,
        prescriptionHash,
        Number(quantity),
        pharmacistName,
        pharmacistCrf,
        batch.latitude,
        batch.longitude
      ]
    );

    const dispensation = dispensationResult.rows[0];

    await client.query(
      `
      UPDATE batches
      SET quantity_current = quantity_current - $1
      WHERE id = $2
      `,
      [Number(quantity), batchId]
    );

    await client.query(
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
      ($1,$2,NULL,'DISPENSATION',$3,$4,$5,$6,$7)
      `,
      [
        batchId,
        batch.health_unit_id,
        Number(quantity),
        batch.latitude,
        batch.longitude,
        pharmacistName,
        "Baixa por dispensação ao paciente com CPF pseudonimizado."
      ]
    );

    await client.query("COMMIT");

    const block = await createLedgerEvent({
      eventType: "DISPENSE_MEDICINE",
      entityType: "batch",
      entityId: batchId,
      payload: {
        dispensationId: dispensation.id,
        batchId,
        batchNumber: batch.batch_number,
        medicineName: batch.medicine_name,
        quantity: Number(quantity),
        patientHash,
        encryptedCpfPreview: encryptedCpf,
        prescriptionHash,
        healthUnit: {
          id: batch.health_unit_id,
          name: batch.health_unit_name,
          district: batch.district,
          address: batch.address,
          gps: {
            latitude: batch.latitude,
            longitude: batch.longitude
          }
        },
        pharmacist: {
          name: pharmacistName,
          crf: pharmacistCrf
        }
      }
    });

    res.status(201).json({
      message: "Medicamento dispensado com sucesso.",
      dispensation,
      privacy: {
        patientHash,
        encryptedCpf,
        warning: "CPF real não foi gravado em texto puro na blockchain."
      },
      blockchainBlock: block
    });
  } catch (error) {
    await client.query("ROLLBACK");

    res.status(500).json({
      error: "Erro ao dispensar medicamento.",
      details: error.message
    });
  } finally {
    client.release();
  }
});

module.exports = router;
