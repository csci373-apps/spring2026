import { getAllPostIds, getPostData } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import ContentLayout from '@/components/ContentLayout';
import QuickLinksNav from '@/components/QuickLinksNav';
import ContentTable from '@/components/assignments/ContentTable';
import externalAssignments from '../../../content/config/external-assignments.json';

interface ExamData {
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
  no_render?: number;
}


export default async function ExamsPage() {
  // Get all assignment files from content/assignments directory
  const examIds = getAllPostIds('exams');
  
  const markdownExams: ExamData[] = await Promise.all(examIds.map(async ({ params }) => {
    const postData = await getPostData(params.id, 'exams');
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
      no_render: postData.no_render,
    };
  }));

  // Combine markdown assignments with external assignments
  let exams: ExamData[] = [...markdownExams];
  // Filter out excluded exams and no_render exams (drafts are shown but not linkable)
  exams = exams.filter(exam => !exam.excluded && exam.no_render !== 1);

  // Sort exams
  exams.sort((a, b) => {
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
          title="Exams" 
          excerpt="Exams and practice assessments for the course."
        />
        
        <ContentTable items={exams} contentType="exams" />
      </div>
    </ContentLayout>
  );
} 