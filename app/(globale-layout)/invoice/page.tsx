"use client";

import { useSearchParams } from "next/navigation";
import { useIPCData } from "@/hooks/useIPCData";
import InvoiceClient from "./InvoiceClient";
import Loading from "./loading";
import { Suspense } from "react";

function InvoiceContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || undefined;
  
  const { session, data: initialData, loading } = useIPCData<any>("invoices", id);

  if (loading || !session) {
    return <Loading />;
  }

  return (
    <InvoiceClient initialData={initialData} invoiceId={id} />
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<Loading />}>
      <InvoiceContent />
    </Suspense>
  );
}
