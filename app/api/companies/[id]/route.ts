import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const company = await prisma.company.findFirst({
            where: { id: params.id, userId },
        });

        if (!company) return NextResponse.json({ message: "Company not found" }, { status: 404 });

        return NextResponse.json(company);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching company", error }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const data = await req.json();

        const company = await prisma.company.updateMany({
            where: { id: params.id, userId },
            data: {
                name: data.name,
                legalName: data.legalName,
                taxId: data.taxId,
                address: data.address,
                email: data.email,
                phone: data.phone,
                logoUrl: data.logoUrl,
                website: data.website,
                leaderName: data.leaderName,
                legalForm: data.legalForm,
                registrationNumber: data.registrationNumber,
                sector: data.sector,
                description: data.description,
                productsServices: data.productsServices,
                targetMarket: data.targetMarket,
                annualRevenue: data.annualRevenue ? parseFloat(data.annualRevenue) : undefined,
                monthlyRevenue: data.monthlyRevenue ? parseFloat(data.monthlyRevenue) : undefined,
                employeeCount: data.employeeCount ? parseInt(data.employeeCount) : undefined,
                departments: data.departments,
            },
        });

        if (company.count === 0) return NextResponse.json({ message: "Company not found or unauthorized" }, { status: 404 });

        // Fetch the updated company
        const updatedCompany = await prisma.company.findUnique({ where: { id: params.id } });
        return NextResponse.json(updatedCompany);
    } catch (error) {
        return NextResponse.json({ message: "Error updating company", error }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const deleteResult = await prisma.company.deleteMany({
            where: { id: params.id, userId },
        });

        if (deleteResult.count === 0) return NextResponse.json({ message: "Company not found or unauthorized" }, { status: 404 });

        return NextResponse.json({ message: "Company deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting company", error }, { status: 500 });
    }
}
