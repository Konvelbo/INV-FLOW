import { NextResponse } from "next/server";



// 1x1 transparent base64 image (gif)
const TRANSPARENT_GIF_BUFFER = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Only attempt database operations on Vercel (has database access)
    if (id && process.env.VERCEL) {
      try {
        const { PrismaClient } = await import("@/src/p_client");
        const prisma = new PrismaClient();

        await prisma.invoice.update({
          where: { id },
          data: {
            isRead: true,
            readAt: new Date(),
          },
        });

        await prisma.$disconnect();
      } catch (dbError) {
        // Continue - still return the image
      }
    }

    return new NextResponse(TRANSPARENT_GIF_BUFFER, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    // Still return the image so it doesn't break the email layout
    return new NextResponse(TRANSPARENT_GIF_BUFFER, {
      headers: {
        "Content-Type": "image/gif",
      },
    });
  }
}
