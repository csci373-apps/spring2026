---
title: "Git Workflow"
group: "How To Guides"
group_order: 2
order: 3
quicklink: 1
---

This guide covers the Git workflow you'll use during Phase 1 of the course. In Phase 1, each team works in their own forked repository, and all team members are collaborators on that fork.


## 1. Creating a Good Pull Request

Before opening a PR, use this checklist:

### 1.1. Pre-PR Checklist

- **Code works**: Your code compiles, runs, and doesn't break existing functionality
- **Tests pass**: All existing tests pass, and you've added tests for new functionality
- **Clean commit history**: Commits are logical, well-organized, and tell a clear story
- **Rebased on latest main**: Your branch is up-to-date with the latest `main` branch
- **Linting/formatting**: Code follows project style (run `npm run fix` or `bash scripts/fix.sh`)
- **No debug code**: Removed console.logs, commented-out code, and temporary debugging statements

### 1.2. PR Description Template

Every PR should include:

> 1. **What changed?** (Brief summary)
>    
>      Example: "Adds tests for the login endpoint"
>
> 2. **Why?** (Context or motivation)
>    
>      Example: "This PR addresses HW1 requirement to write contract-level tests for 3 endpoints"
>
> 3. **How to test?** (Steps for reviewers)
>    
>      Example: "Run `pytest tests/test_auth.py` to see the new tests"
>
> 4. **Screenshots/Examples** (if UI changes)
>    
>      Include before/after screenshots for UI changes

**Example PR Description:**

```bash
## What Changed
Adds contract-level tests for the login endpoint (`POST /api/auth/login`).

## Why
This addresses HW1 requirement to write tests for 3 existing endpoints. The login endpoint is a critical authentication path that needs test coverage.

## How to Test
1. Run `docker exec -it tma_backend poetry run pytest tests/test_auth.py::test_login_success`
2. Verify all tests pass

## Related
- Closes #123 (if applicable)
```

### 1.3. PR Best Practices

- **Keep PRs focused**: One feature or fix per PR. If you have multiple unrelated changes, create separate PRs.
- **Small is better**: Smaller PRs are easier to review and understand. Aim for PRs that can be reviewed in 15-30 minutes.
- **Self-review first**: Review your own PR before asking others. Look for typos, obvious bugs, and unclear code.
- **Request reviews**: Tag your teammates for review. Don't merge your own PRs.

## 2. Reviewing a Pull Request

When reviewing a PR, your goal is to help improve code quality and catch issues before they're merged.

### 2.1. Review Checklist

- **Understand the change**: Read the PR description and understand what it's trying to accomplish
- **Code works**: Check that the code compiles and tests pass (if CI shows failures, note them)
- **Tests included**: Verify that new functionality has appropriate test coverage
- **Code quality**: Look for clarity, proper naming, and adherence to project conventions
- **No obvious bugs**: Check for logic errors, edge cases, and potential issues
- **Documentation**: Ensure code is readable and well-commented where needed

### 2.2. How to Give Good Feedback

**✅ Do:**
- Be constructive and kind
- Ask questions if something is unclear
- Suggest specific improvements
- Explain *why* you're suggesting a change
- Acknowledge what's good about the code
- Focus on the code, not the person

**❌ Don't:**
- Be dismissive or harsh
- Nitpick on style (unless it's inconsistent with project standards)
- Request changes without explaining why
- Make it personal
- Approve without actually reviewing

### 2.3. Types of Comments

1. **Questions**: "I'm not sure I understand this logic. Can you explain why we check `user.is_active` here?"

2. **Suggestions**: "Consider extracting this into a helper function to improve readability."

3. **Required changes**: "This will throw an error if `user` is null. We should add a null check."

4. **Praise**: "Great test coverage! I like how you handled the edge cases."

### 2.4. Review Workflow

1. **Read the PR description** to understand the context
2. **Look at the "Files changed" tab** to see all modifications
3. **Leave comments** on specific lines or sections
4. **Test the changes** if possible (checkout the branch locally) 
    * ⚠️ This is important! Reviewers sometimes skip this step, but pulling down the branch locally and running the code is very important.
5. **Approve or request changes** when done reviewing
6. **Follow up** if the author asks questions or makes updates

### 2.5. Example Review Comments

* **Good comment:** *"This function is doing a lot. Consider breaking it into smaller functions: one to validate input, one to fetch the user, and one to create the response. This would make it easier to test each part separately."*
    * **Less helpful comment:**  *"This is wrong."*

* **Good question:** *"I see we're checking `user.is_active` here, but I don't see where inactive users are filtered out in the query. Should we add that filter to prevent inactive users from being returned?"*

* **Good suggestion:** *"The variable name `data` is a bit generic. Since this contains user information, maybe `user_data` or `user_info` would be clearer?"*

### 2.6. Approving vs. Requesting Changes

- **Approve**: The PR looks good and is ready to merge (after rebase if needed)
- **Request changes**: There are issues that need to be addressed before merging
- **Comment**: You have feedback but it's not blocking (optional improvements)

**Note:** Even if you approve, the author should still rebase onto latest `main` before merging.

## 3. Git Workflow Concepts

> **Quick Reference:** For Git commands, see the [Cheatsheet](/resources/cheatsheet#9-git-commands).

### 3.1. Feature Branches

Never commit directly to `main`. Create a branch for each feature/assignment.

**Why?** Feature branches keep your work isolated and make it easier to review changes before they're merged into the main codebase.

### 3.2. Commit Logical Units of Work

Commit when you've completed a logical piece of work (not just every 5 minutes!)

**✅ Good times to commit:**
- You've completed a logical piece of work (e.g., "Add tests for login endpoint")
- Code compiles and tests pass (or at least doesn't break existing functionality)
- You've made a meaningful change worth documenting
- Clear commit messages that describe what changed and why

**❌ Bad times to commit:**
- Every 5 minutes "just to save" (use Git's stash instead)
- Code is broken and doesn't compile
- Incomplete features
- You're in the middle of implementing something
- You haven't tested your changes

**Rule of thumb:** Each commit should represent a working state that you'd be okay showing in a PR.

### 3.3. Clean Up Commits Before Pushing

Before pushing your branch, clean up your commit history.

1. Amend the last commit if you realize it's broken or incomplete.
1. Rebase to clean up multiple commits before pushing using interactive rebase.

**Why clean up?** Your commit history tells a story. Make it a good one! Clean history makes code reviews easier and helps teammates understand what changed.

### 3.4. Rebase Before Merging (Required)

**Before your PR can be merged, you must rebase your branch onto the latest `main`.**

**What is rebase?** Rebase rewrites commit history by replaying your commits on top of the latest `main`. It creates a clean, linear history without merge commits.

**How rebase works:**
1. Git temporarily removes your commits
2. Updates your branch to the latest `main`
3. Replays your commits one by one on top of the updated branch
4. If there are conflicts, Git pauses and asks you to resolve them

**If there are conflicts:**
1. Git will pause and show conflicted files
2. Resolve conflicts in those files
3. Stage resolved files
4. Continue rebase
5. Repeat until all commits are replayed

**Why rebase before merging?**
- Ensures your PR is based on the latest code
- Creates a clean, linear history
- Makes it easier to review changes
- Prevents merge conflicts in the main branch

**Policy:** All PRs must be rebased onto the latest `main` before they can be merged. This keeps the project history clean and linear.

## 4. Common Scenarios

### 4.1. Scenario 1: Good Commit Workflow

1. Create a feature branch
2. Make a small change (add a comment, fix a bug, add a test)
3. Test that it works
4. Commit with clear message
5. Push and create PR

### 4.2. Scenario 2: Oops, I Committed Broken Code

1. Realize the last commit has a bug
2. Fix the bug
3. Amend the commit (see [Cheatsheet](/resources/cheatsheet#92-committing) for commands)
4. Force push (since we amended)

### 4.3. Scenario 3: Too Many Small Commits

1. You have 5 "save point" commits
2. Interactive rebase to squash them (see [Cheatsheet](/resources/cheatsheet#93-rebasing) for commands)
3. Result: Clean history with logical commits

## 5. Team Fork Structure

In Phase 1:
- One team member forks the starter repository
- All team members are added as collaborators on that fork
- Everyone clones from the same fork: `git clone git@github.com:TEAM_MEMBER_USERNAME/health-app.git`
- Everyone pushes to the same fork
- All PRs are created in the team's fork

This ensures all team members are working on the same codebase and can see each other's work.
