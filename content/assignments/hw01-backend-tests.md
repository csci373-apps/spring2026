---
title: "Backend Tests"
type: "homework"
num: "1"
draft: 0
assigned_date: "2026-01-22"
due_date: "2026-01-29"
heading_max_level: 3
---

> ## Overview
> 
> This assignment has three parts:
> 1. **Writing backend tests** - Writing tests for the resources listed below
> 2. **Reviewing a Pull Request** - Reviewing PRs created by your teammates
> 3. **Completing an individual reflection** - Reflecting on what you learned about testing
> 
> This assignment builds on the pytest workshop and gives you practice writing contract-level API tests. Please ensure that you've read the <a href="/spring2026/resources/backend-05-testing/">Testing API Endpoints</a> doc.

## 1. Write Backend Tests (70 points)

Each student will own a resource type and write comprehensive, contract-level tests for the endpoints listed below the resource. Each endpoint should have comprehensive test coverage. You'll create **one PR per student** (4 PRs total, one per resource).

### 1.1. Select a resource
Each student on your team will select a resource You do not need to write tests for the optional resources (for now), but they are listed here just to make them visible.

#### Student 1: `Group` Resource (`backend/routes/groups.py`)

| Endpoint | Method | Description |  |
|----------|--------|-------------|----------|
| `/api/groups` | GET | List all accessible groups | |
| `/api/groups/{id}` | GET | Get a single group with members | |
| `/api/groups` | POST | Create a new group | |
| `/api/groups/{id}` | PATCH | Update group | |
| `/api/groups/{id}` | DELETE | Delete group | |
| `/api/groups/{id}/courses` | GET | Get courses assigned to a group | <span class="badge">Optional</span> |
| `/api/groups/{id}/members/{user_id}` | POST | Add member to group | <span class="badge">Optional</span> |
| `/api/groups/{id}/members/{user_id}` | DELETE | Remove member from group | <span class="badge">Optional</span> |
| `/api/groups/{id}/members/{user_id}/role` | PATCH | Update member role | <span class="badge">Optional</span> |

#### Student 2: `Course` Resource (`backend/routes/courses.py`)

| Endpoint | Method | Description |  |
|----------|--------|-------------|----------|
| `/api/courses` | GET | List all accessible courses | |
| `/api/courses/{id}` | GET | Get a single course | |
| `/api/courses` | POST | Create a new course | |
| `/api/courses/{id}` | PATCH | Update course | |
| `/api/courses/{id}` | DELETE | Delete course | |

#### Student 3: `User` Resource (`backend/routes/users.py`)

**Note:** Some tests already exist in `tests/test_users.py` as examples. You should extend this file with the missing tests.

| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/api/users` | GET | List all users (admin only) | <span class="badge success">Done</span> |
| `/api/users/{id}` | GET | Get a single user | <span class="badge">Partial</span> Partially tested (404 case only - add success case) |
| `/api/users` | POST | Create a new user (admin only) | <span class="badge success">Done</span> |
| `/api/users/{id}` | PATCH | Update user |  |
| `/api/users/{id}` | DELETE | Delete user |  |
| `/api/users/{id}/status` | PATCH | Update user status |  |
| `/api/users/{id}/role` | PATCH | Update user role |  |

> **Note**: some of the `User` tests have already been implemented, including
> - `GET /api/users` - Done
> - `GET /api/users/{id}` - Partial (auth required, 404 case done)
> - `POST /api/users` - Done

#### Student 4: `Auth` Resource (`backend/routes/auth.py`)

| Endpoint | Method | Description |  |
|----------|--------|-------------|----------|
| `/api/auth/register` | POST | Register a new user | |
| `/api/auth/login` | POST | Login and get token | |
| `/api/auth/me` | GET | Get current user profile | |
| `/api/auth/users` | GET | List users (admin only) | |
| `/api/auth/users/disable` | PATCH | Disable a user | |
| `/api/auth/users/role` | PATCH | Change user role | <span class="badge">Optional</span> |
| `/api/auth/users/{user_id}/profile` | PATCH | Update user profile | <span class="badge">Optional</span> |

**Note:** If your team wants to adjust the assignments (e.g., swap resources between students), that's fine as long as all resources are covered and work is distributed evenly. Just document the changes in your PRs. If a team member finishes early, they can help with other resources or review PRs.

### 1.2. Write Behavior Contracts

**For each endpoint in your assigned resource, write a behavior contract** (like you did in class). This should include:

- **Input:** What the endpoint accepts (parameters, request body)
- **Behavior:** Step-by-step what happens (validation, database queries, business logic)
- **Output:** What the endpoint returns (status code, response body)
- **Errors:** What errors can occur and when

**Format:**
```markdown
## POST /api/auth/login

**Input:**
- username: string (required, 3-50 characters)
- password: string (required, minimum 8 characters)

**Behavior:**
1. Validate input format (username and password)
2. Look up user by username in database
3. If user doesn't exist, return 401 error
4. Verify password matches stored hash
5. If password incorrect, return 401 error
6. Generate JWT token with username
7. Return token and token_type

**Output:**
- Status: 200 OK
- Body: {"access_token": "...", "token_type": "bearer"}

**Errors:**
- 401: Invalid credentials (user not found or wrong password)
- 422: Validation error (invalid input format)
```

**Submission:**
Include behavior contracts in your PR description or in a separate file in the PR.

### 1.3. Write Tests

**Create a feature branch:** `git checkout -b my-feature-branch`

**Create your test file:**
- Groups: `tests/test_groups.py`
- Courses: `tests/test_courses.py`
- Users: Extend `tests/test_users.py` (some tests exist)
- Auth: `tests/test_auth.py`

**For each endpoint, write tests that verify the behavior contract:**

1. **Success case** - Test with valid input, verify status code and response structure
2. **Failure cases** - Test at least 2 scenarios:
   - Invalid input (422 validation errors)
   - Missing data (404, 401, 403)
   - Authorization errors (403 for unauthorized access)
   - Edge cases (empty strings, invalid IDs, etc.)

**How to write tests:**
- Reference `tests/test_users.py` for the pattern
- Use fixtures from `tests/conftest.py`: `client`, `test_db`, `admin_user`, `auth_headers`
- Clear test names: `test_[endpoint]_[scenario]_[expected_result]`
- Use `@pytest.mark.asyncio` for async test functions
- Tests should be independent and fast

**Run tests:** `docker exec -it tma_backend poetry run pytest`

### 1.4. Create a Pull Request

4 PRs total (one per student)

#### Before you create your PR:
1. Run the linter and formatter (see [cheatsheet](/spring2026/resources/howto-02-cheatsheet#3-backend-commands-python) - scroll down to "Backened Commands")
1. Ensure that all tests pass
1. Note your commit history - every commit should be intentional

#### Requirements for the PR
1. Create PR on GitHub with a reasonable title
1. The description must include:
    - Which endpoint(s) you're testing (from the assigned list above)
    - The behavior contract for each endpoint (see section 1.2)
    - Links to any issues (if you're using the GitHub issue tracker)
1. Don't forget to assign someone from your team to review the PR

## Part 2: Peer Review (20 points)

Review **one PR from your team** (not your own). Provide feedback on:

1. **Test Coverage**: Success, failure, edge cases
2. **Test Quality**: Clear names, organization, fixtures
3. **Test Correctness**: Right assertions, would catch bugs

Comment on the PR with specific, constructive feedback. Approve if the PR is good, request changes only if broken. Everyone should review at least one PR.


## 3. Individual Reflection (10 points)

Write a brief reflection under a heading with today's date in your Google Doc (`LastName_FirstName_373`). Briefly answer the following questions (300-400 words total):

1. **What did you learn?** - About writing tests, pytest, and the backend code
1. **What was challenging?** - What was hard or confusing?
1. **What makes a good test?** - Based on your experience

When you're done, copy your reflection and paste it into the <a href="https://forms.gle/m6Myw4Lxc2We3WNCA" target="_blank">Weekly Reflection Form</a>.

## Submission Checklist

**Team Requirements:**
- [ ] All 4 resources have tests (Groups, Courses, Users, Auth) - team grade
- [ ] Clear contracts for all tested endpoints (in PR descriptions)
- [ ] All tested endpoints have working success case tests
- [ ] All tested endpoints have at least 2 failure case tests
- [ ] Clear names, good fixtures, independent, fast, proper async usage
- [ ] Well-documented PRs with clear descriptions and team links

**Individual Submission:**
- [ ] You wrote all of your tests and submitted a PR
- [ ] You have reviewed at least one of your team's PRs
- [ ] You have pasted your reflection into the [Weekly Reflection Form](https://forms.gle/m6Myw4Lxc2We3WNCA)
