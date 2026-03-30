import { translations, TranslationKey } from "@/src/lib/translations";
import { CURRENCY_SETTINGS } from "./currency";

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
  type?: "invoice" | "quote";
  companyName?: string;
  currencyCode?: string;
  language?: "fr" | "en";
};

type PdfDictionary = Partial<typeof translations.fr> & Record<string, string>;

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

const formatCurrency = (value: number, currency = "XOF", lang = "fr") => {
  const code = currency.toUpperCase();
  const config = CURRENCY_SETTINGS[code];
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  
  try {
    return new Intl.NumberFormat(config?.locale || locale, {
      style: "currency",
      currency: code,
      maximumFractionDigits: code === "XOF" || code === "XAF" ? 0 : 2,
    }).format(value);
  } catch {
    return `${value.toLocaleString(locale)} ${config?.symbol || code}`;
  }
};

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
function renderDefault(data: InvoiceProps, dict: PdfDictionary, lang: string) {
  const date = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US");
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const itemsFirstPage = 8;
  const itemsSubsequentPages = 15;

  // Pagination logic
  const allPages: InvoiceItem[][] = [];
  if (data.items.length <= itemsFirstPage) {
    allPages.push(data.items);
  } else {
    allPages.push(data.items.slice(0, itemsFirstPage));
    let currentPos = itemsFirstPage;
    while (currentPos < data.items.length) {
      allPages.push(
        data.items.slice(currentPos, currentPos + itemsSubsequentPages),
      );
      currentPos += itemsSubsequentPages;
    }
  }
  const totalPages = allPages.length;

  const pagesHtml = allPages
    .map((pageItems, pageIndex) => {
      const isLast = pageIndex === totalPages - 1;
      const remainingItems = data.items.slice(
        allPages.slice(0, pageIndex + 1).flat().length,
      );
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
    <div class="proforma-line" style="margin-top: 140px;">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <div style="font-size: 14px; font-weight: 500; color: #4b5563;">
          <span style="letter-spacing: 0.1em; color: #9ca3af; font-size: 10px;">REF:</span> ${data.reference}
        </div>
        ${data.companyName ? `<div style="font-size: 16px; font-weight: 700; color: #111;">${data.companyName}</div>` : ""}
      </div>
      <div style="text-align: right; display: flex; flex-direction: column; justify-content: flex-end;">
        <div style="font-size: 16px; font-weight: 600;">${data.city}</div>
        <div style="font-size: 11px; font-weight: 500; color: #6b7280; border-top: 1px solid #e5e7eb; pt: 4px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">
          ${dict.date} ${date}
        </div>
      </div>
    </div>

    <div class="address-container">
      <div class="address-header">
        <div class="address-title">${dict.billingAddress}</div>
        <div class="address-title">${dict.deliveryAddress}</div>
      </div>
      <div class="client-info">
        <div style="margin-bottom: 12px; display: flex; align-items: center;">
          <span class="label" style="width: 80px;">${dict.client} :</span>
          <span style="font-size: 18px; font-weight: 800; color: #000;">${data.clientName}</span>
        </div>
        ${data.clientAddress ? `<div style="margin-bottom: 8px; display: flex;"><span class="label" style="width: 80px;">${dict.address} :</span> <span style="font-weight: 500;">${data.clientAddress}</span></div>` : ""}
        <div style="display: flex; gap: 20px;">
          ${data.clientContact ? `<div style="margin-bottom: 8px; display: flex;"><span class="label" style="width: 80px;">${dict.contact} :</span> <span style="font-weight: 500;">${data.clientContact}</span></div>` : ""}
          ${data.clientPOBox ? `<div style="margin-bottom: 8px; display: flex;"><span class="label" style="width: 80px;">${dict.poBox} :</span> <span style="font-weight: 500;">${data.clientPOBox}</span></div>` : ""}
        </div>
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed #e5e7eb; display: flex; align-items: center;">
          <span class="label" style="width: 80px;">${dict.object} :</span>
          <span style="font-weight: 600; color: #111827;">${data.object}</span>
        </div>
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
      ${
        data.amountWords
          ? `
      <div style="margin-top: 20px; font-style: italic; color: #4b5563; width: 60%;">
        <span style="font-weight: bold; text-transform: uppercase; font-size: 10px; display: block; margin-bottom: 4px; color: #9ca3af;">${dict.amountWords}</span>
        <div style="font-size: 13px; color: #1f2937; line-height: 1.4;">${data.amountWords}</div>
      </div>`
          : ""
      }
      <table class="totals">
        <tr><td>${dict.totalMaterial}</td><td>${totalmaterial}</td></tr>
        <tr><td>${dict.totalHT}</td><td>${formatCurrency(totalht, data.currencyCode, lang)}</td></tr>
        <tr><td style="text-align:center; padding-top:12px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#9ca3af; border-top: 1px dashed #e5e7eb;">${dict.manager}</td><td style="text-align:center; padding-top:12px; font-weight:bold; font-size:14px; border-top: 1px dashed #e5e7eb;">${data.managerName}</td></tr>
      </table>`
          : ""
      }
    </div>
    <div class="pageNumber">${pageIndex + 1} / ${totalPages}</div>
  </div>`;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<style>
  body { margin: 0; padding: 0; background: #fff; font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 12px; color: #000; }
  @page { size: A4; margin: 0; }
  .page { width: 794px; height: 1122px; margin: 0 auto; background: #fff; padding: 40px 30px; box-sizing: border-box; position: relative; overflow: hidden; }
  .page-break { page-break-before: always; }
  .pageNumber { position: absolute; bottom: 24px; right: 48px; font-size: 12px; font-weight: 500; color: #4b5563; }
  .proforma-line { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 30px; }
  .address-container { border: 1px solid #000; background: #fff; }
  .address-header { display: flex; border-bottom: 1px solid #000; height: 35px; font-size: 14px; }
  .address-title { width: 50%; padding: 10px; font-weight: 800; border-right: 1px solid #000; text-transform: uppercase; letter-spacing: 0.1em; background: #fff; color: #475569; }
  .address-title:last-child { border-right: none; }
  .client-info { padding: 20px; }
  .client-info p { margin-bottom: 10px; font-size: 16px; line-height: 1.5; color: #1e293b; }
  .client-info .label { color: #94a3b8; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  table { width: 100%; border-collapse: collapse; margin-top: 15px; }
  th, td { border: 1px solid #000; padding: 10px 8px; font-size: 12px; }
  th { font-weight: bold; text-align: center; font-size: 15px; background: #f3f4f6; text-transform: uppercase; letter-spacing: 0.02em; }
  .totals { width: 40%; margin-left: auto; margin-top: 10px; background-color: #f9fafb; }
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
  const itemsFirstPage = 10;
  const itemsSubsequentPages = 16;

  // Pagination logic
  const allPages: InvoiceItem[][] = [];
  if (data.items.length <= itemsFirstPage) {
    allPages.push(data.items);
  } else {
    allPages.push(data.items.slice(0, itemsFirstPage));
    let currentPos = itemsFirstPage;
    while (currentPos < data.items.length) {
      allPages.push(
        data.items.slice(currentPos, currentPos + itemsSubsequentPages),
      );
      currentPos += itemsSubsequentPages;
    }
  }
  const totalPages = allPages.length;

  const pagesHtml = allPages
    .map((pageItems, pageIndex) => {
      const isLast = pageIndex === totalPages - 1;

      return `
    <div class="page ${pageIndex > 0 ? "page-break" : ""}">
      ${
        pageIndex === 0
          ? `
      <div class="header">
          <div class="logo-section">
              <h1>${data.type === "quote" ? dict.proforma : dict.invoice}</h1>
              <div class="ref-row"><span class="label">${dict.reference}:</span> <span class="value">${data.reference}</span></div>
          </div>
          <div class="date-section">
              <div class="city">${data.city}</div>
              <div class="date">${new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}</div>
              ${data.companyName ? `<div style="margin-top: 10px; font-size: 16px; font-weight: 700;">${data.companyName}</div>` : ""}
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
            <div class="footer-bottom" style="display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; margin-bottom: 40px;">
                <div style="flex: 1; margin-bottom: 10px;">
                    ${
                      data.amountWords
                        ? `
                    <div style="font-style: italic; color: #64748b; margin-top: 10px;">
                        <span style="font-weight: 700; text-transform: uppercase; font-size: 10px; display: block; margin-bottom: 5px; color: #94a3b8; letter-spacing: 0.05em;">${dict.amountWords}</span>
                        <div style="font-size: 13px; color: #334155; line-height: 1.4; border-left: 2px solid #f1f5f9; padding-left: 10px;">${data.amountWords}</div>
                    </div>`
                        : ""
                    }
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
                    <div style="margin-top: 16px; text-align: center; border-top: 1px dashed #e2e8f0; padding-top: 16px;">
                        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 8px;">${dict.authorizedSignature}</div>
                        <div class="sig-name" style="font-size: 22px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; display: inline-block; min-width: 180px;">${data.managerName}</div>
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
    @page { size: A4; margin: 0; }
    body { margin: 0; background: #fff; font-family: 'Inter', sans-serif; color: #334155; }
    .page { width: 794px; height: 1122px; margin: 0 auto; background: #fff; position: relative; overflow: hidden; }
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

    .footer-totals { padding: 48px 0 32px 0; margin-top: 16px; }
    .footer-bottom { margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 48px 80px 48px; gap: 40px; }
    .signature-area { flex: 1; text-align: left; }
    .sig-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 32px; }
    .sig-name { font-family: 'Inter', cursive; font-size: 24px; font-style: italic; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; display: inline-block; min-width: 200px; }

    .totals-section { min-width: 320px; max-width: 50%; font-variant-numeric: tabular-nums; }
    .total-row { display: flex; justify-content: space-between; padding: 12px 0; font-size: 14px; gap: 20px; }
    .total-row.subt { color: #64748b; border-bottom: 1px solid #f1f5f9; }
    .total-row.grand { padding-top: 20px; color: #1e293b; font-size: 20px; font-weight: 700; border-bottom: 2px solid #1e293b; }
    .grand-val { font-size: 24px; word-break: break-all; text-align: right; }

    .page-num { position: absolute; bottom: 24px; right: 48px; font-size: 12px; color: #cbd5e1; }
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
  const itemsFirstPage = 14;
  const itemsSubsequentPages = 16;

  // Pagination logic
  const allPages: InvoiceItem[][] = [];
  if (data.items.length <= itemsFirstPage) {
    allPages.push(data.items);
  } else {
    allPages.push(data.items.slice(0, itemsFirstPage));
    let currentPos = itemsFirstPage;
    while (currentPos < data.items.length) {
      allPages.push(
        data.items.slice(currentPos, currentPos + itemsSubsequentPages),
      );
      currentPos += itemsSubsequentPages;
    }
  }
  const totalPages = allPages.length;

  const pagesHtml = allPages
    .map((pageItems, i) => {
      const isLast = i === totalPages - 1;

      return `<div class="page ${i > 0 ? "page-break" : ""}">
       ${
         i === 0
           ? `
         <div class="header-band">
             <div class="logo-container">
                 <div class="logo-circle"></div>
             </div>
             ${data.companyName ? `<h2 class="company-name">${data.companyName}</h2>` : ""}
         </div>
         <div class="header-main">
             <div class="left">
                 <h1 class="title">${data.type === "quote" ? dict.proforma : dict.invoice}</h1>
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
                  <div class="footer-layout" style="display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 40px;">
                    <div style="flex: 1; margin-right: 40px;">
                        ${
                          data.amountWords
                            ? `
                        <div style="font-style: italic; color: #64748b; margin-bottom: 20px;">
                            <span style="font-weight: 700; text-transform: uppercase; font-size: 10px; display: block; margin-bottom: 8px; color: #1e3a8a; letter-spacing: 0.1em; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">${dict.amountWords}</span>
                            <div style="font-size: 13px; color: #374151; line-height: 1.5;">${data.amountWords}</div>
                        </div>`
                            : ""
                        }
                    </div>
                    <div class="totals-area">
                        <div class="total-row subt"><span>${dict.totalMaterial}</span> <span>${totalmaterial}</span></div>
                        <div class="total-row subt"><span>${dict.subtotal}</span> <span>${formatCurrency(totalht, data.currencyCode, lang)}</span></div>
                        <div class="total-row grand"><span>${dict.totalDue}</span> <span>${formatCurrency(totalht, data.currencyCode, lang)}</span></div>
                        <div style="margin-top: 16px; text-align: center; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 16px;">
                            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.6); margin-bottom: 8px;">${dict.authorizedSignature}</div>
                            <div style="font-size: 20px; font-style: italic; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px; display: inline-block; min-width: 180px;">${data.managerName}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer-bar"></div>`
              : `<div class="footer-bar" style="position:absolute; bottom:0;"></div>`
          }
         <div class="page-num" style="position:absolute; bottom:24px; right:48px; font-size:10px; color:#9ca3af; z-index:20;">${i + 1} / ${totalPages}</div>
       </div>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap');
    @page { size: A4; margin: 0; }
    body { font-family: 'Merriweather', serif; background: #fff; color: #374151; }
    .page { width: 794px; height: 1122px; margin: 0 auto; background: white; padding: 0; position: relative; overflow: hidden; }
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
    .footer-layout { margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 40px 80px 40px; gap: 40px; }
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
  const itemsFirstPage = 7;
  const itemsSubsequentPages = 9;

  // Pagination logic
  const allPages: InvoiceItem[][] = [];
  if (data.items.length <= itemsFirstPage) {
    allPages.push(data.items);
  } else {
    allPages.push(data.items.slice(0, itemsFirstPage));
    let currentPos = itemsFirstPage;
    while (currentPos < data.items.length) {
      allPages.push(
        data.items.slice(currentPos, currentPos + itemsSubsequentPages),
      );
      currentPos += itemsSubsequentPages;
    }
  }
  const totalPages = allPages.length;

  // Visual decorations
  const bgDecor = `
        <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: #fb923c; opacity: 0.15; border-bottom-left-radius: 200px; z-index: 0;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 300px; height: 300px; background: #a855f7; opacity: 0.15; border-top-right-radius: 200px; z-index: 0;"></div>
    `;

  const pagesHtml = allPages
    .map((pageItems, i) => {
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
                        ${data.companyName ? `<span>${data.companyName}</span>` : ""}
                    </div>
                    <div class="sub-meta">
                        <span class="city">${data.city}</span>
                        <span class="date">${date}</span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <h1 class="main-title">${data.type === "quote" ? dict.proforma : dict.invoice}</h1>
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
                : '<div style="height: 60px;"></div>'
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
            <div class="footer" style="display: flex; flex-direction: column; align-items: flex-end; gap: 40px; margin-top: 40px; width: 100%; padding-bottom: 80px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%;">
                    <div style="flex: 1; padding-right: 32px;">
                        ${
                          data.amountWords
                            ? `
                        <div style="font-style: italic; margin-bottom: 20px;">
                            <span style="font-weight: 800; text-transform: uppercase; font-size: 10px; display: block; margin-bottom: 6px; color: #a855f7; letter-spacing: 0.05em;">${dict.amountWords}</span>
                            <div style="font-size: 13px; color: #4b5563; line-height: 1.4; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px;">${data.amountWords}</div>
                        </div>`
                            : ""
                        }
                    </div>
    
                    <div class="summary-card">
                        <div class="sum-left">
                            <div class="label">${dict.totalMaterial}</div>
                            <div class="val">${totalmaterial}</div>
                        </div>
                        <div class="sum-right">
                             <div class="label">${dict.totalDue}</div>
                             <div class="val-lg">${formatCurrency(totalht, data.currencyCode, lang)}</div>
                             <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 10px;">
                                 <div class="label">${dict.authorizedSignature}</div>
                                 <div class="sig" style="font-family: 'Caveat', cursive; font-size: 26px; color: #fb923c; line-height: 1;">${data.managerName}</div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>`
                : ""
            }
        </div>
        <div class="page-num" style="position:absolute; bottom:24px; right:48px; font-size:10px; color:#9ca3af; z-index:20;">${i + 1} / ${totalPages}</div>
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Caveat:wght@700&display=swap');
        @page { size: A4; margin: 0; }
        body { margin: 0; background: #fff; font-family: 'Outfit', sans-serif; color: #1f2937; }
        .page { width: 794px; height: 1122px; margin: 0 auto; background: white; padding: 0; position: relative; box-sizing: border-box; overflow: hidden; }
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

        .footer { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; width: 100%; padding-bottom: 80px; }
        .summary-card { background: #1e293b; color: white; padding: 24px 32px; border-radius: 20px; width: 400px; display: flex; justify-content: space-between; gap: 20px; box-shadow: 0 20px 40px -10px rgba(126, 34, 206, 0.3); position: relative; overflow: hidden; font-variant-numeric: tabular-nums; }
        .summary-card::before { content: ''; position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%; }

        .label { font-size: 10px; font-weight: 700; opacity: 0.7; letter-spacing: 0.05em; margin-bottom: 4px; }
        .val { font-size: 20px; font-weight: 700; }
        .val-lg { font-size: 32px; font-weight: 800; color: #fb923c; word-break: break-all; }
        .sum-right { text-align: right; }

        .signature-block { text-align: left; width: 250px; }
        .sig { font-family: 'Caveat', cursive; font-size: 32px; color: #7e22ce; margin-bottom: 4px; line-height: 1; }
        .signature-block .label { color: #9ca3af; letter-spacing: 0.2em; font-size: 10px; }
    </style></head><body>${pagesHtml}</body></html>`;
}

// ==========================================
// STYLE 4: CLASSIC
// ==========================================
function renderStyle4(data: InvoiceProps, dict: PdfDictionary, lang: string) {
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const itemsFirstPage = 10;
  const itemsSubsequentPages = 16;

  // Pagination logic
  const allPages: InvoiceItem[][] = [];
  if (data.items.length <= itemsFirstPage) {
    allPages.push(data.items);
  } else {
    allPages.push(data.items.slice(0, itemsFirstPage));
    let currentPos = itemsFirstPage;
    while (currentPos < data.items.length) {
      allPages.push(
        data.items.slice(currentPos, currentPos + itemsSubsequentPages),
      );
      currentPos += itemsSubsequentPages;
    }
  }
  const totalPages = allPages.length;

  const pagesHtml = allPages
    .map((pageItems, i) => {
      const isLast = i === totalPages - 1;

      return `<div class="page ${i > 0 ? "page-break" : ""}">
            <div class="top-accent"></div>
            <div class="inner-content">
            ${
              i === 0
                ? `
            <div class="header">
                <div class="header-left">
                    <h1 class="main-title">${data.type === "quote" ? dict.proforma : dict.invoice}</h1>
                    <div class="ref-row">
                        <span class="ref-label">${dict.reference}:</span>
                        <span class="ref-value">${data.reference}</span>
                    </div>
                </div>
                <div class="header-right">
                    ${data.companyName ? `<div class="company-name">${data.companyName}</div>` : ""}
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
            <div class="footer-area" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 40px;">
                <div style="flex: 1;">
                    ${
                      data.amountWords
                        ? `
                    <div style="font-style: italic; color: #64748b; margin-top: 10px;">
                        <span style="font-weight: 700; text-transform: uppercase; font-size: 10px; display: block; margin-bottom: 5px; color: #94a3b8; letter-spacing: 0.1em; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">${dict.amountWords}</span>
                        <div style="font-size: 13px; color: #334155; line-height: 1.4; font-family: 'Playfair Display', serif;">${data.amountWords}</div>
                    </div>`
                        : ""
                    }
                </div>
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
                    <div style="margin-top: 16px; text-align: center; border-top: 1px dashed #e2e8f0; padding-top: 16px;">
                        <div class="sig-label">${dict.authorizedSignature}</div>
                        <div class="sig-name" style="margin-top: 8px;">${data.managerName}</div>
                    </div>
                </div>
            </div>`
                : ""
            }
            </div>
            <div class="page-num" style="position:absolute; bottom:24px; right:48px; font-size:10px; color:#94a3b8;">${i + 1} / ${totalPages}</div>
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');
    @page { size: A4; margin: 0; }
    body { font-family: 'Inter', sans-serif; background: #fff; color: #334155; margin: 0; }
    .page { width: 794px; height: 1122px; margin: 0 auto; background: #fff; position: relative; overflow: hidden; }
    .page-break { page-break-before: always; }

    .top-accent { height: 8px; background: #1e293b; width: 100%; }

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

    .footer-area { margin-top: 40px; padding-bottom: 80px; }
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
  const itemsFirstPage = 10;
  const itemsSubsequentPages = 16;

  // Pagination logic
  const allPages: InvoiceItem[][] = [];
  if (data.items.length <= itemsFirstPage) {
    allPages.push(data.items);
  } else {
    allPages.push(data.items.slice(0, itemsFirstPage));
    let currentPos = itemsFirstPage;
    while (currentPos < data.items.length) {
      allPages.push(
        data.items.slice(currentPos, currentPos + itemsSubsequentPages),
      );
      currentPos += itemsSubsequentPages;
    }
  }
  const totalPages = allPages.length;

  const pagesHtml = allPages
    .map((pageItems, i) => {
      const isLast = i === totalPages - 1;

      return `<div class="page ${i > 0 ? "page-break" : ""}">
            <div class="content">
            ${
              i === 0
                ? `
            <div class="header">
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
                        ${data.companyName ? `<div class="company">${data.companyName}</div>` : ""}
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
            <div class="footer" style="display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; margin-top: 40px; margin-bottom: 40px;">
                <div style="flex: 1; padding-bottom: 10px;">
                    ${
                      data.amountWords
                        ? `
                    <div style="margin-top: 20px; font-style: italic;">
                        <label style="color: #a1a1aa; font-size: 10px; display: block; margin-bottom: 5px;">${dict.amountWords}</label>
                        <div style="font-size: 13px; color: #3f3f46; line-height: 1.4; border-left: 2px solid #18181b; padding-left: 12px; margin-top: 4px;">${data.amountWords}</div>
                    </div>`
                        : ""
                    }
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
                    <div style="margin-top: 20px; text-align: center; border-top: 1px dashed #e4e4e7; padding-top: 16px;">
                        <label style="display: block; margin-bottom: 10px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa;">${dict.authorizedSignature}</label>
                        <div class="sig-name" style="font-size: 24px; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px; display: inline-block; min-width: 200px;">${data.managerName}</div>
                    </div>
                </div>
            </div>`
                : ""
            }

        </div>
        <div style="position:absolute; bottom:24px; right:48px; font-size:10px; color:#a1a1aa;">${i + 1} / ${totalPages}</div>
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Dancing+Script:wght@600&display=swap');
    @page { size: A4; margin: 0; }
    body { font-family: 'Inter', sans-serif; background: #fff; color: #18181b; margin: 0; }
    .page { width: 794px; height: 1122px; margin: 0 auto; background: #fff; position: relative; box-sizing: border-box; overflow: hidden; }
    .page-break { page-break-before: always; }

    .content { padding: 48px; }

    .header { display: flex; justify-content: flex-end; align-items: center; margin-bottom: 64px; }

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

    .table-head { background: #18181b; color: #fff; border-radius: 8px; display: flex; padding: 12px 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
    .table-row { display: flex; align-items: center; padding: 16px 20px; border: 1px solid #f4f4f5; border-radius: 8px; margin-bottom: 12px; font-size: 14px; }

    .col-desc { flex: 1; min-width: 0; }
    .col-unit { width: 50px; text-align: center; color: #71717a; }
    .col-qty { width: 60px; text-align: center; font-weight: 600; border-radius: 6px; padding: 4px 0; margin: 0 4px; }
    .table-body .col-qty { background: #f4f4f5; }
    .col-price { width: 130px; text-align: right; font-weight: 500; color: #71717a; }
    .col-total { width: 160px; text-align: right; font-weight: 700; color: #18181b; }

    .item-name { font-weight: 500; color: #18181b; }

    .footer { margin-top: 32px; padding-top: 32px; border-top: 1px solid #f4f4f5; display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 80px; }
    .signature-block { width: 300px; }
    .sig-name { font-family: 'Dancing Script', cursive; font-size: 28px; color: #18181b; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px; margin-bottom: 8px; }

    .totals-block { width: 400px; font-variant-numeric: tabular-nums; }
    .total-row { display: flex; justify-content: space-between; font-size: 14px; color: #71717a; margin-bottom: 12px; }
    .total-row.grand { border-top: 1px solid #e4e4e7; padding-top: 16px; margin-top: 16px; color: #18181b; font-weight: 700; font-size: 20px; }
    .grand-val { font-size: 24px; font-weight: 800; word-break: break-all; text-align: right; margin-left: 10px; }
    </style></head><body>${pagesHtml}</body></html>`;
}

// ==========================================
// STYLE 6: IMPACT
// ==========================================
function renderStyle6(data: InvoiceProps, dict: PdfDictionary, lang: string) {
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const itemsFirstPage = 10;
  const itemsSubsequentPages = 16;

  // Pagination logic
  const allPages: InvoiceItem[][] = [];
  if (data.items.length <= itemsFirstPage) {
    allPages.push(data.items);
  } else {
    allPages.push(data.items.slice(0, itemsFirstPage));
    let currentPos = itemsFirstPage;
    while (currentPos < data.items.length) {
      allPages.push(
        data.items.slice(currentPos, currentPos + itemsSubsequentPages),
      );
      currentPos += itemsSubsequentPages;
    }
  }
  const totalPages = allPages.length;

  const pagesHtml = allPages
    .map((pageItems, i) => {
      const isLast = i === totalPages - 1;

      return `<div class="page ${i > 0 ? "page-break" : ""}">
            <div class="content" style="padding: 48px; height: 100%; display: flex; flex-direction: column; position: relative; background: #fff; box-sizing: border-box;">
                ${
                  i === 0
                    ? `
                <div class="header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                    <div>
                        <h1 style="font-size: 72px; font-weight: 800; margin: 0; line-height: 1; letter-spacing: -4px; text-transform: uppercase;">${data.type === "quote" ? dict.proforma : dict.invoice}</h1>
                        <div style="display: flex; gap: 10px; margin-top: 15px;">
                            <div style="border: 1px solid #000; padding: 4px 15px; border-radius: 20px; font-size: 13px; font-weight: 600;">${data.type === "quote" ? dict.proforma : dict.invoice} n°${data.reference}</div>
                            <div style="border: 1px solid #000; padding: 4px 15px; border-radius: 20px; font-size: 13px; font-weight: 600;">${new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}</div>
                        </div>
                    </div>

                </div>
                <div style="height: 1px; background: #e5e7eb; width: 100%; margin: 30px 0;"></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 40px; font-size: 14px;">
                    <div style="width: 50%;">
                        ${data.companyName ? `<div style="font-weight: 800; font-size: 20px; margin-bottom: 8px;">${data.companyName}</div>` : ""}
                        <div style="color: #666; line-height: 1.5;">Abidjan, Côte d'Ivoire<br>contact@essor.ci<br>+225 01 02 03 04 05</div>
                    </div>
                    <div style="width: 50%; text-align: right;">
                        <div style="font-weight: 800; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${dict.billedTo}</div>
                        <div style="font-weight: 800; font-size: 20px; margin-bottom: 5px;">${data.clientName}</div>
                        <div style="color: #666; line-height: 1.5;">${data.clientAddress || ""}<br>${data.clientContact || ""}<br>${data.clientPOBox || ""}</div>
                    </div>
                </div>
                <div style="margin-bottom: 30px;">
                    <div style="font-weight: 800; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">${dict.object}</div>
                    <div style="font-weight: 600; color: #333;">${data.object}</div>
                </div>`
                    : '<div style="height: 40px;"></div>'
                }

                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead style="background: #000; color: #fff;">
                        <tr>
                            <th style="padding: 12px 15px; text-align: left; font-size: 11px; font-weight: 800; text-transform: uppercase;">${dict.description}</th>
                            <th style="padding: 12px 15px; text-align: center; font-size: 11px; font-weight: 800; text-transform: uppercase;">${dict.price}</th>
                            <th style="padding: 12px 15px; text-align: center; font-size: 11px; font-weight: 800; text-transform: uppercase;">${dict.qty}</th>
                            <th style="padding: 12px 15px; text-align: right; font-size: 11px; font-weight: 800; text-transform: uppercase;">${dict.total}</th>
                        </tr>
                    </thead>
                    <tbody style="border: 1px solid #eee;">
                        ${pageItems
                          .map(
                            (item) => `
                        <tr style="border-bottom: 1px solid #f9f9f9;">
                            <td style="padding: 15px; font-size: 14px; font-weight: 600; vertical-align: top;">${item.designation}</td>
                            <td style="padding: 15px; font-size: 14px; text-align: center; vertical-align: top;">${formatCurrency(item.unitPrice, data.currencyCode, lang)}</td>
                            <td style="padding: 15px; font-size: 14px; text-align: center; vertical-align: top;">${item.quantity}</td>
                            <td style="padding: 15px; font-size: 14px; text-align: right; font-weight: 700; vertical-align: top;">${formatCurrency(item.totalPrice || item.quantity * item.unitPrice, data.currencyCode, lang)}</td>
                        </tr>`,
                          )
                          .join("")}
                    </tbody>
                </table>

                ${
                  isLast
                    ? `
                <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; gap: 40px;">
                    <div style="flex: 1; padding-bottom: 10px;">
                        ${
                          data.amountWords
                            ? `
                        <div style="font-style: italic;">
                            <span style="font-weight: 800; color: #999; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; display: block; margin-bottom: 5px;">${dict.amountWords}</span>
                            <div style="font-size: 13px; color: #333; line-height: 1.4; border-bottom: 1px solid #eee; padding-bottom: 8px;">${data.amountWords}</div>
                        </div>`
                            : ""
                        }
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end;">
                    <div style="display: flex; justify-content: space-between; width: 250px; font-size: 14px; margin-bottom: 10px;">
                        <span style="font-weight: 800; color: #999; text-transform: uppercase;">${dict.subtotal} :</span>
                        <span style="font-weight: 800;">${formatCurrency(totalht, data.currencyCode, lang)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 250px; font-size: 14px; margin-bottom: 20px;">
                        <span style="font-weight: 800; color: #999; text-transform: uppercase;">TVA (0%) :</span>
                        <span style="font-weight: 800;">${formatCurrency(0, data.currencyCode, lang)}</span>
                    </div>
                    <div style="background: #000; color: #fff; width: 100%; padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; border-radius: 10px;">
                        <span style="font-weight: 800; font-size: 20px; text-transform: uppercase;">TOTAL :</span>
                        <span style="font-weight: 900; font-size: 32px;">${formatCurrency(totalht, data.currencyCode, lang)}</span>
                    </div>
                    <div style="margin-top: 20px; text-align: center; width: 100%; border-top: 1px dashed #e5e7eb; padding-top: 16px;">
                        <div style="font-size: 11px; font-weight: 800; color: #999; text-transform: uppercase; margin-bottom: 10px;">${dict.manager}</div>
                        <div style="font-weight: 800; font-size: 24px; border-bottom: 1px solid #eee; padding-bottom: 10px; min-width: 200px; display: inline-block;">${data.managerName}</div>
                    </div>
                </div>`
                    : ""
                }
            </div>
            <div style="position: absolute; bottom: 24px; right: 48px; font-size: 10px; color: #aaa;">${dict.page} ${i + 1} / ${totalPages}</div>
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
    @page { size: A4; margin: 0; }
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: #fff; }
    .page { width: 794px; height: 1122px; margin: 0 auto; background: #fff; position: relative; box-sizing: border-box; overflow: hidden; }
    .page-break { page-break-before: always; }
    </style></head><body>${pagesHtml}</body></html>`;
}

// ==========================================
// STYLE 7: SUMMIT
// ==========================================
function renderStyle7(data: InvoiceProps, dict: PdfDictionary, lang: string) {
  const { totalht, totalmaterial } = calculateTotals(data.items);
  const itemsFirstPage = 10;
  const itemsSubsequentPages = 16;

  // Pagination logic
  const allPages: InvoiceItem[][] = [];
  if (data.items.length <= itemsFirstPage) {
    allPages.push(data.items);
  } else {
    allPages.push(data.items.slice(0, itemsFirstPage));
    let currentPos = itemsFirstPage;
    while (currentPos < data.items.length) {
      allPages.push(
        data.items.slice(currentPos, currentPos + itemsSubsequentPages),
      );
      currentPos += itemsSubsequentPages;
    }
  }
  const totalPages = allPages.length;

  const pagesHtml = allPages
    .map((pageItems, i) => {
      const isLast = i === totalPages - 1;

      return `<div class="page ${i > 0 ? "page-break" : ""}">
            <div class="content" style="height: 100%; display: flex; flex-direction: column; position: relative; box-sizing: border-box;">
                <div style="background: #111; color: #fff; height: 100px; display: flex; align-items: center; justify-content: space-between; padding: 0 48px;">
                    <h1 style="font-size: 42px; font-weight: 900; letter-spacing: 4px; margin: 0; text-transform: uppercase;">${data.type === "quote" ? dict.proforma : dict.invoice}</h1>
                    ${data.companyName ? `<div style="font-size: 20px; font-weight: bold;">${data.companyName}</div>` : ""}
                </div>

                <div style="padding: 48px; flex: 1;">
                ${
                  i === 0
                    ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 50px;">
                        <div style="width: 50%;">
                            <div style="font-size: 11px; font-weight: 800; color: #aaa; text-transform: uppercase; margin-bottom: 15px;">${lang === "fr" ? "À L'ATTENTION DE" : "INVOICE TO"} :</div>
                            <div style="font-size: 28px; font-weight: 900; margin-bottom: 10px;">${data.clientName}</div>
                            <div style="font-size: 14px; color: #666; line-height: 1.5;">${data.clientAddress || ""}<br>${data.clientContact || ""}<br>${data.clientPOBox || ""}</div>
                        </div>
                        <div style="width: 50%; text-align: right;">
                            <div style="font-size: 11px; font-weight: 800; color: #aaa; text-transform: uppercase; margin-bottom: 5px;">${lang === "fr" ? "TOTAL DÛ" : "TOTAL DUE"}</div>
                            <div style="font-size: 36px; font-weight: 900; margin-bottom: 25px;">${formatCurrency(totalht, data.currencyCode, lang)}</div>
                            <div style="font-size: 14px; color: #666;">
                                <div style="margin-bottom: 3px;"><span style="font-weight: 800; color: #333;">${dict.reference} :</span> ${data.reference}</div>
                                <div><span style="font-weight: 800; color: #333;">${dict.date} :</span> ${new Date().toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>`
                    : '<div style="height: 40px;"></div>'
                }

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <thead style="background: #111; color: #fff;">
                            <tr>
                                <th style="padding: 10px 15px; text-align: left; font-size: 12px; font-weight: 800; text-transform: uppercase;">${lang === "fr" ? "PRODUITS" : "PRODUCTS"}</th>
                                <th style="padding: 10px 15px; text-align: center; font-size: 12px; font-weight: 800; text-transform: uppercase;">${dict.qty}</th>
                                <th style="padding: 10px 15px; text-align: center; font-size: 12px; font-weight: 800; text-transform: uppercase;">${dict.price}</th>
                                <th style="padding: 10px 15px; text-align: right; font-size: 12px; font-weight: 800; text-transform: uppercase;">${dict.total}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pageItems
                              .map(
                                (item) => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 15px; font-size: 14px; font-weight: 800;">${item.designation}</td>
                                <td style="padding: 15px; font-size: 14px; text-align: center;">${item.quantity}</td>
                                <td style="padding: 15px; font-size: 14px; text-align: center; color: #666;">${formatCurrency(item.unitPrice, data.currencyCode, lang)}</td>
                                <td style="padding: 15px; font-size: 14px; text-align: right; font-weight: 800;">${formatCurrency(item.totalPrice || item.quantity * item.unitPrice, data.currencyCode, lang)}</td>
                            </tr>`,
                              )
                              .join("")}
                        </tbody>
                    </table>

                    ${
                      isLast
                        ? `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; gap: 30px;">
                        <div style="flex: 1;">
                            <div style="font-size: 11px; font-weight: 800; color: #aaa; text-transform: uppercase; margin-bottom: 15px;">${lang === "fr" ? "MODE DE PAIEMENT" : "PAYMENT METHOD"} :</div>
                            <div style="font-size: 14px; line-height: 1.8; margin-bottom: 20px;">
                                <div><span style="color: #999;">${lang === "fr" ? "Banque" : "Bank Name"} :</span> <span style="font-weight: 800; font-style: italic;">Société Générale</span></div>
                                <div><span style="color: #999;">${lang === "fr" ? "Compte" : "Bank Account"} :</span> <span style="font-weight: 800; font-style: italic; text-decoration: underline;">1234567890</span></div>
                            </div>

                            ${
                              data.amountWords
                                ? `
                            <div style="font-style: italic;">
                                <div style="font-size: 11px; font-weight: 800; color: #aaa; text-transform: uppercase; margin-bottom: 8px;">${dict.amountWords} :</div>
                                <div style="font-size: 13px; color: #333; line-height: 1.4; border-left: 3px solid #111; padding-left: 12px;">${data.amountWords}</div>
                            </div>`
                                : ""
                            }
                        </div>
                        <div style="width: 40%; background: #f9f9f9; padding: 25px; border: 1px solid #eee;">
                            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px;">
                                <span style="color: #666; text-transform: uppercase;">${dict.subtotal} :</span>
                                <span style="font-weight: 800;">${formatCurrency(totalht, data.currencyCode, lang)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 15px;">
                                <span style="color: #666; text-transform: uppercase;">TAX :</span>
                                <span style="font-weight: 800;">${formatCurrency(0, data.currencyCode, lang)}</span>
                            </div>
                            <div style="height: 1px; background: #ddd; margin-bottom: 15px;"></div>
                            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 900;">
                                <span>${dict.total} :</span>
                                <span>${formatCurrency(totalht, data.currencyCode, lang)}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div style="font-size: 28px; font-weight: 900; text-transform: uppercase; margin-bottom: 40px;">${lang === "fr" ? "Merci pour votre achat !" : "Thank you for purchase!"}</div>
                        <div style="display: flex; justify-content: flex-end; padding-bottom: 80px;">
                            <div style="text-align: center; width: 200px;">
                                <div style="font-size: 24px; font-weight: 900; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 10px;">${data.managerName}</div>
                                <div style="font-size: 11px; font-weight: 800; color: #aaa; text-transform: uppercase;">${dict.manager}</div>
                            </div>
                        </div>
                    </div>`
                        : ""
                    }
                </div>

                <div style="height: 60px; background: #111; position: relative; overflow: hidden;">
                    <div style="position: absolute; left: 40px; bottom: 0; width: 150px; height: 100px; background: #222; transform: rotate(45deg) translateY(50%); border-radius: 10px;"></div>
                    <div style="position: absolute; left: 80px; bottom: 0; width: 100px; height: 70px; background: #333; transform: rotate(-12deg) translateY(20%); border-radius: 10px;"></div>
                </div>
            </div>
            <div style="position: absolute; bottom: 24px; right: 48px; font-size: 10px; color: #aaa;">${dict.page} ${i + 1} / ${totalPages}</div>
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
    @page { size: A4; margin: 0; }
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: #fff; }
    .page { width: 794px; height: 1122px; margin: 0 auto; background: #fff; position: relative; box-sizing: border-box; overflow: hidden; }
    .page-break { page-break-before: always; }
    </style></head><body>${pagesHtml}</body></html>`;
}
