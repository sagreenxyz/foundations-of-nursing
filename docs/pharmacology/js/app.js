/* ============================================================
   Clinical Pharmacology for Nurses — app.js  v1.0
   ============================================================
   TOC synthesized from:
     • Pharmacology and the Nursing Process (Lilley, Collins, &
       Snyder, 11th ed.)
     • Lehne's Pharmacology for Nursing Care (Burchum &
       Rosenthal, 11th ed.)
     • Focus on Nursing Pharmacology (Tucker [Karch], 9th ed.)
   70 chapters · 13 units
   Uses marked.js (loaded via CDN in index.html) to render
   markdown chapter files fetched from content/.
   ============================================================ */

'use strict';

/* ── Chapter Registry ─────────────────────────────────────── */
const UNITS = [
  /* ── Unit 1 ─────────────────────────────────────────────── */
  {
    label: 'Unit 1: Foundations of Pharmacology',
    chapters: [
      { num:  1, title: 'Introduction to Nursing Pharmacology: History, Scope, and Relevance',                          file: 'chapter-01.md', status: 'draft'  },
      { num:  2, title: 'Pharmacokinetics: Drug Absorption, Distribution, Metabolism, and Excretion',                   file: 'chapter-02.md', status: 'soon'   },
      { num:  3, title: 'Pharmacodynamics: Mechanisms of Drug Action and Drug-Receptor Interactions',                   file: 'chapter-03.md', status: 'soon'   },
      { num:  4, title: 'Drug Development, Regulation, and Medication Safety',                                          file: 'chapter-04.md', status: 'soon'   },
      { num:  5, title: 'Cultural, Ethical, and Legal Dimensions of Drug Therapy',                                      file: 'chapter-05.md', status: 'soon'   },
      { num:  6, title: 'Life-Span Considerations in Drug Therapy: Pediatrics, Pregnancy, and Older Adults',            file: 'chapter-06.md', status: 'soon'   },
    ],
  },

  /* ── Unit 2 ─────────────────────────────────────────────── */
  {
    label: 'Unit 2: Autonomic Nervous System Drugs',
    chapters: [
      { num:  7, title: 'Introduction to the Autonomic Nervous System',                                                 file: 'chapter-07.md', status: 'soon'   },
      { num:  8, title: 'Cholinergic Agonists and Anticholinergic Drugs',                                               file: 'chapter-08.md', status: 'soon'   },
      { num:  9, title: 'Adrenergic Agonists (Sympathomimetics)',                                                       file: 'chapter-09.md', status: 'soon'   },
      { num: 10, title: 'Adrenergic Antagonists: Alpha- and Beta-Blockers',                                             file: 'chapter-10.md', status: 'soon'   },
      { num: 11, title: 'Neuromuscular Junction Drugs and Skeletal Muscle Relaxants',                                   file: 'chapter-11.md', status: 'soon'   },
    ],
  },

  /* ── Unit 3 ─────────────────────────────────────────────── */
  {
    label: 'Unit 3: Central Nervous System Drugs',
    chapters: [
      { num: 12, title: 'Introduction to the Central Nervous System and Psychopharmacology',                            file: 'chapter-12.md', status: 'soon'   },
      { num: 13, title: 'Sedatives, Hypnotics, and Anxiolytic Drugs',                                                   file: 'chapter-13.md', status: 'soon'   },
      { num: 14, title: 'Antidepressants and Mood-Stabilizing Drugs',                                                   file: 'chapter-14.md', status: 'soon'   },
      { num: 15, title: 'Antipsychotic Drugs',                                                                          file: 'chapter-15.md', status: 'soon'   },
      { num: 16, title: 'Antiepileptic Drugs',                                                                          file: 'chapter-16.md', status: 'soon'   },
      { num: 17, title: 'Drugs for Parkinson Disease and Other Movement Disorders',                                      file: 'chapter-17.md', status: 'soon'   },
      { num: 18, title: 'Central Nervous System Stimulants and Drugs for ADHD',                                         file: 'chapter-18.md', status: 'soon'   },
      { num: 19, title: 'Drugs of Abuse and Substance Use Disorders',                                                   file: 'chapter-19.md', status: 'soon'   },
      { num: 20, title: 'Anesthetics and Adjunct Drugs',                                                                file: 'chapter-20.md', status: 'soon'   },
    ],
  },

  /* ── Unit 4 ─────────────────────────────────────────────── */
  {
    label: 'Unit 4: Analgesics and Pain Management',
    chapters: [
      { num: 21, title: 'Pain Physiology and Assessment for Pharmacologic Management',                                  file: 'chapter-21.md', status: 'soon'   },
      { num: 22, title: 'Opioid Analgesics and Antagonists',                                                            file: 'chapter-22.md', status: 'soon'   },
      { num: 23, title: 'Non-Opioid Analgesics: NSAIDs, Acetaminophen, and Adjuvant Drugs',                             file: 'chapter-23.md', status: 'soon'   },
    ],
  },

  /* ── Unit 5 ─────────────────────────────────────────────── */
  {
    label: 'Unit 5: Cardiovascular Drugs',
    chapters: [
      { num: 24, title: 'Antihypertensive Drugs',                                                                       file: 'chapter-24.md', status: 'soon'   },
      { num: 25, title: 'Drugs for Heart Failure',                                                                      file: 'chapter-25.md', status: 'soon'   },
      { num: 26, title: 'Antidysrhythmic Drugs',                                                                        file: 'chapter-26.md', status: 'soon'   },
      { num: 27, title: 'Antianginal Drugs',                                                                            file: 'chapter-27.md', status: 'soon'   },
      { num: 28, title: 'Anticoagulant, Antiplatelet, and Thrombolytic Drugs',                                          file: 'chapter-28.md', status: 'soon'   },
      { num: 29, title: 'Drugs for Hyperlipidemia',                                                                     file: 'chapter-29.md', status: 'soon'   },
      { num: 30, title: 'Diuretics',                                                                                    file: 'chapter-30.md', status: 'soon'   },
      { num: 31, title: 'Drugs for Anemia and Hematopoiesis',                                                           file: 'chapter-31.md', status: 'soon'   },
      { num: 32, title: 'Drugs for Shock and Hemodynamic Support',                                                      file: 'chapter-32.md', status: 'soon'   },
    ],
  },

  /* ── Unit 6 ─────────────────────────────────────────────── */
  {
    label: 'Unit 6: Respiratory Drugs',
    chapters: [
      { num: 33, title: 'Bronchodilators and Anti-Inflammatory Drugs for Asthma and COPD',                              file: 'chapter-33.md', status: 'soon'   },
      { num: 34, title: 'Drugs for Upper Respiratory Disorders',                                                        file: 'chapter-34.md', status: 'soon'   },
      { num: 35, title: 'Drugs for Tuberculosis, Pneumonia, and Fungal Lung Infections',                                 file: 'chapter-35.md', status: 'soon'   },
    ],
  },

  /* ── Unit 7 ─────────────────────────────────────────────── */
  {
    label: 'Unit 7: Gastrointestinal Drugs',
    chapters: [
      { num: 36, title: 'Drugs for Peptic Ulcer Disease and Acid-Reflux Disorders',                                     file: 'chapter-36.md', status: 'soon'   },
      { num: 37, title: 'Drugs for Nausea, Vomiting, and Motion Sickness',                                              file: 'chapter-37.md', status: 'soon'   },
      { num: 38, title: 'Laxatives and Antidiarrheal Drugs',                                                            file: 'chapter-38.md', status: 'soon'   },
      { num: 39, title: 'Drugs for Inflammatory Bowel Disease and Irritable Bowel Syndrome',                             file: 'chapter-39.md', status: 'soon'   },
    ],
  },

  /* ── Unit 8 ─────────────────────────────────────────────── */
  {
    label: 'Unit 8: Endocrine and Metabolic Drugs',
    chapters: [
      { num: 40, title: 'Pituitary and Hypothalamic Drugs',                                                             file: 'chapter-40.md', status: 'soon'   },
      { num: 41, title: 'Thyroid and Antithyroid Drugs',                                                                file: 'chapter-41.md', status: 'soon'   },
      { num: 42, title: 'Adrenal Drugs: Corticosteroids and Mineralocorticoids',                                        file: 'chapter-42.md', status: 'soon'   },
      { num: 43, title: 'Insulin, Oral Antidiabetic Drugs, and Other Hypoglycemic Agents',                              file: 'chapter-43.md', status: 'soon'   },
      { num: 44, title: 'Drugs for Reproductive Health and Hormonal Contraception',                                      file: 'chapter-44.md', status: 'soon'   },
      { num: 45, title: 'Drugs for Bone Mineral Disorders: Calcium Regulators and Bisphosphonates',                     file: 'chapter-45.md', status: 'soon'   },
      { num: 46, title: 'Vitamins, Minerals, and Nutritional Supplements',                                              file: 'chapter-46.md', status: 'soon'   },
    ],
  },

  /* ── Unit 9 ─────────────────────────────────────────────── */
  {
    label: 'Unit 9: Anti-Infective Drugs',
    chapters: [
      { num: 47, title: 'Principles of Antimicrobial Therapy and Antimicrobial Stewardship',                            file: 'chapter-47.md', status: 'soon'   },
      { num: 48, title: 'Penicillins, Cephalosporins, and Related Beta-Lactam Antibiotics',                             file: 'chapter-48.md', status: 'soon'   },
      { num: 49, title: 'Tetracyclines, Macrolides, and Miscellaneous Antibacterial Drugs',                             file: 'chapter-49.md', status: 'soon'   },
      { num: 50, title: 'Aminoglycosides, Fluoroquinolones, and Sulfonamides',                                          file: 'chapter-50.md', status: 'soon'   },
      { num: 51, title: 'Drugs for Tuberculosis, Leprosy, and Mycobacterial Infections',                                file: 'chapter-51.md', status: 'soon'   },
      { num: 52, title: 'Antifungal Drugs',                                                                             file: 'chapter-52.md', status: 'soon'   },
      { num: 53, title: 'Antiviral Drugs: HIV/AIDS and Antiretroviral Therapy',                                         file: 'chapter-53.md', status: 'soon'   },
      { num: 54, title: 'Antiviral Drugs for Non-HIV Infections',                                                       file: 'chapter-54.md', status: 'soon'   },
      { num: 55, title: 'Antiparasitic Drugs',                                                                          file: 'chapter-55.md', status: 'soon'   },
    ],
  },

  /* ── Unit 10 ─────────────────────────────────────────────── */
  {
    label: 'Unit 10: Immunologic Drugs',
    chapters: [
      { num: 56, title: 'Immunosuppressants and Drugs for Transplant Rejection',                                        file: 'chapter-56.md', status: 'soon'   },
      { num: 57, title: 'Immunostimulants, Biologics, and Targeted Therapies',                                          file: 'chapter-57.md', status: 'soon'   },
      { num: 58, title: 'Vaccines and Immunizations',                                                                   file: 'chapter-58.md', status: 'soon'   },
      { num: 59, title: 'Anti-Inflammatory Drugs: Corticosteroids and DMARDs',                                          file: 'chapter-59.md', status: 'soon'   },
    ],
  },

  /* ── Unit 11 ─────────────────────────────────────────────── */
  {
    label: 'Unit 11: Antineoplastic Drugs',
    chapters: [
      { num: 60, title: 'Introduction to Cancer Chemotherapy and Antineoplastic Principles',                            file: 'chapter-60.md', status: 'soon'   },
      { num: 61, title: 'Cytotoxic Antineoplastic Drugs: Alkylating Agents, Antimetabolites, and Antibiotics',          file: 'chapter-61.md', status: 'soon'   },
      { num: 62, title: 'Antineoplastic Drugs: Plant Alkaloids, Topoisomerase Inhibitors, and Hormonal Agents',         file: 'chapter-62.md', status: 'soon'   },
      { num: 63, title: 'Targeted Cancer Therapies: Monoclonal Antibodies and Kinase Inhibitors',                       file: 'chapter-63.md', status: 'soon'   },
      { num: 64, title: 'Supportive Care in Cancer: Managing Adverse Effects of Chemotherapy',                          file: 'chapter-64.md', status: 'soon'   },
    ],
  },

  /* ── Unit 12 ─────────────────────────────────────────────── */
  {
    label: 'Unit 12: Dermatologic and Ophthalmic Drugs',
    chapters: [
      { num: 65, title: 'Dermatologic Drugs: Topical Agents, Acne, and Wound Care',                                    file: 'chapter-65.md', status: 'soon'   },
      { num: 66, title: 'Ophthalmic Drugs: Glaucoma, Infections, and Anti-Inflammatory Agents',                         file: 'chapter-66.md', status: 'soon'   },
      { num: 67, title: 'Otic Drugs and Drugs for Oral Health',                                                         file: 'chapter-67.md', status: 'soon'   },
    ],
  },

  /* ── Unit 13 ─────────────────────────────────────────────── */
  {
    label: 'Unit 13: Specialty Drug Topics',
    chapters: [
      { num: 68, title: 'Drugs for Musculoskeletal Disorders: Gout, Osteoarthritis, and Muscle Spasms',                 file: 'chapter-68.md', status: 'soon'   },
      { num: 69, title: 'Intravenous Therapy, Fluid Replacement, and Total Parenteral Nutrition',                        file: 'chapter-69.md', status: 'soon'   },
      { num: 70, title: 'Emergency Drugs and Toxicology Management',                                                    file: 'chapter-70.md', status: 'soon'   },
    ],
  },
];

/* ── DOM References ───────────────────────────────────────── */
const sidebar        = document.getElementById('sidebar');
const homeLink       = document.getElementById('home-link');
const welcomeSection = document.getElementById('welcome');
const chapterArticle = document.getElementById('chapter-content');
const loadingEl      = document.getElementById('loading');
const errorEl        = document.getElementById('error-msg');

/* ── Badge helpers ────────────────────────────────────────── */
const BADGE = {
  draft:   { cls: 'badge-draft',   text: 'Draft Available' },
  outline: { cls: 'badge-outline', text: 'Outline Only'    },
  soon:    { cls: 'badge-soon',    text: 'Coming Soon'      },
};

/* ── Build Sidebar Navigation ─────────────────────────────── */
function buildNav() {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Chapters');

  UNITS.forEach(unit => {
    const unitLabel = document.createElement('div');
    unitLabel.className = 'nav-unit-label';
    unitLabel.textContent = unit.label;
    nav.appendChild(unitLabel);

    unit.chapters.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'nav-chapter';
      btn.dataset.file = ch.file;

      const numSpan = document.createElement('span');
      numSpan.className = 'ch-num';
      numSpan.textContent = String(ch.num).padStart(2, '0');

      const titleSpan = document.createElement('span');
      titleSpan.className = 'ch-title';
      titleSpan.textContent = ch.title;

      const badge = BADGE[ch.status] || BADGE.soon;
      const badgeSpan = document.createElement('span');
      badgeSpan.className = `nav-badge ${badge.cls}`;
      badgeSpan.textContent = badge.text;

      btn.appendChild(numSpan);
      btn.appendChild(titleSpan);
      btn.appendChild(badgeSpan);

      if (ch.status === 'soon') {
        btn.disabled = true;
        btn.style.opacity = '0.55';
        btn.style.cursor  = 'default';
      } else {
        btn.addEventListener('click', () => loadChapter(ch, btn));
      }

      nav.appendChild(btn);
    });
  });

  sidebar.appendChild(nav);
}

/* ── Chapter Loading ──────────────────────────────────────── */
let activeBtn = null;

async function loadChapter(ch, btn) {
  /* Update active state */
  if (activeBtn) activeBtn.classList.remove('active');
  activeBtn = btn;
  btn.classList.add('active');

  /* Show loading */
  welcomeSection.hidden = true;
  chapterArticle.hidden = true;
  errorEl.hidden        = true;
  loadingEl.hidden      = false;

  try {
    const res = await fetch(`content/${ch.file}`);
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
    const md  = await res.text();
    chapterArticle.innerHTML = marked.parse(md);
    loadingEl.hidden      = true;
    chapterArticle.hidden = false;
    chapterArticle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.title = `Ch ${ch.num}: ${ch.title} — Clinical Pharmacology for Nurses`;
  } catch (err) {
    console.error(`[pharmacology/app.js] Failed to load ${ch.file}:`, err);
    loadingEl.hidden = true;
    errorEl.textContent = `Could not load "${ch.file}".\n\nTip: serve from a local web server (python3 -m http.server 8080) or GitHub Pages.\n\nTechnical detail: ${err.message}`;
    errorEl.hidden = false;
  }
}

/* ── Home link ────────────────────────────────────────────── */
homeLink.addEventListener('click', e => {
  e.preventDefault();
  if (activeBtn) { activeBtn.classList.remove('active'); activeBtn = null; }
  chapterArticle.hidden = true;
  errorEl.hidden        = true;
  loadingEl.hidden      = true;
  welcomeSection.hidden = false;
  document.title = 'Clinical Pharmacology for Nurses';
});

/* ── Init ─────────────────────────────────────────────────── */
buildNav();
