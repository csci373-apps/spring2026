---
title: "Intro to FastAPI"
group: "Backend"
group_order: 3
order: 1
quicklink: 0
---

## Overview

**FastAPI** is a Python web framework for building REST API endpoints. It provides utilities for API documentation, data validation, and database interaction, making it easier to create well-structured, type-safe APIs. FastAPI automatically generates interactive API documentation from your code, validates request and response data using Pydantic models, and integrates seamlessly with SQLAlchemy for database operations.

## Creating an Endpoint

An **endpoint** is a specific URL path and HTTP method (GET, POST, PUT, DELETE, etc.) that your API responds to. For example, `GET /users/123` is an endpoint that retrieves a user with ID 123. Each endpoint is a function in your code that handles requests to that specific URL and method combination.

```python
from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}")
async def get_user(user_id: int):
    return {"id": user_id, "name": "John"}
```

The `APIRouter` object groups related endpoints together. The `prefix` parameter means all routes in this router will automatically start with `/users`, so you don't have to repeat it in each route path. The `tags` parameter helps organize endpoints in the auto-generated API documentation.

The `@router.get()` is a <a href="https://docs.python.org/3/glossary.html#term-decorator" target="_blank" rel="noopener noreferrer">**decorator**</a> -- a Python feature that modifies a function. In this case, it tells FastAPI to register this function as a GET endpoint. The `/{user_id}` path includes a **path parameter** (the part in curly braces), which FastAPI extracts from the URL and passes to your function. For example, a request to `/users/123` would call `get_user(123)`. FastAPI automatically converts the path parameter to the type specified in the function signature (`int` in this case).

### Router Setup

Routers organize endpoints by resource (e.g., all user-related endpoints for GET, PATCH, POST, DELETE, etc., are grouped together):

```python
# routes/users.py
from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

@router.get("")
async def get_all_users():
    return []

@router.get("/{user_id}")
async def get_user(user_id: int):
    return {"id": user_id}
```

In the router file, `@router.get("")` creates an endpoint at the base path (just `/users` since the prefix is already applied). The empty string `""` means "no additional path beyond the prefix." The second endpoint uses `/{user_id}` which creates the full path `/users/{user_id}`. When you use a router, you define paths relative to the prefix, making your code cleaner and easier to maintain.

Then include the router in your main app:

```python
# server.py
from fastapi import FastAPI
from routes import users

app = FastAPI()
app.include_router(users.router)
```

The `FastAPI()` call creates your main application instance. The `include_router()` method registers all the routes from the users router, making them available in your API. This modular approach lets you organize endpoints by feature (users, courses, etc.) and keeps your codebase organized as it grows.

## Request / Response Models

FastAPI uses **Pydantic** models to validate request bodies and define response shapes. Pydantic is a Python library that uses type hints to validate data and convert between Python objects and JSON. When you define a Pydantic model (a class that inherits from `BaseModel`), it automatically validates that incoming data matches the expected types and structure. If the data is invalid (e.g., missing required fields, wrong types), Pydantic raises a validation error that FastAPI converts into a `422 Unprocessable Entity` response.

For more information, see the <a href="https://docs.pydantic.dev/" target="_blank" rel="noopener noreferrer">Pydantic documentation</a>.

```python
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

@router.post("/", response_model=UserResponse)
async def create_user(user_data: UserCreate):
    # some logic that actually creates the user
    # ...
    return created_user
```

Pydantic models (classes that inherit from `BaseModel`) define the structure and validation rules for your data: 

* `UserCreate` specifies what fields are required in the request body when *creating* a user. When a POST request comes in, FastAPI automatically validates the request body against the `UserCreate` schema. If validation fails (e.g., missing required fields or wrong types), FastAPI returns a `422 Unprocessable Entity` error with details about what's wrong. 
* `UserResponse` defines what data is returned to the client after the new `User` instance has been created (note that it excludes the password field, for obvious reasons). The `response_model` parameter tells FastAPI to format (serialize) the return value using the `UserResponse` schema, which also filters out any fields not defined in that model (like the password).

## Path Parameters

Sometimes you need to get a specific value from the URL itself. For example, when someone visits `/users/123`, you want to extract the `123` to know which user they're asking about. These values in the URL path are called **path parameters**.

```python
@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    # Query the database for the user with this ID
    # (In a real endpoint, you'd get db from dependency injection)
    user = await db.get(User, user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user
```

In the code snippet above, the `{user_id}` syntax tells FastAPI to extract that segment from the URL and pass it as a function argument. For example, a request to `/users/123` would call `get_user(123)`. FastAPI automatically converts the path parameter to the type specified in the function signature (`int` in this case). If the conversion fails (e.g., `/users/abc` can't be converted to an integer), FastAPI returns a `422 Unprocessable Entity` error. The function then uses that `user_id` to query the database and return the matching user, or raise an error if the user doesn't exist.

## Query Parameters

Sometimes you want to pass optional information in the URL, like pagination settings or filters. For example, you might want to get users starting from the 20th result, or limit the results to 50 items. These optional values are called **query parameters** and appear after a `?` in the URL.

```python
@router.get("/users", response_model=List[UserResponse])
async def get_users(
    skip: int = 0,
    limit: int = 10
):
    # Query the database with pagination
    # (In a real endpoint, you'd get db from dependency injection)
    result = await db.execute(
        select(User).offset(skip).limit(limit)
    )
    users = result.scalars().all()
    return users
```

In this example, `skip` and `limit` have default values, making them optional. If a client requests `/users`, both parameters use their defaults (0 and 10), so the query returns the first 10 users. If they request `/users?skip=20&limit=50`, those values override the defaults, and the query skips the first 20 users and returns the next 50. 

## Error Handling

When something goes wrong -- like a user not being found, or invalid data being sent -- you need to tell the client what happened. Instead of returning a dictionary with error information, you should **raise** an HTTP exception. This tells FastAPI to send a proper error response with the right status code.

```python
from fastapi import HTTPException, status

@router.get("/users/{user_id}")
async def get_user(user_id: int):
    user = await find_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user
```

The `raise` statement stops execution immediately and sends an HTTP error response to the client. The `status_code` determines the HTTP status code (404 for "Not Found", 401 for "Unauthorized", etc.), and the `detail` message is included in the response body to help the client understand what went wrong. If no exception is raised, FastAPI automatically returns a `200 OK` status with your return value.

Common status codes:
- `200` - OK (default for GET, PUT, PATCH)
- `201` - Created (for POST)
- `404` - Not Found
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `500` - Internal Server Error

## Automatic Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

The documentation is generated from your type hints and docstrings.

## File Structure

```bash
backend/
├── routes/          # FastAPI route handlers
│   ├── auth.py
│   ├── users.py
│   └── courses.py
└── server.py        # Main FastAPI app
```

## Resources

- <a href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener noreferrer">FastAPI Documentation</a>
- <a href="https://fastapi.tiangolo.com/tutorial/" target="_blank" rel="noopener noreferrer">FastAPI Tutorial</a>

