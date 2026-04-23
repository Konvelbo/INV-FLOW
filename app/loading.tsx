import { Skeleton } from "@/src/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-10 animate-in fade-in zoom-in-95 duration-1000">
        {/* Logo Skeleton */}
        <div className="w-24 h-24 rounded-[2.5rem] bg-card border border-border/50 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-primary/10">
           <Skeleton className="w-14 h-14 rounded-2xl bg-primary/20" />
        </div>

        {/* Text Skeleton */}
        <div className="space-y-4 flex flex-col items-center">
          <Skeleton className="h-12 w-64 rounded-2xl bg-muted/30" />
          <Skeleton className="h-4 w-40 rounded-full bg-muted/20" />
        </div>

        {/* Loading Bar Skeleton */}
        <div className="w-72 h-2.5 rounded-full bg-muted/10 overflow-hidden backdrop-blur-sm border border-white/5 relative">
          <Skeleton className="absolute inset-0 bg-primary/30 w-full h-full" />
        </div>
      </div>
    </div>
  );
}
