"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { FileWarning, User, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { useInvoice } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { type RecentInvoice } from "./types";
import toast from "react-hot-toast";
import axios from "axios";

export function UnpaidInvoices({
    invoices,
    onUpdate
}: {
    invoices: RecentInvoice[],
    onUpdate?: () => void
}) {
    const router = useRouter();
    const { t, language } = useLanguage();
    const { currency } = useInvoice();

    const handleAction = async (id: string, action: 'paid' | 'scaled') => {
        try {
            const payload = action === 'paid' ? { status: 'paid' } : { isScaled: true };
            const res = await axios.patch(`/api/invoices/${id}`, payload);
            if (res.status === 200) {
                toast.success(t("systemReady") || "Success");
                if (onUpdate) onUpdate();
            }
        } catch (error) {
            toast.error(t("authError") || "Error");
        }
    };

    if (!invoices || invoices.length === 0) {
        return (
            <Card className="bg-card border-border/50 backdrop-blur-xl h-full shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-3 text-foreground font-sans tracking-tight">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                            <FileWarning className="w-5 h-5" />
                        </div>
                        {t("unpaidInvoices") || "Factures Impayées"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground italic">
                    <FileWarning className="w-12 h-12 mb-4 opacity-20" />
                    <p>{t("noInvoicesFound") || "Aucune facture impayée"}.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-card border-border/50 backdrop-blur-xl shadow-2xl flex flex-col h-full overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-3 text-foreground font-sans tracking-tight">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                        <FileWarning className="w-5 h-5" />
                    </div>
                    {t("unpaidInvoices") || "Factures Impayées"}
                </CardTitle>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold">
                    {invoices.length}
                </Badge>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 pt-4 overflow-y-auto max-h-[500px] scrollbar-hide px-6">
                {invoices.map((invoice) => (
                    <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/30 border border-white/5 hover:border-amber-500/30 hover:bg-slate-900/50 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="p-3 rounded-xl bg-slate-900 border border-border group-hover:border-amber-500/50 cursor-pointer"
                                onClick={() => router.push(`/invoice?id=${invoice.id}`)}
                            >
                                <FileWarning className="w-4 h-4 text-muted-foreground group-hover:text-amber-500" />
                            </div>
                            <div className="cursor-pointer" onClick={() => router.push(`/invoice?id=${invoice.id}`)}>
                                <div className="text-sm font-bold text-foreground group-hover:text-amber-500 transition-colors font-sans">
                                    {invoice.reference || t("noRef")}
                                </div>
                                <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5 uppercase tracking-widest font-bold">
                                    <User className="w-3 h-3" />
                                    {invoice.clientName}
                                </div>
                            </div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-2">
                            <div className="text-sm font-black text-foreground font-mono">
                                {invoice.totalHT.toLocaleString()} {currency}
                            </div>
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                    onClick={() => handleAction(invoice.id, 'paid')}
                                    title={t("paid") || "Paid"}
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                                    onClick={() => handleAction(invoice.id, 'scaled')}
                                    title={t("scaled_badge") || "Scale"}
                                >
                                    <TrendingUp className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
