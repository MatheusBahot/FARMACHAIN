const crypto = require("crypto");
const pool = require("../db/pool");

function sha256(data) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
}

async function getLastBlock() {
  const result = await pool.query(
    "SELECT * FROM blockchain_ledger ORDER BY block_index DESC LIMIT 1"
  );

  return result.rows[0] || null;
}

async function createLedgerEvent({ eventType, entityType, entityId, payload }) {
  const lastBlock = await getLastBlock();

  const blockIndex = lastBlock ? lastBlock.block_index + 1 : 1;
  const previousHash = lastBlock ? lastBlock.block_hash : "GENESIS_BLOCK";

  const normalizedPayload = {
    eventType,
    entityType,
    entityId,
    payload,
    timestamp: new Date().toISOString()
  };

  const dataHash = sha256(normalizedPayload);

  const blockHash = sha256({
    blockIndex,
    previousHash,
    dataHash
  });

  const result = await pool.query(
    `
    INSERT INTO blockchain_ledger
    (block_index, event_type, entity_type, entity_id, payload, previous_hash, data_hash, block_hash)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
    `,
    [
      blockIndex,
      eventType,
      entityType,
      entityId,
      payload,
      previousHash,
      dataHash,
      blockHash
    ]
  );

  return result.rows[0];
}

async function getLedgerByEntity(entityId) {
  const result = await pool.query(
    `
    SELECT *
    FROM blockchain_ledger
    WHERE entity_id = $1
       OR payload::text ILIKE $2
    ORDER BY block_index ASC
    `,
    [entityId, `%${entityId}%`]
  );

  return result.rows;
}

async function validateLedger() {
  const result = await pool.query(
    "SELECT * FROM blockchain_ledger ORDER BY block_index ASC"
  );

  const blocks = result.rows;

  for (let i = 0; i < blocks.length; i++) {
    const current = blocks[i];
    const previous = blocks[i - 1];

    if (i === 0 && current.previous_hash !== "GENESIS_BLOCK") {
      return {
        valid: false,
        problem: `Bloco ${current.block_index} deveria apontar para GENESIS_BLOCK.`
      };
    }

    if (i > 0 && current.previous_hash !== previous.block_hash) {
      return {
        valid: false,
        problem: `Bloco ${current.block_index} não aponta para o hash do bloco anterior.`
      };
    }
  }

  return {
    valid: true,
    totalBlocks: blocks.length
  };
}

module.exports = {
  createLedgerEvent,
  getLedgerByEntity,
  validateLedger
};
