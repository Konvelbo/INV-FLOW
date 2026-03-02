import { AppSidebar } from "@/src/components/app-sidebare";
import { FloatingNavDemo } from "@/src/components/floatingNav";
import Navbare from "@/src/components/Navbare";
import { SidebarProvider } from "@/src/components/ui/sidebar";

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-w-full min-h-screen overflow-x-hidden">
      <FloatingNavDemo />
      <div className="flex overflow-x-hidden w-full">{children}</div>
    </div>
  );
}
