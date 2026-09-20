import React, { useMemo } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Flag } from 'lucide-react';

export interface AnswerRecord {
  questionId: string;
  isCorrect: boolean;
  isOnGoldenPath: boolean;
  pointsEarned: number;
}

interface Props {
  history: AnswerRecord[];
  /** The teacher's target golden-path length before any penalties shrank it. */
  goldenPathTarget: number;
}

interface GoldenStep {
  stepNumber: number;
  correct: boolean;
  detourAttempts: number;
  detourCorrectCount: number;
}

function buildSteps(history: AnswerRecord[]): GoldenStep[] {
  const steps: GoldenStep[] = [];
  let stepNumber = 0;
  let pendingDetourAttempts = 0;
  let pendingDetourCorrect = 0;

  for (const h of history) {
    if (h.isOnGoldenPath) {
      if (steps.length > 0 && !steps[steps.length - 1].correct && steps[steps.length - 1].detourAttempts === 0 && pendingDetourAttempts > 0) {
        steps[steps.length - 1].detourAttempts = pendingDetourAttempts;
        steps[steps.length - 1].detourCorrectCount = pendingDetourCorrect;
      }
      pendingDetourAttempts = 0;
      pendingDetourCorrect = 0;
      stepNumber++;
      steps.push({ stepNumber, correct: h.isCorrect, detourAttempts: 0, detourCorrectCount: 0 });
    } else {
      pendingDetourAttempts++;
      if (h.isCorrect) pendingDetourCorrect++;
    }
  }
  if (steps.length > 0 && !steps[steps.length - 1].correct && pendingDetourAttempts > 0) {
    steps[steps.length - 1].detourAttempts = pendingDetourAttempts;
    steps[steps.length - 1].detourCorrectCount = pendingDetourCorrect;
  }

  return steps;
}

export const JourneySummary: React.FC<Props> = ({ history, goldenPathTarget }) => {
  const steps = useMemo(() => buildSteps(history), [history]);
  const lostSteps = steps.filter((s) => !s.correct);
  const totalDetourQuestions = history.filter((h) => !h.isOnGoldenPath).length;
  const shortfall = goldenPathTarget - steps.length;

  return (
    <div className="text-left space-y-4">
      <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
        <RotateCcw className="w-4 h-4 text-emerald-700" /> Jejak Perjalananmu di Labirin
      </h3>

      <div className="overflow-x-auto pb-2">
        <div className="flex items-center min-w-max px-1">
          {steps.map((s, i) => (
            <React.Fragment key={s.stepNumber}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${s.correct ? 'bg-emerald-500' : 'bg-rose-400'}`}>
                  {s.stepNumber}
                </div>
                {!s.correct && s.detourAttempts > 0 && (
                  <span className="text-[10px] text-amber-600 whitespace-nowrap">+{s.detourAttempts} remedial</span>
                )}
              </div>
              {i < steps.length - 1 && <div className={`w-6 h-0.5 ${s.correct ? 'bg-emerald-300' : 'bg-amber-300'}`} />}
            </React.Fragment>
          ))}
          <div className="w-6 h-0.5 bg-emerald-300" />
          <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center">
            <Flag className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-stone-50 rounded-lg py-2">
          <p className="text-lg font-bold text-stone-800">{steps.length}</p>
          <p className="text-[11px] text-stone-500">Soal Jalur Utama Ditempuh</p>
        </div>
        <div className="bg-stone-50 rounded-lg py-2">
          <p className="text-lg font-bold text-rose-500">{lostSteps.length}</p>
          <p className="text-[11px] text-stone-500">Kali Tersesat</p>
        </div>
        <div className="bg-stone-50 rounded-lg py-2">
          <p className="text-lg font-bold text-amber-600">{totalDetourQuestions}</p>
          <p className="text-[11px] text-stone-500">Soal Remedial Dijalani</p>
        </div>
      </div>

      {shortfall > 0 && (
        <p className="text-xs text-stone-500 bg-stone-50 border border-stone-100 rounded-lg px-3 py-2">
          Target awal jalur utama ada <strong>{goldenPathTarget}</strong> soal, tapi karena tersesat {lostSteps.length}x, jatahmu berkurang jadi cuma sempat menempuh <strong>{steps.length}</strong> soal jalur utama. Makin jarang tersesat, makin banyak soal jalur utama yang bisa dikerjakan (dan makin tinggi skor maksimalnya).
        </p>
      )}

      {lostSteps.length > 0 ? (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-stone-600">Tersesat di soal urutan jalur utama ke-:</p>
          <div className="flex flex-wrap gap-1.5">
            {lostSteps.map((s) => (
              <span key={s.stepNumber} className="text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-2.5 py-1 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> #{s.stepNumber} (+{s.detourAttempts} remedial)
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Kamu jalan lurus tanpa tersesat sekali pun. Mantap!
        </p>
      )}
    </div>
  );
};
