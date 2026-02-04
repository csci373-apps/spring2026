'use client';

import { useState } from 'react';
import ResourceQuiz from './ResourceQuiz';
import QuizzesList from './QuizzesList';
import { QuizData } from './quiz/types';

interface QuizItem {
  slug: string;
  quizData: QuizData;
  cheatsheetContent?: string | null;
}

interface ResourceQuizzesWrapperProps {
  quizzes: QuizItem[];
}

export default function ResourceQuizzesWrapper({ quizzes }: ResourceQuizzesWrapperProps) {
  const [openQuizSlug, setOpenQuizSlug] = useState<string | null>(null);

  const openQuiz = quizzes.find(q => q.slug === openQuizSlug);

  // Single quiz: render ResourceQuiz with button as before (ResourceQuiz handles its own button)
  if (quizzes.length === 1) {
    const quiz = quizzes[0];
    return (
      <ResourceQuiz 
        quizData={quiz.quizData} 
        resourceSlug={quiz.slug} 
        variant="desktop" 
        cheatsheetContent={quiz.cheatsheetContent || undefined} 
      />
    );
  }

  // Multiple quizzes: render list with heading
  return (
    <>
      <div id="take-the-quiz" className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2>Quizzes</h2>
        <QuizzesList 
          quizzes={quizzes} 
          onOpenQuiz={(slug) => setOpenQuizSlug(slug)}
        />
      </div>
      
      {/* Render quiz drawer when a quiz is opened from the list */}
      {openQuizSlug && openQuiz && openQuiz.quizData && (
        <div className="fixed inset-0 z-[500]">
          <ResourceQuiz 
            quizData={openQuiz.quizData} 
            resourceSlug={openQuiz.slug} 
            variant="desktop"
            autoOpen={true}
            onClose={() => setOpenQuizSlug(null)}
            cheatsheetContent={openQuiz.cheatsheetContent || undefined}
          />
        </div>
      )}
    </>
  );
}
