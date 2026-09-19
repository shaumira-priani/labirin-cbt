import React from 'react';
import { Maximize2, ShieldAlert } from 'lucide-react';
import { Language } from '../types/exam';
import { getTranslation } from '../data/translations';

interface CbtSecurityOverlayProps {
  isOpen: boolean;
  violationsCount: number;
  reason: 'fullscreen_exit' | 'tab_switched';
  language?: Language;
  onReenterFullscreen: () => void;
}

export const CbtSecurityOverlay: React.FC<CbtSecurityOverlayProps> = ({
  isOpen,
  violationsCount,
  reason,
  language = 'id',
  onReenterFullscreen
}) => {
  if (!isOpen) return null;
  const currentLang: Language = language === 'en' ? 'en' : 'id';
  const t = getTranslation(currentLang);

  return (
    <div className="fixed inset-0 z-[100] bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-2xl border-2 border-rose-500 shadow-2xl w-full max-w-lg p-6 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-rose-50">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-full text-xs font-bold uppercase tracking-wider">
            <span>{t.securityTitle}</span>
          </div>

          <h3 className="text-xl font-bold text-stone-900">
            {reason === 'fullscreen_exit'
              ? (currentLang === 'en' ? 'Fullscreen Mode Deactivated' : 'Layar Penuh Dinonaktifkan')
              : (currentLang === 'en' ? 'Tab Switch / Window Inactive Detected!' : 'Terdeteksi Beralih Aplikasi / Tab!')}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {reason === 'fullscreen_exit' ? t.securityReasonFullscreen : t.securityReasonTab} {t.securityWarningMsg}
          </p>
        </div>

        {/* Violation counter badge */}
        <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
          <span className="text-stone-700 font-medium">
            {currentLang === 'en' ? 'Total Security Violations Logged:' : 'Total Pelanggaran Terdeteksi:'}
          </span>
          <span className="font-mono font-bold text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-rose-300">
            {violationsCount} {currentLang === 'en' ? 'Times' : 'Kali'}
          </span>
        </div>

        <button
          type="button"
          onClick={onReenterFullscreen}
          className="w-full py-3.5 px-6 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
          <span>{t.btnReturnFullscreen}</span>
        </button>
      </div>
    </div>
  );
};
