"use strict";
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
// import { format } from "date-fns";
import {
  Loader2,
  Trash2,
  Eye,
  Search,
  X,
  FileText,
  Calendar,
  DollarSign,
  Package,
  User,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { itemsProps } from "@/src/components/InvoiceCanvas";
import { InvoiceProps } from "@/lib/invoice-pdf";

export default function HistoryPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();

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
    } catch (err) {
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
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-500" />
              Historique des Factures
            </h1>
            <p className="text-slate-400 mt-2">
              Gérez et visualisez vos factures créées.
            </p>
          </div>
          <Button
            onClick={() => router.push("/invoice")}
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            Créer une Nouvelle Facture
          </Button>
        </div>

        {error && (
          <div className="text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-md space-y-4 md:space-y-0 md:flex md:items-center md:gap-4 animate-fade-in-up delay-75">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par référence (Proforma)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors text-slate-400"
              />
            </div>
            <span className="text-slate-600">à</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors text-slate-400"
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
              className="text-slate-500 hover:text-white"
            >
              Réinitialiser
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoices
            .filter((invoice) => {
              const matchesSearch = invoice.reference
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
                className={`bg-slate-900/50 border-slate-800 backdrop-blur-sm transition-all duration-300 group ${
                  invoice.isScaled
                    ? "border-emerald-500/30"
                    : "hover:border-blue-500/50"
                }`}
              >
                <CardHeader className="pb-3 pt-3">
                  <div className="flex justify-between items-start space-x-20">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-mono text-blue-200">
                        {invoice.reference}
                      </CardTitle>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(invoice.createdAt).toLocaleDateString(
                          "fr-FR",
                          {
                            dateStyle: "long",
                          },
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      >
                        Proforma
                      </Badge>
                      <div
                        onClick={() =>
                          handleToggleScale(invoice.id, invoice.isScaled)
                        }
                        className={`cursor-pointer flex items-center gap-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          invoice.isScaled
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : "bg-slate-800 text-slate-500 border border-slate-700 hover:bg-slate-700"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full border ${
                            invoice.isScaled
                              ? "bg-emerald-400 border-emerald-400"
                              : "border-slate-500"
                          }`}
                        />
                        {invoice.isScaled ? "Scalé" : "Non Scalé"}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="font-medium">{invoice.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Package className="w-4 h-4 text-slate-500" />
                      <span>{invoice.totalMaterial || 0} Matériel vendu</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-emerald-400 text-lg">
                        {invoice.totalHT.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-white"
                      onClick={() => router.push(`/invoice?id=${invoice.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Voir
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                      onClick={() => handleDelete(invoice.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

          {invoices.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No invoices found.</p>
              <Button
                variant="link"
                onClick={() => router.push("/invoice")}
                className="text-blue-400"
              >
                Create your first invoice
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
