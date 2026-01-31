import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { BadgeLevel } from '@/types/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getBadgeLevel(percentage: number): BadgeLevel | null {
  if (percentage >= 95) return 'diamond';
  if (percentage >= 90) return 'platinum';
  if (percentage >= 80) return 'gold';
  if (percentage >= 70) return 'silver';
  if (percentage >= 60) return 'bronze';
  return null;
}

function calculateGrade(percentage: number): string {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 87) return 'B+';
  if (percentage >= 80) return 'B';
  if (percentage >= 73) return 'C+';
  if (percentage >= 65) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      skillId,
      skillName,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      answers,
      questionsData,
    } = await request.json();

    if (!userId || !skillId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const grade = calculateGrade(percentage);
    const badgeLevel = getBadgeLevel(percentage);

    // Generate AI feedback
    const incorrectQuestions = questionsData?.filter((_: any, i: number) => !answers[i]?.isCorrect) || [];
    const incorrectTopics = incorrectQuestions.map((q: any) => q.question).slice(0, 3);

    const prompt = `Eres un tutor educativo experto. Un estudiante acaba de completar un examen sobre "${skillName}".

Resultados:
- Puntaje: ${percentage}%
- Correctas: ${correctAnswers}/${totalQuestions}
- Calificación: ${grade}
- Tiempo: ${Math.floor(timeSpent / 60)} minutos ${timeSpent % 60} segundos

Preguntas incorrectas (si hay):
${incorrectTopics.length > 0 ? incorrectTopics.join('\n- ') : 'Ninguna, respondió todo correctamente!'}

Genera una evaluación personalizada con:
1. Fortalezas identificadas (2-3 puntos)
2. Áreas de mejora (2-3 puntos específicos basados en las preguntas incorrectas)
3. Recomendaciones de estudio (2-3 acciones concretas)
4. Un mensaje motivacional personalizado (2-3 oraciones)

Responde en JSON:
{
  "strengths": ["string", "string"],
  "areasToImprove": ["string", "string"],
  "recommendations": ["string", "string"],
  "personalizedMessage": "string"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un tutor educativo amable y motivador. Siempre respondes en JSON válido en español.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const aiFeedback = JSON.parse(completion.choices[0].message.content || '{}');

    const feedback = {
      overallGrade: grade,
      percentage,
      ...aiFeedback,
    };

    // Save to Supabase
    const supabase = await createServerSupabaseClient();

    // Save exam result - using raw query to avoid type issues
    const examResultData = {
      user_id: userId,
      skill_id: skillId,
      score: percentage,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      time_spent: timeSpent,
      answers,
      feedback,
      badge_earned: badgeLevel,
    };

    const { data: examResult, error: examError } = await supabase
      .from('exam_results')
      .insert(examResultData as never)
      .select()
      .single();

    if (examError) {
      console.error('Exam result error:', examError);
      // Continue without throwing - we still have feedback
    }

    // Award badge if earned
    let badge = null;
    if (badgeLevel) {
      const badgeNames: Record<BadgeLevel, string> = {
        bronze: 'Bronce',
        silver: 'Plata',
        gold: 'Oro',
        platinum: 'Platino',
        diamond: 'Diamante',
      };

      const { data: existingBadge } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', userId)
        .eq('skill_id', skillId)
        .eq('level', badgeLevel)
        .single();

      if (!existingBadge) {
        const badgeData = {
          user_id: userId,
          skill_id: skillId,
          level: badgeLevel,
          name: `${badgeNames[badgeLevel]} en ${skillName}`,
          description: `Obtuviste ${percentage}% en el examen de ${skillName}`,
          score_achieved: percentage,
        };

        const { data: newBadge } = await supabase
          .from('badges')
          .insert(badgeData as never)
          .select()
          .single();

        badge = newBadge;
      } else {
        badge = existingBadge;
      }
    }

    // Update user progress
    const progressData = {
      user_id: userId,
      skill_id: skillId,
      progress_percentage: Math.max(percentage, 0),
    };

    await supabase
      .from('user_progress')
      .upsert(progressData as never, { onConflict: 'user_id,skill_id' });

    return NextResponse.json({
      success: true,
      examResult,
      feedback,
      badge,
    });
  } catch (error) {
    console.error('Error evaluating exam:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate exam' },
      { status: 500 }
    );
  }
}
