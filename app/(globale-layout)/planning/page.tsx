"use client";

import { useIPCData } from "@/hooks/useIPCData";
import PlanningClient from "./PlanningClient";
import Loading from "./loading";

export default function PlanningPage() {
  const { session, data: todos, loading } = useIPCData<any[]>("planning");

  if (loading || !session) {
    return <Loading />;
  }

  return (
    <PlanningClient initialTodos={todos || []} />
  );
}
