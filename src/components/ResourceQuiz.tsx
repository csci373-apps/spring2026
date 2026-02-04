"use client";

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { triggerConfetti } from '@/lib/utils';
import { ResourceQuizProps } from './quiz/types';
import { useQuizState } from './quiz/useQuizState';
import QuizDrawer from './quiz/QuizDrawer';
import QuizInstructions, { QuizInstructionsFooter } from './quiz/QuizInstructions';
import QuizQuestionView from './quiz/QuizQuestionView';
import QuizSummary from './quiz/QuizSummary';
import QuizNavigation from './quiz/QuizNavigation';

export default function ResourceQuiz({ quizData, resourceSlug, variant = 'desktop', autoOpen = false, onClose: externalOnClose, cheatsheetContent }: ResourceQuizProps & { autoOpen?: boolean; onClose?: () => void }) {
  // variant is kept for potential future use but currently unused
  void variant;
  const [isQuizDrawerOpen, setIsQuizDrawerOpen] = useState<boolean>(autoOpen);
  const [isDrawerAnimating, setIsDrawerAnimating] = useState<boolean>(false);
  const [isDrawerClosing, setIsDrawerClosing] = useState<boolean>(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [revealedQuestions, setRevealedQuestions] = useState<Set<string>>(new Set());
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [showResetMessage, setShowResetMessage] = useState<boolean>(false);
  // Track if we've already auto-entered review mode to prevent re-triggering
  const hasAutoEnteredReviewModeRef = useRef<boolean>(false);
  // Track if quiz was completed when first loaded (before any state updates)
  const getInitialCompletedStatus = (): boolean => {
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
  };
  const wasCompletedOnLoadRef = useRef<boolean>(getInitialCompletedStatus());
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
    handleCodeAnswerSelect,
    isCorrect,
    isSelected,
    hasAnswered,
    getIncorrectQuestions,
    handleCompleteQuiz,
  } = useQuizState(quizData, resourceSlug);

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
        const wasCompleted = savedState.completed || false;
        setHasCompletedFromStorage(wasCompleted);
        // Update the ref to track if quiz was completed when loaded
        wasCompletedOnLoadRef.current = wasCompleted;
      } else {
        setHasCompletedFromStorage(false);
        wasCompletedOnLoadRef.current = false;
      }
      // Reset auto-review flag when switching quizzes
      hasAutoEnteredReviewModeRef.current = false;
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

  // Auto-enter review mode when quiz is completed and questions are loaded
  useEffect(() => {
    // Only auto-enter review mode if:
    // 1. Quiz was already completed when first loaded (wasCompletedOnLoadRef)
    // 2. Quiz is currently completed (completed)
    // 3. Questions are loaded
    // 4. We haven't already auto-entered review mode
    // 5. Initial load is complete (to avoid triggering during state restoration)
    if (
      wasCompletedOnLoadRef.current &&
      completed &&
      shuffledQuestions.length > 0 &&
      !hasAutoEnteredReviewModeRef.current &&
      !isInitialLoad.current
    ) {
      // Reveal all questions
      const allQuestionIds = new Set(shuffledQuestions.map(q => q.id));
      setRevealedQuestions(allQuestionIds);
      // Enter review mode
      setIsReviewMode(true);
      // Mark that we've auto-entered review mode
      hasAutoEnteredReviewModeRef.current = true;
    }
  }, [completed, shuffledQuestions.length, isInitialLoad]);

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
      // Move from instructions directly to first question
      setCurrentQuestionIndex(0);
    } else if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentQuestionIndex === shuffledQuestions.length - 1) {
      // On last question - allow completion even if not all questions answered
      if (!completed) {
        // Mark as completed and show summary
        handleCompleteQuiz();
      }
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

  const handleRevealAnswer = (questionId: string) => {
    setRevealedQuestions(prev => new Set([...prev, questionId]));
  };

  const handleClearQuizWithReveals = () => {
    handleClearQuiz();
    setRevealedQuestions(new Set());
    setIsReviewMode(false);
    // Reset the auto-review flag so it can trigger again if quiz is completed again
    hasAutoEnteredReviewModeRef.current = false;
    // Reset hasCompletedFromStorage so button text updates
    setHasCompletedFromStorage(false);
    // Show reset confirmation message
    setShowResetMessage(true);
    setTimeout(() => {
      setShowResetMessage(false);
    }, 3000); // Hide after 3 seconds
  };

  const handleReview = () => {
    // Reveal all questions before starting review
    const allQuestionIds = new Set(shuffledQuestions.map(q => q.id));
    setRevealedQuestions(allQuestionIds);
    setIsReviewMode(true);
    
    // Update localStorage to ensure quiz state is saved with all questions revealed
    // The quiz state is already saved, but we'll ensure it's up to date
    try {
      const storageKey = `quiz-${resourceSlug}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const savedState = JSON.parse(saved);
        // Update the saved state to ensure it's current
        const updatedState = {
          ...savedState,
          selectedAnswers,
          score,
          completed: true,
          timestamp: Date.now(),
          randomMode,
        };
        localStorage.setItem(storageKey, JSON.stringify(updatedState));
      }
    } catch (error) {
      console.error('Error updating localStorage for review:', error);
    }
    
    // Start review by going to first question
    setCurrentQuestionIndex(0);
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
          <h2>Quizzes</h2>
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
      {/* Reset confirmation message */}
      {showResetMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-out pointer-events-none">
          <div className="bg-green-600 dark:bg-green-500 text-white px-6 py-3 rounded-md shadow-lg">
            <span className="text-sm font-medium">Quiz has been reset</span>
          </div>
        </div>
      )}
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
              cheatsheetContent={cheatsheetContent}
              quizName={quizData.quizName}
              hasCompleted={hasCompletedFromStorage || completed}
              previousScore={hasCompletedFromStorage || completed ? score : undefined}
              totalQuestions={hasCompletedFromStorage || completed ? shuffledQuestions.length : undefined}
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
                  isRevealed={isReviewMode || revealedQuestions.has(currentQuestion.id)}
                  onRevealAnswer={handleRevealAnswer}
                  showSummary={showSummary || isReviewMode}
                  isDark={isDark}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
      
      {/* Fixed Navigation buttons at bottom - Instructions footer */}
      {showInstructions && (
        <QuizInstructionsFooter
          randomMode={randomMode}
          onToggleRandomMode={handleToggleRandomMode}
          onClearQuiz={handleClearQuizWithReveals}
          onStartQuiz={handleNext}
          isDark={isDark}
          hasCompleted={hasCompletedFromStorage || completed}
        />
      )}
      
      {/* Fixed Navigation buttons at bottom - Question navigation */}
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
          showSummary={showSummary || isReviewMode}
          isReviewMode={isReviewMode}
          isDark={isDark}
        />
      )}
    </QuizDrawer>
  );
}
