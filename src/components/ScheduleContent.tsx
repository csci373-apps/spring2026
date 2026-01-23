'use client'

import { useState, useEffect, useLayoutEffect } from 'react';
import PageHeader from '@/components/PageHeaderExpandable';
import Meeting from '@/components/schedule-entry/Meeting';

import { Topic } from '@/lib/topics';

interface ScheduleContentProps {
  topics: Topic[];
}

export default function ScheduleContent({ topics }: ScheduleContentProps) {
  // Start with empty state to match server render (prevents hydration mismatch)
  const [meetingStates, setMeetingStates] = useState<Record<string, boolean>>({});
  
  // Load saved states from localStorage synchronously before paint
  // This ensures meeting states are restored BEFORE scroll position restoration
  // We use useLayoutEffect to run before paint, but only on client
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedStates: Record<string, boolean> = {};
    topics.forEach(topic => {
      topic.meetings.forEach((meeting) => {
        const meetingKey = `meeting-${meeting.date}-${meeting.topic.replace(/\s+/g, '-').toLowerCase()}`;
        const savedState = localStorage.getItem(meetingKey);
        if (savedState !== null) {
          savedStates[meetingKey] = JSON.parse(savedState);
        }
      });
    });
    setMeetingStates(savedStates);
    
    // Signal that meeting states are ready for scroll restoration
    // Dispatch a custom event that ContentLayout can listen for
    // Use a small delay to ensure state update has been processed
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('meeting-states-restored'));
    });
  }, [topics]);
  
  const [isDark, setIsDark] = useState(false);

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

  const setMeetingState = (meetingKey: string, show: boolean) => {
    setMeetingStates(prev => ({
      ...prev,
      [meetingKey]: show
    }));
  };

  return (
    <div className="space-y-6 schedule-content" suppressHydrationWarning>
      <PageHeader title="Course Schedule" 
        excerpt="This schedule will definitely change over the course of the semester. Please continue to check back for updates." setMeetingStates={setMeetingStates} topics={topics} />
      {topics.map((topic) => (
        <div key={topic.id} id={`topic-${topic.id}`} className="mb-16">
          <h2>Topic {topic.id}: {topic.title}</h2>
          <p 
            className="pb-6 !mb-0 border-b border-black dark:border-gray-800 text-gray-700 dark:text-gray-300"
            style={isDark ? { borderColor: '#1f2937', color: '#d1d5db' } : undefined}
          >
            {topic.description}
          </p>
          
          {topic.meetings.map((meeting, index) => {
            const meetingKey = `meeting-${meeting.date}-${meeting.topic.replace(/\s+/g, '-').toLowerCase()}`;
            return (
              <Meeting 
                meeting={meeting} 
                key={`${topic.id}-${index}`}
                showDetails={meetingStates[meetingKey] || false}
                setShowDetails={(show) => setMeetingState(meetingKey, show)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

