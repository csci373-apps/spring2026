---
title: "UI Testing: Introduction"
start_date: "2026-02-17"
type: "activity"
draft: 0
ordering: 1
heading_max_level: 3
---

Today is about writing **useful** tests for a real React + TypeScript codebase (the TMA UI), without turning testing into busywork.

## 1. Categories of Tests
Different kinds of code require different approaches to testing. In front-end development with React, there are a few different genres:

<table class="test-genres">
  <tbody>
    <tr>
      <th>
        <div>1. Unit tests</div>
        <span class="badge success">Required</span> <br />for new/changed  logic
      </th>
      <td>
        <div><strong>For:</strong> pure functions (utilities, small helpers)</div>
        <div><strong>Checks for:</strong> given input X, output is Y (no DOM, no React, no network)</div>
        <div><strong>Examples:</strong></div>
        <ul>
          <li>ui/src/utils/dateUtils.ts</li>
          <li>ui/src/utils/userUtils.ts</li>
        </ul>
      </td>
    </tr>
    <tr>
      <th>
        <div>2. Component tests</div>
        <span class="badge success">Required</span> <br />for new/changed user-visible behavior
      </th>
      <td>
        <div><strong>For:</strong> React components/pages</div>
        <div><strong>Checks for:</strong> user-visible behavior (what renders, what text appears, what state is shown)</div>
        <div><strong>Examples:</strong></div>
        <ul>
          <li>ui/src/components/ui/DataListView.tsx</li>
          <li>ui/src/components/ui/LoadingSpinner.tsx</li>
        </ul>
      </td>
    </tr>
    <tr>
      <th>
        <div>3. Provider / hook tests</div>
        <span class="badge success">Required</span> <br />
        if auth/session/role/persistence logic changes
      </th>
      <td>
        <div><strong>For:</strong> Context providers and custom hooks</div>
        <div><strong>Checks for:</strong> state transitions + side effects (auth checking, persistence, redirects)</div>
        <div><strong>Examples:</strong></div>
        <ul>
          <li>ui/src/contexts/AuthContext.tsx</li>
          <li>ui/src/hooks/useViewMode.ts</li>
        </ul>
      </td>
    </tr>
    <tr>
      <th>
        <div>4. API-layer tests</div>
        <span class="badge">Optional</div>
        </th>
      <td>
        <div><strong>For:</strong> frontend API wrapper functions</div>
        <div><strong>Checks for:</strong> URL/header/body building + consistent error handling</div>
        <div><strong>Examples:</strong></div>
        <ul>
          <li>ui/src/utils/api.ts</li>
        </ul>
      </td>
    </tr>
    <tr>
      <th>
        <div>5. Integration-ish UI tests</div>
        <span class="badge">Optional</div>
        </th>
      <td>
        <div><strong>For:</strong> a critical flow spanning multiple components (sometimes routing)</div>
        <div><strong>Checks that:</strong> “this flow works end-to-end inside React,” without a real browser</div>
        <div><strong>Example:</strong> one <strong>login flow</strong> test (for later)</div>
      </td>
    </tr>
    <tr>
      <th>
        <div>6. E2E tests</div>
        <span class="badge">Optional</div>
      </th>
      <td>
        <div><strong>For:</strong> real browser + real app (Playwright/Cypress)</div>
        <div><strong>Checks for:</strong> the whole stack behaves correctly from a user’s perspective</div>
        <div><strong>Why not today:</strong> more setup, slower feedbac (for later)</div>
      </td>
    </tr>
  </tbody>
</table>


## 2. Setup

In the UI repo (`tma-starter-app/ui`):

```bash
docker exec -it tma_frontend npm test
```

Optional:

```bash
docker exec -it tma_frontend npm run test:ui
docker exec -it tma_frontend npm run test:coverage
```


## 3. Studio: Practice

| Category | What you’ll practice | Link |
|---|---|---|
| Unit tests | Date formatting utilities | [DateUtils walkthrough](/spring2026/activities/02-ui-testing-02-dateutils) |
| Component tests | Form interaction + mocking fetch | [LoginPage walkthrough](/spring2026/activities/02-ui-testing-03-login) |
| Provider / hook tests | Context state + side effects | [AuthContext walkthrough](/spring2026/activities/02-ui-testing-04-authcontext) |
| Cheatsheet | Mocks + patterns reference | [Testing cheatsheet](/spring2026/activities/02-ui-testing-05-cheatsheet) |

