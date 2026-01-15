import { getPostData, getAllPostIds } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import MarkdownContent from '@/components/MarkdownContent';
import ContentLayout from '@/components/ContentLayout';
import QuickLinksNav from '@/components/QuickLinksNav';
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
      <ContentLayout
        variant="detail-with-toc"
        leftNav={<QuickLinksNav />}
        showToc={postData.toc !== false}
        tocMaxLevel={heading_max_level || 2}
      >
        <div className="space-y-6 assignment-page activity-content">
          <PageHeader 
            title={postData.title} 
            excerpt={postData.excerpt}
            type="activity"
          />
          
          <Suspense fallback={<MarkdownContent content={postData.content} storageKey={`activity-${slug}`} />}>
            <InstructorNotesToggle>
              <MarkdownContent content={postData.content} storageKey={`activity-${slug}`} />
            </InstructorNotesToggle>
          </Suspense>
        </div>
      </ContentLayout>
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