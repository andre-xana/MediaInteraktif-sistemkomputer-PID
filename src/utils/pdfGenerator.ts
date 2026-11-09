import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssessmentResult } from '../types';
import { AssessmentSubmissionRecord } from '../services/assessmentService';

/**
 * Generates and directly downloads a professional PDF report for an individual student.
 */
export function generateSingleAssessmentPDF(result: AssessmentResult) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const isPassed = result.totalScore >= 75;

  // 1. Header (Kop Surat Resmi)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI', pageWidth / 2, 14, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(2, 132, 199); // Sky-600
  doc.text('LEMBAR HASIL PENILAIAN ASESMEN INFORMATIKA', pageWidth / 2, 21, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Materi: Sistem Komputer (Hardware, Software, Brainware & IPOS) · Kurikulum Merdeka', pageWidth / 2, 26, { align: 'center' });

  // Divider line
  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.8);
  doc.line(14, 29, pageWidth - 14, 29);

  // 2. Student Info Card Box
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.setLineWidth(0.3);
  doc.roundedRect(14, 33, pageWidth - 28, 30, 2, 2, 'FD');

  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  // Left column info
  doc.setFont('helvetica', 'bold');
  doc.text('Nama Siswa', 18, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(`:  ${result.studentName}`, 45, 40);

  doc.setFont('helvetica', 'bold');
  doc.text('Kelas / Rombel', 18, 47);
  doc.setFont('helvetica', 'normal');
  doc.text(`:  ${result.studentClass}`, 45, 47);

  doc.setFont('helvetica', 'bold');
  doc.text('Durasi Waktu', 18, 54);
  doc.setFont('helvetica', 'normal');
  const durStr = `${Math.floor(result.durationSeconds / 60)} Menit ${result.durationSeconds % 60} Detik`;
  doc.text(`:  ${durStr}`, 45, 54);

  // Right column info (Score & Status)
  doc.setFont('helvetica', 'bold');
  doc.text('Nilai Akhir', 115, 40);
  doc.setFont('helvetica', 'bold');
  if (isPassed) {
    doc.setTextColor(4, 120, 87); // Emerald-700
  } else {
    doc.setTextColor(185, 28, 28); // Rose-700
  }
  doc.text(`:  ${result.totalScore} / 100`, 140, 40);

  doc.setTextColor(51, 65, 85);
  doc.text('Status KKM', 115, 47);
  if (isPassed) {
    doc.setTextColor(4, 120, 87);
    doc.text(':  TUNTAS (LULUS)', 140, 47);
  } else {
    doc.setTextColor(185, 28, 28);
    doc.text(':  PERLU REMEDIAL', 140, 47);
  }

  doc.setTextColor(51, 65, 85);
  doc.text('Waktu Selesai', 115, 54);
  doc.setFont('helvetica', 'normal');
  doc.text(`:  ${result.endTime} WIB`, 140, 54);

  // 3. Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(2, 132, 199);
  doc.text('Rincian Jawaban & Evaluasi Butir Soal (15 Nomor):', 14, 69);

  // 4. Questions AutoTable
  const tableData = result.answers.map((ans, idx) => {
    let answerText = String(ans.userAnswer);
    if (typeof ans.userAnswer === 'number') {
      answerText = `Pilihan (${String.fromCharCode(65 + ans.userAnswer)})`;
    }

    return [
      String(idx + 1),
      answerText,
      ans.isCorrect ? 'BENAR' : 'BELUM TEPAT',
      ans.earnedScore.toFixed(1),
    ];
  });

  autoTable(doc, {
    startY: 72,
    head: [['No', 'Jawaban Siswa', 'Status Jawaban', 'Poin']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [2, 132, 199],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 9,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 32, halign: 'center' },
      3: { cellWidth: 18, halign: 'center' },
    },
    didParseCell: function (data) {
      if (data.section === 'body' && data.column.index === 2) {
        if (data.cell.raw === 'BENAR') {
          data.cell.styles.textColor = [4, 120, 87];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [185, 28, 28];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // 5. Signature Section
  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 12 : 230;
  const signatureY = finalY > 240 ? 240 : finalY;

  const dateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Diverifikasi pada: ${dateFormatted}`, pageWidth - 70, signatureY, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text('Guru Mata Pelajaran Informatika', pageWidth - 70, signatureY + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.text('( ............................................................ )', pageWidth - 70, signatureY + 24, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('NIP. ....................................................', pageWidth - 70, signatureY + 29, { align: 'center' });

  // 6. Direct Save PDF
  const cleanName = result.studentName.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanClass = result.studentClass.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Lembar_Hasil_Asesmen_${cleanName}_${cleanClass}.pdf`);
}

/**
 * Generates and directly downloads a professional PDF recap report for the entire class.
 */
export function generateClassSubmissionsPDF(
  submissions: AssessmentSubmissionRecord[],
  className?: string
) {
  if (submissions.length === 0) {
    alert('Tidak ada data nilai siswa untuk diunduh sebagai PDF.');
    return;
  }

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const classLabel = className || (submissions[0]?.studentClass ? `Kelas ${submissions[0].studentClass}` : 'Semua Kelas');

  // Stats
  const total = submissions.length;
  const scores = submissions.map((s) => Number(s.totalScore) || 0);
  const avg = (scores.reduce((a, b) => a + b, 0) / total).toFixed(1);
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const passedCount = submissions.filter((s) => (s.totalScore || 0) >= 75).length;
  const rate = Math.round((passedCount / total) * 100);

  // 1. Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI', pageWidth / 2, 12, { align: 'center' });

  doc.setFontSize(15);
  doc.setTextColor(2, 132, 199);
  doc.text('REKAPITULASI RESMI HASIL ASESMEN INFORMATIKA', pageWidth / 2, 19, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Materi: Sistem Komputer · ${classLabel} · Standar KKM: 75`, pageWidth / 2, 25, { align: 'center' });

  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.8);
  doc.line(14, 28, pageWidth - 14, 28);

  // 2. Summary KPI Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 31, pageWidth - 28, 14, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Siswa: `, 18, 39.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${total} Orang`, 40, 39.5);

  doc.setFont('helvetica', 'bold');
  doc.text(`Rata-Rata Kelas: `, 75, 39.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(2, 132, 199);
  doc.text(`${avg} / 100`, 103, 39.5);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(`Nilai Tertinggi: `, 135, 39.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(4, 120, 87);
  doc.text(`${max}`, 160, 39.5);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(`Nilai Terendah: `, 180, 39.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(185, 28, 28);
  doc.text(`${min}`, 205, 39.5);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(`Ketuntasan KKM (≥75): `, 225, 39.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(4, 120, 87);
  doc.text(`${rate}% (${passedCount}/${total})`, 265, 39.5);

  // 3. Submissions Table
  const tableData = submissions.map((s, idx) => {
    const isP = (s.totalScore || 0) >= 75;
    const dur = `${Math.floor((s.durationSeconds || 0) / 60)}m ${(s.durationSeconds || 0) % 60}s`;
    const dt = s.submittedAt
      ? new Date(s.submittedAt).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-';

    let predikat = 'Perlu Bimbingan (D)';
    if (s.totalScore >= 85) predikat = 'Sangat Baik (A)';
    else if (s.totalScore >= 75) predikat = 'Baik (B)';
    else if (s.totalScore >= 60) predikat = 'Cukup (C)';

    return [
      String(idx + 1),
      s.studentName,
      s.studentClass,
      String(s.totalScore),
      predikat,
      isP ? 'TUNTAS' : 'REMEDIAL',
      s.correctCount !== undefined ? `${s.correctCount}/15` : '-',
      dur,
      dt,
    ];
  });

  autoTable(doc, {
    startY: 49,
    head: [['No', 'Nama Siswa', 'Kelas', 'Nilai', 'Predikat', 'Status KKM', 'Benar', 'Durasi', 'Waktu Pengumpulan']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [2, 132, 199],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 8.5,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto', fontStyle: 'bold' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 16, halign: 'center', fontStyle: 'bold' },
      4: { cellWidth: 32, halign: 'center' },
      5: { cellWidth: 25, halign: 'center' },
      6: { cellWidth: 16, halign: 'center' },
      7: { cellWidth: 22, halign: 'center' },
      8: { cellWidth: 38, halign: 'center' },
    },
    didParseCell: function (data) {
      if (data.section === 'body' && data.column.index === 5) {
        if (data.cell.raw === 'TUNTAS') {
          data.cell.styles.textColor = [4, 120, 87];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [185, 28, 28];
          data.cell.styles.fontStyle = 'bold';
        }
      }
      if (data.section === 'body' && data.column.index === 3) {
        const sc = Number(data.cell.raw);
        if (sc >= 75) {
          data.cell.styles.textColor = [4, 120, 87];
        } else {
          data.cell.styles.textColor = [185, 28, 28];
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // Save PDF
  const cleanClass = classLabel.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Rekapitulasi_Nilai_Informatika_${cleanClass}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
