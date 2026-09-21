import React from 'react';
import { StepAnswer, Language } from '../types/exam';
import { Compass, Flag, CheckCircle2, AlertTriangle, Sparkles, Navigation, MapPin } from 'lucide-react';

interface VisualMapComparisonProps {
  history: StepAnswer[];
  isPerfect: boolean;
  language?: Language;
}

interface TrajectoryPoint {
  step: number; // 0 for start, 1..totalSteps
  x: number;
  y: number;
  isOnGoldenPath: boolean;
  actionType: 'start' | 'golden' | 'diverge' | 'branch' | 'recover' | 'finish';
  questionId?: number;
  isCorrect?: boolean;
  pointsEarned?: number;
  label?: string;
}

export const VisualMapComparison: React.FC<VisualMapComparisonProps> = ({
  history,
  isPerfect,
  language = 'id'
}) => {
  const isEn = language === 'en';
  const totalSteps = history.length || 20;
  const startX = 60;
  const endX = 740;
  const goldenY = 110;
  const branchY = 240;

  // Build the accurate step-by-step trajectory
  const trajectoryPoints: TrajectoryPoint[] = [];
  
  // Initial Start Node
  trajectoryPoints.push({
    step: 0,
    x: startX,
    y: goldenY,
    isOnGoldenPath: true,
    actionType: 'start',
    label: isEn ? 'Start' : 'Mulai'
  });

  let currentIsOnGolden = true;
  let consecutiveBranchCorrect = 0;
  let hasEverDiverged = false;
  let hasEverRecovered = false;

  for (let i = 0; i < history.length; i++) {
    const stepAnswer = history[i];
    const stepNum = i + 1;
    const x = startX + (stepNum / totalSteps) * (endX - startX);

    let nextIsOnGolden = currentIsOnGolden;
    let pointAction: TrajectoryPoint['actionType'] = 'golden';

    if (currentIsOnGolden) {
      if (stepAnswer.isCorrect) {
        nextIsOnGolden = true;
        pointAction = 'golden';
      } else {
        nextIsOnGolden = false;
        consecutiveBranchCorrect = 0;
        pointAction = 'diverge';
        hasEverDiverged = true;
      }
    } else {
      // In branch
      if (stepAnswer.isCorrect) {
        consecutiveBranchCorrect += 1;
        if (consecutiveBranchCorrect >= 2) {
          nextIsOnGolden = true;
          consecutiveBranchCorrect = 0;
          pointAction = 'recover';
          hasEverRecovered = true;
        } else {
          nextIsOnGolden = false;
          pointAction = 'branch';
        }
      } else {
        consecutiveBranchCorrect = 0;
        nextIsOnGolden = false;
        pointAction = 'branch';
      }
    }

    const y = nextIsOnGolden ? goldenY : branchY;
    currentIsOnGolden = nextIsOnGolden;

    trajectoryPoints.push({
      step: stepNum,
      x,
      y,
      isOnGoldenPath: nextIsOnGolden,
      actionType: pointAction,
      questionId: stepAnswer.questionId,
      isCorrect: stepAnswer.isCorrect,
      pointsEarned: stepAnswer.pointsEarned,
      label: isEn ? `Q${stepNum}` : `Soal ${stepNum}`
    });
  }

  const finalPoint = trajectoryPoints[trajectoryPoints.length - 1];
  const reachedDestination = finalPoint.y === goldenY;
  const correctCount = history.filter((h) => h.isCorrect).length;

  // Build SVG path string with smooth lines between points
  let pathD = `M ${trajectoryPoints[0].x} ${trajectoryPoints[0].y}`;
  for (let i = 1; i < trajectoryPoints.length; i++) {
    const prev = trajectoryPoints[i - 1];
    const curr = trajectoryPoints[i];
    const dx = curr.x - prev.x;
    
    if (prev.y === curr.y) {
      pathD += ` L ${curr.x} ${curr.y}`;
    } else {
      const cp1x = prev.x + dx * 0.5;
      const cp1y = prev.y;
      const cp2x = prev.x + dx * 0.5;
      const cp2y = curr.y;
      pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
  }

  // Identify divergence and recovery nodes
  const divergenceNodes = trajectoryPoints.filter((p) => p.actionType === 'diverge');
  const recoveryNodes = trajectoryPoints.filter((p) => p.actionType === 'recover');

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
              {isEn ? 'Visual Route Map: Track & Final Destination' : 'Peta Visual: Rekonstruksi Lintasan & Titik Akhir'}
            </h2>
            <p className="text-xs text-stone-500">
              {isEn 
                ? 'Simplified schematic showing your exact path (Main Route ➔ Branch ➔ Recovery ➔ Finish)'
                : 'Skema titik dan garis lintasan pengerjaan (Jalur Utama ➔ Cabang ➔ Pemulihan ➔ Akhir)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {reachedDestination ? (
            hasEverDiverged ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {isEn ? 'Reached Main Goal (Recovered)' : 'Sampai di Titik Tujuan (Sempat Belok & Pulih)'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {isEn ? 'Reached Main Goal (Pure Route)' : 'Tepat di Titik Tujuan Asli (Jalur Murni)'}
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300 text-xs font-semibold rounded-full">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              {isEn ? 'Ended at Branch Post' : 'Berakhir di Pos Cabang'}
            </span>
          )}
        </div>
      </div>

      {/* Graphical Expedition SVG Map - Simplified Clean Diagram */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 text-white shadow-inner p-4 sm:p-6">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Map Header Overlay */}
        <div className="relative z-10 flex items-center justify-between text-xs text-stone-300 mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 font-mono">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span className="tracking-widest uppercase font-semibold text-stone-200 text-[11px]">
              {isEn ? 'BIODIVERSITY TRACK (GRADE X)' : 'LINTASAN BIODIVERSITAS (KELAS 10)'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> {isEn ? 'Main Route (2 pts)' : 'Jalur Utama (2 pt)'}
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> {isEn ? 'Branch (1 pt)' : 'Rute Cabang (1 pt)'}
            </span>
          </div>
        </div>

        {/* Map SVG Canvas */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[360px] min-h-[260px] flex items-center justify-center">
          <svg
            viewBox="0 0 800 340"
            className="w-full h-full select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="traveledGradK10" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#6EE7B7" />
              </linearGradient>
              <filter id="glowNodeK10" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* REFERENCE GUIDELINE 1: Golden Path Track (Top Green Dashed Line) */}
            <line
              x1={startX}
              y1={goldenY}
              x2={endX}
              y2={goldenY}
              stroke="#059669"
              strokeWidth="2"
              strokeDasharray="6 4"
              strokeOpacity="0.45"
            />
            <text x={startX + 10} y={goldenY - 16} fill="#6ee7b7" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold" letterSpacing="0.5">
              {isEn ? '─── MAIN ROUTE / GOLDEN PATH (+2 Pts / Question) ───' : '─── JALUR UTAMA / GOLDEN PATH (+2 Poin / Soal) ───'}
            </text>

            {/* REFERENCE GUIDELINE 2: Branch Track (Bottom Amber Dashed Line) */}
            <line
              x1={startX + 30}
              y1={branchY}
              x2={endX}
              y2={branchY}
              stroke="#d97706"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              strokeOpacity="0.4"
            />
            <text x={startX + 40} y={branchY + 22} fill="#fcd34d" fontSize="10" fontFamily="sans-serif" letterSpacing="0.5">
              {isEn ? '- - - ALTERNATIVE BRANCH ROUTE (+1 Pt / Question) - - -' : '- - - RUTE CABANG ALTERNATIF (+1 Poin / Soal) - - -'}
            </text>

            {/* STUDENT TRAVELED PATH (Continuous Line) */}
            <path
              d={pathD}
              stroke="url(#traveledGradK10)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* ALL INTERMEDIATE STEP POINTS (Dots along the path) */}
            {trajectoryPoints.map((pt, idx) => {
              if (idx === 0) return null; // Start node handled separately
              const isFinal = idx === trajectoryPoints.length - 1;
              const isCorrect = pt.isCorrect;

              return (
                <g key={`step-${idx}`} transform={`translate(${pt.x}, ${pt.y})`}>
                  {/* Step point circle */}
                  <circle
                    r={isFinal ? 8 : 5}
                    fill={isCorrect ? (pt.isOnGoldenPath ? '#10b981' : '#f59e0b') : '#ef4444'}
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                  {/* Step number label */}
                  <text
                    x="0"
                    y={pt.isOnGoldenPath ? -10 : 16}
                    textAnchor="middle"
                    fill={isCorrect ? '#cbd5e1' : '#fca5a5'}
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight={isFinal ? 'bold' : 'normal'}
                  >
                    #{pt.step}
                  </text>
                </g>
              );
            })}

            {/* START NODE */}
            <g transform={`translate(${startX}, ${goldenY})`}>
              <circle r="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
              <circle r="5" fill="#38bdf8" />
              <text x="0" y="24" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                {isEn ? 'Start' : 'Mulai'}
              </text>
            </g>

            {/* DIVERGENCE NODES (Branch off callouts) */}
            {divergenceNodes.map((node, idx) => (
              <g key={`div-${idx}`} transform={`translate(${node.x}, ${node.y})`}>
                <rect x="-45" y="10" width="90" height="18" rx="4" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
                <text x="0" y="22" textAnchor="middle" fill="#fef08a" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">
                  {isEn ? `⚠️ Turn at #${node.step}` : `⚠️ Belok di #${node.step}`}
                </text>
              </g>
            ))}

            {/* RECOVERY NODES (Return to Golden Path callouts) */}
            {recoveryNodes.map((node, idx) => (
              <g key={`rec-${idx}`} transform={`translate(${node.x}, ${node.y})`}>
                <rect x="-55" y="-32" width="110" height="18" rx="4" fill="#064e3b" stroke="#34d399" strokeWidth="1" />
                <text x="0" y="-20" textAnchor="middle" fill="#a7f3d0" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">
                  {isEn ? `✨ Recovered at #${node.step}` : `✨ Pulih di #${node.step}`}
                </text>
              </g>
            ))}

            {/* TARGET DESTINATION NODE (Golden Path Endpoint) */}
            <g transform={`translate(${endX}, ${goldenY})`}>
              {reachedDestination && (
                <circle r="22" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
              )}
              <circle r="15" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" filter="url(#glowNodeK10)" />
              <circle r="6" fill="#34d399" />
              <rect x="-70" y="-46" width="140" height="24" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1.2" />
              <text x="0" y="-34" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">
                🏁 {isEn ? 'MAIN TARGET POST' : 'POS TUJUAN UTAMA'}
              </text>
              <text x="0" y="-23" textAnchor="middle" fill="#a7f3d0" fontSize="7.5" fontFamily="sans-serif">
                {isEn ? 'Conservation Zone' : 'Pos Konservasi Biodiversitas'}
              </text>
            </g>

            {/* BRANCH TERMINAL NODE (Branch Path Endpoint) */}
            <g transform={`translate(${endX}, ${branchY})`}>
              <circle 
                r="13" 
                fill={!reachedDestination ? '#450a0a' : '#1e293b'} 
                stroke={!reachedDestination ? '#ef4444' : '#64748b'} 
                strokeWidth="2" 
              />
              <circle r="5" fill={!reachedDestination ? '#ef4444' : '#64748b'} />
              <rect 
                x="-65" 
                y="18" 
                width="130" 
                height="22" 
                rx="5" 
                fill={!reachedDestination ? '#450a0a' : '#1e293b'} 
                stroke={!reachedDestination ? '#ef4444' : '#64748b'} 
                strokeWidth="1" 
              />
              <text 
                x="0" 
                y="32" 
                textAnchor="middle" 
                fill={!reachedDestination ? '#fca5a5' : '#94a3b8'} 
                fontSize="8.5" 
                fontWeight="bold" 
                fontFamily="sans-serif"
              >
                📍 {isEn ? 'BRANCH POST' : 'POS CABANG ALTERNATIF'}
              </text>
            </g>
          </svg>
        </div>

        {/* Map Legend Footer */}
        <div className="relative z-10 mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-stone-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              {isEn ? 'Main Route Node (+2)' : 'Titik Jalur Utama (2 Pt)'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              {isEn ? 'Branch Node (+1)' : 'Titik Cabang (1 Pt)'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              {isEn ? 'Incorrect (0)' : 'Salah (0 Pt)'}
            </span>
          </div>
          <div className="text-stone-300 font-mono text-[11px]">
            {reachedDestination
              ? hasEverDiverged
                ? (isEn ? `Returned to main route (${correctCount}/${totalSteps} correct)` : `Berhasil kembali ke rute utama (${correctCount}/${totalSteps} benar)`)
                : (isEn ? `100% Flawless on main route (${correctCount}/${totalSteps} correct)` : `100% Sempurna di rute utama (${correctCount}/${totalSteps} benar)`)
              : (isEn ? `Finished at branch post (${correctCount}/${totalSteps} correct)` : `Berakhir di pos cabang (${correctCount}/${totalSteps} benar)`)}
          </div>
        </div>
      </div>

      {/* Comparison Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Card 1: Titik Tujuan Asli */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                {isEn ? 'Target Destination (Main)' : 'Titik Tujuan Asli (Target)'}
              </span>
              <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 font-semibold rounded text-[10px]">
                {isEn ? 'Main Post' : 'Pos Utama'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-emerald-950 mt-1">
              {isEn ? 'Biodiversity & Ecosystem Conservation Post' : 'Pos Konservasi Biodiversitas & Ekosistem Lestari'}
            </h3>
            <p className="text-xs text-emerald-800 mt-1.5 leading-relaxed">
              {isEn 
                ? 'The ideal destination reached by staying on the main route or recovering after 2 consecutive correct answers.' 
                : 'Titik akhir yang dituju melalui rute utama atau berhasil dipulihkan dengan menjawab 2 soal benar berturut-turut di cabang.'}
            </p>
          </div>
        </div>

        {/* Card 2: Posisi Akhir Siswa */}
        <div
          className={`border rounded-xl p-5 flex items-start gap-4 ${
            reachedDestination
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-amber-50/70 border-amber-200'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white ${
              reachedDestination ? 'bg-emerald-700' : 'bg-amber-600'
            }`}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  reachedDestination ? 'text-emerald-800' : 'text-amber-800'
                }`}
              >
                {isEn ? 'Your Final Position' : 'Posisi Capaian Siswa'}
              </span>
              <span
                className={`px-2 py-0.5 font-semibold rounded text-[10px] ${
                  reachedDestination
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-amber-200 text-amber-900'
                }`}
              >
                {reachedDestination
                  ? hasEverDiverged
                    ? (isEn ? 'Reached (Recovered)' : 'Sampai Tujuan (Pulih)')
                    : (isEn ? 'Main Goal' : 'Tiba di Tujuan Utama')
                  : (isEn ? 'Branch Post' : 'Pos Cabang')}
              </span>
            </div>
            <h3
              className={`text-sm font-bold mt-1 ${
                reachedDestination ? 'text-emerald-950' : 'text-amber-950'
              }`}
            >
              {reachedDestination
                ? hasEverDiverged
                  ? (isEn ? 'Successfully Reached Main Target (Diverged & Recovered)!' : 'Berhasil Tiba di Pos Tujuan Utama (Sempat Belok & Pulih)!')
                  : (isEn ? 'Successfully Reached Main Conservation Post!' : 'Berhasil Sampai di Pos Konservasi Utama!')
                : (isEn ? 'Ended at Alternative Branch Post' : 'Berakhir di Pos Cabang Alternatif')}
            </h3>
            <p
              className={`text-xs mt-1.5 leading-relaxed ${
                reachedDestination ? 'text-emerald-800' : 'text-amber-800'
              }`}
            >
              {reachedDestination
                ? hasEverDiverged
                  ? (isEn 
                      ? 'Great recovery! Even though you branched off, 2 consecutive correct answers returned you to the main route and achieved the target.' 
                      : 'Luar biasa! Meskipun sempat berbelok ke rute cabang, kamu berhasil menjawab 2 soal benar berturut-turut sehingga alur kembali ke jalur utama dan sukses mencapai tujuan akhir.')
                  : (isEn 
                      ? 'Flawless run! 100% precision on the main route without any divergence.' 
                      : 'Hebat! Penjelajahanmu 100% akurat di jalur utama dan tiba tepat di tujuan akhir tanpa tersesat.')
                : (isEn 
                    ? 'You were on the branch route and finished the assessment before recovering to the main line.' 
                    : 'Kamu berada di rute cabang dan belum sempat memulihkan alur sebelum langkah ulangan berakhir.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
