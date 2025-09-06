import { getAllPostIds, getPostData } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';

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
    };
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="In-Class Activities" 
        excerpt="In-class activities and discussion questions"
      />
      
      <table>
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Type</th>
            <th>Due Date</th>
          </tr> 
        </thead>
        <tbody>
        {activities.map((activity) => (
          <tr key={activity.id} className="p-6">
            <td>
              <Link 
                href={`/activities/${activity.id}`}
              >
                {activity.title}
              </Link>
            </td>
            <td>{activity.type}</td>
            <td>Due: {activity.date}</td>
            
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
} 