/**
 * A simplified, JS-only version of the invoice template for backend PDF generation.
 * This ensures compatibility with the Electron Main process.
 */
function renderInvoiceHtml(data, lang = "fr") {
    const dict = {
        fr: {
            invoice: "Facture",
            proforma: "Facture Proforma",
            reference: "Référence",
            date: "Date",
            client: "Client",
            billedTo: "Facturé à",
            description: "Description",
            qty: "Qté",
            unit: "Unité",
            unitPrice: "Prix Unit.",
            totalPrice: "Total",
            totalHT: "Total HT",
            totalMaterial: "Total Matériel",
            manager: "Signature",
        },
        en: {
            invoice: "Invoice",
            proforma: "Proforma Invoice",
            reference: "Reference",
            date: "Date",
            client: "Client",
            billedTo: "Billed To",
            description: "Description",
            qty: "Qty",
            unit: "Unit",
            unitPrice: "Unit Price",
            totalPrice: "Total",
            totalHT: "Total Pre-tax",
            totalMaterial: "Total Items",
            manager: "Signature",
        }
    }[lang] || { /* fallback to fr */ };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US", {
            style: "currency",
            currency: data.currencyCode || "XOF",
        }).format(val);
    };

    const itemsHtml = (data.items || []).map(item => `
    <tr>
      <td style="padding: 10px; border: 1px solid #eee;">${item.designation}</td>
      <td style="padding: 10px; border: 1px solid #eee; text-align: center;">${item.unit || '-'}</td>
      <td style="padding: 10px; border: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border: 1px solid #eee; text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding: 10px; border: 1px solid #eee; text-align: right; font-weight: bold;">${formatCurrency(item.totalPrice || (item.quantity * item.unitPrice))}</td>
    </tr>
  `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #0f172a; padding-bottom: 20px; }
        .company-info h1 { margin: 0; color: #0f172a; font-size: 28px; }
        .invoice-details { text-align: right; }
        .invoice-details h2 { margin: 0; color: #94a3b8; font-size: 24px; text-transform: uppercase; }
        .info-grid { display: flex; gap: 40px; margin-bottom: 40px; }
        .info-col { flex: 1; }
        .info-col h3 { font-size: 12px; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        th { background: #f8fafc; padding: 12px; text-align: center; border: 1px solid #eee; font-size: 12px; text-transform: uppercase; }
        .totals { width: 300px; margin-left: auto; }
        .total-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .total-row.grand { font-weight: bold; font-size: 18px; border-bottom: 2px solid #0f172a; color: #0f172a; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <h1>${data.companyName || "ESSOR"}</h1>
          <p>${data.city || ""}</p>
        </div>
        <div class="invoice-details">
          <h2>${data.type === 'quote' ? dict.proforma : dict.invoice}</h2>
          <p><strong>${dict.reference}:</strong> ${data.reference}</p>
          <p><strong>${dict.date}:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-col">
          <h3>${dict.billedTo}</h3>
          <p><strong>${data.clientName}</strong></p>
          <p>${data.clientAddress || ""}</p>
          <p>${data.clientContact || ""}</p>
        </div>
        <div class="info-col">
          <h3>Objet</h3>
          <p>${data.object || ""}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="text-align: left;">${dict.description}</th>
            <th>${dict.unit}</th>
            <th>${dict.qty}</th>
            <th>${dict.unitPrice}</th>
            <th>${dict.totalPrice}</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>${dict.totalMaterial}</span>
          <span>${data.totalMaterial || 0}</span>
        </div>
        <div class="total-row grand">
          <span>${dict.totalHT}</span>
          <span>${formatCurrency(data.totalHT)}</span>
        </div>
      </div>
      
      <div style="margin-top: 60px; text-align: right;">
        <p style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">${dict.manager}</p>
        <p style="font-size: 18px; font-weight: bold; margin-top: 10px;">${data.managerName || ""}</p>
      </div>
    </body>
    </html>
  `;
}

module.exports = { renderInvoiceHtml };
