"use client";

import {
  LogOutIcon,
  ChevronRight,
  User,
  Camera,
  LayoutDashboard,
  Settings,
  Languages,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
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
import { useEffect, useState, useRef } from "react";
import { useInvoice } from "@/src/context/InvoiceContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/src/context/LanguageContext";

import { toast } from "react-hot-toast";
import axios from "axios";

export default function UserMenu() {
  const router = useRouter();
  const { currency, setCurrency } = useInvoice();
  const { language, setLanguage, dict } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
    window.location.reload(); // Force refresh to update landing page state
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        try {
          const userStr = localStorage.getItem("user");
          const userData = userStr ? JSON.parse(userStr) : null;
          const token = userData?.token;

          if (!token) {
            toast.error("Vous devez être connecté pour changer d'avatar");
            return;
          }

          const response = await axios.post(
            "/api/user/avatar",
            { image: base64String },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          if (response.status === 200) {
            const avatarUrl = response.data.avatar;
            const updatedUser = user
              ? { ...user, avatar: avatarUrl }
              : { name: "User", email: "", avatar: avatarUrl };

            setUser(updatedUser);
            // Crucial: keep the token when saving back to localStorage
            localStorage.setItem(
              "user",
              JSON.stringify({ ...userData, avatar: avatarUrl }),
            );
            toast.success("Avatar mis à jour !");
          }
        } catch (error) {
          console.error("Failed to upload avatar", error);
          toast.error("Échec de l'upload de l'avatar");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currencies = [
    { code: "XOF", label: "Franc CFA (XOF)" },
    { code: "EUR", label: "Euro (EUR)" },
    { code: "USD", label: "Dollar (USD)" },
    { code: "GBP", label: "Livre (GBP)" },
  ];

  return (
    <div className="flex items-center">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="relative h-10 w-10 rounded-xl p-0 border border-white/5 hover:border-primary/20 transition-all bg-card overflow-hidden"
            variant="ghost"
          >
            <Avatar className="h-full w-full rounded-xl">
              <AvatarImage
                alt={user?.name}
                src={user?.avatar}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user?.name?.substring(0, 2).toUpperCase() || (
                  <User size={18} />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Settings size={14} className="text-white" />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-72 p-2 rounded-2xl bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        >
          <DropdownMenuLabel className="p-4 flex flex-col items-center text-center space-y-3">
            <div className="relative group">
              <Avatar className="h-16 w-16 rounded-2xl border-2 border-primary/20 transition-transform group-hover:scale-105">
                <AvatarImage
                  alt={user?.name}
                  src={user?.avatar}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/5 text-primary text-xl font-black">
                  {user?.name?.substring(0, 2).toUpperCase() || (
                    <User size={24} />
                  )}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
              >
                <Camera size={12} />
              </button>
            </div>
            <div className="space-y-1">
              <p className="font-sans font-bold text-foreground text-base tracking-tight truncate max-w-[240px]">
                {user?.name || dict.guest}
              </p>
              <p className="font-sans text-xs text-muted-foreground truncate max-w-[240px]">
                {user?.email || dict.loginToSeeDetails}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-border/50" />

          <DropdownMenuGroup className="space-y-1">
            <DropdownMenuItem
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group cursor-pointer"
            >
              <LayoutDashboard
                size={18}
                className="text-muted-foreground group-hover:text-primary transition-colors"
              />
              <span className="font-sans font-medium text-sm">
                Tableau de Bord
              </span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group cursor-pointer w-full">
                <div className="flex items-center gap-3 flex-1 text-muted-foreground group-hover:text-primary transition-colors">
                  <span className="font-mono font-bold text-sm tracking-widest">
                    {currency}
                  </span>
                  <span className="font-sans font-medium text-sm text-foreground">
                    {dict.currency}
                  </span>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="p-2 rounded-xl bg-card/95 backdrop-blur-xl border-border/50 shadow-xl min-w-[180px]">
                  <DropdownMenuRadioGroup
                    value={currency}
                    onValueChange={(val) => {
                      setCurrency(val);
                      toast.success(`${dict.currencyChanged} ${val}`);
                    }}
                  >
                    {currencies.map((curr) => (
                      <DropdownMenuRadioItem
                        key={curr.code}
                        value={curr.code}
                        className="flex items-center justify-between gap-4 p-3 rounded-lg cursor-pointer hover:bg-primary/10"
                      >
                        <span className="font-sans text-sm font-medium">
                          {curr.label}
                        </span>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group cursor-pointer w-full">
                <div className="flex items-center gap-3 flex-1 text-muted-foreground group-hover:text-primary transition-colors">
                  <Languages size={18} />
                  <span className="font-sans font-medium text-sm text-foreground">
                    {dict.language}
                  </span>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="p-2 rounded-xl bg-card/95 backdrop-blur-xl border-border/50 shadow-xl min-w-[180px]">
                  <DropdownMenuRadioGroup
                    value={language}
                    onValueChange={(val) => {
                      setLanguage(val as any);
                      toast.success(
                        `${dict.languageChanged} ${val === "fr" ? "Français" : "English"}`,
                      );
                    }}
                  >
                    <DropdownMenuRadioItem
                      value="fr"
                      className="flex items-center justify-between gap-4 p-3 rounded-lg cursor-pointer hover:bg-primary/10"
                    >
                      <span className="font-sans text-sm font-medium">
                        Français
                      </span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="en"
                      className="flex items-center justify-between gap-4 p-3 rounded-lg cursor-pointer hover:bg-primary/10"
                    >
                      <span className="font-sans text-sm font-medium">
                        English
                      </span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-border/50" />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors group cursor-pointer"
          >
            <LogOutIcon
              size={18}
              className="opacity-70 group-hover:opacity-100"
            />
            <span className="font-sans font-bold text-sm">{dict.logout}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
