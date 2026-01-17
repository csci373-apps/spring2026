import React from 'react';
import { getAllPosts, getAllPostIds, getPostData } from '@/lib/markdown';
import { getTopics } from '@/lib/topics';
import QuickLinksNavClient from './QuickLinksNavClient';
import externalAssignments from '../../content/config/external-assignments.json';

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
  // Don't filter here - pass all to client for dynamic filtering
  const allAssignments: AssignmentData[] = [...markdownAssignments, ...externalAssignments];

  // Get readings from topics - extract all readings with their dates
  const topics = await getTopics();
  
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

  // Extract all readings with their dates (no date filtering - client will do that)
  const allReadings: ReadingData[] = [];
  
  topics.forEach(topic => {
    topic.meetings.forEach(meeting => {
      if (!meeting.readings || meeting.readings.length === 0) return;
      
      const meetingDateStr = parseMeetingDate(meeting.date);
      if (!meetingDateStr) return;
      
      meeting.readings.forEach((reading: { citation: string | React.ReactElement; url?: string }) => {
        const citationText = extractText(reading.citation);
        const url = extractUrl(reading.citation) || reading.url;
        
        allReadings.push({
          date: meetingDateStr,
          citation: citationText,
          url: url
        });
      });
    });
  });

  // Pass all data to client - filtering will happen client-side
  return <QuickLinksNavClient resources={quickLinkResources} assignments={allAssignments} readings={allReadings} topics={topics} />;
}

