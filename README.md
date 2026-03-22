# Foundations of Nursing

https://sagreenxyz.github.io/foundations-of-nursing

*A Comprehensive Pre-Licensure Textbook*

**Audience:** Pre-licensure nursing students (ADN/BSN) — first-year, foundational level  
**Tone:** Formal/academic  
**Citation Style:** APA 7th edition  
**Format:** Markdown source, HTML/web output  
**Target Length:** 900+ pages across 45 chapters

---

## Web Application

The project is published as a GitHub Pages site from the `docs/` directory. The top-level page is a multi-textbook catalog. The *Foundations of Nursing* textbook lives under `docs/foundations-of-nursing/`.

- **GitHub Pages URL:** `https://sagreenxyz.github.io/foundations-of-nursing/`
- **Textbook URL:** `https://sagreenxyz.github.io/foundations-of-nursing/foundations-of-nursing/`
- **LMS URL:** `https://sagreenxyz.github.io/foundations-of-nursing/lms/`

**Local development:**

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/docs/` for the catalog or  
`http://localhost:8080/docs/foundations-of-nursing/` to go directly to the textbook.

The app requires no build step and no external dependencies beyond the marked.js CDN used to render Markdown.

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

The textbook catalog is published at:

```
https://sagreenxyz.github.io/foundations-of-nursing/
```

Open that URL in any modern browser. Select *Foundations of Nursing* from the catalog, or navigate directly to:

```
https://sagreenxyz.github.io/foundations-of-nursing/foundations-of-nursing/
```

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
├── dependency-tree.html         # Project dependency DAG (standalone SPA)
├── strategy/                    # Project strategy documents
│   ├── merged-toc.md            # Master Table of Contents (45 chapters)
│   ├── roadmap.md               # Phase 1-12 production roadmap
│   ├── team.md                  # Team roles and responsibilities
│   └── toc-strategy-analysis.md
├── activity/                    # Sprint artifacts (one directory per sprint)
├── content/                     # Chapter markdown source files (canonical)
│   ├── chapter-01.md
│   └── …
├── scripts/                     # Utility scripts
│   ├── update-dependency-tree.js
│   └── update-index.js
└── docs/                        # GitHub Pages root
    ├── index.html               # Catalog / multi-textbook landing page
    ├── lms/                     # NurseMastery LMS SPA
    └── foundations-of-nursing/  # Foundations of Nursing textbook app
        ├── index.html
        ├── css/style.css
        ├── js/app.js
        ├── content/             # Chapter markdown served to the browser
        ├── index.md             # Alphabetical key-term index (auto-generated)
        └── table-of-contents.md
```

---

## Adding a New Textbook

1. Create a new subdirectory under `docs/`, e.g. `docs/my-new-textbook/`.
2. Copy the structure from `docs/foundations-of-nursing/` (index.html, css/, js/, content/).
3. Update `js/app.js` in the new textbook directory with that book's chapter registry.
4. Add a card for the new textbook in `docs/index.html`.

---

## Chapter Status

| # | Chapter | Status |
|---|---------|--------|
| **1** | **History and Evolution of Nursing** | **Draft Available** |
| **2** | **Legal, Ethical, and Professional Standards** | **Draft Available** |
| **3** | **Patient Rights, Advocacy, and Informed Consent** | **Draft Available** |
| **4** | **Therapeutic Communication** | **Draft Available** (v2.0 — edited) |
| **5** | **Cultural Humility, Health Literacy, and Inclusive Care** | **Draft Available** |
| **6** | **End-of-Life Communication and Palliative Care** | **Draft Available** |
| **7** | **Evidence-Based Practice and Quality Improvement** | **Draft Available** |
| **8** | **The Nursing Process (ADPIE)** | **Draft Available** |
| **9** | **Clinical Judgment and the NCSBN CJMM** | **Draft Available** |
| **10** | **Health, Wellness, and Illness** | **Draft Available** |
| **11** | **Lifespan Development and Age-Related Nursing** | **Draft Available** |
| **12** | **Nutrition and Metabolic Health** | **Draft Available** |
| **13** | **Introduction to Pathophysiology** | **Draft Available** |
| **14** | **Fluid, Electrolyte, and Acid-Base Balance** | **Draft Available** |
| 15–45 | Additional Chapters | Coming Soon |

---

## Developer Setup

### Dependency Tree Auto-Sync

`dependency-tree.html` is kept in sync with the master sprint backlog
(`activity/2026-03-15-1210/sprint-backlog.md`) through two complementary
mechanisms:

**1 — GitHub Actions (runs automatically on every push to `main`)**

A workflow at `.github/workflows/update-dependency-tree.yml` triggers
whenever the master backlog or any chapter file changes. It runs
`scripts/update-dependency-tree.js` and commits the updated
`dependency-tree.html` back to `main`. No manual steps are needed — the
dependency tree is refreshed at the end of every sprint as part of the normal
push workflow.

**2 — Pre-commit hook (optional, for local development)**

After cloning, run the following once to activate the local pre-commit hook:

```bash
git config core.hooksPath .githooks
```

The hook runs `scripts/update-dependency-tree.js` before every commit and
automatically stages `dependency-tree.html` if it changed.

**Manual sync (run at any time):**

```bash
node scripts/update-dependency-tree.js
```

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
