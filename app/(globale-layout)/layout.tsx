import { AppSidebar } from "@/src/components/app-sidebare";
import Navbare from "@/src/components/Navbare";
import { SidebarProvider } from "@/src/components/ui/sidebar";

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbare />
      <div className="flex-1 flex overflow-hidden">
        <SidebarProvider>
          <AppSidebar />
          <main id="scroll_main" className="flex-1 overflow-y-auto">
            {children}
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
}
