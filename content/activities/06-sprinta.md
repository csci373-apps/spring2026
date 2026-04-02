---
title: "Prototyping Task: Concepts, Roles, and Next Steps"
start_date: "2026-04-02"
type: "activity"
draft: 0
heading_max_level: 3
---

> ## Agenda
> 1. Go over the tasks and timeline
> 2. Assign tasks and tickets to team members
> 3. Get into your team and discuss.
> 4. Share out your plan for what deliverables you will deliver when

<!-- .info -->
> ## Implementation Rules
> 1. **No backend tasks** other than deciding on the structure of the JSON file for the slide presentations and making API calls.
> 1. **No Expo:** Everything in web for now (it's more flexible and easier to display via multiple viewports)

## Tasks

{% collapsible closed %}
### 1. Editor Fancy

#### Goal
An admin should be able to create a PowerPoint-like slide with notes and blocks, generate audio from the transcript, and preview the slide.

#### Requirements
1. Admin can create a slide. Slide supports:
    - Speaker notes
    - Content blocks (just text for now)
1. Structure and block behavior should follow the design team's Figma
1. Admin can generate audio from the transcript
    - Use ElevenLabs API (Sarah will give you an API key) to generate an mp3 file
1. Admin can preview the slide
1. Slide timings should be configured via a JSON file
    - this JSON will eventually live in the database
    - for now, store and read it as a file
1. Support multiple configurable templates (start with two)

#### Notes
- There is some sample code available
- Treat this as a prototype of the editing workflow, not a finished production system

#### Suggested deliverables
- Basic slide editor UI
- Transcript-to-audio generation flow
- Slide preview
- JSON timing configuration format
- Template configuration system

{% collapsible closed %}
### 2. Editor Traditional

#### Goal
A user should be able to upload a video version of their PowerPoint and give it a title.

#### Requirements
1. User can upload a video file
    - use an appropriate video format
1. User can enter a title
1. Store or display uploaded video metadata as needed for the prototype

#### Suggested deliverables
- Upload form
- Title field
- Simple saved/preview state

{% collapsible closed %}
### 3. Viewer Fancy

#### Goal
A parent should be able to navigate through slide bullets with synchronized audio.

#### Requirements
1. Parent can click:
    - next slide bullet
    - previous slide bullet
1. Each bullet/slide unit should support audio playback
1. Support two playback modes:
    - auto play mode
    - normal mode
1. Support multiple templates

#### Notes
- This viewer should align with the fancy editor output
- Audio/timing behavior will likely depend on the timing JSON structure

#### Suggested deliverables
- Fancy viewer UI
- Next / previous bullet navigation
- Audio playback for current item
- Toggle for auto play vs normal mode
- Template switching or configurable rendering


{% collapsible closed %}
### 4. Viewer Normal

#### Goal
A user can navigate between videos corresponding to slides.

#### Requirements
1. User can move between videos
1. Each video corresponds to a slide
1. Viewer should support straightforward navigation between videos/slides
1. Please prototype with three options:
    - Native video tags
    - 

#### Suggested deliverables
- Basic video viewer UI
- Next / previous video navigation
- Slide/video title or index display

{% collapsible closed %}
### 5. Wireframes
We have a TON of wireframe screens to complete by the end of the month. Please see:
    * <a href="https://github.com/orgs/csci373-apps/projects/4/views/1?filterQuery=label%3A%22Type%3A+Wireframe%22+label%3A%22Platform%3A+Mobile%22" target="_blank">Mobile Wireframes</a>
    * <a href="https://github.com/orgs/csci373-apps/projects/4/views/1?filterQuery=label%3A%22Type%3A+Wireframe%22+label%3A%22Platform%3A+Admin%22" target="_blank">Admin Wireframes</a>