import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SkillCardSkeletonProps {
  className?: string;
}

export function SkillCardSkeleton({ className }: SkillCardSkeletonProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {/* Icon skeleton */}
          <div className="w-12 h-12 rounded-xl bg-muted animate-pulse" />

          <div className="flex-1 space-y-2">
            {/* Title skeleton */}
            <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
            {/* Badges skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
              <div className="h-5 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-full" />
          <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
        </div>

        {/* Progress skeleton */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            <div className="h-4 w-8 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-2 bg-muted rounded-full animate-pulse" />
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
