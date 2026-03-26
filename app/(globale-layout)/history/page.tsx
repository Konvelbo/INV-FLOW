"use client";

import { useIPCData } from "@/hooks/useIPCData";
import HistoryClient from "./HistoryClient";
import Loading from "./loading";

export default function HistoryPage() {
  const { session, data: items, loading } = useIPCData<any[]>("history");

  if (loading || !session) {
    return <Loading />;
  }

  return (
    <HistoryClient initialInvoices={items || []} />
  );
}
