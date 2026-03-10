import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const data = await req.json();
        const { to, subject, message, isReminder } = data;

        if (!to || !subject || !message) {
            return NextResponse.json({ message: "to, subject, and message are required." }, { status: 400 });
        }

        const invoice = await prisma.invoice.findFirst({
            where: { id: params.id, userId },
        });

        if (!invoice) return NextResponse.json({ message: "Invoice not found" }, { status: 404 });

        // In a real production environment, you would generate the PDF in-memory or fetch the Cloudinary URL
        // Here we'll configure a solid email template.
        // If invoice.pdfUrl exists, attach it.

        const attachments = [];
        if (invoice.pdfUrl) {
            // Fetch pdf buffer using fetch
            try {
                const pdfRes = await fetch(invoice.pdfUrl);
                const arrayBuffer = await pdfRes.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                attachments.push({
                    filename: `Invoice_${invoice.reference}.pdf`,
                    content: buffer,
                });
            } catch (err) {
                console.error("Failed to fetch pdf to attach:", err);
            }
        }

        const emailResponse = await resend.emails.send({
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            to: [to],
            subject: subject,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>${isReminder ? 'Rappel: ' : ''}${invoice.type === 'quote' ? 'Devis' : 'Facture'} - ${invoice.reference}</h2>
          <p>${message.replace(/\n/g, '<br/>')}</p>
          <br/>
          <p>Cordialement,<br/><strong>${invoice.managerName || 'Votre Entreprise'}</strong></p>
        </div>
      `,
            attachments: attachments.length > 0 ? attachments : undefined,
        });

        if (emailResponse.error) {
            console.error(emailResponse.error);
            return NextResponse.json({ message: "Email API error", error: emailResponse.error }, { status: 500 });
        }

        return NextResponse.json({ message: "Email sent successfully", data: emailResponse.data });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error sending email", error }, { status: 500 });
    }
}
