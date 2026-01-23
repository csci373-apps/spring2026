import { getAllPostIds, getPostData } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import ContentLayout from '@/components/ContentLayout';
import QuickLinksNav from '@/components/QuickLinksNav';
import AssignmentsTable from '@/components/assignments/AssignmentsTable';
import externalAssignments from '../../../content/config/external-assignments.json';

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
  // Filter out excluded assignments (drafts are shown but not linkable)
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

  return (
    <ContentLayout variant="list" leftNav={<QuickLinksNav />}>
      <div className="space-y-6">
        <PageHeader 
          title="Assignments" 
          excerpt="All lab, homework, and project assignments are due at 11:59pm ET on the due date. Assignments should be submitted to the course Moodle unless otherwise specified."
        />
        
        <AssignmentsTable assignments={assignments} />
      </div>
    </ContentLayout>
  );
} 