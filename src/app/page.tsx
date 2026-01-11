import ContentLayout from '@/components/ContentLayout';
import QuickLinksNav from '@/components/QuickLinksNav';
import ScheduleContent from '@/components/ScheduleContent';
import { getTopics } from '@/lib/topics';

export default async function SchedulePage() {
  const topics = await getTopics();
  
  return (
    <ContentLayout variant="list" leftNav={<QuickLinksNav />}>
      <ScheduleContent topics={topics} />
    </ContentLayout>
  );
} 