"use client";

import { useMemo } from "react";
import { isWithinInterval, parseISO, isSameDay } from "date-fns";

export interface Task {
  id: string;
  title: string;
  startTime: string | null;
  endTime: string | null;
  status: string;
}

export const useProductivity = (tasks: Task[]) => {
  // Detect schedule conflicts
  const conflicts = useMemo(() => {
    const list: string[] = [];
    const sortedTasks = [...tasks]
      .filter((t) => t.startTime && t.endTime)
      .sort(
        (a, b) =>
          new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime(),
      );

    for (let i = 0; i < sortedTasks.length; i++) {
      for (let j = i + 1; j < sortedTasks.length; j++) {
        const a = sortedTasks[i];
        const b = sortedTasks[j];

        const aStart = new Date(a.startTime!).getTime();
        const aEnd = new Date(a.endTime!).getTime();
        const bStart = new Date(b.startTime!).getTime();
        const bEnd = new Date(b.endTime!).getTime();

        // Check if [aStart, aEnd] overlaps with [bStart, bEnd]
        if (aStart < bEnd && bStart < aEnd) {
          list.push(a.id);
          list.push(b.id);
        } else if (bStart >= aEnd) {
          // Since it's sorted by startTime, we can break early if next task starts after current ends
          break;
        }
      }
    }
    return new Set(list);
  }, [tasks]);

  // Calculate progress
  const stats = useMemo(() => {
    const total = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "done");
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;

    const productiveMs = completedTasks.reduce((acc, t) => {
      if (t.startTime && t.endTime) {
        return (
          acc +
          (new Date(t.endTime).getTime() - new Date(t.startTime).getTime())
        );
      }
      return acc;
    }, 0);

    const productiveHours =
      Math.round((productiveMs / (1000 * 60 * 60)) * 10) / 10;
    const percentage =
      total > 0 ? Math.round((completedTasks.length / total) * 100) : 0;

    return {
      total,
      completed: completedTasks.length,
      inProgress,
      percentage,
      productiveHours,
    };
  }, [tasks]);

  // Suggest first free 1hr slot between 9am-6pm
  const findFreeSlot = (date: Date) => {
    const dayTasks = tasks
      .filter((t) => t.startTime && isSameDay(new Date(t.startTime), date))
      .sort(
        (a, b) =>
          new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime(),
      );

    let currentStart = new Date(date);
    currentStart.setHours(9, 0, 0, 0);

    for (const task of dayTasks) {
      const taskStart = new Date(task.startTime!);
      const diff =
        (taskStart.getTime() - currentStart.getTime()) / (1000 * 60 * 60);

      if (diff >= 1) {
        return currentStart;
      }
      currentStart = new Date(task.endTime!);
    }

    if (currentStart.getHours() < 18) return currentStart;
    return null;
  };

  return { conflicts, stats, findFreeSlot };
};
