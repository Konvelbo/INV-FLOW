import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateClientFinancials } from "@/lib/client-utils";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        // Note: In real production, this would be a webhook called by Mobile Money providers (Orange, MTN, Wave).
        // It would verify a secret signature in the headers.

        const data = await req.json();

        // Verify signature (Mock implementation)
        // if (req.headers.get("x-signature") !== "EXPECTED") return Unauthorized;

        const invoice = await prisma.invoice.findUnique({
            where: { id: id },
        });

        if (!invoice) return NextResponse.json({ message: "Invoice not found" }, { status: 404 });

        // Mark as paid
        await prisma.invoice.update({
            where: { id: params.id },
            data: {
                status: "paid",
                paidAmount: data.amount || invoice.totalTTC || invoice.totalHT,
                paymentMethod: data.method || "Mobile Money",
                paidAt: new Date(),
            }
        });

        if (invoice.clientId) {
            await updateClientFinancials(invoice.clientId);
        }

        return NextResponse.json({ message: "Payment validated successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error processing payment", error }, { status: 500 });
    }
}
