import { translations, TranslationKey } from "@/src/lib/translations";

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
  language?: "fr" | "en";
};

type PdfDictionary = typeof translations.fr;

export function invoiceTemplate(data: InvoiceProps) {
  const { style } = data;
  const lang = data.language || "fr";
  const dict = translations[lang] || translations.fr;

  switch (style) {
    case "style1":
      return renderStyle1(data, dict, lang);
    case "style2":
      return renderStyle2(data, dict, lang);
    case "style3":
      return renderStyle3(data, dict, lang);
    case "style4":
      return renderStyle4(data, dict, lang);
    case "style5":
      return renderStyle5(data, dict, lang);
    default:
      return renderDefault(data, dict, lang);
  }
}

const formatCurrency = (value: number, currency = "XOF", lang = "fr") =>
  new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US", {
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

interface PdfDictionary {
  [key: string]: string;
}

// ==========================================
// DEFAULT STYLE
// ==========================================
function renderDefault(data: InvoiceProps, dict: PdfDictionary, lang: string) {
  const date = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US");
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
      <span class="ref">${dict.proforma} : ${data.reference}</span>
      <span class="date">${data.city} ${dict.date} ${date}</span>
    </div>

    <div class="address-container">
      <div class="address-header">
        <div class="address-title">${dict.billingAddress}</div>
        <div class="address-title">${dict.deliveryAddress}</div>
      </div>
      <div class="client-info">
        <p>${dict.client} : ${data.clientName}</p>
        ${data.clientAddress ? `<p>${dict.address} : ${data.clientAddress}</p>` : ""}
        ${data.clientContact ? `<p>${dict.contact} : ${data.clientContact}</p>` : ""}
        ${data.clientPOBox ? `<p>${dict.poBox} : ${data.clientPOBox}</p>` : ""}
        <p>${dict.object} : ${data.object}</p>
      </div>
    </div>`
        : ""
    }

    <div style="${pageIndex > 0 ? "padding: 20px 30px;" : ""}">
      <table>
        <thead>
          <tr>
            <th>${dict.description}</th>
            <th>${dict.unit}</th>
            <th>${dict.qty}</th>
            <th>${dict.unitPrice}</th>
            <th>${dict.totalPrice}</th>
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
            <td>${formatCurrency(item.unitPrice, data.currencyCode, lang)}</td>
            <td>${formatCurrency(item.totalPrice || item.quantity * item.unitPrice, data.currencyCode, lang)}</td>
          </tr>`,
            )
            .join("")}
        </tbody>
      </table>

      ${isLast && remainingTotal > 0 ? `<div style="margin-top:8px; text-align:right; font-weight:bold;">${dict.amountRemaining} : ${formatCurrency(remainingTotal, data.currencyCode, lang)}</div>` : ""}

      ${
        isLast
          ? `
      <table class="totals">
        <tr><td>${dict.totalMaterial}</td><td>${totalmaterial}</td></tr>
        <tr><td>${dict.totalHT}</td><td>${formatCurrency(totalht, data.currencyCode, lang)}</td></tr>
      </table>
      <div class="signature">
        <h2>${dict.manager}</h2><br><br>
        <h1>${data.managerName}</h1>
      </div>`
          : ""
      }
    </div>
    <div class="pageNumber">${dict.page} ${pageIndex + 1} ${dict.of} ${totalPages}</div>
  </div>`;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="${lang}">
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
function renderStyle1(data: InvoiceProps, dict: PdfDictionary, lang: string) {
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const itemsPerPage = 11;
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
              <h1>${dict.invoice}</h1>
              <div class="ref-row"><span class="label">${dict.reference}:</span> <span class="value">${data.reference}</span></div>
          </div>
          <div class="date-section">
              <div class="city">${data.city}</div>
              <div class="date">${new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}</div>
          </div>
      </div>

      <div class="info-grid">
          <div class="col">
              <h3>${dict.billedTo}</h3>
              <div class="client-name">${data.clientName}</div>
              <div class="client-detail">${data.clientAddress || ""}</div>
              <div class="client-detail">
                  ${data.clientContact || ""}
                  ${data.clientPOBox ? ` - ${dict.poBox} ${data.clientPOBox}` : ""}
              </div>
          </div>
          <div class="col">
              <h3>${dict.projectDetails}</h3>
              <div class="project-box">
                  <div class="label">${dict.object}</div>
                  <div class="object">${data.object}</div>
              </div>
          </div>
      </div>`
          : `<div style="height: 50px;"></div>`
      }

      <table>
          <thead>
              <tr>
                  <th style="text-align:left; width: 40%">${dict.description}</th>
                  <th style="text-align:center">${dict.unit}</th>
                  <th style="text-align:center">${dict.qty}</th>
                  <th style="text-align:right">${dict.unitPrice}</th>
                  <th style="text-align:right">${dict.totalPrice}</th>
              </tr>
          </thead>
          <tbody>
            ${pageItems
              .map(
                (item, idx) => `
            <tr class="${idx % 2 === 0 ? "" : "bg-gray"}">
              <td style="text-align:left; word-break: break-word; max-width: 300px;">${item.designation}</td>
              <td style="text-align:center">${item.unit}</td>
              <td style="text-align:center">${item.quantity}</td>
              <td style="text-align:right; white-space: nowrap;">${formatCurrency(item.unitPrice, data.currencyCode, lang)}</td>
              <td style="text-align:right; font-weight:bold; white-space: nowrap;">${formatCurrency(item.totalPrice || item.quantity * item.unitPrice, data.currencyCode, lang)}</td>
            </tr>`,
              )
              .join("")}
          </tbody>
      </table>

      ${
        isLast
          ? `
      <div class="footer-totals">
            <div class="footer-bottom">
                <div class="signature-area">
                    <div class="sig-label">${dict.authorizedSignature}</div>
                    <div class="sig-name">${data.managerName}</div>
                </div>
                <div class="totals-section">
                    <div class="total-row subt">
                        <span>${dict.totalMaterial}</span>
                        <span>${totalmaterial}</span>
                    </div>
                    <div class="total-row grand">
                        <span>${dict.total}</span>
                        <span class="grand-val">${formatCurrency(totalht, data.currencyCode, lang)}</span>
                    </div>
                </div>
            </div>
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

    .footer-totals { padding: 48px 0; margin-top: 16px; }
    .footer-bottom { margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 48px; gap: 40px; }
    .signature-area { flex: 1; text-align: left; }
    .sig-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 32px; }
    .sig-name { font-family: 'Inter', cursive; font-size: 24px; font-style: italic; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; display: inline-block; min-width: 200px; }
    
    .totals-section { min-width: 320px; max-width: 50%; font-variant-numeric: tabular-nums; }
    .total-row { display: flex; justify-content: space-between; padding: 12px 0; font-size: 14px; gap: 20px; }
    .total-row.subt { color: #64748b; border-bottom: 1px solid #f1f5f9; }
    .total-row.grand { padding-top: 20px; color: #1e293b; font-size: 20px; font-weight: 700; border-bottom: 2px solid #1e293b; }
    .grand-val { font-size: 24px; word-break: break-all; text-align: right; }

    .page-num { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); font-size: 12px; color: #cbd5e1; }
  </style>
  </head>
  <body>${pagesHtml}</body>
  </html>`;
}

// ==========================================
// STYLE 2: CORPORATE
// ==========================================
function renderStyle2(data: InvoiceProps, dict: PdfDictionary, lang: string) {
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const itemsPerPage = 14;
  const totalPages = Math.max(1, Math.ceil(data.items.length / itemsPerPage));

  const pagesHtml = Array.from({ length: totalPages })
    .map((_, i) => {
      const pageItems = data.items.slice(
        i * itemsPerPage,
        (i + 1) * itemsPerPage,
      );
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
                 <h1 class="title">${dict.invoice}</h1>
                 <div class="meta"><span style="color:#64748b;">#</span> ${data.reference}</div>
             </div>
             <div class="right">
                 <div class="city-date">${data.city}</div>
                 <div class="date-sub">${new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
             </div>
         </div>
         <div class="info-block">
             <div class="info-col">
                 <h3>${dict.billedTo}</h3>
                 <div class="client">${data.clientName}</div>
                 <div class="detail">${data.clientAddress || ""}</div>
                 <div class="detail">
                    ${data.clientPOBox ? `${dict.poBox}: ${data.clientPOBox}` : ""}
                    ${data.clientContact ? `${dict.contact}: ${data.clientContact}` : ""}
                 </div>
             </div>
             <div class="info-col">
                 <h3>${dict.description}</h3>
                 <div class="description-box">${data.object}</div>
             </div>
         </div>`
           : '<div style="height:40px"></div>'
       }

         <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="text-align:left">${dict.description}</th>
                        <th>${dict.unit}</th>
                        <th>${dict.qty}</th>
                        <th style="text-align:right">${dict.unitPrice}</th>
                        <th style="text-align:right">${dict.totalPrice}</th>
                    </tr>
                </thead>
                <tbody>
                    ${pageItems
                      .map(
                        (item, idx) => `
                    <tr class="${idx % 2 === 1 ? "bg-gray" : ""}">
                        <td style="text-align:left; word-break: break-word; max-width: 300px;">${item.designation}</td>
                        <td class="center">${item.unit}</td>
                        <td class="center">${item.quantity}</td>
                        <td style="text-align:right; white-space: nowrap;">${formatCurrency(item.unitPrice, data.currencyCode, lang)}</td>
                        <td style="text-align:right; font-weight:bold; color:#1e293b; white-space: nowrap;">${formatCurrency(item.totalPrice || item.quantity * item.unitPrice, data.currencyCode, lang)}</td>
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
                 <div class="footer-layout">
                <div class="sig-area">
                    <div class="sig-label">${dict.authorizedSignature}</div>
                    <div class="sig-name">${data.managerName}</div>
                </div>
                <div class="totals-area">
                    <div class="total-row subt"><span>${dict.totalMaterial}</span> <span>${totalmaterial}</span></div>
                    <div class="total-row subt"><span>${dict.subtotal}</span> <span>${formatCurrency(totalht, data.currencyCode, lang)}</span></div>
                    <div class="total-row grand"><span>${dict.totalDue}</span> <span>${formatCurrency(totalht, data.currencyCode, lang)}</span></div>
                </div>
            </div>
            <div class="footer-bar"></div>`
             : `<div class="footer-bar" style="position:absolute; bottom:0;"></div>`
         }
         <div class="page-num" style="position:absolute; bottom:20px; right:40px; font-size:10px; color:#9ca3af; z-index:20;">${i + 1} / ${totalPages}</div>
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
    .summary-box { background: #f3f4f6; padding: 0; width: 100%; border-radius: 8px; }
    .footer-layout { margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 40px; gap: 40px; }
    .sig-area { flex: 1; }
    .sig-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 32px; font-weight: 700; }
    .sig-name { font-size: 20px; font-style: italic; color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; display: inline-block; min-width: 200px; }
    
    .totals-area { min-width: 320px; max-width: 50%; background: #1e3a8a; color: #fff; padding: 32px; border-radius: 16px; font-variant-numeric: tabular-nums; }
    .total-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; gap: 20px; }
    .total-row.subt { color: #bfdbfe; }
    .total-row.grand { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; margin-top: 16px; font-size: 18px; font-weight: 800; }
    .total-row.grand span:last-child { font-size: 24px; word-break: break-all; text-align: right; }

    .footer-bar { height: 16px; background: #1e3a8a; margin-top: 48px; }
    </style></head><body>${pagesHtml}</body></html>`;
}

// ==========================================
// STYLE 3: CREATIVE
// ==========================================
function renderStyle3(data: InvoiceProps, dict: PdfDictionary, lang: string) {
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const date = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US");
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(data.items.length / itemsPerPage));

  // Visual decorations
  const bgDecor = `
        <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: #fb923c; opacity: 0.15; border-bottom-left-radius: 200px; z-index: 0;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 300px; height: 300px; background: #a855f7; opacity: 0.15; border-top-right-radius: 200px; z-index: 0;"></div>
    `;

  const pagesHtml = Array.from({ length: totalPages })
    .map((_, i) => {
      const pageItems = data.items.slice(
        i * itemsPerPage,
        (i + 1) * itemsPerPage,
      );
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
                    <h1 class="main-title">${dict.invoice}</h1>
                    <div class="ref-badge"><span style="opacity:0.6;">#</span> ${data.reference}</div>
                </div>
            </div>

            <div class="client-box">
                <div class="billed-to">
                    <h3>${dict.billedTo}</h3>
                    <div class="client-name">${data.clientName}</div>
                    <div class="client-addr">${data.clientAddress || ""}</div>
                    <div class="client-addr">${data.clientContact || ""}</div>
                    <div class="client-addr">${data.clientPOBox ? `${dict.poBox}: ${data.clientPOBox}` : ""}</div>
                </div>
                <div class="project-desc">
                    <h3>${dict.projectDetails}</h3>
                    <div class="desc-text">${data.object}</div>
                </div>
            </div>`
                : '<div style="height: 50px;"></div>'
            }

            <div class="grid-header">
                <div class="c-desc">${dict.description}</div>
                <div class="c-unit">${dict.unit}</div>
                <div class="c-qty">${dict.qty}</div>
                <div class="c-total">${dict.totalPrice}</div>
            </div>

            <div class="items-grid">
                ${pageItems
                  .map(
                    (item) => `
                <div class="item-card">
                    <div class="i-desc">
                        <div class="name">${item.designation}</div>
                        <div class="price-mini">${dict.unitPrice}: ${formatCurrency(item.unitPrice, data.currencyCode, lang)}</div>
                    </div>
                    <div class="i-unit">${item.unit}</div>
                    <div class="i-qty"><span>${item.quantity}</span></div>
                    <div class="i-total">${formatCurrency(item.totalPrice || item.quantity * item.unitPrice, data.currencyCode, lang)}</div>
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
                        <div class="label">${dict.totalMaterial}</div>
                        <div class="val">${totalmaterial}</div>
                    </div>
                    <div class="sum-right">
                         <div class="label">${dict.totalDue}</div>
                         <div class="val-lg">${formatCurrency(totalht, data.currencyCode, lang)}</div>
                    </div>
                </div>
                <div class="signature-block">
                    <div class="sig">${data.managerName}</div>
                    <div class="label">${dict.authorizedSignature}</div>
                </div>
            </div>`
                : ""
            }
        </div>
        <div class="page-num" style="position:absolute; bottom:20px; left:50%; transform:translateX(-50%); font-size:10px; color:#9ca3af; z-index:20;">${i + 1} / ${totalPages}</div>
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
        .main-title { font-size: 55px; font-weight: 900; margin: 0; line-height: 1; background: linear-gradient(to right, #9333ea, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; opacity: 0.9; }
        .ref-badge { font-size: 20px; font-weight: 700; color: #374151; margin-top: 4px; font-family: monospace; }

        .client-box { display: flex; gap: 32px; margin-bottom: 40px; margin-top: 150px;}
        .billed-to { flex: 1; background: #f9fafb; padding: 24px; border-radius: 16px; border: 1px solid #f3f4f6; }
        .project-desc { flex: 1; padding-left: 24px; border-left: 4px solid #fdba74; display: flex; flex-direction: column; justify-content: center; }

        h3 { color: #a855f7; margin: 0 0 16px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
        .project-desc h3 { color: #fb923c; }

        .client-name { font-size: 24px; font-weight: 800; color: #1f2937; margin-bottom: 8px; }
        .client-addr { font-size: 14px; color: #4b5563; margin-bottom: 2px; }
        .desc-text { font-size: 18px; color: #374151; font-style: italic; line-height: 1.4; }

        .grid-header { display: flex; font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; padding: 0 16px; margin-bottom: 12px; }
        .c-desc { flex: 1; } .c-unit { width: 60px; text-align: center; } .c-qty { width: 60px; text-align: center; } .c-total { width: 240px; text-align: right; }

        .items-grid { display: flex; flex-direction: column; gap: 12px; }
        .item-card { display: flex; align-items: center; background: white; border: 1px solid #f3f4f6; padding: 16px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .i-desc { flex: 1; }
        .i-desc .name { font-weight: 700; color: #1f2937; font-size: 14px; margin-bottom: 2px; }
        .i-desc .price-mini { font-size: 12px; color: #9ca3af; }
        .i-unit { width: 60px; text-align: center; font-size: 14px; color: #6b7280; }
        .i-qty { width: 60px; text-align: center; }
        .i-qty span { display: inline-block; background: #faf5ff; color: #7e22ce; font-weight: 700; padding: 2px 8px; border-radius: 6px; font-size: 14px; }
        .i-total { width: auto; min-width: 240px; text-align: right; font-weight: 800; font-size: 14px; color: #1f2937; white-space: nowrap; font-variant-numeric: tabular-nums; }

        .footer { margin-top: 64px; display: flex; flex-direction: column; align-items: flex-end; }
        .summary-card { background: #1e293b; color: white; padding: 32px; border-radius: 24px; min-width: 60%; max-width: 90%; display: flex; justify-content: space-between; gap: 20px; box-shadow: 0 20px 40px -10px rgba(126, 34, 206, 0.3); position: relative; overflow: hidden; font-variant-numeric: tabular-nums; }
        .summary-card::before { content: ''; position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%; }

        .label { font-size: 10px; font-weight: 700; opacity: 0.7; letter-spacing: 0.05em; margin-bottom: 4px; }
        .val { font-size: 20px; font-weight: 700; }
        .val-lg { font-size: 32px; font-weight: 800; color: #fb923c; word-break: break-all; }
        .sum-right { text-align: right; }

        .signature-block { margin-top: 48px; text-align: center; width: 100%; }
        .sig { font-family: 'Caveat', cursive; font-size: 32px; color: #7e22ce; margin-bottom: 8px; }
        .signature-block .label { color: #9ca3af; letter-spacing: 0.2em; }
    </style></head><body>${pagesHtml}</body></html>`;
}

// ==========================================
// STYLE 4: CLASSIC
// ==========================================
function renderStyle4(data: InvoiceProps, dict: PdfDictionary, lang: string) {
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const itemsPerPage = 11;
  const totalPages = Math.max(1, Math.ceil(data.items.length / itemsPerPage));

  const pagesHtml = Array.from({ length: totalPages })
    .map((_, i) => {
      const pageItems = data.items.slice(
        i * itemsPerPage,
        (i + 1) * itemsPerPage,
      );
      const isLast = i === totalPages - 1;

      return `<div class="page ${i > 0 ? "page-break" : ""}">
            <div class="top-accent"></div>
            <div class="inner-content">
            ${
              i === 0
                ? `
            <div class="header">
                <div class="header-left">
                    <h1 class="main-title">${dict.invoice}</h1>
                    <div class="ref-row">
                        <span class="ref-label">${dict.reference}:</span>
                        <span class="ref-value">${data.reference}</span>
                    </div>
                </div>
                <div class="header-right">
                    <div class="company-name">Company Name</div>
                    <div class="city-date">
                        <span class="city">${data.city}</span>,
                        <span class="date">${new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                </div>
            </div>

            <div class="info-layout">
                <div class="billed-col">
                    <h3 class="sect-label">${dict.billedTo}</h3>
                    <div class="client-name">${data.clientName}</div>
                    <div class="client-detail">${data.clientAddress || ""}</div>
                    <div class="client-detail">${data.clientContact || ""}</div>
                    <div class="client-detail">${data.clientPOBox ? `${dict.poBox} ${data.clientPOBox}` : ""}</div>
                </div>
                <div class="project-col">
                    <h3 class="sect-label">${dict.projectDetails}</h3>
                    <div class="object-box">${data.object}</div>
                </div>
            </div>`
                : '<div style="height:60px"></div>'
            }

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th style="text-align:left">${dict.description}</th>
                            <th style="width: 80px;">${dict.unit}</th>
                            <th style="width: 80px;">${dict.qty}</th>
                            <th style="width: 120px; text-align:right">${dict.price}</th>
                            <th style="width: 140px; text-align:right">${dict.total}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pageItems
                          .map(
                            (item) => `
                        <tr>
                            <td style="text-align:left; font-weight: 500;">${item.designation}</td>
                            <td>${item.unit}</td>
                            <td>${item.quantity}</td>
                            <td style="text-align:right; color: #64748b;">${formatCurrency(item.unitPrice, data.currencyCode, lang)}</td>
                            <td style="text-align:right; font-weight: 600; color: #0f172a;">${formatCurrency(item.totalPrice || item.quantity * item.unitPrice, data.currencyCode, lang)}</td>
                        </tr>`,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>

            ${
              isLast
                ? `
            <div class="footer-area">
                <div class="totals-section">
                    <div class="total-row subt">
                        <span class="label">${dict.subtotal}</span>
                        <span class="value">${formatCurrency(totalht, data.currencyCode, lang)}</span>
                    </div>
                    <div class="total-row subt">
                        <span class="label">${dict.totalMaterial}</span>
                        <span class="value">${totalmaterial}</span>
                    </div>
                    <div class="total-row grand">
                        <span class="label">${dict.total}</span>
                        <span class="value">${formatCurrency(totalht, data.currencyCode, lang)}</span>
                    </div>
                </div>

                <div class="signature-section">
                    <div class="sig-note">

                    </div>
                    <div class="sig-block">
                        <div class="sig-name">${data.managerName}</div>
                        <div class="sig-label">${dict.authorizedSignature}</div>
                    </div>
                </div>
            </div>`
                : ""
            }
            </div>
            <div class="page-num" style="position:absolute; bottom:24px; right:60px; font-size:10px; color:#94a3b8;">${i + 1} / ${totalPages}</div>
            <div class="bottom-accent"></div>
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; background: #eee; color: #334155; margin: 0; }
    .page { width: 794px; min-height: 1123px; margin: 0 auto; background: #fff; position: relative; overflow: hidden; }
    .page-break { page-break-before: always; }

    .top-accent { height: 8px; background: #1e293b; width: 100%; }
    .bottom-accent { position: absolute; bottom: 0; left: 0; height: 8px; background: #1e293b; width: 100%; }

    .inner-content { padding: 60px; }

    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; }
    .main-title { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 400; color: #1e293b; margin: 0 0 8px 0; letter-spacing: -0.02em; }
    .ref-row { font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 600; }
    .ref-value { color: #334155; margin-left: 4px; }

    .header-right { text-align: right; }
    .company-name { font-family: 'Playfair Display', serif; font-size: 20px; color: #1e293b; margin-bottom: 4px; }
    .city-date { font-size: 14px; color: #64748b; }
    .city { color: #334155; font-weight: 500; }

    .info-layout { display: flex; gap: 48px; margin-bottom: 60px; }
    .billed-col { flex: 1; }
    .project-col { flex: 1; }

    .sect-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; }
    .client-name { font-family: 'Playfair Display', serif; font-size: 22px; color: #1e293b; margin-bottom: 8px; }
    .client-detail { font-size: 14px; color: #64748b; margin-bottom: 2px; }

    .object-box { font-size: 15px; color: #475569; background: #f8fafc; padding: 16px; border-radius: 6px; line-height: 1.5; }

    .table-wrapper { margin-bottom: 40px; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 12px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #1e293b; border-bottom: 2px solid #1e293b; text-align: center; }
    td { padding: 16px; font-size: 14px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #475569; }

    .footer-area { margin-top: 40px; }
    .totals-section { width: 320px; margin-left: auto; margin-bottom: 60px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; font-variant-numeric: tabular-nums; }
    .total-row.subt { color: #64748b; border-bottom: 1px solid #f1f5f9; }
    .total-row.grand { padding-top: 16px; border-bottom: 2px solid #1e293b; color: #1e293b; font-size: 20px; font-family: 'Playfair Display', serif; font-weight: 700; word-break: break-all; gap: 10px; }

    .signature-section { display: flex; justify-content: space-between; align-items: flex-end; }
    .sig-note { font-size: 12px; color: #94a3b8; font-style: italic; max-width: 250px; }
    .sig-block { text-align: center; width: 200px; }
    .sig-name { font-family: 'Playfair Display', serif; font-size: 24px; font-style: italic; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 8px; }
    .sig-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; }
    </style></head><body>${pagesHtml}</body></html>`;
}

// ==========================================
// STYLE 5: TECH
// ==========================================
function renderStyle5(data: InvoiceProps, dict: PdfDictionary, lang: string) {
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(data.items.length / itemsPerPage));

  const pagesHtml = Array.from({ length: totalPages })
    .map((_, i) => {
      const pageItems = data.items.slice(
        i * itemsPerPage,
        (i + 1) * itemsPerPage,
      );
      const isLast = i === totalPages - 1;

      return `<div class="page ${i > 0 ? "page-break" : ""}">
            <div class="content">
            ${
              i === 0
                ? `
            <div class="header">
                <div class="brand">
                    <div class="zap-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </div>
                    <span class="brand-name">SaaS.bill</span>
                </div>
                <div class="meta-tags">
                    <div class="tag">
                        <span class="label">${dict.reference}:</span>
                        <span class="val">${data.reference}</span>
                    </div>
                    <div class="date-tag">
                        ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                </div>
            </div>

            <div class="main-info">
                <div class="info-grid">
                    <div class="info-card">
                        <label>${dict.from}</label>
                        <div class="company">Company Inc.</div>
                        <div class="details">
                            123 Tech Boulevard<br>
                            San Francisco, CA<br>
                            ${data.city}
                        </div>
                    </div>
                    <div class="info-card">
                        <label>${dict.billedTo}</label>
                        <div class="company">${data.clientName}</div>
                        <div class="details">
                            ${data.clientAddress || ""}<br>
                            ${data.clientContact || ""}<br>
                            ${data.clientPOBox ? `${dict.poBox} ${data.clientPOBox}` : ""}
                        </div>
                    </div>
                </div>
                <div class="project-details">
                    <label>${dict.projectDetails}</label>
                    <div class="project-text">${data.object}</div>
                </div>
            </div>`
                : '<div style="height:40px"></div>'
            }

            <div class="table-container">
                <div class="table-head">
                    <div class="col-desc">${dict.description}</div>
                    <div class="col-unit">${dict.unit}</div>
                    <div class="col-qty">${dict.qty}</div>
                    <div class="col-price">${dict.unitPrice}</div>
                    <div class="col-total">${dict.total}</div>
                </div>
                <div class="table-body">
                    ${pageItems
                      .map(
                        (item) => `
                    <div class="table-row">
                        <div class="col-desc">
                            <div class="item-name">${item.designation}</div>
                        </div>
                        <div class="col-unit">${item.unit}</div>
                        <div class="col-qty">${item.quantity}</div>
                        <div class="col-price">${formatCurrency(item.unitPrice, data.currencyCode, lang)}</div>
                        <div class="col-total">${formatCurrency(item.totalPrice || item.quantity * item.unitPrice, data.currencyCode, lang)}</div>
                    </div>`,
                      )
                      .join("")}
                </div>
            </div>

            ${
              isLast
                ? `
            <div class="footer">
                <div class="signature-block">
                    <label>${dict.authorizedSignature}</label>
                    <div class="sig-name">${data.managerName}</div>
                </div>
                <div class="totals-block">
                    <div class="total-row">
                        <span>${dict.subtotal}</span>
                        <span>${formatCurrency(totalht, data.currencyCode, lang)}</span>
                    </div>
                    <div class="total-row">
                    <span class="label">${dict.totalMaterial}</span>
                    <span class="value">${totalmaterial}</span>
                    </div>
                    <div class="total-row grand">
                        <span>${dict.totalDue}</span>
                        <span class="grand-val">${formatCurrency(totalht, data.currencyCode, lang)}</span>
                    </div>
                </div>
            </div>`
                : ""
            }
            </div>
            <div class="page-num" style="position:absolute; bottom:24px; right:48px; font-size:10px; color:#a1a1aa;">${i + 1} / ${totalPages}</div>
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Dancing+Script:wght@600&display=swap');
    body { font-family: 'Inter', sans-serif; background: #f4f4f5; color: #18181b; margin: 0; }
    .page { width: 794px; min-height: 1123px; margin: 0 auto; background: #fff; position: relative; box-sizing: border-box; }
    .page-break { page-break-before: always; }

    .content { padding: 48px; }

    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 64px; }
    .brand { display: flex; align-items: center; gap: 8px; }
    .zap-icon { width: 32px; height: 32px; background: #18181b; color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 6px; }
    .brand-name { font-weight: 700; font-size: 18px; letter-spacing: -0.02em; }

    .meta-tags { display: flex; gap: 16px; align-items: center; font-size: 14px; font-weight: 500; color: #71717a; }
    .tag { background: #f4f4f5; padding: 4px 12px; border-radius: 6px; display: flex; gap: 4px; }
    .tag .val { color: #18181b; font-weight: 700; }

    .main-info { background: #fafafa; border-radius: 24px; padding: 32px; border: 1px solid #f4f4f5; margin-bottom: 48px; }
    .info-grid { display: flex; gap: 48px; padding-bottom: 24px; border-bottom: 1px solid #e4e4e7; margin-bottom: 24px; }
    .info-card { flex: 1; }
    label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa; display: block; margin-bottom: 12px; }
    .company { font-weight: 700; color: #18181b; margin-bottom: 4px; }
    .details { font-size: 14px; color: #71717a; line-height: 1.5; }

    .project-text { font-size: 15px; font-weight: 500; color: #3f3f46; }

    .table-head { background: #18181b; color: #fff; border-radius: 8px; display: flex; padding: 12px 16px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
    .table-row { display: flex; align-items: center; padding: 12px 16px; border: 1px solid #f4f4f5; border-radius: 8px; margin-bottom: 8px; font-size: 14px; }

    .col-desc { flex: 1; }
    .col-unit { width: 50px; text-align: center; color: #71717a; }
    .col-qty { width: 50px; text-align: center; font-weight: 600; background: #f4f4f5; border-radius: 6px; padding: 4px 0; margin: 0 4px; }
    .col-price { width: 110px; text-align: right; font-weight: 500; color: #71717a; }
    .col-total { width: 130px; text-align: right; font-weight: 700; color: #18181b; }

    .item-name { font-weight: 500; color: #18181b; }

    .footer { margin-top: 32px; padding-top: 32px; border-top: 1px solid #f4f4f5; display: flex; justify-content: space-between; align-items: flex-end; }
    .signature-block { width: 300px; }
    .sig-name { font-family: 'Dancing Script', cursive; font-size: 28px; color: #18181b; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px; margin-bottom: 8px; }

    .totals-block { width: 400px; font-variant-numeric: tabular-nums; }
    .total-row { display: flex; justify-content: space-between; font-size: 14px; color: #71717a; margin-bottom: 12px; }
    .total-row.grand { border-top: 1px solid #e4e4e7; padding-top: 16px; margin-top: 16px; color: #18181b; font-weight: 700; font-size: 24px; }
    .grand-val { font-size: 32px; font-weight: 800; word-break: break-all; text-align: right; margin-left: 10px; }
    </style></head><body>${pagesHtml}</body></html>`;
}
