const ExcelJS = require('exceljs');

/**
 * Generates a styled Excel file.
 * @param {string} title - The title of the worksheet.
 * @param {Array} columns - Column definitions { header: string, key: string, width: number }.
 * @param {Array} rows - Data rows.
 * @returns {Promise<Buffer>}
 */
async function generateExcel(title, columns, rows) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title);

  worksheet.columns = columns.map(col => ({
    header: col.header,
    key: col.key,
    width: col.width || 20
  }));

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F46E5' } // Primary indigo color
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 25;

  // Add rows and style them
  rows.forEach((rowData, index) => {
    const row = worksheet.addRow(rowData);
    
    // Alternating row colors
    if (index % 2 === 1) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF9FAFB' } // Light gray
      };
    }

    // Border for each cell
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };
      
      // Auto-formatting for numbers
      if (typeof cell.value === 'number') {
        cell.numFmt = '#,##0';
      }
    });
  });

  // Auto-filter
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: columns.length }
  };

  return await workbook.xlsx.writeBuffer();
}

module.exports = {
  generateExcel
};
