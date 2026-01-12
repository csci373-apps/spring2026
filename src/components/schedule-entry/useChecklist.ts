import { useState, useEffect, useRef } from 'react';

interface UseChecklistOptions {
  enableLocalStorage?: boolean;
  storagePrefix?: string;
}

/**
 * Generic checklist hook that can be used for any list of items
 * @param itemIds Array of unique item identifiers
 * @param options Configuration options
 */
export function useChecklist(
  itemIds: string[],
  options: UseChecklistOptions = {}
) {
  const { enableLocalStorage = true, storagePrefix = 'checklist' } = options;
  
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const itemIdsKeyRef = useRef<string>('');
  const itemIdsRef = useRef<string[]>(itemIds);
  
  // Create a stable key from itemIds to detect changes
  const itemIdsKey = itemIds.join(',');

  // Load checked items from localStorage on mount or when itemIds change
  useEffect(() => {
    if (!enableLocalStorage || typeof window === 'undefined') {
      return;
    }
    
    // Only reload if itemIds actually changed
    if (itemIdsKeyRef.current === itemIdsKey) {
      return;
    }
    itemIdsKeyRef.current = itemIdsKey;
    itemIdsRef.current = itemIds;
    
    const savedCheckedItems: Record<string, boolean> = {};
    
    itemIdsRef.current.forEach((itemId) => {
      const key = `${storagePrefix}-${itemId}`;
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        savedCheckedItems[itemId] = JSON.parse(saved);
      }
    });
    
    setCheckedItems(savedCheckedItems);
  }, [itemIdsKey, enableLocalStorage, storagePrefix]);

  function toggleChecked(itemId: string) {
    const newChecked = !checkedItems[itemId];
    const updatedItems = {
      ...checkedItems,
      [itemId]: newChecked
    };
    
    setCheckedItems(updatedItems);
    
    if (enableLocalStorage && typeof window !== 'undefined') {
      const key = `${storagePrefix}-${itemId}`;
      localStorage.setItem(key, JSON.stringify(newChecked));
    }
  }

  function isChecked(itemId: string): boolean {
    return checkedItems[itemId] || false;
  }

  function areAllItemsChecked(): boolean {
    if (itemIds.length === 0) {
      return false;
    }
    return itemIds.every(id => checkedItems[id] === true);
  }

  return {
    checkedItems,
    toggleChecked,
    isChecked,
    areAllItemsChecked,
  };
}
