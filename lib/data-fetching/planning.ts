import { prisma } from "@/lib/prisma";

export async function getPlanningData(userId: string) {
  const rawTodos = await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const todos = rawTodos.map(t => ({
    ...t,
    startTime: t.startTime ? t.startTime.toISOString() : null,
    endTime: t.endTime ? t.endTime.toISOString() : null,
    reminderAt: t.reminderAt ? t.reminderAt.toISOString() : null,
    createdAt: t.createdAt ? t.createdAt.toISOString() : null,
    updatedAt: t.updatedAt ? t.updatedAt.toISOString() : null,
  }));

  return { todos };
}
