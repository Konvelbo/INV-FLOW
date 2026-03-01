import { Skeleton } from "@/src/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-full bg-background text-foreground p-6 md:p-10 lg:p-12 space-y-12 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-1.5 w-10 bg-primary/20 rounded-full" />
            <Skeleton className="h-3 w-24 rounded-full bg-primary/10" />
          </div>
          <Skeleton className="h-14 w-64 md:w-96 rounded-2xl bg-primary/5" />
          <Skeleton className="h-4 w-full max-w-lg rounded-lg bg-muted/40" />
        </div>
        <Skeleton className="h-12 w-32 rounded-2xl bg-card border border-border/50" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-[2rem] border bg-card/40 backdrop-blur-sm space-y-4 border-border/40"
          >
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-24 bg-muted/30" />
              <Skeleton className="size-12 rounded-2xl bg-muted/20" />
            </div>
            <Skeleton className="h-10 w-32 bg-muted/40" />
            <Skeleton className="h-3 w-20 bg-muted/20" />
          </div>
        ))}
      </div>

      {/* Goals Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-3xl border border-border/40 bg-card/50 h-[220px]">
          <div className="p-6 border-b border-border/40">
            <Skeleton className="h-6 w-48 rounded-lg bg-muted/20" />
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full rounded bg-muted/20" />
              <Skeleton className="h-2.5 w-full rounded bg-muted/10" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full rounded bg-muted/20" />
              <Skeleton className="h-2.5 w-full rounded bg-muted/10" />
            </div>
          </div>
        </div>
        <Skeleton className="rounded-3xl border border-primary/10 bg-primary/5 h-[220px]" />
      </div>

      {/* Content Area Skeleton */}
      <div className="grid lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-[350px] w-full rounded-3xl bg-card/30 border border-border/20" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-[250px] w-full rounded-3xl bg-card/30 border border-border/20" />
            <Skeleton className="h-[250px] w-full rounded-3xl bg-card/30 border border-border/20" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-full min-h-[400px] w-full rounded-3xl bg-card/30 border border-border/20" />
        </div>
      </div>
    </div>
  );
}
