import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClientProviders } from "./client-providers";

// Fallback variables for system fonts
const jakarta = { variable: "font-jakarta" };
const jetbrains = { variable: "font-jetbrains" };

export const metadata: Metadata = {
  title: "Essor | Invoice Management",
  description: "Next-generation invoice management system",
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
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
