import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { updateClientFinancials } from "@/lib/client-utils";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = verifyToken(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const invoice = await prisma.invoice.findFirst({
      where: { id: id, userId },
      include: {
        items: true,
        client: true,
        company: true,
      }
    });

    if (!invoice) return NextResponse.json({ message: "Invoice not found" }, { status: 404 });

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching invoice", error }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = verifyToken(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    // Get current invoice to handle client change
    const currentInvoice = await prisma.invoice.findUnique({
      where: { id: id, userId },
      select: { clientId: true }
    });

    // 🛠️ AUTOMATIC CLIENT LINKING
    let finalClientId = data.clientId;
    if (!finalClientId && data.clientName) {
      const trimmedName = data.clientName.trim();
      const existingClient = await prisma.client.findFirst({
        where: {
          userId,
          name: { equals: trimmedName, mode: 'insensitive' }
        },
        select: { id: true }
      });
      if (existingClient) {
        finalClientId = existingClient.id;
      }
    }

    // 🛠️ TOTALS CALCULATION
    // Ensure totals are calculated correctly as Numbers
    const calculatedTotalHT = data.items.reduce((sum: number, item: any) =>
      sum + (Number(item.totalPrice) || (Number(item.quantity) * Number(item.unitPrice))), 0);

    const totalHT = data.totalHT !== undefined ? Number(data.totalHT) : calculatedTotalHT;
    const taxAmount = data.taxAmount !== undefined ? Number(data.taxAmount) : 0;
    const totalTTC = (Number(data.totalTTC) > 0) ? Number(data.totalTTC) : (totalHT + taxAmount);

    // Standard pattern: Update invoice and replace items
    const updatedInvoice = await prisma.invoice.update({
      where: { id: id, userId },
      data: {
        reference: data.reference,
        type: data.type,
        status: data.status,
        city: data.city,
        clientName: data.clientName,
        object: data.object,
        clientAddress: data.clientAddress,
        clientContact: data.clientContact,
        clientPOBox: data.clientPOBox,
        managerName: data.managerName,
        client: finalClientId ? { connect: { id: finalClientId } } : { disconnect: true },
        company: data.companyId ? { connect: { id: data.companyId } } : { disconnect: true },
        totalHT: totalHT,
        totalMaterial: data.totalMaterial,
        amountWords: data.amountWords,
        taxAmount: taxAmount,
        totalTTC: totalTTC,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        isRecurring: data.isRecurring,
        recurrenceFreq: data.recurrenceFreq,
        isScaled: data.status === "paid" ? true : data.isScaled,
        style: data.style,
        items: {
          deleteMany: {}, // Delete all existing items
          create: data.items.map((item: any) => ({
            designation: item.designation,
            unit: item.unit || "U",
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            totalPrice: Number(item.totalPrice) || (Number(item.quantity) * Number(item.unitPrice)),
            productId: item.productId || null,
          })),
        },
      },
      include: { items: true }
    });

    if (updatedInvoice.clientId) {
      await updateClientFinancials(updatedInvoice.clientId);
    }
    // Also update old client if it changed
    if (currentInvoice?.clientId && currentInvoice.clientId !== updatedInvoice.clientId) {
      await updateClientFinancials(currentInvoice.clientId);
    }

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ message: "Error updating invoice", error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = verifyToken(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    // Support partial updates for status and isScaled
    const updatedInvoice = await prisma.invoice.update({
      where: { id: id, userId },
      data: {
        status: data.status !== undefined ? data.status : undefined,
        isScaled: data.status === "paid" ? true : (data.isScaled !== undefined ? data.isScaled : undefined),
      }
    });

    if (updatedInvoice.clientId) {
      await updateClientFinancials(updatedInvoice.clientId);
    }

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("Error patching invoice:", error);
    return NextResponse.json({ message: "Error patching invoice", error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = verifyToken(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const invoiceToDelete = await prisma.invoice.findUnique({
      where: { id: id, userId },
      select: { clientId: true }
    });

    const deleteResult = await prisma.invoice.deleteMany({
      where: { id: id, userId },
    });

    if (invoiceToDelete?.clientId) {
      await updateClientFinancials(invoiceToDelete.clientId);
    }

    if (deleteResult.count === 0) return NextResponse.json({ message: "Invoice not found or unauthorized" }, { status: 404 });

    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting invoice", error }, { status: 500 });
  }
}


