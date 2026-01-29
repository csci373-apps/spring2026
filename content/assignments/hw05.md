---
title: "Mobile Integration"
date: "2026-02-19"
type: "assignment"
num: "5"
draft: 1
due_date: "2026-02-24"
---

## Overview

This assignment has three parts:
1. **Build Mobile UI** - Your team builds a React Native mobile UI that connects to an existing backend feature
2. **Peer Review** - You review another team's mobile PR
3. **Individual Reflection** - Reflect on how mobile is different from web, what's hard, and what's easier

This assignment builds on React Native, Expo, and mobile UI patterns from class. You'll practice building mobile features and connecting them to backend APIs.


## Part 1: Build Mobile UI (60 points)

### Instructions

Your team will build a React Native mobile UI that connects to an existing backend feature. You'll use TypeScript, React Native components, and Expo Router to create a functional mobile interface.

### Requirements

#### 1. Choose a Backend Feature (5 points)

**Select an existing backend feature to build mobile UI for:**

**Options:**
- **Groups:** List groups, view group details, create group
- **Courses:** List courses, view course details, create course
- **Modules:** List modules in a course, view module details
- **Posts:** List posts in a module, view post details
- **Or another feature** (check with instructor first)

**Requirements:**
- Feature must have existing backend API endpoints
- Feature should have at least 2-3 endpoints (GET list, GET one, POST/PATCH)
- Feature should be meaningful (not too simple, not too complex)
- **Note:** You can use the same feature as HW4 (web) to compare web vs mobile

**Documentation:**
In your PR description, list the feature you chose and which endpoints you're using.

#### 2. Design Mobile UI Flow (10 points)

**Before coding, design your mobile UI:**

1. **Map backend to mobile UI:**
   - What screens do you need?
   - What components do you need?
   - What navigation structure? (tabs, stack)
   - What state do you need? (local vs global)

2. **Identify mobile-specific concerns:**
   - Touch interactions (vs click)
   - Screen size (portrait/landscape)
   - Navigation patterns (tabs, stack)
   - Loading states (mobile networks can be slow)
   - Offline handling (optional)

3. **Identify UI states:**
   - Loading states
   - Error states
   - Empty states
   - Success states

**Submission:**
Include your mobile UI flow design in your PR description or as a file in the PR.

**Template:**
```markdown
## Mobile UI Flow Design

### Screens
- `(tabs)/feature` - List screen (in tab navigation)
- `feature/[id]` - Detail screen (stack navigation)
- `feature/new` - Create screen (stack navigation)

### Components
- `FeatureList` - Displays list
- `FeatureCard` - Displays one item
- `FeatureForm` - Form for creating/editing
- `FeatureDetail` - Shows details

### Navigation
- Tab navigation for main screens
- Stack navigation for detail screens
- Back button behavior

### State
- **Local:**
  - Form inputs (in FeatureForm)
  - Loading states (in screens)
- **Global:**
  - User authentication (from AuthContext)

### Mobile-Specific Concerns
- Touch interactions
- Screen size handling
- Network reliability
- Performance optimization

### UI States
- Loading: Fetching data
- Error: API error, network error
- Empty: No data exists
- Success: Data loaded
```

#### 3. Implement Screens (20 points)

**Create React Native screen components:**

1. **List Screen:**
   - Fetch and display list of items
   - Handle loading, error, and empty states
   - Navigate to detail screens
   - Use TypeScript types
   - Use React Native Paper components

2. **Detail Screen (optional but recommended):**
   - Fetch and display one item
   - Handle loading and error states
   - Show related data if applicable
   - Use stack navigation

3. **Create/Edit Screen (optional but recommended):**
   - Form for creating/editing items
   - Form validation
   - Submit to backend API
   - Handle success and error states

**Requirements:**
- Screens use TypeScript (proper types)
- Screens handle all UI states (loading, error, empty, success)
- Screens use React Hooks (useState, useEffect)
- Screens connect to backend API correctly
- Screens use AuthContext for authentication
- Screens use React Native Paper components
- Screens use Expo Router for navigation

**Example structure:**
```typescript
import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator, Button } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/api';
import { Group } from '../../types/api';

export default function GroupsScreen() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
});
```

#### 4. Create Components (10 points)

**Create reusable React Native components:**

1. **List Component:**
   - Displays list of items
   - Receives data via props
   - Handles item selection/navigation
   - Uses React Native Paper components

2. **Card/Item Component:**
   - Displays one item
   - Receives item data via props
   - Handles press events
   - Uses React Native Paper Card

3. **Form Component (if applicable):**
   - Form inputs (TextInput)
   - Form validation
   - Submit handler
   - Uses React Native Paper components

**Requirements:**
- Components use TypeScript (proper prop types)
- Components are reusable
- Components focus on presentation (receive data via props)
- Components use React Native Paper
- Components are well-named and clear

**Example:**
```typescript
import { Card, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface GroupCardProps {
  group: Group;
  onPress: (id: number) => void;
}

export function GroupCard({ group, onPress }: GroupCardProps) {
  return (
    <Card style={styles.card} onPress={() => onPress(group.id)}>
      <Card.Title title={group.name} />
      <Card.Content>
        <Text>{group.description}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
});
```

#### 5. Use Navigation (10 points)

**Implement proper navigation:**

1. **Tab Navigation:**
   - Add screen to tab navigation if it's a main feature
   - Use Expo Router tab layout

2. **Stack Navigation:**
   - Navigate to detail screens
   - Use `useRouter` from Expo Router
   - Handle back button behavior

3. **Navigation Patterns:**
   - Push to detail screens
   - Pop to go back
   - Use proper route parameters

**Requirements:**
- Navigation uses Expo Router
- Tab navigation for main screens
- Stack navigation for detail screens
- Route parameters handled correctly
- Back button works correctly

**Example:**
```typescript
import { useRouter } from 'expo-router';

export default function GroupsScreen() {
  const router = useRouter();

  return (
    <ScrollView>
      {groups.map(group => (
        <Card
          key={group.id}
          onPress={() => router.push(`/groups/${group.id}`)}
        >
          <Card.Title title={group.name} />
        </Card>
      ))}
    </ScrollView>
  );
}
```

#### 6. Handle UI States and Mobile Concerns (5 points)

**Handle all UI states and mobile-specific concerns:**

1. **Loading states:**
   - Show ActivityIndicator while fetching
   - Prevent multiple simultaneous requests
   - Consider slow mobile networks

2. **Error states:**
   - Display error messages
   - Provide retry functionality
   - Handle network errors gracefully
   - Consider offline scenarios

3. **Empty states:**
   - Show message when no data exists
   - Provide actions (create new item)
   - Use appropriate mobile UI patterns

4. **Success states:**
   - Display data correctly
   - Handle navigation after actions
   - Use appropriate mobile UI patterns

5. **Mobile-specific:**
   - Touch interactions (Pressable, onPress)
   - Screen size handling (responsive design)
   - Performance (optimize rendering)

**Requirements:**
- All UI states handled
- Mobile-specific concerns considered
- User-friendly error messages
- Appropriate loading indicators
- Touch interactions work correctly

### PR Requirements

#### Create Pull Request

1. **Create feature branch:**
   ```bash
   git checkout -b feature/[feature-name]-mobile
   ```

2. **Commit your work:**
   ```bash
   git add mobile/app/[feature]/
   git add mobile/components/[feature]/
   git commit -m "Add [feature] mobile UI: screens, components, and API integration"
   ```

3. **Push and create PR:**
   ```bash
   git push origin feature/[feature-name]-mobile
   ```

4. **PR Description Template:**
   ```markdown
   ## Feature: [Feature Name] Mobile UI

   ### Backend Feature
   - What backend feature did you build mobile UI for?
   - Which endpoints are you using?

   ### Mobile UI Flow Design
   - What screens did you create?
   - What components did you create?
   - What navigation structure did you use?

   ### Implementation
   - Screens: `mobile/app/[feature]/`
   - Components: `mobile/components/[feature]/`
   - Navigation: Tab/Stack navigation

   ### Mobile-Specific Concerns
   - Touch interactions: [How did you handle touch?]
   - Screen size: [How did you handle different screen sizes?]
   - Network: [How did you handle slow/offline networks?]
   - Performance: [Any performance optimizations?]

   ### UI States Handled
   - Loading: [How did you handle loading?]
   - Error: [How did you handle errors?]
   - Empty: [How did you handle empty states?]
   - Success: [How did you display data?]

   ### Testing
   - Did you test on device/simulator?
   - What scenarios did you test?
   - Any known issues?

   ### Questions
   - What questions do you have?
   - What would you like feedback on?
   ```


## Part 2: Peer Review (25 points)

### Instructions

Review **one PR from another team** (focus on mobile concerns). Provide substantive, constructive feedback.

### Requirements

#### 1. Find a PR to Review (5 points)

**Choose ONE PR from another team:**
- Not your own team's PR
- PR that implements mobile UI
- PR that needs review (not already reviewed by 2+ people)

**How to find PRs:**
- Check team repositories (each team has their own fork)
- Look for PRs with "HW5" in the title
- Ask in class or Slack if you can't find any

#### 2. Review the Mobile Implementation (15 points)

**Focus on mobile concerns:**

1. **Component Structure:**
   - Are screens and components well-organized?
   - Are components reusable?
   - Are React Native components used correctly?

2. **Navigation:**
   - Is navigation structure appropriate?
   - Are routes set up correctly?
   - Does back button work correctly?

3. **Mobile UI Patterns:**
   - Are touch interactions handled correctly?
   - Are React Native Paper components used?
   - Is styling appropriate for mobile?

4. **State Management:**
   - Is state in the right place? (local vs global)
   - Are Hooks used correctly?
   - Is Context used appropriately?

5. **UI States:**
   - Are loading states handled?
   - Are error states handled?
   - Are empty states handled?

6. **Mobile-Specific:**
   - Are mobile concerns considered?
   - Is performance optimized?
   - Are network issues handled?

**Provide feedback:**
- What's good about the mobile implementation?
- What could be improved?
- What mobile patterns could be applied?
- What questions do you have?

#### 3. Review Code Quality (5 points)

**Focus on code quality:**

1. **Code Organization:**
   - Is code well-structured?
   - Are files organized logically?
   - Are components appropriately sized?

2. **Code Clarity:**
   - Are names clear?
   - Is code readable?
   - Are TypeScript types used correctly?

**Provide feedback:**
- What's good about the code quality?
- What could be improved?

### Review Guidelines

**Be constructive:**
- ✅ "This navigation structure makes sense because..."
- ✅ "Consider using React Native Paper Card here for consistency"
- ✅ "The error handling is good, but consider adding a retry button"
- ❌ "This is wrong" (be specific about what and why)
- ❌ "Needs more work" (specify what and how)

**Be specific:**
- Point to specific files or functions
- Explain why something is good or could be improved
- Suggest alternatives when appropriate

**Be kind:**
- Remember: everyone is learning
- Focus on the code, not the person
- Ask questions to understand decisions

### Submission

- **Format:** Comments on GitHub PR
- **Location:** Another team's PR
- **Individual submission:** Each team member reviews one PR
- **Team coordination:** Try to ensure all PRs get reviewed (distribute reviews among team members)


## Part 3: Individual Reflection (15 points)

### Instructions

Reflect on your mobile development experience, how mobile is different from web, what's hard, and what's easier.

### Reflection Questions

**Answer these questions (2-3 paragraphs each):**

1. **How is Mobile Different from Web?**
   - How is mobile development different from web development?
   - What's the same? What's different?
   - What skills transferred from web?
   - What new skills did you need to learn?

2. **What's Hard About Mobile?**
   - What concepts are difficult?
   - What patterns are unclear?
   - What was challenging?
   - What questions do you have?

3. **What's Easier Than Web?**
   - What feels more natural on mobile?
   - What patterns make sense?
   - What's simpler?
   - What clicked?

4. **Components and Styling:**
   - How did you adapt to React Native components?
   - What was hard about styling with StyleSheet?
   - What would you do differently next time?

5. **Navigation:**
   - How did you handle navigation in mobile?
   - What was different from web routing?
   - What was easier? What was harder?

6. **Code Review Learning:**
   - What feedback did you receive on your PR?
   - Was the feedback helpful? Why or why not?
   - What did you learn from reviewing another team's PR?
   - How has your understanding of mobile development improved?

### Submission

- **Format:** Written reflection (500-750 words total)
- **Location:** Submit via course platform
- **Individual submission:** Each team member submits their own reflection


## Grading Rubric

| Criteria | Points | Description |
|----------|--------|-------------|
| Mobile UI Flow Design | 10 | Well-designed mobile UI flow with screens, components, and navigation |
| Screens Implementation | 20 | Working screens with proper TypeScript, Hooks, and API integration |
| Components | 10 | Reusable components with proper TypeScript types and React Native Paper |
| Navigation | 10 | Proper navigation structure (tabs, stack) using Expo Router |
| UI States & Mobile Concerns | 5 | All UI states handled and mobile-specific concerns considered |
| Feature Selection | 5 | Appropriate backend feature chosen |
| PR Quality | 5 | Clear PR description, well-documented |
| Review Selection | 5 | Appropriate PR chosen for review |
| Mobile Review | 15 | Substantive feedback on mobile implementation |
| Code Quality Review | 5 | Substantive feedback on code quality |
| Reflection Quality | 15 | Thoughtful reflection on mobile vs web experience |
| **Total** | **100** | |


## Submission Checklist

### Team Submission:
- [ ] GitHub PR created with mobile UI
  - [ ] Mobile UI flow designed and documented
  - [ ] Screens implemented with TypeScript
  - [ ] Components created and reusable
  - [ ] Navigation implemented (tabs/stack)
  - [ ] UI states handled (loading, error, empty, success)
  - [ ] Mobile-specific concerns considered
  - [ ] PR description includes design and implementation details
  - [ ] UI works correctly (tested on device/simulator)

### Individual Submission:
- [ ] Peer review completed
  - [ ] Reviewed another team's PR (not your own work)
  - [ ] Provided substantive feedback on mobile implementation
  - [ ] Provided substantive feedback on code quality
  - [ ] Approved or requested changes
- [ ] Individual reflection submitted
  - [ ] Answered all reflection questions
  - [ ] 500-750 words total
  - [ ] Thoughtful and specific


## Tips for Success

### Design Phase
- **Map backend to mobile UI:** Think about screens, components, and navigation
- **Consider mobile-specific concerns:** Touch, screen size, network
- **Think about UI states:** Loading, error, empty, success
- **Ask questions:** If unsure, ask instructor or teammates

### Implementation Phase
- **Start with screens:** Get basic screens working first
- **Add components:** Extract reusable components as you go
- **Use React Native Paper:** Use pre-built components for consistency
- **Handle states:** Don't forget loading, error, and empty states
- **Test on device:** Test on real device or simulator

### Review Phase
- **Be constructive:** Focus on helping, not criticizing
- **Be specific:** Point to specific code, explain why
- **Ask questions:** Understand decisions before suggesting changes
- **Learn from feedback:** Consider suggestions, ask for clarification

### Reflection Phase
- **Be honest:** What was hard? What did you learn?
- **Be specific:** Give examples from your experience
- **Think critically:** What would you do differently? Why?


## Common Issues and Solutions

### Issue: Components not rendering
**Solution:** Check imports, ensure React Native components are used (not web), check StyleSheet syntax

### Issue: Styling not working
**Solution:** Use StyleSheet.create, check flex properties, ensure styles are applied correctly

### Issue: Navigation not working
**Solution:** Check Expo Router setup, ensure routes are in correct directories, check navigation calls

### Issue: API calls failing
**Solution:** Check API_URL configuration, ensure auth tokens are included, check network connectivity

### Issue: Touch interactions not working
**Solution:** Use Pressable or TouchableOpacity, ensure onPress handlers are set, check event handlers

### Issue: Performance issues
**Solution:** Optimize rendering, use FlatList for long lists, avoid unnecessary re-renders


## Resources

- **React Native Documentation:** https://reactnative.dev/
- **Expo Documentation:** https://docs.expo.dev/
- **Expo Router:** https://docs.expo.dev/router/introduction/
- **React Native Paper:** https://callstack.github.io/react-native-paper/
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/


## Next Steps

After completing this assignment, you'll:
- Understand how to build React Native mobile UIs
- Be comfortable with Expo Router and navigation
- Have practice connecting mobile to backend
- Be ready for design and prototyping (Week 7)

Good luck!

