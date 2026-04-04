// app/api/subscription/webhook/route.ts
// LigdiCash payment webhook — receives payment confirmation and activates subscription

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/src/p_client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function verifySignature(rawBody: string, signature: string): Promise<boolean> {
  const secret = process.env.LIGDICASH_WEBHOOK_SECRET;
  if (!secret) return true; // Allow in dev if secret not set

  try {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature.replace("sha256=", ""), "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Verify signature
  const signature =
    req.headers.get("x-ligdicash-signature") ||
    req.headers.get("x-signature") ||
    "";

  if (!(await verifySignature(rawBody, signature))) {
    console.error("Webhook: Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { reference, status, token } = payload;

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  // Idempotency check: only process once
  const existingTx = await prisma.paymentTransaction.findUnique({
    where: { ligdicashRef: reference },
  });

  if (!existingTx) {
    console.warn(`Webhook: Unknown reference ${reference}`);
    return NextResponse.json({ ok: true }); // Acknowledge without error
  }

  if (existingTx.status === "success") {
    console.log(`Webhook: Already processed ${reference}`);
    return NextResponse.json({ ok: true }); // Already processed
  }

  const isSuccess =
    status === "completed" ||
    status === "success" ||
    payload.response_code === "00";

  if (!isSuccess) {
    await prisma.paymentTransaction.update({
      where: { ligdicashRef: reference },
      data: { status: "failed", processedAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  }

  // Calculate expiry date
  const now = new Date();
  const expiresAt = new Date(now);
  if (existingTx.plan === "monthly") {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }

  // Atomic update: activate subscription + mark transaction as success
  await prisma.$transaction([
    prisma.user.update({
      where: { id: existingTx.userId },
      data: {
        subscriptionStatus: "active",
        subscriptionPlan: existingTx.plan,
        subscriptionExpiresAt: expiresAt,
      },
    }),
    prisma.paymentTransaction.update({
      where: { ligdicashRef: reference },
      data: { status: "success", processedAt: now },
    }),
  ]);

  console.log(`✅ Subscription activated: ${reference} for user ${existingTx.userId}`);
  return NextResponse.json({ ok: true });
}
