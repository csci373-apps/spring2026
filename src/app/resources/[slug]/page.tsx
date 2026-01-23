import { getPostData, getAllPosts, PostData, getQuizData } from '@/lib/markdown';
import { generateStaticParamsForContentType, validatePostForRender } from '@/lib/static-params';
import PageHeader from '@/components/PageHeader';
import MarkdownContent from '@/components/MarkdownContent';
import ResourcesNav from '@/components/ResourcesNav';
import ResourceQuiz from '@/components/ResourceQuiz';
import ContentLayout from '@/components/ContentLayout';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Tell Next.js to only generate routes that are in generateStaticParams()
// We include ALL posts (including drafts) in generateStaticParams() so they can be pre-generated
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return generateStaticParamsForContentType('resources');
}

export default async function ResourcePage({ params }: PageProps) {
  const { slug } = await params;
  
  try {
    const postData = await getPostData(slug, 'resources');
    
    // Validate post (handles placeholder slugs and excluded posts)
    // Note: Drafts are allowed to be rendered (accessible via direct URL)
    if (!validatePostForRender(slug, postData, 'resources')) {
      notFound();
    }
    
    const { title, excerpt, group, toc, heading_max_level } = postData;
    const quizData = getQuizData(slug);
    
    // Get all resources for navigation
    const resourcePosts = getAllPosts('resources');
    const resourcePages = resourcePosts
      .filter(post => post.draft !== 1 && !post.excluded && post.id !== 'overview')
      .map(post => ({
        slug: post.id,
        title: post.title || post.id.charAt(0).toUpperCase() + post.id.slice(1).replace(/-/g, ' '),
        group: (post as PostData & { group?: string }).group || 'Other',
        group_order: (post as PostData & { group_order?: number }).group_order ?? 999,
        order: (post as PostData & { order?: number }).order ?? 999
      }))
      .sort((a, b) => {
        if (a.group_order !== b.group_order) {
          return a.group_order - b.group_order;
        }
        return a.order - b.order;
      });
    
    // Get all resources sorted by group_order and order for next/prev navigation
    const sortedResources = resourcePages.map(page => ({
      id: page.slug,
      title: page.title,
      group_order: page.group_order,
      order: page.order
    }));
    
    // Find current resource index
    const currentIndex = sortedResources.findIndex(resource => resource.id === slug);
    const previousResource = currentIndex > 0 ? sortedResources[currentIndex - 1] : null;
    const nextResource = currentIndex < sortedResources.length - 1 ? sortedResources[currentIndex + 1] : null;
    
    return (
      <ContentLayout
        variant="resources-detail"
        leftNav={<ResourcesNav resourcePages={resourcePages} />}
        showToc={toc !== false}
        tocMaxLevel={heading_max_level || 2}
      >
        <PageHeader title={title} excerpt={excerpt} group={group} />
        
        <div>
          <MarkdownContent content={postData.content} />
          
          {/* Quiz */}
          {quizData && (
            <ResourceQuiz key={`quiz-${slug}`} quizData={quizData} resourceSlug={slug} variant="desktop" />
          )}
          
          {/* Next/Previous Navigation */}
          {(previousResource || nextResource) && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between gap-4">
              {previousResource ? (
                <Link
                  href={`/resources/${previousResource.id}`}
                  className="flex items-center gap-3 px-4 py-3 !border bg-white dark:bg-gray-900 !border-gray-300 dark:!border-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-600 transition-all group no-underline w-full sm:w-auto"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-gray-500 dark:text-gray-300 uppercase tracking-wide">Previous</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">{previousResource.title}</span>
                  </div>
                </Link>
              ) : (
                <div className="hidden sm:block"></div>
              )}
              
              {nextResource ? (
                <Link
                  href={`/resources/${nextResource.id}`}
                  className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 !border !border-gray-300 dark:!border-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-600 transition-all group sm:text-right sm:ml-auto no-underline w-full sm:w-auto"
                >
                  <div className="flex flex-col min-w-0 flex-1 sm:flex-none">
                    <span className="text-xs text-gray-500 dark:text-gray-300 uppercase tracking-wide">Next</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">{nextResource.title}</span>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0 ml-auto sm:ml-0" />
                </Link>
              ) : null}
            </div>
          )}
          
        </div>
      </ContentLayout>
    );
  } catch {
    notFound();
  }
}
