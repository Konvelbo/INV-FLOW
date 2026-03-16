import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const companyId = searchParams.get("companyId");

        const whereClause: any = { userId };
        if (companyId) {
            whereClause.companyId = companyId;
        }

        const clients = await prisma.client.findMany({
            where: whereClause,
            include: {
                company: true,
                invoices: {
                    select: {
                        status: true,
                        totalTTC: true
                    }
                },
                _count: {
                    select: { invoices: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        // No need to enrich, the stats are already in the DB
        return NextResponse.json(clients);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching clients", error }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const data = await req.json();

        if (!data.name) {
            return NextResponse.json({ message: "Client name is required." }, { status: 400 });
        }

        const client = await prisma.client.create({
            data: {
                name: data.name,
                firstName: data.firstName || undefined,
                email: data.email || undefined,
                phone: data.phone || undefined,
                address: data.address || undefined,
                city: data.city || undefined,
                country: data.country || undefined,
                companyName: data.companyName || undefined,
                jobTitle: data.jobTitle || undefined,
                type: data.type || "particulier",
                status: data.status || "actif",
                preferredPaymentMethod: data.preferredPaymentMethod || undefined,
                notes: data.notes || undefined,
                zipCode: data.zipCode || undefined,
                taxId: data.taxId || undefined,
                companyId: data.companyId || undefined,
                user: { connect: { id: userId } },
            },
        });

        return NextResponse.json(client, { status: 201 });
    } catch (error) {
        console.error("Client creation error:", error);
        return NextResponse.json({ message: "Error creating client", error: String(error) }, { status: 500 });
    }
}
