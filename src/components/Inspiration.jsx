import React, { useState } from 'react';
import { getEndDate } from '../data/storage';
import { RefreshCw, Heart, Target } from 'lucide-react';

const QUOTES = [
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Believe it. Build it.", author: "Unknown" },
  { text: "Work hard in silence, let success make the noise.", author: "Frank Ocean" },
  { text: "One day or day one. You decide.", author: "Unknown" },
  { text: "The harder you work, the greater you'll feel when you achieve it.", author: "Unknown" },
];

const AFFIRMATIONS = [
  "I am disciplined. I show up every single day. 🔥",
  "My consistency today shapes my destiny tomorrow. ⚡",
  "I am building the life I deserve, one habit at a time. 💪",
  "I don't just dream — I execute. 🎯",
  "Every rep, every hour, every rupee earned matters. 💰",
  "I am becoming the person I want to be. 🌟",
  "No shortcuts. No excuses. Just work. 🛠️",
];

const GOALS = [
  { emoji: '🎯', label: 'Clear UPSC Prelims 2026', type: 'milestone' },
  { emoji: '💰', label: 'Earn ₹2,00,000', dataKey: 'earnings', total: 200000 },
  { emoji: '🎬', label: 'Grow to 10,000 followers', type: 'milestone' },
  { emoji: '💪', label: '30 junk-free days in a row', type: 'milestone' },
  { emoji: '⚡', label: 'Ship 1 SaaS product', type: 'milestone' },
];

export function Inspiration({ dark, globalEarnings, today }) {
  const todayObj = new Date(today + 'T00:00:00');
  const dayOfYear = Math.floor((todayObj - new Date(todayObj.getFullYear(), 0, 0)) / 86400000);
  const quoteIdx = dayOfYear % QUOTES.length;
  const [affIdx, setAffIdx] = useState(0);

  // Days remaining to year end
  const yearEndDate = getEndDate();
  const yearEnd = new Date(yearEndDate + 'T00:00:00');
  const daysLeft = Math.ceil((yearEnd - todayObj) / 86400000);

  const cardBase = {
    background: dark ? '#1e293b' : '#ffffff',
    border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
    borderRadius: 18,
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontWeight: 900, fontSize: 26, color: dark ? '#f1f5f9' : '#1e293b', margin: 0, letterSpacing: '-0.5px' }}>
          Inspiration ✨
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 14, margin: '4px 0 0', fontWeight: 500 }}>
          {daysLeft} days left in your journey · Stay hungry, stay foolish
        </p>
      </div>

      {/* Quote of the day */}
      <div style={{
        borderRadius: 20,
        background: 'linear-gradient(135deg, #1e3a5f 0%, #1e293b 100%)',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(30,58,95,0.3)',
      }}>
        {/* Decorative dots */}
        {[
          { top: -30, right: 60, size: 140, opacity: 0.08 },
          { bottom: -40, left: -20, size: 120, opacity: 0.06 },
          { top: 20, right: -20, size: 80, opacity: 0.05 },
        ].map((d, i) => (
          <div key={i} style={{
            position: 'absolute', top: d.top, bottom: d.bottom, left: d.left, right: d.right,
            width: d.size, height: d.size, borderRadius: '50%',
            background: `rgba(99,102,241,${d.opacity})`,
            border: '1px solid rgba(99,102,241,0.1)',
          }} />
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', letterSpacing: '2px', marginBottom: 14 }}>
            ✦ QUOTE OF THE DAY
          </div>
          <div style={{ fontSize: 21, fontWeight: 700, color: 'white', lineHeight: 1.6, marginBottom: 16, maxWidth: 560 }}>
            "{QUOTES[quoteIdx].text}"
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>
            — {QUOTES[quoteIdx].author}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Daily Affirmation */}
        <div style={cardBase}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🙌</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: dark ? '#f1f5f9' : '#1e293b' }}>
                Today's Affirmation
              </span>
            </div>
            <button
              onClick={() => setAffIdx((affIdx + 1) % AFFIRMATIONS.length)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 12px', borderRadius: 8,
                border: `1px solid ${dark ? '#475569' : '#e2e8f0'}`,
                background: 'transparent', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, color: '#6366f1',
              }}
            >
              <RefreshCw size={11} /> Refresh
            </button>
          </div>
          <div style={{
            background: dark ? '#0f172a' : '#fafbff',
            borderRadius: 12, padding: '18px 20px',
            fontSize: 15, fontWeight: 700,
            color: dark ? '#f1f5f9' : '#1e293b',
            lineHeight: 1.65,
            border: `1.5px dashed ${dark ? '#334155' : '#c7d2fe'}`,
            minHeight: 80,
          }}>
            {AFFIRMATIONS[affIdx]}
          </div>
        </div>

        {/* Days countdown */}
        <div style={{
          ...cardBase,
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          border: '1px solid #bbf7d0',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          textAlign: 'center', gap: 8,
        }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: '#15803d', lineHeight: 1 }}>{daysLeft}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#16a34a' }}>Days remaining</div>
          <div style={{ fontSize: 12, color: '#4ade80' }}>
            in your year-long journey from today to {new Date(yearEndDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Goals */}
      <div style={cardBase}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <Target size={20} color="#6366f1" />
          <span style={{ fontWeight: 800, fontSize: 17, color: dark ? '#f1f5f9' : '#1e293b' }}>Your Big Goals</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {GOALS.map((goal, i) => {
            const isEarning = goal.dataKey === 'earnings';
            const pct = isEarning ? Math.min((globalEarnings / goal.total) * 100, 100) : null;
            return (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: pct !== null ? 8 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{goal.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: dark ? '#cbd5e1' : '#374151' }}>{goal.label}</div>
                      {isEarning && (
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>
                          ₹{globalEarnings.toLocaleString('en-IN')} of ₹{goal.total.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {pct !== null ? (
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#6366f1' }}>{pct.toFixed(1)}%</span>
                    ) : (
                      <span style={{
                        fontSize: 11, padding: '3px 10px', borderRadius: 99,
                        background: dark ? '#334155' : '#fef3c7',
                        color: dark ? '#fbbf24' : '#b45309', fontWeight: 700,
                      }}>Goal</span>
                    )}
                  </div>
                </div>
                {pct !== null && (
                  <div style={{ height: 8, background: dark ? '#334155' : '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                      borderRadius: 99, transition: 'width 0.8s ease',
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational closing */}
      <div style={{
        borderRadius: 18,
        background: dark ? '#1e293b' : 'linear-gradient(135deg, #fffbeb, #fef3c7)',
        border: `1px solid ${dark ? '#334155' : '#fde68a'}`,
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ fontSize: 40 }}>🌟</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: dark ? '#fbbf24' : '#b45309', marginBottom: 4 }}>
            Every legend started where you are now
          </div>
          <div style={{ fontSize: 13, color: dark ? '#94a3b8' : '#92400e', lineHeight: 1.6 }}>
            Your habits compound silently. Each tick today is an investment that pays dividends for years.
          </div>
        </div>
        <Heart size={22} color="#f59e0b" />
      </div>
    </div>
  );
}
