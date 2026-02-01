import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "skeleton-shimmer rounded-lg",
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-4 space-y-4">
      <Skeleton className="aspect-video w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function ArtistCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}
