/* ============================================================
   Medical-Surgical Nursing — app.js  v1.0
   ============================================================
   Uses marked.js (loaded via CDN in index.html) to render
   markdown chapter files fetched from content/.
   ============================================================ */

'use strict';

/* ── Chapter Registry ─────────────────────────────────────── */
const UNITS = [
  {
    label: 'Unit 1: Foundations of Medical-Surgical Nursing',
    chapters: [
      { num: 1,  title: 'Introduction to Medical-Surgical Nursing Practice',   file: 'chapter-01.md', status: 'soon' },
      { num: 2,  title: 'Health Assessment and Physical Examination',           file: 'chapter-02.md', status: 'soon' },
      { num: 3,  title: 'Perioperative Nursing Care',                          file: 'chapter-03.md', status: 'soon' },
      { num: 4,  title: 'Pain Assessment and Management',                      file: 'chapter-04.md', status: 'soon' },
      { num: 5,  title: 'Infection Prevention and Control',                    file: 'chapter-05.md', status: 'soon' },
      { num: 6,  title: 'Fluid, Electrolyte, and Acid-Base Imbalances',        file: 'chapter-06.md', status: 'soon' },
    ],
  },
  {
    label: 'Unit 2: Cardiovascular System',
    chapters: [
      { num: 7,  title: 'Assessment of the Cardiovascular System',             file: 'chapter-07.md', status: 'soon' },
      { num: 8,  title: 'Heart Failure and Cardiomyopathy',                    file: 'chapter-08.md', status: 'soon' },
      { num: 9,  title: 'Dysrhythmias and Conduction Disorders',               file: 'chapter-09.md', status: 'soon' },
      { num: 10, title: 'Coronary Artery Disease and Acute Coronary Syndromes', file: 'chapter-10.md', status: 'soon' },
      { num: 11, title: 'Hypertension',                                        file: 'chapter-11.md', status: 'soon' },
      { num: 12, title: 'Peripheral Vascular and Lymphatic Disorders',         file: 'chapter-12.md', status: 'soon' },
    ],
  },
  {
    label: 'Unit 3: Respiratory System',
    chapters: [
      { num: 13, title: 'Assessment of the Respiratory System',                file: 'chapter-13.md', status: 'soon' },
      { num: 14, title: 'Upper Respiratory Tract Disorders',                   file: 'chapter-14.md', status: 'soon' },
      { num: 15, title: 'Lower Respiratory Tract Disorders',                   file: 'chapter-15.md', status: 'soon' },
      { num: 16, title: 'Critical Respiratory Conditions and Mechanical Ventilation', file: 'chapter-16.md', status: 'soon' },
    ],
  },
  {
    label: 'Unit 4: Neurological System',
    chapters: [
      { num: 17, title: 'Assessment of the Neurological System',               file: 'chapter-17.md', status: 'soon' },
      { num: 18, title: 'Stroke and Cerebrovascular Disorders',                file: 'chapter-18.md', status: 'soon' },
      { num: 19, title: 'Head Injury and Increased Intracranial Pressure',     file: 'chapter-19.md', status: 'soon' },
      { num: 20, title: 'Neurological and Neuromuscular Disorders',            file: 'chapter-20.md', status: 'soon' },
    ],
  },
  {
    label: 'Unit 5: Gastrointestinal System',
    chapters: [
      { num: 21, title: 'Assessment of the Gastrointestinal System',           file: 'chapter-21.md', status: 'soon' },
      { num: 22, title: 'Upper Gastrointestinal Disorders',                    file: 'chapter-22.md', status: 'soon' },
      { num: 23, title: 'Lower Gastrointestinal Disorders',                    file: 'chapter-23.md', status: 'soon' },
      { num: 24, title: 'Liver, Biliary, and Pancreatic Disorders',            file: 'chapter-24.md', status: 'soon' },
    ],
  },
  {
    label: 'Unit 6: Renal and Urinary System',
    chapters: [
      { num: 25, title: 'Assessment of the Renal and Urinary System',          file: 'chapter-25.md', status: 'soon' },
      { num: 26, title: 'Acute Kidney Injury and Chronic Kidney Disease',      file: 'chapter-26.md', status: 'soon' },
      { num: 27, title: 'Urinary Tract Disorders',                             file: 'chapter-27.md', status: 'soon' },
    ],
  },
  {
    label: 'Unit 7: Endocrine System',
    chapters: [
      { num: 28, title: 'Assessment of the Endocrine System',                  file: 'chapter-28.md', status: 'soon' },
      { num: 29, title: 'Diabetes Mellitus and Metabolic Syndrome',            file: 'chapter-29.md', status: 'soon' },
      { num: 30, title: 'Thyroid and Parathyroid Disorders',                   file: 'chapter-30.md', status: 'soon' },
      { num: 31, title: 'Adrenal and Pituitary Disorders',                     file: 'chapter-31.md', status: 'soon' },
    ],
  },
  {
    label: 'Unit 8: Musculoskeletal System',
    chapters: [
      { num: 32, title: 'Assessment of the Musculoskeletal System',            file: 'chapter-32.md', status: 'soon' },
      { num: 33, title: 'Fractures and Orthopedic Trauma',                     file: 'chapter-33.md', status: 'soon' },
      { num: 34, title: 'Arthritis and Connective Tissue Disorders',           file: 'chapter-34.md', status: 'soon' },
      { num: 35, title: 'Osteoporosis and Metabolic Bone Disease',             file: 'chapter-35.md', status: 'soon' },
    ],
  },
  {
    label: 'Unit 9: Integumentary System',
    chapters: [
      { num: 36, title: 'Assessment of the Integumentary System',              file: 'chapter-36.md', status: 'soon' },
      { num: 37, title: 'Burns and Wound Care',                                file: 'chapter-37.md', status: 'soon' },
      { num: 38, title: 'Skin Disorders and Dermatologic Conditions',          file: 'chapter-38.md', status: 'soon' },
    ],
  },
  {
    label: 'Unit 10: Hematologic and Oncologic Nursing',
    chapters: [
      { num: 39, title: 'Assessment of the Hematologic System',                file: 'chapter-39.md', status: 'soon' },
      { num: 40, title: 'Anemias, Clotting Disorders, and Blood Dyscrasias',   file: 'chapter-40.md', status: 'soon' },
      { num: 41, title: 'Cancer and Oncologic Nursing',                        file: 'chapter-41.md', status: 'soon' },
      { num: 42, title: 'Immunologic Disorders and HIV/AIDS',                  file: 'chapter-42.md', status: 'soon' },
    ],
  },
  {
    label: 'Unit 11: Emergency and Critical Care',
    chapters: [
      { num: 43, title: 'Emergency Nursing and Triage',                        file: 'chapter-43.md', status: 'soon' },
      { num: 44, title: 'Shock, Sepsis, and Multi-Organ Dysfunction',          file: 'chapter-44.md', status: 'soon' },
      { num: 45, title: 'Critical Care Nursing and ICU Management',            file: 'chapter-45.md', status: 'soon' },
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
  document.title = 'Medical-Surgical Nursing';
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
  const scripts = document.querySelectorAll('script[src]');
  for (const s of scripts) {
    const src = s.getAttribute('src');
    if (src && src.includes('app.js')) {
      const jsDir = s.src.replace(/js\/app\.js.*$/, '');
      return jsDir + 'content/' + filename;
    }
  }
  return 'content/' + filename;
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
    document.title = `Ch. ${ch.num} — Medical-Surgical Nursing`;
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
    document.title = `Ch. ${ch.num}: ${ch.title} — Medical-Surgical Nursing`;
    history.replaceState(null, '', `#ch-${ch.num}`);
  } catch (err) {
    showError(
      `Unable to load Chapter ${ch.num}.\n\n` +
      `If you are opening this page directly as a local file (file:// URL), ` +
      `browsers block loading of sibling files for security reasons. ` +
      `Please use a local web server instead:\n\n` +
      `  python3 -m http.server 8080\n\n` +
      `Then open: http://localhost:8080/docs/medical-surgical-nursing/\n\n` +
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
