"use client";

import { ReactNode, useEffect } from 'react';

interface QuizDrawerProps {
  isOpen: boolean;
  isAnimating: boolean;
  isClosing: boolean;
  onClose: () => void;
  isDark: boolean;
  children: ReactNode;
}

export default function QuizDrawer({
  isOpen,
  isAnimating,
  isClosing,
  onClose,
  isDark,
  children,
}: QuizDrawerProps) {
  // Disable scrolling when drawer is open (on both html and body)
  useEffect(() => {
    if (isOpen || isAnimating || isClosing) {
      // Save the current overflow values
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      // Disable scrolling on both html and body
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        // Restore original overflow when drawer closes
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen, isAnimating, isClosing]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-70"
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />
      
      {/* Quiz Drawer */}
      <div
        className="fixed inset-0"
        style={{ zIndex: 9999, pointerEvents: 'none' }}
      >
        <div
          className={`fixed bottom-0 left-0 right-0 w-full h-[100%] bg-white dark:bg-gray-900 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            isClosing ? 'translate-y-full' : isAnimating ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={isDark ? { backgroundColor: '#111827', pointerEvents: 'auto' } : { pointerEvents: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Absolutely positioned */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md transition-colors"
            style={isDark ? { color: '#9ca3af' } : undefined}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Quiz Content Area with Navigation */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
