---
title: "Domain Modeling"
start_date: "2026-01-29"
type: "activity"
draft: 0
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


## 6. SQLAlchemy Query Practice
If you want some practice with querying, create a file called `sqa_practice.py` inside of your `backend` directory and paste in the code shown below. To run this code:

```bash
docker exec -it tma_backend poetry run python sqa_practice.py
```

### Sample SQLAlchemy Code
```py
"""
SQLAlchemy Practice Script

This script provides examples and practice exercises for writing SQLAlchemy queries
for Courses, Users, and Groups.

To run this script:
    poetry run python tester.py

Or if you're in Docker:
    docker exec -it tma_backend python tester.py
"""

import asyncio
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import joinedload

from database import AsyncSessionLocal
from models import User, Course, Group, Role, UserGroup


async def practice_queries():
    """
    Main function to practice SQLAlchemy queries.
    Add your practice queries in the sections below.
    """
    async with AsyncSessionLocal() as session:
        print("=" * 60)
        print("SQLAlchemy Practice Script")
        print("=" * 60)
        print()

        # ============================================================
        # EXAMPLE QUERIES - Study these first!
        # ============================================================

        print("📚 EXAMPLE QUERIES")
        print("-" * 60)

        # Example 1: Get all users
        print("\n1. Get all users:")
        result = await session.execute(select(User))
        users = result.scalars().all()
        print(f"   Found {len(users)} users")
        for user in users[:3]:  # Show first 3
            print(f"   - {user.username} ({user.email})")

        # Example 2: Get a user by ID
        print("\n2. Get user by ID:")
        result = await session.execute(select(User).where(User.id == 1))
        user = result.scalar_one_or_none()
        if user:
            print(f"   Found: {user.username}")

        # Example 3: Get users with their role (using joinedload)
        print("\n3. Get users with role relationship loaded:")
        result = await session.execute(
            select(User).options(joinedload(User.role)).limit(3)
        )
        users = result.unique().scalars().all()
        for user in users:
            print(f"   - {user.username} (Role: {user.role.name})")

        # Example 4: Filter users by role
        print("\n4. Get all admin users:")
        result = await session.execute(
            select(User)
            .join(Role)
            .where(Role.name == "admin")
            .options(joinedload(User.role))
        )
        admins = result.unique().scalars().all()
        print(f"   Found {len(admins)} admin users")
        for admin in admins:
            print(f"   - {admin.username}")

        # Example 5: Get all courses
        print("\n5. Get all courses:")
        result = await session.execute(select(Course).order_by(Course.created_at))
        courses = result.scalars().all()
        print(f"   Found {len(courses)} courses")
        for course in courses[:3]:  # Show first 3
            print(f"   - {course.title}")

        # Example 6: Get all groups
        print("\n6. Get all groups:")
        result = await session.execute(select(Group))
        groups = result.scalars().all()
        print(f"   Found {len(groups)} groups")
        for group in groups[:3]:  # Show first 3
            print(f"   - {group.name}")

        # Example 7: Get groups with creator information
        print("\n7. Get groups with creator (using joinedload):")
        result = await session.execute(
            select(Group).options(joinedload(Group.creator)).limit(3)
        )
        groups = result.unique().scalars().all()
        for group in groups:
            creator = group.creator
            print(f"   - {group.name} (Created by: {creator.username if creator else 'Unknown'})")

        # Example 8: Count users by role
        print("\n8. Count users by role:")
        result = await session.execute(
            select(Role.name, func.count(User.id).label("user_count"))
            .join(User, Role.id == User.role_id)
            .group_by(Role.name)
        )
        role_counts = result.all()
        for role_name, count in role_counts:
            print(f"   - {role_name}: {count} users")

        # ============================================================
        # PRACTICE EXERCISES - Write your queries here!
        # ============================================================

        print("\n" + "=" * 60)
        print("🎯 PRACTICE EXERCISES")
        print("=" * 60)
        print("\nUncomment and complete the exercises below:\n")

        # Exercise 1: Get all active users
        # TODO: Write a query to get all users where is_active == True
        # Hint: Use select(User).where(User.is_active == True)
        print("Exercise 1: Get all active users")
        # result = await session.execute(select(User).where(...))
        # active_users = result.scalars().all()
        # print(f"   Found {len(active_users)} active users")

        # Exercise 2: Get a user by username
        # TODO: Write a query to get a user by username (e.g., "admin")
        # Hint: Use select(User).where(User.username == "admin")
        print("\nExercise 2: Get user by username")
        # result = await session.execute(select(User).where(...))
        # user = result.scalar_one_or_none()
        # if user:
        #     print(f"   Found: {user.username} ({user.email})")

        # Exercise 3: Get users with email containing "@test"
        # TODO: Write a query to find users whose email contains "@test"
        # Hint: Use User.email.contains("@test")
        print("\nExercise 3: Get users with email containing '@test'")
        # result = await session.execute(select(User).where(...))
        # test_users = result.scalars().all()
        # print(f"   Found {len(test_users)} users with '@test' in email")

        # Exercise 4: Get courses ordered by title
        # TODO: Write a query to get all courses ordered by title (alphabetically)
        # Hint: Use .order_by(Course.title)
        print("\nExercise 4: Get courses ordered by title")
        # result = await session.execute(select(Course).order_by(...))
        # courses = result.scalars().all()
        # for course in courses[:5]:
        #     print(f"   - {course.title}")

        # Exercise 5: Get groups created by a specific user
        # TODO: Write a query to get all groups created by user_id == 1
        # Hint: Use select(Group).where(Group.created_by == 1)
        print("\nExercise 5: Get groups created by user_id 1")
        # result = await session.execute(select(Group).where(...))
        # groups = result.scalars().all()
        # print(f"   Found {len(groups)} groups created by user_id 1")

        # Exercise 6: Get users who are in at least one group
        # TODO: Write a query to get users who have at least one group membership
        # Hint: Use join(UserGroup) and distinct()
        print("\nExercise 6: Get users who are in at least one group")
        # result = await session.execute(
        #     select(User)
        #     .join(UserGroup, User.id == UserGroup.user_id)
        #     .distinct()
        # )
        # users_in_groups = result.scalars().all()
        # print(f"   Found {len(users_in_groups)} users in groups")

        # Exercise 7: Get a group with all its members
        # TODO: Write a query to get a group (e.g., id=1) with all its members loaded
        # Hint: Use joinedload(Group.members) and then access group.members
        print("\nExercise 7: Get group with members")
        # result = await session.execute(
        #     select(Group)
        #     .where(Group.id == 1)
        #     .options(joinedload(Group.members))
        # )
        # group = result.scalar_one_or_none()
        # if group:
        #     print(f"   Group: {group.name}")
        #     print(f"   Members: {len(group.members)}")
        #     for member in group.members[:3]:
        #         user_result = await session.execute(
        #             select(User).where(User.id == member.user_id)
        #         )
        #         user = user_result.scalar_one()
        #         print(f"     - {user.username} (role: {member.role})")

        # Exercise 8: Get users with multiple conditions
        # TODO: Write a query to get active users who are NOT admins
        # Hint: Use and_(User.is_active == True, Role.name != "admin") with join
        print("\nExercise 8: Get active non-admin users")
        # result = await session.execute(
        #     select(User)
        #     .join(Role)
        #     .where(and_(User.is_active == True, Role.name != "admin"))
        #     .options(joinedload(User.role))
        # )
        # non_admin_users = result.unique().scalars().all()
        # print(f"   Found {len(non_admin_users)} active non-admin users")

        # Exercise 9: Count total number of groups
        # TODO: Write a query to count the total number of groups
        # Hint: Use func.count(Group.id)
        print("\nExercise 9: Count total groups")
        # result = await session.execute(select(func.count(Group.id)))
        # total_groups = result.scalar()
        # print(f"   Total groups: {total_groups}")

        # Exercise 10: Get users with OR condition
        # TODO: Write a query to get users who are either admins OR managers
        # Hint: Use or_(Role.name == "admin", Role.name == "manager") with join
        print("\nExercise 10: Get admin or manager users")
        # result = await session.execute(
        #     select(User)
        #     .join(Role)
        #     .where(or_(Role.name == "admin", Role.name == "manager"))
        #     .options(joinedload(User.role))
        # )
        # privileged_users = result.unique().scalars().all()
        # print(f"   Found {len(privileged_users)} admin or manager users")
        # for user in privileged_users:
        #     print(f"   - {user.username} ({user.role.name})")

        print("\n" + "=" * 60)
        print("✅ Practice complete! Keep practicing!")
        print("=" * 60)


# ============================================================
# HELPER FUNCTIONS - Use these for more complex queries
# ============================================================

async def print_query_result(result, description: str):
    """
    Helper function to print query results in a formatted way.
    
    Usage:
        result = await session.execute(select(User))
        await print_query_result(result, "All users")
    """
    print(f"\n{description}:")
    print("-" * 60)
    # This is a placeholder - customize based on what you're querying
    pass


# ============================================================
# MAIN ENTRY POINT
# ============================================================

if __name__ == "__main__":
    # Run the async practice function
    asyncio.run(practice_queries())
```

## 7. Next Steps

- **Today:** Design your domain model for HW2
- **Tuesday:** Implementation studio - we'll build together
- **HW2:** Implement Module CRUD based on your design

## Resources

- **SQLAlchemy Relationships:** https://docs.sqlalchemy.org/en/20/orm/basic_relationships.html
- **Look at existing models:** `backend/models/` in your codebase
- **Example relationships:** UserGroup, CourseGroup show many-to-many patterns
