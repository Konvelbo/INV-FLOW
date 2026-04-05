"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/src/context/LanguageContext";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Building2,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Receipt,
  Users2,
  Download,
  Package,
  Search,
  X,
} from "lucide-react";
import PhoneInput from "@/src/components/comp-46";
import { cn } from "@/lib/utils";
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
import { useIPCAction } from "@/hooks/useIPCAction";
import { usePricingRedirect } from "@/hooks/usePricingRedirect";
import { formatPrice } from "@/lib/currency";
import { useInvoice } from "@/src/context/InvoiceContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Separator } from "@/src/components/ui/separator";

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

const ALL_DEPARTMENTS = [
  "dept_dg", "dept_admin", "dept_secretariat", "dept_finance", "dept_accounting",
  "dept_control", "dept_audit", "dept_treasury", "dept_tax", "dept_sales",
  "dept_bizdev", "dept_mkt", "dept_comm", "dept_rp", "dept_cs", "dept_cx",
  "dept_rh", "dept_recruitment", "dept_training", "dept_payroll", "dept_talents",
  "dept_legal", "dept_compliance", "dept_risks", "dept_it", "dept_dev",
  "dept_cyber", "dept_data", "dept_prod", "dept_ops", "dept_pm", "dept_qhse",
  "dept_maint", "dept_logistics", "dept_supply", "dept_purchasing", "dept_stocks",
  "dept_transport", "dept_rd", "dept_innovation", "dept_design_prod", "dept_engineering",
  "dept_partners", "dept_strategy", "dept_digital_trans", "dept_bi", "dept_ir",
  "dept_adv", "dept_backoffice", "dept_frontoffice"
];

interface CompaniesClientProps {
  initialCompanies: any; // Now contains { companies, stats }
}

export default function CompaniesClient({
  initialCompanies,
}: CompaniesClientProps) {
  const { t } = useLanguage();
  const [companies, setCompanies] = useState<Company[]>(
    initialCompanies?.companies || [],
  );
  const [stats, setStats] = useState(
    initialCompanies?.stats || {
      totalRevenue: 0,
      totalLoss: 0,
      totalExpenses: 0,
      totalClients: 0,
    },
  );
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const { performAction, loading: actionLoading } = useIPCAction();
  const { currency } = useInvoice();
  const { checkCompanyQuota } = usePricingRedirect();
  const userStr = localStorage.getItem("user");

  useEffect(() => {
    if (userStr) {
      setActiveCompanyId(JSON.parse(userStr).activeCompanyId);
    }
  }, []);

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
    annualRevenue: "",
    monthlyRevenue: "",
    employeeCount: "",
    departments: "",
  });

  const [deptSearch, setDeptSearch] = useState("");

  const fetchCompanies = useCallback(async () => {
    const userStr = localStorage.getItem("user");
    const userId = userStr ? JSON.parse(userStr).id : null;
    if (!userId) return;

    // @ts-ignore
    const res = await window.electronAPI.getData("companies", userId);
    if (res.success) {
      setCompanies(res.data.companies);
      setStats(res.data.stats);
    }
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr && companies) {
      const user = JSON.parse(userStr);
      // Update companies list in localStorage if it changed
      if (JSON.stringify(user.companies) !== JSON.stringify(companies)) {
        user.companies = companies;
        localStorage.setItem("user", JSON.stringify(user));
        // Inform other components about the update
        window.dispatchEvent(new Event("session-update"));
      }
    }
  }, [companies]);

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
      annualRevenue: c.annualRevenue?.toString() || "",
      monthlyRevenue: c.monthlyRevenue?.toString() || "",
      employeeCount: c.employeeCount?.toString() || "",
      departments: c.departments || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCompany ? "update" : "create";
    const params = editingCompany ? [editingCompany.id, formData] : [formData];

    const res = await performAction("companies", method, ...params);

    if (res.success) {
      toast.success(editingCompany ? t("updateStructure") : t("save"));
      setIsDialogOpen(false);
      resetForm();
      fetchCompanies();

      // Auto-set as active if this is the first company or none is active
      if (!editingCompany && (!activeCompanyId || companies.length === 0)) {
        setTimeout(() => {
          handleSetActive(res.data.id);
        }, 500);
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t("deleteStructureWarning"))) return;

    const res = await performAction("companies", "delete", id);

    if (res.success) {
      toast.success(t("companyDeleted") || "Entreprise supprimée");
      fetchCompanies();
    }
  };

  const handleSetActive = async (companyId: string) => {
    const res = await performAction("companies", "setActive", companyId);
    if (res.success) {
      setActiveCompanyId(companyId);
      const activeCompany = companies.find((c) => c.id === companyId);
      // Update localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        user.activeCompanyId = companyId;
        user.activeCompanyName = activeCompany?.name || "";
        localStorage.setItem("user", JSON.stringify(user));
      }
      toast.success(t("companyActivated") || "Entreprise activée");
      window.dispatchEvent(new CustomEvent("session-update"));
    }
  };

  const handleGlobalExport = async () => {
    setIsExporting(true);
    const toastId = toast.loading(t("processing") || "Génération de l'archive...", { id: "global-export" });
    try {
      const userStr = localStorage.getItem("user");
      const userId = userStr ? JSON.parse(userStr).id : null;

      // @ts-ignore
      const res = await window.electronAPI.actionData("companies", "exportGlobal", userId);
      if (res.success && res.data) {
        const blob = new Blob([res.data], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Export_Comptable_Global_${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(t("exportZipSuccess") || "Archive globale générée !", { id: "global-export" });
      }
    } catch (error) {
      console.error("Global Export error", error);
      toast.error(t("exportError") || "Erreur lors de l'export global", { id: "global-export" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCompany = async (companyId: string, companyName: string) => {
    try {
      const userStr = localStorage.getItem("user");
      const userId = userStr ? JSON.parse(userStr).id : null;
      // @ts-ignore
      const res = await window.electronAPI.getData(
        "export",
        userId,
        "company_detail",
        companyId,
      );
      if (res.success && res.data) {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${companyName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Export de ${companyName} réussi`);
      } else {
        toast.error("Aucune donnée à exporter pour cette entreprise");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'export");
    }
  };


  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const res = await performAction("companies", "logo", {
        image: base64,
        companyId: editingCompany?.id,
      });

      if (res.success) {
        setFormData((prev) => ({ ...prev, logoUrl: res.data.logoUrl }));
        window.dispatchEvent(new CustomEvent("session-update"));
        toast.success(t("logoUploaded") || "Logo uploadé");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-full min-w-full bg-background text-foreground p-5 md:p-10 lg:p-16 pt-28 md:pt-28 lg:pt-28 relative pb-20">
      <div className="max-w-6xl mx-auto space-y-10 relative z-10 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
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

          <div className="flex items-center gap-3 animate-fade-in-up delay-100">
            <Button
              variant="outline"
              disabled={isExporting}
              onClick={handleGlobalExport}
              className="h-14 px-6 gap-2 font-black border-primary/20 bg-primary/5 backdrop-blur-xl hover:bg-primary/10 text-primary transition-all rounded-2xl shadow-lg shadow-primary/5 uppercase tracking-widest text-[10px]"
            >
              <Package className="w-4 h-4" />
              {t("globalExportZip") || "Export ZIP Global"}
            </Button>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button
                  className="font-black gap-3 px-8 py-6 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all group overflow-hidden relative h-auto uppercase tracking-widest text-xs"
                  onClick={(e) => {
                    // Intercept for free plan: block if already has 1 company
                    if (!editingCompany) {
                      const allowed = checkCompanyQuota(companies.length);
                      if (!allowed) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                      }
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <Plus className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{t("addStructure")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-card border border-border/50 text-foreground backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingCompany ? t("updateStructure") : t("addStructure")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("company_form_desc")}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label
                        htmlFor="name"

                      >
                        {t("company_name_label")}
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="legalName"

                      >
                        {t("legal_name_label")}
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
                        className="bg-background/50 border-border/50"
                        placeholder={t("legal_name_placeholder")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="taxId"

                      >
                        {t("tax_id_label")}
                      </Label>
                      <Input
                        id="taxId"
                        value={formData.taxId}
                        onChange={(e) =>
                          setFormData({ ...formData, taxId: e.target.value })
                        }
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="leaderName"

                      >
                        {t("leader_name_label")}
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
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="legalForm"
                      >
                        {t("legal_form_label")}
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
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="registrationNumber"

                      >
                        {t("reg_number_label")}
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
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label
                        htmlFor="address"

                      >
                        {t("headquarters_address")}
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="phone"

                      >
                        {t("phone_label")}
                      </Label>
                      <PhoneInput
                        value={formData.phone}
                        onChange={(val) =>
                          setFormData({ ...formData, phone: val })
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="email"

                      >
                        {t("default_email")}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="website"

                      >
                        {t("website")}
                      </Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        className="bg-background/50 border-border/50"
                      />
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <h3 className="text-sm text-primary uppercase tracking-widest border-b border-border/50 pb-2">
                        {t("activity_info")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                        <div className="space-y-4">
                          <Label htmlFor="sector" className="font-bold">
                            {t("sector_label")}
                          </Label>
                          <Select
                            value={formData.sector}
                            onValueChange={(val) => setFormData({ ...formData, sector: val })}
                          >
                            <SelectTrigger className="bg-background/50 border-border/50 h-10">
                              <SelectValue placeholder={t("unspecifiedSector")} />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              <SelectGroup>
                                <SelectLabel className="text-primary font-black flex items-center gap-2 bg-primary/5 py-2">
                                  {t("sector_phys")}
                                </SelectLabel>

                                <SelectLabel className="pl-4 opacity-70 italic text-[10px] uppercase tracking-widest">{t("cat_tech_services")}</SelectLabel>
                                <SelectItem value="sect_electrician" className="pl-8">{t("sect_electrician")}</SelectItem>
                                <SelectItem value="sect_plumber" className="pl-8">{t("sect_plumber")}</SelectItem>
                                <SelectItem value="sect_network" className="pl-8">{t("sect_network")}</SelectItem>
                                <SelectItem value="sect_phone_repair" className="pl-8">{t("sect_phone_repair")}</SelectItem>
                                <SelectItem value="sect_mechanic" className="pl-8">{t("sect_mechanic")}</SelectItem>

                                <SelectLabel className="pl-4 opacity-70 italic text-[10px] uppercase tracking-widest">{t("cat_btp")}</SelectLabel>
                                <SelectItem value="sect_mason" className="pl-8">{t("sect_mason")}</SelectItem>
                                <SelectItem value="sect_architect" className="pl-8">{t("sect_architect")}</SelectItem>
                                <SelectItem value="sect_construction" className="pl-8">{t("sect_construction")}</SelectItem>
                                <SelectItem value="sect_carpenter" className="pl-8">{t("sect_carpenter")}</SelectItem>
                                <SelectItem value="sect_painter" className="pl-8">{t("sect_painter")}</SelectItem>

                                <SelectLabel className="pl-4 opacity-70 italic text-[10px] uppercase tracking-widest">{t("cat_artisanat")}</SelectLabel>
                                <SelectItem value="sect_tailor" className="pl-8">{t("sect_tailor")}</SelectItem>
                                <SelectItem value="sect_hairdresser" className="pl-8">{t("sect_hairdresser")}</SelectItem>
                                <SelectItem value="sect_photographer" className="pl-8">{t("sect_photographer")}</SelectItem>
                                <SelectItem value="sect_printer" className="pl-8">{t("sect_printer")}</SelectItem>
                                <SelectItem value="sect_welder" className="pl-8">{t("sect_welder")}</SelectItem>

                                <SelectLabel className="pl-4 opacity-70 italic text-[10px] uppercase tracking-widest">{t("cat_transport")}</SelectLabel>
                                <SelectItem value="sect_car_rental" className="pl-8">{t("sect_car_rental")}</SelectItem>
                                <SelectItem value="sect_freight" className="pl-8">{t("sect_freight")}</SelectItem>
                                <SelectItem value="sect_moving" className="pl-8">{t("sect_moving")}</SelectItem>

                                <SelectLabel className="pl-4 opacity-70 italic text-[10px] uppercase tracking-widest">{t("cat_commerce")}</SelectLabel>
                                <SelectItem value="sect_restaurant" className="pl-8">{t("sect_restaurant")}</SelectItem>
                                <SelectItem value="sect_caterer" className="pl-8">{t("sect_caterer")}</SelectItem>
                                <SelectItem value="sect_retail" className="pl-8">{t("sect_retail")}</SelectItem>
                              </SelectGroup>

                              <SelectGroup>
                                <SelectLabel className="text-violet-400 font-black flex items-center gap-2 bg-violet-500/5 py-2 mt-2">
                                  {t("sector_online")}
                                </SelectLabel>

                                <SelectLabel className="pl-4 opacity-70 italic text-[10px] uppercase tracking-widest">{t("cat_design")}</SelectLabel>
                                <SelectItem value="sect_graphic" className="pl-8">{t("sect_graphic")}</SelectItem>
                                <SelectItem value="sect_ui_ux" className="pl-8">{t("sect_ui_ux")}</SelectItem>
                                <SelectItem value="sect_video" className="pl-8">{t("sect_video")}</SelectItem>

                                <SelectLabel className="pl-4 opacity-70 italic text-[10px] uppercase tracking-widest">{t("cat_digital")}</SelectLabel>
                                <SelectItem value="sect_dev" className="pl-8">{t("sect_dev")}</SelectItem>
                                <SelectItem value="sect_web_creator" className="pl-8">{t("sect_web_creator")}</SelectItem>
                                <SelectItem value="sect_community" className="pl-8">{t("sect_community")}</SelectItem>
                                <SelectItem value="sect_it_consultant" className="pl-8">{t("sect_it_consultant")}</SelectItem>

                                <SelectLabel className="pl-4 opacity-70 italic text-[10px] uppercase tracking-widest">{t("cat_business")}</SelectLabel>
                                <SelectItem value="sect_coach" className="pl-8">{t("sect_coach")}</SelectItem>
                                <SelectItem value="sect_marketing" className="pl-8">{t("sect_marketing")}</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="description"

                          >
                            {t("description")} *
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
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <Label
                            htmlFor="productsServices"

                          >
                            {t("proposedProducts")} *
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
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <h3 className="text-sm font-bold text-primary uppercase tracking-widest border-b border-border/50 pb-2">
                        {t("financial_info") || t("financialInfo")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                        <div className="space-y-3">
                          <Label
                            htmlFor="annualRevenue"

                          >
                            {t("annualRevenue")} *
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
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="monthlyRevenue"

                          >
                            {t("monthly_revenue")}
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
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <h3 className="text-sm font-bold text-primary uppercase tracking-widest border-b border-border/50 pb-2">
                        {t("organization")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 ">
                        <div className="space-y-3">
                          <Label
                            htmlFor="employeeCount"

                          >
                            {t("employee_count_label")}
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
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label>
                            {t("departments_label")}
                          </Label>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {(formData.departments?.split(",") || [])
                              .filter(Boolean)
                              .map((deptKey) => (
                                <Badge
                                  key={deptKey}
                                  variant="secondary"
                                  className="pl-3 pr-2 py-1 gap-1 bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                                >
                                  {t(deptKey as any)}
                                  <X
                                    className="w-3 h-3 cursor-pointer hover:text-rose-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const depts = formData.departments?.split(",").filter(d => d !== deptKey) || [];
                                      setFormData({ ...formData, departments: depts.join(",") });
                                    }}
                                  />
                                </Badge>
                              ))}
                          </div>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal border-border/50 bg-background/50 h-10"
                              >
                                <Plus className="mr-2 h-4 w-4 opacity-50" />
                                {t("select_depts")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                              <div className="p-3 space-y-3">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                  <Input
                                    placeholder={t("search_dept")}
                                    className="pl-9 h-9"
                                    value={deptSearch}
                                    onChange={(e) => setDeptSearch(e.target.value)}
                                  />
                                </div>
                                <Separator />
                                <div
                                  className="max-h-[300px] overflow-y-auto space-y-1 pr-1 custom-scrollbar"
                                  onWheel={(e) => e.stopPropagation()}
                                >
                                  {ALL_DEPARTMENTS.filter(d =>
                                    t(d as any).toLowerCase().includes(deptSearch.toLowerCase())
                                  ).map((deptKey) => {
                                    const isSelected = formData.departments?.split(",").includes(deptKey);
                                    return (
                                      <div
                                        key={deptKey}
                                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                                        onClick={() => {
                                          const current = formData.departments?.split(",").filter(Boolean) || [];
                                          let next;
                                          if (isSelected) {
                                            next = current.filter(d => d !== deptKey);
                                          } else {
                                            next = [...current, deptKey];
                                          }
                                          setFormData({ ...formData, departments: next.join(",") });
                                        }}
                                      >
                                        <Checkbox checked={isSelected} onCheckedChange={() => { }} />
                                        <span className="text-sm font-medium">{t(deptKey as any)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 md:col-span-2 pt-6">
                      <Label>
                        {t("company_logo")}
                      </Label>
                      <div className="flex items-center gap-4 p-4 bg-background/50 border border-border/50 rounded-2xl">
                        <div className="size-20 rounded-xl bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                          {formData.logoUrl ? (
                            <Image
                              src={formData.logoUrl}
                              alt="Logo preview"
                              fill
                              className="object-contain"
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
                            className="bg-background/50 border-border/50 h-10 file:bg-primary file:text-primary-foreground file:border-0 file:rounded-lg file:mr-4 file:px-4 file:py-1 file:text-[10px] file:font-black file:uppercase cursor-pointer text-xs"
                          />
                          <p className="text-[10px] text-slate-500 font-medium tracking-tight">
                            {t("logo_hint")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="pt-6">
                    <Button type="submit" className="w-full font-bold">
                      {editingCompany ? t("updateStructure") : t("save")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up delay-200">
          {[
            {
              label: t("totalRevenue"),
              value: formatPrice(stats.totalRevenue, currency),
              icon: TrendingUp,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
            {
              label: t("totalLoss"),
              value: formatPrice(stats.totalLoss, currency),
              icon: TrendingDown,
              color: "text-rose-500",
              bg: "bg-rose-500/10",
            },
            {
              label: t("totalExpenses"),
              value: formatPrice(stats.totalExpenses, currency),
              icon: Receipt,
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
            {
              label: t("totalClients"),
              value: stats.totalClients,
              icon: Users2,
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-[2rem] bg-card/40 border border-white/5 backdrop-blur-2xl flex flex-col gap-3 group hover:border-primary/30 transition-all duration-500 shadow-xl overflow-hidden relative"
            >
              <div
                className={cn(
                  "size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 relative z-10",
                  stat.bg,
                  stat.color,
                )}
              >
                <stat.icon className="size-6" />
              </div>
              <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {stat.label}
                </p>
                <p className="text-2xl font-black tracking-tighter">
                  {stat.value}
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up delay-100">
          {companies.length > 0 ? (
            companies.map((company) => (
              <Card
                key={company.id}
                className="group bg-card border border-border/40 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 rounded-3xl overflow-hidden flex flex-col h-full"
              >
                <CardContent className="p-8 pb-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="size-20 rounded-2xl bg-primary/5 border border-primary/10 p-4 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300 relative">
                      {company.logoUrl ? (
                        <Image
                          src={company.logoUrl}
                          alt={company.name}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <Building2 className="size-10 text-primary/40" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-muted-foreground hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                        onClick={() => handleExportCompany(company.id, company.name)}
                        title={"Exporter les stats de cette entreprise"}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                          "h-10 w-10 rounded-xl transition-all",
                          activeCompanyId === company.id
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                            : "text-slate-400 border-white/10 hover:bg-white/5",
                        )}
                        onClick={() => handleSetActive(company.id)}
                        title={
                          activeCompanyId === company.id
                            ? t("activeCompany") || "Entreprise active"
                            : t("setActiveCompany") || "Définir comme active"
                        }
                      >
                        <CheckCircle2
                          className={cn(
                            "w-5 h-5",
                            activeCompanyId === company.id
                              ? "scale-110"
                              : "opacity-50",
                          )}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => openEdit(company)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
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
                      {company.legalForm || t("defaultCompanyType") || "Entreprise"} •{" "}
                      {company.sector || t("unspecifiedSector") || "Secteur non spécifié"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/10">
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                          {t("taxIdLabel") || "Identifiant Fiscal"}
                        </span>
                        <p className="text-sm font-semibold text-foreground">
                          {company.taxId || "—"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                          {t("contactEmail") || "Contact E-mail"}
                        </span>
                        <p className="text-sm font-semibold text-foreground break-all">
                          {company.email || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                          {t("regNumberLabel") || "Numéro Registre"}
                        </span>
                        <p className="text-sm font-semibold text-foreground">
                          {company.registrationNumber || "—"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                          {t("phone_label") || "Téléphone"}
                        </span>
                        <p className="text-sm font-semibold text-foreground">
                          {company.phone || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-6 mt-6 border-t border-border/10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
                        {t("annualRevenue") || "CA Annuel"}
                      </span>
                      <p className="text-sm font-black text-foreground">
                        {company.annualRevenue ? formatPrice(company.annualRevenue, currency) : "—"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest block">
                        {t("monthly_revenue") || "CA Mensuel"}
                      </span>
                      <p className="text-sm font-black text-foreground">
                        {company.monthlyRevenue ? formatPrice(company.monthlyRevenue, currency) : "—"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl animate-fade-in-up">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">{t("noCompanyFound") || "Aucune entreprise trouvée"}</p>
              <Button
                variant="link"
                onClick={() => setIsDialogOpen(true)}
                className="mt-2 text-primary gap-1"
              >
                <Plus className="w-4 h-4" /> {t("addFirstCompany") || "Ajouter votre première entreprise"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
