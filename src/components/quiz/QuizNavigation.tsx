"use client";

import QuestionCircles from './QuestionCircles';
import { QuizQuestion } from './types';

interface QuizNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  completed: boolean;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
  questions: QuizQuestion[];
  selectedAnswers: { [questionId: string]: string };
  circleWindowStart: number;
  isMobile: boolean;
  onQuestionClick: (index: number) => void;
  hasAnswered: (questionId: string) => boolean;
  isDark: boolean;
}

export default function QuizNavigation({
  currentQuestionIndex,
  totalQuestions,
  completed,
  onPrevious,
  onNext,
  canGoNext,
  questions,
  selectedAnswers,
  circleWindowStart,
  isMobile,
  onQuestionClick,
  hasAnswered,
  isDark,
}: QuizNavigationProps) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto w-full px-6 flex items-center py-4" style={isDark ? { borderColor: '#374151' } : undefined}>
        <button
          onClick={onPrevious}
          disabled={currentQuestionIndex === -1}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors border border-gray-300 dark:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          style={isDark ? { backgroundColor: '#374151', borderColor: '#1f2937', color: '#e5e7eb' } : undefined}
        >
          {currentQuestionIndex === 0 ? '← Instructions' : '← Previous'}
        </button>
        <div className="flex-1 text-center">
          <span 
            className="text-sm font-medium text-gray-600 dark:text-gray-400"
            style={isDark ? { color: '#9ca3af' } : undefined}
          >
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>

          <QuestionCircles
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            selectedAnswers={selectedAnswers}
            circleWindowStart={circleWindowStart}
            isMobile={isMobile}
            onQuestionClick={onQuestionClick}
            hasAnswered={hasAnswered}
          />
        </div>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex >= totalQuestions - 1 && completed
            ? 'View Summary →' 
            : currentQuestionIndex >= totalQuestions - 1 
              ? 'Complete Quiz →' 
              : 'Next →'}
        </button>
      </div>
    </div>
  );
}
