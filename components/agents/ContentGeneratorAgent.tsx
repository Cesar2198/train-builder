'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SkillDifficulty, SkillCategory } from '@/types/database';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  Zap,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';

interface ContentGeneratorAgentProps {
  skillId: string;
  skillName: string;
  difficulty: SkillDifficulty;
  category: SkillCategory;
  onContentGenerated?: () => void;
  className?: string;
}

const difficultyTemplates: Record<SkillDifficulty, { topics: number; depth: string }> = {
  beginner: { topics: 3, depth: 'Conceptos fundamentales y ejemplos basicos' },
  intermediate: { topics: 4, depth: 'Casos practicos y patrones comunes' },
  advanced: { topics: 5, depth: 'Arquitectura avanzada y mejores practicas' },
  expert: { topics: 6, depth: 'Optimizacion, edge cases y liderazgo tecnico' },
};

export function ContentGeneratorAgent({
  skillId,
  skillName,
  difficulty,
  category,
  onContentGenerated,
  className
}: ContentGeneratorAgentProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedContent, setGeneratedContent] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedContent(null);
    setError(null);

    const steps = [
      { label: 'Conectando con AI...', progress: 10 },
      { label: 'Analizando skill y nivel de dificultad...', progress: 25 },
      { label: 'Generando estructura del contenido...', progress: 45 },
      { label: 'Creando lecciones personalizadas...', progress: 70 },
      { label: 'Guardando en base de datos...', progress: 90 },
    ];

    // Simulate progress for UX
    for (const step of steps.slice(0, 2)) {
      setCurrentStep(step.label);
      setProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    try {
      setCurrentStep(steps[2].label);
      setProgress(steps[2].progress);

      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillId,
          skillName,
          difficulty,
          category,
          numberOfLessons: difficultyTemplates[difficulty].topics,
        }),
      });

      setCurrentStep(steps[3].label);
      setProgress(steps[3].progress);

      if (!response.ok) {
        throw new Error('Error al generar contenido');
      }

      const data = await response.json();

      setCurrentStep(steps[4].label);
      setProgress(100);

      setGeneratedContent(data.content);
      onContentGenerated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-500/20 border border-violet-500/30">
              <Sparkles className="w-6 h-6 text-violet-500" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Agent: Content Generator
                <Badge variant="outline" className="bg-violet-500/10 text-violet-600 border-violet-500/30">
                  AI
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Genera contenido educativo dinamico con OpenAI
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
        {/* Input summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Skill</p>
            <p className="font-medium truncate">{skillName}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Dificultad</p>
            <p className="font-medium capitalize">{difficulty}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Categoria</p>
            <p className="font-medium capitalize">{category}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Lecciones</p>
            <p className="font-medium">{difficultyTemplates[difficulty].topics} modulos</p>
          </div>
        </div>

        {/* Generation status */}
        {isGenerating && (
          <div className="space-y-3 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
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

        {/* Generated content preview */}
        {generatedContent && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Contenido generado y guardado exitosamente</span>
            </div>

            {generatedContent.objective && (
              <div className="p-4 rounded-lg bg-primary/5 border">
                <p className="text-sm font-medium text-primary">Objetivo de Aprendizaje</p>
                <p className="text-sm mt-1">{generatedContent.objective.title}</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">Lecciones generadas:</p>
              {generatedContent.lessons?.map((lesson: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-sm font-medium text-violet-600">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{lesson.description}</p>
                  </div>
                  <Badge variant="secondary">{lesson.duration}</Badge>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Recarga la pagina o ve a la pestaña Lecciones para ver el contenido completo
            </p>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={generateContent}
          disabled={isGenerating}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
            isGenerating
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90 shadow-lg shadow-violet-500/20'
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generando con AI...
            </>
          ) : generatedContent ? (
            <>
              <RefreshCcw className="w-5 h-5" />
              Regenerar contenido
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generar contenido con AI
            </>
          )}
        </button>
      </CardContent>
    </Card>
  );
}
