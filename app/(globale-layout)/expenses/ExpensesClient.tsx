"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
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
  History,
  MoreHorizontal,
  CheckCircle2,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Label } from "@/src/components/ui/label";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useIPCAction } from "@/hooks/useIPCAction";
import { useInvoice } from "@/src/context/InvoiceContext";
import { formatPrice } from "@/lib/currency";
import { DataTable, DataTableColumn } from "@/src/components/ui/data-table";

interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  date: string | Date;
  category: string;
  companyId: string | null;
  createdAt: string | Date;
  description?: string | null;
  isDeductible?: boolean | null;
}

interface ExpensesClientProps {
  initialExpenses: any[];
  initialCompanies: any[];
  isComponent?: boolean;
  userId?: string;
}

export default function ExpensesClient({
  initialExpenses,
  initialCompanies,
  isComponent,
  userId,
}: ExpensesClientProps) {
  const { t } = useLanguage();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [companies] = useState<{ id: string; name: string }[]>(initialCompanies);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currency } = useInvoice();
  const [editingId, setEditingId] = useState<string | null>(null);
  const { performAction } = useIPCAction();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    currency: "XOF",
    date: new Date().toISOString().split("T")[0],
    category: "cat_exploitation",
    companyId: "none",
    description: "",
    isDeductible: false,
  });

  const fetchExpenses = useCallback(async () => {
    try {
      const result = await (window as any).electronAPI.getData("expenses", userId);
      if (result.success) {
        setExpenses(result.data.expenses);
      }
    } catch (error) {
      console.error("Error fetching expenses", error);
    }
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "update" : "create";
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
      companyId: formData.companyId === "none" ? null : formData.companyId,
    };
    const params = editingId ? [editingId, payload] : [payload];
    const res = await performAction("expenses", method, ...params);
    if (res.success) {
      toast.success(editingId ? t("expenseUpdated") : t("expenseSaved"));
      setIsDialogOpen(false);
      resetForm();
      fetchExpenses();
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(t("expenseDeleteWarning").replace("{title}", title))) return;
    const res = await performAction("expenses", "delete", id);
    if (res.success) {
      toast.success(t("expenseDeleted"));
      fetchExpenses();
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
      description: expense.description || "",
      isDeductible: expense.isDeductible || false,
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
      category: "cat_exploitation",
      companyId: "none",
      description: "",
      isDeductible: false,
    });
  };

  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async (format = "excel") => {
    setIsExporting(true);
    toast.loading(t("processing"), { id: "expense-export" });
    try {
      const userStr = localStorage.getItem("user");
      const userId = userStr ? JSON.parse(userStr).id : null;
      const activeCompanyId = userStr ? JSON.parse(userStr).activeCompanyId : undefined;
      const res = await (window as any).electronAPI.getData("export", userId, "expenses", activeCompanyId, format);
      if (res.success && res.data) {
        const mime = format === "excel" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "application/zip";
        const ext = format === "excel" ? "xlsx" : "zip";
        const blob = new Blob([res.data], { type: mime });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Expenses_Export_${new Date().toISOString().split("T")[0]}.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(t("exportSuccess") || "Export réussi !", { id: "expense-export" });
      }
    } catch (error) {
      toast.error(t("authError"), { id: "expense-export" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (!confirm(t("expenseDeleteWarning").replace("{title}", `${ids.length} dépenses`))) return;
    const res = await performAction("expenses", "bulkDelete", ids);
    if (res.success) {
      toast.success(t("expenseDeleted"));
      fetchExpenses();
    }
  };

  const filteredExpenses = expenses.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase()),
  );

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const columns: DataTableColumn<Expense>[] = [
    {
      key: "title",
      header: t("expenseLabel"),
      render: (row) => (
        <span className="font-semibold text-foreground">{row.title}</span>
      ),
    },
    {
      key: "amount",
      header: t("amount"),
      render: (row) => (
        <span className="font-bold font-mono text-rose-500">
          {formatPrice(row.amount, row.currency || "XOF", "fr-FR")}
        </span>
      ),
    },
    {
      key: "date",
      header: t("dateLabel"),
      render: (row) => (
        <span className="text-muted-foreground whitespace-nowrap">
          {new Date(row.date).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "category",
      header: t("categoryLabel"),
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <Tag className="w-3 h-3" />
          {t(row.category as any) || row.category}
        </span>
      ),
    },
    {
      key: "company",
      header: t("company"),
      render: (row) => {
        const c = companies.find((cp) => cp.id === row.companyId);
        return <span className="text-muted-foreground text-xs">{c?.name || "—"}</span>;
      },
    },
    {
      key: "deductible",
      header: t("isDeductible"),
      render: (row) => (
        row.isDeductible ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <span className="text-muted-foreground opacity-20">—</span>
        )
      ),
      className: "text-center",
      headerClassName: "text-center",
    },
  ];

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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in-up">
          {!isComponent && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-12 bg-linear-to-r from-rose-500 to-amber-500 rounded-full" />
                <span className="text-rose-400 font-black text-[10px] uppercase tracking-[0.4em]">
                  {t("financesHub")}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter bg-linear-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent font-sans">
                {t("financesTitle")}
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl font-medium leading-relaxed opacity-80">
                {t("financesDesc")}
              </p>
            </div>
          )}
          {isComponent && <div />}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="h-12 px-6 gap-2 font-bold border-border/50 bg-card/50 backdrop-blur-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all rounded-xl"
              onClick={() => handleExport("excel")}
              disabled={isExporting}
            >
              <Download className="w-4 h-4" />
              {t("exportExcel")}
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
                  <DialogTitle>{editingId ? t("editExpense") : t("recordExpense")}</DialogTitle>
                  <DialogDescription>{t("expenseDetailsDesc")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-5 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t("expenseLabel")} *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      >
                        <option value="XOF">{t("currency_unit")} (XOF)</option>
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
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="cat_exploitation">{t("cat_exploitation")}</option>
                        <option value="cat_financial">{t("cat_financial")}</option>
                        <option value="cat_tax">{t("cat_tax")}</option>
                        <option value="cat_investment">{t("cat_investment")}</option>
                        <option value="cat_admin">{t("cat_admin")}</option>
                        <option value="cat_commercial">{t("cat_commercial")}</option>
                        <option value="cat_operational">{t("cat_operational")}</option>
                        <option value="cat_other">{t("cat_other")}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyId">{t("linkedToCompany")}</Label>
                    <select
                      id="companyId"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-inner"
                      value={formData.companyId}
                      onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                    >
                      <option value="none">{t("generalNonSpecific")}</option>
                      {companies.map((c: any) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t("detailedDescription")}</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder={t("addDetailsExpense")}
                      className="bg-background shadow-inner"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/20">
                    <input
                      type="checkbox"
                      id="isDeductible"
                      checked={formData.isDeductible}
                      onChange={(e) => setFormData({ ...formData, isDeductible: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="isDeductible" className="cursor-pointer font-bold">
                      {t("isDeductible")}
                    </Label>
                  </div>
                  <DialogFooter className="pt-4 border-t border-border/50">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      {t("cancel")}
                    </Button>
                    <Button type="submit" className="font-bold bg-amber-600 hover:bg-amber-700 text-white">
                      {editingId ? t("saveChanges") : t("createExpense")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {!isComponent && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up delay-100">
            {[
              { label: t("totalExpenses"), value: formatPrice(expenses.reduce((acc, e) => acc + e.amount, 0), currency, "fr-FR"), icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-500/10" },
              { label: t("deductibles"), value: expenses.filter((e) => e.isDeductible).length, icon: Building, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: t("currentMonth"), value: expenses.filter((e) => new Date(e.date).getMonth() === new Date().getMonth()).length, icon: History, color: "text-blue-500", bg: "bg-blue-500/10" },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-3xl bg-card/40 border border-border/50 shadow-2xl backdrop-blur-xl flex flex-col gap-3 group hover:border-primary/30 transition-all duration-300">
                <div className={cn("size-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon className="size-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                  <p className="text-xl font-black tracking-tight">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

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
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">{t("total")}</span>
              <span className="text-2xl font-black text-rose-500 font-mono tracking-tight leading-none">
                {totalFiltered.toLocaleString()} <span className="text-xs opacity-70 uppercase">{currency}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up delay-200">
          <DataTable
            data={filteredExpenses}
            columns={columns}
            rowKey={(row) => row.id}
            emptyMessage={t("noExpenseFound")}
            emptyIcon={<Wallet className="w-12 h-12 opacity-20" />}
            onDeleteSelected={handleBulkDelete}
            renderActions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 bg-card border-border/50">
                  <DropdownMenuItem onClick={() => openEdit(row)} className="gap-2 cursor-pointer font-medium">
                    <Edit className="w-3.5 h-3.5" /> {t("edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(row.id, row.title)} className="gap-2 cursor-pointer font-medium text-destructive focus:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" /> {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            selectedLabel={t("linesSelected") || "ligne(s) sélectionnée(s)"}
            rowsPerPageLabel={t("rowsPerPage") || "Lignes par page"}
            pageLabel={t("page") || "Page"}
            ofLabel={t("of") || "sur"}
          />
        </div>
      </div>
    </div>
  );
}
