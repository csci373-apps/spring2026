'use client'

import clsx from 'clsx';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useMeetingChecklist } from './useMeetingChecklist';
import ResourceQuiz from '@/components/ResourceQuiz';
import { MeetingData, Assignment } from './types';
import ActivitiesList from './ActivitiesList';
import QuizzesList from './QuizzesList';
import ReadingsList from './ReadingsList';
import AssignmentsList from './AssignmentsList';
import DiscussionQuestions from './DiscussionQuestions';

// Re-export MeetingData for backwards compatibility
export type { MeetingData } from './types';

interface MeetingProps {
  meeting: MeetingData;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  enableChecklist?: boolean;
  enableLocalStorage?: boolean;
  enableConfetti?: boolean;
}

export default function Meeting({ 
  meeting, 
  showDetails, 
  setShowDetails,
  enableChecklist = true,
  enableLocalStorage = true,
  enableConfetti = true,
}: MeetingProps) {
  const [isDark, setIsDark] = useState(false);
  const [openQuizSlug, setOpenQuizSlug] = useState<string | null>(null);
  const meetingKey = `meeting-${meeting.date}-${meeting.topic.replace(/\s+/g, '-').toLowerCase()}`;
  // Filter out excluded activities
  const filteredActivities = meeting.activities?.filter(activity => !(activity.excluded === 1)) || [];
  const hasActivities = filteredActivities.length > 0;
  const hasQuizzes = meeting.quizzes && meeting.quizzes.length > 0;
  const hasScheduleQuizzes = meeting.scheduleQuizzes && meeting.scheduleQuizzes.length > 0;
  const hasAnyQuizzes = hasQuizzes || hasScheduleQuizzes;
  const hasReadings = 'readings' in meeting && meeting.readings && meeting.readings.length > 0;
  const hasOptionalReadings = 'optionalReadings' in meeting && meeting.optionalReadings && meeting.optionalReadings.length > 0;
  const hasAssigned = 'assigned' in meeting && meeting.assigned;
  const hasDue = 'due' in meeting && meeting.due;
  // Check if this is a tutorial-only meeting (topic is "Tutorial" and only has assigned, no other details)
  const isTutorialOnlyMeeting = meeting.topic === 'Tutorial' && 
    !hasActivities && !hasAnyQuizzes && !hasReadings && !hasOptionalReadings && !hasDue && hasAssigned;
  const hasMoreDetails = hasActivities || hasAnyQuizzes || hasReadings || hasOptionalReadings || hasAssigned || hasDue;
  
  // Extract tutorial info for tutorial-only meetings
  const getTutorialInfo = () => {
    if (!isTutorialOnlyMeeting || !meeting.assigned) return null;
    
    // Handle array case - take first assignment
    let assignment: Assignment | null = null;
    if (Array.isArray(meeting.assigned)) {
      const firstAssigned = meeting.assigned[0];
      if (typeof firstAssigned === 'object') {
        assignment = firstAssigned;
      } else {
        return null;
      }
    } else if (typeof meeting.assigned === 'string') {
      return null;
    } else {
      assignment = meeting.assigned;
    }
    
    if (!assignment) return null;
    
    const isDraft = assignment.draft && assignment.draft === 1;
    const tutorialMatch = assignment.titleShort?.match(/Tutorial\s+(\d+)/i);
    const tutorialNum = tutorialMatch ? tutorialMatch[1] : '';
    const tutorialLabel = tutorialNum ? `Tutorial ${tutorialNum}` : assignment.titleShort || 'Tutorial';
    const tutorialText = `${tutorialLabel}: ${assignment.title}`;
    
    return {
      text: tutorialText,
      url: assignment.url,
      isDraft
    };
  };
  
  const tutorialInfo = getTutorialInfo();
  const isHoliday = 'holiday' in meeting && meeting.holiday;

  // Use checklist hook only if enabled
  const checklist = useMeetingChecklist(meeting, meetingKey, {
    enableLocalStorage: enableChecklist && enableLocalStorage,
    enableConfetti: enableChecklist && enableConfetti,
  });

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

  function toggleDetails(e: React.MouseEvent<HTMLElement>) {
    // Don't toggle if clicking on a link or button within the clickable div:
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button') || target.closest('input')) {
      return;
    }
    
    const newState = !showDetails;
    setShowDetails(newState);
    
    if (enableLocalStorage && typeof window !== 'undefined') {
      localStorage.setItem(meetingKey, JSON.stringify(newState));
    }
  }

  function handleToggleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const newState = !showDetails;
    setShowDetails(newState);
    
    if (enableLocalStorage && typeof window !== 'undefined') {
      localStorage.setItem(meetingKey, JSON.stringify(newState));
    }
  }


  function renderDetailsButton(allChecked: boolean) {
    return (
      <div className="flex items-center gap-2">
        {allChecked && (
          <div 
            className="flex items-center justify-center w-7 h-7 rounded-full bg-green-700 dark:bg-green-400 transition-all duration-200" 
            title="All tasks completed!"
            style={{ textDecoration: 'none' }}
          >
            <svg className="w-4 h-4 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} style={{ textDecoration: 'none' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" style={{ textDecoration: 'none' }} />
            </svg>
          </div>
        )}
        {hasMoreDetails && !isTutorialOnlyMeeting && (
          <button 
            onClick={handleToggleButtonClick}
            aria-label="Toggle details"
            aria-expanded={showDetails}
            className="text-black dark:text-gray-200 hover:text-sky-700 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 flex justify-center items-center rounded-full w-[35px] h-[35px] transition-colors"
            style={isDark ? { color: '#e5e7eb' } : undefined}
          >
            {showDetails ? 
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 15l7-7 7 7" />
              </svg>: 
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
              </svg>
            }
          </button>
        )}
      </div>
    );
  }

  function getMeetingContainerStyles(allChecked: boolean) {
    const baseClassName = "flex justify-between gap-4 border-b border-black dark:border-gray-800 pt-4 pb-2 transition-colors";
    
    const className = clsx(baseClassName, {
      'bg-gray-100 dark:bg-gray-800': isHoliday,
      'bg-gray-50 dark:bg-green-900/20': allChecked && !isHoliday
    });

    let style: React.CSSProperties | undefined = undefined;

    if (isDark) {
      if (isHoliday) {
        style = { borderColor: '#1f2937', backgroundColor: '#1f2937' };
      } else if (allChecked) {
        style = { borderColor: '#1f2937', backgroundColor: 'rgba(20, 83, 45, 0.2)' };
      } else {
        style = { borderColor: '#1f2937' };
      }
    } else {
      if (allChecked && !isHoliday) {
        style = { backgroundColor: '#f5faf6' };
      }
    }

    return { className, style };
  } 

  const allChecked = enableChecklist ? checklist.areAllItemsChecked() : false;
  const { className: containerClassName, style: containerStyle } = getMeetingContainerStyles(allChecked);
  
  const openQuiz = meeting.quizzes?.find(q => q.slug === openQuizSlug);
  
  return (
    <>
    <div 
      className={containerClassName}
      style={containerStyle}
    >
        <div className={clsx("flex gap-4", {
            'flex-col': showDetails,
            'md:flex-row': showDetails
        })}>
            <span className={clsx("w-[100px] flex-shrink-0 transition-all duration-300 ease-in-out", {
                'font-bold': true,
                'cursor-pointer': !isTutorialOnlyMeeting
            })} onClick={isTutorialOnlyMeeting ? undefined : toggleDetails}>{meeting.date}</span>
            <div className="w-full">
                <p className={clsx({
                    '!mb-3': !showDetails && !isTutorialOnlyMeeting,
                    '!mb-0': showDetails || isTutorialOnlyMeeting,
                    'cursor-pointer': !isTutorialOnlyMeeting && 'pointer',
                  })} onClick={isTutorialOnlyMeeting ? undefined : toggleDetails}>
                  {isTutorialOnlyMeeting && tutorialInfo ? (
                    tutorialInfo.isDraft ? (
                      <span className="transition-all duration-300 ease-in-out text-black dark:text-white">
                        {tutorialInfo.text}
                      </span>
                    ) : (
                      <Link 
                        href={tutorialInfo.url || '#'} 
                        className="transition-all duration-300 ease-in-out text-blue-600 dark:text-blue-400 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {tutorialInfo.text}
                      </Link>
                    )
                  ) : (
                    <span className={clsx("transition-all duration-300 ease-in-out", {
                      'font-bold': showDetails || isTutorialOnlyMeeting,
                      'text-black dark:text-white': showDetails || isTutorialOnlyMeeting,
                      // 'uppercase': showDetails
                    })}>{meeting.topic}</span>
                  )}
                </p>
                <div 
                  className={clsx("overflow-hidden transition-all duration-300 ease-in-out", {
                      'text-gray-100 dark:text-gray-300': isHoliday,
                      'max-h-0 opacity-0': !showDetails && !isTutorialOnlyMeeting,
                      'max-h-[1000px] opacity-100': showDetails || isTutorialOnlyMeeting
                  })}
                  style={isDark && isHoliday ? { color: '#d1d5db' } : undefined}
                >
                    { meeting.description && (
                        <div className="mb-4">
                          {typeof meeting.description === 'string' 
                            ? <p>{meeting.description}</p>
                            : meeting.description}
                        </div>
                    )}
                    {meeting.activities && (
                      <ActivitiesList
                        activities={meeting.activities}
                        meetingKey={meetingKey}
                        checklist={checklist}
                        enableChecklist={enableChecklist}
                        isDark={isDark}
                      />
                    )}
                    {hasReadings && (
                      <ReadingsList
                        readings={meeting.readings || []}
                        isOptional={false}
                        title="Required Readings"
                        meetingKey={meetingKey}
                        checklist={checklist}
                        enableChecklist={enableChecklist}
                        isDark={isDark}
                      />
                    )}
                    {hasOptionalReadings && (
                      <ReadingsList
                        readings={meeting.optionalReadings || []}
                        isOptional={true}
                        title="Optional Readings"
                        meetingKey={meetingKey}
                        checklist={checklist}
                        enableChecklist={enableChecklist}
                        isDark={isDark}
                      />
                    )}
                    <QuizzesList
                      quizzes={meeting.quizzes}
                      scheduleQuizzes={meeting.scheduleQuizzes}
                      meetingKey={meetingKey}
                      checklist={checklist}
                      enableChecklist={enableChecklist}
                      isDark={isDark}
                      onOpenQuiz={setOpenQuizSlug}
                    />
                    <DiscussionQuestions
                      discussionQuestions={meeting.discussionQuestions}
                    />
                    {meeting.assigned && !isTutorialOnlyMeeting && (
                      <AssignmentsList
                        assignments={meeting.assigned}
                        type="assigned"
                        meetingKey={meetingKey}
                        checklist={checklist}
                        enableChecklist={enableChecklist}
                        isDark={isDark}
                      />
                    )}
                    {meeting.due && (
                      <AssignmentsList
                        assignments={meeting.due}
                        type="due"
                        meetingKey={meetingKey}
                        checklist={checklist}
                        enableChecklist={enableChecklist}
                        isDark={isDark}
                      />
                    )}
                </div>
            </div> 
        </div> 
        <div>
            {renderDetailsButton(allChecked)}
        </div>
    </div>
    {/* Render quiz drawer when a quiz is opened */}
    {openQuizSlug && openQuiz && openQuiz.quizData && (
      <div className="fixed inset-0 z-[500]">
        <ResourceQuiz 
          quizData={openQuiz.quizData} 
          resourceSlug={openQuiz.slug} 
          variant="desktop"
          autoOpen={true}
          onClose={() => setOpenQuizSlug(null)}
        />
      </div>
    )}
    </>
  )
}