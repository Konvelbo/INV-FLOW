import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const expense = await prisma.expense.findFirst({
            where: { id: params.id, userId },
            include: {
                company: true,
            }
        });

        if (!expense) return NextResponse.json({ message: "Expense not found" }, { status: 404 });

        return NextResponse.json(expense);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching expense", error }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const data = await req.json();

        const expenseUpdate = await prisma.expense.updateMany({
            where: { id: params.id, userId },
            data: {
                title: data.title,
                amount: data.amount !== undefined ? parseFloat(data.amount) : undefined,
                date: data.date ? new Date(data.date) : undefined,
                category: data.category,
                description: data.description,
                isDeductible: data.isDeductible !== undefined ? data.isDeductible === true : undefined,
                companyId: data.companyId,
            },
        });

        if (expenseUpdate.count === 0) return NextResponse.json({ message: "Expense not found or unauthorized" }, { status: 404 });

        const updatedExpense = await prisma.expense.findUnique({ where: { id: params.id } });
        return NextResponse.json(updatedExpense);
    } catch (error) {
        return NextResponse.json({ message: "Error updating expense", error }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const deleteResult = await prisma.expense.deleteMany({
            where: { id: params.id, userId },
        });

        if (deleteResult.count === 0) return NextResponse.json({ message: "Expense not found or unauthorized" }, { status: 404 });

        return NextResponse.json({ message: "Expense deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting expense", error }, { status: 500 });
    }
}
