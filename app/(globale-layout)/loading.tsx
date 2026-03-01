import { Skeleton } from "@/src/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-full bg-background/50 p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-6 border-border/40">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 rounded-2xl bg-primary/10" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-64 rounded-lg bg-primary/5" />
              <Skeleton className="h-3 w-40 rounded-full bg-primary/5" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-36 rounded-full bg-primary/10" />
          <Skeleton className="size-11 rounded-full bg-muted/50" />
          <Skeleton className="size-11 rounded-full bg-muted/50" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-3xl border bg-card/40 backdrop-blur-sm shadow-sm space-y-4 border-border/50"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 rounded-2xl bg-muted/50" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-20 rounded-full bg-muted/30" />
                <Skeleton className="h-6 w-12 rounded-lg bg-muted/40" />
              </div>
            </div>
            <Skeleton className="h-1.5 w-full rounded-full bg-muted/20" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 rounded-3xl border bg-card/30 backdrop-blur-md shadow-xl border-border/40 overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-border/20 flex justify-between items-center">
          <Skeleton className="h-6 w-48 rounded-lg bg-muted/20" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full bg-muted/20" />
            <Skeleton className="h-8 w-8 rounded-full bg-muted/20" />
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-7 gap-4">
          {[...Array(35)].map((_, i) => (
            <Skeleton
              key={i}
              className="aspect-square rounded-2xl bg-muted/10 border border-muted/5"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
