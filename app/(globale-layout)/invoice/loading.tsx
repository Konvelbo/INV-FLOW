import { Skeleton } from "@/src/components/ui/skeleton";
import { PageLoadingWrapper } from "@/src/components/PageLoadingWrapper";

export default function Loading() {
  return (
    <PageLoadingWrapper>
      {/* Header Skeleton */}
      <div className="w-full max-w-8xl flex justify-between items-center mb-16">
        <div className="flex items-center gap-8">
          <Skeleton className="size-20 rounded-lg bg-card/40 border border-border/50 shadow-xl" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-1 w-10 bg-primary/30 rounded-full" />
              <Skeleton className="h-3 w-32 bg-primary/10 rounded-full" />
            </div>
            <Skeleton className="h-16 w-64 md:w-96 rounded-2xl bg-foreground/5" />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <Skeleton className="h-12 w-48 rounded-lg bg-muted/20 border border-border/50" />
        </div>
      </div>

      {/* Smart Autofill Placeholder */}
      <div className="w-full max-w-8xl mb-8">
        <Skeleton className="h-24 w-full rounded-2xl bg-card/20 border border-border/30" />
      </div>

      {/* Settings Button Placeholder */}
      <div className="w-full max-w-8xl flex justify-end mb-6">
        <Skeleton className="h-10 w-48 rounded-xl bg-card border border-border/50" />
      </div>

      {/* Choice Invoice Skeleton */}
      <div className="w-full max-w-8xl mb-6">
        <div className="flex justify-center gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-lg bg-muted/10" />
          ))}
        </div>
      </div>

      {/* Main Canvas Skeleton */}
      <div className="w-full max-w-[1100px] aspect-[1/1.4] bg-card/30 border border-border/40 rounded-xl overflow-hidden backdrop-blur-3xl p-12 space-y-12 shadow-2xl mx-auto">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <Skeleton className="size-24 rounded-lg bg-muted/20" />
            <Skeleton className="h-6 w-48 bg-muted/30" />
            <Skeleton className="h-4 w-64 bg-muted/10" />
          </div>
          <div className="text-right space-y-4">
            <Skeleton className="h-10 w-48 bg-muted/30 ml-auto" />
            <Skeleton className="h-4 w-32 bg-muted/10 ml-auto" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-20">
          <div className="space-y-4">
            <Skeleton className="h-4 w-24 bg-muted/20" />
            <Skeleton className="h-6 w-full bg-muted/30" />
            <Skeleton className="h-4 w-full bg-muted/10" />
            <Skeleton className="h-4 w-2/3 bg-muted/10" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-24 bg-muted/20" />
            <Skeleton className="h-6 w-full bg-muted/30" />
            <Skeleton className="h-4 w-full bg-muted/10" />
            <Skeleton className="h-4 w-2/3 bg-muted/10" />
          </div>
        </div>

        <div className="space-y-6 pt-12">
          <div className="grid grid-cols-5 gap-4 pb-4 border-b border-border/10">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 bg-muted/20 rounded" />
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-10 bg-muted/5 rounded-lg" />
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-12">
          <div className="w-64 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20 bg-muted/10" />
              <Skeleton className="h-4 w-24 bg-muted/20" />
            </div>
            <div className="flex justify-between border-t border-border/10 pt-4">
              <Skeleton className="h-6 w-20 bg-muted/20" />
              <Skeleton className="h-8 w-32 bg-primary/20" />
            </div>
          </div>
        </div>
      </div>

      {/* FAB Skeleton */}
      <div className="fixed bottom-12 right-12 z-50">
        <Skeleton className="size-18 rounded-2xl bg-primary shadow-2xl shadow-primary/30" />
      </div>
    </PageLoadingWrapper>
  );
}
