import React, { useState } from 'react';
import { AssessmentSubmissionRecord } from '../services/assessmentService';
import { AssessmentResult } from '../types';
import {
  generateSingleAssessmentPDF,
  generateClassSubmissionsPDF
} from '../utils/pdfGenerator';
import {
  Printer,
  Download,
  Copy,
  Check,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  singleResult?: AssessmentResult | null;
  classSubmissions?: AssessmentSubmissionRecord[];
  title?: string;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  singleResult,
  classSubmissions,
  title = 'Pratinjau Lembar Penilaian & Unduh PDF'
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  // Direct PDF Download Handler
  const handleDownloadPDF = () => {
    try {
      if (singleResult) {
        generateSingleAssessmentPDF(singleResult);
      } else if (classSubmissions && classSubmissions.length > 0) {
        generateClassSubmissionsPDF(classSubmissions);
      }
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Gagal membuat PDF:', err);
      alert('Terjadi kendala saat membuat file PDF.');
    }
  };

  // Direct print with automatic PDF fallback if iframe blocks window.print()
  const handleDirectPrint = () => {
    try {
      window.print();
    } catch {
      // If blocked by iframe sandbox, automatically download PDF instead
      handleDownloadPDF();
    }
  };

  // Copy plain text summary to clipboard
  const handleCopyText = () => {
    let summaryText = '';
    if (singleResult) {
      summaryText = `LEMBAR HASIL ASESMEN INFORMATIKA
Mata Pelajaran: Sistem Komputer
Nama Siswa: ${singleResult.studentName}
Kelas: ${singleResult.studentClass}
Nilai Akhir: ${singleResult.totalScore} / 100
Status KKM: ${singleResult.totalScore >= 75 ? 'TUNTAS' : 'REMEDIAL'}
Durasi: ${Math.floor(singleResult.durationSeconds / 60)}m ${singleResult.durationSeconds % 60}s
Waktu Pengumpulan: ${singleResult.endTime} WIB`;
    } else if (classSubmissions) {
      summaryText = `REKAPITULASI NILAI KELAS - SISTEM KOMPUTER
Total Siswa: ${classSubmissions.length}
Tanggal: ${new Date().toLocaleDateString('id-ID')}
Rincian Siswa:
` + classSubmissions.map((s, i) => `${i + 1}. ${s.studentName} (${s.studentClass}) - Nilai: ${s.totalScore} [${s.totalScore >= 75 ? 'TUNTAS' : 'REMEDIAL'}]`).join('\n');
    }

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col animate-fadeIn my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-500">
                Dokumen resmi siap unduh dalam format PDF asli (.pdf) atau dicetak.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Action Controls */}
        <div className="p-3.5 sm:p-4 bg-sky-50 border-b border-sky-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Direct PDF Download Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 text-xs sm:text-sm"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'File PDF Berhasil Diunduh!' : 'Unduh Dokumen PDF (.pdf)'}</span>
            </button>

            {/* Print Trigger */}
            <button
              type="button"
              onClick={handleDirectPrint}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Printer</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyText}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Teks Tersalin!' : 'Salin Teks'}</span>
          </button>
        </div>

        {/* Notice Info */}
        <div className="px-5 py-2.5 bg-sky-100/50 border-b border-sky-200/60 text-sky-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-sky-700 shrink-0" />
          <span>
            Klik tombol hijau <strong>"Unduh Dokumen PDF (.pdf)"</strong> di atas untuk menyimpan dokumen resmi langsung ke HP/Laptop Anda.
          </span>
        </div>

        {/* Document Preview Stage */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-slate-100/60">
          <div className="bg-white border border-slate-300 p-6 sm:p-8 rounded-xl shadow-xs text-slate-800 text-xs sm:text-sm max-w-2xl mx-auto space-y-4">
            {/* Kop Resmi Surat */}
            <div className="text-center pb-3 border-b-2 border-sky-600">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
              </div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                LEMBAR EVALUASI & PENILAIAN HASIL BELAJAR INFORMATIKA
              </div>
              <div className="text-xs text-slate-600">
                Materi: Sistem Komputer (Hardware, Software, Brainware & Alur Pemrosesan) · Kurikulum Merdeka
              </div>
            </div>

            {/* Single Student Result Preview */}
            {singleResult && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-500 text-xs block">Nama Siswa:</span>
                    <strong className="text-slate-900 text-sm">{singleResult.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Kelas / Rombel:</span>
                    <strong className="text-slate-900 text-sm">{singleResult.studentClass}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Durasi Pengerjaan:</span>
                    <span className="font-mono">{Math.floor(singleResult.durationSeconds / 60)} menit {singleResult.durationSeconds % 60} detik</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Nilai Akhir:</span>
                    <strong className={`text-base font-mono ${singleResult.totalScore >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {singleResult.totalScore} / 100 ({singleResult.totalScore >= 75 ? 'Tuntas KKM' : 'Remedial'})
                    </strong>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-sky-50 font-bold text-sky-900 border-b border-slate-200">
                      <tr>
                        <th className="p-2 w-10 text-center">No</th>
                        <th className="p-2">Jawaban Siswa</th>
                        <th className="p-2 text-center">Status</th>
                        <th className="p-2 text-right">Poin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {singleResult.answers.map((a, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-2 text-center text-slate-400 font-mono">{i + 1}</td>
                          <td className="p-2 font-medium">
                            {typeof a.userAnswer === 'string' ? a.userAnswer : `Pilihan (${String.fromCharCode(65 + Number(a.userAnswer))})`}
                          </td>
                          <td className="p-2 text-center">
                            <span className={`font-bold ${a.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {a.isCorrect ? 'BENAR' : 'SALAH'}
                            </span>
                          </td>
                          <td className="p-2 text-right font-mono font-semibold">
                            {a.earnedScore.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Class Submissions Preview */}
            {classSubmissions && classSubmissions.length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                  <div>Total: <strong className="text-slate-900">{classSubmissions.length} Siswa</strong></div>
                  <div>Rata-rata: <strong className="text-sky-700">{(classSubmissions.reduce((a, b) => a + b.totalScore, 0) / classSubmissions.length).toFixed(1)}</strong></div>
                  <div>Standar KKM: <strong className="text-slate-900">75</strong></div>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-sky-50 font-bold text-sky-900 border-b border-slate-200">
                      <tr>
                        <th className="p-2 w-8 text-center">No</th>
                        <th className="p-2">Nama Siswa</th>
                        <th className="p-2">Kelas</th>
                        <th className="p-2 text-center">Nilai</th>
                        <th className="p-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classSubmissions.slice(0, 10).map((s, i) => (
                        <tr key={i}>
                          <td className="p-2 text-center text-slate-400">{i + 1}</td>
                          <td className="p-2 font-bold text-slate-900">{s.studentName}</td>
                          <td className="p-2">{s.studentClass}</td>
                          <td className="p-2 text-center font-bold font-mono text-sky-700">{s.totalScore}</td>
                          <td className="p-2 text-center font-bold">
                            <span className={s.totalScore >= 75 ? 'text-emerald-700' : 'text-rose-700'}>
                              {s.totalScore >= 75 ? 'Tuntas' : 'Remedial'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {classSubmissions.length > 10 && (
                  <p className="text-[11px] text-slate-500 text-center italic">
                    ...dan {classSubmissions.length - 10} siswa lainnya termuat lengkap di dalam file PDF.
                  </p>
                )}
              </div>
            )}

            {/* Signature Area */}
            <div className="pt-6 flex justify-end text-xs">
              <div className="text-center w-56">
                <p className="text-slate-500">Guru Mata Pelajaran Informatika,</p>
                <div className="h-14" />
                <p className="font-bold text-slate-900 border-t border-slate-400 pt-1">
                  ( ............................................................ )
                </p>
                <p className="text-slate-400 text-[10px]">NIP. ....................................................</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-white rounded-b-2xl flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Format: PDF Dokumen Resmi A4 (Siap Dibagikan / Dicetak)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
