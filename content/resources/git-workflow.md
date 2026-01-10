---
title: "Git Workflow for Phase 1"
group: "How To Guides"
group_order: 2
order: 1
quicklink: 1
---

## Overview

This guide covers the Git workflow you'll use during Phase 1 of the course. In Phase 1, each team works in their own forked repository, and all team members are collaborators on that fork.

## Phase 1 Git Workflow

### 1. Feature Branches

Never commit directly to `main`. Create a branch for each feature/assignment:

```bash
git checkout -b your-branch
```

**Why?** Feature branches keep your work isolated and make it easier to review changes before they're merged into the main codebase.

### 2. Commit Logical Units of Work

Commit when you've completed a logical piece of work (not just every 5 minutes!)

**✅ Good times to commit:**
- You've completed a logical piece of work (e.g., "Add tests for login endpoint")
- Code compiles and tests pass (or at least doesn't break existing functionality)
- You've made a meaningful change worth documenting
- Clear commit messages that describe what changed and why

**❌ Bad times to commit:**
- Every 5 minutes "just to save" (use Git's stash instead: `git stash`)
- Code is broken and doesn't compile
- Incomplete features
- You're in the middle of implementing something
- You haven't tested your changes

**Rule of thumb:** Each commit should represent a working state that you'd be okay showing in a PR.

### 3. Clean Up Commits (Before Pushing)

Before pushing your branch, clean up your commit history.

**Amend the last commit** if you realize it's broken or incomplete:

```bash
# Fix the issue, then:
git add .
# Updates last commit without changing message
git commit --amend --no-edit  
# Or with new message:
git commit --amend -m "Add tests for login endpoint (fixed typo)"
```

**Rebase to clean up multiple commits** before pushing:

```bash
# Interactive rebase of last 3 commits:
git rebase -i HEAD~3
```

In the editor that opens:
- Change `pick` to `squash` to combine commits
- Change `pick` to `edit` to modify a commit
- Delete lines to remove commits

**Why clean up?** Your commit history tells a story. Make it a good one! Clean history makes code reviews easier and helps teammates understand what changed.

### 4. Push to Team's GitHub Repo

Push your cleaned-up branch:

```bash
git push origin your-branch
```

**If you've amended/rebased:** You may need to force push (only on feature branches!):

```bash
git push --force-with-lease origin your-branch
```

⚠️ **Never force push to `main`!** Only use `--force-with-lease` on your feature branches.

### 5. Create Pull Request

1. Go to GitHub
2. Click "New Pull Request"
3. Compare: `your-branch` → `main`
4. Add a description explaining what the PR does
5. Request review from teammates

### 6. Code Review

- Teammates review your PR
- Make changes based on feedback
- **If you need to fix something:** Make changes, commit, then push (or amend if it's a small fix)

**Review guidelines:**
- Reviews should be constructive and kind
- Focus on code quality, not personal criticism
- Ask questions if something is unclear
- Everyone reviews, everyone gets reviewed

### 7. Rebase Before Merging (Required)

**Before your PR can be merged, you must rebase your branch onto the latest `main`:**

```bash
# Update main with latest changes
git checkout main
git pull

# Rebase your branch onto the latest main
git checkout your-branch
git rebase main
```

**What is rebase?** Rebase rewrites commit history by replaying your commits on top of the latest `main`. It creates a clean, linear history without merge commits.

**How rebase works:**
1. Git temporarily removes your commits
2. Updates your branch to the latest `main`
3. Replays your commits one by one on top of the updated branch
4. If there are conflicts, Git pauses and asks you to resolve them

**If there are conflicts:**
1. Git will pause and show conflicted files
2. Resolve conflicts in those files
3. Stage resolved files: `git add <file>`
4. Continue rebase: `git rebase --continue`
5. Repeat until all commits are replayed

**After rebasing:**
```bash
# Force push your rebased branch (safe on feature branches)
git push --force-with-lease origin your-branch
```

**Why rebase before merging?**
- Ensures your PR is based on the latest code
- Creates a clean, linear history
- Makes it easier to review changes
- Prevents merge conflicts in the main branch

**Policy:** All PRs must be rebased onto the latest `main` before they can be merged. This keeps the project history clean and linear.

### 8. Update Main

After your PR is merged, update your local `main`:

```bash
git checkout main
git pull origin main
```

**Note:** This pulls from your team's fork, so all team members get the updates.

## Common Scenarios

### Scenario 1: Good Commit Workflow

1. Create a feature branch
2. Make a small change (add a comment, fix a bug, add a test)
3. Test that it works
4. Commit with clear message
5. Push and create PR

### Scenario 2: Oops, I Committed Broken Code

1. Realize the last commit has a bug
2. Fix the bug
3. Amend the commit:
   ```bash
   git add .
   git commit --amend --no-edit
   ```
4. Force push (since we amended):
   ```bash
   git push --force-with-lease origin your-branch
   ```

### Scenario 3: Too Many Small Commits

1. You have 5 "save point" commits
2. Interactive rebase to squash them:
   ```bash
   git rebase -i HEAD~5
   # Change "pick" to "squash" for commits to combine
   ```
3. Result: Clean history with logical commits

## Team Fork Structure

In Phase 1:
- One team member forks the starter repository
- All team members are added as collaborators on that fork
- Everyone clones from the same fork: `git clone git@github.com:TEAM_MEMBER_USERNAME/health-app.git`
- Everyone pushes to the same fork
- All PRs are created in the team's fork

This ensures all team members are working on the same codebase and can see each other's work.
