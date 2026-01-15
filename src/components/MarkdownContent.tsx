'use client';

import { useRef, useEffect } from 'react';
import { triggerConfetti } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  storageKey?: string; // Optional: prefix for localStorage keys (e.g., page slug)
}

export default function MarkdownContent({ content, storageKey = 'markdown' }: MarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Find all checkboxes in the rendered markdown
    const checkboxes = contentRef.current.querySelectorAll('input[type="checkbox"]');
    const checkboxArray = Array.from(checkboxes) as HTMLInputElement[];
    
    // Function to check if all checkboxes are checked
    const checkAllChecked = () => {
      if (checkboxArray.length === 0) return false;
      return checkboxArray.every(cb => cb.checked);
    };
    
    // Function to trigger confetti if all are checked (with debounce to avoid multiple triggers)
    let confettiTimeout: NodeJS.Timeout | null = null;
    const maybeTriggerConfetti = () => {
      if (confettiTimeout) {
        clearTimeout(confettiTimeout);
      }
      confettiTimeout = setTimeout(() => {
        if (checkAllChecked()) {
          triggerConfetti();
        }
      }, 100); // Small delay to ensure state is updated
    };
    
    checkboxes.forEach((checkbox, index) => {
      // Create a unique key for this checkbox
      // Use the text content of the parent list item as part of the key
      const listItem = checkbox.closest('li');
      if (!listItem) return;
      
      const checkboxText = listItem.textContent?.trim() || '';
      const uniqueKey = `${storageKey}-checkbox-${index}-${checkboxText.substring(0, 50)}`;
      
      // Wrap all non-checkbox content in a container div if not already wrapped
      if (!listItem.querySelector('.checkbox-content-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'checkbox-content-wrapper';
        
        // Move all siblings after the checkbox into the wrapper
        let nextSibling = checkbox.nextSibling;
        while (nextSibling) {
          const currentSibling = nextSibling;
          nextSibling = nextSibling.nextSibling;
          wrapper.appendChild(currentSibling);
        }
        
        // If there are no siblings, create an empty text node to maintain structure
        if (wrapper.childNodes.length === 0) {
          wrapper.appendChild(document.createTextNode(''));
        }
        
        // Insert the wrapper after the checkbox
        checkbox.parentNode?.insertBefore(wrapper, checkbox.nextSibling);
      }
      
      // Restore saved state from localStorage
      const savedState = localStorage.getItem(uniqueKey);
      if (savedState === 'true') {
        (checkbox as HTMLInputElement).checked = true;
        // Apply strikethrough class immediately if checked
        listItem.classList.add('checkbox-checked');
      }
      
      // Enable the checkbox (GFM renders them as disabled)
      (checkbox as HTMLInputElement).disabled = false;
      
      // Update strikethrough class when checkbox state changes
      const updateStrikethrough = () => {
        if ((checkbox as HTMLInputElement).checked) {
          listItem.classList.add('checkbox-checked');
        } else {
          listItem.classList.remove('checkbox-checked');
        }
      };
      
      // Add change handler to save state, update strikethrough, and check for confetti
      const handleChange = (e: Event) => {
        const isChecked = (e.target as HTMLInputElement).checked;
        localStorage.setItem(uniqueKey, String(isChecked));
        updateStrikethrough();
        maybeTriggerConfetti();
      };
      
      checkbox.addEventListener('change', handleChange);
      
      // Store handler for cleanup
      (checkbox as HTMLInputElement & { _changeHandler?: (e: Event) => void })._changeHandler = handleChange;
    });
    
    // Cleanup: remove event listeners and clear timeout
    return () => {
      if (confettiTimeout) {
        clearTimeout(confettiTimeout);
      }
      checkboxArray.forEach((checkbox) => {
        const handler = (checkbox as HTMLInputElement & { _changeHandler?: (e: Event) => void })._changeHandler;
        if (handler) {
          checkbox.removeEventListener('change', handler);
        }
      });
    };
  }, [content, storageKey]);

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
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
      suppressHydrationWarning
    />
  );
}
