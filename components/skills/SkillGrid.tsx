'use client';

import { useState, useMemo } from 'react';
import { Skill, SkillCategory, SkillDifficulty } from '@/types/database';
import { SkillCard } from './SkillCard';
import { SkillCardSkeleton } from './SkillCardSkeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Filter,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal
} from 'lucide-react';

interface SkillWithProgress extends Skill {
  progress?: number;
}

interface SkillGridProps {
  skills: SkillWithProgress[];
  loading?: boolean;
  onSkillClick?: (skill: Skill) => void;
}

const categoryFilters: { value: SkillCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'agile', label: 'Agile' },
  { value: 'development', label: 'Desarrollo' },
  { value: 'design', label: 'Diseno' },
  { value: 'devops', label: 'DevOps' },
  { value: 'soft-skills', label: 'Soft Skills' },
  { value: 'data', label: 'Datos' },
];

const difficultyFilters: { value: SkillDifficulty | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
  { value: 'expert', label: 'Experto' },
];

export function SkillGrid({ skills, loading = false, onSkillClick }: SkillGridProps) {
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<SkillDifficulty | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === 'all' || skill.difficulty === difficultyFilter;
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [skills, categoryFilter, difficultyFilter, searchQuery]);

  const stats = useMemo(() => {
    const completed = skills.filter(s => s.progress === 100).length;
    const inProgress = skills.filter(s => s.progress && s.progress > 0 && s.progress < 100).length;
    const notStarted = skills.filter(s => !s.progress || s.progress === 0).length;
    return { completed, inProgress, notStarted, total: skills.length };
  }, [skills]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-10 w-64 bg-muted rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkillCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm"><strong>{stats.completed}</strong> completados</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm"><strong>{stats.inProgress}</strong> en progreso</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span className="text-sm"><strong>{stats.notStarted}</strong> por iniciar</span>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          {filteredSkills.length} de {stats.total} skills
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {categoryFilters.map(filter => (
            <Badge
              key={filter.value}
              variant={categoryFilter === filter.value ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-all hover:scale-105',
                categoryFilter === filter.value && 'shadow-md'
              )}
              onClick={() => setCategoryFilter(filter.value)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>

        {/* Difficulty filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          {difficultyFilters.map(filter => (
            <Badge
              key={filter.value}
              variant={difficultyFilter === filter.value ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-all hover:scale-105',
                difficultyFilter === filter.value && 'shadow-md'
              )}
              onClick={() => setDifficultyFilter(filter.value)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 rounded-md transition-all',
              viewMode === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded-md transition-all',
              viewMode === 'list' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Skills grid/list */}
      {filteredSkills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No se encontraron skills</h3>
          <p className="text-muted-foreground mt-1">Intenta con otros filtros o terminos de busqueda</p>
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
        )}>
          {filteredSkills.map(skill => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onClick={onSkillClick}
              className={viewMode === 'list' ? 'flex-row' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
