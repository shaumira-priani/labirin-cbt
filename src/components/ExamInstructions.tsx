import React, { useState } from 'react';
import { StudentInfo, Language } from '../types/exam';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  KeyRound,
  Lock,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { getTranslation } from '../data/translations';
import { validateClassToken } from '../data/classTokens';

interface ExamInstructionsProps {
  student: StudentInfo;
  language: Language;
  onConfirmStart: () => void;
  onBackToRegistration: () => void;
}

export const ExamInstructions: React.FC<ExamInstructionsProps> = ({
  student,
  language,
  onConfirmStart,
  onBackToRegistration
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isTokenVerified, setIsTokenVerified] = useState(false);

  const isK12 = student.gradeLevel === '12';
  const totalQuestions = 20;
  const maxScore = 40;
  const t = getTranslation(language);

  const handleVerifyAndStart = (e: React.FormEvent) => {
    e.preventDefault();
    setTokenError(null);

    const validation = validateClassToken(student.className, tokenInput);

    if (!tokenInput.trim()) {
      setTokenError(
        language === 'en'
          ? 'Please enter the exam token given by your proctor/teacher.'
          : 'Silakan masukkan token ujian yang diberikan oleh Guru Pengawas.'
      );
      return;
    }

    if (!validation.valid) {
      setTokenError(
        language === 'en'
          ? `Invalid token for ${student.className}. Please check with your teacher.`
          : `Token tidak sesuai untuk kelas ${student.className}. Silakan tanyakan token resmi ke Guru Pengawas.`
      );
      return;
    }

    setIsTokenVerified(true);
    onConfirmStart();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full mb-2 border border-emerald-200">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.instBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {t.instTitle}
            </h1>
            <p className="text-stone-600 text-sm mt-1">
              {t.instGreeting}{' '}
              <strong className="text-stone-900 font-semibold">{student.name}</strong> (
              <span className="font-semibold text-emerald-900">{student.className}</span>),{' '}
              {t.instSubtitle}
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-center sm:text-right shrink-0">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              {t.topicPackageLabel}
            </div>
            <div className="text-base font-bold text-emerald-800 mt-0.5">
              {isK12
                ? language === 'en'
                  ? 'Grade 12 (Enzymes & Cell Metabolism)'
                  : 'Kelas XII (Enzim & Metabolisme Sel)'
                : language === 'en'
                ? 'Grade 10 (Biodiversity)'
                : 'Kelas X (Keanekaragaman Hayati)'}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              {totalQuestions}{' '}
              {language === 'en' ? 'Branching Questions' : 'Butir Soal Percabangan'}
            </div>
          </div>
        </div>

        {/* Petunjuk & Skoring Cards */}
        <div className="mt-6 space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            {t.instCardRulesTitle}
          </h2>

          {/* Item 1: Format Soal */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-stone-900">{t.rule1Title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t.rule1Desc}</p>
            </div>
          </div>

          {/* Item 2: Aturan Skor */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-emerald-950">{t.rule2Title}</h3>
              <p className="text-xs text-emerald-900/90 leading-relaxed">{t.rule2Desc}</p>
              <div className="mt-2 text-xs font-semibold text-emerald-900 bg-white/80 p-2 rounded-lg border border-emerald-200/60 inline-block">
                {language === 'en'
                  ? `Maximum Final Score: ${maxScore} Points (20 Questions × 2 Pts on Golden Path)`
                  : `Nilai Akhir Maksimal: ${maxScore} Poin (20 Soal × 2 Poin di Jalur Utama)`}
              </div>
            </div>
          </div>

          {/* Item 3: Keamanan CBT */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="w-8 h-8 rounded-lg bg-stone-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>{t.rule3Title}</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t.rule3Desc}</p>
            </div>
          </div>

          {/* Item 4: Shortcut Keyboard */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="w-8 h-8 rounded-lg bg-stone-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              4
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-stone-900">
                {t.rule4Title} &amp; {t.rule5Title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t.rule4Desc} {t.rule5Desc}
              </p>
            </div>
          </div>
        </div>

        {/* SECURE TOKEN ENTRY FORM */}
        <div className="mt-8 bg-stone-50 border-2 border-emerald-300/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-2xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <span>
                  {language === 'en' ? 'Class Exam Token' : 'Token Rilis Ujian Kelas'}
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-900 rounded-md">
                  {student.className}
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'en'
                  ? 'Ask your classroom proctor for the release token to unlock the exam.'
                  : 'Minta token rilis soal kepada Guru Pengawas di kelas Anda untuk membuka soal.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleVerifyAndStart} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value);
                    if (tokenError) setTokenError(null);
                  }}
                  placeholder={
                    language === 'en'
                      ? 'Enter token (e.g. bismillah)'
                      : `Ketik token kelas ${student.className}...`
                  }
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl font-mono text-sm tracking-wider font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all ${
                    tokenError ? 'border-rose-400 bg-rose-50/20' : 'border-stone-300'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer ring-2 ring-emerald-700/30 whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>
                  {language === 'en' ? 'Verify Token & Start Exam' : 'Verifikasi & Mulai Ujian'}
                </span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>

            {tokenError && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{tokenError}</span>
              </div>
            )}
          </form>
        </div>

        {/* Action Button Section */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToRegistration}
            className="w-full sm:w-auto px-5 py-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            ← {t.btnBackToReg}
          </button>

          <p className="text-xs text-stone-400 text-center sm:text-right">
            {language === 'en'
              ? '🔒 Exam is sealed until the official class token is verified.'
              : '🔒 Lembar soal tersegel hingga token resmi kelas diverifikasi.'}
          </p>
        </div>
      </div>
    </div>
  );
};
