import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Helper to generate next invoice number
async function generateInvoiceNumber(userId: string) {
    const lastInvoice = await prisma.invoice.findFirst({
        where: { userId, invoiceNumber: { not: null } },
        orderBy: { invoiceNumber: "desc" },
    });
    return lastInvoice && lastInvoice.invoiceNumber ? lastInvoice.invoiceNumber + 1 : 1;
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const invoice = await prisma.invoice.findFirst({
            where: { id: params.id, userId },
            include: { items: true }
        });

        if (!invoice) return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
        if (invoice.type !== "quote") return NextResponse.json({ message: "Only quotes can be converted to invoices" }, { status: 400 });

        const newInvoiceNumber = await generateInvoiceNumber(userId);

        // Convert current quote to invoice or clone it?
        // Based on user feedback: "Transformation d'un devis en facture"
        // Usually, we just update the type and status, or clone it.
        // We will update the existing record to become an "invoice" and mark it as "pending"
        const updatedInvoice = await prisma.invoice.update({
            where: { id: params.id },
            data: {
                type: "invoice",
                status: "pending",
                invoiceNumber: newInvoiceNumber,
            }
        });

        return NextResponse.json({ message: "Converted successfully", invoice: updatedInvoice });
    } catch (error) {
        return NextResponse.json({ message: "Error converting quote", error }, { status: 500 });
    }
}
