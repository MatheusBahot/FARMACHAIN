CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS pharmacovigilance_reports CASCADE;
DROP TABLE IF EXISTS dispensations CASCADE;
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS blockchain_ledger CASCADE;
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS health_units CASCADE;

CREATE TABLE health_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(180) NOT NULL,
  district VARCHAR(120) NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE medicines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(180) NOT NULL,
  active_ingredient VARCHAR(180) NOT NULL,
  concentration VARCHAR(80) NOT NULL,
  pharmaceutical_form VARCHAR(120) NOT NULL,
  therapeutic_class VARCHAR(180),
  rename_item BOOLEAN DEFAULT FALSE,
  remume_item BOOLEAN DEFAULT FALSE,
  controlled BOOLEAN DEFAULT FALSE,
  storage_temperature VARCHAR(80),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicine_id UUID NOT NULL REFERENCES medicines(id),
  batch_number VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(180) NOT NULL,
  distributor VARCHAR(180) NOT NULL,
  manufacturing_date DATE NOT NULL,
  expiration_date DATE NOT NULL,
  quantity_initial INTEGER NOT NULL,
  quantity_current INTEGER NOT NULL,
  current_unit_id UUID REFERENCES health_units(id),
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES batches(id),
  from_unit_id UUID REFERENCES health_units(id),
  to_unit_id UUID REFERENCES health_units(id),
  movement_type VARCHAR(80) NOT NULL,
  quantity INTEGER NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  responsible VARCHAR(180),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dispensations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES batches(id),
  health_unit_id UUID NOT NULL REFERENCES health_units(id),
  patient_hash TEXT NOT NULL,
  patient_encrypted_cpf TEXT NOT NULL,
  prescription_hash TEXT,
  quantity INTEGER NOT NULL,
  pharmacist_name VARCHAR(180) NOT NULL,
  pharmacist_crf VARCHAR(80) NOT NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pharmacovigilance_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES batches(id),
  dispensation_id UUID REFERENCES dispensations(id),
  patient_hash TEXT,
  severity VARCHAR(50) NOT NULL,
  event_description TEXT NOT NULL,
  status VARCHAR(80) DEFAULT 'UNDER_REVIEW',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE blockchain_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_index INTEGER NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  payload JSONB NOT NULL,
  previous_hash TEXT NOT NULL,
  data_hash TEXT NOT NULL,
  block_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
