---
title: "TypeScript, Contexts, Hooks"
start_date: "2026-02-12"
type: "activity"
---


## Learning Objectives

By the end of this session, students will:
- Understand TypeScript basics: types, interfaces, generics
- Understand when and why to use React Contexts
- Be comfortable with React Hooks: useState, useEffect, custom hooks
- Be able to connect frontend to backend API
- Practice pair programming for frontend development
- Reflect on what's confusing about React and what clicked


## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:10 | Review & Warm-up | Review React architecture, address questions |
| 0:10-0:30 | TypeScript + Contexts + Hooks Workshop | Learn TypeScript, Contexts, and Hooks |
| 0:30-1:00 | Integration Studio | Connect frontend to backend feature |
| 1:00-1:15 | Pair Programming Practice | One codes, one reviews, then switch |
| 1:15-1:25 | Reflection | What's confusing? What clicked? |
| 1:25-1:30 | Wrap-up | Preview homework |


## Detailed Instructions

### Part 1: Review & Warm-up (10 minutes)

#### Check-in (3 minutes)
1. **Welcome back**
2. **Quick check:** "Raise your hand if:"
   - You read "Thinking in React"
   - You designed a UI flow (from Tuesday)
   - You have questions about React architecture

#### Review React Architecture (5 minutes)

**Instructor asks:** "Who designed a UI flow? Share one thing you learned."

**Common insights:**
- "I didn't realize how many decisions go into UI design"
- "State ownership is tricky"
- "Mapping backend to frontend helps clarify structure"

**Address questions** about React architecture

#### Preview Today (2 minutes)
- "Today we're learning TypeScript, Contexts, and Hooks"
- "Then we'll connect frontend to backend together"
- "You'll practice pair programming"
- "This is what you'll do for homework"

**Transition:** "Let's start with TypeScript..."


### Part 2: TypeScript + Contexts + Hooks Workshop (20 minutes)

#### TypeScript Basics (7 minutes)

**Instructor explains TypeScript:**

**What is TypeScript?**
- JavaScript with types
- Catches errors before runtime
- Makes code more maintainable
- Provides better IDE support

**Basic Types:**

```typescript
// Primitives
const name: string = "Alice";
const age: number = 25;
const isActive: boolean = true;

// Arrays
const numbers: number[] = [1, 2, 3];
const names: string[] = ["Alice", "Bob"];

// Objects
interface User {
  id: number;
  username: string;
  email: string;
}

const user: User = {
  id: 1,
  username: "alice",
  email: "alice@example.com"
};
```

**Interfaces:**

```typescript
// Define shape of objects
interface Group {
  id: number;
  name: string;
  description?: string; // Optional
  created_at: string;
}

// Use in function parameters
function displayGroup(group: Group) {
  console.log(group.name);
}
```

**Generics (brief):**

```typescript
// Generic function - works with any type
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = getFirst([1, 2, 3]); // number | undefined
const firstString = getFirst(["a", "b"]); // string | undefined
```

**Key Point:** "TypeScript helps catch errors early and makes code self-documenting."

#### React Contexts (6 minutes)

**Instructor explains Contexts:**

**What is Context?**
- Way to share data across components without prop drilling
- Use for global state (auth, theme, app settings)
- Provider wraps components, consumers access data

**Show example from codebase:**

```typescript
// 1. Create Context
const AuthContext = createContext<AuthContextValue | null>(null);

// 2. Create Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    // Login logic
  };

  const value: AuthContextValue = {
    user,
    token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Create Hook to Use Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// 4. Use in Components
function MyComponent() {
  const { user, login } = useAuth(); // Access context
  // ...
}
```

**When to use Context:**
- ✅ Global state (auth, theme, user preferences)
- ✅ Data needed by many components
- ❌ Don't use for local state (use useState instead)
- ❌ Don't use for server state (use React Query instead)

**Key Point:** "Context is for global state. Use it when multiple components need the same data."

#### React Hooks (7 minutes)

**Instructor explains Hooks:**

**useState:**
```typescript
// Local component state
function Counter() {
  const [count, setCount] = useState<number>(0); // TypeScript type

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**useEffect:**
```typescript
// Side effects (API calls, subscriptions, etc.)
function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Runs after component mounts
    async function fetchGroups() {
      const response = await fetch('/api/groups');
      const data = await response.json();
      setGroups(data);
      setLoading(false);
    }
    fetchGroups();
  }, []); // Empty array = run once on mount

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render groups */}</div>;
}
```

**Custom Hooks:**
```typescript
// Extract reusable logic
function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      const response = await fetch('/api/groups');
      const data = await response.json();
      setGroups(data);
      setLoading(false);
    }
    fetchGroups();
  }, []);

  return { groups, loading };
}

// Use in component
function GroupList() {
  const { groups, loading } = useGroups();
  // ...
}
```

**Key Point:** "Hooks let you use state and side effects in functional components. Custom hooks extract reusable logic."

**Transition:** "Now let's connect frontend to backend..."


### Part 3: Integration Studio (30 minutes)

#### Setup (5 minutes)

**Instructor provides scenario:**

**Scenario:** Build a Groups list page that connects to the backend API:
- Backend: `GET /api/groups` returns list of groups
- Frontend: Display groups in a list, handle loading and errors

**Task:** Implement the page with proper TypeScript, state management, and API integration.

#### Step 1: Create the Page Component (10 minutes)

**Instructor guides teams:**

1. **Create page file:** `ui/src/pages/groups/GroupsPage.tsx`

2. **Set up component with TypeScript:**
   ```typescript
   import { useState, useEffect } from 'react';
   import { Group } from '../../types/api';

   export default function GroupsPage() {
     const [groups, setGroups] = useState<Group[]>([]);
     const [loading, setLoading] = useState<boolean>(true);
     const [error, setError] = useState<string | null>(null);

     // We'll add useEffect next
     
     return (
       <div>
         <h1>Groups</h1>
         {/* We'll render groups here */}
       </div>
     );
   }
   ```

3. **Add useEffect to fetch data:**
   ```typescript
   useEffect(() => {
     async function fetchGroups() {
       try {
         setLoading(true);
         const response = await fetch('/api/groups', {
           headers: {
             'Authorization': `Bearer ${token}` // Get from context
           }
         });
         
         if (!response.ok) {
           throw new Error('Failed to fetch groups');
         }
         
         const data = await response.json();
         setGroups(data);
       } catch (err) {
         setError(err instanceof Error ? err.message : 'Unknown error');
       } finally {
         setLoading(false);
       }
     }
     
     fetchGroups();
   }, []); // Run once on mount
   ```

4. **Add rendering logic:**
   ```typescript
   if (loading) return <div>Loading...</div>;
   if (error) return <div>Error: {error}</div>;
   
   return (
     <div>
       <h1>Groups</h1>
       {groups.length === 0 ? (
         <p>No groups found</p>
       ) : (
         <ul>
           {groups.map(group => (
             <li key={group.id}>{group.name}</li>
           ))}
         </ul>
       )}
     </div>
   );
   ```

**Instructor circulates:**
- Help teams write the component
- Ensure TypeScript types are correct
- Check that state management is proper
- Guide API integration

**Key Point:** "TypeScript helps catch errors. State management handles UI states."

#### Step 2: Use Context for Authentication (10 minutes)

**Instructor guides teams:**

1. **Use AuthContext to get token:**
   ```typescript
   import { useAuth } from '../../contexts/AuthContext';

   export default function GroupsPage() {
     const { API_URL, isAuthenticated } = useAuth();
     // ... rest of component
   }
   ```

2. **Update fetch to use API_URL:**
   ```typescript
   const response = await fetch(`${API_URL}/api/groups`, {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   });
   ```

3. **Handle authentication:**
   ```typescript
   if (!isAuthenticated) {
     return <div>Please log in</div>;
   }
   ```

**Instructor circulates:**
- Help teams use context
- Ensure authentication is handled
- Check that API_URL is used correctly

**Key Point:** "Context provides global state. Use it for auth and API configuration."

#### Step 3: Create Custom Hook (Optional, 5 minutes)

**Instructor shows how to extract logic:**

```typescript
// Create custom hook: ui/src/hooks/useGroups.ts
export function useGroups() {
  const { API_URL } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGroups() {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/groups`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setGroups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, [API_URL]);

  return { groups, loading, error };
}

// Use in component
function GroupsPage() {
  const { groups, loading, error } = useGroups();
  // ...
}
```

**Instructor:** "Custom hooks extract reusable logic. This makes components cleaner."

**Transition:** "Now let's practice pair programming..."


### Part 4: Pair Programming Practice (15 minutes)

#### Pair Programming Protocol (5 minutes)

**Instructor explains:**

**Roles:**
- **Driver:** Writes the code
- **Navigator:** Reviews, suggests, catches errors

**Process:**
1. Driver writes code
2. Navigator reviews as they go
3. Switch roles every 5-10 minutes
4. Both understand the code

**Benefits:**
- Catches errors early
- Shares knowledge
- Improves code quality
- Teaches collaboration

#### Practice Session (10 minutes)

**Instructor asks teams to:**
1. **Pair up** (or work in small groups)
2. **Add a feature** to the Groups page:
   - Add a "Create Group" button
   - Create a form component
   - Handle form submission
   - Update the groups list after creation

3. **Use pair programming:**
   - One person codes
   - Other person reviews
   - Switch roles halfway through

**Instructor circulates:**
- Help pairs work together
- Ensure both people are engaged
- Model good pair programming practices

**Key Point:** "Pair programming improves code quality and helps you learn from each other."

**Transition:** "Let's reflect on what we learned..."


### Part 5: Reflection (10 minutes)

#### Reflection Activity (8 minutes)

**Instructor asks teams to discuss:**

1. **What did we do today?**
   - Learned TypeScript, Contexts, Hooks
   - Connected frontend to backend
   - Practiced pair programming

2. **What's confusing about React?**
   - What concepts are hard to understand?
   - What patterns are unclear?
   - What questions do you have?

3. **What clicked?**
   - What made sense?
   - What patterns do you understand now?
   - What feels natural?

4. **What's different about frontend?**
   - How is it different from backend?
   - What's easier? What's harder?
   - What skills transfer?

5. **What questions do you have?**
   - About TypeScript?
   - About Contexts?
   - About Hooks?
   - About integration?

**Instructor asks 2-3 teams to share:**
- One thing that's confusing
- One thing that clicked
- One question they have

**Common insights:**
- "TypeScript catches errors I didn't know I had"
- "Context makes global state easier"
- "Hooks are powerful but take practice"
- "Frontend feels different from backend"
- "Pair programming helps catch mistakes"

**Key Point:** "React has a learning curve. Keep practicing. It gets easier."

#### Preview Homework (2 minutes)

**HW4: Frontend Integration PR + Peer Review + Reflection**
- **Due:** Next Tuesday (Feb 17)
- **Requirements:**
  1. Build React UI that connects to existing backend feature
  2. Use TypeScript, Contexts, and Hooks
  3. Handle loading, error, and success states
  4. Create PR
  5. Review another team's frontend PR
  6. Individual reflection on frontend experience

- **Process:**
  1. Choose a backend feature (or use groups)
  2. Design UI flow (from Tuesday)
  3. Implement React components
  4. Connect to backend API
  5. Handle states and edge cases
  6. Create PR
  7. Review another team's PR
  8. Reflect on frontend experience


### Part 6: Wrap-up (5 minutes)

#### Reminders (3 minutes)
- TypeScript helps catch errors early
- Context is for global state
- Hooks manage state and side effects
- Pair programming improves code quality
- Frontend is different but learnable

#### Questions (2 minutes)
- Open floor for questions
- Address common concerns


## Materials Needed

- Codebase open and navigable (web frontend)
- TypeScript examples (handout or digital)
- Context examples (handout or digital)
- Hooks examples (handout or digital)
- Computer for each student/pair

## Instructor Notes

### Common Confusions

**"TypeScript is too verbose"**
- It adds type safety and catches errors
- You'll get used to it
- It makes code more maintainable

**"When do I use Context vs useState?"**
- useState: Local component state
- Context: Global state shared across components
- Start with useState, lift to Context if needed

**"useEffect is confusing"**
- useEffect runs after render
- Empty dependency array = run once
- Include dependencies that should trigger re-run

**"How do I know what TypeScript types to use?"**
- Look at API responses
- Define interfaces for data structures
- Use type inference when possible

### Time Management

- **If running short:** Focus on useState and useEffect, skip custom hooks
- **If running long:** Move some integration to homework, focus on concepts

### Differentiation

- **For advanced students:** Have them create custom hooks, use React Query
- **For struggling students:** Provide more scaffolding, focus on one concept at a time


## Student Deliverables

- Groups page implemented (can be part of HW4)
- TypeScript types defined
- Context used for authentication
- Hooks used for state and side effects
- Pair programming practice completed
- Reflection on React experience

## Next Steps

- **Before Tuesday:** Complete HW4
- **Tuesday:** React Native architecture and Expo setup
- **Reading:** Expo Documentation "Getting Started" (due Tuesday)

