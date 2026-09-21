import React, { useRef } from 'react';
import { X, Printer, Award, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  playerName: string;
  score: number;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  playerName,
  score,
  onClose
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[95vh]">
        {/* Top bar controls */}
        <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Award className="w-4 h-4" />
            Piagam Prestasi Konservasi Kehati
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-6 overflow-y-auto bg-stone-950 flex justify-center">
          <div
            ref={certRef}
            className="w-full bg-[#fcfaf2] text-[#1c1917] p-8 sm:p-12 rounded-2xl border-8 border-double border-[#064e3b] shadow-2xl relative flex flex-col items-center text-center select-none"
            style={{ minHeight: '440px' }}
          >
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 text-emerald-800 text-lg">🌿</div>
            <div className="absolute top-3 right-3 text-emerald-800 text-lg">🌿</div>
            <div className="absolute bottom-3 left-3 text-emerald-800 text-lg">🪸</div>
            <div className="absolute bottom-3 right-3 text-emerald-800 text-lg">🪸</div>

            {/* Emblem */}
            <div className="w-14 h-14 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center text-2xl mb-3 shadow-md">
              👑
            </div>

            <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-emerald-900 mb-1">
              PIAGAM PENGHARGAAN KONSERVASI
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
              PENJELAJAH KEHATI NUSANTARA
            </h1>

            <p className="text-xs text-stone-600 mt-2 max-w-md">
              Piagam ini dengan bangga dianugerahkan kepada:
            </p>

            {/* Name */}
            <div className="text-xl sm:text-2xl font-bold text-emerald-900 font-serif border-b-2 border-emerald-800/40 pb-1 px-8 my-3 inline-block">
              {playerName || 'Penjelajah Muda Kehati'}
            </div>

            <p className="text-xs text-stone-700 max-w-lg leading-relaxed mb-4">
              Telah berhasil menyelesaikan rangkaian penjelajahan ekosistem, menuntaskan labirin keanekaragaman hayati, dan membuktikan penguasaan konsep biosfer Indonesia dengan skor prestasi:
            </p>

            <div className="px-4 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-full font-mono font-bold text-sm mb-6">
              Nilai Kelulusan: {score}% (Kompeten)
            </div>

            {/* Signature row */}
            <div className="w-full flex items-end justify-between pt-6 border-t border-stone-300 text-xs text-stone-600 mt-auto">
              <div className="text-left">
                <div>Tanggal Terbit:</div>
                <div className="font-semibold text-stone-800">{currentDate}</div>
              </div>

              <div className="text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-600 text-amber-700 flex items-center justify-center text-sm font-bold mb-1">
                  SEAL
                </div>
                <div className="text-[10px] text-stone-500">Terverifikasi Resmi</div>
              </div>

              <div className="text-right">
                <div>Direktorat Konservasi</div>
                <div className="font-semibold text-stone-800">Labirin Kehati Edu</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
