import { AssessmentSubmissionRecord } from '../services/assessmentService';

export interface ExportAssessmentOptions {
  title?: string;
  subtitle?: string;
  className?: string;
  teacherName?: string;
}

/**
 * Generates an Excel-compatible (.xls) file with rich HTML table formatting,
 * including document title, metadata, class summary statistics, styled table headers,
 * color-coded status badges, and teacher signature section.
 */
export function exportAssessmentsToProfessionalExcel(
  submissions: AssessmentSubmissionRecord[],
  options: ExportAssessmentOptions = {}
) {
  if (submissions.length === 0) {
    alert('Tidak ada data nilai siswa untuk diekspor.');
    return;
  }

  const title = options.title || 'REKAPITULASI HASIL ASESMEN INFORMATIKA';
  const subtitle = options.subtitle || 'Materi: Sistem Komputer (Hardware, Software, Brainware & IPOS)';
  const className = options.className || (submissions[0]?.studentClass ? `Kelas ${submissions[0].studentClass}` : 'Semua Kelas');
  const exportDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const exportTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  // Calculate statistics
  const totalStudents = submissions.length;
  const scores = submissions.map((s) => Number(s.totalScore) || 0);
  const sumScore = scores.reduce((acc, curr) => acc + curr, 0);
  const avgScore = (sumScore / totalStudents).toFixed(1);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const passedCount = submissions.filter((s) => (s.totalScore || 0) >= 75).length;
  const remedialCount = totalStudents - passedCount;
  const passingPercentage = Math.round((passedCount / totalStudents) * 100);

  // Generate Excel HTML Template with XML Namespace for Office
  const excelHtml = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:x="urn:schemas-microsoft-com:office:excel"
        xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style>
      body {
        font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
        color: #1e293b;
      }
      .title {
        font-size: 16pt;
        font-weight: bold;
        text-align: center;
        color: #0369a1;
      }
      .subtitle {
        font-size: 11pt;
        text-align: center;
        color: #475569;
        font-style: italic;
      }
      .meta-label {
        font-weight: bold;
        color: #334155;
        background-color: #f1f5f9;
        border: 1px solid #cbd5e1;
      }
      .meta-val {
        border: 1px solid #cbd5e1;
      }
      .stat-header {
        background-color: #e0f2fe;
        font-weight: bold;
        color: #0369a1;
        border: 1px solid #94a3b8;
        text-align: center;
      }
      .stat-val {
        text-align: center;
        font-weight: bold;
        font-size: 12pt;
        border: 1px solid #94a3b8;
      }
      .th {
        background-color: #0284c7;
        color: #ffffff;
        font-weight: bold;
        border: 1px solid #0369a1;
        padding: 8px;
        text-align: center;
      }
      .td-center {
        text-align: center;
        border: 1px solid #cbd5e1;
      }
      .td-left {
        text-align: left;
        border: 1px solid #cbd5e1;
        padding-left: 6px;
      }
      .td-right {
        text-align: right;
        border: 1px solid #cbd5e1;
        padding-right: 6px;
      }
      .score-high {
        font-weight: bold;
        color: #047857;
      }
      .score-low {
        font-weight: bold;
        color: #b91c1c;
      }
      .badge-tuntas {
        background-color: #d1fae5;
        color: #065f46;
        font-weight: bold;
        text-align: center;
        border: 1px solid #a7f3d0;
      }
      .badge-remedial {
        background-color: #fee2e2;
        color: #991b1b;
        font-weight: bold;
        text-align: center;
        border: 1px solid #fecaca;
      }
      .zebra {
        background-color: #f8fafc;
      }
    </style>
  </head>
  <body>
    <!-- Title Header -->
    <table border="0" cellpadding="4" cellspacing="0">
      <tr>
        <td colspan="9" class="title">${title}</td>
      </tr>
      <tr>
        <td colspan="9" class="subtitle">${subtitle}</td>
      </tr>
      <tr>
        <td colspan="9" style="text-align:center; font-size: 9pt; color: #64748b;">
          Diunduh pada: ${exportDate} pukul ${exportTime} WIB
        </td>
      </tr>
      <tr><td colspan="9"></td></tr>

      <!-- Summary Statistics Strip -->
      <tr>
        <td colspan="2" class="meta-label">Mata Pelajaran:</td>
        <td colspan="3" class="meta-val">Informatika (Kurikulum Merdeka)</td>
        <td colspan="2" class="meta-label">KKM / Kriteria Tuntas:</td>
        <td colspan="2" class="meta-val" style="font-weight:bold; color:#0369a1;">75</td>
      </tr>
      <tr>
        <td colspan="2" class="meta-label">Kelas / Rombel:</td>
        <td colspan="3" class="meta-val">${className}</td>
        <td colspan="2" class="meta-label">Tingkat Ketuntasan:</td>
        <td colspan="2" class="meta-val" style="font-weight:bold; color:${passingPercentage >= 75 ? '#047857' : '#b91c1c'};">${passingPercentage}% (${passedCount} dari ${totalStudents} siswa)</td>
      </tr>
      <tr><td colspan="9"></td></tr>

      <!-- KPI Summary Cards -->
      <tr>
        <td colspan="2" class="stat-header">Total Siswa</td>
        <td colspan="2" class="stat-header">Rata-Rata Kelas</td>
        <td colspan="2" class="stat-header">Nilai Tertinggi</td>
        <td colspan="2" class="stat-header">Nilai Terendah</td>
        <td class="stat-header">Remedial</td>
      </tr>
      <tr>
        <td colspan="2" class="stat-val">${totalStudents} Siswa</td>
        <td colspan="2" class="stat-val" style="color:#0284c7;">${avgScore} / 100</td>
        <td colspan="2" class="stat-val" style="color:#047857;">${maxScore}</td>
        <td colspan="2" class="stat-val" style="color:#d97706;">${minScore}</td>
        <td class="stat-val" style="color:#b91c1c;">${remedialCount} Siswa</td>
      </tr>
      <tr><td colspan="9"></td></tr>

      <!-- Table Header -->
      <tr style="height: 32px;">
        <th class="th" style="width: 40px;">No</th>
        <th class="th" style="width: 220px;">Nama Lengkap Siswa</th>
        <th class="th" style="width: 100px;">Kelas</th>
        <th class="th" style="width: 90px;">Nilai Akhir</th>
        <th class="th" style="width: 120px;">Predikat</th>
        <th class="th" style="width: 120px;">Status Kelulusan</th>
        <th class="th" style="width: 100px;">Benar (x/15)</th>
        <th class="th" style="width: 110px;">Durasi Pengerjaan</th>
        <th class="th" style="width: 160px;">Waktu Pengumpulan</th>
      </tr>

      <!-- Table Rows -->
      ${submissions
        .map((s, idx) => {
          const isPassed = (s.totalScore || 0) >= 75;
          const zebraClass = idx % 2 === 1 ? 'class="zebra"' : '';
          const scoreClass = isPassed ? 'score-high' : 'score-low';
          const durStr = `${Math.floor((s.durationSeconds || 0) / 60)} menit ${(s.durationSeconds || 0) % 60} detik`;
          const dateStr = s.submittedAt
            ? new Date(s.submittedAt).toLocaleString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : '-';

          let predikat = 'Perlu Bimbingan (D)';
          if (s.totalScore >= 85) predikat = 'Sangat Baik (A)';
          else if (s.totalScore >= 75) predikat = 'Baik (B)';
          else if (s.totalScore >= 60) predikat = 'Cukup (C)';

          const correctCount = s.correctCount !== undefined ? `${s.correctCount} / ${s.totalQuestions || 15}` : '-';

          return `
          <tr ${zebraClass}>
            <td class="td-center">${idx + 1}</td>
            <td class="td-left" style="font-weight: 600;">${s.studentName}</td>
            <td class="td-center">${s.studentClass}</td>
            <td class="td-center ${scoreClass}" style="font-size: 11pt;">${s.totalScore}</td>
            <td class="td-center">${predikat}</td>
            <td class="${isPassed ? 'badge-tuntas' : 'badge-remedial'}">${isPassed ? 'TUNTAS' : 'REMEDIAL'}</td>
            <td class="td-center">${correctCount}</td>
            <td class="td-center">${durStr}</td>
            <td class="td-center" style="font-size: 9pt;">${dateStr}</td>
          </tr>
          `;
        })
        .join('')}

      <!-- Signature Footer -->
      <tr><td colspan="9"></td></tr>
      <tr><td colspan="9"></td></tr>
      <tr>
        <td colspan="5"></td>
        <td colspan="4" style="text-align: center; font-size: 10pt;">
          Mengetahui,<br />
          <strong>Guru Mata Pelajaran Informatika</strong><br /><br /><br /><br />
          ( ............................................................ )<br />
          NIP. ....................................................
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  // Use Blob with standard Excel MIME type
  const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = `Rekap_Nilai_Informatika_${className.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xls`;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
