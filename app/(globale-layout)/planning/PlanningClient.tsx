"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useProductivity, Task } from "@/hooks/useProductivity";
import { Button } from "@/src/components/ui/button";
import { CalendarGrid } from "@/src/components/planning/CalendarGrid";
import {
  TaskDialog,
  TaskFormValues,
} from "@/src/components/planning/TaskDialog";
import { SearchDialog } from "@/src/components/planning/SearchDialog";
import { useNotifications } from "@/src/context/NotificationContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { Card, CardContent } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { Todo } from "@/src/components/dashboard/types";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfToday,
  setHours,
  setMinutes,
  isSameDay,
} from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useIPCAction } from "@/hooks/useIPCAction";

interface PlanningClientProps {
  initialData: {
    todos: any[];
    automations: any[];
  } | any[];
}

export default function PlanningClient({ initialData }: PlanningClientProps) {
  const initialTodos = Array.isArray(initialData) ? initialData : (initialData?.todos || []);
  const initialAutomations = Array.isArray(initialData) ? [] : (initialData?.automations || []);

  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [automations, setAutomations] = useState<any[]>(initialAutomations);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TaskFormValues | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const { addNotification } = useNotifications();
  const { t, language } = useLanguage();
  const { performAction, loading: actionLoading } = useIPCAction();

  const locale = useMemo(() => (language === "fr" ? fr : enUS), [language]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchTitle = todo.title
        .toLowerCase()
        .includes(searchTitle.toLowerCase());

      let matchDate = true;
      if (searchDate && todo.startTime) {
        matchDate = isSameDay(new Date(todo.startTime), new Date(searchDate));
      }

      return matchTitle && matchDate;
    });
  }, [todos, searchTitle, searchDate]);

  const { conflicts, stats, findFreeSlot } = useProductivity(todos as Task[]);

  const handleClearSearch = useCallback(() => {
    setSearchTitle("");
    setSearchDate("");
  }, []);

  const handlePrevMonth = useCallback(
    () => setCurrentMonth((prev) => subMonths(prev, 1)),
    [],
  );
  const handleNextMonth = useCallback(
    () => setCurrentMonth((prev) => addMonths(prev, 1)),
    [],
  );
  const handleToday = useCallback(() => setCurrentMonth(new Date()), []);

  const handleTaskSubmit = useCallback(
    async (values: TaskFormValues) => {
      const method = editingTodo && values.id ? "update" : "create";
      const params = editingTodo && values.id ? [values.id, values] : [values];

      const res = await performAction("planning", method, ...params);

      if (res.success) {
        const resultData = res.data;
        if (method === "update") {
          setTodos((prev) =>
            prev.map((t) => (t.id === resultData.id ? resultData : t)),
          );
          addNotification({
            user: "Système",
            action: t("editEvent"),
            target: `${t("task")} "${resultData.title}"`,
            type: "system",
          });
        } else {
          setTodos((prev) => [resultData, ...prev]);
          addNotification({
            user: "Système",
            action: t("createEvent"),
            target: `${t("task")} "${resultData.title}"`,
            type: "system",
          });
        }
      }

      setEditingTodo(null);
      setIsModalOpen(false);
    },
    [editingTodo, addNotification, t, performAction],
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      const taskToDelete = todos.find((t) => t.id === id);
      const res = await performAction("planning", "delete", id);

      if (res.success) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
        if (taskToDelete) {
          addNotification({
            user: "Système",
            action: t("delete"),
            target: `${t("task")} "${taskToDelete.title}"`,
            type: "system",
          });
        }
      }
    },
    [todos, addNotification, t, performAction],
  );

  const handleTodoClick = useCallback((todo: Todo) => {
    setEditingTodo(todo as unknown as TaskFormValues);
    setIsModalOpen(true);
  }, []);

  const openAddModal = useCallback((date?: Date) => {
    const start = date || startOfToday();
    setEditingTodo({
      title: "",
      description: "",
      startTime: format(
        setHours(setMinutes(start, 0), 9),
        "yyyy-MM-dd'T'HH:mm",
      ),
      endTime: format(setHours(setMinutes(start, 0), 10), "yyyy-MM-dd'T'HH:mm"),
      priority: "medium",
      status: "todo",
      category: "work",
    });
    setIsModalOpen(true);
  }, []);

  const startTimeValue = editingTodo?.startTime;
  const handleSuggestSlot = useCallback(() => {
    const d = startTimeValue ? new Date(startTimeValue) : new Date();
    const slot = findFreeSlot(d);
    if (slot) {
      const startStr = format(slot, "yyyy-MM-dd'T'HH:mm");
      const endStr = format(
        new Date(slot.getTime() + 60 * 60 * 1000),
        "yyyy-MM-dd'T'HH:mm",
      );
      return { start: startStr, end: endStr };
    }
    return null;
  }, [startTimeValue, findFreeSlot]);

  return (
    <div className="flex flex-col min-h-full min-w-full bg-background font-sans">
      {/* Premium Hero Header */}
      <div className="relative overflow-hidden bg-muted/30 border-b">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-emerald-500/5" />
        <div className="absolute -top-24 -right-24 size-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-64 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-8 md:px-10 md:py-12 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-linear-to-tr from-primary to-emerald-600 rounded-2xl shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Zap className="size-6 text-white" />
              </div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                {t("workPlanningAnalysis")}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
              {t("productivityDashboard")}
            </h1>
            <p className="text-sm text-muted-foreground max-w-md">
              Gérez votre emploi du temps et vos automatisations de facturation en un seul endroit.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              onClick={() => openAddModal()}
              className="flex-1 md:flex-none rounded-2xl bg-linear-to-r from-primary to-emerald-600 shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-12 px-8 font-bold"
            >
              <Plus className="size-5 mr-2" />
              {t("addTask")}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl size-12 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-colors"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Search className="size-5 text-primary" />
            </Button>
          </div>
        </div>
      </div>

      <header className="flex items-center justify-between px-6 py-3 border-b bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="rounded-full px-4 hover:bg-primary hover:text-white transition-colors"
            >
              {t("today")}
            </Button>
            <div className="flex items-center bg-muted/50 rounded-full p-0.5 border">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                className="rounded-full size-7"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="rounded-full size-7"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <h2 className="text-lg font-bold ml-2 min-w-[160px]">
              {format(currentMonth, "MMMM yyyy", { locale })}
            </h2>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col bg-muted/10 p-4 gap-4">
        {/* Automations Section */}
        <div className="space-y-4 animate-fade-in-up delay-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="size-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold">{t("automationDashboard")}</h2>
          </div>

          {automations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {automations.map((auto) => (
                <Card key={auto.id} className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all group">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-xs font-bold text-primary uppercase tracking-tighter">
                          {auto.isRecurring ? t("recurringInvoice") : t("autoReminders")}
                        </p>
                        <h3 className="font-bold text-sm line-clamp-1">{auto.clientName}</h3>
                        <p className="text-[10px] text-muted-foreground">{auto.reference}</p>
                      </div>
                      <div className="px-2 py-0.5 bg-primary/20 rounded text-[10px] font-bold text-primary">
                        {auto.isRecurring ? t(auto.recurrenceFreq) : t("pending")}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {auto.isRecurring && auto.nextIssueDate && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">{t("nextGeneration")}</span>
                          <span className="font-mono">{format(new Date(auto.nextIssueDate), "dd MMM yyyy", { locale })}</span>
                        </div>
                      )}
                      {auto.autoReminders && auto.nextReminderDate && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">{t("remindersScheduled")}</span>
                          <span className="font-mono">{format(new Date(auto.nextReminderDate), "dd MMM yyyy", { locale })}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/10 border-dashed border-2">
              <CardContent className="p-8 text-center space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("noActiveAutomations") || "Aucune automatisation active pour le moment."}
                </p>
                <p className="text-xs text-muted-foreground/60 italic">
                  {t("automationTip")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm bg-linear-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-2xl">
                <ListTodo className="size-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("todoList")}
                </p>
                <p className="text-2xl font-black text-indigo-700">
                  {stats.total}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-linear-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/10">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-xl">
                    <CheckCircle2 className="size-5 text-emerald-600" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t("productivity")}
                  </p>
                </div>
                <span className="text-xl font-black text-emerald-700">
                  {stats.percentage}%
                </span>
              </div>
              <Progress
                value={stats.percentage}
                className="h-1.5 bg-emerald-500/20"
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-linear-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-rose-500/20 rounded-2xl">
                <AlertTriangle className="size-6 text-rose-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("conflict")}
                </p>
                <p className="text-2xl font-black text-rose-700">
                  {conflicts.size / 2}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-linear-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <TrendingUp className="size-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("activeHours")}
                </p>
                <p className="text-2xl font-black text-amber-700">
                  {stats.productiveHours}h
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-3xl border shadow-xl flex flex-col shadow-primary/5">
          <CalendarGrid
            currentMonth={currentMonth}
            todos={filteredTodos}
            conflicts={conflicts}
            onDateClick={openAddModal}
            onTodoClick={handleTodoClick}
          />
        </div>
      </div>

      <TaskDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleTaskSubmit}
        onSuggestSlot={handleSuggestSlot}
        initialValues={editingTodo}
        onDelete={handleDeleteTask}
      />

      <SearchDialog
        isOpen={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
        searchTitle={searchTitle}
        setSearchTitle={setSearchTitle}
        searchDate={searchDate}
        setSearchDate={setSearchDate}
        onClear={handleClearSearch}
      />
    </div>
  );
}
