'use client';

import { LearningObjective as LearningObjectiveType } from '@/types/skill';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LearningObjectiveProps {
  objective: LearningObjectiveType;
  className?: string;
}

export function LearningObjective({ objective, className }: LearningObjectiveProps) {
  return (
    <Card className={cn(
      'relative overflow-hidden border-2 border-primary/20',
      'bg-gradient-to-br from-primary/5 via-background to-background',
      className
    )}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl" />

      <CardContent className="relative pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <Target className="w-6 h-6 text-primary" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-primary">Objetivo de Aprendizaje</h3>
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </div>
            <h4 className="text-xl font-bold leading-tight">
              {objective.title}
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {objective.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
