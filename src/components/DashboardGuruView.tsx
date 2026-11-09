import React, { useState, useEffect, useMemo } from 'react';
import {
  subscribeToAssessments,
  deleteAssessmentFromCloud,
  AssessmentSubmissionRecord,
  getTeacherPinFromCloud,
  saveTeacherPinToCloud,
} from '../services/assessmentService';
import { exportAssessmentsToProfessionalExcel } from '../utils/excelExporter';
import { generateClassSubmissionsPDF } from '../utils/pdfGenerator';
import { PrintReportModal } from './PrintReportModal';
import {
  Users,
  Search,
  Filter,
  Download,
  Printer,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  RefreshCw,
  Database,
  ArrowUpDown,
  FileSpreadsheet,
  FileText,
  KeyRound,
  ShieldCheck,
  X
} from 'lucide-react';

export const DashboardGuruView: React.FC = () => {
  // Teacher PIN gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('guru_authenticated') === 'true';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isCheckingPin, setIsCheckingPin] = useState<boolean>(false);

  // Change PIN modal state
  const [showChangePinModal, setShowChangePinModal] = useState<boolean>(false);
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState<string>('');
  const [isSavingPin, setIsSavingPin] = useState<boolean>(false);
  const [changePinSuccess, setChangePinSuccess] = useState<string | null>(null);
  const [changePinError, setChangePinError] = useState<string | null>(null);

  // Submissions state
  const [submissions, setSubmissions] = useState<AssessmentSubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(true);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Filters & sorting
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'tuntas' | 'remedial'>('all');
  const [sortField, setSortField] = useState<'date' | 'score' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Deleting item ID
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Verify PIN against Firebase Firestore
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setIsCheckingPin(true);
    setPinError(null);

    try {
      const cloudPin = await getTeacherPinFromCloud();
      // If cloudPin is not yet initialized in Firestore, default master is 1234
      const effectivePin = cloudPin || '1234';

      if (pinInput.trim() === effectivePin) {
        setIsAuthenticated(true);
        sessionStorage.setItem('guru_authenticated', 'true');
        setPinError(null);
      } else {
        setPinError('PIN Keamanan salah! Akses ditolak.');
      }
    } catch (err) {
      console.error(err);
      setPinError('Gagal memverifikasi PIN keamanan.');
    } finally {
      setIsCheckingPin(false);
    }
  };

  // Change PIN in Cloud Firestore
  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePinError(null);
    setChangePinSuccess(null);

    if (newPinInput.trim().length < 4) {
      setChangePinError('PIN baru minimal 4 angka atau karakter.');
      return;
    }
    if (newPinInput.trim() !== confirmNewPinInput.trim()) {
      setChangePinError('Konfirmasi PIN tidak cocok. Silakan cek kembali.');
      return;
    }

    setIsSavingPin(true);
    try {
      await saveTeacherPinToCloud(newPinInput.trim());
      setChangePinSuccess('PIN baru berhasil disimpan ke Cloud Database!');
      setTimeout(() => {
        setShowChangePinModal(false);
        setNewPinInput('');
        setConfirmNewPinInput('');
        setChangePinSuccess(null);
      }, 1400);
    } catch (err) {
      console.error(err);
      setChangePinError('Terjadi kesalahan saat menyimpan PIN ke Firebase.');
    } finally {
      setIsSavingPin(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('guru_authenticated');
    setPinInput('');
    setPinError(null);
  };

  // Subscribe to real-time assessments from Firestore
  useEffect(() => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    const unsubscribe = subscribeToAssessments(
      (items) => {
        setSubmissions(items);
        setIsLoading(false);
        setFirebaseConnected(true);
      },
      (error) => {
        console.error('Error fetching submissions from Firestore:', error);
        setFirebaseConnected(false);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated]);

  // Unique classes for filter dropdown
  const uniqueClasses = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach((s) => {
      if (s.studentClass) set.add(s.studentClass.trim());
    });
    return Array.from(set).sort();
  }, [submissions]);

  // Filtered & sorted submissions
  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter((s) => {
        const matchesSearch =
          s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.studentClass.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesClass = selectedClass === 'all' || s.studentClass === selectedClass;

        const isTuntas = s.totalScore >= 75;
        const matchesStatus =
          selectedStatus === 'all' ||
          (selectedStatus === 'tuntas' && isTuntas) ||
          (selectedStatus === 'remedial' && !isTuntas);

        return matchesSearch && matchesClass && matchesStatus;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'date') {
          cmp = new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        } else if (sortField === 'score') {
          cmp = b.totalScore - a.totalScore;
        } else if (sortField === 'name') {
          cmp = a.studentName.localeCompare(b.studentName);
        }
        return sortOrder === 'desc' ? cmp : -cmp;
      });
  }, [submissions, searchQuery, selectedClass, selectedStatus, sortField, sortOrder]);

  // Class KPI calculations
  const stats = useMemo(() => {
    if (submissions.length === 0) {
      return { total: 0, average: 0, highest: 0, lowest: 0, passingRate: 0 };
    }
    const scores = submissions.map((s) => s.totalScore);
    const total = scores.length;
    const sum = scores.reduce((acc, curr) => acc + curr, 0);
    const average = Math.round(sum / total);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passingCount = submissions.filter((s) => s.totalScore >= 75).length;
    const passingRate = Math.round((passingCount / total) * 100);

    return { total, average, highest, lowest, passingRate };
  }, [submissions]);

  // Export to Professional Excel (.xls)
  const handleExportExcel = () => {
    if (filteredSubmissions.length === 0) {
      alert('Tidak ada data siswa untuk diekspor.');
      return;
    }

    exportAssessmentsToProfessionalExcel(filteredSubmissions, {
      className: selectedClass !== 'all' ? `Kelas ${selectedClass}` : 'Semua Kelas',
      title: 'REKAPITULASI RESMI HASIL ASESMEN INFORMATIKA',
      subtitle: 'Materi: Sistem Komputer (Hardware, Software, Brainware & Alur IPOS)'
    });
  };

  // Delete submission
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data nilai siswa "${name}" dari Cloud Database?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteAssessmentFromCloud(id);
    } catch (e) {
      console.error(e);
      alert('Gagal menghapus data dari Cloud Firestore.');
    } finally {
      setDeletingId(null);
    }
  };

  // -------------------------------------------------------------
  // PIN LOGIN GATE
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
            Portal Khusus Guru
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Akses terbatas untuk Guru Mata Pelajaran. Masukkan PIN keamanan Anda untuk memantau rekap nilai siswa dari Cloud Database.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={16}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan PIN Keamanan Guru"
                className="w-full text-center text-xl tracking-widest py-3 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
              {pinError && (
                <div className="text-xs text-rose-600 mt-2 font-medium flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{pinError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isCheckingPin}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isCheckingPin ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi PIN...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Masuk ke Panel Rekap Nilai</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terproteksi Sistem Keamanan Terenkripsi Cloud</span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 pb-12">
      {/* Header bar with Live Cloud Database indicator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-1">
            <Database className="w-4 h-4" />
            <span>Database Cloud: Firebase Firestore</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              Live Real-Time Sync
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Rekapitulasi Asesmen Siswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Hasil pengerjaan asesmen dari semua perangkat siswa otomatis terkumpul dan diperbarui langsung di sini.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Direct PDF Download */}
          <button
            type="button"
            onClick={() => {
              if (filteredSubmissions.length === 0) {
                alert('Tidak ada data siswa untuk diunduh sebagai PDF.');
                return;
              }
              generateClassSubmissionsPDF(
                filteredSubmissions,
                selectedClass !== 'all' ? `Kelas ${selectedClass}` : undefined
              );
            }}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Unduh berkas PDF resmi (.pdf) langsung ke perangkat Anda"
          >
            <FileText className="w-4 h-4" />
            <span>Unduh PDF (.pdf)</span>
          </button>

          {/* Excel Export */}
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Unduh rekap nilai rapi dan terformat dalam Microsoft Excel (.xls)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Excel (.xls)</span>
          </button>

          {/* Preview Modal */}
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Buka pratinjau lembar cetak"
          >
            <Printer className="w-4 h-4" />
            <span>Pratinjau</span>
          </button>

          {/* Ganti PIN Guru */}
          <button
            type="button"
            onClick={() => {
              setNewPinInput('');
              setConfirmNewPinInput('');
              setChangePinError(null);
              setChangePinSuccess(null);
              setShowChangePinModal(true);
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
            title="Ganti PIN Keamanan Guru di Firebase Cloud"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-600" />
            <span>Ganti PIN</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            title="Keluar dari Panel Guru"
          >
            Kunci
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Siswa
            </span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
            {stats.total}
          </div>
          <span className="text-[11px] text-slate-400">Telah Mengumpulkan</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Rata-rata Kelas
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">
            {stats.average}
            <span className="text-sm font-normal text-slate-400">/100</span>
          </div>
          <span className="text-[11px] text-slate-400">Nilai Rata-rata</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Ketuntasan KKM
            </span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
            {stats.passingRate}%
          </div>
          <span className="text-[11px] text-slate-400">Nilai ≥ 75 (KKM)</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Rentang Nilai
            </span>
            <ArrowUpDown className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 truncate">
            {stats.lowest} - {stats.highest}
          </div>
          <span className="text-[11px] text-slate-400">Terendah s/d Tertinggi</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa atau kelas..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-xs sm:text-sm bg-white border border-slate-300 text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Semua Kelas ({uniqueClasses.length})</option>
            {uniqueClasses.map((c) => (
              <option key={c} value={c}>
                Kelas {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="text-xs sm:text-sm bg-white border border-slate-300 text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Semua Status</option>
            <option value="tuntas">Tuntas KKM (≥75)</option>
            <option value="remedial">Remedial (&lt;75)</option>
          </select>
        </div>

        {/* Sorting options */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>Urutkan:</span>
          <button
            type="button"
            onClick={() => {
              if (sortField === 'score') {
                setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
              } else {
                setSortField('score');
                setSortOrder('desc');
              }
            }}
            className={`px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-colors ${
              sortField === 'score'
                ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            Nilai {sortField === 'score' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>

          <button
            type="button"
            onClick={() => {
              if (sortField === 'date') {
                setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
              } else {
                setSortField('date');
                setSortOrder('desc');
              }
            }}
            className={`px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-colors ${
              sortField === 'date'
                ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            Waktu {sortField === 'date' && (sortOrder === 'desc' ? 'Terbaru' : 'Terlama')}
          </button>
        </div>
      </div>

      {/* Main Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-4">Kelas</th>
                <th className="py-3.5 px-4 text-center">Nilai Akhir</th>
                <th className="py-3.5 px-4">Status KKM</th>
                <th className="py-3.5 px-4">Durasi Ujian</th>
                <th className="py-3.5 px-4">Waktu Pengumpulan</th>
                <th className="py-3.5 px-4 text-right no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-600" />
                    Memuat data asesmen dari Cloud Database...
                  </td>
                </tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Database className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Belum ada siswa yang mengumpulkan asesmen.
                    <p className="text-xs text-slate-400 mt-1">
                      Ketika siswa menekan "Kumpulkan" di tab Asesmen, data mereka otomatis muncul di sini!
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub, index) => {
                  const isTuntas = sub.totalScore >= 75;
                  const durStr = `${Math.floor(sub.durationSeconds / 60)}m ${sub.durationSeconds % 60}s`;
                  const dateStr = new Date(sub.submittedAt).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={sub.id || index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-xs">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {sub.studentName}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600 whitespace-nowrap">
                        {sub.studentClass}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="font-extrabold font-mono text-base text-sky-700">
                          {sub.totalScore}
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal">/100</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            isTuntas
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isTuntas ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Tuntas KKM
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5" />
                              Remedial
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-600 whitespace-nowrap">
                        {durStr}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap no-print">
                        {sub.id && (
                          <button
                            type="button"
                            disabled={deletingId === sub.id}
                            onClick={() => handleDelete(sub.id!, sub.studentName)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus data siswa ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer count */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Menampilkan <strong>{filteredSubmissions.length}</strong> dari{' '}
            <strong>{submissions.length}</strong> total data asesmen
          </span>
          <span className="font-medium text-slate-400">
            Standar KKM: <strong className="text-slate-700">75</strong>
          </span>
        </div>
      </div>

      {/* Print Report Modal */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        classSubmissions={filteredSubmissions}
        title="Pratinjau Rekapitulasi Nilai Asesmen & Cetak PDF"
      />

      {/* Modal Ganti PIN Keamanan Guru */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowChangePinModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Ganti PIN Keamanan Guru</h3>
                <p className="text-xs text-slate-500">Tersimpan aman di Firebase Cloud Firestore</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              PIN ini digunakan untuk melindungi menu <strong>Rekap Guru</strong> agar siswa tidak dapat membuka, melihat nilai teman, atau mengedit rekapitulasi.
            </p>

            <form onSubmit={handleChangePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PIN Baru (Minimal 4 Angka/Karakter)
                </label>
                <input
                  type="password"
                  maxLength={16}
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="Masukkan PIN baru"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono tracking-wider"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Konfirmasi PIN Baru
                </label>
                <input
                  type="password"
                  maxLength={16}
                  value={confirmNewPinInput}
                  onChange={(e) => setConfirmNewPinInput(e.target.value)}
                  placeholder="Ulangi PIN baru"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono tracking-wider"
                />
              </div>

              {changePinError && (
                <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{changePinError}</span>
                </div>
              )}

              {changePinSuccess && (
                <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{changePinSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePinModal(false)}
                  disabled={isSavingPin}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingPin}
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isSavingPin ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan PIN Baru</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
