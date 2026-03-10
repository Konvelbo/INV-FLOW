"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Wallet, Plus, Search, Edit, Trash2, CalendarIcon, Download, Tag, DollarSign, Building } from "lucide-react";
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
    "Autre"
];

export default function ExpensesPage({ isComponent }: { isComponent?: boolean } = {}) {
    const { t } = useLanguage();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [companies, setCompanies] = useState<{ id: string, name: string }[]>([]);
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
                fetch("/api/expenses", { headers: { Authorization: `Bearer ${user.token}` } }),
                fetch("/api/companies", { headers: { Authorization: `Bearer ${user.token}` } })
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
                companyId: formData.companyId === "none" ? null : formData.companyId
            };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(editingId ? "Dépense modifiée" : "Dépense enregistrée");
                setIsDialogOpen(false);
                resetForm();
                fetchExpenses();
            } else {
                toast.error("Erreur lors de l'enregistrement");
            }
        } catch (error) {
            console.error("Error saving expense", error);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Voulez-vous vraiment supprimer la dépense "${title}" ?`)) return;
        try {
            const userStr = localStorage.getItem("user");
            if (!userStr) return;
            const user = JSON.parse(userStr);

            const res = await fetch(`/api/expenses/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (res.ok) {
                toast.success("Dépense supprimée");
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
            date: new Date(expense.date).toISOString().split('T')[0],
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
            title: "", amount: "", currency: "XOF",
            date: new Date().toISOString().split("T")[0],
            category: "Charges d'exploitation", companyId: "none",
            description: "", isDeductible: false,
        });
    };

    const handleExport = async () => {
        try {
            const userStr = localStorage.getItem("user");
            if (!userStr) return;
            const user = JSON.parse(userStr);

            const response = await fetch('/api/export/expenses', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "depenses_export.csv";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error('Export error', err);
        }
    };

    const filteredExpenses = expenses.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase())
    );

    const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className={isComponent ? "w-full" : "min-h-full min-w-full bg-background text-foreground p-5 md:p-10 lg:p-16 pt-28 md:pt-28 lg:pt-28 relative pb-20"}>
            <div className={isComponent ? "space-y-6 w-full" : "max-w-7xl mx-auto space-y-10 relative z-10 w-full"}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in-up">
                    {!isComponent && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-1.5 w-10 bg-amber-500 rounded-full" />
                                <span className="text-amber-500 font-black text-[10px] uppercase tracking-[0.3em]">
                                    Finances
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent font-sans">
                                Suivi des Dépenses
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-xl font-sans">
                                Analysez et contrôlez vos charges d'exploitation pour optimiser votre profit.
                            </p>
                        </div>
                    )}
                    {isComponent && <div />}

                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="gap-2 font-bold" onClick={handleExport}>
                            <Download className="w-4 h-4" />
                            Exporter (CSV)
                        </Button>
                        <Dialog open={isDialogOpen} onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (!open) resetForm();
                        }}>
                            <DialogTrigger asChild>
                                <Button className="font-bold gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                                    <Plus className="w-4 h-4" />
                                    Saisir une Dépense
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] bg-card border border-border/50 text-foreground backdrop-blur-xl">
                                <DialogHeader>
                                    <DialogTitle>{editingId ? "Modifier la Dépense" : "Nouvelle Dépense"}</DialogTitle>
                                    <DialogDescription>
                                        Entrez les détails de la charge d'exploitation.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSave} className="space-y-5 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Libellé / Titre *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            placeholder="Ex: Abonnement ChatGPT Plus"
                                            className="bg-background shadow-inner"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Montant *</Label>
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
                                            <Label htmlFor="currency">Devise</Label>
                                            <select
                                                id="currency"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-inner"
                                                value={formData.currency}
                                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                            >
                                                <option value="XOF">XOF (CFA)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="USD">USD ($)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Date *</Label>
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
                                            <Label htmlFor="category">Catégorie *</Label>
                                            <select
                                                id="category"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-inner"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="companyId">Liée à l'entreprise (Optionnel)</Label>
                                        <select
                                            id="companyId"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-inner"
                                            value={formData.companyId}
                                            onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                                        >
                                            <option value="none">-- Générale / Non spécifique --</option>
                                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description detaillee (Optionnel)</Label>
                                        <Input
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Ajoutez des détails sur cette dépense..."
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
                                            {t("isDeductible") || "Déductible fiscalement"}
                                        </Label>
                                    </div>
                                    <DialogFooter className="pt-4 border-t border-border/50">
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                                        <Button type="submit" className="font-bold bg-amber-600 hover:bg-amber-700 text-white">
                                            {editingId ? "Enregistrer" : "Créer la dépense"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up delay-100">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher une dépense ou catégorie..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-card border-border/50 shadow-inner"
                        />
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-card border border-border/50 flex flex-col md:flex-row items-center gap-2 md:gap-6 shrink-0 shadow-lg">
                        <span className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Total</span>
                        <span className="text-xl md:text-2xl font-black text-amber-500 font-mono tracking-tight">{totalFiltered.toLocaleString()} XOF</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up delay-200">
                    {isLoading ? (
                        Array(4).fill(0).map((_, i) => (
                            <Card key={i} className="bg-card/50 border-border/50 shadow-lg">
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
                            const c = companies.find(cp => cp.id === expense.companyId);
                            return (
                                <Card key={expense.id} className="group bg-card border border-border/40 shadow-sm hover:shadow-md hover:border-amber-500/20 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full">
                                    <CardHeader className="p-6 pb-4 border-b border-border/10 bg-muted/5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex flex-wrap gap-2">
                                                <div className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500/5 text-amber-600 border border-amber-500/10 flex items-center gap-1.5">
                                                    <Tag className="w-3 h-3" />
                                                    {expense.category}
                                                </div>
                                                {(expense as any).isDeductible && (
                                                    <div className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/5 text-emerald-600 border border-emerald-500/10">
                                                        Déductible
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-1.5">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" onClick={() => openEdit(expense)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={() => handleDelete(expense.id, expense.title)}>
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
                                                    <span className="font-bold uppercase tracking-widest text-[10px]">Date</span>
                                                </div>
                                                <span className="font-bold text-foreground">{new Date(expense.date).toLocaleDateString()}</span>
                                            </div>
                                            {c && (
                                                <div className="flex items-center justify-between text-xs pb-3 border-b border-border/10">
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Building className="w-3.5 h-3.5" />
                                                        <span className="font-bold uppercase tracking-widest text-[10px]">Entreprise</span>
                                                    </div>
                                                    <span className="font-bold text-foreground truncate max-w-[150px]">{c.name}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-2">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Montant</span>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-2xl font-black text-foreground tracking-tighter">
                                                    {expense.amount.toLocaleString()}
                                                </span>
                                                <span className="text-xs font-bold text-muted-foreground uppercase">{expense.currency}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-24 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-3xl bg-card/20">
                            <Wallet className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-medium">Aucune dépense trouvée.</p>
                            <Button onClick={() => setIsDialogOpen(true)} className="mt-4 gap-2 font-bold bg-amber-600 hover:bg-amber-700 text-white">
                                <Plus className="w-4 h-4" /> Ajouter une dépense
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
