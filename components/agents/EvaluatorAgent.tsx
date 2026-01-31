'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BadgeLevel } from '@/types/database';
import { cn } from '@/lib/utils';
import {
  Award,
  Loader2,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Star,
  Sparkles,
  Trophy,
  Medal,
  Crown,
  Gem,
  AlertCircle,
  BookOpen
} from 'lucide-react';

interface ExamData {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: any[];
  questionsData?: any[];
}

interface EvaluatorAgentProps {
  userId: string;
  skillId: string;
  skillName: string;
  examData: ExamData;
  onEvaluationComplete?: (result: any) => void;
  className?: string;
}

const badgeConfig: Record<BadgeLevel, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  minScore: number;
  name: string;
}> = {
  bronze: {
    icon: Medal,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100 border-amber-300',
    minScore: 60,
    name: 'Bronce'
  },
  silver: {
    icon: Award,
    color: 'text-slate-500',
    bgColor: 'bg-slate-100 border-slate-300',
    minScore: 70,
    name: 'Plata'
  },
  gold: {
    icon: Trophy,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 border-yellow-300',
    minScore: 80,
    name: 'Oro'
  },
  platinum: {
    icon: Crown,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 border-cyan-300',
    minScore: 90,
    name: 'Platino'
  },
  diamond: {
    icon: Gem,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100 border-violet-300',
    minScore: 95,
    name: 'Diamante'
  },
};

const gradeConfig: Record<string, { label: string; color: string; emoji: string }> = {
  'A+': { label: 'Excepcional', color: 'text-violet-600', emoji: '🌟' },
  'A': { label: 'Excelente', color: 'text-green-600', emoji: '⭐' },
  'B+': { label: 'Muy Bueno', color: 'text-emerald-600', emoji: '👏' },
  'B': { label: 'Bueno', color: 'text-blue-600', emoji: '👍' },
  'C+': { label: 'Satisfactorio', color: 'text-cyan-600', emoji: '📚' },
  'C': { label: 'Aceptable', color: 'text-yellow-600', emoji: '💪' },
  'D': { label: 'Necesita Mejorar', color: 'text-orange-600', emoji: '📖' },
  'F': { label: 'Reprobado', color: 'text-red-600', emoji: '🔄' },
};

export function EvaluatorAgent({
  userId,
  skillId,
  skillName,
  examData,
  onEvaluationComplete,
  className
}: EvaluatorAgentProps) {
  const [isEvaluating, setIsEvaluating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [feedback, setFeedback] = useState<any | null>(null);
  const [earnedBadge, setEarnedBadge] = useState<any | null>(null);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    evaluateExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const evaluateExam = async () => {
    const steps = [
      { label: 'Conectando con AI...', progress: 10 },
      { label: 'Analizando respuestas...', progress: 25 },
      { label: 'Calculando puntuacion...', progress: 40 },
      { label: 'Generando feedback personalizado...', progress: 60 },
      { label: 'Determinando badge...', progress: 80 },
      { label: 'Guardando resultados...', progress: 95 },
    ];

    for (const step of steps.slice(0, 3)) {
      setCurrentStep(step.label);
      setProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    try {
      setCurrentStep(steps[3].label);
      setProgress(steps[3].progress);

      const response = await fetch('/api/evaluate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          skillId,
          skillName,
          ...examData,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al evaluar examen');
      }

      setCurrentStep(steps[4].label);
      setProgress(steps[4].progress);

      const data = await response.json();

      setCurrentStep(steps[5].label);
      setProgress(100);

      await new Promise(resolve => setTimeout(resolve, 300));

      setFeedback(data.feedback);
      setEarnedBadge(data.badge);

      if (data.badge) {
        setTimeout(() => setShowBadgeAnimation(true), 300);
      }

      onEvaluationComplete?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsEvaluating(false);
    }
  };

  if (isEvaluating) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardHeader className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
              <Award className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Agent: Evaluator
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                  AI
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Analizando tu desempeno con AI...
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4 p-6 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
              <span className="font-medium">{currentStep}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const grade = feedback?.overallGrade || 'C';
  const gradeInfo = gradeConfig[grade] || gradeConfig['C'];
  const BadgeIcon = earnedBadge ? badgeConfig[earnedBadge.level as BadgeLevel]?.icon || Award : Award;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
              <Award className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Agent: Evaluator
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                  Completo
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Evaluacion generada con AI
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Score summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border">
            <p className={cn('text-5xl font-bold', gradeInfo.color)}>
              {grade}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{gradeInfo.label}</p>
          </div>

          <div className="text-center p-4 rounded-xl bg-muted/50">
            <p className="text-4xl font-bold">{feedback?.percentage || 0}%</p>
            <p className="text-sm text-muted-foreground mt-1">Puntuacion</p>
          </div>

          <div className="text-center p-4 rounded-xl bg-muted/50">
            <p className="text-4xl font-bold">
              {examData.correctAnswers}/{examData.totalQuestions}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Correctas</p>
          </div>
        </div>

        {/* Badge earned */}
        {earnedBadge && (
          <div className={cn(
            'relative p-6 rounded-xl border-2 transition-all duration-500',
            badgeConfig[earnedBadge.level as BadgeLevel]?.bgColor || 'bg-amber-100 border-amber-300',
            showBadgeAnimation && 'scale-105'
          )}>
            <div className="absolute -top-3 -right-3">
              <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
            </div>

            <div className="flex items-center gap-4">
              <div className={cn(
                'p-4 rounded-full',
                showBadgeAnimation && 'animate-bounce'
              )}>
                <BadgeIcon className={cn('w-12 h-12', badgeConfig[earnedBadge.level as BadgeLevel]?.color || 'text-amber-600')} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Badge Desbloqueado!</p>
                <h3 className={cn('text-xl font-bold', badgeConfig[earnedBadge.level as BadgeLevel]?.color || 'text-amber-600')}>
                  {earnedBadge.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {earnedBadge.description}
                </p>
              </div>

              <Badge className={cn(
                'text-lg px-4 py-2',
                badgeConfig[earnedBadge.level as BadgeLevel]?.bgColor || 'bg-amber-100',
                badgeConfig[earnedBadge.level as BadgeLevel]?.color || 'text-amber-600'
              )}>
                {badgeConfig[earnedBadge.level as BadgeLevel]?.name || 'Badge'}
              </Badge>
            </div>
          </div>
        )}

        {/* Personalized message */}
        {feedback?.personalizedMessage && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-lg leading-relaxed">
              {gradeInfo.emoji} {feedback.personalizedMessage}
            </p>
          </div>
        )}

        {/* Strengths & Areas to improve */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <h4 className="font-semibold">Fortalezas</h4>
            </div>
            <ul className="space-y-2">
              {feedback?.strengths?.map((strength: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-orange-600">
              <TrendingDown className="w-5 h-5" />
              <h4 className="font-semibold">Areas de Mejora</h4>
            </div>
            <ul className="space-y-2">
              {feedback?.areasToImprove?.map((area: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        {feedback?.recommendations && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold">Recomendaciones AI</h4>
            </div>
            <div className="grid gap-2">
              {feedback.recommendations.map((rec: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-medium text-blue-600">
                    {idx + 1}
                  </div>
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
