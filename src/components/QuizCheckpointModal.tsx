import React, { useState } from 'react';
import { Question } from '../types/kehati';
import { soundManager } from '../utils/soundEffects';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Award } from 'lucide-react';

interface QuizCheckpointModalProps {
  question: Question | null;
  onAnswer: (correct: boolean) => void;
}

export const QuizCheckpointModal: React.FC<QuizCheckpointModalProps> = ({
  question,
  onAnswer
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!question) return null;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || submitted) return;
    setSubmitted(true);
    const isCorrect = selectedOption === question.correctAnswer;
    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  const handleContinue = () => {
    onAnswer(selectedOption === question.correctAnswer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/70 via-stone-900 to-stone-900 p-4 border-b border-stone-800 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Gerbang Checkpoint Pengetahuan
            </div>
            <h3 className="text-base font-semibold text-stone-100">
              Topik: {question.topic}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-sm">
          <p className="text-stone-200 font-medium text-base leading-snug">
            {question.question}
          </p>

          <div className="space-y-2.5 pt-1">
            {question.options.map((opt, idx) => {
              let btnStyle = 'border-stone-800 bg-stone-950/60 hover:bg-stone-800/80 text-stone-300';
              if (selectedOption === idx) {
                btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500';
              }
              if (submitted) {
                if (idx === question.correctAnswer) {
                  btnStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-200 font-semibold';
                } else if (selectedOption === idx) {
                  btnStyle = 'border-red-500 bg-red-950/60 text-red-300';
                } else {
                  btnStyle = 'border-stone-800 bg-stone-950/30 text-stone-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={submitted}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-stone-800/80 border border-stone-700 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-snug">{opt}</span>
                  {submitted && idx === question.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {submitted && selectedOption === idx && idx !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {submitted && (
            <div
              className={`p-4 rounded-xl border animate-in fade-in slide-in-from-bottom-2 text-xs leading-relaxed ${
                selectedOption === question.correctAnswer
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-100'
                  : 'bg-red-950/40 border-red-800/60 text-red-100'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1">
                {selectedOption === question.correctAnswer ? (
                  <>
                    <Award className="w-4 h-4 text-emerald-400" />
                    Jawaban Benar! (+100 Poin Konservasi)
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    Jawaban Kurang Tepat
                  </>
                )}
              </div>
              <p className="text-stone-300">{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex justify-end gap-2">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-semibold text-sm transition-colors cursor-pointer"
            >
              Kunci Jawaban
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              Buka Jalan <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
