import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const client = await prisma.client.findFirst({
            where: { id, userId },
            include: {
                company: true,
                invoices: {
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        if (!client) return NextResponse.json({ message: "Client not found" }, { status: 404 });

        // Return client with stored stats
        return NextResponse.json(client);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching client", error }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const data = await req.json();

        const clientUpdate = await prisma.client.updateMany({
            where: { id: id, userId },
            data: {
                name: data.name,
                firstName: data.firstName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: data.city,
                country: data.country,
                companyName: data.companyName,
                jobTitle: data.jobTitle,
                type: data.type,
                status: data.status,
                preferredPaymentMethod: data.preferredPaymentMethod,
                notes: data.notes,
                zipCode: data.zipCode,
                taxId: data.taxId,
                companyId: data.companyId,
            },
        });

        if (clientUpdate.count === 0) return NextResponse.json({ message: "Client not found or unauthorized" }, { status: 404 });

        const updatedClient = await prisma.client.findUnique({ where: { id: id } });
        return NextResponse.json(updatedClient);
    } catch (error) {
        return NextResponse.json({ message: "Error updating client", error }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const deleteResult = await prisma.client.deleteMany({
            where: { id: id, userId },
        });

        if (deleteResult.count === 0) return NextResponse.json({ message: "Client not found or unauthorized" }, { status: 404 });

        return NextResponse.json({ message: "Client deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting client", error }, { status: 500 });
    }
}
