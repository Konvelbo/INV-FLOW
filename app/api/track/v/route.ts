import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

// 1x1 transparent base64 image (gif)
const TRANSPARENT_GIF_BUFFER = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);

export async function GET(request: Request) {
  let client;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      try {
        if (!process.env.DATABASE_URL) {
          throw new Error("DATABASE_URL est manquant");
        }
        client = new MongoClient(process.env.DATABASE_URL);
        await client.connect();
        const db = client.db();
        console.log(`Tracking connected to database: ${db.databaseName}`);

        if (id && ObjectId.isValid(id)) {
          const result = await db.collection("Invoice").updateOne(
            { _id: new ObjectId(id) },
            { $set: { isRead: true, readAt: new Date() } }
          );
          console.log(`Tracking pixel for ${id} result:`, result.matchedCount > 0 ? "Success" : "Not Found");
        } else {
          console.warn(`Invalid or missing ID for tracking: ${id}`);
        }
      } catch (dbError: any) {
        // Ignore errors if invoice is not found
        console.error("Tracking database error:", dbError.message);
      } finally {
        if (client) {
          await client.close();
        }
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
