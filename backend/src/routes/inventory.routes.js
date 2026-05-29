const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

router.get("/caf", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        i.*,
        m.name AS medicine_name,
        m.active_ingredient,
        m.concentration,
        b.batch_number,
        b.expiration_date,
        b.manufacturer,
        b.distributor
      FROM inventory_items i
      LEFT JOIN medicines m ON m.id = i.medicine_id
      LEFT JOIN batches b ON b.id = i.batch_id
      WHERE i.scope = 'CAF'
      ORDER BY m.name
      `
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar inventário da CAF.",
      details: error.message
    });
  }
});

router.get("/districts", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        d.id AS district_id,
        d.name AS district_name,
        h.id AS unit_id,
        h.name AS unit_name,
        h.unit_type,
        i.id AS inventory_id,
        m.name AS medicine_name,
        b.batch_number,
        b.expiration_date,
        i.theoretical_quantity,
        i.current_quantity,
        i.minimum_quantity,
        i.maximum_quantity,
        i.status
      FROM sanitary_districts d
      LEFT JOIN health_units h ON h.district_id = d.id
      LEFT JOIN inventory_items i ON i.health_unit_id = h.id
      LEFT JOIN medicines m ON m.id = i.medicine_id
      LEFT JOIN batches b ON b.id = i.batch_id
      WHERE h.unit_type IN ('UBS', 'USF')
      ORDER BY d.name, h.name, m.name
      `
    );

    const grouped = {};

    for (const row of result.rows) {
      if (!grouped[row.district_name]) {
        grouped[row.district_name] = {
          districtId: row.district_id,
          districtName: row.district_name,
          units: {}
        };
      }

      if (row.unit_id && !grouped[row.district_name].units[row.unit_id]) {
        grouped[row.district_name].units[row.unit_id] = {
          unitId: row.unit_id,
          unitName: row.unit_name,
          unitType: row.unit_type,
          inventory: []
        };
      }

      if (row.inventory_id) {
        grouped[row.district_name].units[row.unit_id].inventory.push({
          inventoryId: row.inventory_id,
          medicineName: row.medicine_name,
          batchNumber: row.batch_number,
          expirationDate: row.expiration_date,
          theoreticalQuantity: row.theoretical_quantity,
          currentQuantity: row.current_quantity,
          minimumQuantity: row.minimum_quantity,
          maximumQuantity: row.maximum_quantity,
          status: row.status
        });
      }
    }

    res.json(
      Object.values(grouped).map((district) => ({
        ...district,
        units: Object.values(district.units)
      }))
    );
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar inventário por distrito.",
      details: error.message
    });
  }
});

module.exports = router;
