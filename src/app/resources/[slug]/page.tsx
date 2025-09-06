import { getPostData, getAllPostIds } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
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
    const { title, excerpt, group } = postData;
    
    return (
      <div className="space-y-6">
        <PageHeader title={title} excerpt={excerpt} group={group} />
        
        <div 
          className="prose prose-lg max-w-none prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-table:border-collapse prose-table:border prose-table:border-gray-300 prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-3 prose-td:border prose-td:border-gray-300 prose-td:p-3"
          dangerouslySetInnerHTML={{ __html: postData.content }}
        />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
