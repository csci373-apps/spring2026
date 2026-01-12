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
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

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

export { formatDate, getWeek };