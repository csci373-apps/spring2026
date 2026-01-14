"use client";

import { useState, useEffect, useRef } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { triggerConfetti } from '@/lib/utils';
import hljs from 'highlight.js';
import html2canvas from 'html2canvas';

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [randomMode, setRandomMode] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [isQuizDrawerOpen, setIsQuizDrawerOpen] = useState<boolean>(false);
  const [isDrawerAnimating, setIsDrawerAnimating] = useState<boolean>(false);
  const [isDrawerClosing, setIsDrawerClosing] = useState<boolean>(false);
  const isDark = useDarkMode();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousCompletedRef = useRef<boolean>(false);
  const previousShowSummaryRef = useRef<boolean>(false);
  const isInitialLoad = useRef<boolean>(true);
  const reportRef = useRef<HTMLDivElement>(null);
  
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
    }, 300); // Match the transition duration
  };

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
    if (currentQuestionIndex > -1) {
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

  const getIncorrectQuestions = () => {
    return shuffledQuestions.filter(question => {
      const selected = selectedAnswers[question.id];
      return selected !== undefined && selected !== question.correct;
    });
  };

  // Helper to strip markdown formatting for plain text report
  const stripMarkdown = (text: string): string => {
    // Remove code blocks
    let cleaned = text.replace(/```[\s\S]*?```/g, '[code block]');
    // Remove inline code backticks
    cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
    return cleaned;
  };

  const generateReport = async () => {
    if (!reportRef.current) return;
    
    setIsGeneratingReport(true);
    try {
      // Temporarily make the report visible for capture
      const originalStyle = reportRef.current.style.cssText;
      reportRef.current.style.cssText = 'position: fixed; left: 0; top: 0; width: 800px; z-index: 9999; opacity: 1; visibility: visible;';
      
      // Wait a bit for rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
      });
      
      // Restore original style
      reportRef.current.style.cssText = originalStyle;
      
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          setIsGeneratingReport(false);
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `quiz-report-${resourceSlug}-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsGeneratingReport(false);
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Error generating report:', error);
      if (reportRef.current) {
        // Restore original style on error
        reportRef.current.style.cssText = 'position: absolute; left: -9999px; top: -9999px; visibility: hidden;';
      }
      setIsGeneratingReport(false);
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
    return (
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
            <h2>Take the Quiz</h2>
          <button
            onClick={() => setIsQuizDrawerOpen(true)}
            className="px-8 py-4 text-lg font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-lg transition-colors shadow-lg"
          >
            Take Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black  opacity-70 z-400"
        onClick={handleCloseDrawer}
      />
      
      {/* Quiz Drawer */}
      <div
        className="fixed inset-0 z-410 flex items-end"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`relative w-full h-[80%] bg-white dark:bg-gray-900 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            isDrawerClosing ? 'translate-y-full' : isDrawerAnimating ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={isDark ? { backgroundColor: '#111827', pointerEvents: 'auto' } : { pointerEvents: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Absolutely positioned */}
          <button
            onClick={handleCloseDrawer}
            className="absolute top-4 right-4 z-10 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md transition-colors"
            style={isDark ? { color: '#9ca3af' } : undefined}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Navigation Sidebar */}
            {!showSummary && !showInstructions && (
              <div className="w-64 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 flex flex-col" style={isDark ? { borderColor: '#374151' } : undefined}>
                <div className="flex-1 overflow-y-auto pb-2">
                    <h3 className="hidden md:flex !text-xl !font-normal !m-0 px-8 mb-2 py-6 bg-gray-100 dark:bg-gray-800">
                        Questions
                    </h3>
                  
                  <div className="space-y-0 my-2">
                    {shuffledQuestions.map((question, index) => {
                      const answered = hasAnswered(question.id);
                      const isCurrent = index === currentQuestionIndex;
                      const isCorrect = answered && selectedAnswers[question.id] === question.correct;
                      const isLast = index === shuffledQuestions.length - 1;
                      
                      return (
                        <button
                          key={question.id}
                          onClick={() => setCurrentQuestionIndex(index)}
                          className={`w-full p-8 text-left text-sm font-normal transition-colors !border-0 !border-b-1  border-gray-200 dark:border-gray-700 leading-compact block py-2 ${
                            !isLast ? 'border-b' : ''
                          } ${
                            isCurrent
                              ? '!font-bold text-blue-400 dark:text-white hover:text-blue-600 dark:hover:text-blue-200'
                              : answered
                                ? isCorrect
                                  ? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
                                  : 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
                                : 'text-gray-500 dark:!text-gray-100 hover:text-gray-900 dark:hover:text-gray-100'
                          }`}
                          style={!isLast && isDark ? { borderColor: '#374151' } : undefined}
                        >
                          {answered && (isCorrect ? '✓ ' : '✗ ')}Question {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Quiz Content Area with Navigation */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto pb-24">
              <div className="max-w-4xl mx-auto p-6">
                {/* Instructions Page */}
                {showInstructions ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4" style={isDark ? { color: '#f9fafb' } : undefined}>
                        Quiz Instructions
                      </h2>
                      <div className="prose dark:prose-invert max-w-none">
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300" style={isDark ? { color: '#d1d5db' } : undefined}>
                          <li>Read each question carefully before selecting your answer</li>
                          <li>You can navigate between questions using the Previous and Next buttons</li>
                          <li>Use the question list on the left to jump to any question</li>
                          <li>Once you select an answer, you can review it but cannot change it</li>
                          <li>After completing all questions, you'll see your score and can review incorrect answers</li>
                          <li>You can download a report of your quiz results</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700" style={isDark ? { borderColor: '#374151' } : undefined}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400" style={isDark ? { color: '#9ca3af' } : undefined}>
                          Shuffle
                        </span>
                        <button
                          onClick={handleToggleRandomMode}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            randomMode
                              ? 'bg-blue-600 dark:bg-blue-500'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                          style={isDark && !randomMode ? { backgroundColor: '#374151' } : undefined}
                          role="switch"
                          aria-checked={randomMode}
                          title={randomMode ? 'Random mode: Questions and options are shuffled' : 'Click to enable random mode: Questions and options will be shuffled'}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              randomMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <button
                        onClick={handleClearQuiz}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors border border-gray-300 dark:border-gray-800"
                        style={isDark ? { backgroundColor: '#374151', borderColor: '#1f2937', color: '#e5e7eb' } : undefined}
                      >
                        Reset Quiz
                      </button>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        onClick={handleNext}
                        className="px-6 py-3 text-base font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors"
                      >
                        Start Quiz →
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Progress bar */}
                    {!showSummary && !showInstructions && shuffledQuestions.length > 0 && (
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
                    
                    {/* Name Input */}
                    <div className="mb-6">
                      <label 
                        htmlFor="student-name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        style={isDark ? { color: '#d1d5db' } : undefined}
                      >
                        Enter your name (optional)
                      </label>
                      <input
                        id="student-name"
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={isDark ? { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f3f4f6' } : undefined}
                      />
                    </div>

                    <div className="flex justify-center gap-4">
                      <button
                        onClick={generateReport}
                        disabled={isGeneratingReport}
                        className="px-6 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingReport ? 'Generating...' : 'Download Report'}
                      </button>
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

                    {/* Hidden Report Content for Export */}
                    <div ref={reportRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px', visibility: 'hidden', width: '800px' }}>
                      <div style={{ padding: '40px', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Arial, sans-serif', width: '100%' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>Quiz Report</h1>
                        
                        {studentName && (
                          <div style={{ marginBottom: '20px', fontSize: '18px' }}>
                            <strong>Name:</strong> {studentName}
                          </div>
                        )}
                        
                        <div style={{ marginBottom: '30px', fontSize: '20px', textAlign: 'center' }}>
                          <strong>Score:</strong> {score} / {shuffledQuestions.length} ({scorePercentage}%)
                        </div>
                        
                        {incorrectQuestions.length === 0 ? (
                          <div style={{ padding: '20px', backgroundColor: '#d1fae5', borderRadius: '8px', marginTop: '20px', textAlign: 'center', fontSize: '18px' }}>
                            Perfect score! All answers correct.
                          </div>
                        ) : (
                          <div>
                            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '30px', marginBottom: '20px' }}>
                              Incorrect Answers ({incorrectQuestions.length})
                            </h2>
                            
                            {incorrectQuestions.map((question, index) => {
                              const selectedIndex = selectedAnswers[question.id];
                              const selectedAnswer = question.options[selectedIndex];
                              const correctAnswer = question.options[question.correct];
                              
                              return (
                                <div key={question.id} style={{ marginBottom: '30px', padding: '20px', border: '2px solid #ef4444', borderRadius: '8px', backgroundColor: '#fef2f2' }}>
                                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                                    Question {index + 1}: {stripMarkdown(question.question)}
                                  </div>
                                  
                                  <div style={{ marginBottom: '10px' }}>
                                    <strong style={{ color: '#ef4444' }}>Your answer:</strong> {selectedAnswer ? stripMarkdown(selectedAnswer) : 'Not answered'}
                                  </div>
                                  
                                  <div style={{ marginBottom: '10px' }}>
                                    <strong style={{ color: '#10b981' }}>Correct answer:</strong> {stripMarkdown(correctAnswer)}
                                  </div>
                                  
                                  {question.explanation && (
                                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                                      <strong>Explanation:</strong> {stripMarkdown(question.explanation)}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        <div style={{ marginTop: '30px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
                          Generated on {new Date().toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : currentQuestion ? (
                  /* Single Question View */
                  <div className="px-6 pt-6 pb-0 rounded-lg" style={isDark ? { backgroundColor: 'rgba(30, 58, 138, 0.15)', borderColor: '#1e3a8a' } : undefined}>
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

                  </div>
                ) : null}
                  </>
                )}
              </div>
              </div>
              
              {/* Fixed Navigation buttons at bottom - only in content area */}
              {!showSummary && !showInstructions && currentQuestion && (
                <div className="max-w-4xl mx-auto w-full px-6 pt-0">
                  <div className="flex items-center py-4 border-t border-gray-200 dark:border-gray-800" style={isDark ? { borderColor: '#374151' } : undefined}>
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors border border-gray-300 dark:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={isDark ? { backgroundColor: '#374151', borderColor: '#1f2937', color: '#e5e7eb' } : undefined}
                  >
                    ← Previous
                  </button>
                  <div className="flex-1 text-center">
                    <span 
                      className="text-sm font-medium text-gray-600 dark:text-gray-400"
                      style={isDark ? { color: '#9ca3af' } : undefined}
                    >
                      Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
                    </span>
                  </div>
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }