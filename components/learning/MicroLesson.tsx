'use client';

import { useState, useEffect } from 'react';
import { MicroLesson } from '@/types/database';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { BookOpen, CheckCircle2, Circle, Clock, Play, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MicroLessonProps {
  lessons: MicroLesson[];
  userId: string;
  skillId: string;
  className?: string;
}

export function MicroLessonList({ lessons, userId, skillId, className }: MicroLessonProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const supabase = createClient();

  useEffect(() => {
    // Fetch completed lessons from user_progress
    const fetchProgress = async () => {
      const { data } = await supabase
        .from('user_progress')
        .select('lessons_completed')
        .eq('user_id', userId)
        .eq('skill_id', skillId)
        .single();

      const progressData = data as { lessons_completed?: string[] } | null;
      if (progressData?.lessons_completed) {
        setCompletedLessons(new Set(progressData.lessons_completed));
      }
    };
    fetchProgress();
  }, [userId, skillId, supabase]);

  const handleComplete = async (lessonId: string) => {
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(lessonId)) {
      newCompleted.delete(lessonId);
    } else {
      newCompleted.add(lessonId);
    }
    setCompletedLessons(newCompleted);

    // Update in database
    const newProgress = Math.round((newCompleted.size / lessons.length) * 100);
    const progressData = {
      user_id: userId,
      skill_id: skillId,
      progress_percentage: newProgress,
      lessons_completed: Array.from(newCompleted),
    };
    await supabase
      .from('user_progress')
      .upsert(progressData as never, { onConflict: 'user_id,skill_id' });
  };

  const progress = (completedLessons.size / lessons.length) * 100;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold">Ruta de Micro-Aprendizaje</h3>
            <p className="text-sm text-muted-foreground">
              {completedLessons.size} de {lessons.length} lecciones completadas
            </p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1">
          <span className="font-bold">{Math.round(progress)}%</span>
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Lessons accordion */}
      <Accordion type="single" collapsible className="space-y-3">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.has(lesson.id);

          return (
            <AccordionItem
              key={lesson.id}
              value={lesson.id}
              className={cn(
                'border rounded-xl overflow-hidden transition-all',
                isCompleted ? 'border-green-500/30 bg-green-500/5' : 'hover:border-primary/30'
              )}
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3 flex-1">
                  <div className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all',
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-muted-foreground/30'
                  )}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <h4 className={cn(
                        'font-medium transition-colors',
                        isCompleted && 'text-green-600'
                      )}>
                        {lesson.title}
                      </h4>
                      {lesson.is_ai_generated && (
                        <Sparkles className="w-3 h-3 text-violet-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {lesson.description}
                    </p>
                  </div>

                  <Badge variant="secondary" className="gap-1 ml-2">
                    <Clock className="w-3 h-3" />
                    {lesson.duration}
                  </Badge>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4">
                <div className="pl-11 space-y-4">
                  {lesson.content ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          table: ({ children }) => (
                            <div className="overflow-x-auto rounded-lg border">
                              <table className="w-full">{children}</table>
                            </div>
                          ),
                          th: ({ children }) => (
                            <th className="bg-muted px-4 py-2 text-left font-semibold border-b">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="px-4 py-2 border-b">{children}</td>
                          ),
                          code: ({ children, className }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                                {children}
                              </code>
                            ) : (
                              <code className="block bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                                {children}
                              </code>
                            );
                          },
                          pre: ({ children }) => (
                            <pre className="bg-slate-900 rounded-lg overflow-hidden">
                              {children}
                            </pre>
                          ),
                        }}
                      >
                        {lesson.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8 border-2 border-dashed rounded-lg">
                      <div className="text-center">
                        <Play className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Contenido no disponible</p>
                        <p className="text-sm text-muted-foreground">Genera contenido con el Agent Content Generator</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleComplete(lesson.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                      isCompleted
                        ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                        : 'bg-primary text-primary-foreground hover:opacity-90'
                    )}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Completado
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        Marcar como completado
                      </>
                    )}
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
