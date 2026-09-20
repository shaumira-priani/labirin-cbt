import React, { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, PartyPopper } from 'lucide-react';
import type { CustomExamDoc, CustomQuestionDoc, CustomSessionDoc } from '../types/customExam';
import type { OptionKey } from '../types/exam';
import { recordAnswer, submitSession } from '../services/customExamService';
import { pointsFor } from '../utils/mazeGraphGenerator';
import { renderRichContent } from '../utils/richContentRender';
import { JourneySummary } from './JourneySummary';

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

// Getting a golden-path question WRONG costs this many extra "budget" slots,
// on top of the 1 slot the question itself already used. This is what makes
// wandering into remedial questions shrink your total opportunity to score,
// instead of granting bonus chances the way a flat "answer everything" model
// would. See JourneySummary for how this shows up to the student afterwards.
const WRONG_GOLDEN_PENALTY = 2;
const RECOVERY_STREAK_NEEDED = 2;

export const CustomExamRunner: React.FC<Props> = ({ exam, questions, session, onFinished }) => {
  const graph = exam.mazeGraph!;
  const questionsById = useMemo(() => Object.fromEntries(questions.map((q) => [q.id, q])), [questions]);
  const goldenPathTarget = graph.goldenPath.length;

  const [currentId, setCurrentId] = useState<string>(graph.goldenPath[0]);
  const [arrayPointer, setArrayPointer] = useState(0); // next index into graph.goldenPath once back on track
  const [remainingBudget, setRemainingBudget] = useState(goldenPathTarget); // shrinks faster than 1-per-question when you get lost
  const [isOnGoldenPath, setIsOnGoldenPath] = useState(true);
  const [consecutiveBranchCorrect, setConsecutiveBranchCorrect] = useState(0);
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [history, setHistory] = useState<AnswerRecord[]>([]);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    if (showFeedback) return;
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
    const isCorrect = selected === currentQuestion.correctAnswer;
    const points = pointsFor(isCorrect, isOnGoldenPath);
    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedOption: selected,
      isCorrect,
      isOnGoldenPath,
      pointsEarned: points,
    };

    setShowFeedback(true);
    await recordAnswer(session.id, currentQuestion.id, selected, isCorrect, isOnGoldenPath, points);
    const newHistory = [...history, record];
    setHistory(newHistory);

    setTimeout(async () => {
      let nextId: string | 'SELESAI';
      let nextIsOnGolden = isOnGoldenPath;
      let nextConsecutive = consecutiveBranchCorrect;
      let nextPointer = arrayPointer;
      let nextBudget = remainingBudget;

      if (isOnGoldenPath) {
        // Every golden question consumes 1 slot just by being asked. A WRONG
        // answer burns extra slots on top — that's the "jatah berkurang"
        // penalty instead of granting bonus remedial scoring chances.
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
        } else {
          if (budgetExhausted) {
            // No budget left to even attempt remediation — exam ends here.
            nextId = 'SELESAI';
          } else {
            nextIsOnGolden = false;
            nextId = graph.wrongAnswerTarget[currentQuestion.id]?.[selected] ?? graph.branchPool[0];
          }
        }
      } else {
        // Branch/remedial mode — doesn't touch the budget further; recovering
        // just returns you to wherever the golden path pointer already is.
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
      setShowFeedback(false);

      if (nextId === 'SELESAI') {
        await finishExam(newHistory);
      } else {
        setCurrentId(nextId);
      }
    }, 1400);
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

  const progressPct = Math.min(100, ((goldenPathTarget - Math.max(remainingBudget, 0)) / goldenPathTarget) * 100);

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-5">
      <div className="flex items-center justify-between text-xs text-stone-400">
        <span>{isOnGoldenPath ? `Sisa jatah jalur utama: ${Math.max(remainingBudget, 0)}` : 'Soal Remedial'}</span>
        <span>Skor sementara: {totalScore}</span>
      </div>
      <div className="w-full bg-stone-100 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full transition-all ${isOnGoldenPath ? 'bg-emerald-600' : 'bg-amber-500'}`}
          style={{ width: `${progressPct}%` }} />
      </div>

      {!isOnGoldenPath && (
        <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">
          Kamu sedang di jalur remedial. Jawab benar {RECOVERY_STREAK_NEEDED - consecutiveBranchCorrect}x lagi berturut-turut untuk kembali — tapi jatah jalur utamamu sudah berkurang karena tadi salah.
        </p>
      )}

      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
        {currentQuestion.imageUrl && (
          <img src={currentQuestion.imageUrl} alt="Ilustrasi soal" className="rounded-xl max-h-64 w-full object-contain bg-stone-50" />
        )}
        <p className="text-stone-900 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: renderRichContent(currentQuestion.question) }} />

        <div className="space-y-2">
          {currentQuestion.options.map((opt) => {
            const isSelected = selected === opt.key;
            const selectionIsCorrect = selected === currentQuestion.correctAnswer;
            let style = 'border-stone-200 hover:border-emerald-300';
            if (showFeedback) {
              if (isSelected) style = selectionIsCorrect ? 'border-emerald-400 bg-emerald-50' : 'border-rose-400 bg-rose-50';
            } else if (isSelected) {
              style = 'border-emerald-500 bg-emerald-50';
            }
            return (
              <button key={opt.key} onClick={() => handleSelect(opt.key)} disabled={showFeedback}
                className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border text-sm transition-all ${style}`}>
                <span className="font-bold text-stone-500 w-5">{opt.key}</span>
                <span className="flex-1 text-stone-800">{opt.text}</span>
                {showFeedback && isSelected && (selectionIsCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-500 shrink-0" />)}
              </button>
            );
          })}
        </div>

        {!showFeedback && (
          <button onClick={handleConfirm} disabled={!selected}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-semibold py-2.5 rounded-xl transition-colors">
            Jawab
          </button>
        )}
      </div>
    </div>
  );
};
