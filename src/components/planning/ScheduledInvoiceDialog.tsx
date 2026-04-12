"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useLanguage } from "@/src/context/LanguageContext";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface ScheduledInvoice {
  id: string;
  reference: string;
  clientName: string;
  totalHT?: number;
  nextIssueDate: string;
  status?: string;
  isScaled?: boolean;
}

interface ScheduledInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: ScheduledInvoice | null;
  onSave: (
    invoiceId: string,
    newInvoiceId: string,
    newDate: string,
  ) => Promise<void>;
  availableInvoices?: ScheduledInvoice[];
  isLoading?: boolean;
}

export function ScheduledInvoiceDialog({
  isOpen,
  onOpenChange,
  invoice,
  onSave,
  availableInvoices = [],
  isLoading = false,
}: ScheduledInvoiceDialogProps) {
  const { t } = useLanguage();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
  const [editedDate, setEditedDate] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (invoice?.nextIssueDate) {
      // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
      const date = new Date(invoice.nextIssueDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      setEditedDate(`${year}-${month}-${day}T${hours}:${minutes}`);
      setSelectedInvoiceId(invoice.id);
      setIsEditing(false);
      setError(null);
    }
  }, [invoice, isOpen]);

  const handleInvoiceChange = useCallback((newInvoiceId: string) => {
    setSelectedInvoiceId(newInvoiceId);
    setError(null);
  }, []);

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditedDate(e.target.value);
      setError(null);
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (!invoice?.id || !selectedInvoiceId || !editedDate) {
      setError(t("requiredField") || "Please fill in all fields");
      return;
    }

    try {
      setError(null);
      await onSave(invoice.id, selectedInvoiceId, editedDate);
      onOpenChange(false);
    } catch (err) {
      setError(
        (err as Error).message || t("errorSaving") || "Error saving changes",
      );
    }
  }, [invoice, selectedInvoiceId, editedDate, onSave, onOpenChange, t]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setError(null);
    onOpenChange(false);
  }, [onOpenChange, setIsEditing, setError]);

  if (!invoice) return null;

  const selectedInvoice =
    availableInvoices.find((inv) => inv.id === selectedInvoiceId) || invoice;

  const displayDate = selectedInvoice.nextIssueDate
    ? format(new Date(selectedInvoice.nextIssueDate), "dd MMM yyyy HH:mm")
    : "N/A";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/50 rounded-3xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            {t("scheduledInvoice") || "Facture Planifiée"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invoice Selection */}
          <div className="space-y-2">
            <label
              htmlFor="invoice-select"
              className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              {t("invoiceName") || "Nom de la facture"}
            </label>
            <Select
              value={selectedInvoiceId}
              onValueChange={handleInvoiceChange}
              disabled={isLoading}
            >
              <SelectTrigger
                id="invoice-select"
                className={cn(
                  "rounded-xl border",
                  selectedInvoiceId === invoice.id
                    ? "bg-primary/10 border-primary/20"
                    : "bg-amber-500/10 border-amber-500/20",
                )}
              >
                <SelectValue
                  placeholder={
                    t("selectInvoicePlaceholder") || "Select an invoice..."
                  }
                />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {availableInvoices.map((inv) => (
                  <SelectItem
                    key={inv.id}
                    value={inv.id}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{inv.reference}</span>
                      <span className="text-xs text-muted-foreground">
                        {inv.clientName}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedInvoiceId !== invoice.id && (
              <div className="flex items-start gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <AlertCircle className="size-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-600 font-medium">
                  {t("invoiceWillBeChanged" as any) ||
                    "La facture sera changée lors de la sauvegarde"}
                </p>
              </div>
            )}
          </div>

          {/* Recipient (Read-only) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("recipient") || "Destinataire"}
            </label>
            <div className="px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl text-foreground font-medium">
              {selectedInvoice.clientName || t("noClient") || "No client"}
            </div>
          </div>

          {/* Amount (if available) */}
          {selectedInvoice.totalHT !== undefined && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("amountHT") || "Montant HT"}
              </label>
              <div className="px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl text-foreground font-medium">
                {selectedInvoice.totalHT.toFixed(2)} €
              </div>
            </div>
          )}

          {/* Send Date Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="sendDate"
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                {t("sendDate") || "Date d'envoi"}
              </label>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  {t("edit") || "Modifier"}
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-foreground font-medium">
                {displayDate}
              </div>
            ) : (
              <input
                id="sendDate"
                type="datetime-local"
                value={editedDate}
                onChange={handleDateChange}
                disabled={isLoading}
                className={cn(
                  "w-full px-4 py-3 bg-background border rounded-xl",
                  "text-foreground placeholder-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all",
                )}
              />
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

        <DialogFooter className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="rounded-xl"
          >
            {t("cancel") || "Annuler"}
          </Button>

          {isEditing ? (
            <>
              <Button
                variant="ghost"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
                className="rounded-xl"
              >
                {t("cancelEdit") || "Annuler la modification"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading || !editedDate}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
              >
                {isLoading
                  ? t("saving") || "Enregistrement..."
                  : t("save") || "Enregistrer"}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="rounded-xl"
            >
              {t("editDate") || "Modifier la date"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
