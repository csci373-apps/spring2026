---
title: "UI Testing: DateUtils (unit tests)"
start_date: "2026-02-17"
type: "activity"
draft: 0
ordering: 2
heading_max_level: 3
---

This walkthrough is the easiest starting point for UI testing in this codebase because it’s **pure TypeScript**: inputs → outputs, no React, no DOM, no `fetch`.

## Goal

Add solid unit test coverage for:
- `ui/src/utils/dateUtils.ts`

## Setup

From `ui/`:

```bash
docker exec -it tma_frontend npm test
```

## 1. Open the file you’re testing

Open: `ui/src/utils/dateUtils.ts`

Identify the exported (i.e., public) functions:
- formatAge(age)
- formatLastActive(date)

## 2. Create the test file

Create:
- `ui/src/utils/__tests__/dateUtils.test.ts`


## 3. Starter tests (copy/paste)

These tests cover the most important branches and edge cases.

```ts
import { describe, it, expect } from 'vitest';
import { formatAge, formatLastActive } from '../dateUtils';

describe('dateUtils.formatAge', () => {
  it('returns N/A for null/undefined', () => {
    expect(formatAge(null)).toBe('N/A');
    expect(formatAge(undefined)).toBe('N/A');
  });

  it('handles years/months with correct pluralization', () => {
    expect(formatAge({ years: 1, months: 1 })).toBe('1 year, 1 month');
    expect(formatAge({ years: 2, months: 0 })).toBe('2 years');
    expect(formatAge({ years: 0, months: 3 })).toBe('3 months');
  });

  it('handles the 0 years / 0 months case', () => {
    expect(formatAge({ years: 0, months: 0 })).toBe('Less than 1 month');
  });
});

describe('dateUtils.formatLastActive', () => {
  it('returns N/A for null/undefined', () => {
    expect(formatLastActive(null)).toBe('N/A');
    expect(formatLastActive(undefined)).toBe('N/A');
  });

  it('returns N/A for invalid date strings', () => {
    expect(formatLastActive('not-a-date')).toBe('N/A');
  });

  it('returns Just now for future dates (or same moment)', () => {
    // the underscore is a numeric separator in JS/TS 
    // to make big numbers easier to read. 
    // 60,000 milliseconds = 60 seconds = 1 minute.
    const future = new Date(Date.now() + 60_000);
    expect(formatLastActive(future)).toBe('Just now');
  });
});
```

### 4. Breaking Down the Structure

1. **`describe`** - Groups related tests together
   - First `describe` creates a test suite (usually named after the module)
   - Nested `describe` blocks organize tests by function or feature

2. **`it`** - Defines a single test case
   - The string describes what the test verifies
   - Should be clear and specific: "should include Authorization when token exists"

3. **`expect`** - Makes assertions about the code
   - `expect(actual).toBe(expected)` - Checks exact equality
   - `expect(actual).toBeNull()` - Checks for null
   - `expect(actual).toBeTruthy()` - Checks for truthy value
   - Many more matchers available!

4. **`beforeEach`** - Not used here but worth mentioning: Runs before each test
   - Useful for resetting state, clearing localStorage, etc.

## 5. Your Task: Add “today” and “yesterday” cases

`formatLastActive` is time-sensitive. The simplest approach is to build dates relative to “now”.

Add tests like:
- A date from 2 minutes ago ⇒ `"2 minutes ago"` (or “Just now” depending on boundary)
- A date from yesterday ⇒ `"Yesterday"`

## 6. Run and iterate

```bash
docker exec -it tma_frontend npm test
```

If a test fails because of boundary conditions (minutes/hours), adjust the inputs so they’re clearly inside the intended bucket.

