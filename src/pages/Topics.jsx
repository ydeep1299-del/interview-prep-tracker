import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, BookOpen, Plus } from 'lucide-react';
import TopicCard from '../components/ui/TopicCard';
import TopicModal from '../components/modals/TopicModal';
import { EmptyState } from '../components/ui/UIComponents';
import { CATEGORIES, DIFFICULTIES } from '../data/constants';
import { useApp } from '../hooks/AppContext';

const STATUS_OPTS = ['All', 'Completed', 'Pending'];
const SORT_OPTS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'confidence_asc', label: 'Confidence ↑' },
  { value: 'confidence_desc', label: 'Confidence ↓' },
  { value: 'difficulty', label: 'Difficulty' },
];

export default function Topics() {
  const { topics } = useApp();
  const [editTopic, setEditTopic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let t = [...topics];
    if (search.trim()) {
      const q = search.toLowerCase();
      t = t.filter(x => x.name.toLowerCase().includes(q) || x.notes?.toLowerCase().includes(q));
    }
    if (catFilter !== 'All') t = t.filter(x => x.category === catFilter);
    if (statusFilter === 'Completed') t = t.filter(x => x.completed);
    if (statusFilter === 'Pending') t = t.filter(x => !x.completed);
    if (diffFilter !== 'All') t = t.filter(x => x.difficulty === diffFilter);

    const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
    t.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'confidence_asc': return a.confidence - b.confidence;
        case 'confidence_desc': return b.confidence - a.confidence;
        case 'difficulty': return diffOrder[a.difficulty] - diffOrder[b.difficulty];
        default: return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    return t;
  }, [topics, search, catFilter, statusFilter, diffFilter, sortBy]);

  const clearFilters = () => { setCatFilter('All'); setStatusFilter('All'); setDiffFilter('All'); setSearch(''); };
  const hasFilters = catFilter !== 'All' || statusFilter !== 'All' || diffFilter !== 'All' || search.trim();

  const openEdit = (t) => { setEditTopic(t); setShowModal(true); };
  const openAdd = () => { setEditTopic(null); setShowModal(true); };

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Search + filter bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input pl-8"
            placeholder="Search topics or notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X size={13} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(x => !x)}
          className={`btn-secondary gap-2 flex-shrink-0 ${hasFilters ? 'border-ink-500/40 text-ink-300' : ''}`}
        >
          <SlidersHorizontal size={14} />
          <span className="hidden sm:inline">Filters</span>
          {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-ink-400" />}
        </button>
        <button onClick={openAdd} className="btn-primary flex-shrink-0">
          <Plus size={14} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card p-4 animate-fade-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label>Category</label>
              <select className="select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label>Status</label>
              <select className="select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label>Difficulty</label>
              <select className="select" value={diffFilter} onChange={e => setDiffFilter(e.target.value)}>
                <option value="All">All Levels</option>
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label>Sort by</label>
              <select className="select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {SORT_OPTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-ghost text-xs mt-3 text-slate-500">
              <X size={12} /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-600">
          Showing <span className="text-slate-300 font-medium">{filtered.length}</span> of {topics.length} topics
        </p>
        <div className="flex gap-2 text-[11px] text-slate-600">
          <span className="text-emerald-400 font-medium">{topics.filter(t => t.completed).length} done</span>
          <span>·</span>
          <span className="text-amber-400 font-medium">{topics.filter(t => !t.completed).length} pending</span>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No topics found"
          sub={hasFilters ? 'Try adjusting your filters.' : 'Add your first topic to get started.'}
          action={!hasFilters && <button onClick={openAdd} className="btn-primary">Add Topic</button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((t, i) => (
            <div key={t.id} style={{ animationDelay: `${i * 30}ms` }} className="animate-fade-up">
              <TopicCard topic={t} onEdit={openEdit} />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TopicModal
          topic={editTopic}
          onClose={() => { setShowModal(false); setEditTopic(null); }}
        />
      )}
    </div>
  );
}
