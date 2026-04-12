"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/src/context/LanguageContext";

export function InvoiceListener() {
    const { t } = useLanguage();

    useEffect(() => {
        if (typeof window !== "undefined" && window.electronAPI && window.electronAPI.onInvoiceRead) {
            const cleanup = window.electronAPI.onInvoiceRead((invoice: any) => {
                const clientName = invoice.clientName || invoice.client?.name || "";
                const message = t("invoiceReadNotification")
                    .replace("{client}", clientName)
                    .replace("{ref}", invoice.reference || "");

                toast.success(message, {
                    duration: 8000,
                    icon: "🧾",
                });
            });

            return cleanup;
        }
    }, [t]);

    return null;
}
