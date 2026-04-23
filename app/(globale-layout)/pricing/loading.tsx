import { Skeleton } from "@/src/components/ui/skeleton";
import { PageLoadingWrapper } from "@/src/components/PageLoadingWrapper";

export default function Loading() {
  return (
    <PageLoadingWrapper>
      {/* Ambient background is handled by Wrapper */}

      <div className="max-w-6xl mx-auto space-y-20">
        {/* Header Skeleton */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Skeleton className="h-10 w-48 rounded-full bg-primary/10 border border-primary/20" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-16 md:h-20 w-full max-w-3xl mx-auto rounded-[2rem] bg-foreground/5" />
            <Skeleton className="h-6 w-full max-w-xl mx-auto rounded-xl bg-muted/40" />
          </div>
        </div>

        {/* Pricing Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`rounded-3xl border p-8 flex flex-col gap-8 bg-card/40 backdrop-blur-2xl border-border/40 ${
                i === 1 ? "lg:scale-105 border-primary/30" : ""
              }`}
            >
              <div className="space-y-4">
                <Skeleton className="size-14 rounded-2xl bg-muted/20" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-32 bg-muted/40" />
                  <Skeleton className="h-4 w-48 bg-muted/20" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-14 w-32 bg-muted/40" />
                  <Skeleton className="h-6 w-16 bg-muted/20" />
                </div>
                <Skeleton className="h-4 w-40 bg-muted/10" />
              </div>

              <div className="space-y-4 flex-1">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="size-5 rounded-full bg-muted/20" />
                    <Skeleton className="h-3.5 flex-1 bg-muted/10" />
                  </div>
                ))}
              </div>

              <Skeleton className="h-14 w-full rounded-2xl bg-muted/20" />
            </div>
          ))}
        </div>

        {/* Trust Badges Skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-48 rounded-full bg-card/30 border border-border/30" />
          ))}
        </div>
      </div>
    </PageLoadingWrapper>
  );
}
