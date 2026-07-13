import React, { useState } from 'react';
import { ChevronDown, Clock, IndianRupee } from 'lucide-react';

function StarRating({ value, onChange, color }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          className="star-btn"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          style={{ color: s <= (hover || value) ? '#f59e0b' : '#d1d5db', fontSize: 26 }}
        >
          ★
        </button>
      ))}
      {value > 0 && (
        <span style={{ marginLeft: 6, fontSize: 13, color: '#64748b', fontWeight: 500 }}>
          +{value} bonus pts
        </span>
      )}
    </div>
  );
}

export function HabitCard({ task, onToggle, onUpdateInput, onUpdateStars, dark }) {
  const [expanded, setExpanded] = useState(false);
  const hasExpand = task.type !== 'boolean';

  const handleCheck = () => {
    onToggle(task.id);
    if (!task.completed && hasExpand) setExpanded(true);
  };

  return (
    <div
      className="card-hover"
      style={{
        background: task.completed
          ? (dark ? `${task.color}22` : task.bgColor)
          : (dark ? '#1e293b' : '#ffffff'),
        border: `1.5px solid ${task.completed ? task.color + '55' : (dark ? '#334155' : '#e2e8f0')}`,
        borderRadius: 16,
        padding: '20px 22px',
        boxShadow: task.completed
          ? `0 4px 20px ${task.color}22`
          : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Top Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

        {/* Checkbox */}
        <button
          onClick={handleCheck}
          style={{
            width: 28, height: 28,
            borderRadius: 8,
            border: `2.5px solid ${task.completed ? task.color : (dark ? '#475569' : '#cbd5e1')}`,
            background: task.completed ? task.color : (dark ? '#334155' : 'white'),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            fontSize: 14,
            color: 'white',
            transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
            transform: task.completed ? 'scale(1.05)' : 'scale(1)',
            boxShadow: task.completed ? `0 2px 8px ${task.color}44` : 'none',
          }}
        >
          {task.completed && '✓'}
        </button>

        {/* Emoji + Info */}
        <div
          style={{
            width: 42, height: 42, borderRadius: 12,
            background: dark ? '#334155' : task.bgColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
          }}
        >
          {task.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: 700,
            fontSize: 15,
            color: dark ? '#f1f5f9' : '#1e293b',
            textDecoration: task.completed ? 'line-through' : 'none',
            opacity: task.completed ? 0.7 : 1,
          }}>
            {task.title}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>{task.description}</div>
        </div>

        {/* Right side: streak + points + expand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 99,
            background: task.streak > 0 ? '#fff7ed' : (dark ? '#334155' : '#f8faff'),
            border: `1px solid ${task.streak > 0 ? '#fed7aa' : (dark ? '#475569' : '#e2e8f0')}`,
          }}>
            <span style={{ fontSize: 13 }}>🔥</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: task.streak > 0 ? '#f97316' : '#94a3b8' }}>
              {task.streak}
            </span>
          </div>

          <div style={{
            fontWeight: 800,
            fontSize: 16,
            color: task.completed ? task.color : (dark ? '#475569' : '#cbd5e1'),
            width: 34,
            textAlign: 'right',
          }}>
            +{task.pointsEarned}
          </div>

          {hasExpand && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#94a3b8' }}
            >
              <ChevronDown
                size={18}
                style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
              />
            </button>
          )}
        </div>
      </div>

      {/* Max points label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 8 }}>
        <div style={{
          height: 4, flex: 1,
          background: dark ? '#334155' : '#f1f5f9',
          borderRadius: 99, overflow: 'hidden', marginRight: 10
        }}>
          <div style={{
            height: '100%',
            width: `${(task.pointsEarned / task.maxPoints) * 100}%`,
            background: task.color,
            borderRadius: 99,
            transition: 'width 0.4s ease',
          }} />
        </div>
        <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>
          {task.pointsEarned}/{task.maxPoints} pts
        </span>
      </div>

      {/* Expandable Input Section */}
      {hasExpand && expanded && task.completed && (
        <div
          className="expand-down"
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: `1px dashed ${dark ? '#334155' : '#e2e8f0'}`,
          }}
        >
          {task.type === 'hours' && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: dark ? '#94a3b8' : '#64748b', display: 'block', marginBottom: 8 }}>
                ⏱️ How many hours did you study today?
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: dark ? '#334155' : '#f8faff',
                  border: `1.5px solid ${dark ? '#475569' : '#e2e8f0'}`,
                  borderRadius: 10, padding: '8px 14px', flex: 1,
                }}>
                  <Clock size={16} color="#3b82f6" />
                  <input
                    type="number"
                    min="0" max="10"
                    placeholder="e.g. 3"
                    value={task.inputValue}
                    onChange={e => onUpdateInput(task.id, e.target.value)}
                    style={{
                      border: 'none', background: 'transparent', outline: 'none',
                      fontSize: 15, fontWeight: 600, color: dark ? '#f1f5f9' : '#1e293b',
                      width: '100%',
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  1 hr = +1 pt (max 5)
                </span>
              </div>
            </div>
          )}

          {task.type === 'earning' && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: dark ? '#94a3b8' : '#64748b', display: 'block', marginBottom: 8 }}>
                💰 How much did you earn today?
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: dark ? '#334155' : '#f0fdf4',
                border: `1.5px solid ${dark ? '#475569' : '#bbf7d0'}`,
                borderRadius: 10, padding: '10px 14px',
              }}>
                <IndianRupee size={16} color="#22c55e" />
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 1500"
                  value={task.inputValue}
                  onChange={e => onUpdateInput(task.id, e.target.value)}
                  style={{
                    border: 'none', background: 'transparent', outline: 'none',
                    fontSize: 15, fontWeight: 600, color: dark ? '#f1f5f9' : '#1e293b',
                    width: '100%',
                  }}
                />
              </div>
              <p style={{ marginTop: 6, fontSize: 12, color: '#22c55e', fontWeight: 500 }}>
                💡 This adds to your global ₹2,00,000 milestone
              </p>
            </div>
          )}

          {task.type === 'stars' && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: dark ? '#94a3b8' : '#64748b', display: 'block', marginBottom: 10 }}>
                ⭐ Rate your session quality
              </label>
              <StarRating
                value={task.stars || 0}
                onChange={v => onUpdateStars(task.id, v)}
                color={task.color}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
