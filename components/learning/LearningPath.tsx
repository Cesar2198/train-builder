'use client';

import { useState } from 'react';
import { Skill, SkillContent, Badge as BadgeType } from '@/types/skill';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LearningObjective } from './LearningObjective';
import { MicroLessonList } from './MicroLesson';
import { ResourceList } from './ResourceCard';
import { QuickQuiz } from './QuickQuiz';
import { ContentGeneratorAgent, QuizGeneratorAgent } from '@/components/agents';
import { BadgeShowcase } from '@/components/badges';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Clock,
  Play,
  Sparkles,
  Bot,
  Award,
  Cpu,
  Wand2
} from 'lucide-react';

interface LearningPathProps {
  skill: Skill;
  content: SkillContent;
  onBack?: () => void;
  className?: string;
}

// Sample badges for demonstration
const sampleBadges: BadgeType[] = [
  {
    id: 'badge-1',
    name: 'Oro en Creacion de HUs',
    description: 'Obtuviste 85% en el examen',
    level: 'gold',
    icon: 'Award',
    skillId: 'hu-creation',
    requiredScore: 80,
    unlockedAt: new Date('2024-01-15'),
    status: 'unlocked',
  },
  {
    id: 'badge-2',
    name: 'Plata en React Hooks',
    description: 'Obtuviste 75% en el examen',
    level: 'silver',
    icon: 'Award',
    skillId: 'react-hooks',
    requiredScore: 70,
    unlockedAt: new Date('2024-01-10'),
    status: 'unlocked',
  },
  {
    id: 'badge-3',
    name: 'Diamante en Figma',
    description: 'Obtuviste 98% en el examen',
    level: 'diamond',
    icon: 'Award',
    skillId: 'figma-basics',
    requiredScore: 95,
    unlockedAt: new Date('2024-01-20'),
    status: 'unlocked',
  },
  {
    id: 'badge-4',
    name: 'Bronce en Docker',
    description: 'Por desbloquear',
    level: 'bronze',
    icon: 'Award',
    skillId: 'docker-containers',
    requiredScore: 60,
    status: 'locked',
  },
  {
    id: 'badge-5',
    name: 'Platino en SQL',
    description: 'Por desbloquear',
    level: 'platinum',
    icon: 'Award',
    skillId: 'sql-fundamentals',
    requiredScore: 90,
    status: 'locked',
  },
];

export function LearningPath({ skill, content, onBack, className }: LearningPathProps) {
  const [activeTab, setActiveTab] = useState('lessons');

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
                  3 Activos
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Asistentes inteligentes para personalizar tu aprendizaje
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Content Generator */}
            <div className="p-4 rounded-xl border-2 hover:border-violet-500/50 transition-colors group">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-violet-600">Content Generator</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Genera contenido educativo dinamico y personalizado
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Activo
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quiz Generator */}
            <div className="p-4 rounded-xl border-2 hover:border-cyan-500/50 transition-colors group">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:scale-110 transition-transform">
                  <Brain className="w-5 h-5 text-cyan-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-cyan-600">Quiz Generator</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Crea examenes adaptativos segun tu nivel
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Activo
                  </Badge>
                </div>
              </div>
            </div>

            {/* Evaluator */}
            <div className="p-4 rounded-xl border-2 hover:border-amber-500/50 transition-colors group">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-600">Evaluator</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Analiza resultados y otorga badges
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Activo
                  </Badge>
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
            Examen
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
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-6">
          <MicroLessonList lessons={content.microLessons} />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <ResourceList resources={content.videoResources} />
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <QuickQuiz
            questions={content.quiz}
            skillId={skill.id}
            skillName={skill.name}
          />
        </TabsContent>

        <TabsContent value="agents" className="mt-6 space-y-6">
          <ContentGeneratorAgent
            input={{
              skillId: skill.id,
              skillName: skill.name,
              difficulty: skill.difficulty,
              category: skill.category,
            }}
          />

          <QuizGeneratorAgent
            input={{
              skillId: skill.id,
              difficulty: skill.difficulty,
              numberOfQuestions: 10,
              topics: content.microLessons.map(l => l.title),
            }}
          />
        </TabsContent>

        <TabsContent value="badges" className="mt-6">
          <BadgeShowcase badges={sampleBadges} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
