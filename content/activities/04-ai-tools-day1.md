---
title: "AI Coding Tools I - Introduction & Practice"
start_date: "2026-02-24"
type: "activity"
draft: 0
heading_max_level: 3
---

## Today

- You’ll watch a quick Cursor demo (prompt → review → refine).
- Then you’ll use Cursor to add a small UI feature to the mobile app.
- <span class="badge">new</span> Check out the new [Working with the Cursor AI Editor](/spring2026/resources/howto-06-cursor) guide in the Resources section.


## Setup

Work in `tma-starter-app/mobile`.

- Run the app (Expo dev server)
- Open these files in Cursor:
  - `mobile/app/(tabs)/home.tsx`
  - `mobile/app/(tabs)/profile.tsx`

## Instructor demo: Progress visualization (15 minutes)

Watch how the prompt gets refined and why.

**Prompt 1 (start simple):**

```text
Create a component that shows progress across 9 modules
```

**Prompt 2 (add file path + stack):**

```text
In tma-starter-app/mobile, create a component at mobile/components/demo/ModuleProgressCard.tsx that:
- Uses React Native Paper components (Card, Text, ProgressBar)
- Shows progress across 9 modules
```

**Prompt 3 (add details + integration):**

```text
Enhance the ModuleProgressCard component:
- Show "X of 9 modules completed" as text
- Add a progress bar showing overall completion percentage
- Use placeholder data (hard-code an array of 9 modules with some marked as completed)
- Use design tokens from theme.ts for spacing

Then import and render it in mobile/app/(tabs)/home.tsx under the existing content.
Definition of done: I can see a "Module Progress" card on the home screen showing completion status across 9 modules.
```

## Student build: Profile details card (45 minutes)

Add a new “details” card to the existing Profile screen.

**You will change:**
- `mobile/app/(tabs)/profile.tsx`
- plus **one new component file** you create

### Requirements (keep it simple)

- Use React Native Paper (`Card`, `Text`, etc.)
- Use `useAuth()` from `mobile/contexts/AuthContext.tsx` to get `user`
- Show a few fields (if present):
  - Username
  - Email
  - First/Last name
  - Child name
  - Child DOB
- If `user` is null, handle it gracefully (return `null` or show a simple message)

### Prompt A (create the component)

```text
In tma-starter-app/mobile, create mobile/components/profile/UserProfileDetailsCard.tsx.

It should:
- Use React Native Paper (Card, Text)
- Use useAuth() from mobile/contexts/AuthContext.tsx
- Display 3–5 user fields (username, email, first/last name, child info if present)
- Use design tokens from theme.ts for spacing
- No any types

Definition of done:
- The component renders without TypeScript errors
```

### Prompt B (add it to the screen)

```text
In mobile/app/(tabs)/profile.tsx, import and render UserProfileDetailsCard.
Place it below the big profile header card.
Use proper spacing with designTokens.

Definition of done:
- I can see the new details card on the Profile tab
```

## Discussion
Answer briefly (2–3 sentences each):

1. How'd it go?
1. What prompt worked best today?
1. What did Cursor get wrong that you had to fix?


