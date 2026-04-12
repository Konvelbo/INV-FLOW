/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("../src/p_client");
const prisma = new PrismaClient();
const { Resend } = require("resend");
const {
  addDays,
  addMonths,
  addWeeks,
  isBefore,
  startOfDay,
  format,
} = require("date-fns");
const React = require("react");
// Note: dynamically import render to avoid issues with ESM if needed, but here we try require
const { render } = require("@react-email/render");
const InvoiceEmail = require("../src/components/emails/InvoiceEmail.js");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Concurrency lock to prevent overlapping cycles
let isProcessing = false;

/**
 * Process all invoices marked as recurring that are due for generation.
 */
async function processRecurringInvoices(mainWindow) {
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
      // --- Subscription gate: only paid active subscribers (monthly/yearly) ---
      const owner = await prisma.user.findUnique({
        where: { id: template.userId },
        select: {
          subscriptionPlan: true,
          subscriptionStatus: true,
          subscriptionExpiresAt: true,
        },
      });

      const plan = owner?.subscriptionPlan ?? "free";
      const status = owner?.subscriptionStatus ?? "free";
      const isExpired = owner?.subscriptionExpiresAt
        ? new Date(owner.subscriptionExpiresAt) < now
        : false;
      const isPaidAndActive =
        (plan === "monthly" || plan === "yearly") &&
        status === "active" &&
        !isExpired;

      if (!isPaidAndActive) {

        continue;
      }
      // --- End subscription gate ---

      // Find the last sequential number for this user
      const lastInv = await prisma.invoice.findFirst({
        where: { userId: template.userId },
        orderBy: { invoiceNumber: "desc" },
      });
      const nextNum = (lastInv?.invoiceNumber || 1000) + 1;
      const newReference = `INV-${nextNum}-${format(now, "MMyy")}`;

      const {
        id,
        createdAt,
        updatedAt,
        items,
        nextIssueDate,
        reference,
        style,
        ...invoiceData
      } = template;

      // Step 1: Calculate the next date for the template
      let nextDate;
      const currentNext = template.nextIssueDate || now;
      switch (template.recurrenceFreq) {
        case "weekly":
          nextDate = addWeeks(currentNext, 1);
          break;
        case "monthly":
          nextDate = addMonths(currentNext, 1);
          break;
        case "yearly":
          nextDate = addMonths(currentNext, 12);
          break;
        default:
          nextDate = addMonths(currentNext, 1);
      }

      // Step 2: Update template's nextIssueDate BEFORE creating the invoice.
      // This prevents parallel cycles from seeing this template as 'due'.
      await prisma.invoice.update({
        where: { id: template.id },
        data: { nextIssueDate: nextDate },
      });

      // Step 3: Create the actual invoice for the current period
      const createdInvoice = await prisma.invoice.create({
        data: {
          ...invoiceData,
          reference: newReference,
          invoiceNumber: nextNum,
          status: "pending",
          isRecurring: false,
          createdAt: now,
          updatedAt: now,
          items: {
            create: items.map((item) => {
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



      // Notify all active windows
      BrowserWindow.getAllWindows().forEach((win) => {
        if (!win.isDestroyed()) {
          win.webContents.send("automation-event", {
            type: "recurring-generated",
            invoiceReference: newReference,
            clientName: template.clientName,
          });
        }
      });
    } catch (err) {
      // Failed to generate recurring invoice
    }
  }
}

/**
 * Process one-off scheduled invoices (not recurring templates).
 */
async function processScheduledSends(mainWindow) {
  const now = new Date();
  const scheduled = await prisma.invoice.findMany({
    where: {
      isRecurring: false,
      recurrenceFreq: null,
      nextIssueDate: { lte: now },
      status: "pending",
    },
    include: { author: true, client: true },
  });

  for (const inv of scheduled) {
    try {
      // Subscription gate
      const owner = await prisma.user.findUnique({
        where: { id: inv.userId },
        select: {
          subscriptionPlan: true,
          subscriptionStatus: true,
          subscriptionExpiresAt: true,
        },
      });

      const plan = owner?.subscriptionPlan ?? "free";
      const status = owner?.subscriptionStatus ?? "free";
      const isExpired = owner?.subscriptionExpiresAt
        ? new Date(owner.subscriptionExpiresAt) < now
        : false;

      if (
        !(
          (plan === "monthly" || plan === "yearly") &&
          status === "active" &&
          !isExpired
        )
      ) {

        continue;
      }

      // Step 1: Update status to 'paused' BEFORE sending to prevent duplicate processing
      // We keep the nextIssueDate as a record of when it was scheduled to be sent.
      await prisma.invoice.update({
        where: { id: inv.id },
        data: {
          status: "paused",
        },
      });

      // Step 2: Send the invoice email
      await sendInvoiceEmail(inv);



      // Notify all active windows
      BrowserWindow.getAllWindows().forEach((win) => {
        if (!win.isDestroyed()) {
          win.webContents.send("automation-event", {
            type: "scheduled-sent",
            invoiceReference: inv.reference,
            clientName: inv.clientName || inv.client?.name,
          });
        }
      });
    } catch (err) {
      // Failed to process scheduled invoice
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
        // Step 1: Update metadata BEFORE sending to prevent duplicates
        await prisma.invoice.update({
          where: { id: inv.id },
          data: {
            remindersSentCount: { increment: 1 },
            lastReminderSentAt: new Date(),
            status: isBefore(dueDate, now) ? "overdue" : inv.status,
          },
        });

        // Step 2: Send the actual email
        await sendInvoiceEmail(inv, true, stage);
      } catch (err) {
        // Failed to send reminder
      }
    }
  }
}

/**
 * Common invoice sending logic for both schedules and reminders.
 */
async function sendInvoiceEmail(invoice, isReminder = false, stage = null) {
  const recipient = invoice.client?.email || invoice.clientEmail;
  if (!recipient) {

    return;
  }

  const isFriendly = invoice.reminderTone === "friendly";
  let subject;
  if (isReminder) {
    subject = isFriendly
      ? `Petit rappel : votre facture ${invoice.reference}`
      : `RAPPEL : Paiement en attente - Facture ${invoice.reference}`;
  } else {
    subject = `Votre facture ${invoice.reference}`;
  }

  const amount = (invoice.totalTTC || invoice.totalHT || 0).toLocaleString(
    "fr-FR",
    {
      style: "currency",
      currency: "XOF",
    },
  );

  const emailHtml = await render(
    React.createElement(InvoiceEmail, {
      clientName: invoice.clientName,
      invoiceReference: invoice.reference,
      downloadLink: "",
      senderName: invoice.author.name || "Votre Partenaire",
      amount: amount,
      invoiceId: invoice.id,
      isReminder: isReminder,
      tone: invoice.reminderTone || "professional",
      stage: stage,
    }),
  );

  await resend.emails.send({
    from: "ESSOR <onboarding@resend.dev>",
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
        readAt: { gt: lastCheckTime },
      },
      include: {
        client: true,
      },
    });

    if (newlyReadInvoices.length > 0) {
      let maxDate = lastCheckTime;
      const windows = BrowserWindow.getAllWindows();

      for (const inv of newlyReadInvoices) {
        if (inv.readAt && inv.readAt > maxDate) {
          maxDate = inv.readAt;
        }
        windows.forEach((win) => {
          if (!win.isDestroyed()) {
            win.webContents.send("invoice-read-notification", inv);
          }
        });
      }
      lastCheckTime = maxDate;
    }
  } catch (e) {
    // Polling failure
  }
}

/**
 * Main loop entry point
 */
function startAutomationService(mainWindow) {
  // Initial run after a short delay (wait for DB connections etc)
  setTimeout(() => {
    runCycle(mainWindow);
  }, 2000);

  // Periodic run every minute for maximum responsiveness
  setInterval(
    () => {
      runCycle(mainWindow);
    },
    1000 * 60,
  );

  // Poll read invoices every 20 seconds
  setInterval(() => {
    pollReadInvoices();
  }, 20000);
}

async function runCycle(mainWindow) {
  if (isProcessing) {
    // Cycle already in progress, skipping...
    return;
  }
  
  isProcessing = true;
  try {
    await processRecurringInvoices(mainWindow);
    await processScheduledSends(mainWindow);
    await processReminders();
  } catch (err) {
    // Cycle failure
  } finally {
    isProcessing = false;
  }
}

module.exports = { startAutomationService };
