import React from 'react';
import { TabType } from '../types';
import { BookOpen, Gamepad2, Award, Laptop } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  completedMaterialsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  completedMaterialsCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 block leading-tight">
              SistemKomputer<span className="text-sky-600">.Edu</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
              Media Pembelajaran Interaktif Informatika
            </span>
          </div>
        </div>

        {/* Tab Navigation Controls (3 Zones) */}
        <nav className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => onTabChange('materi')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'materi'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Materi</span>
            {completedMaterialsCount > 0 && (
              <span className="hidden sm:inline-block ml-1 px-1.5 py-0.2 text-[10px] bg-sky-100 text-sky-800 rounded-full font-bold">
                {completedMaterialsCount}/5
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('kuis-permainan')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'kuis-permainan'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Kuis & Permainan</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('asesmen')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'asesmen'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Asesmen</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('dashboard-guru')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard-guru'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-sky-700 hover:text-sky-900 hover:bg-sky-50'
            }`}
          >
            <span>Rekap Guru</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
