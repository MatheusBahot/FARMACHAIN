const fs = require("fs");
const path = require("path");
const pool = require("../db/pool");

async function init() {
  try {
    const schemaPath = path.join(__dirname, "../db/schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");

    await pool.query(sql);

    console.log("Banco de dados FarmaChain inicializado com sucesso.");
  } catch (error) {
    console.error("Erro ao inicializar banco:", error);
  } finally {
    await pool.end();
  }
}

init();
