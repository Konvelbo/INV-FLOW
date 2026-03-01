const puppeteer = require("puppeteer");
// Note: You'll need to adjust the import path for invoiceTemplate or move the template generator to a shared location/electron folder
// const { invoiceTemplate } = require("../lib/invoice-pdf");

// This function is intended to be called from the Electron Main Process via IPC
async function generatePdf(data) {
  try {
    // Validate input data
    if (!data || !data.reference || !data.clientName || !data.items) {
      throw new Error("Invalid input data. Required fields are missing.");
    }

    // const html = invoiceTemplate(data);
    // For now we need to make sure invoiceTemplate is available here.
    // If it's a pure function in a .ts/.js file in lib, you can require it.

    // Mock HTML for safely saving this file without broken deps
    const html = "<html><body><h1>Invoice</h1></body></html>";

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return pdf;
  } catch (error) {
    throw error;
  }
}

module.exports = { generatePdf };
