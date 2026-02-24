'use client'

import { useEffect, useRef } from 'react';
import ContentRow from './ContentRow';
import { getWeek, triggerConfetti } from '@/lib/utils';

interface ContentData {
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

interface ContentTableProps {
  items: ContentData[];
  contentType: 'assignments' | 'exams';
}

export default function ContentTable({ items, contentType }: ContentTableProps) {
  const previousAllCheckedRef = useRef(false);
  const isInitialLoad = useRef(true);

  // Filter out draft items for completion tracking
  const nonDraftItems = items.filter(item => 
    !(item.draft !== undefined && item.draft === 1)
  );
  const nonDraftIds = nonDraftItems.map(a => a.id);


  // Listen for storage changes to update completion status
  useEffect(() => {
    if (nonDraftIds.length === 0) {
      return;
    }

    const checkAllCompleted = () => {
      const allCheckedStatus = nonDraftIds.every(id => {
        const key = `${contentType}-${id}`;
        const saved = localStorage.getItem(key);
        return saved !== null && JSON.parse(saved) === true;
      });

      // Trigger confetti when transitioning from "not all checked" to "all checked"
      if (allCheckedStatus && !previousAllCheckedRef.current && !isInitialLoad.current) {
        triggerConfetti();
      }

      previousAllCheckedRef.current = allCheckedStatus;
    };

    // Check on mount (but don't trigger confetti on initial load)
    checkAllCompleted();
    isInitialLoad.current = false;

    // Listen for storage events (for cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith(`${contentType}-`)) {
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
  }, [nonDraftIds, contentType]);

  return (
    <table className="table-fixed w-full">
      <thead>
        <tr>
          <th className="w-[50px]"></th>
          <th className="hidden md:table-cell md:w-[100px]">Week</th>
          <th className="md:w-[150px]">Link</th>
          <th className="hidden md:table-cell md:w-[400px]">Title</th>
          <th className="md:w-[120px]">Due</th>
          <th className="md:w-[100px]">Days Left</th>
        </tr> 
      </thead>
      <tbody>
        {items.map((item, index) => {
          const currentWeek = item.due_date ? getWeek(item.due_date) : '';
          const previousWeek = index > 0 && items[index - 1].due_date ? getWeek(items[index - 1].due_date!) : '';
          const showWeek = currentWeek !== previousWeek ? currentWeek : '';
          
          return (
            <ContentRow
              key={item.id}
              item={item}
              showWeek={showWeek}
              contentType={contentType}
            />
          );
        })}
      </tbody>
    </table>
  );
}
