---
title: "Testing API Endpoints"
group: "Backend"
group_order: 3
order: 5
---

## Overview

**Contract-level tests** verify that API endpoints behave correctly from the client's perspective. They test the API contract (request/response format, status codes, error handling) without testing implementation details.

## Test Structure

```python
import pytest
from httpx import AsyncClient
from fastapi.testclient import TestClient

# For async endpoints
@pytest.mark.asyncio
async def test_get_user(client: AsyncClient):
    response = await client.get("/api/users/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert "username" in data
```

## Setting Up Test Client

```python
import pytest
from httpx import AsyncClient
from server import app

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
```

## Testing CRUD Endpoints

### Create (POST)

```python
@pytest.mark.asyncio
async def test_create_user(client: AsyncClient):
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "securepassword"
    }
    response = await client.post("/api/users", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testuser"
    assert "id" in data
    assert "password" not in data  # Password should not be in response
```

### Read (GET)

```python
@pytest.mark.asyncio
async def test_get_user(client: AsyncClient):
    # Assuming user with id=1 exists
    response = await client.get("/api/users/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert "username" in data

@pytest.mark.asyncio
async def test_get_user_not_found(client: AsyncClient):
    response = await client.get("/api/users/99999")
    assert response.status_code == 404
    data = response.json()
    assert "not found" in data["detail"].lower()
```

### Update (PATCH/PUT)

```python
@pytest.mark.asyncio
async def test_update_user(client: AsyncClient, auth_headers):
    update_data = {"username": "newusername"}
    response = await client.patch(
        "/api/users/1",
        json=update_data,
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newusername"
```

### Delete (DELETE)

```python
@pytest.mark.asyncio
async def test_delete_user(client: AsyncClient, auth_headers):
    response = await client.delete(
        "/api/users/1",
        headers=auth_headers
    )
    assert response.status_code == 204  # No content
    
    # Verify user is deleted
    response = await client.get("/api/users/1")
    assert response.status_code == 404
```

## Testing Authentication

### Testing Protected Endpoints

```python
@pytest.mark.asyncio
async def test_get_users_requires_auth(client: AsyncClient):
    response = await client.get("/api/users")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_users_with_auth(client: AsyncClient, auth_headers):
    response = await client.get("/api/users", headers=auth_headers)
    assert response.status_code == 200
```

### Creating Auth Headers Fixture

```python
@pytest.fixture
async def auth_headers(client: AsyncClient):
    # Login to get token
    login_data = {
        "username": "testuser",
        "password": "testpassword"
    }
    response = await client.post("/api/auth/login", json=login_data)
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
```

## Testing Validation

### Invalid Request Body

```python
@pytest.mark.asyncio
async def test_create_user_invalid_email(client: AsyncClient):
    user_data = {
        "username": "testuser",
        "email": "not-an-email",  # Invalid email
        "password": "securepassword"
    }
    response = await client.post("/api/users", json=user_data)
    assert response.status_code == 422  # Validation error
    data = response.json()
    assert "validation error" in data["detail"][0]["type"].lower()
```

### Missing Required Fields

```python
@pytest.mark.asyncio
async def test_create_user_missing_fields(client: AsyncClient):
    user_data = {
        "username": "testuser"
        # Missing email and password
    }
    response = await client.post("/api/users", json=user_data)
    assert response.status_code == 422
```

## Testing Error Responses

```python
@pytest.mark.asyncio
async def test_get_user_not_found(client: AsyncClient):
    response = await client.get("/api/users/99999")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert "not found" in data["detail"].lower()

@pytest.mark.asyncio
async def test_create_user_duplicate_username(client: AsyncClient):
    user_data = {
        "username": "existinguser",
        "email": "test@example.com",
        "password": "password"
    }
    # Create first user
    await client.post("/api/users", json=user_data)
    
    # Try to create duplicate
    response = await client.post("/api/users", json=user_data)
    assert response.status_code == 400  # or 409 Conflict
```

## Using Mocks

Mock external dependencies (like database or external APIs):

```python
from unittest.mock import AsyncMock, patch

@pytest.mark.asyncio
async def test_get_user_with_mock(client: AsyncClient):
    # Mock the database query
    with patch('routes.users.get_user_from_db') as mock_get:
        mock_user = User(id=1, username="testuser")
        mock_get.return_value = mock_user
        
        response = await client.get("/api/users/1")
        assert response.status_code == 200
        mock_get.assert_called_once_with(1)
```

## Test Database Setup

Use a separate test database:

```python
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

@pytest.fixture
async def test_db():
    # Use in-memory SQLite for tests
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async_session = sessionmaker(engine, class_=AsyncSession)
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield async_session
    
    # Cleanup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
```

## Contract-Level Testing Principles

1. **Test behavior, not implementation** - Test what the API does, not how it does it
2. **Test the contract** - Verify request/response format, status codes, error messages
3. **Test edge cases** - Invalid input, missing data, unauthorized access
4. **Keep tests independent** - Each test should work in isolation
5. **Use descriptive test names** - `test_create_user_with_duplicate_email` is better than `test_create_user_2`

## Common Test Patterns

### Testing Lists

```python
@pytest.mark.asyncio
async def test_get_all_users(client: AsyncClient):
    response = await client.get("/api/users")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "id" in data[0]
        assert "username" in data[0]
```

### Testing Pagination

```python
@pytest.mark.asyncio
async def test_get_users_paginated(client: AsyncClient):
    response = await client.get("/api/users?skip=0&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data) <= 10
```

## Resources

- <a href="https://fastapi.tiangolo.com/tutorial/testing/" target="_blank" rel="noopener noreferrer">FastAPI Testing</a>
- <a href="https://docs.pytest.org/" target="_blank" rel="noopener noreferrer">Pytest Documentation</a>
- <a href="https://www.python-httpx.org/" target="_blank" rel="noopener noreferrer">HTTPX Documentation</a>

