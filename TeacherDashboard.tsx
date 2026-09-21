import React, { useEffect, useState } from 'react';
import {
  LogOut, Plus, FileText, Loader2, ChevronRight, Edit3, EyeOff, Send,
  Trash2, AlertTriangle, X, Check, Clock, BookOpen,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import {
  getExamsForTeacher, createExam, logoutTeacher,
  updateExam, unpublishExam, deleteExam, publishExam,
} from '../services/customExamService';
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

  // Edit / Rename Modal State
  const [editingExam, setEditingExam] = useState<CustomExamDoc | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editDuration, setEditDuration] = useState(60);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Confirmation State
  const [deletingExam, setDeletingExam] = useState<CustomExamDoc | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Action status loading tracker (examId -> boolean)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

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
      const exam = await createExam(user.uid, {
        title: title.trim(),
        subject: subject.trim(),
        durationMinutes: duration,
        classNames: selectedClasses,
      });
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

  const handleOpenEditModal = (e: React.MouseEvent, exam: CustomExamDoc) => {
    e.stopPropagation();
    setEditingExam(exam);
    setEditTitle(exam.title);
    setEditSubject(exam.subject);
    setEditDuration(exam.durationMinutes);
    setEditError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExam) return;
    if (!editTitle.trim() || !editSubject.trim()) {
      setEditError('Judul dan mata pelajaran tidak boleh kosong.');
      return;
    }
    setSavingEdit(true);
    setEditError(null);
    try {
      await updateExam(editingExam.id, {
        title: editTitle.trim(),
        subject: editSubject.trim(),
        durationMinutes: editDuration,
      });
      setEditingExam(null);
      await refreshExams();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Gagal menyimpan perubahan');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleTogglePublish = async (e: React.MouseEvent, exam: CustomExamDoc) => {
    e.stopPropagation();
    setActionLoadingId(exam.id);
    try {
      if (exam.status === 'published') {
        await unpublishExam(exam.id);
      } else {
        if (exam.totalQuestions === 0) {
          alert('Ujian belum memiliki soal. Masuk ke "Edit Soal" terlebih dahulu untuk mengunggah soal sebelum diterbitkan.');
          return;
        }
        await publishExam(exam.id);
      }
      await refreshExams();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal memperbarui status publikasi');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingExam) return;
    setDeleting(true);
    try {
      await deleteExam(deletingExam.id);
      setDeletingExam(null);
      await refreshExams();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus ujian');
    } finally {
      setDeleting(false);
    }
  };

  if (openExamId) {
    return <ExamEditor examId={openExamId} onBack={() => { setOpenExamId(null); refreshExams(); }} />;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Dashboard Guru</h1>
          <p className="text-sm text-stone-500">{user.email}</p>
        </div>
        <button
          onClick={async () => { await logoutTeacher(); onLoggedOut(); }}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      {/* Button Create */}
      <button
        onClick={() => setShowCreateForm((s) => !s)}
        className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer shadow-sm"
      >
        <Plus className="w-4 h-4" /> {showCreateForm ? 'Tutup Formulir Ujian' : 'Buat Ujian Baru'}
      </button>

      {/* Create Form */}
      {showCreateForm && (
        <form onSubmit={handleCreate} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-stone-900">Form Pembuatan Ujian</h2>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Judul Ujian / Materi</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm"
              placeholder="Contoh: Penilaian Harian Bab Fotosintesis"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Mata Pelajaran</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm bg-white"
                required
              >
                <option value="">-- Pilih Mapel --</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Durasi (menit)</label>
              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Pilih Kelas yang Mengikuti</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border border-stone-200 rounded-xl p-3 bg-stone-50/50">
              {CLASS_NAMES.map((c) => (
                <label key={c} className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
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
            <p className="text-xs text-stone-400 mt-1">Tiap kelas otomatis akan mendapatkan kode akses/token sendiri.</p>
          </div>
          {createError && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{createError}</p>}
          <button
            type="submit"
            disabled={creating}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {creating && <Loader2 className="w-4 h-4 animate-spin" />} Simpan &amp; Lanjut Upload Soal
          </button>
        </form>
      )}

      {/* List Exams */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <span>Daftar Ujian Anda ({exams.length})</span>
          <span>Klik kartu untuk buka &amp; kelola soal</span>
        </div>

        {loading ? (
          <div className="text-center py-10 text-stone-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : exams.length === 0 ? (
          <div className="text-center bg-white border border-dashed border-stone-300 rounded-2xl py-12 px-4 space-y-2">
            <FileText className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="font-medium text-stone-700 text-sm">Belum ada ujian yang dibuat.</p>
            <p className="text-xs text-stone-400">Klik tombol "Buat Ujian Baru" di atas untuk memulai.</p>
          </div>
        ) : (
          exams.map((exam) => {
            const isActionLoading = actionLoadingId === exam.id;
            return (
              <div
                key={exam.id}
                className="bg-white border border-stone-200 rounded-2xl p-4 hover:border-emerald-300 transition-all shadow-xs space-y-3"
              >
                {/* Main Card Clickable to Open Exam */}
                <div
                  onClick={() => setOpenExamId(exam.id)}
                  className="flex items-start justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900 text-sm group-hover:text-emerald-800 transition-colors">
                        {exam.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {exam.subject} &middot; {exam.totalQuestions} soal &middot; {exam.durationMinutes} menit
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      exam.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : exam.status === 'closed'
                        ? 'bg-stone-200 text-stone-600'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {exam.status === 'published' ? 'Terbit (Aktif)' : exam.status === 'closed' ? 'Ditutup' : 'Draft (Tidak Terbit)'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 transition-colors" />
                  </div>
                </div>

                {/* Toolbar Tools: Edit Soal, Rename, Unpublish/Publish, Delete */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setOpenExamId(exam.id)}
                      className="px-2.5 py-1.5 text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="Buka untuk upload soal & pantau siswa"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Kelola Soal &amp; Token
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditModal(e, exam)}
                      className="px-2.5 py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="Ubah judul, mapel, atau durasi"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Ubah Info
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {exam.status === 'published' ? (
                      <button
                        type="button"
                        disabled={isActionLoading}
                        onClick={(e) => handleTogglePublish(e, exam)}
                        className="px-2.5 py-1.5 text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Tarik ujian dari murid (jadikan status Draft agar tidak muncul di pilihan murid)"
                      >
                        {isActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <EyeOff className="w-3.5 h-3.5" />}
                        Tarik / Tidak Diterbitkan
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isActionLoading}
                        onClick={(e) => handleTogglePublish(e, exam)}
                        className="px-2.5 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Terbitkan ujian agar dapat dikerjakan siswa"
                      >
                        {isActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        Terbitkan Ujian
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingExam(exam);
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Ujian"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Edit / Rename Ujian */}
      {editingExam && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-700" /> Ubah Info Ujian
              </h3>
              <button
                onClick={() => setEditingExam(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Judul Ujian / Materi</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Mata Pelajaran</label>
                  <select
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white"
                    required
                  >
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Durasi (Menit)</label>
                  <input
                    type="number"
                    min={1}
                    value={editDuration}
                    onChange={(e) => setEditDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              {editError && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                  {editError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingExam(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Ujian */}
      {deletingExam && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-stone-900 text-base">Hapus Ujian Ini?</h3>
              <p className="text-xs text-stone-500">
                Anda akan menghapus ujian <strong>"{deletingExam.title}"</strong>. Seluruh soal, token kelas, dan riwayat pengerjaan siswa pada ujian ini akan dihapus permanen.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingExam(null)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
