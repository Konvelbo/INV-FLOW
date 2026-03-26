"use client";

import { useIPCData } from "@/hooks/useIPCData";
import CompaniesClient from "./CompaniesClient";
import Loading from "./loading";

export default function SettingsPage() {
  const { session, data: companies, loading } = useIPCData<any[]>("companies");

  if (loading || !session) {
    return <Loading />;
  }

  return (
    <CompaniesClient initialCompanies={companies || []} />
  );
}
