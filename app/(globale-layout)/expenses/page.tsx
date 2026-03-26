"use client";

import { useIPCData } from "@/hooks/useIPCData";
import ExpensesClient from "./ExpensesClient";
import Loading from "./loading";

export default function ExpensesPage() {
  const { session, data, loading } = useIPCData<any>("expenses");

  if (loading || !session) {
    return <Loading />;
  }

  return (
    <ExpensesClient
      initialExpenses={data?.expenses || []}
      initialCompanies={data?.companies || []}
      userId={session.userId}
    />
  );
}
