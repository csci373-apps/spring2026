import { useState, useEffect, useRef } from 'react';
import { triggerConfetti } from '@/lib/utils';
import { QuizData } from '@/components/quiz/types';

// Import types from Meeting component
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

interface Assignment {
  titleShort: string;
  title: string;
  url?: string;
  draft?: number;
}

interface Quiz {
  title: string;
  slug: string;
  quizData?: QuizData;
  draft?: number;
}

interface MeetingData {
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

interface UseMeetingChecklistOptions {
  enableLocalStorage?: boolean;
  enableConfetti?: boolean;
}

export function useMeetingChecklist(
  meeting: MeetingData,
  meetingKey: string,
  options: UseMeetingChecklistOptions = {}
) {
  const { enableLocalStorage = true, enableConfetti = true } = options;
  
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const isInitialLoad = useRef(true);
  const prevAllCheckedRef = useRef(false);

  // Get all item keys for this meeting (excluding optional readings)
  function getAllItemKeys(): string[] {
    const allItemKeys: string[] = [];
    
    // Collect all activity keys (excluding excluded and draft activities)
    if (meeting.activities) {
      meeting.activities.forEach((activity, index) => {
        // Skip excluded activities and draft activities
        if (!(activity.excluded === 1) && !(activity.draft === 1)) {
          allItemKeys.push(`${meetingKey}-activity-${index}`);
        }
      });
    }
    
    // Collect all quiz keys (excluding draft quizzes)
    if (meeting.quizzes) {
      meeting.quizzes.forEach((quiz, index) => {
        if (!(quiz.draft === 1)) {
          allItemKeys.push(`${meetingKey}-quiz-${index}`);
        }
      });
    }
    
    // Collect all required reading keys
    if (meeting.readings) {
      meeting.readings.forEach((_, index) => {
        allItemKeys.push(`${meetingKey}-reading-${index}`);
      });
    }
    
    // Note: Optional readings are intentionally excluded from completion check
    
    // Note: "Assigned" items are intentionally excluded from completion check (only "Due" items are tracked)
    
    // Collect due keys (excluding draft assignments from completion check, but they're still checkable)
    // Prefer assignment ID key for syncing with assignments page, fallback to schedule key
    if (meeting.due) {
      if (Array.isArray(meeting.due)) {
        meeting.due.forEach((dueItem, index) => {
          if (typeof dueItem === 'object' && !(dueItem.draft === 1)) {
            // Try to extract assignment ID from URL
            const assignmentId = dueItem.url?.match(/\/assignments\/([^\/]+)\/?/)?.[1];
            if (assignmentId) {
              // Use assignment ID key for syncing with assignments page
              allItemKeys.push(`assignment-${assignmentId}`);
            } else {
              // Fallback to schedule key for manual entries
              allItemKeys.push(`${meetingKey}-due-${index}`);
            }
          }
        });
      } else if (typeof meeting.due === 'object' && !(meeting.due.draft === 1)) {
        // Try to extract assignment ID from URL
        const assignmentId = meeting.due.url?.match(/\/assignments\/([^\/]+)\/?/)?.[1];
        if (assignmentId) {
          // Use assignment ID key for syncing with assignments page
          allItemKeys.push(`assignment-${assignmentId}`);
        } else {
          // Fallback to schedule key for manual entries
          allItemKeys.push(`${meetingKey}-due`);
        }
      }
    }
    
    return allItemKeys;
  }

  // Load checked items from localStorage on mount
  useEffect(() => {
    if (!enableLocalStorage || typeof window === 'undefined') {
      isInitialLoad.current = false;
      return;
    }
    
    const savedCheckedItems: Record<string, boolean> = {};
    
    // Load activities
    if (meeting.activities) {
      meeting.activities.forEach((activity, index) => {
        const key = `${meetingKey}-activity-${index}`;
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          savedCheckedItems[key] = JSON.parse(saved);
        }
      });
    }
    
    // Load quizzes
    if (meeting.quizzes) {
      meeting.quizzes.forEach((quiz, index) => {
        const key = `${meetingKey}-quiz-${index}`;
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          savedCheckedItems[key] = JSON.parse(saved);
        }
      });
    }
    
    // Load required readings
    if (meeting.readings) {
      meeting.readings.forEach((reading, index) => {
        const key = `${meetingKey}-reading-${index}`;
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          savedCheckedItems[key] = JSON.parse(saved);
        }
      });
    }
    
    // Load optional readings
    if (meeting.optionalReadings) {
      meeting.optionalReadings.forEach((reading, index) => {
        const key = `${meetingKey}-optional-reading-${index}`;
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          savedCheckedItems[key] = JSON.parse(saved);
        }
      });
    }
    
    // Load assigned
    if (meeting.assigned && typeof meeting.assigned === 'object') {
      const key = `${meetingKey}-assigned`;
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        savedCheckedItems[key] = JSON.parse(saved);
      }
    }
    
    // Load due assignments (both schedule keys and assignment ID keys)
    if (meeting.due) {
      if (Array.isArray(meeting.due)) {
        meeting.due.forEach((dueItem, index) => {
          if (typeof dueItem === 'object') {
            // Load schedule key
            const scheduleKey = `${meetingKey}-due-${index}`;
            const scheduleSaved = localStorage.getItem(scheduleKey);
            if (scheduleSaved !== null) {
              savedCheckedItems[scheduleKey] = JSON.parse(scheduleSaved);
            }
            
            // Also load assignment ID key if available
            const assignmentId = dueItem.url?.match(/\/assignments\/([^\/]+)\/?/)?.[1];
            if (assignmentId) {
              const assignmentKey = `assignment-${assignmentId}`;
              const assignmentSaved = localStorage.getItem(assignmentKey);
              if (assignmentSaved !== null) {
                savedCheckedItems[assignmentKey] = JSON.parse(assignmentSaved);
              }
            }
          }
        });
      } else if (typeof meeting.due === 'object') {
        // Load schedule key
        const scheduleKey = `${meetingKey}-due`;
        const scheduleSaved = localStorage.getItem(scheduleKey);
        if (scheduleSaved !== null) {
          savedCheckedItems[scheduleKey] = JSON.parse(scheduleSaved);
        }
        
        // Also load assignment ID key if available
        const assignmentId = meeting.due.url?.match(/\/assignments\/([^\/]+)\/?/)?.[1];
        if (assignmentId) {
          const assignmentKey = `assignment-${assignmentId}`;
          const assignmentSaved = localStorage.getItem(assignmentKey);
          if (assignmentSaved !== null) {
            savedCheckedItems[assignmentKey] = JSON.parse(assignmentSaved);
          }
        }
      }
    }
    
    setCheckedItems(savedCheckedItems);
    
    // Mark as hydrated after state is set
    setIsHydrated(true);
    
    // Mark initial load as complete after a short delay to ensure state is set
    setTimeout(() => {
      isInitialLoad.current = false;
    }, 100);
  }, [meetingKey, meeting, enableLocalStorage]);

  // After hydration, sync assignment keys from localStorage and listen for changes
  useEffect(() => {
    if (!isHydrated || !enableLocalStorage || typeof window === 'undefined') return;
    
    const allItemKeys = getAllItemKeys();
    const updatedItems = { ...checkedItems };
    let hasUpdates = false;
    
    // Check all assignment keys and sync them
    allItemKeys.forEach(key => {
      if (key.startsWith('assignment-')) {
        const stored = localStorage.getItem(key);
        const isStoredChecked = stored === 'true';
        if (isStoredChecked !== updatedItems[key]) {
          updatedItems[key] = isStoredChecked;
          hasUpdates = true;
        }
      }
    });
    
    if (hasUpdates) {
      setCheckedItems(updatedItems);
    }
    
    // Listen for storage changes (e.g., when assignment is checked on assignments page)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && allItemKeys.includes(e.key)) {
        const newValue = e.newValue === 'true';
        setCheckedItems(prev => ({
          ...prev,
          [e.key!]: newValue
        }));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also poll for changes (for same-tab updates)
    const interval = setInterval(() => {
      setCheckedItems(prev => {
        const currentItems = { ...prev };
        let needsUpdate = false;
        
        allItemKeys.forEach(key => {
          const stored = localStorage.getItem(key);
          const isStoredChecked = stored === 'true';
          if (isStoredChecked !== currentItems[key]) {
            currentItems[key] = isStoredChecked;
            needsUpdate = true;
          }
        });
        
        return needsUpdate ? currentItems : prev;
      });
    }, 300);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, enableLocalStorage]);

  // Check for completion changes and trigger confetti when all items become checked
  useEffect(() => {
    if (!isHydrated || isInitialLoad.current || !enableConfetti) return;
    
    const isAllChecked = areAllItemsCheckedWithState(checkedItems);
    
    // Check if we just transitioned to all checked (by comparing with previous state)
    if (isAllChecked && !prevAllCheckedRef.current) {
      triggerConfetti(enableConfetti);
    }
    
    prevAllCheckedRef.current = isAllChecked;
  }, [checkedItems, isHydrated, enableConfetti]);


  function areAllItemsCheckedWithState(items: Record<string, boolean>): boolean {
    const allItemKeys = getAllItemKeys();
    if (allItemKeys.length === 0) {
      return false;
    }
    
    // Only check localStorage after hydration to avoid hydration mismatches
    // During SSR and initial render, only check the items state
    const canCheckLocalStorage = isHydrated && typeof window !== 'undefined';
    
    // Check each key - also check localStorage for sync (especially for assignment keys)
    return allItemKeys.every(key => {
      // First check the items state
      if (items[key] === true) return true;
      
      // Also check localStorage (for syncing with assignments page and schedule) - only after hydration
      // This is critical for assignments checked on the assignments page
      if (canCheckLocalStorage) {
        const stored = localStorage.getItem(key);
        if (stored === 'true') return true;
      } else {
        // Before hydration, if key is not in state, assume false (for SSR consistency)
        return false;
      }
      
      // For assignment keys, also check if the corresponding schedule key is checked (fallback)
      if (key.startsWith('assignment-')) {
        const assignmentId = key.replace('assignment-', '');
        // Check all possible schedule keys that might reference this assignment
        if (meeting.due) {
          if (Array.isArray(meeting.due)) {
            for (let i = 0; i < meeting.due.length; i++) {
              const dueItem = meeting.due[i];
              if (typeof dueItem === 'object') {
                const itemAssignmentId = dueItem.url?.match(/\/assignments\/([^\/]+)\/?/)?.[1];
                if (itemAssignmentId === assignmentId) {
                  const scheduleKey = `${meetingKey}-due-${i}`;
                  if (items[scheduleKey] === true) return true;
                  if (canCheckLocalStorage) {
                    const stored = localStorage.getItem(scheduleKey);
                    if (stored === 'true') return true;
                  }
                }
              }
            }
          } else if (typeof meeting.due === 'object') {
            const itemAssignmentId = meeting.due.url?.match(/\/assignments\/([^\/]+)\/?/)?.[1];
            if (itemAssignmentId === assignmentId) {
              const scheduleKey = `${meetingKey}-due`;
              if (items[scheduleKey] === true) return true;
              if (canCheckLocalStorage) {
                const stored = localStorage.getItem(scheduleKey);
                if (stored === 'true') return true;
              }
            }
          }
        }
      }
      
      // For schedule keys, also check if the corresponding assignment key is checked (fallback)
      if ((key.includes('-due-') || key.endsWith('-due')) && !key.startsWith('assignment-')) {
        // Try to find the assignment ID for this schedule key
        let assignmentId: string | null = null;
        if (Array.isArray(meeting.due)) {
          const match = key.match(/-due-(\d+)$/);
          if (match) {
            const index = parseInt(match[1]);
            const dueItem = meeting.due[index];
            if (typeof dueItem === 'object') {
              assignmentId = dueItem.url?.match(/\/assignments\/([^\/]+)\/?/)?.[1] || null;
            }
          }
        } else if (typeof meeting.due === 'object' && key.endsWith('-due')) {
          assignmentId = meeting.due.url?.match(/\/assignments\/([^\/]+)\/?/)?.[1] || null;
        }
        
        if (assignmentId) {
          const assignmentKey = `assignment-${assignmentId}`;
          if (items[assignmentKey] === true) return true;
          if (canCheckLocalStorage) {
            const stored = localStorage.getItem(assignmentKey);
            if (stored === 'true') return true;
          }
        }
      }
      
      // If we get here, the key is not checked in state, not in localStorage, and mapping didn't find it
      return false;
    });
  }

  function toggleChecked(itemKey: string) {
    // Check current state - also check localStorage for assignment keys
    const currentChecked = checkedItems[itemKey] || 
      (typeof window !== 'undefined' && itemKey.startsWith('assignment-') 
        ? localStorage.getItem(itemKey) === 'true' 
        : false);
    
    const newChecked = !currentChecked;
    const updatedItems = {
      ...checkedItems,
      [itemKey]: newChecked
    };
    
    setCheckedItems(updatedItems);
    
    if (enableLocalStorage && typeof window !== 'undefined') {
      localStorage.setItem(itemKey, JSON.stringify(newChecked));
    }
    
    // Check if all items are now checked (only after initial load, triggered by click)
    if (!isInitialLoad.current && enableConfetti) {
      // Use a function that reads from both state and localStorage for accurate checking
      const wasAllChecked = areAllItemsCheckedWithState(checkedItems);
      const isAllChecked = areAllItemsCheckedWithState(updatedItems);
      
      // Trigger confetti when transitioning from "not all checked" to "all checked"
      if (!wasAllChecked && isAllChecked) {
        triggerConfetti(enableConfetti);
      }
    }
  }

  function areAllItemsChecked(): boolean {
    // Always check both state and localStorage for accurate completion status
    // This ensures assignments checked on assignments page are counted
    return areAllItemsCheckedWithState(checkedItems);
  }

  function isChecked(itemKey: string): boolean {
    // Check state first
    if (checkedItems[itemKey] === true) return true;
    
    // Also check localStorage (for syncing with assignments page and immediate updates after toggle)
    if (isHydrated && typeof window !== 'undefined') {
      const stored = localStorage.getItem(itemKey);
      if (stored === 'true') return true;
    }
    
    return false;
  }

  return {
    checkedItems,
    toggleChecked,
    isChecked,
    areAllItemsChecked,
  };
}
