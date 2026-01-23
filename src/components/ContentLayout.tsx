"use client";

import { ReactNode, useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import TableOfContents from './TableOfContents';
import Footer from './Footer';
import { scrollToAnchor } from '@/lib/utils';

interface ResourcePage {
  slug: string;
  title: string;
  group: string;
  group_order: number;
  order: number;
}

interface ContentLayoutProps {
  children: ReactNode;
  variant: 'resources-detail' | 'detail-with-toc' | 'list';
  leftNav?: ReactNode; // For resources detail pages
  showToc?: boolean;
  tocMaxLevel?: number;
  resourcePages?: ResourcePage[]; // For resources detail pages
  showFooter?: boolean; // Whether to show footer inside content area
}

/**
 * Shared layout component that ensures consistent content positioning across all pages.
 * 
 * Layout variants:
 * - resources-detail: Left nav (256px) + Content + TOC (256px fixed right)
 * - detail-with-toc: Spacer (256px) + Content + TOC (256px fixed right)
 * - list: Spacer (256px) + Content (no TOC)
 * 
 * All content starts at 256px from the left to maintain consistent positioning.
 */
export default function ContentLayout({
  children,
  variant,
  leftNav,
  showToc = true,
  tocMaxLevel = 2,
  showFooter = true,
}: ContentLayoutProps) {
  const isResourcesDetail = variant === 'resources-detail';
  const isDetailWithToc = variant === 'detail-with-toc';
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isRestoringRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // All pages use full-height scrollable containers
  const hasToc = (isResourcesDetail || isDetailWithToc) && showToc;
  
  // Restore scroll position - wait for meeting states to be restored first (sequencing matters)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    const scrollKey = `scroll-position-percentage-${pathname}`;
    const savedPercentage = localStorage.getItem(scrollKey);
    
    if (!savedPercentage) return;
    
    const percentage = parseFloat(savedPercentage);
    if (isNaN(percentage)) return;
    
    isRestoringRef.current = true;
    
    // Function to restore scroll position
    const startScrollRestoration = () => {
      // Try to restore immediately (before paint)
      const scrollContainer = scrollContainerRef.current || document.getElementById('main-content-scroll');
      if (scrollContainer) {
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        
        if (maxScroll > 0 && scrollHeight > 200) {
          const targetPosition = (percentage / 100) * maxScroll;
          scrollContainer.scrollTop = targetPosition;
        }
      }
      
      // Also restore after content loads (in case initial attempt was too early)
      let lastScrollHeight = 0;
      let stableCount = 0;
      
      const restoreScroll = () => {
        const container = scrollContainerRef.current || document.getElementById('main-content-scroll');
        if (!container) {
          requestAnimationFrame(restoreScroll);
          return;
        }
        
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        
        if (maxScroll <= 0 || scrollHeight < 200) {
          requestAnimationFrame(restoreScroll);
          return;
        }
        
        // Check if scroll height has stabilized
        if (scrollHeight === lastScrollHeight) {
          stableCount++;
          if (stableCount >= 2) {
            // Content is stable, restore using percentage
            const targetPosition = (percentage / 100) * maxScroll;
            container.scrollTop = targetPosition;
            
            setTimeout(() => {
              isRestoringRef.current = false;
            }, 200);
            return;
          }
        } else {
          lastScrollHeight = scrollHeight;
          stableCount = 0;
        }
        
        requestAnimationFrame(restoreScroll);
      };
      
      // Start checking after initial render
      requestAnimationFrame(restoreScroll);
    };
    
    // Check if we're on the schedule page - if so, wait for meeting states to be restored
    // Normalize pathname by removing base path if present
    const normalizedPath = pathname.replace(/^\/spring2026/, '') || '/';
    const isSchedulePage = normalizedPath === '/';
    
    if (isSchedulePage) {
      // Wait for meeting states to be restored before starting scroll restoration
      // This ensures proper sequencing: meeting states first, then scroll position
      const handleMeetingStatesRestored = () => {
        // Small delay to ensure DOM has updated with new meeting states
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            startScrollRestoration();
          });
        });
      };
      
      // Set up listener immediately (useLayoutEffect runs synchronously)
      window.addEventListener('meeting-states-restored', handleMeetingStatesRestored, { once: true });
      
      // Fallback: if event doesn't fire within 200ms, start restoration anyway
      // This handles cases where ScheduleContent hasn't mounted yet or event fails
      setTimeout(() => {
        window.removeEventListener('meeting-states-restored', handleMeetingStatesRestored);
        startScrollRestoration();
      }, 200);
    } else {
      // Not schedule page, start restoration immediately
      startScrollRestoration();
    }
  }, [pathname]);
  
  // Save scroll position on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const scrollContainer = scrollContainerRef.current || document.getElementById('main-content-scroll');
    if (!scrollContainer) return;
    
    const scrollKey = `scroll-position-percentage-${pathname}`;
    
    const handleScroll = () => {
      // Don't save during restoration
      if (isRestoringRef.current) return;
      
      // Debounce to avoid too many writes
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        // Double-check we're not restoring (in case flag changed during timeout)
        if (isRestoringRef.current) return;
        
        const container = scrollContainerRef.current || document.getElementById('main-content-scroll');
        if (!container) return;
        
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        
        // Save as percentage (more reliable when content height changes)
        if (maxScroll > 0) {
          const percentage = (scrollTop / maxScroll) * 100;
          localStorage.setItem(scrollKey, percentage.toString());
        }
      }, 150);
    };
    
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [pathname]);
  
  // Handle anchor link clicks and initial hash on page load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const scrollContainer = scrollContainerRef.current || document.getElementById('main-content-scroll');
    if (!scrollContainer) return;
    
    // Handle initial hash on page load
    const handleInitialHash = () => {
      const hash = window.location.hash.slice(1); // Remove #
      if (hash) {
        // Wait for content to be ready (similar to scroll restoration)
        let lastScrollHeight = 0;
        let stableCount = 0;
        
        const checkAndScroll = () => {
          const scrollHeight = scrollContainer.scrollHeight;
          
          if (scrollHeight < 200) {
            requestAnimationFrame(checkAndScroll);
            return;
          }
          
          // Check if scroll height has stabilized
          if (scrollHeight === lastScrollHeight) {
            stableCount++;
            if (stableCount >= 2) {
              // Content is stable, scroll to anchor
              scrollToAnchor(hash, { behavior: 'auto' }); // Use 'auto' for initial load to avoid animation
              return;
            }
          } else {
            lastScrollHeight = scrollHeight;
            stableCount = 0;
          }
          
          requestAnimationFrame(checkAndScroll);
        };
        
        // Start checking after initial render
        requestAnimationFrame(checkAndScroll);
      }
    };
    
    // Handle initial hash after a short delay to ensure content is loaded
    const initialHashTimeout = setTimeout(handleInitialHash, 100);
    
    // Handle anchor link clicks - use document-level delegation to catch all clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (!anchor) return;
      
      // Skip TOC links FIRST (they have their own handlers)
      if (anchor.classList.contains('toc-link')) {
        return;
      }
      
      // Only handle links within the scroll container
      if (!scrollContainer.contains(anchor)) {
        return;
      }
      
      // Skip if default was already prevented by another handler
      if (e.defaultPrevented) return;
      
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || !href.startsWith('#')) return;
      
      const targetId = href.slice(1); // Remove #
      if (!targetId) return;
      
      // Check if target element exists
      const targetElement = document.getElementById(targetId);
      if (!targetElement) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      scrollToAnchor(targetId);
    };
    
    // Use document-level event delegation to catch all clicks, then filter by container
    // This ensures we catch clicks even if content is rendered after the listener is attached
    document.addEventListener('click', handleAnchorClick, true);
    
    return () => {
      clearTimeout(initialHashTimeout);
      document.removeEventListener('click', handleAnchorClick, true);
    };
  }, [pathname]);
  
  return (
    <div className="relative lg:h-[calc(100vh-4rem)] lg:overflow-hidden -mx-4 lg:-mx-8">
      {/* Mobile: Stacked layout */}
      <div className="lg:hidden">
        {leftNav && (
          <div className="w-full px-4 pt-4">
            {leftNav}
          </div>
        )}
        <div className="w-full">
          <div className="max-w-4xl mx-auto px-4">
            <div className="space-y-6 py-6">
              {children}
              {showFooter && <Footer />}
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop: Three-column layout with scrollable content */}
      <div className="hidden lg:flex h-full">
        {/* Left Column: Nav (resources or due dates) or Spacer */}
        <div className="w-64 flex-shrink-0">
          {leftNav ? (
            <div className="h-full overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
              {leftNav}
            </div>
          ) : (
            // Invisible spacer to align content with pages that have nav
            <div className="h-full" aria-hidden="true" />
          )}
        </div>
        
        {/* Center Column: Content - scrollable on all pages */}
        <div 
          ref={scrollContainerRef}
          id="main-content-scroll"
          className={`flex-1 min-w-0 overflow-y-auto ${hasToc ? 'mr-72' : ''}`}
        >
          <div className="max-w-4xl px-4 lg:px-8">
            <div className="space-y-6 py-6">
              {children}
              {showFooter && <Footer />}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column: Table of Contents (fixed, flush to right edge) */}
      {(isResourcesDetail || isDetailWithToc) && showToc && (
        <div className="hidden lg:block fixed top-16 right-0 w-72 h-[calc(100vh-4rem)] overflow-y-auto border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-black pr-1 [&::-webkit-scrollbar-track]:bg-white dark:[&::-webkit-scrollbar-track]:bg-black">
          <TableOfContents maxLevel={tocMaxLevel} />
        </div>
      )}
    </div>
  );
}

