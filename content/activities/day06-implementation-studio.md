---
title: "Implementation Studio"
start_date: "2026-01-29"
type: "activity"
draft: 1
heading_max_level: 3
---

> ## Learning Objectives
>
> By the end of this session, you will:
> - Be able to implement a new model, schema, and route by following existing patterns
> - Understand how to write tests for new features
> - Know how models, schemas, and routes work together
> - Be ready to implement Module CRUD for [HW2](/spring2026/assignments/hw02-new-model-api)

## 1. Review Your Domain Model (5 minutes)

**With your team, quickly review:**
- What fields does your Module model need? (from your [HW2](/spring2026/assignments/hw02-new-model-api) design)
- What endpoints do you need? (list, get one, create, update, delete)

## 2. Discovery: Find the Patterns (20 minutes)

Your task: **Look at existing code and figure out the patterns**, then apply them to Module.

### 2.1. Model Pattern Discovery (5 minutes)

**Look at `backend/models/user.py` and answer:**

1. What imports does it use?
2. What's the class structure? (inherits from `Base`, has `__tablename__`)
3. What types of columns are used? (`Integer`, `String`, `TIMESTAMP`, etc.)
4. How are timestamps handled? (`created_at`, `updated_at`)
5. How are optional fields marked? (`nullable=True`)

**With your team, discuss:**
- What pattern do you see for primary keys?
- What pattern do you see for timestamps?
- How would you adapt this for a Module model?

### 2.2. Schema Pattern Discovery (5 minutes)

**Look at `backend/schemas/auth.py` and answer:**

1. What schemas exist? (UserCreate, UserResponse, UserUpdate, etc.)
2. What's the difference between `UserCreate` and `UserResponse`?
3. How are required vs optional fields marked?
4. What's the `Config` class for in `UserResponse`?

**With your team, discuss:**
- Why do you need separate schemas for create vs response?
- How would you adapt this for Module schemas?

### 2.3. Route Pattern Discovery (10 minutes)

**Look at `backend/routes/users.py` and answer:**

1. What imports are needed?
2. How is the router created? (`APIRouter(prefix=..., tags=...)`)
3. How are endpoints structured? (decorator, function signature, return type)
4. How is the database session used? (`db: AsyncSession = Depends(get_db)`)
5. How is authentication handled? (`current_user: User = Depends(require_admin)`)
6. How are queries written? (`select(User)`, `result.scalars().all()`)
7. How are errors handled? (`HTTPException`)

**With your team, discuss:**
- What's the pattern for GET (list all)?
- What's the pattern for GET (one item)?
- What's the pattern for POST (create)?
- What's the pattern for PATCH (update)?
- What's the pattern for DELETE?

## 3. Teamwork & Organization (5 minutes)

As you work on [HW2](/spring2026/assignments/hw02-new-model-api), here are some tips for staying organized:

### Task Management

1. **Use GitHub Issues** to list all tasks
   - Create an issue for the architectural diagram (domain model design)
   - Create an issue for each endpoint (GET list, GET one, POST, PATCH, DELETE)
   - Create issues for schemas, models, tests
   - Assign issues to team members
   - Close issues when tasks are complete

2. **Break down the work**
   - Model first (one person can do this)
   - Schemas next (can be split or done together)
   - Routes (can split by endpoint)
   - Tests (can split by endpoint)

3. **Coordinate regularly**
   - Check in with your team daily
   - Review each other's code before merging
   - Make sure everyone understands the design decisions

4. **Use pull requests**
   - Create a PR for each feature/endpoint
   - Get at least one teammate review before merging
   - Keep PRs small and focused

**Key Point:** Good organization makes teamwork easier. Use tools (GitHub Issues, PRs) to stay on track.

## 4. Group Work: Implement 1-2 Tasks

Work with your team to begin implementing the a few of the tasks below:

### 4.1. Create the `Module` Model

**Your task:**
1. Create `backend/models/module.py`
2. Follow the pattern from `user.py`
3. Include: `id`, `title`, `description` (optional), `created_at`, `updated_at`
4. Add it to `backend/models/__init__.py`
5. Create a migration: `poetry run alembic revision --autogenerate -m "Add modules table"`

**Questions to discuss:**
- What column types should you use?
- Which fields are required vs optional?
- How do you handle timestamps?

### 4.2. Create the Schemas

**Your task:**
1. Create `backend/schemas/module.py`
2. Create three schemas: `ModuleCreate`, `ModuleUpdate`, `ModuleResponse`
3. Follow the patterns from `auth.py`

**Questions to discuss:**
- What fields go in `ModuleCreate`? (hint: what's needed to create a module?)
- What fields go in `ModuleResponse`? (hint: what should be returned?)
- What fields go in `ModuleUpdate`? (hint: what can be changed?)

### 4.3. Create the Route Stubs

**Your task:**
1. Create `backend/routes/modules.py`
2. Implement 5 endpoints: GET (list), GET (one), POST, PATCH, DELETE
3. Follow the patterns from `users.py`
4. Register the router in `backend/server.py`

**Questions to discuss:**
- How do you query all modules?
- How do you query one module by ID?
- How do you create a new module?
- How do you handle 404 errors?
- What authentication/authorization do you need?

### 4.4. Write One Test (5 minutes)

**Your task:**
1. Create `tests/test_modules.py`
2. Write at least one test (start with GET list or GET one)
3. Follow the pattern from `test_users.py`

**Questions to discuss:**
- What fixtures do you need? (`client`, `auth_headers`)
- How do you test authentication?
- How do you test success cases?
- How do you test error cases?

## 5. Share & Discuss (10 minutes)

- How did you all decide to divide up the work?
- What are some of the things that enable / constrain your abilities to work in parallel?
- How did it go? Any points of confusion / challenges / moments of pride or deep insight?


## 6. Next Steps

- **Today:** You've practiced implementing Module CRUD by discovering patterns
- **[HW2](/spring2026/assignments/hw02-new-model-api):** Implement Module CRUD on your own (or with your team)
- **Reference:** Use existing code as examples - you now know where to look!
- **Questions?** Ask your team or instructor
