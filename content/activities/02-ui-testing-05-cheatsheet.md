---
title: "UI Testing: Cheatsheet (mocks + patterns)"
start_date: "2026-02-17"
type: "activity"
draft: 0
ordering: 5
heading_max_level: 3
---

This is a quick-reference cheatsheet for **Vitest + React Testing Library** in the TMA UI repo (`tma-starter-app/ui`).

## Commands

From `ui/`:

```bash
npm test
npm run test:ui
npm run test:coverage
```

## Cheatsheet table (helpers + when to use)

| Goal | Tool / pattern | What it does | Tiny example | Notes / gotchas |
|---|---|---|---|---|
| Make a fake function | `vi.fn()` | Creates a stub function you can also assert on (calls/args). | `const f = vi.fn(); f('a'); expect(f).toHaveBeenCalledWith('a');` | Use `mockResolvedValue` for async, `mockRejectedValue` for failures. |
| Replace a global (like `fetch`) | `vi.stubGlobal('fetch', ...)` | Swaps a real global out for your stub. | `vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok:true, json: async()=>({}) }));` | In this repo, `AuthContext` and `utils/api.ts` depend on `fetch`. |
| Assert how code called `fetch` | “mock + assertions” | Use your `fetchMock` to assert URL/headers/body. | `expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\\/auth\\/me$/), expect.anything());` | Don’t assert full URLs unless necessary—match the important part. |
| Spy on an existing method | `vi.spyOn(obj, 'method')` | Observe calls and optionally override behavior. | `vi.spyOn(console, 'error').mockImplementation(() => {});` | Use `mockRestore()` or `vi.restoreAllMocks()` between tests. |
| Spy on a property setter/getter | `vi.spyOn(obj, 'prop', 'set' \| 'get')` | Observe assignments like `window.location.href = ...`. | `const s = vi.spyOn(window.location, 'href', 'set');` | Can be flaky in jsdom; treat redirect assertions as “optional” unless you refactor redirects behind a helper. |
| Set env vars in tests | `vi.stubEnv('VITE_API_URL', ...)` | Controls `import.meta.env`-backed values used by Vite/Vitest. | `vi.stubEnv('VITE_API_URL', 'http://example.com');` | See `ui/src/utils/__tests__/api.test.ts`. |
| Reset state between tests | `beforeEach` + cleanup | Prevent test pollution. | `beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });` | Prefer `restoreAllMocks()` if you used spies. |
| Test a Context hook/provider | `renderHook` + `wrapper` | Runs hooks inside the provider tree you supply. | `renderHook(() => useAuth(), { wrapper: ({children}) => <AuthProvider>{children}</AuthProvider> })` | Without the wrapper you’ll get “must be used within Provider”. |
| Wait for async state changes | `waitFor(...)` | Re-tries an assertion until it passes. | `await waitFor(() => expect(result.current.loading).toBe(false));` | Use for hooks/state that changes after promises resolve. |
| Wait for async UI | `findBy...` queries | RTL waits for elements to appear. | `await screen.findByText(/success/i);` | Prefer `findBy...` over manual `waitFor` for DOM assertions. |
| Test timeout-based behavior | `vi.useFakeTimers()` | Controls `setTimeout` deterministically. | `vi.useFakeTimers(); /* trigger */ vi.advanceTimersByTime(500); vi.useRealTimers();` | Needed for `LoginPage` redirect-after-timeout patterns. |
| Mock an imported module | `vi.mock('...')` | Replace a module (e.g., API layer) with fakes. | `vi.mock('../../utils/api', () => ({ getGroups: vi.fn() }));` | Great for page tests: you don’t want real network calls. |
| Prefer user-facing assertions | RTL query best practices | Assert what users see/click/enter. | `screen.getByRole('button', { name: /create/i })` | Avoid asserting Mantine classnames or internal state vars. |

## Where to see examples in this codebase

- **Env + localStorage + unit tests**: `ui/src/utils/__tests__/api.test.ts`
- **Utility unit tests**: `ui/src/utils/__tests__/userUtils.test.ts`
- **Simple component test**: `ui/src/components/ui/__tests__/LoadingSpinner.test.tsx`
- **Global test setup**: `ui/src/test/setup.ts` (e.g., `matchMedia`)

