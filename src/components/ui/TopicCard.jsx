import React, { useState } from 'react';
import { Check, Pencil, Trash2, RefreshCw, ChevronDown, ChevronUp, CalendarDays } from 'lucide-react';
import { CategoryBadge, DifficultyBadge, ConfidenceRating, ProgressBar } from './UIComponents';
import { CONF_COLORS, CONF_LABELS } from '../../data/constants';
import { useApp } from '../../hooks/AppContext';

export default function TopicCard({ topic, onEdit }) {
  const { toggleComplete, markRevised, deleteTopic, updateTopic } = useApp();
  const [expanded, setExpanded] = useState(false);

  const daysSinceRevision = topic.lastRevised
    ? Math.floor((Date.now() - new Date(topic.lastRevised)) / 86400000)
    : null;

  const revisionUrgent = daysSinceRevision !== null && daysSinceRevision > 7 && topic.completed;

  return (
    <div className={`card-hover rounded-2xl overflow-hidden transition-all duration-200 ${topic.completed ? 'opacity-90' : ''}`}>
      {/* Top color accent based on confidence */}
      <div className="h-0.5 w-full" style={{
        background: topic.completed
          ? `linear-gradient(90deg, ${CONF_COLORS[topic.confidence]}, transparent)`
          : 'rgba(255,255,255,0.05)'
      }} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Complete toggle */}
          <button
            onClick={() => toggleComplete(topic.id)}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-150 ${
              topic.completed
                ? 'bg-emerald-500 border-emerald-500'
                : 'border-slate-700 hover:border-ink-500'
            }`}
          >
            {topic.completed && <Check size={11} strokeWidth={3} className="text-white" />}
          </button>

          {/* Title & badges */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold leading-tight ${topic.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
              {topic.name}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <CategoryBadge category={topic.category} small />
              <DifficultyBadge difficulty={topic.difficulty} />
              {revisionUrgent && (
                <span className="badge text-[10px] px-1.5 py-0.5 font-medium" style={{ color: '#fb923c', background: 'rgba(251,146,60,0.1)' }}>
                  Needs revision
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => onEdit(topic)} className="btn-icon p-1.5" title="Edit">
              <Pencil size={13} />
            </button>
            <button onClick={() => deleteTopic(topic.id)} className="btn-icon p-1.5 hover:text-red-400" title="Delete">
              <Trash2 size={13} />
            </button>
            <button onClick={() => setExpanded(x => !x)} className="btn-icon p-1.5">
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>

        {/* Confidence & revision row */}
        <div className="flex items-center justify-between mt-3">
          <ConfidenceRating
            value={topic.confidence}
            onChange={v => updateTopic(topic.id, { confidence: v })}
            size={13}
          />
          <div className="flex items-center gap-2">
            {daysSinceRevision !== null && (
              <span className="text-[10px] text-slate-600 flex items-center gap-1">
                <CalendarDays size={10} />
                {daysSinceRevision === 0 ? 'Today' : `${daysSinceRevision}d ago`}
              </span>
            )}
            <button
              onClick={() => markRevised(topic.id)}
              className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-ink-400 transition-colors"
              title="Mark revised"
            >
              <RefreshCw size={10} />
              Revised
            </button>
          </div>
        </div>

        {/* Confidence label */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-[10px]" style={{ color: CONF_COLORS[topic.confidence] }}>
            ● {CONF_LABELS[topic.confidence]}
          </span>
        </div>
      </div>

      {/* Expanded notes */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/[0.05] pt-3 animate-fade-up">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Notes</p>
          {topic.notes ? (
            <p className="text-xs text-slate-400 leading-relaxed">{topic.notes}</p>
          ) : (
            <p className="text-xs text-slate-700 italic">No notes added.</p>
          )}
        </div>
      )}
    </div>
  );
}
