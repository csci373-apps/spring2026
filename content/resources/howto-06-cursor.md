---
title: "Working with the Cursor AI Editor"
group: "How To Guides"
group_order: 2
order: 6
quicklink: 1
heading_max_level: 3
---

Guide for effectively using Cursor (AI code editor). The examples are geared towards React Native/Expo development, but the principles and techniques apply more broadly. This guide covers configuration, best practices, and project-specific tips.

## 1. Introduction

Cursor is an AI-powered code editor that understands your entire codebase context. Unlike ChatGPT or GitHub Copilot, it can generate code, debug, refactor, and answer questions about your project.

**Why it matters for React Native:** AI models are trained on far more web React code than React Native code. Without proper configuration, Cursor defaults to web patterns (like `react-router-dom` or CSS-in-JS) that don't work on mobile. A properly configured `.cursorrules` file ensures Cursor generates correct React Native patterns.

**Key Point:** Cursor is a tool to enhance your productivity and learning, not replace your understanding of code.

## 2. Getting Started

1. Open Cursor in your project directory (`tma-starter-app/mobile`)
2. Open the AI chat panel and type your prompt
3. Review the generated code carefully, then iterate by refining your prompt

**Quick tip:** Use Cmd+K (Mac) or Ctrl+K (Windows/Linux) for inline edits on selected code.

## 3. The .cursorrules File

The `.cursorrules` file provides Cursor with project-specific rules about your tech stack, coding conventions, and patterns. For React Native/Expo, it should include: stack versions, navigation patterns (Expo Router), component patterns (React Native Paper), TypeScript conventions, and code style.

**Setup:**
1. Download [the sample template](/spring2026/downloads/cursorrules.md)
2. Rename it to `.cursorrules` and place it at `tma-starter-app/mobile/.cursorrules`
3. Commit it to your repository so your team shares the same configuration

**Cursor Settings:** Start with defaults. You can adjust model selection, context window, privacy, and code completion in Cursor's settings as needed.

## 4. Best Practices

**Good prompts:** Be specific, include context, and specify requirements. Example:

```text
Create a PostGeneric component in mobile/components/posts/PostGeneric.tsx that:
- Takes a post prop with title (string) and text (string)
- Uses React Native Paper Card component
- Uses TypeScript with proper prop types
- Handles long text with scrolling
```

**Poor prompts:** "Make a component" (too vague), "Fix this" (no context), "Do everything" (too broad).


## 5. Project-Specific Tips

The `tma-starter-app/mobile` project uses Expo Router (file-based routing), React Native Paper, React Query, TypeScript, and design tokens from `theme.ts`.

**Key patterns:**
- **Expo Router**: Files in `app/` become routes; `[id].tsx` creates dynamic routes; `(tabs)/` are route groups
- **React Native Paper**: Always specify "React Native Paper Button" (not just "button"); use design tokens from `theme.ts`
- **React Query**: Use array query keys like `['moduleDetail', moduleId]`; handle loading/error states
- **Types**: Use existing types from `types/api.ts` (Module, Course, Post, etc.); don't create duplicates

**Example prompts:**
```text
Create a screen at app/(tabs)/modules/[id].tsx that uses useLocalSearchParams, 
fetches with React Query, and displays with React Native Paper components.

Create a component using the Module type from types/api.ts, typed as Module (not any).
```

## 6. Other Things Cursor is Good At

**Refactoring:** Ask for improvements ("How can I make this function more readable?") or request refactoring ("Refactor this component to extract reusable logic"). Get SWE recommendations on design patterns.

**Writing Tests:** Generate test cases, create fixtures/mock data, write integration tests for APIs, and generate unit tests. Example: "Write Jest tests for this component using React Native Testing Library."

**Debugging:** Explain error messages, suggest fixes, help trace bugs, and explain why code isn't working. Example: "I'm getting this error: [paste]. Explain what's wrong and suggest a fix."

## 7. Additional Resources

- [AI Coding Rules for Mobile Development](https://localskills.sh/blog/ai-rules-mobile-dev) - Comprehensive guide on `.cursorrules` for React Native
- [Cursor Documentation](https://docs.cursor.com/) - Official Cursor documentation

## 8. Remember

- **AI is a tool**: Use it to enhance your learning, not replace understanding
- **Always review**: Never accept AI-generated code without reviewing it
- **Understand the code**: If you don't understand it, you haven't learned
- **Iterate and refine**: Good prompts come from practice
- **Always follow course policies**: Check your course's AI use policy for assignments

**Key Point:** Cursor is powerful, but it requires critical thinking and code review. Use it wisely to enhance your productivity and learning.
