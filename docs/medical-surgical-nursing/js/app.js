/* ============================================================
   Medical-Surgical Nursing — app.js  v1.0
   ============================================================
   TOC synthesized from:
     • Lewis's Medical-Surgical Nursing (Harding et al., 11th ed.)
     • Brunner & Suddarth's Textbook of Medical-Surgical Nursing
       (Hinkle & Cheever, 14th ed.)
     • Medical-Surgical Nursing: Concepts for Interprofessional
       Collaborative Care (Ignatavicius, 10th ed.)
   74 chapters · 17 units
   Uses marked.js (loaded via CDN in index.html) to render
   markdown chapter files fetched from content/.
   ============================================================ */

'use strict';

/* ── Chapter Registry ─────────────────────────────────────── */
const UNITS = [
  /* ── Unit 1 ─────────────────────────────────────────────── */
  {
    label: 'Unit 1: Foundations of Medical-Surgical Nursing',
    chapters: [
      { num:  1, title: 'Introduction to Medical-Surgical Nursing: Scope, Roles, and Interprofessional Practice', file: 'chapter-01.md', status: 'draft' },
      { num:  2, title: 'Clinical Judgment and the Nursing Process in Medical-Surgical Settings',                  file: 'chapter-02.md', status: 'draft' },
      { num:  3, title: 'Evidence-Based Practice, Quality Improvement, and Patient Safety',                       file: 'chapter-03.md', status: 'draft' },
      { num:  4, title: 'Health Assessment and Physical Examination of the Adult Patient',                        file: 'chapter-04.md', status: 'soon' },
      { num:  5, title: 'Genetics, Genomics, Aging, and Chronic Illness Management',                             file: 'chapter-05.md', status: 'soon' },
      { num:  6, title: 'Patient Education, Health Literacy, and Care Coordination',                             file: 'chapter-06.md', status: 'soon' },
    ],
  },

  /* ── Unit 2 ─────────────────────────────────────────────── */
  {
    label: 'Unit 2: Pathophysiologic Mechanisms of Disease',
    chapters: [
      { num:  7, title: 'Cell Biology, Altered Cellular Function, and the Stress Response',                      file: 'chapter-07.md', status: 'soon' },
      { num:  8, title: 'Inflammation, Infection, and Antimicrobial Stewardship',                                file: 'chapter-08.md', status: 'soon' },
      { num:  9, title: 'Immunity: Normal Function, Hypersensitivity, and Autoimmunity',                         file: 'chapter-09.md', status: 'soon' },
    ],
  },

  /* ── Unit 3 ─────────────────────────────────────────────── */
  {
    label: 'Unit 3: Fluid, Electrolyte, and Acid-Base Balance',
    chapters: [
      { num: 10, title: 'Fluid and Electrolyte Imbalances',                                                      file: 'chapter-10.md', status: 'soon' },
      { num: 11, title: 'Acid-Base Imbalances',                                                                  file: 'chapter-11.md', status: 'soon' },
      { num: 12, title: 'Intravenous Therapy and Infusion Nursing',                                              file: 'chapter-12.md', status: 'soon' },
    ],
  },

  /* ── Unit 4 ─────────────────────────────────────────────── */
  {
    label: 'Unit 4: Pain and Comfort Management',
    chapters: [
      { num: 13, title: 'Acute Pain: Assessment and Pharmacologic and Nonpharmacologic Management',              file: 'chapter-13.md', status: 'soon' },
      { num: 14, title: 'Chronic Pain, Substance Use Disorders, and Palliative Analgesia',                       file: 'chapter-14.md', status: 'soon' },
    ],
  },

  /* ── Unit 5 ─────────────────────────────────────────────── */
  {
    label: 'Unit 5: Perioperative Nursing Care',
    chapters: [
      { num: 15, title: 'Preoperative Nursing: Patient Preparation, Assessment, and Teaching',                   file: 'chapter-15.md', status: 'soon' },
      { num: 16, title: 'Intraoperative Nursing Care and Anesthetic Management',                                 file: 'chapter-16.md', status: 'soon' },
      { num: 17, title: 'Postoperative Nursing Care and Prevention of Surgical Complications',                   file: 'chapter-17.md', status: 'soon' },
    ],
  },

  /* ── Unit 6 ─────────────────────────────────────────────── */
  {
    label: 'Unit 6: Problems of Oxygenation — Ventilation (Respiratory System)',
    chapters: [
      { num: 18, title: 'Assessment of the Respiratory System',                                                  file: 'chapter-18.md', status: 'soon' },
      { num: 19, title: 'Upper Respiratory Tract Disorders',                                                     file: 'chapter-19.md', status: 'soon' },
      { num: 20, title: 'Lower Respiratory Tract Infections: Pneumonia and Tuberculosis',                        file: 'chapter-20.md', status: 'soon' },
      { num: 21, title: 'Chronic Obstructive Pulmonary Disease, Asthma, and Restrictive Lung Disorders',         file: 'chapter-21.md', status: 'soon' },
      { num: 22, title: 'Acute Respiratory Failure, ARDS, and Mechanical Ventilation',                           file: 'chapter-22.md', status: 'soon' },
    ],
  },

  /* ── Unit 7 ─────────────────────────────────────────────── */
  {
    label: 'Unit 7: Problems of Oxygenation — Perfusion (Cardiovascular System)',
    chapters: [
      { num: 23, title: 'Assessment of the Cardiovascular System',                                               file: 'chapter-23.md', status: 'soon' },
      { num: 24, title: 'Dysrhythmias and Conduction Disorders',                                                 file: 'chapter-24.md', status: 'soon' },
      { num: 25, title: 'Coronary Artery Disease and Acute Coronary Syndromes',                                  file: 'chapter-25.md', status: 'soon' },
      { num: 26, title: 'Heart Failure and Cardiomyopathy',                                                      file: 'chapter-26.md', status: 'soon' },
      { num: 27, title: 'Hypertension',                                                                          file: 'chapter-27.md', status: 'soon' },
      { num: 28, title: 'Peripheral Vascular, Arterial, and Lymphatic Disorders',                                file: 'chapter-28.md', status: 'soon' },
    ],
  },

  /* ── Unit 8 ─────────────────────────────────────────────── */
  {
    label: 'Unit 8: Problems of Oxygenation — Transport (Hematologic System)',
    chapters: [
      { num: 29, title: 'Assessment of the Hematologic System',                                                  file: 'chapter-29.md', status: 'soon' },
      { num: 30, title: 'Anemias and Red Blood Cell Disorders',                                                  file: 'chapter-30.md', status: 'soon' },
      { num: 31, title: 'Coagulopathies and Platelet Disorders',                                                 file: 'chapter-31.md', status: 'soon' },
      { num: 32, title: 'White Blood Cell Disorders and Bone Marrow Failure',                                    file: 'chapter-32.md', status: 'soon' },
    ],
  },

  /* ── Unit 9 ─────────────────────────────────────────────── */
  {
    label: 'Unit 9: Oncologic and Immunologic Nursing',
    chapters: [
      { num: 33, title: 'Pathophysiology of Cancer and Treatment Modalities',                                    file: 'chapter-33.md', status: 'soon' },
      { num: 34, title: 'Nursing Care of Patients with Cancer',                                                  file: 'chapter-34.md', status: 'soon' },
      { num: 35, title: 'Oncologic Emergencies and Palliative Care in Cancer',                                   file: 'chapter-35.md', status: 'soon' },
      { num: 36, title: 'Assessment and Management of Immune Dysfunction and Allergy',                           file: 'chapter-36.md', status: 'soon' },
      { num: 37, title: 'HIV Disease and Immunodeficiency Disorders',                                            file: 'chapter-37.md', status: 'soon' },
    ],
  },

  /* ── Unit 10 ────────────────────────────────────────────── */
  {
    label: 'Unit 10: Problems of Digestion, Nutrition, and Elimination (Gastrointestinal System)',
    chapters: [
      { num: 38, title: 'Assessment of the Gastrointestinal System',                                             file: 'chapter-38.md', status: 'soon' },
      { num: 39, title: 'Oral Cavity, Esophageal, and Gastric Disorders',                                        file: 'chapter-39.md', status: 'soon' },
      { num: 40, title: 'Intestinal and Anorectal Disorders',                                                    file: 'chapter-40.md', status: 'soon' },
      { num: 41, title: 'Inflammatory Bowel Disease',                                                            file: 'chapter-41.md', status: 'soon' },
      { num: 42, title: 'Hepatic, Biliary Tract, and Pancreatic Disorders',                                      file: 'chapter-42.md', status: 'soon' },
      { num: 43, title: 'Malnutrition, Obesity, and Enteral and Parenteral Nutrition',                           file: 'chapter-43.md', status: 'soon' },
    ],
  },

  /* ── Unit 11 ────────────────────────────────────────────── */
  {
    label: 'Unit 11: Problems of Excretion (Renal and Urinary System)',
    chapters: [
      { num: 44, title: 'Assessment of the Renal and Urinary System',                                            file: 'chapter-44.md', status: 'soon' },
      { num: 45, title: 'Acute Kidney Injury',                                                                   file: 'chapter-45.md', status: 'soon' },
      { num: 46, title: 'Chronic Kidney Disease and Renal Replacement Therapy',                                  file: 'chapter-46.md', status: 'soon' },
      { num: 47, title: 'Urinary Tract Infections, Urolithiasis, and Voiding Disorders',                         file: 'chapter-47.md', status: 'soon' },
    ],
  },

  /* ── Unit 12 ────────────────────────────────────────────── */
  {
    label: 'Unit 12: Problems of Endocrine Regulation',
    chapters: [
      { num: 48, title: 'Assessment of the Endocrine System',                                                    file: 'chapter-48.md', status: 'soon' },
      { num: 49, title: 'Diabetes Mellitus: Types, Pathophysiology, and Self-Management',                        file: 'chapter-49.md', status: 'soon' },
      { num: 50, title: 'Diabetes Mellitus: Acute Complications and Complex Management',                         file: 'chapter-50.md', status: 'soon' },
      { num: 51, title: 'Thyroid and Parathyroid Disorders',                                                     file: 'chapter-51.md', status: 'soon' },
      { num: 52, title: 'Adrenal, Pituitary, and Gonadal Disorders',                                             file: 'chapter-52.md', status: 'soon' },
    ],
  },

  /* ── Unit 13 ────────────────────────────────────────────── */
  {
    label: 'Unit 13: Problems of Neurological Function',
    chapters: [
      { num: 53, title: 'Assessment of the Neurological System',                                                 file: 'chapter-53.md', status: 'soon' },
      { num: 54, title: 'Stroke and Cerebrovascular Disorders',                                                  file: 'chapter-54.md', status: 'soon' },
      { num: 55, title: 'Traumatic Brain Injury and Increased Intracranial Pressure',                            file: 'chapter-55.md', status: 'soon' },
      { num: 56, title: 'Spinal Cord Injury, Vertebral Fractures, and Degenerative Spinal Disease',              file: 'chapter-56.md', status: 'soon' },
      { num: 57, title: 'Seizure Disorders, Multiple Sclerosis, and Neurodegenerative Conditions',               file: 'chapter-57.md', status: 'soon' },
    ],
  },

  /* ── Unit 14 ────────────────────────────────────────────── */
  {
    label: 'Unit 14: Problems of Musculoskeletal Function',
    chapters: [
      { num: 58, title: 'Assessment of the Musculoskeletal System',                                              file: 'chapter-58.md', status: 'soon' },
      { num: 59, title: 'Fractures, Orthopedic Trauma, and Amputation',                                          file: 'chapter-59.md', status: 'soon' },
      { num: 60, title: 'Degenerative Joint Disease and Total Joint Arthroplasty',                               file: 'chapter-60.md', status: 'soon' },
      { num: 61, title: 'Rheumatoid Arthritis, Systemic Lupus Erythematosus, and Connective Tissue Disorders',   file: 'chapter-61.md', status: 'soon' },
      { num: 62, title: 'Osteoporosis, Metabolic Bone Disease, and Bone Tumors',                                 file: 'chapter-62.md', status: 'soon' },
    ],
  },

  /* ── Unit 15 ────────────────────────────────────────────── */
  {
    label: 'Unit 15: Problems of the Integumentary System',
    chapters: [
      { num: 63, title: 'Assessment of the Integumentary System',                                                file: 'chapter-63.md', status: 'soon' },
      { num: 64, title: 'Dermatologic Disorders and Inflammatory Skin Conditions',                               file: 'chapter-64.md', status: 'soon' },
      { num: 65, title: 'Burns: Emergency Care, Resuscitation, and Wound Management',                            file: 'chapter-65.md', status: 'soon' },
      { num: 66, title: 'Pressure Injuries, Chronic Wounds, and Reconstructive Skin Surgery',                    file: 'chapter-66.md', status: 'soon' },
    ],
  },

  /* ── Unit 16 ────────────────────────────────────────────── */
  {
    label: 'Unit 16: Problems of the Reproductive System',
    chapters: [
      { num: 67, title: 'Assessment of Male and Female Reproductive Systems',                                    file: 'chapter-67.md', status: 'soon' },
      { num: 68, title: 'Female Reproductive Disorders and Gynecologic Conditions',                              file: 'chapter-68.md', status: 'soon' },
      { num: 69, title: 'Male Reproductive and Urologic Disorders',                                              file: 'chapter-69.md', status: 'soon' },
      { num: 70, title: 'Sexually Transmitted Infections and Sexual Health Nursing',                              file: 'chapter-70.md', status: 'soon' },
    ],
  },

  /* ── Unit 17 ────────────────────────────────────────────── */
  {
    label: 'Unit 17: Emergency, Critical Care, and Disaster Nursing',
    chapters: [
      { num: 71, title: 'Emergency Nursing, Triage, and Mass Casualty Incidents',                                file: 'chapter-71.md', status: 'soon' },
      { num: 72, title: 'Shock, Sepsis, and Multi-Organ Dysfunction Syndrome',                                   file: 'chapter-72.md', status: 'soon' },
      { num: 73, title: 'Critical Care Nursing and ICU Management',                                              file: 'chapter-73.md', status: 'soon' },
      { num: 74, title: 'End-of-Life Care in Acute Medical-Surgical Settings',                                   file: 'chapter-74.md', status: 'soon' },
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
