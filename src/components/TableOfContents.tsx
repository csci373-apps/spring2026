'use client';

import { useEffect, useState } from 'react';

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

    // Set up intersection observer for active section highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px', // Account for fixed header
        threshold: 0.1
      }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [maxLevel]);

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-20 w-64 flex-shrink-0">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
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
                  const element = document.getElementById(item.id);
                  if (element) {
                    const headerOffset = 80; // Account for fixed header (64px) + some padding
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`block py-0.5 px-2 text-sm transition-colors whitespace-nowrap overflow-hidden !border-0 text-ellipsis ${
                  activeId === item.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
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
