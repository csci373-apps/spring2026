'use client'

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useChecklist } from '@/components/schedule-entry/useChecklist';
import DaysLeft from '@/components/DaysLeft';
import { formatDate } from '@/lib/utils';

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

interface ContentRowProps {
  item: ContentData;
  showWeek: string;
  contentType: 'assignments' | 'exams';
}

export default function ContentRow({ item, showWeek, contentType }: ContentRowProps) {
  const [isDark, setIsDark] = useState(false);
  // Use useMemo to stabilize the itemIds array
  const itemIds = useMemo(() => [item.id], [item.id]);
  const checklist = useChecklist(itemIds, { 
    enableLocalStorage: true, 
    storagePrefix: contentType 
  });
  const isChecked = checklist.isChecked(item.id);
  
  const handleToggle = () => {
    const newChecked = !isChecked;
    checklist.toggleChecked(item.id);
    
    // Also update any schedule keys that reference this item
    // Schedule keys follow pattern: meeting-{date}-{topic}-due-{index} or meeting-{date}-{topic}-due
    // We update them to keep in sync, but the primary source of truth is {contentType}-{id}
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key !== `${contentType}-${item.id}` && (key.includes(`-due-`) || key.endsWith(`-due`))) {
          // Check if this schedule key's value differs from our item state
          const currentValue = localStorage.getItem(key);
          const currentBool = currentValue === 'true';
          if (currentBool !== newChecked) {
            localStorage.setItem(key, JSON.stringify(newChecked));
          }
        }
      }
    }
  };
  
  // On mount, check if schedule has this item checked and sync
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const itemKey = `${contentType}-${item.id}`;
    const currentValue = localStorage.getItem(itemKey);
    
    // Check all schedule keys to see if any have this item checked
    let scheduleChecked = false;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== itemKey && (key.includes(`-due-`) || key.endsWith(`-due`))) {
        const value = localStorage.getItem(key);
        if (value === 'true') {
          scheduleChecked = true;
          break;
        }
      }
    }
    
    // If schedule has it checked but item page key doesn't exist or is false, sync it
    if (scheduleChecked && currentValue !== 'true') {
      localStorage.setItem(itemKey, 'true');
      // Trigger a re-render by toggling (this will set it to true since it's currently false)
      if (!isChecked) {
        checklist.toggleChecked(item.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount to sync localStorage

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  function titleCase(str: string): string {
    if (str.toLowerCase() === 'assignment') {
      return 'Homework';
    }
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function isDraft(item: ContentData): boolean {
    return (item.draft !== undefined && item.draft === 1);
  }

  function getContentLink(item: ContentData): React.ReactNode {
    if (isDraft(item)) {
      return <>{item.type ? titleCase(item.type) : ''} {item.num ? item.num : ''}</>;
    }
    
    // Handle external items
    if (item.external_url) {
      return (
        <>
        <a 
          href={item.external_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-200 hover:underline"
        >
          {item.type ? titleCase(item.type) : ''} {item.num ? item.num : ''}</a>
        <span className="ml-1 text-xs">↗</span>
        </>
      );
    }
    
    // Handle regular markdown items - use contentType to determine the route
    return (<>
      <Link href={`/${contentType}/${item.id}`} className="text-blue-600 dark:text-blue-200 hover:underline">
        {item.type ? titleCase(item.type) : ''} {item.num ? item.num : ''}
      </Link>
      {item.notes && (
        <span className="ml-1 text-xs">({item.notes})</span>
      )}
      </>
    );
  }

  const isDraftItem = isDraft(item);
  const shouldShowCheckbox = !isDraftItem;

  return (
    <tr className={`p-6 ${isChecked ? 'opacity-60' : ''}`}>
      <td className="w-[50px]">
        {shouldShowCheckbox && (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleToggle}
            aria-label={`Mark ${contentType === 'exams' ? 'exam' : 'assignment'} "${item.type ? titleCase(item.type) : ''} ${item.num || ''}" as ${isChecked ? 'incomplete' : 'complete'}`}
            className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 accent-blue-600 dark:accent-blue-400 cursor-pointer flex-shrink-0"
            style={isDark ? { 
              backgroundColor: isChecked ? '#3b82f6' : '#1f2937',
              borderColor: isChecked ? '#3b82f6' : '#4b5563'
            } : undefined}
          />
        )}
      </td>
      <td className="hidden md:table-cell w-[100px]">
        <strong>{showWeek}</strong>
      </td>
      <td>
        <div className={isChecked ? 'line-through' : ''}>
          {getContentLink(item)}
        </div>
      </td>
      <td className="hidden md:table-cell md:w-[400px]">
        <div className={isChecked ? 'line-through' : ''}>{item.title}</div>
      </td>
      <td>{item.due_date ? formatDate(item.due_date) : ''}</td>
      <td><DaysLeft dueDate={item.due_date || ''} /></td>
    </tr>
  );
}
