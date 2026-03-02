"use client";

import React, { useState } from "react";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { FileText, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLanguage } from "@/src/context/LanguageContext";
import Link from "next/link";
import { type RecentInvoice as Invoice } from "./types";
import { useInvoice } from "@/src/context/InvoiceContext";

export function InvoiceCalendar({ invoices }: { invoices: Invoice[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { currency } = useInvoice();
  const { t, language } = useLanguage();

  const locale = language === "fr" ? fr : enUS;

  // Group invoices by date string (ignoring time)
  const invoicesByDate = invoices.reduce(
    (acc: Record<string, Invoice[]>, inv) => {
      const d = new Date(inv.createdAt).toDateString();
      if (!acc[d]) acc[d] = [];
      acc[d].push(inv);
      return acc;
    },
    {},
  );

  const selectedInvoices = date
    ? invoicesByDate[date.toDateString()] || []
    : [];

  // Define modifiers for react-day-picker
  const modifiers = {
    hasInvoice: (d: Date) => !!invoicesByDate[d.toDateString()],
  };

  // Define custom styles for modifiers
  const modifiersClassNames = {
    hasInvoice:
      "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full",
  };

  return (
    <Card className="bg-card border-border/50 backdrop-blur-xl h-180 flex flex-col shadow-2xl overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-3 text-foreground font-sans tracking-tight">
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
            <CalendarIcon className="w-5 h-5" />
          </div>
          {t("calendarInvoices")}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-6 overflow-hidden pt-4">
        {/* Calendar Picker Area */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={locale}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-2xl border border-white/5 bg-slate-900/30 p-4 shadow-inner"
          />
        </div>

        {/* Selected Date Detail Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              {date ? format(date, "d MMMM yyyy", { locale }) : t("selectDate")}
            </div>
            {selectedInvoices.length > 0 && (
              <Badge
                variant="outline"
                className="bg-primary/5 text-primary border-primary/20 text-[9px] font-bold"
              >
                {selectedInvoices.length} {t("invoice")}
                {selectedInvoices.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-none pb-4">
            <AnimatePresence mode="wait">
              {selectedInvoices.length > 0 ? (
                <motion.div
                  key={date?.toDateString()}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3"
                >
                  {selectedInvoices.map((inv) => (
                    <Link
                      href="/history"
                      key={inv.id}
                      className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-primary/40 hover:bg-slate-900/60 transition-all duration-300 flex items-center justify-between group/item cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 group-hover/item:border-primary/50 transition-colors">
                          <FileText className="w-4 h-4 text-muted-foreground group-hover/item:text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors font-sans">
                            {inv.reference || t("noRef")}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-sans">
                            {inv.clientName}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <div className="text-sm font-bold text-primary font-mono whitespace-nowrap">
                          {inv.totalHT.toLocaleString()} {currency}
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[8px] h-4 px-2 border-0 font-black uppercase tracking-widest",
                            inv.isScaled
                              ? "bg-primary/10 text-primary"
                              : "bg-amber-500/10 text-amber-500",
                          )}
                        >
                          {inv.isScaled
                            ? t("scaled_badge")
                            : t("waiting_badge")}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-muted-foreground/30"
                >
                  <div className="p-6 rounded-full bg-slate-950/50 border border-white/5 mb-4 group-hover:scale-110 transition-transform duration-500">
                    <CalendarIcon className="w-10 h-10 opacity-20" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    {t("noTransaction")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
