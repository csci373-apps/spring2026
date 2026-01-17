'use client';

import React, { useEffect, useState } from 'react';
import { scrollToAnchor, SCROLL_OFFSET_PX } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  maxLevel?: number;
}

export default function TableOfContents({ maxLevel = 2 }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    let intersectionObserver: IntersectionObserver | null = null;
    let lastItemsHash = '';
    
    const performScan = () => {
      // Build selector based on maxLevel
      const headingSelectors = [];
      for (let i = 2; i <= maxLevel; i++) {
        headingSelectors.push(`h${i}`);
      }
      const selector = headingSelectors.join(', ');
      
      // Try to find headings within the main content scroll container first
      // Otherwise fall back to the resources layout container or document
      const scrollContainer = document.getElementById('main-content-scroll');
      const resourcesLayout = document.querySelector('[data-resources-layout]');
      const searchRoot = scrollContainer || resourcesLayout || document;
      
      // Find all heading elements within the search root
      const allHeadings = searchRoot.querySelectorAll(selector);
      const headings: Element[] = [];
      
      allHeadings.forEach((heading) => {
        const instructorNotesSection = heading.closest('[data-instructor-notes="true"]');
        if (!instructorNotesSection) {
          headings.push(heading);
        }
      });
      
      const items: TocItem[] = [];
      const usedIds = new Set<string>();

      headings.forEach((heading, index) => {
        let id = heading.id;
        
        if (!id) {
          const baseId = heading.textContent?.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-') || `heading-${index}`;
          
          id = baseId;
          let counter = 1;
          while (usedIds.has(id)) {
            id = `${baseId}-${counter}`;
            counter++;
          }
          
          heading.id = id;
        }
        
        usedIds.add(id);

        const level = parseInt(heading.tagName.charAt(1));
        if (level <= maxLevel) {
          items.push({
            id: heading.id,
            text: heading.textContent || '',
            level: level
          });
        }
      });

      // Only update if items actually changed (use hash to avoid expensive JSON.stringify)
      const itemsHash = items.map(item => `${item.id}:${item.text}`).join('|');
      if (itemsHash !== lastItemsHash) {
        lastItemsHash = itemsHash;
        setTocItems(items);
      }

      // Clean up old observer
      if (intersectionObserver) {
        headings.forEach((heading) => intersectionObserver!.unobserve(heading));
      }

      // Set up new intersection observer
      // Use scroll container as root if it exists and is scrollable, otherwise use viewport
      const isContainerScrollable = scrollContainer && 
        (getComputedStyle(scrollContainer).overflowY === 'auto' || 
         getComputedStyle(scrollContainer).overflowY === 'scroll');
      
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        {
          root: isContainerScrollable ? scrollContainer : null,
          // rootMargin top should match SCROLL_OFFSET_PX from utils.ts
          // This ensures TOC highlighting aligns with anchor scroll position
          rootMargin: `-${SCROLL_OFFSET_PX}px 0px -80% 0px`,
          threshold: 0.1
        }
      );

      headings.forEach((heading) => intersectionObserver!.observe(heading));
    };
    
    // Initial scan
    performScan();
    
    // Do an early scan after a short delay to catch quiz that loads quickly
    setTimeout(performScan, 500);
    
    // Re-scan periodically to catch dynamically added headings (like quiz)
    // Use a shorter interval for faster detection
    const interval = setInterval(performScan, 1000);

    return () => {
      clearInterval(interval);
      if (intersectionObserver) {
        // Clean up observer on unmount
        const allHeadings = document.querySelectorAll('h2, h3, h4, h5, h6');
        allHeadings.forEach((heading) => intersectionObserver!.unobserve(heading));
      }
    };
  }, [maxLevel]);

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <nav className="">
      <div 
        className="pl-4">
        <h2 className="!text-lg !font-normal mb-2">On This Page</h2>
        <ul className="!list-none !p-0 !m-0 space-y-0.5">
          {tocItems.map((item) => {
            // Calculate indentation based on level (h2 = 0, h3 = 4, h4 = 8, etc.)
            const indentClass = item.level === 3 ? 'ml-4' : 
                               item.level === 4 ? 'ml-8' : 
                               item.level === 5 ? 'ml-12' : 
                               item.level === 6 ? 'ml-16' : '';
            
            return (
            <li 
              key={item.id}
              className={indentClass}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToAnchor(item.id);
                }}
                className={`block py-0.5 px-2 text-sm font-normal transition-colors whitespace-nowrap overflow-hidden !border-0 text-ellipsis rounded toc-link ${
                  activeId === item.id
                    ? '!font-extrabold text-blue-600 dark:text-blue-100 hover:text-blue-600 dark:hover:text-blue-200'
                    : 'text-gray-500 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-100'
                }`}
                title={item.text}
              >
                {item.text}
              </a>
            </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
