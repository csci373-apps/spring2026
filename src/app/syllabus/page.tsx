import { getPostData } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import MarkdownContent from '@/components/MarkdownContent';
import TableOfContents from '@/components/TableOfContents';

export default async function SyllabusPage() {
  const postData = await getPostData('syllabus');
  const {title, excerpt} = postData;
  
  return (
    <div className="space-y-6 syllabus-page">
      <PageHeader title={title} excerpt={excerpt} />
      
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <MarkdownContent content={postData.content} />
        </div>
        
        {/* Table of Contents */}
        {postData.toc !== false && (
          <div className="hidden lg:block">
            <TableOfContents />
          </div>
        )}
      </div>
    </div>
  );
} 