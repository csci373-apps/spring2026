const topics = [
    {
      id: 1,
      title: "Introduction",
      description: "Working with clients; software development lifecycle; goals for the semester; etc.",
      meetings: [
        {
          date: "Tu, Jan 13",
          topic: "Intro to the course",
        },
        {
          date: "Th, Jan 15",
          topic: "Overview of the software development lifecycle",
        },
      ]
    },
    {
      id: 2,
      title: "UX / UI Design",
      description: "Usability principles (Norman/Neilson), user research, prototyping, wireframing, Figma, design systems, etc.",
      meetings: [
        {
          date: "Tu, Jan 20",
          topic: "Intro to user-centered design",
        },
        {
          date: "Th, Jan 22",
          topic: "Lab: Low-fidelity prototyping",
        },
        {
          date: "Tu, Jan 27",
          topic: "Intro to Figma"
        },
        {
          date: "Th, Jan 29",
          topic: "Lab: Figma + Relume (Design System) + Generative AI in Design"
        },
        {
          date: "Tu, Feb 3",
          topic: "Working with design systems",
        },
      ]
    },
    {
      id: 3,
      title: "Development Workflow & System Architecture",
      description: "Usability principles (Norman/Neilson), wireframing and prototyping, etc.",
      meetings: [
        {
          date: "Th, Feb 5",
          topic: "Intro to our system architecture",
        },
        {
          date: "Tu, Feb 10",
          topic: "Docker setup",
        },
        {
          date: "Th, Feb 12",
          topic: "Linting, formatting, testing, workflow rules."
        },
        {
          date: "Tu, Feb 17",
          topic: "Continuous integration and deployment"
        },
        {
          date: "Th, Feb 19",
          topic: "Cloud deployments (Supabase, AWS, etc.)",
        },
      ]
    },
    {
      id: 4,
      title: "Front-End Development with React Native",
      description: "React Native, Expo, Hooks, components, state variables, design system integration, etc.",
      meetings: [ 
        {
          date: "Tu, Feb 24",
          topic: "React I: Overview of the Framework; Make your first component",
        },
        {
          date: "Th, Feb 26",
          topic: "React II: Hooks, State Management, & Navigation",
        },
        {
          date: "Tu, Mar 3",
          topic: "React III: Interacting with APIs",
        },
        {
          date: "Th, Mar 5",
          topic: "React IV: Testing & Deployment",
        },
        {
          date: "Tu, Mar 10",
          topic: "Spring Break - No class",
          holiday: true,

        },
        {
          date: "Th, Mar 12",
          holiday: true,
          topic: "Spring Break - No class",
        },
        
      ]
    },
    {
      id: 5,
      title: "Back-End Development with FastAPI",
      description: "TBD",
      meetings: [
        {
          date: "Tu, Mar 17",
          topic: "FastAPI I: Overview of the Framework"
        },
        {
          date: "Th, Mar 19",
          topic: "FastAPI II: Interfacing with the Database via SQLAlchemy",
        },
        {
          date: "Tu, Mar 24",
          topic: "FastAPI III: Make your first CRUD API endpoint",
        },
        {
          date: "Th, Mar 26",
          topic: "FastAPI IV: JSON Web Tokens & Authentication",
        },
        {
          date: "Tu, Mar 31",
          topic: "TBD",
        },
        {
          date: "Th, Apr 2",
          topic: "TBD"
        },
        {
          date: "Tu, Apr 7",
          topic: "TBD"
        },
      ]
    },
    {
      id: 6,
      title: "Feature Development",
      description: "TBD.",
      meetings: [
        {
          date: "Th, Apr 9",
          topic: "TBD",
        },
        {
          date: "Tu, Apr 14",
          topic: "TBD"
        },
        {
          date: "Th, Apr 16",
          topic: "TBD",
        },
        {
          date: "Tu, Apr 21",
          topic: "TBD",
        },
        {
          date: "Th, Apr 23",
          topic: "TBD",
        },
        {
          date: "Tu, Apr 28",
          topic: "TBD",
        },

      ]
    }
  ];

export default topics;