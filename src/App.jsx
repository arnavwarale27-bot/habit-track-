import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Analytics } from './components/Analytics';
import { Inspiration } from './components/Inspiration';
import { YearCalendar } from './components/YearCalendar';
import { TodayPage } from './pages/TodayPage';
import { INITIAL_TASKS } from './data/tasks';
import {
  getTodayDate, checkAndAdvanceDay, loadHistory, saveToday, set
} from './data/storage';

function SettingsPage({ dark, onToggleDark, superStreak, setSuperStreak, globalEarnings, setGlobalEarnings, onClearData }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const inputStyle = {
    padding: '8px 12px', borderRadius: 8,
    border: `1px solid ${dark ? '#475569' : '#e2e8f0'}`,
    background: dark ? '#334155' : '#f8faff',
    color: dark ? '#f1f5f9' : '#1e293b',
    fontWeight: 700, outline: 'none', fontSize: 14,
    width: 140,
  };

  const cardStyle = {
    background: dark ? '#1e293b' : '#ffffff',
    border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
    borderRadius: 16, padding: '22px 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontWeight: 900, fontSize: 26, color: dark ? '#f1f5f9' : '#1e293b', margin: 0, letterSpacing: '-0.5px' }}>
          Settings ⚙️
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 14, margin: '4px 0 0' }}>Customize your HabitForge experience</p>
      </div>

      {/* Appearance */}
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
            border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s ease',
          }}>
            <div style={{
              position: 'absolute', width: 20, height: 20, borderRadius: '50%',
              background: 'white', top: 4, left: dark ? 26 : 4,
              transition: 'left 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>
      </div>

      {/* Data */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', margin: '0 0 18px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Data</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[
            {
              label: 'Global Earnings (₹)',
              desc: 'Set your cumulative total earned towards ₹2L goal',
              control: <input type="number" min="0" value={globalEarnings} onChange={e => { const v = Number(e.target.value); setGlobalEarnings(v); set('hf_earnings', v); }} style={inputStyle} />
            },
            {
              label: 'Super Streak',
              desc: 'Manually correct your super streak count',
              control: <input type="number" min="0" value={superStreak} onChange={e => { const v = Number(e.target.value); setSuperStreak(v); set('hf_super_streak', v); }} style={{ ...inputStyle, width: 100 }} />
            }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: dark ? '#f1f5f9' : '#1e293b' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{item.desc}</div>
              </div>
              {item.control}
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ ...cardStyle, border: `1px solid ${dark ? '#7f1d1d' : '#fecaca'}`, background: dark ? '#1e293b' : '#fff5f5' }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', margin: '0 0 18px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Danger Zone</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: dark ? '#f1f5f9' : '#1e293b' }}>Reset All Data</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Clear all history, streaks, earnings — start from zero</div>
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
                padding: '8px 16px', borderRadius: 10, border: `1px solid ${dark ? '#475569' : '#e2e8f0'}`,
                background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 700, fontSize: 13,
              }}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('hf_dark') === 'true');
  const [active, setActive] = useState('today');
  const [today, setToday] = useState(() => getTodayDate());

  // Load tasks from storage — but check if day has advanced first
  const [tasks, setTasksRaw] = useState(() => {
    const savedTasks = (() => {
      try {
        const s = localStorage.getItem('hf_tasks_v3');
        return s ? JSON.parse(s) : null;
      } catch { return null; }
    })();

    // Check if we're on a new day
    const todayStr = getTodayDate();
    const { advanced } = checkAndAdvanceDay(savedTasks || INITIAL_TASKS, todayStr);
    if (advanced) {
      // New day — reset tasks but keep streaks
      const reset = INITIAL_TASKS.map((init, i) => ({
        ...init,
        streak: savedTasks?.[i]?.streak || 0,
      }));
      localStorage.setItem('hf_tasks_v3', JSON.stringify(reset));
      return reset;
    }
    return savedTasks || INITIAL_TASKS;
  });

  const [superStreak, setSuperStreak] = useState(() => {
    const v = localStorage.getItem('hf_super_streak');
    return v !== null ? Number(v) : 0;
  });

  const [globalEarnings, setGlobalEarnings] = useState(() => {
    const v = localStorage.getItem('hf_earnings');
    return v !== null ? Number(v) : 0;
  });

  const [history, setHistory] = useState(() => loadHistory());

  // Setters that also persist
  const setTasks = useCallback((updater) => {
    setTasksRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem('hf_tasks_v3', JSON.stringify(next));
      const curToday = getTodayDate();
      saveToday(next, curToday); // auto-save today's data to history
      setHistory(loadHistory()); // refresh history
      return next;
    });
  }, []);

  // Listen to tab visibility and focus to update date, and set interval
  useEffect(() => {
    const updateToday = () => {
      const cur = getTodayDate();
      setToday(prev => {
        if (prev !== cur) {
          setTasksRaw(prevTasks => {
            const { advanced } = checkAndAdvanceDay(prevTasks, cur);
            if (advanced) {
              const reset = INITIAL_TASKS.map((init, i) => ({
                ...init,
                streak: prevTasks?.[i]?.streak || 0,
              }));
              localStorage.setItem('hf_tasks_v3', JSON.stringify(reset));
              saveToday(reset, cur);
              setHistory(loadHistory());
              return reset;
            }
            return prevTasks;
          });
          return cur;
        }
        return prev;
      });
    };

    // Run once
    updateToday();

    // Listeners
    window.addEventListener('focus', updateToday);
    document.addEventListener('visibilitychange', updateToday);

    // Check every 30 seconds
    const interval = setInterval(updateToday, 30000);

    return () => {
      window.removeEventListener('focus', updateToday);
      document.removeEventListener('visibilitychange', updateToday);
      clearInterval(interval);
    };
  }, [tasks]);

  // Theme
  useEffect(() => {
    document.body.className = dark ? 'dark' : '';
    localStorage.setItem('hf_dark', dark);
  }, [dark]);

  const totalPoints = useMemo(() => tasks.reduce((s, t) => s + t.pointsEarned, 0), [tasks]);

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
        if (t.id === 'earning') {
          const earned = Number(t.inputValue || 0);
          setGlobalEarnings(e => {
            const next = completing ? (e + earned) : Math.max(0, e - earned);
            localStorage.setItem('hf_earnings', next);
            return next;
          });
        }
        return {
          ...t,
          completed: completing,
          streak: completing ? t.streak + 1 : Math.max(0, t.streak - 1),
          pointsEarned: completing ? Math.min(pts, t.maxPoints) : 0,
        };
      });

      // Super Streak — if 4+ tasks completed today, bump it
      const completedCount = updated.filter(t => t.completed).length;
      const prevCompleted = prev.filter(t => t.completed).length;
      // Only bump if we just crossed the 4-task threshold
      if (completedCount >= 4 && prevCompleted < 4) {
        setSuperStreak(s => {
          const next = s + 1;
          localStorage.setItem('hf_super_streak', next);
          return next;
        });
      }

      return updated;
    });
  }, [setTasks]);

  const handleInput = useCallback((id, val) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      let pts = t.completed ? t.basePoints : 0;
      if (t.completed && t.id === 'upsc') {
        pts += Math.min(Number(val || 0), 5);
      }
      if (t.completed && t.id === 'earning') {
        const oldVal = Number(t.inputValue || 0);
        const newVal = Number(val || 0);
        setGlobalEarnings(e => {
          const next = e - oldVal + newVal;
          localStorage.setItem('hf_earnings', next);
          return next;
        });
      }
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

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const bg = dark ? '#0f172a' : '#f0f4ff';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg, transition: 'background 0.3s ease' }}>
      {/* Left Sidebar */}
      <Sidebar
        active={active}
        setActive={setActive}
        points={totalPoints}
        superStreak={superStreak}
        dark={dark}
      />

      {/* Main Content */}
      <main style={{ marginLeft: 240, flex: 1, padding: '28px 28px 28px 32px', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button
            onClick={() => setDark(d => !d)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 18px', borderRadius: 10,
              border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
              background: dark ? '#1e293b' : 'white',
              cursor: 'pointer', fontWeight: 600, fontSize: 13,
              color: dark ? '#f1f5f9' : '#475569',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
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
            globalEarnings={globalEarnings}
            setGlobalEarnings={setGlobalEarnings}
            onClearData={handleClearData}
          />
        )}
      </main>

      {/* Right Calendar Panel */}
      <div style={{
        width: 320,
        padding: '28px 20px 28px 0',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{ marginBottom: 8, marginTop: 52 }}>
          <h3 style={{ fontWeight: 800, fontSize: 16, color: dark ? '#f1f5f9' : '#1e293b', margin: 0 }}>
            Year Progress 🗓️
          </h3>
          <p style={{ fontSize: 11, color: '#94a3b8', margin: '3px 0 0' }}>
            Today → Next year · Hover a day for details
          </p>
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
            This Month's Activity
          </h4>
          {(() => {
            const thisMonth = new Date().toISOString().slice(0, 7);
            const monthData = history.filter(h => h.date.startsWith(thisMonth));
            const daysLogged = monthData.length;
            const avgPts = daysLogged > 0 ? Math.round(monthData.reduce((s, h) => s + h.points, 0) / daysLogged) : 0;
            const perfectDays = monthData.filter(h => h.points >= 40).length;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Days logged', value: daysLogged, color: '#6366f1' },
                  { label: 'Avg score', value: daysLogged > 0 ? `${avgPts}/50` : '—', color: '#f59e0b' },
                  { label: 'Perfect days (40+)', value: perfectDays, color: '#22c55e' },
                ].map((stat, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{stat.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: stat.color }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Today card */}
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
            {tasks.filter(t => t.completed).length}/5 habits completed
          </div>
        </div>
      </div>
    </div>
  );
}
