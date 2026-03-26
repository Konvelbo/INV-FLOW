"use client";

import { useSearchParams } from "next/navigation";
import { useIPCData } from "@/hooks/useIPCData";
import ClientsClient from "./ClientsClient";
import Loading from "./loading";
import { Suspense } from "react";

function ClientsContent({ isComponent }: { isComponent: boolean }) {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId") || undefined;

  const { session, data: clients, loading } = useIPCData<any[]>("clients", companyId);

  if (loading || !session) {
    return <Loading />;
  }

  return (
    <ClientsClient
      initialClients={clients || []}
      userId={session.userId}
      isComponent={isComponent}
    />
  );
}

export default function ClientsPage({
  isComponent = false,
}: {
  isComponent?: boolean;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <ClientsContent isComponent={isComponent} />
    </Suspense>
  );
}
