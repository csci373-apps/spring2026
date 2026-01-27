"use client";

import { useRef } from 'react';
import { QuizData, QuizQuestion } from './types';
import QuizReport, { QuizReportHandle } from './QuizReport';
import { TestResults } from './javascript-dom/types';

interface QuizSummaryProps {
  quizData: QuizData;
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  studentName: string;
  onStudentNameChange: (name: string) => void;
  incorrectQuestions: QuizQuestion[];
  selectedAnswers: { [questionId: string]: string | string[] | { html: string; css: string; js: string; testResults?: TestResults } };
  resourceSlug: string;
  onClearQuiz: () => void;
  onReview: () => void;
  isGeneratingReport: boolean;
  onGeneratingChange: (generating: boolean) => void;
  isDark: boolean;
}

export default function QuizSummary({
  quizData,
  score,
  totalQuestions,
  scorePercentage,
  studentName,
  onStudentNameChange,
  incorrectQuestions,
  selectedAnswers,
  resourceSlug,
  onClearQuiz,
  onReview,
  isGeneratingReport,
  onGeneratingChange,
  isDark,
}: QuizSummaryProps) {
  const reportRef = useRef<QuizReportHandle>(null);

  const handleGenerateReport = async () => {
    await reportRef.current?.generateReport();
  };
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm dark:shadow-none" style={isDark ? { backgroundColor: '#1f2937', borderColor: '#1f2937' } : undefined}>
      <div className="text-center mb-6">
        {quizData.quizName && (
          <h2 
            className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4"
            style={isDark ? { color: '#d1d5db' } : undefined}
          >
            {quizData.quizName}
          </h2>
        )}
        <h3 
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
          style={isDark ? { color: '#f9fafb' } : undefined}
        >
          Quiz Complete!
        </h3>
        <div 
          className="text-4xl font-bold mb-4"
          style={{ color: totalQuestions > 0 && score === totalQuestions ? '#10b981' : totalQuestions > 0 && score >= totalQuestions * 0.7 ? '#3b82f6' : '#ef4444' }}
        >
          {score} / {totalQuestions}
        </div>
        <p 
          className="text-gray-600 dark:text-gray-400"
          style={isDark ? { color: '#9ca3af' } : undefined}
        >
          {totalQuestions > 0 && score === totalQuestions 
            ? 'Perfect score! 🎉' 
            : totalQuestions > 0 && score >= totalQuestions * 0.7 
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
          onChange={(e) => onStudentNameChange(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          style={isDark ? { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f3f4f6' } : undefined}
        />
      </div>

      <div className="flex justify-between gap-4">
        <button
          onClick={handleGenerateReport}
          disabled={isGeneratingReport}
          className="px-6 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingReport ? 'Generating...' : 'Download Report'}
        </button>
        <div className="flex gap-2">
          <button
            onClick={onClearQuiz}
            className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors border border-gray-300 dark:border-gray-800"
            style={isDark ? { backgroundColor: '#374151', borderColor: '#1f2937', color: '#e5e7eb' } : undefined}
          >
            Reset Quiz
          </button>
          <button
            onClick={onReview}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors"
          >
            Review
          </button>
        </div>
      </div>

      <QuizReport
        ref={reportRef}
        quizData={quizData}
        score={score}
        totalQuestions={totalQuestions}
        scorePercentage={scorePercentage}
        studentName={studentName}
        incorrectQuestions={incorrectQuestions}
        selectedAnswers={selectedAnswers}
        resourceSlug={resourceSlug}
        onGeneratingChange={onGeneratingChange}
      />
    </div>
  );
}
