---
title: "Mobile UI Integration"
start_date: "2026-02-24"
type: "activity"
draft: 1
---


## Learning Objectives

By the end of this session, students will:
- Understand mobile UI patterns: navigation, screens, components
- Be able to build mobile UI for existing backend features
- Be able to connect mobile app to backend API
- Practice pair programming for mobile development
- Reflect on what's hard about mobile and what's easier than web


## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:10 | Review & Warm-up | Review Expo setup, address questions |
| 0:10-0:30 | Mobile UI Patterns | Navigation, screens, components |
| 0:30-1:00 | Integration Studio | Build mobile UI, connect to backend |
| 1:00-1:15 | Pair Programming Practice | One codes, one reviews, then switch |
| 1:15-1:25 | Reflection | What's hard? What's easier? |
| 1:25-1:30 | Wrap-up | Preview homework |


## Detailed Instructions

### Part 1: Review & Warm-up (10 minutes)

#### Check-in (3 minutes)
1. **Welcome back**
2. **Quick check:** "Raise your hand if:"
   - You set up Expo (or explored existing project)
   - You can run the dev server
   - You have questions about React Native or Expo

#### Review Expo Setup (5 minutes)

**Instructor asks:** "Who got Expo running? What issues did you encounter?"

**Common issues:**
- Installation problems
- Dev server connection
- Simulator/emulator setup

**Address questions** about Expo setup

#### Preview Today (2 minutes)
- "Today we're building mobile UI"
- "We'll connect to the same backend API"
- "We'll practice mobile-specific patterns"
- "This is what you'll do for homework"

**Transition:** "Let's start with mobile UI patterns..."


### Part 2: Mobile UI Patterns (20 minutes)

#### Navigation Patterns (7 minutes)

**Instructor explains mobile navigation:**

**Tab Navigation:**
- Bottom tabs (most common)
- Top tabs (less common)
- Used for main app sections

**Stack Navigation:**
- Push/pop screens
- Used for detail views
- Back button behavior

**Show example from codebase:**

```typescript
// app/(tabs)/_layout.tsx - Tab navigation
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="groups" />
      <Tabs.Screen name="courses" />
      <Tabs.Screen name="progress" />
    </Tabs>
  );
}

// app/(tabs)/groups.tsx - Groups tab screen
export default function GroupsScreen() {
  const router = useRouter();
  
  return (
    <View>
      <Text>Groups</Text>
      <Button onPress={() => router.push('/groups/1')}>
        View Group
      </Button>
    </View>
  );
}

// app/(tabs)/groups/[id].tsx - Group detail (stack navigation)
export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams();
  // ...
}
```

**Key Point:** "Tab navigation for main sections, stack navigation for details."

#### Screen Components (6 minutes)

**Instructor explains screen structure:**

**Screen Layout:**
```typescript
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

export default function GroupsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium">Groups</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text>Group Name</Text>
          <Button onPress={() => {}}>View</Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
});
```

**Key concepts:**
- **View:** Container (like `<div>`)
- **ScrollView:** Scrollable container
- **Text:** Text display (must use `<Text>`, not plain text)
- **StyleSheet:** Styling API

**Key Point:** "Mobile uses View and Text, not div and span. Styling uses StyleSheet."

#### React Native Paper Components (7 minutes)

**Instructor explains React Native Paper:**

**What is React Native Paper?**
- Material Design component library for React Native
- Pre-built, styled components
- Consistent design system

**Common Components:**
```typescript
import {
  Card,
  Text,
  Button,
  TextInput,
  List,
  Avatar,
} from 'react-native-paper';

// Card
<Card>
  <Card.Title title="Group Name" />
  <Card.Content>
    <Text>Description</Text>
  </Card.Content>
  <Card.Actions>
    <Button onPress={() => {}}>View</Button>
  </Card.Actions>
</Card>

// Text Input
<TextInput
  label="Group Name"
  value={name}
  onChangeText={setName}
/>

// List
<List.Item
  title="Group Name"
  description="Description"
  left={(props) => <List.Icon {...props} icon="folder" />}
  onPress={() => {}}
/>
```

**Key Point:** "React Native Paper provides pre-built components. Use them for consistency."

**Transition:** "Now let's build mobile UI together..."


### Part 3: Integration Studio (30 minutes)

#### Setup (5 minutes)

**Instructor provides scenario:**

**Scenario:** Build a Groups list screen that connects to the backend API:
- Backend: `GET /api/groups` returns list of groups
- Mobile: Display groups in a list, handle loading and errors

**Task:** Implement the screen with proper React Native components, state management, and API integration.

#### Step 1: Create the Screen Component (10 minutes)

**Instructor guides teams:**

1. **Create or update screen file:** `app/(tabs)/groups.tsx`

2. **Set up component with TypeScript:**
   ```typescript
   import { useState, useEffect } from 'react';
   import { View, ScrollView, StyleSheet } from 'react-native';
   import { Text, Card, ActivityIndicator, Button } from 'react-native-paper';
   import { Group } from '../../types/api';

   export default function GroupsScreen() {
     const [groups, setGroups] = useState<Group[]>([]);
     const [loading, setLoading] = useState<boolean>(true);
     const [error, setError] = useState<string | null>(null);

     // We'll add useEffect next
     
     return (
       <ScrollView style={styles.container}>
         <Text variant="headlineMedium">Groups</Text>
         {/* We'll render groups here */}
       </ScrollView>
     );
   }

   const styles = StyleSheet.create({
     container: {
       flex: 1,
       padding: 16,
     },
   });
   ```

3. **Add useEffect to fetch data:**
   ```typescript
   import { useAuth } from '../../contexts/AuthContext';
   import apiClient from '../../services/api';

   export default function GroupsScreen() {
     const { user } = useAuth();
     // ... state

     useEffect(() => {
       async function fetchGroups() {
         try {
           setLoading(true);
           const response = await apiClient.get<Group[]>('/api/groups');
           setGroups(response.data);
         } catch (err) {
           setError(err instanceof Error ? err.message : 'Unknown error');
         } finally {
           setLoading(false);
         }
       }
       
       fetchGroups();
     }, []);
   ```

4. **Add rendering logic:**
   ```typescript
   if (loading) {
     return (
       <View style={styles.center}>
         <ActivityIndicator size="large" />
       </View>
     );
   }

   if (error) {
     return (
       <View style={styles.center}>
         <Text>Error: {error}</Text>
         <Button onPress={() => fetchGroups()}>Retry</Button>
       </View>
     );
   }

   return (
     <ScrollView style={styles.container}>
       <Text variant="headlineMedium">Groups</Text>
       {groups.length === 0 ? (
         <Text>No groups found</Text>
       ) : (
         groups.map(group => (
           <Card key={group.id} style={styles.card}>
             <Card.Title title={group.name} />
             <Card.Content>
               <Text>{group.description}</Text>
             </Card.Content>
           </Card>
         ))
       )}
     </ScrollView>
   );
   ```

**Instructor circulates:**
- Help teams write the component
- Ensure React Native components are used
- Check that styling is correct
- Guide API integration

**Key Point:** "Mobile uses React Native components. API integration is similar to web."

#### Step 2: Use Context for Authentication (10 minutes)

**Instructor guides teams:**

1. **Use AuthContext (already exists in codebase):**
   ```typescript
   import { useAuth } from '../../contexts/AuthContext';

   export default function GroupsScreen() {
     const { user, token } = useAuth();
     // ... rest of component
   }
   ```

2. **Update API call to use token:**
   ```typescript
   // apiClient should already handle auth tokens
   // Check services/api.ts to see how it's configured
   const response = await apiClient.get<Group[]>('/api/groups');
   ```

3. **Handle authentication:**
   ```typescript
   if (!user) {
     return (
       <View style={styles.center}>
         <Text>Please log in</Text>
       </View>
     );
   }
   ```

**Instructor circulates:**
- Help teams use context
- Ensure authentication is handled
- Check that API client is configured correctly

**Key Point:** "Context works the same in mobile. Use it for auth and global state."

#### Step 3: Add Navigation (5 minutes)

**Instructor shows how to add navigation:**

```typescript
import { useRouter } from 'expo-router';

export default function GroupsScreen() {
  const router = useRouter();
  // ...

  return (
    <ScrollView style={styles.container}>
      {groups.map(group => (
        <Card 
          key={group.id} 
          style={styles.card}
          onPress={() => router.push(`/groups/${group.id}`)}
        >
          <Card.Title title={group.name} />
        </Card>
      ))}
    </ScrollView>
  );
}
```

**Instructor:** "Navigation uses Expo Router. Push to navigate, back button works automatically."

**Transition:** "Now let's practice pair programming..."


### Part 4: Pair Programming Practice (15 minutes)

#### Practice Session (12 minutes)

**Instructor asks teams to:**
1. **Pair up** (or work in small groups)
2. **Add a feature** to the Groups screen:
   - Add pull-to-refresh
   - Add navigation to group detail
   - Add loading states
   - Improve error handling

3. **Use pair programming:**
   - One person codes
   - Other person reviews
   - Switch roles halfway through

**Instructor circulates:**
- Help pairs work together
- Ensure both people are engaged
- Model good pair programming practices

#### Share Progress (3 minutes)

**Ask 1-2 teams to share:**
- What they implemented
- What was easy
- What was hard

**Key Point:** "Pair programming helps catch mobile-specific issues."

**Transition:** "Let's reflect on mobile development..."


### Part 5: Reflection (10 minutes)

#### Reflection Activity (8 minutes)

**Instructor asks teams to discuss:**

1. **What did we do today?**
   - Built mobile UI
   - Connected to backend API
   - Practiced mobile patterns

2. **What's hard about mobile?**
   - What concepts are difficult?
   - What patterns are unclear?
   - What questions do you have?

3. **What's easier than web?**
   - What feels more natural?
   - What patterns make sense?
   - What's simpler?

4. **How is mobile different from web?**
   - Components?
   - Styling?
   - Navigation?
   - User interaction?

5. **What questions do you have?**
   - About React Native?
   - About Expo?
   - About mobile patterns?
   - About integration?

**Instructor asks 2-3 teams to share:**
- One thing that's hard about mobile
- One thing that's easier than web
- One question they have

**Common insights:**
- "Mobile components are different but similar concepts"
- "Styling is different but flexbox helps"
- "Navigation feels more natural on mobile"
- "API integration is the same"
- "Testing on device is important"

**Key Point:** "Mobile has different components and patterns, but React skills transfer well."

#### Preview Homework (2 minutes)

**HW5: Mobile Integration PR + Peer Review + Reflection**
- **Due:** Next Tuesday (Feb 24)
- **Requirements:**
  1. Build mobile UI that connects to existing backend feature
  2. Use React Native components and patterns
  3. Handle loading, error, and success states
  4. Create PR
  5. Review another team's mobile PR
  6. Individual reflection on mobile vs web experience

- **Process:**
  1. Choose a backend feature (or use groups)
  2. Design mobile UI flow
  3. Implement React Native components
  4. Connect to backend API
  5. Handle mobile-specific concerns
  6. Create PR
  7. Review another team's PR
  8. Reflect on mobile vs web experience


### Part 6: Wrap-up (5 minutes)

#### Reminders (3 minutes)
- Mobile uses React Native components
- Styling uses StyleSheet API
- Navigation uses Expo Router
- API integration is similar to web
- Testing on device is important

#### Questions (2 minutes)
- Open floor for questions
- Address common concerns


## Materials Needed

- Codebase open and navigable (mobile app)
- Expo dev server running
- Device or simulator for testing
- React Native Paper components reference
- Computer for each student/pair

## Instructor Notes

### Common Issues

**Issue: Components not rendering**  
Solution: Check imports, ensure React Native components are used (not web), check StyleSheet syntax

**Issue: Styling not working**  
Solution: Use StyleSheet.create, check flex properties, ensure styles are applied correctly

**Issue: Navigation not working**  
Solution: Check Expo Router setup, ensure routes are in correct directories, check navigation calls

**Issue: API calls failing**  
Solution: Check API_URL configuration, ensure auth tokens are included, check network connectivity

### Time Management

- **If running short:** Focus on basic screen, skip some navigation
- **If running long:** Move some features to homework, focus on core concepts

### Differentiation

- **For advanced students:** Have them add more features, use advanced navigation patterns
- **For struggling students:** Provide more scaffolding, focus on one concept at a time


## Student Deliverables

- Groups screen implemented (can be part of HW5)
- React Native components used
- API integration working
- Navigation implemented
- Pair programming practice completed
- Reflection on mobile vs web experience

## Next Steps

- **Before Tuesday:** Complete HW5
- **Tuesday:** Human-centered design and low-fidelity prototyping
- **Reading:** "Don't Make Me Think" Ch. 1-2, "10 Usability Heuristics" (due Tuesday)

