import { Skeleton } from "@/src/components/ui/skeleton";

export default function HistoryLoading() {
  return (
    <div className="min-h-screen min-w-full bg-background/50 p-6 md:p-10 lg:p-12 space-y-12 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="max-w-8xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-1.5 w-10 bg-primary/20 rounded-full" />
            <Skeleton className="h-3 w-40 bg-primary/10 rounded-full" />
          </div>
          <Skeleton className="h-14 w-64 md:w-96 rounded-2xl bg-primary/5" />
          <Skeleton className="h-4 w-full max-w-xl rounded-lg bg-muted/40" />
        </div>
        <Skeleton className="h-14 w-48 rounded-2xl bg-primary/20" />
      </div>

      {/* Filters Skeleton */}
      <div className="max-w-7xl mx-auto rounded-[2rem] border border-border/40 bg-card/60 p-8 flex flex-col md:flex-row gap-6">
        <Skeleton className="flex-1 h-12 rounded-xl bg-muted/20" />
        <Skeleton className="w-full md:w-80 h-12 rounded-xl bg-muted/20" />
      </div>

      {/* History Grid Skeleton */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-[2.5rem] border bg-card/40 backdrop-blur-sm space-y-6 border-border/40 shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-10 w-32 rounded-xl bg-muted/30" />
                <Skeleton className="h-3 w-20 rounded-full bg-muted/10" />
              </div>
              <Skeleton className="h-8 w-20 rounded-full bg-muted/20" />
            </div>
            <div className="space-y-4 p-4 rounded-3xl bg-background/30 border border-white/5">
              <Skeleton className="h-4 w-full bg-muted/10" />
              <Skeleton className="h-4 w-full bg-muted/10" />
              <div className="pt-2 border-t border-white/5">
                <Skeleton className="h-8 w-full bg-muted/20" />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1 rounded-xl bg-muted/30" />
              <Skeleton className="h-12 w-12 rounded-xl bg-destructive/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
