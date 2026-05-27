const crypto = require("crypto");
require("dotenv").config();

function normalizeCpf(cpf) {
  return String(cpf).replace(/\D/g, "");
}

function hashCpf(cpf) {
  const normalized = normalizeCpf(cpf);

  return crypto
    .createHash("sha256")
    .update(`${normalized}:${process.env.CPF_SECRET_SALT}`)
    .digest("hex");
}

function encryptCpf(cpf) {
  const normalized = normalizeCpf(cpf);
  const key = Buffer.from(process.env.CPF_AES_SECRET, "utf8");
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(normalized, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

function createDocumentHash(content) {
  return crypto
    .createHash("sha256")
    .update(String(content))
    .digest("hex");
}

module.exports = {
  normalizeCpf,
  hashCpf,
  encryptCpf,
  createDocumentHash
};
