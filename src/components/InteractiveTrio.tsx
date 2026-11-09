import React, { useState } from 'react';
import { Monitor, Code, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export const InteractiveTrio: React.FC = () => {
  const [activePillar, setActivePillar] = useState<'hardware' | 'software' | 'brainware'>('hardware');
  const [disabledPillar, setDisabledPillar] = useState<string | null>(null);

  const pillars = [
    {
      id: 'hardware' as const,
      name: 'Hardware',
      role: 'Perangkat Keras',
      icon: Monitor,
      color: 'blue',
      summary: 'Wadah fisik elektronika yang mengeksekusi sinyal listrik biner.',
      details: 'Meliputi CPU, motherboard, RAM, monitor, keyboard, dan komponen fisik lainnya. Berfungsi menerima sinyal dan mengeksekusi instruksi.'
    },
    {
      id: 'software' as const,
      name: 'Software',
      role: 'Perangkat Lunak',
      icon: Code,
      color: 'emerald',
      summary: 'Kumpulan instruksi kode digital yang mengendalikan hardware.',
      details: 'Meliputi Sistem Operasi (Windows, Android), aplikasi perkantoran, peramban web, dan game yang menerjemahkan keinginan manusia menjadi biner.'
    },
    {
      id: 'brainware' as const,
      name: 'Brainware',
      role: 'Manusia / Pengguna',
      icon: User,
      color: 'purple',
      summary: 'Manusia cerdas pengendali, pencipta instruksi, dan pemanfaat hasil komputasi.',
      details: 'Pengguna yang mengoperasikan komputer, programmer pembuat aplikasi, serta teknisi jaringan yang merawat infrastruktur sistem.'
    }
  ];

  return (
    <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-sky-400">Simulasi Hubungan Tiga Pilar Komputer</h4>
          <p className="text-xs text-slate-400">Klik salah satu pilar untuk mengeksplorasi peranannya, atau nonaktifkan satu pilar untuk melihat akibatnya!</p>
        </div>
        <button
          onClick={() => setDisabledPillar(null)}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 self-start sm:self-auto transition-colors"
        >
          Reset Simulasi
        </button>
      </div>

      {/* Interactive Pillar Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {pillars.map((p) => {
          const Icon = p.icon;
          const isSelected = activePillar === p.id;
          const isDisabled = disabledPillar === p.id;

          return (
            <div
              key={p.id}
              onClick={() => {
                setActivePillar(p.id);
              }}
              className={`cursor-pointer p-4 rounded-xl border transition-all text-left relative ${
                isDisabled
                  ? 'bg-rose-950/40 border-rose-800/80 opacity-75'
                  : isSelected
                  ? 'bg-sky-950/50 border-sky-400 ring-2 ring-sky-400/30'
                  : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDisabledPillar(disabledPillar === p.id ? null : p.id);
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                    isDisabled
                      ? 'bg-rose-600 text-white hover:bg-rose-500'
                      : 'bg-slate-700/80 text-slate-300 hover:bg-rose-900/60 hover:text-rose-200'
                  }`}
                  title={isDisabled ? 'Aktifkan kembali pilar ini' : 'Coba nonaktifkan pilar ini'}
                >
                  {isDisabled ? 'Mati (Klik Hidupkan)' : 'Uji Matikan'}
                </button>
              </div>
              <div className="font-semibold text-white text-base">{p.name}</div>
              <div className="text-xs text-sky-300 font-medium">{p.role}</div>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2">{p.summary}</p>
            </div>
          );
        })}
      </div>

      {/* Dynamic Simulation Output */}
      {disabledPillar ? (
        <div className="bg-rose-950/60 border border-rose-700/70 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-rose-200 text-sm">
              Peringatan Kritis: Pilar {pillars.find((p) => p.id === disabledPillar)?.name} Ditiadakan!
            </div>
            <p className="text-xs text-rose-100 mt-1 leading-relaxed">
              {disabledPillar === 'hardware' &&
                'Akibat fatal: Tanpa Hardware, perangkat lunak (Software) hanya berupa rangkaian kode abstrak yang tidak memiliki wadah fisik untuk dijalankan, dan Brainware tidak memiliki alat untuk berinteraksi.'}
              {disabledPillar === 'software' &&
                'Akibat fatal: Tanpa Software, perangkat keras (Hardware) secanggih apapun hanyalah rongsokan sirkuit listrik yang mati dan hening karena tidak ada instruksi biner yang mengatur cara kerjanya.'}
              {disabledPillar === 'brainware' &&
                'Akibat fatal: Tanpa Brainware (manusia), komputer tidak akan pernah dinyalakan, tidak ada input perintah, dan tidak ada tujuan penyelesaian masalah.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-emerald-300 text-sm">
              Sinergi Sempurna: {pillars.find((p) => p.id === activePillar)?.name} ({pillars.find((p) => p.id === activePillar)?.role})
            </div>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              {pillars.find((p) => p.id === activePillar)?.details}
            </p>
            <div className="text-[11px] text-sky-300 mt-2 font-medium">
              Ketiga elemen harus ada bersama-sama untuk membentuk satu Sistem Komputer yang fungsional.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
