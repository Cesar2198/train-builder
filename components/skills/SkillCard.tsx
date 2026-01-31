'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skill, SkillCategory, SkillDifficulty } from '@/types/database';
import {
  FileText,
  Code,
  Palette,
  Container,
  MessageCircle,
  Database,
  Clock,
  ChevronRight,
  Sparkles,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Code,
  Palette,
  Container,
  MessageCircle,
  Database,
  Users,
};

const categoryColors: Record<SkillCategory, { bg: string; text: string; border: string }> = {
  agile: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20' },
  development: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' },
  design: { bg: 'bg-pink-500/10', text: 'text-pink-600', border: 'border-pink-500/20' },
  devops: { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-500/20' },
  'soft-skills': { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/20' },
  data: { bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-500/20' },
};

const difficultyConfig: Record<SkillDifficulty, { label: string; color: string }> = {
  beginner: { label: 'Principiante', color: 'bg-green-500' },
  intermediate: { label: 'Intermedio', color: 'bg-yellow-500' },
  advanced: { label: 'Avanzado', color: 'bg-orange-500' },
  expert: { label: 'Experto', color: 'bg-red-500' },
};

const categoryLabels: Record<SkillCategory, string> = {
  agile: 'Agile',
  development: 'Desarrollo',
  design: 'Diseno',
  devops: 'DevOps',
  'soft-skills': 'Soft Skills',
  data: 'Datos',
};

interface SkillWithProgress extends Skill {
  progress?: number;
}

interface SkillCardProps {
  skill: SkillWithProgress;
  onClick?: (skill: Skill) => void;
  className?: string;
}

export function SkillCard({ skill, onClick, className }: SkillCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = skill.icon ? iconMap[skill.icon] || FileText : FileText;
  const categoryStyle = categoryColors[skill.category];
  const difficultyStyle = difficultyConfig[skill.difficulty];
  const isCompleted = skill.progress === 100;

  return (
    <Card
      className={cn(
        'group relative overflow-hidden cursor-pointer transition-all duration-300',
        'hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1',
        'border-2 hover:border-primary/20',
        isCompleted && 'ring-2 ring-green-500/20',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(skill)}
    >
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        )}
      />

      {isCompleted && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-green-500 text-white gap-1">
            <Sparkles className="w-3 h-3" />
            Completado
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'p-3 rounded-xl transition-all duration-300',
              categoryStyle.bg,
              categoryStyle.border,
              'border',
              isHovered && 'scale-110'
            )}
          >
            <IconComponent className={cn('w-6 h-6', categoryStyle.text)} />
          </div>

          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {skill.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={cn('text-xs', categoryStyle.text, categoryStyle.border)}>
                {categoryLabels[skill.category]}
              </Badge>
              <div className="flex items-center gap-1">
                <div className={cn('w-2 h-2 rounded-full', difficultyStyle.color)} />
                <span className="text-xs text-muted-foreground">{difficultyStyle.label}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {skill.description && (
          <CardDescription className="line-clamp-2 text-sm">
            {skill.description}
          </CardDescription>
        )}

        {skill.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{skill.progress}%</span>
            </div>
            <Progress value={skill.progress} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          {skill.estimated_time && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{skill.estimated_time}</span>
            </div>
          )}

          <div className={cn(
            'flex items-center gap-1 text-sm font-medium text-primary',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'translate-x-2 group-hover:translate-x-0 transition-transform'
          )}>
            <span>{isCompleted ? 'Repasar' : skill.progress ? 'Continuar' : 'Comenzar'}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
