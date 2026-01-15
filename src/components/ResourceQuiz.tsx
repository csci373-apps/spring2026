"use client";

import { useState, useEffect, useLayoutEffect } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { triggerConfetti } from '@/lib/utils';
import { ResourceQuizProps } from './quiz/types';
import { useQuizState } from './quiz/useQuizState';
import QuizDrawer from './quiz/QuizDrawer';
import QuizInstructions from './quiz/QuizInstructions';
import QuizQuestionView from './quiz/QuizQuestionView';
import QuizSummary from './quiz/QuizSummary';
import QuizNavigation from './quiz/QuizNavigation';

export default function ResourceQuiz({ quizData, resourceSlug, variant = 'desktop', autoOpen = false, onClose: externalOnClose }: ResourceQuizProps & { autoOpen?: boolean; onClose?: () => void }) {
  const [isQuizDrawerOpen, setIsQuizDrawerOpen] = useState<boolean>(autoOpen);
  const [isDrawerAnimating, setIsDrawerAnimating] = useState<boolean>(false);
  const [isDrawerClosing, setIsDrawerClosing] = useState<boolean>(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  // Initialize from localStorage synchronously if available (client-side only)
  const [hasCompletedFromStorage, setHasCompletedFromStorage] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const storageKey = `quiz-${resourceSlug}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const savedState = JSON.parse(saved);
        return savedState.completed || false;
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
    isCorrect,
    isSelected,
    hasAnswered,
    getIncorrectQuestions,
  } = useQuizState(quizData, resourceSlug);

  // Use circle window hook - it manages its own state internally
  // We'll use the hook's return value directly instead of managing separate state
  // For now, keep using the state from useQuizState but update it
  useEffect(() => {
    if (shuffledQuestions.length === 0 || currentQuestionIndex < 0) return;
    
    const maxVisible = isMobile ? 5 : 10;
    const totalQuestions = shuffledQuestions.length;
    
    if (totalQuestions <= maxVisible) {
      setCircleWindowStart(0);
      return;
    }
    
    const windowEnd = circleWindowStart + maxVisible;
    const relativePosition = currentQuestionIndex - circleWindowStart;
    
    if (currentQuestionIndex < circleWindowStart) {
      setCircleWindowStart(Math.max(0, currentQuestionIndex));
    } else if (currentQuestionIndex >= windowEnd) {
      const newStart = Math.min(totalQuestions - maxVisible, currentQuestionIndex - maxVisible + 1);
      setCircleWindowStart(newStart);
    } else if (relativePosition === 0 && circleWindowStart > 0 && currentQuestionIndex > 0) {
      const newStart = Math.max(0, currentQuestionIndex - maxVisible + 1);
      setCircleWindowStart(newStart);
    } else if (relativePosition === maxVisible - 1 && windowEnd < totalQuestions && currentQuestionIndex < totalQuestions - 1) {
      const newStart = Math.min(totalQuestions - maxVisible, currentQuestionIndex);
      setCircleWindowStart(newStart);
    }
  }, [currentQuestionIndex, shuffledQuestions.length, isMobile, circleWindowStart, setCircleWindowStart]);

  // Sync with localStorage when resourceSlug changes (in case user navigates to different quiz)
  useLayoutEffect(() => {
    try {
      const storageKey = `quiz-${resourceSlug}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const savedState = JSON.parse(saved);
        const wasCompleted = savedState.completed || false;
        setHasCompletedFromStorage(wasCompleted);
      } else {
        setHasCompletedFromStorage(false);
      }
    } catch (error) {
      console.error('Error checking quiz completion status:', error);
    }
  }, [resourceSlug]);

  // Update hasCompletedFromStorage when completed changes from useQuizState
  useEffect(() => {
    if (completed) {
      setHasCompletedFromStorage(true);
    }
  }, [completed]);

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
    } else if (currentQuestionIndex === shuffledQuestions.length - 1 && completed) {
      // Show summary
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
              onClearQuiz={handleClearQuiz}
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
                  onClearQuiz={handleClearQuiz}
                  onReview={() => setCurrentQuestionIndex(0)}
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
                  isCorrect={isCorrect}
                  isSelected={isSelected}
                  hasAnswered={hasAnswered}
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
          canGoNext={!(shuffledQuestions.length > 0 && currentQuestionIndex >= shuffledQuestions.length - 1 && !completed)}
          questions={shuffledQuestions}
          selectedAnswers={selectedAnswers}
          circleWindowStart={circleWindowStart}
          isMobile={isMobile}
          onQuestionClick={setCurrentQuestionIndex}
          hasAnswered={hasAnswered}
          isDark={isDark}
        />
      )}
    </QuizDrawer>
  );
}
