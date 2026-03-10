import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Resend } from "resend";
import { InvoiceEmail } from "@/src/components/emails/InvoiceEmail";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
    try {
        const userId = verifyToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
        }

        const { invoiceId, email } = await req.json();

        if (!invoiceId || !email) {
            return NextResponse.json(
                { message: "L'ID de la facture et l'e-mail sont requis." },
                { status: 400 }
            );
        }

        // Récupérer la facture et l'utilisateur pour vérifier la propriété et obtenir les détails
        const invoice = await prisma.invoice.findFirst({
            where: {
                id: invoiceId,
                userId: userId,
            },
            include: {
                author: true, // Pour obtenir le nom de l'expéditeur
            },
        });

        if (!invoice) {
            return NextResponse.json(
                { message: "Facture introuvable." },
                { status: 404 }
            );
        }

        // Construire le lien de téléchargement
        // Hypothèse: l'API /api/download-pdf est sécurisée par le token utilisateur.
        // Cependant, pour le client final, ils ont besoin d'un lien public.
        // L'idéal est de générer la facture côté serveur et de l'attacher, ou de générer un lien signé.
        // L'utilisateur a demandé : "je veux aussi que la personne qui a recu l email puisse la telecharger en clickant sur un lien dans l email"

        // Dans la plupart des applications NextJS, on crée soit une route publique /public/invoice/[id] 
        // soit on envoie le PDF en pièce jointe.
        // Pour que le lien soit accessible, nous utiliserons l'URL de l'application + route sécurisée 
        // S'il n'y a pas de route publique existante, on va assumer qu'on crée une route de téléchargement publique : /api/public/download/[id]

        // Pour l'instant on génère l'URL (vous devrez configurer NEXT_PUBLIC_APP_URL dans .env)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const downloadLink = `${appUrl}/api/public/download/${invoice.id}`;

        // On utilise la dépendance resend pour envoyer l'email
        const { render } = await import("@react-email/components");
        const emailHtml = await render(
            InvoiceEmail({
                clientName: invoice.clientName,
                invoiceReference: invoice.reference,
                downloadLink: downloadLink,
                senderName: invoice.author.name || "Votre Partenaire",
                amount: invoice.totalTTC ? `${invoice.totalTTC} XOF` : `${invoice.totalHT} XOF`,
            })
        );

        const data = await resend.emails.send({
            from: "ProFacture <onboarding@resend.dev>",
            to: [email],
            subject: `Nouvelle Facture ${invoice.reference}`,
            html: emailHtml,
        });

        return NextResponse.json({ message: "E-mail envoyé avec succès !", data }, { status: 200 });
    } catch (error) {
        console.error("Erreur d'envoi d'e-mail:", error);
        return NextResponse.json(
            { message: "Une erreur est survenue lors de l'envoi de l'e-mail." },
            { status: 500 }
        );
    }
}
