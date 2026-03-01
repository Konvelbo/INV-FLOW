import { Skeleton } from "@/src/components/ui/skeleton";

export default function AIAdvisorLoading() {
  return (
    <div className="min-h-screen bg-background/50 p-6 md:p-10 lg:p-12 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-12 h-full flex flex-col">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-1.5 w-10 bg-primary/20 rounded-full" />
              <Skeleton className="h-3 w-40 bg-primary/10 rounded-full" />
            </div>
            <Skeleton className="h-14 w-64 md:w-96 rounded-2xl bg-primary/5" />
            <Skeleton className="h-4 w-full max-w-2xl rounded-lg bg-muted/40" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-40 rounded-xl bg-muted/20 border border-white/5" />
            <Skeleton className="h-10 w-40 rounded-xl bg-muted/20 border border-white/5" />
          </div>
        </div>

        {/* Chat Interface Skeleton */}
        <div className="flex-1 min-h-[600px] rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border/10 flex items-center justify-between bg-muted/10">
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 rounded-2xl bg-primary/20" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32 bg-muted/40" />
                <Skeleton className="h-2 w-20 bg-muted/20" />
              </div>
            </div>
          </div>

          <div className="flex-1 p-8 space-y-12 overflow-hidden">
            <div className="flex gap-4 items-start max-w-2xl">
              <Skeleton className="size-10 rounded-xl shrink-0 bg-primary/10" />
              <Skeleton className="h-32 w-full rounded-2xl bg-muted/5 border border-white/5" />
            </div>
            <div className="flex gap-4 items-start max-w-2xl ml-auto flex-row-reverse">
              <Skeleton className="size-10 rounded-xl shrink-0 bg-muted/30" />
              <Skeleton className="h-20 w-full rounded-2xl bg-primary/5 border border-primary/5" />
            </div>
            <div className="flex gap-4 items-start max-w-2xl">
              <Skeleton className="size-10 rounded-xl shrink-0 bg-primary/10" />
              <Skeleton className="h-40 w-full rounded-2xl bg-muted/5 border border-white/5" />
            </div>
          </div>

          <div className="p-8 border-t border-border/10 bg-muted/5">
            <Skeleton className="h-14 w-full rounded-2xl bg-background/50 border border-border/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
