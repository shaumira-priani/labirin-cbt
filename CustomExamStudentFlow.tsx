import React, { useEffect, useState } from 'react';
import { KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import {
  signInStudentAnonymously, findExamByAccessCode, getExamQuestions, startSession,
} from '../services/customExamService';
import type { CustomExamDoc, CustomQuestionDoc, CustomSessionDoc } from '../types/customExam';
import { CustomExamRunner } from './CustomExamRunner';

interface Props {
  onBack: () => void;
}

type Stage = 'code' | 'name' | 'running' | 'done';

export const CustomExamStudentFlow: React.FC<Props> = ({ onBack }) => {
  const [stage, setStage] = useState<Stage>('code');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [exam, setExam] = useState<CustomExamDoc | null>(null);
  const [className, setClassName] = useState('');
  const [questions, setQuestions] = useState<CustomQuestionDoc[]>([]);
  const [session, setSession] = useState<CustomSessionDoc | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  useEffect(() => { signInStudentAnonymously().catch(() => {}); }, []);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const found = await findExamByAccessCode(code);
      if (!found) throw new Error('Kode tidak ditemukan atau ujian belum diterbitkan guru.');
      if (!found.exam.mazeGraph || found.exam.totalQuestions === 0) {
        throw new Error('Ujian ini belum ada soalnya. Hubungi Guru Pengawas.');
      }
      setExam(found.exam);
      setClassName(found.className);
      setStage('name');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memverifikasi kode');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam || !name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const uid = await signInStudentAnonymously();
      const qs = await getExamQuestions(exam.id);
      const newSession = await startSession(exam, uid, name.trim(), className);
      setQuestions(qs);
      setSession(newSession);
      setStage('running');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memulai ujian');
    } finally {
      setLoading(false);
    }
  };

  if (stage === 'running' && exam && session) {
    return (
      <CustomExamRunner
        exam={exam}
        questions={questions}
        session={session}
        onFinished={(score) => { setFinalScore(score); setStage('done'); }}
      />
    );
  }

  if (stage === 'done') {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-stone-900">Terima kasih, {name}!</h2>
        <p className="text-stone-500 text-sm">Skor akhir kamu: <span className="font-bold text-emerald-700">{finalScore}</span></p>
        <p className="text-xs text-stone-400">Hasil sudah dikirim ke Guru Pengawas.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-14 px-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </button>

      <div className="bg-white border border-stone-200 rounded-2xl p-8 space-y-5">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-emerald-700" />
          <h1 className="text-lg font-bold text-stone-900">
            {stage === 'code' ? 'Masukkan Kode Ujian' : `Ujian: ${exam?.title}`}
          </h1>
        </div>

        {stage === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Contoh: A3F9K2"
              className="w-full px-4 py-3 border border-stone-300 rounded-xl text-center font-mono text-lg tracking-widest uppercase"
              maxLength={8}
            />
            {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading || !code.trim()}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl disabled:opacity-50">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Verifikasi Kode
            </button>
          </form>
        )}

        {stage === 'name' && (
          <form onSubmit={handleStart} className="space-y-4">
            <p className="text-sm text-stone-500">Kelas terdeteksi: <span className="font-semibold text-stone-800">{className}</span></p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap kamu"
              className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm"
            />
            {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading || !name.trim()}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl disabled:opacity-50">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Mulai Ujian
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
