const crypto = require("crypto");
require("dotenv").config();

function onlyNumbers(value) {
  return String(value || "").replace(/\D/g, "");
}

function hashSensitive(value) {
  return crypto
    .createHash("sha256")
    .update(`${onlyNumbers(value)}:${process.env.CPF_SECRET_SALT}`)
    .digest("hex");
}

function encryptSensitive(value) {
  const normalized = onlyNumbers(value);
  const key = Buffer.from(process.env.CPF_AES_SECRET, "utf8");
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(normalized, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

function normalizeCpf(cpf) {
  return onlyNumbers(cpf);
}

function hashCpf(cpf) {
  return hashSensitive(cpf);
}

function encryptCpf(cpf) {
  return encryptSensitive(cpf);
}

function hashSusCard(susCard) {
  return hashSensitive(susCard);
}

function encryptSusCard(susCard) {
  return encryptSensitive(susCard);
}

function createDocumentHash(content) {
  return crypto
    .createHash("sha256")
    .update(String(content || "SEM_CONTEUDO"))
    .digest("hex");
}

module.exports = {
  normalizeCpf,
  hashCpf,
  encryptCpf,
  hashSusCard,
  encryptSusCard,
  createDocumentHash
};
