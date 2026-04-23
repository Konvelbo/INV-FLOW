import { Skeleton } from "@/src/components/ui/skeleton";
import { PageLoadingWrapper } from "@/src/components/PageLoadingWrapper";

export default function Loading() {
  return (
    <PageLoadingWrapper>
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-2 w-12 bg-rose-500/30 rounded-full" />
            <Skeleton className="h-3 w-20 bg-rose-500/10 rounded-full" />
          </div>
          <Skeleton className="h-16 w-64 md:w-96 rounded-[2rem] bg-foreground/5" />
          <Skeleton className="h-5 w-full max-w-xl rounded-xl bg-muted/40" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-12 w-40 rounded-xl bg-card border border-border/50" />
          <Skeleton className="h-12 w-48 rounded-xl bg-rose-600/20 shadow-lg shadow-rose-500/10" />
        </div>
      </div>

      {/* Stats Summary Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 rounded-3xl bg-card/40 border border-border/50 space-y-3">
            <Skeleton className="size-10 rounded-2xl bg-muted/20" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-muted/30 rounded-full" />
              <Skeleton className="h-6 w-40 bg-muted/40 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Skeleton className="h-12 w-full md:max-w-md rounded-xl bg-muted/10 border border-border/20" />
        <Skeleton className="h-14 w-64 rounded-2xl bg-muted/5 border border-border/10" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-3xl border border-border/40 bg-card/30 overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-border/10 flex gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-6 flex-1 bg-muted/20 rounded-lg" />
          ))}
        </div>
        <div className="p-6 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-10 flex-1 bg-muted/5 rounded-xl" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </PageLoadingWrapper>
  );
}
