---
title: "Backend Deep Dive"
start_date: "2026-01-20"
type: "activity"
---

## Learning Objectives

By the end of this session, students will:
- Understand the difference between models, schemas, and routes
- Be able to read and understand existing backend code
- Be able to write a "behavior contract" for an endpoint
- Understand how requests flow through the backend
- Be comfortable asking questions about confusing code



## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:10 | Review & Warm-up | Review HW0, address questions |
| 0:10-0:30 | Models vs Schemas vs Routes | Lecture and code walkthrough |
| 0:30-0:50 | Code Scavenger Hunt | Teams explore codebase |
| 0:50-1:20 | Behavior Contract Activity | Write contracts for endpoints |
| 1:20-1:30 | Q&A & Wrap-up | Questions, preview homework |



## Detailed Instructions

### Part 1: Review & Warm-up (10 minutes)

#### Check-in (3 minutes)
1. **Welcome back**
2. **Quick check:** "Raise your hand if:"
   - Your dev environment is working
   - You completed HW0
   - You have questions about the setup

#### Address Common Issues (5 minutes)
**Instructor asks:** "What issues did you run into with setup?"

**Common issues to address:**
- Database connection problems
- Poetry/Node installation issues
- Git workflow questions
- Working agreement questions

**Solutions:**
- Provide quick fixes
- Point to documentation
- Offer office hours for deeper issues

#### Preview Today (2 minutes)
- "Today we're diving deep into the backend"
- "You'll learn to read code, not just write it"
- "We'll practice understanding before implementing"

**Transition:** "Let's start with the three layers of the backend..."



### Part 2: Models vs Schemas vs Routes (20 minutes)

#### The Three Layers (5 minutes)

**Instructor draws diagram on whiteboard:**

```
┌─────────────────────────────────────┐
│         Routes (API Endpoints)      │  ← What users call
│  /api/auth/login, /api/users, etc. │
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
│      Models (SQLAlchemy)             │  ← Database tables
│  User, Group, Course, etc.          │
└─────────────────────────────────────┘
               │
               ▼
         Database (PostgreSQL)
```

**Key Point:** "Each layer has a specific job. Understanding this separation is crucial."

#### Models: Database Tables (5 minutes)

**Navigate to `backend/models/user.py`:**

```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role_id = Column(Integer, ForeignKey("roles.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
```

**Explain:**
- "This is the database table structure"
- "SQLAlchemy translates this to SQL"
- "This defines what data is stored"
- "Notice: `hashed_password`, not `password` (security!)"

**Show the relationship:**
```python
role = relationship("Role", back_populates="users")
```
- "This is a relationship to another table"
- "SQLAlchemy handles the join for us"

**Key Point:** "Models define the database structure. They don't validate input or format output."

#### Schemas: API Contracts (5 minutes)

**Navigate to `backend/schemas/auth.py`:**

```python
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: Role
```

**Explain:**
- "These are Pydantic models - they validate data"
- "UserCreate: what comes IN from the API"
- "UserResponse: what goes OUT to the API"
- "Notice: no `hashed_password` in schemas (security!)"

**Show validation:**
```python
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr  # Pydantic validates email format
    password: str = Field(..., min_length=8)
```
- "Pydantic automatically validates this"
- "If invalid, returns 422 error"

**Key Point:** "Schemas define the API contract. They validate input and format output."

#### Routes: API Endpoints (5 minutes)

**Navigate to `backend/routes/auth.py`:**

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

**Walk through line by line:**
1. `@router.post("/login")` - "This is the endpoint URL"
2. `response_model=Token` - "This is what we return (Pydantic schema)"
3. `credentials: UserLogin` - "This is what we receive (Pydantic schema)"
4. `db: Session = Depends(get_db)` - "This is dependency injection (we'll learn more)"
5. `db.query(User)` - "Query the database using the model"
6. `verify_password()` - "Check the password"
7. `create_access_token()` - "Generate JWT token"
8. `return Token(...)` - "Return Pydantic schema (validated output)"

**Key Point:** "Routes orchestrate models and schemas. They contain the business logic."

#### The Flow (5 minutes)

**Instructor traces a request:**

1. **Request arrives:** `POST /api/auth/login` with `{"username": "alice", "password": "secret"}`
2. **Schema validates:** Pydantic checks `UserLogin` schema
3. **Route executes:** Function runs
4. **Model queries:** SQLAlchemy queries `User` table
5. **Business logic:** Check password, create token
6. **Schema formats:** Pydantic formats `Token` response
7. **Response sent:** JSON returned to client

**Key Point:** "Each layer does one job. This separation makes code maintainable."

**Transition:** "Now let's explore the codebase yourself..."



### Part 3: Code Scavenger Hunt (20 minutes)

#### Setup (2 minutes)

**Instructor provides worksheet:**

```markdown
# Backend Code Scavenger Hunt

## Task 1: Find a Model
- Find the User model
- What table does it map to?
- What columns does it have?
- What relationships does it have?

## Task 2: Find a Schema
- Find a schema that validates input
- What fields does it validate?
- Find a schema that formats output
- What fields does it include/exclude?

## Task 3: Find a Route
- Find a GET endpoint
- What does it return?
- Find a POST endpoint
- What does it accept?
- Find a route that uses a relationship
- How does it query related data?

## Task 4: Trace a Request
- Pick an endpoint (not login)
- Trace it: Route → Schema → Model → Database
- What happens at each step?
```

#### Team Activity (15 minutes)

**Instructions:**
1. **Work in teams** (use pair programming if helpful)
2. **Explore the codebase** - look at different files
3. **Fill out the worksheet** - be specific
4. **Ask questions** - if something is confusing, ask!

**Instructor circulates:**
- Help teams find files
- Answer questions
- Point out interesting patterns
- Ensure everyone is participating

#### Share Findings (3 minutes)

**Ask 2-3 teams to share:**
- One interesting thing they found
- One thing that was confusing
- One question they have

**Instructor:** Address common confusions, answer questions

**Transition:** "Now let's practice writing behavior contracts..."



### Part 4: Behavior Contract Activity (30 minutes)

#### What is a Behavior Contract? (5 minutes)

**Instructor explains:**
- A behavior contract describes what an endpoint does in plain language
- It's not code - it's documentation
- It helps you understand before you implement
- It's useful for testing (tests verify the contract)

**Show example:**

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

#### Practice: Write Contracts (20 minutes)

**Instructions:**
1. **Pick an endpoint** (not login - choose a different one)
2. **Read the code** carefully
3. **Write a behavior contract** using the template
4. **Be specific** - what exactly happens?

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

**Endpoints to choose from:**
- `GET /api/users/me` - Get current user
- `GET /api/groups` - List groups
- `POST /api/groups` - Create group
- `GET /api/courses` - List courses
- (or any other endpoint)

**Instructor circulates:**
- Help teams understand the code
- Ensure contracts are specific
- Check that behavior is accurately described

#### Share Contracts (5 minutes)

**Ask 2-3 teams to share:**
- Their endpoint
- Their behavior contract
- What was hard about writing it?

**Instructor:** 
- Validate contracts (are they accurate?)
- Point out good practices
- Address common issues

**Key Point:** "Writing contracts helps you understand code. You'll do this before writing tests."

**Transition:** "This leads us to homework - you'll write tests based on behavior contracts..."



### Part 5: Q&A & Wrap-up (10 minutes)

#### Questions (7 minutes)
- Open floor for questions
- Address common confusions:
  - "What's the difference between models and schemas?" → Models = database, Schemas = API
  - "Why do we need both?" → Separation of concerns
  - "How do relationships work?" → SQLAlchemy handles joins

#### Preview Homework (2 minutes)
- **HW1:** Write backend tests for existing endpoints
- **Due:** Next Tuesday (Jan 27)
- **Process:** 
  1. Pick an endpoint
  2. Write behavior contract (like today)
  3. Write tests that verify the contract
  4. Review another team's tests
  5. Reflect on what you learned

#### Wrap-up (1 minute)
- Remind students to:
  - Read pytest documentation (due Thursday)
  - Start thinking about which endpoint to test
  - Come ready to write tests on Thursday



## Materials Needed

- Codebase open and navigable
- Whiteboard or slides for diagrams
- Scavenger hunt worksheet (handout or digital)
- Behavior contract template (handout or digital)
- List of endpoints students can choose from

## Instructor Notes

### Common Confusions

**"Models vs Schemas - why both?"**
- Models = database structure (what's stored)
- Schemas = API contract (what's sent/received)
- They serve different purposes
- Analogy: Models = database schema, Schemas = API documentation

**"What's dependency injection?"**
- `db: Session = Depends(get_db)` - FastAPI provides the database session
- We'll learn more about this, but for now: it's how we get database access
- Don't worry about understanding it fully yet

**"How do relationships work?"**
- SQLAlchemy handles the SQL joins
- `user.role` automatically queries the related Role
- We'll learn more in Week 3

### Time Management

- **If running short:** Add more code exploration time
- **If running long:** Move behavior contract to homework, focus on understanding models/schemas/routes

### Differentiation

- **For advanced students:** Have them trace more complex endpoints, explain relationships
- **For struggling students:** Focus on one simple endpoint, provide more scaffolding



## Student Deliverables

- Scavenger hunt worksheet completed
- Behavior contract written (can be part of HW1)

## Next Steps

- **Before Thursday:** Read pytest documentation
- **Thursday:** Pytest workshop - learn to write tests
- **Homework:** HW1 due next Tuesday

