import { getPostData, getAllPostIds, getAllPosts, PostData } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import MarkdownContent from '@/components/MarkdownContent';
import TableOfContents from '@/components/TableOfContents';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPostIds('resources');
  return posts.map((post) => ({
    slug: post.params.id,
  }));
}

export default async function ResourcePage({ params }: PageProps) {
  const { slug } = await params;
  
  try {
    const postData = await getPostData(slug, 'resources');
    const { title, excerpt, group, toc } = postData;
    
    // Get all resources sorted by group_order and order
    const resourcePosts = getAllPosts('resources');
    const sortedResources = resourcePosts
      .filter(post => post.draft !== 1 && post.id !== 'overview')
      .map(post => ({
        id: post.id,
        title: post.title || post.id.charAt(0).toUpperCase() + post.id.slice(1).replace(/-/g, ' '),
        group_order: (post as PostData & { group_order?: number }).group_order || 999,
        order: (post as PostData & { order?: number }).order || 999
      }))
      .sort((a, b) => {
        if (a.group_order !== b.group_order) {
          return a.group_order - b.group_order;
        }
        return a.order - b.order;
      });
    
    // Find current resource index
    const currentIndex = sortedResources.findIndex(resource => resource.id === slug);
    const previousResource = currentIndex > 0 ? sortedResources[currentIndex - 1] : null;
    const nextResource = currentIndex < sortedResources.length - 1 ? sortedResources[currentIndex + 1] : null;
    
    return (
      <div className="space-y-6">
        <PageHeader title={title} excerpt={excerpt} group={group} />
        
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <MarkdownContent content={postData.content} />
            
            {/* Next/Previous Navigation */}
            {(previousResource || nextResource) && (
              <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between gap-4">
                {previousResource ? (
                  <Link
                    href={`/resources/${previousResource.id}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Previous</span>
                      <span className="font-medium group-hover:underline">{previousResource.title}</span>
                    </div>
                  </Link>
                ) : (
                  <div></div>
                )}
                
                {nextResource ? (
                  <Link
                    href={`/resources/${nextResource.id}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group text-right ml-auto"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Next</span>
                      <span className="font-medium group-hover:underline">{nextResource.title}</span>
                    </div>
                    <ChevronRightIcon className="w-5 h-5" />
                  </Link>
                ) : null}
              </div>
            )}
          </div>
          
          {/* Table of Contents */}
          {toc !== false && (
            <div className="hidden lg:block">
              <TableOfContents />
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
