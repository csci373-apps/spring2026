import { getAllPosts, PostData, getAllQuizMetadata, QuizMetadata, getQuizData, QuizData } from './markdown';
import React from 'react';
import { baseTopics } from '../../content/config/schedule';
import { getCourseConfig } from './config';

// Type definitions for topics structure
interface Activity {
  title: string;
  url?: string;
  draft?: number;
  excluded?: number;
}

interface Assignment {
  titleShort: string;
  title: string;
  url?: string;
  draft?: number;
}

export interface Reading {
  citation: string | React.ReactElement;
  url?: string;
}

export interface Quiz {
  title: string;
  slug: string;
  quizData?: QuizData;
  draft?: number;
}

export interface Meeting {
  date: string;
  topic: string;
  description?: string | React.ReactElement;
  activities?: Activity[];
  quizzes?: Quiz[];
  readings?: Reading[];
  optionalReadings?: Reading[];
  holiday?: boolean;
  discussionQuestions?: string;
  assigned?: Assignment | string;
  due?: Assignment | string | (Assignment | string)[];
}

export interface Topic {
  id: number;
  title: string;
  description: string | React.ReactElement;
  meetings: Meeting[];
}

type TopicsArray = Topic[];

// Date parsing utilities
function parseMeetingDate(meetingDate: string): string | null {
  // Format: "Tu, Jan 13" -> "2026-01-13"
  // Get year from course config
  const year = getCourseConfig().year;
  
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

function normalizeDate(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  // Ensure YYYY-MM-DD format
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }
  return null;
}

// Enrichment function
async function enrichTopicsWithMarkdown(baseTopics: TopicsArray): Promise<TopicsArray> {
  // Read all activities, assignments, and quizzes
  const allActivities = getAllPosts('activities');
  const allAssignments = getAllPosts('assignments');
  const allQuizzes = getAllQuizMetadata();
  
  // Filter activities with start_date and assignments with assigned_date or due_date
  // Also filter out excluded activities (handle both boolean and number)
  const activitiesWithDates = allActivities.filter(a => {
    if (!a.start_date) return false;
    // Exclude if excluded is truthy (handles boolean true, number 1, etc.)
    return !a.excluded;
  });
  const assignmentsWithAssignedDate = allAssignments.filter(a => a.assigned_date);
  const assignmentsWithDueDate = allAssignments.filter(a => a.due_date);
  const quizzesWithDates = allQuizzes.filter(q => q.start_date);
  
  // Create maps for quick lookup by date
  const activitiesByDate = new Map<string, PostData[]>();
  const assignmentsByAssignedDate = new Map<string, PostData[]>();
  const assignmentsByDueDate = new Map<string, PostData[]>();
  const quizzesByDate = new Map<string, QuizMetadata[]>();
  
  activitiesWithDates.forEach(activity => {
    const date = normalizeDate(activity.start_date);
    if (date) {
      if (!activitiesByDate.has(date)) {
        activitiesByDate.set(date, []);
      }
      activitiesByDate.get(date)!.push(activity);
    }
  });
  
  assignmentsWithAssignedDate.forEach(assignment => {
    const date = normalizeDate(assignment.assigned_date);
    if (date) {
      if (!assignmentsByAssignedDate.has(date)) {
        assignmentsByAssignedDate.set(date, []);
      }
      assignmentsByAssignedDate.get(date)!.push(assignment);
    }
  });
  
  assignmentsWithDueDate.forEach(assignment => {
    const date = normalizeDate(assignment.due_date);
    if (date) {
      if (!assignmentsByDueDate.has(date)) {
        assignmentsByDueDate.set(date, []);
      }
      assignmentsByDueDate.get(date)!.push(assignment);
    }
  });
  
  quizzesWithDates.forEach(quiz => {
    const date = normalizeDate(quiz.start_date!);
    if (date) {
      if (!quizzesByDate.has(date)) {
        quizzesByDate.set(date, []);
      }
      quizzesByDate.get(date)!.push(quiz);
    }
  });
  
  // Clone baseTopics to avoid mutating the original
  // We need to preserve React elements in descriptions, so we do a shallow copy
  const enrichedTopics: TopicsArray = baseTopics.map((topic: Topic) => ({
    ...topic,
    meetings: topic.meetings.map((meeting: Meeting) => ({
      ...meeting,
      activities: meeting.activities ? [...meeting.activities] : undefined,
      assigned: meeting.assigned ? (typeof meeting.assigned === 'object' ? { ...meeting.assigned } : meeting.assigned) : undefined,
    }))
  }));
  
  // Enrich each meeting
  enrichedTopics.forEach((topic: Topic) => {
    topic.meetings.forEach((meeting: Meeting) => {
      const meetingDateStr = parseMeetingDate(meeting.date);
      if (!meetingDateStr) return;
      
      // Find matching activities
      const matchingActivities = activitiesByDate.get(meetingDateStr) || [];
      
      // Find matching assignments by assigned_date
      const matchingAssignmentsByAssigned = assignmentsByAssignedDate.get(meetingDateStr) || [];
      
      // Find matching assignments by due_date
      const matchingAssignmentsByDue = assignmentsByDueDate.get(meetingDateStr) || [];
      
      // Find matching quizzes
      const matchingQuizzes = quizzesByDate.get(meetingDateStr) || [];
      
      // Create auto-populated activity entries (excluding excluded activities)
      const autoActivities = matchingActivities
        .filter((activity: PostData) => !activity.excluded)
        .map((activity: PostData) => ({
          title: activity.title,
          url: `/activities/${activity.id}/`,
          draft: activity.draft || 0,
          excluded: activity.excluded ? 1 : 0
        }));
      
      // Create auto-populated assignment entry for assigned (take first match if multiple)
      const autoAssignment = matchingAssignmentsByAssigned.length > 0 
        ? (() => {
            const assignment = matchingAssignmentsByAssigned[0];
            const titleShort = assignment.type === 'homework' ? `HW ${assignment.num}` : `Tutorial ${assignment.num}`;
            return {
              titleShort: titleShort,
              title: assignment.title,
              url: `/assignments/${assignment.id}/`,
              draft: assignment.draft || 0
            };
          })()
        : null;
      
      // Create auto-populated assignment entries for due (all matches, including drafts)
      const autoDueAssignments = matchingAssignmentsByDue.map((assignment) => {
        const titleShort = assignment.type === 'homework' ? `HW ${assignment.num}` : `Tutorial ${assignment.num}`;
        return {
          titleShort: titleShort,
          title: assignment.title,
          url: `/assignments/${assignment.id}/`,
          draft: assignment.draft || 0
        };
      });
      
      // Create auto-populated quiz entries (include full quiz data for client-side rendering)
      const autoQuizzes = matchingQuizzes.map((quiz: QuizMetadata) => {
        const quizData = getQuizData(quiz.slug);
        return {
          title: quiz.quizName,
          slug: quiz.slug,
          quizData: quizData || undefined,
          draft: 0
        };
      });
      
      // Merge activities: keep manual entries, add auto-populated ones
      if (autoActivities.length > 0) {
        const existingActivities = meeting.activities || [];
        // Check if auto-populated activities already exist (by URL) to avoid duplicates
        const existingUrls = new Set(existingActivities.map((a: Activity) => a.url));
        const newAutoActivities = autoActivities.filter((a: Activity) => !existingUrls.has(a.url));
        meeting.activities = [...existingActivities, ...newAutoActivities];
      }
      
      // Merge assignment: only set if not already set manually
      if (autoAssignment && !meeting.assigned) {
        meeting.assigned = autoAssignment;
      }
      
      // Merge quizzes: keep manual entries, add auto-populated ones
      if (autoQuizzes.length > 0) {
        const existingQuizzes = meeting.quizzes || [];
        // Check if auto-populated quizzes already exist (by slug) to avoid duplicates
        const existingSlugs = new Set(existingQuizzes.map((q: Quiz) => q.slug));
        const newAutoQuizzes = autoQuizzes.filter((q: Quiz) => !existingSlugs.has(q.slug));
        meeting.quizzes = [...existingQuizzes, ...newAutoQuizzes];
      }
      
      // Merge due assignments: add all auto-populated ones (including drafts)
      if (autoDueAssignments.length > 0) {
        if (!meeting.due) {
          // If no manual due items, set to array of auto-populated ones
          meeting.due = autoDueAssignments.length === 1 ? autoDueAssignments[0] : autoDueAssignments;
        } else if (Array.isArray(meeting.due)) {
          // If already an array, merge (avoid duplicates by URL)
          const existingUrls = new Set(
            meeting.due
              .filter((d): d is Assignment => typeof d !== 'string')
              .map((d) => d.url)
          );
          const newDueAssignments = autoDueAssignments.filter((a) => !existingUrls.has(a.url));
          meeting.due = [...meeting.due, ...newDueAssignments];
        } else {
          // If single item, convert to array and merge
          const existingUrl = typeof meeting.due === 'object' ? meeting.due.url : null;
          const newDueAssignments = autoDueAssignments.filter((a) => a.url !== existingUrl);
          if (newDueAssignments.length > 0) {
            meeting.due = [meeting.due, ...newDueAssignments];
          }
        }
      }
    });
  });
  
  return enrichedTopics;
}

// Export async function to get enriched topics
export async function getTopics() {
  return await enrichTopicsWithMarkdown(baseTopics);
}

// Default export: for now, return base topics (components will be updated to use getTopics())
// Note: baseTopics is now imported from content/config/schedule.tsx
export default baseTopics;
