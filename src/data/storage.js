/**
 * HabitForge Storage v2
 * Clean, reliable, timezone-safe storage with new key prefix to avoid old data conflicts.
 */

// ─── Date Helpers ─────────────────────────────────────────────────────────────

/** Returns today's date as 'YYYY-MM-DD' in LOCAL timezone (not UTC) */
export function getToday() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Format any Date object to 'YYYY-MM-DD' local */
function dateToStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ─── Storage Keys (v2 prefix avoids old broken data) ─────────────────────────

const K = {
  start:   'hf2_start',    // plain string 'YYYY-MM-DD' — first day ever opened
  last:    'hf2_last',     // plain string 'YYYY-MM-DD' — last day app was used
  tasks:   'hf2_tasks',    // JSON array of task objects
  history: 'hf2_history',  // JSON array of { date, points, upscHours, earnings, tasksCompleted }
  dark:    'hf2_dark',     // 'true'|'false'
  streak:  'hf2_streak',   // plain number string
};

// ─── Start / End Dates ────────────────────────────────────────────────────────

/** Get or init the first-ever tracking start date (never changes) */
export function getStartDate() {
  const stored = localStorage.getItem(K.start);
  if (stored) return stored;
  const today = getToday();
  localStorage.setItem(K.start, today);
  return today;
}

/** Returns the date exactly 1 year after the start date */
export function getEndDate() {
  const start = getStartDate();
  const d = new Date(start + 'T00:00:00');
  d.setFullYear(d.getFullYear() + 1);
  return dateToStr(d);
}

/** Generate every date from start to end (365 dates) */
export function generateYearDates() {
  const dates = [];
  const cur = new Date(getStartDate() + 'T00:00:00');
  const end = new Date(getEndDate() + 'T00:00:00');
  while (cur <= end) {
    dates.push(dateToStr(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

// ─── Last Date (Day Tracking) ─────────────────────────────────────────────────

export function getLastDate() {
  return localStorage.getItem(K.last) || null;
}

export function setLastDate(date) {
  localStorage.setItem(K.last, date);
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export function loadTasks(INITIAL_TASKS) {
  try {
    const raw = localStorage.getItem(K.tasks);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_TASKS;
}

export function saveTasks(tasks) {
  localStorage.setItem(K.tasks, JSON.stringify(tasks));
}

// ─── History ──────────────────────────────────────────────────────────────────

export function loadHistory() {
  try {
    const raw = localStorage.getItem(K.history);
    if (raw) return JSON.parse(raw);
    // Migrate from old key if exists
    const old = localStorage.getItem('hf_history');
    if (old) {
      const parsed = JSON.parse(old);
      localStorage.setItem(K.history, JSON.stringify(parsed));
      return parsed;
    }
  } catch {}
  return [];
}

/**
 * Save/update a single day's entry in history.
 * Always writes the FULL task state for that date.
 */
export function saveToHistory(date, tasks) {
  const history = loadHistory();
  const earningTask = tasks.find(t => t.id === 'earning');
  const upscTask = tasks.find(t => t.id === 'upsc');

  const entry = {
    date,
    points: tasks.reduce((s, t) => s + (t.pointsEarned || 0), 0),
    upscHours: upscTask ? Number(upscTask.inputValue || 0) : 0,
    // Only count earnings when the task is actually checked
    earnings: (earningTask && earningTask.completed)
      ? Number(earningTask.inputValue || 0)
      : 0,
    tasksCompleted: tasks.filter(t => t.completed).length,
  };

  const idx = history.findIndex(h => h.date === date);
  if (idx >= 0) {
    history[idx] = entry;
  } else {
    history.push(entry);
  }
  localStorage.setItem(K.history, JSON.stringify(history));
  return history;
}

// ─── Earnings ─────────────────────────────────────────────────────────────────

/**
 * Compute total earnings directly from history (single source of truth).
 * No separate counter — this is always accurate.
 */
export function computeTotalEarnings(history) {
  return history.reduce((s, h) => s + (h.earnings || 0), 0);
}

// ─── Super Streak ─────────────────────────────────────────────────────────────

export function loadStreak() {
  const v = localStorage.getItem(K.streak);
  return v !== null ? Number(v) : 0;
}

export function saveStreak(n) {
  localStorage.setItem(K.streak, String(n));
}

// ─── Dark Mode ────────────────────────────────────────────────────────────────

export function loadDark() {
  return localStorage.getItem(K.dark) === 'true';
}

export function saveDark(val) {
  localStorage.setItem(K.dark, val ? 'true' : 'false');
}

// ─── Day Advance ─────────────────────────────────────────────────────────────

/**
 * Call this on app load (and whenever the date changes).
 * If the stored last-date differs from today:
 *   1. Archives yesterday's tasks to history
 *   2. Updates last-date to today
 *   3. Returns { advanced: true }
 * Otherwise returns { advanced: false }
 */
export function checkAndAdvanceDay(currentTasks) {
  const today = getToday();
  const last = getLastDate();

  if (!last) {
    // First ever open
    setLastDate(today);
    return { advanced: false };
  }

  if (last !== today) {
    // New day — archive yesterday
    saveToHistory(last, currentTasks);
    setLastDate(today);
    return { advanced: true, archivedDate: last };
  }

  return { advanced: false };
}
