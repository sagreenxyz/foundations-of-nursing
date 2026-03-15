/**
 * Foundations of Nursing — Web Application
 * Sprint: 2026-03-15-2140
 *
 * Renders chapter markdown files from content/ directory.
 * Includes a self-contained minimal Markdown→HTML renderer
 * so the app works without any CDN or external dependencies.
 */

/* ============================================================
   MINIMAL MARKDOWN RENDERER
   Supports: headings, bold, italic, tables, blockquotes,
   ordered/unordered lists, inline code, horizontal rules,
   paragraphs. Sufficient for academic textbook chapters.
   ============================================================ */
const md = (() => {
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function parseInline(text) {
    // Bold + italic
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.+?)_/g, '<em>$1</em>');
    // Inline code
    text = text.replace(/`([^`]+)`/g, (_, code) => '<code>' + escapeHtml(code) + '</code>');
    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    return text;
  }

  function parseTable(lines) {
    // lines[0] = header row, lines[1] = separator, lines[2+] = data rows
    const headerCells = lines[0].split('|').map(c => c.trim()).filter(c => c !== '');
    const dataRows = lines.slice(2).map(l => l.split('|').map(c => c.trim()).filter(c => c !== ''));

    let html = '<table>\n<thead>\n<tr>\n';
    headerCells.forEach(h => { html += `<th>${parseInline(h)}</th>\n`; });
    html += '</tr>\n</thead>\n<tbody>\n';
    dataRows.forEach(row => {
      html += '<tr>\n';
      row.forEach(cell => { html += `<td>${parseInline(cell)}</td>\n`; });
      html += '</tr>\n';
    });
    html += '</tbody>\n</table>\n';
    return html;
  }

  function render(markdown) {
    const rawLines = markdown.split('\n');
    let html = '';
    let i = 0;

    while (i < rawLines.length) {
      const line = rawLines[i];

      // Headings
      const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = parseInline(headingMatch[2].trim());
        const id = headingMatch[2].trim().toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
        html += `<h${level} id="${id}">${text}</h${level}>\n`;
        i++;
        continue;
      }

      // Horizontal rule
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
        html += '<hr />\n';
        i++;
        continue;
      }

      // Blockquote
      if (line.startsWith('>')) {
        let bqLines = [];
        while (i < rawLines.length && rawLines[i].startsWith('>')) {
          bqLines.push(rawLines[i].replace(/^>\s?/, ''));
          i++;
        }
        html += '<blockquote>\n' + render(bqLines.join('\n')) + '</blockquote>\n';
        continue;
      }

      // Unordered list
      if (/^[\*\-\+]\s/.test(line)) {
        html += '<ul>\n';
        while (i < rawLines.length && /^[\*\-\+]\s/.test(rawLines[i])) {
          const itemContent = rawLines[i].replace(/^[\*\-\+]\s/, '');
          html += `<li>${parseInline(itemContent)}</li>\n`;
          i++;
        }
        html += '</ul>\n';
        continue;
      }

      // Ordered list
      if (/^\d+\.\s/.test(line)) {
        html += '<ol>\n';
        while (i < rawLines.length && /^\d+\.\s/.test(rawLines[i])) {
          const itemContent = rawLines[i].replace(/^\d+\.\s/, '');
          html += `<li>${parseInline(itemContent)}</li>\n`;
          i++;
        }
        html += '</ol>\n';
        continue;
      }

      // Table detection (line with | separator)
      if (line.includes('|') && i + 1 < rawLines.length && /^\s*\|?[\s\-:]+\|/.test(rawLines[i + 1])) {
        let tableLines = [];
        while (i < rawLines.length && rawLines[i].trim() !== '' && rawLines[i].includes('|')) {
          tableLines.push(rawLines[i]);
          i++;
        }
        if (tableLines.length >= 2) {
          html += parseTable(tableLines);
        }
        continue;
      }

      // Empty line — paragraph separator
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Paragraph: collect consecutive non-special lines
      let paraLines = [];
      while (
        i < rawLines.length &&
        rawLines[i].trim() !== '' &&
        !rawLines[i].startsWith('#') &&
        !rawLines[i].startsWith('>') &&
        !/^[\*\-\+]\s/.test(rawLines[i]) &&
        !/^\d+\.\s/.test(rawLines[i]) &&
        !/^(-{3,}|\*{3,}|_{3,})$/.test(rawLines[i].trim())
      ) {
        paraLines.push(rawLines[i]);
        i++;
      }
      if (paraLines.length > 0) {
        html += `<p>${parseInline(paraLines.join(' '))}</p>\n`;
      }
    }

    return html;
  }

  return { render };
})();

/* ============================================================
   CHAPTER DATA
   Maps chapter IDs to their content/ markdown file paths.
   ============================================================ */
const CHAPTER_MAP = {
  'chapter-01': '../content/chapter-01.md',
  'chapter-02': '../content/chapter-02.md',
  'chapter-03': '../content/chapter-03.md',
  'chapter-04': '../content/chapter-04.md',
  'chapter-05': '../content/chapter-05.md',
  'chapter-06': '../content/chapter-06.md',
  'chapter-07': '../content/chapter-07.md',
  'chapter-08': '../content/chapter-08.md',
  'chapter-09': '../content/chapter-09.md',
  'chapter-10': '../content/chapter-10.md',
};

/* ============================================================
   HOME PAGE
   ============================================================ */
function renderHome() {
  return `
<div class="home-hero">
  <h1>Foundations of Nursing</h1>
  <p class="home-subtitle">A Comprehensive Pre-Licensure Textbook</p>
  <dl class="home-meta">
    <dt>Audience</dt><dd>Pre-licensure nursing students (ADN/BSN) — first-year, foundational level</dd>
    <dt>Tone</dt><dd>Formal/academic</dd>
    <dt>Citation Style</dt><dd>APA 7th edition</dd>
    <dt>Format</dt><dd>Markdown source, HTML/web output</dd>
    <dt>Target Length</dt><dd>900+ pages across 45 chapters</dd>
  </dl>
</div>

<h2>About This Textbook</h2>
<p>
  <em>Foundations of Nursing</em> is a comprehensive, open-access pre-licensure nursing textbook
  designed for first-year ADN and BSN students. It integrates evidence-based practice, clinical
  judgment, NCLEX-RN alignment, and Next Generation NCLEX (NGN) item types throughout every chapter.
</p>
<p>
  Use the navigation sidebar to browse available chapters. Each chapter includes learning objectives,
  key terms, full academic content, case studies, NCLEX-style review questions, a summary, and
  APA 7th-edition references.
</p>

<h2>Chapter Status</h2>
<table>
  <thead><tr><th>Chapter</th><th>Title</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>History and Evolution of Nursing</td><td>Coming Soon</td></tr>
    <tr><td>2</td><td>Legal, Ethical, and Professional Standards</td><td>Coming Soon</td></tr>
    <tr><td>3</td><td>Patient Rights, Advocacy, and Informed Consent</td><td>Coming Soon</td></tr>
    <tr><td>4</td><td>Therapeutic Communication</td><td><strong>Draft Available</strong></td></tr>
    <tr><td>5–45</td><td>Additional Chapters</td><td>Coming Soon</td></tr>
  </tbody>
</table>
`;
}

/* ============================================================
   COMING SOON PAGE
   ============================================================ */
function renderComingSoon(chapterKey) {
  const num = chapterKey.replace('chapter-', '');
  return `
<h1>Chapter ${num}</h1>
<p class="loading-msg">This chapter is planned but has not yet been drafted. Check back in a future sprint.</p>
`;
}

/* ============================================================
   CONTENT LOADER
   ============================================================ */
async function loadChapter(chapterKey) {
  const display = document.getElementById('content-display');
  display.innerHTML = '<p class="loading-msg">Loading…</p>';

  // Home page
  if (chapterKey === 'home' || !chapterKey) {
    display.innerHTML = renderHome();
    return;
  }

  const path = CHAPTER_MAP[chapterKey];
  if (!path) {
    display.innerHTML = renderComingSoon(chapterKey);
    return;
  }

  try {
    const response = await fetch(path);
    if (!response.ok) {
      // File not yet created — show coming soon
      display.innerHTML = renderComingSoon(chapterKey);
      return;
    }
    const text = await response.text();
    display.innerHTML = md.render(text);
    display.scrollTop = 0;
    window.scrollTo(0, 0);
  } catch (err) {
    display.innerHTML = renderComingSoon(chapterKey);
  }
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function setActiveLink(chapterKey) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.chapter === chapterKey);
  });
}

function navigate(chapterKey) {
  setActiveLink(chapterKey);
  loadChapter(chapterKey);
  // Update URL hash without page reload
  history.replaceState(null, '', '#' + chapterKey);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Wire up nav links
  document.querySelectorAll('.nav-link[data-chapter]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigate(link.dataset.chapter);
    });
  });

  // Determine initial chapter from URL hash, or default to home page
  const hash = window.location.hash.replace('#', '');
  const initial = hash || 'home';
  navigate(initial);
});
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
      { num: 2,  title: 'Legal, Ethical, and Professional Standards',         file: 'chapter-02.md', status: 'soon'    },
      { num: 3,  title: 'Patient Rights, Advocacy, and Informed Consent',     file: 'chapter-03.md', status: 'soon'    },
      { num: 4,  title: 'Therapeutic Communication',                          file: 'chapter-04.md', status: 'soon'    },
      { num: 5,  title: 'Cultural Humility, Health Literacy, and Inclusive Care', file: 'chapter-05.md', status: 'soon' },
      { num: 6,  title: 'End-of-Life Communication and Palliative Care',      file: 'chapter-06.md', status: 'soon'    },
    ],
  },
  {
    label: 'Unit 2: The Clinical Mindset',
    chapters: [
      { num: 7,  title: 'Evidence-Based Practice and Quality Improvement',    file: 'chapter-07.md', status: 'soon'    },
      { num: 8,  title: 'The Nursing Process (ADPIE)',                        file: 'chapter-08.md', status: 'soon'    },
      { num: 9,  title: 'Clinical Judgment and the NCSBN CJMM',              file: 'chapter-09.md', status: 'soon'    },
    ],
  },
  {
    label: 'Unit 3: Health, Wellness, and Human Development',
    chapters: [
      { num: 10, title: 'Health, Wellness, and Illness',                      file: 'chapter-10.md', status: 'soon'    },
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
