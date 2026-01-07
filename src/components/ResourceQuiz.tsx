"use client";

import { useState, useEffect } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface QuizData {
  questions: QuizQuestion[];
}

interface QuizState {
  selectedAnswers: { [questionId: string]: number };
  score: number;
  completed: boolean;
  timestamp: number;
}

interface ResourceQuizProps {
  quizData: QuizData;
  resourceSlug: string;
}

export default function ResourceQuiz({ quizData, resourceSlug }: ResourceQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  const [score, setScore] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const isDark = useDarkMode();
  
  const storageKey = `quiz-${resourceSlug}`;

  // Load quiz state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const savedState: QuizState = JSON.parse(saved);
        setSelectedAnswers(savedState.selectedAnswers || {});
        setScore(savedState.score || 0);
        setCompleted(savedState.completed || false);
      }
    } catch (error) {
      console.error('Error loading quiz state:', error);
    }
  }, [storageKey]);

  // Calculate score whenever selectedAnswers changes
  useEffect(() => {
    const newScore = quizData.questions.reduce((acc, question) => {
      const selected = selectedAnswers[question.id];
      if (selected !== undefined && selected === question.correct) {
        return acc + 1;
      }
      return acc;
    }, 0);
    
    setScore(newScore);
    const allAnswered = quizData.questions.every(q => selectedAnswers[q.id] !== undefined);
    setCompleted(allAnswered);

    // Save to localStorage
    try {
      const state: QuizState = {
        selectedAnswers,
        score: newScore,
        completed: allAnswered,
        timestamp: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving quiz state:', error);
    }
  }, [selectedAnswers, quizData.questions, storageKey]);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleClearQuiz = () => {
    setSelectedAnswers({});
    setScore(0);
    setCompleted(false);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing quiz state:', error);
    }
  };

  const isCorrect = (questionId: string, optionIndex: number) => {
    const question = quizData.questions.find(q => q.id === questionId);
    return question && optionIndex === question.correct;
  };

  const isSelected = (questionId: string, optionIndex: number) => {
    return selectedAnswers[questionId] === optionIndex;
  };

  const hasAnswered = (questionId: string) => {
    return selectedAnswers[questionId] !== undefined;
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 
          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          style={isDark ? { color: '#f9fafb' } : undefined}
        >
          Quiz
        </h2>
        {completed && (
          <div className="flex items-center gap-4">
            <span 
              className="text-lg font-semibold text-gray-700 dark:text-gray-300"
              style={isDark ? { color: '#d1d5db' } : undefined}
            >
              Score: {score} / {quizData.questions.length}
            </span>
            <button
              onClick={handleClearQuiz}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors border border-gray-300 dark:border-gray-600"
              style={isDark ? { backgroundColor: '#374151', borderColor: '#4b5563', color: '#e5e7eb' } : undefined}
              onMouseEnter={(e) => {
                if (isDark) {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                }
              }}
              onMouseLeave={(e) => {
                if (isDark) {
                  e.currentTarget.style.backgroundColor = '#374151';
                }
              }}
            >
              Clear Quiz
            </button>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {quizData.questions.map((question, questionIndex) => {
          const answered = hasAnswered(question.id);
          const selectedIndex = selectedAnswers[question.id];

          return (
            <div
              key={question.id}
              className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-none"
              style={isDark ? { backgroundColor: '#1f2937', borderColor: '#374151' } : undefined}
            >
              <h3 
                className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
                style={isDark ? { color: '#f9fafb' } : undefined}
              >
                {questionIndex + 1}. {question.question}
              </h3>

              <div className="space-y-3">
                {question.options.map((option, optionIndex) => {
                  const selected = isSelected(question.id, optionIndex);
                  const correct = isCorrect(question.id, optionIndex);
                  const showFeedback = answered && (selected || correct);

                  let borderColor = 'border-gray-300 dark:border-gray-600';
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
                    inlineStyle = { backgroundColor: '#1f2937', borderColor: '#4b5563' };
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
                        onChange={() => handleAnswerSelect(question.id, optionIndex)}
                        disabled={answered}
                        className="mt-1 mr-3 w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-500 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 dark:disabled:opacity-50"
                      />
                      <div className="flex-1">
                        <span 
                          className={`text-gray-900 dark:text-gray-100 ${
                            showFeedback && correct ? 'font-semibold' : ''
                          }`}
                          style={isDark ? { color: '#f3f4f6' } : undefined}
                        >
                          {option}
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

              {answered && question.explanation && (
                <div 
                  className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-500 rounded"
                  style={isDark ? { backgroundColor: 'rgba(30, 58, 138, 0.3)', borderColor: '#3b82f6' } : undefined}
                >
                  <p className="text-gray-700 dark:text-gray-200" style={isDark ? { color: '#e5e7eb' } : undefined}>
                    <strong className="text-blue-900 dark:text-blue-200" style={isDark ? { color: '#bfdbfe' } : undefined}>Explanation:</strong>{' '}
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!completed && (
        <div 
          className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center"
          style={isDark ? { color: '#9ca3af' } : undefined}
        >
          Answer all questions to see your final score.
        </div>
      )}
    </div>
  );
}
