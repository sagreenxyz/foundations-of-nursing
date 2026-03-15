# Foundations of Nursing

*A Comprehensive Pre-Licensure Textbook*

**Audience:** Pre-licensure nursing students (ADN/BSN) — first-year, foundational level  
**Tone:** Formal/academic  
**Citation Style:** APA 7th edition  
**Format:** Markdown source, HTML/web output  
**Target Length:** 900+ pages across 45 chapters

---

## Web Application

The textbook is rendered as a GitHub Pages web application from the `docs/` directory.

- **Open locally:** Open `docs/index.html` in any modern browser (no server required).
- **GitHub Pages:** Enable GitHub Pages from the repository Settings, pointing at the `docs/` directory on the `main` branch.

The app requires no build step, no CDN, and no external dependencies. All rendering is handled by a self-contained Markdown parser in `docs/js/app.js`.

---

## Repository Structure

```
foundations-of-nursing/
├── README.md
├── strategy/              # Project strategy documents
│   ├── merged-toc.md      # Master Table of Contents (45 chapters)
│   ├── roadmap.md         # Phase 1-12 production roadmap
│   ├── team.md            # Team roles and responsibilities
│   └── toc-strategy-analysis.md
├── activity/              # Sprint artifacts (one directory per sprint)
│   ├── 2026-03-15-1210/   # Sprint 1: Planning, TOC, Chapter 1 outline
│   ├── 2026-03-15-1739/   # Sprint 2: Chapter template
│   ├── 2026-03-15-2030/   # Sprint 3: Chapter 4 outline
│   └── 2026-03-15-2140/   # Sprint 4: Chapter 4 draft, web app
├── content/               # Chapter markdown source files
│   └── chapter-04.md      # Chapter 4: Therapeutic Communication (DRAFT)
└── docs/                  # Web application (GitHub Pages root)
    ├── index.html
    ├── css/style.css
    └── js/app.js
```

---

## Chapter Status

| # | Chapter | Status |
|---|---------|--------|
| 1 | History and Evolution of Nursing | Coming Soon |
| 2 | Legal, Ethical, and Professional Standards | Coming Soon |
| 3 | Patient Rights, Advocacy, and Informed Consent | Coming Soon |
| **4** | **Therapeutic Communication** | **Draft Available** |
| 5-45 | Additional Chapters | Coming Soon |

---

## Sprint History

| Sprint | Date | Deliverables |
|--------|------|--------------|
| 2026-03-15-1210 | 2026-03-15 | Initial planning, merged TOC, Chapter 1 outline, sprint backlog |
| 2026-03-15-1739 | 2026-03-15 | Chapter template |
| 2026-03-15-2030 | 2026-03-15 | Chapter 4 outline, parallel-work analysis |
| 2026-03-15-2140 | 2026-03-15 | Chapter 4 full draft, web application foundation |
