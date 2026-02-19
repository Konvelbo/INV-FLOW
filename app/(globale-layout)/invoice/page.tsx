"use client";

import { useEffect, useRef, useState } from "react";
import InvoiceCanvas from "@/src/components/InvoiceCanvas";
import { Button } from "@/src/components/ui/button";
import { useInvoice } from "@/src/context/InvoiceContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Download, Loader2, FileText, Save } from "lucide-react";
import { cn } from "@/lib/utils";

function Invoice() {
  const [loading, setLoading] = useState(false);
  const divRef = useRef(null);

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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground relative overflow-hidden flex flex-col items-center py-10 pb-32">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[150px]" />
      </div>

      {/* Header / Title */}
      <div className="relative z-10 w-full max-w-7xl px-6 mb-12 flex justify-between items-center animate-fade-in-up">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-card backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-primary rounded-full" />
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                Éditeur de Flux
              </span>
            </div>
            <h1 className="text-4xl font-bold text-foreground tracking-tighter font-sans">
              Invoice Editor
            </h1>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="px-5 py-2.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-lg shadow-primary/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Architecture Active
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 w-full max-w-[1024px] flex justify-center animate-fade-in-up delay-100 px-6">
        <div className="relative w-full group">
          {/* Advanced Glow effect behind canvas */}
          <div className="absolute -inset-4 bg-linear-to-r from-primary/20 via-emerald-500/10 to-secondary/20 rounded-[2.5rem] blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

          <div className="relative bg-card border border-border/50 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden backdrop-blur-xl">
            <InvoiceCanvas divRef={divRef} />
          </div>
        </div>
      </div>

      {/* Floating Action Bar - Refined */}
      <div className="fixed bottom-10 right-10 z-50 flex flex-col gap-5 animate-slide-in-right">
        <div className="group relative">
          <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <Button
            onClick={handleSave}
            disabled={loading}
            className={cn(
              "h-20 w-20 rounded-2xl shadow-3xl border border-white/10 flex items-center justify-center transition-all duration-500 relative z-10",
              loading
                ? "bg-muted/30 cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-2 hover:shadow-primary/40",
            )}
            title="Enregistrer la Facture"
          >
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <Save className="h-8 w-8" />
            )}
          </Button>
        </div>

        <div className="group relative">
          <div className="absolute -inset-2 bg-secondary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <Button
            onClick={handleGeneratePDF}
            disabled={loading}
            className={cn(
              "h-20 w-20 rounded-2xl shadow-3xl border border-white/10 flex items-center justify-center transition-all duration-500 relative z-10",
              loading
                ? "bg-muted/30 cursor-not-allowed"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:-translate-y-2 hover:rotate-6 hover:shadow-secondary/40",
            )}
            title="Télécharger le PDF"
          >
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <Download className="h-8 w-8" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
