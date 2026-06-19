import React, { useState } from 'react';
import { Save, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { useApp } from '../hooks/AppContext';

export default function Settings() {
  const { settings, setSettings, resetData, stats } = useApp();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = () => {
    setSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetData();
    setConfirmReset(false);
  };

  const clearAll = () => {
    if (window.confirm('This will permanently delete all your data. Are you sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-lg space-y-5 animate-fade-up">
      {/* Profile */}
      <div className="card p-5">
        <p className="text-sm font-semibold text-white mb-4">Profile</p>
        <div className="space-y-3">
          <div>
            <label>Your Name</label>
            <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Rahul Sharma" />
          </div>
          <div>
            <label>Target Role</label>
            <input className="input" value={form.targetRole} onChange={e => set('targetRole', e.target.value)} placeholder="e.g. SDE-1, Full Stack Developer" />
          </div>
          <div>
            <label>Interview Target Date</label>
            <input type="date" className="input" value={form.targetDate} onChange={e => set('targetDate', e.target.value)} />
          </div>
          <div>
            <label>Daily Study Goal (topics)</label>
            <input
              type="number" min="1" max="20" className="input"
              value={form.dailyGoal}
              onChange={e => set('dailyGoal', parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
        <button onClick={save} className={`btn-primary mt-4 ${saved ? 'bg-emerald-600 hover:bg-emerald-500' : ''}`}>
          <Save size={14} />
          {saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>

      {/* Stats overview */}
      <div className="card p-5">
        <p className="text-sm font-semibold text-white mb-3">Your Data</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
          {[
            ['Total Topics', stats.total],
            ['Completed', stats.completed],
            ['Avg Confidence', `${stats.avgConf}/5`],
            ['Readiness Score', `${stats.readiness}%`],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between bg-slate-800/40 rounded-xl px-3 py-2">
              <span className="text-slate-500">{l}</span>
              <span className="font-semibold text-white">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card p-5 border-red-500/10">
        <p className="text-sm font-semibold text-red-400 mb-1 flex items-center gap-2">
          <AlertTriangle size={14} /> Danger Zone
        </p>
        <p className="text-xs text-slate-600 mb-4">These actions cannot be undone.</p>
        <div className="space-y-2">
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} className="btn-secondary w-full justify-start gap-2 text-amber-400 border-amber-500/20">
              <RotateCcw size={14} />
              Reset to sample data
            </button>
          ) : (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
              <p className="text-xs text-amber-400 mb-2">This will replace your topics with sample data.</p>
              <div className="flex gap-2">
                <button onClick={handleReset} className="btn-primary bg-amber-600 hover:bg-amber-500 text-xs">Confirm reset</button>
                <button onClick={() => setConfirmReset(false)} className="btn-ghost text-xs">Cancel</button>
              </div>
            </div>
          )}
          <button onClick={clearAll} className="btn-danger w-full justify-start gap-2">
            <Trash2 size={14} />
            Clear all data
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-700 text-center">
        PrepPath v1.0 · Data stored in your browser only
      </p>
    </div>
  );
}
