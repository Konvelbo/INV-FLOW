import { getServerSession } from "@/lib/session";
import { getDashboardData } from "@/lib/data-fetching/dashboard";
import DashboardClient from "./DashboardClient";
import { Suspense } from "react";
import Loading from "../loading";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.userId) {
    redirect("/");
  }

  const stats = await getDashboardData(session.userId);

  return (
    <Suspense fallback={<Loading />}>
      <DashboardClient
        initialStats={stats}
        initialTodos={stats.todos}
        userName={session.name || ""}
      />
    </Suspense>
  );
}
