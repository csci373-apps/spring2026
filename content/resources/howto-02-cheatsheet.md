---
title: "Development Cheatsheet"
group: "How To Guides"
group_order: 2
order: 2
quicklink: 1
heading_max_level: 2
---

Quick reference for common development commands.

## 1. Docker Commands

### 1.1. Starting and Stopping

```bash
# Start all containers (detached mode)
docker compose up -d

# Start containers and rebuild images
docker compose up --build -d

# Stop all containers
docker compose down

# Stop containers and remove volumes
docker compose down -v

# View running containers
docker compose ps

# View logs (follow mode)
docker compose logs -f

# View logs for specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### 1.2. Rebuilding

```bash
# Completely rebuild everything (removes images, volumes, and orphans)
docker compose down --rmi all -v --remove-orphans
docker compose up --build -d

# Rebuild specific service
docker compose up --build -d backend
docker compose up --build -d frontend
```

### 1.3. Container Access

```bash
# Access backend container shell
docker exec -it tma_backend bash

# Access frontend container shell
docker exec -it tma_frontend bash

# Access database container shell
docker exec -it tma_db bash
```

## 2. Database Commands

### 2.1. Populating the Database

```bash
# Reset and populate database (drops all tables, recreates with fresh data)
docker exec -it tma_backend poetry run python scripts/populate.py --reset

# Append to existing database (doesn't drop tables)
docker exec -it tma_backend poetry run python scripts/populate.py
```

### 2.2. Database Access

```bash
# Connect to PostgreSQL via psql
docker exec -it tma_db psql -U postgres -d tma_db
```

### 2.3. Database Queries

Once connected to psql, you can run SQL commands:

```sql
-- List all tables
\dt

-- Describe a specific table structure (replace users with the name of the table)
\d users

-- Query a table
SELECT * FROM users LIMIT 10;

-- Query with conditions
SELECT username, email, first_name, last_name FROM users WHERE role_id = 1;

-- Count records
SELECT COUNT(*) FROM users;

-- Join tables
SELECT u.username, g.name as group_name 
FROM users u 
JOIN user_groups ug ON u.id = ug.user_id 
JOIN groups g ON ug.group_id = g.id;

-- Exit psql
\q
```

### 2.4. Quick Database Queries (from command line)

```bash
# Run a single SQL query without entering psql
docker exec -it tma_db psql -U postgres -d tma_db -c "SELECT COUNT(*) FROM users;"

# List all tables
docker exec -it tma_db psql -U postgres -d tma_db -c "\dt"

# Query users table
docker exec -it tma_db psql -U postgres -d tma_db -c "SELECT username, email FROM users LIMIT 5;"
```

## 3. Backend Commands (Python)

### 3.1. Linting and Formatting: Simple

```bash
# Check formatting (no changes) - uses flake8, isort, black
docker exec -it tma_backend bash scripts/check.sh

# Auto-fix formatting and linting - uses isort, black
docker exec -it tma_backend bash scripts/fix.sh
```

### 3.2. Testing

```bash
# Run all backend tests
docker exec -it tma_backend poetry run pytest

# Run tests with verbose output
docker exec -it tma_backend poetry run pytest -v

# Run specific test file
docker exec -it tma_backend poetry run pytest tests/path/to/test_file.py

# Run tests with coverage
docker exec -it tma_backend poetry run pytest --cov
```

## 4. Frontend Commands (React/TypeScript)

### 4.1. Linting and Formatting: Simple

```bash
# Check for linting, formatting, and typescript errors (no changes)
docker exec -it tma_frontend npm run check

# Auto-fix linting and formatting 
# (fix will only fix the simplest problems...most will need to be resolved manually)
docker exec -it tma_frontend npm run fix
```

### 4.2. Linting and Formatting: Individual Tools

```bash
# Individual tools:
# Check linting (won't fix anything...a read-only command)
docker exec -it tma_frontend npm run lint:check

# Fix linting issues
# Fix will only fix the simplest problems...most will need to be resolved manually.
docker exec -it tma_frontend npm run lint:fix

# Format code
docker exec -it tma_frontend npm run format:fix

# Check formatting (no changes)
docker exec -it tma_frontend npm run format:check

# Type checking
docker exec -it tma_frontend npm run type-check
```

### 4.3. Testing

```bash
# Run frontend tests
docker exec -it tma_frontend npm run test:verbose

# Run tests in watch mode
docker exec -it tma_frontend npm run test:watch
```

## 5. Mobile App Commands (React Native/Expo)

### 5.1. Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start Expo development server
npm start
```

### 5.2. Running

```bash
# Run the ap
npx expo start

# iOS simulator: press i

# Android emulator: press a

# Run on web: press w
```

### 5.3. Linting and Formatting: Simple

```bash
# Navigate to mobile directory first
cd mobile

# Check for linting, formatting, and typescript errors (no changes)
npm run check

# Auto-fix linting and formatting
npm run fix
```

### 5.4. Linting and Formatting: Individual Tools

```bash
# Individual tools:
# Check linting
npm run lint:check

# Fix linting issues
# Fix will only fix the simplest problems...most will need to be resolved manually.
npm run lint:fix

# Format code
npm run format:fix

# Check formatting (no changes)
npm run format:check

# Type checking
npm run type-check
```

### 5.5. Testing

```bash
# Navigate to mobile directory first
cd mobile

# Run mobile tests
npm run test:verbose

# Run tests in watch mode
npm run test:watch

# Run tests (basic)
npm run test
```

## 6. Quick Workflows

### 6.1. Before Committing Code

**Format & test the backend:**
```bash
# Auto-fix formatting (note that you will have to make some changes manually)
docker exec -it tma_backend bash scripts/fix.sh

# Run tests
docker exec -it tma_backend poetry run pytest
```

**Format & test the frontend:**
```bash
# Auto-fix linting and formatting
docker exec -it tma_frontend npm run fix

# Run tests
docker exec -it tma_frontend npm run test:verbose
```

**Format & test the mobile app:**
```bash
# Navigate to mobile directory
cd mobile

# Auto-fix linting and formatting
npm run fix

# Run tests
npm run test:verbose
```

### 6.2. Complete Reset (Fresh Start)
...because sometimes, you just need to start over.

```bash
# Stop and remove everything
docker compose down --rmi all -v --remove-orphans

# Rebuild and start
docker compose up --build -d

# Populate database
docker exec -it tma_backend poetry run python scripts/populate.py --reset
```

### 6.3. View Logs for Debugging

```bash
# All services
docker compose logs -f

# Backend only
docker compose logs -f backend

# Frontend only
docker compose logs -f frontend

# Database only
docker compose logs -f db
```

## 7. Access Points

- **Frontend (Web App):** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Database:** localhost:5433

## 8. Default Credentials

After populating the database:
- **Admin:** `admin` / `password`
- **Regular User:** `user` / `password`

Check `backend/scripts/sample_data/users.csv` for all available users (and feel free to modify it to meet your needs...these are just "fake" accounts for testing).

## 9. Git Commands

> **Note:** For workflow concepts, PR guidelines, and detailed explanations, see the [Git Workflow Guide](/resources/git-workflow).

### 9.1. Branching

```bash
# Create and switch to a new branch
git checkout -b your-branch-name

# Switch to an existing branch
git checkout main
git checkout your-branch-name

# List all branches
git branch

# List all branches (including remote)
git branch -a
```

### 9.2. Committing

```bash
# Stage all changes
git add .

# Stage specific files
git add path/to/file.py

# Commit with message
git commit -m "Your commit message"

# Amend the last commit (update it)
git commit --amend --no-edit
git commit --amend -m "Updated commit message"

# View commit history
git log

# View commit history (compact)
git log --oneline
```

### 9.3. Rebasing

```bash
# Update main branch
git checkout main
git pull

# Rebase your branch onto latest main
git checkout your-branch
git rebase main

# Continue rebase after resolving conflicts
git add .  # stage the edits you made
git rebase --continue

# Abort rebase if something goes wrong
git rebase --abort
```

### 9.4. Pushing

```bash
# Push branch to remote
git push origin your-branch-name

# Force push (only on feature branches, after rebase/amend)
git push --force-with-lease origin your-branch-name

# ⚠️ NEVER force push to main!
```

### 9.5. Updating and Syncing

```bash
# Update local main branch
git checkout main
git pull origin main

# Fetch latest changes without merging
git fetch origin

# See what files have changed
git status

# See differences in working directory
git diff

# See differences for staged files
git diff --staged
```

### 9.6. Stashing (Temporary Save)

```bash
# Save current changes temporarily
git stash

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{0}
```
