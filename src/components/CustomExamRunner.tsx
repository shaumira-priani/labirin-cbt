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
  onFinished: (finalScore: number) => void;
}

interface AnswerRecord {
  questionId: string;
  selectedOption: OptionKey;
  isCorrect: boolean;
  isOnGoldenPath: boolean;
  pointsEarned: number;
}

export const CustomExamRunner: React.FC<Props> = ({ exam, questions, session, onFinished }) => {
  const graph = exam.mazeGraph!;
  const questionsById = useMemo(() => Object.fromEntries(questions.map((q) => [q.id, q])), [questions]);

  const [currentId, setCurrentId] = useState<string>(graph.goldenPath[0]);
  const [goldenIndex, setGoldenIndex] = useState(0); // index we're AT or PENDING RETURN TO
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

  const handleConfirm = async () => {
    if (!selected || !currentQuestion) return;
    const isCorrect = selected === currentQuestion.correctAnswer;
    const points = pointsFor(isCorrect, isOnGoldenPath);

    setShowFeedback(true);
    await recordAnswer(session.id, currentQuestion.id, selected, isCorrect, isOnGoldenPath, points);
    setHistory((prev) => [...prev, { questionId: currentQuestion.id, selectedOption: selected, isCorrect, isOnGoldenPath, pointsEarned: points }]);

    // Determine next state after a short pause so the student sees feedback
    setTimeout(async () => {
      let nextId: string | 'SELESAI';
      let nextGoldenIndex = goldenIndex;
      let nextIsOnGolden = isOnGoldenPath;
      let nextConsecutive = consecutiveBranchCorrect;

      if (isOnGoldenPath) {
        if (isCorrect) {
          nextGoldenIndex = goldenIndex + 1;
          nextId = nextGoldenIndex < graph.goldenPath.length ? graph.goldenPath[nextGoldenIndex] : 'SELESAI';
          nextIsOnGolden = true;
          nextConsecutive = 0;
        } else {
          nextGoldenIndex = goldenIndex + 1; // remember where to return once recovered
          nextId = graph.wrongAnswerTarget[currentQuestion.id]?.[selected] ?? graph.branchPool[0];
          nextIsOnGolden = false;
          nextConsecutive = 0;
        }
      } else {
        if (isCorrect) {
          nextConsecutive = consecutiveBranchCorrect + 1;
          if (nextConsecutive >= 2) {
            nextIsOnGolden = true;
            nextId = goldenIndex < graph.goldenPath.length ? graph.goldenPath[goldenIndex] : 'SELESAI';
            nextConsecutive = 0;
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

      setGoldenIndex(nextGoldenIndex);
      setIsOnGoldenPath(nextIsOnGolden);
      setConsecutiveBranchCorrect(nextConsecutive);
      setSelected(null);
      setShowFeedback(false);

      if (nextId === 'SELESAI') {
        setFinished(true);
        setSubmitting(true);
        const finalScore = totalScore + points;
        await submitSession(session.id, finalScore);
        setSubmitting(false);
        onFinished(finalScore);
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
          <JourneySummary history={history} goldenPathLength={graph.goldenPath.length} />
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <p className="text-center py-16 text-rose-600 text-sm">Soal tidak ditemukan (ID: {currentId}). Hubungi Guru Pengawas.</p>;
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-5">
      <div className="flex items-center justify-between text-xs text-stone-400">
        <span>{isOnGoldenPath ? `Langkah ${goldenIndex + 1} dari ${graph.goldenPath.length}` : 'Soal Remedial'}</span>
        <span>Skor sementara: {totalScore}</span>
      </div>
      <div className="w-full bg-stone-100 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full transition-all ${isOnGoldenPath ? 'bg-emerald-600' : 'bg-amber-500'}`}
          style={{ width: `${((goldenIndex) / graph.goldenPath.length) * 100}%` }} />
      </div>

      {!isOnGoldenPath && (
        <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">
          Kamu sedang di jalur remedial. Jawab benar {2 - consecutiveBranchCorrect}x lagi berturut-turut untuk kembali ke jalur utama.
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
