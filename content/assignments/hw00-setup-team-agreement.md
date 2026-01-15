---
title: "Team Working Agreement + Dev Setup"
type: "homework"
num: "0"
draft: 0
assigned_date: "2026-01-15"
due_date: "2026-01-22"
heading_max_level: 3
---

> ## Overview
> 
> This assignment has three parts:
> 1. **Dev Setup Verification** - Verify your development environment works
> 2. **Team Working Agreement** - Create norms and expectations for your team
> 3. **Individual Reflection** - Reflect on team formation and setup process
> 
> This assignment establishes the foundation for Phase 1 teamwork and ensures everyone can contribute to the project.


## Part 1: Dev Setup & Verification

Follow the [Starter Code Setup Instructions](/resources/howto-01-starter-code) to set up your development environment. Then verify that everything works by completing the checks below:

- [ ] **Backend:** FastAPI docs accessible at `http://localhost:8000/docs`
- [ ] **Frontend:** Web app loads at `http://localhost:5173`
- [ ] **Git:** Can push to your team's fork (each team has one shared fork; all members are collaborators)
- [ ] **Integration:** Can make a test API call (try the login endpoint in FastAPI docs)
- [ ] **Mobile:** Expo starts and shows QR code


## Part 2: Team Working Agreement

### Instructions

Create a **Team Working Agreement** document that outlines how your team will work together during Phase 1. This is a living document that you can update as you learn what works.

A working agreement is a set of norms your team commits to. It's not a contract, but a living document that helps prevent conflicts and sets expectations.

### Required Sections

Your working agreement must include all of the following sections. Be specific (not "we'll communicate" but "we'll use Slack and respond within 24 hours"). Everyone should agree.

**Template:**
```markdown
# Team [Name] Working Agreement - Phase 1

## Communication
- How will we communicate? (Slack, Discord, email, etc.)
- Response time expectations? (within 24 hours)
- When are we available? (time zones, schedules)
- UNCA Google Calendar: Can we assume they're up-to-date?
- How will we share updates? (daily? weekly? as needed?)

## Meetings
- How often will we meet? (weekly? as needed?)
- How long? (1 hour? 2 hours?)
- Where? (in-person? Zoom? hybrid?)
- What's the agenda? (standup? planning? coding together?)

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

### Examples

Here are some example sections to help you get started:

**Communication Example:**
```markdown
## Communication
- **Primary channel:** Slack (#team-alpha)
- **Response time:** Within 24 hours for non-urgent messages, ASAP for urgent ones (ideally within a few hours, time permitting).
- **Availability:** 
  - Alice: M-F 9am-5pm EST
  - Bob: M-W-F 2pm-6pm PST
  - Carol: Any time, but prefers evenings EST
- **Updates:** Daily standup in Slack at 9am EST
```

**Meetings Example:**
```markdown
## Meetings
- **Frequency:** Weekly, Sundays at 2pm EST
- **Duration:** 1-2 hours
- **Format:** In-person in library study room (or Zoom if someone can't attend)
- **Agenda:**
  1. Check-in (5 min)
  2. Review previous week's work (10 min)
  3. Plan upcoming work (20 min)
  4. Pair programming or Q&A (remaining time)
```

**Work Distribution Example:**
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

**Code Review Example:**
```markdown
## Code Review
- **Reviewers:** At least one other team member must review before merging (unless otherwise specified by the instructor)
- **Timeline:** Reviews should happen within 24 hours
- **Standards:**
  - Be constructive and kind
  - Be specific (not "this is wrong" but "consider using X instead of Y because...")
  - Ask questions if something is unclear
  - Approve if it looks good, even if you'd do it differently
```

**Conflict Resolution Example:**
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

**Learning & Growth Example:**
```markdown
## Learning & Growth
- **Helping each other:** 
  - Pair programming for learning new concepts
  - Share resources and documentation
  - Ask questions freely (no question is too basic)
- **When someone doesn't understand:**
  - Explain patiently, use examples
  - Offer to pair program or screen share
  - Don't move on until everyone understands
- **Celebrating successes:**
  - Acknowledge good work in team channel
  - Celebrate completed assignments together
  - Share what we learned with each other
```

### Submission

1. Nomintate a person to add the team agreement to the repo. That person will create a feature branch (e.g., `team-agreement`), save your team agreement `team-working-agreement.md` inside the repo (in the root directory), commit and push their branch, and create a pull request.
1. Nominate a second person to review and approve the PR. The author of the PR will be responsible for merging it into `main`


## Part 3: Individual Reflection
Answer the following questions in the Weekly Reflection form (aim for 200-400 words total):

1. **Reflect on the team working agreement**
   - How did it go? 
   - Did you think that everyone had a voice in the process and that the decisions made work for everyone (given the constraints everyone is under)?

2. **Reflect on the project setup**
   - How did it go?
   - Did the process feel familiar, overwhelming, frustrating, etc.?
   - Any surprises, headaches, etc.?
   - What do you want to understand better?

## Submission Checklist
- [ ] Your have verified that all of the pieces of your local installation are working.
- [ ] Your team has created a team working agreemend doc, which is now on the main branch of your team's repo.
- [ ] You have completed the reflection document
