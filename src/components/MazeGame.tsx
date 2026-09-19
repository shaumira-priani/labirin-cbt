import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LevelConfig, MazeCell, Organism, Question } from '../types/kehati';
import { generateMazeGrid } from '../utils/mazeGenerator';
import { ORGANISMS_DATABASE, KEHATI_QUESTIONS } from '../data/kehatiData';
import { soundManager } from '../utils/soundEffects';
import { EncyclopediaModal } from './EncyclopediaModal';
import { QuizCheckpointModal } from './QuizCheckpointModal';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Award,
  Clock,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Volume2,
  VolumeX,
  Footprints,
  Flame,
  Trees,
  Home
} from 'lucide-react';

interface MazeGameProps {
  level: LevelConfig;
  onLevelComplete: (levelId: string, score: number, foundOrganisms: string[]) => void;
  onBackToMenu: () => void;
}

export const MazeGame: React.FC<MazeGameProps> = ({
  level,
  onLevelComplete,
  onBackToMenu
}) => {
  const [grid, setGrid] = useState<MazeCell[][]>([]);
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [score, setScore] = useState<number>(0);
  const [seedsCount, setSeedsCount] = useState<number>(0);
  const [collectedSpecimens, setCollectedSpecimens] = useState<string[]>([]);
  const [seconds, setSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [fogOfWar, setFogOfWar] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active modals
  const [activeOrganism, setActiveOrganism] = useState<Organism | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [pendingCheckpointCell, setPendingCheckpointCell] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize maze for the level
  const initGame = useCallback(() => {
    const { grid: newGrid, startPos } = generateMazeGrid(
      level.mazeSize.width,
      level.mazeSize.height,
      level.zone,
      level.targetSpecimens,
      level.targetQuestions
    );
    setGrid(newGrid);
    setPlayerPos(startPos);
    setScore(0);
    setSeedsCount(0);
    setCollectedSpecimens([]);
    setSeconds(0);
    setIsCompleted(false);
    setActiveOrganism(null);
    setActiveQuestion(null);
    setPendingCheckpointCell(null);
  }, [level]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer
  useEffect(() => {
    if (isCompleted || activeOrganism || activeQuestion) return;
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted, activeOrganism, activeQuestion]);

  // Toggle sound
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setEnabled(next);
  };

  // Movement Logic
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (isCompleted || activeOrganism || activeQuestion || grid.length === 0) return;

    const currentCell = grid[playerPos.y]?.[playerPos.x];
    if (!currentCell) return;

    // Check wall collision
    if (dy === -1 && currentCell.walls.top) return;
    if (dy === 1 && currentCell.walls.bottom) return;
    if (dx === -1 && currentCell.walls.left) return;
    if (dx === 1 && currentCell.walls.right) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX < 0 || newX >= level.mazeSize.width || newY < 0 || newY >= level.mazeSize.height) {
      return;
    }

    soundManager.playStep();

    // Copy grid to update visited & items
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[newY][newX].visited = true;

    const targetItem = newGrid[newY][newX].item;

    if (targetItem && !targetItem.collected) {
      if (targetItem.type === 'seed') {
        targetItem.collected = true;
        setSeedsCount(s => s + 1);
        setScore(sc => sc + 25);
        soundManager.playSeed();
      } else if (targetItem.type === 'specimen' && targetItem.organismId) {
        targetItem.collected = true;
        const org = ORGANISMS_DATABASE.find(o => o.id === targetItem.organismId);
        if (org) {
          soundManager.playDiscovery();
          setCollectedSpecimens(prev => [...prev, org.id]);
          setScore(sc => sc + 150);
          setActiveOrganism(org);
        }
      } else if (targetItem.type === 'threat') {
        targetItem.collected = true;
        // Threat resolved with conservation awareness!
        soundManager.playDiscovery();
        setScore(sc => sc + 50);
      } else if (targetItem.type === 'checkpoint' && targetItem.questionId) {
        const q = KEHATI_QUESTIONS.find(item => item.id === targetItem.questionId);
        if (q) {
          setPendingCheckpointCell({ x: newX, y: newY });
          setActiveQuestion(q);
          setPlayerPos({ x: newX, y: newY });
          setGrid(newGrid);
          return;
        }
      } else if (targetItem.type === 'exit') {
        // Reached exit!
        setIsCompleted(true);
        soundManager.playVictory();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        const finalScore = score + Math.max(0, 300 - seconds * 2) + collectedSpecimens.length * 100;
        onLevelComplete(level.id, finalScore, collectedSpecimens);
      }
    }

    setPlayerPos({ x: newX, y: newY });
    setGrid(newGrid);
  }, [grid, playerPos, isCompleted, activeOrganism, activeQuestion, level, score, seconds, collectedSpecimens, onLevelComplete]);

  // Handle keyboard arrow keys / WASD
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        movePlayer(0, -1);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        movePlayer(0, 1);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        movePlayer(-1, 0);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        movePlayer(1, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  // Checkpoint modal result
  const handleQuizAnswer = (isCorrect: boolean) => {
    if (pendingCheckpointCell && grid.length > 0) {
      const newGrid = grid.map(row => row.map(c => ({ ...c })));
      if (newGrid[pendingCheckpointCell.y]?.[pendingCheckpointCell.x]?.item) {
        newGrid[pendingCheckpointCell.y][pendingCheckpointCell.x].item!.collected = true;
      }
      setGrid(newGrid);
      if (isCorrect) {
        setScore(sc => sc + 100);
      }
    }
    setActiveQuestion(null);
    setPendingCheckpointCell(null);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Helper for visible cell calculation in fog of war
  const isCellVisible = (cx: number, cy: number) => {
    if (!fogOfWar) return true;
    const dist = Math.abs(cx - playerPos.x) + Math.abs(cy - playerPos.y);
    return dist <= 2 || (Math.abs(cx - playerPos.x) <= 1 && Math.abs(cy - playerPos.y) <= 1) || grid[cy]?.[cx]?.visited;
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 text-stone-100 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-stone-900 border border-stone-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Peta Ekosistem</span>
          </button>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              {level.subtitle}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-100">{level.title}</h2>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-950/80 border border-stone-800 rounded-xl">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{formatTime(seconds)}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-950/80 border border-stone-800 rounded-xl">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-emerald-300">{score} pts</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-950/80 border border-stone-800 rounded-xl">
            <Trees className="w-4 h-4 text-teal-400" />
            <span className="text-teal-300">{seedsCount} Benih</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setFogOfWar(!fogOfWar)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                fogOfWar
                  ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                  : 'bg-stone-800 border-stone-700 text-stone-300'
              }`}
              title={fogOfWar ? 'Matikan Kabut Misteri (Fog of War)' : 'Aktifkan Kabut Misteri'}
            >
              {fogOfWar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 hover:bg-stone-700 transition-colors cursor-pointer"
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={initGame}
              className="p-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 hover:bg-stone-700 transition-colors cursor-pointer"
              title="Acak & Reset Labirin"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left/Main Column: Labyrinth Grid Canvas */}
        <div className="lg:col-span-3 bg-stone-950 p-4 sm:p-6 border border-stone-800 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl min-h-[420px]">
          {/* Maze Grid Container */}
          <div
            ref={containerRef}
            className="w-full flex items-center justify-center overflow-auto p-2"
          >
            <div
              className="grid gap-0 bg-stone-900 border-2 border-stone-700 rounded-lg p-1.5 shadow-2xl relative select-none"
              style={{
                gridTemplateColumns: `repeat(${level.mazeSize.width}, minmax(0, 1fr))`,
                width: '100%',
                maxWidth: `${level.mazeSize.width * 46}px`
              }}
            >
              {grid.map((row, y) =>
                row.map((cell, x) => {
                  const isPlayer = playerPos.x === x && playerPos.y === y;
                  const visible = isCellVisible(x, y);

                  // Wall styling
                  const wallClasses = [
                    cell.walls.top ? 'border-t-2 border-t-emerald-800/80' : 'border-t-transparent',
                    cell.walls.right ? 'border-r-2 border-r-emerald-800/80' : 'border-r-transparent',
                    cell.walls.bottom ? 'border-b-2 border-b-emerald-800/80' : 'border-b-transparent',
                    cell.walls.left ? 'border-l-2 border-l-emerald-800/80' : 'border-l-transparent'
                  ].join(' ');

                  let cellBg = cell.visited ? 'bg-stone-900/90' : 'bg-stone-950';
                  if (!visible) {
                    cellBg = 'bg-stone-950 opacity-40';
                  }

                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`relative aspect-square flex items-center justify-center transition-colors duration-150 ${wallClasses} ${cellBg}`}
                    >
                      {visible ? (
                        <>
                          {/* Footprint trail */}
                          {cell.visited && !isPlayer && (
                            <Footprints className="w-3 h-3 text-emerald-700/40" />
                          )}

                          {/* Item in cell */}
                          {cell.item && !cell.item.collected && (
                            <div className="animate-pulse flex items-center justify-center">
                              {cell.item.type === 'specimen' && (
                                <span className="text-xl sm:text-2xl filter drop-shadow-md hover:scale-125 transition-transform">
                                  {ORGANISMS_DATABASE.find(o => o.id === cell.item?.organismId)?.icon || '🌟'}
                                </span>
                              )}
                              {cell.item.type === 'checkpoint' && (
                                <span className="text-base sm:text-lg text-amber-400 filter drop-shadow">
                                  ❓
                                </span>
                              )}
                              {cell.item.type === 'seed' && (
                                <span className="text-xs sm:text-sm">🌱</span>
                              )}
                              {cell.item.type === 'threat' && (
                                <span className="text-sm sm:text-base">🪓</span>
                              )}
                              {cell.item.type === 'exit' && (
                                <div className="flex flex-col items-center">
                                  <span className="text-lg sm:text-xl">🚪</span>
                                  <span className="text-[9px] font-bold text-emerald-400 bg-stone-950/80 px-1 rounded">
                                    KELUAR
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Player Character */}
                          {isPlayer && (
                            <div className="absolute inset-0 m-auto w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.7)] animate-bounce z-10">
                              🧭
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Victory Overlay Modal */}
          {isCompleted && (
            <div className="absolute inset-0 z-40 bg-stone-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-3xl mb-3 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                🏆
              </div>
              <h3 className="text-2xl font-bold text-emerald-300 mb-1">
                Labirin Berhasil Ditembus!
              </h3>
              <p className="text-stone-300 text-sm max-w-md mb-4">
                Hebat! Kamu telah menyelesaikan penjelajahan ekosistem <span className="text-emerald-400 font-semibold">{level.title}</span> dan membantu mendata spesimen keanekaragaman hayati nusantara.
              </p>

              <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-6 text-xs">
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
                  <div className="text-stone-400">Total Skor</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono">{score}</div>
                </div>
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
                  <div className="text-stone-400">Waktu</div>
                  <div className="text-lg font-bold text-amber-400 font-mono">{formatTime(seconds)}</div>
                </div>
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
                  <div className="text-stone-400">Spesimen</div>
                  <div className="text-lg font-bold text-teal-400 font-mono">{collectedSpecimens.length}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={initGame}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Main Ulang
                </button>
                <button
                  onClick={onBackToMenu}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950"
                >
                  Pilih Ekosistem Lain <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Mission Control & Discovered Specimens */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Mission Progress */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Misi Konservasi
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-300">
                <span>Spesimen Kehati Terdata:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {collectedSpecimens.length} / {level.targetSpecimens}
                </span>
              </div>
              <div className="w-full h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (collectedSpecimens.length / level.targetSpecimens) * 100)}%`
                  }}
                />
              </div>

              <div className="flex justify-between text-stone-300 pt-1">
                <span>Bibit Pohon Terkumpul:</span>
                <span className="font-bold text-teal-400 font-mono">{seedsCount}</span>
              </div>
            </div>

            {/* Found specimens badges */}
            <div className="pt-2 border-t border-stone-800">
              <div className="text-[11px] text-stone-400 mb-2">Spesimen Ditemukan:</div>
              {collectedSpecimens.length === 0 ? (
                <div className="text-xs text-stone-500 italic p-2 bg-stone-950/40 rounded-lg text-center">
                  Belum ada spesimen yang ditemukan di labirin ini.
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {collectedSpecimens.map((orgId) => {
                    const org = ORGANISMS_DATABASE.find(o => o.id === orgId);
                    if (!org) return null;
                    return (
                      <button
                        key={orgId}
                        onClick={() => setActiveOrganism(org)}
                        className="px-2 py-1 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="Klik untuk membuka ensiklopedia spesimen ini"
                      >
                        <span>{org.icon}</span>
                        <span className="truncate max-w-[90px]">{org.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* D-Pad Virtual Controls (Great for touch/mobile screens) */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col items-center">
            <div className="text-xs font-semibold text-stone-400 mb-2">
              Navigasi Labirin (Touch / Klik)
            </div>
            <div className="grid grid-cols-3 gap-2 w-44">
              <div />
              <button
                onClick={() => movePlayer(0, -1)}
                className="p-3 bg-stone-800 hover:bg-emerald-700 active:scale-95 text-stone-200 rounded-xl flex items-center justify-center shadow transition-all cursor-pointer"
                aria-label="Atas"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <div />
              <button
                onClick={() => movePlayer(-1, 0)}
                className="p-3 bg-stone-800 hover:bg-emerald-700 active:scale-95 text-stone-200 rounded-xl flex items-center justify-center shadow transition-all cursor-pointer"
                aria-label="Kiri"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => movePlayer(0, 1)}
                className="p-3 bg-stone-800 hover:bg-emerald-700 active:scale-95 text-stone-200 rounded-xl flex items-center justify-center shadow transition-all cursor-pointer"
                aria-label="Bawah"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => movePlayer(1, 0)}
                className="p-3 bg-stone-800 hover:bg-emerald-700 active:scale-95 text-stone-200 rounded-xl flex items-center justify-center shadow transition-all cursor-pointer"
                aria-label="Kanan"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="text-[10px] text-stone-500 mt-2">
              Tip: Bisa juga gunakan tombol keyboard Panah atau W-A-S-D.
            </div>
          </div>
        </div>
      </div>

      {/* Encyclopedia Modal Popup */}
      {activeOrganism && (
        <EncyclopediaModal
          organism={activeOrganism}
          onClose={() => setActiveOrganism(null)}
          isNewDiscovery={true}
        />
      )}

      {/* Quiz Checkpoint Modal Popup */}
      {activeQuestion && (
        <QuizCheckpointModal
          question={activeQuestion}
          onAnswer={handleQuizAnswer}
        />
      )}
    </div>
  );
};
