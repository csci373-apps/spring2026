import Link from "next/link";
import { useState, useEffect } from 'react';

import { Topic } from '@/lib/topics';

interface PageHeaderProps {
  title: string;
  excerpt?: string;
  type?: string;
  group?: string;
  setMeetingStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  topics: Topic[];
}

export default function PageHeader({ title, excerpt, type, group, setMeetingStates, topics }: PageHeaderProps) {
  const [allExpanded, setAllExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const className = '!border-transparent hover:border-b-2';

  useEffect(() => {
    // Check if dark mode is active
    setIsDark(document.documentElement.classList.contains('dark'));
    
    // Watch for dark mode changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

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
  
  useEffect(loadSavedStates, [setMeetingStates, topics]);

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
    <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-bold text-gray-900 dark:text-gray-100">
          {type && type === 'activity' ? (<><Link href="/" className={className}>Schedule</Link> &gt; </>) : ''}
          {type && ['homework', 'lab', 'assignment'].includes(type) ? (<><Link href="/assignments" className={className}>Assignments</Link> &gt; </>) : ''}
          {group ? `${group} ` : ''} {title}
        </h1>
        <button
          onClick={toggleAll}
          className="px-4 py-2 border-2 border-black dark:border-gray-800 text-gray-700 dark:text-gray-300 transition-colors text-sm md:text-medium"
          style={isDark ? { borderColor: '#1f2937', color: '#d1d5db' } : undefined}
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