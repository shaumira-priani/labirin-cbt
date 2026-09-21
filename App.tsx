import React, { useState, useEffect, useRef } from 'react';
import { StudentInfo, OptionKey, StepAnswer, Language } from './types/exam';
import { QUESTIONS_DATA } from './data/questionsData';
import { QUESTIONS_DATA_K12 } from './data/questionsDataK12';
import { computeRouteStateK10, determineNextQuestionK10 } from './data/graphStructure';
import { computeRouteStateK12, determineNextQuestionK12 } from './data/graphStructureK12';
import { StudentRegistration } from './components/StudentRegistration';
import { ExamInstructions } from './components/ExamInstructions';
import { QuestionCard } from './components/QuestionCard';
import { ResultView } from './components/ResultView';
import { TeacherPortalModal } from './components/TeacherPortalModal';
import { CbtSecurityOverlay } from './components/CbtSecurityOverlay';
import { TeacherAuthPage } from './components/TeacherAuthPage';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentExamPicker } from './components/StudentExamPicker';
import { watchAuthState } from './services/customExamService';
import type { User } from 'firebase/auth';
import { Compass, Lock, Globe, KeyRound, GraduationCap, Upload, ImageIcon } from 'lucide-react';
import { getTranslation } from './data/translations';

type ScreenState = 'registration' | 'instructions' | 'exam' | 'result';
type AppMode = 'launcher' | 'legacyMaze' | 'teacherPortal' | 'customStudent';

export function App() {
  const [appMode, setAppMode] = useState<AppMode>('launcher');
  const [teacherUser, setTeacherUser] = useState<User | null>(null);
  const [teacherAuthLoading, setTeacherAuthLoading] = useState(true);
  const [landingBanner, setLandingBanner] = useState<string>(() => {
    return localStorage.getItem('cbt_landing_banner') || '/qada_qadar_illustration.jpg';
  });

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLandingBanner(reader.result);
        try { localStorage.setItem('cbt_landing_banner', reader.result); } catch (err) {}
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const unsub = watchAuthState((u) => {
      setTeacherUser(u && !u.isAnonymous ? u : null);
      setTeacherAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const [screen, setScreen] = useState<ScreenState>('registration');
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [showTeacherModal, setShowTeacherModal] = useState(false);

  // Language state: 'id' (Bahasa Indonesia) or 'en' (English)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('biology_cbt_lang');
    return saved === 'en' ? 'en' : 'id';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('biology_cbt_lang', lang);
    } catch (e) {
      // ignore
    }
  };

  const t = getTranslation(language);

  // CBT Anti-Cheat & Fullscreen State
  const [violationsCount, setViolationsCount] = useState<number>(0);
  const [isSecurityOverlayOpen, setIsSecurityOverlayOpen] = useState(false);
  const [securityReason, setSecurityReason] = useState<'fullscreen_exit' | 'tab_switched'>('fullscreen_exit');
  const examActiveRef = useRef(false);

  // Keep examActiveRef in sync
  useEffect(() => {
    examActiveRef.current = screen === 'exam';
  }, [screen]);

  // Request fullscreen helper
  const enterFullscreen = () => {
    try {
      const docEl = document.documentElement as any;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } catch (e) {
      // ignore
    }
  };

  const exitFullscreen = () => {
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) {
      // ignore
    }
  };

  // Keyboard shortcut for teacher access: Alt+G or URL ?guru=1
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'g') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'g')) {
        setShowTeacherModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Check url search params
    const params = new URLSearchParams(window.location.search);
    if (params.get('guru') === '1' || params.get('guru') === 'true') {
      setShowTeacherModal(true);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // CBT Anti-Cheat Event Listeners (Fullscreen exit, Tab switch, Window blur)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (examActiveRef.current) {
        if (!document.fullscreenElement) {
          setViolationsCount((prev) => prev + 1);
          setSecurityReason('fullscreen_exit');
          setIsSecurityOverlayOpen(true);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (examActiveRef.current && document.hidden) {
        setViolationsCount((prev) => prev + 1);
        setSecurityReason('tab_switched');
        setIsSecurityOverlayOpen(true);
      }
    };

    const handleWindowBlur = () => {
      if (examActiveRef.current) {
        setTimeout(() => {
          if (examActiveRef.current && document.hidden) {
            setSecurityReason('tab_switched');
            setIsSecurityOverlayOpen(true);
          }
        }, 100);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  // Exam session state
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(37);
  const [history, setHistory] = useState<StepAnswer[]>([]);

  const isK12 = student?.gradeLevel === '12';
  const totalSteps = 20;

  // Active question bank getter
  const getActiveQuestion = (qId: number) => {
    return isK12 ? QUESTIONS_DATA_K12[qId] : QUESTIONS_DATA[qId];
  };

  // Step 1: When student completes identity form -> route to Instructions page
  const handleContinueToInstructions = (info: StudentInfo) => {
    setStudent(info);
    setScreen('instructions');
  };

  // Step 2: When student clicks "Saya Mengerti, Mulai Mengerjakan Soal" -> route to Exam
  const handleConfirmStartExam = () => {
    if (!student) return;
    setStartTime(Date.now());
    setCurrentStep(1);
    
    if (student.gradeLevel === '12') {
      setCurrentQuestionId(3); // Starts at Q3 for K12 Golden Path
    } else {
      setCurrentQuestionId(37); // Starts at Q37 for K10 Golden Path
    }

    setHistory([]);
    setViolationsCount(0);
    setIsSecurityOverlayOpen(false);
    setScreen('exam');

    // Trigger fullscreen
    enterFullscreen();
  };

  const handleBackToRegistration = () => {
    setScreen('registration');
  };

  const handleReenterFullscreen = () => {
    enterFullscreen();
    setIsSecurityOverlayOpen(false);
  };

  const handleRestartExam = () => {
    setScreen('registration');
    setStudent(null);
    setHistory([]);
    setViolationsCount(0);
  };

  // Handle student selecting an option (A, B, C, D, E)
  const handleSelectOption = (selectedOption: OptionKey) => {
    const q = getActiveQuestion(currentQuestionId);
    if (!q) return;

    const isCorrect = selectedOption === q.correctAnswer;
    let nextQ: number | 'SELESAI';
    let points = 0;
    let currentIsOnGolden = true;

    if (isK12) {
      const routeState = computeRouteStateK12(history);
      currentIsOnGolden = routeState.isOnGoldenPath;
      const result = determineNextQuestionK12(
        currentStep,
        currentQuestionId,
        selectedOption,
        isCorrect,
        routeState.isOnGoldenPath,
        routeState.consecutiveBranchCorrect
      );
      nextQ = result.nextQuestionId;
      points = result.pointsEarned;
    } else {
      const routeState = computeRouteStateK10(history);
      currentIsOnGolden = routeState.isOnGoldenPath;
      const result = determineNextQuestionK10(
        currentStep,
        currentQuestionId,
        selectedOption,
        isCorrect,
        routeState.isOnGoldenPath,
        routeState.consecutiveBranchCorrect
      );
      nextQ = result.nextQuestionId;
      points = result.pointsEarned;
    }

    const stepRecord: StepAnswer = {
      stepIndex: currentStep,
      questionId: currentQuestionId,
      selectedOption,
      isCorrect,
      correctAnswer: q.correctAnswer,
      nextQuestionId: nextQ,
      timeSpentSeconds: 0,
      pointsEarned: points,
      isOnGoldenPath: currentIsOnGolden
    };

    const newHistory = [...history, stepRecord];
    setHistory(newHistory);

    // Check completion condition
    if (currentStep >= totalSteps || nextQ === 'SELESAI') {
      setEndTime(Date.now());
      setScreen('result');
      exitFullscreen();
    } else {
      setCurrentStep((prev) => prev + 1);
      if (typeof nextQ === 'number') {
        setCurrentQuestionId(nextQ);
      }
    }
  };

  // Handle student going back to the previous question to revise answer
  const handleGoBack = () => {
    if (history.length === 0 || currentStep <= 1) return;

    // Pop last step answer from history
    const previousHistory = history.slice(0, -1);
    const lastStep = history[history.length - 1];

    setHistory(previousHistory);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    setCurrentQuestionId(lastStep.questionId);
  };

  const activeQuestion = student ? getActiveQuestion(currentQuestionId) : null;
  const currentRouteState = student
    ? isK12
      ? computeRouteStateK12(history)
      : computeRouteStateK10(history)
    : { isOnGoldenPath: true };

  if (appMode === 'launcher') {
    return (
      <div className="min-h-screen bg-stone-100/70 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full space-y-6 text-center">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Penilaian Harian</h1>
            <p className="text-emerald-700 font-semibold text-sm mt-1">Moda Labirin Soal</p>
          </div>

          {/* Ilustrasi Konsep Qada & Qadar */}
          <div className="relative group rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm bg-white">
            <img
              src={landingBanner}
              alt="Ilustrasi Qada dan Qadar dalam CBT Labirin"
              className="w-full h-auto object-cover max-h-56 sm:max-h-64"
              referrerPolicy="no-referrer"
            />
            <label
              title="Unggah ilustrasi kustom Anda"
              className="absolute bottom-2.5 right-2.5 bg-stone-900/75 hover:bg-stone-900 text-white text-[11px] px-2.5 py-1 rounded-lg backdrop-blur-xs cursor-pointer opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-sm"
            >
              <Upload className="w-3 h-3" /> Ganti Ilustrasi
              <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
            </label>
          </div>

          {/* Quote Qada & Qadar */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs text-center space-y-2">
            <p className="text-xs sm:text-sm font-serif italic text-stone-700 leading-relaxed px-1">
              "Setiap pilihan yang kita putuskan berpengaruh ke takdir yang akan kita jalani selanjutnya, entah di jalan yang benar atau tersesat. Karena pilihan kita sekarang menentukan diri kita di depannya; jika ingin sukses, berhati-hatilah dalam menentukan pilihan."
            </p>
            <p className="text-[11px] font-semibold text-emerald-800 tracking-wide uppercase">
              — Filosofi Qada &amp; Qadar Ujian Labirin CBT
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => setAppMode('customStudent')}
              className="w-full flex items-center gap-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl px-5 py-4 text-left transition-all shadow-sm"
            >
              <KeyRound className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Menu Siswa</p>
                <p className="text-xs text-emerald-100">Mulai kerjakan Penilaian Harian</p>
              </div>
            </button>

            <button
              onClick={() => setAppMode('teacherPortal')}
              className="w-full flex items-center gap-3 bg-white border border-stone-200 hover:border-emerald-300 hover:shadow-sm rounded-xl px-5 py-4 text-left transition-all"
            >
              <GraduationCap className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <p className="font-semibold text-stone-900 text-sm">Menu Guru</p>
                <p className="text-xs text-stone-500">Buat ujian, upload soal, pantau murid</p>
              </div>
            </button>
          </div>

          <button onClick={() => setAppMode('legacyMaze')} className="text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 pt-2">
            Lihat ujian contoh/demo (Kehati &amp; Metabolisme)
          </button>
        </div>
      </div>
    );
  }

  if (appMode === 'customStudent') {
    return <StudentExamPicker onBack={() => setAppMode('launcher')} />;
  }

  if (appMode === 'teacherPortal') {
    if (teacherAuthLoading) {
      return <div className="min-h-screen flex items-center justify-center text-stone-400 text-sm">Memuat...</div>;
    }
    if (!teacherUser) {
      return <TeacherAuthPage onAuthed={() => {}} onBack={() => setAppMode('launcher')} />;
    }
    return <TeacherDashboard user={teacherUser} onLoggedOut={() => setAppMode('launcher')} />;
  }

  // appMode === 'legacyMaze' from here on — original app, untouched.
  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans flex flex-col">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Zone: Exactly 1 single text element */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-stone-900 text-base sm:text-lg tracking-tight whitespace-nowrap">
              {t.appName}
            </span>
          </div>

          {/* Right Top Bar Area: Language Selector & Grade Status */}
          <div className="flex items-center gap-3">
            {/* Language Switcher Pill */}
            <div className="inline-flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleLanguageChange('id')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  language === 'id'
                    ? 'bg-white text-emerald-900 shadow-xs font-bold border border-stone-200/80'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Ganti ke Bahasa Indonesia"
              >
                <span>🇮🇩</span>
                <span>ID</span>
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-emerald-900 shadow-xs font-bold border border-stone-200/80'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Switch to English"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            <div className="hidden sm:block text-xs text-stone-500 font-medium border-l border-stone-200 pl-3">
              {student?.gradeLevel === '12' ? t.grade12Header : t.grade10Header}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {screen === 'registration' && (
          <StudentRegistration
            language={language}
            onLanguageChange={handleLanguageChange}
            onContinueToInstructions={handleContinueToInstructions}
          />
        )}

        {screen === 'instructions' && student && (
          <ExamInstructions
            student={student}
            language={language}
            onConfirmStart={handleConfirmStartExam}
            onBackToRegistration={handleBackToRegistration}
          />
        )}

        {screen === 'exam' && student && activeQuestion && (
          <QuestionCard
            question={activeQuestion}
            stepIndex={currentStep}
            totalSteps={totalSteps}
            student={student}
            history={history}
            language={language}
            onLanguageChange={handleLanguageChange}
            onSelectOption={handleSelectOption}
            onGoBack={handleGoBack}
            canGoBack={history.length > 0 && currentStep > 1}
            startTime={startTime}
            violationsCount={violationsCount}
            isOnGoldenPath={currentRouteState.isOnGoldenPath}
          />
        )}

        {screen === 'result' && student && (
          <ResultView
            student={student}
            history={history}
            startTime={startTime}
            endTime={endTime}
            violationsCount={violationsCount}
            language={language}
          />
        )}
      </main>

      {/* CBT Security Overlay Modal when student leaves fullscreen or switches tab */}
      <CbtSecurityOverlay
        isOpen={isSecurityOverlayOpen && screen === 'exam'}
        violationsCount={violationsCount}
        reason={securityReason}
        language={language}
        onReenterFullscreen={handleReenterFullscreen}
      />

      {/* Teacher Portal Modal (PIN Protected) */}
      {showTeacherModal && (
        <TeacherPortalModal onClose={() => setShowTeacherModal(false)} />
      )}

      {/* Footer with Discreet Teacher Lock */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            {t.footerCopyright}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-400">10 Khodijah, 10 Fatimah, 12 Saintek 4, 12 Saintek 5, 12 Saintek 6</span>
            {/* Discreet secret lock for teacher */}
            <button
              type="button"
              onClick={() => setShowTeacherModal(true)}
              className="p-1.5 text-stone-300 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
              title={t.teacherLockTitle}
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
