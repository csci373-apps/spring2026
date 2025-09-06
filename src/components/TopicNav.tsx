"use client";

interface Topic {
  id: number;
  title: string;
  description: string;
}

interface TopicNavProps {
  topics: Topic[];
}

export default function TopicNav({ topics }: TopicNavProps) {

  const scrollToTopic = (topicId: number) => {
    const element = document.getElementById(`topic-${topicId}-meeting-0`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
      <nav className="sticky top-[60px] w-84">
        <ol>
        {topics.map((topic) => (
          <li key={`topic-${topic.id}`} className="">
              <button
              key={topic.id}
              onClick={() => {
                scrollToTopic(topic.id);
              }}
              className="flex text-left min-h-[2em] px-2 py-1 "
            >{topic.title}
            </button>
          </li>
        ))}
        </ol>
      </nav>
  );
} 