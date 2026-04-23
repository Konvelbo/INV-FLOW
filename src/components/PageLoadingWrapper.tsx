"use client";

import { cn } from "@/lib/utils";

interface PageLoadingWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxW?: string;
  primaryColor?: string; // Tailwind class like "bg-primary/10"
  secondaryColor?: string;
}

export function PageLoadingWrapper({
  children,
  className,
  maxW = "max-w-8xl",
  primaryColor = "bg-primary/10",
  secondaryColor = "bg-secondary/10",
}: PageLoadingWrapperProps) {
  return (
    <div
      className={cn(
        "min-h-full min-w-full bg-background text-foreground p-6 md:p-10 lg:p-12 pt-28 md:pt-28 lg:pt-28 relative overflow-hidden",
        className
      )}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn("absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] animate-pulse", primaryColor)} />
        <div className={cn("absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px]", secondaryColor)} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[80px]" />
      </div>

      <div className={cn("mx-auto space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700", maxW)}>
        {children}
      </div>
    </div>
  );
}
