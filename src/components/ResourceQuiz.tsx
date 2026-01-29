"use client";

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { triggerConfetti } from '@/lib/utils';
import { ResourceQuizProps } from './quiz/types';
import { useQuizState } from './quiz/useQuizState';
import { TestRunner } from './quiz/javascript-dom/TestRunner';
import QuizDrawer from './quiz/QuizDrawer';
import QuizInstructions from './quiz/QuizInstructions';
import QuizQuestionView from './quiz/QuizQuestionView';
import QuizSummary from './quiz/QuizSummary';
import QuizNavigation from './quiz/QuizNavigation';

export default function ResourceQuiz({ quizData, resourceSlug, variant = 'desktop', autoOpen = false, onClose: externalOnClose }: ResourceQuizProps & { autoOpen?: boolean; onClose?: () => void }) {
  // variant is kept for potential future use but currently unused
  void variant;
  const [isQuizDrawerOpen, setIsQuizDrawerOpen] = useState<boolean>(autoOpen);
  const [isDrawerAnimating, setIsDrawerAnimating] = useState<boolean>(false);
  const [isDrawerClosing, setIsDrawerClosing] = useState<boolean>(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [revealedQuestions, setRevealedQuestions] = useState<Set<string>>(new Set());
  const reviewTestRunnerRef = useRef<TestRunner | null>(null);
  // Initialize from localStorage synchronously if available (client-side only)
  const [hasCompletedFromStorage, setHasCompletedFromStorage] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const storageKey = `quiz-${resourceSlug}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const savedState = JSON.parse(saved);
        return (savedState.quizCompleted ?? savedState.completed) || false;
      }
    } catch (error) {
      console.error('Error checking quiz completion status:', error);
    }
    return false;
  });
  const isDark = useDarkMode();

  const {
    selectedAnswers,
    score,
    completed,
    quizCompleted,
    markQuizCompleted,
    saveQuizStateNow,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    shuffledQuestions,
    randomMode,
    studentName,
    setStudentName,
    circleWindowStart,
    setCircleWindowStart,
    previousCompletedRef,
    previousShowSummaryRef,
    isInitialLoad,
    handleClearQuiz,
    handleToggleRandomMode,
    handleAnswerSelect,
    handleCodeAnswerSelect,
    isCorrect,
    isSelected,
    hasAnswered,
    getIncorrectQuestions,
  } = useQuizState(quizData, resourceSlug);

  useEffect(() => {
    if (!reviewTestRunnerRef.current) {
      reviewTestRunnerRef.current = new TestRunner();
    }

    return () => {
      if (reviewTestRunnerRef.current) {
        reviewTestRunnerRef.current.cleanup();
      }
    };
  }, []);

  // Use a ref to track the current circleWindowStart value to avoid infinite loops
  const circleWindowStartRef = useRef(circleWindowStart);
  
  // Update ref when circleWindowStart changes (from external updates)
  useEffect(() => {
    circleWindowStartRef.current = circleWindowStart;
  }, [circleWindowStart]);

  // Use circle window hook - it manages its own state internally
  // We'll use the hook's return value directly instead of managing separate state
  // For now, keep using the state from useQuizState but update it
  useEffect(() => {
    if (shuffledQuestions.length === 0 || currentQuestionIndex < 0) return;
    
    const maxVisible = isMobile ? 5 : 10;
    const totalQuestions = shuffledQuestions.length;
    
    if (totalQuestions <= maxVisible) {
      if (circleWindowStartRef.current !== 0) {
        setCircleWindowStart(0);
      }
      return;
    }
    
    // Use ref value to avoid dependency on circleWindowStart
    const currentWindowStart = circleWindowStartRef.current;
    const windowEnd = currentWindowStart + maxVisible;
    const relativePosition = currentQuestionIndex - currentWindowStart;
    
    let newStart: number | null = null;
    
    if (currentQuestionIndex < currentWindowStart) {
      newStart = Math.max(0, currentQuestionIndex);
    } else if (currentQuestionIndex >= windowEnd) {
      newStart = Math.min(totalQuestions - maxVisible, currentQuestionIndex - maxVisible + 1);
    } else if (relativePosition === 0 && currentWindowStart > 0 && currentQuestionIndex > 0) {
      newStart = Math.max(0, currentQuestionIndex - maxVisible + 1);
    } else if (relativePosition === maxVisible - 1 && windowEnd < totalQuestions && currentQuestionIndex < totalQuestions - 1) {
      newStart = Math.min(totalQuestions - maxVisible, currentQuestionIndex);
    }
    
    // Only update if we calculated a new value and it's different from current
    if (newStart !== null && newStart !== currentWindowStart) {
      setCircleWindowStart(newStart);
    }
  }, [currentQuestionIndex, shuffledQuestions.length, isMobile, setCircleWindowStart]);

  // Sync with localStorage when resourceSlug changes (in case user navigates to different quiz)
  useLayoutEffect(() => {
    try {
      const storageKey = `quiz-${resourceSlug}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const savedState = JSON.parse(saved);
        const wasCompleted = (savedState.quizCompleted ?? savedState.completed) || false;
        setHasCompletedFromStorage(wasCompleted);
      } else {
        setHasCompletedFromStorage(false);
      }
    } catch (error) {
      console.error('Error checking quiz completion status:', error);
    }
  }, [resourceSlug]);

  // Update hasCompletedFromStorage when quiz completion changes from useQuizState
  useEffect(() => {
    if (quizCompleted) {
      setHasCompletedFromStorage(true);
    }
  }, [quizCompleted]);

  // If the quiz is already completed, reveal all answers for review
  useEffect(() => {
    if (!shuffledQuestions.length) return;
    if (quizCompleted || hasCompletedFromStorage) {
      setRevealedQuestions(new Set(shuffledQuestions.map(question => question.id)));
    }
  }, [quizCompleted, hasCompletedFromStorage, shuffledQuestions]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Trigger confetti when quiz is completed AND user is viewing the summary screen AND score >= 85%
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
    // 4. Score is >= 85%
    if (completed && showSummary && !previousShowSummaryRef.current && scorePercentage >= 85) {
      // Small delay to ensure summary screen is rendered
      const timer = setTimeout(() => {
        triggerConfetti();
      }, 300);
      return () => clearTimeout(timer);
    }
    
    previousCompletedRef.current = completed;
    previousShowSummaryRef.current = showSummary;
  }, [completed, currentQuestionIndex, shuffledQuestions.length, score, isInitialLoad, previousCompletedRef, previousShowSummaryRef]);

  // Trigger drawer animation when drawer opens
  useEffect(() => {
    if (isQuizDrawerOpen && !isDrawerClosing) {
      // Small delay to ensure DOM is ready, then trigger animation
      const timer = setTimeout(() => {
        setIsDrawerAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else if (!isQuizDrawerOpen) {
      setIsDrawerAnimating(false);
      setIsDrawerClosing(false);
    }
  }, [isQuizDrawerOpen, isDrawerClosing]);

  // Handle drawer close with animation
  const handleCloseDrawer = () => {
    setIsDrawerClosing(true);
    setIsDrawerAnimating(false);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      setIsQuizDrawerOpen(false);
      setIsDrawerClosing(false);
      // Call external onClose if provided (for schedule page)
      if (externalOnClose) {
        externalOnClose();
      }
    }, 300); // Match the transition duration
  };

  const handleNext = () => {
    if (shuffledQuestions.length === 0) return;
    if (currentQuestionIndex === -1) {
      // Move from instructions to first question
      setCurrentQuestionIndex(0);
    } else if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentQuestionIndex === shuffledQuestions.length - 1) {
      // Complete quiz and show summary
      markQuizCompleted();
      setCurrentQuestionIndex(shuffledQuestions.length);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex === 0) {
      // Go back to instructions from first question
      setCurrentQuestionIndex(-1);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRevealAnswer = (questionId: string) => {
    setRevealedQuestions(prev => new Set([...prev, questionId]));
  };

  const handleReview = async () => {
    // Mark quiz as completed so grading is enabled
    markQuizCompleted();

    // Run tests for JavaScript DOM questions so they are graded during review
    if (reviewTestRunnerRef.current) {
      for (const question of shuffledQuestions) {
        if (question.type !== 'javascript-dom') continue;

        const savedAnswer = selectedAnswers[question.id];
        const hasCodeAnswer = typeof savedAnswer === 'object' && savedAnswer !== null && 'html' in savedAnswer;
        if (!hasCodeAnswer) continue;

        const codeAnswer = savedAnswer as { html: string; css: string; js: string; testResults?: { allPassed: boolean } };
        try {
          const results = await reviewTestRunnerRef.current.executeTests(
            codeAnswer.html,
            codeAnswer.css,
            codeAnswer.js,
            question.testCases,
            question.testCode
          );
          handleCodeAnswerSelect(question.id, { ...codeAnswer, testResults: results }, results.allPassed);
        } catch (error) {
          handleCodeAnswerSelect(
            question.id,
            {
              ...codeAnswer,
              testResults: {
                allPassed: false,
                results: [],
                executionError: error instanceof Error ? error.message : 'Unknown error',
              },
            },
            false
          );
        }
      }
    }

    // Reveal all questions
    const allQuestionIds = new Set(shuffledQuestions.map(q => q.id));
    setRevealedQuestions(allQuestionIds);

    // Persist latest state before navigating
    saveQuizStateNow();

    // Navigate to first question
    setCurrentQuestionIndex(0);
  };

  const handleClearQuizWithReveals = () => {
    handleClearQuiz();
    setRevealedQuestions(new Set());
    setHasCompletedFromStorage(false);
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

  // Show instructions page if at index -1
  const showInstructions = currentQuestionIndex === -1;
  // Show summary screen if completed and at the end
  const showSummary = completed && currentQuestionIndex >= shuffledQuestions.length;
  const currentQuestion = currentQuestionIndex >= 0 && currentQuestionIndex < shuffledQuestions.length
    ? shuffledQuestions[currentQuestionIndex]
    : null;

  const incorrectQuestions = getIncorrectQuestions();
  const scorePercentage = shuffledQuestions.length > 0 ? Math.round((score / shuffledQuestions.length) * 100) : 0;

  // If quiz drawer is not open, show the "Take Quiz" button
  if (!isQuizDrawerOpen) {
    // Use hasCompletedFromStorage to check completion status even before shuffledQuestions loads
    const hasCompleted = hasCompletedFromStorage || (completed && shuffledQuestions.length > 0);
    const scorePercentage = shuffledQuestions.length > 0 ? Math.round((score / shuffledQuestions.length) * 100) : 0;
    
    return (
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h2>Take the Quiz</h2>
          <button
            onClick={() => setIsQuizDrawerOpen(true)}
            className="px-8 py-4 text-lg font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-lg transition-colors shadow-lg"
          >
            {hasCompleted ? 'Take Quiz Again' : 'Take Quiz'}
          </button>
          {hasCompleted && (
            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-400" style={isDark ? { color: '#9ca3af' } : undefined}>
                Previous score: <span className="font-semibold">{score} / {shuffledQuestions.length}</span> ({scorePercentage}%)
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <QuizDrawer
      isOpen={isQuizDrawerOpen}
      isAnimating={isDrawerAnimating}
      isClosing={isDrawerClosing}
      onClose={handleCloseDrawer}
      isDark={isDark}
    >
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-4xl mx-auto p-6">
          {/* Instructions Page */}
          {showInstructions ? (
            <QuizInstructions
              randomMode={randomMode}
              onToggleRandomMode={handleToggleRandomMode}
              onClearQuiz={handleClearQuizWithReveals}
              onStartQuiz={handleNext}
              isDark={isDark}
            />
          ) : (
            <>
              {/* Summary Screen */}
              {showSummary ? (
                <QuizSummary
                  quizData={quizData}
                  score={score}
                  totalQuestions={shuffledQuestions.length}
                  scorePercentage={scorePercentage}
                  studentName={studentName}
                  onStudentNameChange={setStudentName}
                  incorrectQuestions={incorrectQuestions}
                  selectedAnswers={selectedAnswers}
                  resourceSlug={resourceSlug}
                  onClearQuiz={handleClearQuizWithReveals}
                  onReview={handleReview}
                  isGeneratingReport={isGeneratingReport}
                  onGeneratingChange={setIsGeneratingReport}
                  isDark={isDark}
                />
              ) : currentQuestion ? (
                /* Single Question View */
                <QuizQuestionView
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  selectedAnswers={selectedAnswers}
                  onAnswerSelect={handleAnswerSelect}
                  onCodeAnswerSelect={handleCodeAnswerSelect}
                  isCorrect={isCorrect}
                  isSelected={isSelected}
                  hasAnswered={hasAnswered}
                  completed={completed}
                  isRevealed={revealedQuestions.has(currentQuestion.id)}
                  onRevealAnswer={handleRevealAnswer}
                  showSummary={showSummary}
                  isDark={isDark}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
      
      {/* Fixed Navigation buttons at bottom - only in content area */}
      {!showSummary && !showInstructions && currentQuestion && (
        <QuizNavigation
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={shuffledQuestions.length}
          completed={completed}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoNext={true}
          questions={shuffledQuestions}
          selectedAnswers={selectedAnswers}
          circleWindowStart={circleWindowStart}
          isMobile={isMobile}
          onQuestionClick={setCurrentQuestionIndex}
          hasAnswered={hasAnswered}
          revealedQuestions={revealedQuestions}
          showSummary={showSummary}
          isDark={isDark}
        />
      )}
    </QuizDrawer>
  );
}
