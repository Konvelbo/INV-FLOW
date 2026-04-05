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

  // Style header row (Essor Dark Theme)
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFF8FAFC' }, size: 12 };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' } // Slate 900
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 30;

  // Add rows and style them
  rows.forEach((rowData, index) => {
    // We add row data. exceljs filters by keys mapping to columns automatically.
    const row = worksheet.addRow(rowData);

    const isTotal = rowData.isTotalRow === true;

    if (isTotal) {
      // Total Global / Summary Row Styling (Essor Orange)
      row.font = { bold: true, color: { argb: 'FF0F172A' }, size: 12 };
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFB923C' } // Orange 400
      };
      row.height = 25;
    } else {
      // Alternating row colors
      if (index % 2 === 1) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8FAFC' } // Slate 50
        };
      }
    }

    // Border and alignment for each cell
    row.eachCell((cell, colNumber) => {
      // Stronger borders for totals
      cell.border = isTotal
        ? {
          top: { style: 'medium', color: { argb: 'FF0F172A' } },
          bottom: { style: 'medium', color: { argb: 'FF0F172A' } }
        }
        : {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };

      cell.alignment = { vertical: 'middle' };

      // Auto-formatting for numbers to show correctly
      if (typeof cell.value === 'number') {
        cell.numFmt = '#,##0.00';
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
