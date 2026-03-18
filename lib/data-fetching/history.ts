import { prisma } from "@/lib/prisma";

export async function getHistoryData(userId: string) {
  const invoices = await prisma.invoice.findMany({
    where: { userId },
    include: {
      client: true,
      company: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return invoices;
}
