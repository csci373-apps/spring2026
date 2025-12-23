'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';

interface ExpandableSectionProps {
  children: React.ReactNode;
  title: string;
  defaultExpanded?: boolean;
  storageKey?: string;
}

export default function ExpandableSection({ 
  children, 
  title,
  defaultExpanded = false,
  storageKey
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Load saved state from localStorage on mount if storageKey is provided
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      const savedState = localStorage.getItem(storageKey);
      if (savedState !== null) {
        setIsExpanded(JSON.parse(savedState));
      }
    }
  }, [storageKey]);

  function toggleExpanded() {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(newState));
    }
  }

  return (
    <div className="my-6">
      <button
        onClick={toggleExpanded}
        className="w-full text-left flex items-center justify-between p-4 transition-colors"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
        aria-expanded={isExpanded}
      >
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
          {title}
        </span>
        <div className="text-black dark:text-white hover:text-sky-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white flex justify-center items-center w-[35px] h-[35px]">
          {isExpanded ? 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 15l7-7 7 7" />
            </svg>: 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
            </svg>
          }
        </div>
      </button>
      <div 
        className={clsx("overflow-hidden transition-all duration-300 ease-in-out", {
          'max-h-0 opacity-0 mt-0': !isExpanded,
          'max-h-[5000px] opacity-100 mt-0': isExpanded
        })}
      >
        {isExpanded && (
          <div 
            className="p-8 pb-2 mb-4"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

