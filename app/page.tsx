'use client';

import { useState, useCallback, useEffect } from 'react';
import { SkillGrid } from '@/components/skills';
import { LearningPath } from '@/components/learning';
import { useSkills, useSkill } from '@/hooks';
import { Skill, SkillWithContent } from '@/types/database';
import {
  GraduationCap,
  Rocket,
  Sparkles,
  BookOpen,
  Target,
  Users,
  Loader2,
  AlertCircle,
  Database
} from 'lucide-react';

// For demo purposes, using a fixed user ID
// In production, this would come from authentication
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function Home() {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const { skills, loading: skillsLoading, error: skillsError, refetch: refetchSkills } = useSkills();
  const { skill: selectedSkill, loading: skillLoading, refetch: refetchSkill } = useSkill(selectedSkillId);

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkillId(skill.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedSkillId(null);
    refetchSkills();
  };

  const handleRefresh = useCallback(() => {
    refetchSkill();
  }, [refetchSkill]);

  // Transform skills for SkillGrid (add progress from user_progress if needed)
  const skillsWithProgress = skills.map(s => ({
    ...s,
    progress: 0, // This would come from user_progress in a real app
  }));

  // Show learning path if a skill is selected
  if (selectedSkillId && selectedSkill) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <LearningPath
            skill={selectedSkill}
            userId={DEMO_USER_ID}
            onBack={handleBack}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    );
  }

  // Loading state for selected skill
  if (selectedSkillId && skillLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando skill...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
              <Sparkles className="w-4 h-4" />
              Plataforma de Aprendizaje con AI
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Train Builder
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Desarrolla tus competencias con contenido generado por <strong>AI</strong>,
              examenes adaptativos y evaluaciones personalizadas.
            </p>

            {/* Database status */}
            <div className="flex items-center gap-2 text-sm">
              <Database className="w-4 h-4" />
              <span className="text-muted-foreground">Conectado a Supabase</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <Rocket className="w-5 h-5" />
                Explorar Skills
              </button>
              <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border bg-background/50 backdrop-blur-sm rounded-xl font-semibold hover:bg-background transition-all">
                <GraduationCap className="w-5 h-5" />
                Ver mi progreso
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="group p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-violet-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Contenido AI</h3>
            <p className="text-muted-foreground">
              Genera lecciones y contenido educativo dinamico con OpenAI GPT-4.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-cyan-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Examenes Adaptativos</h3>
            <p className="text-muted-foreground">
              Preguntas generadas por AI que se adaptan a tu nivel y progreso.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Evaluacion Inteligente</h3>
            <p className="text-muted-foreground">
              Feedback personalizado y badges basados en tu desempeno.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Catalogo de Skills
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra biblioteca de competencias desde Supabase.
              Cada skill puede generar contenido y examenes dinamicos con AI.
            </p>
          </div>

          {skillsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Cargando skills desde Supabase...</p>
              </div>
            </div>
          ) : skillsError ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-500 font-medium">Error al cargar skills</p>
              <p className="text-muted-foreground mt-2">{skillsError}</p>
              <p className="text-sm text-muted-foreground mt-4">
                Asegurate de ejecutar el schema SQL en Supabase
              </p>
              <button
                onClick={() => refetchSkills()}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                Reintentar
              </button>
            </div>
          ) : skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No hay skills disponibles</p>
              <p className="text-muted-foreground mt-2">
                Ejecuta el schema SQL en Supabase para agregar skills de ejemplo
              </p>
            </div>
          ) : (
            <SkillGrid
              skills={skillsWithProgress}
              onSkillClick={handleSkillClick}
            />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              <span className="font-semibold">Train Builder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Next.js 15 + Supabase + OpenAI + shadcn/ui
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
