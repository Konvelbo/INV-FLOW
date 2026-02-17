"use strict";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

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
      if (!decoded || !decoded.id) {
        throw new Error("Invalid token");
      }
      userId = decoded.id;
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Use raw query to bypass Prisma Client desync for isScaled field
    const rawResult = await (prisma as any).$runCommandRaw({
      find: "Invoice",
      filter: {
        _id: { $oid: params.id },
        userId: { $oid: userId },
      },
    });

    const rawInvoice = rawResult.cursor.firstBatch[0];

    if (!rawInvoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 },
      );
    }

    // Manually fetch items since $runCommandRaw doesn't do "include"
    const items = await prisma.invoiceItem.findMany({
      where: { invoiceId: params.id },
    });

    const invoice = {
      ...rawInvoice,
      id: rawInvoice._id.$oid,
      createdAt: rawInvoice.createdAt.$date
        ? new Date(rawInvoice.createdAt.$date)
        : new Date(rawInvoice.createdAt),
      items,
    };

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

    // Verify ownership first because update where MUST be unique
    const existing = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Not found or unauthorized" },
        { status: 404 },
      );
    }

    // Forcing raw update for MongoDB to bypass Prisma Client validation desync on Windows
    await (prisma as any).$runCommandRaw({
      update: "Invoice",
      updates: [
        {
          q: { _id: { $oid: params.id } },
          u: { $set: { isScaled: isScaled } },
        },
      ],
    });

    return NextResponse.json(
      { message: "Updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error toggling isScaled:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
