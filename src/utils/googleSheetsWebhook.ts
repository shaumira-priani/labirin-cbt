// src/utils/googleSheetsWebhook.ts
//
// Sends a finished exam result straight to a Google Sheet via a Google Apps
// Script "Web App" the teacher deploys themselves (see APPS_SCRIPT_TEMPLATE
// below — same one-minute-setup pattern the original app used). No OAuth,
// no backend of ours needed: we just POST (fire-and-forget, no-cors) to the
// URL the teacher pastes into the exam's settings.

import type { CustomExamDoc, CustomQuestionDoc, CustomSessionDoc } from '../types/customExam';

function formatDuration(startTime: number | null, endTime: number | null): string {
  if (!startTime || !endTime) return '-';
  const totalSeconds = Math.max(0, Math.round((endTime - startTime) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}d`;
}

/** Matches the exact style you specified:
 *  "[1] No.37: Opt A (Benar (+2pt, Jalur Utama)) | [2] No.41: Opt A (Salah (0pt, Key: A)) | ..." */
function buildAnswerHistoryString(session: CustomSessionDoc, questionsById: Record<string, CustomQuestionDoc>): string {
  return session.answers
    .map((a, i) => {
      const q = questionsById[a.questionId];
      const orderLabel = q ? q.order : '?';
      const jalur = a.isOnGoldenPath ? 'Jalur Utama' : 'Cabang';
      const detail = a.isCorrect
        ? `Benar (+${a.pointsEarned}pt, ${jalur})`
        : `Salah (0pt, Key: ${q?.correctAnswer ?? '?'})`;
      return `[${i + 1}] No.${orderLabel}: Opt ${a.selectedOption} (${detail})`;
    })
    .join(' | ');
}

export function buildSheetsPayload(
  exam: CustomExamDoc,
  session: CustomSessionDoc,
  questions: CustomQuestionDoc[],
  lostCount: number
) {
  const questionsById = Object.fromEntries(questions.map((q) => [q.id, q]));
  const correctCount = session.answers.filter((a) => a.isCorrect).length;

  return {
    timestamp: new Date(session.endTime ?? Date.now()).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    name: session.studentName,
    className: session.studentClass,
    packageTitle: exam.title,
    correctCount,
    totalQuestions: session.answers.length,
    scoreScale100: session.score ?? 0,
    status: lostCount === 0 ? 'Lancar Sempurna' : 'Tersesat di Labirin',
    durationFormatted: formatDuration(session.startTime, session.endTime),
    violationsCount: session.violationsCount,
    answerHistory: buildAnswerHistoryString(session, questionsById),
  };
}

export async function sendResultToGoogleSheets(
  webhookUrl: string,
  payload: ReturnType<typeof buildSheetsPayload>
): Promise<boolean> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return false;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors', // Apps Script doesn't return CORS headers; we can't read the response, but the write still happens
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (err) {
    console.warn('Google Sheets webhook failed:', err);
    return false;
  }
}

export const APPS_SCRIPT_TEMPLATE = `// ============================================================================
// SCRIPT PENERIMA HASIL UJIAN KE GOOGLE SPREADSHEET
// ============================================================================
// CARA PASANG (1 MENIT):
// 1. Buat Google Sheet baru di https://sheets.new
// 2. Menu "Extensions" -> "Apps Script"
// 3. Hapus semua kode yang ada, paste SELURUH kode di bawah ini
// 4. Klik "Deploy" (biru, kanan atas) -> "New deployment"
// 5. Klik ikon gerigi di "Select type" -> pilih "Web app"
// 6. Isi: Execute as = Me, Who has access = Anyone (WAJIB "Anyone")
// 7. Klik "Deploy", lalu "Authorize access" pakai akun Google-mu
// 8. Copy "Web app URL" (akhiran /exec), paste ke pengaturan ujian di Portal Guru
// ============================================================================

function processData(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Waktu Selesai", "Nama Siswa", "Kelas", "Paket Ujian / Materi",
        "Benar / Total", "Nilai Akhir", "Status Ujian", "Durasi",
        "Pelanggaran", "Riwayat Jawaban"
      ]);
      sheet.getRange("A1:J1").setFontWeight("bold").setBackground("#d1e7dd").setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (err) { data = e.parameter || {}; }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var pelanggaran = (data.violationsCount && data.violationsCount > 0)
      ? (data.violationsCount + " (Pelanggaran)")
      : "0 (Tertib)";

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      data.name || "-",
      data.className || "-",
      data.packageTitle || "-",
      (data.correctCount !== undefined ? data.correctCount : 0) + " / " + (data.totalQuestions || 0),
      data.scoreScale100 !== undefined ? data.scoreScale100 : 0,
      data.status || "-",
      data.durationFormatted || "-",
      pelanggaran,
      data.answerHistory || "-"
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) { return processData(e); }
function doGet(e) { return processData(e); }
`;
