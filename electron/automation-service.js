/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("../src/p_client");
const prisma = new PrismaClient();
const { Resend } = require("resend");
const { addDays, addMonths, addWeeks, isBefore, startOfDay, format } = require("date-fns");
const React = require("react");
// Note: dynamically import render to avoid issues with ESM if needed, but here we try require
const { render } = require("@react-email/render");
const InvoiceEmail = require("../src/components/emails/InvoiceEmail.js");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Process all invoices marked as recurring that are due for generation.
 */
async function processRecurringInvoices() {
    const now = new Date();
    const templates = await prisma.invoice.findMany({
        where: {
            isRecurring: true,
            nextIssueDate: { lte: now },
        },
        include: { items: true },
    });

    for (const template of templates) {
        try {
            // Find the last sequential number for this user
            const lastInv = await prisma.invoice.findFirst({
                where: { userId: template.userId },
                orderBy: { invoiceNumber: "desc" },
            });
            const nextNum = (lastInv?.invoiceNumber || 1000) + 1;
            const newReference = `INV-${nextNum}-${format(now, "MMYY")}`;

            const { id, createdAt, updatedAt, items, nextIssueDate, reference, style, ...invoiceData } = template;

            const newInvoice = await prisma.invoice.create({
                data: {
                    ...invoiceData,
                    reference: newReference,
                    invoiceNumber: nextNum,
                    status: "pending",
                    isRecurring: false, // The generated one is an actual invoice, not a template
                    createdAt: now,
                    updatedAt: now,
                    items: {
                        create: items.map(item => {
                            const { id: itemId, invoiceId, ...itemData } = item;
                            return {
                                ...itemData,
                                quantity: Number(itemData.quantity),
                                unitPrice: Number(itemData.unitPrice),
                                totalPrice: Number(itemData.totalPrice),
                            };
                        }),
                    },
                },
            });

            // Update template's nextIssueDate
            let nextDate;
            const currentNext = template.nextIssueDate || now;
            switch (template.recurrenceFreq) {
                case "weekly": nextDate = addWeeks(currentNext, 1); break;
                case "monthly": nextDate = addMonths(currentNext, 1); break;
                case "yearly": nextDate = addMonths(currentNext, 12); break;
                default: nextDate = addMonths(currentNext, 1);
            }

            await prisma.invoice.update({
                where: { id: template.id },
                data: { nextIssueDate: nextDate },
            });


        } catch (err) {
            console.error(`[Automation] Failed to generate recurring invoice for template ${template.id}:`, err);
        }
    }
}

/**
 * Process pending/overdue invoices to send automated reminders.
 */
async function processReminders() {
    const now = startOfDay(new Date());

    const invoices = await prisma.invoice.findMany({
        where: {
            status: { in: ["pending", "overdue"] },
            autoReminders: true,
            paidAt: null,
        },
        include: { author: true, client: true },
    });

    for (const inv of invoices) {
        if (!inv.dueDate) continue;
        const dueDate = startOfDay(new Date(inv.dueDate));

        // Check stages: J-2, J+3, J+7
        const jMinus2 = addDays(dueDate, -2);
        const jPlus3 = addDays(dueDate, 3);
        const jPlus7 = addDays(dueDate, 7);

        let stage = null;
        if (!isBefore(now, jMinus2) && inv.remindersSentCount === 0) {
            stage = "J-2";
        } else if (!isBefore(now, jPlus3) && inv.remindersSentCount === 1) {
            stage = "J+3";
        } else if (!isBefore(now, jPlus7) && inv.remindersSentCount === 2) {
            stage = "J+7";
        }

        if (stage) {
            try {
                await sendReminderEmail(inv, stage);
                await prisma.invoice.update({
                    where: { id: inv.id },
                    data: {
                        remindersSentCount: { increment: 1 },
                        lastReminderSentAt: new Date(),
                        status: isBefore(dueDate, now) ? "overdue" : inv.status,
                    },
                });
            } catch (err) {
                console.error(`[Automation] Failed to send reminder for invoice ${inv.id}:`, err);
            }
        }
    }
}

/**
 * Send a reminder email via Resend.
 */
async function sendReminderEmail(invoice, stage) {
    const recipient = invoice.client?.email || invoice.clientEmail;
    if (!recipient) return;

    const isFriendly = invoice.reminderTone === "friendly";
    const subject = isFriendly
        ? `Petit rappel : votre facture ${invoice.reference}`
        : `RAPPEL : Paiement en attente - Facture ${invoice.reference}`;

    const amount = (invoice.totalTTC || invoice.totalHT || 0).toLocaleString("fr-FR", {
        style: "currency",
        currency: "XOF", // Default for the app, could be dynamic
    });

    const emailHtml = await render(
        React.createElement(InvoiceEmail, {
            clientName: invoice.clientName,
            invoiceReference: invoice.reference,
            downloadLink: "", // Attachments handled below
            senderName: invoice.author.name || "Votre Partenaire",
            amount: amount,
            invoiceId: invoice.id,
            isReminder: true,
            tone: invoice.reminderTone || "professional",
        })
    );

    await resend.emails.send({
        from: "Essor Automations <onboarding@resend.dev>",
        to: [recipient],
        subject: subject,
        html: emailHtml,
    });


}

const { BrowserWindow } = require("electron");
let lastCheckTime = new Date();

async function pollReadInvoices() {
    try {
        const newlyReadInvoices = await prisma.invoice.findMany({
            where: {
                isRead: true,
                readAt: { gt: lastCheckTime }
            },
            include: {
                client: true
            }
        });

        if (newlyReadInvoices.length > 0) {
            let maxDate = lastCheckTime;
            const windows = BrowserWindow.getAllWindows();

            for (const inv of newlyReadInvoices) {
                if (inv.readAt && inv.readAt > maxDate) {
                    maxDate = inv.readAt;
                }
                if (windows.length > 0) {
                    windows[0].webContents.send("invoice-read-notification", inv);
                }
            }
            lastCheckTime = maxDate;
        }
    } catch (e) {
        console.error("[Automation] Polling read invoices failed:", e);
    }
}

/**
 * Main loop entry point
 */
function startAutomationService() {

    // Initial run after a short delay (wait for DB connections etc)
    setTimeout(() => {
        runCycle();
    }, 10000);

    // Periodic run every hour
    setInterval(() => {
        runCycle();
    }, 1000 * 60 * 60);

    // Poll read invoices every 20 seconds
    setInterval(() => {
        pollReadInvoices();
    }, 20000);
}

async function runCycle() {
    try {
        await processRecurringInvoices();
        await processReminders();
    } catch (err) {
        console.error("[Automation] Cycle failed:", err);
    }
}

module.exports = { startAutomationService };
