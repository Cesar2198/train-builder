'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Skill, SkillWithContent, MicroLesson, QuizQuestion, LearningObjective, VideoResource, UserProgress } from '@/types/database';

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSkills(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching skills');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return { skills, loading, error, refetch: fetchSkills };
}

export function useSkill(skillId: string | null) {
  const [skill, setSkill] = useState<SkillWithContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchSkill = useCallback(async () => {
    if (!skillId) {
      setSkill(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch skill with all related content
      const { data: skillData, error: skillError } = await supabase
        .from('skills')
        .select('*')
        .eq('id', skillId)
        .single();

      if (skillError) throw skillError;
      if (!skillData) throw new Error('Skill not found');

      // Fetch related data in parallel
      const [objectives, lessons, questions, videos] = await Promise.all([
        supabase.from('learning_objectives').select('*').eq('skill_id', skillId),
        supabase.from('micro_lessons').select('*').eq('skill_id', skillId).order('order_index'),
        supabase.from('quiz_questions').select('*').eq('skill_id', skillId),
        supabase.from('video_resources').select('*').eq('skill_id', skillId),
      ]);

      const skillWithContent: SkillWithContent = {
        ...(skillData as Skill),
        learning_objectives: (objectives.data || []) as LearningObjective[],
        micro_lessons: (lessons.data || []) as MicroLesson[],
        quiz_questions: (questions.data || []) as QuizQuestion[],
        video_resources: (videos.data || []) as VideoResource[],
      };

      setSkill(skillWithContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching skill');
    } finally {
      setLoading(false);
    }
  }, [skillId, supabase]);

  useEffect(() => {
    fetchSkill();
  }, [fetchSkill]);

  return { skill, loading, error, refetch: fetchSkill };
}

export function useUserProgress(userId: string, skillId: string | null) {
  const [progress, setProgress] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const supabase = createClient();

  const fetchProgress = useCallback(async () => {
    if (!skillId) return;

    const { data } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('skill_id', skillId)
      .single();

    const progressData = data as UserProgress | null;
    if (progressData) {
      setProgress(progressData.progress_percentage);
      setCompletedLessons(progressData.lessons_completed || []);
    }
  }, [userId, skillId, supabase]);

  const updateProgress = async (lessonId: string, totalLessons: number) => {
    if (!skillId) return;

    const newCompleted = [...new Set([...completedLessons, lessonId])];
    const newProgress = Math.round((newCompleted.length / totalLessons) * 100);

    const upsertData = {
      user_id: userId,
      skill_id: skillId,
      progress_percentage: newProgress,
      lessons_completed: newCompleted,
    };

    const { error } = await supabase
      .from('user_progress')
      .upsert(upsertData as never, {
        onConflict: 'user_id,skill_id'
      });

    if (!error) {
      setProgress(newProgress);
      setCompletedLessons(newCompleted);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, completedLessons, updateProgress };
}

export function useBadges(userId: string) {
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchBadges = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*, skills(name)')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (err) {
      console.error('Error fetching badges:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  return { badges, loading, refetch: fetchBadges };
}

export function useExamResults(userId: string, skillId?: string) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchResults = useCallback(async () => {
    try {
      let query = supabase
        .from('exam_results')
        .select('*, skills(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (skillId) {
        query = query.eq('skill_id', skillId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error('Error fetching exam results:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, skillId, supabase]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return { results, loading, refetch: fetchResults };
}
