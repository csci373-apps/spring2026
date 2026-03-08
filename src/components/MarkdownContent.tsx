'use client';

import { useRef, useEffect } from 'react';
import { triggerConfetti } from '@/lib/utils';
import hljs from 'highlight.js';

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

  // Add copy buttons to code blocks
  useEffect(() => {
    if (!contentRef.current) return;

    const codeBlocks = contentRef.current.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeElement) => {
      const codeEl = codeElement as HTMLElement;

      // Allow opting out of the copy button with data-no-copy="true"
      if (codeEl.getAttribute('data-no-copy') === 'true') return;

      const preElement = codeElement.parentElement as HTMLElement;
      
      // Skip if we've already added a copy button
      if (preElement.querySelector('.copy-code-button')) return;
      
      // Make pre element relative for absolute positioning of button
      preElement.style.position = 'relative';
      
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-code-button';
      // Using Heroicons ClipboardDocumentIcon outline (24x24) - standard copy icon
      copyButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <span class="copy-code-text">Copy</span>
      `;
      copyButton.setAttribute('aria-label', 'Copy code');
      copyButton.setAttribute('title', 'Copy code');
      
      // Copy functionality
      copyButton.addEventListener('click', async () => {
        const codeText = codeElement.textContent || '';
        
        try {
          await navigator.clipboard.writeText(codeText);
          
          // Update button to show success
          const textSpan = copyButton.querySelector('.copy-code-text');
          if (textSpan) {
            textSpan.textContent = 'Copied!';
            copyButton.classList.add('copied');
          }
          
          // Reset after 2 seconds
          setTimeout(() => {
            if (textSpan) {
              textSpan.textContent = 'Copy';
            }
            copyButton.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code:', err);
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = codeText;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            const textSpan = copyButton.querySelector('.copy-code-text');
            if (textSpan) {
              textSpan.textContent = 'Copied!';
              copyButton.classList.add('copied');
            }
            setTimeout(() => {
              if (textSpan) {
                textSpan.textContent = 'Copy';
              }
              copyButton.classList.remove('copied');
            }, 2000);
          } catch (fallbackErr) {
            console.error('Fallback copy failed:', fallbackErr);
          }
          document.body.removeChild(textArea);
        }
      });
      
      // Insert button into pre element
      preElement.appendChild(copyButton);
    });
  }, [content]);

  // Add toggle functionality for answer buttons
  useEffect(() => {
    if (!contentRef.current) return;

    const toggleButtons = contentRef.current.querySelectorAll<HTMLButtonElement>('[data-toggle-answer]');
    
    toggleButtons.forEach((button) => {
      // Skip if we've already added the event listener
      if (button.dataset.listenerAdded === 'true') return;
      
      const answerId = button.getAttribute('data-toggle-answer');
      if (!answerId) return;
      
      const answerDiv = contentRef.current?.querySelector(`#${answerId}`) as HTMLElement;
      if (!answerDiv) return;
      
      // Ensure overflow-hidden is always present for the animation
      answerDiv.classList.add('overflow-hidden');
      
      // Set initial hidden state - use a large max-height value via inline style for flexibility
      answerDiv.style.maxHeight = '0px';
      answerDiv.classList.add('opacity-0', 'py-0');
      answerDiv.classList.remove('opacity-100', 'py-4');
      
      button.addEventListener('click', () => {
        const isHidden = answerDiv.style.maxHeight === '0px';
        
        if (isHidden) {
          // Show: set large max-height, remove hidden classes, add visible classes
          answerDiv.style.maxHeight = '2000px';
          answerDiv.classList.remove('opacity-0', 'py-0');
          answerDiv.classList.add('opacity-100', 'py-4');
        } else {
          // Hide: set max-height to 0, remove visible classes, add hidden classes
          answerDiv.style.maxHeight = '0px';
          answerDiv.classList.remove('opacity-100', 'py-4');
          answerDiv.classList.add('opacity-0', 'py-0');
        }
      });
      
      // Mark as processed
      button.dataset.listenerAdded = 'true';
    });
    
    // Cleanup event listeners
    return () => {
      toggleButtons.forEach((button) => {
        button.dataset.listenerAdded = '';
      });
    };
  }, [content]);

  // Handle collapsible details sections with localStorage persistence
  useEffect(() => {
    if (!contentRef.current) return;

    const detailsElements = contentRef.current.querySelectorAll<HTMLDetailsElement>('details.mb-4');
    
    // Generate a unique key for each details element based on page URL and summary text
    const getStorageKey = (details: HTMLDetailsElement, index: number): string => {
      const summary = details.querySelector('summary');
      const summaryText = summary?.textContent?.trim() || '';
      // Use page pathname + summary text + index to create unique key
      const pagePath = typeof window !== 'undefined' ? window.location.pathname : '';
      const key = `collapsible-${pagePath}-${summaryText}-${index}`;
      // Sanitize key for localStorage (remove special characters)
      return key.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
    };

    // Load saved state from localStorage and apply
    detailsElements.forEach((details, index) => {
      const storageKey = getStorageKey(details, index);
      if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem(storageKey);
        if (savedState !== null) {
          const isOpen = JSON.parse(savedState);
          if (isOpen) {
            details.setAttribute('open', '');
          } else {
            details.removeAttribute('open');
          }
        }
      }
    });

    // Add event listeners to save state when toggled
    const handleToggle = (event: Event) => {
      const details = event.target as HTMLDetailsElement;
      if (!details.classList.contains('mb-4')) return;
      
      const index = Array.from(detailsElements).indexOf(details);
      const storageKey = getStorageKey(details, index);
      const isOpen = details.hasAttribute('open');
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(isOpen));
      }
    };

    detailsElements.forEach((details) => {
      details.addEventListener('toggle', handleToggle);
    });

    // Cleanup event listeners
    return () => {
      detailsElements.forEach((details) => {
        details.removeEventListener('toggle', handleToggle);
      });
    };
  }, [content]);

  // Highlight code blocks that weren't processed by remark-highlight.js
  // (e.g., code blocks inside HTML tables)
  useEffect(() => {
    if (!contentRef.current) return;

    // Find all code blocks with language classes
    const codeBlocks = contentRef.current.querySelectorAll<HTMLElement>(
      'code[class*="language-"]'
    );

    codeBlocks.forEach((codeBlock) => {
      // Check if this code block has already been highlighted
      // (remark-highlight.js adds spans with hljs classes)
      const hasHighlighting = codeBlock.querySelector('.hljs-keyword, .hljs-string, .hljs-function, .hljs-number, .hljs-variable');
      
      // Only highlight if it hasn't been processed yet
      if (!hasHighlighting) {
        // Extract language from class (e.g., "language-javascript" -> "javascript")
        const classList = Array.from(codeBlock.classList);
        const languageClass = classList.find((cls) => cls.startsWith('language-'));
        const language = languageClass ? languageClass.replace('language-', '') : 'javascript';

        try {
          // Get the raw code text - use data attribute if available to preserve whitespace
          let code = '';
          
          // Check if we have the original code stored in a data attribute
          const originalCodeAttr = codeBlock.getAttribute('data-original-code');
          if (originalCodeAttr) {
            // Decode from URI component to get original code with preserved whitespace
            try {
              code = decodeURIComponent(originalCodeAttr);
            } catch (e) {
              console.warn('Failed to decode original code from data attribute:', e);
              // Fallback to textContent if decoding fails
              code = codeBlock.textContent || '';
            }
          } else {
            // Fallback: try to preserve whitespace from current content
            const preElement = codeBlock.closest('pre');
            if (preElement) {
              // For pre elements, use innerText which better preserves formatting
              code = codeBlock.innerText || codeBlock.textContent || '';
            } else {
              code = codeBlock.textContent || '';
            }
          }
          
          // Highlight the code - highlight.js should preserve whitespace in the output
          let highlighted = hljs.highlight(code, {
            language: language,
            ignoreIllegals: true,
          });
          
          // For HTML code blocks, highlight.js escapes HTML entities which breaks display
          // We need to re-highlight with the original code to get proper structure
          if (language === 'html') {
            // Re-highlight with the original code (which has no entities)
            // This ensures highlight.js creates the proper span structure
            highlighted = hljs.highlight(code, {
              language: 'xml', // Use 'xml' instead of 'html' - it handles HTML better
              ignoreIllegals: true,
            });
          }
          
          // Replace the content with highlighted HTML
          codeBlock.innerHTML = highlighted.value;
          
          // Ensure hljs class is present for styling
          codeBlock.classList.add('hljs');
          
          // Ensure the parent pre element preserves whitespace
          const preElement = codeBlock.closest('pre');
          if (preElement) {
            preElement.style.whiteSpace = 'pre';
          }
        } catch (error) {
          console.error('Error highlighting code block:', error);
          // If highlighting fails, just ensure hljs class is present for styling
          codeBlock.classList.add('hljs');
        }
      }
    });
  }, [content]);



  return (
    <div 
      ref={contentRef}
      className={`prose prose-lg max-w-none ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
      suppressHydrationWarning
    />
  );
}
