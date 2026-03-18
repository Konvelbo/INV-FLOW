import { prisma } from "@/lib/prisma";

export async function getPlanningData(userId: string) {
  const todos = await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return todos;
}
