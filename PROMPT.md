# PROMPT.md — AI Agent Build Guide for *Foundations of Nursing*

This document explains, end-to-end, how an AI agent builds the *Foundations of Nursing* open-access textbook project. It covers the required inputs, the incremental sprint-based build process, state management, content derivation, the AI roles engaged at each stage, and how the process is maintained and extended. A companion section explains how to replicate this process for a new textbook on a different topic.

---

## 1. Project Overview

*Foundations of Nursing* is a 900+-page open-access pre-licensure nursing textbook for ADN/BSN students. It is:

- **Authored in Markdown** — each chapter is a single `.md` file in `content/`.
- **Published as a web application** — a self-contained static SPA in `docs/` rendered by `docs/js/app.js` and served via GitHub Pages.
- **Version-controlled in Git** — all content, sprint artifacts, and tooling live in one repository.
- **Built incrementally by an AI agent** across numbered sprints, each identified by a UTC date-timestamp (e.g., `2026-03-15-1210`).

The project also includes a companion **NurseMastery LMS** (`docs/lms/`) — a gamified, self-contained quiz SPA for student practice.

---

## 2. Required Inputs

Before the first sprint begins, the AI agent requires the following inputs from the human owner:

### 2.1 Initial Questionnaire (`activity/<sprint-id>/<sprint-id>.md`)

Sprint 1 opens with a structured questionnaire that collects:

| Question Area | Key Decisions |
|---|---|
| **Working title** | Final title for the textbook |
| **Target audience** | Degree program (ADN, BSN), academic level (first-year, upper-division), prior knowledge assumptions |
| **Scope of coverage** | Topic domains (e.g., pharmacology, pathophysiology, maternal-newborn) |
| **Structure & format** | Chapter elements required: learning objectives, key terms, case studies, NCLEX questions, summary, references |
| **Target length** | Approximate page count (e.g., 900+) and number of chapters (e.g., 45) |
| **Authoring format** | Markdown (`.md`) for source files |
| **Publishing target** | HTML/web via GitHub Pages; no build step required |
| **Collaboration model** | Solo author (AI-driven) vs. team |
| **Tone & citation style** | Formal/academic; APA 7th edition |
| **Sprint goal** | What single outcome the human most needs from the first sprint |

The completed questionnaire is saved as `activity/<sprint-id>/<sprint-id>.md` and becomes the authoritative record of the project's initial decisions.

### 2.2 Existing Source Material (optional)

The AI may be given one or more draft Tables of Contents (e.g., `strategy/claude-toc.md`, `strategy/gemini-toc.md`, `strategy/grok-toc.md`) produced by different AI systems. These are merged and synthesized in Sprint 1 rather than used verbatim, ensuring the best structure from each source is preserved.

### 2.3 Further-Input Queue (`further-input.md`)

At any point during the project, the human adds new tasks to `further-input.md`. The AI reads this queue, implements each task in the appropriate sprint, and upon completion moves the item to `further-input-accomplished.md` with implementation notes. This mechanism allows the human to inject requirements asynchronously without disrupting the sprint cadence.

---

## 3. How the Project Is Built — Incremental Sprint Process

The project is built one sprint at a time. Each sprint is a discrete, atomic unit of work with a clear goal, a fixed set of deliverables, and documented state transitions.

### 3.1 Sprint Identity and Artifacts

Every sprint is named by a UTC date-timestamp: `YYYY-MM-DD-HHMM` (e.g., `2026-03-15-2214`). All sprint artifacts are stored under `activity/<sprint-id>/`:

| File | Purpose |
|---|---|
| `<sprint-id>.md` | Sprint questionnaire — captures context, goals, and decisions for the sprint |
| `sprint-backlog.md` | Task-level tracking for this sprint's deliverables |
| `chapter-NN-outline.md` | Detailed chapter outline (created during outline phase, referenced during drafting) |

### 3.2 Sprint Sequence Within a Chapter

Each chapter follows a fixed ten-step editorial pipeline:

| Step | Task | Output |
|---|---|---|
| 1 | **Outline review** | `activity/<sprint-id>/chapter-NN-outline.md` |
| 2 | **Chapter draft (v1.0)** | `content/chapter-NN.md` — full prose, all required elements |
| 3 | **Key terms & glossary** | Embedded in `content/chapter-NN.md` (key-terms table) |
| 4 | **Case study / clinical scenario** | Embedded in `content/chapter-NN.md` |
| 5 | **NCLEX-style review questions** | Embedded in `content/chapter-NN.md` (10 questions + answer key) |
| 6 | **Summary & key takeaways** | Embedded in `content/chapter-NN.md` |
| 7 | **References (APA 7th)** | Embedded in `content/chapter-NN.md` |
| 8 | **Developmental edit** | In-place revision of `content/chapter-NN.md` |
| 9 | **Copy edit & proofread** | In-place revision of `content/chapter-NN.md` — final result is version 2.0 |
| 10 | **HTML formatting & web review** | `docs/js/app.js` chapter status updated from `'soon'` to `'draft'` |

Steps 2–7 typically form a single sprint (the "drafting sprint"). Steps 8–9 form the next sprint (the "editorial sprint"). Step 10 is completed as part of whichever sprint closes out the chapter.

### 3.3 Cross-Chapter Dependency Management

Chapters have prerequisites defined in the master Table of Contents (`strategy/merged-toc.md`). A chapter may not begin drafting until its prerequisite chapter reaches at least `[x] Chapter Draft` status in the master backlog. The master backlog (`activity/2026-03-15-1210/sprint-backlog.md`) is the single source of truth for all dependency tracking. Non-linear work is possible — the AI selects chapters whose prerequisites are already satisfied.

### 3.4 Sprint Execution Pattern

Each sprint follows this internal sequence:

1. Write the sprint questionnaire (`<sprint-id>.md`) — capturing current status, goals, and decisions.
2. Write the sprint backlog (`sprint-backlog.md`) — listing all subtasks for this sprint.
3. Execute subtasks in order, committing each major deliverable via `report_progress` with an incremental commit message.
4. After all subtasks are complete, update the master backlog to mark newly completed tasks `[x]`.
5. Update `docs/js/app.js` chapter registry to reflect new chapter statuses.
6. Optionally process items from `further-input.md`, moving completed items to `further-input-accomplished.md`.

---

## 4. State Management

State is maintained across sprints through three complementary mechanisms:

### 4.1 Master Sprint Backlog (`activity/2026-03-15-1210/sprint-backlog.md`)

The master backlog is the canonical project-wide task registry. It lists every chapter and every task within each chapter, with three possible statuses:

- `[ ]` — Not started
- `[~]` — In progress
- `[x]` — Complete

Every sprint ends with an update to this file, marking the tasks completed during that sprint. This file is the primary tool for determining what to work on next: any task whose prerequisites are `[x]` and that is itself `[ ]` is eligible for the next sprint.

### 4.2 Chapter Registry in `docs/js/app.js`

The web application's chapter registry in `docs/js/app.js` carries three statuses per chapter:

| Status | Meaning |
|---|---|
| `'soon'` | Chapter not yet started |
| `'outline'` | Outline drafted; not yet in full prose |
| `'draft'` | Full draft (v2.0 — developmental and copy edited) exists; chapter is readable |

When a chapter reaches version 2.0, the AI updates `docs/js/app.js` to set `status: 'draft'` and increments the version comment (e.g., `v1.5` → `v1.6`). The web application uses this registry to render the navigation sidebar and chapter status indicators without any build step.

### 4.3 Chapter Versioning

Each chapter draft progresses through two named versions:

- **v1.0** — Initial full draft: all sections, key terms, case study, NCLEX questions, summary, and references written in prose. Structurally complete but not editorially polished.
- **v2.0** — Post-editorial version: developmental edit and copy edit applied in-place. This is the publication-quality version and the definition-of-done for a chapter.

Version labels are maintained in the file header comment within each `content/chapter-NN.md` file and referenced in sprint artifacts and the master backlog.

### 4.4 Dependency Tree (`dependency-tree.html`)

A self-contained SPA at the repository root visualizes all 57 project nodes (Setup milestone + 45 chapters + 11 appendices) as a wave-based directed acyclic graph (DAG). Node status is computed dynamically from task completion data in the master backlog. It is auto-synced via:

1. **GitHub Actions** — `.github/workflows/update-dependency-tree.yml` runs `scripts/update-dependency-tree.js` on every push to `main`.
2. **Pre-commit hook** — `.githooks/pre-commit` runs the same script before each local commit.

To activate the local hook after cloning: `git config core.hooksPath .githooks`

---

## 5. Content Derivation

### 5.1 Table of Contents as the Authoritative Blueprint

All chapter content is derived from `strategy/merged-toc.md`, which defines:

- Chapter number, title, and unit grouping
- Section headings (e.g., `13.1 Cells, Tissues, Organs, and Homeostasis`)
- Chapter prerequisites

When drafting a chapter, the AI expands each section heading into full prose at an appropriate depth for a pre-licensure nursing student. The merged TOC was itself produced by synthesizing three AI-generated TOC drafts (`claude-toc.md`, `gemini-toc.md`, `grok-toc.md`) and extending them with additional elements required by nursing education standards.

### 5.2 Chapter Template (`activity/2026-03-15-1739/chapter-template.md`)

All chapters share a fixed structure defined in the chapter template. Required elements per chapter:

| Element | Specification |
|---|---|
| **Learning objectives** | 8 objectives using Bloom's taxonomy action verbs |
| **Key terms table** | Minimum 10 terms with brief definitions |
| **Chapter outline** | Retained in draft for editorial reference; removed before final layout |
| **Introduction** | ~1 page; narrative hook, purpose statement, chapter roadmap |
| **Body sections** | One section per TOC heading; subsections of 250–350 words each |
| **Sidebar/callout boxes** | Historical spotlights, EBP connections, safety alerts, clinical tips (75–150 words each) |
| **Figure placeholders** | `[FIGURE N.X: Caption]` with alt-text for every referenced illustration |
| **Chapter summary** | Recap paragraph + 8 key takeaways aligned to learning objectives |
| **NCLEX-style review questions** | 10 questions: mix of single-answer, multiple-response (SATA), ordered-response, and one NGN Extended Thinking item; includes answer key with rationale |
| **Case study** | 2–3 paragraph unfolding clinical scenario + 4 discussion questions |
| **References** | APA 7th edition, alphabetical by first author's last name |
| **Chapter production notes** | Word count estimate, table/figure/case study counts |

### 5.3 Source Authorities

Content accuracy is grounded in:

- **Established nursing education standards** — NCSBN Next Generation NCLEX (NGN) Clinical Judgment Measurement Model (CJMM), ANA Code of Ethics, Nurse Practice Acts
- **Prior completed chapters** — Each new chapter uses the most recently completed v2.0 chapter as the benchmark for formatting, depth, and editorial quality
- **Subject matter expertise embedded in the AI** — The AI draws on its training data for clinical accuracy across nursing domains (pharmacology, pathophysiology, patient safety, communication, etc.)
- **Further-input queue** — Human-injected facts, corrections, and additions (e.g., "Add notes on Vancomycin and Red Man Syndrome")

---

## 6. AI Roles

The AI agent simultaneously plays multiple professional roles, shifting between them within a single sprint depending on the task at hand. These roles mirror a traditional textbook production team:

### 6.1 Project Manager

**When active:** At the start of every sprint and when updating the master backlog.

**Tasks:**
- Write the sprint questionnaire — capture current status, goals, and scope decisions
- Write the sprint backlog — decompose the sprint goal into atomic, ordered subtasks
- Identify eligible next chapters from the master backlog (prerequisites satisfied, status `[ ]`)
- Update the master backlog at sprint close — mark completed tasks `[x]`
- Process the further-input queue
- Commit deliverables incrementally via `report_progress`

### 6.2 Curriculum Designer / Instructional Designer

**When active:** During outline review and whenever a new chapter's structure is planned.

**Tasks:**
- Translate TOC section headings into a pedagogically sequenced chapter outline
- Sequence content from foundational → complex, ensuring each section builds on prior knowledge
- Define the Bloom's taxonomy level for each learning objective
- Ensure alignment between objectives, body content, case study, NCLEX questions, and key takeaways
- Identify sidebar opportunities (safety alerts, EBP connections, historical spotlights)
- Plan figure placeholders and their pedagogical purpose

### 6.3 Subject Matter Expert (SME) / Lead Author

**When active:** During the Chapter Draft phase (Steps 2–7 of the editorial pipeline).

**Tasks:**
- Draft all body sections in full academic prose, 250–350 words per subsection
- Define and bold each key term on first use; populate the key-terms table
- Write clinically accurate content aligned with current nursing practice standards
- Write the unfolding case study (2–3 scenes, clinical scenario relevant to the chapter topic)
- Draft 10 NCLEX-style review questions with rationale, including at least one NGN item
- Write the chapter summary and eight key takeaways
- Compile APA 7th edition references, listed alphabetically
- Insert `[FIGURE N.X]` placeholders with captions and alt-text wherever a diagram, table, or illustration would appear in the final layout
- Insert sidebar/callout boxes with `> **[SIDEBAR TITLE]**` formatting

### 6.4 Developmental Editor

**When active:** Step 8 of the editorial pipeline (developmental edit sprint).

**Tasks:**
- Review the v1.0 draft for macro-level issues: logical flow, conceptual gaps, redundancies, missing transitions
- Verify that all learning objectives are addressed in the body text
- Verify that body content, case study, and NCLEX questions are aligned
- Ensure pedagogical scaffolding — simpler concepts precede complex ones
- Revise section transitions, chapter introduction, and summary for cohesion
- Confirm sidebar and callout boxes are placed proximate to the relevant body text
- Confirm figure placeholders are appropriately positioned and captioned

### 6.5 Copy Editor / Proofreader

**When active:** Step 9 of the editorial pipeline (copy edit sprint), immediately after the developmental edit.

**Tasks:**
- Apply APA 7th edition citation and reference formatting throughout
- Enforce consistent use of terminology (e.g., "client" vs. "patient," "health care" vs. "healthcare")
- Correct grammar, punctuation, and sentence structure
- Ensure inclusive, person-first language where appropriate
- Verify NCLEX answer key rationale references specific chapter sections
- Confirm all key terms in the table appear bolded on first use in the body text
- Verify reference list is complete, alphabetical, and correctly formatted
- Confirm the chapter production notes table is accurate (word count, figure count, etc.)
- Produce the final v2.0 file in-place — no separate file is created

### 6.6 Web Developer / eLearning Developer

**When active:** Step 10 of the editorial pipeline and whenever the web application requires updates.

**Tasks:**
- Update `docs/js/app.js` chapter registry: change chapter status from `'soon'` or `'outline'` to `'draft'`
- Increment the version comment in `docs/js/app.js` (e.g., `v1.5` → `v1.6`)
- Copy completed chapter content to `docs/content/chapter-NN.md` when the web app serves from that path
- Maintain the NurseMastery LMS (`docs/lms/`) — update quiz data in `docs/lms/js/data.js` when new topics warrant new questions, journeys, or achievements
- Update `dependency-tree.html` via `node scripts/update-dependency-tree.js` when the master backlog changes

---

## 7. Process Maintenance

### 7.1 Single Source of Truth for Backlog

The master backlog at `activity/2026-03-15-1210/sprint-backlog.md` is the authoritative record of all tasks across all 45 chapters and 11 appendices. It is never deleted or replaced — only updated by adding `[x]` markers and sprint-reference notes.

Every new sprint's agent session begins by reading this file to determine:
- Which tasks are complete (`[x]`)
- Which tasks are in progress (`[~]`)
- Which tasks are available to start (prerequisites `[x]`, task itself `[ ]`)

### 7.2 Sprint Cadence and Non-Linearity

Sprints are non-linear at the chapter level but linear at the task level within each chapter. The agent may work on any eligible chapter in any order. Typical sprint velocity:
- **Drafting sprint:** 1–2 chapters from v0 → v1.0 (all elements complete)
- **Editorial sprint:** 2–3 chapters from v1.0 → v2.0 (developmental + copy edit)

The agent determines sprint scope based on the human's stated priority or, when no priority is given, selects the next available chapter in TOC order.

### 7.3 Commit Discipline

Each major deliverable within a sprint is committed separately via `report_progress` with a descriptive commit message. This ensures:
- Atomic, reviewable commits in the Git history
- Incremental progress visible to the human without waiting for the full sprint to complete
- Easy rollback if a deliverable needs revision

### 7.4 Further-Input Queue

`further-input.md` is the asynchronous channel for human-to-AI communication between sprints. The human adds tasks at any time; the AI processes them during the next sprint. The workflow:

1. Human adds task to `further-input.md` with a heading and description
2. AI reads the queue at the start of each sprint
3. AI implements the task in the appropriate file(s)
4. AI moves the completed task to `further-input-accomplished.md` with implementation notes and file paths
5. AI removes the item from `further-input.md`

### 7.5 Quality Gates

A chapter is not marked `[x]` in the master backlog until all ten pipeline steps are complete. A chapter is not set to `status: 'draft'` in `docs/js/app.js` until it reaches v2.0. These two gates ensure the published web application only surfaces chapters that are fully publication-quality.

---

## 8. Repository Layout Reference

```
foundations-of-nursing/
├── PROMPT.md                         ← This file
├── README.md                         ← Human-facing project description and setup guide
├── dependency-tree.html              ← Self-contained DAG SPA (auto-generated)
├── further-input.md                  ← Asynchronous task queue (human → AI)
├── further-input-accomplished.md     ← Completed tasks from the queue
├── further-input-completed.md        ← Archived completed task log
│
├── strategy/                         ← Project-level strategy documents
│   ├── merged-toc.md                 ← Master Table of Contents (45 chapters — authoritative)
│   ├── roadmap.md                    ← 12-phase production roadmap
│   ├── team.md                       ← Team roles and responsibilities
│   ├── toc-strategy-analysis.md      ← Rationale for TOC structure decisions
│   ├── claude-toc.md                 ← Source TOC draft (Claude)
│   ├── gemini-toc.md                 ← Source TOC draft (Gemini)
│   └── grok-toc.md                   ← Source TOC draft (Grok)
│
├── activity/                         ← Sprint artifacts (one directory per sprint)
│   ├── 2026-03-15-1210/              ← Sprint 1: Planning, merged TOC, master backlog
│   │   ├── 2026-03-15-1210.md        ← Sprint questionnaire
│   │   ├── sprint-backlog.md         ← MASTER BACKLOG (all chapters, all tasks)
│   │   └── chapter-01-outline.md    ← Chapter 1 outline
│   ├── 2026-03-15-1739/              ← Sprint 2: Chapter template + Ch 1 draft + web app
│   │   └── chapter-template.md      ← Standard chapter structure (authoritative)
│   └── …                            ← Subsequent sprints
│
├── content/                          ← Chapter markdown source files
│   ├── chapter-01.md                 ← Ch 1 (v2.0)
│   ├── chapter-02.md                 ← Ch 2 (v2.0)
│   └── …                            ← Chapters 3–45 (status varies)
│
├── docs/                             ← Web application (GitHub Pages root)
│   ├── index.html                    ← SPA shell
│   ├── css/style.css                 ← Academic stylesheet
│   ├── js/app.js                     ← Chapter registry + Markdown renderer
│   ├── content/                      ← Mirrored chapter files served by the web app
│   └── lms/                          ← NurseMastery LMS (gamified quiz SPA)
│       ├── index.html
│       ├── css/lms.css
│       └── js/
│           ├── app.js                ← LMS router and UI logic
│           └── data.js               ← Quiz topics, questions, journeys, achievements
│
├── scripts/                          ← Automation scripts
│   ├── update-dependency-tree.js     ← Regenerates dependency-tree.html from master backlog
│   └── update-index.js               ← Updates docs/index.md
│
├── .github/
│   └── workflows/
│       └── update-dependency-tree.yml ← CI: auto-sync dependency tree on push to main
│
└── .githooks/
    └── pre-commit                    ← Local: auto-sync dependency tree before commit
```

---

## 9. Adapting This Process for a New Textbook

To build a new textbook on a different topic using this same process, the AI agent requires the following inputs from the human owner. All other work — merging source TOCs, drafting chapters, editing, building the web app — is handled by the AI.

### 9.1 Required Human Inputs

| Input | Description |
|---|---|
| **Working title** | The title of the new textbook |
| **Target audience** | Who will read it (degree program, academic level, prior knowledge assumed) |
| **Scope of coverage** | Topic domains to include |
| **Chapter count and target length** | How many chapters; approximate page count |
| **Chapter elements** | Which standard elements each chapter must include |
| **Tone and citation style** | Academic register; citation format (APA, AMA, Chicago, etc.) |
| **Publishing target** | HTML/GitHub Pages (default), PDF, ePub, LMS package, or other |
| **Source TOC drafts (optional)** | One or more draft tables of contents from any AI or human source |
| **Existing content (optional)** | Any pre-existing chapters, outlines, or research the AI should incorporate |
| **Sprint 1 goal** | The single most important outcome from the first sprint |

### 9.2 Bootstrap Sequence for a New Repository

1. **Create a new repository** following the same directory structure described in Section 8.
2. **Run Sprint 1** — Complete the questionnaire, produce a merged TOC, and create the master sprint backlog.
3. **Run Sprint 2** — Establish the chapter template, draft Chapter 1, and scaffold the web application.
4. **Continue sprints** — Draft and edit chapters in dependency order, updating the master backlog and `app.js` after each sprint.
5. **Maintain the further-input queue** — Add new tasks to `further-input.md` at any time; the AI processes them in the next sprint.

The only files that require topic-specific customization at project start are:
- `strategy/merged-toc.md` — the new subject's Table of Contents
- `docs/js/app.js` — the chapter registry (titles, file names, unit groupings)
- `README.md` — the project description and audience statement
- `activity/2026-XX-XX-XXXX/chapter-template.md` — updated if the new subject requires different standard chapter elements

Everything else — sprint workflow, state management, editorial pipeline, web application architecture, CI/automation — transfers unchanged.

---

## 10. Quick Reference — Decisions Embedded in This Project

| Decision | Value |
|---|---|
| **Textbook title** | *Foundations of Nursing* |
| **Audience** | Pre-licensure nursing students (ADN/BSN), first-year/foundational |
| **Tone** | Formal/academic |
| **Citation style** | APA 7th edition |
| **Source format** | Markdown (`.md`) |
| **Output format** | HTML via GitHub Pages (no build step) |
| **Chapter count** | 45 chapters + appendices (~57 nodes total) |
| **Target length** | 900+ pages |
| **Questions per chapter** | 10 NCLEX-style (mix of traditional + NGN item types) |
| **Learning objectives per chapter** | 8 (Bloom's taxonomy) |
| **Minimum key terms per chapter** | 10 |
| **Chapter versions** | v1.0 (draft) → v2.0 (developmental + copy edited) |
| **Master backlog location** | `activity/2026-03-15-1210/sprint-backlog.md` |
| **Chapter template location** | `activity/2026-03-15-1739/chapter-template.md` |
| **App.js chapter status values** | `'soon'` \| `'outline'` \| `'draft'` |
| **LocalStorage key (LMS)** | `nm_lms_v1` |

---

*Document version: 1.0 — 2026-03-21*  
*Project: Foundations of Nursing — sagreenxyz/foundations-of-nursing*
