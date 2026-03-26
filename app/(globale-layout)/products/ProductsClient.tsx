"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/src/context/LanguageContext";
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
import { useIPCAction } from "@/hooks/useIPCAction";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { performAction, loading: actionLoading } = useIPCAction();

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
      if (result.success) {
        setProducts(result.data);
      }
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
      type: product.type || "service",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      taxRate: "0",
      type: "service",
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const userStr = localStorage.getItem("user");
      const userId = userStr ? JSON.parse(userStr).id : null;
      // @ts-ignore
      const res = await window.electronAPI.getData("export", userId, "products");
      if (res.success) {
        const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "products_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(t("exportSuccess"));
      } else {
        throw new Error(res.error);
      }
    } catch (error) {
      console.error("Export error", error);
      toast.error(t("authError"));
    } finally {
      setIsExporting(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(search.toLowerCase())),
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
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-linear-to-br from-white via-white to-slate-500 bg-clip-text text-transparent font-sans">
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
                <Button className="h-12 px-8 font-black gap-2 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 text-white transition-all transform hover:-translate-y-1">
                  <Plus className="w-5 h-5" />
                  {t("newItem")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-card border border-border/50 text-foreground backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? t("editItem") : t("newItem")}
                  </DialogTitle>
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
                          setFormData({
                            ...formData,
                            type: e.target.value as "service" | "product",
                          })
                        }
                      >
                        <option value="service">
                          {t("servicePrestation")}
                        </option>
                        <option value="product">{t("productMaterial")}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("itemNameLabel")} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        {t("optionalDescription")}
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
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: e.target.value,
                              })
                            }
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
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                taxRate: e.target.value,
                              })
                            }
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
              {
                label: "Total Articles",
                value: products.length,
                icon: ShoppingBag,
                color: "text-indigo-500",
                bg: "bg-indigo-500/10",
              },
              {
                label: t("services"),
                value: products.filter((p) => p.type === "service" || !p.type).length,
                icon: Zap,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                label: t("products"),
                value: products.filter((p) => p.type === "product").length,
                icon: Layers,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
              {
                label: t("totalValue"),
                value: `${products.reduce((acc, p) => acc + p.price, 0).toLocaleString()} CFA`,
                icon: LineChart,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
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
              placeholder={t("searchCatalog")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up delay-200">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group bg-card border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full"
              >
                <CardHeader className="p-6 pb-4 border-b border-border/10 bg-muted/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                      <div className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
                        product.type === "service"
                          ? "bg-blue-500/5 text-blue-500 border border-blue-500/10"
                          : "bg-purple-500/5 text-purple-500 border border-purple-500/10"
                      )}>
                        {product.type === "service" ? (
                          <Zap className="w-3 h-3" />
                        ) : (
                          <Package className="w-3 h-3" />
                        )}
                        {product.type === "service" ? t("service") : t("catalog")}
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => openEdit(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors duration-300">
                    {product.name}
                  </CardTitle>
                  {product.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-2 font-medium">
                      {product.description}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="p-6 pt-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-border/10">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Percent className="w-3.5 h-3.5" />
                        <span className="font-bold uppercase tracking-widest text-[10px]">
                          {t("tax")}
                        </span>
                      </div>
                      <span className="font-bold text-foreground">
                        {product.taxRate}%
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                      {t("unitPriceHt")}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-foreground tracking-tighter">
                        {product.price.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-primary uppercase">
                        CFA
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">{t("noCatalogItem")}</p>
              <Button
                variant="link"
                onClick={() => setIsDialogOpen(true)}
                className="mt-2 text-primary gap-1"
              >
                <Plus className="w-4 h-4" /> {t("addFirstItem")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
