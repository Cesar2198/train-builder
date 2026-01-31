import { Skill, SkillContent } from '@/types/skill';

export const skills: Skill[] = [
  {
    id: 'hu-creation',
    name: 'Creacion de HUs',
    category: 'agile',
    difficulty: 'intermediate',
    description: 'Aprende a crear Historias de Usuario efectivas siguiendo las mejores practicas de metodologias agiles.',
    icon: 'FileText',
    estimatedTime: '2 horas',
    progress: 0,
  },
  {
    id: 'react-hooks',
    name: 'React Hooks',
    category: 'development',
    difficulty: 'intermediate',
    description: 'Domina los hooks de React: useState, useEffect, useContext y hooks personalizados.',
    icon: 'Code',
    estimatedTime: '4 horas',
    progress: 35,
  },
  {
    id: 'figma-basics',
    name: 'Figma Fundamentals',
    category: 'design',
    difficulty: 'beginner',
    description: 'Introduccion al diseno de interfaces con Figma: componentes, auto-layout y prototipos.',
    icon: 'Palette',
    estimatedTime: '3 horas',
    progress: 100,
  },
  {
    id: 'docker-containers',
    name: 'Docker & Containers',
    category: 'devops',
    difficulty: 'advanced',
    description: 'Contenedorizacion de aplicaciones con Docker: imagenes, volumenes y orquestacion.',
    icon: 'Container',
    estimatedTime: '5 horas',
    progress: 60,
  },
  {
    id: 'communication',
    name: 'Comunicacion Efectiva',
    category: 'soft-skills',
    difficulty: 'beginner',
    description: 'Mejora tus habilidades de comunicacion en equipos de trabajo remotos y presenciales.',
    icon: 'MessageCircle',
    estimatedTime: '1.5 horas',
    progress: 20,
  },
  {
    id: 'sql-fundamentals',
    name: 'SQL Fundamentals',
    category: 'data',
    difficulty: 'beginner',
    description: 'Consultas basicas y avanzadas en SQL: SELECT, JOIN, subqueries y optimizacion.',
    icon: 'Database',
    estimatedTime: '3 horas',
    progress: 0,
  },
];

export const skillContents: Record<string, SkillContent> = {
  'hu-creation': {
    skillId: 'hu-creation',
    objective: {
      id: 'obj-1',
      title: 'Dominar la Creacion de Historias de Usuario',
      description: 'Al finalizar este modulo, seras capaz de redactar HUs claras, medibles y alineadas con las necesidades del negocio utilizando el formato estandar y criterios INVEST.',
    },
    microLessons: [
      {
        id: 'ml-1',
        title: 'Fundamentos de las Historias de Usuario',
        description: 'Que es una HU, su origen en XP y por que son esenciales en Agile.',
        duration: '20 min',
        completed: false,
        content: `
## Que es una Historia de Usuario?

Una **Historia de Usuario (HU)** es una descripcion corta y simple de una funcionalidad contada desde la perspectiva del usuario final.

### Formato Estandar

\`\`\`
Como [tipo de usuario]
Quiero [realizar una accion]
Para [obtener un beneficio]
\`\`\`

### Ejemplo Practico

\`\`\`
Como cliente de la tienda online
Quiero filtrar productos por precio
Para encontrar opciones dentro de mi presupuesto
\`\`\`

### Caracteristicas Clave
- **Centrada en el usuario**: No en la implementacion tecnica
- **Negociable**: Es una invitacion a la conversacion
- **Valiosa**: Debe entregar valor al negocio o usuario
        `,
      },
      {
        id: 'ml-2',
        title: 'Criterios INVEST',
        description: 'Aprende a validar la calidad de tus HUs con los 6 criterios INVEST.',
        duration: '25 min',
        completed: false,
        content: `
## Criterios INVEST

| Criterio | Significado | Pregunta Clave |
|----------|-------------|----------------|
| **I**ndependiente | Sin dependencias | Puede completarse sin otra HU? |
| **N**egociable | Flexible en detalles | Permite discusion? |
| **V**aliosa | Aporta valor | Beneficia al usuario/negocio? |
| **E**stimable | Se puede estimar | El equipo puede dimensionarla? |
| **S**mall (Pequena) | Tamano apropiado | Cabe en un sprint? |
| **T**esteable | Verificable | Se pueden definir pruebas? |
        `,
      },
      {
        id: 'ml-3',
        title: 'Criterios de Aceptacion',
        description: 'Define cuando una HU esta "terminada" con criterios claros.',
        duration: '30 min',
        completed: false,
        content: `
## Criterios de Aceptacion (AC)

Los **Criterios de Aceptacion** son condiciones que deben cumplirse para que una HU se considere completa.

### Formato Given-When-Then

\`\`\`gherkin
DADO que el usuario esta en la pagina de productos
CUANDO aplica un filtro de precio entre $100 y $500
ENTONCES solo se muestran productos en ese rango
Y el contador de resultados se actualiza
\`\`\`

### Tips para Buenos AC

1. **Especificos**: Sin ambiguedades
2. **Medibles**: Pueden verificarse objetivamente
3. **Completos**: Cubren el happy path y edge cases
        `,
      },
      {
        id: 'ml-4',
        title: 'Workshop: Escribiendo HUs',
        description: 'Practica creando HUs para un caso real de e-commerce.',
        duration: '45 min',
        completed: false,
      },
    ],
    videoResources: [
      {
        id: 'vid-1',
        title: 'User Stories: De Cero a Experto',
        platform: 'youtube',
        duration: '15:30',
        structure: {
          intro: 'Por que las HUs son fundamentales en Agile (0:00 - 2:30)',
          demo: 'Creando HUs para una app de delivery (2:30 - 12:00)',
          conclusion: 'Errores comunes y como evitarlos (12:00 - 15:30)',
        },
      },
      {
        id: 'vid-2',
        title: 'INVEST: Validando la Calidad de tus HUs',
        platform: 'youtube',
        duration: '10:45',
        structure: {
          intro: 'Introduccion a INVEST (0:00 - 1:30)',
          demo: 'Analizando HUs reales con INVEST (1:30 - 8:30)',
          conclusion: 'Checklist practico (8:30 - 10:45)',
        },
      },
    ],
    quiz: [
      {
        id: 'q-1',
        question: 'Cual de los siguientes es el formato correcto para una Historia de Usuario?',
        options: [
          'El sistema debe permitir filtrar productos',
          'Como usuario quiero filtrar productos para encontrar lo que busco',
          'Implementar filtro de productos con React',
          'DADO que hay productos CUANDO filtro ENTONCES se muestran',
        ],
        correctAnswer: 1,
        explanation: 'El formato correcto sigue la estructura "Como [usuario] quiero [accion] para [beneficio]".',
      },
      {
        id: 'q-2',
        question: 'Que significa la "E" en los criterios INVEST?',
        options: [
          'Ejecutable',
          'Estimable',
          'Eficiente',
          'Escalable',
        ],
        correctAnswer: 1,
        explanation: 'La "E" significa Estimable: el equipo debe poder dimensionar el esfuerzo requerido para completar la HU.',
      },
    ],
  },
};
