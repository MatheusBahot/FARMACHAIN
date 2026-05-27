const pool = require("../db/pool");
const { createLedgerEvent } = require("./ledger.service");

async function seedDemoData() {
  const unitResult = await pool.query(
    `
    INSERT INTO health_units
    (name, district, address, latitude, longitude)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      "UBS Federação - Salvador",
      "Barra/Rio Vermelho",
      "Rua da Federação, Salvador - BA",
      -12.9991012,
      -38.5087541
    ]
  );

  const unit = unitResult.rows[0];

  const medicineResult = await pool.query(
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
    ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
    `,
    [
      "Losartana Potássica 50 mg",
      "Losartana Potássica",
      "50 mg",
      "Comprimido",
      "Anti-hipertensivo",
      true,
      true,
      false,
      "15 °C a 30 °C"
    ]
  );

  const medicine = medicineResult.rows[0];

  await createLedgerEvent({
    eventType: "REGISTER_MEDICINE",
    entityType: "medicine",
    entityId: medicine.id,
    payload: {
      medicineId: medicine.id,
      name: medicine.name,
      activeIngredient: medicine.active_ingredient,
      renameItem: medicine.rename_item,
      remumeItem: medicine.remume_item
    }
  });

  const batchResult = await pool.query(
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
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'ACTIVE')
    RETURNING *
    `,
    [
      medicine.id,
      "LOS-SSA-2026-A01",
      "Fabricante Farma Brasil S.A.",
      "Distribuidora Nordeste Medicamentos LTDA",
      "2026-01-10",
      "2028-01-10",
      500,
      500,
      unit.id
    ]
  );

  const batch = batchResult.rows[0];

  await createLedgerEvent({
    eventType: "REGISTER_BATCH",
    entityType: "batch",
    entityId: batch.id,
    payload: {
      batchId: batch.id,
      batchNumber: batch.batch_number,
      medicineId: medicine.id,
      medicineName: medicine.name,
      manufacturer: batch.manufacturer,
      distributor: batch.distributor,
      expirationDate: batch.expiration_date,
      quantityInitial: batch.quantity_initial
    }
  });

  await createLedgerEvent({
    eventType: "RECEIVE_BATCH_AT_UNIT",
    entityType: "batch",
    entityId: batch.id,
    payload: {
      batchId: batch.id,
      healthUnitId: unit.id,
      healthUnitName: unit.name,
      district: unit.district,
      gps: {
        latitude: unit.latitude,
        longitude: unit.longitude
      },
      quantityReceived: batch.quantity_initial
    }
  });

  return {
    unit,
    medicine,
    batch
  };
}

module.exports = {
  seedDemoData
};
