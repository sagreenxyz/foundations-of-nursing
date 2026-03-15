# Foundations of Nursing

*A Comprehensive Pre-Licensure Textbook*

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
├── README.md                    ← This file
├── content/
│   └── chapter-01.md            ← Chapter markdown source files
├── docs/
│   ├── index.html               ← Web application entry point
│   ├── css/style.css            ← Academic stylesheet
│   └── js/app.js                ← Markdown renderer and navigation
├── strategy/
│   ├── merged-toc.md            ← Master table of contents
│   ├── roadmap.md               ← Development phases roadmap
│   └── team.md                  ← Team roles and responsibilities
└── activity/
    ├── 2026-03-15-1210/         ← Sprint 1 artifacts
    ├── 2026-03-15-1739/         ← Sprint 2 artifacts
    └── 2026-03-15-2105/         ← Sprint 3 artifacts (current)
```

---

## Content Status

| Chapter | Title | Status |
|---------|-------|--------|
| 1 | History and Evolution of Nursing | Draft Available |
| 2–30+ | Remaining chapters | Coming Soon |

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

---

## Development Sprints

| Sprint | Deliverables |
|--------|-------------|
| 2026-03-15-1210 | Project scoping, merged TOC, roadmap, Chapter 1 outline |
| 2026-03-15-1739 | Chapter template, web app plan |
| 2026-03-15-2105 | Web application, Chapter 1 full draft (current) |