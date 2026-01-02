---
title: "Testing API Endpoints"
group: "Backend"
group_order: 3
order: 5
---

**Contract-level tests** verify that API endpoints behave correctly from the client's perspective. They test the API contract (request/response format, status codes, error handling) without testing implementation details.

**Key principle:** Contract-level tests verify behavior **through the API interface**, not by directly accessing the database or internal implementation. If the API contract says "creates a user," you verify that by using the API itself (e.g., POST to create, then GET to verify it exists), not by querying the database directly.

## Contract-Level Testing Principles

1. **Test behavior, not implementation** - Test what the API does, not how it does it
2. **Test the contract** - Verify request/response format, status codes, error messages
3. **Test edge cases** - Invalid input, missing data, unauthorized access
4. **Keep tests independent** - Each test should work in isolation
5. **Use descriptive test names** - `test_create_user_with_duplicate_email` is better than `test_create_user_2`

## Test Structure

Contract-level tests follow a simple pattern: make a request, check the response. Here's a basic example:

```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_all_users_requires_auth(client: AsyncClient):
    """Test that GET /api/users requires authentication"""
    response = await client.get("/api/users")
    assert response.status_code == 401
```

Notice what this test checks:
- **Status code** (401 Unauthorized) - the API contract says "you must authenticate"
- **No implementation details** - we don't check how authentication works, just that it's required

## Setting Up Test Infrastructure

The test infrastructure is set up in `conftest.py`, which provides **fixtures** (reusable test setup) to all tests.

### What are Fixtures?

**Fixtures** are functions decorated with `@pytest.fixture` that provide test data or setup code. They work like dependency injection -- you request a fixture by including it as a parameter in your test function, and pytest automatically provides it.

For example, if you have a fixture called `client`, you use it like this:

```python
@pytest.mark.asyncio
async def test_something(client: AsyncClient):  
    response = await client.get("/api/users")
    # pytest automatically provides the client fixture
```

Fixtures defined in `conftest.py` are available to **all tests** in that directory and subdirectories. This makes it easy to share common setup (like database connections, test clients, or authentication) across multiple test files.

Here's the key setup from `conftest.py`:

```python
"""
Pytest configuration and fixtures for testing
"""
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from database import get_db
from models import Base, Role, User
from server import app

# Create test database (in-memory SQLite)
test_engine = create_async_engine(
    "sqlite+aiosqlite:///:memory:",
    echo=False,
)
TestSessionLocal = sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)

# Override the get_db dependency to use test database
async def override_get_db():
    """Override get_db to use test database"""
    async with TestSessionLocal() as session:
        yield session

# Apply the override
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
async def test_db():
    """Create and drop test database tables for each test"""
    # Create tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed required roles
    async with TestSessionLocal() as session:
        roles = [
            Role(name="user", description="Standard user role"),
            Role(name="manager", description="Group manager role"),
            Role(name="admin", description="Administrator role"),
        ]
        for role in roles:
            session.add(role)
        await session.commit()
    
    yield test_engine
    
    # Drop tables after test
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def client(test_db):
    """Create test client with test database"""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac

@pytest.fixture
async def admin_user(test_db):
    """Create an admin user for testing (roles already exist from test_db fixture)"""
    async with TestSessionLocal() as session:
        from sqlalchemy.future import select
        from sqlalchemy.orm import joinedload
        
        # Get admin role (already created by test_db fixture)
        result = await session.execute(select(Role).where(Role.name == "admin"))
        admin_role = result.scalar_one()
        
        # Create admin user
        admin = User(
            username="admin",
            email="admin@test.com",
            hashed_password="$2b$12$dummy",  # Dummy hash for testing
            role_id=admin_role.id,
            is_active=True,
        )
        session.add(admin)
        await session.commit()
        await session.refresh(admin)
        
        # Load role relationship
        result = await session.execute(
            select(User).where(User.id == admin.id).options(joinedload(User.role))
        )
        admin_with_role = result.scalar_one()
        
        yield admin_with_role

@pytest.fixture
async def auth_headers(client, admin_user, test_db):
    """Get authentication headers by overriding auth dependencies"""
    from auth import get_current_user, require_admin
    
    async def override_get_current_user():
        return admin_user
    
    async def override_require_admin():
        return admin_user
    
    # Override authentication dependencies to return our test admin user
    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[require_admin] = override_require_admin
    
    yield {"Authorization": "Bearer test-token"}
    
    # Clean up overrides after test
    app.dependency_overrides.pop(get_current_user, None)
    app.dependency_overrides.pop(require_admin, None)
```

This setup provides four key fixtures:
- **`test_db`**: Creates a fresh in-memory database for each test, seeds required roles
- **`client`**: Provides an HTTP client for making requests to your API
- **`admin_user`**: Creates an admin user in the test database for authentication testing
- **`auth_headers`**: Overrides authentication dependencies to bypass JWT validation, returning headers that make requests appear authenticated

### How the Test Database Works

The test infrastructure uses **dependency overrides** (FastAPI's built-in testing feature) to replace the real database with an in-memory SQLite database:

1. **In-memory SQLite** - Fast, no disk I/O, automatically cleaned up
2. **Fresh database per test** - `test_db` fixture creates/drops tables for each test
3. **Seeds required data** - Creates roles that endpoints need
4. **Dependency override** - All endpoints automatically use the test database via `app.dependency_overrides[get_db] = override_get_db`

This means:
- **No mocks needed** - We use real database operations, just on a test database
- **Tests are realistic** - They exercise the same code paths as production
- **No real database touched** - All operations happen in the in-memory test database
- **Easy to maintain** - If you change dependencies, tests automatically use the new versions

## Testing CRUD Endpoints

### Create (POST)

Here's a contract-level test for creating a user:

```python
@pytest.mark.asyncio
async def test_create_user_success(client: AsyncClient, auth_headers):
    """Test that POST /api/users creates a user successfully"""
    user_data = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "password123",
        "role": "user",
    }
    response = await client.post("/api/users", json=user_data, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert "id" in data
    assert "password" not in data  # Password should not be in response
    
    # Verify the user was actually created by retrieving it through the API
    user_id = data["id"]
    get_response = await client.get(f"/api/users/{user_id}", headers=auth_headers)
    assert get_response.status_code == 200
    retrieved_user = get_response.json()
    assert retrieved_user["username"] == "newuser"
    assert retrieved_user["email"] == "newuser@example.com"
```

This test verifies the **POST endpoint's contract**:
- Status code is `201 Created` (not `200 OK`)
- Response contains the expected fields (`username`, `email`, `id`)
- Sensitive data (`password`) is **not** in the response
- **The user actually persists** - verified by retrieving it through the API (not by querying the database directly)

**Why verify through GET?** Contract-level tests verify behavior through the API interface. If the contract says "creates a user," we verify that by using the API itself (GET) to confirm the user exists. This is still contract-level because we're testing through the API, not accessing the database directly.
- The response format matches what clients expect

### Read (GET)

```python
@pytest.mark.asyncio
async def test_get_all_users_with_auth(client: AsyncClient, auth_headers, admin_user):
    """Test that GET /api/users returns list of users when authenticated"""
    response = await client.get("/api/users", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    
    # Verify the list contains at least the admin user we created
    assert len(data) >= 1
    # Verify each item in the list has the expected user structure
    for user in data:
        assert "id" in user
        assert "username" in user
        assert "email" in user
        assert "role" in user
        assert "password" not in user  # Password should never be in response
    
    # Verify the admin user is in the list
    admin_usernames = [user["username"] for user in data]
    assert "admin" in admin_usernames

@pytest.mark.asyncio
async def test_get_user_by_id_not_found(client: AsyncClient, auth_headers):
    """Test that GET /api/users/{id} returns 404 for non-existent user"""
    response = await client.get("/api/users/99999", headers=auth_headers)
    assert response.status_code == 404
    data = response.json()
    assert "not found" in data["detail"].lower()
```

These tests verify:
- **Success case**: Returns a list (the contract says "list of users")
- **Error case**: Returns `404` with a descriptive error message (the contract says "not found")

### Update (PATCH/PUT)

```python
@pytest.mark.asyncio
async def test_update_user(client: AsyncClient, auth_headers, admin_user):
    """Test that PATCH /api/users/{id} updates a user successfully"""
    # First, get the user's current data
    user_id = admin_user.id
    update_data = {"username": "updatedusername"}
    
    # Update the user
    response = await client.patch(
        f"/api/users/{user_id}",
        json=update_data,
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "updatedusername"
    
    # Verify the update persisted by retrieving the user
    get_response = await client.get(f"/api/users/{user_id}", headers=auth_headers)
    assert get_response.status_code == 200
    updated_user = get_response.json()
    assert updated_user["username"] == "updatedusername"
    # Verify other fields weren't changed
    assert updated_user["email"] == admin_user.email
```

### Delete (DELETE)

```python
@pytest.mark.asyncio
async def test_delete_user(client: AsyncClient, auth_headers):
    """Test that DELETE /api/users/{id} deletes a user successfully"""
    # First, create a user to delete
    user_data = {
        "username": "todelete",
        "email": "todelete@example.com",
        "password": "password123",
        "role": "user",
    }
    create_response = await client.post("/api/users", json=user_data, headers=auth_headers)
    user_id = create_response.json()["id"]
    
    # Verify user exists
    get_response = await client.get(f"/api/users/{user_id}", headers=auth_headers)
    assert get_response.status_code == 200
    
    # Delete the user
    delete_response = await client.delete(
        f"/api/users/{user_id}",
        headers=auth_headers
    )
    assert delete_response.status_code == 204  # No content
    
    # Verify user is actually deleted by trying to retrieve it
    get_response = await client.get(f"/api/users/{user_id}", headers=auth_headers)
    assert get_response.status_code == 404
```

## Testing Authentication

### Testing Protected Endpoints

Every protected endpoint should have two tests: one without auth (should fail) and one with auth (should succeed):

```python
@pytest.mark.asyncio
async def test_get_all_users_requires_auth(client: AsyncClient):
    """Test that GET /api/users requires authentication"""
    response = await client.get("/api/users")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_all_users_with_auth(client: AsyncClient, auth_headers):
    """Test that GET /api/users returns list of users when authenticated"""
    response = await client.get("/api/users", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
```

This pattern ensures the API contract is clear: "This endpoint requires authentication."

The `auth_headers` fixture (shown in the infrastructure setup above) uses dependency overrides to bypass JWT validation, making requests appear authenticated without needing real tokens.

## Testing Validation

### Missing Required Fields

Contract-level tests verify that the API rejects invalid input:

```python
@pytest.mark.asyncio
async def test_create_user_missing_fields(client: AsyncClient, auth_headers):
    """Test that POST /api/users returns 422 for missing required fields"""
    user_data = {
        "username": "testuser"
        # Missing email and password
    }
    response = await client.post("/api/users", json=user_data, headers=auth_headers)
    assert response.status_code == 422
```

This test verifies the **contract**: "If you don't provide required fields, you get a `422 Unprocessable Entity` error."

### Business Logic Errors

Test that the API returns appropriate error codes for business logic violations:

```python
@pytest.mark.asyncio
async def test_create_user_duplicate_username(
    client: AsyncClient, auth_headers, test_db
):
    """Test that POST /api/users returns error for duplicate username"""
    user_data = {
        "username": "duplicate",
        "email": "first@example.com",
        "password": "password123",
        "role": "user",
    }
    # Create first user
    create_response = await client.post("/api/users", json=user_data, headers=auth_headers)
    assert create_response.status_code == 201
    first_user_id = create_response.json()["id"]
    
    # Verify the first user was actually created
    get_response = await client.get(f"/api/users/{first_user_id}", headers=auth_headers)
    assert get_response.status_code == 200
    assert get_response.json()["username"] == "duplicate"
    
    # Try to create duplicate username (different email)
    user_data["email"] = "second@example.com"
    response = await client.post("/api/users", json=user_data, headers=auth_headers)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()
    
    # Verify the first user still exists and wasn't affected
    get_response = await client.get(f"/api/users/{first_user_id}", headers=auth_headers)
    assert get_response.status_code == 200
    assert get_response.json()["email"] == "first@example.com"  # Original email unchanged
```

This verifies the **error contract**: `400` for business logic errors (like duplicate usernames), with descriptive error messages.

## Putting It All Together

The examples above demonstrate the key patterns for contract-level testing:

1. **Test authentication** - Verify endpoints require auth (401 without, 200 with)
2. **Test success cases** - Verify correct status codes and response format
3. **Test error cases** - Verify appropriate error codes (404 for not found, 400 for business logic errors, 422 for validation errors)
4. **Test validation** - Verify invalid input is rejected
5. **Verify persistence** - Use the API itself (GET after POST/PATCH/DELETE) to confirm data changes

For a complete working example, see `backend/tests/test_users.py` in the starter code repository.

## Resources

- <a href="https://fastapi.tiangolo.com/tutorial/testing/" target="_blank" rel="noopener noreferrer">FastAPI Testing</a>
- <a href="https://docs.pytest.org/" target="_blank" rel="noopener noreferrer">Pytest Documentation</a>
- <a href="https://www.python-httpx.org/" target="_blank" rel="noopener noreferrer">HTTPX Documentation</a>

