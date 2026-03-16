"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { FileText, User, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { useInvoice } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { type RecentInvoice } from "./types";

export function RecentInvoices({ invoices }: { invoices: RecentInvoice[] }) {
  const router = useRouter();
  const { t, language } = useLanguage();

  const { currency } = useInvoice();

  if (!invoices || invoices.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            {t("recentInvoices")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-slate-500">
          <FileText className="w-12 h-12 mb-4 opacity-20" />
          <p>{t("noInvoicesFound")}.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50 backdrop-blur-xl h-150 flex flex-col shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-3 text-foreground font-sans tracking-tight">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <FileText className="w-5 h-5" />
          </div>
          {t("recentInvoices")}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-secondary hover:text-secondary hover:bg-secondary/10 font-bold text-xs uppercase tracking-widest"
          onClick={() => router.push("/history")}
        >
          {t("viewHistory")}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 pt-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/30 border border-white/5 hover:border-primary/30 hover:bg-slate-900/50 transition-all cursor-pointer group"
            onClick={() => router.push(`/invoice?id=${invoice.id}`)}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-border group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300">
                <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors font-sans">
                  {invoice.reference || t("noRef")}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <User className="w-3 h-3" />
                  {invoice.clientName}
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1.5">
              <div className="text-sm font-bold text-primary font-mono tracking-tight">
                {invoice.totalHT.toLocaleString()} {currency}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[10px] text-muted-foreground font-mono bg-slate-900/50 px-2 py-0.5 rounded-md border border-border/50">
                  {new Date(invoice.createdAt).toLocaleDateString(
                    language === "fr" ? "fr-FR" : "en-US",
                    {
                      day: "2-digit",
                      month: "2-digit",
                    },
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={`text-[9px] px-2 py-0 h-4 border-0 font-bold uppercase tracking-widest ${
                    invoice.isScaled
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  }`}
                >
                  {invoice.isScaled ? t("scaled_badge") : t("waiting_badge")}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
