import React from 'react';
import { Trophy, AlertTriangle, Lightbulb, TrendingUp, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../hooks/AppContext';
import { CategoryBadge, DifficultyBadge, ConfidenceRating, ProgressBar } from '../components/ui/UIComponents';
import { CONF_COLORS, CONF_LABELS, CATEGORY_META, CATEGORIES } from '../data/constants';

function TopicRow({ topic, accent }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
      <div className="flex-1 min-w-0">
        <span className="text-xs text-slate-300 font-medium truncate block">{topic.name}</span>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <CategoryBadge category={topic.category} small />
        <ConfidenceRating value={topic.confidence} readonly size={10} />
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, title, color, children }) {
  return (
    <div className="card p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={15} style={{ color }} />
        <p className="text-sm font-semibold text-white">{title}</p>
      </div>
      {children}
    </div>
  );
}

export default function Summary() {
  const { stats, topics } = useApp();

  // Readiness status
  const readinessStatus =
    stats.readiness >= 75 ? { label: 'Placement Ready', color: '#4ade80', desc: 'You have strong coverage across most areas. Focus on mock interviews.' }
    : stats.readiness >= 50 ? { label: 'Progressing Well', color: '#fb923c', desc: 'Good foundation, but some areas still need attention.' }
    : { label: 'Early Stage', color: '#f87171', desc: 'Keep building. Consistent daily practice is key.' };

  // Recommendations
  const recs = [];
  stats.weak.slice(0, 3).forEach(t => {
    recs.push({ topic: t.name, why: `Confidence ${t.confidence}/5 — needs revision`, category: t.category });
  });
  if (stats.needsRevision.length > 0) {
    recs.push({ topic: `${stats.needsRevision.length} completed topics`, why: 'Not revised in 7+ days', category: null });
  }
  CATEGORIES.forEach(cat => {
    const catTopics = topics.filter(t => t.category === cat);
    if (catTopics.length === 0) {
      recs.push({ topic: `${cat}`, why: 'No topics added for this subject', category: cat });
    }
  });

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Overall status banner */}
      <div className="card p-5" style={{ borderColor: `${readinessStatus.color}30` }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${readinessStatus.color}15` }}>
            <TrendingUp size={22} style={{ color: readinessStatus.color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-bold text-white">{readinessStatus.label}</h2>
              <span className="badge font-bold text-sm px-3" style={{ color: readinessStatus.color, background: `${readinessStatus.color}15` }}>
                {stats.readiness}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{readinessStatus.desc}</p>
            <div className="mt-3 max-w-sm">
              <ProgressBar value={stats.readiness} color={readinessStatus.color} height={6} />
            </div>
          </div>
        </div>
      </div>

      {/* 3-column: Strong | Weak | Needs Revision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard icon={Trophy} title="Strong Topics" color="#4ade80">
          {stats.strong.length === 0 ? (
            <p className="text-xs text-slate-600 py-2">Complete topics with high confidence to see strengths.</p>
          ) : (
            stats.strong.map(t => <TopicRow key={t.id} topic={t} accent="#4ade80" />)
          )}
        </SummaryCard>

        <SummaryCard icon={AlertTriangle} title="Weak Areas" color="#f87171">
          {stats.weak.length === 0 ? (
            <p className="text-xs text-slate-600 py-2">No weak areas detected 🎉</p>
          ) : (
            stats.weak.map(t => <TopicRow key={t.id} topic={t} accent={CONF_COLORS[t.confidence]} />)
          )}
        </SummaryCard>

        <SummaryCard icon={RefreshCw} title="Due for Revision" color="#38bdf8">
          {stats.needsRevision.length === 0 ? (
            <p className="text-xs text-slate-600 py-2">All topics recently revised!</p>
          ) : (
            stats.needsRevision.map(t => <TopicRow key={t.id} topic={t} accent="#38bdf8" />)
          )}
        </SummaryCard>
      </div>

      {/* Category health */}
      <div>
        <p className="text-sm font-semibold text-white mb-3">Category Health Check</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIES.map(cat => {
            const catTopics = topics.filter(t => t.category === cat);
            const meta = CATEGORY_META[cat];
            const pct = catTopics.length ? Math.round((catTopics.filter(t => t.completed).length / catTopics.length) * 100) : 0;
            const avgConf = catTopics.length ? +(catTopics.reduce((s, t) => s + t.confidence, 0) / catTopics.length).toFixed(1) : 0;
            const status = catTopics.length === 0 ? 'missing' : pct >= 70 && avgConf >= 3 ? 'good' : pct >= 40 ? 'partial' : 'weak';
            const statusMeta = {
              missing: { label: 'Not started', icon: XCircle, color: '#475569' },
              weak:    { label: 'Needs work',  icon: AlertTriangle, color: '#f87171' },
              partial: { label: 'In progress', icon: TrendingUp, color: '#fb923c' },
              good:    { label: 'On track',    icon: CheckCircle2, color: '#4ade80' },
            }[status];
            const StatusIcon = statusMeta.icon;

            return (
              <div key={cat} className="card p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: meta.bg }}>
                  <span className="text-[10px] font-bold" style={{ color: meta.color }}>{meta.label ?? cat.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-300 truncate">{cat}</span>
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: statusMeta.color }}>
                      <StatusIcon size={10} />
                      {statusMeta.label}
                    </span>
                  </div>
                  <ProgressBar value={pct} color={meta.dot} height={4} />
                  <p className="text-[10px] text-slate-600 mt-0.5">{catTopics.length} topics · {pct}% done · avg {avgConf}/5</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {recs.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Lightbulb size={15} className="text-yellow-400" /> Recommendations
          </p>
          <div className="space-y-2">
            {recs.slice(0, 6).map((r, i) => (
              <div key={i} className="card p-3 flex items-start gap-3">
                <div className="w-5 h-5 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb size={11} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{r.topic}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{r.why}</p>
                </div>
                {r.category && <CategoryBadge category={r.category} small />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
