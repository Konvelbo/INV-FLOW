"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Wallet,
  Plus,
  Search,
  Edit,
  Trash2,
  CalendarIcon,
  Download,
  Tag,
  DollarSign,
  Building,
  TrendingDown,
  PieChart,
  History,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  companyId: string | null;
  createdAt: string;
}

const CATEGORIES = [
  "Charges d'exploitation",
  "Charges financières",
  "Charges fiscales et sociales",
  "Investissements et immobilisations",
  "Dépenses administratives et juridiques",
  "Dépenses commerciales",
  "Dépenses opérationnelles",
  "Autre",
];

export default function ExpensesPage({
  isComponent,
}: { isComponent?: boolean } = {}) {
  const { t } = useLanguage();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    currency: "XOF",
    date: new Date().toISOString().split("T")[0],
    category: "Charges d'exploitation",
    companyId: "none",
    description: "",
    isDeductible: false,
  });

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const [expRes, compRes] = await Promise.all([
        fetch("/api/expenses", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        fetch("/api/companies", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);

      if (expRes.ok && compRes.ok) {
        const expData = await expRes.json();
        const compData = await compRes.json();
        setExpenses(expData);
        setCompanies(compData);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/expenses/${editingId}` : "/api/expenses";

      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
        companyId: formData.companyId === "none" ? null : formData.companyId,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingId ? t("expenseUpdated") : t("expenseSaved"));
        setIsDialogOpen(false);
        resetForm();
        fetchExpenses();
      } else {
        toast.error(t("saveErrorExpense"));
      }
    } catch (error) {
      console.error("Error saving expense", error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(t("expenseDeleteWarning").replace("{title}", title))) return;
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.ok) {
        toast.success(t("expenseDeleted"));
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  };

  const openEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      currency: expense.currency || "XOF",
      date: new Date(expense.date).toISOString().split("T")[0],
      category: expense.category,
      companyId: expense.companyId || "none",
      description: (expense as any).description || "",
      isDeductible: (expense as any).isDeductible || false,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      amount: "",
      currency: "XOF",
      date: new Date().toISOString().split("T")[0],
      category: "Charges d'exploitation",
      companyId: "none",
      description: "",
      isDeductible: false,
    });
  };

  const handleExport = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const response = await fetch("/api/export/expenses", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "depenses_export.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Export error", err);
    }
  };

  const filteredExpenses = expenses.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase()),
  );

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div
      className={
        isComponent
          ? "w-full"
          : "min-h-full min-w-full bg-background text-foreground p-5 md:p-10 lg:p-16 pt-28 md:pt-28 lg:pt-28 relative pb-20"
      }
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div
        className={
          isComponent
            ? "space-y-6 w-full relative z-10"
            : "max-w-7xl mx-auto space-y-10 relative z-10 w-full"
        }
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in-up">
          {!isComponent && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-12 bg-linear-to-r from-rose-500 to-amber-500 rounded-full" />
                <span className="text-rose-400 font-black text-[10px] uppercase tracking-[0.4em]">
                  {t("financesHub")}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-slate-500 bg-clip-text text-transparent font-sans">
                {t("financesTitle")}
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl font-medium leading-relaxed opacity-80">
                {t("financesDesc")}
              </p>
            </div>
          )}
          {isComponent && <div />}

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-12 px-6 gap-2 font-bold border-border/50 bg-card/50 backdrop-blur-xl hover:bg-card transition-all"
              onClick={handleExport}
            >
              <Download className="w-4 h-4" />
              {t("exportCsv")}
            </Button>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button className="h-12 px-8 font-black gap-2 bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-500/20 text-white transition-all transform hover:-translate-y-1">
                  <Plus className="w-5 h-5" />
                  {t("recordExpense")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-card border border-border/50 text-foreground backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? t("editExpense") : t("recordExpense")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("expenseDetailsDesc")}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-5 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t("expenseLabel")} *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      placeholder="Ex: Loyer bureau, Abonnement SaaS..."
                      className="bg-background shadow-inner"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">{t("expenseAmount")} *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.amount}
                          onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                          }
                          required
                          className="bg-background shadow-inner pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">{t("currencyLabel")}</Label>
                      <select
                        id="currency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-inner"
                        value={formData.currency}
                        onChange={(e) =>
                          setFormData({ ...formData, currency: e.target.value })
                        }
                      >
                        <option value="XOF">XOF (CFA)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">{t("dateLabel")} *</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          required
                          className="bg-background shadow-inner pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">{t("categoryLabel")} *</Label>
                      <select
                        id="category"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-inner"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      >
                        <option value="Charges d'exploitation">
                          {t("cat_exploitation")}
                        </option>
                        <option value="Charges financières">
                          {t("cat_financial")}
                        </option>
                        <option value="Charges fiscales et sociales">
                          {t("cat_tax")}
                        </option>
                        <option value="Investissements et immobilisations">
                          {t("cat_investment")}
                        </option>
                        <option value="Dépenses administratives et juridiques">
                          {t("cat_admin")}
                        </option>
                        <option value="Dépenses commerciales">
                          {t("cat_commercial")}
                        </option>
                        <option value="Dépenses opérationnelles">
                          {t("cat_operational")}
                        </option>
                        <option value="Autre">{t("cat_other")}</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyId">{t("linkedToCompany")}</Label>
                    <select
                      id="companyId"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-inner"
                      value={formData.companyId}
                      onChange={(e) =>
                        setFormData({ ...formData, companyId: e.target.value })
                      }
                    >
                      <option value="none">{t("generalNonSpecific")}</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      {t("detailedDescription")}
                    </Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder={t("addDetailsExpense")}
                      className="bg-background shadow-inner"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/20">
                    <input
                      type="checkbox"
                      id="isDeductible"
                      checked={formData.isDeductible}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isDeductible: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label
                      htmlFor="isDeductible"
                      className="cursor-pointer font-bold"
                    >
                      {t("isDeductible")}
                    </Label>
                  </div>
                  <DialogFooter className="pt-4 border-t border-border/50">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      {t("cancel")}
                    </Button>
                    <Button
                      type="submit"
                      className="font-bold bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      {editingId ? t("saveChanges") : t("createExpense")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {!isComponent && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up delay-100">
              {[
                {
                  label: "Total Dépenses",
                  value: `${expenses.reduce((acc, e) => acc + e.amount, 0).toLocaleString()} ${expenses[0]?.currency || "XOF"}`,
                  icon: TrendingDown,
                  color: "text-rose-500",
                  bg: "bg-rose-500/10",
                },
                {
                  label: "Catégories",
                  value: new Set(expenses.map((e) => e.category)).size,
                  icon: PieChart,
                  color: "text-amber-500",
                  bg: "bg-amber-500/10",
                },
                {
                  label: "Déductibles",
                  value: (expenses as any).filter((e: any) => e.isDeductible)
                    .length,
                  icon: Building,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                },
                {
                  label: "Mois en cours",
                  value: expenses.filter(
                    (e) =>
                      new Date(e.date).getMonth() === new Date().getMonth(),
                  ).length,
                  icon: History,
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-card/40 border border-border/50 backdrop-blur-xl flex flex-col gap-3 group hover:border-primary/30 transition-all duration-300"
                >
                  <div
                    className={cn(
                      "size-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                      stat.bg,
                      stat.color,
                    )}
                  >
                    <stat.icon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      {stat.label}
                    </p>
                    <p className="text-xl font-black tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up delay-200">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t("searchExpense")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-card border-border/50 shadow-inner rounded-xl"
                />
              </div>
              <div className="px-6 py-3 rounded-2xl bg-linear-to-r from-rose-500/10 to-amber-500/10 border border-rose-500/20 flex items-center gap-4 shrink-0 shadow-lg backdrop-blur-xl">
                <div className="size-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                  <TrendingDown className="size-4 text-rose-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">
                    {t("total")}
                  </span>
                  <span className="text-2xl font-black text-rose-500 font-mono tracking-tight leading-none">
                    {totalFiltered.toLocaleString()}{" "}
                    <span className="text-xs opacity-70">XOF</span>
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up delay-200">
            {isLoading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card
                    key={i}
                    className="bg-card/50 border-border/50 shadow-lg"
                  >
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-full mt-4" />
                    </CardContent>
                  </Card>
                ))
            ) : filteredExpenses.length > 0 ? (
              expenses.map((expense) => {
                const c = companies.find((cp) => cp.id === expense.companyId);
                return (
                  <Card
                    key={expense.id}
                    className="group bg-card border border-border/40 shadow-sm hover:shadow-md hover:border-amber-500/20 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full"
                  >
                    <CardHeader className="p-6 pb-4 border-b border-border/10 bg-muted/5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-wrap gap-2">
                          <div className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500/5 text-amber-600 border border-amber-500/10 flex items-center gap-1.5">
                            <Tag className="w-3 h-3" />
                            {expense.category}
                          </div>
                          {(expense as any).isDeductible && (
                            <div className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/5 text-emerald-600 border border-emerald-500/10">
                              {t("deductible")}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            onClick={() => openEdit(expense)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            onClick={() =>
                              handleDelete(expense.id, expense.title)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg font-bold text-foreground leading-snug group-hover:text-amber-600 transition-colors duration-300">
                        {expense.title}
                      </CardTitle>
                      {(expense as any).description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-2 font-medium">
                          {(expense as any).description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="p-6 pt-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs pb-3 border-b border-border/10">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span className="font-bold uppercase tracking-widest text-[10px]">
                              {t("date")}
                            </span>
                          </div>
                          <span className="font-bold text-foreground">
                            {new Date(expense.date).toLocaleDateString()}
                          </span>
                        </div>
                        {c && (
                          <div className="flex items-center justify-between text-xs pb-3 border-b border-border/10">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building className="w-3.5 h-3.5" />
                              <span className="font-bold uppercase tracking-widest text-[10px]">
                                {t("company")}
                              </span>
                            </div>
                            <span className="font-bold text-foreground truncate max-w-[150px]">
                              {c.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                          {t("amount")}
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-foreground tracking-tighter">
                            {expense.amount.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-muted-foreground uppercase">
                            {expense.currency}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full py-24 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-3xl bg-card/20">
                <Wallet className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">{t("noExpenseFound")}</p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="mt-4 gap-2 font-bold bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Plus className="w-4 h-4" /> {t("addExpense")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
