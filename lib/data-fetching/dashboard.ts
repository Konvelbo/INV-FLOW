import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string, companyId?: string) {
  const where: any = { userId };
  if (companyId) {
    where.companyId = companyId;
  }

  const whereInvoice: any = { ...where, type: "invoice" };
  const whereExpense: any = { ...where };
  const whereTodo: any = { userId };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthStart = new Date(currentYear, currentMonth, 1);
  const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
  const currentYearStart = new Date(currentYear, 0, 1);
  
  // Last 6 months for chart
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // 1. Optimized Invoices stats & Chart Data & Todos
  const [
    revenuesThisMonth,
    revenuesThisYear,
    unpaidInvoicesStats,
    revenuesScaledThisMonth,
    revenuesScaledLastMonth,
    revenuesScaledAllTime,
    revenuesNonScaledAllTime,
    recentInvoices,
    unpaidInvoices,
    chartInvoices,
    chartExpenses,
    todos,
    activeClientsCount,
    expensesThisMonth,
    expensesThisYear,
    recentProducts,
  ] = await Promise.all([
    // Revenues This Month
    prisma.invoice.aggregate({
      where: {
        ...whereInvoice,
        createdAt: { gte: currentMonthStart },
        OR: [{ status: "paid" }, { isScaled: true }],
      },
      _sum: { totalTTC: true, totalHT: true },
    }),
    // Revenues This Year
    prisma.invoice.aggregate({
      where: {
        ...whereInvoice,
        createdAt: { gte: currentYearStart },
        OR: [{ status: "paid" }, { isScaled: true }],
      },
      _sum: { totalTTC: true, totalHT: true },
    }),
    // Unpaid Invoices Total
    prisma.invoice.aggregate({
      where: {
        ...whereInvoice,
        status: { in: ["pending", "overdue", "draft"] },
      },
      _sum: { totalTTC: true, totalHT: true },
      _count: true,
    }),
    // Revenues Scaled This Month
    prisma.invoice.aggregate({
      where: {
        ...whereInvoice,
        createdAt: { gte: currentMonthStart },
        isScaled: true,
      },
      _sum: { totalTTC: true, totalHT: true },
    }),
    // Revenues Scaled Last Month
    prisma.invoice.aggregate({
      where: {
        ...whereInvoice,
        createdAt: { gte: lastMonthStart, lt: currentMonthStart },
        isScaled: true,
      },
      _sum: { totalTTC: true, totalHT: true },
    }),
    // Revenues Scaled All Time
    prisma.invoice.aggregate({
      where: { ...whereInvoice, isScaled: true },
      _sum: { totalTTC: true, totalHT: true },
      _count: true,
    }),
    // Revenues Non Scaled All Time
    prisma.invoice.aggregate({
      where: { ...whereInvoice, isScaled: false, status: { not: "paid" } },
      _sum: { totalTTC: true, totalHT: true },
      _count: true,
    }),
    // Recent Invoices
    prisma.invoice.findMany({
      where: whereInvoice,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        reference: true,
        clientName: true,
        totalHT: true,
        status: true,
        isScaled: true,
        createdAt: true,
      },
    }),
    // Unpaid Invoices List
    prisma.invoice.findMany({
      where: {
        ...whereInvoice,
        status: { in: ["pending", "overdue", "draft"] },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    // Chart Invoices (Last 6 months)
    prisma.invoice.findMany({
      where: { 
        ...whereInvoice, 
        createdAt: { gte: sixMonthsAgo },
        OR: [{ status: "paid" }, { isScaled: true }],
      },
      select: { createdAt: true, totalTTC: true, totalHT: true },
    }),
    // Chart Expenses (Last 6 months)
    prisma.expense.findMany({
      where: { ...whereExpense, date: { gte: sixMonthsAgo } },
      select: { date: true, amount: true },
    }),
    // Todos
    (prisma as any).todo.findMany({
      where: whereTodo,
      orderBy: { startTime: "asc" },
    }),
    // Client count
    prisma.client.count({ where: { userId: where.userId, ...(companyId ? { companyId } : {}) } }),
    // Expenses This Month
    prisma.expense.aggregate({
      where: { ...whereExpense, date: { gte: currentMonthStart } },
      _sum: { amount: true },
      _count: true,
    }),
    // Expenses This Year
    prisma.expense.aggregate({
      where: { ...whereExpense, date: { gte: currentYearStart } },
      _sum: { amount: true },
    }),
    // Recent Products
    prisma.product.findMany({
      where: { userId: where.userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  // Chart Data Processing
  const monthlyData: Record<string, { revenue: number; expenses: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthYear = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
    monthlyData[monthYear] = { revenue: 0, expenses: 0 };
  }

  chartInvoices.forEach((inv) => {
    const d = new Date(inv.createdAt as any);
    const m = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
    if (monthlyData[m]) {
      monthlyData[m].revenue += inv.totalTTC || inv.totalHT || 0;
    }
  });

  chartExpenses.forEach((exp) => {
    const d = new Date(exp.date as any);
    const m = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
    if (monthlyData[m]) {
      monthlyData[m].expenses += exp.amount;
    }
  });

  const chartData = Object.keys(monthlyData).map((month) => ({
    name: month,
    Revenus: monthlyData[month].revenue,
    Dépenses: monthlyData[month].expenses,
    Profit: monthlyData[month].revenue - monthlyData[month].expenses,
  }));

  return {
    revenuesThisMonth: revenuesThisMonth._sum.totalTTC || revenuesThisMonth._sum.totalHT || 0,
    revenuesThisYear: revenuesThisYear._sum.totalTTC || revenuesThisYear._sum.totalHT || 0,
    unpaidInvoicesTotal: unpaidInvoicesStats._sum.totalTTC || unpaidInvoicesStats._sum.totalHT || 0,
    unpaidInvoicesCount: unpaidInvoicesStats._count,
    activeClientsCount,
    expensesThisMonth: expensesThisMonth._sum.amount || 0,
    expensesCountThisMonth: expensesThisMonth._count,
    profitThisMonth: (revenuesThisMonth._sum.totalTTC || 0) - (expensesThisMonth._sum.amount || 0),
    profitThisYear: (revenuesThisYear._sum.totalTTC || 0) - (expensesThisYear._sum.amount || 0),
    recentInvoices: recentInvoices.map(inv => ({
      ...inv,
      clientName: inv.clientName || "",
      totalHT: inv.totalHT || 0,
      isScaled: inv.isScaled || false,
      createdAt: inv.createdAt ? inv.createdAt.toISOString() : "",
    })),
    revenuesScaledThisMonth: revenuesScaledThisMonth._sum.totalTTC || 0,
    revenuesScaledLastMonth: revenuesScaledLastMonth._sum.totalTTC || 0,
    revenuesScaledAllTime: revenuesScaledAllTime._sum.totalTTC || 0,
    countScaledAllTime: revenuesScaledAllTime._count,
    revenuesScaledThisYear: 0,
    lastScaledInvoiceAmount: 0,
    secondLastScaledInvoiceAmount: 0,
    revenuesNonScaledAllTime: revenuesNonScaledAllTime._sum.totalTTC || 0,
    countNonScaledAllTime: revenuesNonScaledAllTime._count,
    recentProducts,
    unpaidInvoices: unpaidInvoices.map(inv => ({
      id: inv.id,
      reference: inv.reference,
      clientName: inv.clientName || "",
      totalHT: inv.totalHT || 0,
      isScaled: inv.isScaled || false,
      createdAt: inv.createdAt ? inv.createdAt.toISOString() : "",
    })),
    chartData,
    todos,
  };
}
