---
title: "React + TypeScript"
group: "Front-End"
group_order: 2
order: 1
---

## Overview

This guide covers **React** (UI library) and **TypeScript** (type safety) as used in the web frontend. For Mantine component library usage, see the [Mantine UI Components](mantine) guide.

## React Basics

React uses components to build user interfaces. Components are functions that return JSX.

### Component Structure

```typescript
import { useState } from 'react';

export default function UserForm() {
    const [username, setUsername] = useState('');
    
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Handle form submission
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
        </form>
    );
}
```

### State Management

```typescript
// Single value
const [count, setCount] = useState(0);

// Object state
const [user, setUser] = useState({ name: '', email: '' });

// Update object state
setUser({ ...user, name: 'John' });

// Array state
const [items, setItems] = useState<string[]>([]);
setItems([...items, 'new item']);
```

### Effects (Side Effects)

```typescript
import { useEffect, useState } from 'react';

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    
    useEffect(() => {
        // Runs after component mounts
        fetchUsers();
    }, []); // Empty array = run once on mount
    
    useEffect(() => {
        // Runs when userId changes
        fetchUser(userId);
    }, [userId]); // Dependencies array
    
    return <div>{/* render users */}</div>;
}
```

## TypeScript in React

TypeScript adds type safety to React components.

### Component Props

```typescript
interface UserCardProps {
    user: User;
    onEdit: (id: number) => void;
    showEmail?: boolean; // Optional prop
}

export default function UserCard({ user, onEdit, showEmail = false }: UserCardProps) {
    return (
        <div>
            <h3>{user.username}</h3>
            {showEmail && <p>{user.email}</p>}
            <button onClick={() => onEdit(user.id)}>Edit</button>
        </div>
    );
}
```

### Type Definitions

```typescript
// Define types for API responses
interface User {
    id: number;
    username: string;
    email: string;
    role: {
        id: number;
        name: string;
    };
}

// Use in components
const [user, setUser] = useState<User | null>(null);
```

### Event Handlers

```typescript
// Form submission
function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
}

// Input change
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
}

// Button click
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    // Handle click
}
```

## Using Mantine Components

The starter code uses **Mantine** for UI components. See the [Mantine UI Components](mantine) guide for detailed component usage, including:

- Layout components (Container, Stack, Grid, Paper)
- Form components (TextInput, PasswordInput, Select, Button)
- Feedback components (Alert, Notification)
- Data display (Table, Card, Badge)
- Navigation components
- Overlay components (Modal, Drawer)
- Mantine hooks (useDisclosure, useMediaQuery, useForm)

## Common Patterns

### Form Handling

```typescript
import { useState } from 'react';
import { TextInput, Button, Alert } from '@mantine/core';

export default function CreateUserForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        
        try {
            await createUser({ username, email });
            // Success - navigate or show message
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setSaving(false);
        }
    }
    
    return (
        <form onSubmit={handleSubmit}>
            {error && <Alert color="red">{error}</Alert>}
            <TextInput
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={saving}
            />
            <Button type="submit" loading={saving}>
                Create User
            </Button>
        </form>
    );
}
```

**Note:** For more advanced form handling with validation, see Mantine's `useForm` hook in the [Mantine guide](mantine).

### Data Fetching

```typescript
import { useState, useEffect } from 'react';

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                const data = await getAllUsers(API_URL);
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load users');
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);
    
    if (loading) return <LoadingSpinner />;
    if (error) return <Alert color="red">{error}</Alert>;
    
    return (
        <div>
            {users.map(user => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    );
}
```

### Navigation

```typescript
import { useNavigate } from 'react-router-dom';

export default function UserCard({ user }: { user: User }) {
    const navigate = useNavigate();
    
    function handleClick() {
        navigate(`/users/${user.id}/edit`);
    }
    
    return <div onClick={handleClick}>{/* card content */}</div>;
}
```

### Context API (Global State)

```typescript
// Create context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

// Use in components
function MyComponent() {
    const { user } = useAuth();
    return <div>Hello, {user?.username}</div>;
}
```

## Styling

### CSS-in-JS with Mantine

Mantine components accept style props directly:

```typescript
<Button style={{ marginTop: 16 }}>Styled Button</Button>
```

For more advanced styling, see the <a href="https://mantine.dev/styles/styles-api/" target="_blank" rel="noopener noreferrer">Mantine styling documentation</a>.

## File Structure

```
ui/src/
├── components/     # Reusable components
│   ├── layout/    # Layout components
│   └── users/     # Feature-specific components
├── pages/         # Page components (routes)
│   ├── users/
│   └── groups/
├── contexts/      # React contexts (global state)
├── hooks/         # Custom hooks
├── utils/         # Utility functions
└── types/         # TypeScript type definitions
```

## Key Concepts

1. **Components** = Reusable UI pieces
2. **State** = Component data that can change
3. **Props** = Data passed to components
4. **Effects** = Side effects (API calls, subscriptions)
5. **Context** = Global state shared across components
6. **TypeScript** = Type safety for props, state, and functions

## Common Mistakes

1. **Forgetting `key` prop** in lists: `{items.map(item => <Item key={item.id} />)}`
2. **Missing dependency array** in `useEffect`, causing infinite loops
3. **Not handling loading/error states** when fetching data
4. **Mutating state directly** - always use setter functions
5. **Forgetting `e.preventDefault()`** in form handlers

## Resources

- <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React Documentation</a>
- <a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener noreferrer">TypeScript Handbook</a>
- <a href="https://reactrouter.com/" target="_blank" rel="noopener noreferrer">React Router</a>
- [Mantine UI Components Guide](mantine) - Component library used in the starter code

