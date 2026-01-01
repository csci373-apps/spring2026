import { getAllPostIds, getPostData, PostData } from '@/lib/markdown';
import { formatDate, getWeek } from '@/lib/utils';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import DaysLeft from '@/components/DaysLeft';
import externalAssignments from '@/data/external-assignments.json';

interface AssignmentData {
  id: string;
  num?: string;
  title: string;
  excerpt?: string;
  date?: string;
  due_date?: string;
  type?: string;
  assigned?: string;
  notes?: string;
  draft?: number;
  external_url?: string;
  external_type?: string;
  excluded?: boolean;
}


export default async function AssignmentsPage() {
  // Get all assignment files from content/assignments directory
  const assignmentIds = getAllPostIds('assignments');
  
  const markdownAssignments: AssignmentData[] = await Promise.all(assignmentIds.map(async ({ params }) => {
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
      notes: postData.notes,
      draft: postData.draft,
      excluded: postData.excluded,
    };
  }));

  // Combine markdown assignments with external assignments
  let assignments: AssignmentData[] = [...markdownAssignments, ...externalAssignments];
  assignments = assignments.filter(assignment => !assignment.excluded);

  // Sort assignments
  assignments.sort((a, b) => {
    // Primary sort: by date
    if (a.due_date && b.due_date) {
      const dateComparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      if (dateComparison !== 0) return dateComparison;
    }
    // If only one has a date, put the one without date at the end
    if (a.due_date && !b.due_date) return -1;
    if (!a.due_date && b.due_date) return 1;
    
    // Secondary sort: by assignment number
    const aNum = parseInt(a.num as string) || 100000;
    const bNum = parseInt(b.num as string) || 100000;
    return aNum - bNum;
  });

  const isDraft = (assignment: AssignmentData): boolean => {
    return (assignment.draft !== undefined && assignment.draft === 1);
  }

  function titleCase(str: string): string {
    // Map "assignment" to "Homework" for display
    if (str.toLowerCase() === 'assignment') {
      return 'Homework';
    }
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function getAssignmentLink(assignment: AssignmentData): React.ReactNode {
    if (isDraft(assignment)) {
      return <>{assignment.type ? titleCase(assignment.type) : ''} {assignment.num ? assignment.num : ''}</>;
    }
    
    // Handle external assignments
    if (assignment.external_url) {
      return (
        <>
        <a 
          href={assignment.external_url} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {assignment.type ? titleCase(assignment.type) : ''} {assignment.num ? assignment.num : ''}</a>
        <span className="ml-1 text-xs">↗</span>
        </>
      );
    }
    
    // Handle regular markdown assignments
    return (<>
      <Link href={`/assignments/${assignment.id}`}>
        {assignment.type ? titleCase(assignment.type) : ''} {assignment.num ? assignment.num : ''}
      </Link>
      {assignment.notes && (
        <span className="ml-1 text-xs">({assignment.notes})</span>
      )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Assignments" 
        excerpt="All lab, homework, and project assignments are due at 11:59pm ET on the due date. Assignments should be submitted to the course Moodle unless otherwise specified."
      />
      
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="md:w-[100px]">Week</th>
            <th>Assignment</th>
            <th className="md:w-[400px]">Title</th>
            <th className="md:w-[120px]">Due</th>
            <th className="md:w-[100px]">Days Left</th>
          </tr> 
        </thead>
        <tbody>
        {assignments.map((assignment, index) => {
          const currentWeek = assignment.due_date ? getWeek(assignment.due_date) : '';
          const previousWeek = index > 0 && assignments[index - 1].due_date ? getWeek(assignments[index - 1].due_date!) : '';
          const showWeek = currentWeek !== previousWeek;
          
          return (
            <tr key={assignment.id} className="p-6">
              <td className="w-[100px]"><strong>{showWeek ? currentWeek : ''}</strong></td>
              <td>
                {getAssignmentLink(assignment)}
              </td>
              <td>{assignment.title}</td>
              <td>{assignment.due_date ? formatDate(assignment.due_date) : ''}</td>
              <td><DaysLeft dueDate={assignment.due_date || ''} /></td>
              
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
} 