"use client";

import { QuizQuestion } from './types';
import { formatQuestionText } from './utils';

interface QuizQuestionViewProps {
  question: QuizQuestion;
  questionNumber: number;
  selectedAnswers: { [questionId: string]: string };
  onAnswerSelect: (questionId: string, optionIndex: number) => void;
  isCorrect: (questionId: string, optionIndex: number) => boolean;
  isSelected: (questionId: string, optionIndex: number) => boolean;
  hasAnswered: (questionId: string) => boolean;
  isDark: boolean;
}

export default function QuizQuestionView({
  question,
  questionNumber,
  selectedAnswers,
  onAnswerSelect,
  isCorrect,
  isSelected,
  hasAnswered,
  isDark,
}: QuizQuestionViewProps) {
  // selectedAnswers is kept for interface compatibility but currently unused
  void selectedAnswers;
  const answered = hasAnswered(question.id);

  return (
    <div className="px-6 pt-6 pb-0 rounded-lg" style={isDark ? { backgroundColor: 'rgba(30, 58, 138, 0.15)', borderColor: '#1e3a8a' } : undefined}>
      <div className="mb-4">
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100" style={isDark ? { color: '#f9fafb' } : undefined}>
          {questionNumber}. {formatQuestionText(question.question, isDark)}
        </div>
      </div>

      <div className="space-y-3">
        {question.options.map((option, optionIndex) => {
          const selected = isSelected(question.id, optionIndex);
          const correct = isCorrect(question.id, optionIndex);
          const showFeedback = answered && (selected || correct);

          let borderColor = 'border-gray-300 dark:border-gray-800';
          let bgColor = 'bg-white dark:bg-gray-800';
          let inlineStyle: React.CSSProperties | undefined;
          
          if (showFeedback) {
            if (correct) {
              borderColor = 'border-green-500 dark:border-green-500';
              bgColor = 'bg-green-50 dark:bg-green-900/30';
              if (isDark) {
                inlineStyle = { borderColor: '#10b981', backgroundColor: 'rgba(20, 83, 45, 0.3)' };
              }
            } else if (selected && !correct) {
              borderColor = 'border-red-500 dark:border-red-500';
              bgColor = 'bg-red-50 dark:bg-red-900/30';
              if (isDark) {
                inlineStyle = { borderColor: '#ef4444', backgroundColor: 'rgba(127, 29, 29, 0.3)' };
              }
            }
          } else if (selected) {
            borderColor = 'border-blue-500 dark:border-blue-500';
            bgColor = 'bg-blue-50 dark:bg-blue-900/30';
            if (isDark) {
              inlineStyle = { borderColor: '#3b82f6', backgroundColor: 'rgba(30, 58, 138, 0.3)' };
            }
          } else if (isDark) {
            inlineStyle = { backgroundColor: '#1f2937', borderColor: '#1f2937' };
          }

          return (
            <label
              key={optionIndex}
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${borderColor} ${bgColor} ${
                answered ? 'cursor-default' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              style={inlineStyle}
            >
              <input
                type="radio"
                name={question.id}
                value={optionIndex}
                checked={selected}
                onChange={() => onAnswerSelect(question.id, optionIndex)}
                disabled={answered}
                className="mt-1 mr-3 w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-700 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 dark:disabled:opacity-50"
              />
              <div className="flex-1">
                <span 
                  className={`text-gray-900 dark:text-gray-100 ${
                    showFeedback && correct ? 'font-semibold' : ''
                  }`}
                  style={isDark ? { color: '#f3f4f6' } : undefined}
                >
                  {formatQuestionText(option, isDark)}
                </span>
                {showFeedback && correct && (
                  <span className="ml-2 text-green-700 dark:text-green-400 font-semibold">
                    ✓ Correct
                  </span>
                )}
                {showFeedback && selected && !correct && (
                  <span className="ml-2 text-red-700 dark:text-red-400 font-semibold">
                    ✗ Incorrect
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {hasAnswered(question.id) && question.explanation && (
        <div className="mt-4 py-4">
          <p className="text-gray-700 dark:text-gray-200" style={isDark ? { color: '#e5e7eb' } : undefined}>
            <strong className="text-blue-900 dark:text-blue-200" style={isDark ? { color: '#bfdbfe' } : undefined}>Explanation:</strong>{' '}
            {formatQuestionText(question.explanation, isDark)}
          </p>
        </div>
      )}
    </div>
  );
}
