'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { formatDate } from '@/lib/utils';
import { useMemo } from 'react';
import { Topic } from '@/lib/topics';

interface ResourceData {
  id: string;
  title: string;
  group?: string;
}

interface AssignmentData {
  id: string;
  num?: string;
  title: string;
  due_date?: string;
  type?: string;
  draft?: number;
  excluded?: boolean;
  external_url?: string;
}

interface ReadingData {
  date: string;
  citation: string;
  url?: string;
}

interface QuickLinksNavClientProps {
  resources: ResourceData[];
  assignments: AssignmentData[];
  readings: ReadingData[];
  topics?: Topic[];
}

function titleCase(str: string): string {
  if (str.toLowerCase() === 'assignment') {
    return 'Homework';
  }
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

function getDaysUntilDue(dueDate: string): number {
  const dueDateObj = new Date(dueDate + 'T23:59:59');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDateObj.setHours(0, 0, 0, 0);
  const diffTime = dueDateObj.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function QuickLinksNavClient({ resources, assignments, readings, topics }: QuickLinksNavClientProps) {
  
  // Filter assignments client-side based on current date
  const upcomingAssignments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter out excluded, drafts, and past assignments
    const filtered = assignments.filter(assignment => {
      if (assignment.excluded) return false;
      if (assignment.draft === 1) return false;
      if (!assignment.due_date) return false;
      
      const dueDate = new Date(assignment.due_date + 'T23:59:59');
      dueDate.setHours(0, 0, 0, 0);
      return dueDate >= today;
    });

    // Sort by due date
    filtered.sort((a, b) => {
      if (!a.due_date || !b.due_date) return 0;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });

    // Take only the next 5 upcoming assignments
    return filtered.slice(0, 5);
  }, [assignments]);

  // Filter readings client-side based on current date
  const upcomingReadings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 5); // Next 5 days
    
    // Filter readings within the next 10 days
    const filtered = readings.filter(reading => {
      const readingDate = new Date(reading.date + 'T00:00:00');
      readingDate.setHours(0, 0, 0, 0);
      return readingDate >= today && readingDate <= futureDate;
    });

    // Sort by date
    filtered.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // Take only the next 10 readings (or all if less than 10)
    return filtered;
  }, [readings]);

  return (
    <div className="quick-links-nav h-full overflow-y-auto p-4 hidden lg:block">
      {/* Quick Links Section */}
      {(resources.length > 0) && (
        <div className="mb-6 rounded-2xl bg-gray-100 dark:bg-gray-800 p-4">
          <h2 className="!text-lg !font-normal text-gray-800 dark:text-gray-100 !m-0 !mb-4">Quick Links</h2>
          <div className="space-y-2">
            {resources.map((resource) => {
              return (
                <div key={resource.id}>
                  <Link
                    href={`/resources/${resource.id}`}
                    className="!border-0 !text-sm text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block"
                  >
                    {resource.title}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Due Dates Section */}
      {upcomingAssignments.length > 0 && (
        <div className="mb-8 rounded-2xl bg-blue-50 dark:bg-blue-950 p-4">
          <h2 className="!text-lg !font-normal text-gray-800 dark:text-gray-100 !m-0 !mb-4">Upcoming Due Dates</h2>
          <div className="space-y-1">
            {upcomingAssignments.map((assignment, index) => {
              const daysUntil = assignment.due_date ? getDaysUntilDue(assignment.due_date) : null;
              const isToday = daysUntil === 0;
              const isTomorrow = daysUntil === 1;
              const isUrgent = daysUntil !== null && daysUntil <= 3;
              
              const assignmentLabel = assignment.type && assignment.num
                ? `${titleCase(assignment.type)} ${assignment.num}`
                : assignment.title;

              return (
                <div key={assignment.id} className={clsx(
                  'flex items-start justify-between gap-3',
                  index < upcomingAssignments.length - 1 && 'pb-2 border-b border-gray-200 dark:border-gray-800'
                )}>
                  <div className="flex-1 min-w-0">
                    {assignment.external_url ? (
                      <a
                        href={assignment.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="!border-0 !text-sm font-medium text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block"
                      >
                        {assignmentLabel}
                        <span className="ml-1 text-xs">↗</span>
                      </a>
                    ) : (
                      <Link
                        href={`/assignments/${assignment.id}`}
                        className="!border-0 !text-sm font-medium text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block"
                      >
                        {assignmentLabel}
                      </Link>
                    )}
                    {assignment.due_date && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 block">
                        {formatDate(assignment.due_date)}
                      </span>
                    )}
                  </div>
                  {daysUntil !== null && (
                    <span className={clsx(
                      'text-xs font-semibold whitespace-nowrap',
                      isToday && 'text-red-600 dark:text-red-400',
                      isTomorrow && 'text-orange-600 dark:text-orange-400',
                      isUrgent && !isToday && !isTomorrow && 'text-yellow-600 dark:text-yellow-400',
                      !isToday && !isTomorrow && !isUrgent && 'text-gray-500 dark:text-gray-500'
                    )}>
                      {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : `${daysUntil}d`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Readings Section */}
      {upcomingReadings.length > 0 && (() => {
        // Group readings by date
        const readingsByDate = upcomingReadings.reduce((groups, reading) => {
          const date = reading.date;
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(reading);
          return groups;
        }, {} as Record<string, typeof readings>);

        // Format date as "Th, 1/15"
        const formatDateHeader = (dateString: string): string => {
          const date = new Date(dateString + 'T00:00:00');
          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 2);
          const month = date.getMonth() + 1;
          const day = date.getDate();
          return `${dayOfWeek}, ${month}/${day}`;
        };

        return (
          <div className="mb-6 rounded-2xl bg-amber-50 dark:bg-gray-700 p-4">
            <h2 className="!text-lg !font-normal text-gray-800 dark:text-gray-100 !m-0 !mb-4">Upcoming Readings</h2>
            <div className="space-y-4">
              {Object.entries(readingsByDate).map(([date, dateReadings]) => {
                const daysUntil = getDaysUntilDue(date);
                const isToday = daysUntil === 0;
                const isTomorrow = daysUntil === 1;
                const isUrgent = daysUntil !== null && daysUntil <= 3;

                return (
                  <div key={date} className="space-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="!text-sm !font-medium text-gray-700 dark:text-gray-300 !m-0">
                        {formatDateHeader(date)}
                      </h3>
                      {daysUntil !== null && (
                        <span className={clsx(
                          'text-xs font-semibold whitespace-nowrap',
                          isToday && 'text-red-600 dark:text-red-400',
                          isTomorrow && 'text-orange-600 dark:text-orange-400',
                          isUrgent && !isToday && !isTomorrow && 'text-yellow-600 dark:text-yellow-400',
                          !isToday && !isTomorrow && !isUrgent && 'text-gray-500 dark:text-gray-500'
                        )}>
                          {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : `${daysUntil}d`}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 ml-2">
                      {dateReadings.map((reading, index) => {
                        const isExternal = reading.url?.startsWith('http://') || reading.url?.startsWith('https://');
                        
                        return (
                          <div key={`${reading.date}-${index}`} className={clsx(
                            index < dateReadings.length - 1 && 'pb-1 border-b border-gray-200 dark:border-gray-800'
                          )}>
                            {reading.url ? (
                              <a
                                href={reading.url}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className="!border-0 !text-sm text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 min-w-0"
                                title={reading.citation}
                              >
                                <span className="truncate flex-1 min-w-0">{reading.citation}</span>
                                {isExternal && (
                                  <span className="text-xs flex-shrink-0">↗</span>
                                )}
                              </a>
                            ) : (
                              <span className="!text-sm text-gray-800 dark:text-gray-100 block truncate" title={reading.citation}>
                                {reading.citation}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Show message if all sections are empty */}
      {resources.length === 0 && upcomingAssignments.length === 0 && upcomingReadings.length === 0 && (
        <div>
          <h2 className="!text-lg !font-normal text-gray-800 dark:text-gray-100 mb-4">Quick Links</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">No quick links available</p>
        </div>
      )}
    </div>
  );
}

