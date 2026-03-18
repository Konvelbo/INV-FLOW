import { getServerSession } from "@/lib/session";
import { getClientsData } from "@/lib/data-fetching/clients";
import ClientsClient from "./ClientsClient";
import { Suspense } from "react";
import Loading from "../loading";
import { redirect } from "next/navigation";

export default async function ClientsPage({
  searchParams,
  isComponent = false,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  isComponent?: boolean;
}) {
  const session = await getServerSession();

  if (!session?.userId) {
    redirect("/");
  }

  const { companyId } = (await searchParams) as { companyId?: string };

  const clients = await getClientsData(session.userId, companyId);

  return (
    <Suspense fallback={<Loading />}>
      <ClientsClient initialClients={clients} isComponent={isComponent} />
    </Suspense>
  );
}
