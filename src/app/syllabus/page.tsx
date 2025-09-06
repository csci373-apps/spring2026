import { getPostData } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';

export default async function SyllabusPage() {
  const postData = await getPostData('syllabus');
  const {title, excerpt} = postData;
  
  return (
    <div className="space-y-6 syllabus-page">
      <PageHeader title={title} excerpt={excerpt} />
      
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: postData.content }}
      />
    </div>
  );
} 