'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ExamResult, ExamFeedback, Badge as BadgeType, BadgeLevel } from '@/types/skill';
import { cn } from '@/lib/utils';
import {
  Award,
  Loader2,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Target,
  Star,
  Sparkles,
  Trophy,
  Medal,
  Crown,
  Gem,
  AlertCircle,
  ThumbsUp,
  BookOpen
} from 'lucide-react';

interface EvaluatorAgentProps {
  examResult: ExamResult;
  skillName: string;
  onEvaluationComplete?: (feedback: ExamFeedback, badge?: BadgeType) => void;
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

function calculateGrade(percentage: number): string {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 87) return 'B+';
  if (percentage >= 80) return 'B';
  if (percentage >= 73) return 'C+';
  if (percentage >= 65) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

function getBadgeLevel(percentage: number): BadgeLevel | null {
  if (percentage >= 95) return 'diamond';
  if (percentage >= 90) return 'platinum';
  if (percentage >= 80) return 'gold';
  if (percentage >= 70) return 'silver';
  if (percentage >= 60) return 'bronze';
  return null;
}

export function EvaluatorAgent({ examResult, skillName, onEvaluationComplete, className }: EvaluatorAgentProps) {
  const [isEvaluating, setIsEvaluating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [feedback, setFeedback] = useState<ExamFeedback | null>(null);
  const [earnedBadge, setEarnedBadge] = useState<BadgeType | null>(null);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);

  useEffect(() => {
    evaluateExam();
  }, []);

  const evaluateExam = async () => {
    const steps = [
      { label: 'Analizando respuestas...', progress: 15 },
      { label: 'Calculando puntuacion...', progress: 30 },
      { label: 'Identificando fortalezas...', progress: 45 },
      { label: 'Detectando areas de mejora...', progress: 60 },
      { label: 'Generando recomendaciones...', progress: 75 },
      { label: 'Determinando badge...', progress: 90 },
      { label: 'Evaluacion completa!', progress: 100 },
    ];

    for (const step of steps) {
      setCurrentStep(step.label);
      setProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const percentage = Math.round((examResult.correctAnswers / examResult.totalQuestions) * 100);
    const grade = calculateGrade(percentage);
    const gradeInfo = gradeConfig[grade];

    // Generate feedback
    const generatedFeedback: ExamFeedback = {
      overallGrade: grade,
      percentage,
      strengths: percentage >= 70
        ? ['Buen dominio de conceptos fundamentales', 'Respuestas consistentes', 'Tiempo de respuesta adecuado']
        : ['Conocimiento basico del tema', 'Potencial de mejora identificado'],
      areasToImprove: percentage < 80
        ? ['Profundizar en casos practicos', 'Revisar escenarios avanzados', 'Practicar con mas ejercicios']
        : ['Explorar temas avanzados', 'Compartir conocimiento con otros'],
      recommendations: [
        `Revisar el modulo de ${skillName} nuevamente`,
        'Practicar con ejercicios adicionales',
        'Consultar recursos complementarios',
      ],
      personalizedMessage: percentage >= 80
        ? `Excelente trabajo! Has demostrado un solido entendimiento de ${skillName}. Sigue asi!`
        : percentage >= 60
          ? `Buen esfuerzo! Tienes una base solida en ${skillName}. Con un poco mas de practica, dominaras el tema.`
          : `No te desanimes! ${skillName} requiere practica. Revisa el contenido y vuelve a intentarlo.`,
    };

    setFeedback(generatedFeedback);

    // Determine badge
    const badgeLevel = getBadgeLevel(percentage);
    if (badgeLevel) {
      const badge: BadgeType = {
        id: `badge-${Date.now()}`,
        name: `${badgeConfig[badgeLevel].name} en ${skillName}`,
        description: `Obtuviste ${percentage}% en el examen de ${skillName}`,
        level: badgeLevel,
        icon: 'Award',
        skillId: examResult.skillId,
        requiredScore: badgeConfig[badgeLevel].minScore,
        unlockedAt: new Date(),
        status: 'unlocked',
      };
      setEarnedBadge(badge);

      // Trigger badge animation
      setTimeout(() => setShowBadgeAnimation(true), 300);
    }

    setIsEvaluating(false);
    onEvaluationComplete?.(generatedFeedback, earnedBadge || undefined);
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
                Analizando tu desempeno...
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

  const grade = feedback?.overallGrade || 'C';
  const gradeInfo = gradeConfig[grade];
  const BadgeIcon = earnedBadge ? badgeConfig[earnedBadge.level].icon : Award;

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
                Revision y calificacion del examen
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
            <p className="text-4xl font-bold">{feedback?.percentage}%</p>
            <p className="text-sm text-muted-foreground mt-1">Puntuacion</p>
          </div>

          <div className="text-center p-4 rounded-xl bg-muted/50">
            <p className="text-4xl font-bold">
              {examResult.correctAnswers}/{examResult.totalQuestions}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Correctas</p>
          </div>
        </div>

        {/* Badge earned */}
        {earnedBadge && (
          <div className={cn(
            'relative p-6 rounded-xl border-2 transition-all duration-500',
            badgeConfig[earnedBadge.level].bgColor,
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
                <BadgeIcon className={cn('w-12 h-12', badgeConfig[earnedBadge.level].color)} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Badge Desbloqueado!</p>
                <h3 className={cn('text-xl font-bold', badgeConfig[earnedBadge.level].color)}>
                  {earnedBadge.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {earnedBadge.description}
                </p>
              </div>

              <Badge className={cn('text-lg px-4 py-2', badgeConfig[earnedBadge.level].bgColor, badgeConfig[earnedBadge.level].color)}>
                {badgeConfig[earnedBadge.level].name}
              </Badge>
            </div>
          </div>
        )}

        {/* Personalized message */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-lg leading-relaxed">
            {gradeInfo.emoji} {feedback?.personalizedMessage}
          </p>
        </div>

        {/* Strengths & Areas to improve */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <h4 className="font-semibold">Fortalezas</h4>
            </div>
            <ul className="space-y-2">
              {feedback?.strengths.map((strength, idx) => (
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
              {feedback?.areasToImprove.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h4 className="font-semibold">Recomendaciones</h4>
          </div>
          <div className="grid gap-2">
            {feedback?.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-medium text-blue-600">
                  {idx + 1}
                </div>
                <span className="text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
