"use client";

import { useState, useEffect } from 'react';

/**
 * Shared hook for dark mode detection across all components.
 * Uses a single MutationObserver to watch for dark class changes.
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initial check
    setIsDark(document.documentElement.classList.contains('dark'));

    // Watch for changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

