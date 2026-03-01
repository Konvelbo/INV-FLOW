import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendPushNotification } from "@/lib/push";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, title, body } = await req.json();

    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { error: "No subscriptions found" },
        { status: 404 },
      );
    }

    const results = await Promise.all(
      subscriptions.map((sub) =>
        sendPushNotification(sub, {
          title: title || "Test Notification",
          body: body || "Ceci est un test de notification en arrière-plan.",
          url: "/",
        }),
      ),
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Test push failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
