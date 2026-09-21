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

interface Node {
  step: number; // continuous 1..N across the WHOLE journey, golden or branch
  x: number;
  y: number;
  correct: boolean;
  isOnGoldenPath: boolean;
}

const MAIN_Y = 50;
const BRANCH_Y = 120;
const STEP_GAP = 52;
const NODE_R = 15;
const PAD_LEFT = 36;
const PAD_RIGHT = 60;

export const JourneyMap: React.FC<Props> = ({ history, goldenPathTarget }) => {
  const nodes: Node[] = useMemo(
    () =>
      history.map((h, i) => ({
        step: i + 1,
        x: PAD_LEFT + i * STEP_GAP,
        y: h.isOnGoldenPath ? MAIN_Y : BRANCH_Y,
        correct: h.isCorrect,
        isOnGoldenPath: h.isOnGoldenPath,
      })),
    [history]
  );

  const goldenStepsTaken = history.filter((h) => h.isOnGoldenPath).length;
  const lostMoments = history.filter((h) => h.isOnGoldenPath && !h.isCorrect).length;
  const branchSteps = history.length - goldenStepsTaken;
  const lostAtSteps = nodes.filter((n) => n.isOnGoldenPath && !n.correct).map((n) => n.step);
  const shortfall = goldenPathTarget - goldenStepsTaken;

  const svgWidth = (nodes[nodes.length - 1]?.x ?? PAD_LEFT) + PAD_RIGHT + 40;
  const svgHeight = BRANCH_Y + 40;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-700" /> Peta Jalur Labirin
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-stone-500">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Benar</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" /> Tersesat</span>
        </div>
      </div>

      <div className="overflow-x-auto bg-stone-50 border border-stone-200 rounded-xl p-2">
        <svg width={svgWidth} height={svgHeight} className="block">
          {nodes.slice(0, -1).map((n, i) => (
            <line
              key={`line-${i}`}
              x1={n.x} y1={n.y}
              x2={nodes[i + 1].x} y2={nodes[i + 1].y}
              stroke={n.correct ? '#6ee7b7' : '#fca5a5'}
              strokeWidth={3}
            />
          ))}
          {nodes.length > 0 && (
            <line
              x1={nodes[nodes.length - 1].x} y1={nodes[nodes.length - 1].y}
              x2={svgWidth - PAD_RIGHT + 20} y2={MAIN_Y}
              stroke="#6ee7b7" strokeWidth={3}
            />
          )}

          {nodes.map((n) => (
            <g key={n.step}>
              <circle cx={n.x} cy={n.y} r={NODE_R} fill={n.correct ? '#10b981' : '#f87171'} stroke="white" strokeWidth={2} />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="white">
                {n.step}
              </text>
            </g>
          ))}

          {nodes.length > 0 && (
            <g>
              <circle cx={svgWidth - PAD_RIGHT + 30} cy={MAIN_Y} r={18} fill="#047857" stroke="white" strokeWidth={2} />
              <text x={svgWidth - PAD_RIGHT + 30} y={MAIN_Y + 5} textAnchor="middle" fontSize={13} fill="white">🏁</text>
            </g>
          )}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-stone-50 rounded-lg py-2">
          <p className="text-lg font-bold text-stone-800">{history.length}</p>
          <p className="text-[11px] text-stone-500">Total Langkah</p>
        </div>
        <div className="bg-stone-50 rounded-lg py-2">
          <p className="text-lg font-bold text-rose-500">{lostMoments}</p>
          <p className="text-[11px] text-stone-500">Kali Tersesat</p>
        </div>
        <div className="bg-stone-50 rounded-lg py-2">
          <p className="text-lg font-bold text-amber-600">{branchSteps}</p>
          <p className="text-[11px] text-stone-500">Langkah di Jalur Cabang</p>
        </div>
      </div>

      {shortfall > 0 && (
        <p className="text-xs text-stone-500 bg-stone-50 border border-stone-100 rounded-lg px-3 py-2">
          Setiap pilihan menentukan langkah berikutnya. Target Golden Path ada <strong>{goldenPathTarget}</strong> langkah, tapi karena tersesat {lostMoments}x, kamu cuma sempat menempuh <strong>{goldenStepsTaken}</strong> langkah di jalur itu — sisanya jadi langkah di jalur cabang.
        </p>
      )}

      {lostAtSteps.length > 0 ? (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-stone-600">Kamu tersesat di langkah ke-:</p>
          <div className="flex flex-wrap gap-1.5">
            {lostAtSteps.map((s) => (
              <span key={s} className="text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-2.5 py-1">
                Langkah #{s}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
          <Flag className="w-3.5 h-3.5" /> Setiap pilihanmu tepat — kamu jalan lurus tanpa tersesat sekali pun.
        </p>
      )}
    </div>
  );
};
