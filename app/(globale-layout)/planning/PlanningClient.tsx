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
import { InvoiceAutomationDialog } from "@/src/components/planning/InvoiceAutomationDialog";
import { useNotifications } from "@/src/context/NotificationContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { Card, CardContent } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { Label } from "@/src/components/ui/label";
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
  StopCircle,
  CalendarClock,
  Trash2,
  Clock,
  MoreVertical,
  X,
  Check,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import toast from "react-hot-toast";
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
import { useSubscription } from "@/src/context/SubscriptionContext";
import { useIPCData } from "@/hooks/useIPCData";
import { calculateNextIssueDate } from "@/lib/date-utils";

interface PlanningClientProps {
  initialData?:
    | {
        todos: any[];
        automations: any[];
        scheduledInvoices: any[];
      }
    | any[];
}

export default function PlanningClient({ initialData }: PlanningClientProps) {
  // Initialisation avec tableaux vides - les données viendront du fetch dashboard
  const [todos, setTodos] = useState<Todo[]>([]);
  const [scheduledInvoices, setScheduledInvoices] = useState<any[]>([]); // Factures planifiées (envoi unique) - à afficher uniquement dans le calendrier
  const [recurringInvoices, setRecurringInvoices] = useState<any[]>([]); // Factures récurrentes - à afficher uniquement dans la gestion des automatisations
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TaskFormValues | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Recurring & Scheduled invoice controls
  const [editingFreqId, setEditingFreqId] = useState<string | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState("monthly");
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [editingScheduledId, setEditingScheduledId] = useState<string | null>(
    null,
  );
  const [isUpdatingFreq, setIsUpdatingFreq] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");

  // const { session, data: items, loading } = useIPCData<any[]>("dashboard.get");

  // Scheduled invoice modal state
  const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);
  const [selectedAutomationInvoice, setSelectedAutomationInvoice] = useState<any | null>(null);
  const [automationType, setAutomationType] = useState<"recurring" | "scheduled" | null>(null);
  const [isSavingAutomation, setIsSavingAutomation] = useState(false);

  const [activeList, setActiveList] = useState<"recurring" | "scheduled" | null>(null);
  const [automations, setAutomations] = useState<any[]>([]);

  const { addNotification } = useNotifications();
  const { t, language } = useLanguage();
  const { performAction, loading: actionLoading } = useIPCAction();

  const user = useMemo(() => {
    const userStr =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    return userStr ? JSON.parse(userStr) : null;
  }, []);
  const { subscription } = useSubscription();
  const isPaid =
    subscription?.plan === "monthly" || subscription?.plan === "yearly";
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

  const combinedCalendarTasks = useMemo(() => {
    const regularTasks = filteredTodos
      .map((todo) => {
        const start = todo.startTime ? new Date(todo.startTime) : null;
        const end = todo.endTime ? new Date(todo.endTime) : null;

        if (!start || !end) return null;

        return {
          ...todo,
          startTime: start,
          endTime: end,
          isInvoiceTask: false,
        };
      })
      .filter(Boolean);

    const scheduledInvoiceTasks = scheduledInvoices
      .filter((auto) => auto.nextIssueDate)
      .map((auto) => ({
        id: auto.id,
        title: `${t("scheduledInvoice")}: ${auto.reference}`,
        description: `Client: ${auto.clientName}`,
        startTime: new Date(auto.nextIssueDate),
        endTime: new Date(auto.nextIssueDate),
        priority: "medium",
        status: "todo",
        category: "work",
        isInvoiceTask: true,
        invoiceType: "scheduled",
        invoiceOriginal: auto
      }));

    const recurringInvoiceTasks = recurringInvoices
      .filter((auto) => auto.nextIssueDate)
      .map((auto) => {
        const d = new Date(auto.nextIssueDate);
        return {
          id: auto.id,
          title: `${t("recurringInvoice")}: ${auto.reference}`,
          description: `Client: ${auto.clientName}`,
          startTime: d,
          endTime: d,
          priority: "medium",
          status: "todo",
          category: "work",
          isInvoiceTask: true,
          invoiceType: "recurring",
          invoiceOriginal: auto
        };
      });

    return [...regularTasks, ...scheduledInvoiceTasks, ...recurringInvoiceTasks];
  }, [filteredTodos, scheduledInvoices, recurringInvoices, t]);

  const { stats, findFreeSlot } = useProductivity(todos as Task[]);



  // Fetch dashboard data on mount only
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardRes = await performAction("dashboard", "get");

        if (dashboardRes.success) {
          // Update todos from dashboard
          const todosData = dashboardRes.data.todos || [];

          // Get scheduled invoices (envoi unique planifié) - pour le calendrier uniquement
          const scheduled = dashboardRes.data.scheduledInvoices || [];


          // Get recurring invoices (automations) - pour la gestion des automatisations uniquement
          const recurring = dashboardRes.data.automations || [];


          // Mise à jour de TOUS les états à chaque fetch (pas de condition)
          setScheduledInvoices(scheduled); // Factures planifiées → calendrier
          setRecurringInvoices(recurring); // Factures récurrentes → section automation
          setAutomations(recurring); // Même liste pour l'affichage dans la section automation
          setTodos(todosData);

        } else {
          console.error("Dashboard fetch failed:", dashboardRes.error);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };
    fetchDashboard();
  }, []); // Tableau vide = s'exécute une seule fois au mount

  useEffect(() => {
    // Écouter les événements d'automatisation en arrière-plan (envoi planifié, génération récurrente)
    // @ts-ignore
    if (window.electronAPI && window.electronAPI.onAutomationEvent) {
      // @ts-ignore
      const removeListener = window.electronAPI.onAutomationEvent(() => {
        // Rafraîchir les données du dashboard pour mettre à jour le calendrier et les listes
        performAction("dashboard", "get").then((res: any) => {
          if (res.success) {
            setScheduledInvoices(res.data.scheduledInvoices || []);
            setRecurringInvoices(res.data.automations || []);
            setAutomations(res.data.automations || []);
            setTodos(res.data.todos || []);
          }
        });
      });

      return () => {
        if (removeListener) removeListener();
      };
    }
  }, [t, performAction]);

  // Fetch eligible invoices when invoice modal opens
  useEffect(() => {
    const fetchInvoices = async () => {
      if (isInvoiceModalOpen && !editingFreqId && user?.activeCompanyId) {
        try {
          const invRes = await performAction(
            "invoices",
            "get",
            null,
            user.activeCompanyId,
          );
          if (invRes.success) {
            const filtered = invRes.data.filter(
              (inv: any) => !inv.isRecurring && inv.status !== "paid",
            );
            setInvoices(filtered);
          }
        } catch (error) {
          console.error("Failed to fetch invoices", error);
        }
      }
    };
    fetchInvoices();
  }, [isInvoiceModalOpen, editingFreqId, performAction, user?.activeCompanyId]);

  // Listen for invoice scheduling events from other pages
  useEffect(() => {
    const handleInvoiceScheduled = () => {
      const refreshData = async () => {
        try {
          const dashboardRes = await performAction("dashboard", "get");
          if (dashboardRes.success) {
            const scheduled = dashboardRes.data.scheduledInvoices || [];
            const recurring = dashboardRes.data.automations || [];
            setScheduledInvoices(scheduled); // Factures planifiées → calendrier
            setRecurringInvoices(recurring); // Factures récurrentes → automation
            setAutomations(recurring); // Section automation
          }
        } catch (error) {
          console.error(
            "Failed to refresh automations after scheduling",
            error,
          );
        }
      };
      refreshData();
    };

    window.addEventListener("invoice-scheduled", handleInvoiceScheduled);
    return () =>
      window.removeEventListener("invoice-scheduled", handleInvoiceScheduled);
  }, [performAction]);

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

  const handleTaskSubmit = async (values: TaskFormValues) => {
    const method =
      editingTodo && todos.some((t) => t.id === (editingTodo as any).id)
        ? "update"
        : "create";
    const res = await performAction(
      "planning",
      method,
      editingTodo && (editingTodo as any).id ? (editingTodo as any).id : values,
      values,
    );

    if (res.success) {
      if (method === "create") {
        setTodos((prev) => [...prev, res.data]);
        addNotification({
          user: "Système",
          action: t("add"),
          target: `${t("task")} "${values.title}"`,
          type: "system",
        });
      } else {
        setTodos((prev) =>
          prev.map((t) => (t.id === (editingTodo as any).id ? res.data : t)),
        );
        addNotification({
          user: "Système",
          action: t("update"),
          target: `${t("task")} "${values.title}"`,
          type: "system",
        });
      }
      setIsModalOpen(false);
      setEditingTodo(null);
    }
  };

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

  const handleStopRecurring = useCallback(
    async (invoiceId: string, clientName: string) => {
      const res = await performAction("invoices", "patch", invoiceId, {
        isRecurring: false,
      });
      if (res.success) {
        setAutomations((prev) =>
          prev.map((a) =>
            a.id === invoiceId ? { ...a, isRecurring: false } : a,
          ),
        );
        toast.success(t("stopRecurrenceSuccess").replace("{name}", clientName));
      }
    },
    [performAction],
  );

  const handleStartRecurring = useCallback(
    async (
      invoiceId: string,
      clientName: string,
      currentFreq: string | null,
    ) => {
      const freq = currentFreq || "monthly";
      const nextDate = calculateNextIssueDate(new Date(), freq);
      const res = await performAction("invoices", "patch", invoiceId, {
        isRecurring: true,
        recurrenceFreq: freq,
        nextIssueDate: nextDate.toISOString(),
      });
      if (res.success) {
        setAutomations((prev) =>
          prev.map((a) =>
            a.id === invoiceId
              ? { ...a, isRecurring: true, recurrenceFreq: freq }
              : a,
          ),
        );
        toast.success(
          t("startRecurrenceSuccess").replace("{name}", clientName),
        );
      }
    },
    [performAction],
  );

  const handleUpdateFrequency = useCallback(
    async (invoiceId: string, newFreq: string) => {
      setIsUpdatingFreq(true);
      const nextDate = calculateNextIssueDate(new Date(), newFreq);
      const res = await performAction("invoices", "patch", invoiceId, {
        recurrenceFreq: newFreq,
        nextIssueDate: nextDate.toISOString(),
        // If it's a template being updated, we keep it as a template
      });
      if (res.success) {
        // Fetch latest state to sync calendar
        const dashboardRes = await performAction("dashboard", "get");
        if (dashboardRes.success) {
          setScheduledInvoices(dashboardRes.data.scheduledInvoices || []);
          setRecurringInvoices(dashboardRes.data.automations || []);
          setAutomations(dashboardRes.data.automations || []);
        }
        setEditingFreqId(null);
        setIsInvoiceModalOpen(false);
        toast.success(t("frequencyUpdated"));
      }
      setIsUpdatingFreq(false);
    },
    [performAction, t],
  );

  const handleDeleteAutomation = useCallback(
    async (invoiceId: string, clientName: string, isRecurring: boolean) => {
      const msg = isRecurring
        ? t("confirmDeleteAutomation").replace("{name}", clientName)
        : t("confirmCancelSchedule").replace("{name}", clientName);
      const confirmed = window.confirm(msg);
      if (!confirmed) return;

      let res;
      if (isRecurring) {
        res = await performAction("invoices", "patch", invoiceId, {
          isRecurring: false,
          recurrenceFreq: null,
          autoReminders: false,
        });
      } else {
        // For one-offs (scheduled sends), DO NOT delete the invoice record.
        // Instead, remove it from the scheduling system by clearing `nextIssueDate`.
        // This keeps the invoice in the database but removes it from planning.
        res = await performAction("invoices", "patch", invoiceId, {
          nextIssueDate: null,
        });
      }

      if (res.success) {
        // Fetch latest state to sync calendar
        const dashboardRes = await performAction("dashboard", "get");
        if (dashboardRes.success) {
          setScheduledInvoices(dashboardRes.data.scheduledInvoices || []);
          setRecurringInvoices(dashboardRes.data.automations || []);
          setAutomations(dashboardRes.data.automations || []);
        }
        toast.success(
          isRecurring ? t("automationDeleted") : t("scheduleCancelled"),
        );
      }
    },
    [performAction],
  );

  const handleUpdateAutomationDate = useCallback(async (invoiceId: string, newDate: string) => {
    try {
      setIsSavingAutomation(true);
      const isoDate = new Date(newDate).toISOString();
      const res = await performAction("invoices", "patch", invoiceId, { nextIssueDate: isoDate });
      
      if (res.success) {
        // Fetch latest state to sync calendar
        const dashboardRes = await performAction("dashboard", "get");
        if (dashboardRes.success) {
          setScheduledInvoices(dashboardRes.data.scheduledInvoices || []);
          setRecurringInvoices(dashboardRes.data.automations || []);
          setAutomations(dashboardRes.data.automations || []);
          
          if (automationType === "recurring") {
             const updated = dashboardRes.data.automations?.find((a: any) => a.id === invoiceId);
             if (updated) setSelectedAutomationInvoice(updated);
             else if (selectedAutomationInvoice) setSelectedAutomationInvoice({ ...selectedAutomationInvoice, nextIssueDate: isoDate });
          } else {
             const updated = dashboardRes.data.scheduledInvoices?.find((a: any) => a.id === invoiceId);
             if (updated) setSelectedAutomationInvoice(updated);
             else if (selectedAutomationInvoice) setSelectedAutomationInvoice({ ...selectedAutomationInvoice, nextIssueDate: isoDate });
          }
        }
        toast.success(t("dateSaved") || "Date mise à jour avec succès");
        setIsAutomationModalOpen(false);
      } else {
        throw new Error(res.error || "Failed to save changes");
      }
    } catch (error) {
      toast.error((error as Error).message || t("errorSaving") || "Erreur lors de la sauvegarde");
      throw error;
    } finally {
      setIsSavingAutomation(false);
    }
  }, [performAction, t, automationType]);

  const handlePauseResumeAutomation = useCallback(async (invoiceId: string, isPausing: boolean) => {
    try {
      setIsSavingAutomation(true);
      let payload: any = {};
      
      if (automationType === "recurring") {
         payload = { isRecurring: !isPausing };
      } else {
         payload = { status: isPausing ? "paused" : "pending" };
      }
      
      const res = await performAction("invoices", "patch", invoiceId, payload);
      if (res.success) {
        // Refresh full dashboard to be safe
        const dashboardRes = await performAction("dashboard", "get");
        if (dashboardRes.success) {
          setScheduledInvoices(dashboardRes.data.scheduledInvoices || []);
          setRecurringInvoices(dashboardRes.data.automations || []);
          setAutomations(dashboardRes.data.automations || []);
          
          // Forcer la mise à jour de l'objet dans les tableaux sources
          // pour que la réouverture de la card montre le bon état
          if (automationType === "recurring") {
             setRecurringInvoices(prev => prev.map(a =>
               a.id === invoiceId ? { ...a, ...payload } : a
             ));
             setAutomations(prev => prev.map(a =>
               a.id === invoiceId ? { ...a, ...payload } : a
             ));
             const updated = dashboardRes.data.automations?.find((a: any) => a.id === invoiceId);
             setSelectedAutomationInvoice(prev => {
                const base = updated || prev;
                return base ? { ...base, ...payload } : null;
             });
          } else {
             setScheduledInvoices(prev => prev.map(a =>
               a.id === invoiceId ? { ...a, ...payload } : a
             ));
             const updated = dashboardRes.data.scheduledInvoices?.find((a: any) => a.id === invoiceId);
             setSelectedAutomationInvoice(prev => {
                const base = updated || prev;
                return base ? { ...base, ...payload } : null;
             });
          }
        }
        toast.success(isPausing ? t("pauseAutomationSuccess") : t("resumeAutomationSuccess"));
        // On ne ferme pas la modale pour laisser l'utilisateur voir que ça a marché (passage à "Relancer")
      }
    } catch (error) {
       toast.error((error as Error).message || t("unexpectedError"));
    } finally {
       setIsSavingAutomation(false);
    }
  }, [performAction, automationType, t]);

  const handleTodoClick = useCallback(
    (todo: Todo) => {
      // Check if this is a scheduled/recurring invoice task
      if ((todo as any).isInvoiceTask) {
        const type = (todo as any).invoiceType;
        const invoice = (todo as any).invoiceOriginal;
        if (invoice) {
          setAutomationType(type);
          setSelectedAutomationInvoice(invoice);
          setIsAutomationModalOpen(true);
          return;
        }
      }
      // Otherwise treat as regular todo
      setEditingTodo(todo as unknown as TaskFormValues);
      setIsModalOpen(true);
    },
    [],
  );

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsChoiceModalOpen(true);
  }, []);

  const openAddModal = useCallback(
    (date?: Date) => {
      const start = date || selectedDate || startOfToday();
      setEditingTodo({
        title: "",
        description: "",
        startTime: format(
          setHours(setMinutes(start, 0), 9),
          "yyyy-MM-dd'T'HH:mm",
        ),
        endTime: format(
          setHours(setMinutes(start, 0), 10),
          "yyyy-MM-dd'T'HH:mm",
        ),
        priority: "medium",
        status: "todo",
        category: "work",
      });
      setIsChoiceModalOpen(false);
      setIsModalOpen(true);
    },
    [selectedDate],
  );

  const handleScheduleInvoice = async () => {
    if (!selectedDate || !selectedInvoiceId) return;
    if (!isPaid) {
      toast.error(t("proFeatureOnly") || "Réservé aux abonnés PRO");
      window.location.href = "/pricing";
      return;
    }

    setIsScheduling(true);
    const [hours, minutes] = scheduledTime.split(":").map(Number);
    const nextDate = setMinutes(setHours(selectedDate, hours), minutes);
    const inv = invoices.find((i) => i.id === selectedInvoiceId);

    const payload: any = {
      nextIssueDate: nextDate,
      status: "pending",
    };

    const res = await performAction(
      "invoices",
      "patch",
      selectedInvoiceId,
      payload,
    );

    if (res.success) {
      toast.success(t("scheduleSuccess") || "Envoi planifié avec succès !");
      // Fetch latest state to sync calendar
      const dashboardRes = await performAction("dashboard", "get");
      if (dashboardRes.success) {
        setScheduledInvoices(dashboardRes.data.scheduledInvoices || []);
        setRecurringInvoices(dashboardRes.data.automations || []);
        setAutomations(dashboardRes.data.automations || []);
      }
      setIsInvoiceModalOpen(false);
      setSelectedInvoiceId("");
    }
    setIsScheduling(false);
  };

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

  const conflicts = new Set<string>(); // Conflicts logic can be re-added here if needed from productivity hook

  return (
    <div className="flex flex-col min-h-full min-w-full bg-background font-sans selection:bg-primary/20 p-6 md:p-10">
      <div className="relative overflow-hidden bg-muted/30 border-b rounded-3xl p-8 mb-8">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-emerald-500/5 transition-opacity" />
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-linear-to-tr from-primary to-emerald-600 rounded-2xl shadow-xl shadow-primary/20">
                <Zap className="size-6 text-white" />
              </div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                {t("workPlanningAnalysis")}
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              {t("productivityDashboard")}
            </h1>
            <p className="text-sm text-muted-foreground">
              Gérez votre emploi du temps et vos automatisations en un seul
              endroit.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => openAddModal()}
              className="rounded-2xl bg-linear-to-r from-primary to-emerald-600 shadow-xl h-12 px-8 font-bold text-white border-none"
            >
              <Plus className="size-5 mr-2" /> {t("addTask")}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl size-12"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Search className="size-5 text-primary" />
            </Button>
          </div>
        </div>
      </div>

      <header className="flex items-center justify-between px-6 py-4 border-b bg-card/50 backdrop-blur-md rounded-t-3xl border-x">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="rounded-full px-5"
          >
            {t("today")}
          </Button>
          <div className="flex items-center bg-muted/50 rounded-full p-1 border">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="rounded-full size-8"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="rounded-full size-8"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <h2 className="text-xl font-black ml-2 uppercase tracking-tighter">
            {format(currentMonth, "MMMM yyyy", { locale })}
          </h2>
        </div>
      </header>

      <div className="flex-1 flex flex-col bg-card border-x border-b rounded-b-3xl shadow-2xl p-6 gap-8">
        <div className="flex flex-col md:flex-row gap-4 mb-2">
          <Button 
            onClick={() => setActiveList("recurring")}
            className="flex-1 h-16 rounded-2xl text-lg font-bold shadow-lg transition-all bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
          >
            📌 {t("recurringInvoices") || "Factures récurrentes"} ({recurringInvoices.length})
          </Button>
          <Button 
            onClick={() => setActiveList("scheduled")}
            className="flex-1 h-16 rounded-2xl text-lg font-bold shadow-lg transition-all bg-amber-50 hover:bg-amber-100 text-amber-700"
          >
            📅 {t("scheduledInvoices") || "Factures planifiées"} ({scheduledInvoices.length})
          </Button>
        </div>



        <div className="bg-background rounded-3xl border shadow-inner">
          <CalendarGrid
            currentMonth={currentMonth}
            todos={combinedCalendarTasks as any}
            conflicts={new Set()}
            onDateClick={handleDateClick}
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
      <InvoiceAutomationDialog
        isOpen={isAutomationModalOpen}
        onOpenChange={setIsAutomationModalOpen}
        invoice={selectedAutomationInvoice}
        type={automationType}
        onUpdateDate={handleUpdateAutomationDate}
        onUpdateFreq={handleUpdateFrequency}
        onPauseResume={handlePauseResumeAutomation}
        onDelete={async (id) => handleDeleteAutomation(id, selectedAutomationInvoice?.clientName || "", automationType === "recurring")}
        isLoading={isSavingAutomation}
      />

      {activeList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className={cn("bg-card w-full max-w-4xl rounded-[2.5rem] border shadow-2xl p-8 animate-fade-in-up flex flex-col max-h-[85vh]", activeList === "recurring" ? "border-indigo-500/30" : "border-amber-500/30")}>
            <div className="flex justify-between items-center mb-6 shrink-0 border-b pb-4">
               <div className="flex items-center gap-4">
                 <div className={cn("p-3 rounded-2xl", activeList === "recurring" ? "bg-indigo-500/10 text-indigo-600" : "bg-amber-500/10 text-amber-600")}>
                    {activeList === "recurring" ? <Zap className="size-6" /> : <CalendarClock className="size-6" />}
                 </div>
                 <div>
                   <h3 className="text-2xl font-black tracking-tight">{activeList === 'recurring' ? (t("recurringInvoices") || "Factures récurrentes") : (t("scheduledInvoices") || "Factures planifiées")}</h3>
                   <p className="text-sm font-semibold text-muted-foreground mt-1">{(activeList === "recurring" ? recurringInvoices : scheduledInvoices).length} factures</p>
                 </div>
               </div>
               <Button variant="ghost" size="icon" onClick={() => setActiveList(null)} className="rounded-full bg-muted/50 hover:bg-muted text-muted-foreground size-10">
                 <X className="size-5" />
               </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-thin px-2 -mx-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {(activeList === "recurring" ? recurringInvoices : scheduledInvoices).length === 0 ? (
                   <div className="col-span-full py-16 text-center text-muted-foreground opacity-70 border-2 border-dashed rounded-3xl m-4">
                      Aucune facture trouvée.
                   </div>
                ) : (
                  (activeList === "recurring" ? recurringInvoices : scheduledInvoices).map((auto) => (
                    <Card key={auto.id} className={cn("cursor-pointer hover:shadow-xl transition-all border group overflow-hidden", activeList === "recurring" ? "hover:border-indigo-500/50" : "hover:border-amber-500/50")} onClick={() => {
                       setActiveList(null);
                       setAutomationType(activeList);
                       setSelectedAutomationInvoice(auto);
                       setIsAutomationModalOpen(true);
                       if (auto.nextIssueDate) setCurrentMonth(new Date(auto.nextIssueDate));
                    }}>
                      <div className={cn("h-1 w-full opacity-50 group-hover:opacity-100 transition-opacity", activeList === "recurring" ? "bg-indigo-500" : "bg-amber-500")} />
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{auto.reference}</p>
                          <p className="text-base font-bold truncate text-foreground mb-3">{auto.clientName}</p>
                          
                          <div className="space-y-2">
                            {auto.nextIssueDate ? (
                               <div className="flex items-center gap-2">
                                 <Clock className="size-3 text-muted-foreground" />
                                 <p className="text-xs font-medium text-foreground tracking-wide">
                                    {format(new Date(auto.nextIssueDate), "dd MMM yyyy 'à' HH:mm", { locale })}
                                 </p>
                               </div>
                            ) : (
                               <p className="text-[11px] text-rose-500 font-bold bg-rose-50/50 py-1 px-2 rounded-md inline-block">
                                  {activeList === "recurring" && auto.isRecurring === false ? "En pause" : "Non définie"}
                               </p>
                            )}
                            
                            {activeList === "recurring" && auto.recurrenceFreq && (
                               <div className="flex items-center gap-2">
                                 <Repeat className="size-3 text-indigo-500" />
                                 <p className="text-[10px] uppercase font-bold text-indigo-600">
                                   {t(auto.recurrenceFreq)}
                                 </p>
                               </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isChoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-card w-full max-w-xs rounded-3xl border border-border/50 shadow-2xl p-8 animate-fade-in-up">
            <h3 className="text-xs font-black text-center mb-8 uppercase tracking-[0.3em] text-muted-foreground">
              {selectedDate && format(selectedDate, "dd MMMM", { locale })}
            </h3>
            <div className="grid gap-4">
              <Button
                onClick={() => openAddModal()}
                className="h-16 rounded-2xl flex items-center justify-start gap-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
              >
                <ListTodo className="size-6" />
                <div className="text-left">
                  <p className="text-sm font-bold">{t("addTask")}</p>
                  <p className="text-[10px] opacity-70 italic">
                    Gestion d'agenda
                  </p>
                </div>
              </Button>
              <Button
                onClick={() => {
                  setIsChoiceModalOpen(false);
                  setIsInvoiceModalOpen(true);
                }}
                className="h-16 rounded-2xl flex items-center justify-start gap-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
              >
                <CalendarClock className="size-6" />
                <div className="text-left">
                  <p className="text-sm font-bold">{t("scheduleInvoice")}</p>
                  <p className="text-[10px] opacity-70 italic">
                    Envoi automatique {!isPaid && "PRO"}
                  </p>
                </div>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsChoiceModalOpen(false)}
                className="mt-2 font-bold text-xs uppercase tracking-widest"
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-card w-full max-w-sm rounded-[2.5rem] border border-border/50 shadow-2xl p-10 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-600">
                <CalendarClock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">
                  {t("scheduleSend")}
                </h3>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  {selectedDate &&
                    format(selectedDate, "dd MMMM yyyy", { locale })}
                </p>
              </div>
            </div>

            {!isPaid ? (
              <div className="space-y-8 text-center">
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl">
                  <Zap className="size-10 text-primary mx-auto mb-4 animate-pulse" />
                  <p className="text-sm font-bold mb-2">
                    {t("proOfferRequired")}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {t("proFeatureOnlyDesc")}
                  </p>
                </div>
                <Button
                  onClick={() => (window.location.href = "/pricing")}
                  className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/30 transition-transform active:scale-95"
                >
                  {t("upgradeToPremium")}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="w-full text-xs font-bold opacity-50 uppercase tracking-widest"
                >
                  {t("later")}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      {t("chooseInvoice")}
                    </Label>
                    <select
                      value={selectedInvoiceId}
                      onChange={(e) => setSelectedInvoiceId(e.target.value)}
                      className="w-full h-14 bg-background border border-border/40 rounded-2xl px-5 text-sm focus:border-primary transition-all font-sans appearance-none"
                    >
                      <option value="">{t("selectInvoicePlaceholder")}</option>
                      {invoices.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.reference} - {inv.clientName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      {t("sendTime")}
                    </Label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full h-14 bg-background border border-border/40 rounded-2xl px-5 text-sm focus:border-primary transition-all font-sans"
                    />
                  </div>
                  <div className="flex gap-4 pt-6">
                    <Button
                      variant="outline"
                      className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                      onClick={() => setIsInvoiceModalOpen(false)}
                    >
                      {t("cancel")}
                    </Button>
                    <Button
                      className="flex-1 h-14 rounded-2xl gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20"
                      onClick={handleScheduleInvoice}
                      disabled={isScheduling || !selectedInvoiceId}
                    >
                      {isScheduling ? (
                        <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}{" "}
                      {t("confirmAction")}
                    </Button>
                  </div>
                </>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
