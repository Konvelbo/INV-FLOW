"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";

export function InvoiceListener() {
    useEffect(() => {
        if (typeof window !== "undefined" && window.electronAPI && window.electronAPI.onInvoiceRead) {
            const cleanup = window.electronAPI.onInvoiceRead((invoice: any) => {
                toast.success(
                    `Facture lue: Le client ${invoice.clientName || invoice.client?.name || ""} a lu la facture ${invoice.reference}.`,
                    {
                        duration: 8000,
                        icon: "🧾",
                    }
                );
            });

            return cleanup;
        }
    }, []);

    return null;
}
