'use client'

import { DiscussionQuestion } from './types';

interface DiscussionQuestionsProps {
  discussionQuestions?: DiscussionQuestion[];
  isDark?: boolean;
}

export default function DiscussionQuestions({
  discussionQuestions,
  isDark,
}: DiscussionQuestionsProps) {
  if (!discussionQuestions || discussionQuestions.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <strong className="text-gray-700 dark:text-gray-300" style={isDark ? { color: '#d1d5db' } : undefined}>Discussion Questions</strong>
      <ul className="!list-none !pl-4">
        {discussionQuestions.map((dq, index) => (
          <li key={index} className="text-gray-700 dark:text-gray-300" style={isDark ? { color: '#d1d5db' } : undefined}>
            {dq.question}
          </li>
        ))}
      </ul>
    </div>
  );
}
