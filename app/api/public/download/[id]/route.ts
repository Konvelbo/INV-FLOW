import { invoiceTemplate } from "@/lib/invoice-pdf";
import { prisma } from "@/lib/prisma";

const puppeteer = require("puppeteer");
const os = require("os");
const path = require("path");
const fs = require("fs");

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    let browser;
    let uniqueUserDataDir = "";

    try {
        const params = await props.params;
        const invoiceId = params.id;

        if (!invoiceId) {
            return new Response("Missing invoice ID.", { status: 400 });
        }

        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: {
                items: true,
                company: true,
                client: true,
                author: true,
            },
        });

        if (!invoice) {
            return new Response("Invoice not found.", { status: 404 });
        }

        // Préparer les données de la facture pour le template
        const invoiceData = {
            ...invoice,
            currencyCode: "XOF", // ou lire depuis la conf
            language: "fr",
            type: invoice.type || "invoice",
            // Assurer la compatibilité avec le template qui s'attendait à certains champs
            items: invoice.items.map(i => ({
                designation: i.designation,
                unit: i.unit,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                totalPrice: i.totalPrice,
            }))
        };

        const html = invoiceTemplate(invoiceData);

        uniqueUserDataDir = path.join(
            os.tmpdir(),
            `puppeteer-${Date.now()}-${Math.random().toString(36).substring(2)}`,
        );

        browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
            userDataDir: uniqueUserDataDir,
        });

        const page = await browser.newPage();

        await page.setContent(html, {
            waitUntil: "load",
            timeout: 60000,
        });

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        return new Response(Buffer.from(pdf), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Facture_${invoice.reference.replace(/\//g, "-")}.pdf"`,
            },
        });
    } catch (error) {
        console.error("Public PDF API Error:", error);
        return new Response("PDF generation failed.", { status: 500 });
    } finally {
        if (browser) {
            await browser.close();
        }
        try {
            if (uniqueUserDataDir && fs.existsSync(uniqueUserDataDir)) {
                fs.rmSync(uniqueUserDataDir, { recursive: true, force: true });
            }
        } catch (e) { }
    }
}
