// src/utils/examFileParser.ts
//
// Parses a teacher-uploaded .xlsx or .docx file into DraftQuestion[] for the
// preview/edit screen. Nothing here writes to Firestore — that only happens
// after the teacher confirms the preview (see customExamService.saveExamQuestions).

import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import type { DraftQuestion } from '../types/customExam';
import type { OptionKey } from '../types/exam';

const VALID_KEYS: OptionKey[] = ['A', 'B', 'C', 'D', 'E'];

function makeTempId(): string {
  return `tmp_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

// ---------------------------------------------------------------------------
// EXCEL (.xlsx) — expects columns:
// No | Pertanyaan | Opsi A | Opsi B | Opsi C | Opsi D | Opsi E | Kunci Jawaban | Pembahasan | Topik
// ---------------------------------------------------------------------------

export async function parseExcelFile(file: File): Promise<DraftQuestion[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: '' });

  return rows.map((row, index) => {
    const get = (...names: string[]): string => {
      for (const n of names) {
        const key = Object.keys(row).find((k) => k.trim().toLowerCase() === n.toLowerCase());
        if (key && String(row[key]).trim() !== '') return String(row[key]).trim();
      }
      return '';
    };

    const question = get('Pertanyaan', 'Soal');
    const options = VALID_KEYS.map((key) => ({
      key,
      text: get(`Opsi ${key}`, `Option ${key}`),
    })).filter((o) => o.text !== '');

    const rawKey = get('Kunci Jawaban', 'Kunci', 'Jawaban Benar').toUpperCase();
    const correctAnswer = (VALID_KEYS as string[]).includes(rawKey) ? (rawKey as OptionKey) : '';

    const draft: DraftQuestion = {
      tempId: makeTempId(),
      order: index + 1,
      question,
      options,
      correctAnswer,
      explanation: get('Pembahasan', 'Penjelasan'),
      topic: get('Topik', 'Topic') || undefined,
    };

    draft.error = validateDraft(draft);
    return draft;
  }).filter((d) => d.question !== ''); // skip fully blank rows
}

// ---------------------------------------------------------------------------
// WORD (.docx) — expected text format per question:
//
//   1. Pertanyaan teks di sini...
//   A. opsi pertama
//   B. opsi kedua
//   C. opsi ketiga
//   D. opsi keempat
//   E. opsi kelima
//   Kunci: B
//   Pembahasan: teks pembahasan...
//   (baris kosong sebelum soal berikutnya)
// ---------------------------------------------------------------------------

export async function parseWordFile(file: File): Promise<DraftQuestion[]> {
  const buffer = await file.arrayBuffer();
  const { value: text } = await mammoth.extractRawText({ arrayBuffer: buffer });

  // Split into blocks separated by one or more blank lines
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);

    let question = '';
    const options: { key: OptionKey; text: string }[] = [];
    let correctAnswer: OptionKey | '' = '';
    let explanation = '';

    for (const line of lines) {
      const optMatch = line.match(/^([A-E])[.).]\s*(.+)$/i);
      const keyMatch = line.match(/^kunci\s*[:\-]\s*([A-E])/i);
      const explMatch = line.match(/^pembahasan\s*[:\-]\s*(.+)$/i);

      if (keyMatch) {
        correctAnswer = keyMatch[1].toUpperCase() as OptionKey;
      } else if (explMatch) {
        explanation = explMatch[1].trim();
      } else if (optMatch) {
        options.push({ key: optMatch[1].toUpperCase() as OptionKey, text: optMatch[2].trim() });
      } else if (!question) {
        // First non-option, non-key, non-explanation line = the question text.
        // Strip a leading "1." or "1)" numbering if present.
        question = line.replace(/^\d+[.).]\s*/, '');
      } else {
        // Continuation of the question text across multiple lines
        question += ' ' + line;
      }
    }

    const draft: DraftQuestion = {
      tempId: makeTempId(),
      order: index + 1,
      question,
      options,
      correctAnswer,
      explanation,
    };
    draft.error = validateDraft(draft);
    return draft;
  }).filter((d) => d.question !== '');
}

// ---------------------------------------------------------------------------

export function validateDraft(d: DraftQuestion): string | undefined {
  if (!d.question) return 'Pertanyaan kosong';
  if (d.options.length < 2) return `Opsi jawaban kurang (cuma ${d.options.length}, minimal 2)`;
  if (!d.correctAnswer) return 'Kunci jawaban tidak valid/kosong (harus A-E)';
  if (!d.options.some((o) => o.key === d.correctAnswer)) {
    return `Kunci jawaban "${d.correctAnswer}" tidak cocok dengan opsi yang tersedia`;
  }
  return undefined;
}

export async function parseQuestionFile(file: File): Promise<DraftQuestion[]> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return parseExcelFile(file);
  if (name.endsWith('.docx')) return parseWordFile(file);
  throw new Error('Format file tidak didukung. Gunakan .xlsx atau .docx.');
}
