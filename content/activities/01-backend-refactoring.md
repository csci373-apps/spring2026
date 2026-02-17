---
title: "Design Principles for Coding"
start_date: "2026-02-05"
type: "activity"
draft: 0
heading_max_level: 3
---


## What Makes Code "Good"?

Good code is code that's easy to understand and easy to change. Good code is clear, has good test coverage, is maintainable, and works.

There are principles that help us write good code. These principles are guidelines, not rules. They help us make decisions when coding. Today, we'll learn four key principles.

**Assigned Reading:** See [Clean Code Best Practices](/spring2026/resources/howto-05-clean-code) for a comprehensive reference guide.


## 1. Cohesion

Cohesion is how well the parts of a module/class/function work together.

- **Low cohesion:** Parts of the class do unrelated things
- **High cohesion:** All parts work toward one goal

### 1.1. Low cohesion example

```python
# Low cohesion: Does too many things
class UserService:
    def create_user(self, username, email, password):
        # Create user logic
        pass
    
    def send_email(self, to, subject, body):
        # Email logic (unrelated to user creation)
        pass
    
    def calculate_statistics(self):
        # Statistics logic (unrelated to user creation)
        pass
```

### 1.2. High cohesion example

```python
# High cohesion: Does one thing well
class UserService:
    def create_user(self, username, email, password):
        # Create user logic
        pass
    
    def update_user(self, user_id, data):
        # Update user logic
        pass
    
    def delete_user(self, user_id):
        # Delete user logic
        pass
```

> **Takeaway:** High cohesion means each class/function has **one clear responsibility**.

### 2. Coupling

**Coupling** is how much one module depends on another.
- **Low coupling:** Modules are independent (Good)
- **High coupling:** Modules are tightly connected


### 2.1. High coupling

```python
# High coupling: Directly depends on database
class UserService:
    def get_user(self, user_id):
        db = get_db()
        return db.query(User).filter(User.id == user_id).first()
```

### 2.2. Low coupling

```python
# Low coupling: Depends on abstraction
class UserService:
    def __init__(self, user_repository):
        self.user_repository = user_repository
    
    def get_user(self, user_id):
        return self.user_repository.find_by_id(user_id)
```

> **Takeaway:** Low coupling means changes in one module don't break others.

## 3. DRY (Don't Repeat Yourself)

**DRY** stands for "Don't Repeat Yourself."
- **Why:** Repeated code is hard to maintain
- **When:** Extract common code into functions/classes

### 3.1. Not Dry

```python
# Not DRY: Repeated code
def create_group(name, description):
    # Validation logic
    if not name or len(name) > 100:
        raise ValueError("Invalid name")
    if description and len(description) > 1000:
        raise ValueError("Invalid description")
    # Create logic
    group = Group(name=name, description=description)
    db.add(group)
    db.commit()
    return group

def create_course(title, description):
    # Validation logic (repeated!)
    if not title or len(title) > 200:
        raise ValueError("Invalid title")
    if description and len(description) > 1000:
        raise ValueError("Invalid description")
    # Create logic
    course = Course(title=title, description=description)
    db.add(course)
    db.commit()
    return course
```

### 3.2. Dry
Adding a helper function to handle validation consistently:

```python
# DRY: Extract common code
def validate_text_field(value, field_name, max_length):
    if not value or len(value) > max_length:
        raise ValueError(f"Invalid {field_name}")

def create_group(name, description):
    validate_text_field(name, "name", 100)
    validate_text_field(description, "description", 1000)
    group = Group(name=name, description=description)
    db.add(group)
    db.commit()
    return group

def create_course(title, description):
    validate_text_field(title, "title", 200)
    validate_text_field(description, "description", 1000)
    # Create logic
    course = Course(title=title, description=description)
    db.add(course)
    db.commit()
    return course
```

> **Takeaway:** DRY means extract common code, but don't over-abstract.

## 4. Size

**Size** refers to how long functions/classes are.
- **Small is better:** Easier to understand, test, and maintain
- **Rule of thumb:** Functions < 20 lines, classes < 200 lines

### 4.1. Too Long

```python
# Too long: Hard to understand
def process_user_registration(username, email, password, profile_data):
    # 50 lines of validation
    # 30 lines of database operations
    # 20 lines of email sending
    # 15 lines of logging
    # Total: 115 lines!

```

### 4.2. Better

```python
# Better: Break into smaller functions
def validate_registration_data(username, email, password):
    # 10 lines
    pass

def create_user_account(username, email, password):
    # 15 lines
    pass

def send_welcome_email(email):
    # 10 lines
    pass

def process_user_registration(username, email, password, profile_data):
    validate_registration_data(username, email, password)
    user = create_user_account(username, email, password)
    send_welcome_email(email)
    return user
```

> **Takeaway:** Small functions are easier to understand, test, and maintain.

## 5. Other Considerations

- **Magic Numbers:** Hard-coded values with unclear meaning (extract to named constants)
- **Unclear Names:** Variables/functions that don't clearly describe what they do
- **Deep Nesting:** Multiple levels of if/for/while statements (use early returns or extract functions)
- **Excessive Comments:** Comments explaining *what* code does (code should be self-explanatory; comments should explain *why*)
- **Too Many Function Arguments:** Functions with many parameters (consider using objects/structs)
- **Global Variables:** Using global state instead of passing data as arguments (makes code harder to test)
- **Side Effects:** Functions that modify state outside their scope (mutate globals, modify inputs, change database) - prefer pure functions when possible

See [Clean Code Best Practices](/spring2026/resources/howto-05-clean-code) for a comprehensive reference guide.


> ## Summary
> 
> - **Cohesion:** One responsibility per class/function
> - **Coupling:** Minimize dependencies
> - **DRY:** Don't repeat code
> - **Size:** Keep functions and classes small
> 
> **These principles help us write maintainable code.**

