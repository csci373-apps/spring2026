---
title: "Backend Deep Dive"
start_date: "2026-01-20"
type: "activity"
draft: 0
heading_max_level: 3
---

## Learning Objectives

By the end of this session, students will:
- Understand the difference between models, schemas, and routes
- Be able to read and understand existing backend code
- Understand how requests flow through the backend
- Be comfortable asking questions about confusing code

## 1. Models vs Schemas vs Routes (20 minutes)

### 1.1. The Three Layers

```bash
┌─────────────────────────────────────┐
│         Routes (API Endpoints)      │  ← What users call
│  /api/auth/login, /api/users, etc.  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Schemas (Pydantic)             │  ← Data validation
│  UserCreate, Token, UserResponse    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Models (SQLAlchemy)            │  ← Database tables
│  User, Group, Course, etc.          │
└─────────────────────────────────────┘
               │
               ▼
         Database (PostgreSQL)
```

Each layer has a specific job. Understanding this separation is crucial.

### 1.2. Models: Database Tables

Navigate to `backend/models/user.py` and look at the code. The code represents a database table structure (SQLAlchemy translates this to SQL). It defines where and how data is stored:

```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role_id = Column(Integer, ForeignKey("roles.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    ...

    # This is a relationship to another table. SQLAlchemy handles the join for us.
    role = relationship("Role", backref="users")
```

Notice: 
- `hashed_password`, not `password` (security!)
- `role = relationship("Role", backref="users")` is a join to another DB table.

**Takeaway:** Models define the database structure. They don't validate input or format output.

### 1.3. Schemas: API Contracts

**Navigate to `backend/schemas/auth.py`:**

```python
class UserBase(BaseModel):
    """Base schema with common user fields"""

    username: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    child_name: Optional[str] = None
    child_sex_assigned_at_birth: Optional[str] = None
    child_dob: Optional[date] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    """Schema for creating a new user (registration)"""

    password: str
    role: Optional[str] = "user"  # Default role is 'user'


class UserResponse(UserBase):
    """What a user looks like when we send it back to the client"""

    model_config = ConfigDict(from_attributes=True)

    id: int
    role: RoleInUser
    email_verified: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

```

These are Pydantic models - they validate data:
- `UserCreate`: what comes IN from the API - data are validated and 422 code returned if format doesn't match.
- `UserResponse`: what goes OUT to the API (notice no `hashed_password` in return schemas b/c of security!)

**Takeaway:** Schemas define the API contract. They validate input and format output.

### 1.4. Routes: API Endpoints

Navigate to `backend/routes/auth.py`:

```python
@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == credentials.username).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    
    token = create_access_token(data={"sub": user.username})
    return Token(access_token=token, token_type="bearer")
```

What does each line do?
1. `@router.post("/login")` - This is the endpoint URL
2. `response_model=Token` - This is what we return (Pydantic schema)
3. `credentials: UserLogin` - This is what we receive (Pydantic schema)
4. `db: Session = Depends(get_db)` - This is dependency injection (we'll learn more)
5. `db.query(User)` - Query the database using the model
6. `verify_password()` - Check the password
7. `create_access_token()` - Generate JWT token
8. `return Token(...)` - Return Pydantic schema (validated output)

**Takeaway:** Routes contain the business logic that is accessible to external clients (like our web app and our mobile app). Think of it as the way that clients can interact with the data in the system.

### 1.5. The Flow 

1. **Request arrives:** `POST /api/auth/login` with `{"username": "alice", "password": "secret"}`
2. **Schema validates:** Pydantic checks `UserLogin` schema
3. **Route executes:** Function runs
4. **Model queries:** SQLAlchemy queries `User` table
5. **Business logic:** Check password, create token
6. **Schema formats:** Pydantic formats `Token` response
7. **Response sent:** JSON returned to client

**Takeaway:** Each layer does one job. This separation makes code maintainable.



## 2. Activity: Code Scavenger Hunt (20 minutes)
> **Instructions:**
> 1. Work with your team
> 2. Explore the codebase - look at different files
> 3. Answer the questions below - be specific
> 4. Ask questions - if something is confusing, ask!

### Task 1: Find a Model
- Find the User model
- What table does it map to?
- What columns does it have?
- What relationships does it have?

### Task 2: Find a Schema
- Find a schema that validates input
- What fields does it validate?
- Find a schema that formats output
- What fields does it include/exclude?

### Task 3: Find a Route
- Find a GET endpoint
- What does it return?
- Find a POST endpoint
- What does it accept?
- Find a route that uses a relationship
- How does it query related data?

### Task 4: Trace a Request
- Pick an endpoint (not login)
- Trace it: Route → Schema → Model → Database
- What happens at each step?

(You will share out your findings)


## Next Steps

- **Before Thursday:** Read the backend resources:
  - [Intro to FastAPI](../resources/backend-01-fastapi-intro)
  - [Testing API Endpoints](../resources/backend-05-testing)
- **Thursday:** Pytest workshop - learn to write tests
- **Homework:** HW0 due this Thursday at 11:59PM

