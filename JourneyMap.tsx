import React, { useMemo } from 'react';
import { Flag, MapPin, Compass, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  stepNumber: number;
  correct: boolean;
}

interface StepNode {
  stepNumber: number;
  correct: boolean;
  detours: DetourNode[];
}

function buildSteps(history: AnswerRecord[]): StepNode[] {
  const steps: StepNode[] = [];
  let currentGlobalStep = 0;

  for (const h of history) {
    currentGlobalStep++;
    if (h.isOnGoldenPath) {
      steps.push({
        stepNumber: currentGlobalStep,
        correct: h.isCorrect,
        detours: [],
      });
    } else if (steps.length > 0) {
      steps[steps.length - 1].detours.push({
        stepNumber: currentGlobalStep,
        correct: h.isCorrect,
      });
    } else {
      // Edge case: started on branch
      steps.push({
        stepNumber: currentGlobalStep,
        correct: h.isCorrect,
        detours: [],
      });
    }
  }
  return steps;
}

const MAIN_Y = 60;
const DETOUR_Y = 145;
const STEP_GAP = 72;
const DETOUR_NODE_GAP = 32;
const MAIN_R = 15;
const DETOUR_R = 13;
const PAD_LEFT = 44;
const PAD_RIGHT = 80;

export const JourneyMap: React.FC<Props> = ({ history, goldenPathTarget }) => {
  const steps = useMemo(() => buildSteps(history), [history]);
  const lostSteps = useMemo(() => steps.filter((s) => !s.correct), [steps]);
  const lostCount = lostSteps.length;
  const totalDetours = useMemo(() => steps.reduce((sum, s) => sum + s.detours.length, 0), [steps]);
  const totalStepsAnswered = history.length;

  const positions = useMemo(() => {
    let x = PAD_LEFT;
    return steps.map((s) => {
      const thisX = x;
      const detourSpan = s.detours.length > 0 ? Math.max((s.detours.length - 1) * DETOUR_NODE_GAP + 48, 48) : 0;
      x += STEP_GAP + detourSpan;
      return { x: thisX, step: s, detourSpan };
    });
  }, [steps]);

  const svgWidth = Math.max(360, (positions[positions.length - 1]?.x ?? PAD_LEFT) + PAD_RIGHT);
  const svgHeight = DETOUR_Y + 45;

  return (
    <div className="space-y-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-emerald-700" /> Peta Perjalanan Langkah Siswa
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Jalur Utama (Benar)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Titik Tersesat
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Jalur Cabang
          </span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="overflow-x-auto bg-stone-50/80 border border-stone-200 rounded-xl p-3 shadow-inner">
        <svg width={svgWidth} height={svgHeight} className="block">
          {/* Base golden-path lines */}
          {positions.length > 1 &&
            positions.slice(0, -1).map((p, i) => (
              <line
                key={`line-${i}`}
                x1={p.x}
                y1={MAIN_Y}
                x2={p.step.detours.length > 0 ? p.x : positions[i + 1].x}
                y2={MAIN_Y}
                stroke={p.step.correct ? '#10b981' : '#f87171'}
                strokeWidth={3}
              />
            ))}

          {/* Line from last node to the finish flag */}
          {positions.length > 0 && (
            <line
              x1={
                positions[positions.length - 1].step.detours.length > 0
                  ? positions[positions.length - 1].x + positions[positions.length - 1].detourSpan
                  : positions[positions.length - 1].x
              }
              y1={MAIN_Y}
              x2={svgWidth - PAD_RIGHT + 28}
              y2={MAIN_Y}
              stroke="#10b981"
              strokeWidth={3}
            />
          )}

          {/* Branch / Detour Paths */}
          {positions.map((p, i) => {
            if (p.step.detours.length === 0) return null;
            const nextX = i < positions.length - 1 ? positions[i + 1].x : p.x + p.detourSpan + STEP_GAP;
            const detourStartX = p.x + 28;

            return (
              <g key={`detour-${i}`}>
                {/* Dotted drop connector from main node to branch start */}
                <line
                  x1={p.x}
                  y1={MAIN_Y}
                  x2={detourStartX}
                  y2={DETOUR_Y}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                />

                {/* Detour nodes with continuous step numbers */}
                {p.step.detours.map((d, di) => {
                  const dx = detourStartX + di * DETOUR_NODE_GAP;
                  return (
                    <g key={di}>
                      {di > 0 && (
                        <line
                          x1={dx - DETOUR_NODE_GAP}
                          y1={DETOUR_Y}
                          x2={dx}
                          y2={DETOUR_Y}
                          stroke="#f59e0b"
                          strokeWidth={2}
                        />
                      )}
                      <circle
                        cx={dx}
                        cy={DETOUR_Y}
                        r={DETOUR_R}
                        fill={d.correct ? '#10b981' : '#f59e0b'}
                        stroke="white"
                        strokeWidth={1.5}
                      />
                      <text
                        x={dx}
                        y={DETOUR_Y + 4}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight={700}
                        fill="white"
                      >
                        {d.stepNumber}
                      </text>
                    </g>
                  );
                })}

                {/* Return path to next main step */}
                <line
                  x1={detourStartX + (p.step.detours.length - 1) * DETOUR_NODE_GAP}
                  y1={DETOUR_Y}
                  x2={nextX}
                  y2={MAIN_Y}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                />
              </g>
            );
          })}

          {/* Main Nodes */}
          {positions.map((p, i) => (
            <g key={`node-${i}`}>
              <circle
                cx={p.x}
                cy={MAIN_Y}
                r={MAIN_R}
                fill={p.step.correct ? '#10b981' : '#ef4444'}
                stroke="white"
                strokeWidth={2.5}
              />
              <text
                x={p.x}
                y={MAIN_Y + 4}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill="white"
              >
                {p.step.stepNumber}
              </text>
              {/* Optional indicator if tersesat */}
              {!p.step.correct && (
                <text
                  x={p.x}
                  y={MAIN_Y - 20}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={600}
                  fill="#e11d48"
                >
                  Tersesat
                </text>
              )}
            </g>
          ))}

          {/* Finish flag */}
          {positions.length > 0 && (
            <g>
              <circle
                cx={svgWidth - PAD_RIGHT + 35}
                cy={MAIN_Y}
                r={18}
                fill="#047857"
                stroke="white"
                strokeWidth={2}
              />
              <text
                x={svgWidth - PAD_RIGHT + 35}
                y={MAIN_Y + 5}
                textAnchor="middle"
                fontSize={13}
                fill="white"
              >
                🏁
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-stone-50 border border-stone-200/70 rounded-xl py-2.5 px-1">
          <p className="text-lg font-bold text-stone-800">{totalStepsAnswered}</p>
          <p className="text-[11px] text-stone-500">Total Langkah</p>
        </div>
        <div className="bg-stone-50 border border-stone-200/70 rounded-xl py-2.5 px-1">
          <p className="text-lg font-bold text-rose-600">{lostCount}</p>
          <p className="text-[11px] text-stone-500">Kali Tersesat</p>
        </div>
        <div className="bg-stone-50 border border-stone-200/70 rounded-xl py-2.5 px-1">
          <p className="text-lg font-bold text-amber-600">{totalDetours}</p>
          <p className="text-[11px] text-stone-500">Langkah di Jalur Cabang</p>
        </div>
      </div>

      {/* Detail Tersesat di Langkah Sekian */}
      {lostCount > 0 ? (
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800">
            <AlertCircle className="w-3.5 h-3.5" /> Kamu tersesat di langkah berikut:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {lostSteps.map((s) => (
              <span
                key={s.stepNumber}
                className="text-xs bg-white text-rose-700 border border-rose-200 font-semibold px-2.5 py-0.5 rounded-full"
              >
                Langkah {s.stepNumber}
                {s.detours.length > 0 && (
                  <span className="text-stone-400 font-normal ml-1">
                    (melalui langkah {s.detours.map((d) => d.stepNumber).join(', ')})
                  </span>
                )}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-stone-600 italic">
            "Setiap pilihan jawabanmu menentukan takdir langkah berikutnya. Pilihan yang keliru membawamu ke jalur cabang pengembaraan untuk mencari jalan kembali."
          </p>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Alhamdulillah! Kamu menempuh rute lurus di jalur utama dari awal sampai akhir tanpa tersesat sekali pun.</span>
        </div>
      )}
    </div>
  );
};
