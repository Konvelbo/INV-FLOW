"use client";

import { useIPCData } from "@/hooks/useIPCData";
import DashboardClient from "./DashboardClient";
import Loading from "./loading";

export default function DashboardPage() {
  const { session, data: stats, loading } = useIPCData<any>("dashboard");

  if (loading || !session) {
    return <Loading />;
  }

  return (
    <DashboardClient
      initialStats={stats || {}}
      initialTodos={stats?.todos || []}
      userName={session.name || ""}
    />
  );
}
