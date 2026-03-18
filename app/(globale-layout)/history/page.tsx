import { getServerSession } from "@/lib/session";
import { getHistoryData } from "@/lib/data-fetching/history";
import HistoryClient from "./HistoryClient";
import { Suspense } from "react";
import Loading from "../loading";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const session = await getServerSession();

  if (!session?.userId) {
    redirect("/");
  }

  const items = await getHistoryData(session.userId);

  return (
    <Suspense fallback={<Loading />}>
      <HistoryClient initialInvoices={items} />
    </Suspense>
  );
}
