import { Skeleton } from "@/src/components/ui/skeleton";

export default function InvoiceLoading() {
  return (
    <div className="min-h-screen min-w-full bg-background/50 flex flex-col items-center py-12 pb-32 animate-in fade-in duration-700">
      {/* Header Skeleton */}
      <div className="w-full max-w-8xl px-8 mb-16 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Skeleton className="p-5 size-20 rounded-[2rem] bg-primary/10 border border-primary/20 shadow-xl" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-1 w-10 bg-primary/30 rounded-full" />
              <Skeleton className="h-3 w-32 bg-primary/10 rounded-full" />
            </div>
            <Skeleton className="h-14 w-64 rounded-2xl bg-foreground/5 shadow-sm" />
          </div>
        </div>
        <Skeleton className="hidden lg:block h-14 w-40 rounded-2xl bg-muted/20 border border-border/40" />
      </div>

      {/* Editor Main Area Skeleton */}
      <div className="w-full max-w-[1100px] px-8">
        <div className="relative aspect-[3/4] md:aspect-[1/1.41] bg-card/30 border border-border/40 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-3xl p-6 space-y-12">
          <div className="flex justify-between border-b pb-8 border-border/20">
            <Skeleton className="h-20 w-48 rounded-2xl bg-muted/20" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-32 bg-muted/30 rounded-full ml-auto" />
              <Skeleton className="h-8 w-40 bg-muted/40 rounded-xl ml-auto" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-4 w-24 bg-muted/20 rounded-full" />
            <div className="grid grid-cols-2 gap-8">
              <Skeleton className="h-32 w-full rounded-2xl bg-muted/10 border border-border/10" />
              <Skeleton className="h-32 w-full rounded-2xl bg-muted/10 border border-border/10" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-xl bg-muted/15" />
            <Skeleton className="h-40 w-full rounded-2xl bg-muted/5 border border-border/10" />
          </div>
        </div>
      </div>

      {/* Floating Action Button Skeleton */}
      {/*<div className="fixed bottom-12 left-1/2 -translate-x-1/2">
        <Skeleton className="size-20 rounded-[2.5rem] bg-primary/30 shadow-2xl border border-primary/20" />
      </div>*/}
    </div>
  );
}
