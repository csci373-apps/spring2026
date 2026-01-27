'use client'

interface DiscussionQuestionsProps {
  discussionQuestions?: string;
}

export default function DiscussionQuestions({
  discussionQuestions,
}: DiscussionQuestionsProps) {
  if (!discussionQuestions) {
    return null;
  }

  return (
    <div className="mt-4">
      <strong className="text-gray-700 dark:text-gray-300">Discussion Questions</strong>
      <div className="text-gray-700 dark:text-gray-300">
        {discussionQuestions}
      </div>
    </div>
  );
}
