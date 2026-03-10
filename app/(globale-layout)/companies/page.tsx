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
  Building2,
  Save,
  Plus,
  Store,
  Settings2,
  Trash2,
  Edit2,
  ShieldAlert,
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

interface Company {
  id: string;
  name: string;
  legalName: string | null;
  taxId: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
  website: string | null;
  leaderName: string | null;
  legalForm: string | null;
  registrationNumber: string | null;
  sector: string | null;
  description: string | null;
  productsServices: string | null;
  targetMarket: string | null;
  annualRevenue: number | null;
  monthlyRevenue: number | null;
  employeeCount: number | null;
  departments: string | null;
}

export default function SettingsPage() {
  const { t } = useLanguage();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    legalName: "",
    taxId: "",
    address: "",
    email: "",
    phone: "",
    logoUrl: "",
    website: "",
    leaderName: "",
    legalForm: "",
    registrationNumber: "",
    sector: "",
    description: "",
    productsServices: "",
    targetMarket: "",
    annualRevenue: "",
    monthlyRevenue: "",
    employeeCount: "",
    departments: "",
  });

  const fetchCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const res = await fetch("/api/companies", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error("Error fetching companies", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const resetForm = () => {
    setEditingCompany(null);
    setFormData({
      name: "",
      legalName: "",
      taxId: "",
      address: "",
      email: "",
      phone: "",
      logoUrl: "",
      website: "",
      leaderName: "",
      legalForm: "",
      registrationNumber: "",
      sector: "",
      description: "",
      productsServices: "",
      targetMarket: "",
      annualRevenue: "",
      monthlyRevenue: "",
      employeeCount: "",
      departments: "",
    });
  };

  const openEdit = (c: Company) => {
    setEditingCompany(c);
    setFormData({
      name: c.name,
      legalName: c.legalName || "",
      taxId: c.taxId || "",
      address: c.address || "",
      email: c.email || "",
      phone: c.phone || "",
      logoUrl: c.logoUrl || "",
      website: c.website || "",
      leaderName: c.leaderName || "",
      legalForm: c.legalForm || "",
      registrationNumber: c.registrationNumber || "",
      sector: c.sector || "",
      description: c.description || "",
      productsServices: c.productsServices || "",
      targetMarket: c.targetMarket || "",
      annualRevenue: c.annualRevenue?.toString() || "",
      monthlyRevenue: c.monthlyRevenue?.toString() || "",
      employeeCount: c.employeeCount?.toString() || "",
      departments: c.departments || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const url = editingCompany
        ? `/api/companies/${editingCompany.id}`
        : "/api/companies";
      const method = editingCompany ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingCompany ? t("updateStructure") : t("save"));
        setIsDialogOpen(false);
        resetForm();
        fetchCompanies();
      } else {
        toast.error(t("authError"));
      }
    } catch (error) {
      console.error("Save company error", error);
      toast.error(t("authError"));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t("deleteStructureWarning"))) return;

    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const res = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.ok) {
        toast.success("Entreprise supprimée");
        fetchCompanies();
      } else {
        toast.error("Erreur, suppression impossible");
      }
    } catch (error) {
      console.error("Delete company error", error);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);

        const res = await fetch("/api/companies/logo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            image: base64,
            companyId: editingCompany?.id,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setFormData((prev) => ({ ...prev, logoUrl: data.logoUrl }));
          toast.success("Logo uploadé");
        } else {
          toast.error("Échec de l'upload");
        }
      } catch (error) {
        console.error("Logo upload error", error);
        toast.error("Erreur lors de l'upload");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-full min-w-full bg-background text-foreground p-5 md:p-10 lg:p-16 pt-28 md:pt-28 lg:pt-28 relative pb-20">
      <div className="max-w-6xl mx-auto space-y-10 relative z-10 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in-up">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-10 bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em]">
                {t("companySettings")}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black md:tracking-tighter bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent font-sans uppercase">
              {t("companies")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl font-sans italic">
              {t("companySettingsDesc")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button className="font-black gap-3 px-8 py-6 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all group overflow-hidden relative h-auto uppercase tracking-widest text-xs">
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <Plus className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{t("addStructure")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] bg-slate-950/90 border border-white/10 text-foreground backdrop-blur-3xl rounded-[2.5rem] shadow-2xl">
                <DialogHeader className="space-y-4">
                  <DialogTitle className="text-3xl font-black tracking-tighter uppercase">
                    {editingCompany ? t("updateStructure") : t("addStructure")}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400 font-sans italic">
                    Renseignez les informations qui apparaîtront sur vos
                    factures et devis.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-8 py-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="name"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                      >
                        Nom / Enseigne commerciale *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="legalName"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                      >
                        Raison Sociale
                      </Label>
                      <Input
                        id="legalName"
                        value={formData.legalName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            legalName: e.target.value,
                          })
                        }
                        className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                        placeholder="Ex: Ma Société SAS"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="taxId"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                      >
                        Numéro fiscal
                      </Label>
                      <Input
                        id="taxId"
                        value={formData.taxId}
                        onChange={(e) =>
                          setFormData({ ...formData, taxId: e.target.value })
                        }
                        className="bg-muted/20 border-border/50 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="leaderName"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                      >
                        Nom du dirigeant / fondateur *
                      </Label>
                      <Input
                        id="leaderName"
                        value={formData.leaderName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaderName: e.target.value,
                          })
                        }
                        required
                        className="bg-muted/20 border-border/50 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="legalForm"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                      >
                        Forme juridique *
                      </Label>
                      <Input
                        id="legalForm"
                        value={formData.legalForm}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            legalForm: e.target.value,
                          })
                        }
                        required
                        className="bg-muted/20 border-border/50 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="registrationNumber"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                      >
                        N° Immatriculation / Registre
                      </Label>
                      <Input
                        id="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            registrationNumber: e.target.value,
                          })
                        }
                        className="bg-muted/20 border-border/50 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label
                        htmlFor="address"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                      >
                        Adresse du Siège
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="phone"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                      >
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="email"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                      >
                        Email par défaut
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="website"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                      >
                        Site Web
                      </Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        className="bg-muted/20 border-border/50 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                      />
                    </div>

                    <div className="md:col-span-2 pt-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4">
                        Informations sur l’activité
                      </h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="sector"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                          >
                            Secteur d’activité *
                          </Label>
                          <Input
                            id="sector"
                            value={formData.sector}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                sector: e.target.value,
                              })
                            }
                            required
                            className="bg-muted/20 border-border/50 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="targetMarket"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                          >
                            Marché cible
                          </Label>
                          <Input
                            id="targetMarket"
                            value={formData.targetMarket}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                targetMarket: e.target.value,
                              })
                            }
                            className="bg-muted/20 border-border/50 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                          />
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <Label
                            htmlFor="description"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                          >
                            Description de l’entreprise *
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
                            required
                            className="bg-muted/20 border-border/50 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                          />
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <Label
                            htmlFor="productsServices"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                          >
                            Produits ou services proposés *
                          </Label>
                          <Input
                            id="productsServices"
                            value={formData.productsServices}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                productsServices: e.target.value,
                              })
                            }
                            required
                            className="bg-muted/20 border-border/50 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4">
                        Informations financières
                      </h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="annualRevenue"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                          >
                            Chiffre d’affaires annuel *
                          </Label>
                          <Input
                            id="annualRevenue"
                            type="number"
                            value={formData.annualRevenue}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                annualRevenue: e.target.value,
                              })
                            }
                            required
                            className="bg-muted/20 border-border/50 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="monthlyRevenue"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                          >
                            Chiffre d’affaires mensuel
                          </Label>
                          <Input
                            id="monthlyRevenue"
                            type="number"
                            value={formData.monthlyRevenue}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                monthlyRevenue: e.target.value,
                              })
                            }
                            className="bg-muted/20 border-border/50 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4">
                        Organisation
                      </h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="employeeCount"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                          >
                            Nombre d’employés *
                          </Label>
                          <Input
                            id="employeeCount"
                            type="number"
                            value={formData.employeeCount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                employeeCount: e.target.value,
                              })
                            }
                            required
                            className="bg-muted/20 border-border/50 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="departments"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1"
                          >
                            Départements principaux *
                          </Label>
                          <Input
                            id="departments"
                            value={formData.departments}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                departments: e.target.value,
                              })
                            }
                            required
                            placeholder="Ex: Direction, Comptabilité, Marketing"
                            className="bg-muted/20 border-border/50 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 md:col-span-2 pt-6">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                        Logo de l'entreprise
                      </Label>
                      <div className="flex items-center gap-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="size-20 rounded-xl bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {formData.logoUrl ? (
                            <img
                              src={formData.logoUrl}
                              alt="Logo preview"
                              className="size-full object-contain"
                            />
                          ) : (
                            <Building2 className="size-8 text-slate-700" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="bg-white/5 border-white/10 h-10 file:bg-primary file:text-primary-foreground file:border-0 file:rounded-lg file:mr-4 file:px-4 file:py-1 file:text-[10px] file:font-black file:uppercase cursor-pointer text-xs"
                          />
                          <p className="text-[10px] text-slate-500 font-medium tracking-tight">
                            Format recommandé : Carré, max 1Mo.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="pt-6 border-t border-white/10 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="rounded-xl px-8 h-12 uppercase text-[10px] font-black tracking-widest"
                    >
                      {t("cancel")}
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-xl px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-primary/20"
                    >
                      <Save className="w-4 h-4" />
                      {editingCompany ? t("updateStructure") : t("save")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Company Cards List */}
        <div className="space-y-10 animate-fade-in-up delay-100">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="h-64 w-full rounded-[2.5rem] bg-white/5" />
              <Skeleton className="h-64 w-full rounded-[2.5rem] bg-white/5" />
            </div>
          ) : companies.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {companies.map((company) => (
                <Card
                  key={company.id}
                  className="group bg-card border border-border/40 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 rounded-3xl overflow-hidden flex flex-col h-full"
                >
                  <CardContent className="p-8 pb-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="size-20 rounded-2xl bg-primary/5 border border-primary/10 p-4 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
                        {company.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt={company.name}
                            className="size-full object-contain"
                          />
                        ) : (
                          <Building2 className="size-10 text-primary/40" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          onClick={() => openEdit(company)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => handleDelete(company.id, company.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1 mb-8">
                      <h3 className="text-2xl font-black text-foreground tracking-tight leading-none group-hover:text-primary transition-colors">
                        {company.name}
                      </h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {company.legalForm || "Entreprise"} • {company.sector || "Secteur non spécifié"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/10">
                      <div className="space-y-5">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                            Identifiant Fiscal
                          </span>
                          <p className="text-sm font-semibold text-foreground">
                            {company.taxId || "—"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                            Contact E-mail
                          </span>
                          <p className="text-sm font-semibold text-foreground break-all">
                            {company.email || "—"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-5">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                            Siège Social
                          </span>
                          <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                            {company.address || "—"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                            Téléphone
                          </span>
                          <p className="text-sm font-semibold text-foreground">
                            {company.phone || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  {company.website && (
                    <div className="px-8 py-3 bg-muted/30 border-t border-border/10 flex items-center justify-between group/site">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Site Web</span>
                      <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary hover:underline transition-all">
                        {company.website}
                      </a>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-40 border-2 border-dashed border-white/5 rounded-[3.5rem] flex flex-col items-center justify-center text-center space-y-8 bg-white/[0.02] backdrop-blur-sm animate-pulse-slow">
              <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center border border-white/5 shadow-inner">
                <Store className="w-10 h-10 text-slate-600" />
              </div>
              <div className="space-y-3">
                <p className="text-3xl font-black tracking-tighter uppercase">
                  {t("noCompanySetup")}
                </p>
                <p className="text-slate-500 font-sans italic max-w-sm mx-auto">
                  {t("noCompanySetupDesc")}
                </p>
              </div>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="px-12 py-7 rounded-2xl bg-white text-slate-950 font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-200 transition-all shadow-2xl shadow-white/10 h-auto"
              >
                {t("createFirstCompany")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
