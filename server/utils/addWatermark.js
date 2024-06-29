import { readFileSync } from 'fs';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

// Function to get a random position on the page
function getRandomPosition(pageWidth, pageHeight) {
    const x = Math.floor(Math.random() * (pageWidth - 100)); // Assuming watermark width is 100
    const y = Math.floor(Math.random() * (pageHeight - 20));  // Assuming watermark height is 20
    return { x, y };
}

export async function addWatermark(inputPath,watermarkText) {
    // Load the existing PDF
    const existingPdfBytes = readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    // Get the pages of the PDF
    const pages = pdfDoc.getPages();

    // Define the watermark style
    const fontSize = 24;
    const color = rgb(0.55, 0.55, 0.55); // Light gray color

    // Add watermark to each page
    pages.forEach(page => {
        const { width, height } = page.getSize();
        const { x, y } = getRandomPosition(width, height);
        page.drawText(watermarkText, {
            x,
            y,
            size: fontSize,
            color,
            rotate: degrees(Math.random() * 360) // Convert degrees to radians
        });
    });

    // Save the PDF with watermarks
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}
