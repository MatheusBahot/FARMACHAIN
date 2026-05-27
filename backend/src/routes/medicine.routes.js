const express = require("express");
const pool = require("../db/pool");
const { createLedgerEvent } = require("../services/ledger.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM medicines ORDER BY created_at DESC");
  res.json(result.rows);
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      activeIngredient,
      concentration,
      pharmaceuticalForm,
      therapeuticClass,
      renameItem,
      remumeItem,
      controlled,
      storageTemperature
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO medicines
      (
        name,
        active_ingredient,
        concentration,
        pharmaceutical_form,
        therapeutic_class,
        rename_item,
        remume_item,
        controlled,
        storage_temperature
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
      `,
      [
        name,
        activeIngredient,
        concentration,
        pharmaceuticalForm,
        therapeuticClass,
        Boolean(renameItem),
        Boolean(remumeItem),
        Boolean(controlled),
        storageTemperature
      ]
    );

    const medicine = result.rows[0];

    const block = await createLedgerEvent({
      eventType: "REGISTER_MEDICINE",
      entityType: "medicine",
      entityId: medicine.id,
      payload: medicine
    });

    res.status(201).json({
      medicine,
      blockchainBlock: block
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao cadastrar medicamento.",
      details: error.message
    });
  }
});

module.exports = router;
