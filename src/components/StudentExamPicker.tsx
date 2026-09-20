import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Loader2, KeyRound, Clock, ListChecks } from 'lucide-react';
import {
  signInStudentAnonymously, getPublishedExamOptions, getAccessCodeForExamClass,
  getExam, getExamQuestions, startSession,
} from '../services/customExamService';
import type { CustomExamDoc, CustomQuestionDoc, CustomSessionDoc } from '../types/customExam';
import { CustomExamRunner } from './CustomExamRunner';
import type { AnswerRecord } from './CustomExamRunner';
import { JourneyMap } from './JourneyMap';

interface Props {
  onBack: () => void;
}

interface ExamOption { examId: string; title: string; subject: string; className: string }

type Stage = 'loading' | 'pickClass' | 'pickSubjectExam' | 'instructions' | 'running' | 'done';

export const StudentExamPicker: React.FC<Props> = ({ onBack }) => {
  const [stage, setStage] = useState<Stage>('loading');
  const [allOptions, setAllOptions] = useState<ExamOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedClass, setSelectedClass] = useState('');
  const [studentName, setStudentName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [token, setToken] = useState('');

  const [exam, setExam] = useState<CustomExamDoc | null>(null);
  const [questions, setQuestions] = useState<CustomQuestionDoc[]>([]);
  const [session, setSession] = useState<CustomSessionDoc | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [finalHistory, setFinalHistory] = useState<AnswerRecord[]>([]);
  const [finalGoldenTarget, setFinalGoldenTarget] = useState(0);

  useEffect(() => {
    signInStudentAnonymously().catch(() => {});
    getPublishedExamOptions()
      .then((opts) => { setAllOptions(opts); setStage('pickClass'); })
      .catch(() => { setError('Gagal memuat daftar ujian. Coba muat ulang halaman.'); setStage('pickClass'); });
  }, []);

  const classNames = useMemo(() => Array.from(new Set(allOptions.map((o) => o.className))).sort(), [allOptions]);
  const subjectsForClass = useMemo(
    () => Array.from(new Set(allOptions.filter((o) => o.className === selectedClass).map((o) => o.subject))).sort(),
    [allOptions, selectedClass]
  );
  const examsForSubject = useMemo(
    () => allOptions.filter((o) => o.className === selectedClass && o.subject === selectedSubject),
    [allOptions, selectedClass, selectedSubject]
  );

  const handleContinueToSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !studentName.trim()) return;
    setStage('pickSubjectExam');
  };

  const handleContinueToInstructions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) return;
    setLoading(true);
    setError(null);
    try {
      const examData = await getExam(selectedExamId);
      if (!examData) throw new Error('Ujian tidak ditemukan.');
      setExam(examData);
      setStage('instructions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat ujian');
    } finally {
      setLoading(false);
    }
  };

  const handleStartWithToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam) return;
    setLoading(true);
    setError(null);
    try {
      const correctCode = await getAccessCodeForExamClass(exam.id, selectedClass);
      if (!correctCode || correctCode.toUpperCase() !== token.trim().toUpperCase()) {
        throw new Error('Token salah. Tanyakan token yang benar ke Guru Pengawas.');
      }
      const uid = await signInStudentAnonymously();
      const qs = await getExamQuestions(exam.id);
      const newSession = await startSession(exam, uid, studentName.trim(), selectedClass);
      setQuestions(qs);
      setSession(newSession);
      setStage('running');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memulai ujian');
    } finally {
      setLoading(false);
    }
  };

  if (stage === 'loading') {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-stone-400" /></div>;
  }

  if (stage === 'running' && exam && session) {
    return (
      <CustomExamRunner
        exam={exam}
        questions={questions}
        session={session}
        onFinished={(score, history, goldenTarget) => {
          setFinalScore(score);
          setFinalHistory(history);
          setFinalGoldenTarget(goldenTarget);
          setStage('done');
        }}
      />
    );
  }

  if (stage === 'done') {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-5">
        <h2 className="text-xl font-bold text-stone-900">Terima kasih, {studentName}!</h2>
        <p className="text-stone-500 text-sm">Skor akhir kamu: <span className="font-bold text-emerald-700">{finalScore}</span></p>
        <p className="text-xs text-stone-400">Hasil sudah dikirim ke Guru Pengawas.</p>
        <div className="bg-white border border-stone-200 rounded-2xl p-5">
          <JourneyMap history={finalHistory} goldenPathTarget={finalGoldenTarget} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-14 px-4">
      <button
        onClick={() => {
          if (stage === 'pickSubjectExam') setStage('pickClass');
          else if (stage === 'instructions') setStage('pickSubjectExam');
          else onBack();
        }}
        className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </button>

      <div className="bg-white border border-stone-200 rounded-2xl p-8 space-y-5">
        {stage === 'pickClass' && (
          <form onSubmit={handleContinueToSubject} className="space-y-4">
            <h1 className="text-lg font-bold text-stone-900">Formulir Identitas Siswa</h1>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Kelas</label>
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white">
                <option value="">-- Pilih Kelas --</option>
                {classNames.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {classNames.length === 0 && <p className="text-xs text-amber-600 mt-1">Belum ada ujian yang diterbitkan guru untuk kelas manapun.</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Nama Lengkap</label>
              <input value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm" placeholder="Nama kamu" />
            </div>
            {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={!selectedClass || !studentName.trim()} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl disabled:opacity-40">
              Lanjut
            </button>
          </form>
        )}

        {stage === 'pickSubjectExam' && (
          <form onSubmit={handleContinueToInstructions} className="space-y-4">
            <h1 className="text-lg font-bold text-stone-900">Pilih Ujian</h1>
            <p className="text-xs text-stone-400">Kelas: <span className="font-semibold text-stone-600">{selectedClass}</span> &middot; {studentName}</p>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Mata Pelajaran (Mapel PH)</label>
              <select value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); setSelectedExamId(''); }} className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white">
                <option value="">-- Pilih Mapel --</option>
                {subjectsForClass.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {selectedSubject && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Materi PH</label>
                <select value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)} className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white">
                  <option value="">-- Pilih Materi --</option>
                  {examsForSubject.map((o) => <option key={o.examId} value={o.examId}>{o.title}</option>)}
                </select>
              </div>
            )}
            {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={!selectedExamId || loading} className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl disabled:opacity-40">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Lanjut
            </button>
          </form>
        )}

        {stage === 'instructions' && exam && (
          <form onSubmit={handleStartWithToken} className="space-y-4">
            <h1 className="text-lg font-bold text-stone-900">{exam.title}</h1>
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {exam.durationMinutes} menit</span>
              <span className="flex items-center gap-1"><ListChecks className="w-3.5 h-3.5" /> {exam.totalQuestions} soal (mode labirin)</span>
            </div>
            <div className="text-xs text-stone-500 bg-stone-50 border border-stone-100 rounded-lg p-3 space-y-1">
              <p>&bull; Jawab tiap soal dengan teliti. Jawaban benar di jalur utama bernilai lebih besar.</p>
              <p>&bull; Kalau jawaban salah, kamu akan diarahkan ke soal remedial sebelum bisa lanjut.</p>
              <p>&bull; Jangan keluar dari layar penuh atau berpindah tab selama ujian berlangsung.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5" /> Token dari Guru Pengawas</label>
              <input value={token} onChange={(e) => setToken(e.target.value.toUpperCase())} className="w-full px-4 py-3 border border-stone-300 rounded-xl text-center font-mono text-lg tracking-widest uppercase" maxLength={8} />
            </div>
            {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={!token.trim() || loading} className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl disabled:opacity-40">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Mulai Ujian
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
