---
title: "GitHub Issues & Branch Protection"
group: "How To Guides"
group_order: 2
order: 4
quicklink: 0
---

This guide covers GitHub branch protection rules and using the issue tracker for team coordination. Branch protection rules enforce good Git practices by preventing direct pushes to `main`, requiring pull request reviews, and ensuring code quality checks pass before merging.

## 1. Using the Issue Tracker

GitHub Issues help your team organize work, track progress, and coordinate tasks. Use issues to break down assignments into manageable tasks and assign work to team members.

### 1.1. Creating Issues

**When to create an issue:**
- Breaking down a homework assignment into tasks
- Tracking bugs or problems you've discovered
- Documenting features to implement
- Planning work for the next sprint

**How to create an issue:**
1. Go to your repository on GitHub
2. Click the **Issues** tab
3. Click **New issue**
4. Add a clear title and description
5. Add labels (e.g., "backend", "frontend", "bug", "enhancement")
6. Assign to a team member (optional)
7. Click **Submit new issue**

**Good issue titles:**
- ✅ "Add tests for POST /users endpoint"
- ✅ "Fix login redirect bug"
- ❌ "Stuff to do"
- ❌ "Help"

### 1.2. Issue Templates

Create issue templates for common task types:

1. Go to **Settings** → **General** → **Issues**
2. Click **Set up templates** → **Add template**
3. Create templates for:
   - **Feature**: New functionality to implement
   - **Bug**: Problems to fix
   - **Task**: General work items

**Example Feature Template:**
```markdown
## Description
Brief description of the feature

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Related
Links to related issues or PRs
```

### 1.3. Linking Issues to Pull Requests

When creating a PR, reference the related issue:

- In the PR description: "Closes #123" or "Fixes #123"
- GitHub will automatically link the PR to the issue
- When the PR is merged, the issue will be automatically closed

**Example PR description:**
```markdown
## What Changed
Adds tests for the login endpoint

## Related
Closes #45
```

### 1.4. Using Issues for Task Assignment

**Best practices:**
- Create one issue per task (not one issue for everything)
- Assign issues to specific team members
- Use labels to categorize (backend, frontend, testing, etc.)
- Update issue status as work progresses
- Link related issues together

**Workflow:**
1. Break down assignment into issues
2. Assign issues to team members
3. Create a branch for each issue: `feature/issue-45-login-tests`
4. Reference the issue in your PR: "Closes #45"
5. Issue auto-closes when PR is merged

## 2. Branch Protection Rules

Branch protection rules enforce good Git practices by preventing direct pushes to `main`, requiring pull request reviews, and ensuring code quality checks pass before merging.

### 2.1. Why Use Branch Protection?

Branch protection rules:
- **Prevent direct pushes to main**: Forces all changes through pull requests
- **Require code review**: Ensures at least one teammate reviews changes
- **Enforce rebase-only merges**: Keeps commit history clean and linear
- **Require status checks**: Ensures tests pass before code is merged
- **Protect against force pushes**: Prevents accidental history rewriting

**Who sets this up?** Usually one team member (often the person who forked the repository) sets up branch protection rules for the team.

### 2.2. Setting Up Branch Protection

1. Go to your repository → **Settings** → **Branches**
2. Click **Add rule** or **Add branch protection rule**
3. Configure these settings:
   - **Branch name pattern**: Enter `main`
   - **Require a pull request before merging**: Check this
   - **Require approvals**: Check this, set to 1
   - **Require linear history**: Check this (enforces rebase-only merges)
   - **Do not allow bypassing the above settings**: Check this
   - **Allow force pushes**: Uncheck this
   - **Require status checks to pass before merging**: Check this if you have CI/CD
4. Click **Create** to save

### 2.3. What This Means for Your Team

**Required reviews:** You cannot merge your own PR without at least one approval. Workflow: Create PR → Request review → Teammate approves → Rebase onto latest `main` → Merge.

**Linear history:** You must rebase your branch onto latest `main` before merging. No merge commits allowed. Rebase with:
```bash
git fetch origin
git rebase origin/main
# Resolve conflicts if needed, then:
git push origin feature/my-feature --force-with-lease
```

**Status checks:** If you have CI/CD, tests and linting must pass before merging. GitHub shows checkmarks (✅) when all checks pass.


## 3. Best Practices

**Always work on feature branches:** Create a branch for each task, make changes, push, create PR, get review, rebase, then merge.

**Keep branches up-to-date:** Before creating a PR or merging, fetch latest changes and rebase onto `main`.

**Use `--force-with-lease` instead of `--force`:** When force pushing after rebasing, use `--force-with-lease` to safely check that the remote hasn't changed.

**Link PRs to issues:** Reference issues in PR descriptions (e.g., "Closes #45") so issues auto-close when PRs are merged.
