import { useState, useEffect, useRef } from 'react';
import { QuizData, QuizState, QuizQuestion } from './types';
import { shuffleArray, findOptionIndex, getOptionText } from './utils';
import { TestResults } from './javascript-dom/types';

export function useQuizState(quizData: QuizData, resourceSlug: string) {
  const [selectedAnswers, setSelectedAnswers] = useState<{ 
    [questionId: string]: string | string[] | { html: string; css: string; js: string; testResults?: TestResults } 
  }>({});
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
        // Handle both single-select (number) and multi-select (number[])
        if (!question.options) {
          return question; // Skip questions without options (e.g., JavaScript DOM questions)
        }
        const correctIndices = Array.isArray(question.correct) 
          ? question.correct 
          : question.correct !== undefined ? [question.correct] : [];
        const correctOptions = correctIndices.map(idx => question.options![idx]).filter((opt): opt is string => opt !== undefined);
        const shuffledOptions = shuffleArray(question.options);
        const newCorrectIndices = correctOptions.map(opt => shuffledOptions.indexOf(opt));
        // Preserve original type: number for single-select, number[] for multi-select
        const newCorrect = Array.isArray(question.correct) 
          ? newCorrectIndices 
          : newCorrectIndices[0];
        
        return {
          ...question,
          options: shuffledOptions,
          correct: newCorrect
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
        const restoredAnswers: { 
          [questionId: string]: string | string[] | { html: string; css: string; js: string; testResults?: TestResults } 
        } = {};
        
        if (savedState.selectedAnswers) {
          // For each saved answer, find the matching option in current shuffled questions
          Object.entries(savedState.selectedAnswers).forEach(([questionId, savedAnswer]) => {
            const question = shuffledQuestions.find(q => q.id === questionId);
            if (question) {
              // Handle JavaScript DOM code answers
              if (question.type === 'javascript-dom') {
                if (typeof savedAnswer === 'object' && savedAnswer !== null && 'html' in savedAnswer) {
                  restoredAnswers[questionId] = savedAnswer;
                }
                return;
              }
              
              // Handle multiple-choice answers
              if (!question.options) return;
              
              // Handle both string (single-select) and string[] (multi-select)
              if (Array.isArray(savedAnswer)) {
                // Multi-select: check all options exist
                const validOptions = savedAnswer.filter(opt => 
                  findOptionIndex(opt, question.options!) !== -1
                );
                if (validOptions.length > 0) {
                  restoredAnswers[questionId] = validOptions;
                }
              } else {
                // Single-select: check if option exists
                if (typeof savedAnswer === 'string') {
                  const optionIndex = findOptionIndex(savedAnswer, question.options!);
                  if (optionIndex !== -1) {
                    restoredAnswers[questionId] = savedAnswer;
                  }
                }
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
      const savedAnswer = selectedAnswers[question.id];
      if (savedAnswer === undefined) return acc;

      // Handle JavaScript DOM questions
      if (question.type === 'javascript-dom') {
        if (typeof savedAnswer === 'object' && savedAnswer !== null && 'testResults' in savedAnswer) {
          const testResults = (savedAnswer as { testResults?: TestResults }).testResults;
          if (testResults && testResults.allPassed) {
            return acc + 1;
          }
        }
        return acc;
      }

      // Handle multiple-choice questions (single-select and multi-select)
      if (!question.options || question.options.length === 0) return acc;
      
      const correctIndices = Array.isArray(question.correct) 
        ? question.correct 
        : question.correct !== undefined ? [question.correct] : [];
      const correctOptionTexts = correctIndices.map(idx => question.options![idx]).filter((opt): opt is string => opt !== undefined);
      
      if (Array.isArray(question.correct)) {
        // Multi-select: check that selected array exactly matches correct array
        const selectedArray = Array.isArray(savedAnswer) ? savedAnswer : [];
        // Check: all correct selected, no incorrect selected, same length
        const allCorrectSelected = correctOptionTexts.every(text => selectedArray.includes(text));
        const noIncorrectSelected = selectedArray.every(text => correctOptionTexts.includes(text));
        const sameLength = selectedArray.length === correctOptionTexts.length;
        return allCorrectSelected && noIncorrectSelected && sameLength ? acc + 1 : acc;
      } else {
        // Single-select: existing logic
        if (typeof savedAnswer === 'string' && savedAnswer === correctOptionTexts[0]) {
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
    setCurrentQuestionIndex(-1); // Go back to instructions
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
    // Just reset the UI state to instructions
    setCurrentQuestionIndex(-1);
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    // Find the question and get the option text
    const question = shuffledQuestions.find(q => q.id === questionId);
    if (question) {
      const optionText = getOptionText(question, optionIndex);
      if (optionText !== undefined) {
        // Determine question type: check type field, or infer from correct field
        const isMultiSelect = question.type === 'select-all' || Array.isArray(question.correct);
        
        if (isMultiSelect) {
          // Multi-select: toggle option in array
          setSelectedAnswers(prev => {
            const currentAnswer = prev[questionId];
            const currentArray = Array.isArray(currentAnswer) ? currentAnswer : [];
            
            if (currentArray.includes(optionText)) {
              // Remove if already selected
              return {
                ...prev,
                [questionId]: currentArray.filter(text => text !== optionText),
              };
            } else {
              // Add if not selected
              return {
                ...prev,
                [questionId]: [...currentArray, optionText],
              };
            }
          });
        } else {
          // Single-select: replace previous answer
          setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: optionText,
          }));
        }
      }
    }
  };

  // Handler for JavaScript DOM code submissions
  const handleCodeAnswerSelect = (questionId: string, answer: { html: string; css: string; js: string; testResults?: TestResults }, passed: boolean) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const isCorrect = (questionId: string, optionIndex: number): boolean => {
    const question = shuffledQuestions.find(q => q.id === questionId);
    if (!question) return false;
    
    if (Array.isArray(question.correct)) {
      return question.correct.includes(optionIndex);
    } else {
      return optionIndex === question.correct;
    }
  };

  const isSelected = (questionId: string, optionIndex: number): boolean => {
    const question = shuffledQuestions.find(q => q.id === questionId);
    if (!question || !question.options) return false;
    
    const savedAnswer = selectedAnswers[questionId];
    if (savedAnswer === undefined) return false;
    
    // Don't check for JavaScript DOM questions
    if (question.type === 'javascript-dom') return false;
    
    const optionText = question.options[optionIndex];
    
    // Handle both string (single-select) and string[] (multi-select)
    if (Array.isArray(savedAnswer)) {
      return savedAnswer.includes(optionText);
    } else {
      return optionText === savedAnswer;
    }
  };

  const hasAnswered = (questionId: string): boolean => {
    const answer = selectedAnswers[questionId];
    if (answer === undefined) return false;
    
    // Handle JavaScript DOM code answers
    if (typeof answer === 'object' && answer !== null && 'html' in answer) {
      return true; // Code has been submitted
    }
    
    if (Array.isArray(answer)) {
      return answer.length > 0; // Multi-select: must have at least one selection
    }
    return true; // Single-select: any string value means answered
  };

  const getIncorrectQuestions = () => {
    return shuffledQuestions.filter(question => {
      const savedAnswer = selectedAnswers[question.id];
      if (savedAnswer === undefined) return false;
      
      // Handle JavaScript DOM questions
      if (question.type === 'javascript-dom') {
        if (typeof savedAnswer === 'object' && savedAnswer !== null && 'testResults' in savedAnswer) {
          const testResults = (savedAnswer as { testResults?: TestResults }).testResults;
          // Question is incorrect if tests didn't all pass
          return !(testResults && testResults.allPassed);
        }
        return true; // No valid answer
      }
      
      // Handle multiple-choice questions
      if (!question.options || question.options.length === 0) return false;
      
      // Handle both single-select and multi-select
      if (Array.isArray(question.correct)) {
        // Multi-select: check if arrays match exactly
        const correctIndices = question.correct;
        const correctOptionTexts = correctIndices.map(idx => question.options![idx]);
        const selectedArray = Array.isArray(savedAnswer) ? savedAnswer : [];
        
        const allCorrectSelected = correctOptionTexts.every(text => selectedArray.includes(text));
        const noIncorrectSelected = selectedArray.every(text => correctOptionTexts.includes(text));
        const sameLength = selectedArray.length === correctOptionTexts.length;
        
        // Question is incorrect if arrays don't match exactly
        return !(allCorrectSelected && noIncorrectSelected && sameLength);
      } else {
        // Single-select: check if selected matches correct
        if (typeof savedAnswer !== 'string') return true; // Wrong type
        const selectedIndex = findOptionIndex(savedAnswer, question.options!);
        if (selectedIndex === -1) return true; // Option not found
        return selectedIndex !== question.correct;
      }
    });
  };

  // Function to manually mark quiz as completed (allows completion without answering all questions)
  const handleCompleteQuiz = () => {
    setCompleted(true);
    // Save to localStorage
    try {
      const state: QuizState = {
        selectedAnswers,
        score,
        completed: true,
        timestamp: Date.now(),
        randomMode,
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving quiz completion:', error);
    }
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
    handleCodeAnswerSelect,
    isCorrect,
    isSelected,
    hasAnswered,
    getIncorrectQuestions,
    handleCompleteQuiz,
  };
}
