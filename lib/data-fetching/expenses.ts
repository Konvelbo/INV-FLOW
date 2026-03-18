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

  return { expenses, companies };
}
