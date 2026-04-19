// app/api/subscription/webhook/route.ts
// LigdiCash payment webhook — receives payment confirmation and activates subscription

import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import crypto from "crypto";

export const dynamic = "force-dynamic";

async function verifySignature(
  rawBody: string,
  signature: string,
): Promise<boolean> {
  const secret = process.env.LIGDICASH_WEBHOOK_SECRET;
  const isDev = process.env.NODE_ENV === "development";

  if (!secret) {
    if (isDev) {
      return true;
    }
    return false;
  }

  try {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature.replace("sha256=", ""), "hex"),
      Buffer.from(expected, "hex"),
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

  let client;
  try {
    if (!process.env.DATABASE_URL) throw new Error("DB URL missing");
    client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();
    const db = client.db();

    // Idempotency check: only process once
    const existingTx = await db.collection("PaymentTransaction").findOne({
      ligdicashRef: reference,
    });

    if (!existingTx) {
      return NextResponse.json({ ok: true }); // Acknowledge without error
    }

    if (existingTx.status === "success") {
      return NextResponse.json({ ok: true }); // Already processed
    }

    const isSuccess =
      status === "completed" ||
      status === "success" ||
      payload.response_code === "00";

    if (!isSuccess) {
      await db.collection("PaymentTransaction").updateOne(
        { ligdicashRef: reference },
        { $set: { status: "failed", processedAt: new Date() } }
      );
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

    // Sequential atomic updates using the native driver
    await db.collection("User").updateOne(
      { _id: new ObjectId(existingTx.userId.toString()) },
      {
        $set: {
          subscriptionStatus: "active",
          subscriptionPlan: existingTx.plan,
          subscriptionExpiresAt: expiresAt,
        },
      }
    );

    await db.collection("PaymentTransaction").updateOne(
      { ligdicashRef: reference },
      { $set: { status: "success", processedAt: now } }
    );
  } catch (err) {
    console.error("Webhook DB error", err);
  } finally {
    if (client) await client.close();
  }

  return NextResponse.json({ ok: true });
}
