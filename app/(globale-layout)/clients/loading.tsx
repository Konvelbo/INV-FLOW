import { Skeleton } from "@/src/components/ui/skeleton";
import { PageLoadingWrapper } from "@/src/components/PageLoadingWrapper";

export default function Loading() {
  return (
    <PageLoadingWrapper primaryColor="bg-emerald-500/10" secondaryColor="bg-blue-500/5">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-2 w-12 bg-emerald-500/30 rounded-full" />
            <Skeleton className="h-3 w-16 bg-emerald-500/10 rounded-full" />
          </div>
          <Skeleton className="h-16 w-64 md:w-96 rounded-[2rem] bg-foreground/5" />
          <Skeleton className="h-5 w-full max-w-xl rounded-xl bg-muted/40" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-40 rounded-xl bg-card border border-border/50" />
          <Skeleton className="h-12 w-48 rounded-xl bg-emerald-600/20 shadow-lg shadow-emerald-500/10" />
        </div>
      </div>

      {/* Top 10 Clients Scroll Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-lg bg-amber-500/10" />
          <Skeleton className="h-6 w-56 bg-muted/30 rounded-lg" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-none w-64 p-6 rounded-3xl border border-border/40 bg-card/40 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="size-14 rounded-2xl bg-muted/20" />
                <Skeleton className="size-8 rounded-full bg-muted/10" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-muted/40 rounded-full" />
                <Skeleton className="h-3 w-1/2 bg-muted/20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-6 rounded-3xl bg-card/40 border border-border/50 space-y-3">
            <Skeleton className="size-10 rounded-2xl bg-muted/20" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 bg-muted/30 rounded-full" />
              <Skeleton className="h-6 w-32 bg-muted/40 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar Skeleton */}
      <div className="max-w-md">
        <Skeleton className="h-12 w-full rounded-xl bg-muted/10 border border-border/20" />
      </div>

      {/* Clients Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/40 bg-card/40 overflow-hidden flex flex-col h-[400px]"
          >
            <div className="p-6 border-b border-border/10 bg-muted/5 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-xl bg-muted/20" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 bg-muted/40" />
                  <Skeleton className="h-3 w-20 bg-muted/20" />
                </div>
              </div>
              <div className="flex gap-1.5">
                <Skeleton className="size-8 rounded-lg bg-muted/10" />
                <Skeleton className="size-8 rounded-lg bg-muted/10" />
              </div>
            </div>
            <div className="p-6 space-y-6 flex-1">
              <div className="space-y-3">
                <Skeleton className="h-3 w-full bg-muted/10" />
                <Skeleton className="h-3 w-full bg-muted/10" />
                <Skeleton className="h-3 w-3/4 bg-muted/10" />
              </div>
              <div className="pt-5 border-t border-border/10 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20 bg-muted/20" />
                  <Skeleton className="h-6 w-32 bg-primary/20" />
                </div>
                <Skeleton className="h-10 w-full bg-muted/10 rounded-xl" />
                <Skeleton className="h-10 w-full bg-muted/10 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLoadingWrapper>
  );
}
