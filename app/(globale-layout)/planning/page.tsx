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
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  TrendingUp,
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

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  category: string;
  startTime: string | null;
  endTime: string | null;
  reminderAt: string | null;
}

export default function PlanningPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TaskFormValues | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const { addNotification } = useNotifications();
  const { t, language } = useLanguage();

  const locale = useMemo(() => (language === "fr" ? fr : enUS), [language]);

  const [user, setUser] = useState<{ token: string } | null>(null);

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

  // Load user from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (err) {
        console.error("Failed to parse user data", err);
      }
    }
  }, []);

  // Fetch from API
  const fetchTodos = useCallback(async (token: string) => {
    try {
      const response = await fetch("/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error("Failed to fetch todos", error);
    }
  }, []);

  useEffect(() => {
    if (user?.token) {
      fetchTodos(user.token);
    }
  }, [user, fetchTodos]);

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
      if (!user?.token) return;

      try {
        if (editingTodo && values.id) {
          // Update existing
          const response = await fetch(`/api/todos/${values.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(values),
          });
          if (response.ok) {
            const updated = await response.json();
            setTodos((prev) =>
              prev.map((t) => (t.id === updated.id ? updated : t)),
            );
            addNotification({
              user: "Système",
              action: t("editEvent"),
              target: `${t("task")} "${updated.title}"`,
              type: "system",
            });
          }
        } else {
          // Create new
          const response = await fetch("/api/todos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(values),
          });
          if (response.ok) {
            const created = await response.json();
            setTodos((prev) => [created, ...prev]);
            addNotification({
              user: "Système",
              action: t("createEvent"),
              target: `${t("task")} "${created.title}"`,
              type: "system",
            });
          }
        }
      } catch (error) {
        console.error("Failed to submit task", error);
      }

      setEditingTodo(null);
      setIsModalOpen(false);
    },
    [user, editingTodo, addNotification, t],
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      if (!user?.token) return;
      try {
        const taskToDelete = todos.find((t) => t.id === id);
        const response = await fetch(`/api/todos/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.ok) {
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
      } catch (error) {
        console.error("Failed to delete task", error);
      }
    },
    [user, todos, addNotification, t],
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

  const handleSuggestSlot = useCallback(() => {
    const d = editingTodo?.startTime
      ? new Date(editingTodo.startTime)
      : new Date();
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
  }, [editingTodo?.startTime, findFreeSlot]);

  return (
    <div className="flex flex-col min-h-full bg-background font-sans">
      {/* Top Header Controls */}
      <header className="flex items-center justify-between px-6 py-3 border-b bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-tr from-primary to-emerald-600 rounded-xl shadow-lg shadow-primary/20">
              <TrendingUp className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                {t("productivityDashboard")}
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest -mt-1">
                {t("workPlanningAnalysis")}
              </p>
            </div>
          </div>

          <div className="h-8 w-px bg-border mx-2 hidden md:block" />

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

        <div className="flex items-center gap-3">
          <Button
            onClick={() => openAddModal()}
            className="rounded-full bg-linear-to-r from-primary to-emerald-600 shadow-lg shadow-primary/25 hover:opacity-90 px-6"
          >
            <Plus className="size-4 mr-2" />
            {t("addTask")}
          </Button>
          <div className="h-8 w-px bg-border mx-2" />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <Search className="size-5" />
          </Button>
        </div>
      </header>

      {/* Main Grid & Stats Area */}
      <div className="flex-1 flex flex-col bg-muted/10 p-4 gap-4">
        {/* Productivity Stats Bar */}
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

        {/* Main Grid */}
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
