---
title: "Intro to React Native"
group: "Mobile UI"
group_order: 5
order: 1
---

## What is React Native?

**React Native** is a framework for building mobile applications using React. Instead of rendering to the web browser's DOM, React Native renders to native mobile components.

**Key Concept:**
- **React (Web)**: `div` → HTML `<div>` element
- **React Native**: `View` → Native iOS `UIView` or Android `View`

Both use the same React concepts (components, props, state, hooks), but the underlying rendering is completely different.

## React Native vs. Web React

### Similarities

Both use the same core React concepts:

- **Components** - Reusable UI pieces
- **Props** - Pass data to components
- **State** - Manage component data with `useState`, `useEffect`, etc.
- **Hooks** - Same hooks work in both (`useState`, `useEffect`, `useContext`, etc.)
- **JSX** - Same syntax for describing UI

### Key Differences

| Web React | React Native |
|-----------|--------------|
| Renders to **DOM** (HTML elements) | Renders to **native components** |
| Uses HTML tags: `<div>`, `<button>`, `<input>` | Uses React Native components: `<View>`, `<Button>`, `<TextInput>` |
| Styled with **CSS** | Styled with **StyleSheet** objects (JavaScript) |
| `className` prop | `style` prop |
| `onClick` events | `onPress`` events |
| Runs in **browser** | Runs as **native app** (iOS/Android) |

### Example Comparison

**Web React:**
```tsx
function Button() {
  return (
    <button 
      className="btn-primary"
      onClick={() => console.log('clicked')}
    >
      Click me
    </button>
  );
}
```

**React Native:**
```tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function Button() {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={() => console.log('pressed')}
    >
      <Text style={styles.buttonText}>Click me</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#009EB1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

**Or using React Native Paper (component library):**
```tsx
import { Button } from 'react-native-paper';

function Button() {
  return (
    <Button 
      mode="contained"
      onPress={() => console.log('pressed')}
    >
      Click me
    </Button>
  );
}
```

**Key differences:**
- No `className` - use `style` prop with StyleSheet objects
- `onPress` instead of `onClick`
- `style` prop takes a JavaScript object, not a CSS string
- Use `StyleSheet.create()` for better performance
- Components are from React Native or libraries, not HTML elements

## What is Expo?

**Expo** is a framework and platform built on top of React Native that makes mobile development easier.

### Why Expo?

**Without Expo (Bare React Native):**
- Need Xcode for iOS development (Mac only)
- Need Android Studio for Android development
- Complex native module setup
- Manual configuration for device features (camera, location, etc.)
- Build process is complicated

**With Expo:**
- **No native code required** - Write JavaScript/TypeScript only
- **Easy setup** - Works on Windows, Mac, and Linux
- **Built-in features** - Camera, location, file system, etc. work out of the box
- **Fast development** - Hot reload, easy device testing
- **Simple builds** - Build apps without Xcode/Android Studio

### Expo Features

- **Expo Router** - File-based routing where your folder structure determines navigation
- **Expo Go** - Test apps on real devices without building
- **Expo SDK** - Pre-built modules for common features:
  - `expo-secure-store` - Secure storage
  - `expo-file-system` - File operations
  - `expo-camera` - Camera access
  - `expo-location` - GPS/location
  - And many more!

## React Native Component Library
For our mobile client, instead of using Mantine (a design system for the web), we will be using **React Native Paper** -- a Material Design 3 component library for React Native. It provides pre-built, styled components that follow Google's Material Design guidelines.

For a complete guide to React Native Paper, including component examples and usage patterns, see the [React Native Paper Guide](./mobile-ui-03-paper).

## The Tech Stack

In this course, we use:

1. **React Native** - Core framework for mobile apps
2. **Expo** - Development platform and tooling
3. **Expo Router** - File-based routing (like Next.js)
4. **React Native Paper** - UI component library
5. **TypeScript** - Type safety
6. **React Query** - Data fetching and caching
7. **Fetch API** - HTTP client for API calls (native browser/React Native API)

## How It All Works Together

```bash
┌─────────────────────────────────────┐
│  Your React/TypeScript Code         │
│  (Components, Hooks, Logic)         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  React Native Paper Components      │
│  (Button, Card, TextInput, etc.)    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  React Native Core                  │
│  (View, Text, etc.)                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Expo Runtime                       │
│  (Bridges to native code)           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Native iOS/Android Components      │
│  (UIView, View, etc.)               │
└─────────────────────────────────────┘
```

## Key Concepts to Remember

### 1. No HTML/CSS

React Native doesn't use HTML or CSS. Instead:
- Use React Native components (`View`, `Text`, etc.)
- Style with JavaScript objects (StyleSheet API)
- Or use component library props (like Paper's `mode="contained"`)

### 2. Platform-Specific Code

Sometimes you need different code for iOS vs. Android:

```tsx
import { Platform } from 'react-native';

const padding = Platform.OS === 'ios' ? 20 : 10;
```

### 3. Navigation is Different

Web apps use URLs and browser navigation. Mobile apps use:
- **Stack navigation** - Push/pop screens (like browser history)
- **Tab navigation** - Bottom tabs (like browser tabs)
- **Drawer navigation** - Side menu

Expo Router handles this with file-based routing.

### 4. Async by Default

Many mobile APIs are async:
- Reading from storage
- Making network requests
- Accessing device features (camera, location)

Always use `async/await` or `.then()`.

## Learning Path

If you know React for web, you're already 80% there! The main differences are:

1. **Components** - Use Paper components instead of HTML
2. **Styling** - Use StyleSheet instead of CSS
3. **Navigation** - Use Expo Router instead of React Router
4. **Platform APIs** - Use Expo SDK instead of browser APIs

The React concepts (hooks, state, props, context) are exactly the same!

## Next Steps

Now that you understand what React Native, Expo, and Paper are, let's get your development environment set up. See the [Getting Started Guide](./mobile-ui-02-getting-started) for installation and configuration instructions.
