import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendPushNotification } from "@/lib/push";
import { todoSchema } from "@/lib/validations";

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
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }
      userId = decoded.id;
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const todos = await (prisma as any).todo.findMany({
      where: { userId: userId },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(todos, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
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
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }
      userId = decoded.id;
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const result = todoSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: result.error.format() },
        { status: 400 },
      );
    }

    const data = result.data;

    const createdTodo = await (prisma as any).todo.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || "todo",
        priority: data.priority || "medium",
        category: data.category || "work",
        startTime: data.startTime ? new Date(data.startTime) : null,
        endTime: data.endTime ? new Date(data.endTime) : null,
        completed: data.status === "done",
        user: {
          connect: { id: userId },
        },
      },
    });

    // Trigger push notifications for the new todo
    try {
      const subscriptions = await (prisma as any).pushSubscription.findMany({
        where: { userId: userId },
      });

      if (subscriptions.length > 0) {
        await Promise.all(
          subscriptions.map((sub: any) =>
            sendPushNotification(sub, {
              title: "Nouvelle tâche créée",
              body: `La tâche "${createdTodo.title}" a été ajoutée à votre planning.`,
              url: "/planning",
            }),
          ),
        );
      }
    } catch {
      // Don't fail the request if push fails
    }
    return NextResponse.json(createdTodo, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
