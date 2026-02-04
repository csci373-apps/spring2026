'use client';

import { useState, useEffect } from 'react';
import { QuizData } from './quiz/types';
import { useDarkMode } from '@/hooks/useDarkMode';

interface QuizItem {
  slug: string;
  quizData: QuizData;
  cheatsheetContent?: string | null;
}

interface QuizzesListProps {
  quizzes: QuizItem[];
  onOpenQuiz: (slug: string) => void;
}

export default function QuizzesList({ quizzes, onOpenQuiz }: QuizzesListProps) {
  const [mounted, setMounted] = useState(false);
  const [quizStatuses, setQuizStatuses] = useState<Record<string, { completed: boolean; score: number; total: number }>>({});
  const isDark = useDarkMode();

  // Load completion status from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    const statuses: Record<string, { completed: boolean; score: number; total: number }> = {};
    quizzes.forEach(quiz => {
      try {
        const storageKey = `quiz-${quiz.slug}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const savedState = JSON.parse(saved);
          const totalQuestions = quiz.quizData?.questions?.length || 0;
          statuses[quiz.slug] = {
            completed: savedState.completed || false,
            score: savedState.score || 0,
            total: totalQuestions
          };
        }
      } catch (error) {
        console.error(`Error reading quiz status for ${quiz.slug}:`, error);
      }
    });
    setQuizStatuses(statuses);
  }, [quizzes]);

  // Listen for storage changes to update completion status
  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('quiz-')) {
        const slug = e.key.replace('quiz-', '');
        const quiz = quizzes.find(q => q.slug === slug);
        if (quiz) {
          try {
            const saved = e.newValue;
            if (saved) {
              const savedState = JSON.parse(saved);
              const totalQuestions = quiz.quizData?.questions?.length || 0;
              setQuizStatuses(prev => ({
                ...prev,
                [slug]: {
                  completed: savedState.completed || false,
                  score: savedState.score || 0,
                  total: totalQuestions
                }
              }));
            } else {
              // Quiz was cleared
              setQuizStatuses(prev => {
                const updated = { ...prev };
                delete updated[slug];
                return updated;
              });
            }
          } catch (error) {
            console.error(`Error updating quiz status for ${slug}:`, error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also poll for changes (for same-tab updates)
    const interval = setInterval(() => {
      setQuizStatuses(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        
        quizzes.forEach(quiz => {
          try {
            const storageKey = `quiz-${quiz.slug}`;
            const saved = localStorage.getItem(storageKey);
            const totalQuestions = quiz.quizData?.questions?.length || 0;
            
            if (saved) {
              const savedState = JSON.parse(saved);
              const newStatus = {
                completed: savedState.completed || false,
                score: savedState.score || 0,
                total: totalQuestions
              };
              
              if (JSON.stringify(prev[quiz.slug]) !== JSON.stringify(newStatus)) {
                updated[quiz.slug] = newStatus;
                hasChanges = true;
              }
            } else if (prev[quiz.slug]) {
              // Quiz was cleared
              delete updated[quiz.slug];
              hasChanges = true;
            }
          } catch (error) {
            console.error(`Error checking quiz status for ${quiz.slug}:`, error);
          }
        });
        
        return hasChanges ? updated : prev;
      });
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [quizzes, mounted]);

  return (
    <ul className="space-y-4 mt-6 !list-none !pl-0">
      {quizzes.map((quiz) => {
        const status = quizStatuses[quiz.slug];
        const hasCompleted = status?.completed === true;
        const scorePercentage = status && status.total > 0 
          ? Math.round((status.score / status.total) * 100) 
          : 0;

        return (
          <li
            key={quiz.slug}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-600 transition-colors cursor-pointer"
            style={isDark ? { borderColor: '#374151' } : undefined}
            onClick={() => onOpenQuiz(quiz.slug)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1" style={isDark ? { color: '#f9fafb' } : undefined}>
                  {quiz.quizData.quizName || quiz.slug}
                </h3>
                {hasCompleted && mounted && (
                  <p className="text-sm text-gray-600 dark:text-gray-400" style={isDark ? { color: '#9ca3af' } : undefined}>
                    Previous score: <span className="font-semibold">{status.score} / {status.total}</span> ({scorePercentage}%)
                  </p>
                )}
              </div>
              <div className="ml-4">
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQuiz(quiz.slug);
                  }}
                >
                  {hasCompleted ? 'Retake' : 'Take'}
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
