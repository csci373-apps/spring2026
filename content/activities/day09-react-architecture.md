---
title: "React Architecture"
start_date: "2026-02-10"
type: "activity"
draft: 1
---


## Learning Objectives

By the end of this session, students will:
- Understand React as an architectural system
- Be able to distinguish between pages and components
- Understand local vs global state and when to use each
- Be able to map backend features to UI flows
- Identify UI states and edge cases
- Reflect on what they learned from HW3 (refactoring and code quality)


## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:15 | Reflection on HW3 | Review refactoring experience and code quality |
| 0:15-0:35 | React Architecture Lecture | Pages vs components, state ownership, data flow |
| 0:35-1:05 | Backend-to-Frontend Mapping | Map backend feature to UI flow |
| 1:05-1:20 | UI States & Edge Cases | Identify states and edge cases |
| 1:20-1:30 | Q&A & Wrap-up | Questions, preview homework |


## Detailed Instructions

### Part 1: Reflection on HW3 (15 minutes)

#### Check-in (3 minutes)
1. **Welcome back**
2. **Quick check:** "Raise your hand if:"
   - You completed HW3 (refactoring/extension)
   - You received feedback on your PR
   - You have questions about refactoring or design

#### Reflection Activity: Refactoring Experience (7 minutes)

**Instructor asks teams to discuss:**

1. **What did you refactor/extend?**
   - What code did you improve?
   - What design principles did you apply?
   - What was the outcome?

2. **What did refactoring teach you?**
   - About code quality?
   - About design principles?
   - About testing as guardrails?

3. **What was hard about refactoring?**
   - What took longer than expected?
   - What was confusing?
   - What questions do you still have?

**Instructor asks 2-3 teams to share:**
- One thing they learned from refactoring
- One thing that was hard
- One question they have

**Common insights to highlight:**
- "Refactoring is easier with tests"
- "Small functions are easier to understand"
- "Design principles guide decisions"
- "Code review helps catch issues"

**Key Point:** "Refactoring teaches us about code quality. Now we'll apply similar thinking to frontend architecture."

#### Reflection Activity: Code Quality (5 minutes)

**Instructor asks teams to discuss:**

1. **What makes code maintainable?**
   - Clear structure?
   - Good tests?
   - Design principles?
   - What else?

2. **How will you apply this to frontend?**
   - Will the same principles apply?
   - What's different about frontend?
   - What questions do you have?

**Instructor:** Highlight that frontend has similar principles but different concerns

**Key Point:** "Frontend has its own architecture. We'll learn React's architectural patterns today."

**Transition:** "Now let's learn about React architecture..."


### Part 2: React Architecture Lecture (20 minutes)

#### React as Architecture (3 minutes)

**Instructor explains:**
- React is not just a library - it's an architectural system
- It provides patterns for organizing code
- Understanding these patterns helps you build maintainable UIs
- Frontend architecture is different from backend, but has similar principles

**Key Point:** "React gives us patterns for organizing UI code. Understanding these patterns is crucial."

#### Pages vs Components (5 minutes)

**Instructor explains the distinction:**

**Pages:**
- Top-level routes (e.g., `/courses`, `/groups`)
- Responsible for doing the their own data fetching
- Coordinate multiple components
- Handle navigation and routing

**Components:**
- Reusable UI pieces (e.g., `Button`, `Card`, `UserList`)
- Receive data via props (function arguments)
- Focus on presentation
- Can be used in multiple places

**Show example from codebase:**

```typescript
// Page: Owns data, coordinates components
export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  return (
    <Container>
      {loading ? <LoadingSpinner /> : <CourseDetail course={course} />}
    </Container>
  );
}

// Component: Receives data, focuses on presentation
function CourseDetail({ course }: { course: Course }) {
  return (
    <Card>
      <Title>{course.title}</Title>
      <Text>{course.description}</Text>
      <ModuleList modules={course.modules} />
    </Card>
  );
}
```

**Key Point:** "Pages own data and logic. Components receive data and render UI."

#### Local vs Global State (7 minutes)

**Instructor explains state ownership:**

**Local State (useState):**
- State that belongs to one component
- Not shared with other components
- Example: Form input values, toggle states, UI state

**Global State (Context, State Management):**
- State shared across multiple components
- Needs to be accessible from different parts of the app
- Example: User authentication, theme, app-wide settings

**Show example:**

```typescript
// Local state: Only this component needs it
function CreatePostForm() {
  const [title, setTitle] = useState(''); // Local - only this form needs it
  const [content, setContent] = useState(''); // Local
  
  return (
    <form>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
    </form>
  );
}

// Global state: Multiple components need it
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Global - many components need user
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Decision framework:**
- **Use local state if:** Only one component needs it
- **Use global state if:** Multiple components need it, or it's app-wide (like auth)

**Key Point:** "State should live as close to where it's used as possible. Only lift it up if needed."

#### Data Flow (5 minutes)

**Instructor explains React's data flow:**

1. **Data flows down:** Props pass data from parent to child
2. **Events flow up:** Callbacks pass events from child to parent
3. **State is owned by the component that needs it**

**Show example:**

```typescript
// Parent owns state, passes data down
function CoursePage() {
  const [courses, setCourses] = useState([]);
  
  // Data flows down via props
  return <CourseList courses={courses} onSelect={handleSelect} />;
}

// Child receives data, sends events up
function CourseList({ courses, onSelect }) {
  return (
    <div>
      {courses.map(course => (
        <CourseCard 
          key={course.id} 
          course={course}
          onClick={() => onSelect(course.id)} // Event flows up
        />
      ))}
    </div>
  );
}
```

**Key Point:** "Data flows down, events flow up. This unidirectional flow makes React predictable."

**Transition:** "Now let's practice mapping backend features to UI..."


### Part 3: Backend-to-Frontend Mapping (30 minutes)

#### Setup (5 minutes)

**Instructor provides scenario:**

**Scenario:** You need to build a UI for the Groups feature. The backend has:
- `GET /api/groups` - List groups
- `GET /api/groups/{id}` - Get group details
- `POST /api/groups` - Create group
- `PATCH /api/groups/{id}` - Update group
- `DELETE /api/groups/{id}` - Delete group

**Task:** Map this backend API to a UI flow.

#### Team Activity: Map Backend to UI (20 minutes)

**Instructions:**
1. **Work in teams**
2. **Design the UI flow:**
   - What pages do you need?
   - What components do you need?
   - What state do you need?
   - How does data flow?

3. **Use this template:**

```markdown
## UI Flow Design

### Pages
- `/groups` - List all groups
- `/groups/new` - Create new group
- `/groups/{id}` - View group details
- `/groups/{id}/edit` - Edit group

### Components
- `GroupList` - Displays list of groups
- `GroupCard` - Displays one group
- `GroupForm` - Form for creating/editing
- `GroupDetail` - Shows group details

### State
- **Local:**
  - Form inputs (in GroupForm)
  - Loading states (in pages)
- **Global:**
  - User authentication (from AuthContext)
  - Groups list (could be local to page or global)

### Data Flow
1. User navigates to `/groups`
2. Page fetches groups from API
3. Page passes groups to GroupList component
4. GroupList renders GroupCard for each group
5. User clicks group → navigates to `/groups/{id}`
6. Page fetches group details
7. Page passes group to GroupDetail component
```

**Instructor circulates:**
- Help teams think through the design
- Ensure they consider pages vs components
- Check that state ownership is clear
- Guide data flow thinking

#### Share Designs (5 minutes)

**Ask 2-3 teams to share:**
- Their UI flow design
- Their reasoning (why this structure?)
- Questions they have

**Instructor leads discussion:**
- Validate designs
- Point out good patterns
- Address common issues
- Discuss alternatives

**Common issues to address:**
- **Too many pages:** Can some be components?
- **State in wrong place:** Should this be local or global?
- **Unclear data flow:** How does data move through the app?

**Key Point:** "Mapping backend to frontend helps you think through the architecture before coding."

**Transition:** "Now let's think about UI states and edge cases..."


### Part 4: UI States & Edge Cases (15 minutes)

#### What are UI States? (3 minutes)

**Instructor explains:**
- UI states are different conditions the UI can be in
- Examples: Loading, error, empty, success, editing
- Each state needs different UI

**Show example:**

```typescript
// Component with multiple states
function GroupList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States:
  // 1. Loading: Show spinner
  // 2. Error: Show error message
  // 3. Empty: Show "no groups" message
  // 4. Success: Show groups list

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (groups.length === 0) return <EmptyState />;
  return <GroupCards groups={groups} />;
}
```

**Key Point:** "UI has multiple states. You need to handle each one."

#### Identify States and Edge Cases (10 minutes)

**Instructor asks teams to:**
1. **For your UI flow, identify all states:**
   - Loading states (fetching data)
   - Error states (API errors, network errors)
   - Empty states (no data)
   - Success states (data loaded)
   - Form states (editing, submitting, validation errors)

2. **Identify edge cases:**
   - What if API is slow?
   - What if network fails?
   - What if data is empty?
   - What if user is unauthorized?
   - What if form validation fails?

**Template:**

```markdown
## UI States & Edge Cases

### Group List Page (`/groups`)
**States:**
- Loading: Fetching groups
- Error: API error, network error
- Empty: No groups exist
- Success: Groups loaded

**Edge Cases:**
- User has no groups (empty state)
- API returns 401 (unauthorized - redirect to login)
- Network timeout (show error, retry button)
- User is admin vs regular user (different permissions)
```

**Instructor circulates:**
- Help teams identify states
- Ensure they think about edge cases
- Guide them to consider user experience

#### Share States and Edge Cases (2 minutes)

**Ask 1-2 teams to share:**
- States they identified
- Edge cases they considered
- How they'll handle them

**Instructor:** Validate, point out missing states/edge cases

**Key Point:** "Thinking about states and edge cases helps you build robust UIs."

**Transition:** "On Thursday, you'll implement this together..."


### Part 5: Q&A & Wrap-up (10 minutes)

#### Questions (7 minutes)
- Open floor for questions
- Address common confusions:
  - "Pages vs Components?" → Pages own data, components render UI
  - "Local vs Global state?" → Use local unless multiple components need it
  - "How do I know what state to use?" → Start local, lift up if needed

#### Preview Homework (2 minutes)
- **HW4:** Build React UI that connects to existing backend feature
- **Due:** Next Tuesday (Feb 17)
- **Process:**
  1. Choose a backend feature (or use groups)
  2. Design UI flow (pages, components, state)
  3. Implement React components
  4. Connect to backend API
  5. Handle states and edge cases
  6. Create PR
  7. Review another team's frontend PR
  8. Reflect on frontend experience

#### Wrap-up (1 minute)
- Remind students to:
  - Read "Thinking in React" (due Thursday)
  - Read "Mapping User Goals to UI State" handout (due Thursday)
  - Come ready to code on Thursday


## Materials Needed

- Codebase open and navigable (web frontend)
- Whiteboard for UI flow diagrams
- UI flow template (handout or digital)
- States & edge cases template (handout or digital)

## Instructor Notes

### Common Confusions

**"Pages vs Components - what's the difference?"**
- Pages: Top-level routes, own data fetching, coordinate components
- Components: Reusable UI pieces, receive data via props, focus on presentation
- Rule of thumb: If it has a route, it's a page. If it's reusable, it's a component.

**"When do I use local vs global state?"**
- Local: Only one component needs it (form inputs, UI toggles)
- Global: Multiple components need it (user auth, theme, app settings)
- Start with local, lift up if needed

**"How do I know what components to create?"**
- Look for repeated UI patterns → extract to component
- Look for complex UI → break into smaller components
- Start with pages, then identify reusable pieces

### Time Management

- **If running short:** Focus on pages vs components, skip some edge cases
- **If running long:** Move UI states to homework, focus on architecture

### Differentiation

- **For advanced students:** Have them design more complex flows, consider state management libraries
- **For struggling students:** Provide simpler examples, focus on one page at a time


## Student Deliverables

- UI flow designed (can be part of HW4)
- States and edge cases identified (can be part of HW4)
- Reflection on HW3 (refactoring and code quality)

## Next Steps

- **Before Thursday:** Read "Thinking in React", "Mapping User Goals to UI State"
- **Thursday:** TypeScript, Contexts, Hooks workshop + integration practice
- **Homework:** HW4 due next Tuesday

