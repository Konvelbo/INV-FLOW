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

        const expenses = await prisma.expense.findMany({
            where: whereClause,
            include: {
                company: true,
            },
            orderBy: { date: "desc" },
        });

        return NextResponse.json(expenses);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching expenses", error }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const data = await req.json();

        if (!data.title || data.amount === undefined || !data.category) {
            return NextResponse.json({ message: "Title, amount, and category are required." }, { status: 400 });
        }

        const amountValue = data.amount ? parseFloat(data.amount) : 0;

        if (isNaN(amountValue)) {
            return NextResponse.json({ message: "Invalid amount." }, { status: 400 });
        }

        const expense = await prisma.expense.create({
            data: {
                title: data.title,
                amount: amountValue,
                date: data.date ? new Date(data.date) : new Date(),
                category: data.category,
                description: data.description || undefined,
                isDeductible: data.isDeductible === true,
                company: data.companyId ? { connect: { id: data.companyId } } : undefined,
                user: { connect: { id: userId } },
            },
        });

        return NextResponse.json(expense, { status: 201 });
    } catch (error) {
        console.error("Expense creation error:", error);
        return NextResponse.json({ message: "Error creating expense", error: String(error) }, { status: 500 });
    }
}
