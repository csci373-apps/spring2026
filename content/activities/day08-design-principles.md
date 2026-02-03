---
title: "Design Principles"
start_date: "2026-02-05"
type: "activity"
draft: 1
heading_max_level: 3
---


## 1. What Makes Code "Good"?

**Instructor asks:** "What makes code 'good'? What makes code 'bad'?"

**Common answers:**
- Good: Clear, tested, maintainable, works
- Bad: Confusing, buggy, hard to change, doesn't work

**Instructor explains:**
- There are principles that help us write good code
- These principles are guidelines, not rules
- They help us make decisions when coding
- We'll learn four key principles today

**Key Point:** "Good code is code that's easy to understand and easy to change."

### Principle 1: Cohesion

**Instructor explains:**
- **Cohesion:** How well do the parts of a module/class/function work together?
- **High cohesion:** All parts work toward one goal
- **Low cohesion:** Parts do unrelated things

**Show example from codebase:**

```python
# Low cohesion: Does too many things
class UserService:
    def create_user(self, username, email, password):
        # Create user logic
        pass
    
    def send_email(self, to, subject, body):
        # Email logic (unrelated to user creation)
        pass
    
    def calculate_statistics(self):
        # Statistics logic (unrelated to user creation)
        pass

# High cohesion: Does one thing well
class UserService:
    def create_user(self, username, email, password):
        # Create user logic
        pass
    
    def update_user(self, user_id, data):
        # Update user logic
        pass
    
    def delete_user(self, user_id):
        # Delete user logic
        pass
```

**Key Point:** "High cohesion means each class/function has one clear responsibility."

### Principle 2: Coupling

**Instructor explains:**
- **Coupling:** How much does one module depend on another?
- **Low coupling:** Modules are independent
- **High coupling:** Modules are tightly connected

**Show example:**

```python
# High coupling: Directly depends on database
class UserService:
    def get_user(self, user_id):
        db = get_db()
        return db.query(User).filter(User.id == user_id).first()

# Low coupling: Depends on abstraction
class UserService:
    def __init__(self, user_repository):
        self.user_repository = user_repository
    
    def get_user(self, user_id):
        return self.user_repository.find_by_id(user_id)
```

**Key Point:** "Low coupling means changes in one module don't break others."

### Principle 3: DRY (Don't Repeat Yourself)

**Instructor explains:**
- **DRY:** Don't repeat code
- **Why:** Repeated code is hard to maintain
- **When:** Extract common code into functions/classes

**Show example:**

```python
# Not DRY: Repeated code
def create_group(name, description):
    # Validation logic
    if not name or len(name) > 100:
        raise ValueError("Invalid name")
    if description and len(description) > 1000:
        raise ValueError("Invalid description")
    # Create logic
    group = Group(name=name, description=description)
    db.add(group)
    db.commit()
    return group

def create_course(title, description):
    # Validation logic (repeated!)
    if not title or len(title) > 200:
        raise ValueError("Invalid title")
    if description and len(description) > 1000:
        raise ValueError("Invalid description")
    # Create logic
    course = Course(title=title, description=description)
    db.add(course)
    db.commit()
    return course

# DRY: Extract common code
def validate_text_field(value, field_name, max_length):
    if not value or len(value) > max_length:
        raise ValueError(f"Invalid {field_name}")

def create_group(name, description):
    validate_text_field(name, "name", 100)
    validate_text_field(description, "description", 1000)
    group = Group(name=name, description=description)
    db.add(group)
    db.commit()
    return group
```

**Key Point:** "DRY means extract common code, but don't over-abstract."

### Principle 4: Size

**Instructor explains:**
- **Size:** How long are functions/classes?
- **Small is better:** Easier to understand, test, and maintain
- **Rule of thumb:** Functions < 20 lines, classes < 200 lines

**Show example:**

```python
# Too long: Hard to understand
def process_user_registration(username, email, password, profile_data):
    # 50 lines of validation
    # 30 lines of database operations
    # 20 lines of email sending
    # 15 lines of logging
    # Total: 115 lines!

# Better: Break into smaller functions
def validate_registration_data(username, email, password):
    # 10 lines
    pass

def create_user_account(username, email, password):
    # 15 lines
    pass

def send_welcome_email(email):
    # 10 lines
    pass

def process_user_registration(username, email, password, profile_data):
    validate_registration_data(username, email, password)
    user = create_user_account(username, email, password)
    send_welcome_email(email)
    return user
```

**Key Point:** "Small functions are easier to understand, test, and maintain."

> **Summary**
> 
> - **Cohesion:** One responsibility per class/function
> - **Coupling:** Minimize dependencies
> - **DRY:** Don't repeat code
> - **Size:** Keep functions and classes small
> 
> **These principles help us write maintainable code.**


## 2. "Code Smell" Hunt

### What is a Code Smell?

- **Code smell:** Code that works but has design issues
- **Not a bug:** The code works, but it's hard to maintain
- **Examples:** Long functions, repeated code, unclear names

**Key Point:** "Code smells" are warning signs. They suggest the code could be better.

### Hunt for Code Smells

```markdown
# Code Smell Checklist

## Cohesion Issues
- Function/class does multiple unrelated things
- Function/class is hard to name (suggests low cohesion)

## Coupling Issues
- Function directly accesses database (instead of using repository)
- Function depends on many other modules
- Changes in one place break other places

## DRY Issues
- Same code appears in multiple places
- Similar logic with slight variations
- Copy-paste code

## Size Issues
- Function is > 20 lines
- Class is > 200 lines
- Function has many parameters (> 5)

## Other Issues
- Unclear variable/function names
- Magic numbers (use constants)
- Deeply nested if statements
- Comments explaining what code does (code should be self-explanatory)
```

**Instructions:**
1. **Work in teams**
2. **Explore the codebase** (routes, models, schemas)
3. **Find code smells** using the checklist
4. **Document them:**
   - What file/function?
   - What's the issue?
   - What principle does it violate?
   - How could it be improved?

**Example:**

```markdown
## Code Smell Found

**File:** `backend/routes/groups.py`
**Function:** `create_group`
**Issue:** Function is 45 lines long (violates size principle)
**Suggestion:** Break into smaller functions:
- `validate_group_data()`
- `create_group_in_db()`
- `send_notification()`
```

**Instructor circulates:**
- Help teams find code smells
- Ensure they understand the principles
- Guide them to specific files if needed

#### Share Findings
**Ask 2-3 teams to share:**
- One code smell they found
- What principle it violates
- How they would fix it

**Instructor:** Validate findings, discuss improvements

**Key Point:** "Finding code smells helps us identify what to refactor."

**Transition:** "Now let's plan how to refactor safely..."


## 3. Refactoring Planning

### How to Refactor Safely

**Instructor explains the process:**

1. **Write tests first** (if they don't exist)
   - Tests verify the behavior
   - Tests act as guardrails during refactoring

2. **Make small changes**
   - Refactor one thing at a time
   - Run tests after each change
   - If tests break, fix them before continuing

3. **Keep behavior the same**
   - Refactoring changes structure, not behavior
   - Tests should still pass
   - If behavior changes, that's a feature change, not a refactor

**Show example:**

```python
# Before refactoring: Long function
def create_group(name, description, user_id):
    # 30 lines of code
    pass

# Step 1: Write tests
def test_create_group_success():
    # Test the behavior
    pass

# Step 2: Refactor (extract function)
def validate_group_data(name, description):
    # Extract validation
    pass

def create_group(name, description, user_id):
    validate_group_data(name, description)
    # Rest of logic
    pass

# Step 3: Run tests (should still pass)
```

**Key Point:** "Tests let us refactor safely. They verify behavior doesn't change."

### Plan a Refactor

**Instructor asks teams to:**
1. **Pick one code smell** from their hunt
2. **Plan the refactor:**
   - What will change?
   - What tests are needed?
   - What's the order of changes?

**Template:**

```markdown
## Refactoring Plan

### Current Code
- File: `backend/routes/groups.py`
- Function: `create_group` (45 lines)
- Issue: Too long, does multiple things

### Refactoring Steps
1. Write tests for current behavior (if missing)
2. Extract validation logic → `validate_group_data()`
3. Extract database logic → `create_group_in_db()`
4. Update `create_group()` to call new functions
5. Run tests (should still pass)
6. Verify behavior unchanged

### Tests Needed
- Test success case
- Test validation failures
- Test database errors
```



### Share Plans

**Ask 1-2 teams to share:**
- Their refactoring plan
- What tests they'll write
- What questions they have

**Instructor:** Validate plans, address questions

**Key Point:** "Planning helps us refactor safely. Tests are our safety net."

**Transition:** "On Thursday, you'll refactor together..."


## 4. Q&A & Wrap-up

* Questions?
* HW3 Preview

## Common Points of Confusion

**"Cohesion vs Coupling - what's the difference?"**
- Cohesion: How well do parts of a module work together? (internal)
- Coupling: How much does one module depend on another? (external)
- Analogy: Cohesion = team working together, Coupling = teams depending on each other

**"When is code too DRY?"**
- When abstraction makes code harder to understand
- When you're abstracting things that are only used once
- Rule of thumb: Extract if used 3+ times, or if it makes code clearer

**"How do I know if a function is too long?"**
- If you can't understand it in one read, it's probably too long
- If you need comments to explain what it does, it's probably too long
- Rule of thumb: < 20 lines for functions, < 200 lines for classes

