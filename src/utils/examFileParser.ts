// src/utils/examFileParser.ts
//
// Parses a teacher-uploaded .xlsx or .docx file into DraftQuestion[] for the
// preview/edit screen. Nothing here writes to Firestore — that only happens
// after the teacher confirms the preview.
//
// Excel: plain-text columns, optional "URL Gambar" column for an image link.
// Word: question/explanation text keeps BOLD/ITALIC/UNDERLINE formatting as
//   HTML (via mammoth.convertToHtml), and any image embedded in the question
//   paragraph is extracted and uploaded to Cloudinary automatically.

import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { uploadImageToCloudinary } from './cloudinaryUpload';
import type { DraftQuestion } from '../types/customExam';
import type { OptionKey } from '../types/exam';

const VALID_KEYS: OptionKey[] = ['A', 'B', 'C', 'D', 'E'];

function makeTempId(): string {
  return `tmp_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

// ---------------------------------------------------------------------------
// EXCEL (.xlsx) — columns:
// No | Pertanyaan | Opsi A | Opsi B | Opsi C | Opsi D | Opsi E |
// Kunci Jawaban | Pembahasan | Topik | URL Gambar (opsional)
// ---------------------------------------------------------------------------

export async function parseExcelFile(file: File): Promise<DraftQuestion[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: '' });

  return rows
    .map((row, index) => {
      const get = (...names: string[]): string => {
        for (const n of names) {
          const key = Object.keys(row).find((k) => k.trim().toLowerCase() === n.toLowerCase());
          if (key && String(row[key]).trim() !== '') return String(row[key]).trim();
        }
        return '';
      };

      const question = get('Pertanyaan', 'Soal');
      const options = VALID_KEYS.map((key) => ({ key, text: get(`Opsi ${key}`, `Option ${key}`) })).filter(
        (o) => o.text !== ''
      );

      const rawKey = get('Kunci Jawaban', 'Kunci', 'Jawaban Benar').toUpperCase();
      const correctAnswer = (VALID_KEYS as string[]).includes(rawKey) ? (rawKey as OptionKey) : '';

      const imageUrlRaw = get('URL Gambar', 'Image URL', 'Gambar');
      const imageUrl = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(imageUrlRaw) ? imageUrlRaw : undefined;

      const draft: DraftQuestion = {
        tempId: makeTempId(),
        order: index + 1,
        question,
        options,
        correctAnswer,
        explanation: get('Pembahasan', 'Penjelasan'),
        topic: get('Topik', 'Topic') || undefined,
        imageUrl,
      };
      draft.error = validateDraft(draft);
      return draft;
    })
    .filter((d) => d.question !== '');
}

// ---------------------------------------------------------------------------
// WORD (.docx) — one question per block (blocks separated by a blank
// paragraph). Bold/italic/underline in the question & explanation carry
// over as HTML. An image inside the question paragraph is uploaded to
// Cloudinary automatically and attached as imageUrl.
//
// Expected structure per block:
//   Pertanyaan (boleh ada bold/italic/gambar di sini)
//   A. opsi pertama
//   B. opsi kedua
//   ...
//   Kunci: B
//   Pembahasan: teks pembahasan (boleh ada formatting)
// ---------------------------------------------------------------------------

export async function parseWordFile(file: File): Promise<DraftQuestion[]> {
  const buffer = await file.arrayBuffer();

  const { value: html } = await mammoth.convertToHtml(
    { arrayBuffer: buffer },
    {
      convertImage: mammoth.images.imgElement((image) =>
        image.read('base64').then(async (base64: string) => {
          try {
            const byteChars = atob(base64);
            const bytes = new Uint8Array(byteChars.length);
            for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
            const blob = new Blob([bytes], { type: image.contentType });
            const uploadedUrl = await uploadImageToCloudinary(new File([blob], 'question-image', { type: image.contentType }));
            return { src: uploadedUrl };
          } catch {
            // If Cloudinary isn't configured / upload fails, fall back to an
            // inline data URI so parsing doesn't crash — teacher can fix later.
            return { src: `data:${image.contentType};base64,${base64}` };
          }
        })
      ),
    }
  );

  // Split into block-level elements (paragraphs, tables, lists) in document order
  const blockMatches = html.match(/<(p|table|ul|ol)[\s\S]*?<\/\1>/g) ?? [];

  // Group consecutive blocks into "questions": a new question starts after an
  // empty paragraph OR right after a "Pembahasan:" block.
  const groups: string[][] = [[]];
  blockMatches.forEach((block) => {
    const isEmpty = stripHtml(block) === '';
    if (isEmpty) {
      if (groups[groups.length - 1].length > 0) groups.push([]);
      return;
    }
    groups[groups.length - 1].push(block);
    if (/^pembahasan\s*[:\-]/i.test(stripHtml(block))) {
      groups.push([]);
    }
  });

  const drafts = groups
    .filter((g) => g.length > 0)
    .map((blocks, index) => {
      let questionHtml = '';
      let imageUrl: string | undefined;
      const options: { key: OptionKey; text: string }[] = [];
      let correctAnswer: OptionKey | '' = '';
      let explanation = '';

      for (const block of blocks) {
        const plain = stripHtml(block);
        const optMatch = plain.match(/^([A-E])[.).]\s*(.+)$/i);
        const keyMatch = plain.match(/^kunci\s*[:\-]\s*([A-E])/i);
        const explMatch = plain.match(/^pembahasan\s*[:\-]\s*(.+)$/i);
        const imgMatch = block.match(/<img[^>]+src="([^"]+)"/);

        if (imgMatch && !imageUrl) imageUrl = imgMatch[1];

        if (keyMatch) {
          correctAnswer = keyMatch[1].toUpperCase() as OptionKey;
        } else if (explMatch) {
          explanation = block.replace(/^<p[^>]*>\s*pembahasan\s*[:\-]\s*/i, '<p>').trim();
        } else if (optMatch) {
          options.push({ key: optMatch[1].toUpperCase() as OptionKey, text: optMatch[2].trim() });
        } else if (!imgMatch || plain !== '') {
          // Question text (possibly with an inline image + bold/italic formatting)
          questionHtml += block;
        }
      }

      const draft: DraftQuestion = {
        tempId: makeTempId(),
        order: index + 1,
        question: questionHtml.replace(/^\s*<p>\s*\d+[.).]\s*/, '<p>').trim(),
        options,
        correctAnswer,
        explanation,
        imageUrl,
      };
      draft.error = validateDraft(draft);
      return draft;
    })
    .filter((d) => stripHtml(d.question) !== '');

  return drafts;
}

// ---------------------------------------------------------------------------

export function validateDraft(d: DraftQuestion): string | undefined {
  const plainQuestion = stripHtml(d.question);
  if (!plainQuestion) return 'Pertanyaan kosong';
  if (/<img[^>]+src="data:/.test(d.question) || /<img[^>]+src="data:/.test(d.explanation)) {
    return 'Ada gambar yang ter-paste mentah (bukan lewat tombol upload). Hapus gambar itu, lalu pakai tombol upload gambar di toolbar.';
  }
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
