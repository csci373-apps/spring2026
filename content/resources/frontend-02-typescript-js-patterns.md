---
title: "TypeScript & JavaScript Patterns"
group: "Front-End"
group_order: 4
order: 2
---

## TypeScript Basics

TypeScript is a superset of JavaScript that adds static type checking. It helps catch errors before runtime and makes code more maintainable.

**Why TypeScript with React?**

- **Type Safety**: Catch errors during development, not in production
- **Better IDE Support**: Autocomplete, refactoring, and navigation
- **Self-Documenting**: Types serve as documentation
- **Refactoring Confidence**: Types help ensure changes don't break code

**Basic TypeScript Types:**

```tsx
// Primitive types
const name: string = "Alice";
const age: number = 25;
const isActive: boolean = true;

// Arrays
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ["Alice", "Bob"];

// Objects
interface User {
  name: string;
  age: number;
  email?: string; // Optional property
}

const user: User = {
  name: "Alice",
  age: 25
};
```

**TypeScript with React Props:**

```tsx
// Inline types
function Greeting({ name, age }: { name: string; age: number }) {
  return <h1>Hello, {name}! You are {age} years old.</h1>;
}

// Interface (recommended for reusable types)
interface GreetingProps {
  name: string;
  age: number;
  email?: string;
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

**Type Inference:**

TypeScript can often infer types automatically:

```tsx
const count = 0; // TypeScript infers: number
const name = "Alice"; // TypeScript infers: string
const [value, setValue] = useState(0); // TypeScript infers: [number, React.Dispatch<React.SetStateAction<number>>]
```

## Common JavaScript Patterns in React

### Destructuring

Destructuring lets you extract values from arrays or properties from objects into distinct variables.

**Object Destructuring:**

```tsx
// Instead of:
const name = user.name;
const age = user.age;

// Use destructuring:
const { name, age } = user;

// With renaming:
const { name: userName, age: userAge } = user;

// With default values:
const { name, age = 0 } = user;

// In function parameters (very common in React):
function UserCard({ name, age, email }: { name: string; age: number; email?: string }) {
  return <div>{name}, {age}</div>;
}
```

**Array Destructuring:**

```tsx
// useState returns an array, so we destructure it:
const [count, setCount] = useState(0);
const [name, setName] = useState('');
const [user, setUser] = useState(null);

// Destructuring arrays:
const [first, second, third] = [1, 2, 3];
const [first, ...rest] = [1, 2, 3, 4]; // first = 1, rest = [2, 3, 4]
```

### Spread Operator

The spread operator (`...`) expands arrays or objects into individual elements.

**Spreading Arrays:**

```tsx
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Adding to an array:
const newArray = [...arr1, 4]; // [1, 2, 3, 4]
```

**Spreading Objects:**

```tsx
const user = { name: "Alice", age: 25 };
const updatedUser = { ...user, age: 26 }; // { name: "Alice", age: 26 }

// Merging objects:
const defaults = { theme: "light", lang: "en" };
const settings = { ...defaults, theme: "dark" }; // { theme: "dark", lang: "en" }

// In React, updating state immutably:
const [user, setUser] = useState({ name: "Alice", age: 25 });
setUser({ ...user, age: 26 }); // Update age while keeping other properties
```

**Spreading Props:**

```tsx
const props = { name: "Alice", age: 25, email: "alice@example.com" };
<UserCard {...props} /> // Spreads all props to UserCard
```

### Conditional Rendering

React components can conditionally render content based on state or props.

**Ternary Operator:**

```tsx
function Greeting({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div>
      {isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please log in</h1>}
    </div>
  );
}

// With multiple conditions:
function Status({ count }: { count: number }) {
  return (
    <div>
      {count === 0 ? (
        <p>No items</p>
      ) : count === 1 ? (
        <p>1 item</p>
      ) : (
        <p>{count} items</p>
      )}
    </div>
  );
}
```

**Logical AND (&&) Operator:**

```tsx
function UserProfile({ user }: { user: User | null }) {
  return (
    <div>
      {user && <div>Welcome, {user.name}!</div>}
      {/* Only renders if user is truthy */}
    </div>
  );
}

// Multiple conditions:
function Dashboard({ user, isAdmin }: { user: User | null; isAdmin: boolean }) {
  return (
    <div>
      {user && <UserInfo user={user} />}
      {isAdmin && <AdminPanel />}
      {user && isAdmin && <AdminControls />}
    </div>
  );
}
```

**Important Note:** Be careful with `&&` - if the left side is `0` or an empty string, React will render that value. Use ternary for numbers:

```tsx
// ❌ Bad - renders "0" if count is 0
{count && <div>You have {count} items</div>}

// ✅ Good
{count > 0 && <div>You have {count} items</div>}
// or
{count ? <div>You have {count} items</div> : null}
```

**Early Returns:**

```tsx
function UserProfile({ user }: { user: User | null }) {
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Template Literals

Template literals use backticks and `${}` for string interpolation:

```tsx
const name = "Alice";
const greeting = `Hello, ${name}!`; // "Hello, Alice!"

// In JSX:
function Greeting({ firstName, lastName }: { firstName: string; lastName: string }) {
  return <h1>Hello, {`${firstName} ${lastName}`}!</h1>;
}
```

### Arrow Functions

Arrow functions are commonly used in React for event handlers and callbacks:

```tsx
// Regular function:
function handleClick() {
  console.log('Clicked');
}

// Arrow function:
const handleClick = () => {
  console.log('Clicked');
};

// In JSX:
<button onClick={() => setCount(count + 1)}>Click me</button>
<button onClick={handleClick}>Click me</button>

// With parameters:
<button onClick={(e) => handleClick(e)}>Click me</button>
```

### Optional Chaining

Optional chaining (`?.`) safely accesses nested properties:

```tsx
const user = { profile: { name: "Alice" } };

// Without optional chaining (error if profile is null):
const name = user.profile.name; // Error if profile is null/undefined

// With optional chaining:
const name = user.profile?.name; // Returns undefined if profile is null/undefined

// In React:
function UserCard({ user }: { user: User | null }) {
  return <div>{user?.profile?.name || "Unknown"}</div>;
}
```

## Resources

- <a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener noreferrer">TypeScript Handbook</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment" target="_blank" rel="noopener noreferrer">MDN: Destructuring Assignment</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax" target="_blank" rel="noopener noreferrer">MDN: Spread Syntax</a>
- [React + TypeScript Guide](frontend-02-intro-to-react) - How to use these patterns with React

