"use client";

import {
  LayoutDashboard,
  FileText,
  History,
  ClipboardList,
  Users,
  Package,
  Wallet,
  Brain,
  Lock,
  LogOut,
  Sun,
  Moon,
  Camera,
  Settings,
  User,
  Building2,
  Languages,
  Crown,
  ChevronRight as ChevronRightIcon,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { useInvoiceActions, useInvoice } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { usePricingRedirect } from "@/hooks/usePricingRedirect";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { toast } from "react-hot-toast";
import { useIPCAction } from "@/hooks/useIPCAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/src/components/ui/dropdown-menu";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    id: "Dashboard",
    color: "text-blue-500",
  },
  {
    title: "Invoice",
    url: "/invoice",
    icon: FileText,
    id: "Invoice",
    color: "text-emerald-500",
  },
  {
    title: "History",
    url: "/history",
    icon: History,
    id: "History",
    color: "text-amber-500",
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
    id: "Clients",
    color: "text-orange-500",
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
    id: "Products",
    color: "text-indigo-500",
  },
  {
    title: "Expenses",
    url: "/expenses",
    icon: Wallet,
    id: "Expenses",
    color: "text-red-500",
  },
  {
    title: "Planning",
    url: "/planning",
    icon: ClipboardList,
    id: "Planning",
    color: "text-rose-500",
  },
  {
    title: "Assistant IA",
    url: "/ai-advisor",
    icon: Brain,
    id: "Assistant IA",
    color: "text-violet-500",
  },
];

export const AppSidebar = React.memo(function AppSidebar() {
  const { clearInvoiceData } = useInvoiceActions();
  const { dict, t, language, setLanguage } = useLanguage();
  const { redirectToPricing } = usePricingRedirect();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { subscription } = useSubscription();
  const { currency, setCurrency } = useInvoice();
  const { performAction } = useIPCAction();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [appVersion, setAppVersion] = useState("v1.0.4");
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);

  useEffect(() => {
    if (window.electronAPI?.getVersion) {
      window.electronAPI.getVersion().then((v: string) => setAppVersion(`v${v}`));
    }
  }, []);

  useEffect(() => {
    const load = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try { setUser(JSON.parse(userStr)); } catch { }
      }
    };
    load();
    window.addEventListener("session-update", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("session-update", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
    window.location.reload();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const userStr = localStorage.getItem("user");
        const userData = userStr ? JSON.parse(userStr) : null;
        const res = await performAction("auth", "avatar", { image: base64String });
        if (res.success) {
          const updated = { ...userData, avatar: res.data.avatar };
          setUser(updated);
          localStorage.setItem("user", JSON.stringify(updated));
          window.dispatchEvent(new Event("storage"));
          toast.success(t("avatarUpdated"));
        } else {
          toast.error(res.error || t("avatarUploadFailed"));
        }
      } catch {
        toast.error(t("avatarUploadFailed"));
      }
    };
    reader.readAsDataURL(file);
  };

  const currencies = [
    { code: "XOF", label: "Franc CFA (XOF)" },
    { code: "EUR", label: "Euro (EUR)" },
    { code: "USD", label: "Dollar (USD)" },
    { code: "GBP", label: "Livre (GBP)" },
  ];

  const localizedMenuItems = menuItems.map((item) => ({
    ...item,
    title: (dict as any)[item.id.toLowerCase().replace(" ", "")] || item.title,
  }));

  const isDark = theme === "dark";
  const isPro = subscription?.plan && subscription.plan !== "free";

  const sidebarWidth = isCollapsed ? "w-[68px]" : "w-[240px]";

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      <motion.aside
        animate={{ width: isCollapsed ? 68 : 240 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border sticky top-0 overflow-hidden shrink-0 z-40"
      >
        {/* ─── Header: Avatar / User info ─── */}
        <div className="px-3 pt-5 pb-4 border-b border-sidebar-border/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "flex items-center gap-3 w-full rounded-xl p-2 cursor-pointer",
                  "hover:bg-muted/40 transition-colors duration-200 text-left"
                )}
              >
                <div className="relative shrink-0 group">
                  <Avatar className="h-10 w-10 rounded-xl border border-border/50">
                    <AvatarImage src={user?.avatar || undefined} alt={user?.name} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold rounded-xl">
                      {user?.name?.substring(0, 2).toUpperCase() || <User size={16} />}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="absolute -bottom-1 -right-1 p-1 rounded-md bg-primary text-primary-foreground shadow-sm transition-opacity"
                  >
                    <Camera size={9} />
                  </button>
                </div>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col min-w-0 flex-1 overflow-hidden"
                    >
                      <span className="text-sm font-bold text-foreground truncate leading-tight">
                        {user?.name || dict.guest}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {user?.email || dict.loginToSeeDetails}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="right"
              align="start"
              sideOffset={8}
              className="w-72 p-2 rounded-2xl bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl"
            >
              <DropdownMenuLabel className="p-3 flex flex-col items-center text-center space-y-2">
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground text-base truncate max-w-[240px]">
                    {user?.name || dict.guest}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-[240px]">
                    {user?.email || dict.loginToSeeDetails}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-border/50" />

              <DropdownMenuGroup className="space-y-1">
                <DropdownMenuItem
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <Camera size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">{language === "fr" ? "Changer ma photo de profil" : "Change profile picture"}</span>
                </DropdownMenuItem>

                {isPro && (
                  <DropdownMenuItem
                    onClick={() => router.push("/pricing")}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    <Crown size={16} className="text-yellow-500" />
                    <span className="text-sm font-medium">{dict.manageSubscription || "Gérer l'abonnement"}</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => router.push("/clients")}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <User size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">{dict.clients || "Clients"}</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push("/companies")}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <Building2 size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">{dict.companies || "Entreprises"}</span>
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer w-full">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="font-mono font-bold text-sm tracking-widest text-muted-foreground">{currency}</span>
                      <span className="text-sm font-medium text-foreground">{dict.currency}</span>
                    </div>
                    <ChevronRightIcon size={14} className="text-muted-foreground" />
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="p-2 rounded-xl bg-card/95 backdrop-blur-xl border-border/50 shadow-xl min-w-[180px]">
                      <DropdownMenuRadioGroup value={currency} onValueChange={(val) => { setCurrency(val); toast.success(`${t("currencyChanged")} ${val}`); }}>
                        {currencies.map((curr) => (
                          <DropdownMenuRadioItem key={curr.code} value={curr.code} className="flex items-center justify-between gap-4 p-3 rounded-lg cursor-pointer hover:bg-primary/10">
                            <span className="text-sm font-medium">{curr.label}</span>
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer w-full">
                    <div className="flex items-center gap-3 flex-1">
                      <Languages size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{dict.language}</span>
                    </div>
                    <ChevronRightIcon size={14} className="text-muted-foreground" />
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="p-2 rounded-xl bg-card/95 backdrop-blur-xl border-border/50 shadow-xl min-w-[180px]">
                      <DropdownMenuRadioGroup value={language} onValueChange={(val) => { setLanguage(val as any); toast.success(`${t("languageChanged")} ${t(val === "fr" ? "french" : "english")}`); }}>
                        <DropdownMenuRadioItem value="fr" className="flex items-center justify-between gap-4 p-3 rounded-lg cursor-pointer hover:bg-primary/10">
                          <span className="text-sm font-medium">{t("french")}</span>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="en" className="flex items-center justify-between gap-4 p-3 rounded-lg cursor-pointer hover:bg-primary/10">
                          <span className="text-sm font-medium">{t("english")}</span>
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ─── Nav Menu ─── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1 custom-scrollbar">
          {localizedMenuItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                <Link
                  href={item.url}
                  prefetch={false}
                  onClick={(e) => {
                    if (item.id === "Assistant IA" && !subscription?.hasAIAccess) {
                      e.preventDefault();
                      redirectToPricing({ message: dict?.aiAccessDenied || "L'Assistant IA est réservé aux abonnés Premium." });
                      return;
                    }
                    if (item.id === "Invoice") clearInvoiceData();
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                    isActive ? "bg-primary/10" : "hover:bg-muted/40",
                    isCollapsed ? "justify-center" : ""
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <motion.div 
                    whileHover={{ x: 4, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className={cn("relative shrink-0", isActive ? item.color : "text-muted-foreground")}
                  >
                    <item.icon className="size-[18px]" />
                    {isActive && (
                      <motion.div layoutId="active-glow" className="absolute -inset-2 bg-current opacity-20 blur-lg rounded-full" />
                    )}
                  </motion.div>

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.18 }}
                        className={cn(
                          "flex-1 text-sm font-semibold tracking-tight truncate",
                          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {!isCollapsed && item.id === "Assistant IA" && !subscription?.hasAIAccess && (
                    <Lock className="size-3 text-muted-foreground/50 shrink-0 ml-auto" />
                  )}

                  {!isCollapsed && isActive && (
                    <motion.div layoutId="active-pill" className="absolute right-0 w-1 h-full bg-primary rounded-full" />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* ─── Bottom: quota + theme + logout ─── */}
        <div className="px-3 pb-5 pt-3 border-t border-sidebar-border/50 space-y-3">
          {/* Daily invoice counter — free plan only */}
          <AnimatePresence>
            {!subscription?.hasUnlimitedInvoices && subscription && !isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="px-3 py-2 rounded-xl bg-muted/40 border border-border/30"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-muted-foreground font-bold">
                    {dict.invoicesToday || "Factures aujourd'hui"}
                  </span>
                  <span className="text-[10px] font-black text-foreground">
                    {subscription.dailyInvoiceCount}/{subscription.dailyInvoiceLimit}
                  </span>
                </div>
                <div className="h-1 rounded-full bg-border overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      subscription.dailyInvoiceCount / (subscription.dailyInvoiceLimit || 6) >= 1
                        ? "bg-destructive"
                        : subscription.dailyInvoiceCount / (subscription.dailyInvoiceLimit || 6) >= 0.7
                          ? "bg-yellow-500"
                          : "bg-primary"
                    )}
                    style={{ width: `${Math.min(100, (subscription.dailyInvoiceCount / (subscription.dailyInvoiceLimit || 6)) * 100)}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Theme toggle */}
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between gap-3 px-1")}>
            {!isCollapsed && (
              <motion.div 
                whileHover={{ x: 4, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                {isDark ? <Moon className="size-3.5 text-muted-foreground" /> : <Sun className="size-3.5 text-muted-foreground" />}
                <span className="text-xs font-semibold text-muted-foreground">
                  {isDark ? (t("darkMode") || "Mode sombre") : (t("lightMode") || "Mode clair")}
                </span>
              </motion.div>
            )}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={cn(
                "relative flex items-center shrink-0 rounded-full transition-colors duration-300 cursor-pointer",
                isCollapsed ? "w-10 h-6" : "w-11 h-6",
                isDark ? "bg-primary" : "bg-muted border border-border"
              )}
              title={isDark ? (t("lightMode") || "Mode clair") : (t("darkMode") || "Mode sombre")}
            >
              <motion.div
                animate={{ x: isDark ? (isCollapsed ? 18 : 20) : 2, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute size-4 rounded-full bg-white shadow-sm flex items-center justify-center"
              >
                {isDark
                  ? <Moon className="size-2.5 text-primary" />
                  : <Sun className="size-2.5 text-amber-500" />
                }
              </motion.div>
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full rounded-xl px-3 py-2.5 transition-all duration-200 cursor-pointer group",
              "hover:bg-destructive/10",
              isCollapsed ? "justify-center" : ""
            )}
            title={isCollapsed ? (dict.logout || "Logout") : undefined}
          >
            <motion.div 
              whileHover={{ x: 4, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <LogOut className="size-4 text-destructive/70 group-hover:text-destructive transition-colors shrink-0" />
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.18 }}
                  className="text-sm font-bold text-destructive/70 group-hover:text-destructive transition-colors"
                >
                  {dict.logout || "Déconnexion"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Version + collapse button */}
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between px-1")}>
            {!isCollapsed && (
              <div className="flex items-center gap-2 opacity-20">
                <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[8px] font-mono tracking-widest uppercase">{appVersion}-obsidian</span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed((v) => !v)}
              className="size-7 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              title={isCollapsed ? "Déployer" : "Réduire"}
            >
              <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronLeft className="size-4" />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
});
