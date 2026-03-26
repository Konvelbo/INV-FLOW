import { Skeleton } from "@/src/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-8">
      {/* Background Pulse */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8 animate-fade-in-up">
        {/* Logo Skeleton */}
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg shadow-primary/10 animate-pulse">
           <Skeleton className="w-12 h-12 rounded-xl bg-primary/20" />
        </div>

        {/* Text Skeleton */}
        <div className="space-y-4 flex flex-col items-center">
          <Skeleton className="h-8 w-48 rounded-lg bg-muted/30" />
          <Skeleton className="h-4 w-32 rounded-full bg-muted/20" />
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-1.5 rounded-full bg-muted/20 overflow-hidden">
          <div className="h-full bg-primary/50 rounded-full animate-bounce w-1/3" />
        </div>
      </div>
    </div>
  );
}
