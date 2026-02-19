---
title: "React Native + Expo"
start_date: "2026-02-19"
type: "activity"
draft: 0
---


## Learning Objectives

By the end of this session, students will:
- Understand React Native vs React: similarities and differences
- Understand what Expo is and why we use it
- Be able to set up an Expo project
- Understand the structure of a React Native app
- Reflect on what they learned from HW4 (frontend integration)


## React Native vs React

#### What is React Native?

React Native enables the development of mobile applications using React. Applications are written in JavaScript or TypeScript and execute on both iOS and Android platforms. React Native utilizes native components rather than web components, maintaining conceptual similarity to React while incorporating mobile-specific differences.

**Key Point:** React Native applies React concepts to mobile development, using the same fundamental principles but with different component implementations.

#### Similarities

The following similarities exist between React (web) and React Native (mobile):

1. **Component-based architecture:**
   - Identical component model
   - Props and state function identically
   - Equivalent lifecycle concepts

2. **Hooks:**
   - useState and useEffect function identically
   - Custom hooks function identically
   - Context API functions identically

3. **TypeScript:**
   - Identical type system
   - Equivalent interfaces and types
   - Equivalent benefits

4. **State management:**
   - Local state (useState)
   - Global state (Context)
   - Equivalent patterns

**Example:**

```typescript
// React (Web)
function Button({ title, onPress }) {
  return <button onClick={onPress}>{title}</button>;
}

// React Native (Mobile)
function Button({ title, onPress }) {
  return <Pressable onPress={onPress}><Text>{title}</Text></Pressable>;
}

// Identical component logic, different component implementations
```

**Key Point:** The React concepts previously covered apply to mobile development as well.

#### Differences

The following differences exist:

1. **Components:**
   - Web: `<div>`, `<button>`, `<input>`
   - Mobile: `<View>`, `<Pressable>`, `<TextInput>`
   - No HTML elements in React Native
   - Learn more: <a href="https://reactnative.dev/docs/components-and-apis" target="_blank" rel="noopener noreferrer">React Native Core Components</a>

2. **Styling:**
   - Web: CSS or CSS-in-JS
   - Mobile: StyleSheet API (similar to CSS but different)
   - Flexbox is the primary layout system

3. **Navigation:**
   - Web: URL-based routing (React Router)
   - Mobile: Stack/Tab navigation (React Navigation or Expo Router)
   - Different navigation patterns

4. **Platform differences:**
   - iOS and Android exhibit different behaviors
   - Platform-specific code may be required
   - Testing must be performed on both platforms

**Example:**

```typescript
// Web: CSS
<div style={{ padding: 20, backgroundColor: 'blue' }}>

// Mobile: StyleSheet
<View style={styles.container}>
  // styles.container = { padding: 20, backgroundColor: 'blue' }
</View>

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'blue',
  },
});
```

**Key Point:** Mobile uses different components and styling, but the React patterns are the same.


## Expo Setup & Structure

#### What is Expo?

Expo is a framework for React Native that simplifies development and deployment. It provides tools and services, including file-based routing (Expo Router) and built-in components and APIs.

**Advantages of Expo:**
- Simplified setup (no native code required initially)
- Rapid development (hot reload, simplified testing)
- Built-in features (camera, location, etc.)
- Streamlined deployment

**Key Point:** Expo simplifies React Native development.

#### Set Up Expo Project

Collaborate with your team to set up Expo by following these steps:

1. **Check prerequisites:**
   ```bash
   node --version  # Should be 18.x or 20.x
   npm --version
   ```

2. **Install Expo CLI (if needed):**
   ```bash
   npm install -g expo-cli
   # Or use npx (no install needed)
   ```

3. **Create new project (or use existing):**
   ```bash
   npx create-expo-app@latest MyApp --template
   # Or navigate to existing mobile/ directory
   cd mobile
   ```

4. **Start development server:**
   ```bash
   npm start
   # Or
   npx expo start
   ```

5. **Run on device/simulator:**
   - Scan QR code with Expo Go app (physical device)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web

**Key Point:** Expo facilitates testing on physical devices and simulators.

#### Understand Project Structure

The typical structure of an Expo Router project consists of the following:

```bash
mobile/
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Route group (auth screens)
│   │   └── login.tsx      # Login screen
│   ├── (tabs)/            # Route group (tab navigation)
│   │   ├── _layout.tsx    # Tab layout
│   │   ├── groups.tsx      # Groups tab
│   │   └── courses.tsx    # Courses tab
│   └── _layout.tsx         # Root layout
├── components/            # Reusable components
├── contexts/              # React Contexts
├── services/              # API services
├── types/                 # TypeScript types
├── utils/                 # Utility functions
├── package.json
└── app.json               # Expo configuration
```

**Key concepts:**
- **File-based routing:** Files in `app/` become routes
- **Route groups:** `(auth)` and `(tabs)` are groups (not routes)
- **Layouts:** `_layout.tsx` files define navigation structure
- **Components:** Reusable UI pieces
- **Services:** API calls and business logic

**Example:**

```typescript
// app/(tabs)/groups.tsx
// This becomes the /groups route in tab navigation

export default function GroupsScreen() {
  return (
    <View>
      <Text>Groups</Text>
    </View>
  );
}
```

Examine the existing codebase structure to observe these concepts in practice.

**Key Point:** Expo Router employs file-based routing, where files automatically become routes.


## Code Walkthrough

The mobile app follows a standard Expo Router structure:

- **`app/`** - Expo Router file-based routing. Files here become routes automatically:
  - `(auth)/` - Authentication screens (login, home)
  - `(tabs)/` - Tab navigation screens (courses, groups, profile, etc.)
  - `[id].tsx` files - Dynamic routes (e.g., `/courses/123`)

- **`components/`** - Reusable UI components (ErrorBoundary, ProtectedRoute, InfoBadge)

- **`contexts/`** - React Context providers (AuthContext for user authentication)

- **`services/`** - API service functions organized by resource (courses, groups, posts, etc.)

- **`types/`** - TypeScript type definitions for API responses and app data

- **`utils/`** - Utility functions (type guards, storage helpers)

- **`theme.ts`** - React Native Paper theme configuration with design tokens

- **`App.tsx`** - Root component (minimal in Expo Router, routing handled by `app/_layout.tsx`)


## Intro to Homework 5
* [Homework 5](/spring2026/assignments/hw05)