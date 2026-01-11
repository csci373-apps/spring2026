---
title: "Testing with Vitest"
group: "Web UI"
group_order: 4
order: 4
---

For this course, we follow a **minimal but practical** approach for our front-end tests:

### 1. Test Pure Functions First

Pure functions are the easiest to test - they take inputs and return outputs without side effects. No mocking, no complex setup, just fast, reliable tests.

**What makes a function "pure"?**
- Same input always produces same output
- No side effects (no database calls, no API calls, no file system access)
- No dependencies on external state

**Examples of pure functions:**
- Type conversion utilities (`toBoolean`, `toNumber`)
- URL construction helpers
- Data transformation functions
- Validation functions
- API header builders

### 2. Start Small, Grow as Needed

Begin with a few simple tests. As your codebase grows, add more tests for critical paths. Don't try to test everything at once.

### 3. What We Don't Test (For Now)

- Complex React components with many dependencies (requires more setup)
- Components that heavily depend on Mantine (test your logic, not Mantine's)
- API integration (use backend tests for that)
- E2E flows

These can be added later as you learn more advanced testing techniques.

## What is Vitest?

**Vitest** is a fast, modern testing framework built by the Vite team. It's designed to work seamlessly with Vite projects and provides a Jest-compatible API, making it easy to learn and use.

**Key Features:**
- **Zero configuration** - Works out of the box with Vite
- **Fast** - Runs tests in parallel, uses Vite's fast HMR
- **Built-in assertions** - No need for separate assertion libraries
- **Mocking** - Built-in mocking capabilities
- **Watch mode** - Automatically re-runs tests when files change
- **Coverage reports** - See which code is tested
- **TypeScript support** - First-class TypeScript support

## Setting Up Vitest

Vitest is already configured in the starter app! The configuration is in `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',  // Simulates browser environment
        setupFiles: ['./src/test/setup.ts'],
        globals: true,  // Makes describe, it, expect available globally
    },
});
```

This tells Vitest to:
- Use `jsdom` environment (simulates browser DOM)
- Run setup file before tests (configures testing-library, mocks, etc.)
- Make test functions available globally (no need to import)

## Test File Structure

Tests are organized in `__tests__` directories next to the code they test:

```
ui/
└── src/
    ├── utils/
    │   ├── __tests__/
    │   │   ├── api.test.ts
    │   │   └── userUtils.test.ts
    │   ├── api.ts
    │   └── userUtils.ts
    └── components/
        └── ui/
            ├── __tests__/
            │   └── LoadingSpinner.test.tsx
            └── LoadingSpinner.tsx
```

This keeps tests close to the code they're testing, making it easy to find and maintain them.

## Writing Your First Test

Let's look at a simple example from `api.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAuthHeaders, getApiUrl } from '../api';

describe('API Utilities', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.stubEnv('VITE_API_URL', undefined);
    });

    describe('getAuthHeaders', () => {
        it('should include Content-Type by default', () => {
            const headers = getAuthHeaders();
            expect(headers['Content-Type']).toBe('application/json');
        });

        it('should include Authorization when token exists', () => {
            localStorage.setItem('auth_token', 'test-token');
            const headers = getAuthHeaders();
            expect(headers['Authorization']).toBe('Bearer test-token');
        });
    });
});
```

### Breaking Down the Structure

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

4. **`beforeEach`** - Runs before each test
   - Useful for resetting state, clearing localStorage, etc.

### Common Vitest Matchers

```typescript
// Equality
expect(value).toBe(4);              // Exact equality (===)
expect(value).toEqual({a: 1});      // Deep equality for objects

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3, 5);  // For floating point

// Strings
expect(str).toMatch(/pattern/);
expect(str).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('error message');
```

## Testing React Components

When testing React components, we use **React Testing Library**. It focuses on testing how users interact with your components, not implementation details.

### Simple Component Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
    it('should render loading message', () => {
        render(<LoadingSpinner message="Loading data..." />);
        expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('should render default message when none provided', () => {
        render(<LoadingSpinner />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
});
```

**Key points:**
- `render()` renders the component into a virtual DOM
- `screen` provides queries to find elements
- `getByText()` finds elements by their text content
- `toBeInTheDocument()` checks if element exists (from `@testing-library/jest-dom`)

### Testing Async Functions

Many utility functions are async. Here's how to test them:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchUser } from '../api';

describe('API Functions', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    it('should fetch user data', async () => {
        // Mock the fetch function
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ id: 1, username: 'testuser' }),
        });
        
        // Call the function and await the result
        const result = await fetchUser(1);
        
        // Assert the result
        expect(result.username).toBe('testuser');
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8000/api/users/1',
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': expect.stringContaining('Bearer'),
                }),
            })
        );
    });
});
```

**Key points:**
- Use `async`/`await` in your test
- Mock `global.fetch` before calling the function
- Await the result before asserting
- Verify the function was called correctly

## Mocking Dependencies

When testing functions that depend on external libraries or APIs, you need to **mock** them. Mocking means replacing the real implementation with a fake one that you control.

### Why Mock?

The `api.ts` file uses `fetch` to make HTTP requests. In tests, we don't want to actually make network requests - we want to control what happens. Mocking lets us:

1. **Control the return value** - Make the function return whatever we want
2. **Test error cases** - Make the function throw errors
3. **Verify it was called** - Check that our code calls the function correctly
4. **Run tests faster** - No actual network requests

### Step-by-Step: How Mocking Works

Let's break down the example:

```typescript
// Step 1: Import vi from vitest (for mocking)
import { vi } from 'vitest';

// Step 2: Mock global.fetch before your test
beforeEach(() => {
    global.fetch = vi.fn();
});
```

**What's happening here?**
- `vi.fn()` creates a fake function that we can control
- We replace `global.fetch` with our fake version
- Now all code that uses `fetch` will use our fake instead

```typescript
it('should fetch user data', async () => {
    // Step 3: Configure the fake function to return a specific value
    global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 1, username: 'testuser' }),
    });
```

**Breaking this down:**
- `vi.fn()` creates a mock function
- `.mockResolvedValue(...)` configures it: "When called, return a Promise that resolves to this value"
- The object `{ ok: true, json: async () => ... }` mimics a real `fetch` Response

```typescript
    // Step 4: Call the function we're testing
    const result = await fetchUser(1);
    expect(result.username).toBe('testuser');
    
    // Step 5: Verify the fake function was called correctly
    expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/users/1',
        expect.any(Object)
    );
});
```

**What's happening:**
- `fetchUser(1)` calls our code, which internally calls `fetch(...)`
- But `fetch` is our fake! It returns the value we configured
- We verify it was called with the right arguments using `toHaveBeenCalledWith()`

### Visual Example

Here's what happens without mocking vs. with mocking:

**Without mocking (real code):**
```
fetchUser(1) 
  → calls real fetch('http://localhost:8000/api/users/1')
  → actually makes HTTP request
  → waits for server response
  → returns user data (or error)
```

**With mocking (in tests):**
```
fetchUser(1)
  → calls fake fetch('http://localhost:8000/api/users/1')
  → returns { id: 1, username: 'testuser' } (what we configured)
  → no actual network request!
```

### Common Mocking Patterns

```typescript
// Make an async function succeed
vi.fn().mockResolvedValue('success value');

// Make an async function fail
vi.fn().mockRejectedValue(new Error('error message'));

// Make a sync function return a value
vi.fn().mockReturnValue(42);

// Custom behavior
vi.fn().mockImplementation((arg) => {
    if (arg === 'special') return 'special value';
    return 'default value';
});

// Verify it was called
expect(mockFunction).toHaveBeenCalled();
expect(mockFunction).toHaveBeenCalledWith('expected', 'args');
expect(mockFunction).toHaveBeenCalledTimes(2);
```

### Mocking Environment Variables

```typescript
import { vi } from 'vitest';

// Mock environment variable
vi.stubEnv('VITE_API_URL', 'http://example.com');

// Later, restore it
vi.unstubAllEnvs();
```

## Testing User Interactions

When testing components that users interact with, use `@testing-library/user-event`:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';

describe('LoginForm', () => {
    it('should submit form with username and password', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        
        render(<LoginForm onSubmit={onSubmit} />);
        
        await user.type(screen.getByLabelText(/username/i), 'testuser');
        await user.type(screen.getByLabelText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));
        
        expect(onSubmit).toHaveBeenCalledWith({
            username: 'testuser',
            password: 'password123',
        });
    });
});
```

**Key points:**
- `userEvent.setup()` creates a user interaction helper
- `user.type()` simulates typing
- `user.click()` simulates clicking
- Always `await` user interactions (they're async)

## Running Tests

### Run All Tests

```bash
npm test
```

This runs all tests once and exits.

### Run Tests in Watch Mode

```bash
npm run test:watch
```

This watches for file changes and automatically re-runs tests. Great for development!

### Run Tests Verbosely

```bash
npm run test:verbose
```

Shows individual test names instead of just test suites, making it easier to see which specific tests pass or fail.

### Run Tests with UI

```bash
npm run test:ui
```

Opens Vitest's web UI for an interactive testing experience.

### Run Tests with Coverage

```bash
npm run test:coverage
```

Shows which code is covered by tests.

### Run a Specific Test File

```bash
npm test -- api.test.ts
```

Only runs tests in files matching the pattern.

## Test Output

When tests pass, you'll see:

```bash
✓ src/utils/__tests__/api.test.ts (5) 120ms
  API Utilities
    getAuthHeaders
      ✓ should include Content-Type by default
      ✓ should include Authorization when token exists
    getApiUrl
      ✓ should default to localhost:8000/api

Test Files  1 passed (1)
     Tests  5 passed (5)
```

When tests fail, Vitest shows:
- Which test failed
- What was expected vs. what was received
- The line number where the failure occurred
- A helpful error message

## Best Practices

### 1. Write Clear Test Names

**Bad:**
```typescript
it('test1', () => { ... });
it('works', () => { ... });
```

**Good:**
```typescript
it('should return null when value is null', () => { ... });
it('should include Authorization header when token exists', () => { ... });
```

### 2. Test One Thing Per Test

Each test should verify a single behavior. If a test fails, you should immediately know what's broken.

### 3. Use Descriptive `describe` Blocks

Organize tests logically:

```typescript
describe('API Utilities', () => {
    describe('getAuthHeaders', () => {
        // All getAuthHeaders tests here
    });
    
    describe('getApiUrl', () => {
        // All getApiUrl tests here
    });
});
```

### 4. Keep Tests Simple

Tests should be easy to read and understand. If a test is complex, the code being tested might be too complex.

### 5. Test Edge Cases

Don't just test the "happy path" - test edge cases too:
- `null` and `undefined` inputs
- Empty strings
- Invalid inputs
- Boundary values

### 6. Clean Up After Tests

Use `beforeEach` and `afterEach` to set up and clean up:

```typescript
beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
});
```

## Example: Complete Test File

Here's a complete example from `api.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAuthHeaders, getApiUrl } from '../api';

describe('API Utilities', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.stubEnv('VITE_API_URL', undefined);
    });

    describe('getAuthHeaders', () => {
        it('should include Content-Type by default', () => {
            const headers = getAuthHeaders();
            expect(headers['Content-Type']).toBe('application/json');
        });

        it('should include Authorization when token exists', () => {
            localStorage.setItem('auth_token', 'test-token');
            const headers = getAuthHeaders();
            expect(headers['Authorization']).toBe('Bearer test-token');
        });

        it('should not include Authorization when no token', () => {
            const headers = getAuthHeaders();
            expect(headers['Authorization']).toBeUndefined();
        });

        it('should exclude Content-Type when requested', () => {
            const headers = getAuthHeaders(false);
            expect(headers['Content-Type']).toBeUndefined();
        });
    });

    describe('getApiUrl', () => {
        it('should default to localhost:8000/api', () => {
            const url = getApiUrl();
            expect(url).toBe('http://localhost:8000/api');
        });

        it('should append /api if not present', () => {
            vi.stubEnv('VITE_API_URL', 'http://example.com');
            const url = getApiUrl();
            expect(url).toBe('http://example.com/api');
        });

        it('should not duplicate /api', () => {
            vi.stubEnv('VITE_API_URL', 'http://example.com/api');
            const url = getApiUrl();
            expect(url).toBe('http://example.com/api');
        });
    });
});
```

## Adding Tests to Your Code

When you write a new utility function, add tests for it:

1. **Create a test file** in the `__tests__` directory next to your code
2. **Import the function** you're testing
3. **Write test cases** for:
   - Normal use cases
   - Edge cases (null, undefined, empty strings)
   - Error cases (invalid inputs)
4. **Run the tests** to make sure they pass
5. **Refactor if needed** - tests help you write better code!

## Resources

- [Vitest Documentation](https://vitest.dev/guide/)
- [Vitest API Reference](https://vitest.dev/api/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Summary

- **Test pure functions first** - They're easy to test and catch real bugs
- **Use Vitest** - It's already set up in the starter app
- **Use React Testing Library** - Focus on user interactions, not implementation
- **Organize tests** in `__tests__` directories
- **Write clear test names** that describe what they verify
- **Test edge cases** - Not just the happy path
- **Run tests frequently** - Catch bugs early!

Testing is a skill that improves with practice. Start with simple utility functions and gradually add more tests as your codebase grows.

