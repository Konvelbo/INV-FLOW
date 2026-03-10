import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { updateClientFinancials } from "@/lib/client-utils";

// Helper to generate next invoice number
async function generateInvoiceNumber(userId: string) {
  const lastInvoice = await prisma.invoice.findFirst({
    where: { userId, invoiceNumber: { not: null } },
    orderBy: { invoiceNumber: "desc" },
  });
  return lastInvoice && lastInvoice.invoiceNumber ? lastInvoice.invoiceNumber + 1 : 1;
}

export async function GET(req: Request) {
  try {
    const userId = verifyToken(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    const companyId = searchParams.get("companyId");
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const whereClause: any = { userId };
    if (clientId) whereClause.clientId = clientId;
    if (companyId) whereClause.companyId = companyId;
    if (type) whereClause.type = type;
    if (status) whereClause.status = status;

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        client: true,
        company: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = verifyToken(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    // Validate required fields
    if (!data.reference || !data.clientName || !data.items) {
      return NextResponse.json({ message: "Invalid input data. Required fields are missing." }, { status: 400 });
    }

    // Auto-numbering if not provided and type is invoice
    let invoiceNumber = data.invoiceNumber;
    if (!invoiceNumber && data.type !== "quote") {
      invoiceNumber = await generateInvoiceNumber(userId);
    }

    const createdInvoice = await prisma.invoice.create({
      data: {
        reference: data.reference,
        invoiceNumber,
        type: data.type || "invoice",
        status: data.status || "draft",
        city: data.city || "",
        clientName: data.clientName,
        object: data.object || "",
        clientAddress: data.clientAddress || "",
        clientContact: data.clientContact || "",
        clientPOBox: data.clientPOBox || "",
        managerName: data.managerName || "",
        clientId: data.clientId || undefined,
        companyId: data.companyId || undefined,
        totalHT: data.totalHT || 0,
        totalMaterial: data.totalMaterial || 0,
        amountWords: data.amountWords || "",
        taxAmount: data.taxAmount || 0,
        totalTTC: data.totalTTC || 0,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        isRecurring: data.isRecurring || false,
        recurrenceFreq: data.recurrenceFreq || undefined,
        isScaled: data.status === "paid" ? true : (data.isScaled || false),
        style: data.style || "default",
        author: { connect: { id: userId } },
        items: {
          create: data.items.map((item: any) => ({
            designation: item.designation,
            unit: item.unit || "U",
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            productId: item.productId || undefined,
          })),
        },
      },
      include: { items: true }
    });

    // Send Push Notification
    try {
      const subscriptions = await prisma.pushSubscription.findMany({ where: { userId } });
      const { sendPushNotification } = await import("@/lib/push");
      for (const sub of subscriptions) {
        const result = await sendPushNotification(sub, {
          title: data.type === "quote" ? "Nouveau Devis" : "Nouvelle Facture",
          body: `${data.type === "quote" ? "Devis" : "Facture"} créé(e) : ${data.reference} pour ${data.clientName}`,
          url: "/dashboard",
        });

        if (result && result.expired) {
          try {
            await prisma.pushSubscription.delete({ where: { id: sub.id } });
          } catch (e) {
            console.error("Failed to delete expired push subscription.", e);
          }
        }
      }
    } catch (pushErr) { }

    if (data.clientId) {
      await updateClientFinancials(data.clientId);
    }

    revalidatePath("/dashboard");
    return NextResponse.json(createdInvoice, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "Une facture avec cette référence existe déjà." }, { status: 400 });
    }
    console.error("Error creating invoice:", error);
    return NextResponse.json({ message: "Erreur lors de la création de la facture", error: String(error) }, { status: 500 });
  }
}
