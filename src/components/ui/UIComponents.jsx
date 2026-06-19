import React from 'react';
import { CONF_COLORS, CONF_LABELS, CATEGORY_META, DIFFICULTY_META } from '../../data/constants';
import { Star } from 'lucide-react';

// ── Progress Bar ─────────────────────────────────────────────────────
export function ProgressBar({ value = 0, color = '#6366f1', height = 6, showLabel = false, className = '' }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-500">Progress</span>
          <span className="text-xs font-semibold text-white">{pct}%</span>
        </div>
      )}
      <div className="progress-track" style={{ height }}>
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}bb, ${color})` }}
        />
      </div>
    </div>
  );
}

// ── Confidence Rating (stars) ─────────────────────────────────────────
export function ConfidenceRating({ value = 0, onChange, size = 14, readonly = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          className={`star p-0.5 rounded ${readonly ? 'cursor-default' : 'hover:scale-110'}`}
          title={CONF_LABELS[n]}
        >
          <Star
            size={size}
            fill={n <= value ? CONF_COLORS[value] : 'transparent'}
            stroke={n <= value ? CONF_COLORS[value] : '#374151'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

// ── Category Badge ────────────────────────────────────────────────────
export function CategoryBadge({ category, small = false }) {
  const meta = CATEGORY_META[category] ?? { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', label: category };
  return (
    <span
      className={`badge font-semibold ${small ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'}`}
      style={{ color: meta.color, background: meta.bg }}
    >
      {meta.label}
    </span>
  );
}

// ── Difficulty Badge ──────────────────────────────────────────────────
export function DifficultyBadge({ difficulty }) {
  const meta = DIFFICULTY_META[difficulty] ?? { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', label: difficulty };
  return (
    <span className="badge text-xs font-medium" style={{ color: meta.color, background: meta.bg }}>
      {meta.label}
    </span>
  );
}

// ── Stat Card (dashboard) ─────────────────────────────────────────────
export function StatCard({ label, value, sub, icon: Icon, color = '#6366f1', gradient }) {
  return (
    <div className="card p-4 flex items-start gap-3 animate-fade-up">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}>
        {Icon && <Icon size={17} style={{ color }} strokeWidth={2} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-slate-500 font-medium leading-none mb-1">{label}</p>
        <p className="text-xl font-bold text-white leading-none">{value}</p>
        {sub && <p className="text-[11px] text-slate-600 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────
export function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      {action}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-3">
          <Icon size={22} className="text-slate-600" />
        </div>
      )}
      <p className="text-sm font-medium text-slate-400">{title}</p>
      {sub && <p className="text-xs text-slate-600 mt-1 max-w-xs">{sub}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
