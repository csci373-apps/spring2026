---
title: JWTs and Authentication
type: resource
group: "Backend"
group_order: 3
order: 4
---

**Authentication** is the process of verifying a user's identity.  **Authorization** determines what actions an authenticated user can perform. To perform these actions, Web-based APIs use various authentication methods, including session-based authentication (stateful, server-side sessions) and **JSON Web Tokens (JWTs)** (stateless, self-contained tokens). 

For the **Three Moves Ahead** application, we use JWTs because we support both web and native (mobile) clients. Session-based authentication works well for traditional web applications (where cookies are automatically sent with requests), but it's less suitable for mobile apps and single-page applications. JWTs are stateless and don't require server-side session storage, making them ideal for cross-platform authentication. The same backend API can authenticate both web and mobile clients using the same JWT-based approach -- the client stores the token and embeds it as an `Authorization` header for each HTTP request.

JWTs encode user identity (and sometimes roles) in the token itself, though permissions are typically checked server-side against the database. This guide covers how to implement secure authentication in FastAPI using JWTs, password hashing, and role-based access control.

## What is a JWT?

A **JWT (JSON Web Token)** is a compact, URL-safe token format that contains encoded information about a user. JWTs have three parts separated by dots:

1. **Header**: Specifies the token type and signing algorithm
2. **Payload**: Contains data about the user (e.g., username, role, expiration time)
3. **Signature**: Ensures the token hasn't been tampered with

JWTs are **stateless** -- the server doesn't need to store session data. Instead, the token itself contains all the information needed to verify the user's identity. When a user logs in, the server creates a JWT and sends it to the client. The client then includes this token in subsequent requests (typically in the `Authorization: Bearer <token>` header), and the server validates it to determine who is making the request. 

> **Important Security Note:** JWT payloads are **base64-encoded, not encrypted**. Anyone who has the token can decode it and read the contents (though they cannot modify it without invalidating the signature). Therefore, **never store sensitive data** (like passwords, credit card numbers, or other personally identifiable information) in JWT payloads. Only include non-sensitive identifying information like usernames, user IDs, and roles.

For more information, see the <a href="https://jwt.io/introduction" target="_blank" rel="noopener noreferrer">JWT.io introduction</a>.

## Password Hashing

**Never store passwords in plain text.** Instead, passwords should be hashed using a one-way cryptographic function. The starter code uses **bcrypt**, a secure password hashing algorithm that automatically handles salting (adding random data to prevent rainbow table attacks<a href="#rainbow-table-note"><sup>1</sup></a>).

### Hashing Passwords

When a user registers or changes their password, hash it before storing:

```python
from auth import get_password_hash

# When creating a new user
hashed_password = get_password_hash(password)
db_user = User(
    username=username,
    email=email,
    # Store the hash, not the plain password
    hashed_password=hashed_password,  
    # ... other fields
)
```

The `get_password_hash` function uses SHA256 pre-hashing (to handle bcrypt's 72-byte limit) followed by bcrypt hashing with 12 rounds. This ensures passwords are securely hashed even if the database is compromised.

### Verifying Passwords

When a user logs in, verify their password against the stored hash:

```python
from auth import verify_password

# During login
user = await get_user_by_username(username, db)
is_verified = verify_password(plain_password, user.hashed_password)
if not user or not is_verified:
    raise HTTPException(
        status_code=401,
        detail="Incorrect username or password"
    )
```

The `verify_password` function compares the plain password (after hashing) against the stored hash. If they match, the user is authenticated.

## Creating JWT Tokens

After successfully authenticating a user, create a JWT token containing their identity and role:

```python
from datetime import timedelta
from auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

# After verifying username/password
access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
access_token = create_access_token(
    data={
        "sub": user.username,      
        "user_id": user.id,
        "role": user.role.name
    },
    expires_delta=access_token_expires
)

# Return token to client
return {"access_token": access_token, "token_type": "bearer"}
```

The `create_access_token` function:
1. Takes a dictionary of data to encode in the token
2. Adds an expiration time
3. Signs the token using a secret key
4. Returns the encoded JWT string

**Important:** The `SECRET_KEY` used to sign tokens must be kept secret. In production, store it as an environment variable, never commit it to version control.

## Validating JWT Tokens

To protect an endpoint, you need to extract and validate the JWT token from each request. The validation process involves:

1. **Extract the token** from the `Authorization: Bearer <token>` header
2. **Decode and validate** the token using the secret key (this verifies the signature and checks expiration)
3. **Extract user information** from the token payload (e.g., username from the `sub` field)
4. **Load the user** from the database to ensure they still exist and are active
5. **Return the authenticated user** (or raise an exception if validation fails)

In FastAPI, this is typically implemented as a dependency function that can be reused across endpoints:

```python
async def get_current_user(
    token: str = Depends(get_bearer_token),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get the current authenticated user from JWT token"""
    # Decode token, extract username, load user from database
    # Returns User or raises HTTPException if invalid
    ...
```

The starter code provides a `get_current_user` dependency that handles all of this validation automatically. If the token is invalid, expired, or the user doesn't exist, it raises a `401 Unauthorized` exception.

## Protecting Endpoints

Use the `get_current_user` dependency to require authentication for an endpoint:

```python
@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
):
    """Get the current authenticated user's information"""
    return current_user
```

If a request doesn't include a valid token, FastAPI automatically returns a `401 Unauthorized` response. The `current_user` parameter will contain the authenticated `User` object, which you can use in your endpoint logic.


## Role-Based Access Control

**Role-based access control** restricts access based on a user's role (e.g., admin, manager, user). Create dependencies that check the user's role:

```python
async def require_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Dependency to require admin role"""
    if current_user.role is None or current_user.role.name != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Required role: admin",
        )
    return current_user

# Use in endpoint
@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    # Only admins can delete users
    current_user: User = Depends(require_admin),  
    db: AsyncSession = Depends(get_db),
):
    # ... delete user logic
```

## Security Best Practices

1. **Never store plain text passwords**: Always hash passwords using bcrypt or similar
2. **Use strong secret keys**: Generate a long, random `SECRET_KEY` and store it as an environment variable
3. **Set token expiration**: JWTs should expire (typically 15-30 minutes for access tokens)
4. **Use HTTPS in production**: JWTs are sent in headers, so use HTTPS to prevent interception
5. **Validate tokens on every request**: Always verify the token signature and expiration
6. **Store tokens securely on the client**: Use secure storage (e.g., `SecureStore` on mobile, `httpOnly` cookies on web)
7. **Handle token refresh**: For long-lived sessions, implement refresh tokens (separate from access tokens)
8. **Check user status**: Even with a valid token, verify the user account is still active
9. **Use role-based access control**: Don't rely solely on authentication -- check permissions too
10. **Log security events**: Log failed authentication attempts and authorization failures

## Complete Login Flow

The login process follows these steps:

1. **Authenticate the user**: Verify the username and password against the database
2. **Check account status**: Ensure the user account is active (not disabled)
3. **Create JWT token**: Generate a token containing the user's identity and role
4. **Return token to client**: Send the token in the response (typically as `{"access_token": "...", "token_type": "bearer"}`)

The starter code provides an `authenticate_user` function that handles password verification, and a `create_access_token` function that generates the JWT. If authentication fails at any step, the endpoint returns a `401 Unauthorized` or `403 Forbidden` error.

After receiving the token, the client stores it and includes it in the `Authorization` header for all subsequent requests:

```http
Authorization: Bearer <token>
```

The server validates this token on each request to determine the authenticated user.

## Summary

- **JWTs** are stateless tokens that encode user identity and permissions
- **Password hashing** (bcrypt) ensures passwords are never stored in plain text
- **Token creation** happens after successful authentication
- **Token validation** extracts user identity from the token on each request
- **Dependencies** (`Depends`) protect endpoints and provide authenticated users
- **Role-based access control** restricts access based on user roles
- **Security best practices** include strong secrets, token expiration, HTTPS, and proper validation

For more information, see:
- <a href="https://fastapi.tiangolo.com/tutorial/security/" target="_blank" rel="noopener noreferrer">FastAPI Security Documentation</a>
- <a href="https://jwt.io/introduction" target="_blank" rel="noopener noreferrer">JWT.io Introduction</a>
- <a href="https://github.com/pyca/bcrypt/" target="_blank" rel="noopener noreferrer">bcrypt Documentation</a>


## Notes
<a id="rainbow-table-note"></a><sup>1</sup> **Rainbow table attack**: A rainbow table is a precomputed table of password hashes for common passwords. If passwords are hashed without salting (adding random data), an attacker who gains access to the database can quickly look up common password hashes in a rainbow table to find the original passwords. Salting adds random data to each password before hashing, making rainbow tables ineffective because each password hash is unique even if the original password is the same.

