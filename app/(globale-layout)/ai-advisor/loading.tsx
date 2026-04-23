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
          <Skeleton className="h-5 w-full max-w-2xl rounded-xl bg-muted/40" />
        </div>
        <div className="flex items-center gap-6">
          <Skeleton className="h-10 w-40 rounded-xl bg-white/5 border border-white/5" />
          <Skeleton className="h-10 w-40 rounded-xl bg-white/5 border border-white/5" />
        </div>
      </div>

      {/* Chat Interface Skeleton */}
      <div className="flex-1 rounded-[2.5rem] border border-border/40 bg-card/30 overflow-hidden flex flex-col min-h-[600px]">
        {/* Chat Messages Area */}
        <div className="flex-1 p-8 space-y-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`flex gap-4 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
            >
              <Skeleton className="size-10 rounded-full bg-muted/20 shrink-0" />
              <div className={`space-y-2 max-w-[70%] ${i % 2 === 0 ? "" : "items-end flex flex-col"}`}>
                <Skeleton className={`h-12 w-64 md:w-96 rounded-2xl ${i % 2 === 0 ? "bg-muted/10" : "bg-primary/10"}`} />
                <Skeleton className="h-3 w-20 bg-muted/5 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input Area */}
        <div className="p-8 border-t border-border/10 bg-muted/5 flex gap-4">
          <Skeleton className="h-14 flex-1 rounded-2xl bg-muted/10" />
          <Skeleton className="size-14 rounded-2xl bg-primary/20" />
        </div>
      </div>
    </PageLoadingWrapper>
  );
}
