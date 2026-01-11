---
title: "Pytest Workshop"
start_date: "2026-01-22"
type: "activity"
---

## Learning Objectives

By the end of this session, students will:
- Understand the basics of pytest
- Be able to write contract-level API tests
- Understand what makes a good test
- Be comfortable with pair programming for testing
- Have practiced writing tests for existing endpoints


## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:10 | Review & Warm-up | Review behavior contracts, address questions |
| 0:10-0:30 | Pytest Workshop | Learn pytest basics |
| 0:30-0:60 | Team Testing Practice | Write tests together |
| 0:60-0:75 | Test Review | Review and critique tests |
| 0:75-0:90 | Reflection & Wrap-up | What makes a good test? |


## Detailed Instructions

### Part 1: Review & Warm-up (10 minutes)

#### Check-in (3 minutes)
1. **Welcome back**
2. **Quick check:** "Raise your hand if:"
   - You read the pytest documentation
   - You wrote a behavior contract
   - You have questions about models/schemas/routes

#### Review Behavior Contracts (5 minutes)

**Instructor asks:** "Who wrote a behavior contract? Share one thing you learned."

**Common insights:**
- "I didn't realize how much validation happens"
- "I see why we need schemas now"
- "The flow makes more sense"

**Address questions** about behavior contracts

#### Preview Today (2 minutes)
- "Today we're learning to write tests"
- "Tests verify that code does what the contract says"
- "We'll practice together, then you'll write tests for homework"

**Transition:** "Let's start with pytest basics..."


### Part 2: Pytest Workshop (20 minutes)

#### What is pytest? (3 minutes)

**Instructor explains:**
- pytest is a testing framework for Python
- It makes writing tests easy
- It provides helpful output when tests fail
- It's the standard for Python testing

**Show a simple test:**

```python
def test_addition():
    assert 2 + 2 == 4
```

**Run it:**
```bash
pytest test_example.py
```

**Key Point:** "Tests are just functions that assert things are true."

#### Test Structure (5 minutes)

**Show a real API test:**

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

**Explain the structure:**
- **Arrange:** Set up what you need (test data, fixtures)
- **Act:** Do the thing you're testing (make the request)
- **Assert:** Check that it worked (verify the response)

**Key Point:** "This pattern (Arrange-Act-Assert) makes tests clear."

#### Fixtures (5 minutes)

**Explain fixtures:**
- Fixtures are reusable test data
- They're set up before tests run
- They're cleaned up after tests run

**Show example:**

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

**Explain:**
- `@pytest.fixture` decorator marks a fixture
- Fixtures can depend on other fixtures
- They're automatically injected into test functions

**Key Point:** "Fixtures help you set up test data without repeating code."

#### Writing Good Tests (7 minutes)

**Instructor explains what makes a good test:**

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

**Show examples:**

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

**Key Point:** "Good tests verify the contract, not the implementation."

**Transition:** "Now let's practice writing tests..."


### Part 3: Team Testing Practice (30 minutes)

#### Setup (5 minutes)

**Instructor provides:**
1. **Test file template:**
   ```python
   import pytest
   from fastapi.testclient import TestClient
   from backend.server import app
   
   client = TestClient(app)
   
   # Your tests go here
   ```

2. **List of endpoints to test:**
   - `GET /api/users/me` - Get current user
   - `POST /api/auth/login` - Login
   - `GET /api/groups` - List groups
   - (or others)

3. **Behavior contracts** (from previous class or provide)

#### Team Activity: Write Tests (20 minutes)

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

**Instructor circulates:**
- Help teams write tests
- Answer questions about pytest
- Ensure tests are testing behavior, not implementation
- Help with fixtures if needed

#### Run Tests (5 minutes)

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

**Instructor:** Help teams debug failing tests

**Transition:** "Now let's review some tests together..."


### Part 4: Test Review (15 minutes)

#### Share Tests (10 minutes)

**Ask 2-3 teams to share:**
1. **Their endpoint**
2. **Their tests** (show code on screen)
3. **What they tested** (success? failure? edge cases?)

**Instructor leads review:**
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

**Key Point:** "Review helps us learn. We'll do this for homework too."

#### Best Practices Summary (5 minutes)

**Instructor summarizes:**

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

**Transition:** "Let's reflect on what we learned..."


### Part 5: Reflection & Wrap-up (15 minutes)

#### Reflection Activity (10 minutes)

**Instructor asks teams to discuss:**

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

**Instructor:** Have teams share insights

#### Preview Homework (3 minutes)

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

#### Wrap-up (2 minutes)
- Remind students:
  - Tests verify the contract
  - Good tests are clear and specific
  - Review helps us learn
- Thank students for participation


## Materials Needed

- pytest documentation (reference)
- Test file template
- List of endpoints to test
- Behavior contracts (from previous class)
- Computer for each student/pair

## Instructor Notes

### Common Issues

**Issue: Tests fail because database isn't set up**  
Solution: Use test database, provide fixtures for test data

**Issue: Students test implementation, not behavior**  
Solution: Remind them to test "what it does" not "how it does it"

**Issue: Tests are too complex**  
Solution: Encourage simple tests, one thing per test

**Issue: Students don't know what to test**  
Solution: Use behavior contracts as guide, provide examples

### Time Management

- **If running short:** Add more test writing practice
- **If running long:** Move test review to async, focus on writing tests

### Differentiation

- **For advanced students:** Have them write more complex tests, test edge cases
- **For struggling students:** Provide more scaffolding, focus on one simple test


## Student Deliverables

- Tests written (can be part of HW1)
- Reflection on testing (can be part of HW1)

## Next Steps

- **Before Tuesday:** Complete HW1
- **Tuesday:** Data modeling and API design
- **Reading:** SQLAlchemy Relationships documentation (due Tuesday)

