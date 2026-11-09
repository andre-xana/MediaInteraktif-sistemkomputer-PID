import React, { useState, useEffect } from 'react';
import { TabType } from './types';
import { Navbar } from './components/Navbar';
import { MateriView } from './components/MateriView';
import { KuisPermainanView } from './components/KuisPermainanView';
import { AsesmenView } from './components/AsesmenView';
import { DashboardGuruView } from './components/DashboardGuruView';
import { BookOpen, Gamepad2, Award, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('materi');

  // Load completed sub sections from localStorage
  const [completedSubSections, setCompletedSubSections] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sistem_komputer_completed_materi');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'sistem_komputer_completed_materi',
        JSON.stringify(completedSubSections)
      );
    } catch {
      // Ignore storage errors
    }
  }, [completedSubSections]);

  const handleToggleComplete = (subSectionId: string) => {
    setCompletedSubSections((prev) =>
      prev.includes(subSectionId)
        ? prev.filter((id) => id !== subSectionId)
        : [...prev, subSectionId]
    );
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset semua penanda baca materi?')) {
      setCompletedSubSections([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-sky-100 selection:text-sky-900">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        completedMaterialsCount={completedSubSections.length}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'materi' && (
          <MateriView
            completedSubSections={completedSubSections}
            onToggleComplete={handleToggleComplete}
            onResetProgress={handleResetProgress}
            onGoToQuiz={() => {
              setActiveTab('kuis-permainan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'kuis-permainan' && <KuisPermainanView />}

        {activeTab === 'asesmen' && <AsesmenView />}

        {activeTab === 'dashboard-guru' && <DashboardGuruView />}
      </main>

      {/* Clean Educational Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">SistemKomputer.Edu</span>
            <span aria-hidden="true">·</span>
            <span>Media Pembelajaran Interaktif Kurikulum Informatika</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => {
                setActiveTab('materi');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Materi
            </button>
            <button
              onClick={() => {
                setActiveTab('kuis-permainan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Kuis & Permainan
            </button>
            <button
              onClick={() => {
                setActiveTab('asesmen');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Asesmen 20 Menit
            </button>
            <button
              onClick={() => {
                setActiveTab('dashboard-guru');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-sky-700 hover:text-sky-900 font-semibold transition-colors cursor-pointer"
            >
              Dashboard Rekap Guru
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
