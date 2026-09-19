import React, { useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Table as TableIcon, Sigma, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImageToCloudinary, validateImageFile } from '../utils/cloudinaryUpload';

interface Props {
  value: string; // HTML
  onChange: (html: string) => void;
  placeholder?: string;
  minRows?: number;
}

/**
 * A minimal contentEditable-based rich text editor. Deliberately avoids a
 * heavy dependency (TipTap/Quill) so it works reliably without extra build
 * config. Supports: bold, italic, underline, a basic table, inline "LaTeX"
 * equations (wrapped as $...$ and rendered live via KaTeX), and images
 * uploaded straight to Cloudinary.
 */
export const RichTextEditor: React.FC<Props> = ({ value, onChange, placeholder, minRows = 3 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Keep the DOM in sync when `value` changes externally (e.g. after parsing a file)
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const insertTable = () => {
    const rows = Number(prompt('Jumlah baris tabel?', '2')) || 2;
    const cols = Number(prompt('Jumlah kolom tabel?', '2')) || 2;
    let tableHtml = '<table style="border-collapse:collapse;width:100%;margin:8px 0">';
    for (let r = 0; r < rows; r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < cols; c++) {
        tableHtml += '<td style="border:1px solid #d6d3d1;padding:6px 8px;min-width:60px">&nbsp;</td>';
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</table><p><br></p>';
    exec('insertHTML', tableHtml);
  };

  const insertEquation = () => {
    const latex = prompt('Tulis rumus (format LaTeX), contoh: \\frac{a}{b} atau x^2 + y^2 = z^2');
    if (!latex) return;
    exec('insertHTML', `<span class="katex-eq" data-latex="${encodeURIComponent(latex)}">$${latex}$</span>&nbsp;`);
  };

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) { setError(validationError); return; }
    setError(null);
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      exec('insertHTML', `<img src="${url}" style="max-width:100%;border-radius:8px;margin:8px 0" /><p><br></p>`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gambar gagal');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-stone-300 rounded-xl overflow-hidden">
      <div className="flex items-center gap-1 bg-stone-50 border-b border-stone-200 px-2 py-1.5">
        <button type="button" onClick={() => exec('bold')} className="p-1.5 rounded hover:bg-stone-200" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => exec('italic')} className="p-1.5 rounded hover:bg-stone-200" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => exec('underline')} className="p-1.5 rounded hover:bg-stone-200" title="Underline"><Underline className="w-3.5 h-3.5" /></button>
        <div className="w-px h-4 bg-stone-300 mx-1" />
        <button type="button" onClick={insertTable} className="p-1.5 rounded hover:bg-stone-200" title="Sisipkan Tabel"><TableIcon className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={insertEquation} className="p-1.5 rounded hover:bg-stone-200" title="Sisipkan Rumus/Equation"><Sigma className="w-3.5 h-3.5" /></button>
        <label className="p-1.5 rounded hover:bg-stone-200 cursor-pointer" title="Sisipkan Gambar">
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
          <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} disabled={uploading} />
        </label>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => ref.current && onChange(ref.current.innerHTML)}
        data-placeholder={placeholder}
        className="px-3 py-2 text-sm outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-stone-400"
        style={{ minHeight: `${minRows * 1.5}rem` }}
      />
      {error && <p className="text-xs text-rose-600 px-3 pb-2">{error}</p>}
    </div>
  );
};
