"use client";

interface QuizInstructionsProps {
  randomMode: boolean;
  onToggleRandomMode: () => void;
  onClearQuiz: () => void;
  onStartQuiz: () => void;
  isDark: boolean;
}

export default function QuizInstructions({
  randomMode,
  onToggleRandomMode,
  onClearQuiz,
  onStartQuiz,
  isDark,
}: QuizInstructionsProps) {
  return (
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
      
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700" style={isDark ? { borderColor: '#374151' } : undefined}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
              className="px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors border border-gray-300 dark:border-gray-800"
              style={isDark ? { backgroundColor: '#374151', borderColor: '#1f2937', color: '#e5e7eb' } : undefined}
            >
              Reset Quiz
            </button>
            <button
              onClick={onStartQuiz}
              className="px-6 py-3 text-base font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors"
            >
              Start Quiz →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
