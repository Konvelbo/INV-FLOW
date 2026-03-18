import { getServerSession } from "@/lib/session";
import { getClientsData } from "@/lib/data-fetching/clients";
import { getProductsData } from "@/lib/data-fetching/products";
import { getExpensesData } from "@/lib/data-fetching/expenses";
import ManagementClient from "./ManagementClient";
import { Suspense } from "react";
import Loading from "../loading";
import { redirect } from "next/navigation";

export default async function ManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession();

  if (!session?.userId) {
    redirect("/");
  }

  const { companyId } = (await searchParams) as { companyId?: string };

  // Pre-fetch all data to make tab switching instant
  const [clients, products, expensesData] = await Promise.all([
    getClientsData(session.userId, companyId),
    getProductsData(session.userId),
    getExpensesData(session.userId),
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <ManagementClient
        initialClients={clients}
        initialProducts={products}
        initialExpenses={expensesData.expenses}
        initialCompanies={expensesData.companies}
      />
    </Suspense>
  );
}
