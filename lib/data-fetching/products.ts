import { prisma } from "@/lib/prisma";

export async function getProductsData(userId: string) {
  const products = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return products;
}
