import { PDFDocument } from "pdf-lib";
import { degrees } from "pdf-lib";
export const addWatermark = async (pdfBuffer, watermarkText) => {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    page.drawText(watermarkText, {
      x: width / 4,
      y: height / 2,
      size: 50,
      opacity: 0.5,
      rotate: degrees(Math.random() * 360),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
