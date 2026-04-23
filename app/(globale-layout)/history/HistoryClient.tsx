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
  CheckCheck,
  MoreHorizontal,
  FileText,
} from "lucide-react";
import { useInvoice } from "@/src/context/InvoiceContext";
import { formatPrice } from "@/lib/currency";
import { useLanguage } from "@/src/context/LanguageContext";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/src/context/NotificationContext";
import { useIPCAction } from "@/hooks/useIPCAction";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { invoiceTemplate } from "@/lib/invoice-pdf";
import { DataTable, DataTableColumn } from "@/src/components/ui/data-table";

interface HistoryClientProps {
  initialInvoices: any[];
}

export default function HistoryClient({ initialInvoices }: HistoryClientProps) {
  const [invoices, setInvoices] = useState<any[]>(initialInvoices);

  // Send Email State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedInvoiceForEmail, setSelectedInvoiceForEmail] = useState<any>(null);
  const [targetEmail, setTargetEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [isFetchingClients, setIsFetchingClients] = useState(false);

  // Scheduling State
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");

  const { subscription } = useSubscription();
  const isPaid = subscription?.plan === "monthly" || subscription?.plan === "yearly";

  useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  useEffect(() => {
    if (isEmailModalOpen) {
      const fetchClients = async () => {
        setIsFetchingClients(true);
        try {
          if ((window as any).electronAPI) {
            const userStr = localStorage.getItem("user");
            if (!userStr) return;
            const user = JSON.parse(userStr);
            const userId = user.id;
            const companyId = user.activeCompanyId || undefined;
            const res = await (window as any).electronAPI.getData("clients", userId, companyId);
            if (res.success) setClients(res.data);
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
  const { performAction } = useIPCAction();

  const handleDelete = async (id: string, ref: string) => {
    if (!confirm(t("deleteStructureWarning"))) return;
    const res = await performAction("invoices", "delete", id);
    if (res.success) {
      setInvoices(invoices.filter((inv) => inv.id !== id));
      addNotification({
        user: "Système",
        action: "a supprimé",
        target: `la facture ${ref}`,
        type: "invoice",
      });
    }
  };

  const handleToggleScale = async (id: string, currentStatus: boolean, ref: string) => {
    const res = await performAction("invoices", "update", id, { isScaled: !currentStatus });
    if (res.success) {
      setInvoices(invoices.map((inv) => inv.id === id ? { ...inv, isScaled: !currentStatus } : inv));
      addNotification({
        user: "Système",
        action: "a mis à jour le statut de",
        target: `la facture ${ref}`,
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
          setInvoices(invoices.map((inv) => inv.id === selectedInvoiceForEmail.id ? { ...inv, nextIssueDate: scheduledDate, status: "pending" } : inv));
          setIsEmailModalOpen(false);
          setTargetEmail("");
        }
      } else {
        const fullInvRes = await performAction("invoices", "get", invoiceId);
        if (!fullInvRes.success || !fullInvRes.data) return;
        const fullInvoice = fullInvRes.data;
        const templateData = { ...fullInvoice, items: fullInvoice.items || [], currencyCode: currency, language };
        const html = invoiceTemplate(templateData);
        // @ts-ignore
        const pdfBuffer = await window.electronAPI.generatePDF(html);
        const res = await performAction("invoices", "send", invoiceId, targetEmail, currency, pdfBuffer);
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
          setInvoices(invoices.map((inv) => inv.id === selectedInvoiceForEmail.id ? { ...inv, status: "pending" } : inv));
        }
      }
    } catch (error) {
      toast.error(t("unexpectedError") || "Une erreur est survenue.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (!confirm(t("deleteStructureWarning"))) return;
    const res = await performAction("invoices", "bulkDelete", ids);
    if (res.success) {
      setInvoices(invoices.filter((inv) => !ids.includes(inv.id)));
      addNotification({
        user: "Système",
        action: "a supprimé",
        target: `${ids.length} factures`,
        type: "invoice",
      });
      toast.success(t("itemDeleted") || "Éléments supprimés avec succès");
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const marches = (invoice.reference || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                   (invoice.clientName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const invoiceDate = new Date(invoice.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);
    return marches && (!start || invoiceDate >= start) && (!end || invoiceDate <= end);
  });

  const columns: DataTableColumn<any>[] = [
    {
      key: "reference",
      header: t("reference") || "Référence",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-foreground">
            {row.invoiceNumber ? `#${row.invoiceNumber} - ` : ""}{row.reference}
          </span>
          <div className="flex gap-1.5 mt-1">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest px-1.5 py-0.5 bg-primary/10 rounded">
              PROFORMA
            </span>
            {row.isRead && (
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest px-1.5 py-0.5 bg-emerald-500/10 rounded flex items-center gap-1">
                <CheckCheck className="w-2 h-2" /> {t("read") || "Lu"}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "client",
      header: t("client"),
      render: (row) => {
        const clientText = row.client
          ? `${row.client.firstName ? row.client.firstName + " " : ""}${row.client.name}${row.client.companyName ? ` (${row.client.companyName})` : ""}`
          : row.clientName;
        return <span className="text-sm font-medium text-foreground line-clamp-1 max-w-[180px]">{clientText}</span>;
      },
    },
    {
      key: "createdAt",
      header: t("dateLabel"),
      render: (row) => (
        <span className="text-muted-foreground whitespace-nowrap">
          {new Date(row.createdAt).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", { dateStyle: "medium" })}
        </span>
      ),
    },
    {
      key: "totalHT",
      header: t("total_stat"),
      render: (row) => (
        <span className="font-black font-mono text-primary">
          {formatPrice(row.totalHT, currency, "fr-FR")}
        </span>
      ),
    },
    {
      key: "status",
      header: t("status") || "Statut",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleScale(row.id, row.isScaled, row.reference);
          }}
          className={cn(
            "h-7 px-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all",
            row.isScaled 
              ? "bg-primary/20 text-primary border-primary/30" 
              : "bg-muted/30 text-muted-foreground border-border/50"
          )}
        >
          <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", row.isScaled ? "bg-primary" : "bg-muted-foreground/30")} />
          {row.isScaled ? t("scaled") : t("standard")}
        </Button>
      ),
    },
  ];

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
            <h1 className="text-5xl font-bold tracking-tight bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent font-sans">
              {t("history")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl font-sans">{t("historyDesc")}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={async () => {
                const userStr = localStorage.getItem("user");
                const userId = userStr ? JSON.parse(userStr).id : null;
                const activeCompanyId = userStr ? JSON.parse(userStr).activeCompanyId : undefined;
                const res = await (window as any).electronAPI.getData("export", userId, "invoices", activeCompanyId, "excel");
                if (res.success && res.data) {
                  const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `Export_Factures_${new Date().toISOString().split("T")[0]}.xlsx`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success(t("exportSuccess") || "Export Excel réussi !");
                }
              }}
              variant="outline"
              className="px-6 py-4 text-[10px] font-black text-foreground bg-background/50 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all rounded-2xl uppercase tracking-[0.2em] h-auto flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" /> {t("exportExcel") || "Exporter Excel"}
            </Button>
            <Button
              onClick={() => { clearInvoiceData(); router.push("/invoice"); }}
              className="px-8 py-4 text-xs font-black text-primary-foreground bg-primary rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 uppercase tracking-[0.2em] h-auto"
            >
              {t("newInvoice")}
            </Button>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-2xl space-y-6 md:space-y-0 md:flex md:items-center md:gap-6 animate-fade-in-up delay-75">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("searchRef")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border/50 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 font-sans"
            />
          </div>
          <div className="flex items-center gap-4">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-background border border-border/50 rounded-xl py-3 pl-4 pr-4 text-sm font-sans" />
            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{t("of")}</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-background border border-border/50 rounded-xl py-3 pl-4 pr-4 text-sm font-sans" />
          </div>
          {(searchTerm || startDate || endDate) && (
            <Button variant="ghost" onClick={() => { setSearchTerm(""); setStartDate(""); setEndDate(""); }} className="text-xs font-bold uppercase tracking-widest">
              {t("reset")}
            </Button>
          )}
        </div>

        <div className="animate-fade-in-up delay-150">
          <DataTable
            data={filteredInvoices}
            columns={columns}
            rowKey={(row) => row.id}
            emptyMessage={t("noRecord")}
            emptyIcon={<FileText className="w-12 h-12 opacity-20" />}
            onDeleteSelected={handleBulkDelete}
            renderActions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-border/50">
                  <DropdownMenuItem onClick={() => router.push(`/invoice?id=${row.id}`)} className="gap-2 cursor-pointer font-medium">
                    <Eye className="w-3.5 h-3.5" /> {t("details")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setTargetEmail(row.client?.email || "");
                      setSelectedInvoiceForEmail(row);
                      setIsScheduled(!!row.nextIssueDate);
                      setScheduledDate(row.nextIssueDate ? new Date(row.nextIssueDate).toISOString().slice(0, 16) : "");
                      setIsEmailModalOpen(true);
                    }}
                    className="gap-2 cursor-pointer font-medium"
                  >
                    <Mail className="w-3.5 h-3.5" /> {t("sent") || "Envoyer"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(row.id, row.reference)} className="gap-2 cursor-pointer font-medium text-destructive focus:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" /> {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            selectedLabel={t("linesSelected") || "ligne(s) sélectionnée(s)"}
            rowsPerPageLabel={t("rowsPerPage") || "Lignes par page"}
            pageLabel={t("page") || "Page"}
            ofLabel={t("of") || "sur"}
          />
        </div>
      </div>

      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border/50 shadow-2xl p-6 animate-fade-in-up">
            <h3 className="text-xl font-bold mb-2">{(t as any)("sendInvoiceEmail") || "Envoyer la facture"}</h3>
            <div className="space-y-4">
              <select
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm"
                onChange={(e) => setTargetEmail(e.target.value)}
                value={targetEmail}
              >
                <option value="" disabled>{isFetchingClients ? "Chargement..." : "Choisir un client..."}</option>
                {clients.map((c) => c.email && <option key={c.id} value={c.email}>{c.name} - {c.email}</option>)}
              </select>
              <input
                type="email"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm"
                placeholder="Ou saisir manuellement..."
              />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={isScheduled} onChange={(e) => setIsScheduled(e.target.checked)} className="rounded text-primary focus:ring-primary w-4 h-4" />
                <span className="text-sm font-bold">{t("scheduleSend") || "Planifier"}</span>
              </label>
              {isScheduled && <input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="w-full bg-background border border-border/50 rounded-xl py-3 pl-4 pr-4 text-sm" />}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsEmailModalOpen(false)}>Annuler</Button>
                <Button className="flex-1 gap-2" onClick={handleSendEmail} disabled={isSendingEmail || !targetEmail}>
                  {isSendingEmail ? <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> : <Send className="w-4 h-4" />} Envoyer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
