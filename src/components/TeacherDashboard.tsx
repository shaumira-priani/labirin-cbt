import React, { useEffect, useState } from 'react';
import { LogOut, Plus, FileText, Loader2, ChevronRight, Pencil, Trash2, Check, X, EyeOff, Eye } from 'lucide-react';
import type { User } from 'firebase/auth';
import { getExamsForTeacher, createExam, logoutTeacher, updateExamMeta, setExamStatus, deleteExamCompletely } from '../services/customExamService';
import type { CustomExamDoc } from '../types/customExam';
import { SUBJECTS, CLASS_NAMES } from '../data/schoolRoster';
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
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
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
    if (!title.trim() || !subject.trim() || selectedClasses.length === 0) {
      setCreateError('Judul, mata pelajaran, dan minimal 1 nama kelas wajib diisi.');
      return;
    }
    setCreating(true);
    try {
      const exam = await createExam(user.uid, { title: title.trim(), subject: subject.trim(), durationMinutes: duration, classNames: selectedClasses });
      setTitle(''); setSubject(''); setDuration(60); setSelectedClasses([]);
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
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white">
                <option value="">-- Pilih Mapel --</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Durasi (menit)</label>
              <input type="number" min={1} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Nama Kelas (bisa pilih lebih dari satu)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border border-stone-200 rounded-xl p-3">
              {CLASS_NAMES.map((c) => (
                <label key={c} className="flex items-center gap-1.5 text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(c)}
                    onChange={(e) =>
                      setSelectedClasses((prev) => (e.target.checked ? [...prev, c] : prev.filter((x) => x !== c)))
                    }
                  />
                  {c}
                </label>
              ))}
            </div>
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
            <ExamCard
              key={exam.id}
              exam={exam}
              onOpen={() => setOpenExamId(exam.id)}
              onChanged={refreshExams}
            />
          ))
        )}
      </div>
    </div>
  );
};

const ExamCard: React.FC<{ exam: CustomExamDoc; onOpen: () => void; onChanged: () => void }> = ({ exam, onOpen, onChanged }) => {
  const [renaming, setRenaming] = useState(false);
  const [titleDraft, setTitleDraft] = useState(exam.title);
  const [busy, setBusy] = useState(false);

  const handleSaveRename = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!titleDraft.trim()) return;
    setBusy(true);
    await updateExamMeta(exam.id, { title: titleDraft.trim() });
    setBusy(false);
    setRenaming(false);
    onChanged();
  };

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setBusy(true);
    await setExamStatus(exam.id, exam.status === 'published' ? 'draft' : 'published');
    setBusy(false);
    onChanged();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Hapus ujian "${exam.title}" beserta semua soal & kode kelasnya? Ini tidak bisa dibatalkan.`)) return;
    setBusy(true);
    await deleteExamCompletely(exam.id);
    setBusy(false);
    onChanged();
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onOpen} className="flex items-center gap-3 flex-1 text-left min-w-0">
          <FileText className="w-5 h-5 text-emerald-700 shrink-0" />
          <div className="min-w-0">
            {renaming ? (
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <input
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  className="text-sm border border-stone-300 rounded-lg px-2 py-1 w-full"
                  autoFocus
                />
                <button onClick={handleSaveRename} disabled={busy} className="text-emerald-700 shrink-0"><Check className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); setRenaming(false); setTitleDraft(exam.title); }} className="text-stone-400 shrink-0"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <>
                <p className="font-semibold text-stone-900 text-sm truncate">{exam.title}</p>
                <p className="text-xs text-stone-500">{exam.subject} &middot; {exam.totalQuestions} soal &middot; {exam.durationMinutes} menit</p>
              </>
            )}
          </div>
        </button>

        {!renaming && (
          <div className="flex items-center gap-1 shrink-0">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              exam.status === 'published' ? 'bg-emerald-100 text-emerald-800' : exam.status === 'closed' ? 'bg-stone-200 text-stone-600' : 'bg-amber-100 text-amber-800'
            }`}>
              {exam.status === 'published' ? 'Terbit' : exam.status === 'closed' ? 'Ditutup' : 'Draft'}
            </span>
            <button onClick={(e) => { e.stopPropagation(); setRenaming(true); }} disabled={busy} title="Ganti nama" className="p-1.5 text-stone-400 hover:text-emerald-700 rounded-lg hover:bg-stone-50">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            {exam.totalQuestions > 0 && (
              <button onClick={handleToggleStatus} disabled={busy} title={exam.status === 'published' ? 'Sembunyikan dari siswa (jadi Draft)' : 'Terbitkan ke siswa'} className="p-1.5 text-stone-400 hover:text-amber-700 rounded-lg hover:bg-stone-50">
                {exam.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            )}
            <button onClick={handleDelete} disabled={busy} title="Hapus ujian" className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-50">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <ChevronRight onClick={onOpen} className="w-4 h-4 text-stone-400 cursor-pointer" />
          </div>
        )}
      </div>
    </div>
  );
};
