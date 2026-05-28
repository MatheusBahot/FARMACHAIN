const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM health_units ORDER BY district, name"
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao listar unidades.",
      details: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, district, address, latitude, longitude } = req.body;

    const result = await pool.query(
      `
      INSERT INTO health_units
      (name, district, address, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [name, district, address, latitude, longitude]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao cadastrar unidade.",
      details: error.message
    });
  }
});

module.exports = router;
