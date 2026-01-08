---
title: "Intro to React"
group: "Front-End"
group_order: 4
order: 1
---

## What is React?

React is a JavaScript library for building user interfaces, particularly web applications. It was created by Facebook (now Meta) and is one of the most popular front-end frameworks today.

**Key Characteristics:**

- **Component-Based**: React applications are built from reusable components - small, independent pieces of UI that can be composed together
- **Declarative**: You describe what the UI should look like, and React figures out how to update the DOM efficiently
- **Unidirectional Data Flow**: Data flows down from parent components to child components via props
- **Virtual DOM**: React maintains a virtual representation of the DOM in memory, making updates efficient by only changing what's necessary

**Why React?**

- **Reusability**: Write components once, use them anywhere
- **Maintainability**: Component-based architecture makes code easier to understand and maintain
- **Performance**: Virtual DOM and efficient diffing algorithms make React fast
- **Ecosystem**: Huge community, extensive libraries, and excellent tooling
- **TypeScript Support**: Excellent TypeScript integration for type safety

**React vs. Vanilla JavaScript:**

In vanilla JavaScript, you manually manipulate the DOM:
```javascript
// Vanilla JS - imperative
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
  const count = parseInt(button.textContent);
  button.textContent = count + 1;
});
```

In React, you describe the UI state:
```tsx
// React - declarative
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

React automatically updates the DOM when state changes - you don't manually manipulate elements.

## JSX

JSX (JavaScript XML) is a syntax extension that lets you write HTML-like code in JavaScript. It's not required for React, but it makes code more readable and intuitive.

```tsx
// JSX looks like HTML but it's actually JavaScript
const element = <h1>Hello, World!</h1>;

// This gets compiled to:
const element = React.createElement('h1', null, 'Hello, World!');
```

**Key JSX Rules:**
- Use `className` instead of `class` (since `class` is a reserved word in JavaScript)
- Use `htmlFor` instead of `for` in labels
- Self-closing tags must have a slash: `<img />` not `<img>`
- JavaScript expressions go in curly braces: `{variableName}`
- Return a single parent element (or use a Fragment: `<>...</>`)

```tsx
function Greeting({ name }: { name: string }) {
  return (
    <div className="greeting">
      <h1>Hello, {name}!</h1>
      <p>Welcome to React</p>
    </div>
  );
}
```

## Components

Components are reusable pieces of UI. They're like functions that return JSX.

**Function Components (Recommended):**
```tsx
function Welcome() {
  return <h1>Welcome!</h1>;
}

// Or with arrow function:
const Welcome = () => {
  return <h1>Welcome!</h1>;
};
```

**Using Components:**
```tsx
function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
      <Welcome />
    </div>
  );
}
```

Components are composable - you can use components inside other components to build complex UIs.

## Props

Props (short for "properties") are how you pass data from a parent component to a child component. Props are read-only - a component cannot modify its own props.

```tsx
// Parent component passes props
function App() {
  return <Greeting name="Alice" age={25} />;
}

// Child component receives props
function Greeting({ name, age }: { name: string; age: number }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old</p>
    </div>
  );
}
```

**TypeScript Props Interface:**
```tsx
interface GreetingProps {
  name: string;
  age: number;
  email?: string; // Optional prop
}

function Greeting({ name, age, email }: GreetingProps) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Age: {age}</p>
      {email && <p>Email: {email}</p>}
    </div>
  );
}
```

## Hooks

Hooks are functions that let you "hook into" React features like state and lifecycle. They always start with `use`.

### useState

`useState` lets you add state to functional components. State is data that can change over time and causes the component to re-render when it changes.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**Key Points:**
- `useState` returns an array: `[currentValue, setterFunction]`
- The initial value is passed to `useState(0)`
- Call the setter function to update state: `setCount(newValue)`
- State updates trigger a re-render
- State is component-specific - each component has its own state

**What Happens Under the Hood:**

When you call a setter function like `setCount(5)`, React doesn't immediately update the DOM. Instead:

1. **State Update**: React updates the component's state value in memory
2. **Re-render Scheduling**: React schedules a re-render of the component (and potentially child components)
3. **Virtual DOM Comparison**: React compares the new Virtual DOM (created from the updated state) with the previous Virtual DOM
4. **Diffing Algorithm**: React identifies what changed (the "diff")
5. **DOM Update**: React updates only the specific DOM nodes that changed, not the entire component tree

This process is called "reconciliation" and is what makes React efficient. React batches multiple state updates together when possible, and uses a diffing algorithm to minimize DOM operations.

**Example:**
```tsx
function Counter() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1);  // 1. State updated in memory
    // 2. React schedules re-render
    // 3. Component function runs again with new count value
    // 4. React compares old JSX with new JSX
    // 5. Only the text node with count changes in the DOM
  };
  
  return <button onClick={handleClick}>{count}</button>;
}
```

**Important Notes:**
- State updates are **asynchronous** - the state doesn't update immediately after calling the setter
- React may **batch** multiple state updates together for performance
- Calling a setter with the same value won't trigger a re-render (React uses `Object.is()` comparison)


### useEffect

`useEffect` lets you perform side effects in functional components. Side effects include data fetching, subscriptions, or manually changing the DOM.

```tsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // This runs after every render
    async function fetchUser() {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      setUser(data);
    }
    fetchUser();
  }, [userId]); // Only re-run if userId changes
  
  if (!user) return <div>Loading...</div>;
  
  return <div>{user.name}</div>;
}
```

**Dependency Array:**
- `useEffect(() => {...})` - Runs after every render
- `useEffect(() => {...}, [])` - Runs once after initial render
- `useEffect(() => {...}, [dep1, dep2])` - Runs when dependencies change

**Cleanup:**
```tsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  // Cleanup function runs when component unmounts or before re-running effect
  return () => {
    clearInterval(timer);
  };
}, []);
```

## Contexts

Context provides a way to pass data through the component tree without having to pass props down manually at every level. It's useful for "global" data like themes, user authentication, or language preferences.

**Creating a Context:**
```tsx
import { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
```

**Providing Context:**
```tsx
function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Header />
      <MainContent />
    </ThemeContext.Provider>
  );
}
```

**Consuming Context:**
```tsx
function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext)!;
  
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </header>
  );
}
```

**Custom Hook for Context:**
```tsx
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Now use it:
function Header() {
  const { theme, toggleTheme } = useTheme();
  // ...
}
```

## State Management

React components manage their own state using `useState`. State flows down from parent to child via props.

**Local State:**
```tsx
function Counter() {
  const [count, setCount] = useState(0);
  // This state is local to Counter component
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**Lifting State Up:**
When multiple components need to share state, lift it to their common parent:

```tsx
function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <Counter count={count} onIncrement={() => setCount(count + 1)} />
      <Display count={count} />
    </div>
  );
}

function Counter({ count, onIncrement }: { count: number; onIncrement: () => void }) {
  return <button onClick={onIncrement}>{count}</button>;
}

function Display({ count }: { count: number }) {
  return <p>Count: {count}</p>;
}
```

**State Management Patterns:**
- **Local state**: Use `useState` for component-specific data
- **Shared state**: Lift state to common parent or use Context
- **Global state**: Use Context API or state management libraries (Redux, Zustand)
- **Server state**: Use libraries like React Query or SWR

## Component Communication

Components communicate through:
1. **Props (Parent → Child)**: Pass data and callbacks down
2. **Context (Any level)**: Share data across the tree
3. **Events/Callbacks (Child → Parent)**: Pass functions as props

**Parent → Child (Props):**
```tsx
function Parent() {
  const [message, setMessage] = useState('Hello');
  
  return <Child message={message} />;
}

function Child({ message }: { message: string }) {
  return <p>{message}</p>;
}
```

**Child → Parent (Callbacks):**
```tsx
function Parent() {
  const [count, setCount] = useState(0);
  
  const handleIncrement = () => {
    setCount(count + 1);
  };
  
  return <Child onIncrement={handleIncrement} count={count} />;
}

function Child({ onIncrement, count }: { onIncrement: () => void; count: number }) {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
}
```

**Sibling Components (via Parent):**
```tsx
function App() {
  const [sharedData, setSharedData] = useState('');
  
  return (
    <div>
      <Input onUpdate={setSharedData} />
      <Display data={sharedData} />
    </div>
  );
}

function Input({ onUpdate }: { onUpdate: (value: string) => void }) {
  return <input onChange={(e) => onUpdate(e.target.value)} />;
}

function Display({ data }: { data: string }) {
  return <p>{data}</p>;
}
```

**Using Context for Deep Communication:**
```tsx
// Instead of prop drilling through many levels:
function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Header /> {/* Needs theme, 3 levels deep */}
      </Layout>
    </ThemeProvider>
  );
}

// Header can access theme directly:
function Header() {
  const { theme } = useTheme(); // No props needed!
  return <header className={theme}>Header</header>;
}
```

> **Note:** This guide assumes familiarity with TypeScript basics and common JavaScript patterns used in React. If you need a refresher, see the [TypeScript & JavaScript Patterns Guide](frontend-01-typescript-js-patterns).

## Resources

- [TypeScript & JavaScript Patterns Guide](frontend-01-typescript-js-patterns) - Essential TypeScript and JS patterns for React
- <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React Documentation</a>
- <a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener noreferrer">TypeScript Handbook</a>
- <a href="https://reactrouter.com/" target="_blank" rel="noopener noreferrer">React Router</a>
- [Mantine UI Components Guide](mantine) - Component library used in the starter code
