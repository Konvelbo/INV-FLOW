import { Skeleton } from "@/src/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-background/50 p-6 md:p-10 lg:p-12 pt-28 space-y-16 animate-in fade-in duration-500 overflow-hidden">
      {/* Header Skeleton */}
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Skeleton className="h-4 w-4 rounded-full bg-primary/40 animate-pulse" />
            <Skeleton className="h-3 w-32 bg-primary/20 rounded-full" />
          </div>
          <Skeleton className="h-16 w-full max-w-2xl bg-foreground/5 rounded-3xl" />
          <Skeleton className="h-4 w-full max-w-lg bg-muted/40 rounded-full" />
        </div>
      </div>

      {/* Pricing Toggle Skeleton */}
      <div className="flex justify-center">
        <div className="p-1 rounded-2xl border border-border/40 bg-card/60 flex gap-1">
          <Skeleton className="h-10 w-28 rounded-xl bg-primary/20" />
          <Skeleton className="h-10 w-28 rounded-xl bg-transparent" />
        </div>
      </div>

      {/* Pricing Cards Skeleton */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="group relative p-8 md:p-10 rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl flex flex-col space-y-8 overflow-hidden h-full"
          >
             {/* Card Top */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-32 rounded-2xl bg-muted/30" />
                <Skeleton className="h-10 w-10 rounded-xl bg-muted/20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-12 w-48 bg-foreground/5 rounded-2xl" />
                <Skeleton className="h-4 w-64 bg-muted/20 rounded-full" />
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-5 flex-1 py-8 border-y border-border/20">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full bg-emerald-500/10" />
                  <Skeleton className="h-4 flex-1 bg-muted/10 rounded-lg" />
                </div>
              ))}
            </div>

            {/* Action button */}
            <Skeleton className="h-16 w-full rounded-2xl bg-primary/10" />
          </div>
        ))}
      </div>

      {/* Footer Features Skeleton */}
      <div className="max-w-6xl mx-auto pt-10 border-t border-border/20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3 flex flex-col items-center">
            <Skeleton className="h-10 w-10 rounded-xl bg-muted/20" />
            <Skeleton className="h-4 w-32 bg-muted/30 rounded-full" />
            <Skeleton className="h-3 w-48 bg-muted/10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
