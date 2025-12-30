---
title: "Course Intro"
date: "2026-01-13"
type: "activity"
---

## Learning Objectives

By the end of this session, students will:
- Understand course expectations and studio norms
- Be familiar with the two-phase course structure
- Have traced a request through the stripped-down starter app
- Understand reflection as a core practice in this course



## Agenda (90 minutes)

| Time | Activity | Description |
|------|----------|-------------|
| 0:00-0:15 | Welcome & Course Overview | Introductions, course structure, expectations |
| 0:15-0:30 | Starter App Walkthrough | High-level architecture tour |
| 0:30-0:60 | Trace-a-Request Activity | Hands-on request tracing |
| 0:60-0:75 | Reflection Introduction | What is reflection? Why do we do it? |
| 0:75-0:90 | Q&A & Wrap-up | Questions, next steps, homework preview |



## Detailed Instructions

### Part 1: Welcome & Course Overview (15 minutes)

#### Opening (5 minutes)
1. **Welcome students** and introduce yourself
2. **Quick introductions:** Have students share:
   - Name
   - Programming experience (beginner/intermediate/advanced)
   - What they're most excited about
   - What they're most nervous about

#### Course Structure Overview (10 minutes)
**Use slides or whiteboard to explain:**

1. **Two-Phase Structure:**
   - **Phase 1 (Weeks 1-8):** Learning and exploration
     - Each team works in their own repo/fork
     - Focus: Learn technical skills, teamwork, reflection
     - Build "toy features" to learn, not production code
   - **Phase 2 (Weeks 10-16):** Vertical features
     - Shared repo (main branch is source of truth)
     - Focus: Build real features, collaboration, integration
     - Vertical teams: backend + web + mobile developers together

2. **Key Practices:**
   - **Reflection:** Built into every week and assignment
   - **Teamwork:** Pair programming, mob programming, team agreements
   - **Code Review:** As learning tool, not gatekeeping
   - **Design Thinking:** Prototyping, user-centered design

3. **Studio Norms:**
   - Ask questions (no question is too basic)
   - Help each other (collaboration over competition)
   - Make mistakes (that's how we learn)
   - Reflect on what you're learning

**Transition:** "Now let's look at what we'll be working with..."



### Part 2: Starter App Walkthrough (15 minutes)

#### Setup (2 minutes)
1. **Open the starter app repository** (projected on screen)
2. **Navigate to the root directory**
3. **Explain:** "This is a stripped-down version of a health education app. We've removed complexity so you can focus on learning."

#### High-Level Architecture Tour (13 minutes)

**1. Directory Structure (3 minutes)**
```
health-app/
├── backend/          # FastAPI backend
│   ├── models/       # Database models (SQLAlchemy)
│   ├── schemas/      # Pydantic schemas (API contracts)
│   ├── routes/       # API endpoints
│   └── server.py     # FastAPI app entry point
├── ui/               # React web frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.tsx
└── mobile/           # React Native mobile app
    └── app/
```

**Key Points:**
- Three separate applications (backend, web, mobile)
- Each has its own structure and purpose
- They communicate via API

**2. Backend Overview (4 minutes)**
Navigate to `backend/` and show:

- **`models/user.py`** - Database model
  - "This defines the database table structure"
  - Show: `id`, `username`, `email`, `role`
  
- **`schemas/auth.py`** - Pydantic schema
  - "This defines the API contract - what data goes in/out"
  - Show: `UserCreate`, `Token`
  
- **`routes/auth.py`** - API endpoint
  - "This is the actual API endpoint"
  - Show: `POST /api/auth/login`
  - Explain: "This function handles login requests"

**3. Frontend Overview (3 minutes)**
Navigate to `ui/src/` and show:

- **`App.tsx`** - Main React component
  - "This is the entry point for the web app"
  
- **`pages/Login.tsx`** (if exists) or similar
  - "This is a page component"
  - Show: How it calls the API

**4. Mobile Overview (3 minutes)**
Navigate to `mobile/app/` and show:

- **`(auth)/login.tsx`** - Mobile login screen
  - "This is the mobile version"
  - Show: Similar structure to web, but React Native

**Key Point:** "Notice how web and mobile both call the same backend API. That's the power of a shared backend."

**Transition:** "Now let's trace a request from start to finish..."



### Part 3: Trace-a-Request Activity (30 minutes)

#### Setup (2 minutes)
1. **Start the backend server** (if not already running)
   ```bash
   cd backend
   poetry run uvicorn server:app --reload
   ```
2. **Open browser** to `http://localhost:8000/docs` (FastAPI docs)
3. **Open browser DevTools** (Network tab)

#### Activity: Trace a Login Request (28 minutes)

**Step 1: Frontend Initiates Request (5 minutes)**
1. **Open the web app** in browser
2. **Navigate to login page**
3. **Open DevTools → Network tab**
4. **Enter credentials and click "Login"**
5. **Point out:**
   - Request appears in Network tab
   - Method: POST
   - URL: `http://localhost:8000/api/auth/login`
   - Request body: `{"username": "...", "password": "..."}`

**Instructor asks:** "What just happened? Where did this request come from?"

**Step 2: Request Reaches Backend (10 minutes)**
1. **Navigate to `backend/routes/auth.py`**
2. **Find the login endpoint:**
   ```python
   @router.post("/login")
   async def login(...):
   ```
3. **Walk through the code:**
   - "The request arrives here"
   - "We validate the request body using Pydantic schema"
   - "We query the database using the model"
   - "We check the password"
   - "We return a token"

4. **Show the database query:**
   - Navigate to where `User` model is queried
   - Explain: "This is SQLAlchemy - it translates Python to SQL"

5. **Show the response:**
   - "We return a JSON response with a token"
   - Point to response in Network tab

**Instructor asks:** "What happens if the password is wrong? What about if the user doesn't exist?"

**Step 3: Response Returns to Frontend (8 minutes)**
1. **Back in the browser, show the response:**
   - Status: 200 OK
   - Response body: `{"access_token": "...", "token_type": "bearer"}`

2. **Navigate to frontend code that handles this:**
   - Show where the fetch/axios call is made
   - Show where the token is stored (localStorage)
   - Show where the user is redirected

3. **Explain the flow:**
   - "Frontend receives token"
   - "Stores it in localStorage"
   - "Uses it for future API calls"
   - "Redirects to dashboard"

**Step 4: Future Requests (5 minutes)**
1. **Show how subsequent requests include the token:**
   - Open Network tab
   - Show `Authorization: Bearer <token>` header
   - Explain: "Every request includes this token"

2. **Navigate to a protected endpoint:**
   - Show how backend checks the token
   - Show the `get_current_user` dependency

**Key Takeaways:**
- Frontend → Backend → Database → Backend → Frontend
- Each layer has a specific responsibility
- Data flows through the system in a predictable way

**Transition:** "This is the foundation. Now let's talk about reflection..."



### Part 4: Reflection Introduction (15 minutes)

#### What is Reflection? (5 minutes)

**Instructor explains:**
- Reflection is thinking about what you're learning
- It's not just "what did I do?" but "what did I learn?"
- It helps solidify knowledge and identify gaps

**Show reflection template:**
```markdown
## What did I do?
[Describe the activity/task]

## What did I learn?
[What new concepts or skills did you gain?]

## What was hard?
[What was confusing or challenging?]

## What questions do I have?
[What do you still want to know?]

## How does this connect to what I already know?
[Make connections to previous learning]
```

#### Why Reflection Matters (5 minutes)

**Discuss:**
1. **Learning Science:**
   - Reflection helps transfer knowledge from short-term to long-term memory
   - It helps identify what you don't understand

2. **Professional Practice:**
   - Software developers constantly reflect on their work
   - Code reviews are a form of reflection
   - Retrospectives are team reflection

3. **In This Course:**
   - Every assignment includes reflection
   - We'll reflect as individuals and as teams
   - Reflection is part of your grade (not just code)

#### First Reflection Practice (5 minutes)

**Activity:** "Let's practice reflection right now"

**Instructor asks:**
1. "What did we just do?" (trace a request)
2. "What did you learn?" (how requests flow through the system)
3. "What was confusing?" (let students share)
4. "What questions do you have?" (write them down)

**Key Point:** "This is what reflection looks like. We'll do this regularly."



### Part 5: Q&A & Wrap-up (15 minutes)

#### Questions (10 minutes)
- Open floor for questions
- Address common concerns:
  - "I'm new to programming" → That's okay! We'll learn together
  - "What if I fall behind?" → Ask for help, work with your team
  - "How much time will this take?" → Expect 6-10 hours/week outside class

#### Preview Next Class (3 minutes)
- **Thursday:** Team formation, working agreement, dev setup
- **Homework:** Will be assigned Thursday (due next Tuesday)
- **Reading:** The Pragmatic Programmer (Ch. 1) - due Thursday

#### Wrap-up (2 minutes)
- Remind students to:
  - Read the syllabus
  - Complete the reading by Thursday
  - Come ready to form teams on Thursday
- Thank students for their attention



## Materials Needed

- Projector/screen for code walkthrough
- Starter app repository (cloned and ready)
- Backend server running
- Web app running
- Browser with DevTools
- Reflection template (handout or digital)

## Instructor Notes

### Common Questions & Answers

**Q: "Do I need to know Python/React/React Native already?"**  
A: No! We'll learn together. Some experience helps, but we'll start from basics.

**Q: "What if I'm more interested in one part (backend/frontend/mobile)?"**  
A: That's fine! In Phase 1, you'll explore all three. In Phase 2, you can focus on your interest.

**Q: "How do teams work?"**  
A: You'll form teams on Thursday. Teams work together on assignments, but everyone submits individual reflections.

### Troubleshooting

- **If backend won't start:** Check Python version, poetry installation
- **If students can't see code:** Use larger font, zoom in
- **If request tracing is confusing:** Slow down, repeat steps, ask for questions

### Time Management Tips

- **If running short:** Skip detailed code explanations, focus on high-level flow
- **If running long:** Move Q&A to end, but keep reflection practice



## Student Deliverables

- None for today (homework assigned Thursday)

## Next Steps

- **Before Thursday:** Read The Pragmatic Programmer (Ch. 1)
- **Thursday:** Come ready to form teams and set up dev environment

