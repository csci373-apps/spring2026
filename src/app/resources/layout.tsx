import ResourcesNav from '@/components/ResourcesNav';
import { getAllPosts, PostData } from '@/lib/markdown';

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resourcePosts = getAllPosts('resources');
  
  // Create navigation items from the actual markdown files and sort by group_order then order
  const resourcePages = resourcePosts
    .filter(post => post.draft !== 1) // Exclude overview.md from navigation
    .map(post => ({
      slug: post.id,
      title: post.title || post.id.charAt(0).toUpperCase() + post.id.slice(1).replace(/-/g, ' '),
      group: (post as PostData & { group?: string }).group || 'Other',
      group_order: (post as PostData & { group_order?: number }).group_order || 999,
      order: (post as PostData & { order?: number }).order || 999
    }))
    .sort((a, b) => {
      // First sort by group_order
      if (a.group_order !== b.group_order) {
        return a.group_order - b.group_order;
      }
      // Then sort by order within the same group
      return a.order - b.order;
    });

  return (
    <div className="flex flex-col lg:flex-row gap-8 mx-auto">
      <ResourcesNav resourcePages={resourcePages} />
      <div className="max-w-4xl w-full">
        {children}
      </div>
    </div>
  );
}
