import React from 'react';

export const baseTopics = [
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
              Welcome to the course!
            </>
          ),
          activities: [
            { title: "Slides", url: "https://docs.google.com/presentation/d/1OZNO79sDQ3uI1sypTpXfwVLs0MCQUp-x/edit?usp=sharing&ouid=113376576186080604800&rtpof=true&sd=true", draft: 0 },
            { 
              title: "Syllabus", 
              url: "/syllabus", 
              draft: 0,
              notes: "Please take the syllabus quiz (scroll to the bottom) before the start of class on Thursday."
           },
            { 
              title: "Work Preferences Form", 
              url: "https://forms.gle/Hw7hXyvLMLxCRShS7", 
              draft: 0,
              notes: "Please complete by tomorrow (Wednesday) so that we can assign teams."
            },
            { title: "Your Name + Github Handle", url: "https://docs.google.com/spreadsheets/d/1f0wusSc6K8UwkNp4fjHw1VLcfKZUtUOOoMLHRWKrft0/edit?usp=sharing", draft: 0,
              notes: "Please add your name and github handle to the spreadsheet."
            },
          ]
        },
        {
          date: "Th, Jan 15",
          topic: "Teams + Working Agreement (Phase 1) + dev setup",
          description: (
            <>
              Reading discusion, meeting with client, and team assignments.
            </>
          ),
          activities: [
            { title: "Slides", url: "https://docs.google.com/presentation/d/1ewOuvmcgMgCMlImgjbYygeeYIVBgNe2h/edit?usp=sharing&ouid=113376576186080604800&rtpof=true&sd=true", draft: 0 },
          ],
          readings: [
            {
              citation: (
                  <>
                    Maitre, N.L., Marra, L., Kjeldsen, W. et al. <em>A social media-delivered intervention for motor delays: stage-Ib randomized clinical trial and implementation exploration</em>. Pediatr Res (2025). <a href="https://doi.org/10.1038/s41390-025-04151-5" target="_blank">https://doi.org/10.1038/s41390-025-04151-5</a>. 
                    Full text available <a href="https://drive.google.com/file/d/1yeT8VcUUUZf6BmzD8XH8KD9Vz0gIuelg/view?usp=sharing" target="_blank">via UNCA library</a>.
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
              Review backend structure (models vs schemas vs routes), dependency injection, and how requests flow.
            </>
          ),
          activities: [
            { 
                title: "Slides", 
                url: "https://docs.google.com/presentation/d/1U3ZZuZXAUaQKYeW8a7SbVBTJMoZ69odn/edit?usp=sharing&ouid=113376576186080604800&rtpof=true&sd=true", 
                draft: 0 
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
          readings: [
            {
              citation: (
                <>
                  <a href="/spring2026/resources/backend-01-fastapi-intro">Intro to FastAPI</a>
                </>
              ),
            },
            {
              citation: (
                <>
                  <a href="/spring2026/resources/backend-05-testing">Testing API Endpoints</a>
                </>
              ),
            },
          ],
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
            topic: "Class cancelled",
            holiday: true
        },
        {
          date: "Th, Jan 29",
          topic: "Domain modeling + relationship tradeoffs (whiteboard first)",
          description: (
            <>
              Today's Agenda:
              <ul>
                <li>Team agreements</li>
                <li>How is testing going? Any questions?</li>
                <li>Mini-lecture on relationship design and tradeoffs</li>
                <li>Activity: whiteboard the domain model before coding</li>
                <li>Begin implementation plan and test plan (what behavior must be true)</li>
              </ul>
            </>
          ),
          activities: [
            { title: "Schedule a meeting with Prof. Sanft", url: "https://calendar.app.google/QjwW9pwqQ3e8sHmWA" },
          ],
          readings: [
            {
                citation: (
                  <>
                    <a href="/spring2026/resources//backend-02-sqlalchemy">SQLAlchemy Models and Queries</a>
                  </>
                ),
              },
              {
                citation: (
                  <>
                    <a href="/spring2026/resources/backend-03-dependencies">Decorators and Dependency Injection</a>
                  </>
                ),
              },
              {
                citation: (
                  <>
                    <a href="/spring2026/resources/backend-04-jwt-auth">JWTs and Authentication</a>
                  </>
                ),
              },
          ],
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
            topic: "HW1 Reflection + Data Modeling Studio",
            description: (
              <>
                <ul>
                  <li>
                    <a href="https://docs.google.com/document/d/1n0SLMoV4vxg0HzaUWZlStF-LL30mNDpz5kzNv9K4P7M/edit?usp=sharing" target='_blank'>HW1 Feedback & Discussion</a></li>
                  <li>Show & Tell: Compare your implementation with your counterpart on the other team and discuss.</li>
                  <li>Discussion of each team's data model</li>
                </ul>
              </>
            )
        },
        {
          date: "Th, Feb 5",
          topic: "Writing Clean Code and Refactoring Safely",
          description: (
            <>
              <ul>
                <li>Lecture using your codebase as examples: cohesion/coupling, DRY, function/class size, and data minimization</li>
                <li>Studio: refactor or extend an existing API safely (tests as guardrails)</li>
              </ul>
            </>
          ),
          activities: [
            { 
                title: "Activity:Code Refactoring Worksheet", 
                url: "https://docs.google.com/document/d/1a_liQ8fj5Xz62MGFZCqMI-8G725TQ2lr_33S6ekU2Kg/edit?tab=t.0", 
                draft: 0
            },
          ],
          readings: [
            {
              citation: (
                <>
                  Martin, R. C. (2009). <em>Clean Code</em>. Chapters 2 (Meaningful Names), 3 (Functions), and 17 (Smells and Heuristics)
                </>
              ),
              url: "https://www.oreilly.com/library/view/clean-code/9780136083238/",
            },
            {
              citation: (
                <>
                  <a href="/spring2026/resources/howto-05-clean-code">Clean Code Best Practices</a>
                </>
              ),
            },
          ],
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
            { title: "Slides", url: "https://docs.google.com/presentation/d/1S_QJ-hNRHGXo5-uA1RrWjK1GHPHb0Zy7/edit?usp=sharing&ouid=113376576186080604800&rtpof=true&sd=true", draft: 0 },
          ],
          readings: [
            {
              citation: (
                <>
                  React Team. <em>Thinking in React</em>. React Documentation.
                </>
              ),
              url: "https://react.dev/learn/thinking-in-react",
            }
          ],
        },
        {
          date: "Th, Feb 12",
          topic: "Review of Tuesday's Activity; New team assignments",
          activities: [
            { title: "Slides", url: "https://docs.google.com/presentation/d/1KWG4rNJpnDq4sHH-O0M7LU5hbfyMKmtU/edit?usp=sharing&ouid=113376576186080604800&rtpof=true&sd=true", draft: 0},
          ],
          readings: [
            {
              citation: (
                <>
                  Course resource. <em>Intro to React</em>.
                </>
              ),
              url: "/spring2026/resources/web-ui-01-intro-to-react",
            },
            {
              citation: (
                <>
                  Course resource. <em>TypeScript &amp; JavaScript Patterns</em>.
                </>
              ),
              url: "/spring2026/resources/web-ui-02-typescript-js-patterns",
            },
            {
              citation: (
                <>
                  Course resource. <em>Front-End Design with Mantine UI &amp; Tailwind</em>.
                </>
              ),
              url: "/spring2026/resources/web-ui-03-mantine-tailwind",
            },
            {
              citation: (
                <>
                  Course resource. <em>Testing with Vitest</em>.
                </>
              ),
              url: "/spring2026/resources/web-ui-04-testing",
            },
          ],
          assigned: {
            titleShort: "HW4",
            title: "Frontend Integration PR + 1 Peer Review (Frontend Focus)",
            url: "/assignments/hw04-frontend-integration",
            draft: 1,
          },
        },
        {
            date: "Tu, Feb 17",
            topic: "Workday + Front-end Testing",
            activities: [
              { 
                title: "Slides", 
                url: "#", 
                draft: 1
              },
            ],
        }
      ],
    },
  
    {
      id: 6,
      title: "Mobile - React Native and Expo",
      description:
        "Build mobile UI using React Native and Expo. Connect mobile app to backend API. SDLC concept: platform considerations and mobile-specific patterns.",
      meetings: [
        {
          date: "Th, Feb 19",
          topic: "React Native I",
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
          date: "Tu, Feb 24",
          topic: "React Native II",
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
            url: "/assignments/hw05-mobile-integration",
            draft: 1,
          },
        },
        {
          date: "Th, Feb 26",
          topic: "React Native III",
          description: ""
        }
      ],
    },
  
    {
      id: 7,
      title: "UX, Prototyping, and Revisiting Assumptions",
      description:
        "Introduce HCD and low-fidelity prototyping once technical fluency exists. Use critique to surface mismatches between user intent and current implementation.",
      meetings: [
        {
          date: "Tu, Mar 3",
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
          date: "Th, Mar 5",
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
            url: "/assignments/hw06-lowfi-prototype",
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
