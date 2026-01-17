/**
 * Triggers a celebratory confetti animation
 * @param enabled - Whether to enable the confetti (default: true). Useful for conditional triggering.
 */
export function triggerConfetti(enabled: boolean = true): void {
  if (!enabled || typeof window === 'undefined') return;
  
  // Use dynamic import to avoid SSR issues
  import('canvas-confetti').then((confettiModule) => {
    const confetti = confettiModule.default;
    
    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Launch confetti from the left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      
      // Launch confetti from the right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  });
}

function formatDate(dateString: string): string {
    // Handle the YYYY-MM-DD format from markdown frontmatter
    const date = new Date(dateString + 'T00:00:00');
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 2);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${dayOfWeek}, ${month} ${day}`;
  }
  
  function getWeek(dateString: string): string {
    // Calculate weeks since January 12, 2026 (first day of semester)
    const startDate = new Date('2026-01-12T00:00:00');
    const currentDate = new Date(dateString + 'T00:00:00');
    const timeDiff = currentDate.getTime() - startDate.getTime();
    const weeksDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7)) + 1;
    return `Week ${weeksDiff}`;
  }

/**
 * Scroll offset for anchor links and TOC highlighting.
 * 
 * This value controls:
 * - How far from the top of the scroll container anchor links scroll to
 * - The rootMargin for the TOC IntersectionObserver (should match this value)
 * - The scroll-margin-top CSS property on h2 elements (should match this value)
 * 
 * To change the offset, update this constant and also update:
 * - src/app/globals.css: h2 { scroll-margin-top: <value>px; }
 * - src/components/TableOfContents.tsx: rootMargin: '-<value>px 0px -80% 0px'
 */
export const SCROLL_OFFSET_PX = 20;

/**
 * Scrolls to an anchor element within the main content scroll container
 * @param targetId - The ID of the target element to scroll to (without #)
 * @param options - Configuration options
 * @param options.offset - Offset from top in pixels (default: SCROLL_OFFSET_PX)
 * @param options.updateHash - Whether to update the URL hash (default: true)
 * @param options.behavior - Scroll behavior: 'smooth' or 'auto' (default: 'smooth')
 */
export function scrollToAnchor(
  targetId: string,
  options: {
    offset?: number;
    updateHash?: boolean;
    behavior?: ScrollBehavior;
  } = {}
): void {
  if (typeof window === 'undefined') return;
  
  const {
    offset = SCROLL_OFFSET_PX,
    updateHash = true,
    behavior = 'smooth'
  } = options;
  
  // Update URL hash if requested
  if (updateHash) {
    window.history.pushState(null, '', `#${targetId}`);
  }
  
  // Find the scrollable container (main content area)
  const scrollContainer = document.getElementById('main-content-scroll');
  if (!scrollContainer) return;
  
  // Find the target element (try within container first, then document-wide)
  const element = findElementById(targetId, scrollContainer);
  if (!element) return;
  
  // Check if container is scrollable
  const isContainerScrollable = isElementScrollable(scrollContainer);
  
  if (!isContainerScrollable) {
    // Fallback to window scroll if container not scrollable
    scrollWindowToElement(element, offset, behavior);
    return;
  }
  
  // Handle special case: quiz sections scroll to near bottom
  if (targetId.startsWith('quiz-')) {
    scrollContainerToBottom(scrollContainer, behavior);
    return;
  }
  
  // Calculate scroll position for normal elements
  const targetScrollPosition = calculateScrollPosition(element, scrollContainer, offset);
  scrollContainer.scrollTo({
    top: targetScrollPosition,
    behavior
  });
}

/**
 * Finds an element by ID, trying within a container first, then document-wide.
 * Handles IDs that start with numbers or contain special characters.
 */
function findElementById(targetId: string, container: HTMLElement): HTMLElement | null {
  // Try to find element within the container first
  // Use CSS.escape to handle IDs that start with numbers or contain special characters
  try {
    const escapedId = CSS.escape(targetId);
    const element = container.querySelector(`#${escapedId}`) as HTMLElement;
    if (element) return element;
  } catch (e) {
    // If CSS.escape fails or selector is invalid, fall back to getElementById
  }
  
  // Fallback to document-wide search
  return document.getElementById(targetId);
}

/**
 * Checks if an element is scrollable (has overflow-y: auto or scroll).
 */
function isElementScrollable(element: HTMLElement): boolean {
  const overflowY = getComputedStyle(element).overflowY;
  return overflowY === 'auto' || overflowY === 'scroll';
}

/**
 * Checks if an element is within a container's DOM tree.
 */
function isElementInContainer(element: HTMLElement, container: HTMLElement): boolean {
  let current: HTMLElement | null = element;
  while (current && current !== container) {
    current = current.parentElement;
    if (current === container) {
      return true;
    }
  }
  return false;
}

/**
 * Calculates the scroll position for an element within a scrollable container.
 */
function calculateScrollPosition(
  element: HTMLElement,
  container: HTMLElement,
  offset: number
): number {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  
  let elementTopInContent: number;
  
  if (isElementInContainer(element, container)) {
    // Element is in container - calculate relative to container viewport
    elementTopInContent = (elementRect.top - containerRect.top) + container.scrollTop;
  } else {
    // Element might be positioned absolutely or in a different context
    // Calculate based on document position
    const elementTop = element.offsetTop;
    const containerTop = container.offsetTop;
    elementTopInContent = elementTop - containerTop + container.scrollTop;
  }
  
  // Apply offset and ensure we don't scroll to negative position
  return Math.max(0, elementTopInContent - offset);
}

/**
 * Scrolls a container to near the bottom (used for quiz sections).
 */
function scrollContainerToBottom(container: HTMLElement, behavior: ScrollBehavior): void {
  const maxScroll = container.scrollHeight - container.clientHeight;
  const targetScroll = Math.max(0, maxScroll - 100); // Leave 100px buffer
  container.scrollTo({
    top: targetScroll,
    behavior
  });
}

/**
 * Fallback: scrolls the window to an element (used when container is not scrollable).
 */
function scrollWindowToElement(
  element: HTMLElement,
  offset: number,
  behavior: ScrollBehavior
): void {
  const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = Math.max(0, elementTop - offset);
  window.scrollTo({
    top: offsetPosition,
    behavior
  });
}

export { formatDate, getWeek };