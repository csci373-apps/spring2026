---
title: "Pytest Workshop"
start_date: "2026-01-22"
type: "activity"
draft: 1
---

## Learning Objectives

By the end of this session, you will:
- Understand the basics of pytest
- Be able to write contract-level API tests
- Understand what makes a good test
- Be comfortable with pair programming for testing
- Have practiced writing tests for existing endpoints


## Part 1: Behavior Contract Activity (30 minutes)

### What is a Behavior Contract?

A **behavior contract** describes what an endpoint does in plain language. It's not code—it's documentation that helps you understand what an endpoint should do before you implement or test it.

**Key points:**
- A behavior contract describes what an endpoint does in plain language
- It's not code - it's documentation
- It helps you understand before you implement
- It's useful for testing (tests verify the contract)

### Example Behavior Contract

Here's an example for the login endpoint:

```markdown
## POST /api/auth/login

**Input:**
- username: string (required, 3-50 characters)
- password: string (required, minimum 8 characters)

**Behavior:**
1. Validate input (username and password format)
2. Look up user by username in database
3. If user doesn't exist, return 401 error
4. Verify password matches stored hash
5. If password incorrect, return 401 error
6. Generate JWT token with username
7. Return token and token_type

**Output:**
- access_token: string (JWT token)
- token_type: string (always "bearer")

**Errors:**
- 401: Invalid credentials (user not found or wrong password)
- 422: Validation error (invalid input format)
```

### Practice: Write Your Own Contract (20 minutes)

**Instructions:**
1. **Work with your team**
2. **Pick an endpoint** (not login - choose a different one)
   - `GET /api/users/me` - Get current user
   - `GET /api/groups` - List groups
   - `POST /api/groups` - Create group
   - `GET /api/courses` - List courses
   - (or any other endpoint)
3. **Read the code** carefully
   - Look at the route file
   - Check the schemas (input and output)
   - Understand what the endpoint does
4. **Write a behavior contract** using the template below
5. **Be specific** - what exactly happens at each step?

**Template:**

```markdown
## [METHOD] [ENDPOINT]

**Input:**
- [field]: [type] ([constraints])

**Behavior:**
1. [Step 1]
2. [Step 2]
3. [Step 3]
...

**Output:**
- [field]: [type] ([description])

**Errors:**
- [status code]: [when this happens]
```

**Tips:**
- Ask questions if the code is confusing
- Be specific about what happens at each step
- Include all error cases you can find
- Check the schemas to understand input/output formats

### Share Contracts (5 minutes)

**2-3 teams will share:**
- Their endpoint
- Their behavior contract
- What was hard about writing it?

**As you listen, think about:**
- Is the contract accurate?
- Is it specific enough?
- What makes a good contract?

**Key Point:** Writing contracts helps you understand code. You'll use these contracts to write tests next.


## Part 2: Review & Warm-up (10 minutes)

### Check-in

Before we start, make sure you:
- Have your behavior contract ready (from Part 1)
- Have questions ready about models/schemas/routes

### Review Behavior Contracts

**Think about:** What did you learn from writing a behavior contract?

**Common insights students discover:**
- "I didn't realize how much validation happens"
- "I see why we need schemas now"
- "The flow makes more sense"

**Ask questions** about behavior contracts if anything is unclear.

### Today's Goal

Now that you've written behavior contracts, you'll learn to write tests that verify your code does what the contract says. Tests are your way of checking that the API works correctly. We'll practice together, then you'll write tests for homework.


## Part 3: Pytest Workshop (20 minutes)

### What is pytest?

**pytest** is a testing framework for Python that makes writing tests easy. It's the standard tool for Python testing and provides helpful output when tests fail.

**A simple test looks like this:**

```python
def test_addition():
    assert 2 + 2 == 4
```

**Run it:**
```bash
pytest test_example.py
```

**Key Point:** Tests are just functions that assert things are true. If the assertion passes, the test passes. If it fails, the test fails.

### Test Structure: Arrange-Act-Assert

Here's a real API test:

```python
def test_login_success(client):
    # Arrange: Set up test data
    response = client.post(
        "/api/auth/login",
        json={"username": "testuser", "password": "testpass"}
    )
    
    # Act: Already done (the request)
    
    # Assert: Check the results
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"
```

**The Arrange-Act-Assert pattern:**
- **Arrange:** Set up what you need (test data, fixtures)
- **Act:** Do the thing you're testing (make the request)
- **Assert:** Check that it worked (verify the response)

This pattern makes tests clear and easy to understand.

### Fixtures

**Fixtures** are reusable test data that are set up before tests run and cleaned up after.

**Example:**

```python
@pytest.fixture
def client():
    # Set up test client
    from fastapi.testclient import TestClient
    from backend.server import app
    return TestClient(app)

@pytest.fixture
def test_user(db):
    # Create a test user in database
    user = User(username="testuser", email="test@example.com", ...)
    db.add(user)
    db.commit()
    return user
```

**How fixtures work:**
- `@pytest.fixture` decorator marks a fixture
- Fixtures can depend on other fixtures (like `test_user` depends on `db`)
- They're automatically injected into test functions as parameters

**Key Point:** Fixtures help you set up test data without repeating code.

### Writing Good Tests

Here's what makes a good test:

1. **Tests behavior, not implementation:**
   - ✅ Good: "Login returns a token when credentials are valid"
   - ❌ Bad: "Login calls verify_password function"

2. **One thing per test:**
   - ✅ Good: Separate tests for success and failure cases
   - ❌ Bad: One test that checks everything

3. **Clear names:**
   - ✅ Good: `test_login_with_valid_credentials_returns_token`
   - ❌ Bad: `test_login`

4. **Independent:**
   - Each test should work on its own
   - Tests shouldn't depend on each other

5. **Fast:**
   - Tests should run quickly
   - Use test database, not production

**Examples:**

```python
# Good test
def test_login_with_valid_credentials_returns_token(client, test_user):
    response = client.post(
        "/api/auth/login",
        json={"username": "testuser", "password": "testpass"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

# Bad test (tests implementation, not behavior)
def test_login_calls_verify_password(client):
    # This is testing HOW it works, not WHAT it does
    pass
```

**Key Point:** Good tests verify the contract, not the implementation.


## Part 4: Team Testing Practice (30 minutes)

### Setup

**You'll need:**

1. **Test file template:**
   ```python
   import pytest
   from fastapi.testclient import TestClient
   from backend.server import app
   
   client = TestClient(app)
   
   # Your tests go here
   ```

2. **Endpoints to test:**
   - `GET /api/users/me` - Get current user
   - `POST /api/auth/login` - Login
   - `GET /api/groups` - List groups
   - (or others your instructor suggests)

3. **Behavior contracts** (from Part 1)

### Team Activity: Write Tests (20 minutes)

**Instructions:**

1. **Pick an endpoint** (one per team, or teams can do different ones)
2. **Review the behavior contract** for that endpoint
3. **Write tests** that verify the contract:
   - Test success case
   - Test failure cases (invalid input, missing data, etc.)
   - Test edge cases (empty strings, very long strings, etc.)

4. **Use pair programming:**
   - One person writes test
   - Other person reviews
   - Switch roles

**Template for tests:**

```python
def test_[endpoint]_[scenario](client, [fixtures]):
    # Arrange
    # (set up test data if needed)
    
    # Act
    response = client.[method](
        "/api/[endpoint]",
        json={...}  # if POST/PUT/PATCH
    )
    
    # Assert
    assert response.status_code == [expected_status]
    assert [condition]  # check response data
```

**Tips:**
- Ask for help if you're stuck
- Make sure you're testing behavior, not implementation
- Use fixtures for test data

### Run Tests (5 minutes)

**Instructions:**

1. **Run your tests:**
   ```bash
   cd backend
   poetry run pytest tests/ -v
   ```

2. **Fix any errors:**
   - Syntax errors
   - Import errors
   - Logic errors

3. **Verify tests pass:**
   - Green = good!
   - Red = fix it!

**Get help** if your tests aren't passing.


## Part 5: Test Review (15 minutes)

### Share Tests (10 minutes)

**2-3 teams will share:**
1. Their endpoint
2. Their tests (show code on screen)
3. What they tested (success? failure? edge cases?)

**As we review, think about:**
- **What's good?**
  - Clear test names?
  - Testing behavior?
  - Good assertions?
  
- **What could be better?**
  - Missing test cases?
  - Testing implementation?
  - Unclear assertions?

**Example review:**

```python
# Team's test
def test_login(client):
    response = client.post("/api/auth/login", json={"username": "test", "password": "test"})
    assert response.status_code == 200

# Review feedback:
# ✅ Good: Tests the endpoint
# ❌ Could improve: 
#   - Name is vague (what scenario?)
#   - Only tests success case
#   - Doesn't verify the response structure
#   - Missing failure cases

# Better version:
def test_login_with_valid_credentials_returns_token(client, test_user):
    response = client.post(
        "/api/auth/login",
        json={"username": "testuser", "password": "testpass"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_with_invalid_credentials_returns_401(client):
    response = client.post(
        "/api/auth/login",
        json={"username": "wrong", "password": "wrong"}
    )
    assert response.status_code == 401
```

**Key Point:** Review helps us learn. You'll do this for homework too.

### Best Practices Summary

**Remember these principles:**

1. **Test the contract:**
   - What should happen when input is valid?
   - What should happen when input is invalid?
   - What should the output look like?

2. **Write clear test names:**
   - `test_[endpoint]_[scenario]_[expected_result]`
   - Example: `test_login_with_valid_credentials_returns_token`

3. **Test one thing per test:**
   - Separate tests for success and failure
   - Separate tests for different scenarios

4. **Use fixtures:**
   - Set up test data once
   - Reuse across tests

5. **Assert specific things:**
   - Don't just check status code
   - Check the response structure
   - Check the response data


## Part 6: Reflection & Wrap-up (15 minutes)

### Reflection Activity (10 minutes)

**Discuss with your team:**

1. **What did we do today?**
   - Learned pytest
   - Wrote tests
   - Reviewed tests

2. **What did we learn?**
   - How to write tests
   - What makes a good test
   - How to use fixtures

3. **What was hard?**
   - What was confusing?
   - What took longer than expected?

4. **What makes a good test?**
   - Clear name?
   - Tests behavior?
   - Good assertions?
   - Independent?

5. **What questions do we have?**
   - About pytest?
   - About testing in general?
   - About the homework?

**Share insights** with the class.

### Preview Homework

**HW1: Backend Tests (Team PR) + Peer Review + Reflection**
- **Due:** Next Tuesday (Jan 27)
- **Requirements:**
  1. Write tests for 3 existing endpoints
  2. Each endpoint should have:
     - Success case test
     - At least 2 failure/edge case tests
  3. Create PR with tests
  4. Review one other team's test PR
  5. Individual reflection

- **Process:**
  1. Pick 3 endpoints (can be different from today)
  2. Write behavior contracts (if not done)
  3. Write tests
  4. Create PR
  5. Review another team's PR
  6. Reflect

### Wrap-up

**Remember:**
- Tests verify the contract
- Good tests are clear and specific
- Review helps us learn


## Materials Needed

- pytest documentation (reference)
- Test file template
- List of endpoints to test
- Behavior contracts (from Part 1)
- Computer for each student/pair

## Tips & Common Issues

### Common Issues

**Tests fail because database isn't set up**  
→ Use test database, use fixtures for test data

**Testing implementation, not behavior**  
→ Remind yourself: test "what it does" not "how it does it"

**Tests are too complex**  
→ Keep it simple, one thing per test

**Don't know what to test**  
→ Use behavior contracts as guide, look at examples

### Getting Help

- Ask your teammates
- Ask the instructor
- Check pytest documentation
- Review the examples from today

## Student Deliverables

- Tests written (can be part of HW1)
- Reflection on testing (can be part of HW1)

## Next Steps

- **Before Tuesday:** Complete HW1
- **Tuesday:** Data modeling and API design
- **Reading:** SQLAlchemy Relationships documentation (due Tuesday)
