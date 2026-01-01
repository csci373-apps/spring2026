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