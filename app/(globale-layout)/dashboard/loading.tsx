import { Skeleton } from "@/src/components/ui/skeleton";
import { PageLoadingWrapper } from "@/src/components/PageLoadingWrapper";

export default function DashboardLoading() {
  return (
    <PageLoadingWrapper>
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-1.5 w-10 bg-primary/30 rounded-full" />
            <Skeleton className="h-3 w-32 bg-primary/10 rounded-full" />
          </div>
          <Skeleton className="h-16 w-64 md:w-96 rounded-2xl bg-foreground/5" />
          <Skeleton className="h-5 w-full max-w-xl rounded-xl bg-muted/40" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-32 rounded-xl bg-card border border-border/50 shadow-lg" />
        </div>
      </div>

      {/* Stats Grid Skeleton - Matches XL Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-8 rounded-[2.5rem] border bg-card/40 backdrop-blur-sm space-y-6 border-border/40"
          >
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-32 bg-muted/30 rounded-full" />
              <Skeleton className="size-14 rounded-2xl bg-muted/20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-12 w-48 bg-muted/40 rounded-xl" />
              <Skeleton className="h-3 w-24 bg-muted/20 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Goals Section Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 rounded-[2.5rem] border border-border/40 bg-card/50 shadow-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/20">
            <Skeleton className="h-6 w-48 rounded-lg bg-muted/30" />
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24 bg-muted/20" />
                <Skeleton className="h-4 w-32 bg-muted/20" />
              </div>
              <Skeleton className="h-2.5 w-full bg-muted/10 rounded-full" />
              <Skeleton className="h-3 w-3/4 bg-muted/10 rounded-full" />
            </div>
            <div className="space-y-6">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24 bg-muted/20" />
                <Skeleton className="h-4 w-32 bg-muted/20" />
              </div>
              <Skeleton className="h-2.5 w-full bg-muted/10 rounded-full" />
              <Skeleton className="h-3 w-3/4 bg-muted/10 rounded-full" />
            </div>
          </div>
        </div>
        <div className="rounded-[2.5rem] border border-primary/20 bg-primary/5 p-8 flex flex-col justify-center space-y-6">
          <Skeleton className="h-4 w-32 bg-primary/20 rounded-full" />
          <Skeleton className="h-10 w-full bg-primary/30 rounded-xl" />
          <Skeleton className="h-3 w-48 bg-primary/10 rounded-full" />
        </div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex flex-col gap-8 pb-10">
        <Skeleton className="h-[450px] w-full rounded-[2.5rem] bg-card/30 border border-border/20 shadow-xl" />
        <Skeleton className="h-[400px] w-full rounded-[2.5rem] bg-card/30 border border-border/20 shadow-xl" />
      </div>
    </PageLoadingWrapper>
  );
}
