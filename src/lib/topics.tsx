import { getAllPosts, PostData } from './markdown';
import React from 'react';

// Type definitions for topics structure
interface Activity {
  title: string;
  url?: string;
  draft?: number;
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

export interface Meeting {
  date: string;
  topic: string;
  description?: string | React.ReactElement;
  activities?: Activity[];
  readings?: Reading[];
  optionalReadings?: Reading[];
  holiday?: boolean;
  discussionQuestions?: string;
  assigned?: Assignment | string;
  due?: Assignment | string;
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
  // Assume year 2026 for semester dates
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
  // Read all activities and assignments
  const allActivities = getAllPosts('activities');
  const allAssignments = getAllPosts('assignments');
  
  // Filter activities with start_date and assignments with assigned_date
  const activitiesWithDates = allActivities.filter(a => a.start_date);
  const assignmentsWithDates = allAssignments.filter(a => a.assigned_date);
  
  // Create maps for quick lookup by date
  const activitiesByDate = new Map<string, PostData[]>();
  const assignmentsByDate = new Map<string, PostData[]>();
  
  activitiesWithDates.forEach(activity => {
    const date = normalizeDate(activity.start_date);
    if (date) {
      if (!activitiesByDate.has(date)) {
        activitiesByDate.set(date, []);
      }
      activitiesByDate.get(date)!.push(activity);
    }
  });
  
  assignmentsWithDates.forEach(assignment => {
    const date = normalizeDate(assignment.assigned_date);
    if (date) {
      if (!assignmentsByDate.has(date)) {
        assignmentsByDate.set(date, []);
      }
      assignmentsByDate.get(date)!.push(assignment);
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
      
      // Find matching assignments
      const matchingAssignments = assignmentsByDate.get(meetingDateStr) || [];
      
      // Create auto-populated activity entries
      const autoActivities = matchingActivities.map((activity: PostData) => ({
        title: activity.title,
        url: `/activities/${activity.id}/`,
        draft: activity.draft || 0
      }));
      
      // Create auto-populated assignment entry (take first match if multiple)
      const autoAssignment = matchingAssignments.length > 0 
        ? (() => {
            const assignment = matchingAssignments[0];
            // Format titleShort as "HW" + number (e.g., "HW0", "HW1")
            const titleShort = assignment.num ? `HW ${assignment.num}` : 'HW';
            return {
              titleShort: titleShort,
              title: assignment.title,
              url: `/assignments/${assignment.id}/`,
              draft: assignment.draft || 0
            };
          })()
        : null;
      
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
    });
  });
  
  return enrichedTopics;
}

const baseTopics = [
  {
    id: 1,
    title: "Intro to the Course",
    description:
      "Expectations, team norms, intro to the tech stack and course structure.",
    meetings: [
      {
        date: "Tu, Jan 13",
        topic: "Course intro + course arc + architecture overview",
        description: (
          <>
            <ul>
              <li>Course expectations, studio norms, and the course structure</li>
              <li>Introduction to the software development lifecycle (SDLC)</li>
              <li>High-level walkthrough of the starter system: backend layers, frontend structure, and where tests will live</li>
              <li>Activity: trace a request end-to-end (login → API → DB → response)</li>
            </ul>
          </>
        ),
        activities: [
          { title: "Slides", url: "https://docs.google.com/presentation/d/1OZNO79sDQ3uI1sypTpXfwVLs0MCQUp-x/edit?usp=sharing&ouid=113376576186080604800&rtpof=true&sd=true", draft: 0 },
          { title: "Syllabus", url: "/syllabus/", draft: 0 },
        ]
      },
      {
        date: "Th, Jan 15",
        topic: "Teams + Working Agreement (Phase 1) + dev setup",
        description: (
          <>
            <ul>
              <li>Team formation, Phase 1 Working Agreement, and dev environment setup</li>
              <li>Establish baseline workflow norms (feature branches + PRs + reviews)</li>
              <li>Start building shared expectations for presence and studio participation</li>
            </ul>
          </>
        ),
        activities: [
          { title: "Slides", url: "#", draft: 1 },
        ],
        readings: [
          {
            citation: (
              <>
                Hunt, A., & Thomas, D. (1999). <em>The Pragmatic Programmer</em>. <a href="https://www.oreilly.com/library/view/the-pragmatic-programmer/9780135956977/f_0017.xhtml" target="_blank">Ch. 1: A Pragmatic Philosophy</a>
              </>
            ),
          },
          {
            citation: (
              <>
                Rasmusson, J. (2010). <em>The Agile Samurai</em>. <a href="https://learning.oreilly.com/library/view/the-agile-samurai/9781680500066/f_0011.html" target="_blank">Ch. 1: Agile in a Nutshell</a>
              </>
            ),
          },
          {
            citation: (
              <>
                Rasmusson, J. (2010). <em>The Agile Samurai</em>. <a href="https://learning.oreilly.com/library/view/the-agile-samurai/9781680500066/f_0016.html" target="_blank">Ch. 2: Meet Your Agile Team</a>
              </>
            ),
          },
        ],
      },
    ],
  },

  {
    id: 2,
    title: "Backend Architecture + Testing as Specification",
    description:
      "Deepen backend architectural understanding and introduce testing as behavioral specification (contract-level). SDLC concept: turning vague needs into testable behaviors.",
    meetings: [
      {
        date: "Tu, Jan 20",
        topic: "Backend deep dive: models, schemas, routes, dependencies",
        description: (
          <>
            <ul>
              <li>Review backend structure (models vs schemas vs routes), dependency injection, and how requests flow</li>
              <li>Activity: read an existing endpoint and write a short 'behavior contract' in plain language</li>
            </ul>
          </>
        ),
        activities: [
          { title: "Slides", url: "#", draft: 1 },
        ],
        readings: [
          {
            citation: (
              <>
                FastAPI Documentation. <em>Dependencies</em> (selected sections)
              </>
            ),
            url: "https://fastapi.tiangolo.com/tutorial/dependencies/",
          },
          {
            citation: (
              <>
                Beck, K. (2002). <em>Test-Driven Development</em>. (Ch. 1-2 – selected)
              </>
            ),
            url: "#",
          },
        ],
      },
      {
        date: "Th, Jan 22",
        topic: "Pytest workshop: contract-level tests (backend)",
        description: (
          <>
            <ul>
              <li>Testing workshop focused on contract-level API tests (not full coverage)</li>
              <li>Studio: write tests for existing endpoints</li>
              <li>Live critique of one test PR: clarity, naming, and what behavior is asserted</li>
            </ul>
          </>
        ),
        activities: [
          { title: "Slides", url: "#", draft: 1 },
        ],
        readings: [
          {
            citation: (
              <>
                pytest Documentation. <em>Getting Started</em> + <em>Fixtures</em> (selected)
              </>
            ),
            url: "https://docs.pytest.org/en/stable/",
          },
        ],
        assigned: {
          titleShort: "HW1",
          title: "Backend Contract Tests for Existing Endpoints + 1 Peer Review",
          url: "/assignments/hw01-backend-tests/",
          draft: 1,
        },
      },
    ],
  },

  {
    id: 3,
    title: "Data Modeling + API Design + Review-as-Learning",
    description:
      "Design and implement a new backend model (including relationship design) with tests. SDLC concept: articulating tradeoffs and constraints in PRs and reviews.",
    meetings: [
      {
        date: "Tu, Jan 27",
        topic: "Domain modeling + relationship tradeoffs (whiteboard first)",
        description: (
          <>
            <ul>
              <li>Mini-lecture on relationship design and tradeoffs</li>
              <li>Activity: whiteboard the domain model before coding</li>
              <li>Begin implementation plan and test plan (what behavior must be true)</li>
            </ul>
          </>
        ),
        activities: [
          { title: "Slides", url: "#", draft: 1 },
        ],
        readings: [
          {
            citation: (
              <>
                Martin, R. C. (2009). <em>Clean Code</em>. (Ch. 2–3 -- selected)
              </>
            ),
            url: "https://www.oreilly.com/library/view/clean-code/9780136083238/",
          },
          {
            citation: (
              <>
                SQLAlchemy Documentation. <em>Relationships</em> (selected)
              </>
            ),
            url: "https://docs.sqlalchemy.org/en/20/orm/basic_relationships.html",
          },
        ],
      },
      {
        date: "Th, Jan 29",
        topic: "Implement model + API + tests + guided live code review",
        description: (
          <>
            <ul>
              <li>Studio implementation day</li>
              <li>Open PRs using the required template</li>
              <li>Guided live code review: reviewers practice substantive feedback (behavior, design, testing)</li>
            </ul>
          </>
        ),
        assigned: {
          titleShort: "HW2",
          title: "New Model + API + Tests (PR) + 1 Substantive Peer Review",
          url: "/assignments/hw02-new-model-api/",
          draft: 1,
        },
      },
    ],
  },

  {
    id: 4,
    title: "Software Design Principles in Practice",
    description:
      "Apply design principles (cohesion, coupling, DRY, data minimization) directly to the starter architecture. Use tests to refactor safely. SDLC concept: design for change.",
    meetings: [
      {
        date: "Tu, Feb 3",
        topic: "Design principles (practical) + refactoring with tests",
        description: (
          <>
            <ul>
              <li>Lecture using your codebase as examples: cohesion/coupling, DRY, function/class size, and data minimization</li>
              <li>Studio: refactor or extend an existing API safely (tests as guardrails)</li>
            </ul>
          </>
        ),
        activities: [
          { title: "Slides", url: "#", draft: 1 },
        ],
        readings: [
          {
            citation: (
              <>
                Martin, R. C. (2009). <em>Clean Code</em>. (selected sections on readability and structure)
              </>
            ),
            url: "https://www.oreilly.com/library/view/clean-code/9780136083238/",
          },
          {
            citation: (
              <>
                Short handout: <em>Designing for Change</em> (technical debt / changeability)
              </>
            ),
            url: "/readings/design-for-change/",
          },
        ],
      },
      {
        date: "Th, Feb 5",
        topic: "Design-oriented code review + iteration",
        description: (
          <>
            <ul>
              <li>Studio: finish refactor/extension</li>
              <li>Review focus: 'What breaks if this changes?' and 'Are responsibilities clear?'</li>
              <li>Instructor models high-signal review comments</li>
              <li>Iteration based on review feedback</li>
            </ul>
          </>
        ),
        assigned: {
          titleShort: "HW3",
          title: "Refactor/Extension PR + Tests + 1 Peer Review (Design Focus)",
          url: "/assignments/hw03-refactor-extension/",
          draft: 1,
        },
      },
    ],
  },

  {
    id: 5,
    title: "Frontend Architecture & System Boundaries",
    description:
      "Treat React as architecture: component responsibility, state ownership, and data flow. Connect UI to tested APIs. SDLC concept: mapping user needs to system behavior.",
    meetings: [
      {
        date: "Tu, Feb 10",
        topic: "React architecture review (state ownership + boundaries)",
        description: (
          <>
            <ul>
              <li>React as an architectural system: pages vs components, local vs global state, and data flow</li>
              <li>Activity: map one backend feature to a UI flow and identify states/edge cases</li>
            </ul>
          </>
        ),
        activities: [
          { title: "Slides", url: "#", draft: 1 },
        ],
        readings: [
          {
            citation: (
              <>
                React Team. <em>Thinking in React</em>. React Documentation.
              </>
            ),
            url: "https://react.dev/learn/thinking-in-react",
          },
          {
            citation: (
              <>
                Short handout: <em>Mapping User Goals to UI State</em>
              </>
            ),
            url: "/readings/user-goals-to-ui-state/",
          },
        ],
      },
      {
        date: "Th, Feb 12",
        topic: "Integration studio: connect frontend to backend feature",
        description: (
          <>
            <ul>
              <li>Studio: implement UI integration with a tested backend endpoint</li>
              <li>Review focus: component responsibility and predictable data flow</li>
              <li>Quick check: 'What can a user do now?'</li>
            </ul>
          </>
        ),
        assigned: {
          titleShort: "HW4",
          title: "Frontend Integration PR + 1 Peer Review (Frontend Focus)",
          url: "/assignments/hw04-frontend-integration/",
          draft: 1,
        },
      },
    ],
  },

  {
    id: 6,
    title: "Mobile - React Native and Expo",
    description:
      "Build mobile UI using React Native and Expo. Connect mobile app to backend API. SDLC concept: platform considerations and mobile-specific patterns.",
    meetings: [
      {
        date: "Tu, Feb 17",
        topic: "React Native architecture + Expo setup",
        description: (
          <>
            <ul>
              <li>React Native vs React: similarities and differences</li>
              <li>Expo: what it is, why we use it</li>
              <li>Team activity: set up Expo project, understand structure</li>
              <li>Discussion: "How is mobile different from web? What's the same?"</li>
            </ul>
          </>
        ),
        activities: [
          { title: "Slides", url: "#", draft: 1 },
        ],
        readings: [
          {
            citation: (
              <>
                Expo Documentation. <em>Getting Started</em>
              </>
            ),
            url: "https://docs.expo.dev/",
          },
        ],
      },
      {
        date: "Th, Feb 19",
        topic: "Mobile UI + navigation + backend integration",
        description: (
          <>
            <ul>
              <li>Mobile UI patterns: navigation, screens, components</li>
              <li>Team studio: build mobile UI for existing backend feature</li>
              <li>Connect mobile app to same backend API</li>
              <li>Pair programming: one codes, one reviews, then switch</li>
              <li>Reflection: "What's hard about mobile? What's easier than web?"</li>
            </ul>
          </>
        ),
        assigned: {
          titleShort: "HW5",
          title: "Mobile Integration PR + Peer Review + Reflection",
          url: "/assignments/hw05-mobile-integration/",
          draft: 1,
        },
      },
    ],
  },

  {
    id: 7,
    title: "UX, Prototyping, and Revisiting Assumptions",
    description:
      "Introduce HCD and low-fidelity prototyping once technical fluency exists. Use critique to surface mismatches between user intent and current implementation.",
    meetings: [
      {
        date: "Tu, Feb 24",
        topic: "Human-centered design + low-fi prototyping",
        description: (
          <>
            <ul>
              <li>Intro to HCD</li>
              <li>Create low-fidelity prototypes (paper or Figma) for a targeted flow</li>
              <li>Studio critique: identify mismatches between current UI/system behavior and user goals</li>
            </ul>
          </>
        ),
        activities: [
          { title: "Slides", url: "#", draft: 1 },
        ],
        readings: [
          {
            citation: (
              <>
                Krug, S. (2014). <em>Don’t Make Me Think</em>. (Ch. 1–2 -- selected)
              </>
            ),
            url: "https://www.sensible.com/dmmt.html",
          },
          {
            citation: (
              <>
                Nielsen Norman Group. <em>10 Usability Heuristics</em>. (selected)
              </>
            ),
            url: "https://www.nngroup.com/articles/ten-usability-heuristics/",
          },
        ],
      },
      {
        date: "Th, Feb 26",
        topic: "Iterate based on prototype + review focus on assumptions",
        description: (
          <>
            <ul>
              <li>Studio: revise a flow or UI element based on prototype critique</li>
              <li>Review focus shifts: assess user assumptions and flow clarity (not code style)</li>
            </ul>
          </>
        ),
        assigned: {
          titleShort: "HW6",
          title: "Low-Fi + Hi-Fi Prototypes + UX Implementation",
          url: "/assignments/hw06-lowfi-prototype/",
          draft: 1,
        },
      },
    ],
  },

  {
    id: 8,
    title: "Design Synthesis + Sprint 1 Demo + Phase 1 Reflection",
    description:
      "Synthesize design work, stabilize Phase 1 contributions, and demo. Prepare for the Phase 2 shift from exploration to shared ownership.",
    meetings: [
      {
        date: "Tu, Mar 3",
        topic: "High-fi prototyping + demo prep",
        description: (
          <>
            <ul>
              <li>High-fidelity prototyping and alignment: confirm prototype behaviors map to system behaviors</li>
              <li>Studio: prepare Sprint 1 demos and ensure PRs are reviewable and rebased (linear history)</li>
            </ul>
          </>
        ),
        readings: [
          {
            citation: (
              <>
                Short reading: <em>Agile Overview</em> (forward-looking; prepares for Phase 2)
              </>
            ),
            url: "/readings/agile-overview/",
          },
        ],
      },
      {
        date: "Th, Mar 5",
        topic: "Sprint 1 demos + Phase 1 retrospective",
        description: (
          <>
            <ul>
              <li>Sprint 1 demos</li>
              <li>Phase 1 retrospective: what improved (tests, reviews, design clarity), what remained hard, and what will change in Phase 2 (shared repo, vertical slices)</li>
            </ul>
          </>
        ),
        assigned: {
          titleShort: "HW7",
          title: "Phase 1 Reflection + Phase 2 Preparation",
          url: "/assignments/hw07-phase1-reflection/",
          draft: 1,
        },
      },
    ],
  },

  // Keep everything after Week 8 as-is from your original file
  {
    id: 9,
    title: "Spring Break",
    description: "No class",
    meetings: [
      { date: "Tu, Mar 10", topic: "Spring Break - No class", holiday: true },
      { date: "Th, Mar 12", topic: "Spring Break - No class", holiday: true },
    ],
  },
  {
    id: 10,
    title: "Phase 2: Agile and Vertical Features",
    description: "Introduction to Agile. Form vertical teams. Begin feature development in shared repo.",
    meetings: [
      {
        date: "Tu, Mar 17",
        topic: "Agile introduction + vertical team formation",
        description: (
          <>
            <ul>
              <li>Agile principles: iterations, user stories, sprints</li>
              <li>Form vertical teams: backend + web + mobile developers</li>
              <li>Team working agreement for Phase 2 (collaboration, communication)</li>
              <li>Discussion: "How is Phase 2 different? What skills do we need?"</li>
            </ul>
          </>
        ),
        readings: [
          {
            citation: "Schwaber, K., & Sutherland, J. The Scrum Guide.",
            url: "https://scrumguides.org/scrum-guide.html",
          },
        ],
      },
      {
        date: "Th, Mar 19",
        topic: "Sprint 1 planning + feature assignment",
        description: (
          <>
            <ul>
              <li>Review shared repo structure and workflow</li>
              <li>Assign features to vertical teams</li>
              <li>Sprint 1 planning: break features into user stories and tasks</li>
              <li>Define API contracts (shared types)</li>
              <li>Set up feature branches</li>
              <li>Team reflection: "What are our goals? What are we worried about?"</li>
            </ul>
          </>
        ),
      },
    ],
  },

  {
    id: 11,
    title: "Feature Development Sprint 1",
    description: "Build first vertical feature. Practice daily standups, PRs, code review across teams. Reflect on collaboration challenges.",
    meetings: [
      {
        date: "Tu, Mar 24",
        topic: "Feature development kickoff + daily standup protocol",
        description: (
          <>
            <ul>
              <li>Teams begin feature work</li>
              <li>Daily standup protocol: what did you do, what will you do, blockers</li>
              <li>Pair programming: backend + frontend developers work together</li>
              <li>Discussion: "How do we coordinate? What's hard about shared codebase?"</li>
            </ul>
          </>
        ),
      },
      {
        date: "Th, Mar 26",
        topic: "Feature work + PR workflow + code review",
        description: (
          <>
            <ul>
              <li>Teams continue feature work</li>
              <li>Open PRs, practice code review across teams</li>
              <li>Resolve merge conflicts, coordinate API changes</li>
              <li>Team reflection: "What's working? What's challenging? How are we communicating?"</li>
            </ul>
          </>
        ),
      },
      {
        date: "Tu, Mar 31",
        topic: "Sprint 1 continued: feature development",
        description: (
          <>
            <ul>
              <li>Teams continue Sprint 1 feature work</li>
              <li>Daily standups</li>
              <li>Pair programming and collaboration</li>
              <li>Team check-in: "What progress have we made? What blockers do we have?"</li>
            </ul>
          </>
        ),
      },
      {
        date: "Th, Apr 2",
        topic: "Sprint 1 continued: integration and testing",
        description: (
          <>
            <ul>
              <li>Teams continue feature work</li>
              <li>Integration testing across components</li>
              <li>Code review and PR refinement</li>
              <li>Team reflection: "What's working well? What needs improvement?"</li>
            </ul>
          </>
        ),
      },
    ],
  },

  {
    id: 12,
    title: "Feature Development Sprint 2",
    description: "Continue feature development. Sprint review and retrospective. Plan next sprint.",
    meetings: [
      {
        date: "Tu, Apr 7",
        topic: "Sprint 1 review + sprint 2 planning",
        description: (
          <>
            <ul>
              <li>Sprint 1 demos: teams show what they built</li>
              <li>Sprint retrospective: what worked, what didn't, what to improve</li>
              <li>Sprint 2 planning: next features, user stories, tasks</li>
              <li>Reflection: "How did Sprint 1 go? What did we learn about teamwork?"</li>
            </ul>
          </>
        ),
      },
      {
        date: "Th, Apr 9",
        topic: "Sprint 2 feature development kickoff",
        description: (
          <>
            <ul>
              <li>Teams begin Sprint 2 features</li>
              <li>Continue daily standups</li>
              <li>Practice cross-team coordination</li>
              <li>Team reflection: "How are we improving? What's still hard?"</li>
            </ul>
          </>
        ),
      },
      {
        date: "Tu, Apr 14",
        topic: "Sprint 2 continued: feature development",
        description: (
          <>
            <ul>
              <li>Teams continue Sprint 2 feature work</li>
              <li>Daily standups</li>
              <li>Integration and testing</li>
              <li>Team check-in: "What progress have we made?"</li>
            </ul>
          </>
        ),
      },
      {
        date: "Th, Apr 16",
        topic: "Sprint 2 continued: refinement and testing",
        description: (
          <>
            <ul>
              <li>Teams continue feature work</li>
              <li>Code review and PR refinement</li>
              <li>Integration testing</li>
              <li>Team reflection: "What's working? What needs improvement?"</li>
            </ul>
          </>
        ),
      },
    ],
  },

  {
    id: 13,
    title: "Feature Development Sprint 3",
    description: "Final feature sprint. Integration testing. Polish and refinement.",
    meetings: [
      {
        date: "Tu, Apr 21",
        topic: "Sprint 2 review + final sprint planning",
        description: (
          <>
            <ul>
              <li>Sprint 2 demos</li>
              <li>Sprint retrospective</li>
              <li>Final sprint planning: polish, integration, testing</li>
              <li>Discussion: "What features are complete? What needs polish?"</li>
            </ul>
          </>
        ),
      },
      {
        date: "Th, Apr 23",
        topic: "Sprint 3 feature development kickoff",
        description: (
          <>
            <ul>
              <li>Teams begin final sprint features</li>
              <li>Polish existing features, fix bugs</li>
              <li>Write integration tests</li>
              <li>Team reflection: "What are we proud of? What needs work?"</li>
            </ul>
          </>
        ),
      },
      {
        date: "Tu, Apr 28",
        topic: "Sprint 3 continued: integration and polish",
        description: (
          <>
            <ul>
              <li>Teams continue final sprint work</li>
              <li>Cross-team integration: ensure features work together</li>
              <li>Bug fixes and polish</li>
              <li>Team check-in: "What's left to do?"</li>
            </ul>
          </>
        ),
      },
      {
        date: "Th, Apr 30",
        topic: "Sprint 3 continued: final refinement",
        description: (
          <>
            <ul>
              <li>Teams finalize features</li>
              <li>Final integration testing</li>
              <li>Code review and PR refinement</li>
              <li>Team reflection: "What are we proud of? What would we do differently?"</li>
            </ul>
          </>
        ),
      },
    ],
  },

  {
    id: 14,
    title: "Final Delivery and Reflection",
    description: "Final integration, testing, and polish. Course reflection and celebration.",
    meetings: [
      {
        date: "Tu, May 3",
        topic: "Final integration and testing",
        description: (
          <>
            <ul>
              <li>Final integration testing: all features work together</li>
              <li>Bug fixes and polish</li>
              <li>Prepare for final demo</li>
              <li>Team reflection: "What did we accomplish? What are we proud of?"</li>
            </ul>
          </>
        ),
        readings: [
          {
            citation: "Martin, R. C. (2011). The Clean Coder. (Ch. 12-13)",
            url: "#",
          },
        ],
      },
      {
        date: "Th, May 5",
        topic: "Final demos + course reflection",
        description: (
          <>
            <ul>
              <li>Final team demos: showcase completed features</li>
              <li>Course reflection: "How did we grow? What did we learn?"</li>
              <li>Celebration and wrap-up</li>
            </ul>
          </>
        ),
      },
    ],
  },
];

// Export async function to get enriched topics
export async function getTopics() {
  return await enrichTopicsWithMarkdown(baseTopics);
}

// Export base topics for backward compatibility during transition
export { baseTopics };

// Default export: for now, return base topics (components will be updated to use getTopics())
export default baseTopics;

