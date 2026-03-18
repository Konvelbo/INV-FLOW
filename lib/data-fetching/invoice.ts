import { prisma } from "@/lib/prisma";

export async function getInvoiceData(invoiceId: string, userId: string) {
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId },
    include: {
      items: true,
      client: true,
      company: true,
    },
  });

  return invoice;
}
