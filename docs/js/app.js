/* ============================================================
   Foundations of Nursing — app.js  v1.0
   Sprint 2026-03-15-2105
   ============================================================
   Uses marked.js (loaded via CDN in index.html) to render
   markdown chapter files fetched from ../content/.
   ============================================================ */

'use strict';

/* ── Chapter Registry ─────────────────────────────────────── */
const UNITS = [
  {
    label: 'Unit 1: The Professional Architecture',
    chapters: [
      { num: 1,  title: 'History and Evolution of Nursing',                  file: 'chapter-01.md', status: 'draft'   },
      { num: 2,  title: 'Legal, Ethical, and Professional Standards',         file: 'chapter-02.md', status: 'draft'   },
      { num: 3,  title: 'Patient Rights, Advocacy, and Informed Consent',     file: 'chapter-03.md', status: 'soon'    },
      { num: 4,  title: 'Therapeutic Communication',                          file: 'chapter-04.md', status: 'draft'  },
      { num: 5,  title: 'Cultural Humility, Health Literacy, and Inclusive Care', file: 'chapter-05.md', status: 'soon' },
      { num: 6,  title: 'End-of-Life Communication and Palliative Care',      file: 'chapter-06.md', status: 'soon'    },
    ],
  },
  {
    label: 'Unit 2: The Clinical Mindset',
    chapters: [
      { num: 7,  title: 'Evidence-Based Practice and Quality Improvement',    file: 'chapter-07.md', status: 'draft'   },
      { num: 8,  title: 'The Nursing Process (ADPIE)',                        file: 'chapter-08.md', status: 'soon'    },
      { num: 9,  title: 'Clinical Judgment and the NCSBN CJMM',              file: 'chapter-09.md', status: 'soon'    },
    ],
  },
  {
    label: 'Unit 3: Health, Wellness, and Human Development',
    chapters: [
      { num: 10, title: 'Health, Wellness, and Illness',                      file: 'chapter-10.md', status: 'draft'   },
      { num: 11, title: 'Lifespan Development and Age-Related Nursing',       file: 'chapter-11.md', status: 'soon'    },
      { num: 12, title: 'Nutrition and Metabolic Health',                     file: 'chapter-12.md', status: 'soon'    },
    ],
  },
  {
    label: 'Unit 4: Biological Foundations and Pathophysiology',
    chapters: [
      { num: 13, title: 'Introduction to Pathophysiology',                    file: 'chapter-13.md', status: 'soon'    },
      { num: 14, title: 'Fluid, Electrolyte, and Acid-Base Balance',          file: 'chapter-14.md', status: 'soon'    },
      { num: 15, title: 'Perfusion and Oxygenation',                          file: 'chapter-15.md', status: 'soon'    },
      { num: 16, title: 'Cardiovascular Pathophysiology',                     file: 'chapter-16.md', status: 'soon'    },
      { num: 17, title: 'Respiratory Pathophysiology',                        file: 'chapter-17.md', status: 'soon'    },
      { num: 18, title: 'Neurological Pathophysiology',                       file: 'chapter-18.md', status: 'soon'    },
      { num: 19, title: 'Musculoskeletal Pathophysiology',                    file: 'chapter-19.md', status: 'soon'    },
      { num: 20, title: 'Gastrointestinal Pathophysiology',                   file: 'chapter-20.md', status: 'soon'    },
      { num: 21, title: 'Renal and Urinary Pathophysiology',                  file: 'chapter-21.md', status: 'soon'    },
      { num: 22, title: 'Endocrine Pathophysiology',                          file: 'chapter-22.md', status: 'soon'    },
      { num: 23, title: 'Immune System and Infectious Disease',               file: 'chapter-23.md', status: 'soon'    },
    ],
  },
  {
    label: 'Unit 5: Pharmacology',
    chapters: [
      { num: 24, title: 'Principles of Pharmacology',                         file: 'chapter-24.md', status: 'soon'    },
      { num: 25, title: 'Safe Medication Administration',                     file: 'chapter-25.md', status: 'soon'    },
      { num: 26, title: 'Drug Classifications and Mechanisms',                file: 'chapter-26.md', status: 'soon'    },
      { num: 27, title: 'Patient Education for Medications',                  file: 'chapter-27.md', status: 'soon'    },
    ],
  },
  {
    label: 'Unit 6: Clinical Skills',
    chapters: [
      { num: 28, title: 'Vital Signs and Physical Assessment',                file: 'chapter-28.md', status: 'soon'    },
      { num: 29, title: 'Infection Control and Sterile Technique',            file: 'chapter-29.md', status: 'soon'    },
      { num: 30, title: 'Hygiene, Mobility, and Skin Integrity',              file: 'chapter-30.md', status: 'soon'    },
      { num: 31, title: 'IV Therapy and Venous Access',                       file: 'chapter-31.md', status: 'soon'    },
      { num: 32, title: 'Urinary and Bowel Elimination',                      file: 'chapter-32.md', status: 'soon'    },
      { num: 33, title: 'Oxygenation and Airway Management',                  file: 'chapter-33.md', status: 'soon'    },
      { num: 34, title: 'Perioperative Nursing Care',                         file: 'chapter-34.md', status: 'soon'    },
    ],
  },
  {
    label: 'Unit 7: Mental Health Nursing',
    chapters: [
      { num: 35, title: 'Foundations of Mental Health Nursing',               file: 'chapter-35.md', status: 'soon'    },
      { num: 36, title: 'Common Psychiatric Disorders and Nursing Care',      file: 'chapter-36.md', status: 'soon'    },
    ],
  },
  {
    label: 'Unit 8: Maternal-Newborn and Pediatric Nursing',
    chapters: [
      { num: 37, title: 'Maternal-Newborn Nursing',                           file: 'chapter-37.md', status: 'soon'    },
      { num: 38, title: 'Pediatric Nursing',                                  file: 'chapter-38.md', status: 'soon'    },
    ],
  },
  {
    label: 'Unit 9: Community and Public Health',
    chapters: [
      { num: 39, title: 'Community and Public Health Nursing',                file: 'chapter-39.md', status: 'soon'    },
      { num: 40, title: 'Home Health and Transitional Care',                  file: 'chapter-40.md', status: 'soon'    },
    ],
  },
  {
    label: 'Unit 10: Leadership and Management',
    chapters: [
      { num: 41, title: 'Leadership and Management in Nursing',               file: 'chapter-41.md', status: 'soon'    },
      { num: 42, title: 'Delegation, Supervision, and Team Nursing',          file: 'chapter-42.md', status: 'soon'    },
      { num: 43, title: 'Professional Development and Career Planning',       file: 'chapter-43.md', status: 'soon'    },
    ],
  },
  {
    label: 'Unit 11: Integration and Capstone',
    chapters: [
      { num: 44, title: 'Integrated Case Studies',                            file: 'chapter-44.md', status: 'soon'    },
      { num: 45, title: 'NCLEX Preparation and Clinical Readiness',           file: 'chapter-45.md', status: 'soon'    },
    ],
  },
];

const BADGE = {
  draft:   { cls: 'badge-draft',   label: 'Draft Available' },
  outline: { cls: 'badge-outline', label: 'Outline Only'    },
  soon:    { cls: 'badge-soon',    label: 'Coming Soon'     },
};

/* ── DOM References ───────────────────────────────────────── */
const sidebar        = document.getElementById('sidebar');
const mainEl         = document.getElementById('main');
const welcomeEl      = document.getElementById('welcome');
const chapterEl      = document.getElementById('chapter-content');
const loadingEl      = document.getElementById('loading');
const errorEl        = document.getElementById('error-msg');

/* ── Build Sidebar Navigation ─────────────────────────────── */
function buildNav() {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Textbook chapters');

  UNITS.forEach(unit => {
    const unitLabel = document.createElement('div');
    unitLabel.className = 'nav-unit-label';
    unitLabel.textContent = unit.label;
    nav.appendChild(unitLabel);

    unit.chapters.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'nav-chapter';
      btn.dataset.file = ch.file;
      btn.dataset.num  = ch.num;

      const badge = BADGE[ch.status] || BADGE.soon;
      btn.innerHTML =
        `<span class="ch-num">${ch.num}.</span>` +
        `<span class="ch-title">${ch.title}</span>` +
        `<span class="nav-badge ${badge.cls}">${badge.label}</span>`;

      btn.addEventListener('click', () => loadChapter(ch));
      nav.appendChild(btn);
    });
  });

  sidebar.appendChild(nav);
}

/* ── State Helpers ────────────────────────────────────────── */
function setActive(fileOrNull) {
  document.querySelectorAll('.nav-chapter').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.file === fileOrNull);
  });
}

function showWelcome() {
  welcomeEl.hidden  = false;
  chapterEl.hidden  = true;
  loadingEl.hidden  = true;
  errorEl.hidden    = true;
  setActive(null);
  document.title = 'Foundations of Nursing';
  history.replaceState(null, '', '#');
}

function showLoading() {
  welcomeEl.hidden  = true;
  chapterEl.hidden  = true;
  loadingEl.hidden  = false;
  errorEl.hidden    = true;
}

function showError(msg) {
  errorEl.textContent = msg;
  welcomeEl.hidden    = true;
  chapterEl.hidden    = true;
  loadingEl.hidden    = true;
  errorEl.hidden      = false;
}

function showChapter(html) {
  chapterEl.innerHTML = html;
  welcomeEl.hidden    = true;
  chapterEl.hidden    = false;
  loadingEl.hidden    = true;
  errorEl.hidden      = true;
  mainEl.scrollTop    = 0;
  window.scrollTo(0, 0);
}

/* ── Resolve Content Path ─────────────────────────────────── */
function contentPath(filename) {
  // Works on GitHub Pages (/<repo>/docs/) and local server (docs/)
  // The content/ folder sits one level above docs/
  const base = document.querySelector('base');
  if (base) {
    return base.href.replace(/docs\/?$/, '') + 'content/' + filename;
  }
  // Derive from current script location
  const scripts = document.querySelectorAll('script[src]');
  for (const s of scripts) {
    const src = s.getAttribute('src');
    if (src && src.includes('app.js')) {
      const jsDir = s.src.replace(/js\/app\.js.*$/, '');
      return jsDir + '../content/' + filename;
    }
  }
  return '../content/' + filename;
}

/* ── Load and Render Chapter ──────────────────────────────── */
async function loadChapter(ch) {
  if (ch.status === 'soon') {
    showChapter(
      `<h1>Chapter ${ch.num}: ${ch.title}</h1>` +
      `<p style="font-style:italic;color:var(--color-muted);">` +
      `This chapter is coming soon. Check back in a future sprint.</p>`
    );
    setActive(ch.file);
    document.title = `Ch. ${ch.num} — Foundations of Nursing`;
    history.replaceState(null, '', `#ch-${ch.num}`);
    return;
  }

  showLoading();
  setActive(ch.file);

  try {
    const url  = contentPath(ch.file);
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Could not load ${ch.file} (HTTP ${resp.status})`);
    }
    const md   = await resp.text();
    const html = marked.parse(md);
    showChapter(html);
    document.title = `Ch. ${ch.num}: ${ch.title} — Foundations of Nursing`;
    history.replaceState(null, '', `#ch-${ch.num}`);
  } catch (err) {
    showError(
      `Unable to load Chapter ${ch.num}.\n\n` +
      `If you are opening this page directly as a local file (file:// URL), ` +
      `browsers block loading of sibling files for security reasons. ` +
      `Please use a local web server instead:\n\n` +
      `  python3 -m http.server 8080\n\n` +
      `Then open: http://localhost:8080/docs/\n\n` +
      `Technical detail: ${err.message}`
    );
  }
}

/* ── Hash-Based Routing ───────────────────────────────────── */
function routeFromHash() {
  const hash = window.location.hash;
  const match = hash.match(/^#ch-(\d+)$/);
  if (match) {
    const num = parseInt(match[1], 10);
    for (const unit of UNITS) {
      const ch = unit.chapters.find(c => c.num === num);
      if (ch) { loadChapter(ch); return; }
    }
  }
  showWelcome();
}

/* ── Init ─────────────────────────────────────────────────── */
function init() {
  buildNav();

  // Home link behaviour
  const homeLink = document.getElementById('home-link');
  if (homeLink) {
    homeLink.addEventListener('click', e => {
      e.preventDefault();
      showWelcome();
    });
  }

  // Configure marked
  if (typeof marked !== 'undefined') {
    marked.use({ gfm: true, breaks: false });
  }

  // Route from URL hash (supports bookmarks / back-button)
  window.addEventListener('hashchange', routeFromHash);
  routeFromHash();
}

document.addEventListener('DOMContentLoaded', init);
