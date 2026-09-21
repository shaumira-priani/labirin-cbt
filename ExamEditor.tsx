import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, Upload, Download, FileSpreadsheet, FileText as FileTextIcon,
  Trash2, CheckCircle2, AlertTriangle, Loader2, Copy, Check, Users, Radio, Image as ImageIcon,
  Edit3, EyeOff, Send, X,
} from 'lucide-react';
import {
  getExam, getExamQuestions, saveExamQuestions, publishExam,
  getClassTokens, addClassToken, watchExamSessions, updateExamQuestion, setExamSheetsWebhook,
  updateExam, unpublishExam, deleteExam,
} from '../services/customExamService';
import { parseQuestionFile, validateDraft } from '../utils/examFileParser';
import { uploadImageToCloudinary, validateImageFile } from '../utils/cloudinaryUpload';
import { RichTextEditor } from './RichTextEditor';
import { SavedQuestionCard } from './SavedQuestionCard';
import { exportResultsToExcel } from '../utils/examResultsExport';
import { APPS_SCRIPT_TEMPLATE } from '../utils/googleSheetsWebhook';
import { CLASS_NAMES, SUBJECTS } from '../data/schoolRoster';
import { downloadExcelTemplate, WORD_TEMPLATE_INSTRUCTIONS } from '../utils/examTemplate';
import type { CustomExamDoc, ClassTokenDoc, CustomQuestionDoc, DraftQuestion, CustomSessionDoc } from '../types/customExam';
import type { OptionKey } from '../types/exam';

interface Props {
  examId: string;
  onBack: () => void;
}

type Tab = 'soal' | 'kelas' | 'monitoring';

export const ExamEditor: React.FC<Props> = ({ examId, onBack }) => {
  const [exam, setExam] = useState<CustomExamDoc | null>(null);
  const [savedQuestions, setSavedQuestions] = useState<CustomQuestionDoc[]>([]);
  const [classTokens, setClassTokens] = useState<ClassTokenDoc[]>([]);
  const [drafts, setDrafts] = useState<DraftQuestion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [tab, setTab] = useState<Tab>('soal');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [sessions, setSessions] = useState<CustomSessionDoc[]>([]);
  const [monitoringError, setMonitoringError] = useState<string | null>(null);
  const [webhookInput, setWebhookInput] = useState('');
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [showAppsScript, setShowAppsScript] = useState(false);

  // Edit / Rename Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editDuration, setEditDuration] = useState(60);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Confirmation State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState(false);

  const load = async () => {
    setLoading(true);
    const [examData, questions, tokens] = await Promise.all([
      getExam(examId), getExamQuestions(examId), getClassTokens(examId),
    ]);
    setExam(examData);
    setSavedQuestions(questions);
    setClassTokens(tokens);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [examId]);

  useEffect(() => {
    if (exam?.sheetsWebhookUrl) setWebhookInput(exam.sheetsWebhookUrl);
  }, [exam]);

  useEffect(() => {
    if (tab !== 'monitoring' || !exam) return;
    setMonitoringError(null);
    const unsub = watchExamSessions(
      examId,
      exam.teacherId,
      setSessions,
      (err) => setMonitoringError(err.message)
    );
    return () => unsub();
  }, [tab, examId, exam]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError(null);
    setParsing(true);
    try {
      const parsed = await parseQuestionFile(file);
      if (parsed.length === 0) throw new Error('Tidak ada soal terbaca dari file ini. Cek kembali formatnya.');
      setDrafts(parsed);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Gagal membaca file');
    } finally {
      setParsing(false);
      e.target.value = '';
    }
  };

  const updateDraft = (tempId: string, patch: Partial<DraftQuestion>) => {
    setDrafts((prev) =>
      prev?.map((d) => {
        if (d.tempId !== tempId) return d;
        const updated = { ...d, ...patch };
        updated.error = validateDraft(updated);
        return updated;
      }) ?? null
    );
  };

  const removeDraft = (tempId: string) => {
    setDrafts((prev) => prev?.filter((d) => d.tempId !== tempId) ?? null);
  };

  const errorCount = drafts?.filter((d) => d.error).length ?? 0;

  const [publishError, setPublishError] = useState<string | null>(null);
  const [goldenPathCount, setGoldenPathCount] = useState<number | null>(null);
  const [explicitGoldenInput, setExplicitGoldenInput] = useState('');

  const handlePublish = async () => {
    if (!drafts || errorCount > 0) return;
    setPublishing(true);
    setPublishError(null);
    try {
      const toSave = drafts.map((d) => {
        const q: Record<string, unknown> = {
          order: d.order,
          question: d.question,
          options: d.options,
          correctAnswer: d.correctAnswer as OptionKey,
          explanation: d.explanation,
        };
        if (d.topic) q.topic = d.topic;
        if (d.imageUrl) q.imageUrl = d.imageUrl;
        return q as Omit<CustomQuestionDoc, 'id'>;
      });
      await saveExamQuestions(examId, toSave);
      const explicitOrders = explicitGoldenInput
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isInteger(n) && n > 0);
      await publishExam(examId, goldenPathCount ?? undefined, explicitOrders.length > 0 ? explicitOrders : undefined);
      setDrafts(null);
      await load();
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : 'Gagal menyimpan/publikasikan soal. Coba lagi.');
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveQuestionEdit = async (questionId: string, patch: Partial<Omit<CustomQuestionDoc, 'id'>>) => {
    await updateExamQuestion(examId, questionId, patch);
    // Regenerate the maze graph, preserving the EXACT same golden-path
    // question selection as before (by order number), so an edit to one
    // question's text/image doesn't accidentally reshuffle the whole maze.
    if (exam?.mazeGraph) {
      const questionsById = Object.fromEntries(savedQuestions.map((q) => [q.id, q]));
      const goldenOrders = exam.mazeGraph.goldenPath
        .map((id) => questionsById[id]?.order)
        .filter((o): o is number => o !== undefined);
      await publishExam(examId, goldenOrders.length, goldenOrders);
    }
    await load();
  };

  const handleSaveWebhook = async () => {
    await setExamSheetsWebhook(examId, webhookInput.trim());
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 2000);
    await load();
  };

  const [newTokenClass, setNewTokenClass] = useState('');

  const handleAddToken = async () => {
    if (!newTokenClass.trim()) return;
    await addClassToken(examId, newTokenClass.trim());
    setNewTokenClass('');
    const tokens = await getClassTokens(examId);
    setClassTokens(tokens);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam || !editTitle.trim() || !editSubject.trim()) {
      setEditError('Judul dan mata pelajaran tidak boleh kosong.');
      return;
    }
    setSavingEdit(true);
    setEditError(null);
    try {
      await updateExam(examId, {
        title: editTitle.trim(),
        subject: editSubject.trim(),
        durationMinutes: editDuration,
      });
      setShowEditModal(false);
      await load();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Gagal menyimpan perubahan');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteExam = async () => {
    setDeleting(true);
    try {
      await deleteExam(examId);
      setShowDeleteModal(false);
      onBack();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus ujian');
      setDeleting(false);
    }
  };

  if (loading || !exam) {
    return <div className="text-center py-20"><Loader2 className="w-6 h-6 animate-spin mx-auto text-stone-400" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{exam.title}</h1>
          <p className="text-sm text-stone-500">{exam.subject} &middot; {exam.durationMinutes} menit &middot;{' '}
            <span className={exam.status === 'published' ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
              {exam.status === 'published' ? 'Sudah Terbit' : 'Draft (Tidak Terbit)'}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditTitle(exam.title);
              setEditSubject(exam.subject);
              setEditDuration(exam.durationMinutes);
              setEditError(null);
              setShowEditModal(true);
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Ubah Info
          </button>

          {exam.status === 'published' ? (
            <button
              type="button"
              disabled={togglingPublish}
              onClick={async () => {
                setTogglingPublish(true);
                try {
                  await unpublishExam(examId);
                  await load();
                } catch (e) {
                  alert(e instanceof Error ? e.message : 'Gagal membatalkan publikasi');
                } finally {
                  setTogglingPublish(false);
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {togglingPublish ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <EyeOff className="w-3.5 h-3.5" />}
              Tarik / Jadikan Draft
            </button>
          ) : (
            <button
              type="button"
              disabled={togglingPublish || savedQuestions.length === 0}
              onClick={async () => {
                if (savedQuestions.length === 0) {
                  alert('Tambahkan soal terlebih dahulu sebelum menerbitkan.');
                  return;
                }
                setTogglingPublish(true);
                try {
                  await publishExam(examId);
                  await load();
                } catch (e) {
                  alert(e instanceof Error ? e.message : 'Gagal menerbitkan ujian');
                } finally {
                  setTogglingPublish(false);
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {togglingPublish ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Terbitkan Ujian
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            title="Hapus Ujian"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit">
        {(['soal', 'kelas', 'monitoring'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white shadow-sm text-emerald-800' : 'text-stone-500'}`}>
            {t === 'soal' ? 'Bank Soal' : t === 'kelas' ? 'Kelas & Token' : 'Monitoring Live'}
          </button>
        ))}
      </div>

      {tab === 'soal' && (
        <div className="space-y-4">
          {savedQuestions.length > 0 && !drafts && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-2 text-sm text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {savedQuestions.length} soal sudah tersimpan & terbit. Upload file baru di bawah untuk MENAMBAH (soal lama tetap ada), atau edit langsung di daftar berikut.
              </div>
              <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
                {savedQuestions
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((q) => (
                    <SavedQuestionCard key={q.id} question={q} onSave={(patch) => handleSaveQuestionEdit(q.id, patch)} />
                  ))}
              </div>
            </div>
          )}

          {!drafts && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
              <p className="text-sm font-semibold text-stone-700">1. Unduh template dulu (kalau belum punya)</p>
              <div className="flex gap-3">
                <button onClick={downloadExcelTemplate} className="flex items-center gap-2 text-sm px-4 py-2 border border-stone-300 rounded-xl hover:bg-stone-50">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" /> Template Excel
                </button>
                <button onClick={() => alert(WORD_TEMPLATE_INSTRUCTIONS)} className="flex items-center gap-2 text-sm px-4 py-2 border border-stone-300 rounded-xl hover:bg-stone-50">
                  <FileTextIcon className="w-4 h-4 text-emerald-700" /> Lihat Format Word
                </button>
              </div>

              <p className="text-sm font-semibold text-stone-700 pt-2">2. Upload file soal yang sudah diisi</p>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-stone-300 rounded-xl py-8 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors">
                {parsing ? <Loader2 className="w-6 h-6 animate-spin text-emerald-700" /> : <Upload className="w-6 h-6 text-stone-400" />}
                <span className="text-sm text-stone-500">{parsing ? 'Membaca file...' : 'Klik untuk pilih file .xlsx atau .docx'}</span>
                <input type="file" accept=".xlsx,.xls,.docx" className="hidden" onChange={handleFileUpload} disabled={parsing} />
              </label>
              {parseError && (
                <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {parseError}
                </p>
              )}
            </div>
          )}

          {drafts && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-stone-700">Preview {drafts.length} soal hasil parsing</p>
                <button onClick={() => setDrafts(null)} className="text-xs text-stone-500 hover:text-rose-600">Batalkan, upload ulang</button>
              </div>

              {errorCount > 0 && (
                <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> Ada {errorCount} soal bermasalah (ditandai merah). Perbaiki dulu sebelum publish.
                </p>
              )}

              <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-1">
                {drafts.map((d) => (
                  <div key={d.tempId} className={`bg-white border rounded-xl p-4 space-y-2 ${d.error ? 'border-rose-300' : 'border-stone-200'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-stone-400 mt-1.5">#{d.order}</span>
                      <div className="flex-1 space-y-2">
                        <RichTextEditor
                          value={d.question}
                          onChange={(html) => updateDraft(d.tempId, { question: html })}
                          placeholder="Tulis pertanyaan di sini..."
                          minRows={2}
                        />
                        {d.imageUrl && (
                          <div className="relative inline-block">
                            <img src={d.imageUrl} alt="Gambar soal" className="max-h-32 rounded-lg border border-stone-200" />
                            <button
                              onClick={() => updateDraft(d.tempId, { imageUrl: undefined })}
                              className="absolute -top-2 -right-2 bg-white border border-stone-300 rounded-full p-1 shadow-sm hover:bg-rose-50"
                              title="Hapus gambar"
                            >
                              <Trash2 className="w-3 h-3 text-rose-500" />
                            </button>
                          </div>
                        )}
                        {!d.imageUrl && <DraftImageUploadButton tempId={d.tempId} onUploaded={(url) => updateDraft(d.tempId, { imageUrl: url })} />}
                      </div>
                      <button onClick={() => removeDraft(d.tempId)} className="text-stone-400 hover:text-rose-600 mt-1.5">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-6">
                      {d.options.map((opt) => (
                        <label key={opt.key} className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg border ${d.correctAnswer === opt.key ? 'border-emerald-400 bg-emerald-50' : 'border-stone-200'}`}>
                          <input type="radio" checked={d.correctAnswer === opt.key} onChange={() => updateDraft(d.tempId, { correctAnswer: opt.key })} />
                          <span className="font-semibold">{opt.key}.</span> {opt.text}
                        </label>
                      ))}
                    </div>
                    <div className="pl-6">
                      <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">Pembahasan</label>
                      <RichTextEditor
                        value={d.explanation}
                        onChange={(html) => updateDraft(d.tempId, { explanation: html })}
                        placeholder="Penjelasan jawaban (opsional)..."
                        minRows={1}
                      />
                    </div>
                    {d.error && <p className="text-xs text-rose-600 pl-6">{d.error}</p>}
                  </div>
                ))}
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Jumlah soal di Golden Path (jalur utama)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={3}
                    max={Math.max(3, drafts.length - 2)}
                    value={goldenPathCount ?? Math.max(4, Math.round(drafts.length * 0.6))}
                    onChange={(e) => setGoldenPathCount(Number(e.target.value))}
                    className="w-24 px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                  <p className="text-xs text-stone-500">
                    dari {drafts.length} total soal. Sisanya ({drafts.length - (goldenPathCount ?? Math.max(4, Math.round(drafts.length * 0.6)))} soal) jadi kolam soal cabang saat siswa tersesat.
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-200">
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Atau pilih manual nomor soal untuk Golden Path (opsional)
                  </label>
                  <input
                    value={explicitGoldenInput}
                    onChange={(e) => setExplicitGoldenInput(e.target.value)}
                    placeholder="Contoh: 1,3,5,7,9,12,15,18,20,23,25,28,30"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono"
                  />
                  <p className="text-xs text-stone-500 mt-1">
                    Isi nomor soal (#) yang kamu mau jadi jalur utama, pisahkan pakai koma. Kalau diisi, ini akan dipakai (mengabaikan angka jumlah di atas). Kosongkan kalau mau otomatis.
                  </p>
                </div>
              </div>

              {publishError && (
                <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {publishError}
                </p>
              )}

              <button
                onClick={handlePublish}
                disabled={publishing || errorCount > 0 || drafts.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
              >
                {publishing && <Loader2 className="w-4 h-4 animate-spin" />} Simpan & Publikasikan {drafts.length} Soal
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'kelas' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <select value={newTokenClass} onChange={(e) => setNewTokenClass(e.target.value)} className="flex-1 px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white">
              <option value="">-- Pilih Kelas untuk Ditambahkan --</option>
              {CLASS_NAMES.filter((c) => !classTokens.some((t) => t.className === c)).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button onClick={handleAddToken} disabled={!newTokenClass} className="text-sm px-4 py-2 border border-stone-300 rounded-xl hover:bg-stone-50 disabled:opacity-40 whitespace-nowrap">
              + Tambah Kode
            </button>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl divide-y divide-stone-100">
            {classTokens.map((ct) => (
              <div key={ct.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-stone-700">
                  <Users className="w-4 h-4 text-emerald-700" /> {ct.className}
                </div>
                <button onClick={() => copyCode(ct.accessCode)} className="flex items-center gap-1.5 text-sm font-mono bg-stone-100 px-3 py-1.5 rounded-lg hover:bg-stone-200">
                  {ct.accessCode} {copiedCode === ct.accessCode ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'monitoring' && (
        <div className="space-y-3">
          <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-stone-700">Sinkron Otomatis ke Google Sheets (opsional)</p>
            <p className="text-[11px] text-stone-500">
              Hasil tiap murid akan otomatis terkirim ke Google Sheet-mu sendiri begitu mereka selesai ujian — tanpa perlu download apapun.{' '}
              <button onClick={() => setShowAppsScript((s) => !s)} className="text-emerald-700 underline">
                {showAppsScript ? 'Sembunyikan cara setup' : 'Lihat cara setup (1x saja)'}
              </button>
            </p>
            {showAppsScript && (
              <div className="bg-stone-900 text-stone-100 text-[11px] rounded-lg p-3 space-y-2">
                <p className="text-stone-300">Copy kode ini, ikuti instruksi di komentar paling atas:</p>
                <textarea readOnly value={APPS_SCRIPT_TEMPLATE} className="w-full h-32 bg-stone-950 text-emerald-300 font-mono text-[10px] p-2 rounded" onClick={(e) => (e.target as HTMLTextAreaElement).select()} />
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={webhookInput}
                onChange={(e) => setWebhookInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/xxx/exec"
                className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs"
              />
              <button onClick={handleSaveWebhook} className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg whitespace-nowrap">
                {webhookSaved ? 'Tersimpan ✓' : 'Simpan'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-500 flex items-center gap-1.5"><Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> Update otomatis, tidak perlu refresh.</p>
            <button
              onClick={() => exportResultsToExcel(exam.title, sessions, savedQuestions)}
              disabled={sessions.length === 0}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" /> Atau Download Excel
            </button>
          </div>
          {monitoringError && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {monitoringError}
            </p>
          )}
          {sessions.length === 0 ? (
            <p className="text-center text-stone-400 py-10 text-sm">Belum ada murid yang mengerjakan.</p>
          ) : (
            <div className="bg-white border border-stone-200 rounded-xl divide-y divide-stone-100">
              {sessions.map((s) => {
                const sessionTarget = exam.mazeGraph?.goldenPath.length || s.totalQuestions;
                const pct = sessionTarget ? Math.round((s.answeredCount / sessionTarget) * 100) : 0;
                return (
                  <div key={s.id} className="px-4 py-3 space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-stone-800">{s.studentName} <span className="text-stone-400 font-normal">&middot; {s.studentClass}</span></span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        s.status === 'submitted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.status === 'submitted' ? `Selesai (${s.score})` : 'Mengerjakan'}
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>{s.answeredCount}/{sessionTarget} soal</span>
                      {s.violationsCount > 0 && <span className="text-rose-500">{s.violationsCount} pelanggaran</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal Edit / Rename Ujian */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-700" /> Ubah Info Ujian
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-stone-400 hover:text-stone-600 p-1 rounded-lg">
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
                  onClick={() => setShowEditModal(false)}
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
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-stone-900 text-base">Hapus Ujian Ini?</h3>
              <p className="text-xs text-stone-500">
                Anda akan menghapus ujian <strong>"{exam.title}"</strong>. Seluruh soal, token kelas, dan riwayat pengerjaan siswa pada ujian ini akan dihapus permanen.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteExam}
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

const DraftImageUploadButton: React.FC<{ tempId: string; onUploaded: (url: string) => void }> = ({ onUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) { setError(validationError); return; }
    setError(null);
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onUploaded(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 cursor-pointer">
        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
        {uploading ? 'Mengupload...' : 'Tambah gambar untuk soal ini'}
        <input type="file" accept="image/*" className="hidden" onChange={handlePick} disabled={uploading} />
      </label>
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
};
