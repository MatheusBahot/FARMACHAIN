const express = require("express");
const cors = require("cors");

const demoRoutes = require("./routes/demo.routes");
const medicineRoutes = require("./routes/medicine.routes");
const batchRoutes = require("./routes/batch.routes");
const dispenseRoutes = require("./routes/dispense.routes");
const traceRoutes = require("./routes/trace.routes");
const unitRoutes = require("./routes/unit.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const pharmacovigilanceRoutes = require("./routes/pharmacovigilance.routes");
const recallRoutes = require("./routes/recall.routes");
const inventoryRoutes = require("./routes/inventory.routes");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    name: "FarmaChain API",
    status: "online",
    modules: [
      "distritos sanitários",
      "unidades de saúde",
      "CAF",
      "inventário",
      "medicamentos",
      "lotes",
      "QR Code",
      "dispensação robusta",
      "paciente criptografado",
      "blockchain-like",
      "farmacovigilância"
    ]
  });
});

app.use("/api/demo", demoRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/dispense", dispenseRoutes);
app.use("/api/trace", traceRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/pharmacovigilance", pharmacovigilanceRoutes);
app.use("/api/recall", recallRoutes);
app.use("/api/inventory", inventoryRoutes);

module.exports = app;
