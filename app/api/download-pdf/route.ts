import { invoiceTemplate } from "@/lib/invoice-pdf";
import { prisma } from "@/lib/prisma";
import { InvoiceItemProps } from "@/src/context/InvoiceContext";
import jwt, { JwtPayload } from "jsonwebtoken";
import { invoiceSchema } from "@/lib/zod/invoice.schema";

// We need to import 'path' and 'os' and 'fs' but we can use a random path in /tmp or similar
const puppeteer = require("puppeteer");
const os = require("os");
const path = require("path");
const fs = require("fs");

export async function POST(req: Request) {
  let browser;
  let uniqueUserDataDir = "";

  try {
    const data = await req.json();

    // Safety guards since Zod was removed
    if (!data.reference) {
      return new Response(JSON.stringify({ message: "Missing document reference." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!data.items || !Array.isArray(data.items)) {
      return new Response(JSON.stringify({ message: "Invalid or missing items list." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const validatedInvoice = data;

    // Verify user authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ message: "Unauthorized: Missing Authorization header." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = authHeader.split(" ")[1];
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (!decoded || !decoded.id) {
        throw new Error("Token verification failed: Missing user ID.");
      }
      userId = decoded.id;
    } catch (err) {
      return new Response(JSON.stringify({ message: "Invalid or expired token.", error: (err as Error).message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const html = invoiceTemplate({
      ...validatedInvoice,
      currencyCode: validatedInvoice.currencyCode || "XOF",
      language: validatedInvoice.language || "fr",
      type: validatedInvoice.type || "invoice",
    });

    // Generate a unique temporary directory for this browser instance to avoid locking issues
    uniqueUserDataDir = path.join(
      os.tmpdir(),
      `puppeteer-${Date.now()}-${Math.random().toString(36).substring(2)}`,
    );

    browser = await puppeteer.launch({
      headless: "new", // Use new headless mode
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage", // Fix for low memory/container environments
        "--disable-gpu",
      ],
      userDataDir: uniqueUserDataDir,
    });

    const page = await browser.newPage();

    // Set a generous timeout for loading content, especially if external fonts are slow
    // Ensure we don't wait for networkidle0 which can timeout if fonts hang
    await page.setContent(html, {
      waitUntil: "load",
      timeout: 60000,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    // Return response immediately, handle persistence asynchronously if possible or safely
    // However, Next.js serverless functions might kill the process if we don't await.
    // We will await but wrap in try/catch specifically for persistence to not fail the PDF download.

    try {
      // Use upsert
      const createdInvoice = await prisma.invoice.upsert({
        where: { reference: validatedInvoice.reference },
        update: {
          city: validatedInvoice.city,
          clientName: validatedInvoice.clientName,
          clientAddress: validatedInvoice.clientAddress,
          clientContact: validatedInvoice.clientContact,
          clientPOBox: validatedInvoice.clientPOBox,
          object: validatedInvoice.object,
          managerName: validatedInvoice.managerName,
          totalHT: validatedInvoice.totalHT,
          totalMaterial: validatedInvoice.totalMaterial,
          style: validatedInvoice.style || "default",
        },
        create: {
          reference: validatedInvoice.reference,
          city: validatedInvoice.city,
          clientName: validatedInvoice.clientName,
          clientAddress: validatedInvoice.clientAddress,
          clientContact: validatedInvoice.clientContact,
          clientPOBox: validatedInvoice.clientPOBox,
          object: validatedInvoice.object,
          managerName: validatedInvoice.managerName,
          totalHT: validatedInvoice.totalHT,
          totalMaterial: validatedInvoice.totalMaterial,
          style: validatedInvoice.style || "default",
          author: {
            connect: { id: userId },
          },
          items: {
            create: validatedInvoice.items.map((item: any) => ({
              designation: item.designation,
              unit: item.unit,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
          },
        },
      });

      if (
        createdInvoice &&
        createdInvoice.createdAt &&
        (createdInvoice.createdAt?.getTime() || 0) < Date.now() - 1000
      ) {
        // It was an update (roughly).
        try {
          await prisma.$transaction([
            prisma.invoiceItem.deleteMany({
              where: { invoiceId: createdInvoice.id },
            }),
            prisma.invoiceItem.createMany({
              data: validatedInvoice.items.map((item: InvoiceItemProps) => ({
                designation: item.designation,
                unit: item.unit,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                invoiceId: createdInvoice.id,
              })),
            }),
          ]);
        } catch (dbErr) {
          console.error("Persistence Transaction Error:", dbErr);
        }
      }
    } catch (dbErr) {
      console.error("Persistence Upsert Error:", dbErr);
    }

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice_${data.reference.replace(/\//g, "-")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF API Fatal Error:", error);
    // Ensure browser is closed if an error occurs
    if (browser) {
      await browser.close();
    }
    // Try to clean up temp dir
    try {
      if (uniqueUserDataDir && fs.existsSync(uniqueUserDataDir)) {
        fs.rmSync(uniqueUserDataDir, { recursive: true, force: true });
      }
    } catch (cleanupErr) {
      console.error("⚠️ Failed to cleanup temp dir:", cleanupErr);
    }

    return new Response(
      JSON.stringify({
        message: "PDF generation failed.",
        error: (error as Error)?.message || "Unknown error.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
    // Try to clean up temp dir
    try {
      if (uniqueUserDataDir && fs.existsSync(uniqueUserDataDir)) {
        fs.rmSync(uniqueUserDataDir, { recursive: true, force: true });
      }
    } catch (cleanupErr) {
      console.error("⚠️ Failed to cleanup temp dir:", cleanupErr);
    }
  }
}
