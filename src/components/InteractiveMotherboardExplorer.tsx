import React, { useState } from 'react';
import { Cpu, HardDrive, Zap, Info, Layers, CheckCircle } from 'lucide-react';

interface ComponentDetail {
  id: string;
  name: string;
  role: string;
  icon: any;
  speed: string;
  functionDesc: string;
  studentTip: string;
}

const componentsList: ComponentDetail[] = [
  {
    id: 'cpu',
    name: 'Soket CPU & Prosesor',
    role: 'Pusat Pemrosesan Utama',
    icon: Cpu,
    speed: '3.0 - 5.8 GHz (Milyaran kalkulasi / detik)',
    functionDesc: 'Tempat dudukan chip prosesor (seperti Intel Core atau AMD Ryzen). Berisi ribuan pin emas mikro untuk pertukaran data secepat kilat dengan unit ALU dan CU.',
    studentTip: 'Selalu gunakan pasta termal (thermal paste) dan heatsink pendingin agar prosesor tidak overheat saat bekerja berat.'
  },
  {
    id: 'ram',
    name: 'Slot Memori RAM (DIMM)',
    role: 'Penyimpanan Kerja Sementara (Volatile)',
    icon: Layers,
    speed: '3200 MT/s - 6400 MT/s (Dual Channel)',
    functionDesc: 'Menampung program dan game yang sedang dibuka pengguna. Memungkinkan CPU membaca dan menulis data tanpa harus menunggu antrian lambat dari disk penyimpanan.',
    studentTip: 'Pasang dua keping RAM (Dual Channel) di slot warna selang-seling agar lebar pita (bandwidth) memori menjadi dua kali lipat lebih gesit.'
  },
  {
    id: 'ssd',
    name: 'Slot M.2 NVMe SSD',
    role: 'Penyimpanan Permanen Ultra Cepat',
    icon: HardDrive,
    speed: '3,500 - 7,400 MB/s (PCIe Gen 4/5)',
    functionDesc: 'Menyimpan sistem operasi Windows/Linux, software, dan file dokumen secara permanen tanpa motor mekanis yang berputar.',
    studentTip: 'Membuat proses menyalakan laptop (booting) yang dulu memakan waktu 2 menit di HDD, kini hanya butuh 6-8 detik di SSD NVMe!'
  },
  {
    id: 'pcie',
    name: 'Slot PCIe x16 (Kartu Grafis)',
    role: 'Jalur Ekspansi Berkecepatan Tinggi',
    icon: Zap,
    speed: 'Hingga 64 GB/s throughput data',
    functionDesc: 'Slot ekspansi utama untuk memasang GPU dedicated (NVIDIA GeForce atau AMD Radeon) guna merender gambar 3D, kecerdasan buatan, dan video 4K.',
    studentTip: 'Dilengkapi klip pengunci mekanik di ujung belakang slot agar kartu grafis yang berat tidak goyang atau terlepas.'
  },
  {
    id: 'io',
    name: 'Port Belakang (Rear I/O Panel)',
    role: 'Gerbang Antarmuka Input/Output Luar',
    icon: Info,
    speed: 'USB 3.2, HDMI 2.1, LAN Gigabit 2.5G',
    functionDesc: 'Kumpulan colokan di belakang casing untuk menghubungkan kabel monitor (HDMI/DisplayPort), keyboard, mouse USB, kabel LAN internet, dan jack speaker audio.',
    studentTip: 'Port USB warna biru atau merah menandakan transfer data USB 3.0/3.2 yang jauh lebih kencang dibanding USB hitam versi 2.0.'
  }
];

export const InteractiveMotherboardExplorer: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('cpu');
  const current = componentsList.find((c) => c.id === selectedId) || componentsList[0];
  const CurrentIcon = current.icon;

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-4 sm:p-6 overflow-hidden shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">Anatomi Interaktif</span>
          <h4 className="text-base sm:text-lg font-bold text-white">Pembedahan Komponen Motherboard</h4>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">Pilih salah satu komponen untuk melihat bedah fungsi teknisnya</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual Motherboard Diagram */}
        <div className="lg:col-span-7 relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
          <img
            src="/src/assets/images/komponen_perangkat_keras_1794207463633.jpg"
            alt="Diagram Teknis Motherboard Komputer dan Komponen Utama"
            className="w-full h-auto object-cover max-h-[380px] rounded-lg transition-transform duration-300 group-hover:scale-102"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
            <span className="text-xs text-slate-300 bg-slate-900/90 px-3 py-1 rounded-md border border-slate-700 backdrop-blur-sm">
              Model: Motherboard ATX Modern dengan Soket CPU, DDR5 RAM & Slot NVMe Gen 4
            </span>
          </div>
        </div>

        {/* Interactive Component Picker & Detail Card */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Pilih Komponen:
          </div>
          
          {/* Quick buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
            {componentsList.map((item) => {
              const ItemIcon = item.icon;
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`text-left p-2.5 sm:p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-400 shadow-md ring-2 ring-sky-400/30'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ItemIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-sky-400'}`} />
                    <span className="text-xs sm:text-sm font-semibold truncate">{item.name}</span>
                  </div>
                  {isSelected && <CheckCircle className="w-4 h-4 shrink-0 text-white ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Detailed Box */}
          <div className="mt-2 p-4 bg-slate-800/90 rounded-xl border border-sky-500/40 text-left">
            <div className="flex items-center gap-2 mb-1">
              <CurrentIcon className="w-5 h-5 text-sky-400" />
              <h5 className="font-bold text-white text-sm sm:text-base">{current.name}</h5>
            </div>
            <div className="text-xs text-sky-300 font-medium mb-2">{current.role}</div>
            
            <p className="text-xs text-slate-200 leading-relaxed mb-3">
              {current.functionDesc}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-slate-700/80 text-[11px]">
              <div className="flex items-baseline gap-1 text-slate-300">
                <span className="font-semibold text-slate-400 shrink-0">Kecepatan/Performa:</span>
                <span className="text-emerald-400 font-mono">{current.speed}</span>
              </div>
              <div className="text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-700/60">
                <span className="font-bold text-amber-400 mr-1">Tips Siswa:</span>
                {current.studentTip}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
