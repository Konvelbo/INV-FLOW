import { getServerSession } from "@/lib/session";
import { getExpensesData } from "@/lib/data-fetching/expenses";
import ExpensesClient from "./ExpensesClient";
import { Suspense } from "react";
import Loading from "../loading";
import { redirect } from "next/navigation";

export default async function ExpensesPage() {
  const session = await getServerSession();

  if (!session?.userId) {
    redirect("/");
  }

  const { expenses, companies } = await getExpensesData(session.userId);

  return (
    <Suspense fallback={<Loading />}>
      <ExpensesClient
        initialExpenses={expenses}
        initialCompanies={companies}
      />
    </Suspense>
  );
}
