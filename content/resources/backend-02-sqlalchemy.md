---
title: "SQLAlchemy Models and Queries"
group: "Backend"
group_order: 3
order: 2
---

**SQLAlchemy** is an Object-Relational Mapping (ORM) library that lets you interact with databases using Python classes instead of SQL. In the starter code, we use **async SQLAlchemy** for asynchronous database operations.

## Defining a Model

SQLAlchemy models represent database tables as Python classes:

```python
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    
    # Relationships
    role = relationship("Role", backref="users")
```

## Common Column Types

- `Integer` - Whole numbers
- `String(length)` - Text with max length
- `Boolean` - True/False
- `DateTime` - Date and time
- `Date` - Date only
- `ForeignKey("table.id")` - References another table

## Relationships

### One-to-Many

A user has many user groups:

```python
class User(Base):
    # ...
    user_groups = relationship("UserGroup", backref="user")
```

What does this mapping allow? 

```python
async def get_user_groups(db: AsyncSession, user_id: int):
    # Get a user and access their groups
    user = await db.get(User, user_id)
    for group in user.user_groups:  # Access related groups
        print(group.name)
```

* When you access `user.user_groups`, SQLAlchemy automatically executes a SQL query (like `SELECT * FROM user_groups WHERE user_id = ?`) to fetch the related records. 
* This is convenient, but accessing relationships for multiple users in a loop causes the N+1 problem (explained in detail below) -- one query per user. Use `joinedload` to eager load relationships and avoid this performance issue. 

### Many-to-One

A user belongs to one role:

```python
class User(Base):
    # ...
    role_id = Column(Integer, ForeignKey("roles.id"))
    role = relationship("Role", backref="users")
```

This allows you to access the related role:

```python
async def get_user_role(db: AsyncSession, user_id: int):
    # Get a user and access their role
    user = await db.get(User, user_id)
    role_name = user.role.name  # Access the related role
    print(f"User has role: {role_name}")

async def get_role_users(db: AsyncSession, role_id: int):
    # The backref also works in reverse - get all users with a role
    role = await db.get(Role, role_id)
    for user in role.users:  # Access all users with this role
        print(user.username)
```

* When you access `user.role`, SQLAlchemy executes a SQL query like `SELECT * FROM roles WHERE id = ?` to fetch the related role. 
* Similarly, when you access `role.users`, it executes `SELECT * FROM users WHERE role_id = ?` to get all users with that role. Each dot notation access triggers a separate database query, which is why eager loading is important when you know you'll need related data.

### Many-to-Many

Users belong to many groups, groups have many users:

```python
# Association table
user_groups = Table(
    'user_groups',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('group_id', Integer, ForeignKey('groups.id'))
)

class User(Base):
    groups = relationship("Group", secondary=user_groups, backref="users")
```

This allows you to access groups from users and users from groups:

```python
async def get_user_groups(db: AsyncSession, user_id: int):
    # Get a user and access their groups
    user = await db.get(User, user_id)
    for group in user.groups:  # Access all groups the user belongs to
        print(group.name)

async def get_group_users(db: AsyncSession, group_id: int):
    # The backref also works in reverse - get all users in a group
    group = await db.get(Group, group_id)
    for user in group.users:  # Access all users in this group
        print(user.username)
```

* For many-to-many relationships, SQLAlchemy uses the association table to join the data. When you access `user.groups`, it executes a SQL query that joins through the `user_groups` table: `SELECT groups.* FROM groups JOIN user_groups ON groups.id = user_groups.group_id WHERE user_groups.user_id = ?`. 
* The reverse (`group.users`) works similarly, joining through the association table to get all users in that group. Each relationship access triggers a separate query, so use eager loading when you need related data.

## Querying with Async SQLAlchemy

All database operations with async SQLAlchemy must be inside an `async def` function, and you use `await` to wait for the database query to complete.

### Basic Queries

```python
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

async def get_all_users(db: AsyncSession):
    # Get all users
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

async def get_user_by_id(db: AsyncSession, user_id: int):
    # Get one user by ID
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    return user
```

### Filtering

```python
async def filter_by_username(db: AsyncSession):
    # Simple filter
    result = await db.execute(
        select(User).where(User.username == "john")
    )
    user = result.scalar_one_or_none()
    return user

async def filter_multiple(db: AsyncSession):
    # Multiple filters
    result = await db.execute(
        select(User).where(
            User.is_active == True,
            User.role_id == 1
        )
    )
    users = result.scalars().all()
    return users

async def filter_with_or(db: AsyncSession):
    # Using AND/OR
    from sqlalchemy import or_, and_

    result = await db.execute(
        select(User).where(
            or_(
                User.username == "john",
                User.email == "john@example.com"
            )
        )
    )
    users = result.scalars().all()
    return users
```

### Ordering

```python
async def get_users_ascending(db: AsyncSession):
    # Ascending (default)
    result = await db.execute(
        select(User).order_by(User.created_at)
    )
    users = result.scalars().all()
    return users

async def get_users_descending(db: AsyncSession):
    # Descending
    result = await db.execute(
        select(User).order_by(User.created_at.desc())
    )
    users = result.scalars().all()
    return users
```

### Eager Loading Relationships

Use `joinedload` to avoid N+1 query problems. The **N+1 problem** occurs when you fetch N records and then make N additional queries to get related data, resulting in N+1 total queries instead of just 1 or 2.

**Example of N+1 problem:**
```python
async def get_users_with_roles_n_plus_one(db: AsyncSession):
    # This executes 1 query to get 10 users
    result = await db.execute(select(User))
    users = result.scalars().all()

    # Then 10 more queries (one per user) to get each user's role
    for user in users:
        print(user.role.name)  # Each access triggers: SELECT * FROM roles WHERE id = ?
    # Total: 11 queries (1 + 10)
```

**Solution: Use eager loading with `joinedload`:**

```python
from sqlalchemy.orm import joinedload

async def get_users_with_roles(db: AsyncSession):
    # Load users with their roles in a single query
    result = await db.execute(
        select(User).options(joinedload(User.role))
    )
    users = result.unique().scalars().all()
    # Total: 1 query with a JOIN
    for user in users:
        print(user.role.name)  # No additional queries - data already loaded
    return users
```

**How `joinedload` works:**

1. Add `.options(joinedload(RelationshipName))` to your `select()` statement
2. The relationship name matches the attribute on your model (e.g., `User.role` for a `role` relationship)
3. SQLAlchemy executes a single query with a JOIN to fetch both the main records and related data
4. Use `.unique()` when loading one-to-many or many-to-many relationships to avoid duplicate rows
5. Access the relationship normally -- the data is already loaded, so no additional queries are executed

**Loading multiple relationships:**

```python
async def get_users_with_all_relationships(db: AsyncSession):
    # Load users with both role and groups
    result = await db.execute(
        select(User).options(
            joinedload(User.role),
            joinedload(User.user_groups)
        )
    )
    users = result.unique().scalars().all()
    return users
```

**Nested relationships:**

```python
async def get_users_with_nested_relationships(db: AsyncSession):
    # Load users with roles, and roles with their permissions
    result = await db.execute(
        select(User).options(
            joinedload(User.role).joinedload(Role.permissions)
        )
    )
    users = result.unique().scalars().all()
    return users
```

### Creating Records

```python
async def create_user(db: AsyncSession, username: str, email: str, hashed_password: str):
    new_user = User(
        username=username,
        email=email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)  # Refresh to get generated ID
    return new_user
```

### Updating Records

```python
async def update_user(db: AsyncSession, user_id: int, new_username: str):
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if user:
        user.username = new_username
        await db.commit()
        await db.refresh(user)
        return user
    return None
```

### Deleting Records

```python
async def delete_user(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if user:
        await db.delete(user)
        await db.commit()
        return True
    return False
```

## Common Query Methods

- `scalars().all()` - Get all results as a list
- `scalar_one()` - Get exactly one result (raises if 0 or multiple)
- `scalar_one_or_none()` - Get one result or None (raises if multiple)

## Common Mistakes

1. **Forgetting `await db.commit()`** after making changes
2. **Not handling `scalar_one_or_none()`** - it can return `None`
3. **Not using `joinedload`** for relationships, causing N+1 queries
4. **Mixing sync and async** - use `async def` and `await` consistently
5. **Forgetting `result.unique()`** when using `joinedload` with one-to-many relationships

## Resources

- <a href="https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html" target="_blank" rel="noopener noreferrer">SQLAlchemy Async Documentation</a>
- <a href="https://docs.sqlalchemy.org/en/20/orm/basic_relationships.html" target="_blank" rel="noopener noreferrer">SQLAlchemy Relationships</a>

