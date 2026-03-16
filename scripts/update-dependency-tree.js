#!/usr/bin/env node
/**
 * update-dependency-tree.js
 *
 * Reads task completion statuses from the master sprint backlog
 * (activity/2026-03-15-1210/sprint-backlog.md) and syncs them into
 * the embedded JavaScript data inside dependency-tree.html.
 *
 * Status mapping (backlog → dependency-tree):
 *   [x]  →  'complete'
 *   [~]  →  'in-progress'
 *   [ ]  →  'not-started'
 *
 * Task name normalisation maps backlog variants to the canonical
 * short names used in dependency-tree.html.
 *
 * Usage:  node scripts/update-dependency-tree.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── Paths ──────────────────────────────────────────────────────────────────
const ROOT      = path.resolve(__dirname, '..');
const BACKLOG   = path.join(ROOT, 'activity', '2026-03-15-1210', 'sprint-backlog.md');
const DEP_TREE  = path.join(ROOT, 'dependency-tree.html');

// ── Task-name normalisation map ────────────────────────────────────────────
// Keys are lowercase patterns that appear in the backlog; values are the
// canonical names used in dependency-tree.html.
const TASK_NORM = {
  'outline review':             'Outline review',
  'chapter draft':              'Chapter draft',
  'key terms':                  'Key terms',
  'case study':                 'Case study',
  'nclex questions':            'NCLEX questions',
  'nclex-style review':         'NCLEX questions',
  'summary':                    'Summary',
  'references':                 'References',
  'developmental edit':         'Developmental edit',
  'copy edit':                  'Copy edit/proofread',
  'html formatting':            'HTML formatting',
};

// ── Backlog status → JS literal ────────────────────────────────────────────
function parseStatus(cell) {
  const t = cell.trim();
  if (/^\[x\]/i.test(t)) return 'complete';
  if (/^\[~\]/i.test(t)) return 'in-progress';
  return 'not-started';
}

// ── Normalise a task name from the backlog ─────────────────────────────────
function normaliseTask(raw) {
  const lower = raw.trim().toLowerCase();
  for (const [pattern, canonical] of Object.entries(TASK_NORM)) {
    if (lower.startsWith(pattern)) return canonical;
  }
  return null;
}

// ── Parse master backlog ───────────────────────────────────────────────────
// Returns: Map<chapterId ('ch1'…'ch45'), Map<canonicalTaskName, status>>
function parseBacklog(text) {
  const result = new Map();
  let currentId   = null;
  let taskMap     = null;
  let inTaskTable = false;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();

    // Detect "### Chapter N:" headings
    const chMatch = line.match(/^###\s+Chapter\s+(\d+)\s*:/i);
    if (chMatch) {
      currentId   = `ch${parseInt(chMatch[1], 10)}`;
      taskMap     = new Map();
      result.set(currentId, taskMap);
      inTaskTable = false;
      continue;
    }

    // Once inside a chapter section, look for task table rows
    if (!currentId) continue;

    // A new H2/H3 heading that is NOT a chapter resets context
    if (/^#{2,3}\s/.test(line) && !chMatch) {
      currentId   = null;
      taskMap     = null;
      inTaskTable = false;
      continue;
    }

    // Markdown table row: | Task Name | [x]/[~]/[ ] … |
    if (line.startsWith('|') && line.includes('|')) {
      const cols = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length >= 2) {
        const canonical = normaliseTask(cols[0]);
        if (canonical) {
          inTaskTable = true;
          taskMap.set(canonical, parseStatus(cols[1]));
        }
      }
    } else if (inTaskTable && line === '') {
      // blank line ends the table but we stay in the chapter section
      inTaskTable = false;
    }
  }

  return result;
}

// ── Patch dependency-tree.html ─────────────────────────────────────────────
// For each chapter node (e.g. ch1 … ch45) and each task whose status we
// know from the backlog, replace the s:'...' literal in the relevant task
// object inside the HTML file.
//
// The target pattern looks like (with varying whitespace):
//   {name:'Outline review',      s:'not-started'},
//   {name:'Chapter draft',       s:'complete'},
//
// Strategy: locate each chapter's RAW entry by its id string, then within
// that block replace the s:'...' for each known task.
function patchHtml(html, backlogMap) {
  let changed = false;

  for (const [chId, taskMap] of backlogMap) {
    // Find the RAW entry for this chapter id
    // Pattern: {id:'ch1', ...}  or  {id:'ch10', ...}
    const idPattern = new RegExp(
      `\\{id:'${chId}',[^}]*?tasks:\\[([\\s\\S]*?)\\]\\}`,
      'g'
    );

    html = html.replace(idPattern, (fullMatch, taskBlock) => {
      let newBlock = taskBlock;

      for (const [canonicalName, newStatus] of taskMap) {
        // Escape special regex chars in the task name
        const escaped = canonicalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Match:  {name:'<task>',<spaces>s:'<old>'}
        const taskRe = new RegExp(
          `(\\{name:'${escaped}',\\s*s:')([^']+)(')`,
          'g'
        );
        const patched = newBlock.replace(taskRe, (m, prefix, oldStatus, suffix) => {
          // Never overwrite structural 'N/A' markers — those indicate the task
          // does not apply to the chapter (e.g. Key terms in capstone chapters).
          if (oldStatus === 'N/A') return m;
          if (oldStatus !== newStatus) {
            changed = true;
          }
          return `${prefix}${newStatus}${suffix}`;
        });
        newBlock = patched;
      }

      return fullMatch.replace(taskBlock, newBlock);
    });
  }

  return { html, changed };
}

// ── Main ───────────────────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(BACKLOG)) {
    console.error(`ERROR: master backlog not found at ${BACKLOG}`);
    process.exit(1);
  }
  if (!fs.existsSync(DEP_TREE)) {
    console.error(`ERROR: dependency-tree.html not found at ${DEP_TREE}`);
    process.exit(1);
  }

  const backlogText = fs.readFileSync(BACKLOG, 'utf8');
  const htmlText    = fs.readFileSync(DEP_TREE, 'utf8');

  const backlogMap  = parseBacklog(backlogText);
  const { html: patched, changed } = patchHtml(htmlText, backlogMap);

  if (changed) {
    fs.writeFileSync(DEP_TREE, patched, 'utf8');
    console.log('dependency-tree.html updated with latest backlog statuses.');
  } else {
    console.log('dependency-tree.html is already up-to-date.');
  }
}

main();
