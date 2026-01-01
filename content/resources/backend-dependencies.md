---
title: "Decorators and Dependency Injection"
group: "Backend"
group_order: 3
order: 4
---

## Overview

FastAPI's `Depends` system lets you inject dependencies (like database sessions, authentication, etc.) into endpoints. This keeps your code clean, testable, and reusable.

## Database Session Dependency

The most common dependency is the database session:

```python
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db

@router.get("/users")
async def get_all_users(db: AsyncSession = Depends(get_db)):
    # db is automatically provided by FastAPI
    result = await db.execute(select(User))
    return result.scalars().all()
```

## How `get_db` Works

```python
async def get_db():
    """
    Generator function that creates and closes database sessions.
    FastAPI automatically handles the lifecycle.
    """
    async with AsyncSessionLocal() as session:
        yield session  # Give session to endpoint
        # Session automatically closed after endpoint finishes
```

The `yield` keyword makes this a generator function. FastAPI:
1. Calls the function up to `yield` (creates session)
2. Passes the yielded value to your endpoint
3. Continues after `yield` when endpoint finishes (closes session)

## Authentication Dependency

### Basic Authentication

```python
from auth import get_current_user

# Require any authenticated user
@router.get("/courses")
async def get_courses(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # current_user is automatically injected
    # If not authenticated, get_current_user raises 401
    return await get_user_courses(current_user.id, db)
```

### Role-Based Access

```python
from auth import require_admin

# Require admin role
@router.post("/users")
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    # Only admins can reach this code
    # require_admin raises 403 if user is not admin
    new_user = User(**user_data.model_dump())
    db.add(new_user)
    await db.commit()
    return new_user
```

## Creating Custom Dependencies

### Simple Dependency

```python
from fastapi import Depends, Query

def get_pagination(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    return {"skip": skip, "limit": limit}

@router.get("/users")
async def get_users(pagination: dict = Depends(get_pagination)):
    skip = pagination["skip"]
    limit = pagination["limit"]
    # Use pagination values
```

### Dependency with Database Access

```python
async def get_user_by_id(
    user_id: int,
    db: AsyncSession = Depends(get_db)
) -> User:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/users/{user_id}")
async def get_user(user: User = Depends(get_user_by_id)):
    # user is already fetched and validated
    return user
```

## Chaining Dependencies

Dependencies can depend on other dependencies:

```python
async def get_bearer_token(
    authorization: str = Header(...)
) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    return authorization.replace("Bearer ", "")

async def get_current_user(
    token: str = Depends(get_bearer_token),  # Depends on token
    db: AsyncSession = Depends(get_db)       # Depends on database
) -> User:
    # Decode token and fetch user from database
    user_id = decode_token(token)
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one()
```

## Common Dependency Patterns

### Pagination

```python
class PaginationParams:
    def __init__(
        self,
        skip: int = Query(0, ge=0),
        limit: int = Query(10, ge=1, le=100)
    ):
        self.skip = skip
        self.limit = limit

@router.get("/users")
async def get_users(pagination: PaginationParams = Depends()):
    # Use pagination.skip and pagination.limit
```

### Filtering

```python
class UserFilters:
    def __init__(
        self,
        role_id: Optional[int] = Query(None),
        is_active: Optional[bool] = Query(None)
    ):
        self.role_id = role_id
        self.is_active = is_active

@router.get("/users")
async def get_users(
    filters: UserFilters = Depends(),
    db: AsyncSession = Depends(get_db)
):
    query = select(User)
    if filters.role_id:
        query = query.where(User.role_id == filters.role_id)
    if filters.is_active is not None:
        query = query.where(User.is_active == filters.is_active)
    result = await db.execute(query)
    return result.scalars().all()
```

## Benefits of Dependency Injection

1. **Reusability** - Write once, use in many endpoints
2. **Testability** - Easy to mock dependencies in tests
3. **Separation of Concerns** - Business logic separate from infrastructure
4. **Type Safety** - FastAPI validates dependency types

## Common Mistakes

1. **Forgetting `yield` in generator dependencies** - Use `yield` not `return` for resources that need cleanup
2. **Not handling exceptions in dependencies** - Dependencies should raise HTTPException for errors
3. **Circular dependencies** - Be careful with dependencies that depend on each other
4. **Not using type hints** - FastAPI uses type hints for validation

## Resources

- <a href="https://fastapi.tiangolo.com/tutorial/dependencies/" target="_blank" rel="noopener noreferrer">FastAPI Dependencies</a>
- <a href="https://fastapi.tiangolo.com/advanced/advanced-dependencies/" target="_blank" rel="noopener noreferrer">Advanced Dependencies</a>

