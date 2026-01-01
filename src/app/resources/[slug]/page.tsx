import { getPostData, getAllPostIds } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import MarkdownContent from '@/components/MarkdownContent';
import TableOfContents from '@/components/TableOfContents';
import { notFound } from 'next/navigation';

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
    
    return (
      <div className="space-y-6">
        <PageHeader title={title} excerpt={excerpt} group={group} />
        
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <MarkdownContent content={postData.content} />
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
