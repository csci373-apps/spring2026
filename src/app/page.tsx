'use client'

import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeaderExpandable';
import Meeting from '@/components/Meeting';
import topics from '@/lib/topics';

export default function SchedulePage() {
  const [meetingStates, setMeetingStates] = useState<Record<string, boolean>>({});

  // Load saved states from localStorage on mount
  function loadSavedStates() {
    const savedStates: Record<string, boolean> = {};
    topics.forEach(topic => {
      topic.meetings.forEach((meeting, index) => {
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

  useEffect(loadSavedStates, []);


  const setMeetingState = (meetingKey: string, show: boolean) => {
    setMeetingStates(prev => ({
      ...prev,
      [meetingKey]: show
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Course Schedule" 
        excerpt="This schedule will definitely change over the course of the semester. Please continue to check back for updates." setMeetingStates={setMeetingStates} />
      <p className='text-7xl'>Goal: to teach students how to coordinate work under real constraints.</p>
      {topics.map((topic) => (
        <div key={topic.id} className="mb-16">
          <h2>Topic {topic.id}: {topic.title}</h2>
          <p className="pb-6 !mb-0 border-b border-black dark:border-gray-700 text-gray-700 dark:text-gray-300">{topic.description}</p>
          
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