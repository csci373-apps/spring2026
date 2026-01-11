---
title: "React Native + Expo"
start_date: "2026-02-17"
type: "activity"
---


## Learning Objectives

By the end of this session, students will:
- Understand React Native vs React: similarities and differences
- Understand what Expo is and why we use it
- Be able to set up an Expo project
- Understand the structure of a React Native app
- Reflect on what they learned from HW4 (frontend integration)


## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:15 | Reflection on HW4 | Review frontend integration experience |
| 0:15-0:35 | React Native vs React | Similarities and differences |
| 0:35-1:05 | Expo Setup & Structure | Set up Expo project, understand structure |
| 1:05-1:20 | Mobile vs Web Discussion | How is mobile different? What's the same? |
| 1:20-1:30 | Q&A & Wrap-up | Questions, preview homework |


## Detailed Instructions

### Part 1: Reflection on HW4 (15 minutes)

#### Check-in (3 minutes)
1. **Welcome back**
2. **Quick check:** "Raise your hand if:"
   - You completed HW4 (frontend integration)
   - You received feedback on your PR
   - You have questions about React or frontend

#### Reflection Activity: Frontend Integration (7 minutes)

**Instructor asks teams to discuss:**

1. **What did you build?**
   - What feature did you implement?
   - What was the UI flow?
   - What components did you create?

2. **What was different about frontend?**
   - How was it different from backend?
   - What was easier? What was harder?
   - What skills transferred?

3. **What clicked?**
   - What React concepts make sense now?
   - What patterns do you understand?
   - What feels natural?

4. **What's still confusing?**
   - What concepts are unclear?
   - What questions do you have?
   - What would help?

**Instructor asks 2-3 teams to share:**
- One thing that was different about frontend
- One thing that clicked
- One question they have

**Common insights to highlight:**
- "Frontend is more visual and interactive"
- "State management is different from backend"
- "TypeScript helps catch errors"
- "Context makes global state easier"
- "Hooks take practice but are powerful"

**Key Point:** "Frontend has different concerns than backend. Now we'll see how mobile is similar and different."

#### Reflection Activity: Code Review (5 minutes)

**Instructor asks teams to discuss:**

1. **What feedback did you receive?**
   - Was it helpful?
   - Did it change your approach?
   - What did you learn?

2. **What feedback did you give?**
   - Did you focus on frontend concerns?
   - Was your feedback constructive?
   - What would you do differently?

**Instructor:** Highlight good review practices, address common issues

**Key Point:** "Code review helps us learn. We'll continue this with mobile."

**Transition:** "Now let's learn about React Native..."


### Part 2: React Native vs React (20 minutes)

#### What is React Native? (5 minutes)

**Instructor explains:**
- React Native lets you build mobile apps using React
- Write JavaScript/TypeScript, runs on iOS and Android
- Uses native components (not web components)
- Similar to React but with mobile-specific differences

**Key Point:** "React Native is React for mobile. Same concepts, different components."

#### Similarities (7 minutes)

**Instructor explains what's the same:**

1. **Component-based architecture:**
   - Same component model
   - Props and state work the same
   - Same lifecycle concepts

2. **Hooks:**
   - useState, useEffect work the same
   - Custom hooks work the same
   - Context works the same

3. **TypeScript:**
   - Same type system
   - Same interfaces and types
   - Same benefits

4. **State management:**
   - Local state (useState)
   - Global state (Context)
   - Same patterns

**Show example:**

```typescript
// React (Web)
function Button({ title, onPress }) {
  return <button onClick={onPress}>{title}</button>;
}

// React Native (Mobile)
function Button({ title, onPress }) {
  return <Pressable onPress={onPress}><Text>{title}</Text></Pressable>;
}

// Same component logic, different components!
```

**Key Point:** "The React concepts you learned apply to mobile too."

#### Differences (8 minutes)

**Instructor explains what's different:**

1. **Components:**
   - Web: `<div>`, `<button>`, `<input>`
   - Mobile: `<View>`, `<Pressable>`, `<TextInput>`
   - No HTML elements in React Native

2. **Styling:**
   - Web: CSS or CSS-in-JS
   - Mobile: StyleSheet API (similar to CSS but different)
   - Flexbox is the primary layout system

3. **Navigation:**
   - Web: URL-based routing (React Router)
   - Mobile: Stack/Tab navigation (React Navigation or Expo Router)
   - Different navigation patterns

4. **Platform differences:**
   - iOS vs Android have different behaviors
   - Need to handle platform-specific code sometimes
   - Testing on both platforms

**Show example:**

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

**Key Point:** "Mobile uses different components and styling, but the React patterns are the same."

**Transition:** "Now let's set up Expo..."


### Part 3: Expo Setup & Structure (30 minutes)

#### What is Expo? (5 minutes)

**Instructor explains:**
- Expo is a framework for React Native
- Simplifies development and deployment
- Provides tools and services
- File-based routing (Expo Router)
- Built-in components and APIs

**Why use Expo?**
- Easier setup (no native code needed initially)
- Fast development (hot reload, easy testing)
- Built-in features (camera, location, etc.)
- Easy deployment

**Key Point:** "Expo makes React Native development easier."

#### Set Up Expo Project (15 minutes)

**Instructor guides teams:**

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

**Instructor circulates:**
- Help teams set up Expo
- Troubleshoot installation issues
- Ensure everyone can start the dev server

**Key Point:** "Expo makes it easy to test on real devices and simulators."

#### Understand Project Structure (10 minutes)

**Instructor walks through structure:**

```
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

**Show example:**

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

**Instructor:** Walk through existing codebase structure

**Key Point:** "Expo Router uses file-based routing. Files become routes automatically."

**Transition:** "Let's discuss how mobile is different from web..."


### Part 4: Mobile vs Web Discussion (15 minutes)

#### Discussion Activity (12 minutes)

**Instructor asks teams to discuss:**

1. **How is mobile different from web?**
   - User interaction (touch vs click)
   - Screen size (small, portrait/landscape)
   - Navigation (tabs, stacks vs URLs)
   - Performance (mobile devices are slower)
   - Network (can be slow or offline)

2. **What's the same?**
   - React concepts (components, state, hooks)
   - TypeScript
   - API integration
   - State management patterns

3. **What's easier about mobile?**
   - Native feel (tabs, gestures)
   - Focused experience (one app at a time)
   - Built-in features (camera, location)

4. **What's harder about mobile?**
   - Platform differences (iOS vs Android)
   - Testing (need simulators/emulators)
   - Deployment (app stores)
   - Performance optimization

**Instructor asks 2-3 teams to share:**
- One way mobile is different
- One way mobile is the same
- One question they have

**Common insights:**
- "Mobile is more touch-focused"
- "Navigation is different but similar concepts"
- "React skills transfer well"
- "Testing is more complex"

**Key Point:** "Mobile has different constraints, but React skills transfer."

#### Preview Thursday (3 minutes)

**Instructor previews:**
- "Thursday we'll build mobile UI"
- "We'll connect to the same backend API"
- "We'll practice mobile-specific patterns"
- "You'll see how similar it is to web"

**Transition:** "Let's wrap up..."


### Part 5: Q&A & Wrap-up (10 minutes)

#### Questions (7 minutes)
- Open floor for questions
- Address common confusions:
  - "React Native vs React?" → Same concepts, different components
  - "Expo vs React Native?" → Expo is a framework for React Native
  - "File-based routing?" → Files in `app/` become routes

#### Preview Homework (2 minutes)
- **HW5:** Build mobile UI that connects to existing backend feature
- **Due:** Next Tuesday (Feb 24)
- **Process:**
  1. Choose a backend feature (or use groups)
  2. Design mobile UI flow
  3. Implement React Native components
  4. Connect to backend API
  5. Handle mobile-specific concerns
  6. Create PR
  7. Review another team's mobile PR
  8. Reflect on mobile vs web experience

#### Wrap-up (1 minute)
- Remind students to:
  - Read Expo Documentation "Getting Started" (due Thursday)
  - Set up Expo on their machines
  - Come ready to code on Thursday


## Materials Needed

- Codebase open and navigable (mobile app)
- Expo CLI installed (or use npx)
- Node.js 18.x or 20.x
- Expo Go app on phones (optional, for testing)
- iOS Simulator or Android Emulator (optional)

## Instructor Notes

### Common Issues

**Issue: Expo installation fails**  
Solution: Check Node.js version, use npx instead of global install, clear npm cache

**Issue: Can't connect to dev server**  
Solution: Check network, ensure phone and computer are on same network, try tunnel mode

**Issue: Simulator/emulator not working**  
Solution: Check Xcode/Android Studio installation, ensure simulators are set up

**Issue: File-based routing is confusing**  
Solution: Show examples, explain route groups, walk through existing structure

### Time Management

- **If running short:** Focus on Expo setup, skip some structure details
- **If running long:** Move discussion to async, focus on setup

### Differentiation

- **For advanced students:** Have them explore Expo Router features, custom navigation
- **For struggling students:** Provide more setup help, focus on basic concepts


## Student Deliverables

- Expo project set up (or existing project explored)
- Dev server running
- Project structure understood
- Reflection on HW4 (frontend integration)

## Next Steps

- **Before Thursday:** Read Expo Documentation "Getting Started"
- **Thursday:** Mobile UI + navigation + backend integration
- **Homework:** HW5 due next Tuesday

