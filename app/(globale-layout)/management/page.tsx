"use client";

import { useSearchParams } from "next/navigation";
import { useIPCData } from "@/hooks/useIPCData";
import ManagementClient from "./ManagementClient";
import Loading from "./loading";
import { Suspense } from "react";

function ManagementContent() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId") || undefined;

  const { session, data, loading } = useIPCData<any>("management", companyId);

  if (loading || !session) {
    return <Loading />;
  }

  return (
    <ManagementClient
      initialClients={data?.clients || []}
      initialProducts={data?.products || []}
      initialExpenses={data?.expenses || []}
      initialCompanies={data?.companies || []}
      userId={session.userId}
    />
  );
}

export default function ManagementPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ManagementContent />
    </Suspense>
  );
}
