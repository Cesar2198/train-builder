'use client';

import { Badge as BadgeType, BadgeLevel } from '@/types/skill';
import { cn } from '@/lib/utils';
import {
  Award,
  Medal,
  Trophy,
  Crown,
  Gem,
  Lock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface BadgeCardProps {
  badge: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

const badgeConfig: Record<BadgeLevel, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  name: string;
}> = {
  bronze: {
    icon: Medal,
    color: 'text-amber-700',
    bgColor: 'bg-gradient-to-br from-amber-100 to-amber-200',
    borderColor: 'border-amber-400',
    glowColor: 'shadow-amber-500/30',
    name: 'Bronce'
  },
  silver: {
    icon: Award,
    color: 'text-slate-600',
    bgColor: 'bg-gradient-to-br from-slate-100 to-slate-200',
    borderColor: 'border-slate-400',
    glowColor: 'shadow-slate-500/30',
    name: 'Plata'
  },
  gold: {
    icon: Trophy,
    color: 'text-yellow-600',
    bgColor: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
    borderColor: 'border-yellow-400',
    glowColor: 'shadow-yellow-500/30',
    name: 'Oro'
  },
  platinum: {
    icon: Crown,
    color: 'text-cyan-600',
    bgColor: 'bg-gradient-to-br from-cyan-100 to-cyan-200',
    borderColor: 'border-cyan-400',
    glowColor: 'shadow-cyan-500/30',
    name: 'Platino'
  },
  diamond: {
    icon: Gem,
    color: 'text-violet-600',
    bgColor: 'bg-gradient-to-br from-violet-100 to-violet-200',
    borderColor: 'border-violet-400',
    glowColor: 'shadow-violet-500/30',
    name: 'Diamante'
  },
};

const sizeConfig = {
  sm: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-24 h-24', icon: 'w-12 h-12', text: 'text-sm' },
  lg: { container: 'w-32 h-32', icon: 'w-16 h-16', text: 'text-base' },
};

export function BadgeCard({ badge, size = 'md', showDetails = true, className }: BadgeCardProps) {
  const config = badgeConfig[badge.level];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;
  const isUnlocked = badge.status === 'unlocked';

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Badge icon */}
      <div className="relative">
        <div
          className={cn(
            'relative rounded-full flex items-center justify-center border-4 transition-all duration-300',
            sizeStyles.container,
            isUnlocked
              ? cn(config.bgColor, config.borderColor, 'shadow-lg', config.glowColor)
              : 'bg-muted border-muted-foreground/20 grayscale'
          )}
        >
          {isUnlocked ? (
            <Icon className={cn(sizeStyles.icon, config.color)} />
          ) : (
            <Lock className={cn(sizeStyles.icon, 'text-muted-foreground')} />
          )}

          {/* Sparkle effect for unlocked */}
          {isUnlocked && (
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
            </div>
          )}

          {/* Completed checkmark */}
          {isUnlocked && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Glow ring for unlocked */}
        {isUnlocked && (
          <div
            className={cn(
              'absolute inset-0 rounded-full animate-ping opacity-20',
              config.bgColor
            )}
            style={{ animationDuration: '2s' }}
          />
        )}
      </div>

      {/* Badge details */}
      {showDetails && (
        <div className="text-center space-y-1">
          <p className={cn(
            'font-semibold',
            sizeStyles.text,
            isUnlocked ? config.color : 'text-muted-foreground'
          )}>
            {config.name}
          </p>
          <p className={cn(
            'text-muted-foreground line-clamp-2',
            size === 'sm' ? 'text-[10px]' : 'text-xs'
          )}>
            {badge.name}
          </p>
          {badge.unlockedAt && isUnlocked && (
            <p className="text-[10px] text-muted-foreground">
              {new Date(badge.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
