---
title: "Demo Prep + Phase 1 Reflection"
start_date: "2026-03-03"
type: "activity"
---

## Learning Objectives

By the end of this session, students will:
- Be able to prepare a clear, focused demo of their Phase 1 work
- Understand how to ensure PRs are reviewable and have linear history
- Be able to reflect on Phase 1 learning and growth
- Understand what will change in Phase 2 (shared repo, vertical teams)
- Prepare for Phase 2 transition


## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:10 | Review & Warm-up | Review HW6, address questions |
| 0:10-0:25 | Demo Prep Workshop | How to give a good demo |
| 0:25-0:45 | PR Cleanup Clinic | Rebase, linear history, reviewable PRs |
| 0:45-1:05 | Phase 1 Reflection Activity | What did we learn? How did we grow? |
| 1:05-1:20 | Phase 2 Preview | What's different? What are we nervous about? |
| 1:20-1:30 | Wrap-up | Preview Thursday demos |


## Detailed Instructions

### Part 1: Review & Warm-up (10 minutes)

#### Check-in (3 minutes)
1. **Welcome back**
2. **Quick check:** "Raise your hand if:"
   - You completed HW6 (prototypes + UX implementation)
   - You have questions about prototyping or UX
   - You're ready for Phase 1 demos

#### Reflection Activity: Prototyping (5 minutes)

**Instructor asks teams to discuss:**

1. **What did you prototype?**
   - What flow did you improve?
   - What did you learn?

2. **How did prototyping change your thinking?**
   - What assumptions did you challenge?
   - What surprised you?

**Instructor asks 1-2 teams to share:**
- One way prototyping changed their thinking
- One thing they learned about UX

**Key Point:** "Prototyping helps us think from users' perspectives. Now let's prepare to show what we built in Phase 1."

#### Preview Today (2 minutes)
- "Today we're preparing for Phase 1 demos"
- "We'll clean up PRs and reflect on what we learned"
- "We'll also preview Phase 2"

**Transition:** "Let's learn how to give a good demo..."


### Part 2: Demo Prep Workshop (15 minutes)

#### What Makes a Good Demo? (5 minutes)

**Instructor explains:**

**A good demo:**
- **Shows the feature working** (not just code)
- **Tells a story** (user goal → how feature helps → outcome)
- **Is focused** (one feature or flow, not everything)
- **Is prepared** (tested beforehand, knows what to show)
- **Is clear** (explains what it does and why it matters)

**A bad demo:**
- Shows code instead of working feature
- Tries to show everything
- Unprepared (things break, doesn't know what to show)
- Unclear (doesn't explain what or why)

**Key Point:** "A demo should show value to users, not just technical implementation."

#### Demo Structure (5 minutes)

**Instructor provides template:**

```markdown
## Demo Structure (5-10 minutes)

### 1. Context (1 min)
- What feature are you demoing?
- What user goal does it support?
- Why did you build it?

### 2. Demo the Feature (3-5 min)
- Show it working (live or recorded)
- Walk through the user flow
- Highlight key interactions
- Show different states (loading, error, success)

### 3. Technical Highlights (2-3 min)
- What was technically interesting?
- What challenges did you overcome?
- What did you learn?

### 4. Reflection (1 min)
- What would you do differently?
- What questions do you have?
```

**Key Point:** "Structure helps you tell a clear story. Prepare your demo flow."

#### Demo Prep Activity (5 minutes)

**Instructor asks teams to:**
1. **Choose one feature** to demo (from Phase 1 work)
2. **Plan the demo:**
   - What will you show?
   - What's the story?
   - What are the key points?
3. **Test the demo:**
   - Make sure it works
   - Practice the flow
   - Time it (should be 5-10 minutes)

**Instructor circulates:**
- Help teams choose features
- Guide demo planning
- Ensure demos are focused

**Key Point:** "Preparation makes demos better. Test everything beforehand."

**Transition:** "Now let's make sure our PRs are ready for review..."


### Part 3: PR Cleanup Clinic (20 minutes)

#### Why Clean Up PRs? (3 minutes)

**Instructor explains:**
- **Reviewable PRs:** Easy for others to understand and review
- **Linear history:** Clean git history, easy to follow
- **Professional:** Shows good development practices
- **Learning:** Helps you understand your own work better

**Key Point:** "Clean PRs make code review easier and show professionalism."

#### Rebase and Linear History (10 minutes)

**Instructor demonstrates:**

1. **Check your branch:**
   ```bash
   git checkout feature/your-branch
   git log --oneline
   ```

2. **Interactive rebase to clean up commits:**
   ```bash
   git rebase -i HEAD~N  # N = number of commits to rebase
   ```

3. **In the editor:**
   - Change `pick` to `squash` (or `s`) to combine commits
   - Change `pick` to `edit` (or `e`) to modify a commit
   - Reorder commits if needed

4. **Write good commit messages:**
   - Clear, descriptive
   - Explain what and why
   - One logical change per commit

**Example:**
```bash
# Before: Many small commits
pick abc123 WIP
pick def456 fix typo
pick ghi789 another fix
pick jkl012 actually working now

# After: Clean, logical commits
pick abc123 Implement user login feature
pick def456 Add error handling for invalid credentials
```

**Key Point:** "Linear history with clear commits makes PRs easier to review."

#### PR Description Checklist (5 minutes)

**Instructor provides checklist:**

**Good PR description includes:**
- **What:** What does this PR do?
- **Why:** Why is this change needed?
- **How:** How does it work? (high-level)
- **Testing:** How was it tested?
- **Screenshots:** If UI changes, include screenshots
- **Related:** Link to related issues/PRs

**Template:**

```markdown
## [Feature Name]

### What
- [Brief description of what this PR does]

### Why
- [Why is this change needed? What problem does it solve?]

### How
- [High-level explanation of how it works]

### Testing
- [How was this tested? What scenarios were covered?]

### Screenshots
- [If UI changes, include screenshots]

### Related
- [Link to related issues, PRs, or discussions]
```

**Instructor:** Show example of good PR description

**Key Point:** "Good PR descriptions help reviewers understand the change quickly."

#### PR Cleanup Activity (2 minutes)

**Instructor asks teams to:**
1. **Review your Phase 1 PRs**
2. **Check if they need cleanup:**
   - Are commits logical?
   - Is history linear?
   - Are descriptions clear?
3. **Clean up if needed** (can do as homework)

**Key Point:** "Clean PRs show professionalism and make review easier."

**Transition:** "Now let's reflect on Phase 1..."


### Part 4: Phase 1 Reflection Activity (20 minutes)

#### Reflection Framework (5 minutes)

**Instructor provides reflection prompts:**

1. **What did we build?**
   - What features did you implement?
   - What technologies did you use?
   - What was your role?

2. **What did we learn?**
   - Technical skills (backend, frontend, mobile, testing)
   - Design skills (code quality, UX, prototyping)
   - Collaboration skills (code review, pair programming, teamwork)

3. **What was hard?**
   - What was challenging?
   - What took longer than expected?
   - What questions do you still have?

4. **What improved?**
   - What got easier over time?
   - What skills did you develop?
   - What patterns do you understand now?

5. **What will change in Phase 2?**
   - Shared repo (not team repos)
   - Vertical teams (not horizontal)
   - Collaborative features (not independent)
   - What are you nervous about? Excited about?

#### Team Reflection (12 minutes)

**Instructor asks teams to discuss:**

**Round 1: Individual Reflection (5 minutes)**
- Each person reflects individually (write notes)
- Use the reflection framework

**Round 2: Team Discussion (5 minutes)**
- Share reflections with team
- Identify common themes
- Discuss what worked and what didn't

**Round 3: Prepare to Share (2 minutes)**
- Choose 2-3 key insights to share with class
- What did your team learn?
- What are you proud of?

#### Share Reflections (3 minutes)

**Ask 2-3 teams to share:**
- One thing they learned
- One thing that was hard
- One thing they're proud of
- One thing they're nervous/excited about for Phase 2

**Common themes to highlight:**
- "Testing helped me understand the code better"
- "Code review taught me a lot"
- "Prototyping changed how I think about UI"
- "Working in teams was challenging but valuable"
- "I'm nervous about shared repo but excited for collaboration"

**Key Point:** "Reflection helps us learn from experience. Phase 1 was about learning. Phase 2 is about applying."

**Transition:** "Let's preview Phase 2..."


### Part 5: Phase 2 Preview (15 minutes)

#### What's Different in Phase 2? (5 minutes)

**Instructor explains the shift:**

**Phase 1:**
- Team repos (each team has their own fork)
- Horizontal teams (backend team, web team, mobile team)
- Independent features (each team builds their own thing)
- Learning focus (explore, experiment, learn)

**Phase 2:**
- Shared repo (one repo for everyone)
- Vertical teams (backend + web + mobile developers together)
- Collaborative features (teams build features together)
- Delivery focus (build real features, work together)

**Key Point:** "Phase 2 is about collaboration and delivery. We'll work in shared codebase."

#### Shared Repo Workflow (5 minutes)

**Instructor explains:**

1. **Main branch discipline:**
   - Never commit directly to `main`
   - Always use feature branches
   - PRs must be reviewed before merging

2. **Feature branches:**
   - One branch per feature
   - Clear naming: `feature/[feature-name]`
   - Keep branches up to date with `main`

3. **PR workflow:**
   - Create PR from feature branch to `main`
   - Get review from teammate (different team if possible)
   - Address feedback
   - Merge when approved

4. **Communication:**
   - Coordinate with other teams
   - Discuss API contracts
   - Share knowledge

**Key Point:** "Shared repo requires more coordination. Communication is key."

#### What Are You Nervous/Excited About? (5 minutes)

**Instructor asks teams to discuss:**

1. **What are you nervous about?**
   - Shared repo? Conflicts?
   - Working with different teams?
   - Different workflow?

2. **What are you excited about?**
   - Building real features?
   - Working with different people?
   - Learning new skills?

3. **What questions do you have?**
   - About Phase 2?
   - About workflow?
   - About teams?

**Instructor:** Address common concerns, answer questions

**Key Point:** "It's normal to be nervous. We'll learn together. Phase 2 is about growth."

**Transition:** "On Thursday, we'll do demos and form Phase 2 teams..."


### Part 6: Wrap-up (10 minutes)

#### Reminders (5 minutes)
- Prepare your demo (test it, practice it)
- Clean up PRs (rebase, linear history, clear descriptions)
- Reflect on Phase 1 (what did you learn? how did you grow?)
- Get ready for Phase 2 (shared repo, vertical teams, collaboration)

#### Preview Thursday (3 minutes)
- **Sprint 1 demos:** Each team demos their Phase 1 work
- **Phase 1 retrospective:** What worked? What didn't? How did we grow?
- **Phase 2 team formation:** Form vertical teams
- **Phase 2 kickoff:** Understand shared repo, assign features

#### Questions (2 minutes)
- Open floor for questions
- Address common concerns


## Materials Needed

- Codebase open and navigable
- Git setup for rebasing practice
- Demo prep checklist (handout or digital)
- PR cleanup guide (handout or digital)
- Reflection framework (handout or digital)


## Instructor Notes

### Common Issues

**Issue: Teams don't know what to demo**  
Solution: Help them choose one clear feature, focus on user value

**Issue: PRs are messy**  
Solution: Provide rebase tutorial, help them clean up, emphasize importance

**Issue: Reflection is surface-level**  
Solution: Provide specific prompts, encourage honesty, model deep reflection

**Issue: Teams are anxious about Phase 2**  
Solution: Acknowledge concerns, explain support available, emphasize learning together

### Time Management

- **If running short:** Focus on demo prep, move PR cleanup to homework
- **If running long:** Move some reflection to homework, focus on demo prep

### Differentiation

- **For advanced students:** Have them help others with rebasing, lead reflection discussions
- **For struggling students:** Provide more demo prep help, simpler reflection prompts


## Student Deliverables

- Demo prepared (for Thursday)
- PRs cleaned up (if needed, can be homework)
- Phase 1 reflection started (can be part of HW7)


## Next Steps

- **Before Thursday:** Prepare demo, clean up PRs if needed
- **Thursday:** Sprint 1 demos + Phase 1 retrospective + Phase 2 team formation
- **Homework:** HW7 due Tuesday, Mar 17 (after spring break)

