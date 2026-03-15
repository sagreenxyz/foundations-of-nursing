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

## About This Project

**Foundations of Nursing** is an open-access textbook for pre-licensure nursing students (ADN/BSN programs). Content is authored in Markdown, version-controlled in this repository, and published as a web application via GitHub Pages.

- **Audience:** Pre-licensure nursing students — first-year, foundational level
- **Tone:** Formal/academic
- **Citation Style:** APA 7th edition
- **Format:** Markdown source → HTML rendered by the web application
- **Target Length:** 900+ pages across 30+ chapters

---

## Reading the Textbook

### GitHub Pages (recommended)

The textbook is published at:

```
https://sagreenxyz.github.io/foundations-of-nursing/
```

Open that URL in any modern browser to read the textbook online.

### Local Development

Because browsers block `file://` cross-origin requests, a local web server is required to load chapter content when developing locally.

**Option 1 — Python (no install required on macOS/Linux):**

```bash
python3 -m http.server 8080
```

Then open: `http://localhost:8080/docs/`

**Option 2 — Node.js:**

```bash
npx serve .
```

Then open the URL printed in the terminal, appending `/docs/`.

---

## Repository Structure

```
foundations-of-nursing/
├── README.md
├── dependency-tree.html   # Project dependency DAG (standalone SPA)
├── strategy/              # Project strategy documents
│   ├── merged-toc.md      # Master Table of Contents (45 chapters)
│   ├── roadmap.md         # Phase 1-12 production roadmap
│   ├── team.md            # Team roles and responsibilities
│   └── toc-strategy-analysis.md
├── activity/              # Sprint artifacts (one directory per sprint)
│   ├── 2026-03-15-1210/   # Sprint 1: Planning, TOC, Chapter 1 outline, master backlog
│   ├── 2026-03-15-1739/   # Sprint 2: Chapter template, web app, Chapter 1 draft
│   ├── 2026-03-15-2030/   # Sprint 3: Chapter 4 outline
│   ├── 2026-03-15-2105/   # Sprint 4: Chapters 2, 7, 10 drafts
│   ├── 2026-03-15-2140/   # Sprint 5: Chapter 4 first draft (v1.0)
│   └── 2026-03-15-2214/   # Sprint 6: Chapter 4 v2.0 (developmental + copy edit)
├── content/               # Chapter markdown source files
│   ├── chapter-01.md      # Chapter 1: History and Evolution of Nursing (Draft)
│   ├── chapter-02.md      # Chapter 2: Legal, Ethical, and Professional Standards (Draft)
│   ├── chapter-04.md      # Chapter 4: Therapeutic Communication (v2.0 — edited)
│   ├── chapter-07.md      # Chapter 7: Evidence-Based Practice and Quality Improvement (Draft)
│   └── chapter-10.md      # Chapter 10: Health, Wellness, and Illness (Draft)
└── docs/                  # Web application (GitHub Pages root)
    ├── index.html
    ├── css/style.css
    └── js/app.js
```

---

## Chapter Status

| # | Chapter | Status |
|---|---------|--------|
| **1** | **History and Evolution of Nursing** | **Draft Available** |
| **2** | **Legal, Ethical, and Professional Standards** | **Draft Available** |
| 3 | Patient Rights, Advocacy, and Informed Consent | Coming Soon |
| **4** | **Therapeutic Communication** | **Draft Available** (v2.0 — edited) |
| 5–6 | Additional Unit 1 Chapters | Coming Soon |
| **7** | **Evidence-Based Practice and Quality Improvement** | **Draft Available** |
| 8–9 | Additional Unit 2 Chapters | Coming Soon |
| **10** | **Health, Wellness, and Illness** | **Draft Available** |
| 11–45 | Additional Chapters | Coming Soon |

---

## Sprint History

| Sprint | Date | Deliverables |
|--------|------|--------------|
| 2026-03-15-1210 | 2026-03-15 | Initial planning, merged TOC, Chapter 1 outline, sprint backlog |
| 2026-03-15-1739 | 2026-03-15 | Chapter template, web app foundation, Chapter 1 full draft |
| 2026-03-15-2030 | 2026-03-15 | Chapter 4 outline, parallel-work analysis |
| 2026-03-15-2105 | 2026-03-15 | Chapters 2, 7, 10 full drafts |
| 2026-03-15-2140 | 2026-03-15 | Chapter 4 full draft (v1.0) |
| 2026-03-15-2214 | 2026-03-15 | Chapter 4 developmental edit + copy edit (v2.0) |

---

## Contributing

All content follows the chapter template defined in
`activity/2026-03-15-1739/chapter-template.md`. Each chapter includes:

- Learning objectives (8 per chapter)
- Key terms table (minimum 10 terms)
- Full prose sections with figure placeholders
- Chapter summary and key takeaways
- 10 NCLEX-style review questions with answer key
- Case study with discussion questions
- APA 7th edition references
