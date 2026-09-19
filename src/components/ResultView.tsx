import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { StudentInfo, StepAnswer, Language } from '../types/exam';
import { saveSubmission } from '../services/googleSheetsService';
import { VisualMapComparison } from './VisualMapComparison';
import { VisualMapComparisonK12 } from './VisualMapComparisonK12';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Award,
  Compass,
  GitBranch
} from 'lucide-react';
import { getTranslation } from '../data/translations';

interface ResultViewProps {
  student: StudentInfo;
  history: StepAnswer[];
  startTime: number;
  endTime: number;
  violationsCount?: number;
  language?: Language;
}

export const ResultView: React.FC<ResultViewProps> = ({
  student,
  history,
  startTime,
  endTime,
  violationsCount = 0,
  language = 'id'
}) => {
  const [syncedState, setSyncedState] = useState<boolean | null>(null);
  const currentLang: Language = language === 'en' ? 'en' : 'id';
  const t = getTranslation(currentLang);

  const isK12 = student.gradeLevel === '12';
  const totalQuestions = 20;
  const correctCount = history.filter((h) => h.isCorrect).length;

  // Grade 10 & 12: 2 points for correct in golden path, 1 point for correct in branch route, 0 for incorrect
  const goldenCorrectCount = history.filter((h) => h.isCorrect && h.isOnGoldenPath).length;
  const branchCorrectCount = history.filter((h) => h.isCorrect && !h.isOnGoldenPath).length;

  const rawScore = history.reduce(
    (acc, h) => acc + (h.pointsEarned ?? (h.isCorrect ? (h.isOnGoldenPath ? 2 : 1) : 0)),
    0
  );

  const maxRawScore = 40;
  const scoreFinal = rawScore;

  const isPerfect = goldenCorrectCount === 20 && rawScore === 40;

  const durationSeconds = Math.max(1, Math.floor((endTime - startTime) / 1000));
  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return currentLang === 'en' ? `${m}m ${s}s` : `${m}m ${s}d`;
  };

  // Generate detailed readable answer history for Teacher & Google Sheets
  const answerHistoryText = history
    .map((h, i) => {
      const pathType = h.isOnGoldenPath
        ? currentLang === 'en'
          ? 'Golden Path'
          : 'Jalur Utama'
        : currentLang === 'en'
        ? 'Branch'
        : 'Cabang';
      const pts = h.pointsEarned ?? (h.isCorrect ? (h.isOnGoldenPath ? 2 : 1) : 0);
      const status = h.isCorrect
        ? `${currentLang === 'en' ? 'Correct' : 'Benar'} (+${pts}pt, ${pathType})`
        : `${currentLang === 'en' ? 'Incorrect' : 'Salah'} (0pt, Key: ${h.correctAnswer})`;
      return `[${i + 1}] No.${h.questionId}: Opt ${h.selectedOption} (${status})`;
    })
    .join(' | ');

  const statusLabel: 'Sampai Tujuan Utama' | 'Tersesat di Labirin' | 'Selesai Sempurna' = isK12
    ? isPerfect
      ? 'Selesai Sempurna'
      : 'Tersesat di Labirin'
    : isPerfect
    ? 'Sampai Tujuan Utama'
    : 'Tersesat di Labirin';

  // Save submission to local storage and silently sync to Google Sheets
  useEffect(() => {
    const record = {
      timestamp: new Date().toLocaleString(currentLang === 'en' ? 'en-US' : 'id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      name: student.name,
      className: student.className,
      gradeLevel: student.gradeLevel,
      packageTitle:
        student.packageTitle ||
        (isK12 ? 'Kelas 12 (Enzim & Metabolisme Sel)' : 'Kelas 10 (Keanekaragaman Hayati)'),
      language: currentLang,
      correctCount,
      totalQuestions,
      scoreMaze: rawScore,
      scoreScale100: scoreFinal,
      status: statusLabel,
      durationFormatted: formatDuration(durationSeconds),
      answerHistory: answerHistoryText,
      violationsCount
    };

    saveSubmission(record).then(({ synced }) => {
      setSyncedState(synced);
    });

    if (isPerfect) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // confetti fallback
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Banner Status */}
      <div
        className={`border rounded-2xl p-6 sm:p-8 shadow-sm transition-all ${
          isPerfect
            ? 'bg-gradient-to-b from-emerald-900 to-emerald-950 text-white border-emerald-800'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-stone-100/10 border border-current/20">
              {isPerfect ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">{t.perfectBadge}</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-amber-700 font-bold">{t.standardBadge}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {isPerfect
                ? currentLang === 'en'
                  ? 'Congratulations! Reached the Ideal Zenith!'
                  : 'Selamat! Berhasil Tiba di Titik Tujuan Seharusnya!'
                : currentLang === 'en'
                ? 'Assessment Completed'
                : 'Pengerjaan Ulangan Selesai'}
            </h1>

            <p
              className={`text-sm sm:text-base font-normal max-w-2xl leading-relaxed ${
                isPerfect ? 'text-emerald-100/90' : 'text-stone-600'
              }`}
            >
              {isPerfect
                ? currentLang === 'en'
                  ? `Congratulations ${student.name} (${student.className})! You achieved a perfect 100% trajectory across all ${totalQuestions} questions on the Golden Path.`
                  : `Selamat ${student.name} (${student.className})! Kamu berhasil menuntaskan seluruh alur ${totalQuestions} soal di jalur utama dan tiba di pos akhir sempurna.`
                : currentLang === 'en'
                ? `Thank you ${student.name} (${student.className}). You completed the assessment with ${correctCount} out of ${totalQuestions} correct answers.`
                : `Terima kasih ${student.name} (${student.className}). Kamu telah menuntaskan ulangan dengan capaian ${correctCount} dari ${totalQuestions} soal benar.`}
            </p>
          </div>

          {/* Big Score Display (Skor Maksimal 40) */}
          <div
            className={`p-5 rounded-2xl text-center shrink-0 min-w-[200px] border ${
              isPerfect
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-stone-50 border-stone-200 text-stone-900'
            }`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              {t.scoreCardTitle}
            </div>
            <div className="text-4xl font-extrabold font-mono my-1 tracking-tight">
              {scoreFinal}
              <span className="text-lg font-normal text-stone-400">/{maxRawScore}</span>
            </div>
            <div className="text-xs font-mono font-medium text-emerald-600">
              {goldenCorrectCount}x {currentLang === 'en' ? 'Golden Path' : 'Jalur Utama'} (2pt) +{' '}
              {branchCorrectCount}x {currentLang === 'en' ? 'Branch' : 'Cabang'} (1pt)
            </div>
          </div>
        </div>

        {/* Safe Logged Confirmation */}
        <div className="mt-6 pt-6 border-t border-current/10 flex items-center justify-between">
          <div className="text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-emerald-500 font-medium">
              {currentLang === 'en'
                ? 'Your exam results have been safely logged and recorded in the teacher system'
                : 'Data hasil ulangan kamu telah tersimpan aman di sistem guru'}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <div className="text-stone-400 text-xs font-semibold uppercase tracking-wider">
            {t.statCorrectAnswers}
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">
            {correctCount}{' '}
            <span className="text-xs font-normal text-stone-400">/ {totalQuestions}</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
            <span>
              {goldenCorrectCount} (+2) • {branchCorrectCount} (+1)
            </span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <div className="text-stone-400 text-xs font-semibold uppercase tracking-wider">
            {currentLang === 'en' ? 'Incorrect Answers' : 'Jawaban Salah'}
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-1">
            {totalQuestions - correctCount}{' '}
            <span className="text-xs font-normal text-stone-400">/ {totalQuestions}</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {totalQuestions - correctCount > 0
              ? currentLang === 'en'
                ? '0 pts on missed items'
                : 'Mendapat 0 poin di butir salah'
              : currentLang === 'en'
              ? 'Flawless run'
              : 'Tanpa kesalahan'}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <div className="text-stone-400 text-xs font-semibold uppercase tracking-wider">
            {t.scoreCardTitle}
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">
            {scoreFinal}{' '}
            <span className="text-xs font-normal text-stone-400">/ {maxRawScore}</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {currentLang === 'en' ? 'Accumulated raw score' : 'Skor capaian langsung'}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <div className="text-stone-400 text-xs font-semibold uppercase tracking-wider">
            {t.statDuration}
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">
            {formatDuration(durationSeconds)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {currentLang === 'en' ? 'Total elapsed CBT time' : 'Total durasi pengerjaan CBT'}
          </div>
        </div>
      </div>

      {/* Visual Map Comparison */}
      {isK12 ? (
        <VisualMapComparisonK12 history={history} isPerfect={isPerfect} language={currentLang} />
      ) : (
        <VisualMapComparison history={history} isPerfect={isPerfect} language={currentLang} />
      )}
    </div>
  );
};
