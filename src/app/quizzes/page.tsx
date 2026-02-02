import { getAllQuizMetadata, getQuizData, QuizMetadata, QuizData } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import ContentLayout from '@/components/ContentLayout';
import QuickLinksNav from '@/components/QuickLinksNav';
import QuizzesListClient from '@/components/QuizzesListClient';

function getWeekNumber(dateString: string): number {
  // Semester starts January 12, 2026 (Monday)
  const semesterStart = new Date(2026, 0, 12); // Month is 0-indexed
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  // Calculate difference in milliseconds
  const diffTime = date.getTime() - semesterStart.getTime();
  // Convert to days
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  // Calculate week number (week 1 starts on day 0)
  const weekNumber = Math.floor(diffDays / 7) + 1;
  return weekNumber;
}

function getDaysLeft(dateString: string): number | null {
  if (!dateString) return null;
  
  const [year, month, day] = dateString.split('-').map(Number);
  const quizDate = new Date(year, month - 1, day);
  const today = new Date();
  
  // Set both dates to midnight to avoid timezone issues
  today.setHours(0, 0, 0, 0);
  quizDate.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = quizDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export default async function QuizzesPage() {
  const allQuizzes = getAllQuizMetadata();
  
  // Filter out draft quizzes
  const publishedQuizzes = allQuizzes.filter(quiz => !quiz.draft || quiz.draft !== 1);
  
  // Load quiz data for all quizzes and calculate week/days left
  const quizzesWithData: Array<QuizMetadata & { quizData: QuizData | null; weekNumber?: number; daysLeft?: number | null }> = publishedQuizzes.map(quiz => {
    const weekNumber = quiz.start_date ? getWeekNumber(quiz.start_date) : undefined;
    const daysLeft = quiz.start_date ? getDaysLeft(quiz.start_date) : null;
    
    return {
      ...quiz,
      quizData: getQuizData(quiz.slug),
      weekNumber,
      daysLeft
    };
  });

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
