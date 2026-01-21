---
title: "Domain Modeling"
start_date: "2026-01-27"
type: "activity"
draft: 1
heading_max_level: 3
---

> ## Learning Objectives
>
> By the end of this session, you will:
> - Understand how to design database models and relationships
> - Be able to identify tradeoffs in relationship design
> - Be able to create a domain model before coding
> - Understand how models, schemas, and routes work together

## 1. What is Domain Modeling? (10 minutes)

**Domain modeling** is designing your database structure before you write code. It's about understanding:
- What **entities** (things) you need to store
- How those entities **relate** to each other
- What **fields** each entity needs

### Why Model First?

- Catch design issues early
- Everyone understands the structure
- Know what you're building
- Fix design problems before they're in code

### Example from the Codebase

Let's look at a real example from the codebase: `User` and `Group`:

- A `User` can belong to many Groups (e.g., Alice is in "Team Alpha" and "Study Group")
- A `Group` can have many Users (e.g., "Team Alpha" has Alice, Bob, and Charlie)

This is a **many-to-many** relationship because:
- One user → many groups
- One group → many users

**How it's represented in the database:**

The database has three tables:

```bash
┌─────────────┐
│   users     │
├─────────────┤
│ id (PK)     │
│ username    │
│ email       │
│ ...         │
└─────────────┘
       │
       │ (referenced by)
       │
┌─────────────┐
│ user_groups │
├─────────────┤
│ id (PK)     │
│ user_id (FK)│──┐
│ group_id(FK)│──┼──┐
│ role        │  │  │
│ joined_at   │  │  │
└─────────────┘  │  │
                 │  │
                 │  │ (referenced by)
                 │  │
┌─────────────┐  │  │
│   groups    │  │  │
├─────────────┤  │  │
│ id (PK)     │◄─┘  │
│ name        │     │
│ description │     │
│ created_by  │     │
│ ...         │     │
└─────────────┘     │
                    │
                    └── (user_id references users.id)
```

**Key Point:** When you have a many-to-many relationship, you need an association table to connect the two entities. The association table stores the foreign keys to both entities. In the example above, the `user_groups` association table is what makes the many-to-many relationship work. It stores pairs of `(user_id, group_id)` to track which users belong to which groups.


## 2. Types of Relationships (15 minutes)

### One-to-Many (1:N)

**Example:** One User creates many Groups

```python
class Group(Base):
    created_by = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User", backref="created_groups")
```

- Foreign key goes in the "many" table (Group has `created_by`)
- One user can create many groups
- Each group belongs to one user

### Many-to-Many (N:M)

**Example:** Users belong to many Groups, Groups have many Users

```python
class UserGroup(Base):
    user_id = Column(Integer, ForeignKey("users.id"))
    group_id = Column(Integer, ForeignKey("groups.id"))
    role = Column(String(20))  # Extra info about the relationship
```

- Need an **association table** (UserGroup) to connect them
- Association table has foreign keys to both entities
- Can add extra fields (like `role`) to the association table

### One-to-One (1:1)

**Example:** One User has one Profile

```python
class Profile(Base):
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    user = relationship("User", back_uselist=False)
```

- Foreign key in one table with `unique=True`
- Less common than other relationship types

**Key Point:** Choose the relationship type based on your needs. Ask: "Can one X have many Y? Can one Y have many X?"

## 3. Design Activity: Course Module System (20 minutes)

### First: Read the Context

Before discussing, read [HW2](/spring2026/assignments/hw02-new-model-api), Section 1: "Domain Model Design" (specifically the yellow block). This will give you the context about the Course-Module system you'll be designing.

**Take 2 minutes to read it now.**

### Quick Discussion

**With your team, discuss these key questions about the Course-Module system:**

1. **Module reuse:** If a Module can belong to multiple Courses, what relationship type do you need? (Hint: think about the User-Group example we just saw)

2. **Module ordering:** How would support Module ordering if modules can belong to more than one course and potentially be in a different order for each course?

3. **Creating / assigning Posts**: How are posts created and associated with modules? Do you need different models for different post types?

3. **Progress tracking:** How would you track which Posts a user has completed? (Separate model? Fields on Post?)

Take 5 minutes to discuss / sketch out ideas, then we'll share ideas as a class.


### For Your Homework

**You'll do the full domain model design for HW2.** See **HW2, Section 1.1: "Deliverable: Model drawing + notes"** for the complete requirements. Today's discussion should help you think through the key decisions you'll need to make.

## 4. Planning Your Implementation (15 minutes)

### What You'll Build for HW2

For HW2, you'll implement **Module CRUD endpoints**:
- Create, read, update, delete modules
- You won't implement Posts or Progress yet, but your design should anticipate them

### Implementation Order

1. **Model first** - Define the database structure
2. **Schema second** - Define the API contract (input/output)
3. **Route third** - Implement the business logic
4. **Tests throughout** - Test as you go

### What to Plan For

Even though you're only implementing Module CRUD, your model should:
- Support modules belonging to multiple courses (many-to-many)
- Support ordered posts within modules (ordering field)
- Not block future progress tracking

**Key Point:** Design for the future, implement incrementally.

## 5. Review & Questions (10 minutes)

### Common Questions

**"When do I use One-to-Many vs Many-to-Many?"**

Ask yourself two questions:
1. Can one X belong to many Y? (e.g., Can one Module belong to many Courses?)
2. Can one Y have many X? (e.g., Can one Course have many Modules?)

**If both are "yes"** → Use **Many-to-Many** (need an association table)
- Example: Module can be in multiple Courses, and Course can have multiple Modules

**If only one is "yes"** → Use **One-to-Many** (foreign key in the "many" table)
- Example: Post belongs to one Module, but Module can have many Posts

**"What goes in an association table?"**
- Foreign keys to both entities (required)
- Metadata about the relationship (optional but common)
- Example: CourseModule might have `ordering` (which order this module appears in the course)

**"Do I need to test the model?"**
- Usually not - SQLAlchemy handles model behavior
- Test the API endpoints that use the model
- Test that relationships work (e.g., can you query `course.modules`?)

### Next Steps

- **Today:** Design your domain model for HW2
- **Thursday:** Implementation studio - we'll build together
- **HW2:** Implement Module CRUD based on your design

## Resources

- **SQLAlchemy Relationships:** https://docs.sqlalchemy.org/en/20/orm/basic_relationships.html
- **Look at existing models:** `backend/models/` in your codebase
- **Example relationships:** UserGroup, CourseGroup show many-to-many patterns
