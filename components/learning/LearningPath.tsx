'use client';

import { useState, useCallback } from 'react';
import { SkillWithContent } from '@/types/database';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LearningObjective } from './LearningObjective';
import { MicroLessonList } from './MicroLesson';
import { ResourceList } from './ResourceCard';
import { QuickQuiz } from './QuickQuiz';
import { ContentGeneratorAgent, QuizGeneratorAgent } from '@/components/agents';
import { BadgeShowcase } from '@/components/badges';
import { useBadges } from '@/hooks';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Clock,
  Play,
  Wand2,
  Award,
  Bot,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';

interface LearningPathProps {
  skill: SkillWithContent;
  userId: string;
  onBack?: () => void;
  onRefresh?: () => void;
  className?: string;
}

export function LearningPath({ skill, userId, onBack, onRefresh, className }: LearningPathProps) {
  const [activeTab, setActiveTab] = useState('lessons');
  const { badges, refetch: refetchBadges } = useBadges(userId);

  const handleContentGenerated = useCallback(() => {
    onRefresh?.();
  }, [onRefresh]);

  const handleQuizGenerated = useCallback(() => {
    onRefresh?.();
  }, [onRefresh]);

  const objective = skill.learning_objectives?.[0];
  const hasLessons = skill.micro_lessons?.length > 0;
  const hasQuestions = skill.quiz_questions?.length > 0;
  const hasVideos = skill.video_resources?.length > 0;

  // Transform badges for showcase
  const skillBadges = badges.map(b => ({
    id: b.id,
    name: b.name,
    description: b.description,
    level: b.level,
    icon: 'Award',
    skillId: b.skill_id,
    requiredScore: 60,
    unlockedAt: new Date(b.unlocked_at),
    status: 'unlocked' as const,
  }));

  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border p-6 md:p-8">
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
                {onRefresh && (
                  <button
                    onClick={onRefresh}
                    className="p-1 rounded hover:bg-muted transition-colors"
                    title="Recargar contenido"
                  >
                    <RefreshCcw className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
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
                {skill.estimated_time && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{skill.estimated_time}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span>{skill.micro_lessons?.length || 0} lecciones</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Play className="w-4 h-4 text-muted-foreground" />
                  <span>{skill.video_resources?.length || 0} videos</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Brain className="w-4 h-4 text-muted-foreground" />
                  <span>{skill.quiz_questions?.length || 0} preguntas</span>
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
                    strokeDasharray={`${(skill.user_progress?.progress_percentage || 0) * 3.02} 302`}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{skill.user_progress?.progress_percentage || 0}%</span>
                  <span className="text-xs text-muted-foreground">progreso</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Objective */}
      {objective ? (
        <LearningObjective objective={objective} />
      ) : (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay objetivo de aprendizaje definido.
                Usa el Agent Content Generator para crear uno.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Agents Section */}
      <Card className="overflow-hidden border-2 border-dashed border-primary/20">
        <CardHeader className="bg-gradient-to-r from-violet-500/5 via-cyan-500/5 to-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 via-cyan-500/20 to-amber-500/20">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Agentes de IA
                <Badge className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
                  Dinamicos
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Genera contenido y examenes personalizados con OpenAI
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border-2 hover:border-violet-500/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <Wand2 className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-violet-600">Content Generator</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Genera lecciones y contenido educativo
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 hover:border-cyan-500/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <Brain className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-cyan-600">Quiz Generator</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Crea examenes adaptativos
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 hover:border-amber-500/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-600">Evaluator</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Evalua y otorga badges
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start gap-2 bg-transparent p-0 h-auto flex-wrap">
          <TabsTrigger
            value="lessons"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 transition-all"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Lecciones
            {hasLessons && <Badge variant="secondary" className="ml-2">{skill.micro_lessons.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 transition-all"
          >
            <Play className="w-4 h-4 mr-2" />
            Recursos
            {hasVideos && <Badge variant="secondary" className="ml-2">{skill.video_resources.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger
            value="quiz"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 transition-all"
          >
            <Brain className="w-4 h-4 mr-2" />
            Examen
            {hasQuestions && <Badge variant="secondary" className="ml-2">{skill.quiz_questions.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger
            value="agents"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 transition-all"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Agentes IA
          </TabsTrigger>
          <TabsTrigger
            value="badges"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 transition-all"
          >
            <Award className="w-4 h-4 mr-2" />
            Badges
            {skillBadges.length > 0 && <Badge variant="secondary" className="ml-2">{skillBadges.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-6">
          {hasLessons ? (
            <MicroLessonList
              lessons={skill.micro_lessons}
              userId={userId}
              skillId={skill.id}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No hay lecciones disponibles</h3>
                  <p className="text-muted-foreground mt-2">
                    Ve a la pestaña Agentes IA y usa el Content Generator para crear lecciones
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          {hasVideos ? (
            <ResourceList resources={skill.video_resources} />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Play className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No hay recursos de video</h3>
                  <p className="text-muted-foreground mt-2">
                    Los recursos se generaran automaticamente con el Content Generator
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <QuickQuiz
            questions={skill.quiz_questions || []}
            skillId={skill.id}
            skillName={skill.name}
            userId={userId}
          />
        </TabsContent>

        <TabsContent value="agents" className="mt-6 space-y-6">
          <ContentGeneratorAgent
            skillId={skill.id}
            skillName={skill.name}
            difficulty={skill.difficulty}
            category={skill.category}
            onContentGenerated={handleContentGenerated}
          />

          <QuizGeneratorAgent
            skillId={skill.id}
            skillName={skill.name}
            difficulty={skill.difficulty}
            topics={skill.micro_lessons?.map(l => l.title) || []}
            onQuizGenerated={handleQuizGenerated}
          />
        </TabsContent>

        <TabsContent value="badges" className="mt-6">
          <BadgeShowcase
            badges={skillBadges}
            title="Mis Badges"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
