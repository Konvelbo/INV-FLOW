import { prisma } from "@/lib/prisma";

export async function getClientsData(userId: string, companyId?: string) {
    const whereClause: any = { userId };
    if (companyId) {
        whereClause.companyId = companyId;
    }

    const clients = await prisma.client.findMany({
        where: whereClause,
        include: {
            company: true,
            invoices: {
                select: {
                    status: true,
                    totalTTC: true,
                    totalHT: true,
                    isScaled: true
                }
            },
            _count: {
                select: { invoices: true }
            }
        },
        orderBy: { createdAt: "desc" },
    });

    return clients.map((client: any) => {
        const totalSpent = client.invoices
            .filter((inv: any) => inv.status === "paid" || inv.isScaled)
            .reduce((acc: number, inv: any) => acc + (inv.totalTTC || inv.totalHT || 0), 0);
        
        const paidInvoicesCount = client.invoices.filter((inv: any) => inv.status === "paid" || inv.isScaled).length;
        const unpaidInvoicesCount = client.invoices.filter((inv: any) => ["pending", "overdue", "draft"].includes(inv.status)).length;

        // Cleanup invoices before sending to client for performance
        const { invoices, ...rest } = client;

        return {
            ...rest,
            totalSpent,
            paidInvoicesCount,
            unpaidInvoicesCount,
        };
    });
}
