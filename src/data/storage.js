/**
 * Storage & Day Management
 * Handles auto-archiving previous days and resetting for new day
 */

/** Get local YYYY-MM-DD date string */
export function getTodayDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Get the start date of tracking — persists first day ever opened */
export function getYearStartDate() {
  let start = localStorage.getItem('hf_start_date');
  if (!start) {
    start = getTodayDate();
    localStorage.setItem('hf_start_date', start);
  }
  // Try clean JSON parse if it was stored with quotes
  try {
    const parsed = JSON.parse(start);
    if (parsed && typeof parsed === 'string') return parsed;
  } catch {}
  return start;
}

/** Get the end date of tracking — exactly 1 year from the start date */
export function getYearEndDate() {
  const start = getYearStartDate();
  const d = new Date(start + 'T00:00:00');
  d.setFullYear(d.getFullYear() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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
export function checkAndAdvanceDay(currentTasks, todayDate) {
  const lastDate = get('hf_last_date', null);
  const today = todayDate || getTodayDate();

  if (lastDate && lastDate !== today) {
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
    set('hf_last_date', today);
    return { advanced: true, archivedDate: lastDate };
  }

  if (!lastDate) {
    set('hf_last_date', today);
  }

  return { advanced: false };
}

/** Load history — only real logged data */
export function loadHistory() {
  return get('hf_history', []);
}

/** Save today's completed task data to history */
export function saveToday(tasks, todayDate) {
  const today = todayDate || getTodayDate();
  const history = get('hf_history', []);
  const totalPoints = tasks.reduce((s, t) => s + (t.pointsEarned || 0), 0);
  const upscTask = tasks.find(t => t.id === 'upsc');
  const earningTask = tasks.find(t => t.id === 'earning');

  const entry = {
    date: today,
    points: totalPoints,
    upscHours: upscTask ? Number(upscTask.inputValue || 0) : 0,
    earnings: earningTask ? Number(earningTask.inputValue || 0) : 0,
    tasksCompleted: tasks.filter(t => t.completed).length,
  };

  const existingIdx = history.findIndex(h => h.date === today);
  if (existingIdx >= 0) {
    history[existingIdx] = entry;
  } else {
    history.push(entry);
  }

  set('hf_history', history);
}

/** Generate all dates from start date to end date for the calendar */
export function generateYearDates() {
  const dates = [];
  const startStr = getYearStartDate();
  const endStr = getYearEndDate();
  
  const cur = new Date(startStr + 'T00:00:00');
  const end = new Date(endStr + 'T00:00:00');

  while (cur <= end) {
    const year = cur.getFullYear();
    const month = String(cur.getMonth() + 1).padStart(2, '0');
    const day = String(cur.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    cur.setDate(cur.getDate() + 1);
  }

  return dates;
}
