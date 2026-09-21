import React, { useState } from 'react';
import { StudentInfo, GradeLevel, Language } from '../types/exam';
import { Compass, ArrowRight, Globe, Check, BookOpen, Sparkles, User, Users } from 'lucide-react';
import { getTranslation } from '../data/translations';
import { CLASS_LIST, getStudentsByClass } from '../data/studentRoster';

interface StudentRegistrationProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onContinueToInstructions: (student: StudentInfo) => void;
}

export const StudentRegistration: React.FC<StudentRegistrationProps> = ({
  language,
  onLanguageChange,
  onContinueToInstructions
}) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [customClass, setCustomClass] = useState('');
  const [isCustomClass, setIsCustomClass] = useState(false);
  const [isCustomName, setIsCustomName] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; className?: string }>({});

  const t = getTranslation(language);

  // Available students for the currently selected class
  const currentStudents = selectedClass ? getStudentsByClass(selectedClass) : [];

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
    setName(''); // Reset name when class changes
    setIsCustomName(false);
    if (errors.className) setErrors((prev) => ({ ...prev, className: undefined }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; className?: string } = {};

    const resolvedClassName = isCustomClass ? customClass.trim() : selectedClass.trim();

    if (!resolvedClassName) {
      newErrors.className = t.classError;
    }

    if (!name.trim()) {
      newErrors.name = t.nameError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Determine gradeLevel automatically based on selected class
    let resolvedGrade: GradeLevel = '10';
    let packageTitle = language === 'en' ? 'Grade 10 (Biodiversity)' : 'Kelas 10 (Keanekaragaman Hayati)';

    const matched = CLASS_LIST.find((c) => c.label.toLowerCase() === resolvedClassName.toLowerCase());
    if (matched) {
      resolvedGrade = matched.grade;
      packageTitle = language === 'en' ? matched.packageTitleEn : matched.packageTitleId;
    } else {
      // Fallback for custom class input
      if (resolvedClassName.toLowerCase().startsWith('12')) {
        resolvedGrade = '12';
        packageTitle = language === 'en' ? 'Grade 12 (Enzymes & Cell Metabolism)' : 'Kelas 12 (Enzim & Metabolisme Sel)';
      } else {
        resolvedGrade = '10';
        packageTitle = language === 'en' ? 'Grade 10 (Biodiversity)' : 'Kelas 10 (Keanekaragaman Hayati)';
      }
    }

    onContinueToInstructions({
      name: name.trim(),
      className: resolvedClassName,
      gradeLevel: resolvedGrade,
      packageTitle,
      language
    });
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Main Title & Spiritual Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200 shadow-2xs">
          <Compass className="w-3.5 h-3.5" />
          <span>{t.regBadge}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          {t.regMainTitle}
        </h1>

        {/* Ayat & Refleksi Qada, Qadar, dan Ikhtiar */}
        <div className="bg-gradient-to-b from-stone-50 to-emerald-50/40 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 text-stone-800 shadow-xs space-y-3.5 text-left relative overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>{language === 'en' ? 'Divine Destiny (Qadr) & Human Choice' : 'Refleksi Takdir (Qada & Qadar) & Ikhtiar'}</span>
          </div>

          {/* Arabic Text */}
          <div className="text-right text-lg sm:text-xl font-serif text-emerald-950 font-medium leading-relaxed tracking-wide pt-1">
            {t.regAyatArabic}
          </div>

          {/* Translation */}
          <p className="text-xs sm:text-sm text-stone-600 italic leading-relaxed">
            {t.regAyatTranslation}
          </p>

          {/* Wisdom Quote: Sekarang kalian adalah keputusan yang kamu ambil terdahulu... */}
          <div className="pt-2 border-t border-emerald-200/60 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-semibold text-emerald-950 leading-snug">
              {t.regWisdomQuote}
            </p>
          </div>
        </div>
      </div>

      {/* Identity Form Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-900">
            {t.regTitle}
          </h2>
          <p className="text-stone-500 text-xs mt-1">
            {t.regSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language Selection Bar inside the form */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                {t.regLanguageLabel}
              </span>
              <span className="text-[11px] font-normal text-stone-400">
                {language === 'id' ? 'Bahasa Ujian' : 'Exam Language'}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onLanguageChange('id')}
                className={`py-2.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  language === 'id'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <span className="text-base">🇮🇩</span>
                <span>Bahasa Indonesia</span>
                {language === 'id' && <Check className="w-3.5 h-3.5 text-emerald-700 ml-auto" />}
              </button>

              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`py-2.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <span className="text-base">🇬🇧</span>
                <span>English (UK/US)</span>
                {language === 'en' && <Check className="w-3.5 h-3.5 text-emerald-700 ml-auto" />}
              </button>
            </div>
            <p className="text-[11px] text-stone-400 mt-1.5">
              {t.regLanguageDesc}
            </p>
          </div>

          {/* 1. Pilihan Kelas (Class Selection - First) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.classLabel}</span> <span className="text-rose-600">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const nextCustom = !isCustomClass;
                  setIsCustomClass(nextCustom);
                  setSelectedClass('');
                  setCustomClass('');
                  setName('');
                  if (nextCustom) {
                    setIsCustomName(true);
                  }
                }}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-medium underline cursor-pointer"
              >
                {isCustomClass ? t.customClassBack : t.customClassToggle}
              </button>
            </div>

            {!isCustomClass ? (
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className={`w-full px-4 py-3 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all appearance-none cursor-pointer ${
                    errors.className ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                  }`}
                  autoFocus
                >
                  <option value="">{t.classSelectDefault}</option>
                  <optgroup label={language === 'en' ? 'Grade 10 (Biodiversity)' : 'Kelas X (Keanekaragaman Hayati)'}>
                    <option value="10 Khodijah">10 Khodijah</option>
                    <option value="10 Fatimah">10 Fatimah</option>
                  </optgroup>
                  <optgroup label={language === 'en' ? 'Grade 12 (Enzymes & Cell Metabolism)' : 'Kelas XII (Enzim & Metabolisme Sel)'}>
                    <option value="12 Saintek 4">12 Saintek 4</option>
                    <option value="12 Saintek 5">12 Saintek 5</option>
                    <option value="12 Saintek 6">12 Saintek 6</option>
                  </optgroup>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            ) : (
              <input
                type="text"
                value={customClass}
                onChange={(e) => {
                  setCustomClass(e.target.value);
                  if (errors.className) setErrors({ ...errors, className: undefined });
                }}
                placeholder={t.customClassPlaceholder}
                className={`w-full px-4 py-3 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all ${
                  errors.className ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                }`}
              />
            )}

            {errors.className && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.className}</p>
            )}
          </div>

          {/* 2. Nama Lengkap Siswa (Student Name Dropdown - Second, populated based on selected class) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.nameLabel}</span> <span className="text-rose-600">*</span>
              </label>

              {!isCustomClass && selectedClass && (
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomName(!isCustomName);
                    setName('');
                  }}
                  className="text-xs text-emerald-800 hover:text-emerald-950 font-medium underline cursor-pointer"
                >
                  {isCustomName ? t.customNameBack : t.customNameToggle}
                </button>
              )}
            </div>

            {/* If custom class or manual name toggle is active */}
            {isCustomClass || isCustomName ? (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder={t.customNamePlaceholder || t.namePlaceholder}
                  className={`w-full px-4 py-3 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all ${
                    errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                  }`}
                />
              </div>
            ) : (
              /* Class-based Dropdown */
              <div className="relative">
                <select
                  value={name}
                  disabled={!selectedClass}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  className={`w-full px-4 py-3 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-stone-100 ${
                    errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                  }`}
                >
                  {!selectedClass ? (
                    <option value="">{t.nameSelectNoClass}</option>
                  ) : (
                    <>
                      <option value="">
                        {language === 'en'
                          ? `-- Select Student Name (${currentStudents.length} Students) --`
                          : `-- Pilih Nama Siswa (${currentStudents.length} Siswa) --`}
                      </option>
                      {currentStudents.map((studentName, idx) => (
                        <option key={`${studentName}-${idx}`} value={studentName}>
                          {studentName}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Helper notes */}
            {!selectedClass && !isCustomClass ? (
              <p className="text-[11px] text-stone-400 mt-1.5">
                {language === 'en'
                  ? '💡 Select your class above first to load your student name roster.'
                  : '💡 Pilih kelas di atas terlebih dahulu untuk memunculkan daftar nama siswa.'}
              </p>
            ) : selectedClass && !isCustomName ? (
              <p className="text-[11px] text-emerald-700 mt-1.5 font-medium flex items-center gap-1">
                <span>✓</span>
                <span>
                  {language === 'en'
                    ? `Showing ${currentStudents.length} registered students in ${selectedClass}`
                    : `Menampilkan ${currentStudents.length} nama siswa terdaftar di kelas ${selectedClass}`}
                </span>
              </p>
            ) : null}

            {errors.name && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.name}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <span>{t.btnContinueToInstructions}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

