import React, { useState } from 'react';
import { AppContext } from './hooks/AppContext';
import { useTopics } from './hooks/useTopics';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Topics from './pages/Topics';
import Analytics from './pages/Analytics';
import Notes from './pages/Notes';
import Summary from './pages/Summary';
import Settings from './pages/Settings';
import TopicModal from './components/modals/TopicModal';

const PAGES = { dashboard: Dashboard, topics: Topics, analytics: Analytics, notes: Notes, summary: Summary, settings: Settings };

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const topicsData = useTopics();
  const PageComponent = PAGES[page] ?? Dashboard;

  return (
    <AppContext.Provider value={{ ...topicsData, page, setPage }}>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main area */}
        <div className="lg:pl-52 xl:pl-56 flex flex-col min-h-screen">
          <Navbar
            onMenuClick={() => setMobileOpen(true)}
            onAddTopic={() => setShowAddModal(true)}
          />
          <main className="flex-1 p-4 sm:p-5 max-w-6xl w-full">
            <PageComponent onAddTopic={() => setShowAddModal(true)} />
          </main>
        </div>

        {showAddModal && (
          <TopicModal onClose={() => setShowAddModal(false)} />
        )}
      </div>
    </AppContext.Provider>
  );
}
