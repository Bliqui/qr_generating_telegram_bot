import QRCode from "qrcode";

export const generateQR = async (url) => {
  try {
    return QRCode.toDataURL(url);
  } catch (err) {
    console.error(err);
  }
};
