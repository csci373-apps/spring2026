import { getPostData, getAllPostIds } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import { notFound } from 'next/navigation';

interface ActivityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  try {
    const { slug } = await params;
    const postData = await getPostData(slug, 'activities');
    
    return (
      <div className="space-y-6 assignment-page">
        <PageHeader 
          title={postData.title} 
          excerpt={postData.excerpt}
          type="activity"
        />
        
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: postData.content }} />
        </div>
      </div>
    );
  } catch (error) {
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