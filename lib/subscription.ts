// lib/subscription.ts
// Server-side subscription logic — Never expose to client

import { PrismaClient } from "@/src/p_client";

const prisma = new PrismaClient();

export type SubscriptionPlan = "free" | "monthly" | "yearly";
export type SubscriptionStatus = "free" | "active" | "expired";

export interface PlanInfo {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  expiresAt: Date | null;
  isActive: boolean;
  dailyInvoiceCount: number;
  dailyInvoiceResetAt: Date | null;
}

/**
 * Fetches the user's current subscription plan and validates expiry.
 * Also handles auto-expiry if the subscription date has passed.
 */
export async function getUserPlan(userId: string): Promise<PlanInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      subscriptionPlan: true,
      subscriptionExpiresAt: true,
      dailyInvoiceCount: true,
      dailyInvoiceResetAt: true,
    },
  });

  if (!user) throw new Error("Utilisateur introuvable.");

  const now = new Date();
  let status = user.subscriptionStatus as SubscriptionStatus;
  const plan = user.subscriptionPlan as SubscriptionPlan;

  // Auto-expire if the subscription date has passed
  if (
    plan !== "free" &&
    user.subscriptionExpiresAt &&
    user.subscriptionExpiresAt < now &&
    status === "active"
  ) {
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: "expired" },
    });
    status = "expired";
  }

  const isActive = plan === "free" || status === "active";

  return {
    plan,
    status,
    expiresAt: user.subscriptionExpiresAt,
    isActive,
    dailyInvoiceCount: user.dailyInvoiceCount,
    dailyInvoiceResetAt: user.dailyInvoiceResetAt,
  };
}

/**
 * Checks if a user can create a new invoice based on their plan quota.
 * Free plan: max 6 invoices per day (resets at midnight).
 */
export async function canCreateInvoice(
  userId: string
): Promise<{ allowed: boolean; reason?: string; remaining?: number }> {
  const planInfo = await getUserPlan(userId);

  // Paid plans: always allowed
  if (planInfo.plan !== "free" && planInfo.isActive) {
    return { allowed: true };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const resetDate = planInfo.dailyInvoiceResetAt
    ? new Date(planInfo.dailyInvoiceResetAt)
    : null;

  // If the last reset was before today, reset the counter
  if (!resetDate || resetDate < today) {
    await prisma.user.update({
      where: { id: userId },
      data: { dailyInvoiceCount: 0, dailyInvoiceResetAt: today },
    });
    return { allowed: true, remaining: 5 };
  }

  const DAILY_LIMIT = 6;
  if (planInfo.dailyInvoiceCount >= DAILY_LIMIT) {
    return {
      allowed: false,
      reason: `Vous avez atteint la limite de ${DAILY_LIMIT} factures par jour. Passez à un abonnement Premium pour un accès illimité.`,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    remaining: DAILY_LIMIT - planInfo.dailyInvoiceCount,
  };
}

/**
 * Increments the daily invoice count. Call AFTER successfully creating an invoice.
 */
export async function incrementInvoiceCount(userId: string): Promise<void> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  await prisma.user.update({
    where: { id: userId },
    data: {
      dailyInvoiceCount: { increment: 1 },
      dailyInvoiceResetAt: today,
    },
  });
}

/**
 * Checks if a free-plan user is allowed to create another company.
 * Free plan: max 1 company.
 */
export async function canCreateCompany(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const planInfo = await getUserPlan(userId);

  if (planInfo.plan !== "free" && planInfo.isActive) {
    return { allowed: true };
  }

  const companyCount = await prisma.company.count({ where: { userId } });

  if (companyCount >= 1) {
    return {
      allowed: false,
      reason:
        "Le plan gratuit est limité à 1 compagnie. Passez à Premium pour créer des compagnies illimitées.",
    };
  }

  return { allowed: true };
}

/**
 * Checks if the user has access to the AI Assistant feature.
 * Free plan: no AI access.
 */
export async function hasAIAccess(userId: string): Promise<boolean> {
  const planInfo = await getUserPlan(userId);
  return planInfo.plan !== "free" && planInfo.isActive;
}

/**
 * Activates a user's subscription after successful payment.
 * Idempotent: safe to call multiple times with the same reference.
 */
export async function activateSubscription(
  userId: string,
  plan: "monthly" | "yearly",
  ligdicashRef: string,
  amountUsd: number,
  amountLocal: number,
  currency: string
): Promise<boolean> {
  // Idempotency check: if already processed, skip
  const existing = await prisma.paymentTransaction.findUnique({
    where: { ligdicashRef },
  });

  if (existing?.status === "success") {
    return false; // Already processed
  }

  const now = new Date();
  const expiresAt = new Date(now);
  if (plan === "monthly") {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }

  // Atomic transaction: update user + record transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: "active",
        subscriptionPlan: plan,
        subscriptionExpiresAt: expiresAt,
      },
    }),
    prisma.paymentTransaction.upsert({
      where: { ligdicashRef },
      update: { status: "success", processedAt: now },
      create: {
        userId,
        ligdicashRef,
        plan,
        amountUsd,
        amountLocal,
        currency,
        status: "success",
        processedAt: now,
      },
    }),
  ]);

  return true;
}

/**
 * Returns a safe, client-facing summary of the subscription (no sensitive data).
 */
export async function getSubscriptionSummary(userId: string) {
  const info = await getUserPlan(userId);
  const DAILY_LIMIT = 6;

  // Recalculate actual today count
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const resetDate = info.dailyInvoiceResetAt ? new Date(info.dailyInvoiceResetAt) : null;
  const todayCount = resetDate && resetDate >= today ? info.dailyInvoiceCount : 0;

  return {
    plan: info.plan,
    status: info.status,
    isActive: info.isActive,
    expiresAt: info.expiresAt ? info.expiresAt.toISOString() : null,
    dailyInvoiceCount: todayCount,
    dailyInvoiceLimit: info.plan === "free" ? DAILY_LIMIT : null,
    hasAIAccess: info.plan !== "free" && info.isActive,
    hasUnlimitedCompanies: info.plan !== "free" && info.isActive,
    hasUnlimitedInvoices: info.plan !== "free" && info.isActive,
  };
}
