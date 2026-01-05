import { getPostData, getAllPostIds, getAllPosts, PostData } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import MarkdownContent from '@/components/MarkdownContent';
import TableOfContents from '@/components/TableOfContents';
import ResourcesNav from '@/components/ResourcesNav';
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
    const { title, excerpt, group, toc, heading_max_level } = postData;
    
    // Get all resources for navigation
    const resourcePosts = getAllPosts('resources');
    const resourcePages = resourcePosts
      .filter(post => post.draft !== 1 && post.id !== 'overview')
      .map(post => ({
        slug: post.id,
        title: post.title || post.id.charAt(0).toUpperCase() + post.id.slice(1).replace(/-/g, ' '),
        group: (post as PostData & { group?: string }).group || 'Other',
        group_order: (post as PostData & { group_order?: number }).group_order || 999,
        order: (post as PostData & { order?: number }).order || 999
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
      <div className="flex flex-col lg:flex-row gap-8 mx-auto">
        <ResourcesNav resourcePages={resourcePages} />
        <div className="max-w-4xl w-full">
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
                        className="flex items-center gap-3 px-4 py-3 !border bg-white !border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all group no-underline"
                      >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Previous</span>
                          <span className="font-medium text-gray-900 group-hover:text-blue-600">{previousResource.title}</span>
                        </div>
                      </Link>
                    ) : (
                      <div></div>
                    )}
                    
                    {nextResource ? (
                      <Link
                        href={`/resources/${nextResource.id}`}
                        className="flex items-center gap-3 px-4 py-3 bg-white !border !border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all group text-right ml-auto no-underline"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Next</span>
                          <span className="font-medium text-gray-900 group-hover:text-blue-600">{nextResource.title}</span>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                      </Link>
                    ) : null}
                  </div>
                )}
              </div>
              
              {/* Table of Contents */}
              {toc !== false && (
                <div className="hidden lg:block">
                  <TableOfContents maxLevel={heading_max_level || 2} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
