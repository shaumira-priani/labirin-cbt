import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PartyPopper, ArrowLeft, Loader2 } from 'lucide-react';
import type { CustomExamDoc, CustomQuestionDoc, CustomSessionDoc } from '../types/customExam';
import type { OptionKey } from '../types/exam';
import { syncSessionAnswers, submitSession, recordViolation } from '../services/customExamService';
import { pointsFor } from '../utils/mazeGraphGenerator';
import { renderRichContent } from '../utils/richContentRender';
import { JourneySummary } from './JourneySummary';
import { CbtSecurityOverlay } from './CbtSecurityOverlay';
import { enterFullscreen, exitFullscreen } from '../utils/fullscreenHelpers';

interface Props {
  exam: CustomExamDoc;
  questions: CustomQuestionDoc[];
  session: CustomSessionDoc;
  onFinished: (finalScore: number, history: AnswerRecord[], goldenPathTarget: number) => void;
}

export interface AnswerRecord {
  questionId: string;
  selectedOption: OptionKey;
  isCorrect: boolean;
  isOnGoldenPath: boolean;
  pointsEarned: number;
}

/** Full state needed to re-render a question and resume forward correctly —
 *  captured before every answer so "Kembali" can restore it exactly. */
interface Snapshot {
  questionId: string;
  arrayPointer: number;
  remainingBudget: number;
  isOnGoldenPath: boolean;
  consecutiveBranchCorrect: number;
  selectedOption: OptionKey; // what they picked last time, pre-filled on going back
}

const WRONG_GOLDEN_PENALTY = 2;
const RECOVERY_STREAK_NEEDED = 2;
const SAVING_PAUSE_MS = 500; // brief neutral pause, no correctness reveal

export const CustomExamRunner: React.FC<Props> = ({ exam, questions, session, onFinished }) => {
  const graph = exam.mazeGraph!;
  const questionsById = useMemo(() => Object.fromEntries(questions.map((q) => [q.id, q])), [questions]);
  const goldenPathTarget = graph.goldenPath.length;

  const [currentId, setCurrentId] = useState<string>(graph.goldenPath[0]);
  const [arrayPointer, setArrayPointer] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(goldenPathTarget);
  const [isOnGoldenPath, setIsOnGoldenPath] = useState(true);
  const [consecutiveBranchCorrect, setConsecutiveBranchCorrect] = useState(0);
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [history, setHistory] = useState<AnswerRecord[]>([]);
  const [pathStack, setPathStack] = useState<Snapshot[]>([]);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- Fullscreen + anti-cheat (mirrors the legacy maze quiz's behaviour) ---
  const [violationsCount, setViolationsCount] = useState(0);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [securityReason, setSecurityReason] = useState<'fullscreen_exit' | 'tab_switched'>('fullscreen_exit');
  const examActiveRef = useRef(true);

  useEffect(() => {
    examActiveRef.current = !finished;
  }, [finished]);

  useEffect(() => {
    enterFullscreen();

    const handleFullscreenChange = () => {
      if (examActiveRef.current && !document.fullscreenElement) {
        setViolationsCount((v) => v + 1);
        setSecurityReason('fullscreen_exit');
        setSecurityOpen(true);
        recordViolation(session.id).catch(() => {});
      }
    };
    const handleVisibilityChange = () => {
      if (examActiveRef.current && document.hidden) {
        setViolationsCount((v) => v + 1);
        setSecurityReason('tab_switched');
        setSecurityOpen(true);
        recordViolation(session.id).catch(() => {});
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      exitFullscreen();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestion = questionsById[currentId];
  const totalScore = history.reduce((sum, h) => sum + h.pointsEarned, 0);

  const pickAnotherBranchQuestion = (excludeId: string): string => {
    const pool = graph.branchPool;
    if (pool.length <= 1) return pool[0] ?? excludeId;
    let idx = pool.indexOf(excludeId);
    idx = (idx + 1) % pool.length;
    if (pool[idx] === excludeId) idx = (idx + 1) % pool.length;
    return pool[idx];
  };

  const handleSelect = (key: OptionKey) => {
    if (submittingAnswer) return;
    setSelected(key);
  };

  const finishExam = async (finalHistory: AnswerRecord[]) => {
    const finalScore = finalHistory.reduce((sum, h) => sum + h.pointsEarned, 0);
    setFinished(true);
    setSubmitting(true);
    await submitSession(session.id, finalScore);
    setSubmitting(false);
    onFinished(finalScore, finalHistory, goldenPathTarget);
  };

  const handleConfirm = async () => {
    if (!selected || !currentQuestion) return;

    // Snapshot the state BEFORE this answer, so "Kembali" can restore it.
    const snapshot: Snapshot = {
      questionId: currentQuestion.id,
      arrayPointer,
      remainingBudget,
      isOnGoldenPath,
      consecutiveBranchCorrect,
      selectedOption: selected,
    };

    const isCorrect = selected === currentQuestion.correctAnswer;
    const points = pointsFor(isCorrect, isOnGoldenPath);
    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedOption: selected,
      isCorrect,
      isOnGoldenPath,
      pointsEarned: points,
    };

    setSubmittingAnswer(true);
    const newHistory = [...history, record];
    setHistory(newHistory);
    setPathStack((prev) => [...prev, snapshot]);
    await syncSessionAnswers(session.id, newHistory.map((h) => ({ ...h, answeredAt: Date.now() })));

    setTimeout(async () => {
      let nextId: string | 'SELESAI';
      let nextIsOnGolden = isOnGoldenPath;
      let nextConsecutive = consecutiveBranchCorrect;
      let nextPointer = arrayPointer;
      let nextBudget = remainingBudget;

      if (isOnGoldenPath) {
        nextPointer = arrayPointer + 1;
        nextBudget = remainingBudget - 1 - (isCorrect ? 0 : WRONG_GOLDEN_PENALTY);
        nextConsecutive = 0;

        const budgetExhausted = nextBudget <= 0;
        const arrayExhausted = nextPointer >= graph.goldenPath.length;

        if (isCorrect) {
          if (budgetExhausted || arrayExhausted) {
            nextId = 'SELESAI';
          } else {
            nextIsOnGolden = true;
            nextId = graph.goldenPath[nextPointer];
          }
        } else if (budgetExhausted) {
          nextId = 'SELESAI';
        } else {
          nextIsOnGolden = false;
          nextId = graph.wrongAnswerTarget[currentQuestion.id]?.[selected] ?? graph.branchPool[0];
        }
      } else {
        if (isCorrect) {
          nextConsecutive = consecutiveBranchCorrect + 1;
          if (nextConsecutive >= RECOVERY_STREAK_NEEDED) {
            nextConsecutive = 0;
            const budgetExhausted = remainingBudget <= 0;
            const arrayExhausted = arrayPointer >= graph.goldenPath.length;
            if (budgetExhausted || arrayExhausted) {
              nextId = 'SELESAI';
            } else {
              nextIsOnGolden = true;
              nextId = graph.goldenPath[arrayPointer];
            }
          } else {
            nextIsOnGolden = false;
            nextId = pickAnotherBranchQuestion(currentQuestion.id);
          }
        } else {
          nextConsecutive = 0;
          nextIsOnGolden = false;
          nextId = graph.wrongAnswerTarget[currentQuestion.id]?.[selected] ?? pickAnotherBranchQuestion(currentQuestion.id);
        }
      }

      setArrayPointer(nextPointer);
      setRemainingBudget(nextBudget);
      setIsOnGoldenPath(nextIsOnGolden);
      setConsecutiveBranchCorrect(nextConsecutive);
      setSelected(null);
      setSubmittingAnswer(false);

      if (nextId === 'SELESAI') {
        await finishExam(newHistory);
      } else {
        setCurrentId(nextId);
      }
    }, SAVING_PAUSE_MS);
  };

  const handleBack = async () => {
    if (pathStack.length === 0 || submittingAnswer) return;
    const prevSnapshot = pathStack[pathStack.length - 1];
    const newHistory = history.slice(0, -1);
    const newStack = pathStack.slice(0, -1);

    setHistory(newHistory);
    setPathStack(newStack);
    setCurrentId(prevSnapshot.questionId);
    setArrayPointer(prevSnapshot.arrayPointer);
    setRemainingBudget(prevSnapshot.remainingBudget);
    setIsOnGoldenPath(prevSnapshot.isOnGoldenPath);
    setConsecutiveBranchCorrect(prevSnapshot.consecutiveBranchCorrect);
    setSelected(prevSnapshot.selectedOption);

    await syncSessionAnswers(session.id, newHistory.map((h) => ({ ...h, answeredAt: Date.now() })));
  };

  if (finished) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-5">
        <PartyPopper className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">Ujian Selesai!</h2>
        <p className="text-stone-500 text-sm">{submitting ? 'Menyimpan hasil...' : 'Hasil sudah tersimpan.'}</p>
        <p className="text-3xl font-bold text-emerald-700">{totalScore} poin</p>
        <div className="bg-white border border-stone-200 rounded-2xl p-5">
          <JourneySummary history={history} goldenPathTarget={goldenPathTarget} />
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <p className="text-center py-16 text-rose-600 text-sm">Soal tidak ditemukan (ID: {currentId}). Hubungi Guru Pengawas.</p>;
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-5">
      <CbtSecurityOverlay
        isOpen={securityOpen}
        violationsCount={violationsCount}
        reason={securityReason}
        onReenterFullscreen={() => { enterFullscreen(); setSecurityOpen(false); }}
      />

      <div className="text-xs text-stone-400 text-center">Soal ke-{history.length + 1}</div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
        {currentQuestion.imageUrl && (
          <img src={currentQuestion.imageUrl} alt="Ilustrasi soal" className="rounded-xl max-h-64 w-full object-contain bg-stone-50" />
        )}
        <p className="text-stone-900 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: renderRichContent(currentQuestion.question) }} />

        <div className="space-y-2">
          {currentQuestion.options.map((opt) => {
            const isSelected = selected === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => handleSelect(opt.key)}
                disabled={submittingAnswer}
                className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 hover:border-emerald-300'
                }`}
              >
                <span className="font-bold text-stone-500 w-5">{opt.key}</span>
                <span className="flex-1 text-stone-800">{opt.text}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBack}
            disabled={pathStack.length === 0 || submittingAnswer}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 text-sm font-semibold disabled:opacity-30 hover:bg-stone-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected || submittingAnswer}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {submittingAnswer && <Loader2 className="w-4 h-4 animate-spin" />} Jawab
          </button>
        </div>
      </div>
    </div>
  );
};
