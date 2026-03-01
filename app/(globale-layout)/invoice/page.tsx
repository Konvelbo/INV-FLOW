"use client";

import { useLanguage } from "@/src/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import InvoiceCanvas from "@/src/components/InvoiceCanvas";
import { Button } from "@/src/components/ui/button";
import { useInvoice } from "@/src/context/InvoiceContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Download, Loader2, FileText, Save, Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/src/context/NotificationContext";

function Invoice() {
  const [loading, setLoading] = useState(false);
  const divRef = useRef(null);

  const { language } = useLanguage();
  const {
    reference,
    city,
    clientName,
    clientAddress,
    clientContact,
    clientPOBox,
    object,
    totalMaterial,
    totalHT,
    amountWords,
    managerName,
    itemsArr,
    setInvoiceData,
    currency,
    style,
  } = useInvoice();

  const { addNotification } = useNotifications();

  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("id");

  useEffect(() => {
    const fetchInvoiceData = async (id: string) => {
      try {
        setLoading(true);
        const userStr = localStorage.getItem("user");
        const token = userStr ? JSON.parse(userStr).token : null;

        if (!token) return;

        const res = await axios.get(`/api/invoices/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setInvoiceData(res.data);
          toast.success("Invoice loaded successfully");
        }
      } catch (err) {
        console.error("Failed to load invoice", err);
        toast.error("Failed to load invoice data");
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoiceData(invoiceId);
    }
  }, [invoiceId, setInvoiceData]);

  const handleGeneratePDF = async () => {
    setLoading(true);

    try {
      const data = {
        reference: reference || "",
        type: "PROFORMA",
        city: city || "",
        invoiceDate: new Date().toISOString(),
        clientName: clientName || "",
        clientAddress: clientAddress || "",
        clientContact: clientContact || "",
        clientPOBox: clientPOBox || "",
        object: object || "",
        managerName: managerName || "",
        totalHT: totalHT || 0,
        totalMaterial: totalMaterial || 0,
        amountWords: amountWords || "",
        items: itemsArr || [],
        currencyCode: currency,
        style: style || "default",
      };

      // Validate required fields
      if (!data.reference || !data.clientName || data.items.length === 0) {
        throw new Error(
          "Please fill in the Reference, Client Name, and add at least one item.",
        );
      }

      const userStr = localStorage.getItem("user");
      const token = userStr ? JSON.parse(userStr).token : null;

      if (!token) {
        throw new Error("User not authenticated. Please log in.");
      }

      const res = await axios.post("/api/download-pdf", data, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        throw new Error(
          "Failed to generate PDF. Server responded with status: " + res.status,
        );
      }

      // Check if the response is actually JSON (error) despite blob type
      if (res.data.type === "application/json") {
        const text = await res.data.text();
        const json = JSON.parse(text);
        throw new Error(json.message || "Server Error (JSON)");
      }

      toast.success("PDF Downloaded Successfully!");

      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${data.reference.replace(/\//g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error during PDF generation:", err);
      let errorMessage = "An unknown error occurred.";

      if (axios.isAxiosError(err)) {
        if (
          err.response?.data instanceof Blob &&
          err.response.data.type === "application/json"
        ) {
          // Try to parse the blob error
          try {
            const text = await err.response.data.text();
            const json = JSON.parse(text);
            errorMessage = json.message || "Server error occurred.";
          } catch {
            errorMessage = "Server error occurred (Blob).";
          }
        } else {
          errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Server error occurred.";
        }
      } else {
        errorMessage = (err as Error).message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const data = {
        reference: reference || "",
        city: city || "",
        clientName: clientName || "",
        clientAddress: clientAddress || "",
        clientContact: clientContact || "",
        clientPOBox: clientPOBox || "",
        object: object || "",
        managerName: managerName || "",
        totalHT: totalHT || 0,
        totalMaterial: totalMaterial || 0,
        amountWords: amountWords || "",
        items: itemsArr || [],
        currencyCode: currency,
        style: style || "default",
      };

      // Validate required fields
      if (!data.reference || !data.clientName || data.items.length === 0) {
        throw new Error(
          "Please fill in the Reference, Client Name, and add at least one item.",
        );
      }

      const userStr = localStorage.getItem("user");
      const token = userStr ? JSON.parse(userStr).token : null;

      if (!token) {
        throw new Error("User not authenticated. Please log in.");
      }

      let res;
      if (invoiceId) {
        // Update existing invoice
        res = await axios.put(`/api/invoices/${invoiceId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Create new invoice
        res = await axios.post("/api/invoices", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (res.status === 201 || res.status === 200) {
        toast.success(
          invoiceId
            ? "Invoice Updated Successfully!"
            : "Invoice Saved Successfully!",
        );

        addNotification({
          user: "Système",
          action: invoiceId ? "a modifié" : "a créé",
          target: `la facture ${data.reference}`,
          type: "invoice",
        });
      }
    } catch (err) {
      console.error("Error saving invoice:", err);
      let errorMessage = "An unknown error occurred.";
      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Server error occurred.";
      } else {
        errorMessage = (err as Error).message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground relative overflow-hidden flex flex-col items-center py-12 pb-32">
      {/* Premium Background Aesthetics - Animated Mesh Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] animate-bounce-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Professional Header Section */}
      <div className="relative z-10 w-full max-w-7xl px-8 mb-16 flex justify-between items-center animate-fade-in-up">
        <div className="flex items-center gap-8">
          <div className="p-5 bg-card/40 backdrop-blur-2xl rounded-[2rem] border border-border/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] group hover:border-primary/50 transition-all duration-500">
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
              Invoice Editor
            </h1>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-4 group hover:border-white/20 transition-all">
            <div className="size-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">
                Status
              </span>
              <span className="text-xs font-bold text-white tracking-tight">
                System Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Focused Editor Area */}
      <div className="relative z-10 flex-1 w-full max-w-[1100px] flex justify-center animate-fade-in-up delay-100 px-8">
        <div className="relative w-full group/canvas">
          {/* Dynamic Ambient Glow */}
          <div className="absolute -inset-10 bg-linear-to-tr from-primary/15 via-transparent to-secondary/15 rounded-[3rem] blur-[80px] opacity-40 group-hover/canvas:opacity-70 transition duration-1000"></div>

          <div className="relative bg-card/30 border border-border/40 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] rounded-3xl overflow-hidden backdrop-blur-3xl p-1">
            <div className="bg-background/80 rounded-[1.4rem] overflow-hidden">
              <InvoiceCanvas divRef={divRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Radial Interactive FAB System */}
      <div className="fab-container">
        <div className="relative flex items-center justify-center">
          {/* Save Button (Expansion Left) */}
          <div className="fab-item fab-item-left">
            <Button
              onClick={handleSave}
              disabled={loading}
              className={cn(
                "h-14 w-14 rounded-2xl shadow-2xl border border-white/10 bg-card/90 backdrop-blur-2xl text-foreground hover:bg-emerald-500 hover:text-white hover:-translate-y-1 transition-all duration-300 cursor-pointer",
                loading && "opacity-50",
              )}
              title="Enregistrer"
            >
              <Save className="h-7 w-7" />
            </Button>
          </div>

          {/* Download Button (Expansion Up) */}
          <div className="fab-item fab-item-up">
            <Button
              onClick={handleGeneratePDF}
              disabled={loading}
              className={cn(
                "h-14 w-14 rounded-2xl shadow-2xl border border-white/10 bg-card/90 backdrop-blur-2xl text-foreground hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all duration-300 cursor-pointer",
                loading && "opacity-50",
              )}
              title="Télécharger"
            >
              <Download className="h-7 w-7" />
            </Button>
          </div>

          {/* Main Action Hub Button */}
          <div className="relative z-10">
            <div className="fab-glow"></div>
            <Button
              disabled={loading}
              className={cn(
                "h-18 w-18 rounded-[2rem] bg-primary flex items-center justify-center fab-main-btn cursor-pointer",
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
    </div>
  );
}

export default Invoice;
