'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ContentGeneratorInput, MicroLesson, SkillDifficulty } from '@/types/skill';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Brain,
  Loader2,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  Zap,
  RefreshCcw
} from 'lucide-react';

interface ContentGeneratorAgentProps {
  input: ContentGeneratorInput;
  onContentGenerated?: (lessons: MicroLesson[]) => void;
  className?: string;
}

const difficultyTemplates: Record<SkillDifficulty, { topics: number; depth: string }> = {
  beginner: { topics: 3, depth: 'Conceptos fundamentales y ejemplos basicos' },
  intermediate: { topics: 4, depth: 'Casos practicos y patrones comunes' },
  advanced: { topics: 5, depth: 'Arquitectura avanzada y mejores practicas' },
  expert: { topics: 6, depth: 'Optimizacion, edge cases y liderazgo tecnico' },
};

export function ContentGeneratorAgent({ input, onContentGenerated, className }: ContentGeneratorAgentProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedContent, setGeneratedContent] = useState<MicroLesson[] | null>(null);

  const generateContent = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedContent(null);

    const steps = [
      { label: 'Analizando skill y nivel de dificultad...', progress: 15 },
      { label: 'Investigando mejores practicas...', progress: 30 },
      { label: 'Estructurando ruta de aprendizaje...', progress: 50 },
      { label: 'Generando contenido teorico...', progress: 70 },
      { label: 'Creando ejemplos practicos...', progress: 85 },
      { label: 'Finalizando y optimizando...', progress: 100 },
    ];

    for (const step of steps) {
      setCurrentStep(step.label);
      setProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Simulated generated content
    const template = difficultyTemplates[input.difficulty];
    const lessons: MicroLesson[] = [
      {
        id: `gen-${Date.now()}-1`,
        title: `Fundamentos de ${input.skillName}`,
        description: `Introduccion completa a los conceptos base de ${input.skillName}`,
        duration: '20 min',
        completed: false,
        content: `
## Introduccion a ${input.skillName}

Este modulo te proporcionara una base solida en **${input.skillName}**.

### Objetivos
- Comprender los conceptos fundamentales
- Identificar casos de uso comunes
- Aplicar las mejores practicas

### Conceptos Clave

| Concepto | Descripcion |
|----------|-------------|
| Definicion | Que es y para que sirve |
| Contexto | Donde y cuando aplicarlo |
| Beneficios | Ventajas principales |

\`\`\`
// Ejemplo basico
const ejemplo = {
  skill: "${input.skillName}",
  nivel: "${input.difficulty}",
  categoria: "${input.category}"
};
\`\`\`
        `,
      },
      {
        id: `gen-${Date.now()}-2`,
        title: `Practicas Esenciales`,
        description: `Tecnicas y metodologias clave para dominar ${input.skillName}`,
        duration: '25 min',
        completed: false,
        content: `
## Practicas Esenciales

${template.depth}

### Metodologia Recomendada

1. **Preparacion**: Entiende el contexto
2. **Ejecucion**: Aplica paso a paso
3. **Revision**: Valida resultados
4. **Iteracion**: Mejora continua

### Tips de Expertos

> "La practica constante es la clave del dominio" - Experto en ${input.category}
        `,
      },
      {
        id: `gen-${Date.now()}-3`,
        title: `Casos de Estudio`,
        description: `Analisis de escenarios reales aplicando ${input.skillName}`,
        duration: '30 min',
        completed: false,
        content: `
## Casos de Estudio Reales

### Caso 1: Implementacion en Startup

**Contexto**: Equipo de 5 personas, metodologia agil

**Solucion aplicada**:
- Fase 1: Diagnostico inicial
- Fase 2: Implementacion gradual
- Fase 3: Medicion de resultados

**Resultados**: 40% mejora en productividad

### Caso 2: Empresa Enterprise

**Contexto**: +100 empleados, procesos establecidos

**Desafios**:
- Resistencia al cambio
- Integracion con sistemas legacy

**Leccion aprendida**: La comunicacion es clave
        `,
      },
    ];

    // Add more lessons based on difficulty
    if (template.topics >= 4) {
      lessons.push({
        id: `gen-${Date.now()}-4`,
        title: `Integracion y Herramientas`,
        description: `Ecosistema de herramientas para ${input.skillName}`,
        duration: '25 min',
        completed: false,
      });
    }

    setGeneratedContent(lessons);
    setIsGenerating(false);
    onContentGenerated?.(lessons);
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
                Genera contenido educativo dinamico y personalizado
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
            <p className="font-medium truncate">{input.skillName}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Dificultad</p>
            <p className="font-medium capitalize">{input.difficulty}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Categoria</p>
            <p className="font-medium capitalize">{input.category}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Temas</p>
            <p className="font-medium">{difficultyTemplates[input.difficulty].topics} modulos</p>
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

        {/* Generated content preview */}
        {generatedContent && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Contenido generado exitosamente</span>
            </div>

            <div className="space-y-3">
              {generatedContent.map((lesson, idx) => (
                <div
                  key={lesson.id}
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
              Generando contenido...
            </>
          ) : generatedContent ? (
            <>
              <RefreshCcw className="w-5 h-5" />
              Regenerar contenido
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generar contenido dinamico
            </>
          )}
        </button>
      </CardContent>
    </Card>
  );
}
