import { AssessmentQuestion } from '../types';

export const assessmentQuestions: AssessmentQuestion[] = [
  // 10 Pilihan Ganda
  {
    id: 1,
    type: 'mcq',
    question: 'Sebuah komputer memiliki prosesor paling mutakhir, RAM 32GB, dan monitor canggih. Namun, komputer tersebut belum dipasang sistem operasi apapun. Kondisi yang akan terjadi ketika tombol power dinyalakan adalah...',
    options: [
      'A. Komputer langsung membuka aplikasi pemutar video secara otomatis',
      'B. Komputer tidak dapat menjalankan aplikasi apapun karena tidak ada sistem operasi yang mengendalikan hardware',
      'C. Komputer berfungsi normal seperti biasa menggunakan memori RAM saja',
      'D. Komputer langsung terhubung ke internet dan mengunduh program mandiri'
    ],
    correctOptionIndex: 1,
    explanation: 'Hardware secanggih apapun tidak dapat menjalankan aplikasi atau menerima perintah manusia tanpa adanya Software (khususnya Sistem Operasi) sebagai jembatan pengendali.',
    scoreWeight: 6.67
  },
  {
    id: 2,
    type: 'mcq',
    question: 'Di antara pilihan berikut, manakah kombinasi yang tepat yang menghubungkan "Perangkat - Kategori - Fungsinya"?',
    options: [
      'A. Barcode Scanner - Output - Mengeluarkan berkas faktur belanjaan',
      'B. Mikrofon - Input - Menangkap gelombang suara dan mengubahnya jadi data audio digital',
      'C. Layar Monitor - Input - Memasukkan teks dokumen ke dalam sistem',
      'D. SSD NVMe - Proses - Melakukan operasi logika dan aritmatika'
    ],
    correctOptionIndex: 1,
    explanation: 'Mikrofon adalah perangkat Input yang bertugas menangkap gelombang suara getaran udara dan mengonversinya menjadi sinyal digital biner.',
    scoreWeight: 6.67
  },
  {
    id: 3,
    type: 'mcq',
    question: 'Dalam Central Processing Unit (CPU), bagian yang bertanggung jawab langsung untuk melakukan perhitungan matematika (seperti penjumlahan dan perkalian) serta perbandingan logika (seperti AND, OR, NOT) adalah...',
    options: [
      'A. Control Unit (CU)',
      'B. Register Memori',
      'C. Arithmetic Logic Unit (ALU)',
      'D. Power Connector'
    ],
    correctOptionIndex: 2,
    explanation: 'ALU (Arithmetic Logic Unit) adalah sirkuit digital di dalam CPU yang bertugas melakukan semua operasi aritmatika (hitung-menghitung) dan operasi logika boole.',
    scoreWeight: 6.67
  },
  {
    id: 4,
    type: 'mcq',
    question: 'Rani sedang mengetik naskah cerpen di aplikasi pengolah kata. Tiba-tiba listrik di rumahnya padam dan komputernya mati seketika. Saat dinyalakan kembali, ketikan terakhirnya hilang karena Rani belum menekan tombol "Simpan" (Save). Mengapa hal tersebut bisa terjadi?',
    options: [
      'A. Naskah Rani tersimpan di ROM yang sifatnya lambat',
      'B. Naskah yang sedang aktif diketik masih berada di RAM yang bersifat Volatile (data lenyap saat listrik mati)',
      'C. Processor Rani mengalami panas berlebih sehingga menghapus memori',
      'D. Monitor komputer tidak sempat memproyeksikan teks ke motherboard'
    ],
    correctOptionIndex: 1,
    explanation: 'Saat kita mengetik namun belum menyimpannya (Save), dokumen tersebut masih berada di memori RAM (Random Access Memory). Karena RAM bersifat volatile, semua isinya akan hilang saat pasokan listrik terputus.',
    scoreWeight: 6.67
  },
  {
    id: 5,
    type: 'mcq',
    question: 'Komponen papan sirkuit utama yang berfungsi sebagai wadah fisik dan penyedia jalur komunikasi (data bus) yang mengintegrasikan CPU, RAM, kartu grafis, dan storage adalah...',
    options: [
      'A. Power Supply Unit (PSU)',
      'B. Motherboard (Mainboard)',
      'C. Hard Disk Drive (HDD)',
      'D. Heat Sink Fan'
    ],
    correctOptionIndex: 1,
    explanation: 'Motherboard adalah papan sirkuit cetak utama (PCB) yang mendistribusikan sinyal listrik dan menghubungkan seluruh modul perangkat keras komputer.',
    scoreWeight: 6.67
  },
  {
    id: 6,
    type: 'mcq',
    question: 'Salah satu fungsi krusial dari Sistem Operasi adalah "Multitasking". Apa yang dimaksud dengan kemampuan Multitasking pada sistem operasi?',
    options: [
      'A. Kemampuan komputer untuk bekerja tanpa membutuhkan daya listrik baterai',
      'B. Kemampuan menjalankan beberapa aplikasi atau proses secara bersamaan secara efisien',
      'C. Kemampuan menggandakan perangkat keras CPU menjadi dua buah fisik',
      'D. Kemampuan menghapus file virus secara otomatis tanpa perintah pengguna'
    ],
    correctOptionIndex: 1,
    explanation: 'Multitasking adalah kemampuan sistem operasi untuk mengatur giliran eksekusi CPU sehingga pengguna dapat membuka dan menjalankan beberapa program sekaligus (misal: mendengarkan musik sambil mengetik dokumen).',
    scoreWeight: 6.67
  },
  {
    id: 7,
    type: 'mcq',
    question: 'Seorang arsitek ingin mencetak gambar denah gedung berukuran sangat besar (kertas A0) dengan detail garis presisi tinggi. Perangkat keluaran (Output Device) khusus yang paling tepat digunakan adalah...',
    options: [
      'A. Plotter',
      'B. Barcode Scanner',
      'C. Graphic Tablet (Digitizer)',
      'D. Web Camera'
    ],
    correctOptionIndex: 0,
    explanation: 'Plotter adalah jenis printer grafis format besar (output device) yang dirancang khusus untuk mencetak gambar teknik, denah arsitektur, dan peta dengan tingkat ketelitian tinggi.',
    scoreWeight: 6.67
  },
  {
    id: 8,
    type: 'mcq',
    question: 'Mengapa perangkat komputer membutuhkan Power Supply Unit (PSU) dan tidak dapat langsung dihubungkan begitu saja ke kabel stopkontak PLN tanpa adaptor/PSU?',
    options: [
      'A. Karena arus listrik PLN adalah AC tegangan tinggi (220V), sedangkan chip komputer membutuhkan arus DC bertegangan rendah (3.3V, 5V, 12V)',
      'B. Karena stopkontak PLN hanya menyediakan jaringan internet tanpa aliran listrik',
      'C. Karena komputer membutuhkan gelombang suara analog untuk menyalakan monitor',
      'D. Agar komputer bisa menyimpan data secara permanen saat dimatikan'
    ],
    correctOptionIndex: 0,
    explanation: 'Sirkuit mikroelektronika komputer bekerja pada arus searah (DC) dengan voltase rendah (12V, 5V, 3.3V). PSU bertugas menyearahkan dan menurunkan tegangan arus bolak-balik (AC) 220V dari stopkontak PLN.',
    scoreWeight: 6.67
  },
  {
    id: 9,
    type: 'mcq',
    question: 'Perhatikan alur berikut:\n1. Siswa mengeklik tombol mouse\n2. CPU menerima sinyal instruksi dan menghitung koordinat\n3. Layar monitor menampilkan kursor bergerak ke tombol baru\n4. Riwayat tindakan dicatat ke dalam log penyimpanan SSD.\nAlur di atas secara berurutan mencerminkan tahapan kerja komputer, yaitu...',
    options: [
      'A. Storage → Output → Proses → Input',
      'B. Input → Proses → Output → Storage',
      'C. Output → Input → Storage → Proses',
      'D. Proses → Storage → Input → Output'
    ],
    correctOptionIndex: 1,
    explanation: 'Siklus pengolahan data standar komputer adalah Input (klik mouse) → Proses (CPU menghitung) → Output (tampil di monitor) → Storage (tersimpan di SSD).',
    scoreWeight: 6.67
  },
  {
    id: 10,
    type: 'mcq',
    question: 'Di dalam kategori Brainware, orang yang memiliki keahlian menulis instruksi program menggunakan bahasa pemrograman seperti Python, JavaScript, atau C++ untuk menciptakan aplikasi baru disebut...',
    options: [
      'A. Operator / End User',
      'B. Programmer / Developer',
      'C. Teknisi Perakitan',
      'D. Data Entry Clerk'
    ],
    correctOptionIndex: 1,
    explanation: 'Programmer (pengembang perangkat lunak) adalah jenis brainware yang merancang logika dan menulis instruksi kode sumber menggunakan bahasa pemrograman.',
    scoreWeight: 6.67
  },

  // 5 Isian Singkat / Uraian Singkat
  {
    id: 11,
    type: 'short_answer',
    question: 'Sebutkan kepanjangan dari singkatan CPU dalam bahasa Inggris yang tepat!',
    expectedKeywords: ['central processing unit'],
    expectedAnswerSample: 'Central Processing Unit',
    explanation: 'CPU adalah singkatan dari Central Processing Unit, sering disebut sebagai unit pengolah pusat atau otak komputer.',
    scoreWeight: 6.66
  },
  {
    id: 12,
    type: 'short_answer',
    question: 'Sebutkan sifat penyimpanan memori RAM yang menyebabkan datanya akan langsung terhapus saat komputer dimatikan atau kehilangan aliran daya listrik!',
    expectedKeywords: ['volatile', 'volatil', 'bersifat volatile', 'sementara'],
    expectedAnswerSample: 'Volatile (data sementara dan hilang saat arus listrik mati)',
    explanation: 'Memori RAM bersifat Volatile, artinya membutuhkan daya listrik aktif untuk mempertahankan bit-bit data.',
    scoreWeight: 6.66
  },
  {
    id: 13,
    type: 'short_answer',
    question: 'Sebutkan salah satu contoh nama Sistem Operasi (Operating System) yang paling banyak digunakan di perangkat laptop atau komputer desktop di seluruh dunia!',
    expectedKeywords: ['windows', 'microsoft windows', 'linux', 'ubuntu', 'macos', 'mac os', 'apple macos'],
    expectedAnswerSample: 'Windows (atau macOS / Linux)',
    explanation: 'Contoh sistem operasi populer untuk desktop/laptop meliputi Microsoft Windows, Apple macOS, dan Linux (seperti Ubuntu).',
    scoreWeight: 6.66
  },
  {
    id: 14,
    type: 'short_answer',
    question: 'Sebutkan komponen perangkat keras (Hardware) yang berfungsi mengonversi arus listrik AC dari stopkontak menjadi arus listrik DC untuk seluruh komponen di dalam komputer!',
    expectedKeywords: ['psu', 'power supply', 'power supply unit', 'catu daya'],
    expectedAnswerSample: 'Power Supply Unit (PSU) / Catu Daya',
    explanation: 'Power Supply Unit (PSU) atau unit catu daya bertugas menstabilkan dan mengalirkan arus DC ke motherboard, prosesor, dan drive.',
    scoreWeight: 6.66
  },
  {
    id: 15,
    type: 'short_answer',
    question: 'Termasuk ke dalam kategori perangkat apakah sebuah "Layar Monitor" jika dikelompokkan dalam siklus IPOS (Input, Proses, Output, atau Storage)?',
    expectedKeywords: ['output', 'keluaran', 'perangkat output', 'perangkat keluaran'],
    expectedAnswerSample: 'Output (Perangkat Keluaran)',
    explanation: 'Layar Monitor tergolong sebagai perangkat Output (Keluaran) karena menyajikan data visual hasil pemrosesan kepada pengguna.',
    scoreWeight: 6.66
  }
];
