"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useIPCData } from "@/hooks/useIPCData";

// ---- Types ----
export interface SubscriptionInfo {
  plan: "free" | "monthly" | "yearly";
  status: "free" | "active" | "expired";
  isActive: boolean;
  expiresAt: string | null;
  dailyInvoiceCount: number;
  dailyInvoiceLimit: number | null;
  hasAIAccess: boolean;
  hasUnlimitedCompanies: boolean;
  hasUnlimitedInvoices: boolean;
}

interface SubscriptionContextValue {
  subscription: SubscriptionInfo | null;
  isLoading: boolean;
  refresh: () => void;
  canCreateInvoice: boolean;
  invoicesRemaining: number | null;
}

const DEFAULT_FREE: SubscriptionInfo = {
  plan: "free",
  status: "free",
  isActive: true,
  expiresAt: null,
  dailyInvoiceCount: 0,
  dailyInvoiceLimit: 6,
  hasAIAccess: false,
  hasUnlimitedCompanies: false,
  hasUnlimitedInvoices: false,
};

// ---- Context ----
const SubscriptionContext = createContext<SubscriptionContextValue>({
  subscription: DEFAULT_FREE,
  isLoading: true,
  refresh: () => {},
  canCreateInvoice: true,
  invoicesRemaining: 6,
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        // @ts-ignore
        if (!window.electronAPI) {
          setSubscription(DEFAULT_FREE);
          return;
        }
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        // @ts-ignore
        const res = await window.electronAPI.getData("subscription", user?.id);
        if (!cancelled && res?.success && res.data) {
          setSubscription(res.data as SubscriptionInfo);
        } else {
          if (!cancelled) setSubscription(DEFAULT_FREE);
        }
      } catch {
        if (!cancelled) setSubscription(DEFAULT_FREE);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const dailyLimit = subscription?.dailyInvoiceLimit ?? 6;
  const dailyCount = subscription?.dailyInvoiceCount ?? 0;
  const canCreateInvoice =
    subscription?.hasUnlimitedInvoices || dailyCount < dailyLimit;
  const invoicesRemaining = subscription?.hasUnlimitedInvoices
    ? null
    : Math.max(0, dailyLimit - dailyCount);

  return (
    <SubscriptionContext.Provider
      value={{ subscription, isLoading, refresh, canCreateInvoice, invoicesRemaining }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function usePlanBadge() {
  const { subscription } = useSubscription();
  const plan = subscription?.plan ?? "free";
  const isActive = subscription?.isActive ?? true;

  if (plan === "free") return { label: "FREE", color: "text-muted-foreground", isPro: false };
  if (!isActive) return { label: "EXPIRÉ", color: "text-destructive", isPro: false };
  if (plan === "yearly") return { label: "PRO ANNUEL", color: "text-yellow-400", isPro: true };
  return { label: "PRO", color: "text-primary", isPro: true };
}
