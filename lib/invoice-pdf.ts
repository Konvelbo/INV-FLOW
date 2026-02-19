import { invoiceTemplate as defaultInvoiceTemplate } from "./invoice-pdf"; // Self-import/circular structure not needed, standard export.

export type InvoiceItem = {
  designation: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type InvoiceItemProps = InvoiceItem;

export type InvoiceProps = {
  reference: string;
  city: string;
  clientName: string;
  clientAddress?: string;
  clientContact?: string;
  clientPOBox?: string;
  object: string;
  items: InvoiceItem[];
  totalHT: number;
  totalMaterial: number;
  managerName: string;
  amountWords: string;
  style?: string;
  currencyCode?: string;
};

export function invoiceTemplate(data: InvoiceProps) {
  const { style } = data;

  switch (style) {
    case "style1":
      return renderStyle1(data);
    case "style2":
      return renderStyle2(data);
    case "style3":
      return renderStyle3(data);
    case "style4":
      return renderStyle4(data);
    case "style5":
      return renderStyle5(data);
    default:
      return renderDefault(data);
  }
}

const formatCurrency = (value: number, currency = "XOF") =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(value);

const calculateTotals = (items: InvoiceItem[]) => {
  const totalht = items.reduce(
    (sum, item) => sum + (item.totalPrice || item.quantity * item.unitPrice),
    0,
  );
  const totalmaterial = items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );
  return { totalht, totalmaterial };
};

// ==========================================
// DEFAULT STYLE
// ==========================================
function renderDefault(data: InvoiceProps) {
  const date = new Date().toLocaleDateString("fr-FR");
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const itemsPerPage = 14;
  const totalPages = Math.max(1, Math.ceil(data.items.length / itemsPerPage));

  const pagesHtml = Array.from({ length: totalPages })
    .map((_, pageIndex) => {
      const pageItems = data.items.slice(
        pageIndex * itemsPerPage,
        (pageIndex + 1) * itemsPerPage,
      );
      const isLast = pageIndex === totalPages - 1;
      const remainingItems = data.items.slice((pageIndex + 1) * itemsPerPage);
      const remainingTotal = remainingItems.reduce(
        (sum, item) =>
          sum + (item.totalPrice || item.quantity * item.unitPrice),
        0,
      );

      return `
  <div class="page ${pageIndex > 0 ? "page-break" : ""}">
    ${
      pageIndex === 0
        ? `
    <div class="proforma-line">
      <span class="ref">PROFORMA : ${data.reference}</span>
      <span class="date">${data.city} le ${date}</span>
    </div>

    <div class="address-container">
      <div class="address-header">
        <div class="address-title">Adresse de facturation</div>
        <div class="address-title">Adresse de livraison</div>
      </div>
      <div class="client-info">
        <p>Client : ${data.clientName}</p>
        ${data.clientAddress ? `<p>Adresse : ${data.clientAddress}</p>` : ""}
        ${data.clientContact ? `<p>Contact : ${data.clientContact}</p>` : ""}
        ${data.clientPOBox ? `<p>BP : ${data.clientPOBox}</p>` : ""}
        <p>Objet : ${data.object}</p>
      </div>
    </div>`
        : ""
    }

    <div style="${pageIndex > 0 ? "padding: 20px 30px;" : ""}">
      <table>
        <thead>
          <tr>
            <th>DESIGNATION</th>
            <th>UNITE</th>
            <th>QUANTITE</th>
            <th>P. UNITAIRE</th>
            <th>P. TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${pageItems
            .map(
              (item) => `
          <tr>
            <td>${item.designation}</td>
            <td>${item.unit}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.unitPrice, data.currencyCode)}</td>
            <td>${formatCurrency(item.totalPrice || item.quantity * item.unitPrice, data.currencyCode)}</td>
          </tr>`,
            )
            .join("")}
        </tbody>
      </table>

      ${isLast && remainingTotal > 0 ? `<div style="margin-top:8px; text-align:right; font-weight:bold;">Montant restant : ${formatCurrency(remainingTotal, data.currencyCode)}</div>` : ""}

      ${
        isLast
          ? `
      <table class="totals">
        <tr><td>TOTAL MATERIEL</td><td>${totalmaterial}</td></tr>
        <tr><td>TOTAL HT</td><td>${formatCurrency(totalht, data.currencyCode)}</td></tr>
      </table>
      <div class="signature">
        <h2>Le Responsable</h2><br><br>
        <h1>${data.managerName}</h1>
      </div>`
          : ""
      }
    </div>
    <div class="pageNumber">Page ${pageIndex + 1} / ${totalPages}</div>
  </div>`;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<style>
  body { margin: 0; padding: 0; background: #eee; font-family: "Times New Roman", serif; font-size: 11px; color: #000; }
  .page { width: 794px; min-height: 1123px; margin: 0 auto; background: #fff; padding: 40px 30px; box-sizing: border-box; position: relative; }
  .page-break { page-break-before: always; }
  .pageNumber { position: absolute; bottom: 30px; right: 30px; }
  .proforma-line { display: flex; justify-content: space-between; margin-top: 25px; font-weight: bold; font-size: 20px; }
  .address-container { border: 1px solid #000; margin-top: 15px; }
  .address-header { display: flex; border-bottom: 1px solid #000; height: 30px; font-size: 14px; }
  .address-title { width: 50%; padding: 6px; font-weight: bold; border-right: 1px solid #000; }
  .address-title:last-child { border-right: none; }
  .client-info { padding: 8px; }
  .client-info p { margin-bottom: 4px; font-weight: bold; font-size: 15px; }
  table { width: 100%; border-collapse: collapse; margin-top: 15px; }
  th, td { border: 1px solid #000; padding: 4px; font-size: 11px; }
  th { font-weight: bold; text-align: center; font-size: 16px; }
  .totals { width: 40%; margin-left: auto; margin-top: 10px; background-color: #eee; }
  .signature { margin-top: 30px; text-align: right; font-weight: bold; }
</style>
</head>
<body>${pagesHtml}</body>
</html>`;
}

// ==========================================
// STYLE 1: MODERN / MINIMALIST
// ==========================================
function renderStyle1(data: InvoiceProps) {
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(data.items.length / itemsPerPage));

  const pagesHtml = Array.from({ length: totalPages })
    .map((_, pageIndex) => {
      const pageItems = data.items.slice(
        pageIndex * itemsPerPage,
        (pageIndex + 1) * itemsPerPage,
      );
      const isLast = pageIndex === totalPages - 1;

      return `
    <div class="page ${pageIndex > 0 ? "page-break" : ""}">
      ${
        pageIndex === 0
          ? `
      <div class="header">
          <div class="logo-section">
              <h1>INVOICE</h1>
              <div class="ref-row"><span class="label">Reference:</span> <span class="value">${data.reference}</span></div>
          </div>
          <div class="date-section">
              <div class="city">${data.city}</div>
              <div class="date">${new Date().toLocaleDateString("fr-FR")}</div>
          </div>
      </div>
  
      <div class="info-grid">
          <div class="col">
              <h3>BILLED TO</h3>
              <div class="client-name">${data.clientName}</div>
              <div class="client-detail">${data.clientAddress || ""}</div>
              <div class="client-detail">
                  ${data.clientContact || ""} 
                  ${data.clientPOBox ? ` - BP ${data.clientPOBox}` : ""}
              </div>
          </div>
          <div class="col">
              <h3>PROJECT DETAILS</h3>
              <div class="project-box">
                  <div class="label">Object / Description</div>
                  <div class="object">${data.object}</div>
              </div>
          </div>
      </div>`
          : `<div style="height: 50px;"></div>`
      }
  
      <table>
          <thead>
              <tr>
                  <th style="text-align:left; width: 40%">DESCRIPTION</th>
                  <th style="text-align:center">UNIT</th>
                  <th style="text-align:center">QTY</th>
                  <th style="text-align:right">PRICE</th>
                  <th style="text-align:right">TOTAL</th>
              </tr>
          </thead>
          <tbody>
            ${pageItems
              .map(
                (item, idx) => `
            <tr class="${idx % 2 === 0 ? "" : "bg-gray"}">
              <td style="text-align:left">${item.designation}</td>
              <td style="text-align:center">${item.unit}</td>
              <td style="text-align:center">${item.quantity}</td>
              <td style="text-align:right">${formatCurrency(item.unitPrice, data.currencyCode)}</td>
              <td style="text-align:right; font-weight:bold;">${formatCurrency(item.totalPrice || item.quantity * item.unitPrice, data.currencyCode)}</td>
            </tr>`,
              )
              .join("")}
          </tbody>
      </table>
  
      ${
        isLast
          ? `
      <div class="footer-totals">
          <div class="totals-container">
            <div class="total-row"><span>Total Material</span> <span>${totalmaterial}</span></div>
            <div class="total-row main"><span>TOTAL</span> <span>${formatCurrency(totalht, data.currencyCode)}</span></div>
          </div>
      </div>
      <div class="signature">
          <div class="sig-title">Authorized Signature</div>
          <div class="sig-name">${data.managerName}</div>
      </div>`
          : ""
      }
      
      <div class="page-num">${pageIndex + 1} / ${totalPages}</div>
    </div>`;
    })
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap');
    body { margin: 0; background: #eee; font-family: 'Inter', sans-serif; color: #334155; }
    .page { width: 794px; min-height: 1123px; margin: 0 auto; background: #fff; padding: 0; position: relative; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .page-break { page-break-before: always; }
    .header { background: #0f172a; color: white; padding: 48px; display: flex; justify-content: space-between; align-items: flex-start; }
    .logo-section h1 { margin: 0; font-weight: 300; font-size: 36px; letter-spacing: 0.05em; margin-bottom: 8px;}
    .ref-row { color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; }
    .ref-row .value { color: white; border-bottom: 1px solid #334155; padding-bottom: 2px; }
    .date-section { text-align: right; }
    .city { border-bottom: 1px solid #334155; padding-bottom: 2px; color: white; margin-bottom: 4px; display: inline-block; min-width: 100px; text-align: right;}
    .date { color: #94a3b8; font-size: 14px; }
    
    .info-grid { display: flex; padding: 48px; gap: 48px; }
    .col { flex: 1; }
    h3 { font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 16px; text-transform: uppercase; }
    .client-name { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 8px; line-height: 1.2; }
    .client-detail { font-size: 14px; color: #475569; margin-bottom: 4px; }
    
    .project-box { background: #f8fafc; padding: 24px; border-radius: 8px; }
    .project-box .label { font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 4px; }
    .object { font-size: 16px; font-weight: 500; color: #1e293b; }
    
    table { width: 100%; padding: 0 48px; border-collapse: separate; border-spacing: 0; }
    th { color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 12px 10px; border-bottom: 2px solid #f1f5f9; }
    td { padding: 16px 10px; font-size: 14px; color: #334155; border-bottom: 1px solid #f8fafc; }
    .bg-gray { background-color: #f8fafc; }
    
    .footer-totals { padding: 48px; margin-top: 16px; display: flex; justify-content: flex-end; }
    .totals-container { width: 35%; }
    .total-row { display: flex; justify-content: space-between; gap: 20px; font-size: 14px; margin-bottom: 12px; color: #64748b; }
    .total-row.main { font-size: 24px; font-weight: 700; color: #0f172a; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 16px; align-items: center; }
    
    .signature { position: absolute; bottom: 48px; right: 48px; text-align: right; }
    .sig-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 32px; }
    .sig-name { font-size: 24px; color: #1e293b; font-family: 'Inter', cursive; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; display: inline-block; min-width: 200px; text-align: center; }
    
    .page-num { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); font-size: 12px; color: #cbd5e1; }
  </style>
  </head>
  <body>${pagesHtml}</body>
  </html>`;
}

// ==========================================
// STYLE 2: CORPORATE
// ==========================================
function renderStyle2(data: InvoiceProps) {
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const itemsPerPage = 14;
  const totalPages = Math.max(1, Math.ceil(data.items.length / itemsPerPage));

  const pagesHtml = Array.from({ length: totalPages })
    .map((_, i) => {
      const isLast = i === totalPages - 1;
      return `<div class="page ${i > 0 ? "page-break" : ""}">
       ${
         i === 0
           ? `
         <div class="header-band">
             <div class="logo-container">
                 <div class="logo-circle"></div>
             </div>
             <h2 class="company-name">COMPANY</h2>
         </div>
         <div class="header-main">
             <div class="left">
                 <h1 class="title">INVOICE</h1>
                 <div class="meta"><span style="color:#64748b;">#</span> ${data.reference}</div>
             </div>
             <div class="right">
                 <div class="city-date">${data.city}</div>
                 <div class="date-sub">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
             </div>
         </div>
         <div class="info-block">
             <div class="info-col">
                 <h3>INVOICE TO</h3>
                 <div class="client">${data.clientName}</div>
                 <div class="detail">${data.clientAddress || ""}</div>
                 <div class="detail">
                    ${data.clientPOBox ? `Zip/Postal: ${data.clientPOBox}` : ""}
                    ${data.clientContact ? `Contact: ${data.clientContact}` : ""}
                 </div>
             </div>
             <div class="info-col">
                 <h3>DESCRIPTION</h3>
                 <div class="description-box">${data.object}</div>
             </div>
         </div>`
           : '<div style="height:40px"></div>'
       }
         
         <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="text-align:left">Description</th>
                        <th>Unit</th>
                        <th>Qty</th>
                        <th style="text-align:right">Price</th>
                        <th style="text-align:right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items
                      .slice(i * itemsPerPage, (i + 1) * itemsPerPage)
                      .map(
                        (item, idx) => `
                    <tr class="${idx % 2 === 1 ? "bg-gray" : ""}">
                        <td style="text-align:left">${item.designation}</td>
                        <td class="center">${item.unit}</td>
                        <td class="center">${item.quantity}</td>
                        <td style="text-align:right">${formatCurrency(item.unitPrice, data.currencyCode)}</td>
                        <td style="text-align:right; font-weight:bold; color:#1e293b;">${formatCurrency(item.totalPrice || item.quantity * item.unitPrice, data.currencyCode)}</td>
                    </tr>`,
                      )
                      .join("")}
                </tbody>
            </table>
         </div>

         ${
           isLast
             ? `
         <div class="summary">
             <div class="summary-box">
                 <div class="row"><span>Items Count</span> <span>${data.items.length}</span></div>
                 <div class="row"><span>Total Material</span> <span>${totalmaterial}</span></div>
                 <div class="row total"><span>Total</span> <span>${formatCurrency(totalht, data.currencyCode)}</span></div>
             </div>
         </div>
         <div class="footer-sig">
             <div class="sig-label">Authorized Signatory</div>
             <div class="sig">${data.managerName}</div>
         </div>
         <div class="footer-bar"></div>`
             : `<div class="footer-bar" style="position:absolute; bottom:0;"></div>`
         }
       </div>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap');
    body { font-family: 'Merriweather', serif; background: #eee; color: #374151; }
    .page { width: 794px; min-height: 1123px; margin: 0 auto; background: white; padding: 0; position: relative; overflow: hidden; }
    .page-break { page-break-before: always; }
    
    .header-band { position:absolute; top:0; left:0; bottom:0; width: 33%; background: #1e3a8a; color: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; z-index: 10; height: 200px; }
    .logo-container { width: 64px; height: 64px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
    .logo-circle { width: 40px; height: 40px; background: white; border-radius: 50%; }
    .company-name { font-weight: 700; font-size: 20px; letter-spacing: 0.05em; margin: 0; }
    
    .header-main { margin-left: 33%; background: #f3f4f6; height: 200px; padding: 40px; box-sizing: border-box; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { color: #1e3a8a; font-size: 48px; font-weight: 900; margin: 0; line-height: 1; margin-bottom: 8px; }
    .meta { font-size: 18px; color: #6b7280; display: flex; align-items: center; gap: 8px; }
    .right { text-align: right; }
    .city-date { font-size: 16px; font-weight: bold; color: #374151; margin-bottom: 4px; }
    .date-sub { font-size: 14px; color: #6b7280; font-style: italic; }
    
    .info-block { display: flex; padding: 40px; gap: 48px; margin-top: 0px; }
    .info-col { flex: 1; }
    h3 { color: #1e3a8a; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 2px solid #1e3a8a; padding-bottom: 8px; margin-bottom: 16px; display: inline-block; }
    .client { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px; }
    .detail { font-size: 14px; color: #4b5563; margin-bottom: 4px; }
    .description-box { background: #f9fafb; border-left: 4px solid #d1d5db; padding: 12px; font-style: italic; color: #4b5563; }
    
    .table-container { padding: 0 40px; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #1e3a8a; color: white; }
    th { padding: 12px 16px; font-size: 14px; font-weight: 600; text-align: center; }
    td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #e5e7eb; color: #374151; }
    .bg-gray { background: #f8fafc; }
    .center { text-align: center; }
    
    .summary { display: flex; justify-content: flex-end; padding: 40px; }
    .summary-box { background: #f3f4f6; padding: 24px; width: 320px; border-radius: 8px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #4b5563; }
    .row.total { font-size: 22px; font-weight: 700; color: #1e3a8a; border-top: 1px solid #d1d5db; margin-top: 16px; padding-top: 16px; }
    
    .footer-sig { position: absolute; bottom: 80px; left: 40px; width: 250px; }
    .sig-label { font-size: 12px; text-transform: uppercase; color: #9ca3af; margin-bottom: 8px; }
    .sig { font-family: 'Merriweather', serif; font-style: italic; font-size: 20px; color: #1f2937; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; }
    
    .footer-bar { position: absolute; bottom: 0; left: 0; width: 100%; height: 48px; background: #1e3a8a; }
    </style></head><body>${pagesHtml}</body></html>`;
}

// ==========================================
// STYLE 3: CREATIVE
// ==========================================
function renderStyle3(data: InvoiceProps) {
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const date = new Date().toLocaleDateString();
  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(data.items.length / itemsPerPage));

  // Visual decorations
  const bgDecor = `
        <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: #fb923c; opacity: 0.15; border-bottom-left-radius: 200px; z-index: 0;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 300px; height: 300px; background: #a855f7; opacity: 0.15; border-top-right-radius: 200px; z-index: 0;"></div>
    `;

  const pagesHtml = Array.from({ length: totalPages })
    .map((_, i) => {
      const isLast = i === totalPages - 1;

      return `<div class="page ${i > 0 ? "page-break" : ""}">
        ${bgDecor}
        <div class="content-wrapper">
            ${
              i === 0
                ? `
            <div class="header">
                <div>
                    <div class="brand">
                        <div class="hexagon"></div>
                        <span>CREATIVE</span>
                    </div>
                    <div class="sub-meta">
                        <span class="city">${data.city}</span>
                        <span class="date">${date}</span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <h1 class="main-title">INVOICE</h1>
                    <div class="ref-badge"><span style="opacity:0.6;">#</span> ${data.reference}</div>
                </div>
            </div>

            <div class="client-box">
                <div class="billed-to">
                    <h3>BILLED TO</h3>
                    <div class="client-name">${data.clientName}</div>
                    <div class="client-addr">${data.clientAddress || ""}</div>
                    <div class="client-addr">${data.clientContact || ""}</div>
                    <div class="client-addr">${data.clientPOBox ? `Zip: ${data.clientPOBox}` : ""}</div>
                </div>
                <div class="project-desc">
                    <h3>PROJECT DESCRIPTION</h3>
                    <div class="desc-text">${data.object}</div>
                </div>
            </div>`
                : '<div style="height: 50px;"></div>'
            }

            <div class="grid-header">
                <div class="c-desc">Description</div>
                <div class="c-unit">Unit</div>
                <div class="c-qty">Qty</div>
                <div class="c-total">Total</div>
            </div>

            <div class="items-grid">
                ${data.items
                  .slice(i * itemsPerPage, (i + 1) * itemsPerPage)
                  .map(
                    (item) => `
                <div class="item-card">
                    <div class="i-desc">
                        <div class="name">${item.designation}</div>
                        <div class="price-mini">Price: ${formatCurrency(item.unitPrice, data.currencyCode)}</div>
                    </div>
                    <div class="i-unit">${item.unit}</div>
                    <div class="i-qty"><span>${item.quantity}</span></div>
                    <div class="i-total">${formatCurrency(item.totalPrice || item.quantity * item.unitPrice, data.currencyCode)}</div>
                </div>`,
                  )
                  .join("")}
            </div>

            ${
              isLast
                ? `
            <div class="footer">
                <div class="summary-card">
                    <div class="sum-left">
                        <div class="label">TOTAL ITEMS</div>
                        <div class="val">${totalmaterial}</div>
                    </div>
                    <div class="sum-right">
                         <div class="label">GRAND TOTAL</div>
                         <div class="val-lg">${formatCurrency(totalht, data.currencyCode)}</div>
                    </div>
                </div>
                <div class="signature-block">
                    <div class="sig">${data.managerName}</div>
                    <div class="label">AUTHORIZED SIGNATURE</div>
                </div>
            </div>`
                : ""
            }
        </div>
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Caveat:wght@700&display=swap');
        body { margin: 0; background: #eee; font-family: 'Outfit', sans-serif; color: #1f2937; }
        .page { width: 794px; min-height: 1123px; margin: 0 auto; background: white; padding: 0; position: relative; box-sizing: border-box; overflow: hidden; }
        .page-break { page-break-before: always; }
        
        .content-wrapper { position: relative; z-index: 10; padding: 48px; }
        
        .header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; }
        .brand { display: flex; align-items: center; gap: 8px; color: #7e22ce; font-weight: 800; font-size: 24px; letter-spacing: -0.05em; margin-bottom: 8px; }
        .hexagon { width: 32px; height: 32px; background: currentColor; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
        .sub-meta { color: #6b7280; font-size: 14px; }
        .city { border-bottom: 1px dashed #d1d5db; padding-bottom: 2px; margin-right: 8px; }
        .main-title { font-size: 64px; font-weight: 900; margin: 0; line-height: 1; background: linear-gradient(to right, #9333ea, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; opacity: 0.9; }
        .ref-badge { font-size: 20px; font-weight: 700; color: #374151; margin-top: 4px; font-family: monospace; }
        
        .client-box { display: flex; gap: 32px; margin-bottom: 40px; }
        .billed-to { flex: 1; background: #f9fafb; padding: 24px; border-radius: 16px; border: 1px solid #f3f4f6; }
        .project-desc { flex: 1; padding-left: 24px; border-left: 4px solid #fdba74; display: flex; flex-direction: column; justify-content: center; }
        
        h3 { color: #a855f7; margin: 0 0 16px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
        .project-desc h3 { color: #fb923c; }
        
        .client-name { font-size: 24px; font-weight: 800; color: #1f2937; margin-bottom: 8px; }
        .client-addr { font-size: 14px; color: #4b5563; margin-bottom: 2px; }
        .desc-text { font-size: 18px; color: #374151; font-style: italic; line-height: 1.4; }
        
        .grid-header { display: flex; font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; padding: 0 16px; margin-bottom: 12px; }
        .c-desc { flex: 2; } .c-unit { width: 80px; text-align: center; } .c-qty { width: 80px; text-align: center; } .c-total { width: 100px; text-align: right; }
        
        .items-grid { display: flex; flex-direction: column; gap: 12px; }
        .item-card { display: flex; align-items: center; background: white; border: 1px solid #f3f4f6; padding: 16px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .i-desc { flex: 2; }
        .i-desc .name { font-weight: 700; color: #1f2937; font-size: 14px; margin-bottom: 2px; }
        .i-desc .price-mini { font-size: 12px; color: #9ca3af; }
        .i-unit { width: 80px; text-align: center; font-size: 14px; color: #6b7280; }
        .i-qty { width: 80px; text-align: center; }
        .i-qty span { display: inline-block; background: #faf5ff; color: #7e22ce; font-weight: 700; padding: 2px 8px; border-radius: 6px; font-size: 14px; }
        .i-total { width: 100px; text-align: right; font-weight: 800; font-size: 14px; color: #1f2937; }
        
        .footer { margin-top: 64px; display: flex; flex-direction: column; align-items: flex-end; }
        .summary-card { background: #1e293b; color: white; padding: 32px; border-radius: 24px; width: 60%; display: flex; justify-content: space-between; box-shadow: 0 20px 40px -10px rgba(126, 34, 206, 0.3); position: relative; overflow: hidden; }
        .summary-card::before { content: ''; position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%; }
        
        .label { font-size: 10px; font-weight: 700; opacity: 0.7; letter-spacing: 0.05em; margin-bottom: 4px; }
        .val { font-size: 20px; font-weight: 700; }
        .val-lg { font-size: 32px; font-weight: 800; color: #fb923c; }
        .sum-right { text-align: right; }
        
        .signature-block { margin-top: 48px; text-align: center; width: 100%; }
        .sig { font-family: 'Caveat', cursive; font-size: 32px; color: #7e22ce; margin-bottom: 8px; }
        .signature-block .label { color: #9ca3af; letter-spacing: 0.2em; }
    </style></head><body>${pagesHtml}</body></html>`;
}

// ==========================================
// STYLE 4: CLASSIC
// ==========================================
function renderStyle4(data: InvoiceProps) {
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const itemsPerPage = 15;
  const totalPages = Math.max(1, Math.ceil(data.items.length / itemsPerPage));

  // Visual element: Double Border
  const border = `<div style="position: absolute; top: 24px; left: 24px; right: 24px; bottom: 24px; border: 4px double #1f2937; pointer-events: none; z-index: 100;"></div>`;

  const pagesHtml = Array.from({ length: totalPages })
    .map((_, i) => {
      const isLast = i === totalPages - 1;

      return `<div class="page ${i > 0 ? "page-break" : ""}">
            ${border}
            <div class="inner-content">
            ${
              i === 0
                ? `
            <div class="header">
                <div class="title-block">
                    <h1>INVOICE</h1>
                    <div class="sub-meta">
                        <span class="meta-item">NO: <span class="val">${data.reference}</span></span>
                        <span class="sep">|</span>
                        <span class="meta-item">DATE: <span class="val">${new Date().toLocaleDateString()}</span></span>
                    </div>
                </div>
            </div>

            <div class="info-grid">
                 <div class="col">
                     <h3 class="sect-title">INVOICED TO:</h3>
                     <div class="client-name">${data.clientName}</div>
                     <div class="addr-line">${data.clientAddress || ""}</div>
                     <div class="addr-line">${data.clientContact || ""}</div>
                     <div class="addr-line">${data.clientPOBox || ""}</div>
                 </div>
                 <div class="col right">
                     <h3 class="sect-title">FOR:</h3>
                     <div class="object">${data.object}</div>
                     <div class="city-line">City: <strong>${data.city}</strong></div>
                 </div>
            </div>`
                : '<div style="height:50px"></div>'
            }

            <table>
                <thead>
                    <tr>
                        <th class="th-desc">DESCRIPTION</th>
                        <th class="th-center">UNIT</th>
                        <th class="th-center">QTY</th>
                        <th class="th-right">PRICE</th>
                        <th class="th-right last">AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items
                      .slice(i * itemsPerPage, (i + 1) * itemsPerPage)
                      .map(
                        (item) => `
                    <tr>
                        <td class="td-desc">${item.designation}</td>
                        <td class="td-center">${item.unit}</td>
                        <td class="td-center">${item.quantity}</td>
                        <td class="td-right">${formatCurrency(item.unitPrice, data.currencyCode)}</td>
                        <td class="td-right last font-bold">${formatCurrency(item.totalPrice || item.quantity * item.unitPrice, data.currencyCode)}</td>
                    </tr>`,
                      )
                      .join("")}
                </tbody>
            </table>

            ${
              isLast
                ? `
            <div class="footer">
                <div class="sig-block">
                    <div class="sig">${data.managerName}</div>
                    <div class="sig-line"></div>
                    <div class="sig-label">AUTHORIZED SIGNATURE</div>
                </div>
                <div class="total-block">
                     <div class="subtotal-row">
                         <span>Subtotal (Items: ${totalmaterial})</span>
                         <span>${formatCurrency(totalht, data.currencyCode)}</span>
                     </div>
                     <div class="total-due">
                         <span>TOTAL DUE</span>
                         <span>${formatCurrency(totalht, data.currencyCode)}</span>
                     </div>
                </div>
            </div>`
                : ""
            }
            </div>
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@400;700&display=swap');
    body { font-family: "Playfair Display", serif; background: #eee; color: #1f2937; }
    .page { width: 794px; min-height: 1123px; margin: 0 auto; background: #fdfbf7; padding: 64px 48px; box-sizing: border-box; position: relative; }
    .page-break { page-break-before: always; }
    
    .inner-content { position: relative; z-index: 10; min-height: 900px; }
    
    .header { text-align: center; margin-bottom: 56px; border-bottom: 2px solid #1f2937; padding-bottom: 32px; }
    h1 { font-size: 48px; letter-spacing: 0.1em; margin: 0 0 16px 0; text-transform: uppercase; }
    .sub-meta { font-family: 'Lato', sans-serif; font-size: 14px; font-weight: 700; display: flex; justify-content: center; align-items: center; gap: 16px; }
    .meta-item { color: #4b5563; }
    .val { color: #111827; border-bottom: 1px solid #9ca3af; padding: 0 4px; }
    
    .info-grid { display: flex; justify-content: space-between; gap: 48px; margin-bottom: 48px; font-family: 'Lato', sans-serif; }
    .col { flex: 1; }
    .col.right { text-align: right; }
    
    .sect-title { font-weight: 700; font-size: 12px; text-decoration: underline; text-underline-offset: 4px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em; }
    
    .client-name { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; font-style: italic; margin-bottom: 8px; }
    .addr-line { font-size: 14px; margin-bottom: 2px; color: #374151; }
    
    .object { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; margin-bottom: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; display: inline-block; }
    .city-line { font-size: 14px; }
    
    table { width: 100%; border-collapse: collapse; font-family: 'Lato', sans-serif; }
    thead tr { border-top: 3px solid #1f2937; border-bottom: 3px solid #1f2937; }
    th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-right: 1px solid #1f2937; }
    th.last { border-right: none; }
    th.th-center { text-align: center; width: 60px; }
    th.th-right { text-align: right; width: 120px; }
    
    td { padding: 16px; border-bottom: 1px solid #e5e7eb; border-right: 1px solid #1f2937; font-size: 14px; }
    td.last { border-right: none; }
    td.td-center { text-align: center; }
    td.td-right { text-align: right; }
    td.font-bold { font-weight: 700; }
    
    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 64px; }
    .sig-block { text-align: center; width: 240px; }
    .sig { font-family: 'davida', cursive; font-size: 24px; margin-bottom: 4px; }
    .sig-line { height: 1px; background: #1f2937; margin-bottom: 8px; }
    .sig-label { font-family: 'Lato', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
    
    .total-block { width: 320px; font-family: 'Lato', sans-serif; }
    .subtotal-row { display: flex; justify-content: space-between; border-bottom: 1px solid #9ca3af; padding-bottom: 8px; mb-2; font-size: 14px; }
    .total-due { display: flex; justify-content: space-between; border-top: 3px solid #1f2937; padding-top: 12px; font-size: 20px; font-weight: 700; margin-top: 8px; font-family: 'Playfair Display', serif; }
    </style></head><body>${pagesHtml}</body></html>`;
}

// ==========================================
// STYLE 5: TECH
// ==========================================
function renderStyle5(data: InvoiceProps) {
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const itemsPerPage = 15;
  const totalPages = Math.max(1, Math.ceil(data.items.length / itemsPerPage));

  const pagesHtml = Array.from({ length: totalPages })
    .map((_, i) => {
      const isLast = i === totalPages - 1;

      return `<div class="page ${i > 0 ? "page-break" : ""}">
            <div class="grid-bg"></div>
            <div class="content">
            ${
              i === 0
                ? `
            <div class="header-box">
                <div class="sys-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 8px;"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>
                    SYS.INVOICE <span class="version">v2.0.4</span>
                </div>
                <div class="data-block">
                    <div class="ref-tag">REF: ${data.reference}</div>
                    <div class="loc-tag">LOC: ${data.city}</div>
                </div>
            </div>

            <div class="meta-grid">
                <div class="meta-col main">
                    <div class="label">TARGET_ENTITY</div>
                    <div class="value-lg">${data.clientName}</div>
                    <div class="value">${data.clientAddress || "N/A"}</div>
                    <div class="value">${data.clientContact || "N/A"}</div>
                </div>
                <div class="meta-col sec">
                    <div class="label">OPERATION_OBJECT</div>
                    <div class="value">${data.object}</div>
                </div>
            </div>`
                : '<div style="height:50px"></div>'
            }

            <div class="data-table">
                <div class="dt-head">
                    <div class="c1">_MODULE</div>
                    <div class="c2">_UNIT</div>
                    <div class="c3">_QTY</div>
                    <div class="c4">_COST</div>
                </div>
                ${data.items
                  .slice(i * itemsPerPage, (i + 1) * itemsPerPage)
                  .map(
                    (item, idx) => `
                <div class="dt-row ${idx % 2 === 0 ? "alt" : ""}">
                    <div class="c1"><span style="color:#166534">[${i * itemsPerPage + idx + 1}]</span> ${item.designation}</div>
                    <div class="c2">${item.unit}</div>
                    <div class="c3">${item.quantity}</div>
                    <div class="c4">${formatCurrency(item.totalPrice || item.quantity * item.unitPrice, data.currencyCode)}</div>
                </div>`,
                  )
                  .join("")}
            </div>

            ${
              isLast
                ? `
            <div class="footer-calc">
                <div class="calc-box">
                    <div class="scan-line"></div>
                     <div class="calc-row"><span>MODULES_COUNT</span> <span>${totalmaterial}</span></div>
                     <div class="calc-row total"><span>TOTAL_EXEC</span> <span>${formatCurrency(totalht, data.currencyCode)}</span></div>
                </div>
            </div>
            <div class="footer-block">
                 <div>GENERATED BY SYSTEM | AUTH: ${data.managerName}</div>
                 <div>:: ADMIN_ACCESS :: ${uuidv4().substring(0, 8)}</div>
            </div>`
                : ""
            }
            </div>
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;600;700&display=swap');
    body { background: #000; font-family: 'Fira Code', 'Courier New', monospace; color: #22c55e; margin: 0; }
    .page { width: 794px; min-height: 1123px; margin: 0 auto; background: #09090b; padding: 0; position: relative; border: 1px solid #14532d; overflow: hidden; }
    .page-break { page-break-before: always; }
    
    .grid-bg { position: absolute; inset: 0; background-image: linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px); background-size: 20px 20px; opacity: 0.1; z-index: 0; }
    .content { position: relative; z-index: 10; padding: 40px; }
    
    .header-box { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #14532d; padding-bottom: 24px; margin-bottom: 40px; background: rgba(24, 24, 27, 0.8); backdrop-filter: blur(4px); }
    .sys-title { font-size: 28px; font-weight: 700; letter-spacing: -1px; display: flex; align-items: center; }
    .version { font-size: 12px; opacity: 0.7; margin-left: 8px; font-weight: 400; color: #15803d; }
    
    .data-block { text-align: right; }
    .ref-tag { border: 1px solid #14532d; padding: 4px 12px; color: #4ade80; font-size: 14px; margin-bottom: 4px; background: rgba(20, 83, 45, 0.2); }
    .loc-tag { font-size: 12px; color: #15803d; }
    
    .meta-grid { display: flex; gap: 24px; margin-bottom: 40px; }
    .meta-col { flex: 1; }
    .meta-col.main { border-left: 2px solid #22c55e; padding-left: 16px; }
    .meta-col.sec { border: 1px solid #14532d; padding: 16px; background: rgba(20, 83, 45, 0.1); }
    
    .label { font-size: 10px; color: #15803d; margin-bottom: 8px; }
    .value-lg { font-size: 20px; font-weight: 700; margin-bottom: 4px; color: #4ade80; }
    .value { font-size: 12px; color: #22c55e; margin-bottom: 2px; }
    
    .data-table { border: 1px solid #14532d; margin-bottom: 32px; }
    .dt-head { display: flex; background: rgba(20, 83, 45, 0.3); padding: 8px 16px; font-size: 12px; font-weight: 700; color: #86efac; border-bottom: 1px solid #14532d; }
    .dt-row { display: flex; padding: 8px 16px; font-size: 12px; border-bottom: 1px solid rgba(20, 83, 45, 0.3); }
    .dt-row.alt { background: rgba(9, 9, 11, 0.5); }
    
    .c1 { flex: 2; } .c2 { width: 15%; text-align: center; } .c3 { width: 15%; text-align: center; } .c4 { width: 20%; text-align: right; }
    
    .footer-calc { display: flex; justify-content: flex-end; margin-bottom: 40px; }
    .calc-box { width: 280px; border: 1px solid #22c55e; background: #09090b; padding: 20px; position: relative; overflow: hidden; }
    .scan-line { position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: #22c55e; opacity: 0.5; animation: scan 2s linear infinite; }
    
    .calc-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px; color: #15803d; }
    .calc-row.total { font-size: 18px; font-weight: 700; color: #4ade80; border-top: 1px solid #14532d; margin-top: 12px; padding-top: 12px; }
    
    .footer-block { display: flex; justify-content: space-between; font-size: 10px; color: #15803d; border-top: 1px solid #14532d; padding-top: 16px; }
    </style></head><body>${pagesHtml}</body></html>`;
}

// Helper for Tech style ID generation mock
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
