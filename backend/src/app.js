const express = require("express");
const cors = require("cors");

const demoRoutes = require("./routes/demo.routes");
const medicineRoutes = require("./routes/medicine.routes");
const batchRoutes = require("./routes/batch.routes");
const dispenseRoutes = require("./routes/dispense.routes");
const traceRoutes = require("./routes/trace.routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    name: "FarmaChain API",
    description: "Rastreabilidade farmacêutica com ledger blockchain-like",
    status: "online"
  });
});

app.use("/api/demo", demoRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/dispense", dispenseRoutes);
app.use("/api/trace", traceRoutes);

module.exports = app;
