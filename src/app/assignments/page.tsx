import { getAllPostIds, getPostData, PostData } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import DaysLeft from '@/components/DaysLeft';

interface AssignmentData {
  id: string;
  num?: string;
  title: string;
  excerpt?: string;
  date?: string;
  due_date?: string;
  type?: string;
  assigned?: string;
  draft?: number;
}

function formatDate(dateString: string): string {
  // Handle the YYYY-MM-DD format from markdown frontmatter
  const date = new Date(dateString + 'T00:00:00');
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${dayOfWeek}, ${month}/${day}`;
}


export default async function AssignmentsPage() {
  // Get all assignment files from content/assignments directory
  const assignmentIds = getAllPostIds('assignments');
  
  const assignments: AssignmentData[] = await Promise.all(assignmentIds.map(async ({ params }) => {
    const postData = await getPostData(params.id, 'assignments');
    return {
      id: params.id,
      num: postData.num,
      title: postData.title,
      excerpt: postData.excerpt,
      date: postData.date,
      due_date: postData.due_date,
      type: postData.type,
      assigned: postData.assigned,
      draft: postData.draft,
    };
  }));
  
  // Sort assignments
  assignments.sort((a, b) => {
    // If both have dates, sort by date
    if (a.due_date && b.due_date) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    // If only one has a date, put the one without date at the end
    if (a.due_date && !b.due_date) return -1;
    if (!a.due_date && b.due_date) return 1;
    // If neither has a date, sort by assignment number
    const aNum = parseInt(a.num as string) || 0;
    const bNum = parseInt(b.num as string) || 0;
    return aNum - bNum;
  });

  const isDraft = (assignment: AssignmentData): boolean => {
    return (assignment.draft !== undefined && assignment.draft === 1);
  }

  function titleCase(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function getAssignmentLink(assignment: AssignmentData): React.ReactNode {
    if (isDraft(assignment)) {
      return <>{assignment.type ? titleCase(assignment.type) : ''} {assignment.num ? assignment.num : ''}</>;
    }
    return (
      <Link  href={`/assignments/${assignment.id}`}
        >
          {assignment.type ? titleCase(assignment.type) : ''} {assignment.num ? assignment.num : ''}
        </Link>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Assignments" 
        excerpt="All lab, homework, and project assignments are due at 11:59pm ET on the due date. Assignments should be submitted to the course Moodle unless otherwise specified."
      />
      
      <table>
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Title</th>
            <th>Due</th>
            <th>Days Left</th>
          </tr> 
        </thead>
        <tbody>
        {assignments.map((assignment) => (
          <tr key={assignment.id} className="p-6">
            <td>
              {getAssignmentLink(assignment)}
            </td>
            <td>{assignment.title}</td>
            <td>{assignment.due_date ? formatDate(assignment.due_date) : ''}</td>
            <td><DaysLeft dueDate={assignment.due_date || ''} /></td>
            
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
} 