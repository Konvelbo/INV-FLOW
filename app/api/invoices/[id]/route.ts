"use strict";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { revalidatePath } from "next/cache";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      userId = decoded.id;
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
      include: {
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      userId = decoded.id;
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // First check if invoice exists and belongs to user
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        author: {
          id: userId,
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 },
      );
    }

    // Delete items first (if cascade delete isn't set up, but usually relation handles it or we do it manually)
    // Prisma cascading deletes require explicit config in schema or manual deletion.
    // Let's assume manual deletion for safety or relying on Prisma relation actions if configured.
    // Based on schema, we have `items InvoiceItem[]`.
    // Let's delete items first to be safe.
    await prisma.invoiceItem.deleteMany({
      where: {
        invoiceId: params.id,
      },
    });

    await prisma.invoice.delete({
      where: {
        id: params.id,
      },
    });

    revalidatePath("/dashboard");
    return NextResponse.json(
      { message: "Invoice deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      userId = decoded.id;
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const data = await req.json();

    // Verify invoice ownership
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        author: { id: userId },
      },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { message: "Invoice not found or unauthorized" },
        { status: 404 },
      );
    }

    // Delete existing items
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: params.id },
    });

    // Update invoice and create new items
    const updatedInvoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        reference: data.reference,
        city: data.city,
        clientName: data.clientName,
        clientAddress: data.clientAddress,
        clientContact: data.clientContact,
        clientPOBox: data.clientPOBox,
        object: data.object,
        managerName: data.managerName,
        totalHT: parseFloat(data.totalHT),
        totalMaterial: parseFloat(data.totalMaterial),
        amountWords: data.amountWords,
        items: {
          create: data.items.map((item: any) => ({
            designation: item.designation,
            unit: item.unit,
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
            totalPrice: parseFloat(item.totalPrice),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    revalidatePath("/dashboard");
    return NextResponse.json(updatedInvoice, { status: 200 });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      userId = decoded.id;
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { isScaled } = await req.json();

    const updated = await prisma.invoice.update({
      where: {
        id: params.id,
        userId: userId,
      },
      data: {
        isScaled: isScaled,
      },
    });

    revalidatePath("/dashboard");
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error toggling isScaled:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
