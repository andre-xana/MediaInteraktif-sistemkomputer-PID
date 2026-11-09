import React, { useState } from 'react';
import { materialSubSections } from '../data/learningMaterials';
import { MaterialSubSection } from '../types';
import { InteractiveTrio } from './InteractiveTrio';
import { InteractiveMotherboardExplorer } from './InteractiveMotherboardExplorer';
import { InteractiveDataflowSim } from './InteractiveDataflowSim';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  Cpu,
  Server,
  Terminal,
  Workflow,
  Check,
  RotateCcw
} from 'lucide-react';

interface MateriViewProps {
  completedSubSections: string[];
  onToggleComplete: (id: string) => void;
  onResetProgress: () => void;
  onGoToQuiz: () => void;
}

export const MateriView: React.FC<MateriViewProps> = ({
  completedSubSections,
  onToggleComplete,
  onResetProgress,
  onGoToQuiz
}) => {
  const [expandedId, setExpandedId] = useState<string>(materialSubSections[0].id);

  const getSubSectionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return Cpu;
      case 'Layers':
        return Layers;
      case 'Server':
        return Server;
      case 'Terminal':
        return Terminal;
      case 'Workflow':
        return Workflow;
      default:
        return BookOpen;
    }
  };

  const handleNextSection = (currentIndex: number) => {
    const currentId = materialSubSections[currentIndex].id;
    if (!completedSubSections.includes(currentId)) {
      onToggleComplete(currentId);
    }

    if (currentIndex + 1 < materialSubSections.length) {
      const nextId = materialSubSections[currentIndex + 1].id;
      setExpandedId(nextId);
      // smooth scroll to top of section
      const elem = document.getElementById(nextId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Reached end of materials
      onGoToQuiz();
    }
  };

  const progressPercent = Math.round((completedSubSections.length / materialSubSections.length) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Banner */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-2">
                <span>Modul Pembelajaran Interaktif</span>
                <span aria-hidden="true">·</span>
                <span>Informatika Fase D/E</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                Memahami Pondasi Sistem Komputer Modern
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                Pelajari bagaimana perangkat keras (Hardware), perangkat lunak (Software), dan manusia (Brainware) bersinergi dalam siklus pengolahan data untuk menyelesaikan berbagai pekerjaan di era digital.
              </p>
            </div>

            {/* Read Progress Summary */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  Progres Belajar Mandiri: {completedSubSections.length} dari {materialSubSections.length} Bagian Selesai
                </span>
                <span className="text-sky-700 font-bold font-mono">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {completedSubSections.length > 0 && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={onResetProgress}
                    className="text-[11px] text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Penanda Baca
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-5 relative bg-slate-100 min-h-[220px]">
            <img
              src="/src/assets/images/hero_sistem_komputer_1794207463046.jpg"
              alt="Ilustrasi Ekosistem Sistem Komputer Lengkap"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Sub-sections List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Daftar Sub-Bagian Materi (Buka Satu per Satu)
          </h2>
          <span className="text-xs text-slate-500">Klik kartu untuk membuka materi</span>
        </div>

        {materialSubSections.map((subSection: MaterialSubSection, index: number) => {
          const isExpanded = expandedId === subSection.id;
          const isCompleted = completedSubSections.includes(subSection.id);
          const SubIcon = getSubSectionIcon(subSection.iconName);

          return (
            <div
              key={subSection.id}
              id={subSection.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                isExpanded
                  ? 'border-sky-300 ring-2 ring-sky-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header Accordion Trigger */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? '' : subSection.id)}
                className="w-full text-left p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isExpanded
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <SubIcon className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono font-bold text-sky-600">
                        BAGIAN {subSection.number}
                      </span>
                      {isCompleted && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Sudah Dibaca
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {subSection.title}
                    </h3>
                    {!isExpanded && (
                      <p className="text-xs sm:text-sm text-slate-500 truncate mt-0.5">
                        {subSection.shortDesc}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                  <span className="text-xs font-medium text-slate-400 hidden sm:inline">
                    {isExpanded ? 'Tutup' : 'Buka'}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Collapsible Content Body */}
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-6">
                  {/* Summary Callout */}
                  <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-4 text-slate-800 text-sm leading-relaxed">
                    <div className="flex items-center gap-1.5 font-bold text-sky-900 mb-1 text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      Intisari Materi
                    </div>
                    {subSection.summary}
                  </div>

                  {/* Interactive Embed Component if Applicable */}
                  {subSection.interactiveType === 'trio-system' && (
                    <div className="my-4">
                      <InteractiveTrio />
                    </div>
                  )}

                  {subSection.interactiveType === 'motherboard-diagram' && (
                    <div className="my-4">
                      <InteractiveMotherboardExplorer />
                    </div>
                  )}

                  {subSection.interactiveType === 'dataflow-sim' && (
                    <div className="my-4">
                      <InteractiveDataflowSim />
                    </div>
                  )}

                  {/* Key Points */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                      Poin-Poin Penting
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {subSection.keyPoints.map((point, pIdx) => (
                        <div
                          key={pIdx}
                          className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {pIdx + 1}
                          </span>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deep Dive & Concrete Examples */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-7 bg-white border border-slate-200 p-4 rounded-xl">
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        {subSection.deepDive.title}
                      </h4>
                      <p className="text-xs text-slate-500 mb-3">
                        {subSection.deepDive.description}
                      </p>
                      <div className="space-y-3">
                        {subSection.deepDive.items?.map((item, dIdx) => (
                          <div key={dIdx} className="border-b border-slate-100 last:border-0 pb-2.5 last:pb-0">
                            <div className="font-semibold text-xs sm:text-sm text-slate-800">
                              {item.label}
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {item.desc}
                            </p>
                            {item.detail && (
                              <div className="text-[11px] text-sky-700 bg-sky-50/60 px-2 py-1 rounded mt-1">
                                {item.detail}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">
                          Contoh Nyata Sehari-hari
                        </h4>
                        <div className="space-y-2">
                          {subSection.examples.map((ex, eIdx) => (
                            <div
                              key={eIdx}
                              className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs leading-relaxed"
                            >
                              {ex}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
                        <span className="font-bold">Tips Mempelajari:</span> Cobalah mengingat hubungan tiap komponen dengan contoh perangkat yang kamu gunakan setiap hari (laptop, HP, tablet).
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation & Read Status Bar */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleComplete(subSection.id)}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                      {isCompleted ? 'Telah Ditandai Selesai Dibaca' : 'Tandai Bagian Ini Sudah Dibaca'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNextSection(index)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-colors cursor-pointer"
                    >
                      <span>
                        {index + 1 < materialSubSections.length
                          ? `Lanjut ke Bagian ${materialSubSections[index + 1].number}`
                          : 'Selesai Materi & Masuk ke Kuis'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Quick Jump to Quiz Card */}
      <section className="bg-gradient-to-br from-sky-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1.5 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Sudah Membaca Semua Materi?
          </h3>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
            Uji pemahamanmu dengan memainkan Kuis Cepat 10 soal atau permainan Drag and Drop mencocokkan perangkat sebelum mengikuti Asesmen resmi.
          </p>
        </div>
        <button
          type="button"
          onClick={onGoToQuiz}
          className="shrink-0 px-6 py-3 bg-white text-sky-700 hover:bg-sky-50 font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
        >
          <span>Buka Kuis & Permainan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
