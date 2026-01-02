---
title: "Decorators and Dependency Injection"
group: "Backend"
group_order: 3
order: 3
---

FastAPI's `Depends` system lets you inject dependencies (like database sessions, authentication, etc.) into endpoints. This keeps your code clean, testable, and reusable. However, before diving into `Depends`, it's helpful to understand **decorators** -- a Python feature that FastAPI uses extensively. A decorator is a function that wraps another function to modify or extend its behavior.

### Basic Decorator Example

As a simple example, pretend you're trying to figure out some performance bottlenecks in your system and you suspect that a few functions are really impacting performance. You decide to track these "suspicious" functions by adding logging: every time certain functions are called, you want to log this. You *could* add print statements to each function. Or, you could create a decorator that you apply to just the functions you want to log. Let's look at how you might do this:


```python
def greet():
    # Logging code mixed with business logic
    print("Calling greet")  
    print("Hello!")

def calculate():
    # Same logging code repeated
    print("Calling calculate")  
    return 2 + 2
```

This mixes logging code with your business logic and requires repeating the same code in every function. Decorators solve this by letting you write the logging code once and apply it to any function:

```python
def log_calls(func):
    # Decorator that logs when a function is called
    def wrapper():
        print(f"Calling {func.__name__}")
        return func()
    return wrapper

@log_calls
def greet():
    print("Hello!")

@log_calls
def calculate():
    return 2 + 2

greet()      # Prints: "Calling greet" then "Hello!"
calculate()  # Prints: "Calling calculate" then returns 4
```

The `@log_calls` syntax is shorthand for `greet = log_calls(greet)`. The decorator wraps the original function with additional behavior (logging) without modifying the function itself.

### Decorators with Arguments

```python
def require_auth(func):
    # Decorator that checks authentication 
    # before calling a function
    def wrapper(user):
        if user is None:
            raise ValueError("User must be authenticated")
        return func(user)
    return wrapper

@require_auth
def get_user_data(user):
    return f"Data for {user}"

get_user_data("alice")  # Works
get_user_data(None)     # Raises ValueError
```

> **Note**: Decorators can be tricky at first. The key idea is that a decorator is a function that wraps another function, adding behavior (like logging, authentication checks, or timing) that runs before or after the original function executes.

### FastAPI Uses Decorators

FastAPI uses decorators to define routes:

```python
# This decorator registers the function as a GET endpoint
@router.get("/users")  
async def get_users():
    return {"users": []}
```

The `@router.get("/users")` decorator tells FastAPI: "When someone makes a GET request to `/users`, call this function." The decorator handles all the HTTP request/response logic, so you just write the function body.

For more information, see the <a href="https://docs.python.org/3/glossary.html#term-decorator" target="_blank" rel="noopener noreferrer">Python documentation on decorators</a>.

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

The `yield`<a href="#generator-note"><sup>1</sup></a> keyword makes this a generator function. FastAPI:
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

## Multiple Dependencies

A dependency function can use multiple other dependencies:

```python
async def get_bearer_token(
    authorization: str = Header(...)
) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401, 
            detail="Invalid token format"
        )
    return authorization.replace("Bearer ", "")

async def get_current_user(
    token: str = Depends(get_bearer_token),  # Depends on token
    db: AsyncSession = Depends(get_db)       # Depends on database
) -> User:
    # Decode token and fetch user from database
    user_id = decode_token(token)
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one()
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

## Notes

<a id="generator-note"></a><sup>1</sup> **Generator**: A generator is a special type of function in Python that uses the `yield` keyword instead of `return`. When you call a generator function, it doesn't execute immediately -- instead, it returns a generator object. The function's code only runs when you iterate over the generator (e.g., using `next()` or in a `for` loop). Each time the function reaches a `yield` statement, it pauses execution and returns the yielded value. When you request the next value, execution resumes from where it left off. This makes generators useful for creating sequences of values without storing them all in memory at once, and for managing resources (like database connections) that need cleanup after use.

