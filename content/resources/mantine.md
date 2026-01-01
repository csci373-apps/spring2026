---
title: "Mantine UI Components"
group: "Front-End"
group_order: 2
order: 2
---

## What is a Design System?

A **design system** is a collection of reusable components, design patterns, and guidelines that ensure consistency across an application. Design systems provide:

- **Consistency**: UI elements look and behave the same way throughout the app
- **Efficiency**: Pre-built components reduce development time
- **Accessibility**: Components are built with accessibility standards in mind
- **Maintainability**: Changes to design patterns can be made in one place

Because high-quality widgets can take a long time to build from scratch, using a design system not only accelerates development time, but ensures professional-quality widgets. For our **Three Moves Ahead** web application, we are using **Mantine** -- one of many design systems available for React (others include Material-UI, Ant Design, Chakra UI, etc.). It provides pre-styled, accessible components following modern design principles and is used throughout the web frontend for consistent UI elements.

## Design Tokens

**Design tokens** are the foundational design decisions (colors, spacing, typography, etc.) that define the visual language of an application. Instead of hardcoding values like `color: "#3b82f6"` or `padding: "16px"`, design tokens provide named constants that can be referenced throughout the codebase.

For example, instead of:
```typescript
<Button 
    style={{ 
        backgroundColor: "#3b82f6", 
        padding: "16px" }}>
```

You would use:
```typescript
<Button 
    style={{ 
        backgroundColor: designTokens.colors.primary, 
        padding: designTokens.spacing.md }}>
```

This approach makes it easier to maintain consistency and update the design system globally. The starter code includes design tokens in `ui/src/designTokens.ts` that define colors, spacing, and other design values used throughout the application.

**Official Documentation:** <a href="https://mantine.dev/" target="_blank" rel="noopener noreferrer">mantine.dev</a>

## Getting Started

Mantine is already configured in the starter code. The theme is set up in `ui/src/theme.ts` and the provider wraps the app in `ui/src/main.tsx`.

## Common Mantine Widgets

### 1. Layout

- <a href="https://mantine.dev/core/container/" target="_blank" rel="noopener noreferrer">**Container**</a> - Centers content with a maximum width. Automatically responsive.
- <a href="https://mantine.dev/core/stack/" target="_blank" rel="noopener noreferrer">**Stack**</a> - Vertical stack of elements with consistent spacing.
- <a href="https://mantine.dev/core/grid/" target="_blank" rel="noopener noreferrer">**Grid**</a> - Responsive grid layout system with columns.
- <a href="https://mantine.dev/core/paper/" target="_blank" rel="noopener noreferrer">**Paper**</a> - Elevated container with padding and optional border.
- <a href="https://mantine.dev/core/group/" target="_blank" rel="noopener noreferrer">**Group**</a> - Horizontal group of elements with spacing.

### 2. Form

- <a href="https://mantine.dev/core/text-input/" target="_blank" rel="noopener noreferrer">**TextInput**</a> - Text input field with label and validation support.
- <a href="https://mantine.dev/core/password-input/" target="_blank" rel="noopener noreferrer">**PasswordInput**</a> - Password field with show/hide toggle.
- <a href="https://mantine.dev/core/select/" target="_blank" rel="noopener noreferrer">**Select**</a> - Dropdown select with optional search functionality.
- <a href="https://mantine.dev/core/button/" target="_blank" rel="noopener noreferrer">**Button**</a> - Button component with multiple variants (filled, outline, light, etc.).

### 3. Feedback

- <a href="https://mantine.dev/core/alert/" target="_blank" rel="noopener noreferrer">**Alert**</a> - Inline alert message with icon and color variants.
- <a href="https://mantine.dev/core/loader/" target="_blank" rel="noopener noreferrer">**Loader**</a> - Loading spinner indicator.

### 4. Data Display

- <a href="https://mantine.dev/core/table/" target="_blank" rel="noopener noreferrer">**Table**</a> - Styled table with headers and rows.
- <a href="https://mantine.dev/core/card/" target="_blank" rel="noopener noreferrer">**Card**</a> - Card container with optional sections (header, body, footer).
- <a href="https://mantine.dev/core/badge/" target="_blank" rel="noopener noreferrer">**Badge**</a> - Small status indicator or tag.
- <a href="https://mantine.dev/x/carousel/" target="_blank" rel="noopener noreferrer">**Carousel**</a> - Image or content carousel with navigation controls.

### 5. Overlay

- <a href="https://mantine.dev/core/modal/" target="_blank" rel="noopener noreferrer">**Modal**</a> - Modal dialog overlay for focused interactions.
- <a href="https://mantine.dev/core/drawer/" target="_blank" rel="noopener noreferrer">**Drawer**</a> - Side drawer overlay component that slides in from the edge.

### 6. Charts

- <a href="https://mantine.dev/charts/area-chart/" target="_blank" rel="noopener noreferrer">**AreaChart**</a> - Area chart for displaying data trends over time.
- <a href="https://mantine.dev/charts/bar-chart/" target="_blank" rel="noopener noreferrer">**BarChart**</a> - Bar chart for comparing categories with rectangular bars.
- <a href="https://mantine.dev/charts/line-chart/" target="_blank" rel="noopener noreferrer">**LineChart**</a> - Line chart for showing data trends and relationships.
- <a href="https://mantine.dev/charts/pie-chart/" target="_blank" rel="noopener noreferrer">**PieChart**</a> - Pie chart for displaying proportional data in circular segments.
- <a href="https://mantine.dev/charts/composite-chart/" target="_blank" rel="noopener noreferrer">**CompositeChart**</a> - Combines Area, Bar, and Line charts into a single visualization.

### Hooks

- <a href="https://mantine.dev/hooks/use-disclosure/" target="_blank" rel="noopener noreferrer">**useDisclosure**</a> - Hook for managing open/close state (modals, drawers, etc.).
- <a href="https://mantine.dev/form/use-form/" target="_blank" rel="noopener noreferrer">**useForm**</a> - Hook for form state management with validation.

## Icons

Mantine works with **Tabler Icons** (already installed in the starter code):

```typescript
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';

<Button leftSection={<IconPlus size={16} />}>
    Add
</Button>
```

**Icon Library:** <a href="https://tabler.io/icons" target="_blank" rel="noopener noreferrer">Tabler Icons</a>

## Resources

- <a href="https://mantine.dev/" target="_blank" rel="noopener noreferrer">Mantine Documentation</a>
- <a href="https://mantine.dev/core/button/" target="_blank" rel="noopener noreferrer">Mantine Components</a>
- <a href="https://mantine.dev/hooks/use-disclosure/" target="_blank" rel="noopener noreferrer">Mantine Hooks</a>
- <a href="https://mantine.dev/form/use-form/" target="_blank" rel="noopener noreferrer">Mantine Form</a>
- <a href="https://mantine.dev/theming/theme-object/" target="_blank" rel="noopener noreferrer">Mantine Theming</a>
- <a href="https://mantine.dev/core/button/#examples" target="_blank" rel="noopener noreferrer">Mantine Examples</a>
- <a href="https://tabler.io/icons" target="_blank" rel="noopener noreferrer">Tabler Icons</a>
