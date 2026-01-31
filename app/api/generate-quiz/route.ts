import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Demo quiz generator when OpenAI is not available
function generateDemoQuiz(skillName: string, difficulty: string, numberOfQuestions: number) {
  const questionTemplates = [
    {
      q: `Cual es el principal objetivo de ${skillName}?`,
      opts: ['Mejorar la productividad', 'Reducir costos', 'Aumentar la calidad', 'Todas las anteriores'],
      correct: 3,
      exp: 'Todos estos son objetivos importantes que se pueden lograr.',
    },
    {
      q: `En que contexto es mas util aplicar ${skillName}?`,
      opts: ['Proyectos pequenos', 'Equipos grandes', 'Cualquier contexto', 'Solo en startups'],
      correct: 2,
      exp: 'Se puede aplicar en diversos contextos adaptando las practicas.',
    },
    {
      q: `Cual es una buena practica al implementar ${skillName}?`,
      opts: ['Implementar todo de golpe', 'Comenzar gradualmente', 'Ignorar la retroalimentacion', 'Evitar documentacion'],
      correct: 1,
      exp: 'Es mejor comenzar gradualmente para permitir adaptacion.',
    },
    {
      q: `Que rol es fundamental para ${skillName}?`,
      opts: ['Solo el lider', 'Todo el equipo', 'Solo los desarrolladores', 'Solo el cliente'],
      correct: 1,
      exp: 'El exito depende de la participacion de todo el equipo.',
    },
    {
      q: `Cual es un error comun al aplicar ${skillName}?`,
      opts: ['Medir resultados', 'No capacitar al equipo', 'Iterar frecuentemente', 'Documentar procesos'],
      correct: 1,
      exp: 'No capacitar al equipo es un error que limita el exito.',
    },
    {
      q: `Que beneficio principal ofrece ${skillName}?`,
      opts: ['Mayor complejidad', 'Mejor comunicacion', 'Procesos mas lentos', 'Menos colaboracion'],
      correct: 1,
      exp: 'La mejor comunicacion es uno de los beneficios principales.',
    },
    {
      q: `Como se mide el exito de ${skillName}?`,
      opts: ['Solo por costos', 'Por multiples metricas', 'No se puede medir', 'Solo por tiempo'],
      correct: 1,
      exp: 'Se deben usar multiples metricas para una evaluacion completa.',
    },
    {
      q: `Cual es el primer paso para adoptar ${skillName}?`,
      opts: ['Comprar herramientas', 'Entender el contexto', 'Cambiar todo', 'Contratar consultores'],
      correct: 1,
      exp: 'Entender el contexto actual es fundamental antes de hacer cambios.',
    },
    {
      q: `Que caracteristica NO es tipica de ${skillName}?`,
      opts: ['Flexibilidad', 'Rigidez extrema', 'Adaptabilidad', 'Mejora continua'],
      correct: 1,
      exp: 'La rigidez extrema va en contra de los principios de esta practica.',
    },
    {
      q: `Como se mantiene la efectividad de ${skillName} a largo plazo?`,
      opts: ['Nunca cambiando', 'Con mejora continua', 'Ignorando feedback', 'Sin mediciones'],
      correct: 1,
      exp: 'La mejora continua es esencial para mantener la efectividad.',
    },
  ];

  const questions = [];
  for (let i = 0; i < numberOfQuestions; i++) {
    const template = questionTemplates[i % questionTemplates.length];
    questions.push({
      question: template.q,
      options: template.opts,
      correctAnswer: template.correct,
      explanation: template.exp,
      difficulty,
    });
  }

  return { questions };
}

export async function POST(request: NextRequest) {
  try {
    const { skillId, skillName, difficulty, numberOfQuestions = 10, topics = [] } = await request.json();

    if (!skillId || !skillName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let content;

    try {
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

      content = JSON.parse(completion.choices[0].message.content || '{}');
    } catch (aiError) {
      console.log('OpenAI not available, using demo quiz:', aiError);
      content = generateDemoQuiz(skillName, difficulty, numberOfQuestions);
    }

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

      // Delete existing AI-generated questions first
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
