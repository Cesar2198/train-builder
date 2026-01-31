'use client';

import { Skill, SkillContent } from '@/types/skill';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LearningObjective } from './LearningObjective';
import { MicroLessonList } from './MicroLesson';
import { ResourceList } from './ResourceCard';
import { QuickQuiz } from './QuickQuiz';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Clock,
  Play,
  Target,
  Sparkles
} from 'lucide-react';

interface LearningPathProps {
  skill: Skill;
  content: SkillContent;
  onBack?: () => void;
  className?: string;
}

export function LearningPath({ skill, content, onBack, className }: LearningPathProps) {
  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border p-6 md:p-8">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />

        <div className="relative">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a skills
            </button>
          )}

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {skill.category}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {skill.difficulty}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">
                {skill.name}
              </h1>

              {skill.description && (
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {skill.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {skill.estimatedTime && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{skill.estimatedTime}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span>{content.microLessons.length} lecciones</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Play className="w-4 h-4 text-muted-foreground" />
                  <span>{content.videoResources.length} videos</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Brain className="w-4 h-4 text-muted-foreground" />
                  <span>{content.quiz.length} preguntas</span>
                </div>
              </div>
            </div>

            {/* Progress circle */}
            <div className="shrink-0">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${(skill.progress || 0) * 3.02} 302`}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{skill.progress || 0}%</span>
                  <span className="text-xs text-muted-foreground">completado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Objective */}
      <LearningObjective objective={content.objective} />

      {/* Content Tabs */}
      <Tabs defaultValue="lessons" className="space-y-6">
        <TabsList className="w-full justify-start gap-2 bg-transparent p-0 h-auto flex-wrap">
          <TabsTrigger
            value="lessons"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 transition-all"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Lecciones
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 transition-all"
          >
            <Play className="w-4 h-4 mr-2" />
            Recursos
          </TabsTrigger>
          <TabsTrigger
            value="quiz"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 transition-all"
          >
            <Brain className="w-4 h-4 mr-2" />
            Quiz
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-6">
          <MicroLessonList lessons={content.microLessons} />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <ResourceList resources={content.videoResources} />
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <QuickQuiz questions={content.quiz} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
