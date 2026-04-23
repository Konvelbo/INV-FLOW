import { Skeleton } from "@/src/components/ui/skeleton";
import { PageLoadingWrapper } from "@/src/components/PageLoadingWrapper";

export default function Loading() {
  return (
    <PageLoadingWrapper>
      {/* Header Skeleton */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-1.5 w-10 bg-primary/30 rounded-full" />
            <Skeleton className="h-3 w-32 bg-primary/10 rounded-full" />
          </div>
          <Skeleton className="h-16 w-64 md:w-96 rounded-2xl bg-foreground/5" />
          <Skeleton className="h-5 w-full max-w-xl rounded-xl bg-muted/40" />
        </div>

        {/* Tabs Skeleton */}
        <div className="flex space-x-8 pt-4 border-b border-border/10 pb-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-32 bg-muted/10 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Nested Component Skeleton (Default to Clients) */}
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64 rounded-xl bg-muted/10" />
          <div className="flex gap-3">
            <Skeleton className="h-12 w-32 rounded-xl bg-card border border-border/50" />
            <Skeleton className="h-12 w-40 rounded-xl bg-primary/20" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[300px] rounded-2xl border border-border/40 bg-card/30 p-6 space-y-4">
              <div className="flex gap-4">
                <Skeleton className="size-12 rounded-xl bg-muted/20" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 bg-muted/30" />
                  <Skeleton className="h-3 w-20 bg-muted/10" />
                </div>
              </div>
              <Skeleton className="h-20 w-full bg-muted/5 rounded-xl" />
              <div className="pt-4 border-t border-border/10">
                <Skeleton className="h-10 w-full bg-muted/10 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLoadingWrapper>
  );
}
