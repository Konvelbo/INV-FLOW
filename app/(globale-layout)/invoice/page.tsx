import { getServerSession } from "@/lib/session";
import { getInvoiceData } from "@/lib/data-fetching/invoice";
import InvoiceClient from "./InvoiceClient";
import { Suspense } from "react";
import Loading from "../loading";
import { redirect } from "next/navigation";

export default async function InvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const session = await getServerSession();

  if (!session?.userId) {
    redirect("/");
  }

  let initialData = null;
  if (id) {
    initialData = await getInvoiceData(id, session.userId);
  }

  return (
    <Suspense fallback={<Loading />}>
      <InvoiceClient initialData={initialData} invoiceId={id} />
    </Suspense>
  );
}
