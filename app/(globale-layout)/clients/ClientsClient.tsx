"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Download,
  Users2,
  TrendingUp,
  ShieldCheck,
  Building,
  Search,
  Plus,
  Users,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
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

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  contact: string | null;
  poBox: string | null;
  firstName: string | null;
  city: string | null;
  country: string | null;
  companyName: string | null;
  jobTitle: string | null;
  type: string | null;
  status: string | null;
  preferredPaymentMethod: string | null;
  notes: string | null;
  zipCode: string | null;
  taxId: string | null;
  totalSpent?: number;
  paidInvoicesCount?: number;
  unpaidInvoicesCount?: number;
  createdAt: string;
  _count?: { invoices: number };
}

interface ClientsClientProps {
  initialClients: Client[];
  isComponent?: boolean;
}

export default function ClientsClient({
  initialClients,
  isComponent,
}: ClientsClientProps) {
  const { t } = useLanguage();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    contact: "",
    poBox: "",
    firstName: "",
    city: "",
    country: "",
    companyName: "",
    jobTitle: "",
    type: "particulier",
    status: "actif",
    preferredPaymentMethod: "cash",
    notes: "",
    zipCode: "",
    taxId: "",
  });

  const fetchClients = useCallback(async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const res = await fetch(`/api/clients?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${user.token}` },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (error) {
      console.error("Error fetching clients", error);
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/clients/${editingId}` : "/api/clients";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsDialogOpen(false);
        resetForm();
        fetchClients();
      }
    } catch (error) {
      console.error("Error saving client", error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t("clientDeleteWarning").replace("{name}", name))) return;
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const res = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.ok) {
        fetchClients();
      }
    } catch (error) {
      console.error("Error deleting client", error);
    }
  };

  const openEdit = (client: Client) => {
    setEditingId(client.id);
    setFormData({
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      contact: client.contact || "",
      poBox: client.poBox || "",
      firstName: client.firstName || "",
      city: client.city || "",
      country: client.country || "",
      companyName: client.companyName || "",
      jobTitle: client.jobTitle || "",
      type: client.type || "particulier",
      status: client.status || "actif",
      preferredPaymentMethod: client.preferredPaymentMethod || "cash",
      notes: client.notes || "",
      zipCode: client.zipCode || "",
      taxId: client.taxId || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      contact: "",
      poBox: "",
      firstName: "",
      city: "",
      country: "",
      companyName: "",
      jobTitle: "",
      type: "particulier",
      status: "actif",
      preferredPaymentMethod: "cash",
      notes: "",
      zipCode: "",
      taxId: "",
    });
  };

  const handleExport = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const response = await fetch("/api/export/clients", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "clients_export.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Export error", err);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      (c.contact && c.contact.toLowerCase().includes(search.toLowerCase())),
  );

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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse delay-700" />
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
                <div className="h-2 w-12 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full" />
                <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em]">
                  {t("crm")}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-slate-500 bg-clip-text text-transparent font-sans">
                {t("clients")}
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl font-medium leading-relaxed opacity-80">
                {t("crmDesc")}
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
                <Button className="h-12 px-8 font-black gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 text-white transition-all transform hover:-translate-y-1">
                  <Plus className="w-5 h-5" />
                  {t("newClient")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-card border border-border/50 text-foreground backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? t("editClient") : t("newClient")}
                  </DialogTitle>
                  <DialogDescription>{t("clientCrmDesc")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4 py-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest border-b border-border/50 pb-2">
                      {t("personalInfo")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("clientNameLabel")} *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="bg-background/50 border-border/50"
                          placeholder="Ex: Entreprise XYZ ou Jean Dupont"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t("mainContact")}</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          className="bg-background/50 border-border/50"
                          placeholder="Jean"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("emailAddress")}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="bg-background/50 border-border/50"
                          placeholder="contact@client.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("phoneNumber")}</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="bg-background/50 border-border/50"
                          placeholder="+33 6 00 00 00 00"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest border-b border-border/50 pb-2">
                      {t("location")}
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="address">{t("billingAddress")}</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="bg-background/50 border-border/50"
                        placeholder="123 rue de la Paix"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">{t("city")}</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          className="bg-background/50 border-border/50"
                          placeholder="Paris"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">{t("zipCode")}</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) =>
                            setFormData({ ...formData, zipCode: e.target.value })
                          }
                          className="bg-background/50 border-border/50"
                          placeholder="75000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest border-b border-border/50 pb-2">
                      {t("proDetails")}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="taxId">{t("taxIdLabel")}</Label>
                        <Input
                          id="taxId"
                          value={formData.taxId}
                          onChange={(e) =>
                            setFormData({ ...formData, taxId: e.target.value })
                          }
                          className="bg-background/50 border-border/50"
                          placeholder="FR 00 000 000 000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">{t("type")}</Label>
                        <select
                          id="type"
                          value={formData.type}
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              type: e.target.value,
                            })
                          }
                        >
                          <option value="individual">{t("individual")}</option>
                          <option value="company">{t("company")}</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">{t("notes")}</Label>
                      <Input
                        id="notes"
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        className="bg-background/50 border-border/50"
                        placeholder="Notes internes sur le client..."
                      />
                    </div>
                  </div>

                  <DialogFooter className="pt-6">
                    <Button type="submit" className="w-full font-bold">
                      {editingId ? t("saveChanges") : t("addClient")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {!isComponent && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up delay-100">
            {[
              {
                label: "Total Clients",
                value: clients.length,
                icon: Users2,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                label: "Entreprises",
                value: clients.filter((c) => c.type === "company").length,
                icon: Building,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                label: "Valeur Totale",
                value: `${clients.reduce((acc, c) => acc + (c.totalSpent || 0), 0).toLocaleString()} CFA`,
                icon: TrendingUp,
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
              {
                label: "Clients Actifs",
                value: clients.length,
                icon: ShieldCheck,
                color: "text-teal-500",
                bg: "bg-teal-500/10",
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
        )}

        <div className="flex items-center gap-4 animate-fade-in-up delay-200">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("searchClients")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-200">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <Card
                key={client.id}
                className="group bg-card border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full"
              >
                <CardHeader className="p-6 pb-4 border-b border-border/10 bg-muted/5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        {client.firstName?.[0] || ""}
                        {client.name?.[0] || "C"}
                      </div>
                      <div className="space-y-0.5">
                        <CardTitle className="text-lg font-bold tracking-tight text-foreground line-clamp-1">
                          {client.firstName
                            ? `${client.firstName} ${client.name}`
                            : client.name}
                        </CardTitle>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                              client.type === "company"
                                ? "bg-primary/5 text-primary border-primary/10"
                                : "bg-orange-500/5 text-orange-500 border-orange-500/10",
                            )}
                          >
                            {client.type === "company"
                              ? t("company")
                              : t("individual")}
                          </div>
                          <div className="px-3 py-1 rounded-full bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 text-[10px] font-black uppercase tracking-widest">
                            {t("active")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => openEdit(client)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => handleDelete(client.id, client.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-5 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {client.email && (
                      <div className="flex items-center gap-3 text-xs text-muted-foreground group/item">
                        <div className="p-1.5 rounded-md bg-muted/50 group-hover/item:text-primary transition-colors">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-3 text-xs text-muted-foreground group/item">
                        <div className="p-1.5 rounded-md bg-muted/50 group-hover/item:text-primary transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-start gap-3 text-xs text-muted-foreground group/item">
                        <div className="p-1.5 rounded-md bg-muted/50 group-hover/item:text-primary transition-colors shrink-0">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <span className="line-clamp-2">{client.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-5 border-t border-border/10">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {t("totalPaid")}
                        </span>
                        <p className="text-lg font-black text-primary tracking-tight">
                          {(client.totalSpent || 0).toLocaleString()}{" "}
                          <span className="text-[10px] opacity-70">CFA</span>
                        </p>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {t("totalInvoices")}
                        </span>
                        <p className="text-lg font-black text-foreground tracking-tight">
                          {client._count?.invoices || 0}{" "}
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">
                            Docs
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 mb-2">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest italic">
                        {t("paid")}
                      </span>
                      <span className="text-xs font-black text-emerald-600">
                        {client.paidInvoicesCount || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-orange-500/5 border border-orange-500/10">
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                        {t("pendingOverdue")}
                      </span>
                      <span className="text-xs font-black text-orange-600">
                        {client.unpaidInvoicesCount || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">{t("noClientFound")}</p>
              <Button
                variant="link"
                onClick={() => setIsDialogOpen(true)}
                className="mt-2 text-primary gap-1"
              >
                <Plus className="w-4 h-4" /> {t("addFirstClient")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
