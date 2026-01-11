---
title: "Design Principles"
start_date: "2026-02-03"
type: "activity"
---


## Learning Objectives

By the end of this session, students will:
- Understand design principles: cohesion, coupling, DRY, size
- Be able to identify code smells in existing code
- Understand how to refactor safely using tests
- Be able to plan a refactoring with tests as guardrails
- Reflect on what they learned from HW2 (design decisions and code reviews)


## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:15 | Reflection on HW2 | Review design decisions and code reviews |
| 0:15-0:40 | Design Principles Lecture | Cohesion, coupling, DRY, size |
| 0:40-1:05 | Code Smell Hunt | Identify issues in starter code |
| 1:05-1:20 | Refactoring Planning | Plan refactor with tests |
| 1:20-1:30 | Q&A & Wrap-up | Questions, preview homework |


## Detailed Instructions

### Part 1: Reflection on HW2 (15 minutes)

#### Check-in (3 minutes)
1. **Welcome back**
2. **Quick check:** "Raise your hand if:"
   - You completed HW2 (model + API + tests)
   - You received feedback on your PR
   - You have questions about design decisions

#### Reflection Activity: Design Decisions (7 minutes)

**Instructor asks teams to discuss:**

1. **What design decisions did you make?**
   - What model did you create?
   - What relationships did you choose?
   - Why did you choose that design?

2. **What tradeoffs did you consider?**
   - Simple vs flexible?
   - Performance vs maintainability?
   - What alternatives did you consider?

3. **What would you do differently?**
   - If you could redesign, what would change?
   - What did you learn from the review process?
   - What questions do you still have?

**Instructor asks 2-3 teams to share:**
- One design decision they made
- One tradeoff they considered
- One thing they learned

**Common insights to highlight:**
- "I didn't realize how many decisions go into design"
- "Review feedback helped me see alternatives"
- "Simple designs are often better"
- "Tests helped clarify requirements"

**Key Point:** "Design is about tradeoffs. There's rarely one right answer."

#### Reflection Activity: Code Reviews (5 minutes)

**Instructor asks teams to discuss:**

1. **What feedback did you receive?**
   - Was it helpful?
   - Did it change your design?
   - What did you learn from it?

2. **What feedback did you give?**
   - Did you focus on design?
   - Did you focus on testing?
   - Was your feedback constructive?

3. **How has your review process improved?**
   - Are you more specific?
   - Do you focus on behavior and design?
   - What would you do differently?

**Instructor:** Highlight good review practices, address common issues

**Key Point:** "Code review is a skill. You're getting better at it."

**Transition:** "Now let's learn about design principles..."


### Part 2: Design Principles Lecture (25 minutes)

#### What Makes Code "Good"? (3 minutes)

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

#### Principle 1: Cohesion (5 minutes)

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

#### Principle 2: Coupling (5 minutes)

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

#### Principle 3: DRY (Don't Repeat Yourself) (5 minutes)

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

#### Principle 4: Size (5 minutes)

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

#### Putting It Together (2 minutes)

**Instructor summarizes:**
- **Cohesion:** One responsibility per class/function
- **Coupling:** Minimize dependencies
- **DRY:** Don't repeat code
- **Size:** Keep functions and classes small

**These principles help us write maintainable code.**

**Transition:** "Now let's find code smells in the starter code..."


### Part 3: Code Smell Hunt (25 minutes)

#### What is a Code Smell? (3 minutes)

**Instructor explains:**
- **Code smell:** Code that works but has design issues
- **Not a bug:** The code works, but it's hard to maintain
- **Examples:** Long functions, repeated code, unclear names

**Key Point:** "Code smells are warning signs. They suggest the code could be better."

#### Hunt for Code Smells (20 minutes)

**Instructor provides checklist:**

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

#### Share Findings (2 minutes)

**Ask 2-3 teams to share:**
- One code smell they found
- What principle it violates
- How they would fix it

**Instructor:** Validate findings, discuss improvements

**Key Point:** "Finding code smells helps us identify what to refactor."

**Transition:** "Now let's plan how to refactor safely..."


### Part 4: Refactoring Planning (15 minutes)

#### How to Refactor Safely (5 minutes)

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

#### Plan a Refactor (10 minutes)

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

**Instructor circulates:**
- Help teams create plans
- Ensure they think about tests
- Check that plans are realistic

#### Share Plans (5 minutes)

**Ask 1-2 teams to share:**
- Their refactoring plan
- What tests they'll write
- What questions they have

**Instructor:** Validate plans, address questions

**Key Point:** "Planning helps us refactor safely. Tests are our safety net."

**Transition:** "On Thursday, you'll refactor together..."


### Part 5: Q&A & Wrap-up (10 minutes)

#### Questions (7 minutes)
- Open floor for questions
- Address common confusions:
  - "Cohesion vs Coupling?" → Cohesion = internal, Coupling = external
  - "When is code too DRY?" → When abstraction makes code harder to understand
  - "How small is too small?" → When functions are so small they're meaningless

#### Preview Homework (2 minutes)
- **HW3:** Refactor existing code or extend API
- **Due:** Next Tuesday (Feb 10)
- **Process:**
  1. Identify code smell (or extend existing feature)
  2. Write/update tests
  3. Refactor (or extend)
  4. Verify tests pass
  5. Create PR
  6. Review another team's refactor PR
  7. Reflect on what refactoring taught you

#### Wrap-up (1 minute)
- Remind students to:
  - Read Clean Code Ch. 2-3 (selected sections)
  - Read "Designing for Change" handout (due Thursday)
  - Come ready to refactor on Thursday


## Materials Needed

- Codebase open and navigable
- Code smell checklist (handout or digital)
- Refactoring plan template (handout or digital)
- Whiteboard for examples

## Instructor Notes

### Common Confusions

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

### Time Management

- **If running short:** Focus on 2-3 principles, skip code smell hunt
- **If running long:** Move refactoring planning to homework, focus on principles

### Differentiation

- **For advanced students:** Have them identify more complex code smells, plan larger refactors
- **For struggling students:** Provide simpler examples, focus on one principle at a time


## Student Deliverables

- Code smells identified (documented)
- Refactoring plan created (can be part of HW3)
- Reflection on HW2 (design decisions and code reviews)

## Next Steps

- **Before Thursday:** Read Clean Code Ch. 2-3, "Designing for Change" handout
- **Thursday:** Refactoring studio - refactor together with tests as guardrails
- **Homework:** HW3 due next Tuesday

