import React from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
  LineChart, Line, CartesianGrid, Area, AreaChart,
} from 'recharts';
import { CONF_COLORS, CATEGORY_META } from '../data/constants';
import { useApp } from '../hooks/AppContext';
import { ProgressBar } from '../components/ui/UIComponents';

const CHART_COLORS = ['#6366f1', '#38bdf8', '#34d399', '#fb923c', '#22d3ee', '#f9a8d4', '#a78bfa', '#fbbf24'];

function ChartCard({ title, children, height = 240 }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-semibold text-slate-300 mb-4">{title}</p>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-white/[0.08] rounded-xl p-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-slate-300">{p.name}: <span className="text-white font-semibold">{p.value}</span></span>
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const { stats, weeklyData } = useApp();

  // Confidence distribution bar data
  const confData = stats.confDist.map(d => ({
    name: d.label,
    Topics: d.count,
    fill: CONF_COLORS[d.level],
  }));

  // Category radar data
  const radarData = stats.byCategory.map(c => ({
    category: c.label,
    Confidence: Math.round((c.avgConfidence / 5) * 100),
    Completion: c.pct,
  }));

  // Completion pie data
  const pieData = [
    { name: 'Completed', value: stats.completed, fill: '#4ade80' },
    { name: 'Pending',   value: stats.pending,   fill: '#334155' },
  ];

  // Category bar data
  const catBarData = stats.byCategory.map((c, i) => ({
    name: c.label,
    Completed: c.completed,
    Pending: c.total - c.completed,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  // Weekly trend
  const trendData = weeklyData.map(d => ({
    date: d.date?.slice(5) ?? '',
    Readiness: d.readiness,
    Completed: d.completed,
  }));

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Readiness', value: `${stats.readiness}%`, color: '#6366f1' },
          { label: 'Completion', value: `${stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%`, color: '#4ade80' },
          { label: 'Avg Confidence', value: `${stats.avgConf}/5`, color: '#fb923c' },
          { label: 'Weak Topics', value: stats.weak.length, color: '#f87171' },
        ].map(s => (
          <div key={s.label} className="card p-3 text-center">
            <p className="text-[10px] text-slate-600 font-medium mb-1 uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Confidence distribution */}
        <ChartCard title="Confidence Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={confData} barSize={28}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Topics" radius={[6, 6, 0, 0]}>
                {confData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Completion pie */}
        <ChartCard title="Completion Overview">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: 'rgba(255,255,255,0.15)' }}
              >
                {pieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category stacked bar */}
        <ChartCard title="Category-wise Progress" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={catBarData} barSize={18}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Completed" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]}>
                {catBarData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
              <Bar dataKey="Pending" stackId="a" fill="#1e293b" radius={[4, 4, 0, 0]} />
              <Legend iconType="circle" iconSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Radar: confidence vs completion by category */}
        <ChartCard title="Category Readiness Radar" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#475569', fontSize: 10 }} />
              <Radar name="Confidence%" dataKey="Confidence" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Completion%" dataKey="Completion" stroke="#4ade80" fill="#4ade80" fillOpacity={0.15} strokeWidth={2} />
              <Legend iconType="circle" iconSize={8} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Weekly trend */}
      {trendData.length > 1 && (
        <ChartCard title="Readiness Trend (Last 7 Sessions)" height={200}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="readGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Readiness" stroke="#6366f1" strokeWidth={2.5}
                fill="url(#readGrad)" dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Category detail table */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-slate-300 mb-3">Category Summary Table</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {['Category', 'Total', 'Done', 'Progress', 'Avg Confidence'].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-slate-600 uppercase tracking-wider pb-2 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.byCategory.map(c => (
                <tr key={c.category} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-2.5 pr-4">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                      <span className="text-slate-300 font-medium">{c.category}</span>
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-400">{c.total}</td>
                  <td className="py-2.5 pr-4 text-emerald-400 font-semibold">{c.completed}</td>
                  <td className="py-2.5 pr-4 w-32">
                    <ProgressBar value={c.pct} color={c.color} height={4} />
                    <span className="text-[10px] text-slate-600 mt-0.5 block">{c.pct}%</span>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-300 font-mono">{c.avgConfidence}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
