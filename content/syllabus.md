---
title: "Syllabus: Software Development Studio"
date: "2025-08-26"
heading_max_level: 3
---


<table>
  <tr><td><strong>Course</strong></td><td>CSCI 373: Software Development Studio</td></tr>
  <tr><td><strong>Instructors</strong></td><td>Dr. Kevin Sanft (ksanft@unca.edu) & Dr. Sarah Van Wart (svanwart@unca.edu)</td></tr>
  <tr><td><strong>Credits</strong></td><td>3 Credit Hours</td></tr>
  <tr><td><strong>Time & Location</strong></td><td>Tu/Th, 9:55 AM - 11:35 AM in RRO 217</td></tr>
  <tr>
    <td><strong>Office Hours</strong></td>
    <td>
      <ul>
        <li>
          <strong>Prof. Sanft</strong>: 
          Drop-in: Mondays 2:00-3:00pm, Wednesdays 1:30-2:30pm; Or by appointment slot (<a href="https://calendar.app.google/QjwW9pwqQ3e8sHmWA">booking page</a>, ensure your calendar time zone is set to Eastern); Or email for an appointment at other times
        </li>
        <li>
          <strong>Prof. Van Wart</strong>: 
          Mon, Wed & Fri, 2:30 - 3:30 PM (or by appointment) In Rhoades-Robinson, Rm. 220
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><strong>Texts</strong></td>
    <td>
        Various readings (see schedule)
    </td>
  </tr>
</table>

## 1. Course Philosophy

This course is designed as a **studio-based software development experience** rather than a traditional lecture-driven class. Students will work as a development team building real software for a real client, operating under real technical, organizational, and time constraints. The central goal of the course is not only to learn tools and techniques, but to use those skills to deliver value to a client by understanding their needs, navigating constraints, and making informed tradeoffs throughout the development process.

The course emphasizes professional practice over isolated technical mastery. Students will learn not only how to implement features, but how to:

- Reason about design and technical tradeoffs in light of client goals
- Work productively within an existing system rather than starting from scratch
- Communicate intent and decisions through code, tests, and reviews
- Coordinate work with others over time to produce a coherent product

<!-- Rather than treating the Software Development Lifecycle (SDLC) as a linear checklist, this course treats it as an iterative, ongoing process that unfolds alongside implementation. Design, testing, and reflection are not separate phases completed “before” or “after” coding; they are interleaved practices that help teams respond to evolving requirements and feedback from a real stakeholder. -->

Students are expected to approach this work with professional accountability, including meeting deadlines, communicating clearly, and taking responsibility for the quality and reliability of their contributions.

Because this is a studio course, **learning depends heavily on in-person participation, critique, and collaboration.** Many of the skills required to deliver value to a client — communicating clearly, negotiating scope, reviewing work, and responding to feedback — can only be practiced in a shared, synchronous setting. Regular attendance and engagement are therefore essential to meeting the learning objectives.


## 2. General Overview of the Course Structure

The course is organized into two main phases:

### Phase 1: Software Design Foundations

In the first half of the semester (Weeks 1 - 8), students will work in small teams using a **shared starter system** provided by the instructors. The goals of this phase are to:

- Develop architectural literacy in an existing backend/frontend system
- Practice contributing safely using tests and code review
- Apply software design principles in context
- Reconnect technical decisions to user needs through design and prototyping

During Phase 1, all teams will work on similar features and problems. This deliberate constraint allows students to focus on **process, coordination, and reasoning**, rather than feature differentiation.

### Phase 2: Building New Features

In the second half of the semester (Weeks 9 - 15), the class will transition to a **shared codebase** that becomes the "source of truth." During Phase 2, students will form into new teams and work on **distinct vertical feature slices** driven by client needs and sprint planning.

This phase emphasizes:
- Collaboration at scale,
- Integration and coordination,
- Managing tradeoffs between scope, quality, and time,
- Delivering a coherent product to a real stakeholder.


## 3. Client & Project Context

In this course, students will collaborate with a real-world client focused on supporting parents of young children with motor delays.

The project focuses on building a cross-platform application (web and mobile) using PostgreSQL, FastAPI, React, and React Native. We will be supporting two groups of users:

1. **Parents & Caregivers**, whose need to:
    - Understand evidence-based exercises and activities,
    - Learn how and why specific approaches support motor development, and
    - Access structured, trustworthy guidance outside of clinical settings

1. **Clinicians**, who need to: 
    - Design new courses and modules (including authoring quizzes, and uploading images, files, videos and other content),
    - Manage and monitor parent groups as they take the course(s) (cohort model), and 
    - Monitor and track parents' progress through the content quickly and easily

This work is conducted in collaboration with **Emory University** and **Appalachian State University**, drawing on interdisciplinary expertise in child development, physical therapy, and education.

The client context introduces **authentic constraints**:
- Requirements evolve as understanding deepens
- Design decisions must account for accessibility and clarity
- Technical choices must support maintainability and long-term use

Students are expected to approach this work with professionalism, empathy, and respect for the population the software is intended to support.

## 4. Learning Objectives

The overarching goal of this course is to help students learn how to coordinate work, make design decisions, and sustain progress while operating under real technical, organizational, and time constraints. This includes being able to:

1. **Contribute effectively to an existing software system**
   - Understand and work within established architectural patterns
   - Make scoped, testable changes using professional workflows

2. **Apply software design principles in context**
   - Reason about cohesion, coupling, and changeability
   - Justify design decisions and tradeoffs

3. **Use testing as a tool for specification and safety**
   - Write tests that document intended behavior
   - Use tests to refactor and extend code confidently

4. **Collaborate through professional development practices**
   - Communicate intent via pull requests and code reviews
   - Provide and respond to constructive technical feedback

5. **Integrate design and user-centered thinking into development**
   - Translate user needs into system behavior
   - Use low- and high-fidelity prototypes to inform implementation

6. **Navigate the software development lifecycle in practice**
   - Balance design, implementation, testing, and delivery
   - Adapt to evolving requirements and constraints


## 5. Assessment

Assessment in this course emphasizes **process, reasoning, and collaboration**, not just feature output.

Grades are based on the following components:

1. **Technical Contributions (Pull Requests) — 35%**

    Assesses the ability to implement coherent, well-scoped changes within an existing codebase, including appropriate use of tests and adherence to project conventions.

1. **Code Reviews — 15%**

    Assesses engagement with peer work through substantive review comments that address behavior, design, testing, or tradeoffs.

1. **Testing Contributions — 20%**

    Assesses the use of tests to specify behavior, reduce risk, and support safe iteration across backend and frontend components.

1. **Design Artifacts — 15%**

    Assesses design work and reflection, including prototypes, design rationales, and short written reflections tied to concrete decisions.

1. **Studio Participation — 15%**

    Assesses in-class engagement, including participation in studio activities, critique sessions, and collaborative work. Because this is a studio course, participation cannot be fully replicated outside of class.

This course reflects the reality of professional software development: software is built collaboratively, but learning and evaluation occur at the individual level. Assessment in this course intentionally balances both. Given this, students will be evaluated as **individual contributors working within team-based projects**. You will collaborate closely with others, but your grade is not determined solely by your team’s output. Instead, assessment is based on observable individual contributions made in a team context, as well as selected team-level outcomes.

### 5.1. What Is Assessed Individually? 

The following components are assessed at the **individual level**:

- **Pull Requests (PRs)**: Your authored PRs will be evaluated for clarity of intent, scope, correctness, use of tests, and adherence to project conventions.

- **Code Reviews**: Review comments you write on peers' PRs will be assessed for substance and engagement (e.g., questions about behavior, design tradeoffs, or testing), not for "correctness."

- **Testing Contributions**: Tests you write will be assessed for how well they specify intended behavior and reduce risk, rather than for coverage metrics.

- **Design and SDLC Reflections**: Short written reflections and design artifacts will be assessed based on how clearly they connect decisions to constraints, user needs, and tradeoffs.

These artifacts allow the instructor to evaluate your understanding, effort, and professional practice independently of team dynamics.

### 5.2. What Is Assessed at the Team Level?

Some aspects of the course are necessarily **team-based**, including:

- Integrated system behavior
- Sprint demos and milestones
- Shared design coherence
- Client-facing deliverables

These components reflect how well the team coordinated work and delivered a coherent product. Team-based credit assumes **active participation**. To be eligible for full team credit, students must:

- Attend and engage in studio sessions regularly,
- Contribute to pull requests and reviews, and
- Participate in required studio activities.

Students who are frequently absent or disengaged may have their grades **decoupled from team outcomes** and may be reassigned to individual alternative work.

> Strong team outcomes do not automatically guarantee high individual grades, and strong individual effort does not override a lack of participation in required studio work. Grades reflect **how you contribute**, not just what the team produces.




## 6. Topics
- Please see the [course schedule](./)


## 7. Attendance & Participation Policy

This course is structured as a studio-based software development course. Much of the learning occurs through in-class critique, collaboration, code review, and design discussion, which cannot be replicated asynchronously. As a result, regular attendance and active participation are required.

### 7.1. Attendance Expectations

Students are expected to attend and participate in all studio sessions (Tuesday/Thursday).

- Occasional absences are understood; however, more than three (3) unexcused absences places a student at risk of not meeting the course learning objectives.
- Excused absences must follow university policy and be communicated in advance when possible.

### 7.2. Participation as a Course Requirement

This course is intentionally designed so that meaningful progress requires regular participation. Students who are not present and engaged will be unable to meet the learning objectives, regardless of technical ability. Participation in this course is not passive presence. It includes:

- Engaging in studio activities and discussions
- Contributing to in-class code reviews and critiques
- Collaborating with teammates during scheduled studio time

Because participation is integral to the course design, certain forms of credit (e.g., studio participation, team-based assessment, and some PR/review credit) require in-class engagement and cannot be fully made up outside of class.

### 7.3. Impact of Repeated Absences

The following escalation process will be used consistently:

**After two (2) unexcused absences**, the instructors will contact the student to check in and remind them that continued absences will affect their ability to pass the course.

**After three (3) unexcused absences**, the student will receive a formal warning that they are at risk of failing the course due to insufficient participation in required studio work.

**After four (4) or more unexcused absences**, one or more of the following actions may occur:

- Reduction or cap on participation credit
- Removal from team-based work and reassignment to an individual, reduced-scope alternative
- Recommendation to withdraw from the course

These actions reflect the reality that students who are not present cannot meaningfully participate in collaborative software development.

### 7.4. Team-Based Accountability

This course involves sustained teamwork. If a student's lack of attendance or engagement significantly impacts their team:

- The instructors may intervene
- Team responsibilities may be reassigned
- The student's grade may be decoupled from team outcomes

This is intended to protect students who are consistently present and contributing, and reflects the professional reality that software development is collaborative and time-bound, and that consistent participation is necessary to meet the course objectives. Students who anticipate attendance challenges should speak with the instructors as early as possible.

## 8. Generative AI Policy

The first half of this course aims to help you develop a foundational technical literacy for more complex projects. While generative AI tools can be useful for learning, over-reliance on AI-generated code can inhibit your ability to think critically and make smart decisions -- particularly when you're first learning.For that reason, this policy sets clear boundaries for appropriate AI use **for the first half of the semester**.


### What *Is* Allowed

You **may** use generative AI tools (e.g., ChatGPT) as a **reference**, similar to documentation or a textbook. Examples include:

- Looking up programming concepts or syntax  
- Getting explanations of how functions or methods work  
- Understanding error messages and debugging ideas  
- Learning best practices or common coding patterns  

AI may help you *understand* code, but **you must write all submitted code yourself**.

> **Rule of thumb:** If you could not reasonably reproduce the solution without referring back to the AI’s output, then the use is not permitted.


### What Is *Not* Allowed

You **may not** use generative AI tools to:

- Generate any assignment-specific code, including small snippets, helper functions, or scaffolding  
- Solve coding exercises or assignment problems  
- Write functions, components, or other substantial code blocks  
- Provide solutions that you then modify and submit  

**All code you submit must be your own.** Copying, pasting, or adapting AI-generated code is considered academic dishonesty.


### Code Editor AI Tools

You **must disable AI-powered code completion and generation features** in your code editor (e.g., GitHub Copilot, Copilot Chat, Cursor, Tabnine, Codeium) while working on coursework during the first half of the semester. It is your responsibility to ensure these features are turned off before beginning work. Accidental use still counts as a violation, even if you only accept a few suggestions. If you are unsure how to disable these tools, please ask for help.
* For the second half of the semester, we will revisit this policy and begin (optionally) integrating some GenAI tools.


## 9. University Policies & Resources

### Office of Accessibility & Academic Accommodations
UNC Asheville is committed to providing accessible learning environments and equal opportunity to individuals with disabilities in accordance with the <a href="https://www.ada.gov/" target="_blank">Americans with Disabilities Act (ADA)</a> and <a href="https://www.ed.gov/laws-and-policy/individuals-disabilities/section-504" target="_blank">Section 504 of the Rehabilitation Act</a>.

If you are a student experiencing barriers to access or full participation in this course on the basis of a disability, contact the Office of Accessibility (OA) to apply for reasonable accommodations and discuss available resources. You may contact the OA at academicaccess@unca.edu or 828-251-6292 or visit Zageir Hall Room 120.

To discuss approved academic accommodations, please contact me as early in the semester as possible and provide your letter of accommodation (LOA) from the <a href="https://new.unca.edu/iia/accessibility/" target="_blank">OA</a>. I want to ensure that we have adequate time and a confidential setting to discuss and arrange your approved accommodations. Accommodations are not retroactive and will be implemented when the LOA is discussed. 


### Promoting Gender Equity, Responding to Sexual Misconduct
UNC Asheville is dedicated to cultivating and maintaining a safe, respectful, and supportive environment, free from harassment and discrimination. We strive to ensure that all have equal access to the educational and employment opportunities the University provides. If you or someone you know has been affected by sex-based harassment or sexual misconduct, including sexual assault, dating or domestic violence, or stalking, please know that help and support are available. UNC Asheville strongly encourages all members of the community to take action, seek support, and report incidents of sexual harassment to the Office for Institutional Integrity & Access (OIIA). You may contact the OIIA or Heather Lindkvist, Assistant Vice Chancellor and Title IX Coordinator, directly at 828.232.5658 or via titleix@unca.edu or learn more by visiting the <a href="https://new.unca.edu/iia/title-ix/" target="_blank">Title IX website</a>.

As a faculty member, I am a “responsible employee” and private resource. This means that if you share any information or discuss an incident with me regarding sexual or gender-based harassment, I must disclose this information to the Title IX Coordinator. Our goal is to ensure you are aware of the range of options available to you and have access to the resources you may need. 

If you wish to speak with a confidential resource, contact <a href="https://new.unca.edu/hcc/" target="_blank">University Health and Counseling Services</a> at 828.251.6520. Off-campus confidential resources include <a href="https://www.ourvoicenc.org/" target="_blank">Our Voice</a> (24-Hour Hotline at 828.255.7576) and <a href="https://helpmateonline.org/" target="_blank">Helpmate</a> (24-Hour Hotline at 828.254.0516).


### Protection from Harassment and Discrimination
Maintaining  welcoming, respectful, and equitable living, learning, and working environments is a shared responsibility at UNC Asheville. All community members are expected to engage respectfully, foster free expression, recognize diverse viewpoints, and protect against harm. Discrimination, discriminatory harassment, and retaliation are prohibited in all educational programs and employment opportunities.
 
The Office for Institutional Integrity and Access (OIIA) advances these efforts and provides support to any community member who seeks assistance regarding unlawful discrimination, barriers to access, or unwelcome conduct. Individuals may contact the OIIA to report an allegation of discrimination or discriminatory harassment based on their actual or perceived status, including age, race, color, national origin, religion (including belief or non-belief), disability, sex, gender identity, sexual orientation, pregnancy or related conditions, veteran status, genetic information, or other legally protected status.
 
For guidance or to report concerns, contact Heather Lindkvist, Assistant Vice Chancellor, directly at 828.232.5658 or at hlindkvi@unca.edu or in Highsmith 116. Learn more by visiting the <a href="https://new.unca.edu/iia/" target="_blank">OIIA website</a>.

### Religious Accommodations
UNC Asheville accords students, on an individual basis, the opportunity to observe their traditional religious holy days. Students desiring to observe a religious holy day of special importance must notify me directly (suggested time frames: two weeks of the start of the semester or at least seven business days in advance of the scheduled observance). The request should be made in writing and should state (1) the specific accommodation being requested, (2) the religious practice or belief the student holds, (3) how the requested accommodation enables the student to participate in their religious practice or belief, and (4) the date(s) and/or frequency of the requested accommodation. We will then meet to discuss what reasonable accommodation will be implemented, such as options for missed discussions, exams, or other assignments. You are entitled to make up assignments without penalty due to an excused absence for a religious observance. Students may request a minimum of two excused absences per academic year for religious observances. The Office for Institutional Integrity & Access is available as a resource if students or faculty have questions about this process.

### Academic Alerts
Faculty at UNC Asheville have access to an Academic Alert system. The purpose of this system is to support communication with students about their progress in courses, especially if there are concerns (e.g., academic difficulty, attendance problems). Professors use the Alert system because they are invested in their students’ success. Entering an academic alert is a great way to supplement open conversations between instructors and students about how students can improve their academic performance. 

Alerts should not replace your direct outreach to and communication with the student. They are intended to serve as a way to document your concern and outreach and/or activate the larger support system for the student as needed. Hence, an alert should only be entered after the instructors have reached out to the student directly.

When a faculty member submits an alert that expresses a concern, the student receives outreach from their academic advisor or the team in the Office of Academic Advising. Students are no longer receiving automated notification emails when an alert is submitted. It is in the student's best interest to address the alert quickly, as students who do so are more likely to earn credit for the course. Questions about the Academic Alert system can be directed to Anne Marie Roberts (amrober1@unca.edu) in the <a href="https://www.unca.edu/academics/academic-success/" target="_blank">Academic Success Center</a>.

### Academic Honesty
The university’s policy on academic honesty states:

> “As a community of scholars dedicated to learning and the pursuit of knowledge UNC Asheville relies on the honesty and academic integrity of all the members of its community. Any act of plagiarism or cheating is academic dishonesty. A person who knowingly assists another in cheating is likewise guilty of cheating. According to the instructors' view of the gravity of the offense, a student may be punished by a failing grade or a grade of zero for the assignment or test, or a failing grade in the course. If it seems warranted, the instructors may also recommend to the Provost dismissal or other serious university sanction.” 

We expect that you will exercise integrity in all coursework. Please email the instructors or attend office hours if you have additional questions or need clarification on any point. 