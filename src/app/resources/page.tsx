import { getAllPosts, PostData } from '@/lib/markdown';
import PageHeader from '@/components/PageHeader';
import ContentLayout from '@/components/ContentLayout';
import QuickLinksNav from '@/components/QuickLinksNav';
import Link from 'next/link';

interface ResourceItem {
  id: string;
  title: string;
  order: number;
}

interface Chapter {
  name: string;
  group_order: number;
  items: ResourceItem[];
}

export default async function ResourcesPage() {
  const resourcePosts = getAllPosts('resources');
  
  // Filter out draft posts and overview
  const resources = resourcePosts
    .filter(post => post.draft !== 1 && post.id !== 'overview')
    .map(post => ({
      id: post.id,
      title: post.title || post.id.charAt(0).toUpperCase() + post.id.slice(1).replace(/-/g, ' '),
      group: (post as PostData & { group?: string }).group || 'Other',
      group_order: (post as PostData & { group_order?: number }).group_order || 999,
      order: (post as PostData & { order?: number }).order || 999
    }))
    .sort((a, b) => {
      if (a.group_order !== b.group_order) {
        return a.group_order - b.group_order;
      }
      return a.order - b.order;
    });

  // Group resources by chapter (group)
  const chaptersMap = new Map<string, Chapter>();
  
  resources.forEach(resource => {
    const chapterName = resource.group || 'Other';
    
    if (!chaptersMap.has(chapterName)) {
      chaptersMap.set(chapterName, {
        name: chapterName,
        group_order: resource.group_order,
        items: []
      });
    }
    
    chaptersMap.get(chapterName)!.items.push({
      id: resource.id,
      title: resource.title,
      order: resource.order
    });
  });

  // Convert to array and sort by group_order
  const chapters = Array.from(chaptersMap.values()).sort((a, b) => a.group_order - b.group_order);


  return (
    <ContentLayout variant="list" leftNav={<QuickLinksNav />}>
      <div className="space-y-6">
        <PageHeader 
          title="Course How To Guides" 
          excerpt="Technical guides and documentation for the course technologies"
        />
        
        {chapters.map((chapter) => (
        <div key={chapter.name} className="mb-8">
          {/* Chapter header */}
          <h2 className="text-2xl font-bold text-gray-900 m-0 mb-4">
            {chapter.name}
          </h2>
          
          {/* Resource links */}
          <ul className="list-none pl-0 space-y-3">
            {chapter.items.map((item) => (
              <li key={item.id} className="pl-0">
                <Link 
                  href={`/resources/${item.id}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 underline"
                >
                  <span className="flex-1">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      </div>
    </ContentLayout>
  );
}
