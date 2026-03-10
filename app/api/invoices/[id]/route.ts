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
        clientId: data.clientId || null,
        companyId: data.companyId || null,
        totalHT: data.totalHT,
        totalMaterial: data.totalMaterial,
        amountWords: data.amountWords,
        taxAmount: data.taxAmount,
        totalTTC: data.totalTTC,
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
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
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


