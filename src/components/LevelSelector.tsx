import React from 'react';
import { LevelConfig, PlayerStats } from '../types/kehati';
import { GAME_LEVELS } from '../data/kehatiData';
import { Lock, Play, Award, CheckCircle2, Trees, ShieldAlert, Sparkles } from 'lucide-react';

interface LevelSelectorProps {
  onSelectLevel: (level: LevelConfig) => void;
  playerStats: PlayerStats;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  onSelectLevel,
  playerStats
}) => {
  const isLevelUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevLevelId = GAME_LEVELS[index - 1].id;
    return playerStats.completedLevels.includes(prevLevelId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 border border-emerald-900/40 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Media Edukasi Biologi Interaktif & Game Konservasi
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight leading-tight">
            Petualangan Labirin Keanekaragaman Hayati
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Jelajahi labirin nusantara dari Hutan Hujan Sundaland hingga Segitiga Terumbu Karang. Pecahkan kuis biologi, kumpulkan benih pohon konservasi, dan temukan flora & fauna endemik Indonesia!
          </p>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
            <div className="px-3.5 py-1.5 bg-stone-900/80 border border-stone-700/80 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{playerStats.completedLevels.length} / {GAME_LEVELS.length} Ekosistem Selesai</span>
            </div>
            <div className="px-3.5 py-1.5 bg-stone-900/80 border border-stone-700/80 rounded-xl flex items-center gap-2">
              <Trees className="w-4 h-4 text-teal-400" />
              <span>{playerStats.specimensFound.length} Spesimen Terdata</span>
            </div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-teal-600 to-transparent pointer-events-none" />
      </div>

      {/* Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GAME_LEVELS.map((level, idx) => {
          const unlocked = isLevelUnlocked(idx);
          const completed = playerStats.completedLevels.includes(level.id);
          const highScore = playerStats.highScores[level.id] || 0;

          return (
            <div
              key={level.id}
              className={`relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                unlocked
                  ? 'bg-stone-900/90 border-stone-800 hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-950/30'
                  : 'bg-stone-950/60 border-stone-900 opacity-60'
              }`}
            >
              {/* Top Card Header */}
              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-stone-800 text-emerald-300 border border-stone-700">
                    {level.badge}
                  </span>
                  {completed ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                    </span>
                  ) : !unlocked ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-stone-500 bg-stone-900 px-2.5 py-1 rounded-full border border-stone-800">
                      <Lock className="w-3.5 h-3.5" /> Terkunci
                    </span>
                  ) : null}
                </div>

                <div>
                  <div className="text-xs uppercase font-bold text-stone-400 font-mono">
                    {level.subtitle}
                  </div>
                  <h3 className="text-xl font-bold text-stone-100 mt-0.5">{level.title}</h3>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {level.description}
                </p>

                {/* Level parameters */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                  <div className="p-2.5 bg-stone-950/60 border border-stone-800 rounded-xl">
                    <span className="text-stone-500">Ukuran Labirin:</span>{' '}
                    <span className="text-stone-200 font-bold">
                      {level.mazeSize.width} × {level.mazeSize.height}
                    </span>
                  </div>
                  <div className="p-2.5 bg-stone-950/60 border border-stone-800 rounded-xl">
                    <span className="text-stone-500">Target Spesimen:</span>{' '}
                    <span className="text-emerald-400 font-bold">{level.targetSpecimens} Spesies</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer Action */}
              <div className="p-4 bg-stone-950/80 border-t border-stone-800/80 flex items-center justify-between">
                {highScore > 0 ? (
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                    <Award className="w-4 h-4" />
                    <span>Rekor: {highScore} pts</span>
                  </div>
                ) : (
                  <div className="text-xs text-stone-500">
                    {unlocked ? 'Siap Ditelusuri' : 'Selesaikan level sebelumnya'}
                  </div>
                )}

                <button
                  onClick={() => unlocked && onSelectLevel(level)}
                  disabled={!unlocked}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    unlocked
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950 active:scale-95'
                      : 'bg-stone-800 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  {unlocked ? (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Masuk Labirin
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Terkunci
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
