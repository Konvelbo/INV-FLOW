import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

const jsonToCsv = (jsonArray: any[]) => {
    if (jsonArray.length === 0) return "";
    const keys = Object.keys(jsonArray[0]);
    const delimiter = ";"; // Better for French Excel
    const csvRows = [
        keys.join(delimiter),
        ...jsonArray.map(row =>
            keys.map(k => {
                let val = row[k] === null || row[k] === undefined ? "" : row[k];
                if (typeof val === "string") {
                    // Escape quotes and delimiters
                    val = `"${val.replace(/"/g, '""')}"`;
                }
                return val;
            }).join(delimiter)
        )
    ];
    // Return with BOM for UTF-8 compatibility in Excel
    return "\uFEFF" + csvRows.join("\n");
};

export async function GET(req: Request, { params }: { params: Promise<{ type: string }> }) {
    try {
        const userId = verifyToken(req);
        if (!userId) return new Response("Unauthorized", { status: 401 });

        const { searchParams } = new URL(req.url);
        const companyId = searchParams.get("companyId");
        const { type } = await params; // 'invoices', 'clients', 'expenses', 'products'

        const whereClause: any = { userId };
        if (companyId) whereClause.companyId = companyId;

        let dataToExport = [];
        let filename = `${type}_export.csv`;

        switch (type) {
            case "invoices":
                const invoices = await prisma.invoice.findMany({ where: whereClause, include: { client: true } });
                dataToExport = invoices.map(i => ({
                    "Référence": i.reference,
                    "N°": i.invoiceNumber,
                    "Type": i.type === "invoice" ? "Facture" : "Devis",
                    "Statut": i.status,
                    "Date": i.createdAt ? i.createdAt.toISOString().split("T")[0] : "",
                    "Client": i.clientName || i.client?.name || "",
                    "Total HT": i.totalHT,
                    "Total TTC": i.totalTTC || i.totalHT,
                    "Payé": i.paidAmount,
                    "Reste à payer": (i.totalTTC || i.totalHT) - i.paidAmount,
                    "Échéance": i.dueDate ? i.dueDate.toISOString().split("T")[0] : ""
                }));
                break;

            case "clients":
                const clients = await prisma.client.findMany({ where: whereClause });
                dataToExport = clients.map(c => ({
                    "Nom": c.name,
                    "Type": c.type === "entreprise" ? "Entreprise" : "Particulier",
                    "Statut": c.status || "Actif",
                    "Email": c.email || "",
                    "Téléphone": c.phone || "",
                    "Ville": c.city || "",
                    "Pays": c.country || "",
                    "Adresse": c.address || "",
                    "Contact": c.contact || "",
                    "Total Dépensé": c.totalSpent || 0,
                    "Factures Payées": c.paidInvoicesCount || 0,
                    "Factures Impayées": c.unpaidInvoicesCount || 0,
                    "Date Ajout": c.createdAt ? c.createdAt.toISOString().split("T")[0] : ""
                }));
                break;

            case "expenses":
                const expenses = await prisma.expense.findMany({ where: whereClause });
                dataToExport = expenses.map(e => ({
                    "Titre": e.title,
                    "Montant": e.amount,
                    "Catégorie": e.category,
                    "Date": e.date.toISOString().split("T")[0],
                    "Description": e.description || ""
                }));
                break;

            case "products":
                const products = await prisma.product.findMany({ where: { userId } });
                dataToExport = products.map(p => ({
                    "Nom": p.name,
                    "Description": p.description || "",
                    "Prix Unitaire HT": p.price,
                    "TVA (%)": p.taxRate,
                    "Unité": p.unit || "U"
                }));
                break;

            default:
                return new Response("Invalid export type", { status: 400 });
        }

        const csvData = jsonToCsv(dataToExport);

        return new Response(csvData, {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="${filename}"`
            }
        });

    } catch (error) {
        console.error("Export error:", error);
        return new Response("Error generating export", { status: 500 });
    }
}
