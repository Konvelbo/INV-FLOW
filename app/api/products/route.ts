import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const products = await prisma.product.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching products", error }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const data = await req.json();

        if (!data.name || data.price === undefined) {
            return NextResponse.json({ message: "Name and price are required." }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description || null,
                price: parseFloat(data.price),
                taxRate: data.taxRate ? parseFloat(data.taxRate) : 0,
                unit: data.unit || "U",
                user: { connect: { id: userId } },
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating product", error }, { status: 500 });
    }
}
