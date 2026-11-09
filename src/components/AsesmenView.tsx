import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { assessmentQuestions } from '../data/assessmentQuestions';
import { AssessmentQuestion, AssessmentResult } from '../types';
import { saveAssessmentToCloud } from '../services/assessmentService';
import { exportAssessmentsToProfessionalExcel } from '../utils/excelExporter';
import { generateSingleAssessmentPDF } from '../utils/pdfGenerator';
import { PrintReportModal } from './PrintReportModal';
import {
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Printer,
  RotateCcw,
  AlertTriangle,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Send,
  GraduationCap,
  Sparkles,
  BookOpen,
  FileSpreadsheet,
  FileText
} from 'lucide-react';

export const AsesmenView: React.FC = () => {
  // Assessment phases: 'register' | 'in_progress' | 'completed'
  const [phase, setPhase] = useState<'register' | 'in_progress' | 'completed'>('register');

  // Student info
  const [studentName, setStudentName] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('');

  // Assessment time limit (20 minutes = 1200 seconds)
  const TOTAL_SECONDS = 20 * 60;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(TOTAL_SECONDS);

  // Active question index (0 to 14)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  // User answers
  // For MCQ: questionId -> optionIndex (0, 1, 2, 3)
  // For Short Answer: questionId -> string
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});

  // Confirm submit modal
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [storedHistory, setStoredHistory] = useState<AssessmentResult[]>([]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Load history helper
  const loadHistory = () => {
    try {
      const str = localStorage.getItem('sistem_komputer_assessment_history');
      const list: AssessmentResult[] = str ? JSON.parse(str) : [];
      setStoredHistory(list);
    } catch {
      setStoredHistory([]);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Assessment result
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start assessment handler
  const handleStartAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentClass.trim()) return;

    setRemainingSeconds(TOTAL_SECONDS);
    setUserAnswers({});
    setActiveQuestionIndex(0);
    setPhase('in_progress');
  };

  // Timer countdown hook
  useEffect(() => {
    if (phase === 'in_progress') {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinalSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Check correctness of answer
  const evaluateAnswer = (q: AssessmentQuestion, rawAnswer: any): boolean => {
    if (q.type === 'mcq') {
      return rawAnswer === q.correctOptionIndex;
    } else {
      if (typeof rawAnswer !== 'string' || !rawAnswer.trim()) return false;
      const normalizedUser = rawAnswer.toLowerCase().trim();
      const keywords = q.expectedKeywords || [];
      return keywords.some((kw) => normalizedUser.includes(kw.toLowerCase()));
    }
  };

  // Submit assessment
  const handleFinalSubmit = (autoDueToTimeout = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowSubmitModal(false);

    let totalEarnedScore = 0;
    const answersBreakdown = assessmentQuestions.map((q) => {
      const ans = userAnswers[q.id];
      const isCorrect = evaluateAnswer(q, ans);
      const earned = isCorrect ? q.scoreWeight : 0;
      totalEarnedScore += earned;

      return {
        questionId: q.id,
        userAnswer: ans !== undefined ? ans : '(Tidak dijawab)',
        isCorrect,
        earnedScore: earned
      };
    });

    const finalScore = Math.min(100, Math.round(totalEarnedScore));
    const durationUsed = TOTAL_SECONDS - remainingSeconds;

    const res: AssessmentResult = {
      studentName: studentName.trim(),
      studentClass: studentClass.trim(),
      startTime: new Date(Date.now() - durationUsed * 1000).toLocaleTimeString('id-ID'),
      endTime: new Date().toLocaleTimeString('id-ID'),
      durationSeconds: durationUsed,
      totalScore: finalScore,
      maxScore: 100,
      percentage: finalScore,
      answers: answersBreakdown
    };

    setResult(res);
    setPhase('completed');

    // 1. Save to Cloud Database (Firebase Firestore)
    const correctCount = answersBreakdown.filter((a) => a.isCorrect).length;
    saveAssessmentToCloud({
      studentName: studentName.trim(),
      studentClass: studentClass.trim(),
      totalScore: finalScore,
      maxScore: 100,
      durationSeconds: durationUsed,
      passed: finalScore >= 75,
      correctCount,
      totalQuestions: assessmentQuestions.length,
      submittedAt: new Date().toISOString(),
    }).catch((err) => {
      console.warn('Gagal menyimpan ke Firestore (bekerja offline):', err);
    });

    // 2. Save to local submission history as backup
    try {
      const existingHistoryStr = localStorage.getItem('sistem_komputer_assessment_history');
      const historyList: AssessmentResult[] = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];
      historyList.unshift(res);
      localStorage.setItem('sistem_komputer_assessment_history', JSON.stringify(historyList.slice(0, 50)));
    } catch {
      // Ignore storage errors
    }

    if (finalScore >= 75) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    if (autoDueToTimeout) {
      alert('Waktu 20 menit telah habis! Lembar asesmen otomatis dikumpulkan.');
    }
  };

  // Export current result or history to Professional Excel (.xls)
  const handleExportExcel = () => {
    try {
      const existingHistoryStr = localStorage.getItem('sistem_komputer_assessment_history');
      const historyList: AssessmentResult[] = existingHistoryStr ? JSON.parse(existingHistoryStr) : (result ? [result] : []);
      if (historyList.length === 0) {
        alert('Belum ada data nilai asesmen untuk diekspor.');
        return;
      }

      const records = historyList.map(h => ({
        studentName: h.studentName,
        studentClass: h.studentClass,
        totalScore: h.totalScore,
        maxScore: h.maxScore || 100,
        durationSeconds: h.durationSeconds,
        passed: h.totalScore >= 75,
        correctCount: h.answers ? h.answers.filter(a => a.isCorrect).length : 0,
        totalQuestions: 15,
        submittedAt: new Date().toISOString()
      }));

      exportAssessmentsToProfessionalExcel(records, {
        className: records[0]?.studentClass ? `Kelas ${records[0].studentClass}` : 'Semua Kelas',
        title: 'REKAPITULASI HASIL ASESMEN INFORMATIKA',
        subtitle: 'Materi: Sistem Komputer (Hardware, Software, Brainware & Alur IPOS)'
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Restart assessment
  const handleRestart = () => {
    setPhase('register');
    setResult(null);
    setUserAnswers({});
    setActiveQuestionIndex(0);
    setRemainingSeconds(TOTAL_SECONDS);
  };

  // Count answered questions
  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[Number(k)] !== undefined && userAnswers[Number(k)] !== ''
  ).length;

  const currentQ = assessmentQuestions[activeQuestionIndex];

  return (
    <div className="pb-12 space-y-6">
      {/* ========================================================= */}
      {/* PHASE 1: REGISTRASI & PETUNJUK ASESMEN */}
      {/* ========================================================= */}
      {phase === 'register' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Asesmen Kompetensi Sistem Komputer
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Ujian evaluasi pemahaman materi mencakup Hardware, Software, Brainware, Komponen Utama, Sistem Operasi, dan Alur Pemrosesan.
              </p>
            </div>

            {/* Assessment Rules Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 mb-6 text-xs sm:text-sm text-slate-700 space-y-2.5">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-sky-600" />
                Ketentuan & Petunjuk Pengerjaan:
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-slate-600 text-xs sm:text-sm pl-1">
                <li>Terdiri dari <span className="font-semibold text-slate-900">15 nomor soal</span> (10 Pilihan Ganda & 5 Isian Singkat).</li>
                <li>Waktu pengerjaan adalah <span className="font-semibold text-slate-900 font-mono">20 Menit</span> dengan pengatur waktu mundur.</li>
                <li>Tidak ada pembahasan jawaban selama ujian berlangsung (kondisi ujian murni).</li>
                <li>Skor akhir, kunci jawaban lengkap, serta lembar hasil siap cetak/screenshot akan disajikan setelah selesai.</li>
              </ul>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleStartAssessment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Kelas / Rombel <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    placeholder="Contoh: Kelas 7A / Kelas 8B / 10 TKJ"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm sm:text-base rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  <span>Mulai Asesmen (20 Menit)</span>
                </button>
              </div>

              {storedHistory.length > 0 && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      loadHistory();
                      setShowHistoryModal(true);
                    }}
                    className="text-xs text-sky-700 hover:text-sky-800 font-semibold inline-flex items-center gap-1.5 cursor-pointer bg-sky-50 hover:bg-sky-100/70 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FileCheck className="w-4 h-4 text-sky-600" />
                    <span>Lihat Rekap Nilai Asesmen di Perangkat Ini ({storedHistory.length} data)</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 2: PENGERJAAN ASESMEN BERJALAN (DENGAN TIMER MUNDUR) */}
      {/* ========================================================= */}
      {phase === 'in_progress' && (
        <div className="space-y-6">
          {/* Top Sticky Test Header */}
          <div className="sticky top-18 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-left">
                <div className="text-xs text-slate-500">Peserta Ujian:</div>
                <div className="text-sm font-bold text-slate-900 truncate max-w-[180px] sm:max-w-xs">
                  {studentName} ({studentClass})
                </div>
              </div>
            </div>

            {/* Countdown Timer Display */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm sm:text-base ${
                remainingSeconds < 180
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Sisa Waktu: {formatTime(remainingSeconds)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">
                Terjawab: <span className="font-bold text-sky-700">{answeredCount}</span>/15
              </span>
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kumpulkan</span>
              </button>
            </div>
          </div>

          {/* Main Question Display & Number Palette */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Active Question Card */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
                <span className="font-bold text-sky-700 uppercase tracking-wider">
                  {currentQ.type === 'mcq' ? 'Pilihan Ganda' : 'Isian Singkat'}
                </span>
                <span className="font-mono font-semibold text-slate-700">
                  Nomor {activeQuestionIndex + 1} dari {assessmentQuestions.length}
                </span>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed whitespace-pre-line">
                  {currentQ.question}
                </h3>
              </div>

              {/* Answer Controls */}
              {currentQ.type === 'mcq' && currentQ.options && (
                <div className="space-y-3 mb-6">
                  {currentQ.options.map((optionText, optIndex) => {
                    const isSelected = userAnswers[currentQ.id] === optIndex;
                    return (
                      <button
                        key={optIndex}
                        type="button"
                        onClick={() =>
                          setUserAnswers((prev) => ({
                            ...prev,
                            [currentQ.id]: optIndex
                          }))
                        }
                        className={`w-full text-left p-4 rounded-xl border-2 font-medium text-sm sm:text-base transition-all flex items-center justify-between cursor-pointer min-h-[52px] ${
                          isSelected
                            ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold ring-2 ring-sky-200'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span className="pr-3 leading-relaxed">{optionText}</span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-sky-600 bg-sky-600' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ.type === 'short_answer' && (
                <div className="space-y-2 mb-6">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Ketikkan Jawaban Singkatmu:
                  </label>
                  <input
                    type="text"
                    value={userAnswers[currentQ.id] || ''}
                    onChange={(e) =>
                      setUserAnswers((prev) => ({
                        ...prev,
                        [currentQ.id]: e.target.value
                      }))
                    }
                    placeholder="Tuliskan jawaban di sini..."
                    className="w-full p-3.5 text-sm sm:text-base rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400">
                    Ketik istilah dengan teliti dan ejaan yang tepat.
                  </p>
                </div>
              )}

              {/* Prev / Next Question Nav Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={activeQuestionIndex === 0}
                  onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                {activeQuestionIndex + 1 < assessmentQuestions.length ? (
                  <button
                    type="button"
                    onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Selesai & Kumpulkan</span>
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right: Question Number Palette (1-15) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Daftar Nomor Soal
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                Klik nomor untuk melompat langsung ke soal terkait.
              </p>

              <div className="grid grid-cols-5 gap-2 mb-4">
                {assessmentQuestions.map((q, qIdx) => {
                  const hasAnswer =
                    userAnswers[q.id] !== undefined && userAnswers[q.id] !== '';
                  const isCurrent = activeQuestionIndex === qIdx;

                  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-400';

                  if (hasAnswer) {
                    badgeStyle = 'bg-sky-600 text-white border-sky-600 font-bold';
                  }

                  if (isCurrent) {
                    badgeStyle += ' ring-2 ring-slate-900 ring-offset-2';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setActiveQuestionIndex(qIdx)}
                      className={`h-10 rounded-xl border font-mono text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center ${badgeStyle}`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-sky-600" />
                  <span>Sudah dijawab ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300" />
                  <span>Belum dijawab ({assessmentQuestions.length - answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded border-2 border-slate-900" />
                  <span>Sedang dibuka</span>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Modal */}
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-fadeIn">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Konfirmasi Pengumpulan Jawaban
                    </h4>
                    <p className="text-xs text-slate-500">
                      Pastikan kamu telah memeriksa seluruh nomor.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 my-4 space-y-1">
                  <div>
                    Status Jawaban: <span className="font-bold text-sky-700">{answeredCount}</span> dari 15 soal telah terisi.
                  </div>
                  {answeredCount < 15 && (
                    <div className="text-amber-700 font-semibold">
                      ⚠️ Masih ada {15 - answeredCount} nomor soal yang belum kamu isi!
                    </div>
                  )}
                  <div>
                    Sisa Waktu Ujian: <span className="font-mono font-bold">{formatTime(remainingSeconds)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Periksa Kembali
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFinalSubmit(false)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Ya, Kumpulkan Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 3: HASIL ASESMEN, KUNCI JAWABAN & CETAK / SCREENSHOT */}
      {/* ========================================================= */}
      {phase === 'completed' && result && (
        <div className="space-y-6">
          {/* Printable Report Card Area */}
          <div id="printable-assessment" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {/* Header Laporan Nilai */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  <GraduationCap className="w-4 h-4" />
                  Laporan Hasil Asesmen Mandiri Siswa
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Mata Pelajaran: Informatika (Sistem Komputer)
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
                  <span>Nama: <strong className="text-slate-900">{result.studentName}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Kelas: <strong className="text-slate-900">{result.studentClass}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Durasi: <strong className="text-slate-900">{Math.floor(result.durationSeconds / 60)} menit {result.durationSeconds % 60} detik</strong></span>
                </div>
              </div>

              {/* Total Score Display Badge */}
              <div className="text-center sm:text-right bg-slate-50 border border-slate-200 p-4 rounded-xl shrink-0">
                <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-0.5">
                  Nilai Akhir
                </div>
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-sky-600">
                  {result.totalScore}
                  <span className="text-xl text-slate-400 font-normal">/100</span>
                </div>
                <div className="mt-1">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      result.totalScore >= 75
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {result.totalScore >= 85
                      ? 'Predikat: Sangat Memuaskan (A)'
                      : result.totalScore >= 75
                      ? 'Predikat: Tuntas KKM (B)'
                      : 'Predikat: Perlu Remedial / Bimbingan'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar (Print / Screenshot / Retry) */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-4 no-print border-b border-slate-100">
              <div className="text-xs text-slate-500">
                Hasil evaluasi lengkap 15 nomor soal tersaji di bawah ini.
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Direct PDF Download */}
                <button
                  type="button"
                  onClick={() => {
                    if (result) {
                      generateSingleAssessmentPDF(result);
                    }
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title="Unduh lembar hasil asesmen resmi dalam format PDF (.pdf)"
                >
                  <FileText className="w-4 h-4" />
                  <span>Unduh Hasil PDF (.pdf)</span>
                </button>

                {/* Excel Export */}
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title="Unduh rekap data nilai rapi dalam format Microsoft Excel (.xls)"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Ekspor Excel (.xls)</span>
                </button>

                {/* Preview Modal */}
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title="Buka lembar pratinjau lengkap"
                >
                  <Printer className="w-4 h-4" />
                  <span>Pratinjau</span>
                </button>

                {/* Restart */}
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi</span>
                </button>
              </div>
            </div>

            {/* Question by Question Detailed Breakdown */}
            <div className="mt-6 space-y-4">
              <h4 className="text-base font-bold text-slate-900 mb-3">
                Rincian Evaluasi & Pembahasan Jawaban (15 Soal)
              </h4>

              {assessmentQuestions.map((q, idx) => {
                const answerRecord = result.answers.find((a) => a.questionId === q.id);
                const isCorrect = answerRecord?.isCorrect ?? false;
                const rawUserAns = answerRecord?.userAnswer;

                let renderedUserAnswer = '(Tidak dijawab)';
                if (q.type === 'mcq' && typeof rawUserAns === 'number' && q.options) {
                  renderedUserAnswer = q.options[rawUserAns];
                } else if (typeof rawUserAns === 'string' && rawUserAns) {
                  renderedUserAnswer = rawUserAns;
                }

                const renderedCorrectAnswer =
                  q.type === 'mcq' && q.options && q.correctOptionIndex !== undefined
                    ? q.options[q.correctOptionIndex]
                    : q.expectedAnswerSample;

                return (
                  <div
                    key={q.id}
                    className={`p-4 sm:p-5 rounded-xl border text-left transition-all ${
                      isCorrect
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center shrink-0 ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {q.type === 'mcq' ? 'Pilihan Ganda' : 'Isian Singkat'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 font-bold text-xs">
                        {isCorrect ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Benar (+{q.scoreWeight.toFixed(1)} poin)
                          </span>
                        ) : (
                          <span className="text-rose-700 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Kurang Tepat (0 poin)
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-3 whitespace-pre-line">
                      {q.question}
                    </p>

                    {/* Answer Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <span className="font-semibold text-slate-500 block mb-0.5">Jawaban Kamu:</span>
                        <span className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {renderedUserAnswer}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <span className="font-semibold text-slate-500 block mb-0.5">Kunci Jawaban Resmi:</span>
                        <span className="font-bold text-slate-900">
                          {renderedCorrectAnswer}
                        </span>
                      </div>
                    </div>

                    {/* Pembahasan */}
                    <div className="text-xs text-slate-700 bg-white/80 p-3 rounded-lg border border-slate-200/80 leading-relaxed">
                      <strong className="text-sky-800">Pembahasan: </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal Riwayat Asesmen Tersimpan di Perangkat Ini */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[85vh] flex flex-col animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Rekap Nilai Asesmen Tersimpan</h4>
                  <p className="text-xs text-slate-500">Tersimpan di penyimpanan lokal browser perangkat ini</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {storedHistory.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  Belum ada riwayat asesmen yang diselesaikan.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {storedHistory.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{item.studentName}</div>
                        <div className="text-slate-500">
                          {item.studentClass} · Selesai pkl {item.endTime} ({Math.floor(item.durationSeconds / 60)}m {item.durationSeconds % 60}s)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold font-mono text-sky-600">{item.totalScore} / 100</div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.totalScore >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {item.totalScore >= 75 ? 'Tuntas KKM' : 'Remedial'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              {storedHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Hapus seluruh riwayat asesmen di perangkat ini?')) {
                      localStorage.removeItem('sistem_komputer_assessment_history');
                      setStoredHistory([]);
                    }
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                >
                  Hapus Semua Riwayat
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                {storedHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Ekspor ke Excel (.xls)</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cetak & Simpan PDF */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        singleResult={result}
        title="Pratinjau Hasil Asesmen Siswa & Cetak PDF"
      />
    </div>
  );
};
