import { useState, useEffect, useCallback, useMemo } from 'react';
import { SAMPLE_TOPICS, genId, CATEGORIES, CATEGORY_META } from '../data/constants';

const TOPICS_KEY = 'preppath_topics_v2';
const SETTINGS_KEY = 'preppath_settings_v2';
const GLOBAL_NOTES_KEY = 'preppath_notes_v2';
const WEEKLY_KEY = 'preppath_weekly_v2';

function persist(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function loadStr(key, fallback = '') {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

function buildWeeklyData(topics, existing) {
  // Build last-7-days readiness snapshot; add today's
  const today = new Date().toISOString().split('T')[0];
  const readiness = calcReadiness(topics);
  const completed = topics.filter(t => t.completed).length;
  const last7 = (existing || []).slice(-6);
  const alreadyToday = last7.some(d => d.date === today);
  if (!alreadyToday) {
    last7.push({ date: today, readiness, completed });
    persist(WEEKLY_KEY, last7);
  }
  return last7;
}

function calcReadiness(topics) {
  if (!topics.length) return 0;
  const completionScore = (topics.filter(t => t.completed).length / topics.length) * 60;
  const avgConf = topics.reduce((s, t) => s + t.confidence, 0) / topics.length;
  const confScore = (avgConf / 5) * 30;
  const recentRevision = topics.filter(t => {
    if (!t.lastRevised) return false;
    const diff = (Date.now() - new Date(t.lastRevised)) / 86400000;
    return diff <= 7;
  }).length;
  const revisionScore = Math.min((recentRevision / topics.length) * 10, 10);
  return Math.round(completionScore + confScore + revisionScore);
}

export function useTopics() {
  const [topics, setTopics] = useState(() => load(TOPICS_KEY, SAMPLE_TOPICS));
  const [settings, setSettingsState] = useState(() => load(SETTINGS_KEY, {
    name: 'Student', targetDate: '', dailyGoal: 5, targetRole: 'SDE-1'
  }));
  const [globalNotes, setGlobalNotesState] = useState(() => loadStr(GLOBAL_NOTES_KEY, ''));
  const [weeklyData, setWeeklyData] = useState(() => load(WEEKLY_KEY, []));

  useEffect(() => { persist(TOPICS_KEY, topics); }, [topics]);
  useEffect(() => {
    const updated = buildWeeklyData(topics, weeklyData);
    setWeeklyData(updated);
  }, [topics]);

  const setSettings = useCallback((patch) => {
    setSettingsState(p => { const n = { ...p, ...patch }; persist(SETTINGS_KEY, n); return n; });
  }, []);
  const setGlobalNotes = useCallback((v) => {
    setGlobalNotesState(v);
    try { localStorage.setItem(GLOBAL_NOTES_KEY, v); } catch {}
  }, []);

  const addTopic = useCallback((data) => {
    setTopics(p => [...p, { ...data, id: genId(), createdAt: new Date().toISOString().split('T')[0] }]);
  }, []);

  const updateTopic = useCallback((id, patch) => {
    setTopics(p => p.map(t => t.id === id ? { ...t, ...patch } : t));
  }, []);

  const deleteTopic = useCallback((id) => {
    setTopics(p => p.filter(t => t.id !== id));
  }, []);

  const toggleComplete = useCallback((id) => {
    setTopics(p => p.map(t => t.id === id
      ? { ...t, completed: !t.completed, lastRevised: new Date().toISOString().split('T')[0] }
      : t));
  }, []);

  const markRevised = useCallback((id) => {
    setTopics(p => p.map(t => t.id === id
      ? { ...t, lastRevised: new Date().toISOString().split('T')[0] }
      : t));
  }, []);

  const resetData = useCallback(() => {
    setTopics(SAMPLE_TOPICS);
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = topics.length;
    const completed = topics.filter(t => t.completed).length;
    const pending = total - completed;
    const avgConf = total ? +(topics.reduce((s, t) => s + t.confidence, 0) / total).toFixed(1) : 0;
    const readiness = calcReadiness(topics);

    // Category breakdown
    const byCategory = CATEGORIES.map(cat => {
      const catTopics = topics.filter(t => t.category === cat);
      const done = catTopics.filter(t => t.completed).length;
      const avgC = catTopics.length ? +(catTopics.reduce((s, t) => s + t.confidence, 0) / catTopics.length).toFixed(1) : 0;
      return {
        category: cat,
        label: CATEGORY_META[cat]?.label ?? cat,
        total: catTopics.length,
        completed: done,
        avgConfidence: avgC,
        color: CATEGORY_META[cat]?.dot ?? '#6366f1',
        pct: catTopics.length ? Math.round((done / catTopics.length) * 100) : 0,
      };
    }).filter(c => c.total > 0);

    // Confidence distribution
    const confDist = [1, 2, 3, 4, 5].map(n => ({
      level: n,
      label: ['', 'Beginner', 'Basic', 'Moderate', 'Good', 'Expert'][n],
      count: topics.filter(t => t.confidence === n).length,
    }));

    // Weak topics: incomplete OR low confidence
    const weak = topics
      .filter(t => !t.completed || t.confidence <= 2)
      .sort((a, b) => a.confidence - b.confidence)
      .slice(0, 6);

    // Needs revision: completed but not revised in 7+ days
    const needsRevision = topics
      .filter(t => t.completed && t.lastRevised && (Date.now() - new Date(t.lastRevised)) / 86400000 > 7)
      .slice(0, 5);

    // Strong: completed + high confidence
    const strong = topics
      .filter(t => t.completed && t.confidence >= 4)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 6);

    return { total, completed, pending, avgConf, readiness, byCategory, confDist, weak, needsRevision, strong };
  }, [topics]);

  return {
    topics, stats, settings, globalNotes, weeklyData,
    addTopic, updateTopic, deleteTopic, toggleComplete, markRevised,
    setSettings, setGlobalNotes, resetData,
  };
}
