"use client";

interface QuizInstructionsProps {
  randomMode: boolean;
  onToggleRandomMode: () => void;
  onClearQuiz: () => void;
  onStartQuiz: () => void;
  isDark: boolean;
  cheatsheetContent?: string;
  quizName?: string;
  hasCompleted?: boolean;
  previousScore?: number;
  totalQuestions?: number;
}

export default function QuizInstructions({
  randomMode,
  onToggleRandomMode,
  onClearQuiz,
  onStartQuiz,
  isDark,
  cheatsheetContent,
  quizName,
  hasCompleted,
  previousScore,
  totalQuestions,
}: QuizInstructionsProps) {
  const scorePercentage = previousScore !== undefined && totalQuestions !== undefined && totalQuestions > 0
    ? Math.round((previousScore / totalQuestions) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        {/* Quiz Name */}
        {quizName && (
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2" style={isDark ? { color: '#f9fafb' } : undefined}>
            {quizName}
          </h1>
        )}
        {/* Previous Score */}
        {hasCompleted && previousScore !== undefined && totalQuestions !== undefined && (
          <div className="mb-4">
            <p className="text-lg text-gray-700 dark:text-gray-300" style={isDark ? { color: '#d1d5db' } : undefined}>
              Previous score: <span className="font-semibold">{previousScore} / {totalQuestions}</span> ({scorePercentage}%)
            </p>
          </div>
        )}
        
        <blockquote>
        <h2>
          Quiz Instructions
        </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300" style={isDark ? { color: '#d1d5db' } : undefined}>
            <li>Read each question carefully before selecting your answer</li>
            <li>You can navigate between questions using the Previous and Next buttons</li>
            <li>After completing all questions, you'll see your score and can review incorrect answers</li>
          </ul>
        </blockquote>
      </div>
      
      {/* Cheatsheet content if provided */}
      {cheatsheetContent && (
        <div>
          <div 
            className="prose dark:prose-invert max-w-none cheatsheet-content"
            dangerouslySetInnerHTML={{ __html: cheatsheetContent }}
            suppressHydrationWarning
          />
        </div>
      )}
    </div>
  );
}

// Export footer component separately so it can be rendered outside scrollable area
export function QuizInstructionsFooter({
  randomMode,
  onToggleRandomMode,
  onClearQuiz,
  onStartQuiz,
  isDark,
  hasCompleted,
}: {
  randomMode: boolean;
  onToggleRandomMode: () => void;
  onClearQuiz: () => void;
  onStartQuiz: () => void;
  isDark: boolean;
  hasCompleted?: boolean;
}) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-800" style={isDark ? { borderColor: '#374151' } : undefined}>
      <div className="max-w-4xl mx-auto w-full px-6 flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400" style={isDark ? { color: '#9ca3af' } : undefined}>
            Shuffle
          </span>
          <button
            onClick={onToggleRandomMode}
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
        <div className="flex items-center gap-3">
          <button
            onClick={onClearQuiz}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors border border-gray-300 dark:border-gray-800"
            style={isDark ? { backgroundColor: '#374151', borderColor: '#1f2937', color: '#e5e7eb' } : undefined}
          >
            Reset Quiz
          </button>
          <button
            onClick={onStartQuiz}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors"
          >
            {hasCompleted ? 'Review Quiz →' : 'Start Quiz →'}
          </button>
        </div>
      </div>
    </div>
  );
}
