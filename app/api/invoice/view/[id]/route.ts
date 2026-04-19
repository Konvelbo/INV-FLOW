import { NextResponse } from "next/server";

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

  try {
    if (id && process.env.VERCEL) {
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
    }
  } catch (error) {
    console.error("Tracking error:", error);
  }

  // Load translations
  const { translations } = await import("@/src/lib/translations");
  const t = translations[lang];

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
            }
            .icon { font-size: 48px; margin-bottom: 20px; }
            h1 { color: #0f172a; margin-bottom: 10px; font-size: 24px; }
            p { color: #64748b; line-height: 1.6; }
            .footer { margin-top: 30px; font-size: 14px; color: #94a3b8; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="icon">🧾</div>
            <h1>${t.invoiceViewedTitle}</h1>
            <p>${t.invoiceViewedDesc}</p>
            <div class="footer">${t.poweredByEssor}</div>
        </div>
    </body>
    </html>
    `,
    {
      headers: { "Content-Type": "text/html" },
    }
  );
}
