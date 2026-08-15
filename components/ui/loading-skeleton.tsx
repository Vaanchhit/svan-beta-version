import { Skeleton } from "@/components/ui/skeleton";

export function FeedLoadingSkeleton() {
  return (
    <div className="space-y-8 px-4 pt-4">
      {[0, 1, 2].map((item) => (
        <div key={item} className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="aspect-[4/5] w-full rounded-[1.7rem]" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GridLoadingSkeleton() {
  return (
    <div className="columns-2 gap-3 px-4 pt-5">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <Skeleton
          key={item}
          className="mb-3 h-56 break-inside-avoid rounded-[1.5rem]"
        />
      ))}
    </div>
  );
}
