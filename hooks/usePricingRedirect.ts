"use client";

// hooks/usePricingRedirect.ts
// Utility hook – redirect to /pricing when a free-plan limit is hit

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { useSubscription } from "@/src/context/SubscriptionContext";

interface RedirectOptions {
  /** Custom message to show before redirecting */
  message?: string;
  /** Delay in ms before redirecting (gives user time to read toast) */
  delay?: number;
}

/**
 * Returns a function that shows a toast message and redirects to /pricing.
 * Use when a free-plan limit has been hit.
 */
export function usePricingRedirect() {
  const router = useRouter();
  const { subscription } = useSubscription();

  const redirectToPricing = useCallback(
    (options: RedirectOptions = {}) => {
      const {
        message = "Passez à Premium pour continuer sans limite.",
        delay = 1800,
      } = options;

      toast.error(message, {
        duration: delay,
        icon: "🔒",
        style: { fontWeight: "bold" },
      });

      setTimeout(() => {
        router.push("/pricing");
      }, delay);
    },
    [router],
  );

  /**
   * Check invoice quota and redirect if exceeded.
   * Returns true if action is allowed, false if blocked.
   */
  const checkInvoiceQuota = useCallback((): boolean => {
    if (!subscription) return true;
    if (subscription.hasUnlimitedInvoices) return true;

    const limit = subscription.dailyInvoiceLimit ?? 6;
    const count = subscription.dailyInvoiceCount ?? 0;

    if (count >= limit) {
      redirectToPricing({
        message: `Limite atteinte : ${limit} factures/jour sur le plan gratuit. Passez à Premium !`,
        delay: 2000,
      });
      return false;
    }
    return true;
  }, [subscription, redirectToPricing]);

  /**
   * Check company quota and redirect if exceeded.
   * Returns true if action is allowed, false if blocked.
   */
  const checkCompanyQuota = useCallback(
    (currentCompanyCount: number): boolean => {
      if (!subscription) return true;
      if (subscription.hasUnlimitedCompanies) return true;

      if (currentCompanyCount >= 1) {
        redirectToPricing({
          message:
            "Plan gratuit limité à 1 compagnie. Passez à Premium pour des compagnies illimitées !",
          delay: 2000,
        });
        return false;
      }
      return true;
    },
    [subscription, redirectToPricing],
  );

  /**
   * Check AI access and redirect if not allowed.
   * Returns true if action is allowed, false if blocked.
   */
  const checkAIAccess = useCallback((): boolean => {
    if (!subscription) return true;
    if (subscription.hasAIAccess) return true;

    redirectToPricing({
      message:
        "L'Assistant IA est réservé aux abonnés Premium. Découvrez nos plans !",
      delay: 2000,
    });
    return false;
  }, [subscription, redirectToPricing]);

  return {
    redirectToPricing,
    checkInvoiceQuota,
    checkCompanyQuota,
    checkAIAccess,
  };
}
