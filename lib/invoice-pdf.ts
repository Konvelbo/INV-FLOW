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
  object: string;
  items: InvoiceItem[];
  totalHT: number;
  totalMaterial: number;
  ManagerName: string;
  amountWords: string;
};

// reference: "REF2025/000215",
//         city: city,
//         clientName: clientName,
//         object: object,
//         managerName: managerName,
//         totalHT: totalHT,
//         totalMaterial: totalMaterial,
//         amountWords: amountWords,
//         items: itemsArr,

export function invoiceTemplate(data: {
  reference: string;
  city: string;
  clientName: string;
  object: string;
  items: InvoiceItem[];
  totalHT: number;
  totalMaterial: number;
  managerName: string;
  amountWords: string;
}) {
  const date = new Date().toLocaleDateString("fr-FR");
  const totalPrice = (item: InvoiceItem) => {
    return item.quantity * item.unitPrice;
  };
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(value);

  const totalht = data.items.reduce((sum, item) => sum + totalPrice(item), 0);
  const totalmaterial = data.items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  // Pagination helper: split items across pages (itemsPerPage per page)
  const itemsPerPage = 14;
  const totalPages = Math.max(1, Math.ceil(data.items.length / itemsPerPage));
  const getPageItems = (pageIndex: number) =>
    data.items.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

  const pagesHtml = Array.from({ length: totalPages })
    .map((_, pageIndex) => {
      const pageItems = getPageItems(pageIndex);
      const isLast = pageIndex === totalPages - 1;
      const remainingItems = data.items.slice((pageIndex + 1) * itemsPerPage);
      const remainingTotal = remainingItems.reduce(
        (sum, item) => sum + Number(item.totalPrice ?? totalPrice(item)),
        0,
      );

      return `
  <div class="page ${pageIndex > 0 ? "page-break" : ""}">
    ${
      pageIndex === 0
        ? `
    <!-- HEADER -->
    <div class="header">

    </div>

    <!-- PROFORMA -->
    <div class="proforma-line">
      <span class="ref">PROFORMA : ${data.reference}</span>
      <span class="date">${data.city} le ${date}</span>
    </div>

    <!-- ADDRESS -->
    <div class="address-container">
      <div class="address-header">
        <div class="address-title">Adresse de facturation</div>
        <div class="address-title">Adresse de livraison</div>
      </div>

      <div class="client-info">
        <p>Client : ${data.clientName}</p>
        <p>Objet : ${data.object}</p>
      </div>
    </div>
    `
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
            <td>${formatCurrency(item.unitPrice)}</td>
            <td>${formatCurrency(item.totalPrice)}</td>
          </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      ${
        isLast && remainingTotal > 0
          ? `
      <div style="margin-top:8px; text-align:right; font-weight:bold;">
        Montant restant : ${formatCurrency(remainingTotal)}
      </div>
      `
          : ""
      }

      ${
        isLast
          ? `
      <!-- TOTAL -->
      <table class="totals">
        <tr>
          <td>TOTAL MATERIEL</td>
          <td>${totalmaterial}</td>
        </tr>
        <tr>
          <td>TOTAL HT</td>
          <td>${formatCurrency(totalht)}</td>
        </tr>
      </table>

      <!-- SIGNATURE -->
      <div class="signature">
        <h2>Le Responsable</h2><br><br>
        <h1>${data.managerName}</h1>
      </div>
      `
          : ""
      }
    </div>

    <div class="pageNumber">Page ${pageIndex + 1} / ${totalPages}</div>
  </div>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />

<style>
  /* =========================
     GLOBAL / PAGE A4
  ========================== */
  body {
    margin: 0;
    padding: 0;
    background: #eee;
    font-family: "Times New Roman", serif;
    font-size: 11px;
    color: #000;
    position: relative;
  }

  #canvas {
    width: 100%;
    min-height: 100%;
    margin: 0;
    background: #eee;
    padding: 0 0;
    box-sizing: border-box;
  }

  .page {
    width: 794px;              /* A4 */
    min-height: 1123px;
    margin: 0 auto 0 auto;
    background: #fff;
    padding: 180px 30px 40px 30px;
    box-sizing: border-box;
    position: relative;
  }

  .page-break { page-break-before: always; }

  .pageNumber {
    position: absolute;
    bottom: 110px;
    right: 30px;
  }

  h1, h2, h3, p {
    margin: 0;
    padding: 0;
  }

  .ref {
    text-decoration: underline;
  }

  .date {
    font-weight: normal;
    font-size: 13px;
  }

  /* =========================
     HEADER
  ========================== */
  .header {
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }

  .logo {
    width: 120px;
  }

  .logo img {
    width: 100%;
  }

  .company-info h1 {
    font-size: 16px;
    font-weight: bold;
  }

  .company-info p {
    font-size: 10px;
    line-height: 1.35;
    margin-top: 4px;
  }

  /* =========================
     PROFORMA LINE
  ========================== */
  .proforma-line {
    display: flex;
    justify-content: space-between;
    margin-top: 25px;
    font-weight: bold;
    font-size: 20px;
  }

  /* =========================
     ADDRESS BLOCK
  ========================== */
  .address-container {
    border: 1px solid #000;
    margin-top: 15px;
  }

  .address-header {
    display: flex;
    border-bottom: 1px solid #000;
    height: 30px;
    font-size: 14px;
  }

  .address-title {
    width: 50%;
    padding: 6px;
    font-weight: bold;
    border-right: 1px solid #000;
  }

  .address-title:last-child {
    border-right: none;
  }

  .client-info {
    padding: 8px;
  }

  .client-info p {
    margin-bottom: 4px;
    font-weight: bold;
    font-size: 15px;
  }

  /* =========================
     TABLE
  ========================== */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }

  thead {
    height: 30px;
  }

  th, td {
    border: 1px solid #000;
    padding: 4px;
    font-size: 11px;
  }

  th {
    font-weight: bold;
    text-align: center;
    font-size: 16px;
  }

  tr {
    height: 35px;
  }

  td {
    font-size: 14px;
  }

  td:nth-child(1) {
    text-align: left;
  }

  td:nth-child(2),
  td:nth-child(3) {
    text-align: center;
  }

  td:nth-child(4),
  td:nth-child(5) {
    text-align: center;
  }

  /* =========================
     TOTALS
  ========================== */
  .totals {
    width: 40%;
    margin-left: auto;
    margin-top: 10px;
    background-color: #eee;
  }

  .totals td {
    font-weight: bold;
    padding: 5px;
  }

  /* =========================
     FOOTER
  ========================== */
  .amount-text {
    margin-top: 15px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .signature {
    margin-top: 30px;
    text-align: right;
    font-weight: bold;
  }

  .footer {
    margin-top: 40px;
    font-size: 9px;
    text-align: center;
    border-top: 1px solid #000;
    padding-top: 6px;
  }

  /* page-break helper */
  .page-break { page-break-before: always; height: 1px; padding-top: 180px }
</style>
</head>

<body>
<div id="canvas">

${pagesHtml}

</div>
</body>
</html>

`;
}
