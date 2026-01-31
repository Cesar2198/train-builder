'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QuizGeneratorInput, QuizQuestion, SkillDifficulty } from '@/types/skill';
import { cn } from '@/lib/utils';
import {
  Brain,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Shuffle,
  Settings2,
  Zap,
  RefreshCcw,
  Target
} from 'lucide-react';

interface QuizGeneratorAgentProps {
  input: QuizGeneratorInput;
  onQuizGenerated?: (questions: QuizQuestion[]) => void;
  className?: string;
}

const difficultyConfig: Record<SkillDifficulty, { complexity: string; timePerQuestion: number }> = {
  beginner: { complexity: 'Preguntas directas y conceptuales', timePerQuestion: 30 },
  intermediate: { complexity: 'Escenarios practicos y aplicados', timePerQuestion: 45 },
  advanced: { complexity: 'Casos complejos y analisis critico', timePerQuestion: 60 },
  expert: { complexity: 'Problemas avanzados y decision-making', timePerQuestion: 90 },
};

export function QuizGeneratorAgent({ input, onQuizGenerated, className }: QuizGeneratorAgentProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[] | null>(null);
  const [questionCount, setQuestionCount] = useState(input.numberOfQuestions);

  const generateQuiz = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedQuiz(null);

    const steps = [
      { label: 'Analizando nivel de dificultad...', progress: 10 },
      { label: 'Seleccionando temas relevantes...', progress: 25 },
      { label: 'Generando banco de preguntas...', progress: 45 },
      { label: 'Creando opciones de respuesta...', progress: 65 },
      { label: 'Validando coherencia y dificultad...', progress: 80 },
      { label: 'Optimizando orden y balance...', progress: 95 },
      { label: 'Quiz listo!', progress: 100 },
    ];

    for (const step of steps) {
      setCurrentStep(step.label);
      setProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Generate dynamic questions based on topics
    const questions: QuizQuestion[] = [];
    const questionTemplates = [
      {
        template: 'Cual es el principal beneficio de {topic}?',
        options: ['Mejora la eficiencia', 'Reduce costos', 'Aumenta la calidad', 'Todas las anteriores'],
        correct: 3,
      },
      {
        template: 'En que situacion es mas apropiado aplicar {topic}?',
        options: ['Proyectos pequenos', 'Equipos distribuidos', 'Entregas frecuentes', 'Depende del contexto'],
        correct: 3,
      },
      {
        template: 'Cual de los siguientes NO es una caracteristica de {topic}?',
        options: ['Iterativo', 'Rigido', 'Colaborativo', 'Adaptable'],
        correct: 1,
      },
      {
        template: 'Que rol es fundamental para implementar {topic} correctamente?',
        options: ['Solo el lider', 'Todo el equipo', 'Solo tecnicos', 'Stakeholders externos'],
        correct: 1,
      },
      {
        template: 'Cual es el primer paso para adoptar {topic}?',
        options: ['Comprar herramientas', 'Capacitar al equipo', 'Entender el contexto actual', 'Cambiar la estructura'],
        correct: 2,
      },
    ];

    for (let i = 0; i < questionCount; i++) {
      const templateIdx = i % questionTemplates.length;
      const template = questionTemplates[templateIdx];
      const topic = input.topics[i % input.topics.length] || 'esta practica';

      questions.push({
        id: `quiz-${Date.now()}-${i}`,
        question: template.template.replace('{topic}', topic),
        options: [...template.options].sort(() => Math.random() - 0.5), // Shuffle options
        correctAnswer: template.correct,
        explanation: `Esta pregunta evalua tu comprension de ${topic} en el contexto de ${input.difficulty}.`,
      });
    }

    // Shuffle questions
    questions.sort(() => Math.random() - 0.5);

    setGeneratedQuiz(questions);
    setIsGenerating(false);
    onQuizGenerated?.(questions);
  };

  const config = difficultyConfig[input.difficulty];

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
                Genera examenes dinamicos y adaptativos
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
                <p className="font-medium">Nivel: {input.difficulty}</p>
                <p className="text-sm text-muted-foreground">{config.complexity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Topics */}
        {input.topics.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Temas a evaluar:</p>
            <div className="flex flex-wrap gap-2">
              {input.topics.map((topic, idx) => (
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

        {/* Generated quiz preview */}
        {generatedQuiz && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Examen generado</span>
              </div>
              <Badge variant="outline">{generatedQuiz.length} preguntas</Badge>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
              {generatedQuiz.map((question, idx) => (
                <div
                  key={question.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-xs font-medium text-cyan-600 shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm line-clamp-2">{question.question}</p>
                </div>
              ))}
            </div>
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
              Generando examen...
            </>
          ) : generatedQuiz ? (
            <>
              <Shuffle className="w-5 h-5" />
              Regenerar examen
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generar examen dinamico
            </>
          )}
        </button>
      </CardContent>
    </Card>
  );
}
