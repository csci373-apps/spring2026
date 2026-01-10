import ContentLayout from '@/components/ContentLayout';
import QuickLinksNav from '@/components/QuickLinksNav';
import ScheduleContent from '@/components/ScheduleContent';

export default function SchedulePage() {
  return (
    <ContentLayout variant="list" leftNav={<QuickLinksNav />}>
      <ScheduleContent />
    </ContentLayout>
  );
} 