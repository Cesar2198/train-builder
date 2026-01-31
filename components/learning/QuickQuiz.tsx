'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/types/skill';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Brain,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RefreshCcw,
  Trophy
} from 'lucide-react';

interface QuickQuizProps {
  questions: QuizQuestion[];
  className?: string;
}

export function QuickQuiz({ questions, className }: QuickQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question?.correctAnswer;

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    if (selectedAnswer === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPassing = percentage >= 70;

    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className={cn(
              'w-20 h-20 mx-auto rounded-full flex items-center justify-center',
              isPassing ? 'bg-green-500/10' : 'bg-yellow-500/10'
            )}>
              <Trophy className={cn(
                'w-10 h-10',
                isPassing ? 'text-green-500' : 'text-yellow-500'
              )} />
            </div>

            <div>
              <h3 className="text-2xl font-bold">
                {isPassing ? 'Excelente!' : 'Buen intento!'}
              </h3>
              <p className="text-muted-foreground mt-1">
                {isPassing
                  ? 'Has demostrado un buen dominio del tema'
                  : 'Repasa el contenido e intenta de nuevo'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 py-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{score}</p>
                <p className="text-sm text-muted-foreground">Correctas</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-4xl font-bold">{questions.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className={cn(
                  'text-4xl font-bold',
                  isPassing ? 'text-green-500' : 'text-yellow-500'
                )}>
                  {percentage}%
                </p>
                <p className="text-sm text-muted-foreground">Puntaje</p>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <RefreshCcw className="w-4 h-4" />
              Intentar de nuevo
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Brain className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-semibold">Quiz Rapido</h3>
            <p className="text-sm text-muted-foreground">
              Valida tu conocimiento
            </p>
          </div>
        </div>
        <Badge variant="outline">
          {currentQuestion + 1} / {questions.length}
        </Badge>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              'flex-1 h-1.5 rounded-full transition-all',
              idx < currentQuestion
                ? 'bg-primary'
                : idx === currentQuestion
                  ? 'bg-primary/50'
                  : 'bg-muted'
            )}
          />
        ))}
      </div>

      {/* Question card */}
      <Card className="overflow-hidden">
        <CardContent className="pt-6 space-y-6">
          {/* Question */}
          <div>
            <Badge className="mb-3">Pregunta {currentQuestion + 1}</Badge>
            <h4 className="text-lg font-medium leading-relaxed">
              {question.question}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectOption = idx === question.correctAnswer;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={showResult}
                  className={cn(
                    'w-full p-4 text-left rounded-xl border-2 transition-all',
                    'flex items-center gap-3',
                    !showResult && !isSelected && 'hover:border-primary/50 hover:bg-primary/5',
                    !showResult && isSelected && 'border-primary bg-primary/10',
                    showResult && isCorrectOption && 'border-green-500 bg-green-500/10',
                    showResult && isSelected && !isCorrectOption && 'border-red-500 bg-red-500/10',
                    showResult && !isSelected && !isCorrectOption && 'opacity-50'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0',
                    !showResult && isSelected && 'bg-primary text-primary-foreground',
                    !showResult && !isSelected && 'bg-muted',
                    showResult && isCorrectOption && 'bg-green-500 text-white',
                    showResult && isSelected && !isCorrectOption && 'bg-red-500 text-white'
                  )}>
                    {showResult ? (
                      isCorrectOption ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && question.explanation && (
            <div className={cn(
              'p-4 rounded-lg',
              isCorrect ? 'bg-green-500/10' : 'bg-yellow-500/10'
            )}>
              <p className={cn(
                'text-sm font-medium mb-1',
                isCorrect ? 'text-green-600' : 'text-yellow-600'
              )}>
                {isCorrect ? 'Correcto!' : 'Incorrecto'}
              </p>
              <p className="text-sm text-muted-foreground">
                {question.explanation}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            {!showResult ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                className={cn(
                  'px-6 py-2.5 rounded-lg font-medium transition-all',
                  selectedAnswer !== null
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                Verificar respuesta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                {currentQuestion < questions.length - 1 ? 'Siguiente' : 'Ver resultados'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
