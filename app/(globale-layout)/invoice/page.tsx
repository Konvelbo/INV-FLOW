"use client";

import { useRef, useState } from "react";
import InvoiceCanvas from "@/src/components/InvoiceCanvas";
import { Button } from "@/src/components/ui/button";
import { useInvoice } from "@/src/context/InvoiceContext";
import toast from "react-hot-toast";
import axios from "axios";
import { Download, Loader2, FileText, CheckCircle } from "lucide-react";

function Invoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const divRef = useRef(null);

  const {
    reference,
    city,
    clientName,
    object,
    totalMaterial,
    totalHT,
    amountWords,
    managerName,
    itemsArr,
  } = useInvoice();

  const handleGeneratePDF = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = {
        reference: reference || "",
        type: "PROFORMA",
        city: city || "",
        invoiceDate: new Date().toISOString(),
        clientName: clientName || "",
        object: object || "",
        managerName: managerName || "",
        totalHT: totalHT || 0,
        totalMaterial: totalMaterial || 0,
        amountWords: amountWords || "",
        items: itemsArr || [],
      };

      // Validate required fields
      if (!data.reference || !data.clientName || data.items.length === 0) {
        throw new Error(
          "Please fill in the Reference, Client Name, and add at least one item.",
        );
      }

      const res = await axios.post("/api/download-pdf", data, {
        responseType: "blob",
      });

      if (res.status !== 200) {
        throw new Error(
          "Failed to generate PDF. Server responded with status: " + res.status,
        );
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
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Server error occurred."
        : (err as Error).message || "An unknown error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error during PDF generation:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 selection:text-blue-200 relative overflow-hidden flex flex-col items-center py-10">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px]" />
      </div>

      {/* Header / Title */}
      <div className="relative z-10 w-full max-w-7xl px-6 mb-8 flex justify-between items-center animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-lg">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Invoice Editor
            </h1>
            <p className="text-slate-500 text-sm">
              Create and customize your proforma invoice
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Auto-saving
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 w-full max-w-[1000px] flex justify-center animate-fade-in-up delay-100">
        <div className="relative group">
          {/* Glow effect behind canvas */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-500"></div>

          <div className="relative shadow-2xl shadow-black/50 rounded-lg overflow-hidden">
            <InvoiceCanvas divRef={divRef} />
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 animate-slide-in-right">
        <Button
          onClick={handleGeneratePDF}
          disabled={loading}
          className={`
            h-16 w-16 rounded-full shadow-2xl border border-white/10 flex items-center justify-center transition-all duration-300
            ${
              loading
                ? "bg-slate-800 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 hover:scale-110 hover:rotate-3 shadow-blue-600/30"
            }
          `}
          title="Download PDF"
        >
          {loading ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : (
            <Download className="h-7 w-7 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default Invoice;
