import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { OTPEmail } from "@/src/components/emails/OTPEmail";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "L'email est requis." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // For security, don't reveal if user exists or not
            return NextResponse.json({ message: "Si un compte existe pour cet email, un code a été envoyé." });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetOtp: otp,
                resetOtpExpiry: expiry,
            },
        });

        await resend.emails.send({
            from: "ProFacture <onboarding@resend.dev>",
            to: [email],
            subject: "Code de vérification ESSOR",
            react: OTPEmail({ otp }),
        });

        return NextResponse.json({ message: "Code envoyé !" });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ message: "Erreur lors de l'envoi du code." }, { status: 500 });
    }
}
