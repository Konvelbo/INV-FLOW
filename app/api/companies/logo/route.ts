import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const userId = verifyToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { image, companyId } = await req.json();

        if (!image) {
            return NextResponse.json({ message: "Image is required" }, { status: 400 });
        }

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "company_logos",
            transformation: [
                { width: 400, height: 400, crop: "limit" },
            ],
        });

        const logoUrl = uploadResponse.secure_url;

        // If companyId is provided, update the company directly
        if (companyId) {
            await prisma.company.update({
                where: { id: companyId, userId },
                data: { logoUrl: logoUrl },
            });
        }

        return NextResponse.json(
            {
                message: "Logo uploadé avec succès",
                logoUrl: logoUrl,
            },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("Company Logo Upload Error:", error);
        return NextResponse.json(
            {
                message: "Erreur lors de l'upload du logo",
                error: error.message,
            },
            { status: 500 },
        );
    }
}
