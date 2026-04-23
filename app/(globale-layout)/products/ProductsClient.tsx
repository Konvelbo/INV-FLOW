"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Download,
  Zap,
  Layers,
  ShoppingBag,
  LineChart,
  Search,
  Plus,
  Package,
  Edit,
  Trash2,
  DollarSign,
  Percent,
  MoreHorizontal,
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
import { Product } from "@/src/p_client";
import { formatPrice } from "@/lib/currency";
import { DataTable, DataTableColumn } from "@/src/components/ui/data-table";

interface ProductsClientProps {
  initialProducts: Product[];
  isComponent?: boolean;
  userId?: string;
}

export default function ProductsClient({
  initialProducts,
  isComponent,
  userId,
}: ProductsClientProps) {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const { currency } = useInvoice();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { performAction } = useIPCAction();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    taxRate: "0",
    type: "service" as "service" | "product",
  });

  const fetchProducts = useCallback(async () => {
    try {
      const result = await (window as any).electronAPI.getData("products", userId);
      if (result.success) setProducts(result.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "update" : "create";
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      taxRate: parseFloat(formData.taxRate),
    };
    const params = editingId ? [editingId, payload] : [payload];
    const res = await performAction("products", method, ...params);
    if (res.success) {
      toast.success(editingId ? t("itemUpdated") : t("itemAdded"));
      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t("itemDeleteWarning").replace("{name}", name))) return;
    const res = await performAction("products", "delete", id);
    if (res.success) {
      toast.success(t("itemDeleted"));
      fetchProducts();
    }
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      taxRate: product.taxRate.toString(),
      type: (product.type as "service" | "product") || "service",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", price: "", taxRate: "0", type: "service" });
  };

  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async (format = "excel") => {
    setIsExporting(true);
    toast.loading(t("processing"), { id: "product-export" });
    try {
      const userStr = localStorage.getItem("user");
      const userId = userStr ? JSON.parse(userStr).id : null;
      const activeCompanyId = userStr ? JSON.parse(userStr).activeCompanyId : undefined;
      const res = await (window as any).electronAPI.getData("export", userId, "products", activeCompanyId, format);
      if (res.success && res.data) {
        const mime = format === "excel"
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : "application/zip";
        const ext = format === "excel" ? "xlsx" : "zip";
        const blob = new Blob([res.data], { type: mime });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Products_Export_${new Date().toISOString().split("T")[0]}.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(t("exportSuccess") || "Export réussi !", { id: "product-export" });
      }
    } catch (error) {
      toast.error(t("authError"), { id: "product-export" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (!confirm(t("itemDeleteWarning").replace("{name}", `${ids.length} articles`))) return;
    const res = await performAction("products", "bulkDelete", ids);
    if (res.success) {
      toast.success(t("itemDeleted"));
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())),
  );

  const columns: DataTableColumn<Product>[] = [
    {
      key: "name",
      header: t("itemNameLabel"),
      render: (row) => (
        <span className="font-semibold text-foreground">{row.name}</span>
      ),
    },
    {
      key: "type",
      header: t("type"),
      render: (row) => (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
            row.type === "service"
              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              : "bg-purple-500/10 text-purple-400 border border-purple-500/20",
          )}
        >
          {row.type === "service" ? <Zap className="w-3 h-3" /> : <Package className="w-3 h-3" />}
          {row.type === "service" ? t("service") : t("catalog")}
        </span>
      ),
    },
    {
      key: "description",
      header: t("optionalDescription"),
      render: (row) => (
        <span className="text-muted-foreground text-xs line-clamp-1 max-w-[200px]">
          {row.description || "—"}
        </span>
      ),
    },
    {
      key: "price",
      header: t("unitPriceHt"),
      render: (row) => (
        <span className="font-bold font-mono text-foreground">
          {formatPrice(row.price, currency, "fr-FR")}
        </span>
      ),
    },
    {
      key: "taxRate",
      header: t("taxRateLabel"),
      render: (row) => (
        <span className="font-medium text-muted-foreground">{row.taxRate}%</span>
      ),
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full animate-pulse delay-700" />
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
                <div className="h-2 w-12 bg-linear-to-r from-indigo-500 to-blue-500 rounded-full" />
                <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em]">
                  {t("catalog")}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-linear-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent font-sans">
                {t("productsServices")}
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl font-medium leading-relaxed opacity-80">
                {t("catalogDesc")}
              </p>
            </div>
          )}
          {isComponent && <div />}

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-12 px-6 gap-2 font-bold border-border/50 bg-card/50 backdrop-blur-xl hover:bg-indigo-500/10 hover:text-indigo-400 transition-all rounded-xl"
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
                <Button className="h-12 px-8 font-black gap-2 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 text-white transition-all transform hover:-translate-y-1">
                  <Plus className="w-5 h-5" />
                  {t("newItem")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-card border border-border/50 text-foreground backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle>{editingId ? t("editItem") : t("newItem")}</DialogTitle>
                  <DialogDescription>{t("catalogAddDesc")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">{t("type")}</Label>
                      <select
                        id="type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value as "service" | "product" })
                        }
                      >
                        <option value="service">{t("servicePrestation")}</option>
                        <option value="product">{t("productMaterial")}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("itemNameLabel")} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">{t("optionalDescription")}</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">{t("unitPriceHt")} *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                            className="bg-background pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxRate">{t("taxRateLabel")}</Label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="taxRate"
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={formData.taxRate}
                            onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                            className="bg-background pl-9"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full font-bold">
                      {editingId ? t("saveChanges") : t("addToCatalog")}
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
              { label: "Total Articles", value: products.length, icon: ShoppingBag, color: "text-indigo-500", bg: "bg-indigo-500/10" },
              { label: t("services"), value: products.filter((p) => p.type === "service" || !p.type).length, icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: t("products"), value: products.filter((p) => p.type === "product").length, icon: Layers, color: "text-purple-500", bg: "bg-purple-500/10" },
              { label: t("totalValue"), value: formatPrice(products.reduce((acc, p) => acc + p.price, 0), currency, "fr-FR"), icon: LineChart, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-3xl bg-card/40 shadow-2xl border border-border/50 backdrop-blur-xl flex flex-col gap-3 group hover:border-primary/30 transition-all duration-300">
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

        <div className="flex items-center gap-4 animate-fade-in-up delay-200">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("searchCatalog")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border/50"
            />
          </div>
        </div>

        <div className="animate-fade-in-up delay-200">
          <DataTable
            data={filteredProducts}
            columns={columns}
            rowKey={(row) => row.id}
            emptyMessage={t("noCatalogItem")}
            emptyIcon={<Package className="w-12 h-12 opacity-20" />}
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
                  <DropdownMenuItem onClick={() => handleDelete(row.id, row.name)} className="gap-2 cursor-pointer font-medium text-destructive focus:text-destructive">
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
