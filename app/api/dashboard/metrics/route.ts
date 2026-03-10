import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const companyId = searchParams.get("companyId");

        const whereInvoice: any = { userId, type: "invoice" };
        const whereClient: any = { userId };
        const whereExpense: any = { userId };

        if (companyId) {
            whereInvoice.companyId = companyId;
            whereClient.companyId = companyId;
            whereExpense.companyId = companyId;
        }

        // 1. Invoices stats (Revenus, Impayées)
        const invoices = await prisma.invoice.findMany({ where: whereInvoice });

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        let revenuesThisMonth = 0; // Keeping for arbitrary uses if needed
        let revenuesThisYear = 0;
        let unpaidInvoicesTotal = 0;
        let revenuesScaledThisMonth = 0;
        let revenuesScaledLastMonth = 0;

        let revenuesScaledAllTime = 0;
        let countScaledAllTime = 0;
        let revenuesNonScaledAllTime = 0;
        let countNonScaledAllTime = 0;

        const currentMonthStart = new Date(currentYear, currentMonth, 1);
        const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);

        const scaledInvoices = invoices
            .filter((inv: any) => inv.isScaled);

        const unpaidInvoices = invoices
            .filter((inv: any) => inv.status === "pending" || inv.status === "overdue" || inv.status === "draft")
            .sort((a: any, b: any) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

        for (const inv of invoices) {
            const invDate = inv.createdAt ? new Date(inv.createdAt) : new Date();
            const amount = inv.totalTTC || inv.totalHT || 0;

            if (inv.isScaled || inv.status === "paid") {
                revenuesScaledAllTime += amount;
                countScaledAllTime++;

                if (invDate >= currentMonthStart) {
                    revenuesScaledThisMonth += amount;
                } else if (invDate >= lastMonthStart && invDate < currentMonthStart) {
                    revenuesScaledLastMonth += amount;
                }
            } else {
                revenuesNonScaledAllTime += amount;
                countNonScaledAllTime++;
            }

            // Legacy arbitrary properties that might be needed
            if (invDate.getFullYear() === currentYear && invDate.getMonth() === currentMonth) {
                if (inv.status === "paid" || inv.isScaled) {
                    revenuesThisMonth += amount;
                }
            }
            if (inv.status === "paid" || inv.isScaled) {
                if (invDate.getFullYear() === currentYear) {
                    revenuesThisYear += amount;
                }
            }
            if (inv.status === "pending" || inv.status === "overdue" || inv.status === "draft") {
                unpaidInvoicesTotal += amount;
            }
        }

        // 2. Active Clients
        const activeClientsCount = await prisma.client.count({ where: whereClient });

        // 3. Expenses this month/year for Profit calculation
        const expenses = await prisma.expense.findMany({ where: whereExpense });
        let expensesThisMonth = 0;
        let expensesCountThisMonth = 0;
        let expensesThisYear = 0;

        for (const exp of expenses) {
            const expDate = new Date(exp.date);
            if (expDate.getFullYear() === currentYear) {
                expensesThisYear += exp.amount;
                if (expDate.getMonth() === currentMonth) {
                    expensesThisMonth += exp.amount;
                    expensesCountThisMonth++;
                }
            }
        }

        const profitThisMonth = revenuesThisMonth - expensesThisMonth;
        const profitThisYear = revenuesThisYear - expensesThisYear;

        const recentInvoices = invoices.sort((a: any, b: any) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)).slice(0, 5).map((inv: any) => ({
            id: inv.id,
            reference: inv.reference,
            clientName: inv.clientName || "",
            totalHT: inv.totalHT,
            isScaled: inv.status === "paid" || inv.isScaled,
            status: inv.status,
            createdAt: inv.createdAt,
        }));

        // Fetch 20 most recently added products
        const recentProducts = await prisma.product.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 20
        });

        return NextResponse.json({
            revenuesThisMonth,
            revenuesThisYear,
            unpaidInvoicesTotal,
            activeClientsCount,
            expensesThisMonth,
            expensesCountThisMonth,
            profitThisMonth,
            profitThisYear,
            recentInvoices,
            revenuesScaledThisMonth,
            revenuesScaledLastMonth,
            revenuesScaledAllTime,
            countScaledAllTime,
            revenuesNonScaledAllTime,
            countNonScaledAllTime,
            recentProducts,
            unpaidInvoicesCount: unpaidInvoices.length,
            unpaidInvoices: unpaidInvoices.map((inv: any) => ({
                id: inv.id,
                reference: inv.reference,
                clientName: inv.clientName || "",
                totalHT: inv.totalHT,
                isScaled: inv.isScaled,
                status: inv.status,
                createdAt: inv.createdAt,
            }))
        });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching metrics", error }, { status: 500 });
    }
}
