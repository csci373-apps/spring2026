---
title: "Mobile App Workflow"
group: "Mobile UI"
group_order: 5
order: 4
heading_max_level: 3
---

This guide explains how the mobile app works from a workflow perspective -- how components, navigation, authentication, and data fetching all work together to create a functional mobile application.

## Quick Overview

When the mobile app starts, here's what happens:

1. **App Initializes** → Providers set up (auth, theme, data fetching, error handling)
2. **Auth Check** → App checks for stored authentication token
3. **Route Decision** → If authenticated → tabs; if not → login screen
4. **User Interacts** → Navigation between screens, fetching data as needed
5. **Data Updates** → React Query automatically caches and manages server data
6. **State Changes** → Components re-render with new data

The app uses:
- **Expo Router** for file-based navigation
- **React Query** for server data fetching and caching
- **React Context** for global authentication state
- **Service Layer** for organized API calls

## 1. App Initialization

When the app starts, it goes through a specific initialization sequence:

### 1.1. Root Layout (`app/_layout.tsx`)

The root layout sets up the app's provider hierarchy:

```tsx
<SafeAreaProvider>
  <ErrorBoundary>
    <PaperProvider theme={appTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack>
            {/* Routes */}
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </PaperProvider>
  </ErrorBoundary>
</SafeAreaProvider>
```

**Provider Order (from outside in):**
1. **SafeAreaProvider** - Handles safe areas (notches, status bars)
2. **ErrorBoundary** - Catches and displays errors gracefully
3. **PaperProvider** - Provides React Native Paper theme
4. **QueryClientProvider** - Provides React Query for data fetching
5. **AuthProvider** - Manages authentication state
6. **Stack** - Expo Router navigation

**What each provider does:**
- `AuthProvider` → Authentication state (user, login, logout)
- `QueryClientProvider` → React Query for data fetching
- `PaperProvider` → React Native Paper theme
- `SafeAreaProvider` → Safe area insets for notches/status bars

> **Note:** See [Reference: Deep Dives](#reference-deep-dives) for detailed explanations of providers and provider order.

### 1.2. Entry Point (`app/index.tsx`)

The entry point checks authentication and routes accordingly:

```tsx
export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth check

    if (user) {
      router.replace('/(tabs)/home'); // Authenticated → tabs
    } else {
      router.replace('/(auth)/home'); // Not authenticated → auth
    }
  }, [user, loading]);
}
```

**Flow:**
1. App loads → `index.tsx` renders
2. `AuthProvider` checks for stored token. If the token exists → fetch user data
3. If authenticated → navigate to `/(tabs)/home`
4. If not authenticated → navigate to `/(auth)/home`

**Note:** `AuthProvider` is only available because the Stack is wrapped in `<AuthProvider>` (defined in `_layout.tsx`). If `AuthProvider` is removed or placed outside the `<Stack>`, this will throw an error.

## 2. Authentication Flow

### 2.1. Login Process

1. **User enters credentials** in `app/(auth)/login.tsx`
2. **Calls `login()` from `AuthContext`**:
   ```tsx
   const { login } = useAuth();
   await login(username, password);
   ```
3. **AuthContext makes API call**:
   ```tsx
   const response = await apiClient.post(
        '/api/auth/login', { username, password }
   );
   ```
4. **Token stored securely**:
   ```tsx
   // SecureStore (native) or localStorage (web)
   await setItem('auth_token', token); 
   ```
5. **User data fetched and stored**:
   ```tsx
   const userResponse = await apiClient.get('/api/auth/me');
   setUser(userResponse.data);
   ```
6. **Navigation updates** - Router automatically navigates to tabs

### 2.2. Protected Routes

Screens that require authentication (e.g., `tabs/courses.tsx`) use the `ProtectedRoute` component:

```tsx
<ProtectedRoute>
  <YourScreen />
</ProtectedRoute>
```

**How it works:**
- Checks if user is authenticated
- If not → redirects to login
- If yes → renders the screen

### 2.3. Token Management

- **Storage**: Tokens stored in `SecureStore` (native) or `localStorage` (web)
- **Automatic inclusion**: API client automatically adds token to request headers
- **Refresh**: `AuthContext` checks token validity on app start
- **Logout**: Removes token and clears user state

## 3. Navigation

The app uses **Expo Router** for file-based routing.

### 3.1. Route Groups

- **`(auth)/`** - Authentication screens (login, home)
- **`(tabs)/`** - Main app screens with tab navigation

### 3.2. Tab Navigation

The `(tabs)/_layout.tsx` defines the bottom tab bar:

```tsx
<Tabs>
  <Tabs.Screen name="home" />
  <Tabs.Screen name="groups" />
  <Tabs.Screen name="courses" />
  <Tabs.Screen name="progress" />
  <Tabs.Screen name="profile" />
  
  {/* Detail screens - hidden from tab bar */}
  <Tabs.Screen name="courses/[id]" options={{ href: null }} />
</Tabs>
```

**Key Points:**
- Main tabs appear in bottom navigation
- Detail screens (like `courses/[id]`) are hidden from tab bar but still accessible
- Dynamic routes use `[id]` syntax

### 3.3. Navigation Patterns

**Navigate to a tab:**
```tsx
router.push('/(tabs)/courses');
```

**Navigate to a detail screen:**
```tsx
router.push(`/(tabs)/courses/${courseId}`);
```

**Navigate back:**
```tsx
router.back();
```

**Replace current screen:**
```tsx
router.replace('/(tabs)/home');
```

### 3.4. Screen Workflow Example

Let's trace through viewing a course:

**1. User Taps Course Card**

```tsx
// In courses.tsx
<TouchableOpacity
  onPress={() => router.push(`/(tabs)/courses/${course.id}`)}
>
  <CourseCard course={course} />
</TouchableOpacity>
```

**2. Course Detail Screen Loads**

```tsx
// In courses/[id].tsx
export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  
  const { data: course } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseDetail(Number(id)),
  });
  
  // Render course details
}
```

**3. Data Fetching Flow**

1. React Query checks cache for `['course', id]`
2. If not cached → calls `getCourseDetail(id)`
3. Service function makes API call: `apiClient.get('/api/courses/${id}')`
4. API client adds auth token to headers
5. Response cached and component re-renders

**4. User Navigates to Module**

```tsx
<TouchableOpacity
  onPress={() => router.push(`/(tabs)/modules/${module.module_id}`)}
>
  <ModuleCard module={module} />
</TouchableOpacity>
```

## 4. Data Fetching

The app uses **React Query** (TanStack Query) for all server data fetching.

### 4.1. What is React Query?

React Query is a data-fetching library that simplifies fetching, caching, and updating server state. Instead of manually managing loading states, error handling, and caching with `useState` and `useEffect`, React Query handles this automatically.

**Key Benefits:**
- **Automatic Caching** - Data is cached and reused across components
- **Loading & Error States** - Automatically tracked for you
- **Background Refetching** - Keeps data fresh automatically
- **Deduplication** - Multiple requests for the same data = one network call

> **Note:** See [Reference: Deep Dives](#reference-deep-dives) for a detailed explanation of React Query features.

### 4.2. Basic Pattern

```tsx
import { useQuery } from '@tanstack/react-query';
import { getUserCourses } from '../../services/courses';

export default function CoursesScreen() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userCourses'],
    queryFn: getUserCourses,
  });

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error loading courses</Text>;

  return (
    // Render courses
  );
}
```

### 4.3. Query Keys

Query keys identify cached data:
- `['userCourses']` - List of user's courses
- `['course', courseId]` - Specific course details
- `['groups']` - List of groups

### 4.4. Service Layer

API calls are organized in the `services/` directory:

```bash
services/
  ├── api.ts          # Base API client
  ├── courses.ts      # Course-related API calls
  ├── groups.ts       # Group-related API calls
  ├── posts.ts        # Post-related API calls
  ├── progress.ts     # Progress-related API calls
  └── users.ts        # User-related API calls
```

**Example service function:**
```tsx
// services/courses.ts
export async function getUserCourses(): Promise<Course[]> {
  const response = await apiClient.get<Course[]>('/api/courses/');
  return response.data;
}
```

**Used in components:**
```tsx
const { data: courses } = useQuery({
  queryKey: ['userCourses'],
  queryFn: getUserCourses, // Service function
});
```

### 4.5. API Client

The `services/api.ts` file provides a centralized API client:

**Features:**
1. **Automatic token inclusion** - Adds auth token to headers
2. **Platform-aware URL** - Handles emulator vs. physical device networking
3. **Error handling** - Standardized error responses
4. **Request/response interceptors** - Logging and error transformation

**Usage:**
```tsx
import apiClient from '../services/api';

// GET request
const response = await apiClient.get<User>('/api/auth/me');

// POST request
const response = await apiClient.post<Token>('/api/auth/login', {
  username,
  password,
});
```

## 5. State Management

The app uses a hybrid approach:

### 5.1. React Context (Auth State)

- **What**: Authentication state (user, token)
- **Where**: `contexts/AuthContext.tsx`
- **Why**: Global state needed across all screens
- **Usage**: `const { user, login, logout } = useAuth();`

### 5.2. React Query (Server State)

- **What**: Data from API (courses, groups, posts)
- **Where**: Cached by React Query
- **Why**: Automatic caching, refetching, synchronization
- **Usage**: `const { data } = useQuery({ ... });`

### 5.3. Local State (Component State)

- **What**: UI state (form inputs, modals, loading)
- **Where**: `useState` in components
- **Why**: Component-specific, doesn't need sharing
- **Usage**: `const [isOpen, setIsOpen] = useState(false);`

## 6. Error Handling

### 6.1. API Errors

The API client handles errors consistently:

```tsx
try {
  const response = await apiClient.get('/api/courses');
} catch (error) {
  if (error instanceof ApiError) {
    // Handle API error (401, 404, 500, etc.)
    console.error('API Error:', error.status, error.message);
  }
}
```

### 6.2. React Query Errors

React Query provides error states:

```tsx
const { data, error, isLoading } = useQuery({ ... });

if (error) {
  return <Text>Error: {error.message}</Text>;
}
```

### 6.3. Global Error Boundary

The `ErrorBoundary` component catches unhandled errors:

```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## 7. Common Patterns

### 7.1. Pull-to-Refresh

Pull-to-refresh allows users to manually refresh data by dragging down on a scrollable list. This is a common mobile pattern that gives users control over when to fetch fresh data from the server.

```tsx
const { data, refetch, isRefetching } = useQuery({ ... });

<ScrollView
  refreshControl={
    <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
  }
>
  {/* Content */}
</ScrollView>
```

### 7.2. Loading States

Loading states show users that data is being fetched, preventing confusion when the screen appears empty or unresponsive. React Query's `isLoading` flag makes it easy to display a spinner or skeleton screen while data loads.

```tsx
const { data, isLoading } = useQuery({ ... });

if (isLoading) {
  return <ActivityIndicator />;
}
```

### 7.3. Empty States

Empty states are displayed when a list or data collection has no items to show. Instead of showing a blank screen, you can provide helpful messaging that explains why there's no data and what the user can do next.

```tsx
if (!data || data.length === 0) {
  return <Text>No courses found</Text>;
}
```

## 8. Reference: Deep Dives

### 8.1. What is a Provider?

A **provider** is a React component that uses React Context to make data or functionality available to all its child components. Instead of passing data through props at every level, providers allow you to:

1. **Wrap your app** with a provider component
2. **Share data/functions** with any child component that needs it
3. **Access the data** using hooks like `useContext()` or custom hooks (e.g., `useAuth()`)

**Example:**

```jsx
// Provider wraps the app
<AuthProvider>
  <App />
</AuthProvider>

// Any child component can access auth data
function MyComponent() {
  const { user, login } = useAuth(); // Gets data from AuthProvider
  // ...
}
```

### 8.2. Does Provider Order Matter?

Yes, but with some flexibility:

**Critical Rules:**
- **ErrorBoundary** must be high in the tree to catch errors from providers below it
- **Stack** must be inside all providers so screens can access all contexts
- If Provider A uses hooks from Provider B, Provider B must wrap Provider A

**Flexible Order:**
- `SafeAreaProvider`, `PaperProvider`, `QueryClientProvider`, and `AuthProvider` can be reordered as long as they all wrap `Stack`
- These providers don't depend on each other, so their relative order doesn't matter

**In This App:**
- All providers wrap `Stack`
- `ErrorBoundary` is high enough to catch errors
- No provider depends on another provider's context
- The current order is a good convention but not strictly required

### 8.3. React Query: Detailed Features

React Query provides:

- **Automatic Caching**: Data fetched from the API is automatically cached. If you request the same data again (using the same query key), React Query returns the cached data instantly while optionally refetching in the background to ensure freshness.

- **Loading & Error States**: React Query automatically tracks whether data is loading, has loaded successfully, or encountered an error, eliminating the need to manually manage these states.

- **Background Refetching**: React Query can automatically refetch data in the background when the app regains focus, when the network reconnects, or at specified intervals, keeping your data fresh without user interaction.

- **Deduplication**: If multiple components request the same data simultaneously, React Query makes only one network request and shares the result, preventing unnecessary API calls.

- **Optimistic Updates**: You can update the UI immediately before the server responds, then roll back if the request fails, providing a snappier user experience.

Think of React Query as a "smart data layer" that sits between your React components and your API, handling all the complex state management, caching, and synchronization logic so you can focus on building your UI.

## Summary

**App Flow:**
1. App initializes → Providers set up
2. Auth check → Token validation
3. Route decision → Authenticated or login screen
4. User interacts → Navigation and data fetching
5. Data updates → React Query manages cache
6. State changes → Components re-render

**Key Technologies:**
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - File-based navigation
- **[React Query](https://tanstack.com/query/latest/docs/react/overview)** - Server state management
- **[React Context](https://react.dev/reference/react/createContext)** - Global auth state
- **[React Native Paper](https://callstack.github.io/react-native-paper/)** - UI components
- **[SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)** - Secure token storage

**Best Practices:**
- Use React Query for all server data
- Use Context only for truly global state (auth)
- Use local state for component-specific UI
- Organize API calls in service layer
- Protect routes that require authentication
- Handle loading and error states
