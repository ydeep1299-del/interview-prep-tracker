// ── Category metadata ────────────────────────────────────────────────
export const CATEGORIES = [
  'DSA', 'DBMS', 'Operating System', 'Computer Networks',
  'React', 'Java', 'OOP', 'HR Questions',
];

export const CATEGORY_META = {
  'DSA':               { color: '#818cf8', bg: 'rgba(99,102,241,0.12)', dot: '#6366f1', label: 'DSA' },
  'DBMS':              { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', dot: '#0ea5e9', label: 'DBMS' },
  'Operating System':  { color: '#34d399', bg: 'rgba(52,211,153,0.12)', dot: '#10b981', label: 'OS' },
  'Computer Networks': { color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  dot: '#f97316', label: 'CN' },
  'React':             { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)',  dot: '#06b6d4', label: 'React' },
  'Java':              { color: '#f9a8d4', bg: 'rgba(249,168,212,0.12)', dot: '#ec4899', label: 'Java' },
  'OOP':               { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', dot: '#8b5cf6', label: 'OOP' },
  'HR Questions':      { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  dot: '#f59e0b', label: 'HR' },
};

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const DIFFICULTY_META = {
  Easy:   { color: '#4ade80', bg: 'rgba(74,222,128,0.10)', label: 'Easy' },
  Medium: { color: '#fb923c', bg: 'rgba(251,146,60,0.10)', label: 'Medium' },
  Hard:   { color: '#f87171', bg: 'rgba(248,113,113,0.10)', label: 'Hard' },
};

// Confidence level colors (index 0 unused, 1–5)
export const CONF_COLORS = ['', '#ef4444', '#fb923c', '#eab308', '#4ade80', '#6366f1'];
export const CONF_LABELS = ['', 'Beginner', 'Basic', 'Moderate', 'Good', 'Expert'];

// ── Sample seed data ──────────────────────────────────────────────────
const d = (daysAgo) => new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];

export const SAMPLE_TOPICS = [
  { id: 's1',  name: 'Arrays & Strings',        category: 'DSA',               difficulty: 'Easy',   confidence: 4, completed: true,  notes: 'Two-pointer, sliding window. Very comfortable.',            lastRevised: d(1),  createdAt: d(14) },
  { id: 's2',  name: 'Dynamic Programming',     category: 'DSA',               difficulty: 'Hard',   confidence: 2, completed: false, notes: 'Memoization good. Tabulation needs work. Revise LCS/LIS.',   lastRevised: d(4),  createdAt: d(12) },
  { id: 's3',  name: 'Graph Algorithms',        category: 'DSA',               difficulty: 'Hard',   confidence: 2, completed: false, notes: 'BFS/DFS clear. Dijkstra & MST incomplete.',                  lastRevised: d(7),  createdAt: d(11) },
  { id: 's4',  name: 'Trees & BST',             category: 'DSA',               difficulty: 'Medium', confidence: 4, completed: true,  notes: 'Traversals strong. AVL rotations revised.',                  lastRevised: d(2),  createdAt: d(10) },
  { id: 's5',  name: 'SQL Joins & Queries',     category: 'DBMS',              difficulty: 'Medium', confidence: 3, completed: true,  notes: 'INNER/LEFT/RIGHT joins good. Complex subqueries need work.',  lastRevised: d(3),  createdAt: d(10) },
  { id: 's6',  name: 'Normalization (1NF–3NF)', category: 'DBMS',              difficulty: 'Medium', confidence: 2, completed: false, notes: 'BCNF and 4NF still unclear. Needs dedicated session.',        lastRevised: d(9),  createdAt: d(9)  },
  { id: 's7',  name: 'Indexing & Transactions', category: 'DBMS',              difficulty: 'Hard',   confidence: 2, completed: false, notes: 'B+ Tree indexing partially done. ACID properties good.',      lastRevised: d(10), createdAt: d(8)  },
  { id: 's8',  name: 'Process Scheduling',      category: 'Operating System',  difficulty: 'Medium', confidence: 3, completed: true,  notes: 'FCFS, SJF, RR done. Priority scheduling needs Gantt practice.', lastRevised: d(3), createdAt: d(8) },
  { id: 's9',  name: 'Deadlocks & Prevention',  category: 'Operating System',  difficulty: 'Hard',   confidence: 1, completed: false, notes: "Banker's algorithm unclear. Resource allocation graph needs work.", lastRevised: d(12), createdAt: d(7) },
  { id: 's10', name: 'Memory Management',       category: 'Operating System',  difficulty: 'Hard',   confidence: 2, completed: false, notes: 'Paging/segmentation partially understood.',                   lastRevised: d(8),  createdAt: d(7)  },
  { id: 's11', name: 'TCP/IP & OSI Model',      category: 'Computer Networks', difficulty: 'Easy',   confidence: 5, completed: true,  notes: 'All layers clear. Protocols well memorised.',                 lastRevised: d(1),  createdAt: d(6)  },
  { id: 's12', name: 'HTTP, DNS & Routing',     category: 'Computer Networks', difficulty: 'Medium', confidence: 4, completed: true,  notes: 'Good on REST/HTTP. BGP routing basics covered.',              lastRevised: d(2),  createdAt: d(6)  },
  { id: 's13', name: 'React Hooks & Lifecycle', category: 'React',             difficulty: 'Medium', confidence: 4, completed: true,  notes: 'useState/useEffect solid. Custom hooks need one more pass.',  lastRevised: d(1),  createdAt: d(5)  },
  { id: 's14', name: 'React Performance',       category: 'React',             difficulty: 'Hard',   confidence: 3, completed: false, notes: 'useMemo/useCallback understood. React.lazy in progress.',     lastRevised: d(5),  createdAt: d(5)  },
  { id: 's15', name: 'OOP Principles',          category: 'OOP',               difficulty: 'Easy',   confidence: 5, completed: true,  notes: 'All four pillars clear with examples.',                       lastRevised: d(1),  createdAt: d(4)  },
  { id: 's16', name: 'Design Patterns',         category: 'OOP',               difficulty: 'Hard',   confidence: 3, completed: false, notes: 'Singleton, Factory, Observer done. Decorator needs practice.', lastRevised: d(6), createdAt: d(4)  },
  { id: 's17', name: 'Java Collections & JVM',  category: 'Java',              difficulty: 'Medium', confidence: 3, completed: false, notes: 'HashMap/ArrayList clear. GC tuning still unclear.',           lastRevised: d(5),  createdAt: d(3)  },
  { id: 's18', name: 'Tell Me About Yourself',  category: 'HR Questions',      difficulty: 'Easy',   confidence: 5, completed: true,  notes: '2-min structured answer ready. Practiced 3× in mock.',       lastRevised: d(0),  createdAt: d(2)  },
  { id: 's19', name: 'Strength & Weakness',     category: 'HR Questions',      difficulty: 'Easy',   confidence: 4, completed: true,  notes: 'STAR-format answers prepared.',                               lastRevised: d(1),  createdAt: d(2)  },
  { id: 's20', name: 'Where Do You See Yourself in 5 Years', category: 'HR Questions', difficulty: 'Easy', confidence: 3, completed: false, notes: 'Draft answer ready but sounds generic. Needs refinement.', lastRevised: d(2), createdAt: d(1) },
];

export const genId = () => `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
