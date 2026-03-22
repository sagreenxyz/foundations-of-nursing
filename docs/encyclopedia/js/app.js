/* ============================================================
   NurseMastery Encyclopedia — app.js  v1.0
   ============================================================
   A wiki-style SPA for nursing knowledge articles.
   Articles are stored as Markdown files in articles/.
   Internal wiki links use the format:  [Link Text](#slug)
   Hash routing: #article-<slug>
   ============================================================ */

'use strict';

/* ── Article Registry ─────────────────────────────────────── */
const CATEGORIES = [
  {
    label: 'Psychology & Cognition',
    articles: [
      {
        slug:    'theory-of-mind',
        title:   'Theory of Mind',
        file:    'theory-of-mind.md',
        summary: 'The cognitive ability to attribute mental states to self and others; foundational to therapeutic communication and empathetic patient care.',
        status:  'available',
        related: ['empathy-in-nursing', 'therapeutic-communication', 'mental-health-assessment'],
      },
      {
        slug:    'empathy-in-nursing',
        title:   'Empathy in Nursing',
        file:    'empathy-in-nursing.md',
        summary: 'Theoretical models of empathy, clinical evidence, and practical applications in nurse–patient relationships.',
        status:  'soon',
        related: ['theory-of-mind', 'therapeutic-communication'],
      },
      {
        slug:    'grief-and-loss',
        title:   'Grief and Loss',
        file:    'grief-and-loss.md',
        summary: "Kübler-Ross stages, contemporary grief models, and the nurse's role in supporting bereaved patients and families.",
        status:  'soon',
        related: ['empathy-in-nursing', 'mental-health-assessment'],
      },
    ],
  },
  {
    label: 'Communication & Therapeutic Relationships',
    articles: [
      {
        slug:    'therapeutic-communication',
        title:   'Therapeutic Communication',
        file:    'therapeutic-communication.md',
        summary: 'Evidence-based verbal and nonverbal techniques for establishing therapeutic nurse–patient relationships.',
        status:  'soon',
        related: ['theory-of-mind', 'empathy-in-nursing'],
      },
      {
        slug:    'motivational-interviewing',
        title:   'Motivational Interviewing',
        file:    'motivational-interviewing.md',
        summary: 'OARS techniques and the spirit of MI applied to patient behaviour change in clinical nursing practice.',
        status:  'soon',
        related: ['therapeutic-communication'],
      },
    ],
  },
  {
    label: 'Mental Health & Psychiatric Nursing',
    articles: [
      {
        slug:    'mental-health-assessment',
        title:   'Mental Health Assessment',
        file:    'mental-health-assessment.md',
        summary: 'Systematic psychiatric nursing assessment including MSE, risk assessment, and screening tools.',
        status:  'soon',
        related: ['theory-of-mind', 'therapeutic-communication'],
      },
      {
        slug:    'autism-spectrum-disorder',
        title:   'Autism Spectrum Disorder',
        file:    'autism-spectrum-disorder.md',
        summary: 'Pathophysiology, presentation, and nursing care adaptations for patients with ASD across the lifespan.',
        status:  'soon',
        related: ['theory-of-mind', 'mental-health-assessment'],
      },
      {
        slug:    'schizophrenia',
        title:   'Schizophrenia Spectrum Disorders',
        file:    'schizophrenia.md',
        summary: 'Positive and negative symptoms, neurobiology, antipsychotic pharmacology, and nursing care planning.',
        status:  'soon',
        related: ['theory-of-mind', 'mental-health-assessment'],
      },
    ],
  },
  {
    label: 'Neuroscience & Neurological Nursing',
    articles: [
      {
        slug:    'neuroscience-for-nurses',
        title:   'Neuroscience for Nurses',
        file:    'neuroscience-for-nurses.md',
        summary: 'Essential neuroanatomy, neurophysiology, and neurotransmitter systems relevant to clinical nursing practice.',
        status:  'soon',
        related: ['theory-of-mind', 'schizophrenia'],
      },
      {
        slug:    'dementia-and-cognitive-decline',
        title:   'Dementia and Cognitive Decline',
        file:    'dementia-and-cognitive-decline.md',
        summary: "Alzheimer's disease, vascular dementia, Lewy body dementia: pathophysiology, staging, and nursing management.",
        status:  'soon',
        related: ['theory-of-mind', 'mental-health-assessment', 'neuroscience-for-nurses'],
      },
    ],
  },
  {
    label: 'Patient-Centred Care',
    articles: [
      {
        slug:    'patient-centred-care',
        title:   'Patient-Centred Care',
        file:    'patient-centred-care.md',
        summary: 'Principles, evidence base, and implementation strategies for delivering holistic, individualized nursing care.',
        status:  'soon',
        related: ['theory-of-mind', 'therapeutic-communication', 'empathy-in-nursing'],
      },
      {
        slug:    'cultural-competence',
        title:   'Cultural Competence in Nursing',
        file:    'cultural-competence.md',
        summary: "Campinha-Bacote's model, implicit bias, and evidence-based strategies for culturally responsive care.",
        status:  'soon',
        related: ['patient-centred-care', 'therapeutic-communication'],
      },
    ],
  },
];

/* ── Build slug → article map ─────────────────────────────── */
const ARTICLE_MAP = {};
CATEGORIES.forEach(cat => {
  cat.articles.forEach(art => {
    ARTICLE_MAP[art.slug] = art;
  });
});

/* ── DOM References ───────────────────────────────────────── */
const sidebar     = document.getElementById('sidebar');
const mainEl      = document.getElementById('main');
const welcomeEl   = document.getElementById('welcome');
const articleEl   = document.getElementById('article-content');
const loadingEl   = document.getElementById('loading');
const errorEl     = document.getElementById('error-msg');
const indexEl     = document.getElementById('article-index');

/* ── Build Sidebar Navigation ─────────────────────────────── */
function buildNav() {
  // Search box
  const searchWrap = document.createElement('div');
  searchWrap.className = 'sidebar-search';
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = 'Search articles…';
  searchInput.setAttribute('aria-label', 'Search articles');
  searchWrap.appendChild(searchInput);
  sidebar.appendChild(searchWrap);

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Encyclopedia articles');

  CATEGORIES.forEach(cat => {
    const catLabel = document.createElement('div');
    catLabel.className = 'nav-category-label';
    catLabel.textContent = cat.label;
    nav.appendChild(catLabel);

    cat.articles.forEach(art => {
      const btn = document.createElement('button');
      btn.className = 'nav-article';
      btn.dataset.slug = art.slug;

      const badgeCls   = art.status === 'available' ? 'badge-available' : 'badge-soon';
      const badgeLabel = art.status === 'available' ? 'Available'        : 'Soon';

      btn.innerHTML =
        `<span class="art-title">${art.title}</span>` +
        `<span class="nav-badge ${badgeCls}">${badgeLabel}</span>`;

      btn.addEventListener('click', () => loadArticle(art));
      nav.appendChild(btn);
    });
  });

  sidebar.appendChild(nav);

  // Wire up search
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    nav.querySelectorAll('.nav-article').forEach(btn => {
      const title = btn.querySelector('.art-title').textContent.toLowerCase();
      btn.style.display = (!q || title.includes(q)) ? '' : 'none';
    });
    nav.querySelectorAll('.nav-category-label').forEach(lbl => {
      // Show category label if any sibling article is visible
      let next = lbl.nextElementSibling;
      let anyVisible = false;
      while (next && next.classList.contains('nav-article')) {
        if (next.style.display !== 'none') anyVisible = true;
        next = next.nextElementSibling;
      }
      lbl.style.display = anyVisible ? '' : 'none';
    });
  });
}

/* ── Build Article Index on Welcome Page ─────────────────── */
function buildIndex() {
  CATEGORIES.forEach(cat => {
    const section = document.createElement('div');
    section.className = 'index-category';

    const title = document.createElement('div');
    title.className = 'index-category-title';
    title.textContent = cat.label;
    section.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'index-article-list';

    cat.articles.forEach(art => {
      const li  = document.createElement('li');
      li.className = 'index-article-item';

      const btn = document.createElement('button');
      const badgeCls   = art.status === 'available' ? 'badge-available' : 'badge-soon';
      const badgeLabel = art.status === 'available' ? '✓ Available'      : 'Coming Soon';
      const isSoon = art.status !== 'available';

      if (isSoon) btn.className = 'soon-btn';

      btn.innerHTML =
        `${art.title}` +
        `<span class="index-article-badge ${badgeCls}">${badgeLabel}</span>`;
      btn.title = art.summary;

      if (!isSoon) {
        btn.addEventListener('click', () => loadArticle(art));
      }

      li.appendChild(btn);
      list.appendChild(li);
    });

    section.appendChild(list);
    indexEl.appendChild(section);
  });
}

/* ── State Helpers ────────────────────────────────────────── */
function setActive(slugOrNull) {
  document.querySelectorAll('.nav-article').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.slug === slugOrNull);
  });
}

function showWelcome() {
  welcomeEl.hidden  = false;
  articleEl.hidden  = true;
  loadingEl.hidden  = true;
  errorEl.hidden    = true;
  setActive(null);
  document.title = 'NurseMastery Encyclopedia';
  history.replaceState(null, '', '#');
}

function showLoading() {
  welcomeEl.hidden  = true;
  articleEl.hidden  = true;
  loadingEl.hidden  = false;
  errorEl.hidden    = true;
}

function showError(msg) {
  errorEl.textContent = msg;
  welcomeEl.hidden    = true;
  articleEl.hidden    = true;
  loadingEl.hidden    = true;
  errorEl.hidden      = false;
}

function showArticle(html, art) {
  // Inject back-nav above rendered content
  const backDiv = document.createElement('div');
  backDiv.className = 'article-back';
  const backBtn = document.createElement('button');
  backBtn.textContent = '← Encyclopedia index';
  backBtn.addEventListener('click', showWelcome);
  backDiv.appendChild(backBtn);

  articleEl.innerHTML = '';
  articleEl.appendChild(backDiv);

  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = html;

  // Convert internal wiki links: href="#slug" → click handler
  contentDiv.querySelectorAll('a[href^="#"]').forEach(a => {
    const slug = a.getAttribute('href').slice(1); // strip leading #
    if (ARTICLE_MAP[slug]) {
      a.addEventListener('click', e => {
        e.preventDefault();
        loadArticle(ARTICLE_MAP[slug]);
      });
    }
  });

  articleEl.appendChild(contentDiv);

  // Inject "See also" box if article has related articles
  if (art.related && art.related.length > 0) {
    const seeAlso = document.createElement('div');
    seeAlso.className = 'see-also-box';
    const heading = document.createElement('strong');
    heading.textContent = 'See Also';
    seeAlso.appendChild(heading);

    const relList = document.createElement('ul');
    relList.style.paddingLeft = '1.25rem';
    relList.style.marginTop   = '0.35rem';

    art.related.forEach(slug => {
      const rel = ARTICLE_MAP[slug];
      if (!rel) return;
      const li  = document.createElement('li');
      const btn = document.createElement('button');
      btn.style.cssText = 'background:none;border:none;padding:0;cursor:pointer;color:var(--color-link);text-decoration:underline;font-size:0.88rem;font-family:var(--font-ui);';
      btn.textContent = rel.title;
      if (rel.status === 'available') {
        btn.addEventListener('click', () => loadArticle(rel));
      } else {
        btn.disabled = true;
        btn.style.color = 'var(--color-muted)';
        btn.style.cursor = 'default';
        btn.textContent += ' (coming soon)';
      }
      li.appendChild(btn);
      relList.appendChild(li);
    });

    seeAlso.appendChild(relList);
    articleEl.appendChild(seeAlso);
  }

  welcomeEl.hidden  = true;
  articleEl.hidden  = false;
  loadingEl.hidden  = true;
  errorEl.hidden    = true;
  mainEl.scrollTop  = 0;
  window.scrollTo(0, 0);
}

/* ── Resolve Article Path ─────────────────────────────────── */
function articlePath(filename) {
  const scripts = document.querySelectorAll('script[src]');
  for (const s of scripts) {
    const src = s.getAttribute('src');
    if (src && src.includes('app.js')) {
      const jsDir = s.src.replace(/js\/app\.js.*$/, '');
      return jsDir + 'articles/' + filename;
    }
  }
  return 'articles/' + filename;
}

/* ── Load and Render Article ──────────────────────────────── */
async function loadArticle(art) {
  if (art.status === 'soon') {
    showArticle(
      `<h1>${art.title}</h1>` +
      `<p style="font-style:italic;color:var(--color-muted);">` +
      `This article is coming soon. Check back in a future sprint.</p>` +
      `<p>${art.summary}</p>`,
      art
    );
    setActive(art.slug);
    document.title = `${art.title} — NurseMastery Encyclopedia`;
    history.replaceState(null, '', `#article-${art.slug}`);
    return;
  }

  showLoading();
  setActive(art.slug);

  try {
    const url  = articlePath(art.file);
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Could not load ${art.file} (HTTP ${resp.status})`);
    }
    const md   = await resp.text();
    const html = marked.parse(md);
    showArticle(html, art);
    document.title = `${art.title} — NurseMastery Encyclopedia`;
    history.replaceState(null, '', `#article-${art.slug}`);
  } catch (err) {
    showError(
      `Failed to load article: ${art.title}\n\n` +
      `${err.message}\n\n` +
      `If viewing locally, run:\n  python3 -m http.server 8080\n` +
      `then open http://localhost:8080/docs/encyclopedia/`
    );
  }
}

/* ── Hash-Based Routing ───────────────────────────────────── */
function handleHash() {
  const hash = window.location.hash;
  if (hash.startsWith('#article-')) {
    const slug = hash.slice('#article-'.length);
    const art  = ARTICLE_MAP[slug];
    if (art) {
      loadArticle(art);
      return;
    }
  }
  showWelcome();
}

/* ── Initialise ───────────────────────────────────────────── */
function init() {
  buildNav();
  buildIndex();

  document.getElementById('home-link').addEventListener('click', e => {
    e.preventDefault();
    showWelcome();
  });

  window.addEventListener('popstate', handleHash);
  handleHash();
}

document.addEventListener('DOMContentLoaded', init);
