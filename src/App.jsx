import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sun, Moon, CheckCircle2 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Analytics } from './components/Analytics';
import { Inspiration } from './components/Inspiration';
import { YearCalendar } from './components/YearCalendar';
import { TodayPage } from './pages/TodayPage';
import { INITIAL_TASKS } from './data/tasks';
import {
  getToday, getEndDate,
  getLastDate, setLastDate,
  loadTasks, saveTasks,
  loadHistory, saveToHistory, computeTotalEarnings,
  loadStreak, saveStreak,
  loadDark, saveDark,
  checkAndAdvanceDay, generateYearDates,
} from './data/storage';

// ─── Settings Page ─────────────────────────────────────────────────────────────

function SettingsPage({ dark, onToggleDark, superStreak, setSuperStreak, onClearData }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const cardStyle = {
    background: dark ? '#1e293b' : '#ffffff',
    border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
    borderRadius: 16, padding: '22px 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontWeight: 900, fontSize: 26, color: dark ? '#f1f5f9' : '#1e293b', margin: 0 }}>Settings ⚙️</h2>
        <p style={{ color: '#94a3b8', fontSize: 14, margin: '4px 0 0' }}>Customize your HabitForge experience</p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', margin: '0 0 18px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Appearance</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: dark ? '#f1f5f9' : '#1e293b' }}>Dark Mode</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Toggle between light and dark theme</div>
          </div>
          <button onClick={onToggleDark} style={{
            width: 50, height: 28, borderRadius: 99,
            background: dark ? '#6366f1' : '#e2e8f0',
            border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s',
          }}>
            <div style={{
              position: 'absolute', width: 20, height: 20, borderRadius: '50%',
              background: 'white', top: 4, left: dark ? 26 : 4,
              transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', margin: '0 0 18px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Super Streak</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: dark ? '#f1f5f9' : '#1e293b' }}>Current: {superStreak} days</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Manually correct if needed</div>
          </div>
          <input type="number" min="0" value={superStreak}
            onChange={e => { const v = Number(e.target.value); setSuperStreak(v); saveStreak(v); }}
            style={{
              width: 80, padding: '8px 12px', borderRadius: 8,
              border: `1px solid ${dark ? '#475569' : '#e2e8f0'}`,
              background: dark ? '#334155' : '#f8faff',
              color: dark ? '#f1f5f9' : '#1e293b',
              fontWeight: 700, fontSize: 14, outline: 'none',
            }}
          />
        </div>
      </div>

      <div style={{ ...cardStyle, border: `1px solid ${dark ? '#7f1d1d' : '#fecaca'}`, background: dark ? '#1e293b' : '#fff5f5' }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', margin: '0 0 18px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Danger Zone</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: dark ? '#f1f5f9' : '#1e293b' }}>Reset All Data</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Clear everything and start fresh from zero</div>
          </div>
          {!showConfirm ? (
            <button onClick={() => setShowConfirm(true)} style={{
              padding: '8px 20px', borderRadius: 10, border: '1px solid #ef4444',
              background: 'transparent', color: '#ef4444', cursor: 'pointer', fontWeight: 700, fontSize: 13,
            }}>Reset</button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { onClearData(); setShowConfirm(false); }} style={{
                padding: '8px 16px', borderRadius: 10, border: 'none',
                background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 13,
              }}>Confirm</button>
              <button onClick={() => setShowConfirm(false)} style={{
                padding: '8px 16px', borderRadius: 10,
                border: `1px solid ${dark ? '#475569' : '#e2e8f0'}`,
                background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 700, fontSize: 13,
              }}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [dark, setDark] = useState(() => loadDark());
  const [active, setActive] = useState('today');
  const [today, setToday] = useState(() => getToday());

  // ── Tasks state ──────────────────────────────────────────────────────────────
  const [tasks, setTasksRaw] = useState(() => {
    const saved = loadTasks(INITIAL_TASKS);
    const { advanced } = checkAndAdvanceDay(saved);
    if (advanced) {
      const reset = INITIAL_TASKS.map((init, i) => ({
        ...init,
        streak: saved[i]?.streak || 0,
      }));
      saveTasks(reset);
      return reset;
    }
    return saved;
  });

  // ── Super Streak ─────────────────────────────────────────────────────────────
  const [superStreak, setSuperStreak] = useState(() => loadStreak());

  // ── History ──────────────────────────────────────────────────────────────────
  const [history, setHistory] = useState(() => loadHistory());

  // ── Derived: earnings always from history ─────────────────────────────────────
  const globalEarnings = useMemo(() => computeTotalEarnings(history), [history]);

  // ── Persist tasks + save to history on every change ──────────────────────────
  const setTasks = useCallback((updater) => {
    setTasksRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveTasks(next);
      const newHistory = saveToHistory(getToday(), next);
      setHistory(newHistory);
      return next;
    });
  }, []);

  // ── Listen for day change (focus, visibility, interval) ──────────────────────
  useEffect(() => {
    const checkDay = () => {
      const cur = getToday();
      if (cur !== today) {
        setToday(cur);
        setTasksRaw(prev => {
          const { advanced } = checkAndAdvanceDay(prev);
          if (advanced) {
            const reset = INITIAL_TASKS.map((init, i) => ({
              ...init,
              streak: prev[i]?.streak || 0,
            }));
            saveTasks(reset);
            const newHistory = loadHistory();
            setHistory(newHistory);
            return reset;
          }
          return prev;
        });
      }
    };

    window.addEventListener('focus', checkDay);
    document.addEventListener('visibilitychange', checkDay);
    const interval = setInterval(checkDay, 30000);
    return () => {
      window.removeEventListener('focus', checkDay);
      document.removeEventListener('visibilitychange', checkDay);
      clearInterval(interval);
    };
  }, [today]);

  // ── Theme ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.className = dark ? 'dark' : '';
    saveDark(dark);
  }, [dark]);

  const totalPoints = useMemo(() => tasks.reduce((s, t) => s + t.pointsEarned, 0), [tasks]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleToggle = useCallback((id) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id !== id) return t;
        const completing = !t.completed;
        let pts = 0;
        if (completing) {
          pts = t.basePoints;
          if (t.id === 'upsc') pts += Math.min(Number(t.inputValue || 0), 5);
          if (t.id === 'tech') pts += (t.stars || 0);
        }
        return {
          ...t,
          completed: completing,
          streak: completing ? t.streak + 1 : Math.max(0, t.streak - 1),
          pointsEarned: completing ? Math.min(pts, t.maxPoints) : 0,
        };
      });

      // Super streak — bump when crossing 4-habit threshold
      const completedNow = updated.filter(t => t.completed).length;
      const completedBefore = prev.filter(t => t.completed).length;
      if (completedNow >= 4 && completedBefore < 4) {
        setSuperStreak(s => { const n = s + 1; saveStreak(n); return n; });
      }

      return updated;
    });
  }, [setTasks]);

  const handleInput = useCallback((id, val) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      let pts = t.completed ? t.basePoints : 0;
      if (t.completed && t.id === 'upsc') pts += Math.min(Number(val || 0), 5);
      // Earnings: points don't change, but inputValue is saved → history picks it up
      return { ...t, inputValue: val, pointsEarned: Math.min(pts, t.maxPoints) };
    }));
  }, [setTasks]);

  const handleStars = useCallback((id, stars) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const pts = t.completed ? Math.min(t.basePoints + stars, t.maxPoints) : 0;
      return { ...t, stars, pointsEarned: pts };
    }));
  }, [setTasks]);

  /** Manual "Finish Today & Reset" — saves current state and resets tasks */
  const handleFinishDay = useCallback(() => {
    const cur = getToday();
    saveToHistory(cur, tasks);
    setLastDate(cur);
    const reset = INITIAL_TASKS.map((init, i) => ({
      ...init,
      streak: tasks[i]?.streak || 0,
    }));
    saveTasks(reset);
    setTasksRaw(reset);
    setHistory(loadHistory());
  }, [tasks]);

  const handleClearData = () => {
    // Clear v2 keys only
    ['hf2_start','hf2_last','hf2_tasks','hf2_history','hf2_dark','hf2_streak'].forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  // ─── UI ──────────────────────────────────────────────────────────────────────

  const bg = dark ? '#0f172a' : '#f0f4ff';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg, transition: 'background 0.3s ease' }}>
      {/* Left Sidebar */}
      <Sidebar active={active} setActive={setActive} points={totalPoints} superStreak={superStreak} dark={dark} />

      {/* Main Content */}
      <main style={{ marginLeft: 240, flex: 1, padding: '28px 28px 28px 32px', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button onClick={() => setDark(d => !d)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 18px', borderRadius: 10,
            border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
            background: dark ? '#1e293b' : 'white',
            cursor: 'pointer', fontWeight: 600, fontSize: 13,
            color: dark ? '#f1f5f9' : '#475569',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            {dark ? <Sun size={14} color="#fbbf24" /> : <Moon size={14} color="#6366f1" />}
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* Pages */}
        {active === 'today' && (
          <TodayPage
            tasks={tasks}
            onToggle={handleToggle}
            onUpdateInput={handleInput}
            onUpdateStars={handleStars}
            globalEarnings={globalEarnings}
            superStreak={superStreak}
            dark={dark}
            today={today}
            onFinishDay={handleFinishDay}
          />
        )}
        {active === 'analytics' && <Analytics history={history} dark={dark} />}
        {active === 'inspiration' && <Inspiration dark={dark} globalEarnings={globalEarnings} today={today} />}
        {active === 'settings' && (
          <SettingsPage
            dark={dark}
            onToggleDark={() => setDark(d => !d)}
            superStreak={superStreak}
            setSuperStreak={setSuperStreak}
            onClearData={handleClearData}
          />
        )}
      </main>

      {/* Right Calendar Panel */}
      <div style={{ width: 320, padding: '28px 20px 28px 0', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ marginBottom: 8, marginTop: 52 }}>
          <h3 style={{ fontWeight: 800, fontSize: 16, color: dark ? '#f1f5f9' : '#1e293b', margin: 0 }}>Year Progress 🗓️</h3>
          <p style={{ fontSize: 11, color: '#94a3b8', margin: '3px 0 0' }}>Hover a day for details · Colors = points scored</p>
        </div>
        <YearCalendar history={history} dark={dark} today={today} />

        {/* Monthly summary */}
        <div style={{
          background: dark ? '#1e293b' : '#ffffff',
          border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
          borderRadius: 16, padding: '18px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <h4 style={{ fontWeight: 700, fontSize: 13, color: dark ? '#f1f5f9' : '#1e293b', margin: '0 0 14px' }}>
            This Month
          </h4>
          {(() => {
            const thisMonth = today.slice(0, 7);
            const md = history.filter(h => h.date.startsWith(thisMonth));
            const avg = md.length > 0 ? Math.round(md.reduce((s, h) => s + h.points, 0) / md.length) : 0;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Days logged', value: md.length, color: '#6366f1' },
                  { label: 'Avg score', value: md.length > 0 ? `${avg}/50` : '—', color: '#f59e0b' },
                  { label: 'Perfect (40+ pts)', value: md.filter(h => h.points >= 40).length, color: '#22c55e' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{s.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Today's points card */}
        <div style={{
          borderRadius: 16, overflow: 'hidden',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          padding: '18px 20px',
          boxShadow: '0 4px 16px rgba(99,102,241,0.25)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', marginBottom: 8 }}>
            TODAY'S PROGRESS
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
            <span style={{ fontSize: 34, fontWeight: 900, color: 'white' }}>{totalPoints}</span>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>/50 points</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 99 }}>
            <div style={{
              height: '100%', width: `${(totalPoints / 50) * 100}%`,
              background: 'rgba(255,255,255,0.85)', borderRadius: 99, transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
            {tasks.filter(t => t.completed).length}/5 habits done
          </div>
        </div>
      </div>
    </div>
  );
}
