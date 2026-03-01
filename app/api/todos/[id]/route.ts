import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendPushNotification } from "@/lib/push";
import { todoSchema, todoPatchSchema } from "@/lib/validations";

async function verifyAuth(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return decoded?.id || null;
  } catch {
    return null;
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = todoSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: result.error.format() },
        { status: 400 },
      );
    }

    const data = result.data;

    const existingTodo = await (prisma as any).todo.findUnique({
      where: { id, userId },
    });

    if (!existingTodo) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    const updatedTodo = await (prisma as any).todo.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        category: data.category,
        startTime: data.startTime ? new Date(data.startTime) : null,
        endTime: data.endTime ? new Date(data.endTime) : null,
        reminderAt: data.reminderAt ? new Date(data.reminderAt) : null,
        completed: data.status === "done",
      },
    });

    try {
      const subscriptions = await (prisma as any).pushSubscription.findMany({
        where: { userId },
      });

      if (subscriptions.length > 0) {
        await Promise.all(
          subscriptions.map((sub: any) =>
            sendPushNotification(sub, {
              title: "Tâche modifiée",
              body: `La tâche "${updatedTodo.title}" a été mise à jour.`,
              url: "/planning",
            }),
          ),
        );
      }
    } catch {
      // Ignore push errors
    }

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = todoPatchSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: result.error.format() },
        { status: 400 },
      );
    }

    const data = result.data;

    const existingTodo = await (prisma as any).todo.findUnique({
      where: { id, userId },
    });

    if (!existingTodo) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.status !== undefined) {
      updateData.status = data.status;
      updateData.completed = data.status === "done";
    }
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.startTime !== undefined)
      updateData.startTime = data.startTime ? new Date(data.startTime) : null;
    if (data.endTime !== undefined)
      updateData.endTime = data.endTime ? new Date(data.endTime) : null;
    if (data.reminderAt !== undefined)
      updateData.reminderAt = data.reminderAt
        ? new Date(data.reminderAt)
        : null;
    if (data.completed !== undefined) updateData.completed = data.completed;

    const updatedTodo = await (prisma as any).todo.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingTodo = await (prisma as any).todo.findUnique({
      where: { id, userId },
    });

    if (!existingTodo) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    await (prisma as any).todo.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
