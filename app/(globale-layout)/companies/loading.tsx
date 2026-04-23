import { Skeleton } from "@/src/components/ui/skeleton";
import { PageLoadingWrapper } from "@/src/components/PageLoadingWrapper";

export default function Loading() {
  return (
    <PageLoadingWrapper>
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-1.5 w-10 bg-primary rounded-full" />
            <Skeleton className="h-3 w-32 bg-primary/10 rounded-full" />
          </div>
          <Skeleton className="h-16 w-64 md:w-96 rounded-[2rem] bg-foreground/5" />
          <Skeleton className="h-5 w-full max-w-xl rounded-xl bg-muted/40" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-14 w-40 rounded-2xl bg-card border border-border/50 shadow-lg shadow-primary/5" />
          <Skeleton className="h-14 w-48 rounded-2xl bg-primary shadow-lg shadow-primary/20" />
        </div>
      </div>

      {/* Stats Summary Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 rounded-[2rem] bg-card/40 border border-border/50 space-y-3">
            <Skeleton className="size-12 rounded-2xl bg-muted/20" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-muted/30 rounded-full" />
              <Skeleton className="h-8 w-40 bg-muted/40 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Companies Grid Skeleton - Matches LG:2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-8 rounded-[3rem] border border-border/40 bg-card/40 space-y-8 h-[400px]"
          >
            <div className="flex justify-between items-start">
              <Skeleton className="size-20 rounded-2xl bg-muted/20" />
              <div className="flex gap-2">
                <Skeleton className="size-10 rounded-xl bg-muted/10" />
                <Skeleton className="size-10 rounded-xl bg-muted/10" />
                <Skeleton className="size-10 rounded-xl bg-muted/10" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-8 w-2/3 bg-muted/40 rounded-xl" />
              <Skeleton className="h-4 w-1/2 bg-muted/20 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/10">
              <div className="space-y-4">
                <Skeleton className="h-3 w-20 bg-muted/10 rounded-full" />
                <Skeleton className="h-4 w-32 bg-muted/20 rounded-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-3 w-20 bg-muted/10 rounded-full" />
                <Skeleton className="h-4 w-32 bg-muted/20 rounded-full" />
              </div>
            </div>
            <div className="pt-6 border-t border-border/10">
              <Skeleton className="h-6 w-1/2 bg-primary/20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </PageLoadingWrapper>
  );
}
