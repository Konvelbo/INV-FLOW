import { AppSidebar } from "@/src/components/app-sidebare";
import Navbare from "@/src/components/Navbare";
import { SidebarProvider } from "@/src/components/ui/sidebar";

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full h-full overflow-y-hidden">
      <Navbare />
      <SidebarProvider>
        <AppSidebar />
        <main id="scroll_main" className="w-full h-screen overflow-y-scroll">
          {children}
        </main>
      </SidebarProvider>
    </main>
  );
}
