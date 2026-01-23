import { getPostData } from '@/lib/markdown';
import { generateStaticParamsForContentType, validatePostForRender } from '@/lib/static-params';
import PageHeader from '@/components/PageHeader';
import MarkdownContent from '@/components/MarkdownContent';
import ContentLayout from '@/components/ContentLayout';
import QuickLinksNav from '@/components/QuickLinksNav';
import StyleGuideStyles from '@/components/StyleGuideStyles';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface AssignmentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Tell Next.js to only generate routes that are in generateStaticParams()
// We include ALL posts (including drafts) in generateStaticParams() so they can be pre-generated
export const dynamicParams = false;

// Generate static params for all activities
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return generateStaticParamsForContentType('activities');
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
  try {
    const { slug } = await params;
    const postData = await getPostData(slug, 'activities');
    
    // Validate post (handles placeholder slugs and excluded posts)
    // Note: Drafts are allowed to be rendered (accessible via direct URL)
    if (!validatePostForRender(slug, postData, 'activities')) {
      notFound();
    }
    
    const { heading_max_level } = postData;
    const isStyleGuideDemo = slug === 'style-guide-demo';
    
    return (
      <ContentLayout
        variant="detail-with-toc"
        leftNav={<QuickLinksNav />}
        showToc={postData.toc !== false}
        tocMaxLevel={heading_max_level || 2}
      >
        <div className="mb-4">
          <Link href="/activities" className="text-blue-600 dark:text-blue-400 hover:underline">
            Activities
          </Link>
          {' > '}
          <span className="text-gray-900 dark:text-gray-100">{postData.title}</span>
        </div>
        <PageHeader 
          title={postData.title} 
          excerpt={postData.excerpt}
          type={postData.type}
        />
        { postData.due_date && <p className="mt-2 text-lg font-bold">Due {formatDate(postData.due_date)} at 11:59pm</p> }
        {isStyleGuideDemo && <StyleGuideStyles />}
        <MarkdownContent content={postData.content} />
      </ContentLayout>
    );
  } catch {
    notFound();
  }
} 