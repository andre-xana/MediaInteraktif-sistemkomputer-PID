import { DeviceItem } from '../types';

export const matchingGameItems: DeviceItem[] = [
  // INPUT
  {
    id: 'dev-kb',
    name: 'Keyboard',
    category: 'input',
    categoryLabel: 'Perangkat Input (Masukan)',
    icon: 'Keyboard',
    description: 'Papan tombol untuk memasukkan karakter alfanumerik, simbol, dan tombol pintas.',
    hint: 'Menerima ketikan jari pengguna.'
  },
  {
    id: 'dev-mouse',
    name: 'Mouse Optik',
    category: 'input',
    categoryLabel: 'Perangkat Input (Masukan)',
    icon: 'Mouse',
    description: 'Perangkat penunjuk untuk mengarahkan kursor dan memilih objek di layar monitor.',
    hint: 'Mendeteksi pergerakan tangan dan klik tombol.'
  },
  {
    id: 'dev-mic',
    name: 'Mikrofon',
    category: 'input',
    categoryLabel: 'Perangkat Input (Masukan)',
    icon: 'Mic',
    description: 'Menangkap getaran gelombang suara dan mengubahnya menjadi sinyal audio digital.',
    hint: 'Digunakan saat merekam suara atau berbicara di panggilan online.'
  },
  {
    id: 'dev-webcam',
    name: 'Web Camera (Webcam)',
    category: 'input',
    categoryLabel: 'Perangkat Input (Masukan)',
    icon: 'Camera',
    description: 'Menangkap citra visual langsung di depan komputer dalam bentuk aliran video biner.',
    hint: 'Mengambil gambar wajah pengguna secara langsung.'
  },

  // PROSES
  {
    id: 'dev-cpu',
    name: 'CPU (Prosesor)',
    category: 'proses',
    categoryLabel: 'Perangkat Proses (Pengolah)',
    icon: 'Cpu',
    description: 'Otak utama yang menjalankan instruksi, logika kontrol, dan perhitungan matematis.',
    hint: 'Melakukan pemrosesan instruksi tercepat di komputer.'
  },
  {
    id: 'dev-gpu',
    name: 'GPU (Kartu Grafis)',
    category: 'proses',
    categoryLabel: 'Perangkat Proses (Pengolah)',
    icon: 'Sliders',
    description: 'Prosesor khusus pengolah ribuan kalkulasi geometri 3D, animasi grafis, dan video.',
    hint: 'Mengolah tampilan gambar game dan rendering video.'
  },
  {
    id: 'dev-soundcard',
    name: 'Sound Card (Kartu Suara)',
    category: 'proses',
    categoryLabel: 'Perangkat Proses (Pengolah)',
    icon: 'Radio',
    description: 'Chip pengolah sinyal audio digital menjadi analog dan sebaliknya dengan DAC/ADC.',
    hint: 'Mengolah sinyal data suara sebelum keluar ke speaker.'
  },
  {
    id: 'dev-ram',
    name: 'RAM (Memori Utama)',
    category: 'proses',
    categoryLabel: 'Perangkat Proses (Pengolah)',
    icon: 'MemoryStick',
    description: 'Tempat penampungan data dan instruksi yang sedang diproses langsung oleh CPU.',
    hint: 'Menyimpan data aplikasi yang sedang aktif berjalan secara cepat dan volatil.'
  },

  // OUTPUT
  {
    id: 'dev-monitor',
    name: 'Layar Monitor',
    category: 'output',
    categoryLabel: 'Perangkat Output (Keluaran)',
    icon: 'Monitor',
    description: 'Menampilkan hasil pengolahan komputasi dalam bentuk antarmuka visual grafis.',
    hint: 'Menampilkan tulisan, gambar, dan video yang bisa dilihat mata.'
  },
  {
    id: 'dev-speaker',
    name: 'Speaker / Headset',
    category: 'output',
    categoryLabel: 'Perangkat Output (Keluaran)',
    icon: 'Volume2',
    description: 'Mengeluarkan suara, efek nada, dan musik yang dihasilkan dari pemrosesan komputer.',
    hint: 'Menghasilkan gelombang suara yang bisa didengar telinga.'
  },
  {
    id: 'dev-printer',
    name: 'Printer Kertas',
    category: 'output',
    categoryLabel: 'Perangkat Output (Keluaran)',
    icon: 'Printer',
    description: 'Mencetak dokumen digital dan foto menjadi bentuk fisik di atas lembaran kertas.',
    hint: 'Menghasilkan salinan fisik (hard copy).'
  },
  {
    id: 'dev-projector',
    name: 'Proyektor LCD',
    category: 'output',
    categoryLabel: 'Perangkat Output (Keluaran)',
    icon: 'Tv',
    description: 'Memproyeksikan tampilan visual komputer ke layar kain besar atau dinding kelas.',
    hint: 'Sering dipakai guru untuk presentasi materi di depan kelas.'
  },

  // STORAGE
  {
    id: 'dev-ssd',
    name: 'SSD (Solid State Drive)',
    category: 'storage',
    categoryLabel: 'Perangkat Penyimpanan (Storage)',
    icon: 'HardDrive',
    description: 'Media penyimpanan permanen kecepatan tinggi berbasis chip memori flash tanpa bagian mekanik.',
    hint: 'Menyimpan sistem operasi Windows dan aplikasi agar booting kilat.'
  },
  {
    id: 'dev-hdd',
    name: 'Hard Disk Drive (HDD)',
    category: 'storage',
    categoryLabel: 'Perangkat Penyimpanan (Storage)',
    icon: 'Disc',
    description: 'Media penyimpanan sekunder berkapasitas besar menggunakan piringan magnetik berputar.',
    hint: 'Menyimpan arsip file besar dengan harga terjangkau.'
  },
  {
    id: 'dev-flashdisk',
    name: 'Flashdisk USB',
    category: 'storage',
    categoryLabel: 'Perangkat Penyimpanan (Storage)',
    icon: 'Usb',
    description: 'Media penyimpanan portabel yang mudah dibawa ke mana-mana dan dicolokkan ke port USB.',
    hint: 'Biasa dipakai siswa untuk mengumpulkan tugas ke guru.'
  },
  {
    id: 'dev-sdcard',
    name: 'Kartu Memori SD',
    category: 'storage',
    categoryLabel: 'Perangkat Penyimpanan (Storage)',
    icon: 'CreditCard',
    description: 'Media penyimpanan ringkas berbentuk lempengan kecil untuk kamera digital dan ponsel.',
    hint: 'Penyimpan foto dan video berukuran mini.'
  }
];

export const CATEGORY_DEFINITIONS = [
  {
    id: 'input' as const,
    name: 'Input (Masukan)',
    description: 'Menerima data fisik dari luar dan mengubahnya jadi kode biner digital.',
    colorBg: 'bg-amber-50 dark:bg-amber-950/30',
    colorBorder: 'border-amber-300 dark:border-amber-700',
    colorText: 'text-amber-800 dark:text-amber-300',
    colorBadge: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200'
  },
  {
    id: 'proses' as const,
    name: 'Proses (Pengolah)',
    description: 'Memanipulasi, menghitung aritmatika, dan mengeksekusi instruksi data.',
    colorBg: 'bg-sky-50 dark:bg-sky-950/30',
    colorBorder: 'border-sky-300 dark:border-sky-700',
    colorText: 'text-sky-800 dark:text-sky-300',
    colorBadge: 'bg-sky-100 text-sky-900 dark:bg-sky-900/50 dark:text-sky-200'
  },
  {
    id: 'output' as const,
    name: 'Output (Keluaran)',
    description: 'Menyajikan hasil olahan data ke bentuk yang dimengerti panca indra manusia.',
    colorBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    colorBorder: 'border-emerald-300 dark:border-emerald-700',
    colorText: 'text-emerald-800 dark:text-emerald-300',
    colorBadge: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200'
  },
  {
    id: 'storage' as const,
    name: 'Storage (Penyimpan)',
    description: 'Menyimpan data dan program secara aman untuk penggunaan jangka panjang.',
    colorBg: 'bg-purple-50 dark:bg-purple-950/30',
    colorBorder: 'border-purple-300 dark:border-purple-700',
    colorText: 'text-purple-800 dark:text-purple-300',
    colorBadge: 'bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-purple-200'
  }
];
