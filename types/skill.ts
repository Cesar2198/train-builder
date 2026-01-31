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

// Badge System Types
export type BadgeLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type BadgeStatus = 'locked' | 'unlocked' | 'in-progress';

export interface Badge {
  id: string;
  name: string;
  description: string;
  level: BadgeLevel;
  icon: string;
  skillId: string;
  requiredScore: number;
  unlockedAt?: Date;
  status: BadgeStatus;
}

export interface ExamResult {
  id: string;
  skillId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  completedAt: Date;
  answers: ExamAnswer[];
  feedback: ExamFeedback;
  badgeEarned?: Badge;
}

export interface ExamAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeToAnswer: number; // in seconds
}

export interface ExamFeedback {
  overallGrade: string;
  percentage: number;
  strengths: string[];
  areasToImprove: string[];
  recommendations: string[];
  personalizedMessage: string;
}

// Agent Types
export interface AgentConfig {
  id: string;
  name: string;
  type: 'content-generator' | 'quiz-generator' | 'evaluator';
  description: string;
  icon: string;
  isActive: boolean;
}

export interface ContentGeneratorInput {
  skillId: string;
  skillName: string;
  difficulty: SkillDifficulty;
  category: SkillCategory;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuizGeneratorInput {
  skillId: string;
  difficulty: SkillDifficulty;
  numberOfQuestions: number;
  topics: string[];
  previousResults?: ExamResult[];
}

export interface EvaluatorInput {
  examResult: ExamResult;
  skill: Skill;
  previousBadges: Badge[];
}
