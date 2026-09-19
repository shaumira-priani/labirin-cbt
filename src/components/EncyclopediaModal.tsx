import React from 'react';
import { Organism } from '../types/kehati';
import { X, Sparkles, MapPin, AlertTriangle, ShieldCheck, BookOpen, Volume2 } from 'lucide-react';

interface EncyclopediaModalProps {
  organism: Organism | null;
  onClose: () => void;
  isNewDiscovery?: boolean;
}

export const EncyclopediaModal: React.FC<EncyclopediaModalProps> = ({
  organism,
  onClose,
  isNewDiscovery = false
}) => {
  if (!organism) return null;

  const getStatusBadgeColor = (status: string) => {
    if (status.includes('CR')) return 'bg-red-900/40 text-red-300 border-red-700/50';
    if (status.includes('EN')) return 'bg-amber-900/40 text-amber-300 border-amber-700/50';
    if (status.includes('VU')) return 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50';
    return 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50';
  };

  const getZoneBadgeColor = (zone: string) => {
    switch (zone) {
      case 'Oriental': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Peralihan': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Australis': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Bahari': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      default: return 'bg-slate-700 text-slate-200 border-slate-600';
    }
  };

  const speakInfo = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${organism.name}. Nama ilmiah: ${organism.scientificName}. ${organism.description} Tahukah kamu: ${organism.funFact}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[90vh]">
        {/* Header Ribbon */}
        <div className="relative bg-gradient-to-r from-emerald-900/80 via-teal-900/80 to-stone-900 p-5 border-b border-stone-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl p-3 bg-stone-800/80 rounded-2xl border border-stone-700/60 shadow-inner flex items-center justify-center">
              {organism.icon}
            </div>
            <div>
              {isNewDiscovery && (
                <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-stone-950 mb-1">
                  <Sparkles className="w-3 h-3" />
                  Spesimen Baru Ditemukan!
                </div>
              )}
              <h2 className="text-xl font-bold text-emerald-100 tracking-tight">{organism.name}</h2>
              <p className="text-xs italic text-stone-400 font-mono">{organism.scientificName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={speakInfo}
              className="p-2 text-stone-400 hover:text-emerald-300 hover:bg-stone-800 rounded-lg transition-colors"
              title="Dengarkan Penjelasan Suara"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Badges Bar */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-2.5 bg-stone-950/60 border-b border-stone-800/80 text-xs">
          <span className={`px-2.5 py-1 rounded-md border font-medium ${getZoneBadgeColor(organism.zone)}`}>
            Zona {organism.zone}
          </span>
          <span className="px-2.5 py-1 rounded-md border border-stone-700 bg-stone-800/60 text-stone-300">
            Tingkat Kehati: {organism.level}
          </span>
          <span className={`px-2.5 py-1 rounded-md border font-medium ${getStatusBadgeColor(organism.status)}`}>
            Status IUCN: {organism.status}
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-sm leading-relaxed">
          {/* Habitat */}
          <div className="flex items-start gap-2.5 text-stone-300 bg-stone-800/40 p-3 rounded-xl border border-stone-800">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-200">Habitat Alami:</span> {organism.habitat}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              Morfologi & Peran Ekologis
            </h4>
            <p className="text-stone-300 bg-stone-950/40 p-3 rounded-xl border border-stone-800/60">
              {organism.description}
            </p>
          </div>

          {/* Fakta Unik */}
          <div className="bg-emerald-950/30 border border-emerald-800/40 p-3.5 rounded-xl">
            <h4 className="text-xs uppercase font-bold tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Tahukah Kamu? (Fakta Unik)
            </h4>
            <p className="text-emerald-100/90 text-xs leading-relaxed">
              {organism.funFact}
            </p>
          </div>

          {/* Ancaman & Upaya Konservasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-red-950/20 border border-red-900/30 p-3 rounded-xl">
              <div className="text-xs font-semibold text-red-300 flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                Ancaman Populasi
              </div>
              <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
                {organism.threats.map((threat, idx) => (
                  <li key={idx} className="text-stone-300">{threat}</li>
                ))}
              </ul>
            </div>

            <div className="bg-teal-950/20 border border-teal-900/30 p-3 rounded-xl">
              <div className="text-xs font-semibold text-teal-300 flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Upaya Konservasi
              </div>
              <p className="text-xs text-stone-300">
                {organism.conservationEffort}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold text-sm transition-colors cursor-pointer"
          >
            Lanjutkan Penjelajahan
          </button>
        </div>
      </div>
    </div>
  );
};
