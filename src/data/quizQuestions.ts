import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'Pengertian Sistem Komputer',
    question: 'Tiga komponen utama pembangun sistem komputer yang tidak dapat dipisahkan satu sama lain adalah...',
    options: [
      'A. Monitor, Keyboard, dan Mouse',
      'B. Hardware, Software, dan Brainware',
      'C. CPU, RAM, dan Harddisk',
      'D. Windows, Linux, dan macOS'
    ],
    correctIndex: 1,
    explanation: 'Sistem komputer tersusun atas tiga pilar utama: Hardware (perangkat fisik), Software (perangkat lunak yang menginstruksikan), dan Brainware (manusia yang mengoperasikan). Tanpa salah satunya, sistem komputasi tidak akan berfungsi.'
  },
  {
    id: 2,
    category: 'Perangkat Masukan (Input)',
    question: 'Di bawah ini manakah kelompok perangkat yang seluruhnya termasuk ke dalam kategori perangkat masukan (Input Device)?',
    options: [
      'A. Keyboard, Mouse, Mikrofon, dan Scanner',
      'B. Monitor, Speaker, Printer, dan Proyektor',
      'C. CPU, RAM, Motherboard, dan GPU',
      'D. Flashdisk, SSD, Harddisk, dan CD-ROM'
    ],
    correctIndex: 0,
    explanation: 'Keyboard, Mouse, Mikrofon, dan Scanner adalah perangkat masukan (Input Device) yang berfungsi mengumpulkan data fisik dari dunia nyata dan menerjemahkannya ke dalam sinyal biner untuk diproses komputer.'
  },
  {
    id: 3,
    category: 'Komponen Utama (CPU)',
    question: 'Komponen perangkat keras yang dijuluki sebagai "otak komputer" karena bertugas mengeksekusi instruksi dan kalkulasi aritmatika adalah...',
    options: [
      'A. Power Supply Unit (PSU)',
      'B. Random Access Memory (RAM)',
      'C. Central Processing Unit (CPU)',
      'D. Solid State Drive (SSD)'
    ],
    correctIndex: 2,
    explanation: 'CPU (Central Processing Unit) atau prosesor bertindak sebagai pusat kendali dan pengolah seluruh instruksi komputasi, berisi unit kontrol (CU) dan unit logika aritmatika (ALU).'
  },
  {
    id: 4,
    category: 'Karakteristik Memori',
    question: 'RAM memiliki sifat memori yang "Volatile". Apa arti dari sifat tersebut?',
    options: [
      'A. Data di dalamnya tersimpan selamanya meskipun komputer dimatikan',
      'B. Data di dalamnya akan hilang seketika saat aliran listrik terputus',
      'C. Tidak membutuhkan aliran listrik sama sekali untuk bekerja',
      'D. Hanya bisa dibaca satu kali dan tidak bisa ditulis kembali'
    ],
    correctIndex: 1,
    explanation: 'Volatile berarti data yang berada di RAM hanya tersimpan selama ada pasokan arus listrik. Begitu komputer dimatikan atau restart, seluruh data sementara di RAM akan terhapus bersih.'
  },
  {
    id: 5,
    category: 'Papan Induk (Motherboard)',
    question: 'Fungsi utama dari Motherboard (Mainboard) pada sebuah komputer adalah...',
    options: [
      'A. Mengonversi arus listrik AC PLN menjadi arus DC bertegangan rendah',
      'B. Papan sirkuit utama tempat menghubungkan seluruh komponen dan jalur komunikasi bus data',
      'C. Menampilkan visual gambar beresolusi tinggi ke layar monitor',
      'D. Menyimpan berkas dokumen dan game dalam kapasitas gigabyte yang permanen'
    ],
    correctIndex: 1,
    explanation: 'Motherboard adalah tulang punggung fisik tempat bertumpunya semua komponen (prosesor, RAM, kartu grafis, storage) dan menyediakan jalur komunikasi data (data bus) antar perangkat.'
  },
  {
    id: 6,
    category: 'Perangkat Keluaran (Output)',
    question: 'Manakah di bawah ini yang merupakan perangkat keluaran (Output Device) yang menghasilkan salinan data dalam bentuk fisik cetakan kertas?',
    options: [
      'A. Barcode Scanner',
      'B. Printer',
      'C. Touchpad',
      'D. Web Camera'
    ],
    correctIndex: 1,
    explanation: 'Printer mengubah data digital berupa dokumen atau foto menjadi cetakan fisik nyata (hard copy) di atas kertas.'
  },
  {
    id: 7,
    category: 'Media Penyimpanan (Storage)',
    question: 'Keunggulan utama SSD (Solid State Drive) dibandingkan HDD (Hard Disk Drive) mekanik konvensional adalah...',
    options: [
      'A. SSD menggunakan piringan magnetik yang berputar lebih kencang',
      'B. SSD menggunakan chip flash memori sehingga kecepatan baca-tulis jauh lebih tinggi dan tahan guncangan',
      'C. SSD harganya jauh lebih murah untuk kapasitas terabyte yang sama',
      'D. SSD datanya akan hilang seketika saat listrik padam'
    ],
    correctIndex: 1,
    explanation: 'SSD tidak memiliki komponen mekanis yang berputar, melainkan menggunakan memori semikonduktor flash NAND. Kecepatannya bisa mencapai puluhan kali lipat HDD dan tidak rentan rusak akibat goncangan fisik.'
  },
  {
    id: 8,
    category: 'Sistem Operasi',
    question: 'Perangkat lunak dasar yang bertugas mengelola sumber daya perangkat keras dan memfasilitasi interaksi pengguna dengan aplikasi disebut...',
    options: [
      'A. Web Browser',
      'B. Sistem Operasi (Operating System)',
      'C. Antivirus',
      'D. Compiler'
    ],
    correctIndex: 1,
    explanation: 'Sistem Operasi (seperti Windows, Linux, macOS, Android) adalah platform perangkat lunak sistem fundamental yang memanajemen memori, prosesor, sistem berkas, dan komunikasi hardware dengan aplikasi pengguna.'
  },
  {
    id: 9,
    category: 'Catu Daya (Power Supply)',
    question: 'Apa peranan penting Power Supply Unit (PSU) di dalam sebuah sistem komputer desktop?',
    options: [
      'A. Mengubah instruksi kode biner menjadi tampilan warna di monitor',
      'B. Menghubungkan komputer ke jaringan internet nirkabel (Wi-Fi)',
      'C. Mengubah arus listrik bolak-balik (AC) dari stopkontak menjadi arus searah (DC) dengan voltase yang stabil',
      'D. Membersihkan file sampah dan virus yang beredar di sistem operasi'
    ],
    correctIndex: 2,
    explanation: 'PSU mengonversi arus bolak-balik (AC) tegangan tinggi dari PLN (220V) menjadi arus searah (DC) bertegangan rendah (12V, 5V, 3.3V) yang aman dan stabil bagi komponen elektronik mikro.'
  },
  {
    id: 10,
    category: 'Alur Kerja Komputer',
    question: 'Urutan siklus pemrosesan data yang benar pada cara kerja komputer adalah...',
    options: [
      'A. Output → Input → Storage → Proses',
      'B. Input → Proses → Output → Storage',
      'C. Storage → Output → Input → Proses',
      'D. Proses → Storage → Input → Output'
    ],
    correctIndex: 1,
    explanation: 'Komputer bekerja mengikuti siklus teratur: Input (data masuk dari pengguna) → Proses (diolah & dihitung oleh CPU/RAM) → Output (hasil ditampilkan ke pengguna) → Storage (disimpan ke memori sekunder untuk pemakaian berikutnya).'
  }
];
