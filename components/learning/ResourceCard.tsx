'use client';

import { VideoResource } from '@/types/skill';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Play, Clock, Youtube, Video, ExternalLink } from 'lucide-react';

interface ResourceCardProps {
  resources: VideoResource[];
  className?: string;
}

const platformIcons = {
  youtube: Youtube,
  vimeo: Video,
  custom: Video,
};

const platformColors = {
  youtube: 'bg-red-500/10 text-red-500 border-red-500/20',
  vimeo: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  custom: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

export function ResourceList({ resources, className }: ResourceCardProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-red-500/10">
          <Play className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h3 className="font-semibold">Recursos Multimedia</h3>
          <p className="text-sm text-muted-foreground">
            {resources.length} videos recomendados
          </p>
        </div>
      </div>

      {/* Resources grid */}
      <div className="grid gap-4">
        {resources.map((resource) => {
          const PlatformIcon = platformIcons[resource.platform];
          const platformColor = platformColors[resource.platform];

          return (
            <Card
              key={resource.id}
              className="group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Thumbnail placeholder */}
                  <div className="relative w-40 h-24 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shrink-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="relative p-3 rounded-full bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                    {resource.duration && (
                      <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
                        {resource.duration}
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {resource.title}
                      </h4>
                      <Badge variant="outline" className={cn('shrink-0 gap-1', platformColor)}>
                        <PlatformIcon className="w-3 h-3" />
                        {resource.platform}
                      </Badge>
                    </div>

                    {resource.structure && (
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-16 text-muted-foreground">Intro</span>
                          <span className="text-foreground">{resource.structure.intro}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-16 text-muted-foreground">Demo</span>
                          <span className="text-foreground">{resource.structure.demo}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-16 text-muted-foreground">Cierre</span>
                          <span className="text-foreground">{resource.structure.conclusion}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
