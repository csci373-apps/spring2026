---
title: "High-Fidelity Prototyping + Implementation"
start_date: "2026-02-26"
type: "activity"
draft: 1
---

## Learning Objectives

By the end of this session, students will:
- Understand the difference between low-fi and high-fi prototypes
- Be able to create high-fidelity prototypes (Figma or similar)
- Be able to map prototype behaviors to system behaviors
- Be able to implement one UX improvement based on prototype feedback
- Reflect on how prototyping changed their thinking about user needs


## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:10 | Review & Warm-up | Review low-fi prototypes, address questions |
| 0:10-0:30 | High-Fi Prototyping Workshop | Create detailed prototypes |
| 0:30-1:00 | Implementation Studio | Implement one UX improvement |
| 1:00-1:15 | Prototype Critique | Review prototypes and implementations |
| 1:15-1:25 | Reflection | How did prototyping change our thinking? |
| 1:25-1:30 | Wrap-up | Preview homework |


## Detailed Instructions

### Part 1: Review & Warm-up (10 minutes)

#### Check-in (3 minutes)
1. **Welcome back**
2. **Quick check:** "Raise your hand if:"
   - You created a low-fi prototype (from Tuesday)
   - You read the HCD readings
   - You have questions about prototyping

#### Review Low-Fi Prototypes (5 minutes)

**Instructor asks:** "Who created a low-fi prototype? Share one thing you learned."

**Common insights:**
- "I didn't realize how many decisions go into UI design"
- "Prototyping helped me see the flow more clearly"
- "It's easier to change a sketch than code"

**Address questions** about low-fi prototyping

#### Preview Today (2 minutes)
- "Today we're creating high-fi prototypes"
- "Then we'll implement one UX improvement"
- "This connects design to implementation"

**Transition:** "Let's learn about high-fi prototyping..."


### Part 2: High-Fi Prototyping Workshop (20 minutes)

#### What is High-Fi Prototyping? (5 minutes)

**Instructor explains:**
- **High-fi prototype:** Detailed, interactive prototype that looks like the real thing
- **Purpose:** Test detailed interactions and visual design
- **Tools:** Figma, Adobe XD, Sketch, or similar
- **Key:** Should be interactive enough to test user flows

**Show examples:**
- Figma prototype with interactions
- Clickable wireframes
- "Looks like the real app"

**Key Point:** "High-fi prototypes help us test detailed interactions before building."

#### Low-Fi vs High-Fi (3 minutes)

**Instructor explains the difference:**

| Low-Fi | High-Fi |
|--------|---------|
| Quick sketches | Detailed designs |
| Paper or simple wireframes | Digital, interactive |
| Focus on flow | Focus on details |
| Fast to create | Takes more time |
| Easy to change | Harder to change |
| Test structure | Test interactions |

**When to use each:**
- **Low-fi:** Early ideas, testing flow, quick iterations
- **High-fi:** Detailed interactions, visual design, final testing

**Key Point:** "Start low-fi, then go high-fi once the flow is right."

#### Creating High-Fi Prototypes (12 minutes)

**Instructor demonstrates (or provides tutorial):**

1. **Set up in Figma (or similar):**
   - Create frames for each screen
   - Use design system components (if available)
   - Add realistic content

2. **Add interactions:**
   - Link screens together
   - Add hover states
   - Add click/tap interactions
   - Show transitions

3. **Test the prototype:**
   - Walk through the flow
   - Check if interactions make sense
   - Verify the flow is clear

**Key considerations:**
- **Consistency:** Use consistent design patterns
- **Realistic content:** Use real data, not "lorem ipsum"
- **Interactions:** Make it feel real
- **Accessibility:** Consider color contrast, text size, etc.

**Instructor:** Provide Figma tutorial or walkthrough if needed

**Key Point:** "High-fi prototypes should feel like the real app. Test them with teammates."

**Transition:** "Now let's create high-fi prototypes..."


### Part 3: Implementation Studio (30 minutes)

#### Map Prototype to Implementation (5 minutes)

**Instructor explains:**
- **Prototype behaviors** → **System behaviors**
- **Prototype screens** → **React/React Native components**
- **Prototype interactions** → **Event handlers and navigation**
- **Prototype states** → **Component state**

**Show example mapping:**

```markdown
## Prototype → Implementation Mapping

### Prototype Screen: Login Page
- **Prototype behavior:** User enters email/password, clicks "Login"
- **System behavior:** 
  - Validate input
  - Call API endpoint
  - Handle loading state
  - Handle error state
  - Navigate on success

### Prototype Screen: Groups List
- **Prototype behavior:** User sees list of groups, can tap to view details
- **System behavior:**
  - Fetch groups from API
  - Display in list component
  - Handle loading/error/empty states
  - Navigate to detail screen on tap
```

**Key Point:** "Prototypes show what should happen. Code makes it happen."

#### Choose One UX Improvement (5 minutes)

**Instructor asks teams to:**
1. **Review their low-fi prototype** (from Tuesday)
2. **Create high-fi prototype** (if time allows, or do as homework)
3. **Choose one UX improvement** to implement:
   - Should address a usability issue
   - Should be implementable in ~20 minutes
   - Should be meaningful (not just cosmetic)

**Examples:**
- Add loading states
- Improve error messages
- Add empty states
- Improve navigation flow
- Add confirmation dialogs
- Improve form validation feedback

#### Implement the Improvement (20 minutes)

**Instructor guides teams:**

1. **Plan the implementation:**
   - What component needs to change?
   - What state is needed?
   - What API calls are needed?
   - What UI states need handling?

2. **Implement:**
   - Make code changes
   - Test the improvement
   - Verify it matches the prototype

3. **Document:**
   - What did you change?
   - Why did you change it?
   - How does it improve UX?

**Instructor circulates:**
- Help teams plan implementation
- Guide them through code changes
- Ensure improvements are meaningful

**Key Point:** "Implementation brings prototypes to life. Test that it works as intended."

**Transition:** "Let's review what we built..."


### Part 4: Prototype Critique (15 minutes)

#### Share Prototypes and Implementations (10 minutes)

**Ask 2-3 teams to share:**
1. **Their prototype** (low-fi or high-fi)
2. **The UX improvement they implemented**
3. **How it addresses the usability issue**
4. **What they learned**

**Instructor leads discussion:**
- **What's good about the prototype?**
- **Does the implementation match the prototype?**
- **Does it improve usability?**
- **What could be better?**

**Common insights:**
- "Prototyping helped me think through the flow"
- "Implementing made me realize some assumptions were wrong"
- "The prototype looked good, but implementation revealed issues"

**Key Point:** "Prototyping and implementation inform each other. Both are valuable."

#### Best Practices Summary (5 minutes)

**Instructor summarizes:**

1. **Start with low-fi:**
   - Test flow and structure
   - Quick to create and change

2. **Move to high-fi:**
   - Test detailed interactions
   - Refine visual design

3. **Implement:**
   - Make it real
   - Test with actual code
   - Learn from implementation

4. **Iterate:**
   - Prototype → Implement → Learn → Prototype again

**Key Point:** "Design and implementation are a cycle. Each informs the other."

**Transition:** "Let's reflect on what we learned..."


### Part 5: Reflection (10 minutes)

#### Reflection Activity (8 minutes)

**Instructor asks teams to discuss:**

1. **What did we do today?**
   - Created high-fi prototypes
   - Implemented UX improvements
   - Reviewed prototypes and implementations

2. **How did prototyping change our thinking?**
   - What assumptions did we challenge?
   - What did we learn about user needs?
   - What surprised us?

3. **What's the value of prototyping?**
   - Why prototype before building?
   - What did it help us discover?
   - What would we do differently?

4. **What's hard about UX design?**
   - What's challenging?
   - What questions do we have?
   - What would help?

**Instructor asks 2-3 teams to share:**
- One way prototyping changed their thinking
- One thing they learned about UX
- One question they have

**Common insights:**
- "Prototyping helped me see the user's perspective"
- "I realized some things I thought were clear weren't"
- "Testing with teammates revealed issues I missed"
- "Implementation made me think about edge cases"

**Key Point:** "Prototyping helps us think from users' perspectives. It's a valuable skill."

#### Preview Homework (2 minutes)

**HW6: Low-Fi + Hi-Fi Prototypes + UX Implementation + Reflection**
- **Due:** Next Tuesday (Mar 3)
- **Requirements:**
  1. Create low-fi prototype (from Tuesday or new one)
  2. Create high-fi prototype
  3. Implement one UX improvement
  4. Reflect on how prototyping changed your thinking

**Transition:** "Next week we'll prepare for demos and reflect on Phase 1..."


### Part 6: Wrap-up (5 minutes)

#### Reminders (3 minutes)
- Prototyping helps us think from users' perspectives
- Low-fi for flow, high-fi for details
- Implementation brings prototypes to life
- Design and implementation inform each other

#### Questions (2 minutes)
- Open floor for questions
- Address common concerns


## Materials Needed

- Codebase open and navigable (web and mobile)
- Figma or similar prototyping tool (or paper for low-fi)
- Prototype → Implementation mapping template (handout or digital)
- Computer for each student/pair


## Instructor Notes

### Common Issues

**Issue: Teams spend too long on prototypes**  
Solution: Set time limits, focus on key screens, remind them it's about testing ideas

**Issue: Prototypes don't match implementation**  
Solution: Map prototype behaviors to system behaviors, test implementation against prototype

**Issue: UX improvements are too small**  
Solution: Encourage meaningful changes, focus on usability issues from critique

**Issue: Teams don't see value in prototyping**  
Solution: Show how prototyping reveals issues early, saves time in implementation

### Time Management

- **If running short:** Focus on one improvement, skip some critique
- **If running long:** Move some prototyping to homework, focus on implementation

### Differentiation

- **For advanced students:** Have them create more detailed prototypes, implement multiple improvements
- **For struggling students:** Provide simpler improvement options, more scaffolding


## Student Deliverables

- High-fi prototype created (can be part of HW6)
- One UX improvement implemented (can be part of HW6)
- Reflection on prototyping experience (can be part of HW6)


## Next Steps

- **Before Tuesday:** Complete HW6
- **Tuesday:** Demo prep and Phase 1 reflection
- **Homework:** HW6 due next Tuesday

