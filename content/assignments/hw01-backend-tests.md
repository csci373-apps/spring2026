---
title: "Backend Tests"
date: "2026-01-22"
type: "assignment"
num: "1"
draft: 0
due_date: "2026-01-27"
heading_max_level: 3
---

## Overview

This assignment has three parts:
1. **Write Backend Tests** - Your team writes tests for 3 existing endpoints
2. **Peer Review** - You review another team's test PR
3. **Individual Reflection** - Reflect on what you learned about testing

This assignment builds on the pytest workshop and gives you practice writing contract-level API tests.


## Part 1: Write Backend Tests (60 points)

### Instructions

Your team will write tests for **3 CRUD endpoints** in the backend. Each endpoint should have comprehensive test coverage. You'll create **multiple PRs** to practice good PR hygiene (small, focused PRs).

### Requirements

#### 1. Choose 3 CRUD Endpoints (5 points)

**Select 3 different endpoints** that represent CRUD operations. They should be:
- Different HTTP methods (GET, POST, PATCH/PUT, DELETE)
- Different complexity levels (at least one simple, one complex)
- Endpoints that have clear behavior contracts
- Can be from the same resource (e.g., all from `/api/groups`) or different resources

**Examples of CRUD endpoints:**
- **Create:** `POST /api/groups`, `POST /api/courses`, `POST /api/modules`
- **Read:** `GET /api/groups`, `GET /api/groups/{id}`, `GET /api/courses/{id}`
- **Update:** `PATCH /api/groups/{id}`, `PATCH /api/courses/{id}`
- **Delete:** `DELETE /api/groups/{id}`, `DELETE /api/courses/{id}`

**Other endpoints (not CRUD, but acceptable):**
- `POST /api/auth/login` - Authentication
- `GET /api/users/me` - Get current user

**Documentation:**
In your PR description(s), list the 3 endpoints you chose and why.

#### 2. Write Behavior Contracts (10 points)

**For each endpoint, write a behavior contract** (like you did in class). This should include:

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

#### 3. Write Tests (40 points)

**For each endpoint, write tests that verify the behavior contract:**

**Required test cases per endpoint:**

1. **Success case** (5 points per endpoint = 15 points)
   - Test that the endpoint works correctly with valid input
   - Verify status code, response structure, and response data

2. **Failure cases** (5 points per endpoint = 15 points)
   - Test at least 2 failure scenarios:
     - Invalid input (validation errors)
     - Missing data (404, 401, etc.)
     - Edge cases (empty strings, very long strings, etc.)

3. **Test quality** (10 points total)
   - Clear test names (`test_[endpoint]_[scenario]_[expected_result]`)
   - Good use of fixtures
   - Tests are independent (can run in any order)
   - Tests are fast (use test database)

**Example test structure:**

```python
import pytest
from fastapi.testclient import TestClient
from backend.server import app

client = TestClient(app)

# Fixtures
@pytest.fixture
def test_user(db):
    # Create test user
    user = User(username="testuser", email="test@example.com", ...)
    db.add(user)
    db.commit()
    return user

# Success case
def test_login_with_valid_credentials_returns_token(client, test_user):
    response = client.post(
        "/api/auth/login",
        json={"username": "testuser", "password": "testpass"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

# Failure cases
def test_login_with_invalid_username_returns_401(client):
    response = client.post(
        "/api/auth/login",
        json={"username": "wronguser", "password": "testpass"}
    )
    assert response.status_code == 401
    assert "detail" in response.json()

def test_login_with_invalid_password_returns_401(client, test_user):
    response = client.post(
        "/api/auth/login",
        json={"username": "testuser", "password": "wrongpass"}
    )
    assert response.status_code == 401

def test_login_with_invalid_input_format_returns_422(client):
    response = client.post(
        "/api/auth/login",
        json={"username": "ab", "password": "short"}  # Too short
    )
    assert response.status_code == 422
```

#### 4. Create Pull Requests (5 points)

**PR Strategy: One PR per endpoint (recommended) or group logically**

**Option A: One PR per endpoint (Recommended - 3 PRs total)**
- **Why:** Teaches good PR hygiene - small, focused PRs are easier to review
- **Structure:**
  - PR 1: Tests for endpoint 1
  - PR 2: Tests for endpoint 2  
  - PR 3: Tests for endpoint 3
- **Benefits:** Each PR is self-contained, easier to review, can merge independently

**Option B: Group logically (1-2 PRs total)**
- **Why:** If endpoints are closely related (e.g., all from `/api/groups`), you might group them
- **Structure:**
  - PR 1: Tests for related endpoints (e.g., GET and POST /api/groups)
  - PR 2: Tests for other endpoint(s)
- **Note:** Still keep PRs focused - don't put all 3 in one giant PR

**For each PR:**

1. **Create feature branch:**
   ```bash
   git checkout -b feature/hw1-tests-[endpoint-name]
   # Example: feature/hw1-tests-groups-get
   ```

2. **Add test files:**
   - Create `tests/test_[endpoint_name].py` files
   - Or add to existing test files
   - **One endpoint per PR:** Keep tests for one endpoint together

3. **Commit and push:**
   ```bash
   git add tests/
   git commit -m "Add tests for [endpoint name]"
   # Clean up commits if needed (amend, rebase) before pushing
   git push origin feature/hw1-tests-[endpoint-name]
   ```

4. **Create PR on GitHub:**
   - Title: `HW1: Backend Tests for [endpoint]` (e.g., `HW1: Backend Tests for GET /api/groups`)
   - Description:
     - Which endpoint you're testing
     - Behavior contract for this endpoint
     - What you tested (success cases, failure cases)
     - Link to other PRs if you have multiple (e.g., "Part 1 of 3 - see also #X, #Y")
     - Tag instructor for review

5. **Ensure tests pass:**
   - All tests should pass
   - Run: `poetry run pytest tests/ -v`

**PR Requirements:**
- **Minimum:** At least 2 PRs (can't put all 3 endpoints in one PR)
- **Recommended:** 3 PRs (one per endpoint)
- **Maximum:** 3 PRs (one per endpoint)
- All PRs must be created and ready for review by the due date

### Submission

- **Format:** GitHub Pull Requests (2-3 PRs)
- **Location:** Your team's repository fork
- **Team submission:** Multiple PRs per team (everyone gets same grade)
- **All PRs must be:** Created, tests passing, ready for review by due date

### Grading Rubric

| Criteria | Points | Description |
|----------|--------|-------------|
| Endpoint Selection | 5 | 3 different CRUD endpoints chosen with rationale |
| Behavior Contracts | 10 | Clear contracts for all 3 endpoints (in PR descriptions) |
| Success Case Tests | 15 | All endpoints have working success case tests |
| Failure Case Tests | 15 | All endpoints have at least 2 failure case tests |
| Test Quality | 10 | Clear names, good fixtures, independent, fast |
| PR Structure | 3 | Multiple PRs (2-3), well-organized, focused |
| PR Quality | 2 | Well-documented PRs with clear descriptions |
| **Total** | **60** | |


## Part 2: Peer Review (25 points)

### Instructions

Review **one PR from your team** (choose one of your team's PRs). Provide substantive, constructive feedback.

**Why review your own team's PRs?**
- You'll practice code review skills
- You'll catch issues before the instructor reviews
- You'll learn from your teammates' code
- It's simpler logistically (no need to find other teams' repos)

### Requirements

#### 1. Find a PR to Review (5 points)

**Choose ONE PR from your team:**
- One of your team's 2-3 PRs for this assignment
- PR that has tests (not just code)
- PR that you didn't write (review a teammate's PR)
- If you wrote all the PRs, review the one you're least familiar with

**How to find PRs:**
- Go to your team's repository fork on GitHub
- Look for PRs with "HW1" in the title
- Pick one that needs review

**Note:** Each team member should review a different PR if possible, so all PRs get reviewed.

#### 2. Review the Tests (15 points)

**Provide feedback on:**

1. **Test Coverage** (5 points)
   - Are all scenarios tested? (success, failure, edge cases)
   - Are there missing test cases?
   - Are the tests comprehensive?

2. **Test Quality** (5 points)
   - Are test names clear?
   - Are tests well-organized?
   - Do tests follow best practices?
   - Are fixtures used appropriately?

3. **Test Correctness** (5 points)
   - Do the tests actually test the right thing?
   - Are assertions specific enough?
   - Would these tests catch bugs?

**Review format:**
- Comment on the PR (line comments or general comments)
- Be specific: "Consider testing X scenario" not just "needs more tests"
- Be constructive: "This is good, but consider..." not "This is wrong"
- Be kind: Focus on helping, not criticizing

**Example review:**

```markdown
Great tests! A few suggestions:

1. **Test Coverage:** You have good success and failure cases. Consider adding:
   - Edge case: What happens with very long username? (max length validation)
   - Edge case: What happens with special characters in password?

2. **Test Quality:** 
   - ✅ Test names are clear and descriptive
   - ✅ Good use of fixtures
   - 💡 Consider extracting common setup into a fixture (the test_user creation is repeated)

3. **Test Correctness:**
   - ✅ Tests verify the right things
   - 💡 In `test_login_with_invalid_password`, consider also checking the error message to ensure it's user-friendly (not exposing system details)

Overall, solid work! The tests are well-written and comprehensive.
```

#### 3. Approve or Request Changes (5 points)

**After reviewing:**
- **Approve** if tests are good (even if you have suggestions)
- **Request changes** only if tests are fundamentally broken or missing critical cases
- **Comment** with your feedback either way

**Key Point:** Approving doesn't mean perfect - it means "good enough, merge when ready"

### Submission

- **Format:** Comments on GitHub PR
- **Location:** Your team's PR (one of your team's 2-3 PRs)
- **Individual submission:** Each team member reviews one PR from your team
- **Team coordination:** Try to ensure all your team's PRs get reviewed (distribute reviews among team members)

### Grading Rubric

| Criteria | Points | Description |
|----------|--------|-------------|
| PR Selection | 5 | Appropriate PR chosen from your team (not your own work) |
| Review Coverage | 5 | Feedback on test coverage |
| Review Quality | 5 | Feedback on test quality |
| Review Correctness | 5 | Feedback on test correctness |
| Review Tone | 5 | Constructive, specific, kind feedback |
| **Total** | **25** | |


## Part 3: Individual Reflection (15 points)

### Instructions

Write a reflection on what you learned about testing. This should be 400-600 words and address the prompts below.

### Reflection Prompts

Answer the following questions:

1. **What did you do?** (75 words)
   - Describe the activities (writing tests, reviewing tests)
   - Which endpoints did you test?
   - What was your role in the team?

2. **What did you learn?** (150 words)
   - What did you learn about writing tests?
   - What did you learn about pytest?
   - What did you learn about the backend code?
   - What did you learn from reviewing another team's tests?

3. **What was hard?** (100 words)
   - What was confusing or challenging?
   - What took longer than expected?
   - What questions do you still have?

4. **What makes a good test?** (100 words)
   - Based on your experience, what makes a test good?
   - What did you learn from reviewing other teams' tests?
   - What would you do differently next time?

5. **How does this connect to what you already know?** (75 words)
   - How does testing connect to programming you've done before?
   - How does it connect to other courses or experiences?
   - What's similar? What's different?

### Submission

- **Format:** Markdown document (`.md` file) or PDF
- **File name:** `reflection-hw01-[your-name].md` or `.pdf`
- **Location:** Submit to course platform or email to instructor
- **Individual submission:** Each team member submits their own

### Grading Rubric

| Criteria | Points | Description |
|----------|--------|-------------|
| Completeness | 5 | All prompts addressed with appropriate length |
| Depth | 5 | Thoughtful reflection, not just surface-level |
| Clarity | 3 | Well-written, clear, organized |
| Learning | 2 | Shows genuine learning and growth |
| **Total** | **15** | |


## Submission Checklist

Before submitting, make sure you have:

### Team Submission:
- [ ] GitHub PRs created with tests (2-3 PRs total)
  - [ ] 3 CRUD endpoints tested (across all PRs)
  - [ ] Behavior contracts included (in each PR description)
  - [ ] Success cases tested (for all endpoints)
  - [ ] Failure cases tested (at least 2 per endpoint)
  - [ ] All tests pass
  - [ ] PR descriptions are clear
  - [ ] PRs are focused (one endpoint per PR, or logically grouped)
  - [ ] PRs are linked if you have multiple (mention other PRs in descriptions)

### Individual Submission:
- [ ] Peer review completed
  - [ ] Reviewed one of your team's PRs (not your own work)
  - [ ] Provided substantive feedback
  - [ ] Approved or requested changes
  - [ ] Coordinated with team to ensure all PRs get reviewed
- [ ] Individual Reflection submitted
  - [ ] All 5 prompts addressed
  - [ ] 400-600 words total
  - [ ] Well-written and thoughtful


## Getting Help

If you encounter issues:

1. **Writing tests:**
   - Review pytest workshop materials
   - Check pytest documentation
   - Ask your team

2. **Understanding endpoints:**
   - Read the code
   - Write behavior contracts first
   - Test in FastAPI docs

3. **Reviewing tests:**
   - Focus on helping, not criticizing
   - Be specific in feedback
   - Ask questions if something is unclear
   - Review a teammate's PR, not your own

4. **Common issues:**
   - **Tests fail:** Check fixtures, database setup, test data
   - **Don't know what to review:** Focus on test coverage and quality
   - **All PRs already reviewed:** That's okay! Review one anyway, or coordinate with team to distribute reviews


## Late Policy

- **On time:** Full credit
- **1 day late:** -10% (90 points max)
- **2 days late:** -20% (80 points max)
- **3+ days late:** -50% (50 points max)

**Note:** If you have extenuating circumstances, contact the instructor before the due date.


## Questions?

If you have questions about this assignment:
- Check the course materials first
- Ask your team
- Ask in class
- Email the instructor


