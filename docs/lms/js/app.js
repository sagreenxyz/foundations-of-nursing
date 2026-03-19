/* ============================================================
   NurseMastery LMS — app.js
   Foundations of Nursing  ·  Sprint 2026-03-19
   ============================================================
   Architecture:
     · Hash-based SPA router  (#/ #/topic/:id #/quiz/:id
       #/journey #/journey/:id #/distractors #/achievements)
     · localStorage persistence for all progress
     · XP / level / streak gamification
     · Achievement engine
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════════════ */
const STORE_KEY = 'nm_lms_v1';

function defaultState() {
  return {
    totalXP: 0,
    level: 1,
    levelXP: 0,          // XP within current level
    dayStreak: 0,
    lastStudyDate: null,
    bestStreak: 0,        // longest in-session correct answer streak
    currentStreak: 0,     // current correct streak (resets on wrong)
    totalAnswered: 0,
    totalCorrect: 0,
    sataCorrect: 0,
    topicsCompleted: 0,
    journeysCompleted: 0,
    distractorsSolved: 0,
    unlockedAchievements: [],
    // per-topic question progress: { topicId: { qId: 'correct'|'wrong' } }
    questionProgress: {},
    // per-journey scene answers: { journeyId: { sceneId: correct|false } }
    journeyProgress: {},
    // distractor challenges solved ids
    distractorProgress: [],
  };
}

let STATE = defaultState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) STATE = Object.assign(defaultState(), JSON.parse(raw));
  } catch (_) { /* ignore */ }
}

function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(STATE)); } catch (_) {}
}

/* ══════════════════════════════════════════════════════════════
   XP & LEVELLING
══════════════════════════════════════════════════════════════ */
function awardXP(amount, label) {
  if (amount <= 0) return;
  STATE.totalXP += amount;
  STATE.levelXP += amount;
  while (STATE.levelXP >= XP_PER_LEVEL) {
    STATE.levelXP -= XP_PER_LEVEL;
    STATE.level += 1;
  }
  saveState();
  updateHUD();
  if (label) showToast(`+${amount} XP — ${label}`);
}

function updateHUD() {
  const pct = Math.min(100, Math.round((STATE.levelXP / XP_PER_LEVEL) * 100));
  const fill = document.getElementById('xp-bar-fill');
  const lvl  = document.getElementById('xp-label');
  const pts  = document.getElementById('xp-pts');
  const sc   = document.getElementById('streak-count');
  if (fill) fill.style.width = pct + '%';
  if (lvl)  lvl.textContent  = 'Lv ' + STATE.level;
  if (pts)  pts.textContent  = STATE.totalXP + ' XP';
  if (sc)   sc.textContent   = STATE.dayStreak;
}

/* ══════════════════════════════════════════════════════════════
   DAY STREAK
══════════════════════════════════════════════════════════════ */
function touchStreak() {
  const today = new Date().toDateString();
  if (STATE.lastStudyDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  STATE.dayStreak = STATE.lastStudyDate === yesterday ? STATE.dayStreak + 1 : 1;
  STATE.lastStudyDate = today;
  saveState();
  updateHUD();
}

/* ══════════════════════════════════════════════════════════════
   ACHIEVEMENT ENGINE
══════════════════════════════════════════════════════════════ */
function checkAchievements() {
  ACHIEVEMENTS.forEach(ach => {
    if (STATE.unlockedAchievements.includes(ach.id)) return;
    if (ach.condition(STATE)) {
      STATE.unlockedAchievements.push(ach.id);
      saveState();
      if (ach.xp) awardXP(ach.xp, ach.name);
      showAchievementPopup(ach);
    }
  });
}

function showAchievementPopup(ach) {
  const popup = document.getElementById('achievement-popup');
  const icon  = document.getElementById('ap-icon');
  const name  = document.getElementById('ap-name');
  if (!popup) return;
  icon.textContent = ach.icon;
  name.textContent = ach.name;
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 4000);
}

/* ══════════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════════ */
let toastTimer = null;
function showToast(msg, duration = 2800) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}

/* ══════════════════════════════════════════════════════════════
   ROUTER
══════════════════════════════════════════════════════════════ */
function getRoute() {
  const hash = window.location.hash || '#/';
  return hash.replace(/^#/, '') || '/';
}

function navigate(path) {
  window.location.hash = '#' + path;
}

function router() {
  const path = getRoute();
  updateNavActive(path);

  // close sidebar on mobile after nav
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }

  const container = document.getElementById('view-container');
  container.innerHTML = '';

  if (path === '/') {
    renderDashboard(container);
  } else if (path === '/journey') {
    renderJourneyList(container);
  } else if (path.startsWith('/journey/')) {
    const id = path.replace('/journey/', '');
    const j  = JOURNEYS.find(x => x.id === id);
    if (j) renderJourneyScene(container, j, 0);
    else   renderNotFound(container);
  } else if (path === '/distractors') {
    renderDistractors(container);
  } else if (path === '/achievements') {
    renderAchievements(container);
  } else if (path.startsWith('/topic/') && !path.includes('/quiz')) {
    const id = path.replace('/topic/', '');
    const t  = TOPICS.find(x => x.id === id);
    if (t) renderTopic(container, t);
    else   renderNotFound(container);
  } else if (path.startsWith('/quiz/')) {
    const id = path.replace('/quiz/', '').split('?')[0];
    const t  = TOPICS.find(x => x.id === id);
    if (t) renderQuiz(container, t);
    else   renderNotFound(container);
  } else {
    renderDashboard(container);
  }
}

function updateNavActive(path) {
  document.querySelectorAll('.nav-link').forEach(a => {
    const view = a.getAttribute('data-view');
    const href = a.getAttribute('href') || '';
    const active =
      (path === '/' && href === '#/') ||
      (path.startsWith('/journey') && href === '#/journey') ||
      (path === '/distractors'    && href === '#/distractors') ||
      (path === '/achievements'   && href === '#/achievements') ||
      (view && path === '/topic/' + view) ||
      (view && path === '/quiz/'  + view);
    a.classList.toggle('active', active);
  });
}

/* ══════════════════════════════════════════════════════════════
   SIDEBAR — topic nav
══════════════════════════════════════════════════════════════ */
function buildTopicNav() {
  const ul = document.getElementById('topic-nav');
  if (!ul) return;
  TOPICS.forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a class="nav-link" href="#/topic/${t.id}" data-view="${t.id}">
        <span class="nav-topic-dot" style="background:${t.color}"></span>
        <span class="nav-icon">${t.icon}</span>
        ${t.name}
      </a>`;
    ul.appendChild(li);
  });
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
function topicProgress(topicId) {
  const qs   = QUESTIONS[topicId] || [];
  const prog = STATE.questionProgress[topicId] || {};
  const done = Object.keys(prog).length;
  const corr = Object.values(prog).filter(v => v === 'correct').length;
  return { total: qs.length, done, corr, pct: qs.length ? Math.round((done / qs.length) * 100) : 0 };
}

function isTopicComplete(topicId) {
  const { total, done } = topicProgress(topicId);
  return total > 0 && done >= total;
}

function recomputeTopicsCompleted() {
  STATE.topicsCompleted = TOPICS.filter(t => isTopicComplete(t.id)).length;
}

function progressBar(pct, color) {
  return `<div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${color || 'var(--primary)'}"></div></div>`;
}

function diffClass(d) {
  return { foundation: 'diff-foundation', proficient: 'diff-proficient', advanced: 'diff-advanced' }[d] || '';
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD VIEW
══════════════════════════════════════════════════════════════ */
function renderDashboard(container) {
  const totalQs    = Object.values(QUESTIONS).flat().length;
  const doneQs     = Object.values(STATE.questionProgress).flatMap(Object.values).length;
  const xpPct      = Math.min(100, Math.round((STATE.levelXP / XP_PER_LEVEL) * 100));

  const recentAch  = ACHIEVEMENTS.filter(a => STATE.unlockedAchievements.includes(a.id)).slice(-4);
  const lockedAch  = ACHIEVEMENTS.filter(a => !STATE.unlockedAchievements.includes(a.id)).slice(0, 4 - recentAch.length);

  container.innerHTML = `
    <div class="fade-in">
      <div class="dashboard-hero">
        <div class="hero-greeting">Welcome to NurseMastery 🏥</div>
        <div class="hero-sub">Master Foundations of Nursing with adaptive NCLEX-style practice.</div>
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-val">${STATE.totalXP}</div>
            <div class="hero-stat-label">Total XP</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-val">Lv ${STATE.level}</div>
            <div class="hero-stat-label">Level</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-val">${doneQs}/${totalQs}</div>
            <div class="hero-stat-label">Questions</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-val">${STATE.dayStreak}</div>
            <div class="hero-stat-label">Day Streak</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-val">${STATE.unlockedAchievements.length}/${ACHIEVEMENTS.length}</div>
            <div class="hero-stat-label">Achievements</div>
          </div>
        </div>
      </div>

      <h2 class="section-title">Topics</h2>
      <p class="section-subtitle">Pick a topic to study — every question earns XP and tracks your progress.</p>

      <div class="topic-grid">
        ${TOPICS.map(t => {
          const { total, done, corr, pct } = topicProgress(t.id);
          return `
            <a class="topic-card" href="#/topic/${t.id}" style="border-left-color:${t.color}">
              <div class="topic-card-header">
                <span class="topic-card-icon">${t.icon}</span>
                <span class="topic-card-name">${t.name}</span>
              </div>
              <div class="topic-card-progress" style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span>${done}/${total} questions done</span>
                <span style="color:${t.color};font-weight:700">${pct}%</span>
              </div>
              ${progressBar(pct, t.color)}
              ${done > 0 ? `<div style="font-size:0.72rem;color:var(--text-muted);margin-top:6px">${corr} correct (${total > 0 ? Math.round(corr/total*100) : 0}%)</div>` : ''}
            </a>`;
        }).join('')}
      </div>

      ${recentAch.length + lockedAch.length > 0 ? `
      <h2 class="section-title" style="margin-top:1.5rem">Achievements</h2>
      <div class="achievements-strip">
        ${recentAch.map(a => `
          <div class="achievement-chip">
            <span class="achievement-chip-icon">${a.icon}</span> ${a.name}
          </div>`).join('')}
        ${lockedAch.map(a => `
          <div class="achievement-chip locked">
            <span class="achievement-chip-icon">${a.icon}</span> ${a.name}
          </div>`).join('')}
      </div>
      <a href="#/achievements" style="font-size:0.82rem;color:var(--primary)">View all achievements →</a>
      ` : ''}
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════════
   TOPIC VIEW
══════════════════════════════════════════════════════════════ */
function renderTopic(container, topic) {
  const { total, done, pct } = topicProgress(topic.id);
  const qs = QUESTIONS[topic.id] || [];

  container.innerHTML = `
    <div class="fade-in">
      <div class="topic-header" style="background:linear-gradient(135deg,${topic.color}dd,${topic.color}88)">
        <div style="font-size:0.8rem;opacity:0.8;margin-bottom:0.25rem">
          <a href="#/" style="color:rgba(255,255,255,0.7);text-decoration:none">Dashboard</a> › ${topic.icon} ${topic.name}
        </div>
        <h1>${topic.icon} ${topic.name}</h1>
        <p>${topic.desc}</p>
        <div style="margin-top:0.75rem;display:flex;align-items:center;gap:1rem">
          <div style="flex:1;max-width:200px">${progressBar(pct, '#fff')}</div>
          <span style="font-size:0.82rem;opacity:0.85">${done}/${total} answered</span>
          <a class="btn btn-sm" style="background:rgba(255,255,255,0.25);color:#fff;border:1px solid rgba(255,255,255,0.4);text-decoration:none" href="#/quiz/${topic.id}">
            ▶ Practice All (${total})
          </a>
        </div>
      </div>

      <div class="card" style="border-radius:0 0 var(--radius) var(--radius);margin-bottom:1.5rem">
        <h3 style="margin-bottom:1rem;font-size:1rem">Subtopics</h3>
        <ul class="subtopic-list">
          ${topic.subtopics.map((st, i) => {
            const stQs = qs.filter(q => q.subtopic === st.id);
            const stDone = stQs.filter(q => (STATE.questionProgress[topic.id] || {})[q.id]).length;
            return `
              <li class="subtopic-item" id="st-${i}">
                <div class="subtopic-header" onclick="toggleSubtopic('st-${i}')">
                  <div class="subtopic-num" style="background:${topic.color}">${i + 1}</div>
                  <span class="subtopic-title">${st.title}</span>
                  <span class="subtopic-status">${stDone}/${stQs.length}</span>
                  <span class="subtopic-chevron">▾</span>
                </div>
                <div class="subtopic-body">
                  <div class="subtopic-situation">${st.situation}</div>
                  <div class="subtopic-actions">
                    <a class="btn btn-sm btn-primary" href="#/quiz/${topic.id}?sub=${st.id}">Practice this subtopic</a>
                    <span style="font-size:0.8rem;color:var(--text-muted);align-self:center">${stQs.length} question${stQs.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </li>`;
          }).join('')}
        </ul>
      </div>

      <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
        <a class="btn btn-primary" href="#/quiz/${topic.id}">▶ Start Full Practice</a>
        <a class="btn btn-ghost" href="#/">← Dashboard</a>
      </div>
    </div>
  `;
}

window.toggleSubtopic = function(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
};

/* ══════════════════════════════════════════════════════════════
   QUIZ ENGINE
══════════════════════════════════════════════════════════════ */
function renderQuiz(container, topic) {
  const hash   = window.location.hash;
  const subId  = hash.includes('?sub=') ? hash.split('?sub=')[1] : null;
  const allQs  = QUESTIONS[topic.id] || [];
  const qs     = subId ? allQs.filter(q => q.subtopic === subId) : allQs;

  if (!qs.length) {
    container.innerHTML = `<div class="card"><p>No questions available yet for this topic.</p><a class="btn btn-ghost" href="#/topic/${topic.id}">← Back</a></div>`;
    return;
  }

  touchStreak();

  let idx  = 0;
  let sataSelected = new Set();
  let answered = false;
  let sessionCorrect = 0;
  let sessionAnswered = 0;
  let inSessionStreak = 0;

  function renderQ() {
    answered = false;
    sataSelected = new Set();
    const q = qs[idx];

    container.innerHTML = `
      <div class="quiz-wrap fade-in">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
          <a href="#/topic/${topic.id}" style="color:var(--text-muted);font-size:0.82rem;text-decoration:none">
            ← ${topic.icon} ${topic.name}
          </a>
        </div>
        <div class="quiz-progress-bar">
          <div style="flex:1">${progressBar(Math.round((idx / qs.length) * 100), topic.color)}</div>
          <span class="quiz-progress-text">${idx + 1} / ${qs.length}</span>
        </div>

        <div class="quiz-card">
          <div class="quiz-meta">
            <span class="diff-badge ${diffClass(q.difficulty)}">${q.difficulty}</span>
            <span class="quiz-type-label">${q.type === 'sata' ? 'Select All That Apply' : 'Best Answer'}</span>
          </div>

          ${q.type === 'sata' ? '<div class="sata-hint">ℹ️ Select ALL answers that apply — partial credit is not given.</div>' : ''}

          <div class="quiz-stem">${q.stem}</div>

          <div class="quiz-options" id="quiz-options">
            ${q.options.map((opt, i) => `
              <button class="quiz-option" id="opt-${i}" onclick="selectOption(${i})">
                <span class="option-letter">${String.fromCharCode(65 + i)}</span>
                <span>${opt}</span>
              </button>`).join('')}
          </div>

          <div class="rationale-box" id="rationale-box"></div>

          <div class="quiz-actions" id="quiz-actions">
            ${q.type === 'sata'
              ? `<button class="btn btn-primary" id="submit-btn" onclick="submitSATA()">Submit Answer</button>`
              : `<span style="font-size:0.82rem;color:var(--text-muted)">Select an answer to continue</span>`
            }
          </div>
        </div>
      </div>
    `;

    // expose helpers to onclick scope
    window.selectOption  = (i) => handleSelect(i, q);
    window.submitSATA    = ()  => handleSATA(q);
    window.nextQuestion  = ()  => { idx++; if (idx < qs.length) renderQ(); else renderResults(); };
  }

  function handleSelect(i, q) {
    if (q.type === 'sata') {
      // toggle for SATA
      const btn = document.getElementById('opt-' + i);
      if (sataSelected.has(i)) { sataSelected.delete(i); btn.classList.remove('selected'); }
      else                     { sataSelected.add(i);    btn.classList.add('selected'); }
      return;
    }
    if (answered) return;
    answered = true;

    const isCorrect = (i === q.correct);
    revealMCQ(i, q.correct, isCorrect, q);
    recordAnswer(topic.id, q, isCorrect);
    showRationale(q, isCorrect);
    appendNext();

    if (isCorrect) sessionCorrect++;
    sessionAnswered++;
  }

  function handleSATA(q) {
    if (answered) return;
    answered = true;

    const selected  = Array.from(sataSelected).sort();
    const expected  = [...q.correct].sort();
    const isCorrect = JSON.stringify(selected) === JSON.stringify(expected);

    // reveal
    q.options.forEach((_, i) => {
      const btn = document.getElementById('opt-' + i);
      btn.classList.add('locked');
      if (q.correct.includes(i) && selected.includes(i)) btn.classList.add('correct');
      else if (!q.correct.includes(i) && selected.includes(i)) btn.classList.add('incorrect');
      else if (q.correct.includes(i) && !selected.includes(i)) btn.classList.add('missed');
    });

    recordAnswer(topic.id, q, isCorrect);
    showRationale(q, isCorrect);
    appendNext();

    if (isCorrect) sessionCorrect++;
    sessionAnswered++;
  }

  function revealMCQ(chosen, correct, isCorrect, q) {
    q.options.forEach((_, i) => {
      const btn = document.getElementById('opt-' + i);
      btn.classList.add('locked');
      if (i === correct) btn.classList.add(isCorrect && i === chosen ? 'correct' : 'missed');
      else if (i === chosen && !isCorrect) btn.classList.add('incorrect');
    });
  }

  function recordAnswer(topicId, q, isCorrect) {
    if (!STATE.questionProgress[topicId]) STATE.questionProgress[topicId] = {};
    STATE.questionProgress[topicId][q.id] = isCorrect ? 'correct' : 'wrong';
    STATE.totalAnswered++;
    if (isCorrect) {
      STATE.totalCorrect++;
      STATE.currentStreak++;
      if (STATE.currentStreak > STATE.bestStreak) STATE.bestStreak = STATE.currentStreak;
      inSessionStreak++;
      if (q.type === 'sata') STATE.sataCorrect++;
      awardXP(XP_TABLE[isCorrect && q.type === 'sata' ? 'correct_sata' : 'correct_mcq'],
              isCorrect ? '✅ Correct!' : null);
    } else {
      STATE.currentStreak = 0;
      inSessionStreak = 0;
      awardXP(XP_TABLE['wrong_mcq'], null);
    }
    recomputeTopicsCompleted();
    saveState();
    checkAchievements();
  }

  function showRationale(q, isCorrect) {
    const box = document.getElementById('rationale-box');
    box.className = 'rationale-box show ' + (isCorrect ? 'correct-fb' : 'incorrect-fb');
    box.innerHTML = `
      <div class="rationale-title">
        <span class="rationale-icon">${isCorrect ? '✅' : '❌'}</span>
        ${isCorrect ? 'Correct!' : 'Not quite.'}
      </div>
      <div>${q.rationale}</div>
      ${q.trap ? `<div class="trap-tip">⚠️ <strong>Distractor Alert:</strong> ${q.trap}</div>` : ''}
    `;
  }

  function appendNext() {
    const actions = document.getElementById('quiz-actions');
    const nextLabel = idx + 1 < qs.length ? 'Next Question →' : 'See Results';
    actions.innerHTML = `<button class="btn btn-primary" onclick="nextQuestion()">${nextLabel}</button>`;
  }

  function renderResults() {
    const pct = sessionAnswered ? Math.round((sessionCorrect / sessionAnswered) * 100) : 0;
    let grade, msg;
    if      (pct >= 85) { grade = 'excellent'; msg = '🏆 Outstanding! You are NCLEX-ready on this topic.'; }
    else if (pct >= 70) { grade = 'good';      msg = '👍 Solid performance — review the rationales for any misses.'; }
    else if (pct >= 55) { grade = 'fair';      msg = '📖 Good effort — focus on the rationales to strengthen your understanding.'; }
    else                { grade = 'needs-work';msg = '💪 Keep going — every question builds knowledge. Review and retry!'; }

    const xpEarned = sessionCorrect * (XP_TABLE.correct_mcq);

    container.innerHTML = `
      <div class="fade-in" style="max-width:500px;margin:0 auto;text-align:center;padding-top:1rem">
        <div class="results-card pop-in">
          <div class="results-score-ring ${grade}">
            <div class="results-score-val">${pct}%</div>
            <div class="results-score-denom">${sessionCorrect}/${sessionAnswered}</div>
          </div>
          <h2 class="results-title">${topic.icon} ${topic.name}</h2>
          <p class="results-sub">${msg}</p>
          <div class="results-xp">+${xpEarned} XP earned this session ⭐</div>
          <div class="results-actions">
            <button class="btn btn-primary" onclick="retryQuiz()">🔄 Retry</button>
            <a class="btn btn-ghost" href="#/topic/${topic.id}">← Back to Topic</a>
            <a class="btn btn-secondary" href="#/">🏠 Dashboard</a>
          </div>
        </div>
      </div>
    `;

    window.retryQuiz = () => {
      idx = 0; sessionCorrect = 0; sessionAnswered = 0;
      renderQ();
    };
  }

  renderQ();
}

/* ══════════════════════════════════════════════════════════════
   JOURNEY LIST VIEW
══════════════════════════════════════════════════════════════ */
function renderJourneyList(container) {
  container.innerHTML = `
    <div class="fade-in">
      <h1 class="section-title">📋 Case Journeys</h1>
      <p class="section-subtitle">Step through realistic patient scenarios and apply clinical judgment. Each correct decision earns XP.</p>
      <div class="journey-grid">
        ${JOURNEYS.map(j => {
          const prog   = STATE.journeyProgress[j.id] || {};
          const done   = Object.keys(prog).length;
          const total  = j.scenes.length;
          const pct    = total ? Math.round((done / total) * 100) : 0;
          const complete = done >= total;
          return `
            <a class="journey-card" href="#/journey/${j.id}" style="border-top-color:${j.color}">
              <div class="journey-card-icon">${j.icon}</div>
              <div class="journey-card-title">${j.title}</div>
              <div class="journey-card-desc">${j.desc}</div>
              <div class="journey-card-meta">
                ${progressBar(pct, j.color)}
                <span class="badge ${complete ? 'badge-success' : 'badge-muted'}" style="margin-left:0.75rem;white-space:nowrap">
                  ${complete ? '✅ Done' : `${done}/${total} scenes`}
                </span>
              </div>
              <div style="margin-top:0.5rem;font-size:0.78rem;color:var(--text-muted)">+${j.xpReward} XP on completion</div>
            </a>`;
        }).join('')}
      </div>
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════════
   JOURNEY SCENE VIEW
══════════════════════════════════════════════════════════════ */
function renderJourneyScene(container, journey, sceneIdx) {
  touchStreak();
  if (sceneIdx >= journey.scenes.length) {
    // Journey complete
    if (!STATE.journeyProgress[journey.id]) STATE.journeyProgress[journey.id] = {};
    const wasNew = Object.keys(STATE.journeyProgress[journey.id]).length >= journey.scenes.length - 1;
    if (wasNew) {
      STATE.journeysCompleted = JOURNEYS.filter(j => {
        const p = STATE.journeyProgress[j.id] || {};
        return Object.keys(p).length >= j.scenes.length;
      }).length;
      saveState();
      awardXP(journey.xpReward, `🗺️ ${journey.title} complete!`);
      checkAchievements();
    }

    container.innerHTML = `
      <div class="fade-in" style="max-width:560px;margin:0 auto;text-align:center;padding-top:2rem">
        <div class="results-card pop-in">
          <div style="font-size:4rem;margin-bottom:0.75rem">${journey.icon}</div>
          <h2 class="results-title">${journey.title}</h2>
          <p class="results-sub">🎉 Journey Complete! You navigated all ${journey.scenes.length} scenes.</p>
          <div class="results-xp">+${journey.xpReward} XP earned 🚀</div>
          <div class="results-actions">
            <a class="btn btn-primary" href="#/journey">← All Journeys</a>
            <a class="btn btn-ghost"   href="#/">🏠 Dashboard</a>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const scene = journey.scenes[sceneIdx];
  const pct   = Math.round((sceneIdx / journey.scenes.length) * 100);
  let answered = false;

  container.innerHTML = `
    <div class="fade-in journey-scene">
      <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.75rem">
        <a href="#/journey" style="color:var(--text-muted);text-decoration:none">Journeys</a> › ${journey.icon} ${journey.title}
      </div>

      <div class="journey-scene-header">
        <div class="journey-scene-num">Scene ${sceneIdx + 1} of ${journey.scenes.length}</div>
        <div class="journey-scene-title">${scene.title}</div>
        <div class="journey-scene-prog">
          ${progressBar(pct, 'rgba(255,255,255,0.7)')}
        </div>
      </div>

      <div class="scene-narrative">${scene.narrative}</div>

      <div class="quiz-card" style="max-width:100%">
        <div class="quiz-stem"><strong>Decision Point:</strong> ${scene.question}</div>
        <div class="quiz-options" id="scene-options">
          ${scene.options.map((opt, i) => `
            <button class="quiz-option" id="sopt-${i}" onclick="sceneSelect(${i})">
              <span class="option-letter">${String.fromCharCode(65 + i)}</span>
              <span>${opt}</span>
            </button>`).join('')}
        </div>
        <div id="scene-outcome"></div>
        <div class="quiz-actions" id="scene-actions">
          <span style="font-size:0.82rem;color:var(--text-muted)">Make your decision</span>
        </div>
      </div>
    </div>
  `;

  window.sceneSelect = (i) => {
    if (answered) return;
    answered = true;

    const correct = (i === scene.correct);

    // highlight
    scene.options.forEach((_, idx) => {
      const btn = document.getElementById('sopt-' + idx);
      btn.classList.add('locked');
      if (idx === scene.correct) btn.classList.add('correct');
      else if (idx === i && !correct) btn.classList.add('incorrect');
    });

    // outcome
    const outEl = document.getElementById('scene-outcome');
    outEl.innerHTML = `
      <div class="scene-outcome ${correct ? 'success' : 'failure'}">
        <div class="scene-outcome-title">${correct ? '✅ Good Decision!' : '❌ Reconsidering...'}</div>
        <div>${correct ? scene.outcome_correct : scene.outcome_incorrect}</div>
      </div>`;

    // record progress
    if (!STATE.journeyProgress[journey.id]) STATE.journeyProgress[journey.id] = {};
    STATE.journeyProgress[journey.id][scene.id] = correct;
    if (correct) {
      STATE.currentStreak++;
      if (STATE.currentStreak > STATE.bestStreak) STATE.bestStreak = STATE.currentStreak;
    } else {
      STATE.currentStreak = 0;
    }
    awardXP(XP_TABLE.journey_scene, correct ? '✅ Good call!' : null);
    saveState();
    checkAchievements();

    const actions = document.getElementById('scene-actions');
    const nextLabel = sceneIdx + 1 < journey.scenes.length ? 'Next Scene →' : '🎉 Complete Journey';
    actions.innerHTML = `
      <button class="btn btn-primary" onclick="nextScene()">
        ${nextLabel}
      </button>`;

    window.nextScene = () => renderJourneyScene(container, journey, sceneIdx + 1);
  };
}

/* ══════════════════════════════════════════════════════════════
   DISTRACTOR DETECTIVE VIEW
══════════════════════════════════════════════════════════════ */
function renderDistractors(container) {
  container.innerHTML = `
    <div class="fade-in">
      <h1 class="section-title">🔍 Distractor Detective</h1>
      <p class="section-subtitle">Learn to spot the NCLEX trap patterns that fool test-takers. Each solved challenge earns +${XP_TABLE.distractor} XP.</p>
      ${DISTRACTORS.map(d => {
        const solved = STATE.distractorProgress.includes(d.id);
        return `
          <div class="distractor-card ${solved ? 'solved' : ''}" onclick="openDistractor('${d.id}')">
            <div class="distractor-badge">
              <span class="badge ${solved ? 'badge-success' : 'badge-accent'}">${solved ? '✅ Solved' : '⚠️ Active'}</span>
            </div>
            <div class="distractor-num">Pattern ${DISTRACTORS.indexOf(d) + 1}</div>
            <div class="distractor-title">${d.icon} ${d.pattern}</div>
            <div class="distractor-desc">${d.desc}</div>
          </div>`;
      }).join('')}
    </div>
  `;

  window.openDistractor = (id) => {
    const d = DISTRACTORS.find(x => x.id === id);
    if (d) renderDistractorChallenge(container, d);
  };
}

function renderDistractorChallenge(container, d) {
  const solved = STATE.distractorProgress.includes(d.id);
  let answered = false;

  container.innerHTML = `
    <div class="fade-in">
      <a href="#/distractors" style="font-size:0.82rem;color:var(--text-muted);text-decoration:none;display:block;margin-bottom:1rem">
        ← Back to Distractor Detective
      </a>

      <div class="distractor-challenge">
        <div class="dc-header">
          <div class="dc-pattern-label">Distractor Pattern</div>
          <div class="dc-pattern-name">${d.icon} ${d.pattern}</div>
        </div>

        <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:0.75rem">${d.desc}</p>

        <div style="background:var(--bg);border-radius:var(--radius-sm);padding:1rem;margin-bottom:1.25rem">
          <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-light);margin-bottom:0.5rem">Examples of this pattern</div>
          <ul style="list-style:none;font-size:0.85rem;display:flex;flex-direction:column;gap:0.35rem">
            ${d.examples.map(e => `<li>• ${e}</li>`).join('')}
          </ul>
        </div>

        <div class="quiz-card" style="margin-bottom:1rem">
          <div class="quiz-meta">
            <span class="badge badge-accent">Challenge</span>
            <span class="quiz-type-label">Identify the distractor</span>
          </div>
          <div class="quiz-stem">${d.challenge.stem}</div>
          <div class="quiz-options" id="dc-options">
            ${d.challenge.options.map((opt, i) => `
              <button class="quiz-option" id="dc-opt-${i}" onclick="dcSelect(${i})">
                <span class="option-letter">${String.fromCharCode(65 + i)}</span>
                <span>${opt}</span>
              </button>`).join('')}
          </div>
          <div class="rationale-box" id="dc-rationale"></div>
          <div class="quiz-actions" id="dc-actions">
            <span style="font-size:0.82rem;color:var(--text-muted)">Select the answer that matches the pattern</span>
          </div>
        </div>
      </div>
    </div>
  `;

  window.dcSelect = (i) => {
    if (answered) return;
    answered = true;

    const correct = (i === d.challenge.correct);

    d.challenge.options.forEach((_, idx) => {
      const btn = document.getElementById('dc-opt-' + idx);
      btn.classList.add('locked');
      if (idx === d.challenge.correct) btn.classList.add('correct');
      else if (idx === i && !correct) btn.classList.add('incorrect');
    });

    const box = document.getElementById('dc-rationale');
    box.className = 'rationale-box show ' + (correct ? 'correct-fb' : 'incorrect-fb');
    box.innerHTML = `
      <div class="rationale-title">
        <span class="rationale-icon">${correct ? '✅' : '❌'}</span>
        ${correct ? 'Pattern Identified!' : 'Not quite.'}
      </div>
      <div>${d.challenge.explanation}</div>
    `;

    if (correct && !STATE.distractorProgress.includes(d.id)) {
      STATE.distractorProgress.push(d.id);
      STATE.distractorsSolved = STATE.distractorProgress.length;
      awardXP(XP_TABLE.distractor, '🔍 Distractor Spotted!');
      saveState();
      checkAchievements();
    }

    const actions = document.getElementById('dc-actions');
    actions.innerHTML = `<a class="btn btn-ghost" href="#/distractors">← All Patterns</a>`;
  };
}

/* ══════════════════════════════════════════════════════════════
   ACHIEVEMENTS VIEW
══════════════════════════════════════════════════════════════ */
function renderAchievements(container) {
  container.innerHTML = `
    <div class="fade-in">
      <h1 class="section-title">🏆 Achievements</h1>
      <p class="section-subtitle">${STATE.unlockedAchievements.length} of ${ACHIEVEMENTS.length} unlocked</p>
      <div class="achievements-grid">
        ${ACHIEVEMENTS.map(a => {
          const unlocked = STATE.unlockedAchievements.includes(a.id);
          return `
            <div class="achievement-tile ${unlocked ? 'unlocked' : 'locked'}">
              <span class="achievement-tile-icon">${a.icon}</span>
              <div class="achievement-tile-name">${a.name}</div>
              <div class="achievement-tile-desc">${a.desc}</div>
              ${a.xp > 0 ? `<div style="font-size:0.7rem;color:var(--warning);margin-top:0.35rem;font-weight:700">+${a.xp} XP</div>` : ''}
              ${unlocked ? '<div style="font-size:0.7rem;color:var(--success);margin-top:0.25rem;font-weight:600">✅ Unlocked</div>' : ''}
            </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════════
   NOT FOUND
══════════════════════════════════════════════════════════════ */
function renderNotFound(container) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">🔎</div>
      <div class="empty-state-title">Page not found</div>
      <a class="btn btn-ghost" href="#/" style="margin-top:1rem">← Dashboard</a>
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════════
   MOBILE MENU TOGGLE
══════════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const toggle  = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 768) return;
    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */
function init() {
  loadState();
  buildTopicNav();
  initMobileMenu();
  updateHUD();
  touchStreak();
  checkAchievements();

  window.addEventListener('hashchange', router);
  router();
}

document.addEventListener('DOMContentLoaded', init);
