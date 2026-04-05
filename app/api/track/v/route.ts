import { NextResponse } from "next/server";
import { PrismaClient } from "@/src/p_client";

const prisma = new PrismaClient();

// 1x1 transparent base64 image (gif)
const TRANSPARENT_GIF_BUFFER = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            await prisma.invoice.updateMany({
                where: { id },
                data: {
                    isRead: true,
                    readAt: new Date(),
                },
            });
        }

        return new NextResponse(TRANSPARENT_GIF_BUFFER, {
            headers: {
                "Content-Type": "image/gif",
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
            },
        });
    } catch (error) {
        console.error("Error tracking invoice:", error);
        // Still return the image so it doesn't break the email layout
        return new NextResponse(TRANSPARENT_GIF_BUFFER, {
            headers: {
                "Content-Type": "image/gif",
            },
        });
    }
}
