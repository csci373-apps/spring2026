'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface InstructorNotesToggleProps {
  children: React.ReactNode;
}

export default function InstructorNotesToggle({ children }: InstructorNotesToggleProps) {
  const searchParams = useSearchParams();
  const showInstructorNotes = searchParams.get('instructor') === 'true';
  const contentRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!contentRef.current || !isClient) return;

    // Find all instructor notes sections (marked with data-instructor-notes attribute)
    const instructorSections = contentRef.current.querySelectorAll('[data-instructor-notes="true"]');
    
    instructorSections.forEach((section) => {
      const element = section as HTMLElement;
      if (showInstructorNotes) {
        element.style.display = '';
        element.classList.remove('hidden');
        // Add yellow background styling
        element.style.backgroundColor = '#fefce8'; // light yellow (tailwind yellow-50)
        element.style.padding = '1.5rem';
        element.style.marginTop = '2rem';
        element.style.marginBottom = '2rem';
        element.style.borderRadius = '0.5rem';
        // element.style.borderLeft = '4px solid #eab308'; // yellow-500 border
        
        // Style the h2 heading within the section
        const heading = element.querySelector('h2');
        if (heading) {
          (heading as HTMLElement).style.color = '#854d0e'; // yellow-800
          (heading as HTMLElement).style.marginTop = '0';
        }
      } else {
        element.style.display = 'none';
        element.classList.add('hidden');
      }
    });
  }, [showInstructorNotes, isClient]);

  return (
    <div ref={contentRef}>
      {children}
    </div>
  );
}

