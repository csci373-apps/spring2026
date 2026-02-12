---
title: "TypeScript, Contexts, Hooks"
start_date: "2026-02-17"
type: "activity"
draft: 1
heading_max_level: 3
---

Today is about making Tuesday’s code safer, clearer, and easier to change.

## 1. Goal

### 1.1. By the end

- Your page is typed (no guessing what the backend returns).
- Your API calls are centralized (one place to change URLs/shapes).
- You have at least one small, useful test.

## 2. Task (pairs)

### 2.1. Start from Tuesday

- Pick one Tuesday PR to work from.

### 2.2. TypeScript practice

Resource: `/spring2026/resources/web-ui-02-typescript-js-patterns`

- Define a `Module` type matching your current backend response shape.
- Type your component state and props.
- Use at least one of: destructuring, spread, optional chaining.

### 2.3. Centralize API calls

- Put all Module API calls into a single file (one place to edit URLs/payloads).
- Ensure the auth token is sent.

### 2.4. UI states polish

Resource: `/spring2026/resources/web-ui-01-intro-to-react`

- Keep retry.
- Make errors readable.
- Use early returns for at least one UI state.

### 2.5. Mantine/Tailwind upgrade (small)

Resource: `/spring2026/resources/web-ui-03-mantine-tailwind`

- Replace one raw HTML element with a Mantine widget (Button/Alert/Loader).

### 2.6. Add one test (minimal)

Resource: `/spring2026/resources/web-ui-04-testing`

- Add 2 tests for one pure helper function you created (or extracted) yesterday.

## 3. Checkpoint

### 3.1. Explain to your partner

- What your `Module` type guarantees.
- Where you would change code if the endpoint path changes.

