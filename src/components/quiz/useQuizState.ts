import { useState, useEffect, useRef } from 'react';
import { QuizData, QuizState, QuizQuestion } from './types';
import { shuffleArray, findOptionIndex, getOptionText } from './utils';

export function useQuizState(quizData: QuizData, resourceSlug: string) {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
  const [score, setScore] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [randomMode, setRandomMode] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('');
  const [circleWindowStart, setCircleWindowStart] = useState<number>(0);
  
  const previousCompletedRef = useRef<boolean>(false);
  const previousShowSummaryRef = useRef<boolean>(false);
  const isInitialLoad = useRef<boolean>(true);
  const restoredCompletedRef = useRef<boolean | null>(null);
  const isRestoringRef = useRef<boolean>(false);
  
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
    // Reset circle window when questions change
    setCircleWindowStart(0);
  }, [quizData.questions, randomMode]);

  // Load quiz state from localStorage on mount (after questions are shuffled)
  useEffect(() => {
    if (shuffledQuestions.length === 0) return;

    // Mark that we're restoring to prevent score calculation from overwriting
    isRestoringRef.current = true;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const savedState: QuizState = JSON.parse(saved);
        
        // Restore answers by matching saved option text to current shuffled options
        // This works regardless of random mode since we match by content, not index
        const restoredAnswers: { [questionId: string]: string } = {};
        
        if (savedState.selectedAnswers) {
          // For each saved answer, find the matching option in current shuffled questions
          Object.entries(savedState.selectedAnswers).forEach(([questionId, savedOptionText]) => {
            const question = shuffledQuestions.find(q => q.id === questionId);
            if (question) {
              // Check if the saved option text exists in current options
              const optionIndex = findOptionIndex(savedOptionText, question.options);
              if (optionIndex !== -1) {
                // Option found, restore it
                restoredAnswers[questionId] = savedOptionText;
              }
              // If option not found (question changed), skip it
            }
          });
        }
        
        setSelectedAnswers(restoredAnswers);
        setScore(savedState.score || 0);
        const wasCompleted = savedState.completed || false;
        setCompleted(wasCompleted);
        // Store the restored completed state to preserve it
        restoredCompletedRef.current = wasCompleted;
        // Set the previous completed ref to prevent confetti on initial load
        previousCompletedRef.current = wasCompleted;
        // Always start at instructions page when drawer opens
        // User can navigate to continue their quiz from there
        setCurrentQuestionIndex(-1);
        previousShowSummaryRef.current = false;
      } else {
        // No saved state, start at instructions
        setCurrentQuestionIndex(-1);
      }
    } catch (error) {
      console.error('Error loading quiz state:', error);
      // On error, start at instructions
      setCurrentQuestionIndex(-1);
    }
    
    // Mark restoration as complete after a brief delay to allow state updates to settle
    setTimeout(() => {
      isInitialLoad.current = false;
      isRestoringRef.current = false;
    }, 100);
  }, [storageKey, shuffledQuestions]);

  // Calculate score whenever selectedAnswers changes
  useEffect(() => {
    if (shuffledQuestions.length === 0) return;
    
    const newScore = shuffledQuestions.reduce((acc, question) => {
      const savedOptionText = selectedAnswers[question.id];
      if (savedOptionText !== undefined) {
        // Compare saved option text directly with the correct option text
        const correctOptionText = question.options[question.correct];
        if (savedOptionText === correctOptionText) {
          return acc + 1;
        }
      }
      return acc;
    }, 0);
    
    setScore(newScore);
    const allAnswered = shuffledQuestions.every(q => selectedAnswers[q.id] !== undefined);
    // If we restored a completed state from localStorage, preserve it even if allAnswered is false
    // (this can happen if some answers couldn't be restored due to question changes)
    // Otherwise, use the calculated allAnswered value
    const shouldBeCompleted = restoredCompletedRef.current !== null 
      ? (restoredCompletedRef.current || allAnswered)
      : allAnswered;
    setCompleted(shouldBeCompleted);
    // Clear the restored flag after first calculation
    if (restoredCompletedRef.current !== null) {
      restoredCompletedRef.current = null;
    }

    // Save to localStorage (but skip during restoration to avoid overwriting saved state)
    if (!isRestoringRef.current) {
      try {
        const state: QuizState = {
          selectedAnswers,
          score: newScore,
          completed: shouldBeCompleted,
          timestamp: Date.now(),
          randomMode,
        };
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (error) {
        console.error('Error saving quiz state:', error);
      }
    }
  }, [selectedAnswers, shuffledQuestions, storageKey, randomMode]);

  const handleClearQuiz = () => {
    setSelectedAnswers({});
    setScore(0);
    setCompleted(false);
    setCurrentQuestionIndex(0);
    setStudentName('');
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing quiz state:', error);
    }
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
    // Don't clear localStorage - answers will be automatically remapped when questions reshuffle
    // Just reset the UI state
    setCurrentQuestionIndex(0);
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    // Find the question and get the option text
    const question = shuffledQuestions.find(q => q.id === questionId);
    if (question) {
      const optionText = getOptionText(question, optionIndex);
      if (optionText !== undefined) {
        // Save the option text instead of the index
        setSelectedAnswers(prev => ({
          ...prev,
          [questionId]: optionText,
        }));
      }
    }
  };

  const isCorrect = (questionId: string, optionIndex: number): boolean => {
    const question = shuffledQuestions.find(q => q.id === questionId);
    return question ? optionIndex === question.correct : false;
  };

  const isSelected = (questionId: string, optionIndex: number): boolean => {
    const question = shuffledQuestions.find(q => q.id === questionId);
    if (!question) return false;
    
    const savedOptionText = selectedAnswers[questionId];
    if (savedOptionText === undefined) return false;
    
    // Check if the saved option text matches the option at the given index
    return question.options[optionIndex] === savedOptionText;
  };

  const hasAnswered = (questionId: string): boolean => {
    return selectedAnswers[questionId] !== undefined;
  };

  const getIncorrectQuestions = () => {
    return shuffledQuestions.filter(question => {
      const savedOptionText = selectedAnswers[question.id];
      if (savedOptionText === undefined) return false;
      
      // Find the index of the saved option text
      const selectedIndex = findOptionIndex(savedOptionText, question.options);
      if (selectedIndex === -1) return false;
      
      // Check if the selected index matches the correct index
      return selectedIndex !== question.correct;
    });
  };

  return {
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
  };
}
