"use client";

import { FileText, History, LayoutDashboard, Target } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import { useInvoice } from "@/src/context/InvoiceContext";

// Menu items.
const items = [
  {
    title: "Dashbard",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "Invoice",
    url: "/invoice",
    icon: FileText,
  },
  {
    title: "History",
    url: "#",
    icon: History,
  },
  {
    title: "Product Insight",
    url: "#",
    icon: Target,
  },
];

export function AppSidebar() {
  const {
    city,
    setCity,
    clientName,
    setClientName,
    object,
    setObject,
    designation,
    setDesignation,
    unit,
    setUnit,
    quantity,
    setQuantity,
    unitPrice,
    setUnitPrice,
    totalPrice,
    setTotalPrice,
    totalMaterial,
    setTotalMaterial,
    totalHT,
    setTotalHT,
    managerName,
    setManagerName,
    amountWords,
    setAmoutWorlds,
    itemsArr,
    setItemsArr,
  } = useInvoice();
  return (
    <Sidebar>
      <SidebarContent>
        <Link href="#" />
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      onClick={() => {
                        if (item.title === "Invoice") {
                        }
                      }}
                      href={item.url}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
