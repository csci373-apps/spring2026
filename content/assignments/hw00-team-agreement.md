---
title: "Team Working Agreement + Dev Setup"
type: "assignment"
num: "0"
draft: 1
assigned_date: "2026-01-15"
due_date: "2026-01-20"
heading_max_level: 3
---

## Overview

This assignment has three parts:
1. **Team Working Agreement** - Create norms and expectations for your team
2. **Dev Setup Verification** - Verify your development environment works
3. **Individual Reflection** - Reflect on team formation and setup process

This assignment establishes the foundation for Phase 1 teamwork and ensures everyone can contribute to the project.


## Part 1: Team Working Agreement (20 points)

### Instructions

Create a **Team Working Agreement** document that outlines how your team will work together during Phase 1. This is a living document that you can update as you learn what works.

### Required Sections

Your working agreement must include:

#### 1. Communication (5 points)
- **How will you communicate?** (Slack, Discord, email, text, etc.)
- **Response time expectations?** (within 24 hours? same day? etc.)
- **When are team members available?** (class schedules, work schedules)
- **UNCA Google Calendar:** Can we assume they're up-to-date?
- **How will you share updates?** (daily? weekly? as needed?)

**Example:**
```markdown
## Communication
- **Primary channel:** Slack (#team-alpha)
- **Response time:** Within 24 hours for non-urgent messages, within 2 hours for urgent
- **Availability:** 
  - Alice: M-F 9am-5pm EST
  - Bob: M-W-F 2pm-6pm PST
  - Carol: Any time, but prefers evenings EST
- **Updates:** Daily standup in Slack at 9am EST
```

#### 2. Meetings (5 points)
- **How often will you meet?** (weekly? bi-weekly? as needed?)
- **How long?** (1 hour? 2 hours?)
- **Where?** (these should be in-person meetings)
- **What's the agenda?** (standup? planning? coding together?)

**Example:**
```markdown
## Meetings
- **Frequency:** Weekly, Sundays at 2pm EST
- **Duration:** 1-2 hours
- **Format:** Zoom (recorded for those who can't attend)
- **Agenda:**
  1. Check-in (5 min)
  2. Review previous week's work (10 min)
  3. Plan upcoming work (20 min)
  4. Pair programming or Q&A (remaining time)
```

#### 3. Work Distribution (5 points)
- **How will you divide work?** (volunteer? rotate? assign based on interest?)
- **How will you ensure everyone contributes?** (check-ins? pair programming?)
- **What if someone is struggling?** (how do you help? when do you ask for help?)

**Example:**
```markdown
## Work Distribution
- **Method:** Volunteer for tasks, but rotate if no one volunteers
- **Tracking:** Use GitHub issues/projects to track who's working on what
- **Contribution:** 
  - Everyone must contribute code to each assignment
  - Pair programming encouraged for learning
- **Struggling:** 
  - Ask for help in team channel
  - Schedule pair programming session
  - Escalate to instructor if needed
```

#### 4. Code Review (3 points)
- **Who reviews PRs?** (everyone? specific people? rotate?)
- **How quickly should reviews happen?** (within 24 hours? 48?)
- **What makes a good review?** (constructive? specific? kind?)

**Example:**
```markdown
## Code Review
- **Reviewers:** At least one other team member must review before merging
- **Timeline:** Reviews should happen within 24 hours
- **Standards:**
  - Be constructive and kind
  - Be specific (not "this is wrong" but "consider using X instead of Y because...")
  - Ask questions if something is unclear
  - Approve if it looks good, even if you'd do it differently
```

#### 5. Conflict Resolution (2 points)
- **What if you disagree?** (how do you resolve? vote? discuss?)
- **What if someone isn't contributing?** (how do you address it?)
- **How do you give feedback?** (directly? in team meeting? privately?)

**Example:**
```markdown
## Conflict Resolution
- **Disagreements:** 
  - Discuss in team meeting
  - If no consensus, vote (majority rules)
  - Escalate to instructor if needed
- **Non-contribution:**
  - Check in privately first (maybe they're struggling?)
  - Discuss in team meeting if continues
  - Escalate to instructor if needed
- **Feedback:** 
  - Give feedback directly and kindly
  - Focus on behavior, not personality
  - Use "I" statements ("I feel..." not "You always...")
```

### Submission

- **Format:** Markdown document (`.md` file) or Google Doc
- **File name:** `team-[name]-working-agreement.md`
- **Location:** Submit to course platform or email to instructor
- **Team submission:** One document per team (everyone gets same grade)

### Grading Rubric

| Criteria | Points | Description |
|----------|--------|-------------|
| Communication | 5 | Clear communication plan with response times and availability |
| Meetings | 5 | Specific meeting schedule with format and agenda |
| Work Distribution | 5 | Fair method for dividing work and ensuring contribution |
| Code Review | 3 | Clear review process and standards |
| Conflict Resolution | 2 | Thoughtful approach to handling conflicts |
| **Total** | **20** | |


## Part 2: Dev Setup Verification (15 points)

### Instructions

Verify that your development environment is set up correctly and document the setup process.

### Required Tasks

#### 1. Backend Setup (5 points)

**Verify:**
-  Docker Desktop installed and running
-  Environment variables configured (`.env` file exists in project root)
-  Docker services start successfully (`docker compose up -d`)
-  Backend server accessible at `http://localhost:8000/docs`
-  FastAPI docs page loads correctly
-  Database container is running (`docker compose ps` shows database as "Up")

**Documentation:**
Take screenshots or provide terminal output showing:
1. Docker Desktop running
2. Successful `docker compose up -d` command
3. `docker compose ps` showing all services as "Up"
4. FastAPI docs page open in browser
5. Can make a test API call (try any endpoint in FastAPI docs)

#### 2. Frontend Setup (5 points)

**Verify:**
-  Frontend accessible at `http://localhost:5173` (running in Docker)
-  Web app loads correctly
-  Can see login page (or main page)
-  Frontend container is running (`docker compose ps` shows frontend as "Up")

**Optional (for local development):**
-  Node.js 18+ installed (`node --version`)
-  Can run frontend locally if needed (`npm install` and `npm run dev` in `ui/` directory)

**Documentation:**
Take screenshots or provide terminal output showing:
1. Web app open in browser at http://localhost:5173
2. Frontend container running (from `docker compose ps`)
3. (Optional) Node.js version if running locally

#### 3. Git Setup (3 points)

**Verify:**
-  Git installed (`git --version`)
-  Git configured with name and email (`git config --list`)
-  Team's repository forked and cloned (one fork per team)
-  You're added as a collaborator on the team's fork
-  Can push to team's fork (`git push origin main` succeeds)

**Documentation:**
Provide terminal output showing:
1. Git version
2. Git config (name and email)
3. Remote repository URL (should be your team's fork, not personal fork)
4. Successful push (or at least that you can push)

**Note:** Each team has one shared fork. All team members are collaborators on that fork.

#### 3.5. Mobile Setup (Optional - 0 points, but recommended)

**Note:** Mobile setup is optional for HW0, but you'll need it for Week 6.

**Verify:**
-  Node.js 18.x or 20.x installed (`node --version` should show `v18.x.x` or `v20.x.x`) - Required for Expo
-  Expo CLI accessible (`npx expo-cli --version` or `npx expo --version`)
-  Mobile dependencies installed (`npm install` in `mobile/` directory succeeds)
-  Environment variable set (`mobile/.env` file with `EXPO_PUBLIC_API_URL`)
-  Expo starts (`npx expo start` shows QR code)

**Important:** 
- **Compatible versions:** Node.js 18.x LTS or 20.x LTS work with Expo SDK 54 (download from https://nodejs.org/)
- **Avoid:** Node.js 19.x or 21+ may have compatibility issues - if you have these, consider downgrading
- **Team consistency:** All team members should use the same Node.js version (18.x or 20.x) to avoid "works on my machine" issues
- **If you have issues:** Check your Node.js version matches your teammates' versions

**Documentation (optional):**
Take screenshots or provide terminal output showing:
1. Node.js version (should be exactly 18.17.0)
2. Successful `npm install` in mobile directory
3. Expo starting and showing QR code

#### 4. Integration Test (2 points)

**Verify:**
-  Backend and frontend can communicate
-  Can make a test API call (try login endpoint in FastAPI docs)
-  Response is received correctly
-  All Docker services are running and communicating

**Documentation:**
Take screenshot showing:
1. API call in FastAPI docs (http://localhost:8000/docs)
2. Successful response (or at least that you can make the call)
3. `docker compose ps` showing all services healthy

### Submission

- **Format:** Markdown document with screenshots/terminal output, or PDF
- **File name:** `dev-setup-verification-[your-name].md` or `.pdf`
- **Location:** Submit to course platform or email to instructor
- **Individual submission:** Each team member submits their own

### Grading Rubric

| Criteria | Points | Description |
|----------|--------|-------------|
| Backend Setup | 5 | All backend components working and documented |
| Frontend Setup | 5 | All frontend components working and documented |
| Git Setup | 3 | Git configured and repository access verified |
| Integration Test | 2 | Backend and frontend can communicate |
| Mobile Setup | 0 | Optional - recommended for future weeks |
| **Total** | **15** | |

**Note:** If you encounter issues, document them and explain what you tried. Partial credit for good troubleshooting attempts.


## Part 3: Individual Reflection (15 points)

### Instructions

Write a reflection on the team formation and setup process. This should be 300-500 words and address the prompts below.

### Reflection Prompts

Answer the following questions:

1. **What did you do?** (50 words)
   - Describe the activities you completed (team formation, working agreement, dev setup)

2. **What did you learn?** (100 words)
   - What did you learn about working in teams?
   - What did you learn about the development environment?
   - What technical concepts did you understand better?

3. **What was hard?** (100 words)
   - What was confusing or challenging?
   - What took longer than expected?
   - What questions do you still have?

4. **How does this connect to what you already know?** (100 words)
   - How does team work connect to your previous experiences?
   - How does the dev environment connect to tools you've used before?
   - What's similar? What's different?

5. **What are you looking forward to?** (50 words)
   - What are you excited to learn?
   - What are you curious about?
   - What goals do you have for this course?

### Submission

- **Format:** Markdown document (`.md` file) or PDF
- **File name:** `reflection-hw00-[your-name].md` or `.pdf`
- **Location:** Submit to course platform or email to instructor
- **Individual submission:** Each team member submits their own

### Grading Rubric

| Criteria | Points | Description |
|----------|--------|-------------|
| Completeness | 5 | All prompts addressed with appropriate length |
| Depth | 5 | Thoughtful reflection, not just surface-level |
| Clarity | 3 | Well-written, clear, organized |
| Honesty | 2 | Honest about challenges and questions |
| **Total** | **15** | |


## Submission Checklist

Before submitting, make sure you have:

### Team Submission (one per team):
-  Team Working Agreement document
  -  Communication section
  -  Meetings section
  -  Work Distribution section
  -  Code Review section
  -  Conflict Resolution section

### Individual Submission (each team member):
-  Dev Setup Verification document
  -  Backend setup screenshots/output
  -  Frontend setup screenshots/output
  -  Git setup verification
  -  Integration test screenshot
-  Individual Reflection document
  -  All 5 prompts addressed
  -  300-500 words total
  -  Well-written and thoughtful


## Getting Help

If you encounter issues:

1. **Check the documentation:**
   - Course materials
   - Setup guides
   - Error messages (Google them!)

2. **Ask your team:**
   - Post in team channel
   - Schedule a pair programming session

3. **Ask the instructor:**
   - Office hours: [time/location]
   - Email: [email]
   - Slack: [channel]

4. **Common issues:**
   - **Docker not running:** Start Docker Desktop application
   - **Port conflicts:** Stop other services using ports 8000, 5173, or 5433, or change ports in `docker-compose.yaml` (note: file is still named `docker-compose.yaml` but command is `docker compose`)
   - **Database connection error:** Wait for database container to fully start (30-60 seconds), check `.env` file
   - **Containers won't start:** Check Docker Desktop is running, try `docker compose down` then `docker compose up -d`
   - **Expo issues:** Ensure Node.js is installed (needed for mobile development)
   - **Port already in use:** Kill the process using the port or use a different port


## Late Policy

- **On time:** Full credit
- **1 day late:** -10% (45 points max)
- **2 days late:** -20% (40 points max)
- **3+ days late:** -50% (25 points max)

**Note:** If you have extenuating circumstances, contact the instructor before the due date.


## Questions?

If you have questions about this assignment:
- Check the course materials first
- Ask your team
- Ask in class
- Email the instructor

