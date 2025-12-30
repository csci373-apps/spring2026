---
title: "Team Formation + Dev Setup"
date: "2026-01-15"
type: "activity"
---


## Learning Objectives

By the end of this session, students will:
- Be in a team of 3-4 students
- Have created a Phase 1 Working Agreement
- Have their dev environment set up and verified
- Understand the Git workflow for Phase 1
- Have completed their first team reflection



## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:15 | Team Formation | Form teams of 3-4 students |
| 0:15-0:45 | Working Agreement | Create team norms and expectations |
| 0:45-1:20 | Dev Environment Setup | Install and verify tools |
| 1:20-1:40 | Git Workflow Overview | Feature branches, commits, rebasing, PRs |

---

## Detailed Instructions

### Part 1: Team Formation (15 minutes)

#### Introduction (2 minutes)
1. **Welcome back** and check in
2. **Explain team structure:**
   - Teams of 3-4 students
   - You'll work together on all Phase 1 assignments
   - Each team will have their own forked repository (one fork per team)
   - All team members will be collaborators on the team's fork
   - Individual reflections, but team code

#### Team Formation Activity (13 minutes)

1. **Count off** by desired team size
2. **Form teams** by number
3. **Allow one swap** if someone has a conflict

#### Team Introductions (5 minutes)
**Each team:**
1. **Introduce yourselves** to each other
2. **Share:**
   - Name
   - Programming experience
   - What you're excited about
   - What you're nervous about
   - Preferred communication method (Slack, Discord, email, etc.)

3. **Choose a team name** (fun but professional)

**Instructor:** Write team names on board, create team channels/rooms if using Slack/Discord

**Transition:** "Now that you're in teams, let's create your working agreement..."



### Part 2: Working Agreement (30 minutes)

#### What is a Working Agreement? (5 minutes)

**Instructor explains:**
- A working agreement is a set of norms your team commits to
- It's not a contract, but a living document
- It helps prevent conflicts and sets expectations
- You'll revisit it throughout the semester

**Show example working agreement:**
```markdown
# Team [Name] Working Agreement - Phase 1

## Communication
- How will we communicate? (Slack, Discord, email, etc.)
- Response time expectations? (within 24 hours)
- When are we available? (time zones, schedules)

## Meetings
- How often will we meet? (weekly? as needed?)
- How long? (1 hour? 2 hours?)
- Where? (in-person? Zoom? hybrid?)

## Work Distribution
- How will we divide work? (volunteer? rotate? assign?)
- How will we ensure everyone contributes?
- What if someone is struggling?

## Code Review
- Who reviews PRs? (everyone? specific people?)
- How quickly should reviews happen? (within 24 hours?)
- What makes a good review? (constructive, specific, kind)

## Conflict Resolution
- What if we disagree?
- What if someone isn't contributing?
- How do we give feedback?

## Learning & Growth
- How will we help each other learn?
- What if someone doesn't understand something?
- How do we celebrate successes?
```

#### Team Activity: Create Working Agreement (20 minutes)

**Instructions for teams:**
1. **Discuss each section** (10 minutes)
   - Be honest about your needs
   - Compromise when needed
   - Write down your decisions

2. **Draft your agreement** (10 minutes)
   - Use the template provided
   - Be specific (not "we'll communicate" but "we'll use Slack and respond within 24 hours")
   - Everyone should agree

**Instructor circulates:**
- Help teams discuss difficult topics
- Ensure agreements are specific
- Check that everyone is participating

#### Share Highlights (5 minutes)
**Ask 2-3 teams to share:**
- One interesting norm they established
- How they'll handle conflicts
- How they'll ensure everyone contributes

**Key Point:** "These agreements are living documents. You can update them as you learn what works."

**Transition:** "Now let's get your dev environment set up..."



### Part 3: Dev Environment Setup (35 minutes)

#### Prerequisites Check (5 minutes)

**Note:** SSH key setup is now part of the prerequisites. Students who need to set up SSH keys will do so before forking the repository.

**Instructor asks:** "Raise your hand if you have:"
- Docker Desktop installed
- Git installed
- A code editor (VS Code, etc.)
- GitHub account
- SSH key set up with GitHub (for cloning repositories)
- Node.js 18.x installed (for Expo/mobile development)
- Expo Go app on phone (optional, for mobile testing)

**For each missing item, provide quick install instructions:**
- Docker Desktop: https://www.docker.com/products/docker-desktop/
- Git: https://git-scm.com/downloads
- VS Code: https://code.visualstudio.com/
- SSH key setup: See instructions below (required for cloning)
- Node.js: Download from https://nodejs.org/
  - **Recommended:** Node.js 18.x LTS or Node.js 20.x LTS (both work with Expo SDK 54)
  - **Avoid:** Node.js 19.x or 21+ (may have compatibility issues with Expo)
  - **Team consistency:** All team members should use the same Node.js version (18.x or 20.x) to avoid "works on my machine" issues
  - **If you have Node 19 or 21+:** You may need to downgrade to Node 18 or 20 if you encounter Expo issues
- Expo Go: Install from App Store (iOS) or Google Play (Android)

#### SSH Key Setup (if needed) (5 minutes)

**Check if you have SSH key:**
```bash
ls -la ~/.ssh
```
Look for files named `id_rsa.pub`, `id_ed25519.pub`, or similar.

**If you don't have an SSH key, create one:**
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```
- Press Enter to accept default file location
- Optionally set a passphrase (recommended for security)
- This creates `~/.ssh/id_ed25519` (private) and `~/.ssh/id_ed25519.pub` (public)

**Add SSH key to GitHub:**
1. **Copy your public key:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   (Or `cat ~/.ssh/id_rsa.pub` if you used RSA)

2. **Go to GitHub:** https://github.com/settings/keys
3. **Click "New SSH key"**
4. **Paste your public key** and save

**Test SSH connection:**
```bash
ssh -T git@github.com
```
Should see: "Hi [username]! You've successfully authenticated..."

**Instructor:** Help students who don't have SSH keys set up

#### Fork Repository (Team Activity) (5 minutes)

**Instructions for teams:**
1. **Decide who will fork:** One team member will fork the repo (or create a team GitHub organization)
2. **Navigate to starter repo** (instructor provides link)
3. **Click "Fork"** button (top right)
4. **Fork to team member's account** (or team organization if created)
5. **Add team members as collaborators:**
   - Go to your forked repo → Settings → Collaborators
   - Add all team members by their GitHub usernames
   - They'll receive an email invitation to join

6. **Each team member clones the team's fork using SSH:**
   ```bash
   git clone git@github.com:TEAM_MEMBER_USERNAME/health-app.git
   cd health-app
   ```
   **Note:** 
   - Use SSH URL (starts with `git@github.com:`) not HTTPS URL
   - All team members clone from the same fork (the team's fork)
   - Replace `TEAM_MEMBER_USERNAME` with the username of whoever forked it

**Instructor:** 
- Verify each team has successfully forked (one fork per team)
- Verify all team members have been added as collaborators
- Verify all team members can clone the team's fork

#### Backend Setup (8 minutes)

**Instructions:**
1. **Navigate to project root:**
   ```bash
   cd health-app
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials if needed
   ```

3. **Start Docker services:**
   ```bash
   docker compose up -d
   ```
   This will start:
   - PostgreSQL database
   - Backend API server
   - Frontend web server

4. **Verify backend is running:**
   - Wait 30-60 seconds for services to start
   - Open http://localhost:8000/docs
   - Should see FastAPI docs

5. **Check Docker containers:**
   ```bash
   docker compose ps
   ```
   Should show all services as "Up"

**Instructor:** Help teams troubleshoot issues (Docker not running, port conflicts, etc.)

#### Frontend Setup (7 minutes)

**Instructions:**
1. **Frontend is already running in Docker!**
   - The `docker compose up` command started the frontend
   - No additional setup needed

2. **Verify it works:**
   - Open http://localhost:5173
   - Should see the web app


**Instructor:** Help teams troubleshoot issues (port conflicts, Docker not running, etc.)

#### Mobile Setup (10 minutes)

**Instructions:**
1. **Verify Node.js version:**
   ```bash
   node --version
   ```
   Should show `v18.x.x` or `v20.x.x` (Node 18 or 20 LTS). 
   - **If you have Node 19 or 21+:** You may encounter Expo compatibility issues. Consider downgrading to Node 18 or 20 LTS
   - **If you have Node 17 or older:** Upgrade to Node 18 or 20 LTS
   - **Team coordination:** Make sure your team agrees on which version to use (18.x or 20.x)

2. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Expo CLI globally** (if not installed):
   ```bash
   npm install -g expo-cli
   ```
   Or use npx (no global install needed):
   ```bash
   npx expo-cli --version
   ```

4. **Set up environment variables:**
   Create `mobile/.env` file:
   ```bash
   cd mobile
   echo "EXPO_PUBLIC_API_URL=http://localhost:8000" > .env
   ```
   Note: For physical devices, use your computer's IP address instead of localhost

5. **Start Expo:**
   ```bash
   npx expo start
   ```

6. **Verify it works:**
   - Should see QR code in terminal
   - **Option 1:** Scan QR code with Expo Go app on your phone
   - **Option 2:** Press 'w' to open in web browser
   - **Option 3:** Press 'a' for Android emulator (if installed)
   - **Option 4:** Press 'i' for iOS simulator (if on Mac)

**Important Notes:**
- Mobile development requires Node.js 18.x or 20.x (not in Docker)
- **Version compatibility:** 
  - ✅ Node.js 18.x LTS - Works with Expo SDK 54
  - ✅ Node.js 20.x LTS - Works with Expo SDK 54 (recommended by Expo)
  - ⚠️ Node.js 19.x - May have compatibility issues
  - ⚠️ Node.js 21+ - May have compatibility issues
- **Version consistency:** All team members should use the same Node.js version (18.x or 20.x) to avoid "works on my machine" issues
- For physical devices: Ensure phone and computer are on same WiFi network
- For Android emulator: Use `http://10.0.2.2:8000` as API URL
- Mobile setup is optional for today - can be completed later if needed

**Instructor:** Help teams troubleshoot issues (Node.js version, Expo CLI issues, network connectivity)

#### Verification Checklist (5 minutes)

**Each team should verify:**
- Docker Desktop is running
- Backend server runs and shows docs at http://localhost:8000/docs
- Frontend runs and shows login page at http://localhost:5173
- Can make a test API call (try login endpoint in FastAPI docs)
- Git is configured (name and email)
- All team members can push to the team's fork
- (Optional) Expo starts and shows QR code

**Team Git Setup:**
- Each team member should configure their Git identity:
  ```bash
  git config user.name "Your Name"
  git config user.email "your.email@example.com"   # email you use for GitHub
  ```
- Test that you can push:
  ```bash
  git checkout -b test-branch
  echo "# Test" >> README.md
  git add README.md
  git commit -m "Test commit"
  git push origin test-branch
  ```
- If push fails, check that you've accepted the collaborator invitation

**Instructor:** Have teams raise hands when all items are checked

**Common Issues:**
- **Docker not running:** Start Docker Desktop application
- **Port conflicts:** Stop other services using ports 8000, 5173, or 5433
- **Database connection errors:** Wait for database container to fully start (30-60 seconds)
- **SSH key issues:**
  - "Permission denied (publickey)": Make sure SSH key is added to GitHub
  - "Host key verification failed": Run `ssh-keyscan github.com >> ~/.ssh/known_hosts`
  - Can't find SSH key: Run `ssh-keygen -t ed25519 -C "your_email@example.com"` to create one
- **Expo issues:** 
  - Ensure Node.js 18.x or 20.x is installed (check with `node --version`, should show v18.x.x or v20.x.x)
  - If you have Node 19 or 21+, downgrade to Node 18 or 20 LTS from https://nodejs.org/
  - If you have Node 17 or older, upgrade to Node 18 or 20 LTS
  - Ensure npm works (`npm --version`)
  - **Team coordination:** If one person's setup works and another's doesn't, check Node.js versions match

**Transition:** "Great! Now let's talk about how you'll work with Git..."



### Part 4: Git Workflow Overview (20 minutes)

#### Phase 1 Git Workflow (15 minutes)

**Instructor explains:**

**1. Feature Branches:**
- Never commit directly to `main`
- Create a branch for each feature/assignment:
  ```bash
  git checkout -b feature/hw1-backend-tests
  ```

**2. Commit Logical Units of Work:**
- Commit when you've completed a logical piece of work (not just every 5 minutes!)
- **Good commits:** Working code that does one thing
  ```bash
  git commit -m "Add tests for login endpoint"
  ```
- **Bad commits:** Broken code, incomplete features, "save point" commits
- **Rule of thumb:** Each commit should represent a working state that you'd be okay showing in a PR
- Clear commit messages that describe what changed and why

**3. Clean Up Commits (Before Pushing):**
- **Amend the last commit** if you realize it's broken or incomplete:
  ```bash
  # Fix the issue, then:
  git add .
  git commit --amend --no-edit  # Updates last commit without changing message
  # Or with new message:
  git commit --amend -m "Add tests for login endpoint (fixed typo)"
  ```
- **Rebase to clean up multiple commits** before pushing:
  ```bash
  # Interactive rebase of last 3 commits:
  git rebase -i HEAD~3
  # In the editor:
  # - Change "pick" to "squash" to combine commits
  # - Change "pick" to "edit" to modify a commit
  # - Delete lines to remove commits
  ```
- **Why clean up?** Your commit history tells a story. Make it a good one!

**4. Push to Team's Fork:**
- Push your cleaned-up branch:
  ```bash
  git push origin feature/hw1-backend-tests
  ```
- **If you've amended/rebased:** You may need to force push (only on feature branches!):
  ```bash
  git push --force-with-lease origin feature/hw1-backend-tests
  ```
  ⚠️ **Never force push to `main`!** Only use on your feature branches.
  **Note:** You're pushing to your team's shared fork, not your personal fork

**5. Create Pull Request:**
- Go to GitHub
- Click "New Pull Request"
- Compare: `your-branch` → `main`
- Add description, request review from teammates

**6. Code Review:**
- Teammates review your PR
- Make changes based on feedback
- **If you need to fix something:** Make changes, commit, then push (or amend if it's a small fix)

**7. Update Main:**
- After merging, update your local main:
  ```bash
  git checkout main
  git pull origin main
  ```
  **Note:** This pulls from your team's fork, so all team members get the updates

#### When to Commit vs When NOT to Commit (3 minutes)

**Instructor explains:**

**✅ Good times to commit:**
- You've completed a logical piece of work (e.g., "Add tests for login endpoint")
- Code compiles and tests pass (or at least doesn't break existing functionality)
- You've made a meaningful change worth documenting
- You're about to try something experimental (commit first, then experiment)

**❌ Bad times to commit:**
- Every 5 minutes "just to save"
- Code is broken and doesn't compile
- You're in the middle of implementing something
- You just want a checkpoint (use Git's stash instead: `git stash`)
- You haven't tested your changes

**Key principle:** Each commit should be a logical unit that you'd be comfortable showing in a PR. If you wouldn't want someone to review it, don't commit it (or amend it first).

#### Demo: Create First PR + Clean Up Commits (5 minutes)

**Instructor demonstrates:**

**Scenario 1: Good commit workflow**
1. Create a test branch
2. Make a small change (add a comment)
3. Test that it works
4. Commit with clear message
5. Push and create PR

**Scenario 2: Oops, I committed broken code**
1. Realize the last commit has a bug
2. Fix the bug
3. Amend the commit:
   ```bash
   git add .
   git commit --amend --no-edit
   ```
4. Force push (since we amended):
   ```bash
   git push --force-with-lease origin test-branch
   ```

**Scenario 3: Too many small commits**
1. Show a branch with 5 "save point" commits
2. Interactive rebase to squash them:
   ```bash
   git rebase -i HEAD~5
   # Change "pick" to "squash" for commits to combine
   ```
3. Result: Clean history with logical commits

**Key Points:**
- Commit when code works, not as a "save point"
- Clean up commits before pushing (amend, rebase)
- PRs are for learning, not gatekeeping
- Reviews should be constructive and kind
- Everyone reviews, everyone gets reviewed

**Transition:** "Now let's do your first team reflection..."



### Part 5: First Team Reflection (if time permits, or assign as homework)

#### Reflection Prompt (5 minutes)

**Ask teams to discuss:**
1. **What did we do today?**
   - Formed teams
   - Created working agreement
   - Set up dev environment
   - Learned Git workflow

2. **What did we learn?**
   - How to work as a team
   - How to set up the project
   - How Git workflow works

3. **What was hard?**
   - What was confusing?
   - What took longer than expected?

4. **What questions do we have?**
   - What do we still need to know?

5. **How will we work together?**
   - What are our strengths as a team?
   - What do we need to work on?

**Instructor:** Have teams write down their reflections (will be part of HW0)



## Materials Needed

- Starter repository (GitHub link)
- Working Agreement template (handout or digital)
- Dev setup instructions (handout or digital)
- Git workflow diagram (whiteboard or slides)
- Computer for each student (or pairs)

## Instructor Notes

### Common Issues & Solutions

**Issue: Poetry installation fails**  
Solution: Use `pip install poetry` instead, or provide pre-installed environment

**Issue: npm install takes forever**  
Solution: This is normal, have students start it and continue with other setup

**Issue: Students can't fork repository**  
Solution: One team member forks, adds others as collaborators. Alternative: clone main repo, create new repo, push to it, add team members as collaborators

**Issue: Team member can't push to team's fork**  
Solution: Check that they've accepted the collaborator invitation (check email or GitHub notifications)

**Issue: Students commit broken code frequently**  
Solution: 
- Emphasize: "Commit when it works, not as a save point"
- Show them how to amend commits if they realize something is broken
- Encourage them to test before committing
- Use rebase to clean up before pushing

**Issue: Students afraid to amend/rebase**  
Solution:
- Reassure them: It's safe on feature branches (not main)
- Show them `--force-with-lease` is safer than `--force`
- Emphasize: Clean history makes reviews easier

**Issue: Database connection errors**  
Solution: Provide Docker setup, or use SQLite for simplicity

### Time Management

- **If running short:** Add more Git workflow practice
- **If running long:** Move mobile setup to homework, focus on backend + frontend

### Team Formation Tips

- **If students struggle to form teams:** Help facilitate, suggest criteria
- **If teams are unbalanced:** You can make small adjustments
- **If someone is left out:** Form a team with them, or add to existing team



## Student Deliverables

- Team formed and name chosen
- Working Agreement created (part of HW0)
- Dev environment set up and verified (part of HW0)
- First team reflection (part of HW0)

## Homework Preview

**HW0: Team Working Agreement + Dev Setup + Team Reflection**
- Due: Tuesday, January 20
- Submit: Working agreement document, dev setup verification, individual reflection
- See `hw00.md` for full details

## Next Steps

- **Before Tuesday:** Complete HW0
- **Tuesday:** Backend deep dive - models, schemas, routes
- **Reading:** FastAPI Dependencies documentation (due Tuesday)

