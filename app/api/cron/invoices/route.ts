import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    // Protect this route in production using a secret token header
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // Only enforce if the secret is set, otherwise allow for local testing
        if (process.env.CRON_SECRET) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        const today = new Date();

        // Find all recurring invoices that are due to be issued
        const recurringInvoices = await prisma.invoice.findMany({
            where: {
                isRecurring: true,
                nextIssueDate: {
                    lte: today,
                },
            },
            include: {
                items: true,
            }
        });

        const generatedInvoices = [];

        for (const invoice of recurringInvoices) {
            // Find the next invoice number for this user
            const lastInvoice = await prisma.invoice.findFirst({
                where: { userId: invoice.userId, invoiceNumber: { not: null } },
                orderBy: { invoiceNumber: "desc" },
            });
            const nextInvoiceNumber = lastInvoice && lastInvoice.invoiceNumber ? lastInvoice.invoiceNumber + 1 : 1;

            // Duplicate the invoice
            const newInvoice = await prisma.invoice.create({
                data: {
                    reference: `${invoice.reference}-R${invoice.invoiceNumber}`, // Just a suffix for tracking
                    invoiceNumber: nextInvoiceNumber,
                    type: "invoice",
                    status: "draft",
                    city: invoice.city,
                    clientName: invoice.clientName,
                    object: invoice.object,
                    clientAddress: invoice.clientAddress,
                    clientContact: invoice.clientContact,
                    clientPOBox: invoice.clientPOBox,
                    managerName: invoice.managerName,
                    clientId: invoice.clientId,
                    companyId: invoice.companyId,
                    totalHT: invoice.totalHT,
                    totalMaterial: invoice.totalMaterial,
                    amountWords: invoice.amountWords,
                    taxAmount: invoice.taxAmount,
                    totalTTC: invoice.totalTTC,
                    // Remove recurring logic from the duplication
                    isRecurring: false,
                    style: invoice.style,
                    user: { connect: { id: invoice.userId } },
                    items: {
                        create: invoice.items.map(item => ({
                            designation: item.designation,
                            unit: item.unit,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            totalPrice: item.totalPrice,
                            productId: item.productId,
                        })),
                    },
                }
            });

            generatedInvoices.push(newInvoice);

            // Update the original invoice's next issue date based on frequency
            let nextDate = new Date(invoice.nextIssueDate!);
            if (invoice.recurrenceFreq === 'daily') nextDate.setDate(nextDate.getDate() + 1);
            else if (invoice.recurrenceFreq === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
            else if (invoice.recurrenceFreq === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
            else if (invoice.recurrenceFreq === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
            else nextDate.setMonth(nextDate.getMonth() + 1); // fallback

            await prisma.invoice.update({
                where: { id: invoice.id },
                data: { nextIssueDate: nextDate }
            });
        }

        return NextResponse.json({ message: "Cron executed", count: generatedInvoices.length, data: generatedInvoices });
    } catch (error) {
        console.error("Cron error:", error);
        return NextResponse.json({ message: "Error running cron", error }, { status: 500 });
    }
}
