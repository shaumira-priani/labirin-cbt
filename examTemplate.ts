// src/utils/examTemplate.ts
//
// Generates the downloadable .xlsx template teachers fill in with their
// questions, matching the columns examFileParser.ts expects.

import * as XLSX from 'xlsx';

export function downloadExcelTemplate(): void {
  const sampleRows = [
    {
      No: 1,
      Pertanyaan: 'Contoh: Organel sel yang berfungsi sebagai tempat respirasi seluler adalah...',
      'Opsi A': 'Ribosom',
      'Opsi B': 'Mitokondria',
      'Opsi C': 'Lisosom',
      'Opsi D': 'Badan Golgi',
      'Opsi E': 'Retikulum Endoplasma',
      'Kunci Jawaban': 'B',
      Pembahasan: 'Mitokondria adalah tempat berlangsungnya respirasi seluler (siklus Krebs & rantai transpor elektron).',
      Topik: 'Struktur Sel',
    },
    {
      No: 2,
      Pertanyaan: '(Hapus baris contoh ini, lanjutkan mengisi soal Anda sendiri di baris berikutnya)',
      'Opsi A': '',
      'Opsi B': '',
      'Opsi C': '',
      'Opsi D': '',
      'Opsi E': '',
      'Kunci Jawaban': '',
      Pembahasan: '',
      Topik: '',
    },
  ];

  const sheet = XLSX.utils.json_to_sheet(sampleRows);
  sheet['!cols'] = [
    { wch: 4 }, { wch: 50 }, { wch: 22 }, { wch: 22 }, { wch: 22 },
    { wch: 22 }, { wch: 22 }, { wch: 14 }, { wch: 40 }, { wch: 16 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Soal');
  XLSX.writeFile(workbook, 'Template_Upload_Soal.xlsx');
}

export const WORD_TEMPLATE_INSTRUCTIONS = `Format untuk template Word (.docx):

Ketik setiap soal dengan format berikut, PISAHKAN tiap soal dengan satu baris kosong:

1. Tuliskan pertanyaan di sini
A. Pilihan jawaban pertama
B. Pilihan jawaban kedua
C. Pilihan jawaban ketiga
D. Pilihan jawaban keempat
E. Pilihan jawaban kelima
Kunci: B
Pembahasan: Tuliskan penjelasan jawaban yang benar di sini

2. Pertanyaan kedua...
A. ...
B. ...
Kunci: A
Pembahasan: ...

Catatan penting:
- Nomor soal (1., 2., dst) boleh ada atau tidak, akan diabaikan sistem.
- Baris "Kunci:" dan "Pembahasan:" harus ada persis seperti contoh (huruf besar/kecil bebas).
- Minimal 2 opsi jawaban per soal, maksimal 5 (A-E).`;
