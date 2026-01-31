'use client';

import { useState } from 'react';
import { Badge as BadgeType, BadgeLevel } from '@/types/skill';
import { BadgeCard } from './BadgeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Award,
  Filter,
  Trophy,
  Star,
  TrendingUp
} from 'lucide-react';

interface BadgeShowcaseProps {
  badges: BadgeType[];
  title?: string;
  className?: string;
}

const levelOrder: BadgeLevel[] = ['diamond', 'platinum', 'gold', 'silver', 'bronze'];

export function BadgeShowcase({ badges, title = 'Mis Badges', className }: BadgeShowcaseProps) {
  const [filter, setFilter] = useState<BadgeLevel | 'all'>('all');

  const unlockedBadges = badges.filter(b => b.status === 'unlocked');
  const lockedBadges = badges.filter(b => b.status !== 'unlocked');

  const filteredBadges = filter === 'all'
    ? badges
    : badges.filter(b => b.level === filter);

  // Sort by level (diamond first)
  const sortedBadges = [...filteredBadges].sort((a, b) => {
    return levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level);
  });

  // Stats
  const stats = {
    total: badges.length,
    unlocked: unlockedBadges.length,
    diamond: badges.filter(b => b.level === 'diamond' && b.status === 'unlocked').length,
    platinum: badges.filter(b => b.level === 'platinum' && b.status === 'unlocked').length,
    gold: badges.filter(b => b.level === 'gold' && b.status === 'unlocked').length,
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {stats.unlocked} de {stats.total} badges desbloqueados
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-2">
            {stats.diamond > 0 && (
              <Badge className="bg-violet-500/20 text-violet-600 border-violet-500/30">
                {stats.diamond} Diamante
              </Badge>
            )}
            {stats.platinum > 0 && (
              <Badge className="bg-cyan-500/20 text-cyan-600 border-cyan-500/30">
                {stats.platinum} Platino
              </Badge>
            )}
            {stats.gold > 0 && (
              <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                {stats.gold} Oro
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(['all', ...levelOrder] as const).map(level => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                filter === level
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              {level === 'all' ? 'Todos' : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso total</span>
            <span className="font-medium">
              {Math.round((stats.unlocked / stats.total) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 transition-all duration-500"
              style={{ width: `${(stats.unlocked / stats.total) * 100}%` }}
            />
          </div>
        </div>

        {/* Badges grid */}
        {sortedBadges.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay badges en esta categoria</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {sortedBadges.map(badge => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                size="md"
              />
            ))}
          </div>
        )}

        {/* Motivation message */}
        {lockedBadges.length > 0 && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <TrendingUp className="w-5 h-5 text-primary" />
            <p className="text-sm">
              <strong>{lockedBadges.length} badges</strong> por desbloquear.
              Completa mas examenes para ganar nuevas insignias!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
