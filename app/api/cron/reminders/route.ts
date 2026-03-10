import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        if (process.env.CRON_SECRET) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        const today = new Date();
        // Start of today and end of today
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // 1. Fetch Todos with reminders for today that are not completed
        const todosToRemind = await prisma.todo.findMany({
            where: {
                completed: false,
                reminderAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                user: true,
            }
        });

        // 2. Fetch Invoices that are overdue (dueDate < today and status != paid)
        const overdueInvoices = await prisma.invoice.findMany({
            where: {
                status: { in: ["pending", "overdue"] },
                dueDate: {
                    lt: startOfDay,
                },
            },
            include: {
                author: true,
                client: true, // Need client email
            }
        });

        let sentEmails = 0;

        // Send Todo Reminders to users
        for (const todo of todosToRemind) {
            if (todo.user.email) {
                try {
                    await resend.emails.send({
                        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
                        to: [todo.user.email],
                        subject: `Rappel de tâche : ${todo.title}`,
                        html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h2>Rappel: ${todo.title}</h2>
                <p>${todo.description || 'Vous avez planifié cette tâche pour aujourd\'hui.'}</p>
                <p>Priorité: ${todo.priority}</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/todos">Voir mes tâches</a>
              </div>
            `,
                    });
                    sentEmails++;
                } catch (e) {
                    console.error("Failed to send todo reminder", e);
                }
            }
        }

        // Send Invoice Overdue Reminders to clients (or to the user to remind them to contact the client)
        for (const invoice of overdueInvoices) {
            // Update status to overdue if not already
            if (invoice.status !== "overdue") {
                await prisma.invoice.update({
                    where: { id: invoice.id },
                    data: { status: "overdue" }
                });
            }

            // Send to client if they have an email
            if (invoice.client && invoice.client.email) {
                try {
                    await resend.emails.send({
                        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
                        to: [invoice.client.email],
                        subject: `Rappel Facture Impayée - ${invoice.reference}`,
                        html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h2>Bonjour ${invoice.clientName},</h2>
                <p>Sauf erreur ou omission de notre part, la facture <strong>${invoice.reference}</strong> d'un montant de <strong>${invoice.totalTTC || invoice.totalHT}</strong> est arrivée à échéance le ${invoice.dueDate?.toLocaleDateString('fr-FR')}.</p>
                <p>Nous vous serions reconnaissants de bien vouloir procéder à son règlement dans les plus brefs délais.</p>
                <p>Cordialement,<br/><strong>${invoice.managerName || invoice.author.name}</strong></p>
              </div>
            `,
                    });
                    sentEmails++;
                } catch (e) {
                    console.error("Failed to send invoice reminder", e);
                }
            }
        }

        return NextResponse.json({ message: "Reminders cron executed", remindersSent: sentEmails });
    } catch (error) {
        console.error("Cron error:", error);
        return NextResponse.json({ message: "Error running reminders cron", error }, { status: 500 });
    }
}
