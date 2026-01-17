'use client';

import { useRef, useEffect } from 'react';
import { triggerConfetti } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className }: MarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const previousAllCheckedRef = useRef(false);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!contentRef.current) return;

    // Find all markdown checkboxes
    const checkboxes = contentRef.current.querySelectorAll<HTMLInputElement>('.markdown-checkbox');
    
    // Helper function to update strikethrough styling based on checkbox state
    const updateCheckboxStyling = (checkbox: HTMLInputElement) => {
      const checkboxLine = checkbox.closest('.markdown-checkbox-line');
      const contentSpan = checkboxLine?.querySelector('.markdown-checkbox-content') as HTMLElement;
      if (contentSpan) {
        if (checkbox.checked) {
          contentSpan.style.textDecoration = 'line-through';
          contentSpan.style.opacity = '0.6';
        } else {
          contentSpan.style.textDecoration = 'none';
          contentSpan.style.opacity = '1';
        }
      }
    };

    // Load saved state from localStorage and apply styling
    checkboxes.forEach((checkbox) => {
      const checkboxId = checkbox.getAttribute('data-checkbox-id');
      if (checkboxId) {
        const savedState = localStorage.getItem(checkboxId);
        if (savedState === 'true') {
          checkbox.checked = true;
        }
      }
      // Apply initial styling based on checked state
      updateCheckboxStyling(checkbox);
    });

    // Helper function to check if all checkboxes are checked
    const areAllCheckboxesChecked = (): boolean => {
      if (checkboxes.length === 0) return false;
      return Array.from(checkboxes).every((checkbox) => checkbox.checked);
    };

    // Helper function to check and trigger confetti if all are checked
    const checkAndTriggerConfetti = () => {
      const allChecked = areAllCheckboxesChecked();
      
      // Skip on initial load - just set the initial state
      if (isInitialLoad.current) {
        previousAllCheckedRef.current = allChecked;
        isInitialLoad.current = false;
        return;
      }
      
      // Trigger confetti when transitioning from "not all checked" to "all checked"
      if (allChecked && !previousAllCheckedRef.current) {
        triggerConfetti();
      }
      
      previousAllCheckedRef.current = allChecked;
    };

    // Check initial state (but don't trigger confetti on load)
    checkAndTriggerConfetti();

    // Add event listeners to save state when checkboxes are clicked
    const handleCheckboxChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const checkboxId = target.getAttribute('data-checkbox-id');
      if (checkboxId) {
        localStorage.setItem(checkboxId, target.checked ? 'true' : 'false');
      }
      // Update styling when checkbox state changes
      updateCheckboxStyling(target);
      // Check if all are checked and trigger confetti if needed
      checkAndTriggerConfetti();
    };

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', handleCheckboxChange);
    });

    // Cleanup event listeners
    return () => {
      checkboxes.forEach((checkbox) => {
        checkbox.removeEventListener('change', handleCheckboxChange);
      });
    };
  }, [content]);

//   useEffect(() => {
//     if (!contentRef.current) return;

//     // Find all ImageGrid placeholders and replace them with the actual component
//     const imageGridPlaceholders = contentRef.current.querySelectorAll('[data-imagegrid-placeholder="true"]');
    
//     imageGridPlaceholders.forEach((placeholder) => {
//       // Get the image set and alt text from data attributes
//       const imageSet = placeholder.getAttribute('data-imagegrid-set') || 'vis01';
//       const customAlt = placeholder.getAttribute('data-imagegrid-alt');
      
//       // Get the appropriate image array
//       const images = IMAGE_SETS[imageSet as keyof typeof IMAGE_SETS] || IMAGE_PATHS;
      
//       // Determine alt text
//       const altText = customAlt || `Student work from ${imageSet}`;
      
//       // Create a container for the ImageGrid component
//       const container = document.createElement('div');
//       container.className = 'mt-8';
      
//       // Create a div where we'll mount the React component
//       const reactContainer = document.createElement('div');
//       container.appendChild(reactContainer);
      
//       // Replace the placeholder with our container
//       placeholder.parentNode?.replaceChild(container, placeholder);
      
//       // Mount the ImageGrid component
//       const root = createRoot(reactContainer);
//       root.render(
//         <ImageGrid 
//           images={images} 
//           alt={altText}
//         />
//       );
//     });

//     // Find all LinkPreviewDemo placeholders and replace them with the actual component
//     const linkPreviewPlaceholders = contentRef.current.querySelectorAll('[data-linkpreview-placeholder="true"]');
    
//     linkPreviewPlaceholders.forEach((placeholder) => {
//       // Create a container for the LinkPreviewDemo component
//       const container = document.createElement('div');
//       container.className = 'my-8';
      
//       // Create a div where we'll mount the React component
//       const reactContainer = document.createElement('div');
//       container.appendChild(reactContainer);
      
//       // Replace the placeholder with our container
//       placeholder.parentNode?.replaceChild(container, placeholder);
      
//     });

//     // Find all expandable blockquotes and replace them with the ExpandableSection component
//     const expandableBlockquotes = contentRef.current.querySelectorAll('blockquote[data-expandable="true"]');
    
//     expandableBlockquotes.forEach((blockquote, index) => {
//       // Get the inner HTML content of the blockquote
//       const blockquoteContent = blockquote.innerHTML;
      
//       // Extract title from the first h2 if it exists, otherwise use default
//       const tempDiv = document.createElement('div');
//       tempDiv.innerHTML = blockquoteContent;
//       const firstH2 = tempDiv.querySelector('h2');
//       const title = firstH2 ? firstH2.textContent || 'Show Details' : 'Show Details';
      
//       // Remove the h2 from content if it exists (since it's now the button title)
//       if (firstH2) {
//         firstH2.remove();
//       }
//       const contentWithoutTitle = tempDiv.innerHTML;
      
//       // Create a storage key for this blockquote
//       const storageKey = `expandable-blockquote-${index}`;
      
//       // Create a container for the ExpandableSection component
//       const container = document.createElement('div');
      
//       // Create a div where we'll mount the React component
//       const reactContainer = document.createElement('div');
//       container.appendChild(reactContainer);
      
//       // Replace the blockquote with our container
//       blockquote.parentNode?.replaceChild(container, blockquote);
      
//       // Mount the ExpandableSection component
//       const root = createRoot(reactContainer);
//       root.render(
//         <ExpandableSection 
//           title={title}
//           defaultExpanded={false}
//           storageKey={storageKey}
//         >
//           <div dangerouslySetInnerHTML={{ __html: contentWithoutTitle }} />
//         </ExpandableSection>
//       );
//     });
//   }, [content]);

  return (
    <div 
      ref={contentRef}
      className={`prose prose-lg max-w-none ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
      suppressHydrationWarning
    />
  );
}
