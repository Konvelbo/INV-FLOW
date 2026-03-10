import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const companyId = searchParams.get("companyId");

        // We want data for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const whereInvoice: any = {
            userId,
            type: "invoice",
            createdAt: { gte: sixMonthsAgo }
        };
        if (companyId) whereInvoice.companyId = companyId;

        const invoices = await prisma.invoice.findMany({ where: whereInvoice });

        const monthlyData: Record<string, { revenue: number, expenses: number }> = {};
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthYear = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
            monthlyData[monthYear] = { revenue: 0, expenses: 0 };
        }

        // Revenue per month (only paid invoices realistically, or all if we do accrual? let's do accrual for now)
        invoices.forEach((inv: any) => {
            const d = new Date(inv.createdAt);
            const m = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
            if (monthlyData[m]) {
                monthlyData[m].revenue += (inv.totalTTC || inv.totalHT || 0);
            }
        });

        const whereExpense: any = {
            userId,
            date: { gte: sixMonthsAgo }
        };
        if (companyId) whereExpense.companyId = companyId;

        const expenses = await prisma.expense.findMany({ where: whereExpense });

        expenses.forEach((exp: any) => {
            const d = new Date(exp.date);
            const m = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
            if (monthlyData[m]) {
                monthlyData[m].expenses += exp.amount;
            }
        });

        // Format for charts
        const chartData = Object.keys(monthlyData).map(month => ({
            name: month,
            Revenus: monthlyData[month].revenue,
            Dépenses: monthlyData[month].expenses,
            Profit: monthlyData[month].revenue - monthlyData[month].expenses,
        }));

        return NextResponse.json({ chartData });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching chart data", error }, { status: 500 });
    }
}
