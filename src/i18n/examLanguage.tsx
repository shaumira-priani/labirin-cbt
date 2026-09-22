// src/i18n/examLanguage.tsx
//
// Bilingual UI chrome for the STUDENT exam-taking flow (buttons, labels,
// instructions). Question/answer CONTENT itself is whatever the teacher
// uploaded and is NOT machine-translated — that would risk changing the
// meaning of a real exam question.

import React, { createContext, useContext, useState } from 'react';

export type Lang = 'id' | 'en';

const STRINGS = {
  id: {
    studentForm: 'Formulir Identitas Siswa',
    pickClass: 'Kelas',
    pickClassPlaceholder: '-- Pilih Kelas --',
    noExamsForAnyClass: 'Belum ada ujian yang diterbitkan guru untuk kelas manapun.',
    fullName: 'Nama Lengkap',
    pickNamePlaceholder: '-- Pilih Nama --',
    pickClassFirstPlaceholder: '-- Pilih Kelas Terlebih Dahulu --',
    continue: 'Lanjut',
    pickExam: 'Pilih Ujian',
    subjectLabel: 'Mata Pelajaran (Mapel PH)',
    pickSubjectPlaceholder: '-- Pilih Mapel --',
    materialLabel: 'Materi PH',
    pickMaterialPlaceholder: '-- Pilih Materi --',
    minutes: 'menit',
    questionsCountLabel: (n: number) => `${n} soal (mode labirin)`,
    instructions: [
      'Jawab tiap soal dengan teliti. Jawaban benar di jalur utama bernilai lebih besar.',
      'Setiap jawaban menentukan langkahmu berikutnya. Jawaban salah akan mengarahkanmu ke jalur cabang di luar Golden Path.',
      'Jangan keluar dari layar penuh atau berpindah tab selama ujian berlangsung.',
    ],
    tokenLabel: 'Token dari Guru Pengawas',
    startExam: 'Mulai Ujian',
    thankYou: (name: string) => `Terima kasih, ${name}!`,
    finalScore: 'Skor akhir kamu:',
    resultsSent: 'Hasil sudah dikirim ke Guru Pengawas.',
    verifyCode: 'Verifikasi Kode',
    back: 'Kembali',
    examNotFound: 'Ujian tidak ditemukan.',
    examHasNoQuestions: 'Ujian ini belum ada soalnya. Hubungi Guru Pengawas.',
    codeNotFound: 'Kode tidak ditemukan atau ujian belum diterbitkan guru.',
    failedLoadExamList: 'Gagal memuat daftar ujian. Coba muat ulang halaman.',
    failedLoadExam: 'Gagal memuat ujian',
    wrongToken: 'Token salah. Tanyakan token yang benar ke Guru Pengawas.',
    failedStart: 'Gagal memulai ujian',
    resumed: (n: number) => `Progres sebelumnya berhasil dipulihkan — lanjut dari soal ke-${n}.`,
    questionOf: (n: number) => `Soal ke-${n}`,
    answer: 'Jawab',
    examFinished: 'Ujian Selesai!',
    saving: 'Menyimpan hasil...',
    saved: 'Hasil sudah tersimpan.',
    points: 'poin',
    saveFailed: 'Gagal menyimpan hasil ke server (koneksi lambat/terputus). Skormu tetap tampil di bawah — coba tekan "Simpan Ulang", atau screenshot layar ini sebagai bukti ke guru.',
    retrySave: 'Simpan Ulang',
    questionNotFound: 'Soal tidak ditemukan',
    contactSupervisor: 'Hubungi Guru Pengawas.',
    journeyMapTitle: 'Peta Jalur Labirin',
    legendCorrect: 'Benar',
    legendLost: 'Tersesat',
    statTotalSteps: 'Total Langkah',
    statLostCount: 'Kali Tersesat',
    statBranchSteps: 'Langkah di Jalur Cabang',
    lostAtLabel: 'Kamu tersesat di langkah ke-:',
    stepShort: 'Langkah #',
    perfectRun: 'Setiap pilihanmu tepat — kamu jalan lurus tanpa tersesat sekali pun.',
    shortfallMessage: (target: number, lost: number, taken: number) =>
      `Setiap pilihan menentukan langkah berikutnya. Target Golden Path ada ${target} langkah, tapi karena tersesat ${lost}x, kamu cuma sempat menempuh ${taken} langkah di jalur itu — sisanya jadi langkah di jalur cabang.`,
  },
  en: {
    studentForm: 'Student Details Form',
    pickClass: 'Class',
    pickClassPlaceholder: '-- Select Class --',
    noExamsForAnyClass: 'No exams have been published for any class yet.',
    fullName: 'Full Name',
    pickNamePlaceholder: '-- Select Name --',
    pickClassFirstPlaceholder: '-- Select Class First --',
    continue: 'Continue',
    pickExam: 'Select Exam',
    subjectLabel: 'Subject',
    pickSubjectPlaceholder: '-- Select Subject --',
    materialLabel: 'Topic',
    pickMaterialPlaceholder: '-- Select Topic --',
    minutes: 'minutes',
    questionsCountLabel: (n: number) => `${n} questions (maze mode)`,
    instructions: [
      'Answer each question carefully. Correct answers on the main path are worth more.',
      'Every answer determines your next step. A wrong answer sends you onto a branch path outside the Golden Path.',
      "Don't exit fullscreen or switch tabs while the exam is running.",
    ],
    tokenLabel: 'Token from Supervising Teacher',
    startExam: 'Start Exam',
    thankYou: (name: string) => `Thank you, ${name}!`,
    finalScore: 'Your final score:',
    resultsSent: 'Your results have been sent to the supervising teacher.',
    verifyCode: 'Verify Code',
    back: 'Back',
    examNotFound: 'Exam not found.',
    examHasNoQuestions: 'This exam has no questions yet. Contact the supervising teacher.',
    codeNotFound: 'Code not found, or the exam has not been published yet.',
    failedLoadExamList: 'Failed to load the exam list. Try reloading the page.',
    failedLoadExam: 'Failed to load exam',
    wrongToken: 'Wrong token. Ask the supervising teacher for the correct one.',
    failedStart: 'Failed to start the exam',
    resumed: (n: number) => `Previous progress restored — continuing from question ${n}.`,
    questionOf: (n: number) => `Question ${n}`,
    answer: 'Answer',
    examFinished: 'Exam Finished!',
    saving: 'Saving results...',
    saved: 'Results saved.',
    points: 'points',
    saveFailed: 'Failed to save results to the server (slow/dropped connection). Your score is still shown below — try "Retry Save", or screenshot this screen as proof for your teacher.',
    retrySave: 'Retry Save',
    questionNotFound: 'Question not found',
    contactSupervisor: 'Contact the supervising teacher.',
    journeyMapTitle: 'Maze Path Map',
    legendCorrect: 'Correct',
    legendLost: 'Lost',
    statTotalSteps: 'Total Steps',
    statLostCount: 'Times Lost',
    statBranchSteps: 'Steps on Branch Path',
    lostAtLabel: 'You got lost at step:',
    stepShort: 'Step #',
    perfectRun: 'Every choice was right — you went straight through without getting lost once.',
    shortfallMessage: (target: number, lost: number, taken: number) =>
      `Every choice determines the next step. The Golden Path target was ${target} steps, but because you got lost ${lost}x, you only made it through ${taken} steps on that path — the rest became branch-path steps.`,
  },
} as const;

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof STRINGS['id'];
}

const LanguageContext = createContext<Ctx | null>(null);

export const ExamLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('id');
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: STRINGS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useExamLang(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useExamLang must be used within ExamLanguageProvider');
  return ctx;
}
