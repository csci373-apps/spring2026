---
title: "Pytest Workshop"
start_date: "2026-01-22"
type: "activity"
draft: 0
heading_max_level: 3
---

> ## Learning Objectives
>
> By the end of this session, you will:
> - Understand what pytest is and how it works
> - Know how to read and understand existing tests
> - Understand the test infrastructure (fixtures, test database)
> - Be ready to write tests for homework


## 1. Understanding Behavior Contracts (10 minutes)

### 1.1. What is a Behavior Contract?

A **behavior contract** describes what an endpoint does in plain language. It's documentation that helps you understand what an endpoint should do before you test it.

**Example for POST /api/auth/login:**

```markdown
## POST /api/auth/login

**Input:**
- username: string (required, 3-50 characters)
- password: string (required, minimum 8 characters)

**Behavior:**
1. Validate input format
2. Look up user by username
3. If user doesn't exist, return 401
4. Verify password matches hash
5. If password incorrect, return 401
6. Generate JWT token
7. Return token and token_type

**Output:**
- access_token: string (JWT token)
- token_type: string (always "bearer")

**Errors:**
- 401: Invalid credentials
- 422: Validation error
```

### 1.2. How is This Different from other kinds of testing?

**Contract-level testing** (what we're doing):
- Tests the API from the **client's perspective** - what happens when you call it?
- Verifies **what** the endpoint does, not **how** it does it internally
- More resilient to refactoring (change internal code, keep the contract, tests still pass)

**Why it matters:**
- Your API is a **contract** between frontend and backend. If the contract changes, your frontend breaks
- Tests verify the contract stays stable
- You can refactor internal code without breaking tests

**Other kinds of testing:**
- **Unit tests**: Test individual functions or classes in isolation (e.g., "Does this function calculate the total correctly?")
- **Integration tests**: Test how multiple components work together (e.g., "Does the database save data when the service layer calls it?")
- **Contract-level tests** (what we're doing): Test the API interface from the outside, like a client would (e.g., "When I POST to `/users`, do I get a 201 response with the user data?")


## 2. Understanding Pytest (15 minutes)

### 2.1. What is pytest?

**pytest** is a testing framework for Python. Tests are functions that assert things are true.

**Simple example:**
```python
def test_addition():
    assert 2 + 2 == 4
```

**Run tests:**
```bash
docker exec -it tma_backend poetry run pytest
```

### 2.2 Test Structure: Arrange-Act-Assert

The **Arrange-Act-Assert** pattern is a simple way to structure tests that makes them clear and easy to understand:

- **Arrange**: Set up what you need (test data, fixtures, etc.)
- **Act**: Do the thing you're testing (make the API call)
- **Assert**: Check that it worked (verify the response, status code, etc.)

This pattern helps you write tests that are easy to read and maintain.

```python
def test_login_success(client, test_user):
    # Arrange: Set up test data (already done via fixtures)
    
    # Act: Make the request
    response = client.post(
        "/api/auth/login",
        json={"username": "testuser", "password": "testpass"}
    )
    
    # Assert: Check the results
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"
```

### 2.3 Understanding Fixtures

**Fixtures** are reusable test setup functions that provide test data or resources. They're functions decorated with `@pytest.fixture` that pytest can automatically call and inject into your test functions. The starter code provides these in <a href="https://github.com/csci373-apps/tma-starter-app/blob/main/backend/tests/conftest.py" target="_blank">tests/conftest.py</a>:

- `client`: HTTP client for making requests
- `test_db`: Test database (fresh for each test)
- `admin_user`: Admin user for testing
- `auth_headers`: Authentication headers

**How to use:**
```python
def test_something(client, auth_headers, admin_user):
    # Fixtures are automatically available as parameters
    # pytest calls the fixture functions and passes the results to your test
    response = client.get("/api/users", headers=auth_headers)
    assert response.status_code == 200
```

### 2.4 Reading Existing Tests

**Look at <a href="https://github.com/csci373-apps/tma-starter-app/blob/main/backend/tests/test_users.py" target="_blank">tests/test_users.py</a>** - it shows the pattern:
- How to structure tests
- How to use fixtures
- How to test success and failure cases
- How to verify response structure

**Key Point:** Use `test_users.py` as your reference when writing tests for homework.


## 3. Getting Started on Homework (20 minutes)
Please open the <a href="/spring2026/assignments/hw01-backend-tests" target="_blank">HW1</a> instructions.

### 3.1 Review Homework Requirements

**HW1: Backend Tests**
- Each student tests one resource (Groups, Courses, Users, or Auth)
- Write behavior contracts for your endpoints
- Write tests for all endpoints in your resource
- Create a PR with your tests

### 3.2 What Makes a Good Test?

1. **Clear test names:** `test_[endpoint]_[scenario]_[expected_result]`
2. **Test behavior, not implementation:** Test what it does, not how
3. **One thing per test:** Separate tests for success and failure
4. **Use fixtures:** `client`, `auth_headers`, `test_db`, `admin_user`
5. **Assert specific things:** Check status code AND response structure

### 3.3 Example: Good Test Structure

```python
@pytest.mark.asyncio
async def test_get_all_users_requires_auth(client: AsyncClient):
    """Test that GET /api/users requires authentication"""
    response = await client.get("/api/users")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_all_users_with_auth(client: AsyncClient, auth_headers, admin_user):
    """Test that GET /api/users returns list of users when authenticated"""
    response = await client.get("/api/users", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for user in data:
        assert "id" in user
        assert "username" in user
        assert "password" not in user  # Security check
```

### 3.4 Project Management Tips
* <a href="/spring2026/resources/howto-04-github-branch-rules" target="_blank">GitHub Issues & Branch Protection</a>

### 4. Next Steps

Within your team:

1. Setup the Branch rules (one person)
1. Decide who will work on which endpoints
1. Each team member should create an Issue for each of the endpoints they are responsible for completing.
1. See if you can implement your first test. 