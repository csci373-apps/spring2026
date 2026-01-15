"use client";

import { QuizQuestion } from './types';

interface QuestionCirclesProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswers: { [questionId: string]: string };
  circleWindowStart: number;
  isMobile: boolean;
  onQuestionClick: (index: number) => void;
  hasAnswered: (questionId: string) => boolean;
}

export default function QuestionCircles({
  questions,
  currentQuestionIndex,
  selectedAnswers,
  circleWindowStart,
  isMobile,
  onQuestionClick,
  hasAnswered,
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
          // Check if saved option text matches the correct option text
          const savedOptionText = selectedAnswers[question.id];
          const correctOptionText = question.options[question.correct];
          const isCorrect = answered && savedOptionText === correctOptionText;
        
        let bgColor = 'bg-gray-300 dark:bg-gray-600';
        let borderColor = 'border-gray-400 dark:border-gray-500';
        
        if (isCurrent) {
          bgColor = 'bg-blue-600 dark:bg-blue-500';
          borderColor = 'border-blue-700 dark:border-blue-400';
        } else if (answered) {
          if (isCorrect) {
            bgColor = 'bg-green-500 dark:bg-green-600';
            borderColor = 'border-green-600 dark:border-green-500';
          } else {
            bgColor = 'bg-red-500 dark:bg-red-600';
            borderColor = 'border-red-600 dark:border-red-500';
          }
        }
        
        return (
          <button
            key={question.id}
            onClick={() => onQuestionClick(index)}
            className={`w-4 h-4 rounded-full border transition-all hover:scale-125 flex items-center justify-center ${bgColor} ${borderColor} ${
              isCurrent ? 'ring-1 ring-blue-400 dark:ring-blue-300 w-6 h-6' : ''
            }`}
            title={`Question ${index + 1}${answered ? (isCorrect ? ' - Correct' : ' - Incorrect') : ' - Not answered'}`}
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
