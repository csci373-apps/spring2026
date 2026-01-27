'use client'

import Link from 'next/link';
import { Assignment } from './types';

interface AssignmentsListProps {
  assignments: Assignment | string | (Assignment | string)[];
  type: 'assigned' | 'due';
  meetingKey: string;
  checklist: {
    isChecked: (key: string) => boolean;
    toggleChecked: (key: string) => void;
  };
  enableChecklist: boolean;
  isDark: boolean;
}

export default function AssignmentsList({
  assignments,
  type,
  meetingKey,
  checklist,
  enableChecklist,
  isDark,
}: AssignmentsListProps) {
  if (!assignments) {
    return null;
  }

  function renderAssignment(assignment: Assignment | string, index?: number) {
    if (typeof assignment === 'string') {
      return assignment;
    }
    
    const isDraft = assignment.draft && assignment.draft === 1;
    const isTutorial = assignment.titleShort?.startsWith('Tutorial') || false;
    const showCheckbox = type === 'due' && !isDraft && !isTutorial; // Show checkbox for non-draft "due" items only, but not for tutorials
    
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
    
    // Format tutorial display: "Tutorial X: Name of Tutorial"
    let displayText: React.ReactNode;
    if (isTutorial) {
      // Extract tutorial number from titleShort (e.g., "Tutorial 1" -> "1")
      const tutorialMatch = assignment.titleShort?.match(/Tutorial\s+(\d+)/i);
      const tutorialNum = tutorialMatch ? tutorialMatch[1] : '';
      const tutorialLabel = tutorialNum ? `Tutorial ${tutorialNum}` : assignment.titleShort || 'Tutorial';
      
      if (isDraft) {
        displayText = <>{tutorialLabel}: {assignment.title}</>;
      } else {
        displayText = (
          <Link 
            href={assignment.url || '#'} 
            className="text-blue-600 dark:text-blue-400 hover:underline" 
            onClick={(e) => e.stopPropagation()}
          >
            {tutorialLabel}: {assignment.title}
          </Link>
        );
      }
    } else {
      // Regular assignment formatting
      if (isDraft) {
        displayText = <>{assignment.titleShort}: {assignment.title}</>;
      } else {
        displayText = (
          <>
            <Link 
              href={assignment.url || '#'} 
              className="text-blue-600 dark:text-blue-400 hover:underline" 
              onClick={(e) => e.stopPropagation()}
            >
              {assignment.titleShort}
            </Link>: {assignment.title}
          </>
        );
      }
    }
    
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
          {displayText}
        </div>
      </div>
    );
  }

  const label = type === 'assigned' ? 'Assigned' : 'Due';
  const assignmentsArray = Array.isArray(assignments) ? assignments : [assignments];

  return (
    <div className="mb-4">
      <strong className="text-gray-700 dark:text-gray-300" style={isDark ? { color: '#d1d5db' } : undefined}>{label}: </strong>
      {assignmentsArray.length > 1 ? (
        <ul className="!list-none !pl-4">
          {assignmentsArray.map((assignment, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">
              {renderAssignment(assignment, index)}
            </li>
          ))}
        </ul>
      ) : (
        renderAssignment(assignmentsArray[0])
      )}
    </div>
  );
}
