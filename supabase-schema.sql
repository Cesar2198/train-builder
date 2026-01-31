-- Train Builder Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE skill_difficulty AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE skill_category AS ENUM ('agile', 'development', 'design', 'devops', 'soft-skills', 'data');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE badge_level AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category skill_category NOT NULL,
    difficulty skill_difficulty NOT NULL,
    icon VARCHAR(50),
    estimated_time VARCHAR(50),
    status content_status DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning objectives table
CREATE TABLE IF NOT EXISTS learning_objectives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Micro lessons table
CREATE TABLE IF NOT EXISTS micro_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    content TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT,
    difficulty skill_difficulty NOT NULL,
    is_ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video resources table
CREATE TABLE IF NOT EXISTS video_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('youtube', 'vimeo', 'custom')),
    url TEXT,
    duration VARCHAR(20),
    structure_intro TEXT,
    structure_demo TEXT,
    structure_conclusion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    lessons_completed UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- Exam results table
CREATE TABLE IF NOT EXISTS exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_spent INTEGER NOT NULL, -- in seconds
    answers JSONB NOT NULL,
    feedback JSONB NOT NULL,
    badge_earned badge_level,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    level badge_level NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    score_achieved INTEGER NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id, level)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_difficulty ON skills(difficulty);
CREATE INDEX IF NOT EXISTS idx_skills_status ON skills(status);
CREATE INDEX IF NOT EXISTS idx_micro_lessons_skill ON micro_lessons(skill_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_skill ON quiz_questions(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_user ON exam_results(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_user ON badges(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to skills and content
CREATE POLICY "Skills are viewable by everyone" ON skills FOR SELECT USING (true);
CREATE POLICY "Learning objectives are viewable by everyone" ON learning_objectives FOR SELECT USING (true);
CREATE POLICY "Micro lessons are viewable by everyone" ON micro_lessons FOR SELECT USING (true);
CREATE POLICY "Quiz questions are viewable by everyone" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Video resources are viewable by everyone" ON video_resources FOR SELECT USING (true);

-- Policies for user-specific data (using anon for demo, in prod use auth.uid())
CREATE POLICY "User progress is viewable by everyone" ON user_progress FOR SELECT USING (true);
CREATE POLICY "User progress can be inserted by everyone" ON user_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "User progress can be updated by everyone" ON user_progress FOR UPDATE USING (true);

CREATE POLICY "Exam results are viewable by everyone" ON exam_results FOR SELECT USING (true);
CREATE POLICY "Exam results can be inserted by everyone" ON exam_results FOR INSERT WITH CHECK (true);

CREATE POLICY "Badges are viewable by everyone" ON badges FOR SELECT USING (true);
CREATE POLICY "Badges can be inserted by everyone" ON badges FOR INSERT WITH CHECK (true);

-- Insert policies for content (for admin/AI generation)
CREATE POLICY "Content can be inserted" ON micro_lessons FOR INSERT WITH CHECK (true);
CREATE POLICY "Content can be updated" ON micro_lessons FOR UPDATE USING (true);
CREATE POLICY "Quiz can be inserted" ON quiz_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Skills can be inserted" ON skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Skills can be updated" ON skills FOR UPDATE USING (true);
CREATE POLICY "Learning objectives can be inserted" ON learning_objectives FOR INSERT WITH CHECK (true);
CREATE POLICY "Video resources can be inserted" ON video_resources FOR INSERT WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_micro_lessons_updated_at ON micro_lessons;
CREATE TRIGGER update_micro_lessons_updated_at
    BEFORE UPDATE ON micro_lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample skills
INSERT INTO skills (name, description, category, difficulty, icon, estimated_time) VALUES
('Creacion de HUs', 'Aprende a crear Historias de Usuario efectivas siguiendo las mejores practicas de metodologias agiles.', 'agile', 'intermediate', 'FileText', '2 horas'),
('React Hooks', 'Domina los hooks de React: useState, useEffect, useContext y hooks personalizados.', 'development', 'intermediate', 'Code', '4 horas'),
('Figma Fundamentals', 'Introduccion al diseno de interfaces con Figma: componentes, auto-layout y prototipos.', 'design', 'beginner', 'Palette', '3 horas'),
('Docker & Containers', 'Contenedorizacion de aplicaciones con Docker: imagenes, volumenes y orquestacion.', 'devops', 'advanced', 'Container', '5 horas'),
('Comunicacion Efectiva', 'Mejora tus habilidades de comunicacion en equipos de trabajo remotos y presenciales.', 'soft-skills', 'beginner', 'MessageCircle', '1.5 horas'),
('SQL Fundamentals', 'Consultas basicas y avanzadas en SQL: SELECT, JOIN, subqueries y optimizacion.', 'data', 'beginner', 'Database', '3 horas'),
('TypeScript Avanzado', 'Tipos genericos, utility types, decorators y patrones avanzados en TypeScript.', 'development', 'advanced', 'Code', '6 horas'),
('Scrum Master', 'Certificacion como Scrum Master: roles, ceremonias, artefactos y facilitacion.', 'agile', 'intermediate', 'Users', '8 horas')
ON CONFLICT DO NOTHING;
