import React, { useState } from 'react';
import { KEHATI_QUESTIONS } from '../data/kehatiData';
import { Question } from '../types/kehati';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookmarkCheck
} from 'lucide-react';

interface QuizModeViewProps {
  onOpenCertificate: (name: string, score: number) => void;
}

export const QuizModeView: React.FC<QuizModeViewProps> = ({ onOpenCertificate }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>('');

  const currentQ: Question = KEHATI_QUESTIONS[currentIdx];

  const handleSelect = (optionIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optionIdx
    }));
  };

  const handleSubmitCurrent = () => {
    if (selectedAnswers[currentIdx] === undefined) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedAnswers[currentIdx] === currentQ.correctAnswer;
    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  const handleNext = () => {
    setIsAnswerSubmitted(false);
    if (currentIdx < KEHATI_QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      setQuizFinished(true);
      soundManager.playVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setIsAnswerSubmitted(false);
    setQuizFinished(false);
  };

  // Calculate score
  const correctCount = Object.entries(selectedAnswers).filter(
    ([idx, ans]) => KEHATI_QUESTIONS[Number(idx)]?.correctAnswer === ans
  ).length;
  const scorePercent = Math.round((correctCount / KEHATI_QUESTIONS.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 text-stone-100 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5 mb-1">
              <BookmarkCheck className="w-4 h-4" />
              Asesmen & Kuis Interaktif
            </div>
            <h2 className="text-2xl font-bold text-stone-100">
              Uji Pemahaman Keanekaragaman Hayati
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              Uji pengetahuanmu seputar tingkat kehati, garis persebaran Wallace-Weber, dan konservasi alam Indonesia.
            </p>
          </div>

          {!quizFinished && (
            <div className="px-4 py-2 bg-stone-950/80 rounded-2xl border border-stone-800 text-xs font-mono font-bold text-emerald-400">
              Soal {currentIdx + 1} / {KEHATI_QUESTIONS.length}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {!quizFinished && (
          <div className="w-full h-2 bg-stone-950 rounded-full mt-4 overflow-hidden border border-stone-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{
                width: `${((currentIdx + 1) / KEHATI_QUESTIONS.length) * 100}%`
              }}
            />
          </div>
        )}
      </div>

      {!quizFinished ? (
        /* Active Question Card */
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-3">
            <span className="px-2.5 py-1 rounded-md bg-stone-800 border border-stone-700 text-stone-300 font-medium">
              Topik: {currentQ.topic}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-stone-100 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentIdx] === idx;
              let btnStyle = 'border-stone-800 bg-stone-950/60 hover:bg-stone-800/80 text-stone-300';

              if (isSelected) {
                btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500';
              }

              if (isAnswerSubmitted) {
                if (idx === currentQ.correctAnswer) {
                  btnStyle = 'border-emerald-500 bg-emerald-950/70 text-emerald-200 font-semibold';
                } else if (isSelected) {
                  btnStyle = 'border-red-500 bg-red-950/70 text-red-300';
                } else {
                  btnStyle = 'border-stone-800 bg-stone-950/30 text-stone-500 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-stone-800/80 border border-stone-700 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 text-sm leading-snug">{opt}</span>
                  {isAnswerSubmitted && idx === currentQ.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && idx !== currentQ.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswerSubmitted && (
            <div
              className={`p-4 rounded-xl border animate-in fade-in slide-in-from-bottom-2 text-xs leading-relaxed ${
                selectedAnswers[currentIdx] === currentQ.correctAnswer
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-100'
                  : 'bg-red-950/40 border-red-800/60 text-red-100'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                {selectedAnswers[currentIdx] === currentQ.correctAnswer ? (
                  <>
                    <Award className="w-4 h-4 text-emerald-400" />
                    Jawaban Benar!
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    Jawaban Kurang Tepat
                  </>
                )}
              </div>
              <p className="text-stone-300">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2 border-t border-stone-800">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitCurrent}
                disabled={selectedAnswers[currentIdx] === undefined}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Kunci Jawaban
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
              >
                {currentIdx < KEHATI_QUESTIONS.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 text-center space-y-6 animate-in zoom-in-95 duration-300 shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-emerald-950">
            🏆
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-100">
              Kuis Kehati Selesai!
            </h3>
            <p className="text-stone-400 text-sm mt-1">
              Kamu berhasil menyelesaikan seluruh soal evaluasi keanekaragaman hayati.
            </p>
          </div>

          {/* Score Badge */}
          <div className="inline-flex flex-col items-center p-6 bg-stone-950 border border-stone-800 rounded-2xl">
            <div className="text-xs text-stone-400 uppercase font-mono tracking-wider">Skor Akhir</div>
            <div className="text-5xl font-extrabold text-emerald-400 font-mono my-1">{scorePercent}%</div>
            <div className="text-xs text-stone-400">
              Benar <span className="font-bold text-emerald-400">{correctCount}</span> dari {KEHATI_QUESTIONS.length} Soal
            </div>
          </div>

          {/* Certificate Input */}
          <div className="max-w-md mx-auto p-4 bg-stone-950/80 border border-stone-800 rounded-2xl text-left space-y-3">
            <div className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Klaim Piagam Penjelajah Kehati
            </div>
            <input
              type="text"
              placeholder="Masukkan nama lengkapmu..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => onOpenCertificate(playerName.trim() || 'Penjelajah Muda Kehati', scorePercent)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" /> Cetak / Unduh Sertifikat
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Coba Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
