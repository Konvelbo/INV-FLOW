import { getServerSession } from "@/lib/session";
import { getCompaniesData } from "@/lib/data-fetching/companies";
import CompaniesClient from "./CompaniesClient";
import { Suspense } from "react";
import Loading from "../loading";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession();

  if (!session?.userId) {
    redirect("/");
  }

  const companies = await getCompaniesData(session.userId);

  return (
    <Suspense fallback={<Loading />}>
      <CompaniesClient initialCompanies={companies} />
    </Suspense>
  );
}
