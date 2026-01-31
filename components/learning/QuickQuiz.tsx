'use client';

import { useState, useRef } from 'react';
import { QuizQuestion, ExamResult, ExamAnswer } from '@/types/skill';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EvaluatorAgent } from '@/components/agents';
import { cn } from '@/lib/utils';
import {
  Brain,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RefreshCcw,
  Clock,
  Zap
} from 'lucide-react';

interface QuickQuizProps {
  questions: QuizQuestion[];
  skillId: string;
  skillName: string;
  className?: string;
}

export function QuickQuiz({ questions, skillId, skillName, className }: QuickQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showEvaluator, setShowEvaluator] = useState(false);
  const [answers, setAnswers] = useState<ExamAnswer[]>([]);
  const [startTime] = useState(Date.now());
  const questionStartTime = useRef(Date.now());

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question?.correctAnswer;

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);

    const timeToAnswer = Math.round((Date.now() - questionStartTime.current) / 1000);
    const isAnswerCorrect = selectedAnswer === question.correctAnswer;

    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
    }

    // Record answer
    setAnswers(prev => [...prev, {
      questionId: question.id,
      selectedOption: selectedAnswer,
      isCorrect: isAnswerCorrect,
      timeToAnswer,
    }]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      questionStartTime.current = Date.now();
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
    setShowEvaluator(false);
    setAnswers([]);
    questionStartTime.current = Date.now();
  };

  const handleShowEvaluation = () => {
    setShowEvaluator(true);
  };

  // Show evaluator agent after completing quiz
  if (showEvaluator) {
    const examResult: ExamResult = {
      id: `exam-${Date.now()}`,
      skillId,
      score,
      totalQuestions: questions.length,
      correctAnswers: score,
      timeSpent: Math.round((Date.now() - startTime) / 1000),
      completedAt: new Date(),
      answers,
      feedback: {
        overallGrade: '',
        percentage: 0,
        strengths: [],
        areasToImprove: [],
        recommendations: [],
        personalizedMessage: '',
      },
    };

    return (
      <EvaluatorAgent
        examResult={examResult}
        skillName={skillName}
        className={className}
      />
    );
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPassing = percentage >= 70;
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;

    return (
      <div className={cn('space-y-4', className)}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Brain className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-semibold">Quiz Completado</h3>
            <p className="text-sm text-muted-foreground">
              Examen finalizado - Revisa tus resultados
            </p>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              {/* Score display */}
              <div className="relative">
                <div className={cn(
                  'w-32 h-32 mx-auto rounded-full flex items-center justify-center',
                  'border-4',
                  isPassing
                    ? 'bg-green-500/10 border-green-500'
                    : 'bg-yellow-500/10 border-yellow-500'
                )}>
                  <div>
                    <p className={cn(
                      'text-4xl font-bold',
                      isPassing ? 'text-green-600' : 'text-yellow-600'
                    )}>
                      {percentage}%
                    </p>
                    <p className="text-sm text-muted-foreground">Puntaje</p>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-green-500 mb-2" />
                  <p className="text-2xl font-bold">{score}</p>
                  <p className="text-xs text-muted-foreground">Correctas</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <XCircle className="w-6 h-6 mx-auto text-red-500 mb-2" />
                  <p className="text-2xl font-bold">{questions.length - score}</p>
                  <p className="text-xs text-muted-foreground">Incorrectas</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <Clock className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                  <p className="text-2xl font-bold">{minutes}:{seconds.toString().padStart(2, '0')}</p>
                  <p className="text-xs text-muted-foreground">Tiempo</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <button
                  onClick={handleShowEvaluation}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-amber-500/20"
                >
                  <Zap className="w-5 h-5" />
                  Ver Evaluacion Detallada
                </button>
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 rounded-xl font-medium hover:bg-muted transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Intentar de nuevo
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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
                ? answers[idx]?.isCorrect ? 'bg-green-500' : 'bg-red-500'
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
                {currentQuestion < questions.length - 1 ? 'Siguiente' : 'Finalizar examen'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
