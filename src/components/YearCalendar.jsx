import React, { useMemo, useState } from 'react';
import { generateYearDates } from '../data/storage';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS_LABEL = ['S','M','T','W','T','F','S'];

function getColor(points, isFuture, isToday, dark) {
  if (isToday) return null; // handled by border
  if (isFuture) return dark ? '#1e293b' : '#f1f5f9';
  if (points === undefined || points === null) return dark ? '#334155' : '#e2e8f0'; // past, no data
  if (points === 0) return '#fecaca'; // did nothing
  if (points <= 20) return '#bbf7d0';
  if (points <= 35) return '#4ade80';
  return '#22c55e';
}

export function YearCalendar({ history, dark, today }) {
  const [tooltip, setTooltip] = useState(null);

  // Build a map of date -> entry
  const dataMap = useMemo(() => {
    const map = {};
    history.forEach(h => { map[h.date] = h; });
    return map;
  }, [history]);

  // Generate all dates and group by week
  const weeks = useMemo(() => {
    const allDates = generateYearDates();
    const startDate = new Date(allDates[0]);

    // Pad the beginning to align to Sunday
    const startDow = startDate.getDay(); // 0=Sun
    const padded = Array(startDow).fill(null).concat(allDates);

    const ws = [];
    for (let i = 0; i < padded.length; i += 7) {
      ws.push(padded.slice(i, i + 7));
    }
    return ws;
  }, []);

  // Month labels — find which week each month starts
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstDate = week.find(d => d !== null);
      if (!firstDate) return;
      const m = new Date(firstDate).getMonth();
      if (m !== lastMonth) {
        labels.push({ wi, label: MONTHS[m] });
        lastMonth = m;
      }
    });
    return labels;
  }, [weeks]);

  const cellSize = 11;
  const gap = 3;

  return (
    <div style={{
      background: dark ? '#1e293b' : '#ffffff',
      border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
      borderRadius: 16,
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: dark ? '#f1f5f9' : '#1e293b', margin: 0 }}>Year Journey 🗓️</h3>
          <p style={{ fontSize: 11, color: '#94a3b8', margin: '3px 0 0' }}>
            {history.length} days logged · {history.filter(h => h.points >= 40).length} perfect days
          </p>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>Less</span>
          {['#e2e8f0', '#bbf7d0', '#4ade80', '#22c55e'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
          ))}
          <span style={{ fontSize: 10, color: '#94a3b8' }}>More</span>
        </div>
      </div>

      {/* Calendar grid with overflow scroll */}
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Month labels */}
          <div style={{
            display: 'flex',
            marginLeft: 18,
            marginBottom: 4,
            gap: gap,
          }}>
            {(() => {
              const elements = [];
              let lastWi = 0;
              monthLabels.forEach(({ wi, label }, i) => {
                const spacer = (wi - lastWi) * (cellSize + gap);
                if (i > 0) elements.push(
                  <div key={`sp-${i}`} style={{ width: spacer, flexShrink: 0 }} />
                );
                elements.push(
                  <div key={label + wi} style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {label}
                  </div>
                );
                lastWi = wi;
              });
              return elements;
            })()}
          </div>

          <div style={{ display: 'flex', gap: gap }}>
            {/* Day of week labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: gap, marginTop: 1 }}>
              {DAYS_LABEL.map((d, i) => (
                <div key={i} style={{
                  width: 12, height: cellSize,
                  fontSize: 9, color: '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600,
                }}>
                  {i % 2 === 0 ? d : ''}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap }}>
                {week.map((date, di) => {
                  if (!date) {
                    return <div key={di} style={{ width: cellSize, height: cellSize }} />;
                  }

                  const entry = dataMap[date];
                  const isFuture = date > today;
                  const isToday = date === today;
                  const color = getColor(entry?.points, isFuture, isToday, dark);

                  return (
                    <div
                      key={date}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          date,
                          points: entry?.points ?? null,
                          tasks: entry?.tasksCompleted ?? null,
                          isFuture,
                          x: rect.left,
                          y: rect.top,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        borderRadius: 3,
                        background: color || (dark ? '#1e3a5f' : '#dbeafe'),
                        border: isToday ? '2px solid #6366f1' : '1px solid transparent',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        transition: 'transform 0.1s ease',
                        flexShrink: 0,
                      }}
                      onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.3)'; }}
                      onFocus={() => {}}
                      onBlur={() => {}}
                      role="button"
                      tabIndex={0}
                      aria-label={`${date}: ${entry?.points ?? 0} points`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip portal */}
      {tooltip && (
        <div style={{
          position: 'fixed',
          top: tooltip.y - 70,
          left: tooltip.x - 40,
          background: dark ? '#0f172a' : '#1e293b',
          color: 'white',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 12,
          zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 2 }}>
            {new Date(tooltip.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          {tooltip.isFuture ? (
            <div style={{ color: '#94a3b8' }}>Future day</div>
          ) : tooltip.points !== null ? (
            <>
              <div style={{ color: '#4ade80' }}>⚡ {tooltip.points}/50 points</div>
              <div style={{ color: '#94a3b8' }}>{tooltip.tasks}/5 habits done</div>
            </>
          ) : (
            <div style={{ color: '#94a3b8' }}>No data logged</div>
          )}
        </div>
      )}
    </div>
  );
}
