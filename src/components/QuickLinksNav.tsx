import { getAllPosts, getAllPostIds, getPostData } from '@/lib/markdown';
import QuickLinksNavClient from './QuickLinksNavClient';
import externalAssignments from '@/data/external-assignments.json';

interface ResourceData {
  id: string;
  title: string;
  group?: string;
}

interface AssignmentData {
  id: string;
  num?: string;
  title: string;
  due_date?: string;
  type?: string;
  draft?: number;
  excluded?: boolean;
  external_url?: string;
}

export default async function QuickLinksNav() {
  // Get all resource files from content/resources directory
  const allResources = getAllPosts('resources');
  
  // Filter resources that have quicklink: 1
  const quickLinkResources: ResourceData[] = allResources
    .filter(resource => resource.quicklink === 1)
    .map(resource => ({
      id: resource.id,
      title: resource.title,
      group: resource.group,
    }));

  // Sort by group_order and order if available, otherwise by title
  quickLinkResources.sort((a, b) => {
    const resourceA = allResources.find(r => r.id === a.id);
    const resourceB = allResources.find(r => r.id === b.id);
    
    if (resourceA?.group_order !== undefined && resourceB?.group_order !== undefined) {
      if (resourceA.group_order !== resourceB.group_order) {
        return resourceA.group_order - resourceB.group_order;
      }
    }
    
    if (resourceA?.order !== undefined && resourceB?.order !== undefined) {
      if (resourceA.order !== resourceB.order) {
        return resourceA.order - resourceB.order;
      }
    }
    
    return a.title.localeCompare(b.title);
  });

  // Get all assignment files from content/assignments directory
  const assignmentIds = getAllPostIds('assignments');
  
  const markdownAssignments: AssignmentData[] = await Promise.all(assignmentIds.map(async ({ params }) => {
    const postData = await getPostData(params.id, 'assignments');
    return {
      id: params.id,
      num: postData.num,
      title: postData.title,
      due_date: postData.due_date,
      type: postData.type,
      draft: postData.draft,
      excluded: postData.excluded,
    };
  }));

  // Combine markdown assignments with external assignments
  let assignments: AssignmentData[] = [...markdownAssignments, ...externalAssignments];
  
  // Filter out excluded, drafts, and past assignments
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  assignments = assignments.filter(assignment => {
    if (assignment.excluded) return false;
    if (assignment.draft === 1) return false;
    if (!assignment.due_date) return false;
    
    const dueDate = new Date(assignment.due_date + 'T23:59:59');
    dueDate.setHours(0, 0, 0, 0);
    return dueDate >= today;
  });

  // Sort by due date
  assignments.sort((a, b) => {
    if (!a.due_date || !b.due_date) return 0;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  // Take only the next 5 upcoming assignments
  const upcomingAssignments = assignments.slice(0, 5);

  return <QuickLinksNavClient resources={quickLinkResources} assignments={upcomingAssignments} />;
}

