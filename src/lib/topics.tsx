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

export interface ScheduleQuiz {
  quizName: string;
  url: string;
}

export interface Meeting {
  date: string;
  topic: string;
  description?: string | React.ReactElement;
  activities?: Activity[];
  quizzes?: Quiz[];
  scheduleQuizzes?: ScheduleQuiz[]; // Quizzes from schedule.tsx with quizName and url
  readings?: Reading[];
  optionalReadings?: Reading[];
  holiday?: boolean;
  discussionQuestions?: string;
  assigned?: Assignment | string | (Assignment | string)[];
  due?: Assignment | string | (Assignment | string)[];
}

export interface Topic {
  id: number;
  title: string;
  description: string | React.ReactElement;
  meetings: Meeting[];
}

// Input type for baseTopics from schedule.tsx - allows quizzes to be either Quiz, Reading (citation), or ScheduleQuiz (quizName/url)
interface ScheduleQuizInput {
  quizName: string;
  url: string;
}

interface BaseMeeting {
  date: string;
  topic: string;
  description?: string | React.ReactElement;
  activities?: Activity[];
  quizzes?: (Quiz | Reading | ScheduleQuizInput)[]; // Can contain Quiz, Reading (citation), or ScheduleQuiz (quizName/url) from schedule.tsx
  readings?: Reading[];
  optionalReadings?: Reading[];
  holiday?: boolean;
  discussionQuestions?: string;
  assigned?: Assignment | string | (Assignment | string)[];
  due?: Assignment | string | (Assignment | string)[];
}

interface BaseTopic {
  id: number;
  title: string;
  description: string | React.ReactElement;
  meetings: BaseMeeting[];
}

type TopicsArray = Topic[];
type BaseTopicsArray = BaseTopic[];

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

// Convert YYYY-MM-DD to "Mo, Jan 12" format
function formatDateForMeeting(dateStr: string): string | null {
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return null;
  
  const dayAbbr = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const dayOfWeek = dayAbbr[date.getDay()];
  const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthAbbr[date.getMonth()];
  const day = date.getDate();
  
  return `${dayOfWeek}, ${month} ${day}`;
}

// Enrichment function
async function enrichTopicsWithMarkdown(baseTopics: BaseTopicsArray): Promise<TopicsArray> {
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
  // Cast baseTopics to allow quizzes to be (Quiz | Reading)[] initially
  const enrichedTopics: TopicsArray = baseTopics.map((topic: BaseTopic) => ({
    ...topic,
    meetings: topic.meetings.map((meeting: BaseMeeting) => ({
      ...meeting,
      activities: meeting.activities ? [...meeting.activities] : undefined,
      assigned: meeting.assigned ? (typeof meeting.assigned === 'object' ? { ...meeting.assigned } : meeting.assigned) : undefined,
    })) as Meeting[]
  }));
  
  // Enrich each meeting
  enrichedTopics.forEach((topic) => {
    topic.meetings.forEach((meeting) => {
      const meetingDateStr = parseMeetingDate(meeting.date);
      if (!meetingDateStr) return;
      
      // Check if meeting has schedule quizzes from schedule.tsx
      // These can be either Reading (citation) or ScheduleQuiz (quizName/url) format
      // Note: meeting.quizzes can contain Quiz, Reading, or ScheduleQuizInput types from schedule.tsx
      if (meeting.quizzes && Array.isArray(meeting.quizzes)) {
        // Type guard: check if item is a ScheduleQuiz (has quizName and url, no title/slug/citation)
        const isScheduleQuiz = (q: Quiz | Reading | ScheduleQuizInput): q is ScheduleQuizInput => {
          return 'quizName' in q && 'url' in q && !('title' in q) && !('slug' in q) && !('citation' in q);
        };
        
        // Type guard: check if item is a Reading (has citation, no title/slug/quizName)
        const isCitationQuiz = (q: Quiz | Reading | ScheduleQuizInput): q is Reading => {
          return 'citation' in q && !('title' in q) && !('slug' in q) && !('quizName' in q);
        };
        
        // Type guard: check if item is a Quiz (has title/slug, no citation/quizName)
        const isQuiz = (q: Quiz | Reading | ScheduleQuizInput): q is Quiz => {
          return 'title' in q && 'slug' in q && !('citation' in q) && !('quizName' in q);
        };
        
        // Cast to union type to allow filtering
        const quizzesArray = meeting.quizzes as (Quiz | Reading | ScheduleQuizInput)[];
        const scheduleQuizzes = quizzesArray.filter(isScheduleQuiz);
        const citationQuizzes = quizzesArray.filter(isCitationQuiz);
        
        // Combine schedule quizzes (new format) and citation quizzes (old format) into scheduleQuizzes
        if (scheduleQuizzes.length > 0 || citationQuizzes.length > 0) {
          // Convert ScheduleQuizInput to ScheduleQuiz format
          const convertedScheduleQuizzes: ScheduleQuiz[] = [
            ...scheduleQuizzes.map(q => ({ quizName: q.quizName, url: q.url })),
            // Convert old citation format to new format (extract text and url from citation)
            ...citationQuizzes.map(q => {
              // For citation format, try to extract text and url
              // If citation is a string, use it as quizName
              // If citation is React element, extract text from children
              let quizName = '';
              let url = q.url || '';
              
              if (typeof q.citation === 'string') {
                quizName = q.citation;
              } else if (React.isValidElement(q.citation)) {
                // Try to extract text from React element (simple case)
                const props = q.citation.props as { children?: React.ReactNode; href?: string };
                const children = props?.children;
                if (typeof children === 'string') {
                  quizName = children;
                } else if (Array.isArray(children)) {
                  quizName = children.map((c: unknown) => typeof c === 'string' ? c : '').join('');
                }
                // Try to extract url from anchor tag if present
                if (props?.href) {
                  url = props.href;
                }
              }
              
              return { quizName: quizName || 'Quiz', url: url || '#' };
            })
          ];
          
          meeting.scheduleQuizzes = convertedScheduleQuizzes;
          
          // Keep only Quiz objects (with title/slug) in quizzes array
          meeting.quizzes = quizzesArray.filter(isQuiz);
          // If no Quiz objects remain, set to undefined
          if (meeting.quizzes.length === 0) {
            meeting.quizzes = undefined;
          }
        }
      }
      
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
      
      // Create auto-populated assignment entries for assigned (all matches, including drafts)
      const autoAssignedAssignments = matchingAssignmentsByAssigned.map((assignment) => {
        const titleShort = assignment.type === 'homework' ? `HW ${assignment.num}` : `Tutorial ${assignment.num}`;
        return {
          titleShort: titleShort,
          title: assignment.title,
          url: `/assignments/${assignment.id}/`,
          draft: assignment.draft || 0
        };
      });
      
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
      
      // Merge assigned assignments: add all auto-populated ones (including drafts)
      if (autoAssignedAssignments.length > 0) {
        if (!meeting.assigned) {
          // If no manual assigned items, set to array of auto-populated ones
          meeting.assigned = autoAssignedAssignments.length === 1 ? autoAssignedAssignments[0] : autoAssignedAssignments;
        } else if (Array.isArray(meeting.assigned)) {
          // If already an array, merge (avoid duplicates by URL)
          const existingUrls = new Set(
            meeting.assigned
              .filter((a): a is Assignment => typeof a !== 'string')
              .map((a) => a.url)
          );
          const newAssignedAssignments = autoAssignedAssignments.filter((a) => !existingUrls.has(a.url));
          meeting.assigned = [...meeting.assigned, ...newAssignedAssignments];
        } else {
          // If single item, convert to array and merge
          const existingUrl = typeof meeting.assigned === 'object' ? meeting.assigned.url : null;
          const newAssignedAssignments = autoAssignedAssignments.filter((a) => a.url !== existingUrl);
          if (newAssignedAssignments.length > 0) {
            meeting.assigned = [meeting.assigned, ...newAssignedAssignments];
          }
        }
      }
      
      // Merge quizzes: keep manual entries, add auto-populated ones
      if (autoQuizzes.length > 0) {
        const existingQuizzes = meeting.quizzes || [];
        // Check if auto-populated quizzes already exist (by slug) to avoid duplicates
        const existingSlugs = new Set(existingQuizzes.map((q: Quiz) => q.slug));
        const newAutoQuizzes = autoQuizzes.filter((q: Quiz) => !existingSlugs.has(q.slug));
        if (newAutoQuizzes.length > 0) {
          meeting.quizzes = [...existingQuizzes, ...newAutoQuizzes];
        } else if (existingQuizzes.length > 0) {
          meeting.quizzes = existingQuizzes;
        }
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
  
  // Find all assignment dates that don't have corresponding meetings
  const allMeetingDates = new Set<string>();
  enrichedTopics.forEach((topic) => {
    topic.meetings.forEach((meeting) => {
      const meetingDateStr = parseMeetingDate(meeting.date);
      if (meetingDateStr) {
        allMeetingDates.add(meetingDateStr);
      }
    });
  });
  
  // Find assignments with assigned_date that don't have meetings
  const orphanedAssignments = new Map<string, PostData[]>();
  assignmentsByAssignedDate.forEach((assignments, dateStr) => {
    if (!allMeetingDates.has(dateStr)) {
      orphanedAssignments.set(dateStr, assignments);
    }
  });
  
  // Create new meetings for orphaned assignments
  if (orphanedAssignments.size > 0) {
    // Find the appropriate topic for each orphaned assignment based on date
    orphanedAssignments.forEach((assignments, dateStr) => {
      const formattedDate = formatDateForMeeting(dateStr);
      if (!formattedDate) return;
      
      // Find the topic that this date should belong to
      // Look for the topic with the latest date that is still before or equal to the assignment date
      let targetTopic: Topic | null = null;
      let latestTopicDate = '';
      
      enrichedTopics.forEach((topic) => {
        // Get all dates in this topic
        const topicDates: string[] = [];
        topic.meetings.forEach((meeting) => {
          const meetingDateStr = parseMeetingDate(meeting.date);
          if (meetingDateStr) {
            topicDates.push(meetingDateStr);
          }
        });
        
        if (topicDates.length > 0) {
          // Find the latest date in this topic that is <= assignment date
          const datesBeforeOrEqual = topicDates.filter(d => d <= dateStr).sort();
          if (datesBeforeOrEqual.length > 0) {
            const latestDate = datesBeforeOrEqual[datesBeforeOrEqual.length - 1];
            if (latestDate > latestTopicDate) {
              latestTopicDate = latestDate;
              targetTopic = topic;
            }
          }
        }
      });
      
      // If no topic found with dates before/equal, use the first topic as fallback
      if (!targetTopic) {
        targetTopic = enrichedTopics[0];
      }
      
      if (targetTopic) {
        // Determine topic name based on assignment type
        const isTutorial = assignments.some(a => a.type === 'tutorial');
        const isHomework = assignments.some(a => a.type === 'homework');
        let topicName = 'Assignment';
        if (isTutorial && !isHomework) {
          topicName = 'Tutorial';
        } else if (isHomework && !isTutorial) {
          topicName = 'Homework';
        } else if (isTutorial && isHomework) {
          topicName = 'Tutorial & Homework';
        }
        
        // Create auto-populated assignment entries
        const autoAssignedAssignments = assignments.map((assignment) => {
          const titleShort = assignment.type === 'homework' ? `HW ${assignment.num}` : `Tutorial ${assignment.num}`;
          return {
            titleShort: titleShort,
            title: assignment.title,
            url: `/assignments/${assignment.id}/`,
            draft: assignment.draft || 0
          };
        });
        
        const newMeeting: Meeting = {
          date: formattedDate,
          topic: topicName,
          assigned: autoAssignedAssignments.length === 1 ? autoAssignedAssignments[0] : autoAssignedAssignments
        };
        
        // Add to the end of the topic's meetings (will be sorted below)
        targetTopic.meetings.push(newMeeting);
        
        // Sort all meetings in the topic by date
        targetTopic.meetings.sort((a, b) => {
          const dateA = parseMeetingDate(a.date);
          const dateB = parseMeetingDate(b.date);
          if (!dateA || !dateB) return 0;
          return dateA.localeCompare(dateB);
        });
      }
    });
  }
  
  return enrichedTopics;
}

// Export async function to get enriched topics
export async function getTopics() {
  return await enrichTopicsWithMarkdown(baseTopics);
}

// Default export: for now, return base topics (components will be updated to use getTopics())
// Note: baseTopics is now imported from content/config/schedule.tsx
export default baseTopics;
