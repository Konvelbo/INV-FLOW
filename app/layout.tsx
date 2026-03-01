import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { InvoiceProvider } from "@/src/context/InvoiceContext";
import { LanguageProvider } from "@/src/context/LanguageContext";
import { Toaster } from "react-hot-toast";
import CanvasProvider from "@/src/context/canvasContext";
import { NotificationProvider } from "@/src/context/NotificationContext";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INV-FLOW | Invoice Management",
  description: "Modern invoice management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en" className="h-screen font-sans">
      <body
        className={cn(
          jakarta.variable,
          jetbrains.variable,
          "antialiased font-sans transition-colors duration-300",
          "w-full h-full bg-background text-foreground",
        )}
      >
        <Toaster />
        <LanguageProvider>
          <NotificationProvider>
            <CanvasProvider>
              <InvoiceProvider>{children}</InvoiceProvider>
            </CanvasProvider>
          </NotificationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
