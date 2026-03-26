import { prisma } from "@/lib/prisma";

export async function getExpensesData(userId: string) {
  const [expenses, companies] = await Promise.all([
    prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    }),
    prisma.company.findMany({
      where: { userId },
      select: { id: true, name: true },
    }),
  ]);

  return { 
    expenses: expenses.map(e => ({ 
      ...e, 
      currency: "XOF",
      createdAt: e.createdAt ? e.createdAt.toISOString() : "",
      updatedAt: e.updatedAt ? e.updatedAt.toISOString() : "",
      description: e.description || "",
      companyId: e.companyId || ""
    })), 
    companies 
  };
}
