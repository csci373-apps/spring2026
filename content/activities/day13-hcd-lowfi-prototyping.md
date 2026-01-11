---
title: "Human-Centered Design + Low-Fi Prototyping"
start_date: "2026-02-24"
type: "activity"
---

## Learning Objectives

By the end of this session, students will:
- Understand human-centered design principles
- Be able to critique existing UI from a user perspective
- Be able to create low-fidelity prototypes (paper or digital)
- Identify mismatches between current UI/system behavior and user goals
- Reflect on what user needs aren't being met


## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:15 | Reflection on HW5 | Review mobile development experience |
| 0:15-0:35 | HCD Lecture | Human-centered design principles |
| 0:35-1:05 | UI Critique Activity | Critique existing UI (web and mobile) |
| 1:05-1:20 | Low-Fi Prototyping Studio | Create paper or digital prototypes |
| 1:20-1:30 | Q&A & Wrap-up | Questions, preview homework |


## Detailed Instructions

### Part 1: Reflection on HW5 (15 minutes)

#### Check-in (3 minutes)
1. **Welcome back**
2. **Quick check:** "Raise your hand if:"
   - You completed HW5 (mobile integration)
   - You received feedback on your PR
   - You have questions about mobile development

#### Reflection Activity: Mobile Development (7 minutes)

**Instructor asks teams to discuss:**

1. **What did you build?**
   - What mobile UI did you implement?
   - What was the experience like?
   - What worked well?

2. **How is mobile different from web?**
   - What was easier? What was harder?
   - What patterns make sense on mobile?
   - What questions do you have?

**Instructor asks 2-3 teams to share:**
- One thing that was different about mobile
- One thing that clicked
- One question they have

**Common insights to highlight:**
- "Mobile feels more natural for some interactions"
- "Navigation is different but makes sense"
- "Touch interactions are intuitive"
- "Styling is different but similar concepts"

**Key Point:** "Now that we've built both web and mobile, let's think about the user experience from a design perspective."

#### Preview Today (5 minutes)
- "Today we're learning about human-centered design"
- "We'll critique existing UIs and create prototypes"
- "This shifts our focus from 'does it work?' to 'does it work well for users?'"

**Transition:** "Let's learn about human-centered design..."


### Part 2: HCD Lecture (20 minutes)

#### What is Human-Centered Design? (5 minutes)

**Instructor explains:**
- **HCD:** Design that focuses on users' needs, goals, and context
- **Not just:** Making it look pretty
- **But:** Making it work well for the people who use it
- **Key question:** "What do users need? What are they trying to accomplish?"

**Key Point:** "Good design solves real problems for real people."

#### Core HCD Principles (10 minutes)

**Instructor explains key principles:**

1. **Understand Users:**
   - Who are your users?
   - What are they trying to do?
   - What are their goals?
   - What context are they in? (mobile? desktop? stressed? relaxed?)

2. **Usability:**
   - **Learnable:** Can users figure it out?
   - **Efficient:** Can users do tasks quickly?
   - **Memorable:** Can users remember how to use it?
   - **Error-tolerant:** Do errors happen? Can users recover?
   - **Satisfying:** Do users enjoy using it?

3. **Accessibility:**
   - Can everyone use it? (different abilities, devices, contexts)
   - Is it inclusive?

4. **Iterative Design:**
   - Design → Test → Learn → Redesign
   - Don't get it right the first time
   - Learn from users

**Show examples from codebase:**
- "What user goal does this feature support?"
- "Is this easy to use? Why or why not?"
- "What could be improved?"

**Key Point:** "HCD is about empathy - understanding users' perspectives."

#### 10 Usability Heuristics (5 minutes)

**Instructor introduces Nielsen's 10 Usability Heuristics:**

1. **Visibility of system status** - Users should know what's happening
2. **Match between system and real world** - Use familiar language/concepts
3. **User control and freedom** - Easy to undo/escape
4. **Consistency and standards** - Follow conventions
5. **Error prevention** - Prevent errors before they happen
6. **Recognition rather than recall** - Show options, don't make users remember
7. **Flexibility and efficiency** - Support both novices and experts
8. **Aesthetic and minimalist design** - Don't clutter
9. **Help users recognize, diagnose, and recover from errors** - Clear error messages
10. **Help and documentation** - Should be unnecessary, but available

**Quick examples:**
- "Loading spinner" → Visibility of system status
- "Back button" → User control and freedom
- "Consistent navigation" → Consistency and standards

**Key Point:** "These heuristics help us identify usability issues."

**Transition:** "Now let's critique our existing UI..."


### Part 3: UI Critique Activity (30 minutes)

#### Setup (5 minutes)

**Instructor provides:**
- **Target flows to critique:**
  - Login flow (web and mobile)
  - Creating a group (web and mobile)
  - Viewing course details (web and mobile)
  - Or another flow teams have built

- **Critique framework:**
  - What user goal is this trying to support?
  - Is it easy to use? Why or why not?
  - What usability heuristics apply?
  - What's confusing? What's clear?
  - What could be improved?

#### Team Critique Activity (20 minutes)

**Instructions:**
1. **Work in teams**
2. **Choose one flow** to critique (web or mobile, or both)
3. **Use the critique framework:**
   - Walk through the flow as a user
   - Identify usability issues
   - Apply usability heuristics
   - Document findings

**Template:**

```markdown
## UI Critique: [Flow Name]

### User Goal
- What is the user trying to accomplish?

### Walkthrough
1. Step 1: [What happens?]
2. Step 2: [What happens?]
3. ...

### Usability Issues
- **Issue 1:** [Description]
  - **Heuristic violated:** [Which one?]
  - **Impact:** [How does this affect users?]
  - **Suggestion:** [How could this be improved?]

- **Issue 2:** [Description]
  - ...
```

**Instructor circulates:**
- Help teams think through user perspective
- Guide them to identify specific issues
- Ensure they consider usability heuristics

#### Share Findings (5 minutes)

**Ask 2-3 teams to share:**
- One usability issue they found
- Which heuristic it violates
- How it could be improved

**Common issues to discuss:**
- "I don't know what's happening" → Visibility of system status
- "I'm not sure what this button does" → Recognition rather than recall
- "I can't undo this" → User control and freedom
- "This is confusing" → Match between system and real world

**Key Point:** "Critique helps us see our UI from users' perspectives."

**Transition:** "Now let's create prototypes to address these issues..."


### Part 4: Low-Fi Prototyping Studio (15 minutes)

#### What is Low-Fi Prototyping? (3 minutes)

**Instructor explains:**
- **Low-fi prototype:** Simple, quick sketch of a UI
- **Purpose:** Test ideas before building
- **Materials:** Paper, pen, or digital tool (Figma, etc.)
- **Key:** Don't spend time on details - focus on flow and structure

**Show examples:**
- Paper sketches
- Digital wireframes
- "Boxes and arrows" style

**Key Point:** "Low-fi prototypes are fast and cheap. They help us test ideas quickly."

#### Prototyping Activity (10 minutes)

**Instructions:**
1. **Pick one usability issue** from your critique
2. **Create a low-fi prototype** that addresses it:
   - Sketch the improved flow
   - Focus on structure, not details
   - Show key screens and interactions
   - Use paper or digital tool

**Template:**

```markdown
## Low-Fi Prototype: [Improvement Name]

### Problem
- [What usability issue does this address?]

### Solution
- [How does the prototype solve it?]

### Screens
1. [Screen 1 sketch/description]
2. [Screen 2 sketch/description]
3. ...

### Interactions
- [How does user navigate?]
- [What happens when user clicks/taps?]
```

**Instructor circulates:**
- Help teams create prototypes
- Ensure they focus on solving the usability issue
- Guide them to think about user flow

#### Share Prototypes (2 minutes)

**Ask 1-2 teams to share:**
- The problem they're solving
- Their prototype solution
- How it improves usability

**Key Point:** "Prototypes help us test ideas before building. We'll refine these next class."

**Transition:** "On Thursday, we'll create high-fi prototypes and implement improvements..."


### Part 5: Q&A & Wrap-up (10 minutes)

#### Questions (7 minutes)
- Open floor for questions
- Address common confusions:
  - "HCD vs just making it pretty?" → Focus on user needs, not aesthetics
  - "How do I know what users need?" → Observe, ask, test
  - "What if I can't test with real users?" → Use heuristics, critique, think from user perspective

#### Preview Homework (2 minutes)
- **HW6:** Low-Fi + Hi-Fi Prototypes + UX Implementation
- **Due:** Next Tuesday (Mar 3)
- **Process:**
  1. Create low-fi prototype (from today or new one)
  2. Create high-fi prototype (Thursday)
  3. Implement one UX improvement
  4. Reflect on how prototyping changed your thinking

#### Wrap-up (1 minute)
- Remind students to:
  - Read "Don't Make Me Think" Ch. 1-2 (due Thursday)
  - Read "10 Usability Heuristics" (due Thursday)
  - Come ready to create high-fi prototypes on Thursday


## Materials Needed

- Codebase open and navigable (web and mobile)
- Paper and pens (for paper prototyping)
- Figma or similar tool (for digital prototyping, optional)
- Usability heuristics reference (handout or digital)
- Critique framework template (handout or digital)


## Instructor Notes

### Common Confusions

**"HCD is just making it look good"**
- HCD is about usability and user needs, not aesthetics
- Focus on function first, then form
- Good design solves problems

**"I don't know what users need"**
- Start with your own experience using the app
- Apply usability heuristics
- Think about common user goals
- Test with teammates

**"Prototyping takes too long"**
- Low-fi prototypes should be quick (10-15 minutes)
- Focus on flow, not details
- Don't perfect it - test the idea

### Time Management

- **If running short:** Focus on critique, skip some prototyping
- **If running long:** Move prototyping to homework, focus on critique

### Differentiation

- **For advanced students:** Have them critique multiple flows, create more detailed prototypes
- **For struggling students:** Provide simpler critique framework, focus on one flow


## Student Deliverables

- UI critique completed (can be part of HW6)
- Low-fi prototype created (can be part of HW6)
- Reflection on HW5 (mobile development experience)


## Next Steps

- **Before Thursday:** Read "Don't Make Me Think" Ch. 1-2, "10 Usability Heuristics"
- **Thursday:** High-fidelity prototyping + implementation
- **Homework:** HW6 due next Tuesday

