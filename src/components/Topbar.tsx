"use client";

import React from "react";
import Logo from "./navbar-components/logo";
import NotificationMenu from "./navbar-components/notification-menu";
import UserMenu from "./navbar-components/user-menu";
import ThemeToggle from "./comp-183";
import { SidebarTrigger } from "./ui/sidebar";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center px-4">
        {/* Left section: Logo and Sidebar Trigger */}
        <div className="flex items-center gap-4">
          <Logo w={32} h={32} logoUrl="/black-caractere-non-black.png" />
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
        </div>

        {/* Middle spacer */}
        <div className="flex-1" />

        {/* Right section: Menus */}
        <div className="flex items-center gap-2">
          <NotificationMenu />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
