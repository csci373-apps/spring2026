'use client'

import { Reading } from './types';

interface ReadingsListProps {
  readings: Reading[];
  isOptional?: boolean;
  title: string;
  meetingKey: string;
  checklist: {
    isChecked: (key: string) => boolean;
    toggleChecked: (key: string) => void;
  };
  enableChecklist: boolean;
  isDark: boolean;
}

export default function ReadingsList({
  readings,
  isOptional,
  title,
  meetingKey,
  checklist,
  enableChecklist,
  isDark,
}: ReadingsListProps) {
  if (readings.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <strong className="text-gray-700 dark:text-gray-300" style={isDark ? { color: '#d1d5db' } : undefined}>{title}</strong>
      <ol className="!list-none !pl-4">
        {readings.map((reading, index) => {
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
          );
        })}
      </ol>
    </div>
  );
}
