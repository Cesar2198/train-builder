import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { skillId, skillName, difficulty, category, numberOfLessons = 4 } = await request.json();

    if (!skillId || !skillName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate content using AI
    const prompt = `Eres un experto en pedagogía digital y creación de contenido educativo técnico.

Genera ${numberOfLessons} micro-lecciones para enseñar "${skillName}" a nivel ${difficulty}.
Categoría: ${category}

Para cada lección, proporciona:
1. Título (conciso y descriptivo)
2. Descripción (1-2 oraciones)
3. Duración estimada (ej: "20 min")
4. Contenido en formato Markdown que incluya:
   - Introducción al tema
   - Conceptos clave con ejemplos
   - Una tabla comparativa si aplica
   - Bloques de código si es técnico
   - Tips prácticos

Responde en formato JSON válido:
{
  "lessons": [
    {
      "title": "string",
      "description": "string",
      "duration": "string",
      "content": "string (markdown)"
    }
  ],
  "objective": {
    "title": "string",
    "description": "string"
  },
  "videoSuggestions": [
    {
      "title": "string",
      "platform": "youtube",
      "duration": "string",
      "structureIntro": "string",
      "structureDemo": "string",
      "structureConclusion": "string"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un generador de contenido educativo. Siempre respondes en JSON válido sin caracteres adicionales.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = JSON.parse(completion.choices[0].message.content || '{}');

    // Save to Supabase
    const supabase = await createServerSupabaseClient();

    // Insert learning objective
    if (content.objective) {
      const objectiveData = {
        skill_id: skillId,
        title: content.objective.title,
        description: content.objective.description,
      };
      await supabase.from('learning_objectives').upsert(objectiveData as never, { onConflict: 'skill_id' });
    }

    // Insert micro lessons
    if (content.lessons?.length > 0) {
      const lessonsToInsert = content.lessons.map((lesson: any, index: number) => ({
        skill_id: skillId,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        content: lesson.content,
        order_index: index,
        is_ai_generated: true,
      }));

      // Delete existing AI-generated lessons first
      await supabase
        .from('micro_lessons')
        .delete()
        .eq('skill_id', skillId)
        .eq('is_ai_generated', true);

      await supabase.from('micro_lessons').insert(lessonsToInsert as never);
    }

    // Insert video suggestions
    if (content.videoSuggestions?.length > 0) {
      const videosToInsert = content.videoSuggestions.map((video: any) => ({
        skill_id: skillId,
        title: video.title,
        platform: video.platform || 'youtube',
        duration: video.duration,
        structure_intro: video.structureIntro,
        structure_demo: video.structureDemo,
        structure_conclusion: video.structureConclusion,
      }));

      await supabase.from('video_resources').insert(videosToInsert as never);
    }

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
