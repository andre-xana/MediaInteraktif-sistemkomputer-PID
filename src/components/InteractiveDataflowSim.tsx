import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ArrowRight, Keyboard, Cpu, Monitor, HardDrive, CheckCircle2 } from 'lucide-react';

interface SimulationScenario {
  id: string;
  title: string;
  inputDevice: string;
  inputValue: string;
  outputDevice: string;
  outputResult: string;
  storageTarget: string;
}

const SCENARIOS: SimulationScenario[] = [
  {
    id: 'typing',
    title: 'Mengetik Karakter "K" di Dokumen',
    inputDevice: 'Keyboard (Input)',
    inputValue: 'Tekanan tombol jari → Kode Biner ASCII (01001011)',
    outputDevice: 'Layar Monitor (Output)',
    outputResult: 'Piksel huruf "K" bercahaya seketika di monitor',
    storageTarget: 'Disimpan di SSD / Flashdisk sebagai file "Dokumen.docx"'
  },
  {
    id: 'photo',
    title: 'Memotret Wajah dengan Web Camera',
    inputDevice: 'Web Camera (Input)',
    inputValue: 'Sensor optik menangkap cahaya visual wajah',
    outputDevice: 'Layar Monitor (Output)',
    outputResult: 'Tampilan foto berwarna muncul di jendela aplikasi',
    storageTarget: 'Tersimpan permanen di folder Pictures SSD ("FotoSaya.jpg")'
  },
  {
    id: 'calc',
    title: 'Menghitung Rumus Matematika (25 x 4)',
    inputDevice: 'Keyboard Numpad (Input)',
    inputValue: 'Input angka 25, operator perkalian (*), dan angka 4',
    outputDevice: 'Layar Monitor (Output)',
    outputResult: 'Angka 100 tampil dalam waktu seperseribu detik',
    storageTarget: 'Hasil perhitungan dicatat di buku kas atau spreadsheet'
  }
];

export const InteractiveDataflowSim: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('typing');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const scenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 4) {
            setIsPlaying(false);
            return 4;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const steps = [
    {
      index: 1,
      name: '1. INPUT',
      sub: 'Penerimaan Data',
      icon: Keyboard,
      desc: scenario.inputValue,
      detail: 'Perangkat masukan mengubah aksi mekanis fisik menjadi pulsa tegangan biner (0 & 1).'
    },
    {
      index: 2,
      name: '2. BUFFER RAM',
      sub: 'Antrian Memori Cepat',
      icon: Cpu,
      desc: 'Data biner ditampung di alamat memori RAM agar CPU dapat membacanya tanpa hambatan.',
      detail: 'RAM bertindak sebagai meja kerja siap saji bagi prosesor.'
    },
    {
      index: 3,
      name: '3. PROSES CPU',
      sub: 'Fetch - Decode - Execute',
      icon: Cpu,
      desc: 'Control Unit membaca instruksi, ALU menghitung dan memproses logika data.',
      detail: 'CPU memproses milyaran siklus per detik di dalam inti mikrokontroler.'
    },
    {
      index: 4,
      name: '4. OUTPUT',
      sub: 'Penyajian Informasi',
      icon: Monitor,
      desc: scenario.outputResult,
      detail: 'Sinyal biner dikonversi menjadi cahaya piksel visual atau getaran suara yang dimengerti panca indra manusia.'
    },
    {
      index: 5,
      name: '5. STORAGE',
      sub: 'Penyimpanan Permanen',
      icon: HardDrive,
      desc: scenario.storageTarget,
      detail: 'Saat tombol Simpan ditekan, data disalin dari RAM ke media non-volatil (SSD/HDD) agar tidak hilang saat mati listrik.'
    }
  ];

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">Simulasi Interaktif Alur Data</span>
          <h4 className="text-base sm:text-lg font-bold text-white">Siklus: Input → Proses → Output → Storage</h4>
        </div>
        
        {/* Scenario selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 shrink-0">Studi Kasus:</label>
          <select
            value={selectedScenarioId}
            onChange={(e) => {
              setSelectedScenarioId(e.target.value);
              handleReset();
            }}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (currentStep >= 4) setCurrentStep(0);
              setIsPlaying(!isPlaying);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
          >
            <Play className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            {isPlaying ? 'Jeda Simulasi' : currentStep >= 4 ? 'Ulangi Otomatis' : 'Jalankan Animasi'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((prev) => Math.min(4, prev + 1));
            }}
            disabled={currentStep >= 4}
            className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
          >
            Maju 1 Langkah
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Tahapan
        </button>
      </div>

      {/* 5-Step Pipeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3 mb-6">
        {steps.map((st, idx) => {
          const isPassed = currentStep > idx;
          const isCurrent = currentStep === idx;
          const Icon = st.icon;

          return (
            <div
              key={st.index}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(idx);
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                isCurrent
                  ? 'bg-sky-950 border-sky-400 ring-2 ring-sky-400/30'
                  : isPassed
                  ? 'bg-slate-800/80 border-emerald-500/50 text-slate-300'
                  : 'bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-90'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400">Step 0{idx + 1}</span>
                {isPassed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-sky-400 animate-bounce' : 'text-slate-500'}`} />
                )}
              </div>
              <div className="font-bold text-xs sm:text-sm text-white mb-0.5">{st.name}</div>
              <div className="text-[10px] text-sky-300 font-medium line-clamp-1">{st.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Active Stage Callout Deck */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-sky-500/30 text-left">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-sky-400 tracking-wider uppercase">
            Tahap Aktif: {steps[currentStep].name}
          </span>
          <span className="text-xs text-slate-500">·</span>
          <span className="text-xs text-slate-300">{steps[currentStep].sub}</span>
        </div>
        
        <div className="text-sm sm:text-base font-semibold text-white mb-2">
          {steps[currentStep].desc}
        </div>
        
        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          {steps[currentStep].detail}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-sky-500 h-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
          <span>Mulai (Input)</span>
          <span>Progres: {currentStep + 1} / 5 Tahapan Selesai</span>
          <span>Selesai (Tersimpan)</span>
        </div>
      </div>
    </div>
  );
};
