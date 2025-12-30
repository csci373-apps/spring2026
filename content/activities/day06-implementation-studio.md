---
title: "Implementation Studio"
date: "2026-01-29"
type: "activity"
---


## Learning Objectives

By the end of this session, students will:
- Be able to implement a new model, schema, and route together
- Understand how to write tests for new features
- Be able to give substantive code review feedback
- Practice pair programming and mob programming
- Reflect on what they learned from implementation


## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:10 | Review & Warm-up | Review domain model, address questions |
| 0:10-0:50 | Implementation Studio | Build model + API + tests together |
| 0:50-1:10 | Guided Code Review | Practice substantive feedback |
| 1:10-1:25 | Team Reflection | What did we learn? |
| 1:25-1:30 | Wrap-up | Preview homework |


## Detailed Instructions

### Part 1: Review & Warm-up (10 minutes)

#### Check-in (3 minutes)
1. **Welcome back**
2. **Quick check:** "Raise your hand if:"
   - You read the SQLAlchemy Relationships documentation
   - You designed a domain model (from Tuesday)
   - You have questions about relationships

#### Review Domain Model (5 minutes)

**Instructor asks:** "Who designed a domain model? Share one thing you learned."

**Common insights:**
- "I didn't realize how many decisions go into modeling"
- "Relationships are more complex than I thought"
- "Tradeoffs are everywhere"

**Address questions** about domain modeling

#### Preview Today (2 minutes)
- "Today we're implementing together"
- "We'll build a model, schema, route, and tests"
- "Then we'll practice code review"
- "This is what you'll do for homework"

**Transition:** "Let's start implementing..."


### Part 2: Implementation Studio (40 minutes)

#### Choose a Feature (5 minutes)

**Instructor provides options:**

**Option 1: Notification System** (from Tuesday's activity)
- Model: Notification (message, read, user_id)
- Endpoints: GET list, GET one, PATCH (mark read), DELETE

**Option 2: Comment System**
- Model: Comment (content, post_id, user_id)
- Endpoints: POST (create), GET (list for post), DELETE

**Option 3: Tag System**
- Model: Tag (name), PostTag (junction table)
- Endpoints: GET tags, POST tag to post, DELETE tag from post

**Instructor:** Let class vote or assign one to all teams

**For this guide, we'll use Option 1: Notification System**

#### Step 1: Create the Model (10 minutes)

**Instructor guides teams through creating the model:**

1. **Create file:** `backend/models/notification.py`

2. **Write the model:**
   ```python
   from datetime import datetime
   from sqlalchemy import TIMESTAMP, Boolean, Column, ForeignKey, Integer, String, Text
   from sqlalchemy.orm import relationship
   from .base import Base

   class Notification(Base):
       __tablename__ = "notifications"

       id = Column(Integer, primary_key=True, index=True)
       message = Column(Text, nullable=False)
       read = Column(Boolean, default=False, nullable=False, index=True)
       user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
       created_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)

       # Relationship
       user = relationship("User", backref="notifications")
   ```

3. **Add to `backend/models/__init__.py`:**
   ```python
   from .notification import Notification
   ```

4. **Create migration:**
   ```bash
   cd backend
   poetry run alembic revision --autogenerate -m "Add notifications table"
   poetry run alembic upgrade head
   ```

**Instructor circulates:**
- Help teams write the model
- Answer questions about relationships
- Ensure syntax is correct

**Key Point:** "Models define the database structure. Keep it simple and focused."

#### Step 2: Create the Schema (10 minutes)

**Instructor guides teams through creating schemas:**

1. **Create file:** `backend/schemas/notification.py`

2. **Write schemas:**
   ```python
   from datetime import datetime
   from pydantic import BaseModel, Field

   class NotificationCreate(BaseModel):
       message: str = Field(..., min_length=1, max_length=1000)

   class NotificationUpdate(BaseModel):
       read: bool = True

   class NotificationResponse(BaseModel):
       id: int
       message: str
       read: bool
       user_id: int
       created_at: datetime

       class Config:
           from_attributes = True
   ```

**Instructor circulates:**
- Help teams write schemas
- Ensure validation is correct
- Check that Response schema matches Model

**Key Point:** "Schemas define the API contract. They validate input and format output."

#### Step 3: Create the Route (10 minutes)

**Instructor guides teams through creating routes:**

1. **Create file:** `backend/routes/notifications.py`

2. **Write routes:**
   ```python
   from fastapi import APIRouter, Depends, HTTPException
   from sqlalchemy.orm import Session
   from backend.database import get_db
   from backend.models import Notification, User
   from backend.schemas.notification import (
       NotificationCreate,
       NotificationResponse,
       NotificationUpdate,
   )
   from backend.auth import get_current_user

   router = APIRouter(prefix="/api/notifications", tags=["notifications"])

   @router.get("", response_model=list[NotificationResponse])
   async def list_notifications(
       db: Session = Depends(get_db),
       current_user: User = Depends(get_current_user),
   ):
       """List all notifications for current user"""
       notifications = db.query(Notification).filter(
           Notification.user_id == current_user.id
       ).all()
       return notifications

   @router.get("/{id}", response_model=NotificationResponse)
   async def get_notification(
       id: int,
       db: Session = Depends(get_db),
       current_user: User = Depends(get_current_user),
   ):
       """Get one notification"""
       notification = db.query(Notification).filter(
           Notification.id == id,
           Notification.user_id == current_user.id
       ).first()
       if not notification:
           raise HTTPException(status_code=404, detail="Notification not found")
       return notification

   @router.patch("/{id}", response_model=NotificationResponse)
   async def update_notification(
       id: int,
       update: NotificationUpdate,
       db: Session = Depends(get_db),
       current_user: User = Depends(get_current_user),
   ):
       """Mark notification as read"""
       notification = db.query(Notification).filter(
           Notification.id == id,
           Notification.user_id == current_user.id
       ).first()
       if not notification:
           raise HTTPException(status_code=404, detail="Notification not found")
       notification.read = update.read
       db.commit()
       db.refresh(notification)
       return notification

   @router.delete("/{id}", status_code=204)
   async def delete_notification(
       id: int,
       db: Session = Depends(get_db),
       current_user: User = Depends(get_current_user),
   ):
       """Delete notification"""
       notification = db.query(Notification).filter(
           Notification.id == id,
           Notification.user_id == current_user.id
       ).first()
       if not notification:
           raise HTTPException(status_code=404, detail="Notification not found")
       db.delete(notification)
       db.commit()
       return None
   ```

3. **Register route in `backend/server.py`:**
   ```python
   from backend.routes import notifications
   app.include_router(notifications.router)
   ```

**Instructor circulates:**
- Help teams write routes
- Ensure error handling is correct
- Check authentication/authorization

**Key Point:** "Routes orchestrate models and schemas. They contain the business logic."

#### Step 4: Write Tests (5 minutes)

**Instructor guides teams through writing one test:**

1. **Create file:** `tests/test_notifications.py`

2. **Write a test:**
   ```python
   def test_list_notifications_returns_user_notifications(client, auth_headers, test_user):
       # Create a notification for test_user
       notification = Notification(
           message="Test notification",
           user_id=test_user.id
       )
       db.add(notification)
       db.commit()

       # List notifications
       response = client.get("/api/notifications", headers=auth_headers)
       
       assert response.status_code == 200
       assert len(response.json()) == 1
       assert response.json()[0]["message"] == "Test notification"
   ```

**Instructor:** "This is a start. For homework, you'll write more comprehensive tests."

**Key Point:** "Tests verify the contract. Write them as you implement."

**Transition:** "Now let's practice code review..."


### Part 3: Guided Code Review (20 minutes)

#### Review Protocol (5 minutes)

**Instructor explains code review focus areas:**

1. **Behavior:**
   - Does it do what it's supposed to do?
   - Are edge cases handled?
   - Are errors handled correctly?

2. **Design:**
   - Is the code clear?
   - Are responsibilities separated?
   - Is it maintainable?

3. **Testing:**
   - Are there tests?
   - Do tests cover success and failure cases?
   - Are tests clear and specific?

4. **Code Quality:**
   - Is the code readable?
   - Are names clear?
   - Is there unnecessary complexity?

**Key Point:** "Good reviews focus on behavior, design, and testing. Not just style."

#### Practice Review (10 minutes)

**Instructor shows example code (on screen or handout):**

```python
# Example: Notification route (intentionally has issues)
@router.get("", response_model=list[NotificationResponse])
async def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notifications = db.query(Notification).all()
    return notifications
```

**Instructor asks teams to review:**
- What's good about this code?
- What could be improved?
- What feedback would you give?

**Teams discuss (3 minutes)**

**Instructor leads discussion:**
- **Issue:** Returns ALL notifications, not just current user's
- **Feedback:** "This should filter by `current_user.id` for security"
- **Better version:** Show the corrected code

**Show another example:**

```python
# Example: Test (intentionally has issues)
def test_notifications(client):
    response = client.get("/api/notifications")
    assert response.status_code == 200
```

**Instructor asks teams to review:**
- What's missing?
- What could be improved?

**Teams discuss (3 minutes)**

**Instructor leads discussion:**
- **Issues:**
  - Missing authentication (needs auth_headers)
  - Missing test data (no notifications created)
  - Vague test name
  - Doesn't verify response content
- **Better version:** Show improved test

**Key Point:** "Review helps catch issues before they're merged. Be specific and constructive."

#### Review Practice (5 minutes)

**Instructor asks teams to:**
1. **Review a teammate's code** (from today's implementation)
2. **Give feedback** on:
   - Behavior (does it work?)
   - Design (is it clear?)
   - Testing (are there tests?)

3. **Be specific:**
   - "This line should filter by user_id" (not "this is wrong")
   - "Consider adding a test for the 404 case" (not "needs more tests")

**Instructor circulates:**
- Help teams give feedback
- Ensure feedback is constructive
- Model good review practices

**Transition:** "Let's reflect on what we learned..."


### Part 4: Team Reflection (15 minutes)

#### Reflection Activity (12 minutes)

**Instructor asks teams to discuss:**

1. **What did we do today?**
   - Implemented model, schema, route, tests
   - Practiced code review
   - Worked together

2. **What did we learn?**
   - About implementing features?
   - About code review?
   - About working together?

3. **What was hard?**
   - What took longer than expected?
   - What was confusing?
   - What questions do we have?

4. **What would we do differently?**
   - How would we structure the code?
   - How would we organize the work?
   - What would we test first?

5. **What makes good code?**
   - Clear?
   - Tested?
   - Well-designed?

**Instructor asks 2-3 teams to share:**
- One thing they learned
- One thing that was hard
- One question they have

**Common insights:**
- "Implementing is easier when you plan first"
- "Code review catches things I miss"
- "Tests help me think through the design"
- "Working together is helpful but requires communication"

**Key Point:** "Reflection helps us learn. We'll keep doing this."

#### Preview Homework (3 minutes)

**HW2: New Model + API + Tests (Team PR) + Peer Review + Reflection**
- **Due:** Next Tuesday (Feb 3)
- **Requirements:**
  1. Design a new model (or use the one from today)
  2. Implement model, schema, route
  3. Write comprehensive tests
  4. Create PR
  5. Review another team's PR (focus on design and testing)
  6. Individual reflection on design decisions

- **Process:**
  1. Design the model (whiteboard first)
  2. Implement model, schema, route
  3. Write tests (success + failure cases)
  4. Create PR with clear description
  5. Review another team's PR
  6. Reflect on design decisions


### Part 5: Wrap-up (5 minutes)

#### Reminders (3 minutes)
- Tests verify the contract
- Code review helps us learn
- Design decisions matter
- Reflection helps us improve

#### Questions (2 minutes)
- Open floor for questions
- Address common concerns


## Materials Needed

- Codebase open and navigable
- Example code for review practice
- Code review checklist (handout or digital)
- Computer for each student/pair

## Instructor Notes

### Common Issues

**Issue: Teams struggle with relationships**  
Solution: Provide more examples, walk through one relationship type in detail

**Issue: Tests are hard to write**  
Solution: Provide test templates, focus on one test at a time

**Issue: Code review is vague**  
Solution: Model specific feedback, provide review checklist

### Time Management

- **If running short:** Focus on one endpoint, skip some tests
- **If running long:** Move some implementation to homework, focus on review practice

### Differentiation

- **For advanced students:** Have them implement more complex features, write more tests
- **For struggling students:** Provide more scaffolding, focus on one simple endpoint


## Student Deliverables

- Model, schema, route implemented (can be part of HW2)
- At least one test written (can be part of HW2)
- Code review practice completed
- Team reflection completed

## Next Steps

- **Before Tuesday:** Complete HW2
- **Tuesday:** Design principles and refactoring
- **Reading:** Clean Code Ch. 2-3 (selected sections on readability and structure)

