'use client'

import clsx from 'clsx';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useMeetingChecklist } from './useMeetingChecklist';
import ResourceQuiz from '@/components/ResourceQuiz';
import { QuizData } from '@/components/quiz/types';

interface Reading {
  citation: string | React.ReactElement;
  url?: string;
}

interface Activity {
  title: string;
  url?: string;
  draft?: number;
  excluded?: number;
}

interface Quiz {
  title: string;
  slug: string;
  quizData?: QuizData;
  draft?: number;
}

interface Assignment {
  titleShort: string;
  title: string;
  url?: string;
  draft?: number;
}

export interface MeetingData {
  date: string;
  topic: string;
  description?: string | React.ReactElement;
  activities?: Activity[];
  quizzes?: Quiz[];
  readings?: Reading[];
  optionalReadings?: Reading[];
  holiday?: boolean;
  discussionQuestions?: string;
  assigned?: Assignment | string;
  due?: Assignment | string | (Assignment | string)[];
}

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
  const hasReadings = 'readings' in meeting && meeting.readings && meeting.readings.length > 0;
  const hasOptionalReadings = 'optionalReadings' in meeting && meeting.optionalReadings && meeting.optionalReadings.length > 0;
  const hasMoreDetails = hasActivities || hasQuizzes || hasReadings;
  const hasDiscussionQuestions = 'discussionQuestions' in meeting && meeting.discussionQuestions;
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

  function renderActivity(activity: Activity, index: number) {
    const isDraft = activity.draft && activity.draft === 1;
    const itemKey = `${meetingKey}-activity-${index}`;
    const isChecked = enableChecklist && !isDraft ? checklist.isChecked(itemKey) : false;
    
    return (
      <div className="flex items-start gap-2">
        {!isDraft && (
          <input
            type="checkbox"
            aria-label={`Mark activity "${activity.title}" as ${isChecked ? 'uncompleted' : 'completed'}`}
            checked={isChecked}
            onChange={() => enableChecklist && checklist.toggleChecked(itemKey)}
            disabled={!enableChecklist}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 accent-blue-600 dark:accent-blue-400 cursor-pointer flex-shrink-0"
            style={isDark ? { 
              backgroundColor: isChecked ? '#3b82f6' : '#1f2937',
              borderColor: isChecked ? '#3b82f6' : '#4b5563'
            } : undefined}
          />
        )}
        <div className="flex-1">
          {isDraft ? (
            <span>{activity.title}</span>
          ) : (
            <>
              {(() => {
                const isExternalLink = activity.url?.startsWith('https');
                const url = activity.url || '#';
                const linkClass = `text-blue-600 dark:text-blue-400 hover:underline ${isChecked ? '!line-through opacity-60' : ''}`;
                
                if (isExternalLink) {
                  return <Link href={url} target="_blank" className={linkClass} onClick={(e) => e.stopPropagation()}>{activity.title}</Link>;
                }
                return <Link href={url} className={linkClass} onClick={(e) => e.stopPropagation()}>{activity.title}</Link>;
              })()}
            </>
          )}
        </div>
      </div>
    );
  }

  function renderActivities() {
    if (hasActivities) {
      return (
        <div className="mb-6">
            {hasActivities ? <strong className="text-gray-700 dark:text-gray-300" style={isDark ? { color: '#d1d5db' } : undefined}>Slides / Activities</strong> : ``}
            <ul className="!list-none !pl-4">
                {filteredActivities.map((activity: Activity, filteredIndex: number) => {
                  // Find the original index in the full activities array for the itemKey
                  const originalIndex = meeting.activities?.findIndex(a => a === activity) ?? filteredIndex;
                  return (
                    <li key={filteredIndex} className="text-gray-700 dark:text-gray-300">
                        {renderActivity(activity, originalIndex)}
                    </li>
                  );
                })}
            </ul>
        </div>
      )
    }
    return ``;
  }

  function QuizItem({ quiz, index, onOpen }: { quiz: Quiz; index: number; onOpen: (slug: string) => void }) {
    const isDraft = quiz.draft && quiz.draft === 1;
    const itemKey = `${meetingKey}-quiz-${index}`;
    const isChecked = enableChecklist && !isDraft ? checklist.isChecked(itemKey) : false;
    
    // Get quiz completion status and score from localStorage (for display only, not auto-sync)
    const [quizStatus, setQuizStatus] = useState<{ completed: boolean; score: number; total: number } | null>(null);
    
    // Load quiz status once on mount (for informational display only)
    useEffect(() => {
      if (typeof window === 'undefined' || isDraft) return;
      
      try {
        const storageKey = `quiz-${quiz.slug}`;
        const saved = localStorage.getItem(storageKey);
        const totalQuestions = quiz.quizData?.questions?.length || 0;
        
        if (saved) {
          const savedState = JSON.parse(saved);
          setQuizStatus({
            completed: savedState.completed || false,
            score: savedState.score || 0,
            total: totalQuestions
          });
        }
      } catch (error) {
        console.error('Error reading quiz status:', error);
      }
    }, [quiz.slug, quiz.quizData?.questions?.length, isDraft]);
    
    return (
      <div className="flex items-start gap-2">
        {!isDraft && (
          <input
            type="checkbox"
            aria-label={`Quiz "${quiz.title}" ${isChecked ? 'completed' : 'not completed'}`}
            checked={isChecked}
            onChange={() => {
              if (enableChecklist) {
                checklist.toggleChecked(itemKey);
              }
            }}
            disabled={!enableChecklist}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 accent-blue-600 dark:accent-blue-400 cursor-default flex-shrink-0"
            style={isDark ? { 
              backgroundColor: isChecked ? '#3b82f6' : '#1f2937',
              borderColor: isChecked ? '#3b82f6' : '#4b5563'
            } : undefined}
          />
        )}
        <div className="flex-1">
          {isDraft ? (
            <span>{quiz.title}</span>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(quiz.slug);
                }}
                className={`text-left text-blue-600 dark:text-blue-400 hover:underline ${isChecked ? '!line-through opacity-60' : ''}`}
              >
                {quiz.title}
              </button>
              {quizStatus && quizStatus.completed && (
                <span className="text-sm text-gray-600 dark:text-gray-400" style={isDark ? { color: '#9ca3af' } : undefined}>
                  Previous score: {quizStatus.score} / {quizStatus.total} ({quizStatus.total > 0 ? Math.round((quizStatus.score / quizStatus.total) * 100) : 0}%)
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderQuiz(quiz: Quiz, index: number) {
    return <QuizItem key={index} quiz={quiz} index={index} onOpen={setOpenQuizSlug} />;
  }

  function renderQuizzes() {
    if (hasQuizzes) {
      return (
        <div className="mb-6">
            <strong className="text-gray-700 dark:text-gray-300" style={isDark ? { color: '#d1d5db' } : undefined}>Quizzes</strong>
            <ul className="!list-none !pl-4">
                {meeting.quizzes!.map((quiz: Quiz, index: number) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                        {renderQuiz(quiz, index)}
                    </li>
                ))}
            </ul>
        </div>
      )
    }
    return ``;
  } 

  function renderReadings({title, readings, isOptional}: {title: string, readings:Reading[], isOptional?: boolean}) {
    return (
      <div className="mb-6">
          {<strong className="text-gray-700 dark:text-gray-300" style={isDark ? { color: '#d1d5db' } : undefined}>{title}</strong>}
          <ol className="!list-none !pl-4">
              {
              readings.map((reading: Reading, index: number) => {
                  const itemKey = `${meetingKey}-${isOptional ? 'optional-reading' : 'reading'}-${index}`;
                  const isChecked = enableChecklist ? checklist.isChecked(itemKey) : false;
                  
                  return (
                  <li key={index} className="mb-0 text-gray-700 dark:text-gray-300">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          aria-label={`Mark reading "${reading.citation}" as ${isChecked ? 'unread' : 'read'}`}
                          checked={isChecked}
                          onChange={() => enableChecklist && checklist.toggleChecked(itemKey)}
                          disabled={!enableChecklist}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 accent-blue-600 dark:accent-blue-400 cursor-pointer flex-shrink-0"
                          style={isDark ? { 
                            backgroundColor: isChecked ? '#3b82f6' : '#1f2937',
                            borderColor: isChecked ? '#3b82f6' : '#4b5563'
                          } : undefined}
                        />
                        <div className={`flex-1 ${isChecked ? '!line-through opacity-60' : ''}`}>
                          {reading.citation} {" "}
                          {reading.url && (
                            <a href={reading.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline" onClick={(e) => e.stopPropagation()}>
                                Link
                            </a>
                          )}
                        </div>
                      </div>
                  </li>
                  )
              })
              }
          </ol>
      </div>
    )
  }

  function renderDiscussionQuestions() {
    if (hasDiscussionQuestions) {
      return (
        <div className="mt-4">
            {hasDiscussionQuestions ? <strong className="text-gray-700 dark:text-gray-300">Discussion Questions</strong> : ``}
            <div className="text-gray-700 dark:text-gray-300">
                {meeting.discussionQuestions}
            </div>
        </div>
      )
    }
  } 

  function renderAssignment(assignment: Assignment | string, type: 'assigned' | 'due', index?: number) {
    if (typeof assignment === 'string') {
      return assignment;
    }
    
    const isDraft = assignment.draft && assignment.draft === 1;
    const showCheckbox = type === 'due' && !isDraft; // Show checkbox for non-draft "due" items only
    // Extract assignment ID from URL (e.g., "/assignments/hw01/" -> "hw01")
    const assignmentId = assignment.url?.match(/\/assignments\/([^\/]+)\/?/)?.[1];
    // Use assignment ID for syncing with assignments page, fallback to meeting key for manual entries
    const assignmentKey = assignmentId ? `assignment-${assignmentId}` : (index !== undefined ? `${meetingKey}-due-${index}` : `${meetingKey}-${type}`);
    // For assignments with IDs, check the assignment key (primary). For manual entries, check schedule key.
    // The isChecked function already checks both state and localStorage
    const assignmentPageChecked = assignmentId ? checklist.isChecked(`assignment-${assignmentId}`) : false;
    const scheduleChecked = checklist.isChecked(assignmentKey);
    const isChecked = enableChecklist && showCheckbox ? (assignmentId ? assignmentPageChecked : scheduleChecked) : false;
    
    const handleToggle = () => {
      if (!enableChecklist) return;
      
      // Primary: Use assignment ID key for syncing with assignments page
      if (assignmentId) {
        const syncKey = `assignment-${assignmentId}`;
        // Toggle the assignment key (this will update state and localStorage)
        checklist.toggleChecked(syncKey);
        
        // Also update the schedule key to match (for backwards compatibility)
        // Just set localStorage - the polling will update state
        if (assignmentKey !== syncKey && typeof window !== 'undefined') {
          // Read the new state from localStorage (which was just updated by toggleChecked)
          // Use a small delay to ensure toggleChecked has finished updating localStorage
          setTimeout(() => {
            const newChecked = localStorage.getItem(syncKey) === 'true';
            localStorage.setItem(assignmentKey, JSON.stringify(newChecked));
          }, 0);
        }
      } else {
        // For manual entries without assignment ID, just use schedule key
        checklist.toggleChecked(assignmentKey);
      }
    };
    
    return (
      <div className="flex items-start gap-2">
        {showCheckbox && (
          <input
            type="checkbox"
            aria-label={`Mark assignment "${assignment.titleShort}" as ${isChecked ? 'incomplete' : 'complete'}`}
            checked={isChecked}
            onChange={handleToggle}
            disabled={!enableChecklist}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 accent-blue-600 dark:accent-blue-400 cursor-pointer flex-shrink-0"
            style={isDark ? { 
              backgroundColor: isChecked ? '#3b82f6' : '#1f2937',
              borderColor: isChecked ? '#3b82f6' : '#4b5563'
            } : undefined}
          />
        )}
        <div className={`flex-1 ${isChecked ? '!line-through opacity-60' : ''}`}>
          {isDraft ? (
            <>{assignment.titleShort}: {assignment.title}</>
          ) : (
            <><Link href={assignment.url || '#'} className="text-blue-600 dark:text-blue-400 hover:underline" onClick={(e) => e.stopPropagation()}>{assignment.titleShort}</Link>: {assignment.title}</>
          )}
        </div>
      </div>
    );
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
        {hasMoreDetails && (
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
            <span className={clsx("w-[100px] flex-shrink-0 transition-all duration-300 ease-in-out cursor-pointer", {
                'font-bold': true
            })} onClick={toggleDetails}>{meeting.date}</span>
            <div className="w-full">
                <p className={clsx({
                    '!mb-3': !showDetails,
                    '!mb-0': showDetails,
                    'cursor-pointer': 'pointer',
                  })} onClick={toggleDetails}><span className={clsx("transition-all duration-300 ease-in-out", {
                    'font-bold': showDetails,
                    'text-black dark:text-white': showDetails,
                    // 'uppercase': showDetails
                })}>{meeting.topic}</span></p>
                <div 
                  className={clsx("overflow-hidden transition-all duration-300 ease-in-out", {
                      'text-gray-100 dark:text-gray-300': isHoliday,
                      'max-h-0 opacity-0': !showDetails,
                      'max-h-[1000px] opacity-100': showDetails
                  })}
                  style={isDark && isHoliday ? { color: '#d1d5db' } : undefined}
                >
                    { meeting.description && (
                        typeof meeting.description === 'string' 
                          ? <p>{meeting.description}</p>
                          : meeting.description
                    )}
                    {renderActivities()}
                    {hasReadings ? renderReadings({title: 'Required Readings', readings: meeting.readings || [], isOptional: false}) : ``}
                    {hasOptionalReadings ? renderReadings({title: 'Optional Readings', readings: meeting.optionalReadings || [], isOptional: true}) : ``}
                    {renderQuizzes()}
                    {renderDiscussionQuestions()}
                    {
                      meeting.assigned ? ( 
                        <div className="mb-4">
                          <strong className="text-gray-700 dark:text-gray-300">Assigned: </strong>
                          {renderAssignment(meeting.assigned, 'assigned')}
                        </div>
                        ) : ''
                    }
                    {
                      meeting.due ? ( 
                        <div className="mb-4">
                          <strong className="text-gray-700 dark:text-gray-300" style={isDark ? { color: '#d1d5db' } : undefined}>Due: </strong>
                          {Array.isArray(meeting.due) ? (
                            <ul className="!list-none !pl-4">
                              {meeting.due.map((dueItem, index) => (
                                <li key={index} className="text-gray-700 dark:text-gray-300">
                                  {renderAssignment(dueItem, 'due', index)}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            renderAssignment(meeting.due, 'due')
                          )}
                        </div>
                        ) : ''
                    }
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