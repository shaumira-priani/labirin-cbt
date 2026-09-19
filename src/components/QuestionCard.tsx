import React, { useState, useEffect } from 'react';
import { Question, OptionKey, StudentInfo, StepAnswer, Language } from '../types/exam';
import { HelpCircle, Check, User, ArrowLeft, ShieldCheck, Globe } from 'lucide-react';
import { QuestionImageVisual } from './QuestionImageVisual';
import { getTranslation } from '../data/translations';
import { getLocalizedQuestion } from '../data/questionTranslations';

interface QuestionCardProps {
  question: Question;
  stepIndex: number;
  totalSteps: number;
  student: StudentInfo;
  history: StepAnswer[];
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  onSelectOption: (option: OptionKey) => void;
  onGoBack?: () => void;
  canGoBack: boolean;
  startTime: number;
  violationsCount?: number;
  isOnGoldenPath?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  stepIndex,
  totalSteps,
  student,
  history,
  language,
  onLanguageChange,
  onSelectOption,
  onGoBack,
  canGoBack,
  violationsCount = 0,
  isOnGoldenPath = true
}) => {
  const [selectedKey, setSelectedKey] = useState<OptionKey | null>(null);
  const t = getTranslation(language);

  // Localized question data
  const localizedQ = getLocalizedQuestion(question, language, student?.gradeLevel);

  // Reset selected key on question change
  useEffect(() => {
    setSelectedKey(null);
  }, [question.id]);

  // Keyboard shortcut handler (A, B, C, D, E and Backspace/Escape/ArrowLeft for back)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser inspect / copy / view source shortcuts during CBT exam
      if (
        (e.ctrlKey && ['c', 'v', 'x', 'u', 's', 'p', 'a'].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        return;
      }

      if (selectedKey !== null) return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D', 'E'].includes(key)) {
        const optionExists = localizedQ.options.some((o) => o.key === key);
        if (optionExists) {
          handleOptionClick(key as OptionKey);
        }
      } else if ((e.key === 'Backspace' || e.key === 'ArrowLeft') && canGoBack && onGoBack) {
        e.preventDefault();
        onGoBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [localizedQ, selectedKey, canGoBack, onGoBack]);

  const handleOptionClick = (key: OptionKey) => {
    if (selectedKey !== null) return;
    setSelectedKey(key);
    setTimeout(() => {
      onSelectOption(key);
    }, 220);
  };

  const progressPercent = Math.round((stepIndex / totalSteps) * 100);

  return (
    <div
      className="max-w-3xl mx-auto py-6 px-4 sm:px-6 select-none"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    >
      {/* Top Header Card: Student Info, Progres Pengerjaan, Back Button, Language Selector */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Student Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900 leading-tight">
                {student.name}
              </div>
              <div className="text-xs text-stone-500 font-medium flex items-center gap-2 mt-0.5">
                <span>{student.className}</span>
                <span className="text-stone-300">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  {t.cbtActive}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Controls: Language Switcher, Back Button & Violations */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Inline Fast Language Switcher */}
            {onLanguageChange && (
              <div className="inline-flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => onLanguageChange('id')}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    language === 'id'
                      ? 'bg-white text-emerald-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title="Tampilkan dalam Bahasa Indonesia"
                >
                  🇮🇩 ID
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('en')}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    language === 'en'
                      ? 'bg-white text-emerald-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title="Display in English"
                >
                  🇬🇧 EN
                </button>
              </div>
            )}

            {canGoBack && onGoBack && (
              <button
                type="button"
                onClick={onGoBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 hover:text-stone-900 rounded-lg text-xs font-semibold transition-all cursor-pointer border border-stone-200"
                title={language === 'en' ? 'Revise answer for previous question' : 'Kembali dan ubah jawaban pada soal sebelumnya'}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.btnGoBack}</span>
              </button>
            )}

            {/* Violation counter indicator if any */}
            {violationsCount > 0 && (
              <div
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-mono font-bold"
                title="Jumlah terdeteksi beralih aplikasi / tab"
              >
                <span>{violationsCount}{t.violationsCountSuffix}</span>
              </div>
            )}
          </div>
        </div>

        {/* STATUS BAR PROSES PENGERJAAN */}
        <div className="mt-4 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-700">{t.progressLabel}</span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {t.stepProgress.replace('{step}', String(stepIndex)).replace('{total}', String(totalSteps))}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-stone-600 font-bold">{progressPercent}%</span>
            </div>
          </div>

          {/* Continuous Progress Bar Line */}
          <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden border border-stone-200/70">
            <div
              className="bg-emerald-700 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Topic Tag only */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200">
            {localizedQ.topic}
          </span>
          <span className="text-xs text-stone-400">
            {t.selectHint}
          </span>
        </div>

        {/* Visual Diagram / Image (if present for this question) */}
        {(localizedQ.imageType || localizedQ.imageUrl || localizedQ.images) && (
          <QuestionImageVisual
            imageType={localizedQ.imageType}
            imageUrl={localizedQ.imageUrl}
            images={localizedQ.images}
            caption={localizedQ.imageCaption}
          />
        )}

        {/* Question Text */}
        <div className="mb-7 select-none">
          <h2 className="text-base sm:text-lg font-medium text-stone-900 leading-relaxed pointer-events-none whitespace-pre-line">
            {localizedQ.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {localizedQ.options.map((opt) => {
            const isSelected = selectedKey === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleOptionClick(opt.key)}
                disabled={selectedKey !== null}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 select-none ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/30'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/80 hover:border-stone-300 text-stone-800'
                } ${selectedKey !== null && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white border border-stone-300 text-stone-700'
                  }`}
                >
                  {opt.key}
                </span>
                <span className="text-sm font-normal pt-1 leading-relaxed flex-1 pointer-events-none">
                  {opt.text}
                </span>
                {isSelected && (
                  <Check className="w-5 h-5 text-emerald-700 shrink-0 mt-1.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Hint & Bottom Info */}
        <div className="mt-8 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.shortcutHint} <strong>A, B, C, D, {language === 'en' ? 'or' : 'atau'} E</strong></span>
          </div>

          <div className="flex items-center gap-3">
            {canGoBack && onGoBack && (
              <button
                type="button"
                onClick={onGoBack}
                className="inline-flex sm:hidden items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold border border-stone-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.btnGoBack}</span>
              </button>
            )}
            <span className="font-mono text-stone-500 font-medium">
              {t.cbtFooterHint}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
