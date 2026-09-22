import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Loader2, KeyRound, Clock, ListChecks, Globe } from 'lucide-react';
import {
  signInStudentAnonymously, getPublishedExamOptions, getAccessCodeForExamClass,
  getExam, getExamQuestions, startSession, findInProgressSession,
} from '../services/customExamService';
import type { CustomExamDoc, CustomQuestionDoc, CustomSessionDoc } from '../types/customExam';
import { CustomExamRunner } from './CustomExamRunner';
import type { AnswerRecord } from './CustomExamRunner';
import { JourneyMap } from './JourneyMap';
import { STUDENT_ROSTER, CLASS_NAMES } from '../data/schoolRoster';
import { ExamLanguageProvider, useExamLang } from '../i18n/examLanguage';

interface Props {
  onBack: () => void;
}

interface ExamOption { examId: string; title: string; subject: string; className: string }

type Stage = 'loading' | 'pickClass' | 'pickSubjectExam' | 'instructions' | 'running' | 'done';

const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useExamLang();
  return (
    <div className="flex gap-1 bg-stone-100 p-0.5 rounded-lg">
      <button type="button" onClick={() => setLang('id')} className={`px-2 py-1 text-xs font-semibold rounded-md flex items-center gap-1 ${lang === 'id' ? 'bg-white shadow-sm text-emerald-800' : 'text-stone-400'}`}>
        <Globe className="w-3 h-3" /> ID
      </button>
      <button type="button" onClick={() => setLang('en')} className={`px-2 py-1 text-xs font-semibold rounded-md flex items-center gap-1 ${lang === 'en' ? 'bg-white shadow-sm text-emerald-800' : 'text-stone-400'}`}>
        <Globe className="w-3 h-3" /> EN
      </button>
    </div>
  );
};

const StudentExamPickerInner: React.FC<Props> = ({ onBack }) => {
  const { t } = useExamLang();
  const [stage, setStage] = useState<Stage>('loading');
  const [allOptions, setAllOptions] = useState<ExamOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedClass, setSelectedClass] = useState('');
  const [studentName, setStudentName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [token, setToken] = useState('');

  const [exam, setExam] = useState<CustomExamDoc | null>(null);
  const [questions, setQuestions] = useState<CustomQuestionDoc[]>([]);
  const [session, setSession] = useState<CustomSessionDoc | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [finalHistory, setFinalHistory] = useState<AnswerRecord[]>([]);
  const [finalGoldenTarget, setFinalGoldenTarget] = useState(0);

  useEffect(() => {
    signInStudentAnonymously().catch(() => {});
    getPublishedExamOptions()
      .then((opts) => { setAllOptions(opts); setStage('pickClass'); })
      .catch(() => { setError(t.failedLoadExamList); setStage('pickClass'); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classNames = useMemo(() => {
    const seen = new Map<string, string>();
    allOptions.forEach((o) => {
      const key = o.className.trim().toLowerCase();
      const canonical = CLASS_NAMES.find((c) => c.toLowerCase() === key);
      if (!seen.has(key)) seen.set(key, canonical ?? o.className);
    });
    return Array.from(seen.values()).sort();
  }, [allOptions]);
  const subjectsForClass = useMemo(
    () => Array.from(new Set(allOptions.filter((o) => o.className.toLowerCase() === selectedClass.toLowerCase()).map((o) => o.subject))).sort(),
    [allOptions, selectedClass]
  );
  const examsForSubject = useMemo(
    () => allOptions.filter((o) => o.className.toLowerCase() === selectedClass.toLowerCase() && o.subject === selectedSubject),
    [allOptions, selectedClass, selectedSubject]
  );

  const handleContinueToSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !studentName.trim()) return;
    setStage('pickSubjectExam');
  };

  const handleContinueToInstructions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) return;
    setLoading(true);
    setError(null);
    try {
      const examData = await getExam(selectedExamId);
      if (!examData) throw new Error(t.examNotFound);
      setExam(examData);
      setStage('instructions');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.failedLoadExam);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWithToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam) return;
    setLoading(true);
    setError(null);
    try {
      const correctCode = await getAccessCodeForExamClass(exam.id, selectedClass);
      if (!correctCode || correctCode.toUpperCase() !== token.trim().toUpperCase()) {
        throw new Error(t.wrongToken);
      }
      const uid = await signInStudentAnonymously();
      const qs = await getExamQuestions(exam.id);
      const existing = await findInProgressSession(exam.id, uid);
      const activeSession = existing ?? (await startSession(exam, uid, studentName.trim(), selectedClass));
      setQuestions(qs);
      setSession(activeSession);
      setStage('running');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.failedStart);
    } finally {
      setLoading(false);
    }
  };

  if (stage === 'loading') {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-stone-400" /></div>;
  }

  if (stage === 'running' && exam && session) {
    return (
      <CustomExamRunner
        exam={exam}
        questions={questions}
        session={session}
        onFinished={(score, history, goldenTarget) => {
          setFinalScore(score);
          setFinalHistory(history);
          setFinalGoldenTarget(goldenTarget);
          setStage('done');
        }}
      />
    );
  }

  if (stage === 'done') {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-5">
        <h2 className="text-xl font-bold text-stone-900">{t.thankYou(studentName)}</h2>
        <p className="text-stone-500 text-sm">{t.finalScore} <span className="font-bold text-emerald-700">{finalScore}</span></p>
        <p className="text-xs text-stone-400">{t.resultsSent}</p>
        <div className="bg-white border border-stone-200 rounded-2xl p-5">
          <JourneyMap history={finalHistory} goldenPathTarget={finalGoldenTarget} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-14 px-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            if (stage === 'pickSubjectExam') setStage('pickClass');
            else if (stage === 'instructions') setStage('pickSubjectExam');
            else onBack();
          }}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700"
        >
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>
        <LanguageToggle />
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-8 space-y-5">
        {stage === 'pickClass' && (
          <form onSubmit={handleContinueToSubject} className="space-y-4">
            <h1 className="text-lg font-bold text-stone-900">{t.studentForm}</h1>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">{t.pickClass}</label>
              <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setStudentName(''); }} className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white">
                <option value="">{t.pickClassPlaceholder}</option>
                {classNames.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {classNames.length === 0 && <p className="text-xs text-amber-600 mt-1">{t.noExamsForAnyClass}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">{t.fullName}</label>
              <select value={studentName} onChange={(e) => setStudentName(e.target.value)} disabled={!selectedClass} className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white disabled:bg-stone-100">
                <option value="">{selectedClass ? t.pickNamePlaceholder : t.pickClassFirstPlaceholder}</option>
                {(STUDENT_ROSTER[selectedClass] ?? []).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={!selectedClass || !studentName.trim()} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl disabled:opacity-40">
              {t.continue}
            </button>
          </form>
        )}

        {stage === 'pickSubjectExam' && (
          <form onSubmit={handleContinueToInstructions} className="space-y-4">
            <h1 className="text-lg font-bold text-stone-900">{t.pickExam}</h1>
            <p className="text-xs text-stone-400">{t.pickClass}: <span className="font-semibold text-stone-600">{selectedClass}</span> &middot; {studentName}</p>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">{t.subjectLabel}</label>
              <select value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); setSelectedExamId(''); }} className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white">
                <option value="">{t.pickSubjectPlaceholder}</option>
                {subjectsForClass.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {selectedSubject && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">{t.materialLabel}</label>
                <select value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)} className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white">
                  <option value="">{t.pickMaterialPlaceholder}</option>
                  {examsForSubject.map((o) => <option key={o.examId} value={o.examId}>{o.title}</option>)}
                </select>
              </div>
            )}
            {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={!selectedExamId || loading} className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl disabled:opacity-40">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} {t.continue}
            </button>
          </form>
        )}

        {stage === 'instructions' && exam && (
          <form onSubmit={handleStartWithToken} className="space-y-4">
            <h1 className="text-lg font-bold text-stone-900">{exam.title}</h1>
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {exam.durationMinutes} {t.minutes}</span>
              <span className="flex items-center gap-1"><ListChecks className="w-3.5 h-3.5" /> {t.questionsCountLabel(exam.mazeGraph?.goldenPath.length ?? exam.totalQuestions)}</span>
            </div>
            <div className="text-xs text-stone-500 bg-stone-50 border border-stone-100 rounded-lg p-3 space-y-1">
              {t.instructions.map((line, i) => <p key={i}>&bull; {line}</p>)}
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5" /> {t.tokenLabel}</label>
              <input value={token} onChange={(e) => setToken(e.target.value.toUpperCase())} className="w-full px-4 py-3 border border-stone-300 rounded-xl text-center font-mono text-lg tracking-widest uppercase" maxLength={8} />
            </div>
            {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={!token.trim() || loading} className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl disabled:opacity-40">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} {t.startExam}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const StudentExamPicker: React.FC<Props> = (props) => (
  <ExamLanguageProvider>
    <StudentExamPickerInner {...props} />
  </ExamLanguageProvider>
);
