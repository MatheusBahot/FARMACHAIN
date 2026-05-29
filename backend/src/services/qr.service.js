const QRCode = require("qrcode");
require("dotenv").config();

async function generateTraceQrCode(batchId) {
  const publicUrl = process.env.APP_PUBLIC_URL || "http://localhost:5173";
  const cleanUrl = publicUrl.replace(/\/$/, "");
  const traceUrl = `${cleanUrl}/trace/${batchId}`;

  const qrCodeDataUrl = await QRCode.toDataURL(traceUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 420
  });

  return {
    traceUrl,
    qrCodeDataUrl
  };
}

module.exports = {
  generateTraceQrCode
};
