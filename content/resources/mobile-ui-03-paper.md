---
title: "The 'Paper' Design System"
group: "Mobile UI"
group_order: 5
order: 3
---

## What is React Native Paper?

**React Native Paper** is a Material Design 3 component library for React Native. It provides pre-built, styled components that follow Google's Material Design guidelines.

### Why Use a Component Library?

Instead of building buttons, cards, and inputs from scratch, Paper provides:

- **Pre-built components** - Buttons, Cards, TextInputs, Dialogs, etc.
- **Consistent design** - All components follow Material Design
- **Accessibility** - Built-in accessibility features
- **Theming** - Easy to customize colors, fonts, etc.
- **Well-tested** - Used by thousands of apps

**Official Documentation:** <a href="https://reactnativepaper.com/" target="_blank" rel="noopener noreferrer">reactnativepaper.com</a>

### Getting Started

React Native Paper is already configured in the starter code. The theme is set up in `mobile/theme.ts` and the provider wraps the app in `mobile/app/_layout.tsx`.

## Common Paper Components

### 1. Layout

- <a href="https://callstack.github.io/react-native-paper/docs/components/Surface/" target="_blank" rel="noopener noreferrer">**Surface**</a> - Container component with elevation and background color.
- <a href="https://callstack.github.io/react-native-paper/docs/components/Divider/" target="_blank" rel="noopener noreferrer">**Divider**</a> - Horizontal divider line for separating content.

### 2. Form

- <a href="https://callstack.github.io/react-native-paper/docs/components/TextInput/" target="_blank" rel="noopener noreferrer">**TextInput**</a> - Text input field with label, helper text, and error states.
- <a href="https://callstack.github.io/react-native-paper/docs/components/Button/" target="_blank" rel="noopener noreferrer">**Button**</a> - Button component with multiple modes (contained, outlined, text, elevated).
- <a href="https://callstack.github.io/react-native-paper/docs/components/Switch/" target="_blank" rel="noopener noreferrer">**Switch**</a> - Toggle switch for boolean values.
- <a href="https://callstack.github.io/react-native-paper/docs/components/Checkbox/" target="_blank" rel="noopener noreferrer">**Checkbox**</a> - Checkbox for multiple selections.
- <a href="https://callstack.github.io/react-native-paper/docs/components/RadioButton/" target="_blank" rel="noopener noreferrer">**RadioButton**</a> - Radio button for single selection from a group.

### 3. Feedback

- <a href="https://callstack.github.io/react-native-paper/docs/components/ActivityIndicator/" target="_blank" rel="noopener noreferrer">**ActivityIndicator**</a> - Loading spinner indicator.
- <a href="https://callstack.github.io/react-native-paper/docs/components/Snackbar/" target="_blank" rel="noopener noreferrer">**Snackbar**</a> - Temporary message notification that appears at the bottom of the screen.
- <a href="https://callstack.github.io/react-native-paper/docs/components/Banner/" target="_blank" rel="noopener noreferrer">**Banner**</a> - Banner component for displaying important messages.

### 4. Data Display

- <a href="https://callstack.github.io/react-native-paper/docs/components/Card/" target="_blank" rel="noopener noreferrer">**Card**</a> - Card container with optional sections (title, content, actions).
- <a href="https://callstack.github.io/react-native-paper/docs/components/List/" target="_blank" rel="noopener noreferrer">**List**</a> - List component with icons, avatars, and actions.
- <a href="https://callstack.github.io/react-native-paper/docs/components/Chip/" target="_blank" rel="noopener noreferrer">**Chip**</a> - Compact element representing input, attribute, or action.
- <a href="https://callstack.github.io/react-native-paper/docs/components/Badge/" target="_blank" rel="noopener noreferrer">**Badge**</a> - Badge component for displaying small status indicators.
- <a href="https://callstack.github.io/react-native-paper/docs/components/DataTable/" target="_blank" rel="noopener noreferrer">**DataTable**</a> - Table component for displaying structured data.

### 5. Overlay

- <a href="https://callstack.github.io/react-native-paper/docs/components/Dialog/" target="_blank" rel="noopener noreferrer">**Dialog**</a> - Modal dialog overlay for focused interactions.
- <a href="https://callstack.github.io/react-native-paper/docs/components/Portal/" target="_blank" rel="noopener noreferrer">**Portal**</a> - Renders children outside the component tree (useful for modals).

### Component Examples

```tsx
import { Button, Card, TextInput, Dialog, Snackbar } from 'react-native-paper';

// Button with different modes
<Button mode="contained" onPress={handlePress}>
  Contained Button
</Button>
<Button mode="outlined" onPress={handlePress}>
  Outlined Button
</Button>
<Button mode="text" onPress={handlePress}>
  Text Button
</Button>

// Card with title, content, and actions
<Card>
  <Card.Title title="Card Title" subtitle="Card Subtitle" />
  <Card.Content>
    <Text>Card content goes here</Text>
  </Card.Content>
  <Card.Actions>
    <Button>Cancel</Button>
    <Button>Ok</Button>
  </Card.Actions>
</Card>

// Text Input with label and error state
<TextInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  mode="outlined"
  error={hasError}
  helperText={hasError ? "Invalid email" : ""}
/>

// Dialog
<Dialog visible={visible} onDismiss={hideDialog}>
  <Dialog.Title>Alert</Dialog.Title>
  <Dialog.Content>
    <Text>This is a dialog message</Text>
  </Dialog.Content>
  <Dialog.Actions>
    <Button onPress={hideDialog}>Cancel</Button>
    <Button onPress={handleConfirm}>OK</Button>
  </Dialog.Actions>
</Dialog>

// Snackbar for notifications
<Snackbar
  visible={snackbarVisible}
  onDismiss={() => setSnackbarVisible(false)}
  duration={3000}
>
  Action completed!
</Snackbar>
```

## Hooks

- <a href="https://callstack.github.io/react-native-paper/docs/hooks/useTheme/" target="_blank" rel="noopener noreferrer">**useTheme**</a> - Hook to access the Paper theme object.
- <a href="https://callstack.github.io/react-native-paper/docs/hooks/usePaperTheme/" target="_blank" rel="noopener noreferrer">**usePaperTheme**</a> - Hook to access Paper-specific theme properties.

```tsx
import { useTheme } from 'react-native-paper';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.primary }}>
      {/* Use theme colors */}
    </View>
  );
}
```

## Icons

React Native Paper works with **Material Community Icons** (already installed in the starter code):

```tsx
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

<Icon name="home" size={24} color="#000" />
```

**Icon Library:** <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener noreferrer">Material Design Icons</a>

## Theming

React Native Paper supports theming through the `PaperProvider` component. The theme is configured in `mobile/theme.ts` and uses design tokens for consistency.

```tsx
import { PaperProvider } from 'react-native-paper';
import { appTheme } from './theme';

function App() {
  return (
    <PaperProvider theme={appTheme}>
      {/* Your app components */}
    </PaperProvider>
  );
}
```

## Resources

### React Native Paper
- <a href="https://reactnativepaper.com/" target="_blank" rel="noopener noreferrer">React Native Paper Documentation</a>
- <a href="https://callstack.github.io/react-native-paper/docs/components/Button/" target="_blank" rel="noopener noreferrer">Components Reference</a>
- <a href="https://callstack.github.io/react-native-paper/docs/guides/theming/" target="_blank" rel="noopener noreferrer">Theming Guide</a>
- <a href="https://github.com/callstack/react-native-paper" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
- <a href="https://pictogrammers.com/library/mdi/" target="_blank" rel="noopener noreferrer">Material Design Icons</a>
