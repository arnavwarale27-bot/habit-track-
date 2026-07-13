import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend, RadialBarChart, RadialBar
} from 'recharts';
import { TrendingUp, BarChart3, AlertCircle, Award, BookOpen, IndianRupee } from 'lucide-react';

function EmptyState({ icon: Icon, title, message, dark }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '52px 24px', textAlign: 'center', gap: 14,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: `linear-gradient(135deg, ${dark ? '#1e293b' : '#f8faff'}, ${dark ? '#334155' : '#eef2ff'})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `2px dashed ${dark ? '#475569' : '#c7d2fe'}`,
      }}>
        <Icon size={30} color="#a5b4fc" />
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 17, color: dark ? '#cbd5e1' : '#475569', marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: '#94a3b8', maxWidth: 260, lineHeight: 1.7 }}>{message}</div>
      </div>
      <div style={{
        padding: '8px 20px', borderRadius: 99,
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: 'white', fontSize: 13, fontWeight: 700,
        boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
      }}>
        Complete habits today to unlock! 🚀
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, dark }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: dark ? '#1e293b' : 'white',
        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
        borderRadius: 12, padding: '12px 16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: dark ? '#f1f5f9' : '#1e293b' }}>{label}</div>
        {payload.map((entry, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: 99, background: entry.color }} />
            <span style={{ color: dark ? '#94a3b8' : '#64748b' }}>{entry.name}:</span>
            <span style={{ color: entry.color, fontWeight: 700 }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function StatBadge({ icon: Icon, label, value, color, bg, dark }) {
  return (
    <div style={{
      padding: '16px 18px',
      background: dark ? '#334155' : bg,
      borderRadius: 14,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: dark ? '#475569' : 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 2px 8px ${color}33`,
      }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, color: dark ? '#f1f5f9' : '#1e293b' }}>{value}</div>
        <div style={{ fontSize: 11, color: dark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}

export function Analytics({ history, dark }) {
  const [filter, setFilter] = React.useState('week');

  const data = useMemo(() => {
    const n = filter === 'day' ? 1 : filter === 'week' ? 7 : 30;
    // Take last N entries, format date nicely
    return history.slice(-n).map(h => ({
      ...h,
      date: new Date(h.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    }));
  }, [history, filter]);

  const hasData = history.length > 0;
  const chartHasData = data.length > 0;
  const hasEarningsData = data.some(d => d.earnings > 0 || d.upscHours > 0);

  const totalDays = history.length;
  const avgPoints = totalDays > 0 ? Math.round(history.reduce((s, h) => s + h.points, 0) / totalDays) : 0;
  const bestStreak = (() => {
    let best = 0, cur = 0;
    history.forEach(h => { if (h.tasksCompleted >= 4) { cur++; best = Math.max(best, cur); } else cur = 0; });
    return best;
  })();
  const totalEarnings = history.reduce((s, h) => s + h.earnings, 0);

  const cardBase = {
    background: dark ? '#1e293b' : '#ffffff',
    border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
    borderRadius: 18,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  };

  const axisStyle = { fontSize: 11, fill: dark ? '#64748b' : '#94a3b8' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: 26, color: dark ? '#f1f5f9' : '#1e293b', margin: 0, letterSpacing: '-0.5px' }}>
            Analytics 📊
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 14, margin: '4px 0 0', fontWeight: 500 }}>
            {hasData ? `${totalDays} days tracked · Your journey so far` : 'Start completing habits to see your analytics'}
          </p>
        </div>
        {hasData && (
          <div style={{
            display: 'flex', gap: 4,
            background: dark ? '#334155' : '#f1f5f9',
            padding: 4, borderRadius: 12,
          }}>
            {[['day', 'Today'], ['week', 'Week'], ['month', 'Month']].map(([f, label]) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 13,
                background: filter === f ? (dark ? '#475569' : 'white') : 'transparent',
                color: filter === f ? '#6366f1' : '#94a3b8',
                boxShadow: filter === f ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
              }}>{label}</button>
            ))}
          </div>
        )}
      </div>

      {/* Summary stats */}
      {hasData ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          <StatBadge icon={Award} label="Avg Daily Score" value={`${avgPoints}/50`} color="#6366f1" bg="#eef2ff" dark={dark} />
          <StatBadge icon={TrendingUp} label="Best Super Streak" value={`${bestStreak}d`} color="#f59e0b" bg="#fffbeb" dark={dark} />
          <StatBadge icon={IndianRupee} label="Total Earned" value={`₹${totalEarnings.toLocaleString('en-IN')}`} color="#22c55e" bg="#f0fdf4" dark={dark} />
          <StatBadge icon={BookOpen} label="Days Tracked" value={totalDays} color="#8b5cf6" bg="#faf5ff" dark={dark} />
        </div>
      ) : (
        <div style={{ ...cardBase, padding: 0 }}>
          <EmptyState
            icon={BarChart3}
            title="No data yet — start today!"
            message="Your analytics will appear here as you complete daily habits. Every day you log builds this picture."
            dark={dark}
          />
        </div>
      )}

      {/* Charts */}
      {hasData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>

          {/* Performance Line */}
          <div style={{ ...cardBase, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={18} color="#6366f1" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: dark ? '#f1f5f9' : '#1e293b' }}>Daily Score</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Points earned per day (max 50)</div>
              </div>
            </div>
            {!chartHasData ? (
              <EmptyState icon={AlertCircle} title="No data for this period" message="Try selecting a wider time range." dark={dark} />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#334155' : '#f1f5f9'} />
                  <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 50]} tick={axisStyle} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip dark={dark} />} />
                  <Line type="monotone" dataKey="points" name="Score" stroke="#6366f1" strokeWidth={3}
                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, stroke: '#6366f1', fill: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Hustle vs Grind */}
          <div style={{ ...cardBase, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={18} color="#22c55e" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: dark ? '#f1f5f9' : '#1e293b' }}>Hustle vs Grind</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Study hours vs Earnings</div>
              </div>
            </div>
            {!hasEarningsData ? (
              <EmptyState icon={AlertCircle} title="Log your hours & earnings" message="Tick the UPSC and Earning tasks and enter your data to see this chart." dark={dark} />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#334155' : '#f1f5f9'} />
                  <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip dark={dark} />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Bar yAxisId="left" dataKey="upscHours" name="Study Hrs" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar yAxisId="right" dataKey="earnings" name="Earnings ₹" fill="#22c55e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
