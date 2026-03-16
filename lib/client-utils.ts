import { prisma } from "./prisma";

/**
 * Recalculates and updates a client's financial statistics based on their invoices.
 * @param clientId The ID of the client to update.
 */
export async function updateClientFinancials(clientId: string) {
    if (!clientId) return;

    try {
        const invoices = await prisma.invoice.findMany({
            where: { clientId },
        });

        let totalSpent = 0;
        let paidInvoicesCount = 0;
        let unpaidInvoicesCount = 0;

        invoices.forEach((invoice) => {
            if (invoice.type === "invoice") {
                // Count as paid if status is 'paid' OR if isScaled is true
                if (invoice.status === "paid" || invoice.isScaled) {
                    const amount = Number(invoice.totalTTC) || Number(invoice.totalHT) || 0;
                    totalSpent += amount;
                    paidInvoicesCount++;
                } else if (invoice.status !== "draft") {
                    unpaidInvoicesCount++;
                }
            }
        });

        const result = await prisma.client.update({
            where: { id: clientId },
            data: {
                totalSpent,
                paidInvoicesCount,
                unpaidInvoicesCount,
            },
        });
    } catch (error) {
        console.error(`[UTILS] Failed to update financials for client ${clientId}:`, error);
    }
}
