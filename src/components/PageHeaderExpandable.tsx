import Link from "next/link";
import topics from '@/lib/topics';
import { useState, useEffect } from 'react';

interface PageHeaderProps {
  title: string;
  excerpt?: string;
  type?: string;
  group?: string;
  setMeetingStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function PageHeader({ title, excerpt, type, group, setMeetingStates }: PageHeaderProps) {
  const [allExpanded, setAllExpanded] = useState(false);
  const className = '!border-transparent hover:border-b-2';

  // Load saved states from localStorage on mount
  function loadSavedStates() {
    const savedStates: Record<string, boolean> = {};
    topics.forEach(topic => {
      topic.meetings.forEach((meeting) => {
        const meetingKey = `meeting-${meeting.date}-${meeting.topic.replace(/\s+/g, '-').toLowerCase()}`;
        if (typeof window !== 'undefined') {
          const savedState = localStorage.getItem(meetingKey);
          if (savedState !== null) {
            savedStates[meetingKey] = JSON.parse(savedState);
          }
        }
      });
    });
    setMeetingStates(savedStates);
  }
  
  useEffect(loadSavedStates, [setMeetingStates]);

  const toggleAll = () => {
    const newExpanded = !allExpanded;
    setAllExpanded(newExpanded);
    
    const newStates: Record<string, boolean> = {};
    topics.forEach(topic => {
      topic.meetings.forEach((meeting) => {
        const meetingKey = `meeting-${meeting.date}-${meeting.topic.replace(/\s+/g, '-').toLowerCase()}`;
        newStates[meetingKey] = newExpanded;
        localStorage.setItem(meetingKey, JSON.stringify(newExpanded));
      });
    });
    setMeetingStates(newStates);
  };

  
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-bold text-gray-900 dark:text-gray-100">
          {type && type === 'activity' ? (<><Link href="/" className={className}>Schedule</Link> &gt; </>) : ''}
          {type && ['homework', 'lab', 'assignment'].includes(type) ? (<><Link href="/assignments" className={className}>Assignments</Link> &gt; </>) : ''}
          {group ? `${group} ` : ''} {title}
        </h1>
        <button
          onClick={toggleAll}
          className="px-4 py-2 border-2 border-black dark:border-gray-700 text-gray-700 dark:text-gray-300 transition-colors text-sm md:text-medium"
          >
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
      {excerpt && (
        <p className="text-gray-600 dark:text-gray-400 mt-2">{excerpt}</p>
      )}
    </div>
  );
}