import { Skeleton } from "@/src/components/ui/skeleton";

export default function PlanningLoading() {
  return (
    <div className="flex flex-col min-h-full min-w-full bg-background/50 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl bg-primary/20" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-40 rounded-lg bg-muted/40" />
              <Skeleton className="h-2 w-24 rounded-full bg-muted/20" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-24 rounded-full bg-muted/30" />
            <Skeleton className="h-8 w-20 rounded-full bg-muted/20" />
            <Skeleton className="h-6 w-32 rounded-lg bg-muted/40" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-36 rounded-full bg-primary/20" />
          <Skeleton className="size-8 rounded-full bg-muted/30" />
          <Skeleton className="size-8 rounded-full bg-muted/30" />
        </div>
      </header>

      <div className="flex-1 flex flex-col bg-muted/5 p-6 gap-6">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border bg-card/40 space-y-3 border-border/40"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="size-10 rounded-xl bg-muted/30" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-2 w-16 rounded-full bg-muted/20" />
                  <Skeleton className="h-6 w-10 rounded-lg bg-muted/40" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Grid Skeleton */}
        <div className="flex-1 bg-card rounded-[2.5rem] border shadow-2xl border-border/30 overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-4 border-b border-border/10 grid grid-cols-7 gap-1">
            {[...Array(7)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-4 w-12 mx-auto rounded-full bg-muted/10"
              />
            ))}
          </div>
          <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-px bg-border/10 p-4">
            {[...Array(35)].map((_, i) => (
              <Skeleton
                key={i}
                className="rounded-2xl bg-muted/5 border border-muted/5 m-1"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
