"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Trash2,
  Eye,
  Search,
  X,
  Calendar,
  DollarSign,
  Package,
  User,
  Mail,
  Send,
  CalendarClock,
  Clock,
  CheckCheck,
} from "lucide-react";
import { useInvoice } from "@/src/context/InvoiceContext";
import { formatPrice } from "@/lib/currency";
import { useLanguage } from "@/src/context/LanguageContext";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/src/context/NotificationContext";
import { useIPCAction } from "@/hooks/useIPCAction";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface HistoryClientProps {
  initialInvoices: any[];
}

export default function HistoryClient({ initialInvoices }: HistoryClientProps) {
  const [invoices, setInvoices] = useState<any[]>(initialInvoices);

  // Send Email Statec
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedInvoiceForEmail, setSelectedInvoiceForEmail] =
    useState<any>(null);
  const [targetEmail, setTargetEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [isFetchingClients, setIsFetchingClients] = useState(false);

  // Scheduling State (used in email modal only)
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");

  const { subscription } = useSubscription();
  const isPaid =
    subscription?.plan === "monthly" || subscription?.plan === "yearly";

  useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  // Fetch clients for the email modal
  useEffect(() => {
    if (isEmailModalOpen) {
      const fetchClients = async () => {
        setIsFetchingClients(true);
        try {
          // @ts-ignore
          if (window.electronAPI) {
            const userStr = localStorage.getItem("user");
            if (!userStr) return;
            const user = JSON.parse(userStr);
            const userId = user.id;
            const companyId = user.activeCompanyId || undefined;
            // @ts-ignore
            const res = await window.electronAPI.getData(
              "clients",
              userId,
              companyId,
            );
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

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();
  const { currency, clearInvoiceData } = useInvoice();
  const { addNotification } = useNotifications();
  const { t, language } = useLanguage();
  const { performAction, loading: actionLoading } = useIPCAction();

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteStructureWarning"))) return;

    const res = await performAction("invoices", "delete", id);

    if (res.success) {
      setInvoices(invoices.filter((inv) => inv.id !== id));

      addNotification({
        user: "Système",
        action: "a supprimé",
        target: `la facture ${id}`,
        type: "invoice",
      });
    }
  };

  const handleToggleScale = async (id: string, currentStatus: boolean) => {
    const res = await performAction("invoices", "update", id, {
      isScaled: !currentStatus,
    });

    if (res.success) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === id ? { ...inv, isScaled: !currentStatus } : inv,
        ),
      );

      addNotification({
        user: "Système",
        action: "a mis à jour le statut de",
        target: `la facture ${id}`,
        type: "invoice",
      });
    }
  };

  const handleSendEmail = async () => {
    if (!targetEmail || !selectedInvoiceForEmail) return;
    setIsSendingEmail(true);

    const invoiceId = selectedInvoiceForEmail.id;

    try {
      if (isScheduled && scheduledDate) {
        // If scheduling is selected, patch the invoice to set nextIssueDate and mark pending
        const res = await performAction("invoices", "patch", invoiceId, {
          nextIssueDate: new Date(scheduledDate),
          status: "pending",
        });

        if (res.success) {
          toast.success(t("scheduleSuccess") || "Envoi planifié avec succès !");
          addNotification({
            user: "Système",
            action: "a planifié",
            target: `l'envoi de la facture ${selectedInvoiceForEmail.reference}`,
            type: "invoice",
            silent: true,
          });
          // Update local state to reflect scheduling
          setInvoices(
            invoices.map((inv) =>
              inv.id === selectedInvoiceForEmail.id
                ? { ...inv, nextIssueDate: scheduledDate, status: "pending" }
                : inv,
            ),
          );
          setIsEmailModalOpen(false);
          setTargetEmail("");
        } else {
          toast.error(
            res.error ||
              (t as any)("scheduleFail") ||
              "Échec de la planification.",
          );
        }
      } else {
        // Immediate send
        const res = await performAction(
          "invoices",
          "send",
          invoiceId,
          targetEmail,
          currency,
        );

        if (res.success) {
          toast.success(t("emailSentSuccess") || "E-mail envoyé avec succès !");
          addNotification({
            user: "Système",
            action: "a envoyé",
            target: `la facture ${selectedInvoiceForEmail.reference} par e-mail`,
            type: "invoice",
            silent: true,
          });
          setIsEmailModalOpen(false);
          setTargetEmail("");

          // Update local state if needed (e.g. status)
          setInvoices(
            invoices.map((inv) =>
              inv.id === selectedInvoiceForEmail.id
                ? { ...inv, status: "pending" }
                : inv,
            ),
          );
        } else {
          toast.error(
            res.error ||
              (t as any)("emailSendFail") ||
              "Échec de l'envoi de l'e-mail.",
          );
        }
      }
    } catch (error) {
      console.error("Send email/schedule error:", error);
      toast.error(t("unexpectedError") || "Une erreur est survenue.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      (invoice.reference || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (invoice.clientName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const invoiceDate = new Date(invoice.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    const matchesStartDate = !start || invoiceDate >= start;
    const matchesEndDate = !end || invoiceDate <= end;

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  return (
    <div className="min-h-screen min-w-full bg-background text-foreground p-6 md:p-10 lg:p-12 pt-20 relative overflow-hidden font-sans pb-20">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-8xl mx-auto space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-10 bg-primary rounded-full" />
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                {t("financialArchives")}
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent font-sans">
              {t("history")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl font-sans">
              {t("historyDesc")}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={async () => {
                const userStr = localStorage.getItem("user");
                const userId = userStr ? JSON.parse(userStr).id : null;
                const activeCompanyId = userStr
                  ? JSON.parse(userStr).activeCompanyId
                  : undefined;
                const res = await window.electronAPI.getData(
                  "export",
                  userId,
                  "invoices",
                  activeCompanyId,
                  "excel",
                );
                if (res.success && res.data) {
                  const blob = new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `Export_Factures_${new Date().toISOString().split("T")[0]}.xlsx`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success(
                    (t as any)("exportSuccess") || "Export Excel réussi !",
                  );
                }
              }}
              variant="outline"
              className="px-6 py-4 text-[10px] font-black text-foreground bg-background/50 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all rounded-2xl uppercase tracking-[0.2em] h-auto flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              {t("exportExcel") || "Exporter Excel"}
            </Button>
            <Button
              onClick={() => {
                clearInvoiceData();
                router.push("/invoice");
              }}
              className="px-8 py-4 text-xs font-black text-primary-foreground bg-primary rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 uppercase tracking-[0.2em] h-auto"
            >
              {t("newInvoice")}
            </Button>
          </div>
        </div>

        <div className="bg-card p-8 rounded-lg border border-border/50 backdrop-blur-xl shadow-2xl space-y-6 md:space-y-0 md:flex md:items-center md:gap-6 animate-fade-in-up delay-75">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("searchRef")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border/50 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-background border border-border/50 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-muted-foreground font-sans cursor-pointer"
              />
            </div>
            <span className="text-muted-foreground/50 font-black text-[10px] uppercase">
              {t("of")}
            </span>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-background border border-border/50 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-muted-foreground font-sans cursor-pointer"
              />
            </div>
          </div>

          {(searchTerm || startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStartDate("");
                setEndDate("");
              }}
              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
            >
              {t("reset")}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInvoices.map((invoice) => (
            <Card
              key={invoice.id}
              onClick={() => router.push(`/invoice?id=${invoice.id}`)}
              className={cn(
                "group relative p-1 rounded-lg bg-card border border-border/50 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-card/80 shadow-2xl overflow-hidden cursor-pointer",
                invoice.isScaled && "border-primary/40 shadow-primary/5",
              )}
            >
              {invoice.isScaled && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-2xl rounded-full -mr-16 -mt-16" />
              )}

              <CardHeader className="pb-4 pt-6 px-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-2 py-0.5 bg-primary/10 rounded-full">
                        PROFORMA
                      </span>
                      {invoice.isRead && (
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] px-2 py-0.5 bg-emerald-500/10 rounded-full flex items-center gap-1">
                          <CheckCheck className="w-3 h-3" />
                          {t("read") || "Lu"}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold font-mono text-foreground tracking-tighter">
                      {invoice.invoiceNumber
                        ? `#${invoice.invoiceNumber} - `
                        : ""}
                      {invoice.reference}
                    </CardTitle>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-primary" />
                      {new Date(invoice.createdAt).toLocaleDateString(
                        language === "fr" ? "fr-FR" : "en-US",
                        {
                          dateStyle: "medium",
                        },
                      )}
                    </p>
                  </div>

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleScale(invoice.id, invoice.isScaled);
                    }}
                    className={cn(
                      "cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm border",
                      invoice.isScaled
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50",
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        invoice.isScaled
                          ? "bg-primary animate-pulse"
                          : "bg-muted-foreground/30",
                      )}
                    />
                    {invoice.isScaled ? t("scaled") : t("standard")}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 px-6 pb-6">
                <div className="space-y-4 p-4 rounded-2xl bg-background/40 border border-white/5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span className="font-medium font-sans">
                        {t("client")}
                      </span>
                    </div>
                    <span className="font-bold text-foreground font-sans line-clamp-2 break-words text-right max-w-[200px]">
                      {invoice.client
                        ? `${invoice.client.firstName ? invoice.client.firstName + " " : ""}${invoice.client.name}${invoice.client.companyName ? ` - ${invoice.client.companyName}` : ""}`
                        : invoice.clientName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span className="font-medium font-sans">
                        {t("volume")}
                      </span>
                    </div>
                    <span className="font-bold text-foreground font-mono">
                      {invoice.totalMaterial || 0} {t("mat")}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-black text-[10px] uppercase tracking-widest">
                        {t("total_stat")}
                      </span>
                    </div>
                    <span className="text-xl font-black text-primary font-mono tracking-tighter">
                    {formatPrice(invoice.totalHT, currency, "fr-FR")}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-xl bg-background/50 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all font-bold text-xs uppercase tracking-widest group/btn"
                    onClick={() => router.push(`/invoice?id=${invoice.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
                    {t("details")}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/20 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(invoice.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500/20 transition-all cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTargetEmail(invoice.client?.email || "");
                      setSelectedInvoiceForEmail(invoice);
                      // Initialize scheduling state from invoice data so the email modal shows the correct values
                      setIsScheduled(!!invoice.nextIssueDate);
                      setScheduledDate(
                        invoice.nextIssueDate
                          ? new Date(invoice.nextIssueDate)
                              .toISOString()
                              .slice(0, 16)
                          : "",
                      );
                      setIsEmailModalOpen(true);
                    }}
                    title={t("sent")}
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredInvoices.length === 0 && (
            <div className="col-span-full py-32 text-center bg-card rounded-lg border border-border/30 border-dashed backdrop-blur-xl animate-fade-in-up">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
                <Package className="w-12 h-12 text-primary opacity-50" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3 font-sans">
                {t("noRecord")}
              </h3>
              <p className="text-muted-foreground mb-10 max-w-sm mx-auto font-sans">
                {t("emptyArchiveDesc")}
              </p>
              <Button
                onClick={() => router.push("/invoice")}
                className="px-10 py-5 text-sm font-black text-primary-foreground bg-primary rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest h-auto"
              >
                {t("initializeFlux")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border/50 shadow-2xl p-6 animate-fade-in-up">
            <h3 className="text-xl font-bold mb-2">
              {(t as any)("sendInvoiceEmail") ||
                "Envoyer la facture par e-mail"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("sendInvoiceEmailDesc") || "Envoyez"}{" "}
              {selectedInvoiceForEmail?.reference}{" "}
              {t("toClientSecurely") || "à votre client via un lien sécurisé."}
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">
                  {t("clientEmailAddress") || "Adresse e-mail du client"}
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

              {/* Scheduling controls integrated into the email modal */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => {
                    setIsScheduled(e.target.checked);
                    if (!e.target.checked) setScheduledDate("");
                  }}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-sm font-bold">
                  {t("scheduleSend") || "Planifier l'envoi"}
                </span>
              </label>

              {isScheduled && (
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all text-foreground cursor-pointer"
                  />
                </div>
              )}

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
