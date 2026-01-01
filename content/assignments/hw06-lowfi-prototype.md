---
title: "Low-Fi + Hi-Fi Prototypes + UX Implementation"
date: "2026-02-26"
type: "assignment"
num: "6"
due_date: "2026-03-03"
---

## Overview

This assignment has three parts:
1. **Create Prototypes** - Your team creates low-fi and high-fi prototypes for one user flow
2. **Implement UX Improvement** - Your team implements one UX improvement based on prototype feedback
3. **Individual Reflection** - Reflect on how prototyping changed your thinking about user needs

This assignment builds on human-centered design and prototyping from class. You'll practice thinking from users' perspectives and connecting design to implementation.


## Part 1: Create Prototypes (40 points)

### Instructions

Your team will create both low-fi and high-fi prototypes for one user flow, addressing a usability issue you identified.

### Requirements

#### 1. Choose a User Flow (5 points)

**Select one user flow to prototype:**

**Options:**
- Login/authentication flow
- Creating a group/course/module
- Viewing and navigating course content
- Posting or commenting
- Or another meaningful flow

**Requirements:**
- Flow should have a clear user goal
- Flow should have identified usability issues (from critique)
- Flow should be meaningful (not too simple, not too complex)

**Documentation:**
In your submission, explain which flow you chose and why.

#### 2. Create Low-Fi Prototype (15 points)

**Create a low-fidelity prototype:**

**Format:**
- Paper sketches, OR
- Digital wireframes (Figma, etc.)
- Focus on flow and structure, not details

**Requirements:**
- Shows all screens in the flow
- Shows key interactions (navigation, buttons, forms)
- Addresses at least one usability issue
- Clear enough to test with teammates

**Submission:**
- Photos of paper sketches, OR
- Link to digital prototype
- Brief description of the flow and improvements

#### 3. Create High-Fi Prototype (20 points)

**Create a high-fidelity prototype:**

**Format:**
- Figma, Adobe XD, Sketch, or similar
- Should be interactive (clickable, navigable)
- Should look like the real app

**Requirements:**
- Detailed, realistic design
- Interactive (can click through the flow)
- Uses consistent design patterns
- Addresses usability issues from low-fi
- Includes realistic content (not "lorem ipsum")

**Submission:**
- Link to interactive prototype, OR
- Screenshots/video of prototype
- Brief description of interactions and improvements

### Submission

- **Format:** Photos, links, or files (prototypes) + written description
- **Location:** Submit via course platform or include in PR description
- **Team submission:** One set of prototypes per team


## Part 2: Implement UX Improvement (40 points)

### Instructions

Your team will implement one UX improvement based on your prototype feedback.

### Requirements

#### 1. Choose One Improvement (5 points)

**Select one UX improvement to implement:**

**Should be:**
- Based on prototype feedback
- Meaningful (addresses a real usability issue)
- Implementable (can be done in reasonable time)
- Testable (can verify it improves UX)

**Examples:**
- Add loading states
- Improve error messages
- Add empty states
- Improve navigation flow
- Add confirmation dialogs
- Improve form validation feedback
- Better visual hierarchy

**Documentation:**
In your PR description, explain which improvement you chose and why.

#### 2. Map Prototype to Implementation (10 points)

**Document how prototype maps to code:**

**Template:**

```markdown
## Prototype → Implementation Mapping

### Prototype Screen: [Screen Name]
- **Prototype behavior:** [What happens in prototype?]
- **System behavior:**
  - [What component handles this?]
  - [What state is needed?]
  - [What API calls are needed?]
  - [What UI states need handling?]

### Improvements Made
- [What changed from current implementation?]
- [How does it improve UX?]
```

**Requirements:**
- Clear mapping between prototype and code
- Explains what changed and why
- Shows understanding of implementation

#### 3. Implement the Improvement (20 points)

**Implement the UX improvement:**

**Requirements:**
- Improvement works as intended
- Matches prototype (or explains differences)
- Handles all UI states (loading, error, success, empty)
- Code is clean and well-organized
- Tests pass (if applicable)

**Code quality:**
- Follows existing patterns
- Uses appropriate components
- Handles edge cases
- Well-commented if needed

#### 4. Create Pull Request (5 points)

**Create PR with improvement:**

**PR Description Template:**

```markdown
## UX Improvement: [Improvement Name]

### Problem
- [What usability issue does this address?]
- [What was the user experience before?]

### Solution
- [How does this improvement solve it?]
- [What's the user experience after?]

### Prototype
- [Link to or description of prototype]
- [How does implementation match prototype?]

### Changes Made
- [What files/components changed?]
- [What functionality was added/modified?]

### Testing
- [How was this tested?]
- [What scenarios were covered?]

### Screenshots
- [Before and after screenshots]
```

**Requirements:**
- Clear PR description
- Includes prototype link/description
- Includes before/after screenshots
- Well-documented

### Submission

- **Format:** GitHub Pull Request
- **Location:** Your team's repository fork
- **Team submission:** One PR per team


## Part 3: Individual Reflection (20 points)

### Instructions

Write a reflection on how prototyping changed your thinking about user needs and UX design.

### Reflection Questions

**Answer these questions (2-3 paragraphs each):**

1. **How did prototyping change your thinking?**
   - What assumptions did you challenge?
   - What did you learn about user needs?
   - How did your perspective shift?

2. **What did you learn about UX design?**
   - What makes good UX?
   - What makes bad UX?
   - What principles are most important?

3. **What was the value of prototyping?**
   - Why prototype before building?
   - What did it help you discover?
   - What would you do differently next time?

4. **What was hard about UX design?**
   - What was challenging?
   - What questions do you still have?
   - What would help you understand better?

5. **How does UX design connect to what you already know?**
   - How does it connect to code quality?
   - How does it connect to testing?
   - How does it connect to collaboration?

### Submission

- **Format:** Written reflection (500-750 words total)
- **Location:** Submit via course platform
- **Individual submission:** Each team member submits their own reflection


## Grading Rubric

| Criteria | Points | Description |
|----------|--------|-------------|
| Low-Fi Prototype | 15 | Clear, addresses usability issue, shows flow |
| High-Fi Prototype | 20 | Detailed, interactive, realistic, addresses issues |
| Improvement Selection | 5 | Meaningful improvement based on prototype |
| Prototype Mapping | 10 | Clear mapping between prototype and implementation |
| Implementation | 20 | Improvement works, matches prototype, handles states |
| PR Quality | 5 | Clear description, well-documented, includes screenshots |
| Reflection Quality | 20 | Thoughtful reflection on prototyping and UX |
| **Total** | **100** | |


## Submission Checklist

### Team Submission:
- [ ] Low-fi prototype created (paper or digital)
- [ ] High-fi prototype created (interactive, detailed)
- [ ] One UX improvement implemented (PR)
- [ ] PR description includes prototype mapping
- [ ] Before/after screenshots included
- [ ] Improvement tested and working

### Individual Submission:
- [ ] Reflection submitted
  - [ ] Answered all reflection questions
  - [ ] 500-750 words total
  - [ ] Thoughtful and specific


## Tips for Success

### Prototyping
- **Start simple:** Low-fi first, then high-fi
- **Focus on flow:** Don't get lost in details
- **Test with teammates:** Get feedback early
- **Iterate:** Prototypes are meant to change

### Implementation
- **Map carefully:** Understand how prototype translates to code
- **Test thoroughly:** Verify improvement works
- **Document well:** Explain what and why
- **Get feedback:** Have teammates test the improvement

### Reflection
- **Be honest:** What was hard? What did you learn?
- **Be specific:** Give examples from your experience
- **Think critically:** What would you do differently? Why?


## Common Issues and Solutions

### Issue: Prototype doesn't match implementation
**Solution:** Map prototype behaviors to system behaviors, test implementation against prototype

### Issue: Improvement is too small
**Solution:** Choose meaningful improvements that address real usability issues

### Issue: Don't know what to improve
**Solution:** Use critique framework, apply usability heuristics, think from user perspective

### Issue: Reflection is surface-level
**Solution:** Be specific, give examples, think about what you learned


## Resources

- **Don't Make Me Think:** https://www.sensible.com/dmmt.html
- **10 Usability Heuristics:** https://www.nngroup.com/articles/ten-usability-heuristics/
- **Figma Tutorial:** (from class or online resources)
- **Prototyping Best Practices:** (from class activities)


## Next Steps

After completing this assignment, you'll:
- Understand the value of prototyping
- Be able to think from users' perspectives
- Be able to connect design to implementation
- Be ready for Phase 1 demos and Phase 2 transition

Good luck!

