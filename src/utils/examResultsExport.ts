// src/utils/examResultsExport.ts
import * as XLSX from 'xlsx';
import type { CustomSessionDoc, CustomQuestionDoc } from '../types/customExam';

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export function exportResultsToExcel(
  examTitle: string,
  sessions: CustomSessionDoc[],
  questions: CustomQuestionDoc[]
): void {
  const questionsById = Object.fromEntries(questions.map((q) => [q.id, q]));

  const rekapRows = sessions.map((s) => ({
    Nama: s.studentName,
    Kelas: s.studentClass,
    Skor: s.score ?? '-',
    Status: s.status === 'submitted' ? 'Selesai' : s.status === 'in_progress' ? 'Sedang Mengerjakan' : 'Belum Mulai',
    'Waktu Mulai': s.startTime ? new Date(s.startTime).toLocaleString('id-ID') : '-',
    'Waktu Selesai': s.endTime ? new Date(s.endTime).toLocaleString('id-ID') : '-',
    'Jumlah Pelanggaran': s.violationsCount,
  }));

  const detailRows: Record<string, string | number>[] = [];
  sessions.forEach((s) => {
    s.answers.forEach((a, idx) => {
      const q = questionsById[a.questionId];
      detailRows.push({
        Nama: s.studentName,
        Kelas: s.studentClass,
        'Urutan Ke': idx + 1,
        Pertanyaan: q ? stripHtml(q.question).slice(0, 200) : a.questionId,
        'Jawaban Dipilih': a.selectedOption,
        'Benar/Salah': a.isCorrect ? 'Benar' : 'Salah',
        Jalur: a.isOnGoldenPath ? 'Utama' : 'Remedial',
        Poin: a.pointsEarned,
      });
    });
  });

  const workbook = XLSX.utils.book_new();
  const rekapSheet = XLSX.utils.json_to_sheet(rekapRows);
  rekapSheet['!cols'] = [{ wch: 24 }, { wch: 14 }, { wch: 8 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(workbook, rekapSheet, 'Rekap');

  const detailSheet = XLSX.utils.json_to_sheet(detailRows);
  detailSheet['!cols'] = [{ wch: 24 }, { wch: 14 }, { wch: 10 }, { wch: 60 }, { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 8 }];
  XLSX.utils.book_append_sheet(workbook, detailSheet, 'Detail Jawaban');

  const dateStr = new Date().toISOString().slice(0, 10);
  const safeTitle = examTitle.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');
  XLSX.writeFile(workbook, `${safeTitle || 'ujian'}-hasil-${dateStr}.xlsx`);
}
