"use client";

import { useEffect } from "react";
import { useNotifications } from "@/src/context/NotificationContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { toast } from "react-hot-toast";

/**
 * Global component that watches for automation events (invoice generation, scheduled sends)
 * and ensures they are recorded as persistent notifications and displayed as toasts.
 */
export default function AutomationWatcher() {
  const { addNotification } = useNotifications();
  const { t } = useLanguage();

  useEffect(() => {
    // @ts-ignore - electronAPI is injected by preload.js
    if (typeof window !== "undefined" && window.electronAPI && window.electronAPI.onAutomationEvent) {
      // Register the listener
      // @ts-ignore
      const removeListener = window.electronAPI.onAutomationEvent((data: any) => {
        const { type, invoiceReference, clientName } = data;

        // Build notification content
        let action = "";
        let target = invoiceReference || "";
        let icon = "🔔";

        if (type === "recurring-generated") {
          action = t("recurringGenerated").replace("{name}", clientName || "Client");
          icon = "🔄";
        } else if (type === "scheduled-sent") {
          action = t("scheduledSent").replace("{name}", clientName || "Client");
          icon = "📧";
        }

        if (action) {
          // 1. Add to persistent notification menu (localStorage)
          addNotification({
            user: "ESSOR",
            action: action,
            target: target,
            type: "invoice",
            silent: false, // This will also trigger a toast via addNotification logic
          });
        }
      });

      // 2. Track when an invoice is read by a client
      // @ts-ignore
      const removeReadListener = window.electronAPI.onInvoiceRead((invoice: any) => {
        const clientName = invoice.client?.name || t("client");
        const ref = invoice.reference || t("noRef");

        // Use translation key: "Facture lue: Le client {client} a lu la facture {ref}."
        const action = t("invoiceReadNotification")
          .replace("{client}", clientName)
          .replace("{ref}", ref);

        addNotification({
          user: "ESSOR",
          action: action,
          target: ref,
          type: "invoice",
          silent: false,
        });
      });

      return () => {
        if (removeListener) removeListener();
        if (removeReadListener) removeReadListener();
      };
    }
  }, [addNotification, t]);

  return null; // This component has no UI
}
