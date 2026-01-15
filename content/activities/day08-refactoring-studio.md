---
title: "Refactoring Studio"
start_date: "2026-02-05"
type: "activity"
draft: 1
---


## Learning Objectives

By the end of this session, students will:
- Be able to refactor code safely using tests as guardrails
- Understand how to give design-focused code review feedback
- Practice pair programming for refactoring
- Reflect on what refactoring teaches us about code quality


## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:10 | Review & Warm-up | Review design principles, address questions |
| 0:10-0:50 | Refactoring Studio | Refactor code together with tests |
| 0:50-1:10 | Design-Focused Review | Practice reviewing refactored code |
| 1:10-1:25 | Team Reflection | What did refactoring teach us? |
| 1:25-1:30 | Wrap-up | Preview homework |


## Detailed Instructions

### Part 1: Review & Warm-up (10 minutes)

#### Check-in (3 minutes)
1. **Welcome back**
2. **Quick check:** "Raise your hand if:"
   - You read the Clean Code sections
   - You identified code smells (from Tuesday)
   - You have questions about design principles

#### Review Design Principles (5 minutes)

**Instructor asks:** "Who found code smells? Share one thing you learned."

**Common insights:**
- "I didn't realize how many code smells exist"
- "Long functions are harder to understand"
- "Repeated code is everywhere"

**Address questions** about design principles

#### Preview Today (2 minutes)
- "Today we're refactoring together"
- "We'll use tests as guardrails"
- "Then we'll practice design-focused review"
- "This is what you'll do for homework"

**Transition:** "Let's start refactoring..."


### Part 2: Refactoring Studio (40 minutes)

#### Choose a Refactor Target (5 minutes)

**Instructor provides options (or use code smells from Tuesday):**

**Option 1: Extract Validation Logic**
- File: `backend/routes/groups.py`
- Function: `create_group` (long, does validation + creation)
- Refactor: Extract `validate_group_data()` function

**Option 2: Extract Database Logic**
- File: `backend/routes/courses.py`
- Function: `get_course` (mixes route logic with database queries)
- Refactor: Extract `get_course_by_id()` helper function

**Option 3: Reduce Duplication**
- Files: Multiple route files
- Issue: Similar error handling repeated
- Refactor: Extract `handle_not_found()` helper

**Instructor:** Let class vote or assign one to all teams

**For this guide, we'll use Option 1: Extract Validation Logic**

#### Step 1: Write/Review Tests (10 minutes)

**Instructor guides teams:**

1. **Check if tests exist:**
   ```bash
   cd backend
   poetry run pytest tests/test_groups.py -v
   ```

2. **If tests exist, review them:**
   - Do they test the current behavior?
   - Do they cover success and failure cases?
   - Will they catch if we break something?

3. **If tests don't exist, write them:**
   ```python
   def test_create_group_success(client, auth_headers, test_user):
       response = client.post(
           "/api/groups",
           json={"name": "Test Group", "description": "Test"},
           headers=auth_headers
       )
       assert response.status_code == 201
       assert response.json()["name"] == "Test Group"

   def test_create_group_invalid_name(client, auth_headers):
       response = client.post(
           "/api/groups",
           json={"name": "", "description": "Test"},
           headers=auth_headers
       )
       assert response.status_code == 422
   ```

4. **Run tests to ensure they pass:**
   ```bash
   poetry run pytest tests/test_groups.py -v
   ```

**Instructor circulates:**
- Help teams write/review tests
- Ensure tests cover the behavior
- Verify tests pass

**Key Point:** "Tests are our safety net. They verify behavior doesn't change during refactoring."

#### Step 2: Refactor (20 minutes)

**Instructor guides teams through refactoring:**

1. **Identify what to extract:**
   - Look at the function
   - Find a logical chunk (e.g., validation)
   - Extract it to a new function

2. **Extract the function:**
   ```python
   # Before: Long function with validation mixed in
   @router.post("", response_model=GroupResponse)
   async def create_group(
       group_data: GroupCreate,
       db: Session = Depends(get_db),
       current_user: User = Depends(get_current_user),
   ):
       # Validation (10 lines)
       if not group_data.name or len(group_data.name) > 100:
           raise HTTPException(status_code=422, detail="Invalid name")
       if group_data.description and len(group_data.description) > 1000:
           raise HTTPException(status_code=422, detail="Invalid description")
       
       # Creation logic (15 lines)
       group = Group(name=group_data.name, description=group_data.description)
       group.created_by = current_user.id
       db.add(group)
       db.commit()
       db.refresh(group)
       return group

   # After: Extracted validation
   def validate_group_data(group_data: GroupCreate):
       """Validate group creation data"""
       if not group_data.name or len(group_data.name) > 100:
           raise HTTPException(status_code=422, detail="Invalid name")
       if group_data.description and len(group_data.description) > 1000:
           raise HTTPException(status_code=422, detail="Invalid description")

   @router.post("", response_model=GroupResponse)
   async def create_group(
       group_data: GroupCreate,
       db: Session = Depends(get_db),
       current_user: User = Depends(get_current_user),
   ):
       validate_group_data(group_data)  # Call extracted function
       
       # Creation logic (now cleaner)
       group = Group(name=group_data.name, description=group_data.description)
       group.created_by = current_user.id
       db.add(group)
       db.commit()
       db.refresh(group)
       return group
   ```

3. **Run tests after each change:**
   ```bash
   poetry run pytest tests/test_groups.py -v
   ```
   - If tests pass: Good! Continue
   - If tests fail: Fix the issue before continuing

4. **Verify behavior unchanged:**
   - Tests should still pass
   - Functionality should be the same
   - Only structure changed

**Instructor circulates:**
- Help teams extract functions
- Ensure they run tests frequently
- Verify behavior doesn't change

**Key Point:** "Refactoring changes structure, not behavior. Tests verify this."

#### Step 3: Verify Refactor (5 minutes)

**Instructor asks teams to:**
1. **Run all tests:**
   ```bash
   poetry run pytest tests/ -v
   ```

2. **Check code quality:**
   - Is the code clearer?
   - Are functions smaller?
   - Is duplication reduced?

3. **Document what changed:**
   - What did you refactor?
   - Why did you refactor it?
   - What improved?

**Instructor:** Help teams verify, address issues

**Key Point:** "Refactoring should make code better, not just different."

**Transition:** "Now let's practice reviewing refactored code..."


### Part 3: Design-Focused Review (20 minutes)

#### Review Focus: Design (5 minutes)

**Instructor explains design-focused review:**

**Focus areas:**
1. **Cohesion:** Does each function/class have one responsibility?
2. **Coupling:** Are dependencies minimized?
3. **DRY:** Is code duplicated unnecessarily?
4. **Size:** Are functions/classes appropriately sized?
5. **Clarity:** Is the code easy to understand?

**What to look for:**
- ✅ Good: Clear responsibilities, small functions, no duplication
- ❌ Issues: Mixed responsibilities, long functions, repeated code

**Key Point:** "Design review focuses on maintainability, not just correctness."

#### Practice Review (10 minutes)

**Instructor shows example refactored code (on screen or handout):**

```python
# Example: Refactored code (intentionally has issues)
def validate_group_data(group_data):
    if not group_data.name:
        raise HTTPException(status_code=422, detail="Invalid name")
    if len(group_data.name) > 100:
        raise HTTPException(status_code=422, detail="Invalid name")
    if group_data.description and len(group_data.description) > 1000:
        raise HTTPException(status_code=422, detail="Invalid description")

@router.post("", response_model=GroupResponse)
async def create_group(group_data, db, current_user):
    validate_group_data(group_data)
    group = Group(name=group_data.name, description=group_data.description)
    group.created_by = current_user.id
    db.add(group)
    db.commit()
    db.refresh(group)
    return group
```

**Instructor asks teams to review:**
- What's good about this refactor?
- What could be improved?
- What design feedback would you give?

**Teams discuss (3 minutes)**

**Instructor leads discussion:**
- **Good:** Validation extracted, function is shorter
- **Issues:**
  - Validation messages are duplicated ("Invalid name" appears twice)
  - Could extract more (database logic)
  - Function names could be clearer
- **Better version:** Show improved code

**Show another example:**

```python
# Example: Over-refactored (intentionally has issues)
def check_name_exists(name):
    return name is not None

def check_name_length(name):
    return len(name) <= 100

def validate_group_name(name):
    if not check_name_exists(name):
        raise HTTPException(status_code=422, detail="Invalid name")
    if not check_name_length(name):
        raise HTTPException(status_code=422, detail="Invalid name")
```

**Instructor asks teams to review:**
- Is this better or worse?
- What's the issue?

**Teams discuss (3 minutes)**

**Instructor leads discussion:**
- **Issue:** Over-abstracted - too many small functions
- **Better:** Keep validation together, don't split unnecessarily
- **Key Point:** "Refactoring should improve code, not make it more complex"

**Key Point:** "Good design review balances improvement with simplicity."

#### Review Practice (5 minutes)

**Instructor asks teams to:**
1. **Review a teammate's refactor** (from today)
2. **Give design-focused feedback:**
   - Cohesion: Are responsibilities clear?
   - Coupling: Are dependencies minimal?
   - DRY: Is code duplicated?
   - Size: Are functions appropriately sized?
   - Clarity: Is it easy to understand?

3. **Be specific:**
   - "This function could be split into two" (not "this is too long")
   - "This validation logic is duplicated" (not "needs refactoring")

**Instructor circulates:**
- Help teams give feedback
- Ensure feedback is design-focused
- Model good review practices

**Transition:** "Let's reflect on what we learned..."


### Part 4: Team Reflection (15 minutes)

#### Reflection Activity (12 minutes)

**Instructor asks teams to discuss:**

1. **What did we do today?**
   - Refactored code
   - Used tests as guardrails
   - Practiced design-focused review

2. **What did we learn?**
   - About refactoring?
   - About design?
   - About code quality?

3. **What was hard?**
   - What took longer than expected?
   - What was confusing?
   - What questions do we have?

4. **What did refactoring teach us?**
   - About the code?
   - About design principles?
   - About testing?

5. **What makes code maintainable?**
   - Clear?
   - Tested?
   - Well-designed?
   - Small functions?

**Instructor asks 2-3 teams to share:**
- One thing they learned
- One thing that was hard
- One question they have

**Common insights:**
- "Refactoring is easier with tests"
- "Small functions are easier to understand"
- "Design review helps catch issues"
- "It's hard to know when to stop refactoring"

**Key Point:** "Refactoring teaches us about code quality. We'll keep practicing this."

#### Preview Homework (3 minutes)

**HW3: Refactor/Extension PR + Tests + Peer Review + Reflection**
- **Due:** Next Tuesday (Feb 10)
- **Requirements:**
  1. Identify code smell (or extend existing feature)
  2. Write/update tests
  3. Refactor (or extend)
  4. Verify tests pass
  5. Create PR
  6. Review another team's refactor PR (design focus)
  7. Individual reflection on what refactoring taught you

- **Process:**
  1. Find code smell (or choose feature to extend)
  2. Write/update tests (if needed)
  3. Refactor (or extend)
  4. Run tests frequently
  5. Create PR with clear description
  6. Review another team's PR (focus on design)
  7. Reflect on refactoring experience


### Part 5: Wrap-up (5 minutes)

#### Reminders (3 minutes)
- Tests let us refactor safely
- Design principles guide our decisions
- Code review helps us learn
- Reflection helps us improve

#### Questions (2 minutes)
- Open floor for questions
- Address common concerns


## Materials Needed

- Codebase open and navigable
- Example refactored code for review practice
- Design review checklist (handout or digital)
- Computer for each student/pair

## Instructor Notes

### Common Issues

**Issue: Teams refactor too much at once**  
Solution: Encourage small, incremental changes, run tests after each change

**Issue: Tests break during refactoring**  
Solution: Fix tests before continuing, ensure behavior doesn't change

**Issue: Design review is vague**  
Solution: Provide specific focus areas, model good feedback

### Time Management

- **If running short:** Focus on one simple refactor, skip review practice
- **If running long:** Move some refactoring to homework, focus on review practice

### Differentiation

- **For advanced students:** Have them do more complex refactors, review more thoroughly
- **For struggling students:** Provide simpler refactor targets, more scaffolding


## Student Deliverables

- Code refactored (can be part of HW3)
- Tests updated/verified (can be part of HW3)
- Design review practice completed
- Team reflection completed

## Next Steps

- **Before Tuesday:** Complete HW3
- **Tuesday:** Frontend architecture and React
- **Reading:** React "Thinking in React" documentation (due Tuesday)

