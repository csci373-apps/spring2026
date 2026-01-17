import { getPostData, getQuizData } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import MarkdownContent from '@/components/MarkdownContent';
import ContentLayout from '@/components/ContentLayout';
import ResourceQuiz from '@/components/ResourceQuiz';
import QuickLinksNav from '@/components/QuickLinksNav';

export default async function SyllabusPage() {
  const postData = await getPostData('syllabus');
  const {title, excerpt, heading_max_level} = postData;
  const quizData = getQuizData('syllabus');
  
  return (
    <ContentLayout
      variant="detail-with-toc"
      leftNav={<QuickLinksNav />}
      showToc={postData.toc !== false}
      tocMaxLevel={heading_max_level || 2}
    >
      <PageHeader title={title} excerpt={excerpt} />
      <MarkdownContent content={postData.content} />
      
      {/* Quiz */}
      {quizData && (
        <ResourceQuiz key="quiz-syllabus" quizData={quizData} resourceSlug="syllabus" variant="desktop" />
      )}
    </ContentLayout>
  );
} 