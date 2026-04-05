const { BrowserWindow } = require('electron');

/**
 * Generates a PDF buffer from HTML content using a headless BrowserWindow.
 * @param {string} html 
 * @returns {Promise<Buffer>}
 */
async function generatePdfFromHtml(html) {
    const pdfWin = new BrowserWindow({
        show: false,
        webPreferences: {
            offscreen: true,
        },
    });

    try {
        await pdfWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

        const pdf = await pdfWin.webContents.printToPDF({
            printBackground: true,
            marginsType: 0,
            pageSize: "A4",
        });

        return pdf;
    } finally {
        pdfWin.destroy();
    }
}

module.exports = { generatePdfFromHtml };
