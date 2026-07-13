import React from 'react';
import {
  CheckSquare, BarChart3, Lightbulb, Settings,
  Flame, Trophy
} from 'lucide-react';

const NAV = [
  { id: 'today', label: "Today's Check-In", icon: CheckSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'inspiration', label: 'Inspiration', icon: Lightbulb },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ active, setActive, points, superStreak, dark }) {
  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: dark ? '#1e293b' : '#ffffff',
        borderRight: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        boxShadow: '4px 0 24px rgba(0,0,0,0.04)',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
          }}>🔥</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: dark ? '#f1f5f9' : '#1e293b', letterSpacing: '-0.3px' }}>HabitForge</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Daily Excellence</div>
          </div>
        </div>
      </div>

      {/* Today's score mini card */}
      <div style={{
        margin: '0 16px 20px',
        padding: '12px 16px',
        borderRadius: 12,
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: 'white',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, marginBottom: 4 }}>TODAY'S SCORE</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 800 }}>{points}</span>
          <span style={{ fontSize: 14, opacity: 0.75 }}>/50 pts</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 99, marginTop: 8 }}>
          <div style={{ height: '100%', width: `${(points / 50) * 100}%`, background: 'rgba(255,255,255,0.9)', borderRadius: 99, transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                background: isActive
                  ? (dark ? 'rgba(99,102,241,0.15)' : '#eef2ff')
                  : 'transparent',
                color: isActive ? '#6366f1' : (dark ? '#94a3b8' : '#64748b'),
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = dark ? '#334155' : '#f8faff'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Super Streak */}
      <div style={{ padding: '16px', margin: '12px 16px', borderRadius: 12, background: dark ? '#334155' : '#fff7ed', border: `1px solid ${dark ? '#475569' : '#fed7aa'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🔥</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#f97316', letterSpacing: '0.5px' }}>SUPER STREAK</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: dark ? '#fb923c' : '#ea580c' }}>{superStreak} Days</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
