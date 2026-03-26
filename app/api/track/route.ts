import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');

    if (invoiceId) {
      // Connect to the generic database (this will use DATABASE_URL from Vercel env)
      // Since invoiceId is an ObjectId string, we update the invoice
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });
    }

    // 1x1 transparent GIF Base64 string
    const transparentPixel = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    const buffer = Buffer.from(transparentPixel, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });
  } catch (error) {
    console.error("Tracking Error:", error);
    // Even if it fails, return a 1x1 transparent pixel so the email doesn't show a broken image
    const transparentPixel = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    const buffer = Buffer.from(transparentPixel, 'base64');
    return new NextResponse(buffer, {
      status: 200,
      headers: { 'Content-Type': 'image/gif' },
    });
  }
}
