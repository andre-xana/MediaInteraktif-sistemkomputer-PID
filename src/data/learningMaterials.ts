import { MaterialSubSection } from '../types';

export const materialSubSections: MaterialSubSection[] = [
  {
    id: 'sub-1',
    number: '01',
    title: 'Pengertian Sistem Komputer',
    shortDesc: 'Hubungan sinergis antara Hardware (perangkat keras), Software (perangkat lunak), dan Brainware (manusia/pengguna).',
    iconName: 'Cpu',
    summary: 'Sistem komputer adalah kumpulan perangkat elektronik yang saling terhubung dan bekerja sama untuk menerima data (input), memproses data (process), menghasilkan informasi (output), dan menyimpannya (storage). Suatu sistem komputer tidak akan berguna jika salah satu dari tiga pilar utamanya tidak ada.',
    keyPoints: [
      'Hardware (Perangkat Keras): Komponen fisik komputer yang dapat disentuh, dilihat, dan diraba secara nyata.',
      'Software (Perangkat Lunak): Program atau instruksi terstruktur berupa kode digital yang mengendalikan hardware.',
      'Brainware (Pengguna/Manusia): Orang yang mengoperasikan, memprogram, mengelola, atau memanfaatkan komputer.',
      'Ketiganya membentuk segitiga komputasi: Tanpa Brainware komputer mati, tanpa Software hardware hanyalah rongsokan besi, tanpa Hardware software tidak memiliki wadah untuk dieksekusi.'
    ],
    examples: [
      'Hardware: Monitor, Keyboard, Laptop, Mouse, Harddisk, CPU.',
      'Software: Windows 11, Google Chrome, Microsoft Word, Game Roblox, Aplikasi Canva.',
      'Brainware: Siswa yang mengetik tugas, Programmer yang membuat aplikasi, Teknisi jaringan, Administrator sistem.'
    ],
    deepDive: {
      title: 'Tiga Pilar Utama Sistem Komputer',
      description: 'Sistem komputer bekerja secara holistik. Mari pelajari fungsi spesifik masing-masing pilar:',
      items: [
        {
          label: 'Hardware (Perangkat Keras)',
          desc: 'Berfungsi sebagai infrastruktur fisik tempat berjalannya perhitungan elektronika dan penerima sinyal masukan serta keluaran.',
          detail: 'Terdiri dari sirkuit terpadu (IC), papan sirkuit cetak (PCB), motor listrik pendingin, dan kawat penghantar data.'
        },
        {
          label: 'Software (Perangkat Lunak)',
          desc: 'Sebagai penerjemah instruksi manusia menjadi bahasa mesin (biner 0 dan 1) yang dimengerti oleh prosesor.',
          detail: 'Dibagi menjadi Sistem Operasi (Windows/Linux/macOS), Perangkat Lunak Aplikasi (Office/Browser), dan Program Utilitas (Antivirus).'
        },
        {
          label: 'Brainware (Manusia/Pengguna)',
          desc: 'Sebagai pengendali utama yang memberikan perintah, menganalisis data, dan menentukan tujuan komputasi.',
          detail: 'Tingkatan brainware: User/Operator (pengguna biasa), Programmer (pembuat kode), Analis Sistem (perancang arsitektur), Administrator (pengelola server).'
        }
      ]
    },
    interactiveType: 'trio-system'
  },
  {
    id: 'sub-2',
    number: '02',
    title: 'Perangkat Input, Proses, Output, dan Penyimpanan (IPOS)',
    shortDesc: 'Klasifikasi fungsional perangkat keras berdasarkan perannya dalam siklus pengolahan data.',
    iconName: 'Layers',
    summary: 'Berdasarkan tugasnya dalam memproses informasi, seluruh perangkat keras komputer diklasifikasikan ke dalam 4 kelompok utama yang sering disingkat sebagai IPOS (Input, Processing, Output, Storage).',
    keyPoints: [
      'Input Device: Mengubah data dunia nyata (ketikan, suara, gambar, sentuhan) menjadi sinyal digital untuk komputer.',
      'Process Device: Otak komputasi yang melakukan perhitungan matematis, manipulasi biner, dan logika kontrol instruksi.',
      'Output Device: Mengubah data digital hasil olahan komputer menjadi format yang bisa dinikmati manusia (tampilan visual, suara, cetakan fisik).',
      'Storage Device: Menyimpan data dan program baik secara sementara saat komputer hidup maupun secara permanen saat komputer dimatikan.'
    ],
    examples: [
      'Input: Keyboard (teks), Mouse (koordinat kursor), Mikrofon (gelombang suara), Scanner/Webcam (citra visual).',
      'Proses: Processor (CPU), Kartu Grafis (GPU), Sound Card, Motherboard Chipset.',
      'Output: Monitor (layar visual), Speaker/Headphone (audio), Printer (cetakan kertas), Proyektor (tayangan besar).',
      'Storage: SSD NVMe (penyimpanan sangat cepat), Hard Disk Drive (HDD), Flashdisk USB, Kartu Memori SD, RAM (penyimpanan sementara).'
    ],
    deepDive: {
      title: 'Tabel Komparasi 4 Kategori Perangkat',
      description: 'Setiap kategori memiliki karakteristik sinyal dan fungsi operasional yang unik:',
      items: [
        {
          label: '1. Perangkat Input (Masukan)',
          desc: 'Menerjemahkan aksi fisik manusia menjadi sinyal digital biner (0 & 1).',
          detail: 'Contoh: Setiap Anda menekan tombol "A" pada keyboard, mikrokontroler mengirimkan kode biner 01000001 ke komputer.'
        },
        {
          label: '2. Perangkat Proses (Pengolah)',
          desc: 'Menghitung dan mengeksekusi milyaran instruksi per detik melalui sirkuit logika ALU (Arithmetic Logic Unit).',
          detail: 'Contoh: CPU menjalankan perhitungan rumus spreadsheet Anda dalam waktu kurang dari satu milidetik.'
        },
        {
          label: '3. Perangkat Output (Keluaran)',
          desc: 'Mengonversi sinyal tegangan listrik biner menjadi stimulus yang dapat dipahami panca indra manusia.',
          detail: 'Contoh: Monitor mengubah sinyal warna RGB menjadi piksel bercahaya untuk menampilkan foto atau video.'
        },
        {
          label: '4. Perangkat Storage (Penyimpan)',
          desc: 'Mempertahankan data secara magnetik, optik, atau memori kilat (flash memory).',
          detail: 'Storage primer (RAM) bersifat volatil (hilang jika mati lampu), sedangkan storage sekunder (SSD/HDD) bersifat non-volatil.'
        }
      ]
    },
    interactiveType: 'ipos-pipeline'
  },
  {
    id: 'sub-3',
    number: '03',
    title: 'Komponen Utama Komputer: CPU, RAM, Motherboard, Storage, PSU',
    shortDesc: 'Pembedahan anatomi fisik di dalam casing komputer dan peranan krusial masing-masing komponen.',
    iconName: 'Server',
    summary: 'Di dalam casing komputer atau laptop terdapat lima komponen inti yang saling terikat erat. Kegagalan salah satu komponen ini akan menyebabkan sistem komputer tidak dapat beroperasi sama sekali (mati total atau gagal booting).',
    keyPoints: [
      'CPU (Central Processing Unit): Sering disebut "otak komputer". Bertugas mengendalikan seluruh sistem, memproses instruksi, dan menjalankan operasi aritmatika & logika.',
      'RAM (Random Access Memory): Memori kerja berkecepatan tinggi yang menyimpan data aplikasi yang sedang aktif berjalan. Bersifat Volatile (data hilang saat listrik mati).',
      'Motherboard (Mainboard): Papan sirkuit cetak utama tempat semua komponen menancap dan saling berkomunikasi melalui jalur bus data.',
      'Storage (SSD / HDD): Media penyimpanan permanen (Non-Volatile) untuk menyimpan sistem operasi, aplikasi, dokumen, foto, dan video.',
      'PSU (Power Supply Unit): Jantung pemasok daya yang mengonversi arus listrik AC dari stopkontak PLN menjadi arus DC bertegangan rendah yang stabil untuk sirkuit komputer.'
    ],
    examples: [
      'CPU: Intel Core i5/i7/i9, AMD Ryzen 5/7/9, Apple Silicon M1/M2/M3.',
      'RAM: DDR4 8GB, DDR5 16GB atau 32GB dengan kecepatan 3200MHz - 6000MHz.',
      'Motherboard: Papan dengan soket prosesor (LGA/AM5), slot RAM DIMM, slot PCIe x16, dan port I/O belakang.',
      'Storage: SSD M.2 NVMe (kecepatan hingga 7000 MB/s) dan HDD SATA (kecepatan ~150 MB/s).',
      'PSU: Power Supply 550 Watt dengan sertifikasi 80 Plus Bronze / Gold.'
    ],
    deepDive: {
      title: 'Anatomi & Spesifikasi Komponen Utama',
      description: 'Detail fungsi teknis dari kelima komponen pondasi ini:',
      items: [
        {
          label: 'CPU (Processor)',
          desc: 'Terdiri dari ALU (Arithmetic Logic Unit) untuk berhitung, CU (Control Unit) untuk mengarahkan lalu lintas data, dan Register/Cache untuk memori ultra cepat.',
          detail: 'Satuan kecepatan CPU diukur dalam Gigahertz (GHz), yaitu milyaran siklus instruksi per detik.'
        },
        {
          label: 'RAM (Random Access Memory)',
          desc: 'Semakin besar kapasitas RAM (misal 16GB dibanding 4GB), semakin banyak tab browser dan aplikasi berat yang bisa dibuka serentak tanpa lag atau lemot.',
          detail: 'Akses memori RAM ribuan kali lebih cepat daripada membaca dari SSD/HDD.'
        },
        {
          label: 'Motherboard',
          desc: 'Berisi chipset pengatur jalur, chip BIOS/UEFI untuk booting pertama kali, slot ekspansi kartu grafis, dan port konektivitas (USB, LAN, Audio, HDMI).',
          detail: 'Bertindak sebagai sistem saraf pusat penghubung antar komponen.'
        },
        {
          label: 'Storage (SSD vs HDD)',
          desc: 'SSD (Solid State Drive) menggunakan chip flash memory tanpa bagian bergerak, tahan guncangan, dan 10-50x lebih cepat daripada HDD mekanik berputar.',
          detail: 'Sistem operasi modern seperti Windows 11 mewajibkan SSD agar booting hanya butuh waktu 5-10 detik.'
        },
        {
          label: 'PSU (Power Supply)',
          desc: 'Menurunkan tegangan PLN 220V AC menjadi 12V, 5V, dan 3.3V DC yang dibutuhkan prosesor dan komponen mikroelektronika.',
          detail: 'PSU berkualitas mencegah komponen terbakar akibat lonjakan voltase petir atau ketidakstabilan listrik.'
        }
      ]
    },
    interactiveType: 'motherboard-diagram'
  },
  {
    id: 'sub-4',
    number: '04',
    title: 'Sistem Operasi dan Fungsinya',
    shortDesc: 'Jembatan perangkat lunak fundamental antara manusia, aplikasi, dan perangkat keras komputer.',
    iconName: 'Terminal',
    summary: 'Sistem Operasi (Operating System atau OS) adalah perangkat lunak sistem pertama yang dimuat ke dalam memori komputer saat dihidupkan (booting). Tanpa sistem operasi, komputer tidak dapat menjalankan aplikasi apapun dan tidak dapat menerima perintah dari manusia.',
    keyPoints: [
      'Manajemen Proses: Mengatur giliran dan pembagian kerja CPU untuk puluhan aplikasi yang berjalan serentak (Multitasking).',
      'Manajemen Memori: Mengalokasikan ruang RAM ke program yang membutuhkan dan membebaskannya saat aplikasi ditutup.',
      'Manajemen File: Mengatur struktur penyimpanan direktori/folder, membaca, menulis, dan memberi izin hak akses data di drive penyimpanan.',
      'Manajemen Perangkat (Device Management): Mengomunikasikan sistem dengan beragam printer, mouse, kartu suara melalui Device Driver.',
      'Antarmuka Pengguna (User Interface): Menyediakan tampilan grafis ramah pengguna (GUI) atau baris perintah teks (CLI) agar pengguna dapat berinteraksi.'
    ],
    examples: [
      'OS Desktop / Laptop: Microsoft Windows (Windows 10, 11), Apple macOS (Sonoma, Sequoia), Linux (Ubuntu, Fedora, Debian).',
      'OS Perangkat Bergerak (Mobile): Google Android, Apple iOS.',
      'OS Server: Red Hat Enterprise Linux, Windows Server, Ubuntu Server.'
    ],
    deepDive: {
      title: 'Lima Fungsi Inti Sistem Operasi',
      description: 'Bagaimana Sistem Operasi bertindak sebagai "Manajer Sumber Daya":',
      items: [
        {
          label: '1. Pengelola Prosesor (CPU Scheduling)',
          desc: 'Menghindari kebuntuan (deadlock) dan memastikan semua program yang dibuka mendapat jatah perhitungan prosesor secara adil dan cepat.',
          detail: 'Pengguna merasa semua program berjalan bersamaan (simultan), padahal CPU berpindah proses dalam hitungan mikrodetik.'
        },
        {
          label: '2. Pengelola Memori Utama (RAM)',
          desc: 'Memastikan tidak ada dua aplikasi yang saling menimpa data satu sama lain di alamat RAM yang sama (Memory Protection).',
          detail: 'Menyediakan memori virtual (swap/paging file) jika kapasitas RAM fisik habis.'
        },
        {
          label: '3. Sistem Berkas (File System)',
          desc: 'Mengorganisasi file ke dalam sistem berjenjang (hierarchical tree). Contoh format berkas: NTFS, FAT32, exFAT, ext4, APFS.',
          detail: 'Menjaga keamanan data agar file penting sistem operasi tidak terhapus sembarangan.'
        },
        {
          label: '4. Abstraksi Perangkat Keras (Hardware Abstraction)',
          desc: 'Aplikasi seperti game atau editor foto tidak perlu tahu merek motherboard atau chip monitor Anda secara langsung; OS menyediakan API standar.',
          detail: 'Driver berfungsi sebagai penerjemah khusus antara OS dan hardware.'
        },
        {
          label: '5. Tampilan Antarmuka (GUI vs CLI)',
          desc: 'GUI (Graphical User Interface) menampilkan ikon, jendela, dan tombol yang bisa diklik mouse atau disentuh jari.',
          detail: 'CLI (Command Line Interface) menerima instruksi ketikan perintah teks di terminal, sangat populer untuk administrator server.'
        }
      ]
    },
    interactiveType: 'os-layers'
  },
  {
    id: 'sub-5',
    number: '05',
    title: 'Cara Kerja Komputer: Alur Input → Proses → Output → Storage',
    shortDesc: 'Simulasi alur perjalanan data dari ketikan jari hingga menjadi informasi visual dan tersimpan di penyimpanan.',
    iconName: 'Workflow',
    summary: 'Komputer bekerja mengikuti siklus pemrosesan informasi yang konsisten: data dimasukkan melalui perangkat masukan (Input), dikirim ke prosesor untuk dihitung dan diolah (Process), hasilnya disajikan kepada pengguna (Output), dan dapat disimpan ke media penyimpanan (Storage) untuk digunakan kembali di masa mendatang.',
    keyPoints: [
      'Langkah 1 (Input): Pengguna memasukkan data melalui perangkat masukan (misal mengetik huruf atau mengeklik tombol). Data diubah menjadi kode biner listrik.',
      'Langkah 2 (Transfer ke RAM): Data instruksi sementara ditampung di RAM agar CPU dapat mengaksesnya dengan kecepatan cahaya.',
      'Langkah 3 (Eksekusi CPU): CPU menjalankan siklus "Fetch - Decode - Execute" (Ambil - Terjemahkan - Jalankan) untuk mengolah data.',
      'Langkah 4 (Output): Sinyal hasil olahan dikirim ke kartu pengolah (GPU/Sound) lalu ditampilkan di layar monitor atau speaker.',
      'Langkah 5 (Storage/Secondary): Ketika pengguna menekan tombol "Simpan/Save", data dari RAM disalin secara permanen ke SSD atau Flashdisk.'
    ],
    examples: [
      'Studi Kasus Mengetik Dokumen: Anda menekan huruf "B" di keyboard (Input) → Dikirim ke RAM → CPU memproses tata letak font huruf "B" (Proses) → Huruf "B" muncul seketika di monitor (Output) → Anda klik File > Save, file disimpan permanen ke dalam SSD (Storage).',
      'Studi Kasus Berfoto dengan Webcam: Lensa webcam menangkap cahaya wajah (Input) → Algoritma mengubah pixel dan kompresi JPEG oleh CPU (Proses) → Foto tampil di layar (Output) → File foto tersimpan di folder Pictures (Storage).'
    ],
    deepDive: {
      title: 'Siklus Fetch - Decode - Execute (Jantung Pemrosesan CPU)',
      description: 'Di tingkat mikro, CPU mengulang siklus ini milyaran kali per detik:',
      items: [
        {
          label: '1. Fetch (Pengambilan)',
          desc: 'Control Unit (CU) di prosesor mengambil instruksi biner berikutnya dari memori RAM sesuai alamat Program Counter.',
          detail: 'Data masuk melalui bus data internal ke register CPU.'
        },
        {
          label: '2. Decode (Penerjemahan)',
          desc: 'Instruksi biner diurai untuk mengetahui perintah apa yang harus dijalankan (misal: penjumlahan angka, perbandingan nilai, atau pemindahan data).',
          detail: 'Sirkuit dekoder menyalakan jalur-jalur logika yang tepat.'
        },
        {
          label: '3. Execute (Pengeksekusian)',
          desc: 'ALU (Arithmetic Logic Unit) mengeksekusi perhitungan nyata dan menyimpan hasil sementaranya di akumulator register.',
          detail: 'Hasil kemudian dipersiapkan untuk dikirim ke memori atau port keluaran.'
        }
      ]
    },
    interactiveType: 'dataflow-sim'
  }
];
