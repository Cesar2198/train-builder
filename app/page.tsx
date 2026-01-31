'use client';

import { useState } from 'react';
import { SkillGrid } from '@/components/skills';
import { LearningPath } from '@/components/learning';
import { skills, skillContents } from '@/data/skills';
import { Skill } from '@/types/skill';
import {
  GraduationCap,
  Rocket,
  Sparkles,
  BookOpen,
  Target,
  Users
} from 'lucide-react';

export default function Home() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedSkill(null);
  };

  // Show learning path if a skill is selected and has content
  if (selectedSkill && skillContents[selectedSkill.id]) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <LearningPath
            skill={selectedSkill}
            content={skillContents[selectedSkill.id]}
            onBack={handleBack}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
              <Sparkles className="w-4 h-4" />
              Plataforma de Aprendizaje Agil
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Train Builder
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Desarrolla tus competencias tecnicas con rutas de aprendizaje personalizadas,
              contenido interactivo y evaluaciones practicas.
            </p>

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
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Micro-Learning</h3>
            <p className="text-muted-foreground">
              Contenido estructurado en lecciones cortas y enfocadas para un aprendizaje efectivo.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Objetivos Claros</h3>
            <p className="text-muted-foreground">
              Cada skill tiene objetivos definidos y criterios de aceptacion medibles.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aprendizaje Activo</h3>
            <p className="text-muted-foreground">
              Quizzes y ejercicios practicos para validar y reforzar tu conocimiento.
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
              Explora nuestra biblioteca de competencias y comienza tu ruta de aprendizaje.
              Cada skill incluye teoria, recursos multimedia y evaluaciones.
            </p>
          </div>

          <SkillGrid
            skills={skills}
            onSkillClick={handleSkillClick}
          />
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
              Construido con Next.js 15, Tailwind CSS y shadcn/ui
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
