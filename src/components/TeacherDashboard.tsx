import React, { useEffect, useState } from 'react';
import { LogOut, Plus, FileText, Loader2, ChevronRight } from 'lucide-react';
import type { User } from 'firebase/auth';
import { getExamsForTeacher, createExam, logoutTeacher } from '../services/customExamService';
import type { CustomExamDoc } from '../types/customExam';
import { ExamEditor } from './ExamEditor';

interface Props {
  user: User;
  onLoggedOut: () => void;
}

export const TeacherDashboard: React.FC<Props> = ({ user, onLoggedOut }) => {
  const [exams, setExams] = useState<CustomExamDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [openExamId, setOpenExamId] = useState<string | null>(null);

  // Create-exam form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState(60);
  const [classNamesRaw, setClassNamesRaw] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const refreshExams = async () => {
    setLoading(true);
    try {
      const list = await getExamsForTeacher(user.uid);
      setExams(list.sort((a, b) => b.createdAt - a.createdAt));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    const classNames = classNamesRaw.split(',').map((c) => c.trim()).filter(Boolean);
    if (!title.trim() || !subject.trim() || classNames.length === 0) {
      setCreateError('Judul, mata pelajaran, dan minimal 1 nama kelas wajib diisi.');
      return;
    }
    setCreating(true);
    try {
      const exam = await createExam(user.uid, { title: title.trim(), subject: subject.trim(), durationMinutes: duration, classNames });
      setTitle(''); setSubject(''); setDuration(60); setClassNamesRaw('');
      setShowCreateForm(false);
      await refreshExams();
      setOpenExamId(exam.id);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Gagal membuat ujian');
    } finally {
      setCreating(false);
    }
  };

  if (openExamId) {
    return <ExamEditor examId={openExamId} onBack={() => { setOpenExamId(null); refreshExams(); }} />;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Dashboard Guru</h1>
          <p className="text-sm text-stone-500">{user.email}</p>
        </div>
        <button
          onClick={async () => { await logoutTeacher(); onLoggedOut(); }}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      <button
        onClick={() => setShowCreateForm((s) => !s)}
        className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        <Plus className="w-4 h-4" /> Buat Ujian Baru
      </button>

      {showCreateForm && (
        <form onSubmit={handleCreate} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Judul Ujian</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm" placeholder="Penilaian Harian Bab Fotosintesis" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Mata Pelajaran</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm" placeholder="Biologi" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Durasi (menit)</label>
              <input type="number" min={1} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Nama Kelas (pisah pakai koma)</label>
            <input value={classNamesRaw} onChange={(e) => setClassNamesRaw(e.target.value)} className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm" placeholder="10 IPA 1, 10 IPA 2, 10 IPA 3" />
            <p className="text-xs text-stone-400 mt-1">Tiap kelas otomatis dapat kode akses sendiri-sendiri.</p>
          </div>
          {createError && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{createError}</p>}
          <button type="submit" disabled={creating} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
            {creating && <Loader2 className="w-4 h-4 animate-spin" />} Simpan & Lanjut Upload Soal
          </button>
        </form>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10 text-stone-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : exams.length === 0 ? (
          <p className="text-center text-stone-400 py-10 text-sm">Belum ada ujian. Buat ujian pertamamu di atas.</p>
        ) : (
          exams.map((exam) => (
            <button
              key={exam.id}
              onClick={() => setOpenExamId(exam.id)}
              className="w-full flex items-center justify-between bg-white border border-stone-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <p className="font-semibold text-stone-900 text-sm">{exam.title}</p>
                  <p className="text-xs text-stone-500">{exam.subject} &middot; {exam.totalQuestions} soal &middot; {exam.durationMinutes} menit</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  exam.status === 'published' ? 'bg-emerald-100 text-emerald-800' : exam.status === 'closed' ? 'bg-stone-200 text-stone-600' : 'bg-amber-100 text-amber-800'
                }`}>
                  {exam.status === 'published' ? 'Terbit' : exam.status === 'closed' ? 'Ditutup' : 'Draft'}
                </span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
