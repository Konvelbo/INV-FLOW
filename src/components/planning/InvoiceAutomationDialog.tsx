"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useLanguage } from "@/src/context/LanguageContext";
import { cn } from "@/lib/utils";
import {
  Check,
  Trash2,
  AlertCircle,
  Repeat,
  Timer,
  PauseCircle,
  PlayCircle
} from "lucide-react";
import { format } from "date-fns";

interface AutomationInvoice {
  id: string;
  reference: string;
  clientName: string;
  totalHT?: number;
  nextIssueDate?: string | null;
  recurrenceFreq?: string | null;
  isRecurring?: boolean;
  status?: string;
}

interface InvoiceAutomationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: AutomationInvoice | null;
  type: "recurring" | "scheduled" | null;
  onUpdateDate: (invoiceId: string, newDate: string) => Promise<void>;
  onUpdateFreq: (invoiceId: string, newFreq: string) => Promise<void>;
  onPauseResume: (invoiceId: string, isPausing: boolean) => Promise<void>;
  onDelete: (invoiceId: string) => Promise<void>;
  isLoading?: boolean;
}

export function InvoiceAutomationDialog({
  isOpen,
  onOpenChange,
  invoice,
  type,
  onUpdateDate,
  onUpdateFreq,
  onPauseResume,
  onDelete,
  isLoading = false,
}: InvoiceAutomationDialogProps) {
  const { t } = useLanguage();
  const [editedDate, setEditedDate] = useState<string>("");
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (invoice?.nextIssueDate) {
      const date = new Date(invoice.nextIssueDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      setEditedDate(`${year}-${month}-${day}T${hours}:${minutes}`);
    } else {
      setEditedDate("");
    }
    setIsEditingDate(false);
    setError(null);
  }, [invoice, isOpen]);

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditedDate(e.target.value);
      setError(null);
    },
    []
  );

  const handleSaveDate = useCallback(async () => {
    if (!invoice?.id || !editedDate) {
      setError(t("requiredField"));
      return;
    }
    try {
      setError(null);
      await onUpdateDate(invoice.id, editedDate);
      setIsEditingDate(false);
    } catch (err: any) {
      setError(err.message || t("errorSaving"));
    }
  }, [invoice, editedDate, onUpdateDate, t]);

  const handleAction = async (action: () => Promise<void>) => {
    try {
      setError(null);
      await action();
    } catch (err: any) {
      setError(err.message || t("genericError"));
    }
  };

  if (!invoice) return null;

  const isRecurring = type === "recurring";
  
  // Theme styling based on type
  const ThemeIcon = isRecurring ? Repeat : Timer;
  
  const displayDate = invoice.nextIssueDate
    ? format(new Date(invoice.nextIssueDate), "dd MMM yyyy HH:mm")
    : t("noDateDefined");

  const isPaused = isRecurring ? invoice.isRecurring === false : invoice.status === "paused";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md bg-card border-border/50 rounded-3xl shadow-2xl overflow-hidden")}>
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${isRecurring ? 'from-indigo-500 to-purple-500' : 'from-amber-400 to-orange-500'}`} />
        
        <DialogHeader className="pt-4">
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl", isRecurring ? "bg-indigo-500/10 text-indigo-500" : "bg-amber-500/10 text-amber-500")}>
              <ThemeIcon className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black tracking-tight text-foreground">
                {isRecurring ? t("recurringInvoice") : t("scheduledInvoice")}
              </DialogTitle>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1">
                {invoice.reference}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Recipient */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("recipient")}
            </label>
            <div className={cn("px-4 py-3 rounded-xl text-foreground font-medium border", isRecurring ? "bg-indigo-500/5 border-indigo-500/20" : "bg-amber-500/5 border-amber-500/20")}>
              {invoice.clientName || t("client")}
            </div>
          </div>

          {/* Amount (if available) */}
          {invoice.totalHT !== undefined && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("amountHT")}
              </label>
              <div className="px-4 py-3 bg-muted/20 border border-border/50 rounded-xl text-foreground font-medium">
                {invoice.totalHT.toFixed(2)} {t("currency_unit")}
              </div>
            </div>
          )}

          {/* Frequency Details (Recurring Only) */}
          {isRecurring && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t("frequency")}
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button disabled={isLoading} className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                      {t("edit")}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl">
                    {[
                      { id: "weekly", label: t("weekly") },
                      { id: "monthly", label: t("monthly") },
                      { id: "yearly", label: t("yearly") },
                    ].map((f) => (
                      <DropdownMenuItem
                        key={f.id}
                        onClick={() => handleAction(() => onUpdateFreq(invoice.id, f.id))}
                        className={cn(
                          "cursor-pointer px-4 py-3 rounded-lg text-sm font-bold mb-1 last:mb-0",
                          invoice.recurrenceFreq === f.id ? "bg-primary/10 text-primary" : ""
                        )}
                      >
                        {f.label}
                        {invoice.recurrenceFreq === f.id && <Check className="w-4 h-4 ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="px-4 py-3 bg-muted/20 border border-border/50 rounded-xl text-foreground font-medium capitalize flex items-center">
                {invoice.recurrenceFreq ? (t(invoice.recurrenceFreq as any) || invoice.recurrenceFreq) : t("noDateDefined")}
                {isPaused && <span className="ml-2 text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded font-bold uppercase">{t("paused")}</span>}
              </div>
            </div>
          )}

          {/* Send Date Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {isRecurring ? t("nextSending") : t("sendDate")}
              </label>
              {!isEditingDate && (
                <button
                  onClick={() => setIsEditingDate(true)}
                  className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  disabled={isLoading}
                >
                  {t("edit")}
                </button>
              )}
            </div>

            {!isEditingDate ? (
              <div className={cn("px-4 py-3 rounded-xl text-foreground font-medium border", isRecurring ? "bg-indigo-500/5 border-indigo-500/20" : "bg-amber-500/5 border-amber-500/20")}>
                {displayDate}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                  <input
                    type="datetime-local"
                    value={editedDate}
                    onChange={handleDateChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-background border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                  />
                  <div className="flex gap-2 justify-end mt-1">
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingDate(false)} disabled={isLoading} className="text-xs">{t("cancel")}</Button>
                      <Button size="sm" onClick={handleSaveDate} disabled={isLoading || !editedDate} className={cn("text-xs text-white", isRecurring ? "bg-indigo-600 hover:bg-indigo-700" : "bg-amber-600 hover:bg-amber-700")}>
                          {t("save")}
                      </Button>
                  </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
              <AlertCircle className="size-4 text-rose-600 mt-0.5 shrink-0" />
              <p className="text-sm text-rose-600 font-medium">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3 pt-4 border-t border-border/50 sm:justify-between items-center w-full mt-4">
            <Button
                variant="outline"
                onClick={() => handleAction(() => onDelete(invoice.id))}
                disabled={isLoading}
                className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 group h-11 px-4"
            >
                <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                {t("delete")}
            </Button>
            
            <div className="flex gap-2">
                {isPaused ? (
                    <Button
                        onClick={() => handleAction(() => onPauseResume(invoice.id, false))}
                        disabled={isLoading}
                        className={cn("rounded-xl h-11 text-white shadow-lg", isRecurring ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20")}
                    >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        {t("start")}
                    </Button>
                ) : (
                    <Button
                        onClick={() => handleAction(() => onPauseResume(invoice.id, true))}
                        disabled={isLoading}
                        className="rounded-xl h-11 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20"
                    >
                        <PauseCircle className="w-4 h-4 mr-2" />
                        {t("pause")}
                    </Button>
                )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
