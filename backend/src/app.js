const express = require("express");
const cors = require("cors");

const demoRoutes = require("./routes/demo.routes");
const medicineRoutes = require("./routes/medicine.routes");
const batchRoutes = require("./routes/batch.routes");
const dispenseRoutes = require("./routes/dispense.routes");
const traceRoutes = require("./routes/trace.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://farmachain.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, true);
    }
  })
);

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    name: "FarmaChain API",
    description:
      "Rastreabilidade farmacêutica com QR Code, GPS, criptografia e ledger blockchain-like",
    status: "online",
    modules: [
      "medicamentos",
      "lotes",
      "estoque",
      "dispensação",
      "farmacovigilância",
      "QR Code",
      "auditoria blockchain"
    ]
  });
});

app.use("/api/demo", demoRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/dispense", dispenseRoutes);
app.use("/api/trace", traceRoutes);

module.exports = app;
