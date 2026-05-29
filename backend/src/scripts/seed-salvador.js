const pool = require("../db/pool");
const { districts, units, theoreticalMedicines } = require("../services/salvador.seed");
const { createLedgerEvent } = require("../services/ledger.service");

async function seed() {
  try {
    console.log("Limpando dados...");
    await pool.query("DELETE FROM pharmacovigilance_reports");
    await pool.query("DELETE FROM dispensations");
    await pool.query("DELETE FROM patients");
    await pool.query("DELETE FROM inventory_items");
    await pool.query("DELETE FROM stock_movements");
    await pool.query("DELETE FROM blockchain_ledger");
    await pool.query("DELETE FROM batches");
    await pool.query("DELETE FROM medicines");
    await pool.query("DELETE FROM health_units");
    await pool.query("DELETE FROM sanitary_districts");

    const districtMap = {};
    const unitMap = {};
    const medicineMap = {};

    console.log("Inserindo 12 distritos sanitários...");
    for (const [name, referenceAddress, latitude, longitude] of districts) {
      const result = await pool.query(
        `
        INSERT INTO sanitary_districts
        (name, reference_address, latitude, longitude)
        VALUES ($1,$2,$3,$4)
        RETURNING *
        `,
        [name, referenceAddress, latitude, longitude]
      );

      districtMap[name] = result.rows[0];
    }

    console.log("Inserindo unidades de saúde...");
    for (const [name, unitType, district, address, latitude, longitude] of units) {
      const districtId = districtMap[district]?.id || null;

      const result = await pool.query(
        `
        INSERT INTO health_units
        (district_id, name, unit_type, district, address, latitude, longitude)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *
        `,
        [districtId, name, unitType, district, address, latitude, longitude]
      );

      unitMap[name] = result.rows[0];
    }

    console.log("Inserindo medicamentos teóricos...");
    for (const med of theoreticalMedicines) {
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
        VALUES ($1,$2,$3,$4,$5,true,true,false,$6)
        RETURNING *
        `,
        [
          med.name,
          med.activeIngredient,
          med.concentration,
          med.pharmaceuticalForm,
          med.therapeuticClass,
          med.storageTemperature
        ]
      );

      medicineMap[med.name] = result.rows[0];

      await createLedgerEvent({
        eventType: "REGISTER_MEDICINE",
        entityType: "medicine",
        entityId: result.rows[0].id,
        payload: result.rows[0]
      });
    }

    console.log("Criando inventário teórico da CAF e UBS/USF...");
    const caf = Object.values(unitMap).find((u) => u.unit_type === "CAF");

    for (const medicine of Object.values(medicineMap)) {
      await pool.query(
        `
        INSERT INTO inventory_items
        (
          scope,
          health_unit_id,
          medicine_id,
          theoretical_quantity,
          current_quantity,
          minimum_quantity,
          maximum_quantity,
          status
        )
        VALUES ('CAF',$1,$2,10000,10000,2000,15000,'NORMAL')
        `,
        [caf.id, medicine.id]
      );
    }

    for (const unit of Object.values(unitMap).filter((u) => u.unit_type !== "CAF")) {
      for (const medicine of Object.values(medicineMap)) {
        await pool.query(
          `
          INSERT INTO inventory_items
          (
            scope,
            district_id,
            health_unit_id,
            medicine_id,
            theoretical_quantity,
            current_quantity,
            minimum_quantity,
            maximum_quantity,
            status
          )
          VALUES ('UBS',$1,$2,$3,500,500,100,800,'NORMAL')
          `,
          [unit.district_id, unit.id, medicine.id]
        );
      }
    }

    console.log("Seed concluído com sucesso.");
  } catch (error) {
    console.error("Erro no seed:", error);
  } finally {
    await pool.end();
  }
}

seed();
