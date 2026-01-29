"use client";

import { QuizQuestion } from './types';
import { TestResults } from './javascript-dom/types';

interface QuestionCirclesProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswers: { [questionId: string]: string | string[] | { html: string; css: string; js: string; testResults?: TestResults } };
  circleWindowStart: number;
  isMobile: boolean;
  onQuestionClick: (index: number) => void;
  hasAnswered: (questionId: string) => boolean;
  revealedQuestions?: Set<string>;
  showSummary?: boolean;
}

export default function QuestionCircles({
  questions,
  currentQuestionIndex,
  selectedAnswers,
  circleWindowStart,
  isMobile,
  onQuestionClick,
  hasAnswered,
  revealedQuestions = new Set(),
  showSummary = false,
}: QuestionCirclesProps) {
  const totalQuestions = questions.length;
  // Use 5 for mobile, 10 for desktop
  const maxVisible = isMobile ? 5 : 10;
  
  const startIndex = totalQuestions <= maxVisible ? 0 : circleWindowStart;
  const endIndex = Math.min(startIndex + maxVisible, totalQuestions);
  
  const visibleQuestions = questions.slice(startIndex, endIndex);
  
  return (
    <div className="flex justify-center items-center gap-2 pb-4 pt-1 flex-wrap">
      {startIndex > 0 && (
        <span className="text-xs text-gray-600 dark:text-gray-300 px-2">...</span>
      )}
        {visibleQuestions.map((question, relativeIndex) => {
          const index = startIndex + relativeIndex;
          const answered = hasAnswered(question.id);
          const isCurrent = index === currentQuestionIndex;
          const isRevealed = revealedQuestions.has(question.id);
          const shouldShowGrade = isRevealed || showSummary;
          
          // Check if saved answer matches the correct answer(s) - only if revealed or on summary
          const savedAnswer = selectedAnswers[question.id];
          let isCorrect = false;
          
          if (shouldShowGrade && answered && savedAnswer !== undefined) {
            // Handle JavaScript DOM questions
            if (question.type === 'javascript-dom') {
              if (typeof savedAnswer === 'object' && savedAnswer !== null && 'testResults' in savedAnswer) {
                const testResults = (savedAnswer as { testResults?: TestResults }).testResults;
                isCorrect = !!(testResults && testResults.allPassed);
              }
            } else if (question.options && question.correct !== undefined) {
              // Handle multiple-choice questions
              if (Array.isArray(question.correct)) {
                // Multi-select: check that arrays match exactly
                const correctIndices = question.correct;
                const correctOptionTexts = correctIndices.map(idx => question.options![idx]);
                const selectedArray = Array.isArray(savedAnswer) ? savedAnswer : [];
                
                const allCorrectSelected = correctOptionTexts.every(text => selectedArray.includes(text));
                const noIncorrectSelected = selectedArray.every(text => correctOptionTexts.includes(text));
                const sameLength = selectedArray.length === correctOptionTexts.length;
                
                isCorrect = allCorrectSelected && noIncorrectSelected && sameLength;
              } else {
                // Single-select: check if saved option text matches correct option text
                if (typeof savedAnswer === 'string') {
                  const correctOptionText = question.options[question.correct];
                  isCorrect = savedAnswer === correctOptionText;
                }
              }
            }
          }
        
        let bgColor = 'bg-gray-300 dark:bg-gray-600';
        let borderColor = 'border-gray-400 dark:border-gray-500';
        
        if (isCurrent) {
          bgColor = 'bg-blue-600 dark:bg-blue-500';
          borderColor = 'border-blue-700 dark:border-blue-400';
        } else if (answered) {
          if (shouldShowGrade) {
            // Show green/red only if revealed or on summary
            if (isCorrect) {
              bgColor = 'bg-green-500 dark:bg-green-600';
              borderColor = 'border-green-600 dark:border-green-500';
            } else {
              bgColor = 'bg-red-500 dark:bg-red-600';
              borderColor = 'border-red-600 dark:border-red-500';
            }
          } else {
            // Show dark gray if answered but not revealed
            bgColor = 'bg-gray-600 dark:bg-gray-700';
            borderColor = 'border-gray-700 dark:border-gray-600';
          }
        } else if (shouldShowGrade) {
          // Unanswered questions are treated as incorrect during review
          bgColor = 'bg-red-500 dark:bg-red-600';
          borderColor = 'border-red-600 dark:border-red-500';
        }
        
        return (
          <button
            key={question.id}
            onClick={() => onQuestionClick(index)}
            className={`w-4 h-4 rounded-full border transition-all hover:scale-125 flex items-center justify-center ${bgColor} ${borderColor} ${
              isCurrent ? 'ring-1 ring-blue-400 dark:ring-blue-300 w-6 h-6' : ''
            }`}
            title={`Question ${index + 1}${answered ? (shouldShowGrade ? (isCorrect ? ' - Correct' : ' - Incorrect') : ' - Answered') : ' - Not answered'}`}
          >
            {isCurrent && (
              <span className="text-[12px] text-white leading-none">
                {index + 1}
              </span>
            )}
          </button>
        );
      })}
      {endIndex < totalQuestions && (
        <span className="text-xs text-gray-600 dark:text-gray-300 px-2">...</span>
      )}
    </div>
  );
}
