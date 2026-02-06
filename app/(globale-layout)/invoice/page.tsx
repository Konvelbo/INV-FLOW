"use client";

import { useRef } from "react";
import InvoiceCanvas from "@/src/components/InvoiceCanvas";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Button } from "@/src/components/ui/button";
import { Suspense, useEffect, useState } from "react";
import { useInvoice } from "@/src/context/InvoiceContext";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Download } from "lucide-react";

function Invoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const divRef = useRef(null);
  // const divContent = divRef.current;
  // document access moved to handlePreviewPDF

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

      // Log data for debugging
      console.log("Data being sent to API:", data);

      // Validate required fields
      if (!data.reference || !data.clientName || data.items.length === 0) {
        throw new Error(
          "Missing required fields: reference, clientName, or items.",
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

      toast.success("Your file is downloaded successfully");

      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Server error occurred."
        : "An unknown error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error during PDF generation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewPDF = async () => {
    setLoading(true);
    try {
      const getDiv = document.getElementById("PDFCanvas");
      const divContent = getDiv?.outerHTML;

      const invoiceData = {
        reference: "REF2025/000215",
        type: "PROFORMA",
        city: city,
        invoiceDate: new Date().toISOString(),
        clientName: clientName,
        object: object,
        managerName: managerName,
        totalHT: totalHT,
        totalMaterial: totalMaterial,
        amountWords: amountWords,
        items: itemsArr,
      };

      const response = await fetch("/api/download-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ divContent }),
      });

      if (!response.ok) {
        toast.error("Erreur lors de la génération du PDF");
      } else {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      }
    } catch (err: any) {
      setError(err?.message || "Erreur inconnue");
      console.error("Erreur fetch:", err);
    } finally {
      setLoading(false);
    }
    return;
  };

  return (
    <div className="flex justify-center relative p-50">
      <InvoiceCanvas divRef={divRef} />
      <div className="absolute bottom-70 right-5 flex gap-2">
        <Button
          onClick={handleGeneratePDF}
          disabled={loading}
          className="w-15 h-15 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 fixed bottom-10 right-10 flex justify-center items-center"
        >
          {loading ? (
            <span className="loading loading-spinner text-neutral"></span>
          ) : (
            <Download className="size-7" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default Invoice;
