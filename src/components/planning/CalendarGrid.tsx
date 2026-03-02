"use client";

import React, { memo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/src/context/LanguageContext";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  status: string;
  priority: string;
  category: string;
  startTime: string | null;
  endTime: string | null;
}

interface CalendarGridProps {
  currentMonth: Date;
  todos: Todo[];
  conflicts: Set<string>;
  onDateClick: (date: Date) => void;
  onTodoClick: (todo: Todo) => void;
}
export const CalendarGrid = memo(function CalendarGrid({
  currentMonth,
  todos,
  conflicts,
  onDateClick,
  onTodoClick,
}: CalendarGridProps) {
  const { t } = useLanguage();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = [
    t("mon"),
    t("tue"),
    t("wed"),
    t("thu"),
    t("fri"),
    t("sat"),
    t("sun"),
  ];

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "high":
        return "bg-rose-500/10 border-rose-500/20 text-rose-600";
      case "medium":
        return "bg-amber-500/10 border-amber-500/20 text-amber-600";
      case "low":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-600";
      default:
        return "bg-primary/10 border-primary/20 text-primary";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Week Headers */}
      <div className="grid grid-cols-7 border-b bg-muted/20">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 auto-rows-auto">
        {calendarDays.map((day) => {
          const dayTodos = todos.filter(
            (t) => t.startTime && isSameDay(new Date(t.startTime), day),
          );
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <div
              key={day.toString()}
              onClick={() => onDateClick(day)}
              className={cn(
                "min-h-[140px] border-r border-b p-2 cursor-pointer transition-all hover:bg-muted/30 group/cell",
                !isCurrentMonth && "bg-muted/5 text-muted-foreground/50",
              )}
            >
              <div className="flex flex-col h-full gap-2">
                <div className="flex justify-between items-center">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center size-8 text-sm font-bold rounded-full transition-transform group-hover/cell:scale-110",
                      isToday(day) &&
                        "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
                      !isToday(day) && isCurrentMonth && "text-foreground",
                      !isCurrentMonth && "text-muted-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {dayTodos.length > 0 && (
                    <span className="text-[10px] font-bold text-muted-foreground/60">
                      {dayTodos.length}{" "}
                      {dayTodos.length > 1 ? t("tasks_plural") : t("task")}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-1.5 overflow-y-auto scrollbar-none pb-2">
                  {dayTodos.map((todo) => (
                    <div
                      key={todo.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTodoClick(todo);
                      }}
                      className={cn(
                        "px-2 py-1 text-[10px] font-medium rounded-md truncate border relative group/task",
                        todo.status === "done"
                          ? "bg-muted text-muted-foreground/60 line-through opacity-50"
                          : getPriorityColor(todo.priority),
                        conflicts.has(todo.id) &&
                          "border-rose-500 border-2 animate-pulse",
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {conflicts.has(todo.id) && (
                          <span
                            className="size-1.5 rounded-full bg-rose-500"
                            title={t("scheduleConflict")}
                          />
                        )}
                        <span className="truncate">{todo.title}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        {todo.startTime && (
                          <div className="text-[8px] opacity-70">
                            {format(new Date(todo.startTime), "HH:mm")}
                          </div>
                        )}
                        {conflicts.has(todo.id) && (
                          <span className="text-[7px] font-black bg-rose-500 text-white px-1 rounded-[2px] animate-pulse">
                            {t("conflict")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
