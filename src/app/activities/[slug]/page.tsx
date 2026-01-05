import { getPostData, getAllPostIds } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import MarkdownContent from '@/components/MarkdownContent';
import TableOfContents from '@/components/TableOfContents';
import InstructorNotesToggle from '@/components/InstructorNotesToggle';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface ActivityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  try {
    const { slug } = await params;
    const postData = await getPostData(slug, 'activities');
    const { heading_max_level } = postData;
    
    return (
      <div className="space-y-6 assignment-page activity-content">
        <PageHeader 
          title={postData.title} 
          excerpt={postData.excerpt}
          type="activity"
        />
        
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<MarkdownContent content={postData.content} />}>
              <InstructorNotesToggle>
                <MarkdownContent content={postData.content} />
              </InstructorNotesToggle>
            </Suspense>
          </div>
          
          {/* Table of Contents */}
          {postData.toc !== false && (
            <div className="hidden lg:block">
              <TableOfContents maxLevel={heading_max_level || 2} />
            </div>
          )}
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}

// Generate static params for all activities
export async function generateStaticParams() {
  const activityIds = getAllPostIds('activities');
  
  return activityIds.map(({ params }) => ({
    slug: params.id,
  }));
} 