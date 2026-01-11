import React from 'react';
import { getAllPosts, getAllPostIds, getPostData } from '@/lib/markdown';
import { getTopics } from '@/lib/topics';
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

interface ReadingData {
  date: string;
  citation: string;
  url?: string;
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

  // Get readings from topics for the next 7-10 days
  const topics = await getTopics();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 10); // Next 10 days

  const upcomingReadings: ReadingData[] = [];

  // Date parsing function (same as in topics.tsx)
  function parseMeetingDate(meetingDate: string): string | null {
    const year = 2026;
    const monthMap: Record<string, number> = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    
    const match = meetingDate.match(/(\w+), (\w+) (\d+)/);
    if (!match) return null;
    
    const [, , monthAbbr, day] = match;
    const month = monthMap[monthAbbr];
    if (!month) return null;
    
    const monthStr = String(month).padStart(2, '0');
    const dayStr = String(parseInt(day)).padStart(2, '0');
    
    return `${year}-${monthStr}-${dayStr}`;
  }

  // Extract text from React element or string
  function extractText(citation: string | React.ReactElement): string {
    if (typeof citation === 'string') {
      return citation;
    }
    if (React.isValidElement(citation)) {
      const props = citation.props as { children?: React.ReactNode };
      if (props?.children) {
        // Handle React elements - extract text recursively
        const extract = (node: unknown): string => {
          if (typeof node === 'string') return node;
          if (Array.isArray(node)) return node.map(extract).join('');
          if (node && typeof node === 'object' && 'props' in node && node.props && typeof node.props === 'object' && 'children' in node.props) {
            return extract((node.props as { children?: React.ReactNode }).children);
          }
          return '';
        };
        return extract(props.children);
      }
    }
    return '';
  }

  // Extract URL from React element
  function extractUrl(citation: string | React.ReactElement): string | undefined {
    if (typeof citation === 'string') return undefined;
    if (React.isValidElement(citation)) {
      const props = citation.props as { children?: React.ReactNode; url?: string };
      if (props?.children) {
        const findLink = (node: unknown): string | undefined => {
          if (node && typeof node === 'object' && 'type' in node && node.type === 'a' && 'props' in node && node.props && typeof node.props === 'object' && 'href' in node.props) {
            return (node.props as { href?: string }).href;
          }
          if (Array.isArray(node)) {
            for (const item of node) {
              const url = findLink(item);
              if (url) return url;
            }
          }
          if (node && typeof node === 'object' && 'props' in node && node.props && typeof node.props === 'object' && 'children' in node.props) {
            return findLink((node.props as { children?: React.ReactNode }).children);
          }
          return undefined;
        };
        return findLink(props.children);
      }
      return props?.url;
    }
    return undefined;
  }

  topics.forEach(topic => {
    topic.meetings.forEach(meeting => {
      if (!meeting.readings || meeting.readings.length === 0) return;
      
      const meetingDateStr = parseMeetingDate(meeting.date);
      if (!meetingDateStr) return;
      
      const meetingDate = new Date(meetingDateStr);
      meetingDate.setHours(0, 0, 0, 0);
      
      // Check if meeting date is within the next 10 days
      if (meetingDate >= today && meetingDate <= futureDate) {
        meeting.readings.forEach((reading: { citation: string | React.ReactElement; url?: string }) => {
          const citationText = extractText(reading.citation);
          const url = extractUrl(reading.citation) || reading.url;
          
          upcomingReadings.push({
            date: meetingDateStr,
            citation: citationText,
            url: url
          });
        });
      }
    });
  });

  // Sort by date
  upcomingReadings.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Take only the next 7-10 readings (or all if less than 10)
  const limitedReadings = upcomingReadings.slice(0, 10);

  return <QuickLinksNavClient resources={quickLinkResources} assignments={upcomingAssignments} readings={limitedReadings} />;
}

