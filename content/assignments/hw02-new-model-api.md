---
title: "New Model + API"
date: "2026-01-29"
type: "assignment"
num: "2"
due_date: "2026-02-03"
---

## Overview

This assignment has three parts:
1. **Design and Implement New Model + API** - Your team designs and implements a new feature
2. **Peer Review** - You review another team's PR (focus on design and testing)
3. **Individual Reflection** - Reflect on design decisions and what you learned

This assignment builds on domain modeling and implementation practice from class. You'll make design decisions, implement them, and learn from code review.


## Part 1: Design and Implement New Model + API + Tests (60 points)

### Instructions

Your team will design and implement a **new model with API endpoints and tests**. This is your chance to make design decisions and see them through to implementation.

### Requirements

#### 1. Design the Model (10 points)

**Before coding, design your model:**

1. **Whiteboard/design the domain model:**
   - What entities do you need?
   - What are the relationships? (One-to-Many, Many-to-Many, One-to-One)
   - What fields does each entity need?
   - What are the tradeoffs?

2. **Document your design decisions:**
   - Why did you choose this design?
   - What alternatives did you consider?
   - What are the tradeoffs?

**Submission:**
Include your design (whiteboard photo, diagram, or written description) in your PR description or as a file in the PR.

**Examples of features you could implement:**
- **Notification System:** Users receive notifications (e.g., "You were added to a group")
- **Comment System:** Users can comment on posts
- **Tag System:** Posts can have tags (many-to-many relationship)
- **Bookmark System:** Users can bookmark posts/courses
- **Activity Feed:** Users see activity from their groups/courses
- **Or propose your own!** (Check with instructor first)

#### 2. Implement the Model (15 points)

**Create the SQLAlchemy model:**

1. **Create model file:** `backend/models/[your_model].py`
   - Use proper SQLAlchemy syntax
   - Include relationships if needed
   - Add appropriate indexes
   - Include timestamps (created_at, updated_at)

2. **Add to `backend/models/__init__.py`:**
   ```python
   from .[your_model] import [YourModel]
   ```

3. **Create database migration:**
   ```bash
   cd backend
   poetry run alembic revision --autogenerate -m "Add [your_model] table"
   poetry run alembic upgrade head
   ```

**Requirements:**
- Model follows existing patterns in codebase
- Relationships are correctly defined
- Fields have appropriate types and constraints
- Migration runs successfully

#### 3. Create Schemas (10 points)

**Create Pydantic schemas:**

1. **Create schema file:** `backend/schemas/[your_model].py`

2. **Include schemas:**
   - **Create schema:** For creating new records (input validation)
   - **Update schema:** For updating records (optional fields)
   - **Response schema:** For returning records (output formatting)

3. **Add validation:**
   - Field constraints (min_length, max_length, etc.)
   - Required vs optional fields
   - Type validation

**Requirements:**
- Schemas validate input correctly
- Response schemas match model structure
- Validation errors are clear

#### 4. Create API Routes (15 points)

**Create FastAPI routes:**

1. **Create route file:** `backend/routes/[your_model].py`

2. **Implement CRUD endpoints:**
   - At minimum: Create (POST) and Read (GET one or list)
   - Optional: Update (PATCH) and Delete (DELETE)

3. **Register route in `backend/server.py`:**
   ```python
   from backend.routes import [your_model]
   app.include_router([your_model].router)
   ```

**Requirements:**
- Endpoints follow REST conventions
- Authentication/authorization is handled (use `get_current_user`)
- Error handling is appropriate (404, 422, etc.)
- Response models are specified

#### 5. Write Tests (10 points)

**Write comprehensive tests:**

1. **Create test file:** `tests/test_[your_model].py`

2. **Test each endpoint:**
   - **Success cases:** Valid input, correct response
   - **Failure cases:** Invalid input, missing data, unauthorized access
   - **Edge cases:** Empty strings, very long strings, etc.

3. **Use fixtures:**
   - Create test data fixtures
   - Use authentication fixtures
   - Clean up after tests

**Requirements:**
- Tests cover success and failure cases
- Tests are clear and well-named
- Tests are independent (can run in any order)
- All tests pass

### PR Requirements

#### Create Pull Request

1. **Create feature branch:**
   ```bash
   git checkout -b feature/[your-feature-name]
   ```

2. **Commit your work:**
   ```bash
   git add backend/models/[your_model].py
   git add backend/schemas/[your_model].py
   git add backend/routes/[your_model].py
   git add tests/test_[your_model].py
   git commit -m "Add [your feature]: model, API, and tests"
   ```

3. **Push and create PR:**
   ```bash
   git push origin feature/[your-feature-name]
   ```

4. **PR Description Template:**
   ```markdown
   ## Feature: [Your Feature Name]

   ### Design Decisions
   - What model did you create?
   - What relationships did you choose?
   - Why did you choose this design?
   - What alternatives did you consider?

   ### Implementation
   - Model: `backend/models/[your_model].py`
   - Schemas: `backend/schemas/[your_model].py`
   - Routes: `backend/routes/[your_model].py`
   - Tests: `tests/test_[your_model].py`

   ### Endpoints
   - `POST /api/[your-model]` - Create
   - `GET /api/[your-model]` - List
   - `GET /api/[your-model]/{id}` - Get one
   - (Add others if implemented)

   ### Testing
   - What did you test?
   - What test cases did you cover?
   - Do all tests pass?

   ### Questions
   - What questions do you have?
   - What would you like feedback on?
   ```


## Part 2: Peer Review (25 points)

### Instructions

Review **one PR from another team** (focus on design and testing). Provide substantive, constructive feedback.

### Requirements

#### 1. Find a PR to Review (5 points)

**Choose ONE PR from another team:**
- Not your own team's PR
- PR that implements a new model + API
- PR that needs review (not already reviewed by 2+ people)

**How to find PRs:**
- Check team repositories (each team has their own fork)
- Look for PRs with "HW2" in the title
- Ask in class or Slack if you can't find any

#### 2. Review the Design (10 points)

**Focus on design decisions:**

1. **Model Design:**
   - Is the model well-designed?
   - Are relationships appropriate?
   - Are fields necessary and well-typed?
   - What are the tradeoffs?

2. **API Design:**
   - Are endpoints RESTful?
   - Are response models clear?
   - Is error handling appropriate?

**Provide feedback:**
- What's good about the design?
- What could be improved?
- What alternatives might work?
- What questions do you have?

#### 3. Review the Tests (10 points)

**Focus on test coverage and quality:**

1. **Test Coverage:**
   - Do tests cover success cases?
   - Do tests cover failure cases?
   - Are edge cases tested?

2. **Test Quality:**
   - Are test names clear?
   - Are tests independent?
   - Are fixtures used appropriately?
   - Are assertions specific?

**Provide feedback:**
- What's good about the tests?
- What test cases are missing?
- How could tests be improved?

### Review Guidelines

**Be constructive:**
- ✅ "This relationship design makes sense because..."
- ✅ "Consider adding a test for the 404 case when..."
- ❌ "This is wrong" (be specific about what and why)
- ❌ "Needs more tests" (specify what to test)

**Be specific:**
- Point to specific lines or functions
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

Reflect on your design decisions, implementation experience, and what you learned from code review.

### Reflection Questions

**Answer these questions (2-3 paragraphs each):**

1. **Design Decisions:**
   - What design decisions did you make? (model structure, relationships, API design)
   - Why did you make those decisions?
   - What alternatives did you consider?
   - What tradeoffs did you face?
   - If you could redesign, what would you change? Why?

2. **Implementation Experience:**
   - What was easy about implementing the model + API?
   - What was hard?
   - What took longer than expected?
   - What questions do you still have?

3. **Code Review Learning:**
   - What feedback did you receive on your PR?
   - Was the feedback helpful? Why or why not?
   - What did you learn from reviewing another team's PR?
   - How has your understanding of design improved?

4. **Testing Reflection:**
   - How did writing tests help you think about the design?
   - What was hard about writing tests?
   - What would you do differently next time?

### Submission

- **Format:** Written reflection (500-750 words total)
- **Location:** Submit via course platform
- **Individual submission:** Each team member submits their own reflection


## Grading Rubric

| Criteria | Points | Description |
|----------|--------|-------------|
| Model Design | 10 | Well-designed model with appropriate relationships |
| Model Implementation | 15 | Correct SQLAlchemy model, migration works |
| Schema Implementation | 10 | Proper Pydantic schemas with validation |
| API Implementation | 15 | Working endpoints with proper error handling |
| Tests | 10 | Comprehensive tests covering success and failure cases |
| PR Quality | 5 | Clear PR description, well-documented |
| Review Selection | 5 | Appropriate PR chosen for review |
| Design Review | 10 | Substantive feedback on design decisions |
| Test Review | 10 | Substantive feedback on test coverage and quality |
| Reflection Quality | 15 | Thoughtful reflection on design, implementation, and learning |
| **Total** | **100** | |


## Submission Checklist

### Team Submission:
- [ ] GitHub PR created with new model + API + tests
  - [ ] Model designed and documented
  - [ ] Model implemented with migration
  - [ ] Schemas created with validation
  - [ ] Routes implemented with proper error handling
  - [ ] Tests written and passing
  - [ ] PR description includes design decisions
  - [ ] All tests pass

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

### Design Phase
- **Whiteboard first:** Don't code until you've designed
- **Consider alternatives:** Think about different approaches
- **Document decisions:** Write down why you chose this design
- **Ask questions:** If unsure, ask instructor or teammates

### Implementation Phase
- **Start simple:** Get basic functionality working first
- **Test as you go:** Write tests alongside implementation
- **Run tests frequently:** Catch issues early
- **Use existing patterns:** Follow codebase conventions

### Review Phase
- **Be constructive:** Focus on helping, not criticizing
- **Be specific:** Point to specific code, explain why
- **Ask questions:** Understand decisions before suggesting changes
- **Learn from feedback:** Consider suggestions, ask for clarification

### Reflection Phase
- **Be honest:** What was hard? What did you learn?
- **Be specific:** Give examples from your experience
- **Think critically:** What would you do differently? Why?


## Common Issues and Solutions

### Issue: Migration fails
**Solution:** Check model syntax, ensure all imports are correct, verify database connection

### Issue: Tests fail
**Solution:** Check fixtures, verify test data setup, ensure authentication is handled

### Issue: Don't know what to implement
**Solution:** Choose a simple feature first (e.g., notifications), ask instructor for suggestions

### Issue: Design is unclear
**Solution:** Whiteboard with team, discuss alternatives, ask instructor for feedback

### Issue: Review feedback is vague
**Solution:** Be specific, point to code, explain why, suggest alternatives


## Resources

- **SQLAlchemy Relationships:** https://docs.sqlalchemy.org/en/20/orm/basic_relationships.html
- **FastAPI Dependencies:** https://fastapi.tiangolo.com/tutorial/dependencies/
- **Pytest Documentation:** https://docs.pytest.org/en/stable/
- **Clean Code Ch. 2-3:** (from course readings)


## Next Steps

After completing this assignment, you'll:
- Understand how to design and implement new features
- Be comfortable making design decisions
- Have practice with code review
- Be ready for refactoring (Week 4)

Good luck!

