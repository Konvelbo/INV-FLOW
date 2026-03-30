// lib/ligdicash.ts
// LigdiCash payment gateway integration — server-side only

import crypto from "crypto";

const LIGDICASH_ENV = process.env.LIGDICASH_ENV || "test";
const LIGDICASH_API_KEY = process.env.LIGDICASH_API_KEY || "";
const LIGDICASH_API_TOKEN = process.env.LIGDICASH_API_TOKEN || "";
const LIGDICASH_WEBHOOK_SECRET = process.env.LIGDICASH_WEBHOOK_SECRET || "";

const BASE_URL =
  LIGDICASH_ENV === "live"
    ? "https://app.ligdicash.com/pay/v01"
    : "https://app.ligdicash.com/pay/v01"; // LigdiCash uses same URL, test mode is controlled by env

export interface PaymentInitParams {
  amount: number;          // Amount in local currency (e.g., XOF)
  currency: string;        // e.g., "XOF", "EUR", "USD"
  description: string;     // e.g., "Abonnement Mensuel - ESSOR"
  customerEmail?: string;
  customerId?: string;     // Your internal user ID
  reference: string;       // Your unique transaction reference
  returnUrl: string;       // URL after payment success
  cancelUrl: string;       // URL after payment cancel
  callbackUrl: string;     // Webhook URL for async notification
}

export interface PaymentInitResponse {
  success: boolean;
  paymentUrl?: string;
  token?: string;
  error?: string;
}

/**
 * Initialize a LigdiCash payment and get the payment URL.
 */
export async function initializePayment(
  params: PaymentInitParams
): Promise<PaymentInitResponse> {
  try {
    const payload = {
      apikey: LIGDICASH_API_KEY,
      site_id: LIGDICASH_API_KEY,
      notify_url: params.callbackUrl,
      return_url: params.returnUrl,
      cancel_url: params.cancelUrl,
      description: params.description,
      montant: params.amount,
      devise: params.currency,
      reference: params.reference,
      customer: {
        email: params.customerEmail || "",
        id: params.customerId || "",
      },
      env: LIGDICASH_ENV,
    };

    const response = await fetch(`${BASE_URL}/payin/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LIGDICASH_API_TOKEN}`,
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.response_code === "00" && data.token) {
      const paymentUrl = `${BASE_URL}/payin/?token=${data.token}`;
      return { success: true, paymentUrl, token: data.token };
    }

    console.error("LigdiCash init error:", data);
    return {
      success: false,
      error: data.response_text || "Erreur lors de l'initiation du paiement.",
    };
  } catch (err: any) {
    console.error("LigdiCash fetch error:", err);
    return { success: false, error: "Erreur de connexion au service de paiement." };
  }
}

/**
 * Verify the HMAC-SHA256 signature of a LigdiCash webhook.
 * This ensures the webhook is genuinely from LigdiCash.
 */
export function verifyWebhookSignature(
  rawBody: string,
  receivedSignature: string
): boolean {
  if (!LIGDICASH_WEBHOOK_SECRET) {
    console.warn("LIGDICASH_WEBHOOK_SECRET is not set — skipping signature verification in dev");
    return true; // Allow in dev if secret not configured
  }

  const expectedSignature = crypto
    .createHmac("sha256", LIGDICASH_WEBHOOK_SECRET)
    .update(rawBody, "utf8")
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(receivedSignature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Check the current status of a transaction.
 */
export async function checkTransactionStatus(token: string): Promise<{
  status: "success" | "pending" | "failed";
  reference?: string;
}> {
  try {
    const response = await fetch(`${BASE_URL}/payin/check-status/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LIGDICASH_API_TOKEN}`,
      },
      body: JSON.stringify({ token, apikey: LIGDICASH_API_KEY }),
    });

    const data = await response.json();

    if (data.status === "completed" || data.response_code === "00") {
      return { status: "success", reference: data.reference };
    }

    if (data.status === "pending") return { status: "pending" };
    return { status: "failed" };
  } catch {
    return { status: "failed" };
  }
}

/**
 * Generate a unique payment reference.
 */
export function generatePaymentReference(userId: string, plan: string): string {
  const timestamp = Date.now();
  const hash = crypto
    .createHash("sha256")
    .update(`${userId}-${plan}-${timestamp}`)
    .digest("hex")
    .substring(0, 8)
    .toUpperCase();
  return `ESSOR-${plan.toUpperCase().substring(0, 3)}-${hash}`;
}
