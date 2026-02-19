"use strict";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
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

    // Use standard Prisma Client findMany
    const invoices = await prisma.invoice.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
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

    const data = await req.json();

    // Validate input data (simplified validation, can be more robust)
    if (!data || !data.reference || !data.clientName || !data.items) {
      return NextResponse.json(
        { message: "Invalid input data. Required fields are missing." },
        { status: 400 },
      );
    }

    const createdInvoice = await prisma.invoice.create({
      data: {
        reference: data.reference,
        city: data.city,
        clientName: data.clientName,
        clientAddress: data.clientAddress,
        clientContact: data.clientContact,
        clientPOBox: data.clientPOBox,
        object: data.object,
        managerName: data.managerName,
        totalHT: data.totalHT,
        author: {
          connect: { id: userId },
        },
        totalMaterial: data.totalMaterial,
        items: {
          create: data.items.map((item: any) => ({
            designation: item.designation,
            unit: item.unit,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
    });

    revalidatePath("/dashboard");
    return NextResponse.json(createdInvoice, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
