---
title: "React Architecture"
start_date: "2026-02-10"
type: "activity"
draft: 0
heading_max_level: 3
---

React feels like “a lot” at first. Today you’ll build one small page from scratch, connect it to the backend, and learn just enough architecture to keep going.

**Assigned reading (use these while you work):**
- [Intro to React](/spring2026/resources/web-ui-01-intro-to-react)
- [TypeScript & JavaScript Patterns](/spring2026/resources/web-ui-02-typescript-js-patterns)
- [Front-End Design with Mantine UI & Tailwind](/spring2026/resources/web-ui-03-mantine-tailwind)
- [Testing with Vitest](/spring2026/resources/web-ui-04-testing)

## 1. Goal

By the end of this lesson, you should be able to:

- Fetch real data from the backend in React.
- Explain and implement UI states: loading / error / empty / success.
- Explain how authentication works in this app at a high level.


## 2. AuthContext (guided reading)

### 2.1. Open `AuthContext`

Open `ui/src/contexts/AuthContext.tsx`, then find:

- Auth state (`isAuthenticated`, `userInfo`, `loading`)
- API base URL (`API_URL`)
- Token storage (`localStorage` key `auth_token`)
- Page load behavior (a `useEffect` calls `checkAuthentication()` and hits `/auth/me`)

### 2.2. Open `ProtectedRoute`

Open `ui/src/components/auth/ProtectedRoute.tsx`, then answer:

- What happens while `loading` is true?
- What happens if you’re not authenticated?
- What happens if you’re authenticated but lack a required role?

Then open `ui/src/App.tsx` and find one real usage of `ProtectedRoute` (copy the route path it is protecting).

## 3. Task (individual)

### 3.1. Branch

- Create a branch: `scratch/<yourname>-react-practice`.

### 3.2. Build one minimal list page

Pick one (Modules if available; otherwise Groups or Courses).

### 3.3. Recreate an existing endpoint (recommended: Groups)

Use the backend endpoint:

- `GET /api/groups` (authenticated)

That means your fetch URL should look like:

- `${API_URL}/groups`

### 3.4. Starter code (copy/paste)

Create a new page component (your team will agree on the exact file + route), and start from this:

```tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function PracticeGroupsPage() {
  const { API_URL } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${API_URL}/groups`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error('Failed to fetch groups');
        setItems(await res.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [API_URL]);

  // UI states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (items.length === 0) return <div>No groups found.</div>;

  return (
    <div>
      <h1>Groups</h1>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
}
```

> #### Summary of the Code Above
> 
> - Adds state: `items`, `loading`, `error`.
> - Fetches once on mount (`useEffect`).
> - Renders UI states:
>   - loading
>   - error
>   - empty
>   - success (render list)
> - Uses `useAuth()` to get `API_URL` for your request.

### 3.5. How to test your page (run + route)

- Access the front end web server from Docker (probably runs on port 5432)
- Log in at `/login`.
- Add a route to your page in `ui/src/App.tsx`:
  - Import your page component near the other imports.
  - Add a new `<Route ... />` near the other “User routes”.
  - Tip: copy the `/dashboard/user/groups` route and change the `path` + page component.
- Visit your route in the browser and confirm you see:
  - Loading, then either JSON data or an empty state.
  - If you get a 401/403, log in again and refresh.

### 3.6. Pick 1-2 enhancements to complete:

1. Replace the `<pre>` with a real list (`<ul><li>...</li></ul>`).
1. Add a simple search filter (`filter(...)`) and conditional rendering.
1. Extract `ItemsList` as a child component that receives `items` as props.
1. Swap one HTML element for Mantine (`Button`, `Alert`, or `Loader`).
1. Add one CRUD action (pick one):

    - Create: add a small form and call `POST /api/groups`
    - Edit: add an “Edit” button per item and call `PATCH /api/groups/{id}`
    - Delete: add a “Delete” button per item and call `DELETE /api/groups/{id}`
    - Note: these endpoints may require an admin/manager role (if you get 403, that’s expected).



## 4. Turn-in (end of class)
- Open a PR (do not merge).
- In the PR description:
  - Endpoint called (method + path)
  - UI states handled
  - Enhancement(s) that you made


--- 

## Appendix

### 1. Notes on Contexts in React
React Context solves a simple problem: sometimes lots of components need the same data, and passing it through props level-by-level is annoying.

#### The pieces in this app

- **`AuthContext`**: the *shared shape* (what auth data/functions exist), like:
  - `isAuthenticated`, `userInfo`, `API_URL`
  - functions like `login()` and `logout()`
- **`AuthProvider`**: the component that *creates and supplies the real values*
  - It wraps the app and renders `<AuthContext.Provider value={...}>`.
  - Inside it, you’ll see `useState`/`useEffect` used to track auth state and check the token.
- **`useAuth()`**: the helper hook that *reads the context*
  - It calls `useContext(AuthContext)` and returns the shared auth value.
  - If you call it outside an `AuthProvider`, it throws an error so you notice immediately.

- **Important rule**: to use a context, your component must be *wrapped by its Provider* somewhere above it in the component tree (for auth, that means the app must be inside `<AuthProvider>...</AuthProvider>`).

**Takeaway:** Context defines what’s shared, the provider supplies it, and `useAuth()` is how components read it.

### 2. Notes on `ProtectedRoute`

`ProtectedRoute` is a wrapper component used in `ui/src/App.tsx` to protect pages that require login (and sometimes a role).

- If auth is still loading: show a loading spinner.
- If you are not logged in: redirect to `/login`.
- If a page requires a role and you don’t have it: redirect to `/unauthorized`.
- Otherwise: render the page normally.

To see it in action, look in `ui/src/App.tsx` for routes wrapped like `<ProtectedRoute> ... </ProtectedRoute>` (for example, many `/dashboard/...` pages).