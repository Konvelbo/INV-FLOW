"use strict";
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
// import { format } from "date-fns";
import {
  Trash2,
  Eye,
  Search,
  X,
  Calendar,
  DollarSign,
  Package,
  User,
} from "lucide-react";
import { useInvoice } from "@/src/context/InvoiceContext";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/src/context/NotificationContext";

export default function HistoryPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();
  const { currency, clearInvoiceData } = useInvoice();
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const token = userStr ? JSON.parse(userStr).token : null;

      if (!token) {
        router.push("/");
        return;
      }

      const res = await axios.get("/api/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data);
    } catch (err) {
      setError("Failed to load invoices");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      const userStr = localStorage.getItem("user");
      const token = userStr ? JSON.parse(userStr).token : null;

      await axios.delete(`/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInvoices(invoices.filter((inv) => inv.id !== id));

      addNotification({
        user: "Système",
        action: "a supprimé",
        target: `la facture ${id}`,
        type: "invoice",
      });
    } catch {
      alert("Failed to delete invoice");
    }
  };

  const handleToggleScale = async (id: string, currentStatus: boolean) => {
    try {
      const userStr = localStorage.getItem("user");
      const token = userStr ? JSON.parse(userStr).token : null;

      await axios.patch(
        `/api/invoices/${id}`,
        { isScaled: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

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
    } catch {
      alert("Failed to update status");
    }
  };

  if (loading && invoices.length === 0) {
    return null; // Let loading.tsx handle the skeleton
  }

  return (
    <div className="min-h-screen min-w-full bg-background text-foreground p-6 md:p-10 lg:p-16 relative overflow-hidden font-sans pb-20">
      {/* Background Decorative Elements */}
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
                Archives Financières
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent font-sans">
              Historique
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl font-sans">
              Gérez et visualisez l&apos;intégralité de vos flux de facturation
              archivés.
            </p>
          </div>
          <Button
            onClick={() => {
              clearInvoiceData();
              router.push("/invoice");
            }}
            className="px-8 py-4 text-xs font-black text-primary-foreground bg-primary rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 uppercase tracking-[0.2em] h-auto"
          >
            Nouvelle Facture
          </Button>
        </div>

        {error && (
          <div className="text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-card p-8 rounded-[2rem] border border-border/50 backdrop-blur-xl shadow-2xl space-y-6 md:space-y-0 md:flex md:items-center md:gap-6 animate-fade-in-up delay-75">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par référence..."
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
              to
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
              Réinitialiser
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {invoices
            .filter((invoice) => {
              const matchesSearch = (invoice.reference || "")
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
            })
            .map((invoice) => (
              <Card
                key={invoice.id}
                onClick={() => router.push(`/invoice?id=${invoice.id}`)}
                className={cn(
                  "group relative p-1 rounded-[2rem] bg-card border border-border/50 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-card/80 shadow-2xl overflow-hidden cursor-pointer",
                  invoice.isScaled && "border-primary/40 shadow-primary/5",
                )}
              >
                {/* Decorative glow for scaled items */}
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
                      </div>
                      <CardTitle className="text-xl font-bold font-mono text-foreground tracking-tighter">
                        {invoice.reference}
                      </CardTitle>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-primary" />
                        {new Date(invoice.createdAt).toLocaleDateString(
                          "fr-FR",
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
                      {invoice.isScaled ? "Scalé" : "Standard"}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 px-6 pb-6">
                  <div className="space-y-4 p-4 rounded-2xl bg-background/40 border border-white/5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span className="font-medium font-sans">Client</span>
                      </div>
                      <span className="font-bold text-foreground font-sans truncate max-w-[150px]">
                        {invoice.clientName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Package className="w-4 h-4" />
                        <span className="font-medium font-sans">Volume</span>
                      </div>
                      <span className="font-bold text-foreground font-mono">
                        {invoice.totalMaterial || 0} mat.
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="font-black text-[10px] uppercase tracking-widest">
                          Total
                        </span>
                      </div>
                      <span className="text-xl font-black text-primary font-mono tracking-tighter">
                        {invoice.totalHT.toLocaleString()}{" "}
                        <span className="text-[10px] ml-0.5">{currency}</span>
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
                      Détails
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
                  </div>
                </CardContent>
              </Card>
            ))}

          {invoices.length === 0 && !loading && (
            <div className="col-span-full py-32 text-center bg-card rounded-[2.5rem] border border-border/30 border-dashed backdrop-blur-xl animate-fade-in-up">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
                <Package className="w-12 h-12 text-primary opacity-50" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3 font-sans">
                Aucun enregistrement
              </h3>
              <p className="text-muted-foreground mb-10 max-w-sm mx-auto font-sans">
                Votre archive est vide. Commencez par générer votre première
                architecture de facturation.
              </p>
              <Button
                onClick={() => router.push("/invoice")}
                className="px-10 py-5 text-sm font-black text-primary-foreground bg-primary rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest h-auto"
              >
                Initialiser un Flux
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
