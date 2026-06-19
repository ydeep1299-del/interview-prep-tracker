import React from 'react';
import { BookOpen, CheckCircle, Clock, TrendingUp, AlertTriangle, Zap, ArrowRight, RefreshCw } from 'lucide-react';
import { StatCard, ProgressBar, SectionHeader, CategoryBadge, DifficultyBadge, ConfidenceRating } from '../components/ui/UIComponents';
import { CONF_COLORS, CONF_LABELS } from '../data/constants';
import { useApp } from '../hooks/AppContext';

function ReadinessGauge({ value }) {
  const angle = (value / 100) * 180 - 90;
  const color = value >= 70 ? '#4ade80' : value >= 45 ? '#fb923c' : '#f87171';
  const label = value >= 70 ? 'On Track' : value >= 45 ? 'Improving' : 'Needs Work';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="w-48 h-auto">
        {/* Track */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e1e30" strokeWidth="14" strokeLinecap="round" />
        {/* Fill */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={color} strokeWidth="14"
          strokeLinecap="round" strokeDasharray={`${(value / 100) * 251.3} 251.3`}
          style={{ transition: 'stroke-dasharray 1s ease, stroke 0.4s' }}
        />
        {/* Needle */}
        <g transform={`rotate(${angle}, 100, 100)`}>
          <line x1="100" y1="100" x2="100" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <circle cx="100" cy="100" r="5" fill="white" opacity="0.8" />
        </g>
        {/* Labels */}
        <text x="18" y="115" fill="#475569" fontSize="9" fontFamily="Inter">0</text>
        <text x="92" y="22" fill="#475569" fontSize="9" fontFamily="Inter">50</text>
        <text x="176" y="115" fill="#475569" fontSize="9" fontFamily="Inter">100</text>
      </svg>
      <div className="text-center -mt-2">
        <span className="text-4xl font-extrabold tracking-tight" style={{ color }}>{value}</span>
        <span className="text-slate-500 text-lg font-light">%</span>
        <p className="text-xs mt-1 font-semibold" style={{ color }}>{label}</p>
      </div>
    </div>
  );
}

function WeakTopicRow({ topic }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: CONF_COLORS[topic.confidence] }} />
        <span className="text-xs text-slate-300 truncate">{topic.name}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <CategoryBadge category={topic.category} small />
        <ConfidenceRating value={topic.confidence} readonly size={10} />
      </div>
    </div>
  );
}

export default function Dashboard({ onAddTopic }) {
  const { stats, topics, settings } = useApp();

  const completionPct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Greeting + Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Readiness gauge */}
        <div className="card p-5 col-span-1 flex flex-col items-center justify-center gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-600">Overall Readiness</p>
          <ReadinessGauge value={stats.readiness} />
          <p className="text-[11px] text-slate-600 text-center">
            {stats.readiness >= 70
              ? '🎯 You\'re placement-ready!'
              : stats.readiness >= 45
              ? '📈 Keep going, solid progress!'
              : '💪 More revision needed.'}
          </p>
        </div>

        {/* Stats */}
        <div className="col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-3">
          <StatCard label="Total Topics" value={stats.total} sub="Across all categories" icon={BookOpen} color="#6366f1" />
          <StatCard label="Completed" value={stats.completed} sub={`${completionPct}% done`} icon={CheckCircle} color="#4ade80" />
          <StatCard label="Pending" value={stats.pending} sub="Yet to complete" icon={Clock} color="#fb923c" />
          <StatCard label="Avg Confidence" value={`${stats.avgConf}/5`} sub={CONF_LABELS[Math.round(stats.avgConf)] ?? ''} icon={TrendingUp} color="#818cf8" />
        </div>
      </div>

      {/* Category progress */}
      <div>
        <SectionHeader title="Category Breakdown" />
        <div className="card p-4">
          <div className="space-y-3">
            {stats.byCategory.map(cat => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                    <span className="text-xs text-slate-300 font-medium">{cat.category}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{cat.completed}/{cat.total} done</span>
                    <span className="font-semibold text-slate-300">{cat.pct}%</span>
                  </div>
                </div>
                <ProgressBar value={cat.pct} color={cat.color} height={5} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weak topics + Needs revision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weak topics */}
        <div>
          <SectionHeader
            title={<span className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-400" /> Weak Areas</span>}
          />
          <div className="card p-4 min-h-[120px]">
            {stats.weak.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-4">No weak topics — great job! 🎉</p>
            ) : (
              stats.weak.map(t => <WeakTopicRow key={t.id} topic={t} />)
            )}
          </div>
        </div>

        {/* Needs revision */}
        <div>
          <SectionHeader title={<span className="flex items-center gap-2"><RefreshCw size={14} className="text-blue-400" /> Due for Revision</span>} />
          <div className="card p-4 min-h-[120px]">
            {stats.needsRevision.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-4">All topics recently revised 👍</p>
            ) : (
              stats.needsRevision.map(t => <WeakTopicRow key={t.id} topic={t} />)
            )}
          </div>
        </div>
      </div>

      {/* Quick add CTA */}
      <div className="card p-4 flex items-center justify-between gap-4 border-ink-500/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-ink-600/15 flex items-center justify-center">
            <Zap size={17} className="text-ink-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Add more topics</p>
            <p className="text-[11px] text-slate-500">Track new subjects to improve your score</p>
          </div>
        </div>
        <button onClick={onAddTopic} className="btn-primary flex-shrink-0">
          Add Topic <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
