import React, { useMemo } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Flag, Compass } from 'lucide-react';

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

interface StepItem {
  stepNumber: number;
  isCorrect: boolean;
  isOnGoldenPath: boolean;
}

export const JourneySummary: React.FC<Props> = ({ history, goldenPathTarget }) => {
  const stepItems: StepItem[] = useMemo(() => {
    return history.map((h, i) => ({
      stepNumber: i + 1,
      isCorrect: h.isCorrect,
      isOnGoldenPath: h.isOnGoldenPath,
    }));
  }, [history]);

  const lostSteps = useMemo(
    () => stepItems.filter((s) => s.isOnGoldenPath && !s.isCorrect),
    [stepItems]
  );
  const totalDetourSteps = useMemo(
    () => stepItems.filter((s) => !s.isOnGoldenPath).length,
    [stepItems]
  );
  const mainStepsAnswered = useMemo(
    () => stepItems.filter((s) => s.isOnGoldenPath).length,
    [stepItems]
  );

  return (
    <div className="text-left space-y-4">
      <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
        <Compass className="w-4 h-4 text-emerald-700" /> Ringkasan Perjalanan Langkah
      </h3>

      {/* Horizontal Step sequence */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center min-w-max px-1">
          {stepItems.map((s, i) => {
            let bgColor = 'bg-emerald-500';
            if (!s.isCorrect && s.isOnGoldenPath) bgColor = 'bg-rose-500';
            else if (!s.isOnGoldenPath) bgColor = 'bg-amber-500';

            return (
              <React.Fragment key={s.stepNumber}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs ${bgColor}`}
                    title={
                      !s.isOnGoldenPath
                        ? `Langkah ${s.stepNumber} (Jalur Cabang)`
                        : s.isCorrect
                        ? `Langkah ${s.stepNumber} (Jalur Utama - Benar)`
                        : `Langkah ${s.stepNumber} (Tersesat - Salah)`
                    }
                  >
                    {s.stepNumber}
                  </div>
                  {!s.isOnGoldenPath && (
                    <span className="text-[9px] text-amber-700 font-medium">cabang</span>
                  )}
                  {s.isOnGoldenPath && !s.isCorrect && (
                    <span className="text-[9px] text-rose-600 font-semibold">tersesat</span>
                  )}
                </div>
                {i < stepItems.length - 1 && (
                  <div
                    className={`w-5 h-0.5 ${
                      !s.isCorrect && s.isOnGoldenPath
                        ? 'bg-rose-300'
                        : !s.isOnGoldenPath
                        ? 'bg-amber-300'
                        : 'bg-emerald-300'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
          <div className="w-5 h-0.5 bg-emerald-300" />
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <Flag className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-stone-50 border border-stone-200/70 rounded-xl py-2 px-1">
          <p className="text-lg font-bold text-stone-800">{stepItems.length}</p>
          <p className="text-[11px] text-stone-500">Total Langkah</p>
        </div>
        <div className="bg-stone-50 border border-stone-200/70 rounded-xl py-2 px-1">
          <p className="text-lg font-bold text-rose-600">{lostSteps.length}</p>
          <p className="text-[11px] text-stone-500">Kali Tersesat</p>
        </div>
        <div className="bg-stone-50 border border-stone-200/70 rounded-xl py-2 px-1">
          <p className="text-lg font-bold text-amber-600">{totalDetourSteps}</p>
          <p className="text-[11px] text-stone-500">Langkah Jalur Cabang</p>
        </div>
      </div>

      {lostSteps.length > 0 ? (
        <div className="space-y-1.5 bg-rose-50/60 border border-rose-200 rounded-xl p-3">
          <p className="text-xs font-semibold text-rose-900 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Kamu tersesat di langkah:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {lostSteps.map((s) => (
              <span
                key={s.stepNumber}
                className="text-xs bg-white text-rose-700 border border-rose-200 font-semibold px-2.5 py-0.5 rounded-full"
              >
                Langkah {s.stepNumber}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-stone-600 pt-1 italic">
            "Pilihan jawaban pada langkah tersebut membawamu menjelajahi jalur cabang sebelum kembali ke jalur utama."
          </p>
        </div>
      ) : (
        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Kamu jalan lurus tanpa tersesat sekali pun. Mantap!
        </p>
      )}
    </div>
  );
};
