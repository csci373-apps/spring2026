import { getAllPostIds, getPostData } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';

function formatDate(dateString: string): string {
  // Parse YYYY-MM-DD format as local date to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayAbbr = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const dayOfWeek = dayAbbr[date.getDay()];
  const monthStr = String(month).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  return `${dayOfWeek}, ${monthStr}/${dayStr}`;
}

function getWeekNumber(dateString: string): number {
  // Semester starts January 12, 2026 (Monday)
  const semesterStart = new Date(2026, 0, 12); // Month is 0-indexed
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  // Calculate difference in milliseconds
  const diffTime = date.getTime() - semesterStart.getTime();
  // Convert to days
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  // Calculate week number (week 1 starts on day 0)
  const weekNumber = Math.floor(diffDays / 7) + 1;
  return weekNumber;
}

export default async function QuestionsPage() {
  // Get all assignment files from content/assignments directory
  const ids = getAllPostIds('activities');
  const activities = await Promise.all(ids.map(async ({ params }) => {
    const postData = await getPostData(params.id, 'activities');
    return {
      id: params.id,
      title: postData.title,
      excerpt: postData.excerpt,
      date: postData.date,
      type: postData.type,
      excluded: postData.excluded,
      draft: postData.draft,
    };
  }));

  // Filter out excluded and draft activities
  const filteredActivities = activities.filter(activity => !activity.excluded && !(activity.draft === 1));

  // Sort activities by date
  filteredActivities.sort((a, b) => a.date.localeCompare(b.date));

  // Calculate week numbers and determine which ones to show, and add activity numbers
  const activitiesWithWeeks = filteredActivities.map((activity, index) => {
    const weekNumber = getWeekNumber(activity.date);
    const previousWeek = index > 0 ? getWeekNumber(filteredActivities[index - 1].date) : null;
    const showWeek = previousWeek === null || weekNumber !== previousWeek;
    const activityNumber = index + 1;
    
    return {
      ...activity,
      weekNumber,
      showWeek,
      activityNumber,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="In-Class Activities" 
        excerpt="In-class activities and discussion questions"
      />
      
      <table style={{ tableLayout: 'fixed', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ width: '100px' }}>Week</th>
            <th style={{ width: '100px' }}>Date</th>
            <th>Activity</th>
          </tr> 
        </thead>
        <tbody>
        {activitiesWithWeeks.map((activity) => (
          <tr key={activity.id} className="p-6">
            <td style={{ width: '100px' }}>{activity.showWeek ? `Week ${activity.weekNumber}` : ''}</td>
            <td style={{ width: '100px' }}>{formatDate(activity.date)}</td>
            <td>
              {activity.draft === 1 ? (
                <span>{activity.activityNumber}. {activity.title}</span>
              ) : (
                <Link 
                  href={`/activities/${activity.id}`}
                >
                  {activity.activityNumber}. {activity.title}
                </Link>
              )}
            </td>
            
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
} 