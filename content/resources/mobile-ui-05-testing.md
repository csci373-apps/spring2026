---
title: "Testing with Jest"
group: "Mobile UI"
group_order: 5
order: 5
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

### 2. Start Small, Grow as Needed

Begin with a few simple tests. As your codebase grows, add more tests for critical paths. Don't try to test everything at once.

### 3. What We Don't Test (For Now)

- React Native components (more complex, requires React Native Testing Library)
- Context providers
- API integration (use backend tests for that)
- E2E flows

These can be added later as you learn more advanced testing techniques.

## What is Jest?

**Jest** is a JavaScript testing framework developed by Facebook. It's the most popular testing framework for JavaScript and React Native applications.

**Key Features:**
- **Zero configuration** - Works out of the box with Expo
- **Fast** - Runs tests in parallel
- **Built-in assertions** - No need for separate assertion libraries
- **Mocking** - Built-in mocking capabilities
- **Watch mode** - Automatically re-runs tests when files change
- **Coverage reports** - See which code is tested

## Setting Up Jest

Jest is already configured in the starter app! The configuration is in `jest.config.js`:

```javascript
module.exports = {
    preset: 'jest-expo',  // Uses Expo's Jest preset
    testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
    // ... other config
};
```

This tells Jest to:
- Use Expo's preset (handles React Native specifics)
- Find test files in `__tests__` directories
- Look for files ending in `.test.ts` or `.test.tsx`

## Test File Structure

Tests are organized in `__tests__` directories next to the code they test:

```
mobile/
└── utils/
    ├── __tests__/
    │   ├── typeGuards.test.ts
    │   └── storage.test.ts
    ├── typeGuards.ts
    └── storage.ts
```

This keeps tests close to the code they're testing, making it easy to find and maintain them.

## Writing Your First Test

Let's look at a simple example from `typeGuards.test.ts`:

```typescript
import { describe, it, expect } from '@jest/globals';
import { toBoolean } from '../typeGuards';

describe('typeGuards', () => {
    describe('toBoolean', () => {
        it('should return boolean as-is', () => {
            expect(toBoolean(true)).toBe(true);
            expect(toBoolean(false)).toBe(false);
        });

        it('should convert string "true" to true', () => {
            expect(toBoolean('true')).toBe(true);
            expect(toBoolean('TRUE')).toBe(true);
            expect(toBoolean('True')).toBe(true);
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
   - Should be clear and specific: "should convert string 'true' to true"

3. **`expect`** - Makes assertions about the code
   - `expect(actual).toBe(expected)` - Checks exact equality
   - `expect(actual).toBeNull()` - Checks for null
   - `expect(actual).toBeTruthy()` - Checks for truthy value
   - Many more matchers available!

### Common Jest Matchers

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

## Testing Async Functions

Many utility functions are async. Here's how to test them:

```typescript
import { getItem } from '../storage';

describe('storage', () => {
    it('should return value from SecureStore', async () => {
        // Mock the SecureStore function
        (SecureStore.getItemAsync as jest.MockedFunction<typeof SecureStore.getItemAsync>)
            .mockResolvedValue('stored-value');
        
        // Call the function and await the result
        const result = await getItem('test-key');
        
        // Assert the result
        expect(result).toBe('stored-value');
    });
});
```

**Key points:**
- Use `async`/`await` in your test
- Mock async dependencies before calling the function
- Await the result before asserting

## Mocking Dependencies

When testing functions that depend on external libraries, you need to **mock** them. Mocking means replacing the real implementation with a fake one that you control.

### Why Mock?

The `storage.ts` file uses `expo-secure-store` to save data. In tests, we don't want to actually save data to the device - we want to control what happens. Mocking lets us:

1. **Control the return value** - Make the function return whatever we want
2. **Test error cases** - Make the function throw errors
3. **Verify it was called** - Check that our code calls the function correctly
4. **Run tests faster** - No actual file system or device access

### Step-by-Step: How Mocking Works

Let's break down the example:

```typescript
// Step 1: Import the module (this is normal)
import * as SecureStore from 'expo-secure-store';

// Step 2: Tell Jest to replace the real module with a fake one
jest.mock('expo-secure-store', () => ({
    // Create fake functions that replace the real ones
    getItemAsync: jest.fn(),      // Fake version of getItemAsync
    setItemAsync: jest.fn(),      // Fake version of setItemAsync
    deleteItemAsync: jest.fn(),   // Fake version of deleteItemAsync
}));
```

**What's happening here?**
- `jest.mock()` tells Jest: "When any code imports 'expo-secure-store', use my fake version instead"
- `jest.fn()` creates a fake function that we can control
- The object `{ getItemAsync: jest.fn(), ... }` is what gets imported instead of the real module

```typescript
describe('storage', () => {
    it('should get item from SecureStore', async () => {
        // Step 3: Configure the fake function to return a specific value
        (SecureStore.getItemAsync as jest.MockedFunction<typeof SecureStore.getItemAsync>)
            .mockResolvedValue('my-value');
```

**Breaking this down:**
- `SecureStore.getItemAsync` is now our fake function (created by `jest.fn()`)
- `as jest.MockedFunction<...>` tells TypeScript "this is a mock, so it has special methods"
- `.mockResolvedValue('my-value')` configures the fake: "When called, return a Promise that resolves to 'my-value'"

```typescript
        // Step 4: Call the function we're testing
        const result = await getItem('key');
        expect(result).toBe('my-value');
        
        // Step 5: Verify the fake function was called correctly
        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('key');
    });
});
```

**What's happening:**
- `getItem('key')` calls our code, which internally calls `SecureStore.getItemAsync('key')`
- But `SecureStore.getItemAsync` is our fake! It returns `'my-value'` as we configured
- We verify it was called with the right argument using `toHaveBeenCalledWith()`

### Visual Example

Here's what happens without mocking vs. with mocking:

**Without mocking (real code):**
```
getItem('key') 
  → calls real SecureStore.getItemAsync('key')
  → actually reads from device storage
  → returns whatever is stored (or null)
```

**With mocking (in tests):**
```
getItem('key')
  → calls fake SecureStore.getItemAsync('key')
  → returns 'my-value' (what we configured)
  → no actual device access!
```

### Common Mocking Patterns

```typescript
// Make an async function succeed
mockFunction.mockResolvedValue('success value');

// Make an async function fail
mockFunction.mockRejectedValue(new Error('error message'));

// Make a sync function return a value
mockFunction.mockReturnValue(42);

// Custom behavior
mockFunction.mockImplementation((arg) => {
    if (arg === 'special') return 'special value';
    return 'default value';
});

// Verify it was called
expect(mockFunction).toHaveBeenCalled();
expect(mockFunction).toHaveBeenCalledWith('expected', 'args');
expect(mockFunction).toHaveBeenCalledTimes(2);
```

### TypeScript Type Assertion

The `as jest.MockedFunction<...>` part is a TypeScript type assertion. It tells TypeScript:

> "I know this is a mock function, so it has methods like `mockResolvedValue()`"

Without it, TypeScript would complain because the real `SecureStore.getItemAsync` doesn't have a `mockResolvedValue()` method - only our fake version does.

**Alternative (simpler but less type-safe):**
```typescript
// Works, but loses type safety
(SecureStore.getItemAsync as any).mockResolvedValue('my-value');
```

**Best practice:**
```typescript
// Type-safe and clear
(SecureStore.getItemAsync as jest.MockedFunction<typeof SecureStore.getItemAsync>)
    .mockResolvedValue('my-value');
```

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

### Run a Specific Test File

```bash
npm test -- storage.test.ts
```

Only runs tests in files matching the pattern.

## Test Output

When tests pass, you'll see:

```bash
PASS utils/__tests__/storage.test.ts
  storage
    getItem
      ✓ should return value from SecureStore (2 ms)
      ✓ should return null when SecureStore returns null
    setItem
      ✓ should set value in SecureStore

Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
```

When tests fail, Jest shows:
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
it('should convert string "true" to boolean true', () => { ... });
```

### 2. Test One Thing Per Test

Each test should verify a single behavior. If a test fails, you should immediately know what's broken.

### 3. Use Descriptive `describe` Blocks

Organize tests logically:

```typescript
describe('typeGuards', () => {
    describe('toBoolean', () => {
        // All toBoolean tests here
    });
    
    describe('toNumber', () => {
        // All toNumber tests here
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

## Example: Complete Test File

Here's a complete example from `typeGuards.test.ts`:

```typescript
import { describe, it, expect } from '@jest/globals';
import { toBoolean, toNumber } from '../typeGuards';

describe('typeGuards', () => {
    describe('toBoolean', () => {
        it('should return boolean as-is', () => {
            expect(toBoolean(true)).toBe(true);
            expect(toBoolean(false)).toBe(false);
        });

        it('should convert string "true" to true', () => {
            expect(toBoolean('true')).toBe(true);
            expect(toBoolean('TRUE')).toBe(true);
            expect(toBoolean('True')).toBe(true);
            expect(toBoolean('  true  ')).toBe(true);
        });

        it('should convert string "false" to false', () => {
            expect(toBoolean('false')).toBe(false);
            expect(toBoolean('FALSE')).toBe(false);
        });

        it('should return default user color for unknown role', () => {
            expect(toBoolean('unknown')).toBe(false);
            expect(toBoolean('')).toBe(false);
        });
    });

    describe('toNumber', () => {
        it('should return number as-is', () => {
            expect(toNumber(42)).toBe(42);
            expect(toNumber(0)).toBe(0);
        });

        it('should convert valid numeric strings to numbers', () => {
            expect(toNumber('42')).toBe(42);
            expect(toNumber('0')).toBe(0);
        });

        it('should return 0 for invalid numeric strings', () => {
            expect(toNumber('abc')).toBe(0);
            expect(toNumber('not a number')).toBe(0);
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

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest Matchers](https://jestjs.io/docs/expect)
- [Jest Mocking](https://jestjs.io/docs/mock-functions)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Summary

- **Test pure functions first** - They're easy to test and catch real bugs
- **Use Jest** - It's already set up in the starter app
- **Organize tests** in `__tests__` directories
- **Write clear test names** that describe what they verify
- **Test edge cases** - Not just the happy path
- **Run tests frequently** - Catch bugs early!

Testing is a skill that improves with practice. Start with simple utility functions and gradually add more tests as your codebase grows.
