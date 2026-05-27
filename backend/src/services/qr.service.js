const QRCode = require("qrcode");
require("dotenv").config();

async function generateTraceQrCode(batchId) {
  const traceUrl = `${process.env.APP_PUBLIC_URL}/trace/${batchId}`;

  const qrCodeDataUrl = await QRCode.toDataURL(traceUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 360
  });

  return {
    traceUrl,
    qrCodeDataUrl
  };
}

module.exports = {
  generateTraceQrCode
};
