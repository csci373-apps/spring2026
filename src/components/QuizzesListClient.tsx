'use client';

import { useState, useEffect } from 'react';
import ResourceQuiz from '@/components/ResourceQuiz';
import { QuizMetadata, QuizData } from '@/lib/markdown';

interface QuizWithData extends QuizMetadata {
  quizData: QuizData | null;
}

interface QuizzesListClientProps {
  quizzes: QuizWithData[];
}

export default function QuizzesListClient({ quizzes }: QuizzesListClientProps) {
  const [openQuizSlug, setOpenQuizSlug] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Initialize completion status - start empty to match server render, then load from localStorage after mount
  const [quizCompletionStatus, setQuizCompletionStatus] = useState<Record<string, { completed: boolean; score: number; total: number }>>({});

  // Load completion status from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    const status: Record<string, { completed: boolean; score: number; total: number }> = {};
    quizzes.forEach(quiz => {
      try {
        const storageKey = `quiz-${quiz.slug}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const savedState = JSON.parse(saved);
          const totalQuestions = quiz.quizData?.questions?.length || 0;
          status[quiz.slug] = {
            completed: savedState.completed || false,
            score: savedState.score || 0,
            total: totalQuestions
          };
        }
      } catch (error) {
        console.error(`Error reading quiz status for ${quiz.slug}:`, error);
      }
    });
    setQuizCompletionStatus(status);
  }, [quizzes]);

  // Listen for storage changes to update completion status
  useEffect(() => {
    if (typeof window === 'undefined') return;

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
              setQuizCompletionStatus(prev => ({
                ...prev,
                [slug]: {
                  completed: savedState.completed || false,
                  score: savedState.score || 0,
                  total: totalQuestions
                }
              }));
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
      setQuizCompletionStatus(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        
        quizzes.forEach(quiz => {
          try {
            const storageKey = `quiz-${quiz.slug}`;
            const saved = localStorage.getItem(storageKey);
            if (saved) {
              const savedState = JSON.parse(saved);
              const totalQuestions = quiz.quizData?.questions?.length || 0;
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
  }, [quizzes]);

  const openQuiz = quizzes.find(q => q.slug === openQuizSlug);
  const getQuizStatus = (slug: string) => quizCompletionStatus[slug];
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="w-[50px]"></th>
            <th className="md:w-[300px]">Quiz</th>
            <th className="hidden md:table-cell md:w-[100px]">Questions</th>
            <th className="hidden md:table-cell md:w-[150px]">Score</th>
            <th className="md:w-[120px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => {
            const status = getQuizStatus(quiz.slug);
            const hasData = quiz.quizData !== null;
            const isCompleted = status?.completed === true;
            
            return (
              <tr
                key={quiz.slug}
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <td className="py-3 px-4">
                  {!mounted ? (
                    <div className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  ) : (
                    <input
                      type="checkbox"
                      aria-label={`Quiz "${quiz.quizName}" ${isCompleted ? 'completed' : 'not completed'} - checkbox is readonly, complete the quiz to mark it as done`}
                      checked={isCompleted}
                      onChange={() => {}} // Readonly - can only be checked by completing the quiz
                      readOnly
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 accent-blue-600 dark:accent-blue-400 cursor-default flex-shrink-0"
                      style={isDark ? {
                        backgroundColor: isCompleted ? '#3b82f6' : '#1f2937',
                        borderColor: isCompleted ? '#3b82f6' : '#4b5563'
                      } : undefined}
                    />
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {quiz.quizName}
                  </div>
                </td>
                <td className="py-3 px-4 hidden md:table-cell text-sm text-gray-600 dark:text-gray-400">
                  {quiz.quizData ? (
                    `${quiz.quizData.questions.length} question${quiz.quizData.questions.length !== 1 ? 's' : ''}`
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">—</span>
                  )}
                </td>
                <td className="py-3 px-4 hidden md:table-cell text-sm text-gray-600 dark:text-gray-400">
                  {!mounted ? (
                    <span className="text-gray-400 dark:text-gray-500">—</span>
                  ) : status && status.completed ? (
                    `${status.score} / ${status.total} (${status.total > 0 ? Math.round((status.score / status.total) * 100) : 0}%)`
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">—</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {!mounted ? (
                    <div className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse">
                      <span className="invisible">Take</span>
                    </div>
                  ) : hasData ? (
                    <button
                      onClick={() => setOpenQuizSlug(quiz.slug)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors font-medium ${
                        isCompleted
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {isCompleted ? 'Retake' : 'Take'}
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 text-sm bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md cursor-not-allowed">
                      N/A
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Render quiz drawer when a quiz is opened */}
      {openQuizSlug && openQuiz && openQuiz.quizData && (
        <div className="fixed inset-0 z-[500]">
          <ResourceQuiz 
            quizData={openQuiz.quizData} 
            resourceSlug={openQuiz.slug} 
            variant="desktop"
            autoOpen={true}
            onClose={() => setOpenQuizSlug(null)}
          />
        </div>
      )}
    </>
  );
}
