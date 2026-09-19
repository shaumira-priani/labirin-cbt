import { StudentSubmission } from '../types/exam';

const STORAGE_KEY = 'biologi_labirin_submissions_v1';
const WEBHOOK_STORAGE_KEY = 'biologi_labirin_google_sheet_webhook_url';
const SHEET_LINK_STORAGE_KEY = 'biologi_labirin_google_sheet_direct_link';

// Default / fallback webhook URL (Embedded from teacher's Google Apps Script)
export const DEFAULT_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbwrL33DrOS4ipJ2VnPKscvP5nhLw5jVR3xFMe_N5ZDrsEAB2HqyPooz4MmUPDRssueq/exec';

export const getStoredWebhookUrl = (): string => {
  try {
    // 1. Check URL parameters if teacher shared a configured link (e.g. ?webhook=...)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlWebhook = urlParams.get('webhook');
      if (urlWebhook && urlWebhook.startsWith('http')) {
        localStorage.setItem(WEBHOOK_STORAGE_KEY, urlWebhook.trim());
        return urlWebhook.trim();
      }
    }

    // 2. Check localStorage
    const stored = localStorage.getItem(WEBHOOK_STORAGE_KEY);
    if (stored && stored.trim().startsWith('http')) {
      return stored.trim();
    }

    // 3. Fallback to default
    return DEFAULT_WEBHOOK_URL;
  } catch (e) {
    return DEFAULT_WEBHOOK_URL;
  }
};

export const setStoredWebhookUrl = (url: string): void => {
  try {
    localStorage.setItem(WEBHOOK_STORAGE_KEY, url.trim());
  } catch (e) {
    console.error('Failed to save webhook URL', e);
  }
};

export const getStoredSheetDirectLink = (): string => {
  try {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSheet = urlParams.get('sheet');
      if (urlSheet && urlSheet.startsWith('http')) {
        localStorage.setItem(SHEET_LINK_STORAGE_KEY, urlSheet.trim());
        return urlSheet.trim();
      }
    }
    return localStorage.getItem(SHEET_LINK_STORAGE_KEY) || '';
  } catch (e) {
    return '';
  }
};

export const setStoredSheetDirectLink = (url: string): void => {
  try {
    localStorage.setItem(SHEET_LINK_STORAGE_KEY, url.trim());
  } catch (e) {
    console.error('Failed to save sheet direct link', e);
  }
};

export const getSubmissions = (): StudentSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load submissions', e);
    return [];
  }
};

/**
 * Sends a submission directly to the teacher's Google Apps Script Webhook
 */
export const sendToWebhook = async (
  webhookUrl: string,
  data: StudentSubmission
): Promise<boolean> => {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return false;

  let sent = false;
  const payloadString = JSON.stringify(data);

  // Method 1: standard fetch with POST & text/plain (no-cors)
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: payloadString
    });
    sent = true;
  } catch (err) {
    console.warn('Webhook primary fetch failed:', err);
  }

  // Method 2: GET fallback with query params (if POST failed or as secondary guarantee)
  if (!sent) {
    try {
      const params = new URLSearchParams();
      params.append('name', data.name || '');
      params.append('className', data.className || '');
      params.append('packageTitle', data.packageTitle || (data.gradeLevel === '12' ? 'Kelas 12 (Enzim & Metabolisme)' : 'Kelas 10 (Keanekaragaman Hayati)'));
      params.append('correctCount', String(data.correctCount || 0));
      params.append('totalQuestions', String(data.totalQuestions || 20));
      params.append('scoreScale100', String(data.scoreScale100 || 0));
      params.append('scoreMaze', String(data.scoreMaze || 0));
      params.append('status', data.status || '');
      params.append('durationFormatted', data.durationFormatted || '');
      params.append('violationsCount', String(data.violationsCount || 0));
      params.append('timestamp', data.timestamp || '');
      params.append('answerHistory', data.answerHistory || '');

      const getUrl = `${webhookUrl}${webhookUrl.includes('?') ? '&' : '?'}${params.toString()}`;
      await fetch(getUrl, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      sent = true;
    } catch (getErr) {
      console.warn('Webhook GET fallback failed:', getErr);
    }
  }

  // Method 3: Beacon API fallback
  if (!sent && typeof navigator !== 'undefined' && navigator.sendBeacon) {
    try {
      const blob = new Blob([payloadString], { type: 'text/plain;charset=utf-8' });
      sent = navigator.sendBeacon(webhookUrl, blob);
    } catch (beaconErr) {
      console.error('Webhook beacon fallback failed:', beaconErr);
    }
  }

  return sent;
};

export const saveSubmission = async (
  submission: Omit<StudentSubmission, 'id' | 'syncedToGoogleSheets'>
): Promise<{ savedSubmission: StudentSubmission; synced: boolean }> => {
  const newSubmission: StudentSubmission = {
    ...submission,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    syncedToGoogleSheets: false
  };

  const webhookUrl = getStoredWebhookUrl();
  let synced = false;

  if (webhookUrl) {
    synced = await sendToWebhook(webhookUrl, newSubmission);
    newSubmission.syncedToGoogleSheets = synced;
  }

  try {
    const existing = getSubmissions();
    const updated = [newSubmission, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to store submission in localStorage', e);
  }

  return { savedSubmission: newSubmission, synced };
};

export const testGoogleSheetsWebhook = async (
  webhookUrl: string
): Promise<{ success: boolean; message: string }> => {
  if (!webhookUrl.trim() || !webhookUrl.startsWith('http')) {
    return { success: false, message: 'URL Webhook tidak valid. Pastikan diawali dengan https://script.google.com/...' };
  }

  const testPayload: StudentSubmission = {
    id: `test-${Date.now()}`,
    timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
    name: 'UJI COBA SISTEM GURU',
    className: '10 Fatimah',
    correctCount: 15,
    totalQuestions: 15,
    scoreMaze: 37.5,
    scoreScale100: 100,
    status: 'Sampai Tujuan Utama',
    durationFormatted: '0m 45d',
    answerHistory: '1. Soal#37 [Benar: B] | 2. Soal#36 [Benar: B] (Data Uji Coba Terhubung)',
    syncedToGoogleSheets: true
  };

  try {
    await sendToWebhook(webhookUrl.trim(), testPayload);
    return {
      success: true,
      message: 'Sinyal berhasil dikirim! Silakan periksa tab spreadsheet Anda, baris uji coba "UJI COBA SISTEM GURU" akan otomatis bertambah.'
    };
  } catch (e) {
    return {
      success: false,
      message: 'Gagal mengirim sinyal ke Google Apps Script. Periksa kembali URL Webhook Anda.'
    };
  }
};

export const syncAllPendingToGoogleSheets = async (
  webhookUrl: string
): Promise<{ successCount: number; errorCount: number }> => {
  if (!webhookUrl) return { successCount: 0, errorCount: 0 };

  const submissions = getSubmissions();
  let successCount = 0;
  let errorCount = 0;

  for (const item of submissions) {
    try {
      const ok = await sendToWebhook(webhookUrl, item);
      if (ok) {
        item.syncedToGoogleSheets = true;
        successCount++;
      } else {
        errorCount++;
      }
    } catch (e) {
      errorCount++;
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  return { successCount, errorCount };
};

export const clearSubmissions = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear submissions', e);
  }
};

export const generateGoogleSheetsTSV = (submissions: StudentSubmission[]): string => {
  const headers = [
    'Waktu Pengerjaan',
    'Nama Siswa',
    'Kelas',
    'Paket / Tingkat',
    'Jumlah Benar',
    'Total Soal',
    'Skor Murni',
    'Nilai Akhir (Maks 40)',
    'Status Titik Ujian',
    'Durasi Pengerjaan',
    'Pelanggaran (Pindah Tab/Layar)',
    'Riwayat Jawaban'
  ];

  const rows = submissions.map((s) => [
    s.timestamp,
    s.name,
    s.className,
    s.packageTitle || (s.gradeLevel === '12' ? 'Kelas 12 (Enzim & Metabolisme)' : 'Kelas 10 (Keanekaragaman Hayati)'),
    s.correctCount,
    s.totalQuestions || (s.gradeLevel === '12' ? 20 : 15),
    s.scoreMaze.toFixed(1),
    s.scoreScale100.toFixed(0),
    s.status,
    s.durationFormatted,
    s.violationsCount ? `${s.violationsCount}x Pelanggaran` : '0 (Tertib)',
    s.answerHistory || '-'
  ]);

  return [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
};

export const generateGoogleSheetsCSV = (submissions: StudentSubmission[]): string => {
  const headers = [
    'Waktu Pengerjaan',
    'Nama Siswa',
    'Kelas',
    'Paket / Tingkat',
    'Jumlah Benar',
    'Total Soal',
    'Skor Murni',
    'Nilai Akhir (Maks 40)',
    'Status',
    'Durasi',
    'Pelanggaran (Pindah Tab)',
    'Riwayat Jawaban'
  ];

  const rows = submissions.map((s) => [
    `"${s.timestamp}"`,
    `"${s.name.replace(/"/g, '""')}"`,
    `"${s.className.replace(/"/g, '""')}"`,
    `"${(s.packageTitle || (s.gradeLevel === '12' ? 'Kelas 12 (Enzim & Metabolisme)' : 'Kelas 10 (Keanekaragaman Hayati)')).replace(/"/g, '""')}"`,
    s.correctCount,
    s.totalQuestions || (s.gradeLevel === '12' ? 20 : 15),
    s.scoreMaze.toFixed(1),
    s.scoreScale100.toFixed(0),
    `"${s.status}"`,
    `"${s.durationFormatted}"`,
    `"${s.violationsCount ? `${s.violationsCount}x` : '0'}"`,
    `"${(s.answerHistory || '-').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};

export const APPS_SCRIPT_TEMPLATE = `// ============================================================================
// SCRIPT PENERIMA DATA NILAI ULANGAN BIOLOGI KE GOOGLE SPREADSHEET (MULTI TINGKAT)
// ============================================================================
// CARA MEMASANG (HANYA 1 MENIT):
// 1. Buat Google Sheet baru di https://sheets.new
// 2. Klik menu 'Extensions' (Ekstensi) -> 'Apps Script'
// 3. Hapus semua kode yang ada di editor, lalu paste (tempel) SELURUH kode di bawah ini
// 4. Klik tombol 'Deploy' (Terapkan) berwarna biru di kanan atas -> 'New deployment' (Penerapan baru)
// 5. Klik ikon gerigi di sebelah 'Select type' -> Pilih 'Web app' (Aplikasi web)
// 6. Isi:
//    - Description: Nilai Biologi
//    - Execute as (Jalankan sebagai): Me (email Anda)
//    - Who has access (Siapa yang memiliki akses): ANYONE (SIAPA SAJA) --> ***SANGAT PENTING***
// 7. Klik 'Deploy', lalu klik 'Authorize access' (Izinkan akses) menggunakan akun Google Anda
// 8. Salin 'Web app URL' (akhiran /exec) dan tempel di Teacher Portal / bagikan ke siswa
// ============================================================================

function processData(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Otomatis buat Header jika sheet masih kosong (baris pertama)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Waktu Selesai",
        "Nama Siswa",
        "Kelas",
        "Paket Ujian / Materi",
        "Benar / Total",
        "Nilai Akhir (Maks 40)",
        "Status Ujian",
        "Durasi Pengerjaan",
        "Pelanggaran (Pindah Tab/Layar)",
        "Riwayat Jawaban Lengkap"
      ]);
      
      // Beri warna latar hijau lembut dan cetak tebal pada header
      sheet.getRange("A1:J1").setFontWeight("bold").setBackground("#d1e7dd").setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    var nama = data.name || data.nama || "Tanpa Nama";
    var kelas = data.className || data.kelas || "-";
    var paket = data.packageTitle || (data.gradeLevel === "12" ? "Kelas 12 (Enzim & Metabolisme)" : "Kelas 10 (Keanekaragaman Hayati)");
    var totalSoal = data.totalQuestions || (data.gradeLevel === "12" ? 20 : 15);
    var benar = (data.correctCount !== undefined) ? data.correctCount : 0;
    var skor = (data.scoreScale100 !== undefined) ? data.scoreScale100 : (data.scoreMaze || 0);
    var status = data.status || "-";
    var durasi = data.durationFormatted || "-";
    var pelanggaran = (data.violationsCount !== undefined && data.violationsCount > 0) 
      ? (data.violationsCount + "x Pindah Tab/Layar") 
      : "0 (Tertib)";
    var riwayat = data.answerHistory || "-";
    var waktu = data.timestamp || new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    
    sheet.appendRow([
      waktu,
      nama,
      kelas,
      paket,
      benar + " / " + totalSoal,
      skor,
      status,
      durasi,
      pelanggaran,
      riwayat
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ result: "success", status: "saved" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  return processData(e);
}

function doGet(e) {
  return processData(e);
}
`;
