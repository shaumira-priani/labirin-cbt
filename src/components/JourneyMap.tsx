import React, { useMemo } from 'react';
import { Flag, MapPin } from 'lucide-react';

export interface AnswerRecord {
  questionId: string;
  isCorrect: boolean;
  isOnGoldenPath: boolean;
  pointsEarned: number;
}

interface Props {
  history: AnswerRecord[];
  goldenPathTarget: number;
}

interface DetourNode {
  correct: boolean;
}

interface StepNode {
  stepNumber: number;
  correct: boolean;
  detours: DetourNode[];
}

function buildSteps(history: AnswerRecord[]): StepNode[] {
  const steps: StepNode[] = [];
  let stepNumber = 0;

  for (const h of history) {
    if (h.isOnGoldenPath) {
      stepNumber++;
      steps.push({ stepNumber, correct: h.isCorrect, detours: [] });
    } else if (steps.length > 0) {
      steps[steps.length - 1].detours.push({ correct: h.isCorrect });
    }
  }
  return steps;
}

const MAIN_Y = 60;
const DETOUR_Y = 140;
const STEP_GAP = 64;
const DETOUR_NODE_GAP = 22;
const MAIN_R = 15;
const DETOUR_R = 7;
const PAD_LEFT = 40;
const PAD_RIGHT = 70;

export const JourneyMap: React.FC<Props> = ({ history, goldenPathTarget }) => {
  const steps = useMemo(() => buildSteps(history), [history]);
  const lostCount = steps.filter((s) => !s.correct).length;
  const totalDetours = steps.reduce((sum, s) => sum + s.detours.length, 0);
  const shortfall = goldenPathTarget - steps.length;

  const positions = useMemo(() => {
    let x = PAD_LEFT;
    return steps.map((s) => {
      const thisX = x;
      const detourSpan = s.detours.length > 0 ? Math.max((s.detours.length - 1) * DETOUR_NODE_GAP + 40, 40) : 0;
      x += STEP_GAP + detourSpan;
      return { x: thisX, step: s, detourSpan };
    });
  }, [steps]);

  const svgWidth = (positions[positions.length - 1]?.x ?? PAD_LEFT) + PAD_RIGHT;
  const svgHeight = DETOUR_Y + 40;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-700" /> Peta Jalur Labirin
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-stone-500">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Jalur Utama Benar</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" /> Salah</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Remedial</span>
        </div>
      </div>

      <div className="overflow-x-auto bg-stone-50 border border-stone-200 rounded-xl p-2">
        <svg width={svgWidth} height={svgHeight} className="block">
          {/* Base golden-path line */}
          {positions.length > 1 &&
            positions.slice(0, -1).map((p, i) => (
              <line
                key={`line-${i}`}
                x1={p.x} y1={MAIN_Y}
                x2={p.step.detours.length > 0 ? p.x : positions[i + 1].x}
                y2={MAIN_Y}
                stroke={p.step.correct ? '#6ee7b7' : '#fca5a5'}
                strokeWidth={3}
              />
            ))}
          {/* Line from last main node to the finish flag */}
          {positions.length > 0 && (
            <line
              x1={positions[positions.length - 1].step.detours.length > 0 ? positions[positions.length - 1].x + positions[positions.length - 1].detourSpan : positions[positions.length - 1].x}
              y1={MAIN_Y}
              x2={svgWidth - PAD_RIGHT + 20}
              y2={MAIN_Y}
              stroke="#6ee7b7"
              strokeWidth={3}
            />
          )}

          {/* Detour dips */}
          {positions.map((p, i) => {
            if (p.step.detours.length === 0) return null;
            const nextX = i < positions.length - 1 ? positions[i + 1].x : p.x + p.detourSpan + STEP_GAP;
            const detourStartX = p.x + 24;
            return (
              <g key={`detour-${i}`}>
                <line x1={p.x} y1={MAIN_Y} x2={detourStartX} y2={DETOUR_Y} stroke="#fbbf24" strokeWidth={2} strokeDasharray="4 3" />
                {p.step.detours.map((d, di) => {
                  const dx = detourStartX + di * DETOUR_NODE_GAP;
                  return (
                    <g key={di}>
                      {di > 0 && (
                        <line x1={dx - DETOUR_NODE_GAP} y1={DETOUR_Y} x2={dx} y2={DETOUR_Y} stroke="#fbbf24" strokeWidth={2} />
                      )}
                      <circle cx={dx} cy={DETOUR_Y} r={DETOUR_R} fill={d.correct ? '#34d399' : '#f87171'} />
                    </g>
                  );
                })}
                <line
                  x1={detourStartX + (p.step.detours.length - 1) * DETOUR_NODE_GAP}
                  y1={DETOUR_Y}
                  x2={nextX}
                  y2={MAIN_Y}
                  stroke="#fbbf24" strokeWidth={2} strokeDasharray="4 3"
                />
              </g>
            );
          })}

          {/* Main golden-path nodes */}
          {positions.map((p, i) => (
            <g key={`node-${i}`}>
              <circle cx={p.x} cy={MAIN_Y} r={MAIN_R} fill={p.step.correct ? '#10b981' : '#f87171'} stroke="white" strokeWidth={2} />
              <text x={p.x} y={MAIN_Y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="white">
                {p.step.stepNumber}
              </text>
            </g>
          ))}

          {/* Finish flag */}
          {positions.length > 0 && (
            <g>
              <circle cx={svgWidth - PAD_RIGHT + 30} cy={MAIN_Y} r={18} fill="#047857" stroke="white" strokeWidth={2} />
              <text x={svgWidth - PAD_RIGHT + 30} y={MAIN_Y + 5} textAnchor="middle" fontSize={13} fill="white">🏁</text>
            </g>
          )}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-stone-50 rounded-lg py-2">
          <p className="text-lg font-bold text-stone-800">{steps.length}</p>
          <p className="text-[11px] text-stone-500">Soal Jalur Utama Ditempuh</p>
        </div>
        <div className="bg-stone-50 rounded-lg py-2">
          <p className="text-lg font-bold text-rose-500">{lostCount}</p>
          <p className="text-[11px] text-stone-500">Kali Tersesat</p>
        </div>
        <div className="bg-stone-50 rounded-lg py-2">
          <p className="text-lg font-bold text-amber-600">{totalDetours}</p>
          <p className="text-[11px] text-stone-500">Soal Remedial Dijalani</p>
        </div>
      </div>

      {shortfall > 0 && (
        <p className="text-xs text-stone-500 bg-stone-50 border border-stone-100 rounded-lg px-3 py-2">
          Total jatah pengerjaanmu <strong>{goldenPathTarget} soal</strong> (gabungan jalur utama + remedial). Karena tersesat {lostCount}x, sebagian jatahmu kepakai untuk remedial, jadi cuma sempat menempuh <strong>{steps.length}</strong> soal jalur utama.
        </p>
      )}

      {lostCount === 0 && (
        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
          <Flag className="w-3.5 h-3.5" /> Kamu jalan lurus tanpa tersesat sekali pun. Mantap!
        </p>
      )}
    </div>
  );
};
