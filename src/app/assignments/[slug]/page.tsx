import { getPostData, getAllPostIds } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import { notFound } from 'next/navigation';

interface AssignmentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatDate(dateString: string): string {
  // Handle the YYYY-MM-DD format from markdown frontmatter
  const date = new Date(dateString + 'T00:00:00');
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${dayOfWeek}, ${month}/${day}`;
}

export default async function AssignmentPage({ params }: AssignmentPageProps) {
  const { slug } = await params;
  const postData = await getPostData(slug, 'assignments');
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title={postData.title} 
        excerpt={postData.excerpt}
        type={postData.type}
      />
      { postData.due_date && <p className="mt-2 text-lg font-bold">Due {formatDate(postData.due_date)} at 11:59pm</p> }
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: postData.content }} />
      </div>
    </div>
  );
}

// Generate static params for all assignments
export async function generateStaticParams() {
  const assignmentIds = getAllPostIds('assignments');
  
  return assignmentIds.map(({ params }) => ({
    slug: params.id,
  }));
} 