import puppeteer from "puppeteer";
import { invoiceTemplate } from "@/lib/invoice-pdf";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { InvoiceItemProps } from "@/src/context/InvoiceContext";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate input data
    if (!data || !data.reference || !data.clientName || !data.items) {
      throw new Error("Invalid input data. Required fields are missing.");
    }

    console.log("DATA RECEIVED:", data);

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

    await browser.close();

    const createdInvoice = await prisma.Invoice.create({
      data: {
        reference: data.reference,
        city: data.city,
        clientName: data.clientName,
        managerName: data.managerName,
        object: data.object,
        totalHT: data.totalHT,
        author: {
          connect: { id: "69892f8b98dea07f8b777a2c" },
        },
        totalMaterial: data.totalMaterial,
        items: {
          createMany: {
            data: data.items.map((item: InvoiceItemProps) => ({
              designation: item.designation,
              unit: item.unit,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
          },
        },
      },
    });

    return NextResponse.json(
      { createdInvoice, pdf },
      {
        headers: {
          "Content-Type": "application/pdf",
        },
      },
    );
  } catch (error) {
    console.error("❌ PDF GENERATION ERROR:", error);

    return new Response(
      JSON.stringify({
        message: "PDF generation failed.",
        error: error?.message || "Unknown error.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
