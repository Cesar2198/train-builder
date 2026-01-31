'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SkillDifficulty } from '@/types/database';
import { cn } from '@/lib/utils';
import {
  Brain,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Shuffle,
  Settings2,
  Zap,
  AlertCircle,
  Target
} from 'lucide-react';

interface QuizGeneratorAgentProps {
  skillId: string;
  skillName: string;
  difficulty: SkillDifficulty;
  topics?: string[];
  onQuizGenerated?: () => void;
  className?: string;
}

const difficultyConfig: Record<SkillDifficulty, { complexity: string; timePerQuestion: number }> = {
  beginner: { complexity: 'Preguntas directas y conceptuales', timePerQuestion: 30 },
  intermediate: { complexity: 'Escenarios practicos y aplicados', timePerQuestion: 45 },
  advanced: { complexity: 'Casos complejos y analisis critico', timePerQuestion: 60 },
  expert: { complexity: 'Problemas avanzados y decision-making', timePerQuestion: 90 },
};

export function QuizGeneratorAgent({
  skillId,
  skillName,
  difficulty,
  topics = [],
  onQuizGenerated,
  className
}: QuizGeneratorAgentProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState<any[] | null>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedQuiz(null);
    setError(null);

    const steps = [
      { label: 'Conectando con AI...', progress: 10 },
      { label: 'Analizando nivel de dificultad...', progress: 25 },
      { label: 'Generando preguntas personalizadas...', progress: 50 },
      { label: 'Validando respuestas...', progress: 75 },
      { label: 'Guardando en base de datos...', progress: 90 },
    ];

    for (const step of steps.slice(0, 2)) {
      setCurrentStep(step.label);
      setProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    try {
      setCurrentStep(steps[2].label);
      setProgress(steps[2].progress);

      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillId,
          skillName,
          difficulty,
          numberOfQuestions: questionCount,
          topics,
        }),
      });

      setCurrentStep(steps[3].label);
      setProgress(steps[3].progress);

      if (!response.ok) {
        throw new Error('Error al generar quiz');
      }

      const data = await response.json();

      setCurrentStep(steps[4].label);
      setProgress(100);

      setGeneratedQuiz(data.questions);
      onQuizGenerated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsGenerating(false);
    }
  };

  const config = difficultyConfig[difficulty];

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
              <Brain className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Agent: Quiz Generator
                <Badge variant="outline" className="bg-cyan-500/10 text-cyan-600 border-cyan-500/30">
                  AI
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Genera examenes adaptativos con OpenAI
              </p>
            </div>
          </div>
          <div className={cn(
            'w-3 h-3 rounded-full',
            isGenerating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
          )} />
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Settings2 className="w-4 h-4" />
            Configuracion del Examen
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/50 space-y-2">
              <label className="text-sm text-muted-foreground">Numero de preguntas</label>
              <div className="flex items-center gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => setQuestionCount(num)}
                    disabled={isGenerating}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      questionCount === num
                        ? 'bg-cyan-500 text-white'
                        : 'bg-background border hover:border-cyan-500/50'
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 space-y-2">
              <label className="text-sm text-muted-foreground">Tiempo estimado</label>
              <p className="text-2xl font-bold text-cyan-600">
                {Math.ceil((questionCount * config.timePerQuestion) / 60)} min
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-cyan-500 mt-0.5" />
              <div>
                <p className="font-medium">Nivel: {difficulty}</p>
                <p className="text-sm text-muted-foreground">{config.complexity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Topics */}
        {topics.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Temas a evaluar:</p>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, idx) => (
                <Badge key={idx} variant="secondary" className="gap-1">
                  <HelpCircle className="w-3 h-3" />
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Generation status */}
        {isGenerating && (
          <div className="space-y-3 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
              <span className="text-sm font-medium">{currentStep}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Generated quiz preview */}
        {generatedQuiz && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Examen generado y guardado</span>
              </div>
              <Badge variant="outline">{generatedQuiz.length} preguntas</Badge>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
              {generatedQuiz.map((question: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-xs font-medium text-cyan-600 shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm line-clamp-2">{question.question}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Recarga la pagina o ve a la pestaña Examen para realizar el quiz
            </p>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={generateQuiz}
          disabled={isGenerating}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
            isGenerating
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 shadow-lg shadow-cyan-500/20'
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generando con AI...
            </>
          ) : generatedQuiz ? (
            <>
              <Shuffle className="w-5 h-5" />
              Regenerar examen
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generar examen con AI
            </>
          )}
        </button>
      </CardContent>
    </Card>
  );
}
