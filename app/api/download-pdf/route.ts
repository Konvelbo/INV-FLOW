import puppeteer from "puppeteer";
import jwt, { JwtPayload } from "jsonwebtoken";
import { invoiceTemplate } from "@/lib/invoice-pdf";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { InvoiceItemProps } from "@/src/context/InvoiceContext";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate input data
    if (
      !data ||
      !data.reference ||
      !data.clientName ||
      !data.object ||
      !data.items
    ) {
      throw new Error("Invalid input data. Required fields are missing.");
    }

    console.log("DATA RECEIVED:", data);

    // Verify user authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = authHeader.split(" ")[1];
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (!decoded || !decoded.id) {
        throw new Error("Invalid token payload");
      }
      userId = decoded.id;
    } catch (err) {
      return new Response(JSON.stringify({ message: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const html = invoiceTemplate(data);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    console.log("✅ PDF Generated. Size:", pdf.length);

    await browser.close();

    // Use upsert to avoid Unique constraint failed on reference
    const createdInvoice = await prisma.invoice.upsert({
      where: { reference: data.reference },
      update: {
        city: data.city,
        clientName: data.clientName,
        clientAddress: data.clientAddress,
        clientContact: data.clientContact,
        clientPOBox: data.clientPOBox,
        object: data.object,
        managerName: data.managerName,
        totalHT: data.totalHT,
        totalMaterial: data.totalMaterial,
        // For updates, we might want to refresh items, but to avoid complexity
        // with nested updates in upsert, we'll focus on the main record here
        // or handle items separately if needed.
        // Given this is a proforma, updates are likely common.
      },
      create: {
        reference: data.reference,
        city: data.city,
        clientName: data.clientName,
        clientAddress: data.clientAddress,
        clientContact: data.clientContact,
        clientPOBox: data.clientPOBox,
        object: data.object,
        managerName: data.managerName,
        totalHT: data.totalHT,
        author: {
          connect: { id: userId },
        },
        totalMaterial: data.totalMaterial,
        items: {
          create: data.items.map((item: InvoiceItemProps) => ({
            designation: item.designation,
            unit: item.unit,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
    });

    // If it was an update, we should also update the items to reflect the current state
    // (A bit simplified here as items change frequently)
    if (createdInvoice) {
      // Option: Delete and recreate items if it's an update
      const existingItems = await prisma.invoiceItem.findMany({
        where: { invoiceId: createdInvoice.id },
      });

      if (
        existingItems.length > 0 &&
        createdInvoice.createdAt.getTime() !== new Date().getTime()
      ) {
        // rough check for update
        await prisma.invoiceItem.deleteMany({
          where: { invoiceId: createdInvoice.id },
        });
        await prisma.invoiceItem.createMany({
          data: data.items.map((item: InvoiceItemProps) => ({
            designation: item.designation,
            unit: item.unit,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            invoiceId: createdInvoice.id,
          })),
        });
      }
    }

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice_${data.reference.replace(/\//g, "-")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("❌ PDF GENERATION ERROR:", error);

    return new Response(
      JSON.stringify({
        message: "PDF generation failed.",
        error: (error as Error)?.message || "Unknown error.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
