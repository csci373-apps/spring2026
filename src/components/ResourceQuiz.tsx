"use client";

import { useState, useEffect, useRef } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { triggerConfetti } from '@/lib/utils';
import hljs from 'highlight.js';

// Helper function to format inline code and code blocks
function formatQuestionText(text: string, isDark: boolean): React.ReactNode {
  // First, handle code blocks: ```language\ncode\n```
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: (string | { type: 'code'; language: string; code: string; id: string })[] = [];
  let lastIndex = 0;
  let match;
  let codeBlockIndex = 0;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before the code block (process inline code in it)
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      if (beforeText.trim()) {
        parts.push(beforeText);
      }
    }
    
    // Add the code block
    const codeBlockId = `code-block-${codeBlockIndex++}`;
    parts.push({
      type: 'code',
      language: match[1] || 'text',
      code: match[2].trim(),
      id: codeBlockId
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text (process inline code in it)
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    if (remainingText.trim()) {
      parts.push(remainingText);
    }
  }
  
  // If no code blocks found, just process inline code
  if (parts.length === 0 || parts.every(p => typeof p === 'string')) {
    // Process inline code: `stuff`
    const inlineCodeRegex = /`([^`]+)`/g;
    const inlineParts: React.ReactNode[] = [];
    let inlineLastIndex = 0;
    let inlineMatch;
    
    while ((inlineMatch = inlineCodeRegex.exec(text)) !== null) {
      // Add text before inline code
      if (inlineMatch.index > inlineLastIndex) {
        inlineParts.push(text.substring(inlineLastIndex, inlineMatch.index));
      }
      
      // Add inline code
      inlineParts.push(
        <code
          key={`inline-${inlineMatch.index}`}
          className="px-1.5 py-0.5 rounded text-sm font-mono"
          style={{
            backgroundColor: isDark ? '#1e293b' : '#fff',
            border: `1px solid ${isDark ? '#1f2937' : '#d1d5d9'}`,
            color: isDark ? '#e2e8f0' : '#24292e',
          }}
        >
          {inlineMatch[1]}
        </code>
      );
      
      inlineLastIndex = inlineMatch.index + inlineMatch[0].length;
    }
    
    // Add remaining text
    if (inlineLastIndex < text.length) {
      inlineParts.push(text.substring(inlineLastIndex));
    }
    
    return inlineParts.length > 0 ? <>{inlineParts}</> : text;
  }
  
  // Render parts with both code blocks and inline code
  return (
    <>
      {parts.map((part, index) => {
        if (typeof part === 'string') {
          // Process inline code in text parts
          const inlineCodeRegex = /`([^`]+)`/g;
          const inlineParts: React.ReactNode[] = [];
          let inlineLastIndex = 0;
          let inlineMatch;
          
          while ((inlineMatch = inlineCodeRegex.exec(part)) !== null) {
            // Add text before inline code
            if (inlineMatch.index > inlineLastIndex) {
              inlineParts.push(part.substring(inlineLastIndex, inlineMatch.index));
            }
            
            // Add inline code
            inlineParts.push(
              <code
                key={`inline-${index}-${inlineMatch.index}`}
                className="px-1.5 py-0.5 rounded text-sm font-mono"
                style={{
                  backgroundColor: isDark ? '#1e293b' : '#fff',
                  border: `1px solid ${isDark ? '#1f2937' : '#d1d5d9'}`,
                  color: isDark ? '#e2e8f0' : '#24292e',
                }}
              >
                {inlineMatch[1]}
              </code>
            );
            
            inlineLastIndex = inlineMatch.index + inlineMatch[0].length;
          }
          
          // Add remaining text
          if (inlineLastIndex < part.length) {
            inlineParts.push(part.substring(inlineLastIndex));
          }
          
          return <span key={index}>{inlineParts.length > 0 ? inlineParts : part}</span>;
        } else {
          // Code block
          return (
            <pre
              key={part.id}
              className="my-4 p-4 rounded-lg overflow-x-auto text-sm font-mono block"
              style={{
                backgroundColor: isDark ? '#1e293b' : '#fff',
                border: `1px solid ${isDark ? '#1f2937' : '#e1e4e8'}`,
                color: isDark ? '#e2e8f0' : '#24292e',
              }}
            >
              <code
                className={`hljs language-${part.language}`}
                style={{ backgroundColor: 'transparent' }}
                dangerouslySetInnerHTML={{
                  __html: hljs.highlight(part.code, { 
                    language: part.language || 'text',
                    ignoreIllegals: true 
                  }).value
                }}
              />
            </pre>
          );
        }
      })}
    </>
  );
}

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
  variant?: 'mobile' | 'desktop';
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ResourceQuiz({ quizData, resourceSlug, variant = 'desktop' }: ResourceQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  const [score, setScore] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [randomMode, setRandomMode] = useState<boolean>(false);
  const isDark = useDarkMode();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousCompletedRef = useRef<boolean>(false);
  const previousShowSummaryRef = useRef<boolean>(false);
  const isInitialLoad = useRef<boolean>(true);
  
  const storageKey = `quiz-${resourceSlug}`;
  const randomModeKey = `quiz-random-${resourceSlug}`;

  // Load random mode preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(randomModeKey);
      if (saved !== null) {
        setRandomMode(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading random mode preference:', error);
    }
  }, [randomModeKey]);

  // Prepare questions based on random mode
  useEffect(() => {
    let questionsToUse: QuizQuestion[];
    
    if (randomMode) {
      // Shuffle questions
      const shuffled = shuffleArray(quizData.questions);
      
      // Shuffle options within each question and update correct index
      questionsToUse = shuffled.map(question => {
        const correctOption = question.options[question.correct];
        const shuffledOptions = shuffleArray(question.options);
        const newCorrectIndex = shuffledOptions.indexOf(correctOption);
        
        return {
          ...question,
          options: shuffledOptions,
          correct: newCorrectIndex
        };
      });
    } else {
      // Use original order without shuffling
      questionsToUse = quizData.questions.map(question => ({ ...question }));
    }
    
    setShuffledQuestions(questionsToUse);
  }, [quizData.questions, randomMode]);

  // Load quiz state from localStorage on mount (after questions are shuffled)
  useEffect(() => {
    if (shuffledQuestions.length === 0) return;
    
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const savedState: QuizState = JSON.parse(saved);
        setSelectedAnswers(savedState.selectedAnswers || {});
        setScore(savedState.score || 0);
        const wasCompleted = savedState.completed || false;
        setCompleted(wasCompleted);
        // Set the previous completed ref to prevent confetti on initial load
        previousCompletedRef.current = wasCompleted;
        // Find first unanswered question, or stay at 0
        const firstUnanswered = shuffledQuestions.findIndex(q => !savedState.selectedAnswers?.[q.id]);
        if (firstUnanswered !== -1) {
          setCurrentQuestionIndex(firstUnanswered);
          previousShowSummaryRef.current = false;
        } else if (wasCompleted) {
          // If completed, show summary (index beyond last question)
          setCurrentQuestionIndex(shuffledQuestions.length);
          previousShowSummaryRef.current = true;
        }
      }
    } catch (error) {
      console.error('Error loading quiz state:', error);
    }
    // Mark initial load as complete after state is set
    setTimeout(() => {
      isInitialLoad.current = false;
    }, 100);
  }, [storageKey, shuffledQuestions]);

  // Calculate score whenever selectedAnswers changes
  useEffect(() => {
    if (shuffledQuestions.length === 0) return;
    
    const newScore = shuffledQuestions.reduce((acc, question) => {
      const selected = selectedAnswers[question.id];
      if (selected !== undefined && selected === question.correct) {
        return acc + 1;
      }
      return acc;
    }, 0);
    
    setScore(newScore);
    const allAnswered = shuffledQuestions.every(q => selectedAnswers[q.id] !== undefined);
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
  }, [selectedAnswers, shuffledQuestions, storageKey]);

  // Trigger confetti when quiz is completed AND user is viewing the summary screen AND score > 85%
  useEffect(() => {
    if (shuffledQuestions.length === 0) return;
    
    // Show summary screen if completed and at the end
    const showSummary = completed && currentQuestionIndex >= shuffledQuestions.length;
    
    // Calculate score percentage
    const scorePercentage = shuffledQuestions.length > 0 ? (score / shuffledQuestions.length) * 100 : 0;
    
    // Skip on initial load
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      previousCompletedRef.current = completed;
      previousShowSummaryRef.current = showSummary;
      return;
    }

    // Trigger confetti when:
    // 1. Quiz is completed
    // 2. User is viewing the summary screen (currentQuestionIndex >= shuffledQuestions.length)
    // 3. User just navigated to the summary screen (wasn't showing summary before)
    // 4. Score is greater than 85%
    if (completed && showSummary && !previousShowSummaryRef.current && scorePercentage > 85) {
      triggerConfetti();
    }

    previousCompletedRef.current = completed;
    previousShowSummaryRef.current = showSummary;
  }, [completed, currentQuestionIndex, shuffledQuestions.length, score]);



  const handleClearQuiz = () => {
    setSelectedAnswers({});
    setScore(0);
    setCompleted(false);
    setCurrentQuestionIndex(0);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing quiz state:', error);
    }
    // Questions will be reshuffled/reordered based on randomMode via the useEffect
  };

  const handleToggleRandomMode = () => {
    const newRandomMode = !randomMode;
    setRandomMode(newRandomMode);
    // Save preference to localStorage
    try {
      localStorage.setItem(randomModeKey, JSON.stringify(newRandomMode));
    } catch (error) {
      console.error('Error saving random mode preference:', error);
    }
    // Clear quiz state when toggling random mode
    setSelectedAnswers({});
    setScore(0);
    setCompleted(false);
    setCurrentQuestionIndex(0);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing quiz state:', error);
    }
  };

  const handleNext = () => {
    if (shuffledQuestions.length === 0) return;
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentQuestionIndex === shuffledQuestions.length - 1 && completed) {
      // Show summary
      setCurrentQuestionIndex(shuffledQuestions.length);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const isCorrect = (questionId: string, optionIndex: number) => {
    const question = shuffledQuestions.find(q => q.id === questionId);
    return question && optionIndex === question.correct;
  };

  const isSelected = (questionId: string, optionIndex: number) => {
    return selectedAnswers[questionId] === optionIndex;
  };

  const hasAnswered = (questionId: string) => {
    return selectedAnswers[questionId] !== undefined;
  };

  // Don't render until questions are shuffled
  if (shuffledQuestions.length === 0) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center text-gray-600 dark:text-gray-400" style={isDark ? { color: '#9ca3af' } : undefined}>
          Loading quiz...
        </div>
      </div>
    );
  }

  // Show summary screen if completed and at the end
  const showSummary = completed && currentQuestionIndex >= shuffledQuestions.length;
  const currentQuestion = currentQuestionIndex < shuffledQuestions.length 
    ? shuffledQuestions[currentQuestionIndex] 
    : null;


  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="p-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" style={isDark ? { backgroundColor: 'rgba(30, 58, 138, 0.15)', borderColor: '#1e3a8a' } : undefined}>
      <div className="flex justify-between items-center mb-6">
        <h2 
          ref={headingRef}
          id={`quiz-${variant}-${resourceSlug}`}
          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          style={isDark ? { color: '#f9fafb' } : undefined}
        >
          Quiz
        </h2>
        <div className="flex items-center gap-4">
          {!showSummary && shuffledQuestions.length > 0 && (
            <span 
              className="text-sm text-gray-600 dark:text-gray-400"
              style={isDark ? { color: '#9ca3af' } : undefined}
            >
              Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
            </span>
          )}
          {completed && shuffledQuestions.length > 0 && (
            <span 
              className="text-lg font-semibold text-gray-700 dark:text-gray-300"
              style={isDark ? { color: '#d1d5db' } : undefined}
            >
              Score: {score} / {shuffledQuestions.length}
            </span>
          )}
          <button
            onClick={handleToggleRandomMode}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors border flex items-center gap-2 ${
              randomMode
                ? 'text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 border-blue-700 dark:border-blue-600'
                : 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-800'
            }`}
            style={isDark && !randomMode ? { backgroundColor: '#374151', borderColor: '#1f2937', color: '#e5e7eb' } : undefined}
            title={randomMode ? 'Random mode: Questions and options are shuffled' : 'Click to enable random mode: Questions and options will be shuffled'}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className={randomMode ? 'opacity-100' : 'opacity-60'}
            >
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
            </svg>
            Random
          </button>
          <button
            onClick={handleClearQuiz}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors border border-gray-300 dark:border-gray-800"
            style={isDark ? { backgroundColor: '#374151', borderColor: '#1f2937', color: '#e5e7eb' } : undefined}
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
            Reset Quiz
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {!showSummary && shuffledQuestions.length > 0 && (
        <div className="mb-6">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2" style={isDark ? { backgroundColor: '#374151' } : undefined}>
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%`,
                backgroundColor: isDark ? '#3b82f6' : '#2563eb'
              }}
            />
          </div>
        </div>
      )}

      {/* Summary Screen */}
      {showSummary ? (
        <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm dark:shadow-none" style={isDark ? { backgroundColor: '#1f2937', borderColor: '#1f2937' } : undefined}>
          <div className="text-center mb-6">
            <h3 
              className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
              style={isDark ? { color: '#f9fafb' } : undefined}
            >
              Quiz Complete!
            </h3>
            <div 
              className="text-4xl font-bold mb-4"
              style={{ color: shuffledQuestions.length > 0 && score === shuffledQuestions.length ? '#10b981' : shuffledQuestions.length > 0 && score >= shuffledQuestions.length * 0.7 ? '#3b82f6' : '#ef4444' }}
            >
              {score} / {shuffledQuestions.length}
            </div>
            <p 
              className="text-gray-600 dark:text-gray-400"
              style={isDark ? { color: '#9ca3af' } : undefined}
            >
              {shuffledQuestions.length > 0 && score === shuffledQuestions.length 
                ? 'Perfect score! 🎉' 
                : shuffledQuestions.length > 0 && score >= shuffledQuestions.length * 0.7 
                  ? 'Great job! 👍' 
                  : 'Keep practicing! 💪'}
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentQuestionIndex(0)}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors"
            >
              Review Questions
            </button>
            <button
              onClick={handleClearQuiz}
              className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors border border-gray-300 dark:border-gray-800"
              style={isDark ? { backgroundColor: '#374151', borderColor: '#1f2937', color: '#e5e7eb' } : undefined}
            >
              Start Over
            </button>
          </div>
        </div>
      ) : currentQuestion ? (
        /* Single Question View */
        <>
          <div className="mb-4">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100" style={isDark ? { color: '#f9fafb' } : undefined}>
              {currentQuestionIndex + 1}. {formatQuestionText(currentQuestion.question, isDark)}
            </div>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, optionIndex) => {
              const answered = hasAnswered(currentQuestion.id);
              const selected = isSelected(currentQuestion.id, optionIndex);
              const correct = isCorrect(currentQuestion.id, optionIndex);
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
                    name={currentQuestion.id}
                    value={optionIndex}
                    checked={selected}
                    onChange={() => handleAnswerSelect(currentQuestion.id, optionIndex)}
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

          {hasAnswered(currentQuestion.id) && currentQuestion.explanation && (
            <div className="mt-4 py-4">
              <p className="text-gray-700 dark:text-gray-200" style={isDark ? { color: '#e5e7eb' } : undefined}>
                <strong className="text-blue-900 dark:text-blue-200" style={isDark ? { color: '#bfdbfe' } : undefined}>Explanation:</strong>{' '}
                {formatQuestionText(currentQuestion.explanation, isDark)}
              </p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-800" style={isDark ? { borderColor: '#1f2937' } : undefined}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors border border-gray-300 dark:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              style={isDark ? { backgroundColor: '#374151', borderColor: '#1f2937', color: '#e5e7eb' } : undefined}
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={shuffledQuestions.length > 0 && currentQuestionIndex >= shuffledQuestions.length - 1 && !completed}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {shuffledQuestions.length > 0 && currentQuestionIndex >= shuffledQuestions.length - 1 && completed 
                ? 'View Summary →' 
                : shuffledQuestions.length > 0 && currentQuestionIndex >= shuffledQuestions.length - 1 
                  ? 'Complete Quiz →' 
                  : 'Next →'}
            </button>
          </div>
        </>
      ) : null}
      </div>
    </div>
  );
}
