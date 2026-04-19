import { NextResponse } from "next/server";
// Use relative paths for maximum reliability in Vercel serverless environments
import { prisma } from "../../../../src/lib/db";

// 1x1 transparent base64 image (gif)
const TRANSPARENT_GIF_BUFFER = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      try {
        // Using standard atomic update which does not require transactions
        // and properly handles connection pooling in serverless environments
        await prisma.invoice.update({
          where: { id: id },
          data: {
            isRead: true,
            readAt: new Date(),
          },
        });
      } catch (dbError) {
        // Ignore errors if invoice is not found
        console.error("Tracking database error:", dbError);
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
    console.error("Tracking route crash:", error);
    // Still return the image so it doesn't break the email layout
    return new NextResponse(TRANSPARENT_GIF_BUFFER, {
      headers: {
        "Content-Type": "image/gif",
      },
    });
  }
}
