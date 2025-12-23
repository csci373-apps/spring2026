const topics = [
  {
    id: 1,
    title: "Orientation, Architecture, and Ambiguity",
    description:
      "Set expectations for a studio course, establish team norms, and build architectural literacy. Introduce the idea that requirements are incomplete and SDLC work runs alongside coding.",
    meetings: [
      {
        date: "Tu, Jan 13",
        topic: "Course intro + course arc + architecture overview",
        description: (
          <>
            <ul>
              <li>Course expectations, studio norms, and the course arc (two loops: technical + product/SDLC)</li>
              <li>High-level walkthrough of the starter system: backend layers, frontend structure, and where tests will live</li>
              <li>Activity: trace a request end-to-end (login → API → DB → response)</li>
            </ul>
          </>
        ),
        activities: [
          { title: "Slides", url: "#" },
          { title: "Syllabus", url: "/syllabus/" },
          { title: "Course Arc Overview", url: "/activities/course-arc/" },
          { title: "Trace-a-Request Activity", url: "/activities/trace-request/" },
        ],
        readings: [
          {
            citation: (
              <>
                Hunt, A., & Thomas, D. (1999). <em>The Pragmatic Programmer</em>.
                (Ch. 1: A Pragmatic Philosophy — selected)
              </>
            ),
            url: "#",
          },
          {
            citation: (
              <>
                Short handout: <em>SDLC as Iteration</em> (spiral / iterative framing)
              </>
            ),
            url: "/readings/sdlc-iteration/",
          },
        ],
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
          { title: "Slides", url: "#" },
          { title: "Team Working Agreement (Phase 1)", url: "/activities/team-contract-phase1/" },
          { title: "Dev Environment Setup", url: "/activities/dev-setup/" },
          { title: "Git + PR Workflow Overview", url: "/activities/pr-workflow/" },
        ],
        assigned: {
          titleShort: "HW0",
          title: "Team Working Agreement (Phase 1) + Local Setup Verification",
          url: "/assignments/hw00-team-agreement/",
          draft: 0,
        },
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
          { title: "Slides", url: "#" },
          { title: "Codebase Scavenger Hunt (Backend)", url: "/activities/codebase-scavenger-backend/" },
          { title: "Behavior Contract Worksheet", url: "/activities/behavior-contract/" },
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
                Beck, K. (2002). <em>Test-Driven Development</em>. (Ch. 1–2 — selected)
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
          { title: "Slides", url: "#" },
          { title: "Pytest Workshop", url: "/activities/pytest-workshop/" },
          { title: "Live Review Protocol", url: "/activities/live-code-review/" },
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
          draft: 0,
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
          { title: "Slides", url: "#" },
          { title: "Domain Modeling Activity", url: "/activities/domain-modeling/" },
          { title: "Test Plan Mini-Template", url: "/activities/test-plan/" },
        ],
        readings: [
          {
            citation: (
              <>
                Martin, R. C. (2009). <em>Clean Code</em>. (Ch. 2–3 — selected)
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
        activities: [
          { title: "PR Template (Required)", url: "/activities/pr-template/" },
          { title: "Code Review Activity (Guided)", url: "/activities/code-review-guided/" },
        ],
        assigned: {
          titleShort: "HW2",
          title: "New Model + API + Tests (PR) + 1 Substantive Peer Review",
          url: "/assignments/hw02-new-model-api/",
          draft: 0,
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
          { title: "Slides", url: "#" },
          { title: "Refactor-with-Tests Studio", url: "/activities/refactor-with-tests/" },
          { title: "Design Principles Checklist", url: "/activities/design-principles-checklist/" },
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
        activities: [
          { title: "Code Review Focus: Design", url: "/activities/review-focus-design/" },
          { title: "Live Review Protocol", url: "/activities/live-code-review/" },
        ],
        assigned: {
          titleShort: "HW3",
          title: "Refactor/Extension PR + Tests + 1 Peer Review (Design Focus)",
          url: "/assignments/hw03-refactor-extension/",
          draft: 0,
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
          { title: "Slides", url: "#" },
          { title: "State Ownership Activity", url: "/activities/state-ownership/" },
          { title: "User Flow → UI States Worksheet", url: "/activities/ui-states/" },
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
        activities: [
          { title: "Integration Studio", url: "/activities/integration-studio/" },
          { title: "Code Review Focus: Frontend Boundaries", url: "/activities/review-focus-frontend/" },
        ],
        assigned: {
          titleShort: "HW4",
          title: "Frontend Integration PR + 1 Peer Review (Frontend Focus)",
          url: "/assignments/hw04-frontend-integration/",
          draft: 0,
        },
      },
    ],
  },

  {
    id: 6,
    title: "Frontend Testing + Dependencies + UI Consistency",
    description:
      "Add client-side tests for one critical user flow; introduce dependency management and design systems as stability mechanisms. SDLC concept: risk reduction and quality assurance.",
    meetings: [
      {
        date: "Tu, Feb 17",
        topic: "Client-side testing workshop (one critical flow)",
        description: (
          <>
            <ul>
              <li>Client-side testing workshop (vitest/testing-library or course standard)</li>
              <li>Identify one critical user flow and write a test plan</li>
              <li>Emphasis: test behavior, not implementation details</li>
            </ul>
          </>
        ),
        activities: [
          { title: "Slides", url: "#" },
          { title: "Client-Side Testing Workshop", url: "/activities/frontend-testing-workshop/" },
          { title: "Critical Flow Selection", url: "/activities/critical-flow/" },
        ],
        readings: [
          {
            citation: (
              <>
                Short reading: <em>Testing Pyramid (Frontend Perspective)</em>
              </>
            ),
            url: "/readings/testing-pyramid-frontend/",
          },
        ],
      },
      {
        date: "Th, Feb 19",
        topic: "Stability mechanisms: dependencies + design systems + test reviews",
        description: (
          <>
            <ul>
              <li>Mini-lecture: dependencies and UI consistency (design systems as constraints)</li>
              <li>Studio: implement client-side tests and tighten UI consistency where needed</li>
              <li>Review focus: test clarity and failure modes</li>
            </ul>
          </>
        ),
        activities: [
          { title: "Design Systems Primer", url: "/activities/design-systems-primer/" },
          { title: "Code Review Focus: Testing", url: "/activities/review-focus-testing/" },
        ],
        readings: [
          {
            citation: (
              <>
                Kholmatova, A. <em>Design Systems</em>. (Ch. 1–2 — selected) (optional if access varies)
              </>
            ),
            url: "#",
          },
        ],
        assigned: {
          titleShort: "HW5",
          title: "Client-Side Test PR (One Flow) + 1 Peer Review (Testing Focus)",
          url: "/assignments/hw05-frontend-tests/",
          draft: 0,
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
          { title: "Slides", url: "#" },
          { title: "Low-Fi Prototyping Studio", url: "/activities/lowfi-prototyping/" },
          { title: "Critique Protocol (Design)", url: "/activities/critique-protocol-design/" },
        ],
        readings: [
          {
            citation: (
              <>
                Krug, S. (2014). <em>Don’t Make Me Think</em>. (Ch. 1–2 — selected)
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
        activities: [
          { title: "Prototype → Implementation Mapping", url: "/activities/prototype-to-implementation/" },
          { title: "Review Focus: UX Assumptions", url: "/activities/review-focus-ux/" },
        ],
        assigned: {
          titleShort: "HW6",
          title: "Low-Fi Prototype + Short Reflection (Assumption Change)",
          url: "/assignments/hw06-lowfi-prototype/",
          draft: 0,
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
        activities: [
          { title: "Hi-Fi Prototyping Studio", url: "/activities/hifi-prototyping/" },
          { title: "Demo Prep Checklist", url: "/activities/demo-prep/" },
          { title: "Rebase + Linear History Clinic", url: "/activities/rebase-clinic/" },
        ],
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
        activities: [
          { title: "Sprint 1 Demo Format", url: "/activities/sprint-demo-format/" },
          { title: "Retrospective Activity", url: "/activities/retrospective/" },
        ],
        assigned: {
          titleShort: "HW7",
          title: "Sprint 1 Demo Artifacts + Phase 1 Reflection",
          url: "/assignments/hw07-phase1-reflection/",
          draft: 0,
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
      { date: "Tu, Mar 11", topic: "Spring Break - No class", holiday: true },
      { date: "Th, Mar 13", topic: "Spring Break - No class", holiday: true },
    ],
  },
  {
    id: 10,
    title: "Phase Transition & Agile",
    description: "Move from team autonomy to shared ownership and delivery.",
    meetings: [
      {
        date: "Tu, Mar 17",
        topic: "Agile",
        description:
          "Introduction to Agile methodologies and the Phase 2 transition. We'll form new teams and shift from parallel exploration to collaborative integration.",
        activities: [{ title: "Slides", url: "#" }],
        readings: [
          {
            citation: (
              <>
                Schwaber, K., & Sutherland, J. <em>The Scrum Guide</em>. scrum.org.
              </>
            ),
            url: "https://scrumguides.org/scrum-guide.html",
          },
          {
            citation: (
              <>
                Beck, K., et al. (2001). <em>Manifesto for Agile Software Development</em>.
                agilemanifesto.org.
              </>
            ),
            url: "https://agilemanifesto.org/",
          },
        ],
      },
      {
        date: "Th, Mar 19",
        topic: "Integration",
        description:
          "Shared repo onboarding, PR workflow, and slice ownership. Working collaboratively requires clear processes and communication.",
        activities: [{ title: "Slides", url: "#" }],
      },
    ],
  },
  {
    id: 11,
    title: "Feature Development, Integration, and Refinement",
    description:
      "Build differentiated features collaboratively in a shared codebase. (Details intentionally flexible; driven by client needs and sprint planning.)",
    meetings: [],
  },
  {
    id: 12,
    title: "Final Delivery & Reflection",
    description: "Communicate technical work and reflect on growth.",
    meetings: [
      {
        date: "Tu, Apr 14",
        topic: "Delivery",
        description:
          "Integration testing and polish. Ensuring everything works together and meets quality standards before delivery.",
        activities: [{ title: "Slides", url: "#" }],
      },
      {
        date: "Th, Apr 16",
        topic: "Reflection",
        description:
          "Retrospective and course wrap-up. Reflecting on what we've learned and how we've grown as software developers.",
        activities: [{ title: "Slides", url: "#" }],
        readings: [
          {
            citation: (
              <>
                Martin, R. C. (2011). <em>The Clean Coder</em>. (Ch. 12–13 — selected)
              </>
            ),
            url: "https://www.oreilly.com/library/view/the-clean-coder/9780132542913/",
          },
          {
            citation: (
              <>
                Dweck, C. S. (2006). <em>Mindset</em>. (Ch. 7 — selected)
              </>
            ),
            url: "https://www.penguinrandomhouse.com/books/44330/mindset-by-carol-s-dweck-phd/",
          },
        ],
      },
    ],
  },
  {
    id: 13,
    title: "Final UX Package & Client Presentation",
    description: "Final deliverables and client presentation.",
    meetings: [
      {
        date: "Th, Apr 30",
        topic: "Final deliverable",
        description:
          "Final UX/UI package delivery including clickable prototypes, design system documentation, and steering committee sign-off. This represents the culmination of our design and development work.",
        activities: [{ title: "Slides", url: "#" }],
      },
      {
        date: "Tu, May 5",
        topic: "Client",
        description:
          "Final client presentation (if scheduled). Showcasing our completed work and demonstrating the value we've delivered throughout the semester.",
        activities: [{ title: "Slides", url: "#" }],
      },
    ],
  },
];

export default topics;

