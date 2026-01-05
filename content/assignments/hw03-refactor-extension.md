---
title: "Refactor/Extension"
date: "2026-02-05"
type: "assignment"
num: "3"
draft: 1
due_date: "2026-02-10"
---

## Overview

This assignment has three parts:
1. **Refactor or Extend Existing Code** - Your team refactors code to improve design OR extends an existing feature
2. **Peer Review** - You review another team's refactor/extension PR (design focus)
3. **Individual Reflection** - Reflect on what refactoring taught you about code quality

This assignment builds on design principles and refactoring practice from class. You'll improve code quality using tests as guardrails.


## Part 1: Refactor or Extend Existing Code (60 points)

### Instructions

Your team will either:
- **Option A:** Refactor existing code to improve design (extract functions, reduce duplication, improve cohesion)
- **Option B:** Extend an existing feature (add new endpoints, enhance functionality)

Both options require tests as guardrails.

### Option A: Refactor Existing Code

#### 1. Identify Code Smell (10 points)

**Find code that could be improved:**

1. **Look for design issues:**
   - Long functions (> 20 lines)
   - Repeated code (DRY violations)
   - Low cohesion (functions do multiple things)
   - High coupling (too many dependencies)
   - Unclear names or structure

2. **Document the issue:**
   - What file/function has the issue?
   - What design principle does it violate?
   - How does it impact maintainability?

**Examples:**
- Extract validation logic from route functions
- Reduce duplication between similar routes
- Split long functions into smaller ones
- Improve function/class names for clarity

**Submission:**
Include description of the code smell in your PR description.

#### 2. Write/Update Tests (15 points)

**Ensure tests exist and cover the behavior:**

1. **Check if tests exist:**
   - If tests exist: Review them, ensure they cover the behavior
   - If tests don't exist: Write tests for the current behavior

2. **Test requirements:**
   - Success cases: Valid input, correct response
   - Failure cases: Invalid input, errors
   - Edge cases: Boundary conditions

3. **Run tests to establish baseline:**
   ```bash
   cd backend
   poetry run pytest tests/ -v
   ```
   - All tests should pass
   - This is your baseline (tests verify behavior doesn't change)

**Requirements:**
- Tests exist and pass before refactoring
- Tests cover the behavior you're refactoring
- Tests are clear and well-named

#### 3. Refactor the Code (25 points)

**Improve the code while keeping behavior the same:**

1. **Make small, incremental changes:**
   - Extract one function at a time
   - Run tests after each change
   - If tests break, fix them before continuing

2. **Focus on design principles:**
   - **Cohesion:** Extract functions with single responsibilities
   - **DRY:** Remove duplication
   - **Size:** Break long functions into smaller ones
   - **Clarity:** Improve names and structure

3. **Verify behavior unchanged:**
   - Run tests frequently
   - All tests should still pass
   - Functionality should be identical

**Example refactoring:**

```python
# Before: Long function with mixed responsibilities
@router.post("", response_model=GroupResponse)
async def create_group(group_data: GroupCreate, db: Session, current_user: User):
    # Validation (10 lines)
    if not group_data.name or len(group_data.name) > 100:
        raise HTTPException(status_code=422, detail="Invalid name")
    # ... more validation
    
    # Creation logic (15 lines)
    group = Group(name=group_data.name, ...)
    db.add(group)
    db.commit()
    # ... more logic
    
    return group

# After: Extracted functions (better cohesion, smaller size)
def validate_group_data(group_data: GroupCreate):
    """Validate group creation data"""
    if not group_data.name or len(group_data.name) > 100:
        raise HTTPException(status_code=422, detail="Invalid name")
    # ... validation logic

@router.post("", response_model=GroupResponse)
async def create_group(group_data: GroupCreate, db: Session, current_user: User):
    validate_group_data(group_data)  # Clear separation of concerns
    group = Group(name=group_data.name, ...)
    db.add(group)
    db.commit()
    return group
```

**Requirements:**
- Code is improved (better cohesion, less duplication, smaller functions)
- Behavior is unchanged (tests still pass)
- Code is clearer and more maintainable

#### 4. Verify Refactor (10 points)

**Ensure refactoring improved code quality:**

1. **Run all tests:**
   ```bash
   poetry run pytest tests/ -v
   ```
   - All tests should pass
   - If any fail, fix them

2. **Check code quality:**
   - Are functions smaller?
   - Is duplication reduced?
   - Is code clearer?
   - Are responsibilities separated?

3. **Document improvements:**
   - What changed?
   - Why did it improve the code?
   - What design principles were applied?

**Requirements:**
- All tests pass
- Code quality is improved
- Improvements are documented

### Option B: Extend Existing Feature

#### 1. Choose Feature to Extend (10 points)

**Select an existing feature to enhance:**

1. **Identify the feature:**
   - What feature will you extend?
   - What new functionality will you add?
   - Why is this extension valuable?

2. **Plan the extension:**
   - What endpoints will you add?
   - What models/schemas need changes?
   - What tests are needed?

**Examples:**
- Add filtering/sorting to list endpoints
- Add pagination to list endpoints
- Add new fields to existing models
- Add new endpoints to existing resources

**Submission:**
Include description of the extension in your PR description.

#### 2. Write Tests First (15 points)

**Write tests for the new functionality:**

1. **Write tests before implementation:**
   - Test the behavior you want
   - Tests will fail initially (that's expected)
   - Tests guide your implementation

2. **Test requirements:**
   - Success cases: New functionality works
   - Failure cases: Errors handled correctly
   - Edge cases: Boundary conditions

**Requirements:**
- Tests written before implementation (TDD approach)
- Tests cover new functionality
- Tests are clear and well-named

#### 3. Implement Extension (25 points)

**Implement the new functionality:**

1. **Make changes:**
   - Update models/schemas if needed
   - Add new endpoints or enhance existing ones
   - Ensure backward compatibility

2. **Run tests frequently:**
   ```bash
   poetry run pytest tests/ -v
   ```
   - Tests should pass as you implement
   - Fix issues as they arise

3. **Follow design principles:**
   - Keep functions small and focused
   - Avoid duplication
   - Use clear names

**Requirements:**
- New functionality works correctly
- Existing functionality still works (backward compatible)
- Code follows design principles
- All tests pass

#### 4. Verify Extension (10 points)

**Ensure extension works and doesn't break existing code:**

1. **Run all tests:**
   ```bash
   poetry run pytest tests/ -v
   ```
   - All tests should pass
   - New tests verify new functionality
   - Existing tests verify nothing broke

2. **Test manually (if applicable):**
   - Try the new functionality
   - Verify it works as expected

**Requirements:**
- All tests pass
- New functionality works
- Existing functionality unchanged

### PR Requirements

#### Create Pull Request

1. **Create feature branch:**
   ```bash
   git checkout -b feature/[refactor-or-extension-name]
   ```

2. **Commit your work:**
   ```bash
   git add [files changed]
   git commit -m "Refactor: [description]" # or "Extend: [description]"
   ```

3. **Push and create PR:**
   ```bash
   git push origin feature/[refactor-or-extension-name]
   ```

4. **PR Description Template:**

**For Refactoring:**
```markdown
## Refactor: [What You Refactored]

### Code Smell Identified
- What issue did you find?
- What design principle did it violate?
- How did it impact maintainability?

### Changes Made
- What did you refactor?
- What functions did you extract?
- How did you improve the code?

### Design Principles Applied
- Cohesion: [How did you improve cohesion?]
- DRY: [How did you reduce duplication?]
- Size: [How did you reduce function/class size?]
- Clarity: [How did you improve clarity?]

### Testing
- Did tests exist before refactoring?
- Did you write new tests?
- Do all tests pass?
- How did tests help you refactor safely?

### Verification
- All tests pass: ✅
- Behavior unchanged: ✅
- Code quality improved: ✅
```

**For Extension:**
```markdown
## Extension: [What You Extended]

### Feature Extended
- What feature did you extend?
- What new functionality did you add?
- Why is this extension valuable?

### Changes Made
- What models/schemas changed?
- What endpoints did you add/modify?
- What new functionality exists?

### Testing
- What tests did you write?
- Do all tests pass?
- How did tests guide your implementation?

### Backward Compatibility
- Does existing functionality still work?
- Are existing tests still passing?
```


## Part 2: Peer Review (25 points)

### Instructions

Review **one PR from another team** (focus on design). Provide substantive, constructive feedback.

### Requirements

#### 1. Find a PR to Review (5 points)

**Choose ONE PR from another team:**
- Not your own team's PR
- PR that refactors or extends code
- PR that needs review (not already reviewed by 2+ people)

**How to find PRs:**
- Check team repositories (each team has their own fork)
- Look for PRs with "HW3" in the title
- Ask in class or Slack if you can't find any

#### 2. Review the Design (15 points)

**Focus on design improvements:**

1. **For Refactoring PRs:**
   - Did the refactoring improve code quality?
   - Are functions smaller and more focused?
   - Is duplication reduced?
   - Is code clearer?
   - Are design principles applied correctly?

2. **For Extension PRs:**
   - Is the extension well-designed?
   - Does it follow existing patterns?
   - Is it maintainable?
   - Are responsibilities clear?

**Provide feedback:**
- What's good about the design?
- What could be improved?
- Are there other design issues?
- What questions do you have?

#### 3. Review the Tests (5 points)

**Focus on test quality:**

1. **Test Coverage:**
   - Do tests cover the changes?
   - Are success and failure cases tested?

2. **Test Quality:**
   - Are tests clear?
   - Are they independent?
   - Do they verify behavior?

**Provide feedback:**
- What's good about the tests?
   - What could be improved?

### Review Guidelines

**Be constructive:**
- ✅ "This refactoring improves cohesion by..."
- ✅ "Consider extracting this function to reduce duplication"
- ❌ "This is wrong" (be specific about what and why)
- ❌ "Needs refactoring" (specify what and how)

**Be specific:**
- Point to specific code
- Explain why something is good or could be improved
- Suggest alternatives when appropriate

**Be kind:**
- Remember: everyone is learning
- Focus on the code, not the person
- Ask questions to understand decisions

### Submission

- **Format:** Comments on GitHub PR
- **Location:** Another team's PR
- **Individual submission:** Each team member reviews one PR
- **Team coordination:** Try to ensure all PRs get reviewed (distribute reviews among team members)


## Part 3: Individual Reflection (15 points)

### Instructions

Reflect on your refactoring/extension experience and what you learned about code quality.

### Reflection Questions

**Answer these questions (2-3 paragraphs each):**

1. **Refactoring/Extension Experience:**
   - What did you refactor/extend? Why?
   - What was easy about it?
   - What was hard?
   - What took longer than expected?
   - What questions do you still have?

2. **Design Principles in Practice:**
   - How did you apply design principles? (cohesion, coupling, DRY, size)
   - What principles were most helpful?
   - What principles were hardest to apply?
   - How did design principles guide your decisions?

3. **Testing as Guardrails:**
   - How did tests help you refactor/extend safely?
   - Did you write tests first (TDD) or after?
   - What was hard about writing tests?
   - How did tests change your approach?

4. **Code Review Learning:**
   - What feedback did you receive on your PR?
   - Was the feedback helpful? Why or why not?
   - What did you learn from reviewing another team's PR?
   - How has your understanding of code quality improved?

5. **What Refactoring Taught You:**
   - What did refactoring teach you about code quality?
   - What makes code maintainable?
   - What would you do differently next time?
   - How will you apply this learning going forward?

### Submission

- **Format:** Written reflection (500-750 words total)
- **Location:** Submit via course platform
- **Individual submission:** Each team member submits their own reflection


## Grading Rubric

| Criteria | Points | Description |
|----------|--------|-------------|
| Code Smell/Extension Identified | 10 | Clear issue identified or extension planned |
| Tests Written/Updated | 15 | Comprehensive tests covering behavior |
| Refactoring/Extension Implementation | 25 | Code improved or extended correctly |
| Verification | 10 | All tests pass, code quality improved |
| PR Quality | 5 | Clear PR description, well-documented |
| Review Selection | 5 | Appropriate PR chosen for review |
| Design Review | 15 | Substantive feedback on design improvements |
| Test Review | 5 | Substantive feedback on test quality |
| Reflection Quality | 15 | Thoughtful reflection on refactoring and code quality |
| **Total** | **100** | |


## Submission Checklist

### Team Submission:
- [ ] GitHub PR created with refactoring/extension
  - [ ] Code smell identified or extension planned
  - [ ] Tests written/updated
  - [ ] Code refactored/extended
  - [ ] All tests pass
  - [ ] PR description includes design decisions
  - [ ] Code quality improved (for refactoring)

### Individual Submission:
- [ ] Peer review completed
  - [ ] Reviewed another team's PR (not your own work)
  - [ ] Provided substantive feedback on design
  - [ ] Provided substantive feedback on tests
  - [ ] Approved or requested changes
- [ ] Individual reflection submitted
  - [ ] Answered all reflection questions
  - [ ] 500-750 words total
  - [ ] Thoughtful and specific


## Tips for Success

### Refactoring
- **Start small:** Extract one function at a time
- **Test frequently:** Run tests after each change
- **Keep behavior same:** Refactoring changes structure, not behavior
- **Document improvements:** Explain what changed and why

### Extension
- **Plan first:** What will you add? How will it work?
- **Test first:** Write tests before implementation (TDD)
- **Maintain compatibility:** Don't break existing functionality
- **Follow patterns:** Use existing codebase patterns

### Review
- **Focus on design:** Cohesion, coupling, DRY, size, clarity
- **Be specific:** Point to code, explain why
- **Be constructive:** Help improve, don't just criticize
- **Learn from feedback:** Consider suggestions, ask questions

### Reflection
- **Be honest:** What was hard? What did you learn?
- **Be specific:** Give examples from your experience
- **Think critically:** What would you do differently? Why?


## Common Issues and Solutions

### Issue: Tests break during refactoring
**Solution:** Fix tests before continuing, ensure behavior doesn't change, run tests frequently

### Issue: Don't know what to refactor
**Solution:** Look for long functions, repeated code, unclear names, use code smell checklist

### Issue: Refactoring takes too long
**Solution:** Start smaller, focus on one issue at a time, don't over-refactor

### Issue: Extension breaks existing code
**Solution:** Run all tests frequently, ensure backward compatibility, test existing functionality

### Issue: Review feedback is vague
**Solution:** Be specific, point to code, explain why, suggest alternatives


## Resources

- **Clean Code Ch. 2-3:** (from course readings)
- **Designing for Change:** (from course readings)
- **Pytest Documentation:** https://docs.pytest.org/en/stable/
- **Refactoring Guide:** (from class activities)


## Next Steps

After completing this assignment, you'll:
- Understand how to refactor safely with tests
- Be comfortable applying design principles
- Have practice with design-focused code review
- Be ready for frontend work (Week 5)

Good luck!

