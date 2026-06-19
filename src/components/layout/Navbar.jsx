import React from 'react';
import { Menu, Search, Bell, Plus } from 'lucide-react';
import { useApp } from '../../hooks/AppContext';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  topics: 'Topics',
  analytics: 'Analytics',
  notes: 'Notes',
  summary: 'Summary',
  settings: 'Settings',
};
const PAGE_SUBTITLES = {
  dashboard: 'Your placement readiness at a glance',
  topics: 'Manage and track interview topics',
  analytics: 'Visualize your preparation progress',
  notes: 'Quick notes and revision reminders',
  summary: 'Strengths, gaps, and recommendations',
  settings: 'Preferences and data management',
};

export default function Navbar({ onMenuClick, onAddTopic }) {
  const { page, settings } = useApp();
  return (
    <header className="h-14 flex items-center gap-3 px-4 border-b border-white/[0.05] bg-slate-950/80 backdrop-blur-sm sticky top-0 z-20">
      <button onClick={onMenuClick} className="btn-icon lg:hidden">
        <Menu size={18} />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-white leading-none truncate">{PAGE_TITLES[page]}</h1>
        <p className="text-[11px] text-slate-600 mt-0.5 hidden sm:block">{PAGE_SUBTITLES[page]}</p>
      </div>

      <div className="flex items-center gap-2">
        {page === 'topics' && (
          <button onClick={onAddTopic} className="btn-primary text-xs py-1.5 px-3">
            <Plus size={14} />
            <span className="hidden sm:inline">Add Topic</span>
          </button>
        )}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ink-500 to-violet-600 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
          {settings.name?.charAt(0)?.toUpperCase() ?? 'S'}
        </div>
      </div>
    </header>
  );
}
