---
title: "Clean Code Best Practices"
group: "How To Guides"
group_order: 2
order: 5
quicklink: 1
heading_max_level: 3
---

Quick reference for writing and refactoring clean, maintainable code. Based on principles from *Clean Code* by Robert C. Martin.

## 1. Meaningful Names

### Use descriptive names
- **Good:** `get_user_by_email()`, `validate_group_name()`, `calculate_member_count()`
- **Bad:** `get()`, `validate()`, `calc()`, `temp`, `data`

### Use searchable names
- Avoid "magic numbers": use named constants (e.g., `MAX_GROUP_SIZE = 50`)
- **Good:** 
    ```py
    if len(members) > MAX_GROUP_SIZE:  # the conditional is checking a named constraint
    ```

- **Bad:** 
    ```py
    if len(members) > 50:  # what's the significance of "50"?
    ```

### Use consistent vocabulary
- Pick one word per concept (don't mix `fetch`, `get`, `retrieve`)
- Use domain terminology from your problem space

## 2. Functions

### Keep functions small
- Functions should do **one thing** (single responsibility)
- Aim for < 20 lines when possible
- If a function is hard to name, it's probably doing too much

### Extract functions to improve clarity
```python
# Before: Long function doing multiple things
def process_user_registration(user_data):
    # Validate email
    if not "@" in user_data.email:
        raise ValueError("Invalid email")
    # Hash password
    hashed = bcrypt.hashpw(user_data.password.encode(), bcrypt.gensalt())
    # Create user
    user = User(email=user_data.email, password=hashed)
    db.add(user)
    db.commit()
    return user

# After: Extracted into focused functions
def validate_email(email: str) -> None:
    if not "@" in email:
        raise ValueError("Invalid email")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

def process_user_registration(user_data):
    validate_email(user_data.email)
    hashed = hash_password(user_data.password)
    user = User(email=user_data.email, password=hashed)
    db.add(user)
    db.commit()
    return user
```

### Function arguments
- Prefer fewer arguments (0-2 is ideal)
- Avoid boolean flags that change function behavior (extract separate functions instead)

## 3. Classes

### Single Responsibility Principle
- A class should have **one responsibility**
- If requirements change in multiple areas, you shouldn't need to modify the same class
- If you can't describe what a class does in one sentence, it's probably doing too much

**Example:**
```python
# Bad: Multiple reasons to change this class
class UserManager:
    def validate_email(self, email):  # Changes if validation rules change
        ...
    def save_to_database(self, user):  # Changes if database schema changes
        ...
    def send_welcome_email(self, user):  # Changes if email format changes
        ...
    def log_user_action(self, action):  # Changes if logging requirements change
        ...

# Good: Each class has one responsibility (one reason to change)
class EmailValidator:
    def validate(self, email):  # Only changes if validation rules change
        ...

class UserRepository:
    def save(self, user):  # Only changes if database schema changes
        ...

class EmailService:
    def send_welcome(self, user):  # Only changes if email format changes
        ...
```

### Class size and cohesion
- Classes should be **small and focused**
- All methods should work together toward the class's single purpose
- If methods don't relate to each other, consider splitting the class

### Prefer arguments over global variables
- **Pass data as arguments** - Makes dependencies explicit and functions testable
- **Avoid global state** - Hard to test, creates hidden dependencies

```python
# Bad: Using global variable
db_connection = None  # global

def get_user(user_id):
    return db_connection.query(User).filter_by(id=user_id).first()

# Good: Pass as argument
def get_user(user_id, db):
    return db.query(User).filter_by(id=user_id).first()

# Even better: Use dependency injection
class UserRepository:
    def __init__(self, db):
        self.db = db
    
    def get_user(self, user_id):
        return self.db.query(User).filter_by(id=user_id).first()
```

### When to use classes vs functions
- **Use functions** for stateless operations (pure functions, utilities)
- **Use classes** when you need to:
  - Maintain state across multiple operations
  - Group related functionality together
  - Encapsulate data and behavior

```python
# Good: Function for stateless operation
def calculate_total(items):
    return sum(item.price for item in items)

# Good: Class for stateful operations
class ShoppingCart:
    def __init__(self):
        self.items = []
    
    def add_item(self, item):
        self.items.append(item)
    
    def get_total(self):
        return sum(item.price for item in self.items)
```

### Class design principles
- **High cohesion**: All methods work toward the class's purpose
- **Low coupling**: Class doesn't depend on too many other classes
- **Encapsulation**: Hide internal details, expose only what's needed

## 4. "Code Smells" to Watch For

### Long functions
- **Symptom:** Function > 20 lines, hard to understand
- **Fix:** Extract smaller functions with single responsibilities

### Duplicated code (DRY violations)
- **Symptom:** Same logic appears in multiple places
- **Fix:** Extract to a shared function or utility

### Low cohesion
- **Symptom:** Function does multiple unrelated things
- **Fix:** Split into separate functions, each with one responsibility

### Unclear names
- **Symptom:** Can't tell what a function/variable does from its name
- **Fix:** Rename to be more descriptive

### Magic numbers/strings
- **Symptom:** Hard-coded values with unclear meaning
- **Fix:** Extract to named constants

### Deep nesting
- **Symptom:** Multiple levels of if/for/while statements (3+ levels deep)
- **Fix:** Extract nested logic into separate functions, use early returns, or combine conditions

```python
# Bad: Deep nesting
def process_user(user):
    if user:
        if user.is_active:
            if user.has_permission:
                if user.credits > 0:
                    # do something
                    pass

# Good: Early returns and extracted functions
def process_user(user):
    if not user or not user.is_active:
        return
    if not user.has_permission:
        return
    if user.credits <= 0:
        return
    # do something
    pass
```

### Excessive comments
- **Symptom:** Comments explaining *what* the code does (code should be self-explanatory)
- **Fix:** Make code clearer with better names and structure, remove redundant comments
- **Note:** Comments are good for explaining *why* (business logic, non-obvious decisions)

```python
# Bad: Comment explains what code does
def calc_total(items):
    total = 0  # Initialize total to zero
    for item in items:  # Loop through items
        total += item.price  # Add price to total
    return total  # Return total

# Good: Code is self-explanatory
def calculate_total(items):
    return sum(item.price for item in items)

# Good: Comment explains why
def calculate_discount(price):
    # Apply 10% discount for early-bird customers (business rule from 2024)
    return price * 0.9
```

### Side effects
- **Symptom:** Function modifies state outside its scope (mutates globals, modifies input parameters, changes database)
- **Fix:** Prefer pure functions when possible; make side effects explicit and documented
- **Note:** Some side effects are necessary (database writes, API calls), but minimize them and make them obvious

```python
# Bad: Hidden side effect (modifies global state)
user_count = 0  # global variable

def process_user(user_data):
    global user_count
    user = create_user(user_data)
    user_count += 1  # Side effect: modifies global
    return user

# Bad: Mutates input parameter unexpectedly
def update_user_email(user, new_email):
    user.email = new_email  # Mutates input - caller might not expect this
    return user

# Good: Pure function (no side effects)
def calculate_user_age(birth_date):
    return (datetime.now() - birth_date).days // 365

# Good: Side effect is explicit and necessary
def save_user_to_database(user, db):
    """Saves user to database. Side effect: modifies database state."""
    db.add(user)
    db.commit()
    return user

# Good: Returns new object instead of mutating input
def update_user_email(user, new_email):
    """Returns new user object with updated email. Does not mutate input."""
    return User(
        id=user.id,
        email=new_email,
        name=user.name
    )
```

## 5. Refactoring Safely

### Use tests as guardrails
1. **Write/update tests first** - Ensure you have coverage
2. **Run tests** - Establish baseline (all tests pass)
3. **Make small changes** - Extract one function at a time
4. **Run tests after each change** - Verify behavior unchanged
5. **If tests break** - Fix before continuing

### Refactoring workflow
```bash
# 1. Run tests to establish baseline
docker exec -it tma_backend poetry run pytest -v

# 2. Make small refactoring change
# (extract one function, rename one variable, etc.)

# 3. Run tests again
docker exec -it tma_backend poetry run pytest -v

# 4. If tests pass, commit and continue
# If tests fail, fix the issue before proceeding
```

## 6. Design Principles

### Cohesion
- Functions should have **high cohesion**: all parts work toward a single goal
- Each function should have **one reason to change**

### DRY (Don't Repeat Yourself)
- Extract repeated logic into reusable functions
- But don't over-abstract: some duplication is acceptable if it improves clarity

### Clarity over cleverness
- Prefer readable, obvious code over clever one-liners
- Code is read more often than it's written

## 7. Quick Checklist

Before submitting code, ask:
- [ ] Are function names descriptive? Can I tell what they do?
- [ ] Are functions small and focused? Do they do one thing?
- [ ] Does each class have a single, clear responsibility?
- [ ] Are dependencies passed as arguments (not global variables)?
- [ ] Is there duplicated code that could be extracted?
- [ ] Are there magic numbers/strings that should be constants?
- [ ] Is there deep nesting that could be simplified?
- [ ] Are comments explaining *what* instead of *why*?
- [ ] Are there hidden side effects (mutating globals, modifying inputs)?
- [ ] Would a new team member understand this code?
- [ ] Do tests still pass after refactoring?

## Further Reading

- *Clean Code* by Robert C. Martin: Chapters 2 (Names), 3 (Functions), 10 (Classes), 17 (Smells)
- See [HW3](/spring2026/assignments/hw03) for hands-on refactoring practice
