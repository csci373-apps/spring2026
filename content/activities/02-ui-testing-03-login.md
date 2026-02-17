---
title: "UI Testing: LoginPage (component tests)"
start_date: "2026-02-17"
type: "activity"
draft: 0
ordering: 3
heading_max_level: 3
---

This walkthrough is a gentle introduction to **React Testing Library** component testing using a real page:

- `ui/src/pages/auth/LoginPage.tsx`

You’ll practice:
- Simulating typing/clicking with `userEvent`
- Mocking `fetch` (network)
- Mocking `useAuth` (context dependency)
- Mocking `useNavigate` + using fake timers (redirect after success)

## 1. Goal

Add component tests for:
- `ui/src/pages/auth/LoginPage.tsx`

## 2. Setup

From `ui/`:

```bash
docker exec -it tma_frontend npm test
```

## 3. Open the page you’re testing

Open: `ui/src/pages/auth/LoginPage.tsx`

Identify key behaviors:
- Renders username/password inputs and a submit button
- On failed login: shows an error `Alert`
- On successful login: calls `login(access_token)`, shows success `Alert`, and then navigates to `/` after a timeout

## 4. Create the test file

Create:
- `ui/src/pages/auth/__tests__/LoginPage.test.tsx`

## 5. Starter tests (copy/paste)

This activity is easiest if you do it in **small steps**. Don’t start by copy/pasting a huge test file.

### 5.1. What we’re testing (beginner-friendly minimum)

Required (good beginner set):
- The form renders (Username, Password, Login button)
- Failed login shows an error message
- Successful login calls `login(access_token)` and shows the success message

Stretch (optional):
- Verify it navigates to `/` after 500ms (requires mocking navigation + fake timers)

### 5.2. What we need to “fake” in tests

`LoginPage` depends on two things outside the component:
- **`useAuth()`** (so we’ll mock it to supply a fake `API_URL` and a fake `login()` function)
- **`fetch`** (so tests don’t do real network calls)

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { theme } from '../../../theme';
import LoginPage from '../LoginPage';

// Mock AuthContext so we control API_URL + login().
// Without this, the component would use the real AuthContext (and real app state).
const loginMock = vi.fn();
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    API_URL: 'http://localhost:8000/api',
    login: loginMock,
    userInfo: null,
    loading: false,
  }),
}));

function renderLoginPage() {
  // This page uses react-router components (<Link>) so it needs a router.
  // Mantine components work best inside MantineProvider so styles/behavior are consistent.
  return render(
    <MemoryRouter>
      <MantineProvider theme={theme}>
        <LoginPage />
      </MantineProvider>
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    // Reset mocks between tests so tests can’t affect each other.
    vi.restoreAllMocks();
    loginMock.mockReset();
  });

  afterEach(() => {
    // If a later test uses fake timers, this ensures we restore real timers.
    vi.useRealTimers();
  });

  it('renders the login form', () => {
    renderLoginPage();
    // `getByLabelText(/username/i)` finds the input the same way a user would:
    // by looking at the visible <label> text ("Username"). The `/.../i` means
    // “case-insensitive regex match”.
    //
    // `toBeInTheDocument()` is just “this element rendered on the page”.
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    // Button text is "Login" in this page
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows an error alert on failed login', async () => {
    const user = userEvent.setup();

    // Stub the global fetch() so clicking Login doesn’t hit a real backend.
    // This simulates a failed login response with a JSON error message.
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ detail: 'Invalid credentials' }),
      })
    );

    renderLoginPage();

    // `user.type(...)` simulates a real user typing into the input.
    // That fires keyboard + input/change events, which triggers the component’s
    // `onChange` handlers and updates React state.
    //
    // We `await` typing because userEvent is async (it simulates keystrokes over time). 
    // Targets the form control, not the label element:
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // The page shows the server-provided error message in an Alert.
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('on success: calls login(token) and shows success message', async () => {
    const user = userEvent.setup();

    // Simulate a successful login response: server returns an access_token.
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: 'test-token' }),
      })
    );

    renderLoginPage();

    // Note: LoginPage trims username before sending it.
    await user.type(screen.getByLabelText(/username/i), '  alice  ');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Page should call login() with the token from the response
    expect(loginMock).toHaveBeenCalledWith('test-token');
    expect(await screen.findByText(/login successful/i)).toBeInTheDocument();
  });
});
```

## 6. Add one more test (recommended)

Pick one:
- Assert `fetch` was called with the expected URL: `${API_URL}/auth/login`
- Assert the request body uses `username.trim()` (e.g., `'  alice  '` becomes `'alice'`)
- Assert the submit button shows a loading state while waiting

## 7. Stretch: test the redirect after 500ms (optional)

`LoginPage` does `setTimeout(() => navigate('/'), 500)`. To test that, you need:
- a mocked `useNavigate`
- fake timers

Add at the top of the file (above `renderLoginPage()`):

```tsx
// We'll replace react-router's real navigate() function with a spy.
// In the real app, navigate() changes the URL. In tests, we want to *observe* redirects.
const navigateMock = vi.fn();

// IMPORTANT: this must be top-level (not inside a test), so it applies when LoginPage is imported.
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...actual,
    // Any component that calls useNavigate() will now receive our navigateMock.
    useNavigate: () => navigateMock,
  };
});
```

Then add a test like:

```tsx
it('after success: navigates to / after 500ms (stretch)', async () => {
  // Fake timers let us advance time instantly (instead of waiting a real 500ms).
  vi.useFakeTimers();
  navigateMock.mockReset();

  // userEvent uses timers internally; this tells it how to advance timers while typing.
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'test-token' }),
    })
  );

  renderLoginPage();
  await user.type(screen.getByLabelText(/username/i), 'alice');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /login/i }));

  // Wait until the page shows the success message.
  // This tells us the "success branch" ran and the setTimeout(…, 500) redirect was scheduled.
  await screen.findByText(/login successful/i);

  // Run the timeout callback (500ms) immediately.
  vi.advanceTimersByTime(500);
  expect(navigateMock).toHaveBeenCalledWith('/');
});
```

## 8. Run your tests

From `ui/`:

```bash
docker exec -it tma_frontend npm test
```

