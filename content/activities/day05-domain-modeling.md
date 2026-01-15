---
title: "Domain Modeling"
start_date: "2026-01-27"
type: "activity"
draft: 1
---


## Learning Objectives

By the end of this session, students will:
- Understand how to design database models and relationships
- Be able to identify tradeoffs in relationship design
- Be able to create a domain model before coding
- Understand how to plan implementation and tests together
- Reflect on what they learned from HW1 (code reviews and test writing)


## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:15 | Reflection on HW1 | Review code reviews and test writing |
| 0:15-0:35 | Domain Modeling Lecture | Models, relationships, and tradeoffs |
| 0:35-1:05 | Whiteboard Activity | Design a new model together |
| 1:05-1:20 | Implementation Planning | Plan implementation and tests |
| 1:20-1:30 | Q&A & Wrap-up | Questions, preview homework |


## Detailed Instructions

### Part 1: Reflection on HW1 (15 minutes)

#### Check-in (3 minutes)
1. **Welcome back**
2. **Quick check:** "Raise your hand if:"
   - You completed HW1 (tests + review)
   - You received feedback on your PR
   - You have questions about the review process

#### Reflection Activity: Code Reviews (7 minutes)

**Instructor asks teams to discuss:**

1. **What did you learn from reviewing another team's tests?**
   - What did you notice about their tests?
   - What feedback did you give?
   - What feedback did you receive?

2. **What makes a good code review?**
   - Was the feedback you received helpful?
   - Was the feedback you gave helpful?
   - What would you do differently?

3. **What was hard about writing tests?**
   - What took longer than expected?
   - What was confusing?
   - What questions do you still have?

**Instructor asks 2-3 teams to share:**
- One thing they learned from the review process
- One thing that was hard about writing tests
- One question they have

**Common insights to highlight:**
- "I didn't realize how important clear test names are"
- "Reviewing helped me see patterns I missed"
- "Writing behavior contracts first made testing easier"
- "I struggled with fixtures and test data setup"

**Key Point:** "Code review is a learning tool. We'll keep practicing this throughout the semester."

#### Reflection Activity: Test Writing (5 minutes)

**Instructor asks teams to discuss:**

1. **What did you learn about writing tests?**
   - What makes a good test?
   - What makes a bad test?
   - What patterns did you notice?

2. **What would you do differently next time?**
   - How would you structure your tests?
   - How would you organize your code?
   - What would you test first?

3. **What questions do you have about testing?**
   - About pytest?
   - About test structure?
   - About test coverage?

**Instructor:** Address common questions, highlight good practices

**Key Point:** "Testing is a skill. You'll get better with practice. Today we'll design new features with tests in mind."

**Transition:** "Now let's learn about designing database models..."


### Part 2: Domain Modeling Lecture (20 minutes)

#### What is Domain Modeling? (3 minutes)

**Instructor explains:**
- Domain modeling is designing the database structure before coding
- It's about understanding the problem and the data
- It's about relationships between entities
- It helps you think through the design before implementing

**Show example from codebase:**

```
User ──< UserGroup >── Group
  │
  ├──< CourseGroup >── Course ──< CourseModule >── Module
  │
  └──< Post >── Module ──< ModulePost >── Post
```

**Key Point:** "Models represent real-world entities. Relationships connect them."

#### Types of Relationships (7 minutes)

**Instructor explains three main relationship types:**

1. **One-to-Many (1:N)**
   - Example: User → Groups (one user creates many groups)
   - In code: `user.created_groups` (list)
   - Database: Foreign key in "many" table

2. **Many-to-Many (N:M)**
   - Example: Users ↔ Groups (users belong to many groups, groups have many users)
   - In code: Junction table (UserGroup)
   - Database: Separate table with foreign keys to both

3. **One-to-One (1:1)**
   - Example: User → Profile (one user has one profile)
   - In code: Foreign key in one table
   - Database: Foreign key in one table (usually the "child")

**Show examples from codebase:**

```python
# One-to-Many: User creates Groups
class Group(Base):
    created_by = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User", backref="created_groups")

# Many-to-Many: Users ↔ Groups
class UserGroup(Base):
    user_id = Column(Integer, ForeignKey("users.id"))
    group_id = Column(Integer, ForeignKey("groups.id"))
    user = relationship("User", backref="group_memberships")
    group = relationship("Group", back_populates="members")
```

**Key Point:** "Relationships are about how entities connect. Choose the right type for your use case."

#### Relationship Tradeoffs (10 minutes)

**Instructor discusses tradeoffs:**

1. **One-to-Many vs Many-to-Many:**
   - **One-to-Many:** Simpler, but limits flexibility
   - **Many-to-Many:** More flexible, but more complex
   - **Example:** User → Groups
     - If one user can only create groups: One-to-Many
     - If users can belong to multiple groups: Many-to-Many

2. **Junction Table Design:**
   - **Simple:** Just foreign keys
   - **With metadata:** Add extra fields (role, joined_at, etc.)
   - **Example:** UserGroup has `role` field (member, moderator, owner)

3. **Cascade Behavior:**
   - **Cascade delete:** If parent deleted, children deleted
   - **No cascade:** If parent deleted, children remain (orphaned)
   - **Example:** If Group deleted, should UserGroup records be deleted?

4. **Indexing:**
   - **Foreign keys:** Usually indexed for performance
   - **Composite indexes:** For unique constraints (user_id + group_id)

**Show example:**

```python
class UserGroup(Base):
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), index=True)
    role = Column(String(20), default="member")
    joined_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    # Unique constraint: user can only be in group once
    __table_args__ = (UniqueConstraint("user_id", "group_id"),)
```

**Key Point:** "Every design decision has tradeoffs. Think about what you need now and what might change."

**Transition:** "Now let's design a new model together..."


### Part 3: Whiteboard Activity (30 minutes)

#### Setup (5 minutes)

**Instructor provides scenario:**

**Scenario:** You need to add a "Notification" system to the app. Users should be able to:
- Receive notifications (e.g., "You were added to a group", "New post in course")
- Mark notifications as read/unread
- Delete notifications
- See notification history

**Questions to consider:**
- What entities do we need?
- What are the relationships?
- What fields does each entity need?
- What are the tradeoffs?

#### Team Activity: Design the Model (20 minutes)

**Instructions:**
1. **Work in teams** (use whiteboard or paper)
2. **Design the domain model:**
   - Draw entities (boxes)
   - Draw relationships (lines)
   - Label relationships (1:N, N:M, 1:1)
   - List fields for each entity

3. **Consider:**
   - What entities exist? (Notification, User, etc.)
   - How do they relate? (User → Notification: 1:N or N:M?)
   - What fields are needed? (id, message, read, created_at, etc.)
   - What are the tradeoffs? (simple vs flexible)

**Template:**

```
┌─────────────┐
│   Entity    │
│  - field1   │
│  - field2   │
└──────┬──────┘
       │
       │ (relationship type)
       │
┌──────▼──────┐
│   Entity    │
└─────────────┘
```

**Instructor circulates:**
- Help teams think through design
- Ask probing questions: "Why this relationship? What if...?"
- Ensure teams consider tradeoffs
- Point out common patterns

#### Share Designs (5 minutes)

**Ask 2-3 teams to share:**
- Their domain model (draw on board)
- Their reasoning (why this design?)
- Tradeoffs they considered

**Common designs to discuss:**

**Option 1: Simple (One-to-Many)**
```
User ──< Notification
  - id
  - message
  - read (boolean)
  - created_at
```

**Option 2: Flexible (Many-to-Many with metadata)**
```
User ──< UserNotification >── Notification
  - user_id
  - notification_id
  - read (boolean)
  - read_at (timestamp)
```

**Instructor leads discussion:**
- Which design is better? Why?
- What are the tradeoffs?
- What if requirements change?

**Key Point:** "There's no one right answer. Choose based on your needs and tradeoffs."

**Transition:** "Now let's plan how to implement this..."


### Part 4: Implementation Planning (15 minutes)

#### Plan the Implementation (10 minutes)

**Instructor asks teams to plan:**

1. **What needs to be created?**
   - Model file (e.g., `backend/models/notification.py`)
   - Schema file (e.g., `backend/schemas/notification.py`)
   - Route file (e.g., `backend/routes/notifications.py`)

2. **What's the order?**
   - Model first (database structure)
   - Schema second (API contract)
   - Route third (business logic)
   - Tests throughout (test as you go)

3. **What tests are needed?**
   - Model tests? (usually not needed - SQLAlchemy handles this)
   - API tests? (yes - test the endpoints)
   - What scenarios? (create, read, update, delete, mark as read)

**Template:**

```markdown
## Implementation Plan

### Step 1: Model
- Create `Notification` model
- Add relationship to `User`
- Add fields: id, message, read, created_at, user_id

### Step 2: Schema
- Create `NotificationCreate` schema (for creating)
- Create `NotificationResponse` schema (for returning)
- Create `NotificationUpdate` schema (for updating)

### Step 3: Route
- `GET /api/notifications` - List user's notifications
- `GET /api/notifications/{id}` - Get one notification
- `PATCH /api/notifications/{id}` - Mark as read
- `DELETE /api/notifications/{id}` - Delete notification

### Step 4: Tests
- Test creating notification
- Test listing notifications
- Test marking as read
- Test deleting notification
- Test error cases (not found, unauthorized)
```

**Instructor circulates:**
- Help teams create plans
- Ensure they think about tests
- Check that plans are realistic

#### Share Plans (5 minutes)

**Ask 1-2 teams to share:**
- Their implementation plan
- What they'll test
- What questions they have

**Instructor:** Validate plans, address questions

**Key Point:** "Planning helps you implement faster. Tests guide your implementation."

**Transition:** "On Thursday, you'll implement this together..."


### Part 5: Q&A & Wrap-up (10 minutes)

#### Questions (7 minutes)
- Open floor for questions
- Address common confusions:
  - "One-to-Many vs Many-to-Many?" → Depends on requirements
  - "When do I need a junction table?" → For Many-to-Many
  - "What fields go in the junction table?" → Metadata about the relationship

#### Preview Homework (2 minutes)
- **HW2:** Design and implement a new model + API + tests
- **Due:** Next Tuesday (Feb 3)
- **Process:**
  1. Design the model (like today)
  2. Implement model, schema, route
  3. Write tests
  4. Create PR
  5. Review another team's PR
  6. Reflect on design decisions

#### Wrap-up (1 minute)
- Remind students to:
  - Read SQLAlchemy Relationships documentation (due Thursday)
  - Read Clean Code Ch. 2-3 (due Thursday)
  - Come ready to implement on Thursday


## Materials Needed

- Whiteboard or large paper for each team
- Markers
- Codebase open and navigable
- Example models from codebase (for reference)
- Domain modeling template (handout or digital)

## Instructor Notes

### Common Confusions

**"When do I use One-to-Many vs Many-to-Many?"**
- One-to-Many: One entity "owns" many of another (User creates Groups)
- Many-to-Many: Entities can belong to multiple of each other (Users ↔ Groups)
- Ask: "Can one User belong to multiple Groups? Can one Group have multiple Users?" → If both yes, use Many-to-Many

**"What goes in a junction table?"**
- Foreign keys to both entities (required)
- Metadata about the relationship (optional but common)
- Example: UserGroup has `role` (member, moderator, owner)

**"Do I need to test the model?"**
- Usually not - SQLAlchemy handles model behavior
- Test the API endpoints that use the model
- Test relationships work correctly (e.g., can I query user.notifications?)

### Time Management

- **If running short:** Focus on one relationship type, skip some tradeoffs
- **If running long:** Move implementation planning to homework, focus on modeling

### Differentiation

- **For advanced students:** Have them design more complex relationships, consider performance implications
- **For struggling students:** Provide a simpler scenario, focus on one relationship type


## Student Deliverables

- Domain model designed (whiteboard/paper)
- Implementation plan created (can be part of HW2)
- Reflection on HW1 (code reviews and test writing)

## Next Steps

- **Before Thursday:** Read SQLAlchemy Relationships documentation, Clean Code Ch. 2-3
- **Thursday:** Implementation studio - build the model + API + tests together
- **Homework:** HW2 due next Tuesday

