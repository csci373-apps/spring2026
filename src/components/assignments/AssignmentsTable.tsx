'use client'

import { useEffect, useRef, useState } from 'react';
import AssignmentRow from './AssignmentRow';
import { formatDate, getWeek, triggerConfetti } from '@/lib/utils';

interface AssignmentData {
  id: string;
  num?: string;
  title: string;
  excerpt?: string;
  date?: string;
  due_date?: string;
  type?: string;
  assigned?: string;
  notes?: string;
  draft?: number;
  external_url?: string;
  external_type?: string;
  excluded?: boolean;
}

interface AssignmentsTableProps {
  assignments: AssignmentData[];
}

export default function AssignmentsTable({ assignments }: AssignmentsTableProps) {
  const [allChecked, setAllChecked] = useState(false);
  const previousAllCheckedRef = useRef(false);
  const isInitialLoad = useRef(true);

  // Filter out draft assignments for completion tracking
  const nonDraftAssignments = assignments.filter(assignment => 
    !(assignment.draft !== undefined && assignment.draft === 1)
  );
  const nonDraftIds = nonDraftAssignments.map(a => a.id);


  // Listen for storage changes to update completion status
  useEffect(() => {
    if (nonDraftIds.length === 0) {
      return;
    }

    const checkAllCompleted = () => {
      const allCheckedStatus = nonDraftIds.every(id => {
        const key = `assignment-${id}`;
        const saved = localStorage.getItem(key);
        return saved !== null && JSON.parse(saved) === true;
      });

      // Trigger confetti when transitioning from "not all checked" to "all checked"
      if (allCheckedStatus && !previousAllCheckedRef.current && !isInitialLoad.current) {
        triggerConfetti();
      }

      previousAllCheckedRef.current = allCheckedStatus;
      setAllChecked(allCheckedStatus);
    };

    // Check on mount (but don't trigger confetti on initial load)
    checkAllCompleted();
    isInitialLoad.current = false;

    // Listen for storage events (for cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('assignment-')) {
        checkAllCompleted();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically in case of same-tab updates
    // Use a reasonable interval to avoid performance issues
    const interval = setInterval(checkAllCompleted, 300);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [nonDraftIds.join(',')]);

  return (
    <table className="table-fixed w-full">
      <thead>
        <tr>
          <th className="w-[50px]"></th>
          <th className="hidden md:table-cell md:w-[100px]">Week</th>
          <th className="md:w-[150px]">Assignment</th>
          <th className="hidden md:table-cell md:w-[400px]">Title</th>
          <th className="md:w-[120px]">Due</th>
          <th className="md:w-[100px]">Days Left</th>
        </tr> 
      </thead>
      <tbody>
        {assignments.map((assignment, index) => {
          const currentWeek = assignment.due_date ? getWeek(assignment.due_date) : '';
          const previousWeek = index > 0 && assignments[index - 1].due_date ? getWeek(assignments[index - 1].due_date!) : '';
          const showWeek = currentWeek !== previousWeek ? currentWeek : '';
          
          return (
            <AssignmentRow
              key={assignment.id}
              assignment={assignment}
              showWeek={showWeek}
            />
          );
        })}
      </tbody>
    </table>
  );
}
