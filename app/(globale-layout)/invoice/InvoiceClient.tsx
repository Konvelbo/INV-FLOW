"use client";

import { useLanguage } from "@/src/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import InvoiceCanvas, { ChoiceInvoice } from "@/src/components/InvoiceCanvas";
import { Button } from "@/src/components/ui/button";
import { useInvoice } from "@/src/context/InvoiceContext";
import toast from "react-hot-toast";
import {
  Download,
  Loader2,
  FileText,
  Save,
  Zap,
  X,
  Settings2,
  Mail,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/src/context/NotificationContext";
import SmartAutofill from "@/src/components/SmartAutofill";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Label } from "@/src/components/ui/label";
import { useIPCAction } from "@/hooks/useIPCAction";
import { invoiceTemplate } from "@/lib/invoice-pdf";

interface InvoiceClientProps {
  initialData?: any;
  invoiceId?: string | null;
}

export default function InvoiceClient({
  initialData,
  invoiceId,
}: InvoiceClientProps) {
  const [loading, setLoading] = useState(false);
  const divRef = useRef(null);
  const { performAction, loading: actionLoading } = useIPCAction();
  const { t, language } = useLanguage();
  const {
    itemsArr,
    city,
    clientName,
    clientAddress,
    clientContact,
    clientPOBox,
    reference,
    object,
    managerName,
    amountWords,
    style,
    currency,
    setInvoiceData,
    clientId,
    totalMaterial,
    totalHT,
    invoiceType,
    setInvoiceType,
    companyName,
  } = useInvoice();

  // Advanced Settings State
  const [invoiceStatus, setInvoiceStatus] = useState(
    initialData?.status || "draft",
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : "",
  );
  const [isRecurring, setIsRecurring] = useState(
    initialData?.isRecurring || false,
  );
  const [frequency, setFrequency] = useState(
    initialData?.recurrenceFreq || "monthly",
  );

  // Email State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [isFetchingClients, setIsFetchingClients] = useState(false);

  const { addNotification } = useNotifications();

  // Initialize with initialData if provided
  useEffect(() => {
    if (initialData) {
      setInvoiceData({ 
        ...initialData, 
        invoiceType: initialData.type || "invoice",
        companyName: initialData.companyName || "" 
      });
    }
  }, [initialData, setInvoiceData]);

  useEffect(() => {
    if (isEmailModalOpen) {
      const fetchClients = async () => {
        setIsFetchingClients(true);
        try {
          // @ts-ignore
          if (window.electronAPI) {
            // @ts-ignore
            const res = await window.electronAPI.getData("clients");
            if (res.success) {
              setClients(res.data);
            }
          }
        } catch (error) {
          console.error("Failed to fetch clients", error);
        } finally {
          setIsFetchingClients(false);
        }
      };
      fetchClients();
    }
  }, [isEmailModalOpen]);

  const handleDownloadPDF = async () => {
    if (!reference || !clientName || itemsArr.length === 0) {
      toast.error(t("fillFields"));
      return;
    }

    setLoading(true);
    try {
      // Auto-save before download as requested
      await handleSave();

      const data = {
        reference,
        city,
        clientName,
        clientAddress,
        clientContact,
        clientPOBox,
        object,
        items: itemsArr,
        totalHT: itemsArr.reduce(
          (sum: number, item: any) =>
            sum + (item.totalPrice || item.quantity * item.unitPrice),
          0,
        ),
        totalMaterial: itemsArr.reduce(
          (sum: number, item: any) => sum + Number(item.quantity),
          0,
        ),
        managerName,
        amountWords,
        style,
        type: invoiceType,
        companyName,
        currencyCode: currency,
        language,
      };

      const html = invoiceTemplate(data);
      // @ts-ignore
      const pdfBuffer = await window.electronAPI.generatePDF(html);

      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${reference.replace(/\//g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(t("pdfSuccess"));
    } catch (error: any) {
      console.error("PDF generation error", error);
      toast.error(error.message || "Erreur lors de la génération du PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const data = {
      reference: reference || "",
      type: invoiceType,
      companyName,
      status: invoiceStatus,
      city: city || "",
      clientName: clientName || "",
      clientAddress: clientAddress || "",
      clientContact: clientContact || "",
      clientPOBox: clientPOBox || "",
      object: object || "",
      managerName: managerName || "",
      totalHT: itemsArr.reduce(
        (sum: number, item: any) =>
          sum + (item.totalPrice || item.quantity * item.unitPrice),
        0,
      ),
      totalMaterial: itemsArr.reduce(
        (sum: number, item: any) => sum + Number(item.quantity),
        0,
      ),
      amountWords: amountWords || "",
      items: itemsArr || [],
      currencyCode: currency,
      style: style || "default",
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      isRecurring,
      recurrenceFreq: isRecurring ? frequency : null,
      clientId: clientId || null,
    };

    if (!data.reference || !data.clientName || data.items.length === 0) {
      toast.error(t("fillFields"));
      return;
    }

    const method = invoiceId ? "update" : "create";
    const params = invoiceId ? [invoiceId, data] : [data];

    const res = await performAction("invoices", method, ...params);

    if (res.success) {
      toast.success(invoiceId ? t("updateSuccess") : t("saveSuccess"));
      addNotification({
        user: "Système",
        action: invoiceId ? "a modifié" : "a créé",
        target: `la facture ${data.reference}`,
        type: "invoice",
        silent: true,
      });
    }
  };

  const handleSendEmail = async () => {
    if (!targetEmail) {
      toast.error(t("invalidEmail"));
      return;
    }

    if (!invoiceId) {
      toast.error(t("saveFirst"));
      setIsEmailModalOpen(false);
      return;
    }

    setIsSendingEmail(true);
    const params = invoiceId ? [invoiceId, targetEmail] : [targetEmail];
    const res = await performAction("invoices", "send", ...params);

    if (res.success) {
      toast.success(t("emailSentSuccess"));
      setIsEmailModalOpen(false);
      setTargetEmail("");
      // When sent, it becomes pending
      setInvoiceStatus("pending");
      // Trigger a save to update the status in DB
      setTimeout(handleSave, 100);
    }
    setIsSendingEmail(false);
  };

  return (
    <div className="min-h-screen min-w-full bg-background pt-20 text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground relative overflow-hidden flex flex-col items-center p-6 md:p-10 lg:p-12 pb-32">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] animate-bounce-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-8xl px- mb-16 flex justify-between items-center animate-fade-in-up">
        <div className="flex items-center gap-8">
          <div className="p-5 bg-card/40 backdrop-blur-2xl rounded-lg border border-border/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] group hover:border-primary/50 transition-all duration-500">
            <FileText className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="h-1 w-10 bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-primary font-black text-[11px] uppercase tracking-[0.4em]">
                Flow Engine v2
              </span>
            </div>
            <h1 className="text-5xl font-bold text-foreground tracking-tighter bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent">
              {t("invoiceEditor")}
            </h1>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-4 group hover:border-white/20 transition-all">
            <div className="size-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">
                Status
              </span>
              <span className="text-xs font-bold text-white tracking-tight">
                {t("systemReady")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <SmartAutofill />

      <div className="w-full max-w-[1300px] px-8 mb-6 flex justify-end animate-fade-in-up">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 font-bold backdrop-blur-xl border-border/50 shadow-lg"
            >
              <Settings2 className="w-4 h-4" />
              {t("documentSettings")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 space-y-4 bg-card/95 backdrop-blur-2xl border-border/50 text-foreground mr-8">
            <div className="space-y-2">
              <h4 className="font-bold">{t("documentType")}</h4>
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setInvoiceType("invoice")}
                  className={cn(
                    "flex-1 text-xs py-1.5 rounded-md font-bold transition-all",
                    invoiceType === "invoice"
                      ? "bg-background shadow text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {t("invoice")}
                </button>
                <button
                  onClick={() => setInvoiceType("quote")}
                  className={cn(
                    "flex-1 text-xs py-1.5 rounded-md font-bold transition-all",
                    invoiceType === "quote"
                      ? "bg-background shadow text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {t("quote")}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold">{t("statut")}</h4>
              <select
                value={invoiceStatus}
                onChange={(e) => setInvoiceStatus(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="draft">{t("draft")}</option>
                <option value="pending">{t("sent")}</option>
                <option value="paid">{t("paid")}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">{t("dueDate")}</Label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              />
            </div>

            <div className="space-y-3 pt-3 border-t border-border/50">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-sm font-bold">
                  {t("recurringInvoice")}
                </span>
              </label>
              {isRecurring && (
                <div className="pl-6 animate-in slide-in-from-left-2 duration-300">
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="weekly">{t("weekly")}</option>
                    <option value="monthly">{t("monthly")}</option>
                    <option value="yearly">{t("yearly")}</option>
                  </select>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <ChoiceInvoice />

      <div className="relative z-10 flex-1 w-full max-w-[1300px] mt-5 flex justify-center animate-fade-in-up delay-100 px-8">
        <div className="relative w-full group/canvas">
          <div className="absolute -inset-10 bg-linear-to-tr from-primary/15 via-transparent to-secondary/15 rounded-lg blur-[80px] opacity-40 group-hover/canvas:opacity-70 transition duration-1000 pointer-events-none"></div>

          <div className="relative bg-card/30 border border-border/40 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] rounded-lg overflow-hidden backdrop-blur-3xl p-1">
            <div className="bg-background/80 rounded-lg overflow-hidden">
              <InvoiceCanvas divRef={divRef} />
            </div>
          </div>
        </div>
      </div>

      <div className="fab-container">
        <div className="relative flex items-center justify-center">
          <div className="fab-item fab-item-left">
            <Button
              onClick={handleSave}
              disabled={loading}
              className={cn(
                "h-14 w-14 rounded-lg shadow-2xl border border-white/10 bg-card/90 backdrop-blur-2xl text-foreground hover:bg-emerald-500 hover:text-white hover:-translate-y-1 transition-all duration-300 cursor-pointer",
                loading && "opacity-50",
              )}
              title={t("save")}
            >
              <Save className="h-7 w-7" />
            </Button>
          </div>

          <div className="fab-item fab-item-up">
            <Button
              onClick={handleDownloadPDF}
              disabled={loading}
              className={cn(
                "h-14 w-14 rounded-lg shadow-2xl border border-white/10 bg-card/90 backdrop-blur-2xl text-foreground hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all duration-300 cursor-pointer",
                loading && "opacity-50",
              )}
              title={t("download")}
            >
              <Download className="h-7 w-7" />
            </Button>
          </div>

          <div className="fab-item fab-item-center">
            <Button
              onClick={() => {
                if (!invoiceId) {
                  toast.error(t("saveFirst"));
                  return;
                }
                setIsEmailModalOpen(true);
              }}
              disabled={loading}
              className={cn(
                "h-14 w-14 rounded-lg shadow-2xl border border-white/10 bg-card/90 backdrop-blur-2xl text-foreground cursor-pointer ",
                loading && "opacity-50",
              )}
              title={t("sendInvoiceEmail")}
            >
              <Mail className="h-6 w-6" />
            </Button>
          </div>

          <div className="relative z-10">
            <div className="fab-glow"></div>
            <Button
              disabled={loading}
              className={cn(
                "h-18 w-18 rounded-lg bg-primary flex items-center justify-center fab-main-btn cursor-pointer",
                loading && "opacity-80 scale-95",
              )}
            >
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <div className="relative h-8 w-8">
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity group-hover:opacity-0">
                    <Zap className="h-8 w-8 fill-white" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rotate-0 group-hover:-rotate-90">
                    <X className="h-8 w-8" />
                  </div>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {isEmailModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-card w-full max-w-md rounded-lg border border-border/50 shadow-2xl p-6 animate-fade-in-up">
            <h3 className="text-xl font-bold mb-2">{t("sendInvoiceEmail")}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("sendInvoiceEmailDesc")}
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">
                  {t("clientEmailAddress")}
                </label>
                <div className="flex flex-col gap-3">
                  <select
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                    onChange={(e) => {
                      const selectedEmail = e.target.value;
                      if (selectedEmail) setTargetEmail(selectedEmail);
                    }}
                    value=""
                  >
                    <option value="" disabled>
                      {isFetchingClients
                        ? "Chargement des clients..."
                        : "Choisir un client..."}
                    </option>
                    {clients.map(
                      (client) =>
                        client.email && (
                          <option key={client.id} value={client.email}>
                            {client.firstName ? client.firstName + " " : ""}
                            {client.name}{" "}
                            {client.companyName
                              ? `(${client.companyName})`
                              : ""}{" "}
                            - {client.email}
                          </option>
                        ),
                    )}
                  </select>

                  <div className="flex items-center gap-2">
                    <div className="h-px bg-border/50 flex-1"></div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                      OU
                    </span>
                    <div className="h-px bg-border/50 flex-1"></div>
                  </div>

                  <input
                    type="email"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="Saisir une adresse e-mail manuellement..."
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setIsEmailModalOpen(false)}
                  disabled={isSendingEmail}
                >
                  {t("cancel")}
                </Button>
                <Button
                  className="flex-1 rounded-xl gap-2"
                  onClick={handleSendEmail}
                  disabled={isSendingEmail || !targetEmail}
                >
                  {isSendingEmail ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {t("send")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
