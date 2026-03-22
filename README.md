# NurseMastery — Open Nursing Textbooks

https://sagreenxyz.github.io/foundations-of-nursing

*Open-Access Nursing Textbooks & Learning Tools*

---

## Textbooks

| Textbook | Chapters | Status |
|----------|----------|--------|
| **Foundations of Nursing** | 45 chapters · 11 units | 14 chapters drafted |
| **Medical-Surgical Nursing** | 74 chapters · 17 units | In development |
| **Clinical Pharmacology for Nurses** | 70 chapters · 13 units | 1 chapter drafted |

---

## Web Application

The project is published as a GitHub Pages site from the `docs/` directory. The top-level page is a multi-textbook catalog.

- **Catalog:** `https://sagreenxyz.github.io/foundations-of-nursing/`
- **Foundations of Nursing:** `https://sagreenxyz.github.io/foundations-of-nursing/foundations-of-nursing/`
- **Medical-Surgical Nursing:** `https://sagreenxyz.github.io/foundations-of-nursing/medical-surgical-nursing/`
- **Clinical Pharmacology for Nurses:** `https://sagreenxyz.github.io/foundations-of-nursing/pharmacology/`
- **LMS:** `https://sagreenxyz.github.io/foundations-of-nursing/lms/`

**Local development:**

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/docs/` for the catalog.

The app requires no build step and no external dependencies beyond the marked.js CDN used to render Markdown.

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
    ├── foundations-of-nursing/  # Foundations of Nursing textbook app
    │   ├── index.html
    │   ├── css/style.css
    │   ├── js/app.js
    │   ├── content/             # Chapter markdown served to the browser
    │   ├── index.md             # Alphabetical key-term index (auto-generated)
    │   └── table-of-contents.md
    └── medical-surgical-nursing/ # Medical-Surgical Nursing textbook app
        ├── index.html
        ├── css/style.css
        ├── js/app.js            # 74-chapter TOC (17 units)
        └── content/             # Chapter markdown (in development)
    └── pharmacology/            # Clinical Pharmacology for Nurses textbook app
        ├── index.html
        ├── css/style.css
        ├── js/app.js            # 70-chapter TOC (13 units)
        └── content/             # Chapter markdown (chapter-01.md drafted)
```

---

## Adding a New Textbook

1. Create a new subdirectory under `docs/`, e.g. `docs/my-new-textbook/`.
2. Copy the structure from `docs/foundations-of-nursing/` (index.html, css/, js/, content/).
3. Update `js/app.js` in the new textbook directory with that book's chapter registry.
4. Add a card for the new textbook in `docs/index.html`.

---

## Chapter Status

### Foundations of Nursing

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

### Clinical Pharmacology for Nurses

70 chapters across 13 units — TOC synthesized from *Pharmacology and the Nursing Process* (Lilley, Collins, & Snyder, 11th ed.), *Lehne's Pharmacology for Nursing Care* (Burchum & Rosenthal, 11th ed.), and *Focus on Nursing Pharmacology* (Tucker [Karch], 9th ed.).

| Unit | Title | Chapters |
|------|-------|----------|
| 1 | Foundations of Pharmacology | 1–6 |
| 2 | Autonomic Nervous System Drugs | 7–11 |
| 3 | Central Nervous System Drugs | 12–20 |
| 4 | Analgesics and Pain Management | 21–23 |
| 5 | Cardiovascular Drugs | 24–32 |
| 6 | Respiratory Drugs | 33–35 |
| 7 | Gastrointestinal Drugs | 36–39 |
| 8 | Endocrine and Metabolic Drugs | 40–46 |
| 9 | Anti-Infective Drugs | 47–55 |
| 10 | Immunologic Drugs | 56–59 |
| 11 | Antineoplastic Drugs | 60–64 |
| 12 | Dermatologic and Ophthalmic Drugs | 65–67 |
| 13 | Specialty Drug Topics | 68–70 |

| # | Chapter | Status |
|---|---------|--------|
| **1** | **Introduction to Nursing Pharmacology: History, Scope, and Relevance** | **Draft Available** |
| 2–70 | Additional Chapters | Coming Soon |

### Medical-Surgical Nursing TOC synthesized from *Lewis's Medical-Surgical Nursing* (Harding et al., 11th ed.), *Brunner & Suddarth's Textbook of Medical-Surgical Nursing* (Hinkle & Cheever, 14th ed.), and *Medical-Surgical Nursing: Concepts for Interprofessional Collaborative Care* (Ignatavicius, 10th ed.).

| Unit | Title | Chapters |
|------|-------|----------|
| 1 | Foundations of Medical-Surgical Nursing | 1–6 |
| 2 | Pathophysiologic Mechanisms of Disease | 7–9 |
| 3 | Fluid, Electrolyte, and Acid-Base Balance | 10–12 |
| 4 | Pain and Comfort Management | 13–14 |
| 5 | Perioperative Nursing Care | 15–17 |
| 6 | Problems of Oxygenation — Ventilation (Respiratory) | 18–22 |
| 7 | Problems of Oxygenation — Perfusion (Cardiovascular) | 23–28 |
| 8 | Problems of Oxygenation — Transport (Hematologic) | 29–32 |
| 9 | Oncologic and Immunologic Nursing | 33–37 |
| 10 | Problems of Digestion, Nutrition, and Elimination (GI) | 38–43 |
| 11 | Problems of Excretion (Renal and Urinary) | 44–47 |
| 12 | Problems of Endocrine Regulation | 48–52 |
| 13 | Problems of Neurological Function | 53–57 |
| 14 | Problems of Musculoskeletal Function | 58–62 |
| 15 | Problems of the Integumentary System | 63–66 |
| 16 | Problems of the Reproductive System | 67–70 |
| 17 | Emergency, Critical Care, and Disaster Nursing | 71–74 |

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
