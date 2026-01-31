import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { skillId, skillName, difficulty, numberOfQuestions = 10, topics = [] } = await request.json();

    if (!skillId || !skillName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const topicsText = topics.length > 0
      ? `Temas específicos a evaluar: ${topics.join(', ')}`
      : '';

    const prompt = `Eres un experto en evaluación educativa.

Genera ${numberOfQuestions} preguntas de opción múltiple para evaluar "${skillName}" a nivel ${difficulty}.
${topicsText}

Requisitos:
- Las preguntas deben ser claras y sin ambigüedades
- 4 opciones de respuesta por pregunta
- Solo una respuesta correcta
- Incluir explicación de por qué la respuesta es correcta
- Variar la dificultad dentro del nivel ${difficulty}
- Las preguntas deben ser prácticas y aplicables

Responde en formato JSON válido:
{
  "questions": [
    {
      "question": "string",
      "options": ["opción A", "opción B", "opción C", "opción D"],
      "correctAnswer": 0,
      "explanation": "string",
      "difficulty": "${difficulty}"
    }
  ]
}

IMPORTANTE: correctAnswer es el índice (0-3) de la opción correcta en el array options.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un generador de exámenes educativos. Siempre respondes en JSON válido.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const content = JSON.parse(completion.choices[0].message.content || '{}');

    // Save to Supabase
    const supabase = await createServerSupabaseClient();

    if (content.questions?.length > 0) {
      const questionsToInsert = content.questions.map((q: any) => ({
        skill_id: skillId,
        question: q.question,
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty || difficulty,
        is_ai_generated: true,
      }));

      // Delete existing AI-generated questions first (optional, comment out to keep accumulating)
      await supabase
        .from('quiz_questions')
        .delete()
        .eq('skill_id', skillId)
        .eq('is_ai_generated', true);

      await supabase.from('quiz_questions').insert(questionsToInsert as never);
    }

    return NextResponse.json({
      success: true,
      questions: content.questions,
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
