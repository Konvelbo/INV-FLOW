import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const product = await prisma.product.findFirst({
            where: { id, userId },
        });

        if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching product", error }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const data = await req.json();

        const productUpdate = await prisma.product.updateMany({
            where: { id, userId },
            data: {
                name: data.name,
                description: data.description,
                price: data.price !== undefined ? parseFloat(data.price) : undefined,
                taxRate: data.taxRate !== undefined ? parseFloat(data.taxRate) : undefined,
                unit: data.unit,
            },
        });

        if (productUpdate.count === 0) return NextResponse.json({ message: "Product not found or unauthorized" }, { status: 404 });

        const updatedProduct = await prisma.product.findUnique({ where: { id } });
        return NextResponse.json(updatedProduct);
    } catch (error) {
        return NextResponse.json({ message: "Error updating product", error }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const deleteResult = await prisma.product.deleteMany({
            where: { id, userId },
        });

        if (deleteResult.count === 0) return NextResponse.json({ message: "Product not found or unauthorized" }, { status: 404 });

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting product", error }, { status: 500 });
    }
}
