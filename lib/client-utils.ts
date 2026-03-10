import { prisma } from "./prisma";

/**
 * Recalculates and updates a client's financial statistics based on their invoices.
 * @param clientId The ID of the client to update.
 */
export async function updateClientFinancials(clientId: string) {
    if (!clientId) return;

    try {
        // Fetch all invoices for this client that are not deleted (Prisma handles this if using soft deletes, but here it's normal deletes)
        const invoices = await prisma.invoice.findMany({
            where: { clientId },
        });

        let totalSpent = 0;
        let paidInvoicesCount = 0;
        let unpaidInvoicesCount = 0;

        invoices.forEach((invoice) => {
            // We only count "invoice" type, not "quote" for financial stats
            if (invoice.type === "invoice") {
                if (invoice.status === "paid") {
                    // Use totalTTC for the spent amount if paid, or paidAmount if we want more granular tracking
                    // Given the context of "total spent", usually we mean total of paid invoices.
                    totalSpent += invoice.totalTTC || 0;
                    paidInvoicesCount++;
                } else if (invoice.status === "pending" || invoice.status === "overdue" || invoice.status === "draft") {
                    unpaidInvoicesCount++;
                }
            }
        });

        // Update the client record
        await prisma.client.update({
            where: { id: clientId },
            data: {
                totalSpent,
                paidInvoicesCount,
                unpaidInvoicesCount,
            },
        });

        console.log(`Updated financials for client ${clientId}: Spent=${totalSpent}, Paid=${paidInvoicesCount}, Unpaid=${unpaidInvoicesCount}`);
    } catch (error) {
        console.error(`Failed to update financials for client ${clientId}:`, error);
    }
}
