export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SkillDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillCategory = 'agile' | 'development' | 'design' | 'devops' | 'soft-skills' | 'data';
export type BadgeLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type ContentStatus = 'draft' | 'published' | 'archived';

export interface Database {
  public: {
    Tables: {
      skills: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: SkillCategory;
          difficulty: SkillDifficulty;
          icon: string | null;
          estimated_time: string | null;
          status: ContentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category: SkillCategory;
          difficulty: SkillDifficulty;
          icon?: string | null;
          estimated_time?: string | null;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: SkillCategory;
          difficulty?: SkillDifficulty;
          icon?: string | null;
          estimated_time?: string | null;
          status?: ContentStatus;
          updated_at?: string;
        };
      };
      learning_objectives: {
        Row: {
          id: string;
          skill_id: string;
          title: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          skill_id: string;
          title: string;
          description: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
        };
      };
      micro_lessons: {
        Row: {
          id: string;
          skill_id: string;
          title: string;
          description: string;
          duration: string;
          content: string | null;
          order_index: number;
          is_ai_generated: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          skill_id: string;
          title: string;
          description: string;
          duration: string;
          content?: string | null;
          order_index: number;
          is_ai_generated?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          duration?: string;
          content?: string | null;
          order_index?: number;
          is_ai_generated?: boolean;
          updated_at?: string;
        };
      };
      quiz_questions: {
        Row: {
          id: string;
          skill_id: string;
          question: string;
          options: string[];
          correct_answer: number;
          explanation: string | null;
          difficulty: SkillDifficulty;
          is_ai_generated: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          skill_id: string;
          question: string;
          options: string[];
          correct_answer: number;
          explanation?: string | null;
          difficulty: SkillDifficulty;
          is_ai_generated?: boolean;
          created_at?: string;
        };
        Update: {
          question?: string;
          options?: string[];
          correct_answer?: number;
          explanation?: string | null;
          difficulty?: SkillDifficulty;
        };
      };
      video_resources: {
        Row: {
          id: string;
          skill_id: string;
          title: string;
          platform: 'youtube' | 'vimeo' | 'custom';
          url: string | null;
          duration: string | null;
          structure_intro: string | null;
          structure_demo: string | null;
          structure_conclusion: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          skill_id: string;
          title: string;
          platform: 'youtube' | 'vimeo' | 'custom';
          url?: string | null;
          duration?: string | null;
          structure_intro?: string | null;
          structure_demo?: string | null;
          structure_conclusion?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          platform?: 'youtube' | 'vimeo' | 'custom';
          url?: string | null;
          duration?: string | null;
          structure_intro?: string | null;
          structure_demo?: string | null;
          structure_conclusion?: string | null;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string;
          progress_percentage: number;
          lessons_completed: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_id: string;
          progress_percentage?: number;
          lessons_completed?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          progress_percentage?: number;
          lessons_completed?: string[];
          updated_at?: string;
        };
      };
      exam_results: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string;
          score: number;
          total_questions: number;
          correct_answers: number;
          time_spent: number;
          answers: Json;
          feedback: Json;
          badge_earned: BadgeLevel | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_id: string;
          score: number;
          total_questions: number;
          correct_answers: number;
          time_spent: number;
          answers: Json;
          feedback: Json;
          badge_earned?: BadgeLevel | null;
          created_at?: string;
        };
        Update: {
          score?: number;
          feedback?: Json;
          badge_earned?: BadgeLevel | null;
        };
      };
      badges: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string;
          level: BadgeLevel;
          name: string;
          description: string;
          score_achieved: number;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_id: string;
          level: BadgeLevel;
          name: string;
          description: string;
          score_achieved: number;
          unlocked_at?: string;
        };
        Update: {
          level?: BadgeLevel;
          name?: string;
          description?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      skill_difficulty: SkillDifficulty;
      skill_category: SkillCategory;
      badge_level: BadgeLevel;
      content_status: ContentStatus;
    };
  };
}

// Helper types
export type Skill = Database['public']['Tables']['skills']['Row'];
export type SkillInsert = Database['public']['Tables']['skills']['Insert'];
export type LearningObjective = Database['public']['Tables']['learning_objectives']['Row'];
export type MicroLesson = Database['public']['Tables']['micro_lessons']['Row'];
export type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row'];
export type VideoResource = Database['public']['Tables']['video_resources']['Row'];
export type UserProgress = Database['public']['Tables']['user_progress']['Row'];
export type ExamResult = Database['public']['Tables']['exam_results']['Row'];
export type Badge = Database['public']['Tables']['badges']['Row'];

// Extended types with relations
export interface SkillWithContent extends Skill {
  learning_objectives: LearningObjective[];
  micro_lessons: MicroLesson[];
  quiz_questions: QuizQuestion[];
  video_resources: VideoResource[];
  user_progress?: UserProgress;
}
