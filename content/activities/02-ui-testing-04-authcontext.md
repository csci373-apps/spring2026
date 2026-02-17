---
title: "UI Testing: AuthContext (provider + fetch + redirects)"
start_date: "2026-02-17"
type: "activity"
draft: 0
ordering: 4
heading_max_level: 3
---

This walkthrough covers a “realistic” test target that mixes:
- React Context (`AuthProvider` / `useAuth`)
- Async behavior (`fetch`)
- Persistence (`localStorage`)
- Side effects (redirect attempts via `window.location`)

It’s normal if this test genre feels harder than a pure unit test.

## 1. Inspect the code you’re about to test

Before writing tests, open the implementation:
- `ui/src/contexts/AuthContext.tsx`

What this code does (the behaviors we need to test):
- If there’s **no token** in storage, it settles into a logged-out state.
- If there **is** a token, it calls **`/auth/me`** to load the current user.
- If `/auth/me` returns **401/403**, it clears tokens and **redirects to `/login`**.
- If the network fails, it **stops loading** but does **not** clear the token.

As you skim, try to answer:
- Where does it read/write `localStorage`?
- When does it call `fetch`, and what endpoint does it hit?
- Under what conditions does it redirect to `/login`?

If you can point to the exact lines in the file that correspond to each behavior below, the tests will make a lot more sense.



## 2. Goal

Add tests for `ui/src/contexts/AuthContext.tsx` that cover:

| # | Test data / circumstances | Expected result |
|---:|---|---|
| 1 | No token in `localStorage` | `isAuthenticated=false`, `userInfo=null`, `loading=false` |
| 2 | Valid token present + `/auth/me` returns 200 OK | Sets `isAuthenticated=true` and populates `userInfo` |
| 3 | Valid token present + `/auth/me` returns 401/403 | Clears `auth_token` + `token_type` and redirects to `/login` |
| 4 | Network failure (fetch rejects with “Failed to fetch”) | Does **not** clear the token, but sets `loading=false` |

## 3. Setup

From `ui/`:

```bash
npm test
```

## 4. Create the test file

Create:
- `ui/src/contexts/__tests__/AuthContext.test.tsx`

## 5. Starter: imports + wrapper

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../AuthContext';

function wrapper({ children }: { children: React.ReactNode }) {
  // renderHook() needs a React component to wrap the hook under test.
  // AuthProvider provides the context value that useAuth() reads.
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    // Reset state between tests so one test can’t affect another.
    localStorage.clear();
    // Undo any spies/mocks from previous tests (puts real functions back).
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Extra safety: make sure we don’t leak tokens across tests.
    localStorage.clear();
  });

  // tests go here...
});
```

## 6. Tests

### 6.1. Test #1: no token

```tsx
it('no token => logged out and not loading', async () => {
  // Stub fetch so the test is deterministic and we can assert “not called”.
  const fetchMock = vi.fn();
  // Replace the global fetch with our stub for this test.
  vi.stubGlobal('fetch', fetchMock);

  // Render the hook inside the AuthProvider wrapper.
  const { result } = renderHook(() => useAuth(), { wrapper });

  // AuthProvider starts with loading=true and then settles after its auth check.
  // waitFor retries until the assertion passes (or times out).
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.isAuthenticated).toBe(false);
  expect(result.current.userInfo).toBeNull();

  // Optional: should not hit /auth/me if there is no token
  expect(fetchMock).not.toHaveBeenCalled();
});
```

### 6.2. Test #2: valid token + `/auth/me` success

```tsx
it('valid token => fetches /auth/me and sets userInfo', async () => {
  // Arrange: “user is logged in” (AuthContext reads this key).
  localStorage.setItem('auth_token', 'test-token');

  // Stub fetch to simulate a successful /auth/me response.
  // Note: AuthContext calls response.json(), so we provide json(): Promise<...>.
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      id: 123,
      username: 'alice',
      email: 'alice@example.com',
      role: { name: 'user' },
    }),
  });
  vi.stubGlobal('fetch', fetchMock);

  const { result } = renderHook(() => useAuth(), { wrapper });

  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.userInfo?.username).toBe('alice');

  // Assert: AuthContext should call /auth/me with the Bearer token header.
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringMatching(/\/auth\/me$/),
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer test-token',
      }),
    })
  );
});
```

### 6.3. Test #3: 401/403 clears tokens and redirects

**Gotcha:** in jsdom, assigning `window.location.href = '/login'` can trigger “navigation not implemented” errors.

Recommended approach:
- Assert **tokens are cleared** (required).
- Also assert a **redirect was attempted** by spying on the `href` setter (works in many jsdom setups).

```tsx
it('401 from /auth/me => clears token and redirects to /login', async () => {
  localStorage.setItem('auth_token', 'test-token');
  localStorage.setItem('token_type', 'bearer');

  // Stub fetch: /auth/me returns an auth error.
  const fetchMock = vi.fn().mockResolvedValue({
    ok: false,
    status: 401,
    statusText: 'Unauthorized',
  });
  vi.stubGlobal('fetch', fetchMock);

  // Make sure we’re not already on /login, otherwise AuthContext won’t redirect
  const originalPathname = window.location.pathname;
  Object.defineProperty(window.location, 'pathname', {
    value: '/dashboard',
    configurable: true,
  });

  // Spy on the href setter (if this fails in your environment, treat redirect assertion as optional)
  // This lets us assert “redirect attempted” without real navigation.
  const hrefSpy = vi.spyOn(window.location, 'href', 'set');

  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.loading).toBe(false));

  // Required: tokens are cleared on auth failure.
  expect(localStorage.getItem('auth_token')).toBeNull();
  expect(localStorage.getItem('token_type')).toBeNull();
  expect(result.current.isAuthenticated).toBe(false);
  expect(result.current.userInfo).toBeNull();

  // Optional: confirm it tried to navigate to /login.
  expect(hrefSpy).toHaveBeenCalledWith('/login');

  // Cleanup: restore the spy and pathname change.
  hrefSpy.mockRestore();
  Object.defineProperty(window.location, 'pathname', {
    value: originalPathname,
    configurable: true,
  });
});
```

### 6.4. Test #4: network failure doesn’t clear the token

```tsx
it('network failure => does not clear token, stops loading', async () => {
  localStorage.setItem('auth_token', 'test-token');

  // Simulate backend being down (fetch rejects).
  const fetchMock = vi.fn().mockRejectedValue(new Error('Failed to fetch'));
  vi.stubGlobal('fetch', fetchMock);

  const { result } = renderHook(() => useAuth(), { wrapper });

  // Even on failure, AuthContext should stop “loading” so the UI can render.
  await waitFor(() => expect(result.current.loading).toBe(false));
  // Intended behavior: keep the token (don’t log the user out just because the backend is down).
  expect(localStorage.getItem('auth_token')).toBe('test-token');
});
```

## 7. Run your tests

From `ui/`:

```bash
npm test
```

