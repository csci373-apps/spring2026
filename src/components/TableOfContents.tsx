'use client';

import React, { useEffect, useState, useCallback } from 'react';

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
  const [isDark, setIsDark] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    // Check if dark mode is active
    setIsDark(document.documentElement.classList.contains('dark'));
    
    // Watch for dark mode changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const scanHeadings = useCallback(() => {
    // Build selector based on maxLevel (e.g., maxLevel 2 = "h2", maxLevel 3 = "h2, h3")
    const headingSelectors = [];
    for (let i = 2; i <= maxLevel; i++) {
      headingSelectors.push(`h${i}`);
    }
    const selector = headingSelectors.join(', ');
    
    // Find all heading elements up to maxLevel, but exclude those inside instructor notes sections
    const allHeadings = document.querySelectorAll(selector);
    const headings: Element[] = [];
    
    // Filter out headings that are inside instructor notes sections
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
      
      // If no id exists, generate one
      if (!id) {
        const baseId = heading.textContent?.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-') || `heading-${index}`;
        
        // Ensure uniqueness by adding a number if needed
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

    setTocItems(items);
  }, [maxLevel]);

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
          rootMargin: '-80px 0px -80% 0px',
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
                  const isQuizSection = item.id.startsWith('quiz-');
                  
                  // Update URL hash
                  window.history.pushState(null, '', `#${item.id}`);
                  
                  // Find the scrollable container (main content area)
                  const scrollContainer = document.getElementById('main-content-scroll');
                  // Check if container exists and is actually scrollable (has overflow-y-auto or scroll)
                  const isContainerScrollable = scrollContainer && 
                    (getComputedStyle(scrollContainer).overflowY === 'auto' || 
                     getComputedStyle(scrollContainer).overflowY === 'scroll');
                  
                  if (isContainerScrollable) {
                    if (isQuizSection) {
                      // For quiz sections, just scroll to near the bottom
                      const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
                      const targetScroll = Math.max(0, maxScroll - 100); // Leave 100px buffer
                      scrollContainer.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                      });
                    } else {
                      // Normal scroll calculation for other headings
                      const element = document.getElementById(item.id);
                      if (element && scrollContainer.contains(element)) {
                        // Use getBoundingClientRect for reliable position calculation
                        const containerRect = scrollContainer.getBoundingClientRect();
                        const elementRect = element.getBoundingClientRect();
                        
                        // Calculate element's position relative to container's scrollable content
                        const elementTopInContent = (elementRect.top - containerRect.top) + scrollContainer.scrollTop;
                        
                        // Account for fixed header (64px) + some padding
                        const headerOffset = 80;
                        const targetScroll = Math.max(0, elementTopInContent - headerOffset);
                        
                        scrollContainer.scrollTo({
                          top: targetScroll,
                          behavior: 'smooth'
                        });
                      }
                    }
                  } else {
                    // Fallback to window scroll if container not found or not scrollable
                    const headerOffset = 80;
                    const element = document.getElementById(item.id);
                    if (element) {
                      if (isQuizSection) {
                        // For quiz sections, scroll to near bottom of page
                        window.scrollTo({
                          top: document.documentElement.scrollHeight - window.innerHeight - 100,
                          behavior: 'smooth'
                        });
                      } else {
                        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = Math.max(0, elementTop - headerOffset);
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }
                  }
                }}
                className={`block py-0.5 px-2 text-sm transition-colors whitespace-nowrap overflow-hidden !border-0 text-ellipsis rounded ${
                  activeId === item.id
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={isDark && hoveredId === item.id && activeId !== item.id ? { 
                  backgroundColor: '#1f2937', 
                  color: '#ffffff' 
                } : isDark && activeId === item.id ? {
                  backgroundColor: '#1e3a8a',
                  color: '#93c5fd'
                } : undefined}
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
