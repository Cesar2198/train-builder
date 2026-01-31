export type SkillDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillCategory = 'agile' | 'development' | 'design' | 'devops' | 'soft-skills' | 'data';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  difficulty: SkillDifficulty;
  description?: string;
  icon?: string;
  estimatedTime?: string;
  progress?: number;
}

export interface LearningObjective {
  id: string;
  title: string;
  description: string;
}

export interface MicroLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed?: boolean;
  content?: string;
}

export interface VideoResource {
  id: string;
  title: string;
  platform: 'youtube' | 'vimeo' | 'custom';
  thumbnail?: string;
  duration?: string;
  structure?: {
    intro: string;
    demo: string;
    conclusion: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface SkillContent {
  skillId: string;
  objective: LearningObjective;
  microLessons: MicroLesson[];
  videoResources: VideoResource[];
  quiz: QuizQuestion[];
}
