---
title: "Front-End Design with Mantine UI & Tailwind"
group: "Front-End"
group_order: 4
order: 3
---

## Why Use Design Tools?

Building modern web applications requires creating user interfaces that are not only functional but also visually appealing, consistent, accessible, and maintainable. Without the right tools, developers face several challenges:

- **Time-Consuming Development**: Building high-quality UI components from scratch (buttons, forms, modals, etc.) takes significant time and expertise
- **Inconsistency**: Without a design system, different parts of an application can look and behave differently, creating a poor user experience
- **Accessibility Concerns**: Properly implementing accessibility features (keyboard navigation, screen reader support, ARIA attributes) requires specialized knowledge
- **Maintenance Burden**: Hardcoded styles scattered throughout components make it difficult to update the design globally
- **Responsive Design Complexity**: Creating layouts that work across different screen sizes requires careful planning and testing

**Tailwind CSS** and **Mantine** solve these problems by providing:

- **Faster Development**: Pre-built components and utility classes accelerate UI development
- **Consistency**: Design systems ensure uniform appearance and behavior across the application
- **Accessibility**: Components come with built-in accessibility features following WCAG guidelines
- **Maintainability**: Centralized design tokens and reusable components make updates easier
- **Professional Quality**: Well-tested, production-ready components that follow modern design principles

Together, these tools form a powerful combination: Tailwind provides flexible utility classes for layout and styling, while Mantine offers complex, interactive components with built-in functionality. This guide will show you how to use both effectively.

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
        backgroundColor: designTokens.app.primary, 
        padding: designTokens.spacing.md }}>
```

This approach makes it easier to maintain consistency and update the design system globally. The starter code includes design tokens in `ui/src/designTokens.ts` that define colors, spacing, and other design values used throughout the application.

## Tailwind CSS

### What is Tailwind CSS?

**Tailwind CSS** is a utility-first CSS framework that provides low-level utility classes to build custom designs directly in your markup. Unlike traditional CSS frameworks that provide pre-built components, Tailwind gives you utility classes that you compose together to create your design.

### Philosophy

Tailwind's core philosophy is based on several principles:

1. **Utility-First**: Instead of writing custom CSS, you use utility classes like `flex`, `pt-4`, `text-center`, and `bg-blue-500` directly in your HTML/JSX.

2. **Composability**: Build complex designs by combining simple utility classes. For example:
   ```tsx
    <div class="flex flex-col w-96 p-4 bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-bold text-gray-900">Title</h2>
        <p class="text-md text-gray-500 mb-4">
            Note that this demo uses "class" instead of "className."
        </p>
        <button 
            class="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-800">
            Click me
        </button>
    </div>
   ```
   See interactive CodePen demo: <a href="https://codepen.io/vanwars/pen/OPXXXrx" target="_blank">https://codepen.io/vanwars/pen/OPXXXrx</a>

3. **Responsive by Default**: Tailwind's responsive design is mobile-first. Use prefixes like `sm:`, `md:`, `lg:`, `xl:`, and `2xl:` to apply styles at different breakpoints:
   ```tsx
   <div className="text-sm md:text-base lg:text-lg">
     Responsive text
   </div>
   ```

4. **Design System Integration**: Tailwind works seamlessly with design tokens. You can configure colors, spacing, typography, and more in `tailwind.config.js` to match your design system.

5. **Just-in-Time (JIT) Compilation**: Tailwind only generates the CSS you actually use, keeping file sizes small even with thousands of utility classes available.

### Benefits

- **Rapid Development**: Build UIs quickly without writing custom CSS
- **Consistency**: Utility classes enforce consistent spacing, colors, and typography
- **Maintainability**: Styles are co-located with components, making them easier to maintain
- **Flexibility**: Easy to customize and extend with your own design tokens
- **Performance**: Only unused styles are purged, resulting in smaller CSS bundles

### Common Utility Classes

**Layout:**
- `flex`, `grid`, `block`, `inline-block`
- `items-center`, `justify-between`, `justify-center`
- `gap-4`, `space-x-4`, `space-y-2`

**Spacing:**
- `p-4` (padding), `px-6` (horizontal padding), `py-2` (vertical padding)
- `m-4` (margin), `mx-auto` (horizontal margin auto), `mt-8` (top margin)

**Typography:**
- `text-sm`, `text-base`, `text-lg`, `text-xl`
- `font-bold`, `font-semibold`, `font-normal`
- `text-center`, `text-left`, `text-right`
- `text-gray-900`, `text-blue-500`

**Colors:**
- `bg-white`, `bg-gray-100`, `bg-blue-500`
- `text-gray-900`, `text-blue-600`
- `border-gray-300`, `border-blue-500`

**Effects:**
- `rounded`, `rounded-lg`, `rounded-full`
- `shadow`, `shadow-md`, `shadow-lg`
- `hover:bg-blue-600`, `focus:ring-2`, `active:scale-95`

### Working with Design Tokens

Tailwind can be configured to use your design tokens. In `tailwind.config.js`, you can extend the default theme:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: designTokens.app.primary,
        secondary: designTokens.app.secondary,
      },
      spacing: {
        xs: designTokens.spacing.xs,
        sm: designTokens.spacing.sm,
        md: designTokens.spacing.md,
        // ... etc
      }
    }
  }
}
```

This allows you to use your design tokens as Tailwind classes:
```tsx
<button className="bg-primary hover:bg-primaryHover px-md py-sm">
  Button
</button>
```

### When to Use Tailwind vs Mantine

- **Mantine**: Use for complex, interactive components (forms, modals, data tables, charts) that need built-in functionality and accessibility
- **Tailwind**: Use for layout, spacing, typography, simple styling, and custom component styling

Many projects use both: Mantine for complex components and Tailwind for layout and custom styling.

**Official Documentation:** <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">tailwindcss.com</a>

## Mantine UI Components

### What is a Design System?

A **design system** is a collection of reusable components, design patterns, and guidelines that ensure consistency across an application. Design systems provide:

- **Consistency**: UI elements look and behave the same way throughout the app
- **Efficiency**: Pre-built components reduce development time
- **Accessibility**: Components are built with accessibility standards in mind
- **Maintainability**: Changes to design patterns can be made in one place

Because high-quality widgets can take a long time to build from scratch, using a design system not only accelerates development time, but ensures professional-quality widgets. For our **Three Moves Ahead** web application, we are using **Mantine** -- one of many design systems available for React (others include Material-UI, Ant Design, Chakra UI, etc.). It provides pre-styled, accessible components following modern design principles and is used throughout the web frontend for consistent UI elements.

**Official Documentation:** <a href="https://mantine.dev/" target="_blank" rel="noopener noreferrer">mantine.dev</a>

### Getting Started

Mantine is already configured in the starter code. The theme is set up in `ui/src/theme.ts` and the provider wraps the app in `ui/src/main.tsx`.

### Common Mantine Widgets

#### 1. Layout

- <a href="https://mantine.dev/core/container/" target="_blank" rel="noopener noreferrer">**Container**</a> - Centers content with a maximum width. Automatically responsive.
- <a href="https://mantine.dev/core/stack/" target="_blank" rel="noopener noreferrer">**Stack**</a> - Vertical stack of elements with consistent spacing.
- <a href="https://mantine.dev/core/grid/" target="_blank" rel="noopener noreferrer">**Grid**</a> - Responsive grid layout system with columns.
- <a href="https://mantine.dev/core/paper/" target="_blank" rel="noopener noreferrer">**Paper**</a> - Elevated container with padding and optional border.
- <a href="https://mantine.dev/core/group/" target="_blank" rel="noopener noreferrer">**Group**</a> - Horizontal group of elements with spacing.

#### 2. Form

- <a href="https://mantine.dev/core/text-input/" target="_blank" rel="noopener noreferrer">**TextInput**</a> - Text input field with label and validation support.
- <a href="https://mantine.dev/core/password-input/" target="_blank" rel="noopener noreferrer">**PasswordInput**</a> - Password field with show/hide toggle.
- <a href="https://mantine.dev/core/select/" target="_blank" rel="noopener noreferrer">**Select**</a> - Dropdown select with optional search functionality.
- <a href="https://mantine.dev/core/button/" target="_blank" rel="noopener noreferrer">**Button**</a> - Button component with multiple variants (filled, outline, light, etc.).

#### 3. Feedback

- <a href="https://mantine.dev/core/alert/" target="_blank" rel="noopener noreferrer">**Alert**</a> - Inline alert message with icon and color variants.
- <a href="https://mantine.dev/core/loader/" target="_blank" rel="noopener noreferrer">**Loader**</a> - Loading spinner indicator.

#### 4. Data Display

- <a href="https://mantine.dev/core/table/" target="_blank" rel="noopener noreferrer">**Table**</a> - Styled table with headers and rows.
- <a href="https://mantine.dev/core/card/" target="_blank" rel="noopener noreferrer">**Card**</a> - Card container with optional sections (header, body, footer).
- <a href="https://mantine.dev/core/badge/" target="_blank" rel="noopener noreferrer">**Badge**</a> - Small status indicator or tag.
- <a href="https://mantine.dev/x/carousel/" target="_blank" rel="noopener noreferrer">**Carousel**</a> - Image or content carousel with navigation controls.

#### 5. Overlay

- <a href="https://mantine.dev/core/modal/" target="_blank" rel="noopener noreferrer">**Modal**</a> - Modal dialog overlay for focused interactions.
- <a href="https://mantine.dev/core/drawer/" target="_blank" rel="noopener noreferrer">**Drawer**</a> - Side drawer overlay component that slides in from the edge.

#### 6. Charts

- <a href="https://mantine.dev/charts/area-chart/" target="_blank" rel="noopener noreferrer">**AreaChart**</a> - Area chart for displaying data trends over time.
- <a href="https://mantine.dev/charts/bar-chart/" target="_blank" rel="noopener noreferrer">**BarChart**</a> - Bar chart for comparing categories with rectangular bars.
- <a href="https://mantine.dev/charts/line-chart/" target="_blank" rel="noopener noreferrer">**LineChart**</a> - Line chart for showing data trends and relationships.
- <a href="https://mantine.dev/charts/pie-chart/" target="_blank" rel="noopener noreferrer">**PieChart**</a> - Pie chart for displaying proportional data in circular segments.
- <a href="https://mantine.dev/charts/composite-chart/" target="_blank" rel="noopener noreferrer">**CompositeChart**</a> - Combines Area, Bar, and Line charts into a single visualization.

### Hooks

- <a href="https://mantine.dev/hooks/use-disclosure/" target="_blank" rel="noopener noreferrer">**useDisclosure**</a> - Hook for managing open/close state (modals, drawers, etc.).
- <a href="https://mantine.dev/form/use-form/" target="_blank" rel="noopener noreferrer">**useForm**</a> - Hook for form state management with validation.

### Icons

Mantine works with **Tabler Icons** (already installed in the starter code):

```typescript
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';

<Button leftSection={<IconPlus size={16} />}>
    Add
</Button>
```

**Icon Library:** <a href="https://tabler.io/icons" target="_blank" rel="noopener noreferrer">Tabler Icons</a>

## Modifying Design Tokens

### Workflow for Design Team Feedback

When the design team requests changes to colors, spacing, typography, or other design tokens, follow this workflow:

1. **Receive Feedback**: Design team provides specific feedback (e.g., "Primary button color should be #0066CC instead of #009EB1")

2. **Locate Design Tokens File**: Open `ui/src/designTokens.ts` - this is the single source of truth for all design values

3. **Identify the Token**: Find the relevant token in the structure:
   - **App colors**: `designTokens.app.primary`, `designTokens.app.secondary`, etc.
   - **Spacing**: `designTokens.spacing.xs`, `designTokens.spacing.md`, etc.
   - **Typography**: `designTokens.typography.fontSize.md`, etc.
   - **Semantic colors**: `designTokens.semantic.error`, `designTokens.semantic.success`, etc.

4. **Update the Token**: Modify the value in `designTokens.ts`:
   ```typescript
   app: {
     primary: '#0066CC', // Updated from '#009EB1'
     primaryHover: '#0052A3', // Update related tokens too
     primaryDark: '#003D7A',
     // ...
   }
   ```

5. **Update Related Tokens**: If changing a color, also update related variants (hover, dark, light) to maintain visual hierarchy

6. **Check Dependencies**: Review the comments in `designTokens.ts` to see where tokens are used:
   - `theme.ts` uses app colors for Mantine theme
   - `ColorPicker.tsx` uses module colors
   - Components may reference tokens directly

7. **Test Changes**: 
   - Run the application and visually verify the changes
   - Check all components that use the modified token
   - Verify responsive behavior and dark mode (if applicable)

8. **Update Documentation**: If the change affects the design system significantly, update any design documentation

9. **Commit Changes**: Commit with a clear message describing the design token update

### Example: Updating Primary Button Color

```typescript
// Before
app: {
  primary: '#009EB1',
  primaryHover: '#008BA3',
  primaryDark: '#007A8E',
}

// After (design team wants a deeper blue)
app: {
  primary: '#0066CC',        // New primary color
  primaryHover: '#0052A3',    // Adjusted hover (darker)
  primaryDark: '#003D7A',     // Adjusted dark (even darker)
}
```

This single change will automatically update all primary buttons throughout the application because they reference `designTokens.app.primary`.

## Resources

### Mantine
- <a href="https://mantine.dev/" target="_blank" rel="noopener noreferrer">Mantine Documentation</a>
- <a href="https://mantine.dev/core/button/" target="_blank" rel="noopener noreferrer">Mantine Components</a>
- <a href="https://mantine.dev/hooks/use-disclosure/" target="_blank" rel="noopener noreferrer">Mantine Hooks</a>
- <a href="https://mantine.dev/form/use-form/" target="_blank" rel="noopener noreferrer">Mantine Form</a>
- <a href="https://mantine.dev/theming/theme-object/" target="_blank" rel="noopener noreferrer">Mantine Theming</a>
- <a href="https://mantine.dev/core/button/#examples" target="_blank" rel="noopener noreferrer">Mantine Examples</a>
- <a href="https://tabler.io/icons" target="_blank" rel="noopener noreferrer">Tabler Icons</a>

### Tailwind CSS
- <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">Tailwind CSS Documentation</a>
- <a href="https://tailwindcss.com/docs/utility-first" target="_blank" rel="noopener noreferrer">Utility-First Fundamentals</a>
- <a href="https://tailwindcss.com/docs/responsive-design" target="_blank" rel="noopener noreferrer">Responsive Design</a>
- <a href="https://tailwindcss.com/docs/customizing-colors" target="_blank" rel="noopener noreferrer">Customizing Colors</a>
- <a href="https://tailwindcss.com/docs/configuration" target="_blank" rel="noopener noreferrer">Configuration</a>
