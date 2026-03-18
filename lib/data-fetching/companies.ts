import { prisma } from "@/lib/prisma";

export async function getCompaniesData(userId: string) {
  const companies = await prisma.company.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return companies;
}
