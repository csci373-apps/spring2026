import { getAllQuizMetadata, getQuizData, QuizMetadata, QuizData } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import ContentLayout from '@/components/ContentLayout';
import QuickLinksNav from '@/components/QuickLinksNav';
import QuizzesListClient from '@/components/QuizzesListClient';

export default async function QuizzesPage() {
  const allQuizzes = getAllQuizMetadata();
  
  // Filter out draft quizzes
  const publishedQuizzes = allQuizzes.filter(quiz => !quiz.draft || quiz.draft !== 1);
  
  // Load quiz data for all quizzes
  const quizzesWithData: Array<QuizMetadata & { quizData: QuizData | null }> = publishedQuizzes.map(quiz => ({
    ...quiz,
    quizData: getQuizData(quiz.slug)
  }));

  // Sort quizzes by start_date if available, otherwise by name
  quizzesWithData.sort((a, b) => {
    if (a.start_date && b.start_date) {
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    }
    if (a.start_date) return -1;
    if (b.start_date) return 1;
    return a.quizName.localeCompare(b.quizName);
  });

  return (
    <ContentLayout variant="list" leftNav={<QuickLinksNav />}>
      <div className="space-y-6">
        <PageHeader 
          title="Quizzes" 
          excerpt="Practice quizzes to test your understanding of course material"
        />
        
        <QuizzesListClient quizzes={quizzesWithData} />
      </div>
    </ContentLayout>
  );
}
