import React, { useMemo } from 'react';
import { HabitCard } from '../components/HabitCard';
import { Trophy, Zap, Target, IndianRupee, CalendarCheck } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color, bg, dark }) {
  return (
    <div style={{
      background: dark ? '#1e293b' : '#ffffff',
      border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
      borderRadius: 14,
      padding: '16px 18px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: dark ? '#334155' : bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 21, fontWeight: 900, color: dark ? '#f1f5f9' : '#1e293b' }}>{value}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginTop: 1 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: color, fontWeight: 700, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export function TodayPage({ tasks, onToggle, onUpdateInput, onUpdateStars, globalEarnings, superStreak, dark, today }) {
  const totalPoints = useMemo(() => tasks.reduce((s, t) => s + t.pointsEarned, 0), [tasks]);
  const completedCount = tasks.filter(t => t.completed).length;
  const MILESTONE = 200000;
  const earningPct = Math.min((globalEarnings / MILESTONE) * 100, 100);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const dateStr = new Date(today + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const message = completedCount === 0
    ? "Fresh start — let's crush today's habits! 💪"
    : completedCount < 3 ? `${completedCount} done, keep the momentum! 🔥`
    : completedCount < 5 ? `Almost there! ${5 - completedCount} more to go ⚡`
    : "ALL DONE! You're an absolute legend today. 🏆";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Welcome Banner */}
      <div style={{
        borderRadius: 20,
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a78bfa 100%)',
        padding: '26px 28px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(99,102,241,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* BG deco */}
        {[['-30', '-30', '160', '160'], ['auto', '-20', '80', '80', 'bottom:20px']].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: i === 0 ? -30 : 'auto',
            bottom: i === 1 ? -40 : 'auto',
            right: i === 0 ? -30 : 60,
            width: i === 0 ? 160 : 100,
            height: i === 0 ? 160 : 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }} />
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 6 }}>
            📅 {dateStr}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'white', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
            {greeting}, Arnav! 🚀
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: 0, fontWeight: 500 }}>
            {message}
          </p>
        </div>

        {/* Live score badge */}
        <div style={{
          position: 'relative', zIndex: 1,
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          borderRadius: 16, padding: '16px 22px',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.2)',
          flexShrink: 0,
          minWidth: 110,
        }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: 'white', lineHeight: 1 }}>{totalPoints}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>/ 50 pts</div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 99, marginTop: 10 }}>
            <div style={{ height: '100%', width: `${(totalPoints / 50) * 100}%`, background: 'white', borderRadius: 99, transition: 'width 0.5s ease' }} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        <StatCard icon={Trophy} label="Today's Score" value={`${totalPoints}/50`} sub="Points earned" color="#6366f1" bg="#eef2ff" dark={dark} />
        <StatCard icon={Zap} label="Habits Done" value={`${completedCount}/5`} sub="Check them off!" color="#f59e0b" bg="#fffbeb" dark={dark} />
        <StatCard icon={Target} label="Super Streak" value={superStreak > 0 ? `${superStreak}d` : '—'} sub={superStreak > 0 ? 'Keep it up!' : 'Complete 4+ habits'} color="#ef4444" bg="#fff1f2" dark={dark} />
        <StatCard icon={IndianRupee} label="Earning Goal" value={`${earningPct.toFixed(0)}%`} sub="₹2L milestone" color="#22c55e" bg="#f0fdf4" dark={dark} />
        <StatCard icon={CalendarCheck} label="Today Status" value={completedCount >= 4 ? '🔥 Super' : `${completedCount}/5`} sub={completedCount >= 4 ? 'Streak extended!' : '4+ for super streak'} color="#8b5cf6" bg="#faf5ff" dark={dark} />
      </div>

      {/* Earning Milestone Bar */}
      <div style={{
        background: dark ? '#1e293b' : '#ffffff',
        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
        borderRadius: 16, padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>💰</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: dark ? '#f1f5f9' : '#1e293b' }}>Earning Milestone</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Road to ₹2,00,000</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 900, fontSize: 20, color: '#22c55e' }}>₹{globalEarnings.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>of ₹2,00,000</div>
          </div>
        </div>
        <div style={{ height: 10, background: dark ? '#334155' : '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${earningPct}%`,
            background: 'linear-gradient(90deg, #22c55e, #16a34a)',
            borderRadius: 99, transition: 'width 0.8s ease',
            boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>₹0</span>
          <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>{earningPct.toFixed(1)}% complete</span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>₹2,00,000</span>
        </div>
      </div>

      {/* Habits Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: dark ? '#f1f5f9' : '#1e293b', margin: 0 }}>
            Today's 5 Habits
          </h2>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
            background: '#eef2ff', color: '#6366f1',
          }}>50 pts max</span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
            background: dark ? '#334155' : '#f8faff', color: '#94a3b8',
          }}>Resets daily</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tasks.map((task, i) => (
            <div key={task.id} style={{ animation: `slideUp 0.3s ease ${i * 0.05}s both` }}>
              <HabitCard
                task={task}
                onToggle={onToggle}
                onUpdateInput={onUpdateInput}
                onUpdateStars={onUpdateStars}
                dark={dark}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Super streak celebration */}
      {completedCount >= 4 && (
        <div style={{
          borderRadius: 16,
          background: 'linear-gradient(135deg, #fffbeb, #fef9c3)',
          border: '1px solid #fde68a',
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 4px 16px rgba(251,191,36,0.15)',
        }}>
          <div style={{ fontSize: 42 }}>🔥</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 17, color: '#b45309', marginBottom: 4 }}>
              Super Streak Extended! Day {superStreak}!
            </div>
            <div style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>
              You completed {completedCount}/5 habits today. Your discipline compounds silently — keep showing up!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
