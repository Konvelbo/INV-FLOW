import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const companies = await prisma.company.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(companies);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching companies", error }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const data = await req.json();

        // Validate required fields (name)
        if (!data.name) {
            return NextResponse.json({ message: "Company name is required." }, { status: 400 });
        }

        const company = await prisma.company.create({
            data: {
                name: data.name,
                legalName: data.legalName || null,
                taxId: data.taxId || null,
                address: data.address || null,
                email: data.email || null,
                phone: data.phone || null,
                logoUrl: data.logoUrl || null,
                website: data.website || null,
                leaderName: data.leaderName || null,
                legalForm: data.legalForm || null,
                registrationNumber: data.registrationNumber || null,
                sector: data.sector || null,
                description: data.description || null,
                productsServices: data.productsServices || null,
                targetMarket: data.targetMarket || null,
                annualRevenue: data.annualRevenue ? parseFloat(data.annualRevenue) : null,
                monthlyRevenue: data.monthlyRevenue ? parseFloat(data.monthlyRevenue) : null,
                employeeCount: data.employeeCount ? parseInt(data.employeeCount) : null,
                departments: data.departments || null,
                user: { connect: { id: userId } },
            },
        });

        return NextResponse.json(company, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating company", error }, { status: 500 });
    }
}
