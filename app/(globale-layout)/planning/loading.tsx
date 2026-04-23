import { Skeleton } from "@/src/components/ui/skeleton";
import { PageLoadingWrapper } from "@/src/components/PageLoadingWrapper";

export default function Loading() {
  return (
    <PageLoadingWrapper>
      {/* Productivity Analysis Header Skeleton */}
      <div className="relative overflow-hidden bg-muted/30 border border-border/40 rounded-[2.5rem] p-8 mb-8">
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-2xl bg-primary/20 shadow-xl" />
              <Skeleton className="h-3 w-40 bg-primary/10 rounded-full" />
            </div>
            <Skeleton className="h-14 w-64 md:w-[500px] rounded-2xl bg-foreground/5" />
            <Skeleton className="h-4 w-full max-w-md rounded-lg bg-muted/40" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-48 rounded-2xl bg-primary shadow-lg" />
            <Skeleton className="size-12 rounded-2xl bg-muted/10 border border-border/20" />
          </div>
        </div>
      </div>

      {/* Calendar Header Skeleton */}
      <div className="flex items-center justify-between px-6 py-6 border border-border/40 bg-card/50 backdrop-blur-md rounded-t-[2.5rem]">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-full bg-muted/20" />
          <div className="flex items-center bg-muted/30 rounded-full p-1 border border-border/10">
            <Skeleton className="size-8 rounded-full bg-muted/20" />
            <Skeleton className="size-8 rounded-full bg-muted/20 ml-1" />
          </div>
          <Skeleton className="h-8 w-48 bg-muted/30 rounded-lg ml-2" />
        </div>
      </div>

      {/* Main Calendar Content Skeleton */}
      <div className="flex-1 border-x border-b border-border/40 bg-card rounded-b-[2.5rem] shadow-2xl p-8 space-y-8">
        {/* Quick Actions Skeleton */}
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-16 flex-1 rounded-2xl bg-indigo-50/50 border border-indigo-100/20" />
          <Skeleton className="h-16 flex-1 rounded-2xl bg-amber-50/50 border border-amber-100/20" />
        </div>

        {/* Calendar Grid Skeleton */}
        <div className="bg-background rounded-[2rem] border border-border/30 overflow-hidden min-h-[600px] grid grid-cols-7 grid-rows-6">
          {[...Array(7 * 6)].map((_, i) => (
            <div key={i} className="border-r border-b border-border/10 p-4 space-y-2 h-[120px]">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-6 bg-muted/20" />
              </div>
              {i % 5 === 0 && <Skeleton className="h-6 w-full bg-primary/10 rounded-lg" />}
              {i % 7 === 0 && <Skeleton className="h-6 w-full bg-indigo-500/10 rounded-lg" />}
            </div>
          ))}
        </div>
      </div>
    </PageLoadingWrapper>
  );
}
