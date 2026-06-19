import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { CATEGORIES, DIFFICULTIES } from '../../data/constants';
import { ConfidenceRating } from '../ui/UIComponents';
import { useApp } from '../../hooks/AppContext';

const EMPTY = {
  name: '', category: 'DSA', difficulty: 'Medium',
  confidence: 3, completed: false, notes: '', lastRevised: '',
};

export default function TopicModal({ topic = null, onClose }) {
  const { addTopic, updateTopic } = useApp();
  const [form, setForm] = useState(topic ? { ...topic } : { ...EMPTY });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Topic name is required';
    if (form.name.trim().length > 80) e.name = 'Name too long (max 80 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    if (topic) updateTopic(topic.id, form);
    else addTopic(form);
    onClose();
  };

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="modal-panel card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            {topic ? <Save size={16} className="text-ink-400" /> : <Plus size={16} className="text-ink-400" />}
            <h2 className="text-sm font-semibold text-white">{topic ? 'Edit Topic' : 'Add New Topic'}</h2>
          </div>
          <button onClick={onClose} className="btn-icon p-1.5"><X size={15} /></button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label>Topic Name *</label>
            <input
              className={`input ${errors.name ? 'border-red-500/50' : ''}`}
              placeholder="e.g. Binary Search Trees"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              autoFocus
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Category & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label>Category</label>
              <select className="select" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label>Difficulty</label>
              <select className="select" value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Confidence */}
          <div>
            <label>Confidence Level</label>
            <div className="flex items-center gap-3 mt-0.5">
              <ConfidenceRating value={form.confidence} onChange={v => set('confidence', v)} size={20} />
              <span className="text-xs text-slate-500">{['', 'Beginner', 'Basic', 'Moderate', 'Good', 'Expert'][form.confidence]}</span>
            </div>
          </div>

          {/* Last revised */}
          <div>
            <label>Last Revised</label>
            <input
              type="date"
              className="input"
              value={form.lastRevised}
              onChange={e => set('lastRevised', e.target.value)}
            />
          </div>

          {/* Notes */}
          <div>
            <label>Notes</label>
            <textarea
              className="textarea"
              placeholder="Key points, doubts, revision reminders..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={4}
            />
          </div>

          {/* Completed */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${form.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700'}`}
              onClick={() => set('completed', !form.completed)}
            >
              {form.completed && (
                <svg viewBox="0 0 12 9" width="11" height="9" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4.5 4.5 8 11 1" />
                </svg>
              )}
            </div>
            <span className="text-sm text-slate-300">Mark as completed</span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-white/[0.06]">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submit} className="btn-primary">
            {topic ? <><Save size={14} /> Save changes</> : <><Plus size={14} /> Add topic</>}
          </button>
        </div>
      </div>
    </div>
  );
}
