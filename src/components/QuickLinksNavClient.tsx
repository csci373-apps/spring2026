'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/utils';

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
  external_url?: string;
}

interface QuickLinksNavClientProps {
  resources: ResourceData[];
  assignments: AssignmentData[];
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

export default function QuickLinksNavClient({ resources, assignments }: QuickLinksNavClientProps) {
  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Quick Links Section */}
      {resources.length > 0 && (
        <div className="mb-8">
          <h2 className="!text-lg !font-normal text-gray-900 dark:text-gray-100 mb-4">Quick Links</h2>
          <div className="space-y-2">
            {resources.map((resource) => {
              return (
                <div key={resource.id}>
                  <Link
                    href={`/resources/${resource.id}`}
                    className="!border-0 !text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block"
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
      {assignments.length > 0 && (
        <div>
          <h2 className="!text-lg !font-normal text-gray-900 dark:text-gray-100 mb-4">Upcoming Due Dates</h2>
          <div className="space-y-1">
            {assignments.map((assignment, index) => {
              const daysUntil = assignment.due_date ? getDaysUntilDue(assignment.due_date) : null;
              const isToday = daysUntil === 0;
              const isTomorrow = daysUntil === 1;
              const isUrgent = daysUntil !== null && daysUntil <= 3;
              
              const assignmentLabel = assignment.type && assignment.num
                ? `${titleCase(assignment.type)} ${assignment.num}`
                : assignment.title;

              return (
                <div key={assignment.id} className={`flex items-start justify-between gap-3 ${index < assignments.length - 1 ? 'pb-2 border-b border-gray-200 dark:border-gray-800' : ''}`}>
                  <div className="flex-1 min-w-0">
                    {assignment.external_url ? (
                      <a
                        href={assignment.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="!border-0 !text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block"
                      >
                        {assignmentLabel}
                        <span className="ml-1 text-xs">↗</span>
                      </a>
                    ) : (
                      <Link
                        href={`/assignments/${assignment.id}`}
                        className="!border-0 !text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 block"
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
                    <span className={`text-xs font-semibold whitespace-nowrap ${
                      isToday 
                        ? 'text-red-600 dark:text-red-400' 
                        : isTomorrow 
                        ? 'text-orange-600 dark:text-orange-400'
                        : isUrgent
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : `${daysUntil}d`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Show message if both sections are empty */}
      {resources.length === 0 && assignments.length === 0 && (
        <div>
          <h2 className="!text-lg !font-normal text-gray-900 dark:text-gray-100 mb-4">Quick Links</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">No quick links available</p>
        </div>
      )}
    </div>
  );
}

