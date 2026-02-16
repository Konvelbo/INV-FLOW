import { AppSidebar } from "@/src/components/app-sidebare";
import Navbare from "@/src/components/Navbare";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import CanvasProvider from "@/src/context/canvasContext";
import { InvoiceProvider } from "@/src/context/InvoiceContext";
import { Toaster } from "react-hot-toast";

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full h-full overflow-y-hidden">
      <Toaster />
      <Navbare />

      <CanvasProvider>
        <InvoiceProvider>
          <SidebarProvider>
            <AppSidebar />
            <main
              id="scroll_main"
              className="w-full h-screen overflow-y-scroll"
            >
              {children}
            </main>
          </SidebarProvider>
        </InvoiceProvider>
      </CanvasProvider>
    </main>
  );
}
