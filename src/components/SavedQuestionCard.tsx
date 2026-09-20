import React, { useState } from 'react';
import { Pencil, X, Save, Loader2, Trash2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { uploadImageToCloudinary, validateImageFile } from '../utils/cloudinaryUpload';
import { renderRichContent } from '../utils/richContentRender';
import type { CustomQuestionDoc } from '../types/customExam';
import type { OptionKey } from '../types/exam';

interface Props {
  question: CustomQuestionDoc;
  onSave: (patch: Partial<Omit<CustomQuestionDoc, 'id'>>) => Promise<void>;
}

export const SavedQuestionCard: React.FC<Props> = ({ question, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [draftQuestion, setDraftQuestion] = useState(question.question);
  const [draftExplanation, setDraftExplanation] = useState(question.explanation);
  const [draftOptions, setDraftOptions] = useState(question.options);
  const [draftCorrect, setDraftCorrect] = useState<OptionKey>(question.correctAnswer);
  const [draftTopic, setDraftTopic] = useState(question.topic ?? '');
  const [draftImageUrl, setDraftImageUrl] = useState(question.imageUrl);

  const startEdit = () => {
    setDraftQuestion(question.question);
    setDraftExplanation(question.explanation);
    setDraftOptions(question.options);
    setDraftCorrect(question.correctAnswer);
    setDraftTopic(question.topic ?? '');
    setDraftImageUrl(question.imageUrl);
    setError(null);
    setEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const v = validateImageFile(file);
    if (v) { setError(v); return; }
    setUploadingImg(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setDraftImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gagal');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSave = async () => {
    if (/<img[^>]+src="data:/.test(draftQuestion)) {
      setError('Ada gambar ter-paste mentah. Hapus dan pakai tombol upload gambar.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        question: draftQuestion,
        explanation: draftExplanation,
        options: draftOptions,
        correctAnswer: draftCorrect,
        topic: draftTopic || undefined,
        imageUrl: draftImageUrl,
      });
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-bold text-stone-400 mt-0.5">#{question.order}</span>
          <div className="flex-1 text-sm text-stone-800" dangerouslySetInnerHTML={{ __html: renderRichContent(question.question) }} />
          <button onClick={startEdit} className="text-stone-400 hover:text-emerald-700 shrink-0" title="Edit soal">
            <Pencil className="w-4 h-4" />
          </button>
        </div>
        {question.imageUrl && <img src={question.imageUrl} alt="Gambar soal" className="max-h-24 rounded-lg border border-stone-200 ml-6" />}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-6 text-xs text-stone-500">
          {question.options.map((o) => (
            <span key={o.key} className={o.key === question.correctAnswer ? 'text-emerald-700 font-semibold' : ''}>
              {o.key}. {o.text}
            </span>
          ))}
        </div>
        {question.topic && <p className="text-[11px] text-stone-400 pl-6">Topik: {question.topic}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-emerald-300 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-400">#{question.order} (mengedit)</span>
        <button onClick={() => setEditing(false)} className="text-stone-400 hover:text-rose-600"><X className="w-4 h-4" /></button>
      </div>

      <RichTextEditor value={draftQuestion} onChange={setDraftQuestion} placeholder="Pertanyaan..." minRows={2} />

      {draftImageUrl ? (
        <div className="relative inline-block">
          <img src={draftImageUrl} alt="Gambar soal" className="max-h-32 rounded-lg border border-stone-200" />
          <button onClick={() => setDraftImageUrl(undefined)} className="absolute -top-2 -right-2 bg-white border border-stone-300 rounded-full p-1 shadow-sm hover:bg-rose-50">
            <Trash2 className="w-3 h-3 text-rose-500" />
          </button>
        </div>
      ) : (
        <label className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 cursor-pointer">
          {uploadingImg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          {uploadingImg ? 'Mengupload...' : 'Tambah gambar'}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImg} />
        </label>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {draftOptions.map((opt) => (
          <label key={opt.key} className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg border ${draftCorrect === opt.key ? 'border-emerald-400 bg-emerald-50' : 'border-stone-200'}`}>
            <input type="radio" checked={draftCorrect === opt.key} onChange={() => setDraftCorrect(opt.key)} />
            <span className="font-semibold">{opt.key}.</span>
            <input
              value={opt.text}
              onChange={(e) => setDraftOptions((prev) => prev.map((o) => (o.key === opt.key ? { ...o, text: e.target.value } : o)))}
              className="flex-1 bg-transparent outline-none"
            />
          </label>
        ))}
      </div>

      <div>
        <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">Pembahasan</label>
        <RichTextEditor value={draftExplanation} onChange={setDraftExplanation} minRows={1} />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">Topik</label>
        <input value={draftTopic} onChange={(e) => setDraftTopic(e.target.value)} className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-sm" />
      </div>

      {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 rounded-xl text-sm disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Perubahan
      </button>
    </div>
  );
};
