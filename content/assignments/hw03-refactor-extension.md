---
title: "Refactor/Extension"
type: "homework"
num: "3"
draft: 1
assigned_date: "2026-02-05"
due_date: "2026-02-10"
heading_max_level: 3
---

> ## Overview
> 
> This assignment has three parts:
> 1. **Refactor or Extend Existing Code** - Your team refactors code to improve design OR extends an existing feature
> 2. **Peer Review** - You review another team's refactor/extension PR (design focus)
> 3. **Individual Reflection** - Reflect on what refactoring taught you about code quality
> 
> This assignment builds on design principles and refactoring practice from class. You'll improve code quality using tests as guardrails.

## 1. Refactor or Extend Existing Code (70 points)

Your team will either:
- **Option A:** Refactor existing code to improve design (extract functions, reduce duplication, improve cohesion)
- **Option B:** Extend an existing feature (add new endpoints, enhance functionality)

Both options require tests as guardrails.

### Option A: Refactor Existing Code

#### 1.1. Identify Code Smell

**Find code that could be improved:**
- Long functions (> 20 lines)
- Repeated code (DRY violations)
- Low cohesion (functions do multiple things)
- Unclear names or structure

**Document the issue:**
- What file/function has the issue?
- What design principle does it violate?
- How does it impact maintainability?

**Examples from the backend:**
- `backend/routes/groups.py`: Extract group name validation (lines 259-264, 323-328)
- `backend/routes/groups.py`: Member count calculation is repeated (lines 118-121, 184-187, 292-299, 341-344)
- `backend/routes/courses.py`: Module count calculation (currently hardcoded to 0)
- `backend/routes/groups.py`: Long functions like `get_all_groups()` (lines 89-133) could be split

**Submission:** Include description of the code smell in your PR description.

#### 1.2. Write/Update Tests

**Ensure tests exist and cover the behavior:**
- If tests exist: Review them, ensure they cover the behavior
- If tests don't exist: Write tests for the current behavior

**Test requirements:**
- Success cases: Valid input, correct response
- Failure cases: Invalid input, errors
- Edge cases: Boundary conditions

**Run tests to establish baseline:**
```bash
docker exec -it tma_backend poetry run pytest tests/ -v
```
- All tests should pass
- This is your baseline (tests verify behavior doesn't change)

**Requirements:**
- Tests exist and pass before refactoring
- Tests cover the behavior you're refactoring

#### 1.3. Refactor the Code

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

**Requirements:**
- Code is improved (better cohesion, less duplication, smaller functions)
- Behavior is unchanged (tests still pass)
- Code is clearer and more maintainable

#### 1.4. Verify Refactor

**Ensure refactoring improved code quality:**
- Run all tests: All should pass
- Check code quality: Are functions smaller? Is duplication reduced? Is code clearer?
- Document improvements: What changed? Why did it improve the code?

**Requirements:**
- All tests pass
- Code quality is improved
- Improvements are documented

### Option B: Extend Existing Feature

#### 1.1. Choose Feature to Extend

**Select an existing feature to enhance:**
- What feature will you extend?
- What new functionality will you add?
- Why is this extension valuable?

**Recommended extensions (aligned with backend):**

1. **Add Modules to Courses** (Recommended)
   - Implement the Module model and endpoints
   - Update `GET /api/courses/{id}` to return actual modules (currently returns empty array at line 108)
   - Update `GET /api/courses` to return actual module_count (currently hardcoded to 0 at lines 74, 144, 195)

2. **Implement File Upload for Courses** (Advanced)
   - Add file upload endpoints to courses
   - Store files in `backend/uploads/` directory
   - See `backend/routes/courses.py` lines 21, 65, 125, 184, 221

3. **Add Progress Tracking to Groups** (Recommended)
   - Implement progress tracking endpoints for groups
   - See `backend/routes/groups.py` line 571

4. **Add Filtering/Sorting:**
   - Add query parameters to `GET /api/groups` (filter by name, sort by date)
   - Add query parameters to `GET /api/courses` (filter by group, sort by title)

5. **Add Pagination:**
   - Add pagination to `GET /api/groups` and `GET /api/courses`

**Submission:** Include description of the extension in your PR description.

#### 1.2. Write Tests First

**Write tests for the new functionality:**
- Test the behavior you want
- Tests will fail initially (that's expected)
- Tests guide your implementation

**Test requirements:**
- Success cases: New functionality works
- Failure cases: Errors handled correctly
- Edge cases: Boundary conditions

**Requirements:**
- Tests written before implementation (TDD approach)
- Tests cover new functionality

#### 1.3. Implement Extension

**Implement the new functionality:**
- Update models/schemas if needed
- Add new endpoints or enhance existing ones
- Ensure backward compatibility
- Run tests frequently

**Requirements:**
- New functionality works correctly
- Existing functionality still works (backward compatible)
- All tests pass

#### 1.4. Verify Extension

**Ensure extension works and doesn't break existing code:**
- Run all tests: All should pass
- New tests verify new functionality
- Existing tests verify nothing broke

**Requirements:**
- All tests pass
- New functionality works
- Existing functionality unchanged

### 1.5. Create a Pull Request

**Before you create your PR:**
1. Run the linter and formatter (see [cheatsheet](/spring2026/resources/howto-02-cheatsheet#3-backend-commands-python))
1. Ensure that all tests pass
1. Note your commit history - every commit should be intentional

**PR Requirements:**
1. Create PR on GitHub with a reasonable title
1. The description must include:
   - **For Refactoring:** Code smell identified, changes made, design principles applied, how tests helped
   - **For Extension:** Feature extended, changes made, what you tested, backward compatibility
1. Don't forget to assign someone from your team to review the PR

## 2. Peer Review (20 points)

Review **one PR from another team** (not your own). Provide feedback on:

1. **Design**: Did the refactoring improve code quality? Is the extension well-designed?
2. **Tests**: Do tests cover the changes? Are they clear and independent?

Comment on the PR with specific, constructive feedback. Approve if the PR is good, request changes only if broken. Everyone should review at least one PR.

## 3. Individual Reflection (10 points)

Write a brief reflection under a heading with today's date in your Google Doc (`LastName_FirstName_373`). Briefly answer the following questions (300-400 words total):

1. **What did you learn?** - About refactoring/extending code and code quality
1. **What was challenging?** - What was hard or confusing?
1. **What makes code maintainable?** - Based on your experience

When you're done, copy your reflection and paste it into the <a href="https://forms.gle/m6Myw4Lxc2We3WNCA" target="_blank">Weekly Reflection Form</a>.

## Submission Checklist

**Team Requirements:**
- [ ] Code smell identified or extension planned
- [ ] Tests written/updated
- [ ] Code refactored/extended
- [ ] All tests pass
- [ ] PR description includes design decisions
- [ ] Code quality improved (for refactoring)

**Individual Submission:**
- [ ] You completed your part and submitted a PR
- [ ] You have reviewed at least one other team's PR
- [ ] You have pasted your reflection into the [Weekly Reflection Form](https://forms.gle/m6Myw4Lxc2We3WNCA)
