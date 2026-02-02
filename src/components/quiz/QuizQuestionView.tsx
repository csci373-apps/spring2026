"use client";

import { QuizQuestion, isJavaScriptDOMQuestion } from './types';
import { formatQuestionText } from './utils';
import JavaScriptDOMQuestionView from './javascript-dom/JavaScriptDOMQuestionView';
import { TestResults } from './javascript-dom/types';

interface QuizQuestionViewProps {
  question: QuizQuestion;
  questionNumber: number;
  selectedAnswers: { [questionId: string]: string | string[] | { html: string; css: string; js: string; testResults?: TestResults } };
  onAnswerSelect: (questionId: string, optionIndex: number) => void;
  onCodeAnswerSelect?: (questionId: string, answer: { html: string; css: string; js: string; testResults?: TestResults }, passed: boolean) => void;
  isCorrect: (questionId: string, optionIndex: number) => boolean;
  isSelected: (questionId: string, optionIndex: number) => boolean;
  hasAnswered: (questionId: string) => boolean;
  completed?: boolean;
  isRevealed?: boolean;
  onRevealAnswer?: (questionId: string) => void;
  showSummary?: boolean;
  isDark: boolean;
}

export default function QuizQuestionView({
  question,
  questionNumber,
  selectedAnswers,
  onAnswerSelect,
  onCodeAnswerSelect,
  isCorrect,
  isSelected,
  hasAnswered,
  completed = false,
  isRevealed = false,
  onRevealAnswer,
  showSummary = false,
  isDark,
}: QuizQuestionViewProps) {
  // Route to JavaScript DOM question view if applicable
  if (isJavaScriptDOMQuestion(question)) {
    return (
      <JavaScriptDOMQuestionView
        question={question}
        questionNumber={questionNumber}
        selectedAnswers={selectedAnswers}
        onAnswerSelect={onCodeAnswerSelect || ((id, answer, passed) => {
          // Fallback if handler not provided
          console.warn('Code answer handler not provided');
        })}
        isRevealed={isRevealed}
        onRevealAnswer={onRevealAnswer}
        showSummary={showSummary}
        isDark={isDark}
      />
    );
  }

  // Determine question type: check type field, or infer from correct field
  const isMultiSelect = question.type === 'select-all' || Array.isArray(question.correct);
  const answered = hasAnswered(question.id);
  
  // Show feedback when revealed OR when viewing summary screen (for all question types)
  const shouldShowFeedback = isRevealed || showSummary;

  // Ensure options exist for multiple-choice questions
  if (!question.options || question.options.length === 0) {
    return (
      <div className="px-6 pt-6 pb-0 rounded-lg text-red-600 dark:text-red-400">
        Error: Question {questionNumber} is missing options.
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-0 rounded-lg" style={isDark ? { backgroundColor: 'rgba(30, 58, 138, 0.15)', borderColor: '#1e3a8a' } : undefined}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1" style={isDark ? { color: '#f9fafb' } : undefined}>
          {questionNumber}. {formatQuestionText(question.question, isDark)}
        </div>
        {/* Check Answer button for all questions */}
        {!isRevealed && !showSummary && onRevealAnswer && (
          <button
            onClick={() => onRevealAnswer(question.id)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors flex-shrink-0"
          >
            Check Answer
          </button>
        )}
      </div>

      <div className="space-y-3">
        {question.options.map((option, optionIndex) => {
          const selected = isSelected(question.id, optionIndex);
          const correct = isCorrect(question.id, optionIndex);
          // Show feedback for all options when revealed or on summary screen
          // For single-select, show feedback for selected or correct option (to highlight correct answer)
          // For multi-select, show feedback for all options
          const showFeedback = shouldShowFeedback && (isMultiSelect ? true : (selected || correct));

          let borderColor = 'border-gray-300 dark:border-gray-800';
          let bgColor = 'bg-white dark:bg-gray-800';
          let inlineStyle: React.CSSProperties | undefined;
          
          if (showFeedback) {
            if (correct && selected) {
              // Correctly selected option
              borderColor = 'border-green-500 dark:border-green-500';
              bgColor = 'bg-green-50 dark:bg-green-900/30';
              if (isDark) {
                inlineStyle = { borderColor: '#10b981', backgroundColor: 'rgba(20, 83, 45, 0.3)' };
              }
            } else if (selected && !correct) {
              // Incorrectly selected option
              borderColor = 'border-red-500 dark:border-red-500';
              bgColor = 'bg-red-50 dark:bg-red-900/30';
              if (isDark) {
                inlineStyle = { borderColor: '#ef4444', backgroundColor: 'rgba(127, 29, 29, 0.3)' };
              }
            } else if (correct && !selected) {
              // Correct option that was not selected (for both single-select and multi-select)
              borderColor = 'border-green-500 dark:border-green-500';
              bgColor = 'bg-green-50 dark:bg-green-900/30';
              if (isDark) {
                inlineStyle = { borderColor: '#10b981', backgroundColor: 'rgba(20, 83, 45, 0.3)' };
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
                type={isMultiSelect ? "checkbox" : "radio"}
                name={question.id}
                value={optionIndex}
                checked={selected}
                onChange={() => onAnswerSelect(question.id, optionIndex)}
                disabled={isRevealed || showSummary}
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
                {showFeedback && correct && selected && (
                  <span className="ml-2 text-green-700 dark:text-green-400 font-semibold">
                    ✓ Correct
                  </span>
                )}
                {showFeedback && selected && !correct && (
                  <span className="ml-2 text-red-700 dark:text-red-400 font-semibold">
                    ✗ Incorrect
                  </span>
                )}
                {showFeedback && correct && !selected && (
                  <span className="ml-2 text-green-600 dark:text-green-500 font-semibold">
                    (Correct answer)
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {shouldShowFeedback && question.explanation && (
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
