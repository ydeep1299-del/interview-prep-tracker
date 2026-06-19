import React from 'react';
import {
  LayoutDashboard, BookOpen, BarChart3, FileText,
  ClipboardList, Settings, Zap, X, ChevronRight
} from 'lucide-react';
import { useApp } from '../../hooks/AppContext';

const NAV = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'topics',    label: 'Topics',     icon: BookOpen },
  { id: 'analytics', label: 'Analytics',  icon: BarChart3 },
  { id: 'notes',     label: 'Notes',      icon: FileText },
  { id: 'summary',   label: 'Summary',    icon: ClipboardList },
  { id: 'settings',  label: 'Settings',   icon: Settings },
];

function ReadinessRing({ value }) {
  const r = 28, circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  const color = value >= 70 ? '#4ade80' : value >= 45 ? '#fb923c' : '#f87171';
  return (
    <svg width="72" height="72" className="mx-auto">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: 'stroke-dasharray 0.8s ease, stroke 0.4s' }}
      />
      <text x="36" y="36" textAnchor="middle" dominantBaseline="central"
        style={{ fill: 'white', fontSize: '13px', fontWeight: 700, fontFamily: 'Inter' }}>
        {value}%
      </text>
    </svg>
  );
}

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { page, setPage, stats } = useApp();

  const Content = () => (
    <div className="flex flex-col h-full py-4">
      {/* Brand */}
      <div className="px-4 pb-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ink-500 to-violet-600 flex items-center justify-center shadow-lg shadow-ink-600/30 flex-shrink-0">
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <div className="text-[13px] font-bold text-white tracking-tight">PrepPath</div>
            <div className="text-[10px] text-slate-600 font-medium">Placement Tracker</div>
          </div>
        </div>
      </div>

      {/* Readiness ring */}
      <div className="px-4 py-5 border-b border-white/[0.05]">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 text-center mb-3">Readiness Score</p>
        <ReadinessRing value={stats.readiness} />
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          {[
            { v: stats.total,     l: 'Total' },
            { v: stats.completed, l: 'Done' },
            { v: stats.pending,   l: 'Left' },
          ].map(s => (
            <div key={s.l} className="bg-slate-800/60 rounded-xl py-1.5 px-1">
              <div className="text-sm font-bold text-white">{s.v}</div>
              <div className="text-[10px] text-slate-600">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-3 space-y-0.5">
        <p className="section-label">Navigation</p>
        {NAV.map(item => {
          const Icon = item.icon;
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); setMobileOpen(false); }}
              className={active ? 'nav-active' : 'nav-inactive'}
            >
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              <span>{item.label}</span>
              {active && <ChevronRight size={13} className="ml-auto opacity-50" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pt-3 border-t border-white/[0.05]">
        <div className="text-[10px] text-slate-700 text-center">
          Avg confidence: <span className="text-slate-400 font-semibold">{stats.avgConf} / 5</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-52 xl:w-56 bg-slate-900/80 border-r border-white/[0.05] fixed inset-y-0 left-0 z-30 backdrop-blur-sm">
        <Content />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="modal-overlay absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="modal-panel relative w-56 h-full bg-slate-950 border-r border-white/[0.05] flex flex-col">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-3 btn-icon text-slate-500">
              <X size={16} />
            </button>
            <Content />
          </aside>
        </div>
      )}
    </>
  );
}
