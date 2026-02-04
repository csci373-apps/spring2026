"use client";

interface QuizCheatsheetProps {
  quizName: string;
  onContinue: () => void;
  onBack: () => void;
  isDark: boolean;
  cheatsheetContent?: string;
}

export default function QuizCheatsheet({
  quizName,
  onContinue,
  onBack,
  isDark,
  cheatsheetContent,
}: QuizCheatsheetProps) {
  // If cheatsheet content is provided, use it
  if (cheatsheetContent) {
    return (
      <div 
        className="prose dark:prose-invert max-w-none cheatsheet-content"
        dangerouslySetInnerHTML={{ __html: cheatsheetContent }}
        suppressHydrationWarning
      />
    );
  }

  // If no cheatsheet content is provided, show a message
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4" style={isDark ? { color: '#f9fafb' } : undefined}>
        Quiz Cheatsheet
      </h2>
      <p className="text-gray-700 dark:text-gray-300" style={isDark ? { color: '#d1d5db' } : undefined}>
        No cheatsheet available for this quiz.
      </p>
    </div>
  );
}
