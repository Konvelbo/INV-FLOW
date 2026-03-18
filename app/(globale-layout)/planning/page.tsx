import { getServerSession } from "@/lib/session";
import { getPlanningData } from "@/lib/data-fetching/planning";
import PlanningClient from "./PlanningClient";
import { Suspense } from "react";
import Loading from "../loading";
import { redirect } from "next/navigation";

export default async function PlanningPage() {
  const session = await getServerSession();

  if (!session?.userId) {
    redirect("/");
  }

  const { todos } = await getPlanningData(session.userId);

  return (
    <Suspense fallback={<Loading />}>
      <PlanningClient initialTodos={todos} />
    </Suspense>
  );
}
