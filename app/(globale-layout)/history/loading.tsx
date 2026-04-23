import { Skeleton } from "@/src/components/ui/skeleton";
import { PageLoadingWrapper } from "@/src/components/PageLoadingWrapper";

export default function Loading() {
  return (
    <PageLoadingWrapper>
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-1.5 w-10 bg-primary/30 rounded-full" />
            <Skeleton className="h-3 w-32 bg-primary/10 rounded-full" />
          </div>
          <Skeleton className="h-16 w-64 md:w-96 rounded-[2rem] bg-foreground/5" />
          <Skeleton className="h-5 w-full max-w-xl rounded-xl bg-muted/40" />
        </div>
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-12 w-40 rounded-2xl bg-card border border-border/50 shadow-lg" />
          <Skeleton className="h-12 w-48 rounded-2xl bg-primary shadow-lg shadow-primary/20" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="bg-card/40 p-6 rounded-2xl border border-border/40 space-y-6 md:space-y-0 md:flex md:items-center md:gap-6 shadow-xl">
        <Skeleton className="h-12 flex-1 rounded-xl bg-muted/10 border border-border/20" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-40 bg-muted/10 rounded-xl" />
          <Skeleton className="h-4 w-4 bg-muted/10" />
          <Skeleton className="h-12 w-40 bg-muted/10 rounded-xl" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-[2.5rem] border border-border/40 bg-card/30 overflow-hidden min-h-[500px]">
        <div className="p-8 border-b border-border/10 flex gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-6 flex-1 bg-muted/20 rounded-lg" />
          ))}
        </div>
        <div className="p-8 space-y-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex gap-6 items-center">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32 bg-muted/20" />
                <Skeleton className="h-3 w-16 bg-muted/10" />
              </div>
              <Skeleton className="h-5 flex-1 bg-muted/5" />
              <Skeleton className="h-5 flex-1 bg-muted/5" />
              <Skeleton className="h-5 flex-1 bg-primary/10" />
              <Skeleton className="h-8 w-24 bg-muted/20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </PageLoadingWrapper>
  );
}
