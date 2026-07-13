/**
 * Storage & Day Management
 * Handles auto-archiving previous days and resetting for new day
 */

export const TODAY = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

export const YEAR_START = TODAY; // Start tracking from today
export const YEAR_END = (() => {
  const d = new Date(TODAY);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
})();

/** Get stored value safely */
function get(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

/** Set stored value safely */
export function set(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

/**
 * Check if app is being opened on a new day.
 * If so, archive yesterday's task state to history and clear for today.
 */
export function checkAndAdvanceDay(currentTasks) {
  const lastDate = get('hf_last_date', null);

  if (lastDate && lastDate !== TODAY) {
    // A new day has started — archive yesterday's data
    const history = get('hf_history', []);
    const existingIdx = history.findIndex(h => h.date === lastDate);

    const totalPoints = currentTasks.reduce((s, t) => s + (t.pointsEarned || 0), 0);
    const upscTask = currentTasks.find(t => t.id === 'upsc');
    const earningTask = currentTasks.find(t => t.id === 'earning');

    const entry = {
      date: lastDate,
      points: totalPoints,
      upscHours: upscTask ? Number(upscTask.inputValue || 0) : 0,
      earnings: earningTask ? Number(earningTask.inputValue || 0) : 0,
      tasksCompleted: currentTasks.filter(t => t.completed).length,
    };

    if (existingIdx >= 0) {
      history[existingIdx] = entry;
    } else {
      history.push(entry);
    }

    set('hf_history', history);
    set('hf_last_date', TODAY);
    return { advanced: true, archivedDate: lastDate };
  }

  if (!lastDate) {
    set('hf_last_date', TODAY);
  }

  return { advanced: false };
}

/** Load history — only real logged data, no mocks */
export function loadHistory() {
  return get('hf_history', []);
}

/** Save today's completed task data to history (called after task completion) */
export function saveToday(tasks) {
  const history = get('hf_history', []);
  const totalPoints = tasks.reduce((s, t) => s + (t.pointsEarned || 0), 0);
  const upscTask = tasks.find(t => t.id === 'upsc');
  const earningTask = tasks.find(t => t.id === 'earning');

  const entry = {
    date: TODAY,
    points: totalPoints,
    upscHours: upscTask ? Number(upscTask.inputValue || 0) : 0,
    earnings: earningTask ? Number(earningTask.inputValue || 0) : 0,
    tasksCompleted: tasks.filter(t => t.completed).length,
  };

  const existingIdx = history.findIndex(h => h.date === TODAY);
  if (existingIdx >= 0) {
    history[existingIdx] = entry;
  } else {
    history.push(entry);
  }

  set('hf_history', history);
}

/** Generate all dates from today to today+1year for the calendar */
export function generateYearDates() {
  const dates = [];
  const start = new Date(TODAY);
  const end = new Date(YEAR_END);
  const cur = new Date(start);

  while (cur <= end) {
    dates.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }

  return dates;
}
