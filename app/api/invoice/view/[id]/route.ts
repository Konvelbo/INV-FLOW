import { NextResponse } from "next/server";
// Use native mongodb driver for Vercel to bypass Prisma's transaction engine bug
import { MongoClient, ObjectId } from "mongodb";
import { translations } from "../../../../../src/lib/translations";

/**
 * Handles clicks from the "View Online" link in emails. 
 * Marks the invoice as read and shows a professional acknowledgment page.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const langParam = searchParams.get("lang") || "fr";
  const lang = (langParam === "en" || langParam === "fr") ? langParam : "fr";
  const t = translations[lang];

  let debugInfo = "";
  let client;
  try {
    if (id) {
      try {
        if (!process.env.DATABASE_URL) {
          throw new Error("DATABASE_URL est manquant");
        }
        client = new MongoClient(process.env.DATABASE_URL);
        await client.connect();
        const db = client.db();
        
        const result = await db.collection("Invoice").updateOne(
          { _id: new ObjectId(id) },
          { 
            $set: { 
              isRead: true, 
              readAt: new Date() 
            } 
          }
        );
        debugInfo = "Success: Invoice marked as read. Matched: " + result.matchedCount;
      } catch (e: any) {
        debugInfo = "Erreur MongoDB Native: " + (e.message || "Unknown error");
      } finally {
        if (client) {
          await client.close();
        }
      }
    } else {
      debugInfo = "Error: No ID provided in params";
    }
  } catch (error: any) {
    console.error("Tracking error:", error);
    debugInfo = `Error: ${error.message || "Unknown error"}. ID: ${id}`;
  }

  // Return a professional-looking "Thank You" page in HTML
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.invoiceViewedTitle} | ESSOR</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
        <style>
            body { 
                font-family: 'Inter', sans-serif; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                height: 100vh; 
                margin: 0; 
                background-color: #f6f9fc;
            }
            .card {
                background: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                text-align: center;
                max-width: 400px;
                position: relative;
            }
            .icon { font-size: 48px; margin-bottom: 20px; }
            h1 { color: #0f172a; margin-bottom: 10px; font-size: 24px; }
            p { color: #64748b; line-height: 1.6; }
            .footer { margin-top: 30px; font-size: 14px; color: #94a3b8; }
            .debug { 
                margin-top: 20px; 
                font-size: 10px; 
                color: #e2e8f0; 
                word-break: break-all;
                border-top: 1px solid #f1f5f9;
                padding-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="icon">🧾</div>
            <h1>${t.invoiceViewedTitle}</h1>
            <p>${t.invoiceViewedDesc}</p>
            <div class="footer">${t.poweredByEssor}</div>
            <div class="debug">${debugInfo}</div>
        </div>
    </body>
    </html>
    `,
    {
      headers: { 
        "Content-Type": "text/html",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
    }
  );
}
