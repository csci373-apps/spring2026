---
title: "React Architecture (Implementation Spec)"
start_date: "2026-02-10"
type: "activity"
draft: 0
heading_max_level: 3
---

Create code that accomplishes the following.

## Requirements

1. Create a new React page component in `tma-starter-app/ui/src/pages/...` that displays a list of items from the backend.
   - You may target Modules if your backend has them; otherwise use Groups or Courses.

2. Your page must make an authenticated request to the backend using the app’s existing auth setup.
   - Use `useAuth()` to get `API_URL`.
   - Read the token from `localStorage` key `auth_token` and send it as a bearer token: `Authorization: Bearer <token>`.
   - Your request URL should be built from `API_URL` (example: `${API_URL}/groups`).

3. Your page must handle and render all four UI states:
   1. **loading**: shown while the request is in flight
   2. **error**: shown if the request fails (network error or non-2xx response)
   3. **empty**: shown if the request succeeds but returns “no items”
   4. **success**: shown if the request succeeds and returns 1+ items

4. Your page must render real data on success.
   - It is acceptable to start with `JSON.stringify(items, null, 2)` in a `<pre>`.

5. Add a route for your page in `tma-starter-app/ui/src/App.tsx` so it can be visited in the browser.
   - Import your new page component.
   - Add a `<Route ... />` under the authenticated dashboard routes.
   - Wrap the route element in `<ProtectedRoute>...</ProtectedRoute>` if similar routes in `App.tsx` do.

6. Your new route must be testable end-to-end:
   1. Start the web UI dev server.
   2. Log in at `/login`.
   3. Visit your new route and confirm you see loading first, then one of: error/empty/success.
   4. If you get a 401/403, log in again and refresh.

## Optional enhancements (pick 1–2)

1. Replace the `<pre>` output with a real list (`<ul><li>...</li></ul>` or Mantine components).
2. Add a simple search filter and conditional rendering.
3. Extract a child component (example: `ItemsList`) that receives `items` as props.
4. Swap at least one element for Mantine (`Button`, `Alert`, or `Loader`).
5. Add one CRUD action for your chosen resource (Create, Edit, or Delete) if your backend supports it.

## Turn-in

1. Open a PR (do not merge).
2. In the PR description, include:
   1. The endpoint called (method + path)
   2. Which UI states you implemented
   3. Any enhancement(s) you completed

