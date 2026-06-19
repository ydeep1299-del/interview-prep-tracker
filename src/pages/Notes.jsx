import React, { useState } from 'react';
import { FileText, Save, Clock, Pencil } from 'lucide-react';
import { useApp } from '../hooks/AppContext';
import { CategoryBadge } from '../components/ui/UIComponents';
import TopicModal from '../components/modals/TopicModal';

export default function Notes() {
  const { globalNotes, setGlobalNotes, topics, updateTopic } = useApp();
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTopic, setEditTopic] = useState(null);
  const [noteTexts, setNoteTexts] = useState({});

  const topicsWithNotes = topics.filter(t => t.notes?.trim());
  const topicsNeedingNotes = topics.filter(t => !t.notes?.trim()).slice(0, 8);

  const saveGlobal = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const startInlineEdit = (topic) => {
    setEditingId(topic.id);
    setNoteTexts(p => ({ ...p, [topic.id]: topic.notes }));
  };

  const saveInline = (id) => {
    updateTopic(id, { notes: noteTexts[id] ?? '' });
    setEditingId(null);
  };

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Global notes */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-ink-400" />
            <p className="text-sm font-semibold text-white">General Interview Notes</p>
          </div>
          <button onClick={saveGlobal} className={`btn-primary text-xs py-1.5 ${saved ? 'bg-emerald-600 hover:bg-emerald-500' : ''}`}>
            <Save size={13} />
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
        <textarea
          className="textarea min-h-[180px] font-mono text-xs leading-relaxed"
          placeholder={`Use this space for:
• Key interview tips and formulas
• Behavioural question frameworks (STAR method)
• Company-specific research notes
• Things to remember on interview day`}
          value={globalNotes}
          onChange={e => setGlobalNotes(e.target.value)}
        />
        <p className="text-[10px] text-slate-700 mt-1.5">Auto-saved to local storage · {globalNotes.length} chars</p>
      </div>

      {/* Topic notes */}
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-3">Topic Notes ({topicsWithNotes.length})</p>
        {topicsWithNotes.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-sm text-slate-600">No topic notes yet. Add notes when editing topics.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {topicsWithNotes.map(topic => (
              <div key={topic.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white truncate">{topic.name}</span>
                      <CategoryBadge category={topic.category} small />
                    </div>
                    {editingId === topic.id ? (
                      <div className="space-y-2">
                        <textarea
                          className="textarea text-xs min-h-[80px]"
                          value={noteTexts[topic.id] ?? topic.notes}
                          onChange={e => setNoteTexts(p => ({ ...p, [topic.id]: e.target.value }))}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button onClick={() => saveInline(topic.id)} className="btn-primary text-xs py-1">Save</button>
                          <button onClick={() => setEditingId(null)} className="btn-ghost text-xs">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{topic.notes}</p>
                    )}
                    {topic.lastRevised && (
                      <p className="text-[10px] text-slate-700 mt-1.5 flex items-center gap-1">
                        <Clock size={9} /> Revised {topic.lastRevised}
                      </p>
                    )}
                  </div>
                  {editingId !== topic.id && (
                    <button onClick={() => startInlineEdit(topic)} className="btn-icon p-1.5 flex-shrink-0">
                      <Pencil size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Topics needing notes */}
      {topicsNeedingNotes.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-2">Topics without notes</p>
          <div className="flex flex-wrap gap-2">
            {topicsNeedingNotes.map(t => (
              <button
                key={t.id}
                onClick={() => { setEditTopic(t); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-white/[0.06] hover:border-ink-500/30 transition-all text-xs text-slate-400 hover:text-white"
              >
                <Pencil size={11} />
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {editTopic && (
        <TopicModal topic={editTopic} onClose={() => setEditTopic(null)} />
      )}
    </div>
  );
}
