import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PartyPopper, ArrowLeft, Loader2 } from 'lucide-react';
import type { CustomExamDoc, CustomQuestionDoc, CustomSessionDoc } from '../types/customExam';
import type { OptionKey } from '../types/exam';
import { syncSessionAnswers, submitSession, recordViolation } from '../services/customExamService';
import { pointsFor } from '../utils/mazeGraphGenerator';
import { renderRichContent } from '../utils/richContentRender';
import { JourneyMap } from './JourneyMap';
import { CbtSecurityOverlay } from './CbtSecurityOverlay';
import { enterFullscreen, exitFullscreen } from '../utils/fullscreenHelpers';
import { buildSheetsPayload, sendResultToGoogleSheets } from '../utils/googleSheetsWebhook';
import { initialMazeState, replayHistory, transition, type AnswerRecord, type Snapshot } from '../utils/mazeStateMachine';

export type { AnswerRecord };

interface Props {
  exam: CustomExamDoc;
  questions: CustomQuestionDoc[];
  session: CustomSessionDoc;
  onFinished: (finalScore: number, history: AnswerRecord[], goldenPathTarget: number) => void;
}

const SAVING_PAUSE_MS = 500; // brief neutral pause, no correctness reveal

export const CustomExamRunner: React.FC<Props> = ({ exam, questions, session, onFinished }) => {
  const graph = exam.mazeGraph!;
  const questionsById = useMemo(() => Object.fromEntries(questions.map((q) => [q.id, q])), [questions]);
  const goldenPathTarget = graph.goldenPath.length;

  // If `session.answers` already has entries (student is RESUMING after a
  // disconnect), replay them through the same state machine to land exactly
  // where they left off. A brand-new session just replays an empty array,
  // which naturally resolves to the fresh starting state.
  const resumed = useMemo(
    () => replayHistory(graph, session.answers as AnswerRecord[]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session.id]
  );
  const wasResumed = session.answers.length > 0;

  const [currentId, setCurrentId] = useState<string>(
    resumed.state.currentId === 'SELESAI' ? (graph.goldenPath[0] ?? '') : resumed.state.currentId
  );
  const [arrayPointer, setArrayPointer] = useState(resumed.state.arrayPointer);
  const [remainingBudget, setRemainingBudget] = useState(resumed.state.remainingBudget);
  const [isOnGoldenPath, setIsOnGoldenPath] = useState(resumed.state.isOnGoldenPath);
  const [consecutiveBranchCorrect, setConsecutiveBranchCorrect] = useState(resumed.state.consecutiveBranchCorrect);
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [history, setHistory] = useState<AnswerRecord[]>(session.answers as AnswerRecord[]);
  const [pathStack, setPathStack] = useState<Snapshot[]>(resumed.pathStack);
  const [finished, setFinished] = useState(resumed.state.currentId === 'SELESAI');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastFinalHistory, setLastFinalHistory] = useState<AnswerRecord[] | null>(null);

  // --- Fullscreen + anti-cheat (mirrors the legacy maze quiz's behaviour) ---
  const [violationsCount, setViolationsCount] = useState(session.violationsCount ?? 0);
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

  const handleSelect = (key: OptionKey) => {
    if (submittingAnswer) return;
    setSelected(key);
  };

  const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> =>
    Promise.race([
      promise,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Koneksi lambat/terputus')), ms)),
    ]);

  const finishExam = async (finalHistory: AnswerRecord[]) => {
    const finalScore = finalHistory.reduce((sum, h) => sum + h.pointsEarned, 0);
    const endTime = Date.now();
    setFinished(true);
    setSubmitting(true);
    setSubmitError(null);
    setLastFinalHistory(finalHistory);

    try {
      await withTimeout(submitSession(session.id, finalScore), 15000);
    } catch {
      setSubmitting(false);
      setSubmitError('Gagal menyimpan hasil ke server (koneksi lambat/terputus). Skormu tetap tampil di bawah — coba tekan "Simpan Ulang", atau screenshot layar ini sebagai bukti ke guru.');
      return;
    }

    if (exam.sheetsWebhookUrl) {
      const lostCount = finalHistory.filter((h) => h.isOnGoldenPath && !h.isCorrect).length;
      const sessionForPayload: CustomSessionDoc = {
        ...session,
        answers: finalHistory.map((h) => ({ ...h, answeredAt: Date.now() })),
        score: finalScore,
        endTime,
        violationsCount,
        status: 'submitted',
      };
      const payload = buildSheetsPayload(exam, sessionForPayload, questions, lostCount);
      sendResultToGoogleSheets(exam.sheetsWebhookUrl, payload).catch(() => {});
    }

    setSubmitting(false);
    onFinished(finalScore, finalHistory, goldenPathTarget);
  };

  const retrySubmit = () => {
    if (lastFinalHistory) finishExam(lastFinalHistory);
  };

  const handleConfirm = async () => {
    if (!selected || !currentQuestion) return;

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
    // Fire-and-forget: don't block the exam UI on network speed, AND this is
    // exactly the data a resumed session replays from if the device drops
    // right after this.
    syncSessionAnswers(session.id, newHistory.map((h) => ({ ...h, answeredAt: Date.now() }))).catch((err) => {
      console.warn('Gagal sinkron jawaban (akan dicoba lagi otomatis):', err);
    });

    setTimeout(async () => {
      const nextState = transition(
        graph,
        { currentId, arrayPointer, remainingBudget, isOnGoldenPath, consecutiveBranchCorrect },
        currentQuestion.id,
        selected,
        isCorrect
      );

      setArrayPointer(nextState.arrayPointer);
      setRemainingBudget(nextState.remainingBudget);
      setIsOnGoldenPath(nextState.isOnGoldenPath);
      setConsecutiveBranchCorrect(nextState.consecutiveBranchCorrect);
      setSelected(null);
      setSubmittingAnswer(false);

      if (nextState.currentId === 'SELESAI') {
        await finishExam(newHistory);
      } else {
        setCurrentId(nextState.currentId);
      }
    }, SAVING_PAUSE_MS);
  };

  const handleBack = () => {
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

    syncSessionAnswers(session.id, newHistory.map((h) => ({ ...h, answeredAt: Date.now() }))).catch((err) => {
      console.warn('Gagal sinkron jawaban (akan dicoba lagi otomatis):', err);
    });
  };

  if (finished) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-5">
        <PartyPopper className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">Ujian Selesai!</h2>
        {submitError ? (
          <div className="space-y-3">
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{submitError}</p>
            <button onClick={retrySubmit} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl">
              Simpan Ulang
            </button>
          </div>
        ) : (
          <p className="text-stone-500 text-sm">{submitting ? 'Menyimpan hasil...' : 'Hasil sudah tersimpan.'}</p>
        )}
        <p className="text-3xl font-bold text-emerald-700">{totalScore} poin</p>
        <div className="bg-white border border-stone-200 rounded-2xl p-5">
          <JourneyMap history={history} goldenPathTarget={goldenPathTarget} />
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

      {wasResumed && history.length === session.answers.length && (
        <p className="text-xs text-center text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          Progres sebelumnya berhasil dipulihkan — lanjut dari soal ke-{history.length + 1}.
        </p>
      )}

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
