import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ message: "Tous les champs sont requis." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.resetOtp !== otp || !user.resetOtpExpiry || user.resetOtpExpiry < new Date()) {
            return NextResponse.json({ message: "Code invalide ou expiré." }, { status: 400 });
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetOtp: null,
                resetOtpExpiry: null,
            },
        });

        return NextResponse.json({ message: "Mot de passe modifié avec succès !" });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ message: "Erreur lors de la réinitialisation." }, { status: 500 });
    }
}
