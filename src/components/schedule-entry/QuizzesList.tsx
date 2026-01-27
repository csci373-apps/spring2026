'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Quiz, ScheduleQuiz } from './types';

interface QuizzesListProps {
  quizzes?: Quiz[];
  scheduleQuizzes?: ScheduleQuiz[];
  meetingKey: string;
  checklist: {
    isChecked: (key: string) => boolean;
    toggleChecked: (key: string) => void;
  };
  enableChecklist: boolean;
  isDark: boolean;
  onOpenQuiz: (slug: string) => void;
}

function QuizItem({ 
  quiz, 
  index, 
  meetingKey,
  checklist,
  enableChecklist,
  isDark,
  onOpen 
}: { 
  quiz: Quiz; 
  index: number;
  meetingKey: string;
  checklist: {
    isChecked: (key: string) => boolean;
    toggleChecked: (key: string) => void;
  };
  enableChecklist: boolean;
  isDark: boolean;
  onOpen: (slug: string) => void;
}) {
  const isDraft = quiz.draft && quiz.draft === 1;
  const itemKey = `${meetingKey}-quiz-${index}`;
  const isChecked = enableChecklist && !isDraft ? checklist.isChecked(itemKey) : false;
  
  // Get quiz completion status and score from localStorage (for display only, not auto-sync)
  const [quizStatus, setQuizStatus] = useState<{ completed: boolean; score: number; total: number } | null>(null);
  
  // Load quiz status once on mount (for informational display only)
  useEffect(() => {
    if (typeof window === 'undefined' || isDraft) return;
    
    try {
      const storageKey = `quiz-${quiz.slug}`;
      const saved = localStorage.getItem(storageKey);
      const totalQuestions = quiz.quizData?.questions?.length || 0;
      
      if (saved) {
        const savedState = JSON.parse(saved);
        setQuizStatus({
          completed: savedState.completed || false,
          score: savedState.score || 0,
          total: totalQuestions
        });
      }
    } catch (error) {
      console.error('Error reading quiz status:', error);
    }
  }, [quiz.slug, quiz.quizData?.questions?.length, isDraft]);
  
  return (
    <div className="flex items-start gap-2">
      {!isDraft && (
        <input
          type="checkbox"
          aria-label={`Quiz "${quiz.title}" ${isChecked ? 'completed' : 'not completed'}`}
          checked={isChecked}
          onChange={() => {
            if (enableChecklist) {
              checklist.toggleChecked(itemKey);
            }
          }}
          disabled={!enableChecklist}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 accent-blue-600 dark:accent-blue-400 cursor-default flex-shrink-0"
          style={isDark ? { 
            backgroundColor: isChecked ? '#3b82f6' : '#1f2937',
            borderColor: isChecked ? '#3b82f6' : '#4b5563'
          } : undefined}
        />
      )}
      <div className="flex-1">
        {isDraft ? (
          <span>{quiz.title}</span>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen(quiz.slug);
              }}
              className={`text-left text-blue-600 dark:text-blue-400 hover:underline ${isChecked ? '!line-through opacity-60' : ''}`}
            >
              {quiz.title}
            </button>
            {quizStatus && quizStatus.completed && (
              <span className="text-sm text-gray-600 dark:text-gray-400" style={isDark ? { color: '#9ca3af' } : undefined}>
                Previous score: {quizStatus.score} / {quizStatus.total} ({quizStatus.total > 0 ? Math.round((quizStatus.score / quizStatus.total) * 100) : 0}%)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuizzesList({
  quizzes,
  scheduleQuizzes,
  meetingKey,
  checklist,
  enableChecklist,
  isDark,
  onOpenQuiz,
}: QuizzesListProps) {
  const hasQuizzes = quizzes && quizzes.length > 0;
  const hasScheduleQuizzes = scheduleQuizzes && scheduleQuizzes.length > 0;
  const hasAnyQuizzes = hasQuizzes || hasScheduleQuizzes;

  if (!hasAnyQuizzes) {
    return null;
  }

  function renderScheduleQuiz(quiz: ScheduleQuiz, index: number) {
    const itemKey = `${meetingKey}-schedule-quiz-${index}`;
    const isChecked = enableChecklist ? checklist.isChecked(itemKey) : false;
    const isExternalLink = quiz.url.startsWith('http');
    
    return (
      <li key={index} className="mb-0 text-gray-700 dark:text-gray-300">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            aria-label={`Mark quiz "${quiz.quizName}" as ${isChecked ? 'uncompleted' : 'completed'}`}
            checked={isChecked}
            onChange={() => enableChecklist && checklist.toggleChecked(itemKey)}
            disabled={!enableChecklist}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 accent-blue-600 dark:accent-blue-400 cursor-pointer flex-shrink-0"
            style={isDark ? { 
              backgroundColor: isChecked ? '#3b82f6' : '#1f2937',
              borderColor: isChecked ? '#3b82f6' : '#4b5563'
            } : undefined}
          />
          <div className={`flex-1 ${isChecked ? '!line-through opacity-60' : ''}`}>
            {isExternalLink ? (
              <a 
                href={quiz.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {quiz.quizName}
              </a>
            ) : (
              <Link 
                href={quiz.url} 
                className="text-blue-600 dark:text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {quiz.quizName}
              </Link>
            )}
          </div>
        </div>
      </li>
    );
  }

  return (
    <div className="mb-6">
      <strong className="text-gray-700 dark:text-gray-300" style={isDark ? { color: '#d1d5db' } : undefined}>Quizzes</strong>
      <ul className="!list-none !pl-4">
        {/* Render regular quizzes (with quizData) */}
        {hasQuizzes && quizzes!.map((quiz, index) => (
          <li key={index} className="text-gray-700 dark:text-gray-300">
            <QuizItem 
              quiz={quiz} 
              index={index} 
              meetingKey={meetingKey}
              checklist={checklist}
              enableChecklist={enableChecklist}
              isDark={isDark}
              onOpen={onOpenQuiz} 
            />
          </li>
        ))}
        {/* Render schedule quizzes (with citation) */}
        {hasScheduleQuizzes && scheduleQuizzes!.map((quiz, index) => 
          renderScheduleQuiz(quiz, index)
        )}
      </ul>
    </div>
  );
}
