"use client";

import { useEffect, useRef, useState } from "react";
import InvoiceCanvas from "@/src/components/InvoiceCanvas";
import { Button } from "@/src/components/ui/button";
import { useInvoice } from "@/src/context/InvoiceContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Download, Loader2, FileText, CheckCircle, Save } from "lucide-react";

function Invoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  }, [invoiceId]);

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
        clientAddress: clientAddress || "",
        clientContact: clientContact || "",
        clientPOBox: clientPOBox || "",
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
          } catch (e) {
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

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

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
      setError(errorMessage);
      toast.error(errorMessage);
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
          onClick={handleSave}
          disabled={loading}
          className={`
            h-16 w-16 rounded-full shadow-2xl border border-white/10 flex items-center justify-center transition-all duration-300
            ${
              loading
                ? "bg-slate-800 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500 hover:scale-110 shadow-emerald-600/30"
            }
          `}
          title="Save Invoice"
        >
          {loading ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : (
            <Save className="h-7 w-7 text-white" />
          )}
        </Button>

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
