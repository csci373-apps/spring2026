---
title: "React Native + Expo + Paper"
group: "Front-End"
group_order: 2
order: 2
---

## Overview

This guide covers the mobile app stack: **React Native** (mobile UI framework), **Expo** (development platform), and **React Native Paper** (Material Design components). These work together to create native mobile apps with a consistent design system.

## React Native Basics

React Native lets you build mobile apps using React. Instead of HTML elements, you use React Native components.

### Core Components

```typescript
import { View, Text, Button, ScrollView } from 'react-native';

export default function MyScreen() {
    return (
        <View>
            <Text>Hello, World!</Text>
            <Button title="Click me" onPress={() => console.log('Pressed')} />
        </View>
    );
}
```

### Common Components

- `View` - Container (like `<div>`)
- `Text` - Text display (like `<p>` or `<span>`)
- `ScrollView` - Scrollable container
- `TextInput` - Text input field
- `TouchableOpacity` - Pressable element
- `Image` - Image display

### Styling

```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

<View style={styles.container}>
    <Text style={styles.title}>Title</Text>
</View>
```

## Expo Router

Expo Router provides file-based routing (like Next.js).

### File-Based Routing

```
app/
├── index.tsx              # Root route (/)
├── (auth)/
│   ├── login.tsx         # /login
│   └── home.tsx          # /home
└── (tabs)/
    ├── groups.tsx        # /groups
    └── courses.tsx       # /courses
```

### Navigation

```typescript
import { useRouter } from 'expo-router';

export default function MyScreen() {
    const router = useRouter();
    
    function handlePress() {
        router.push('/groups/123');  // Navigate to route
        router.replace('/login');     // Replace current route
        router.back();                // Go back
    }
    
    return <Button onPress={handlePress}>Navigate</Button>;
}
```

### Dynamic Routes

```typescript
// app/groups/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function GroupDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    
    return <Text>Group ID: {id}</Text>;
}
```

### Route Groups

Parentheses create route groups (not part of URL):

```
app/
├── (auth)/
│   └── login.tsx    # Route: /login (not /(auth)/login)
└── (tabs)/
    └── home.tsx     # Route: /home
```

## React Native Paper

Paper provides Material Design 3 components for React Native.

### Setup

```typescript
import { PaperProvider } from 'react-native-paper';
import { theme } from './theme';

export default function App() {
    return (
        <PaperProvider theme={theme}>
            {/* Your app */}
        </PaperProvider>
    );
}
```

### Common Components

```typescript
import { 
    Card, 
    Button, 
    TextInput, 
    List, 
    Avatar,
    Chip,
    FAB
} from 'react-native-paper';

// Card
<Card>
    <Card.Title title="Card Title" subtitle="Subtitle" />
    <Card.Content>
        <Text>Card content</Text>
    </Card.Content>
    <Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
    </Card.Actions>
</Card>

// Text Input
<TextInput
    label="Username"
    value={username}
    onChangeText={setUsername}
    mode="outlined"
/>

// List Item
<List.Item
    title="Item Title"
    description="Item description"
    left={props => <List.Icon {...props} icon="folder" />}
    onPress={() => console.log('Pressed')}
/>

// Avatar
<Avatar.Text size={40} label="JD" />
<Avatar.Image size={40} source={{ uri: avatarUrl }} />

// Chip
<Chip onPress={() => {}}>Tag</Chip>

// FAB (Floating Action Button)
<FAB
    icon="plus"
    onPress={() => {}}
    style={styles.fab}
/>
```

### Icons

```typescript
import { IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

<IconButton
    icon="delete"
    iconColor="red"
    onPress={() => {}}
/>

// Or use MaterialCommunityIcons directly
<MaterialCommunityIcons name="account" size={24} color="blue" />
```

## Common Patterns

### Screen Component

```typescript
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GroupsScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView>
                {groups.map(group => (
                    <Card key={group.id} style={styles.card}>
                        <Card.Title title={group.name} />
                        <Card.Content>
                            <Text>{group.description}</Text>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f7f5',
    },
    card: {
        margin: 16,
    },
});
```

### Form Handling

```typescript
import { useState } from 'react';
import { TextInput, Button, Snackbar } from 'react-native-paper';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    async function handleLogin() {
        setLoading(true);
        setError(null);
        
        try {
            await login(username, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <View>
            <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                mode="outlined"
            />
            <Button 
                mode="contained" 
                onPress={handleLogin}
                loading={loading}
            >
                Login
            </Button>
            <Snackbar
                visible={!!error}
                onDismiss={() => setError(null)}
            >
                {error}
            </Snackbar>
        </View>
    );
}
```

### Data Fetching with React Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { getUserGroups } from '../services/groups';

export default function GroupsScreen() {
    const { data: groups, isLoading, error } = useQuery({
        queryKey: ['groups'],
        queryFn: () => getUserGroups(),
    });
    
    if (isLoading) return <ActivityIndicator />;
    if (error) return <Text>Error loading groups</Text>;
    
    return (
        <ScrollView>
            {groups?.map(group => (
                <GroupCard key={group.id} group={group} />
            ))}
        </ScrollView>
    );
}
```

### Tab Navigation

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="groups"
                options={{
                    title: 'Groups',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account-group" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="courses"
                options={{
                    title: 'Courses',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="book" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
```

### Context API (Global State)

```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useState } from 'react';

interface AuthContextValue {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    
    async function login(username: string, password: string) {
        // Login logic
        setUser(userData);
    }
    
    function logout() {
        setUser(null);
    }
    
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

// Use in components
function MyComponent() {
    const { user, logout } = useAuth();
    return <Button onPress={logout}>Logout</Button>;
}
```

## Styling Patterns

### Using Theme

```typescript
import { useTheme } from 'react-native-paper';

export default function MyComponent() {
    const theme = useTheme();
    
    return (
        <View style={{ backgroundColor: theme.colors.primary }}>
            <Text style={{ color: theme.colors.onPrimary }}>
                Themed text
            </Text>
        </View>
    );
}
```

### Design Tokens

```typescript
// theme.ts
import { MD3LightTheme } from 'react-native-paper';

export const designTokens = {
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    colors: {
        primary: '#009EB1',
        secondary: '#B44985',
    },
};

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: designTokens.colors.primary,
        secondary: designTokens.colors.secondary,
    },
};

// Use in styles
const styles = StyleSheet.create({
    container: {
        padding: designTokens.spacing.md,
    },
});
```

## File Structure

```
mobile/
├── app/                  # Expo Router routes
│   ├── (auth)/          # Auth route group
│   ├── (tabs)/          # Tab navigation group
│   └── groups/
│       └── [id].tsx      # Dynamic route
├── components/           # Reusable components
├── contexts/             # React contexts
├── services/             # API service functions
├── types/                # TypeScript types
└── theme.ts              # Paper theme configuration
```

## Key Concepts

1. **React Native Components** = Native mobile UI elements
2. **Expo Router** = File-based routing system
3. **Paper Components** = Material Design UI components
4. **SafeAreaView** = Handles notches and safe areas
5. **StyleSheet** = Optimized styling system
6. **React Query** = Data fetching and caching

## Common Mistakes

1. **Using `div` or `span`** - Use `View` and `Text` instead
2. **Forgetting `StyleSheet.create()`** - Always use StyleSheet for performance
3. **Not handling safe areas** - Use `SafeAreaView` for notches
4. **Missing `key` prop** in lists
5. **Not using `onChangeText`** for TextInput (not `onChange`)
6. **Forgetting to handle loading/error states** in data fetching

## Platform Differences

```typescript
import { Platform } from 'react-native';

// Platform-specific code
if (Platform.OS === 'ios') {
    // iOS-specific code
} else if (Platform.OS === 'android') {
    // Android-specific code
}

// Platform-specific styles
const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
    },
});
```

## Resources

- <a href="https://reactnative.dev/" target="_blank" rel="noopener noreferrer">React Native Documentation</a>
- <a href="https://docs.expo.dev/" target="_blank" rel="noopener noreferrer">Expo Documentation</a>
- <a href="https://docs.expo.dev/router/introduction/" target="_blank" rel="noopener noreferrer">Expo Router Documentation</a>
- <a href="https://callstack.github.io/react-native-paper/" target="_blank" rel="noopener noreferrer">React Native Paper Documentation</a>
- <a href="https://tanstack.com/query/latest" target="_blank" rel="noopener noreferrer">React Query Documentation</a>

