"use client";

import React, { useState, useEffect } from "react";
import Logo from "./navbar-components/logo";
import NotificationMenu from "./navbar-components/notification-menu";
import UserMenu from "./navbar-components/user-menu";
import { SidebarTrigger } from "./ui/sidebar";
import { Building2, Users } from "lucide-react";
import Link from "next/link";

export default function Topbar() {
  const [activeCompany, setActiveCompany] = useState<string | null>(null);

  const updateActiveCompany = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setActiveCompany(user.activeCompanyName || null);
    }
  };

  useEffect(() => {
    const init = async () => {
      // 1. First check localStorage for immediate display
      updateActiveCompany();

      // 2. Fetch from backend to ensure synchronization
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          // @ts-ignore
          const res = await window.electronAPI.getData(
            "getActiveCompany",
            user.id,
          );
          if (res.success && res.data) {
            user.activeCompanyId = res.data.id;
            user.activeCompanyName = res.data.name;
            localStorage.setItem("user", JSON.stringify(user));
            setActiveCompany(res.data.name);
          } else if (res.success && !res.data) {
            // No active company in DB
            user.activeCompanyId = null;
            user.activeCompanyName = null;
            localStorage.setItem("user", JSON.stringify(user));
            setActiveCompany(null);
          }
        }
      } catch (err) {
        console.error("Failed to sync active company:", err);
      }
    };

    init();
    window.addEventListener("session-update", updateActiveCompany);
    return () =>
      window.removeEventListener("session-update", updateActiveCompany);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center px-4">
        {/* Left section: Logo and Sidebar Trigger */}
        <div className="flex items-center gap-4">
          <Logo w={32} h={32} logoUrl="/black-caractere-non-black.png" />
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
        </div>

        {/* Middle spacer */}
        <div className="flex-1" />

        <div className="flex items-center gap-4">
          {activeCompany && (
            <Link href="/companies">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary truncate max-w-[150px]">
                  {activeCompany}
                </span>
              </div>
            </Link>
          )}
          <div className="flex items-center gap-2">
            <NotificationMenu />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
