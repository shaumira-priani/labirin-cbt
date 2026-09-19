import React, { useState } from 'react';
import { Organism, BiogeographicZone, BiodiversityLevel } from '../types/kehati';
import { ORGANISMS_DATABASE } from '../data/kehatiData';
import { EncyclopediaModal } from './EncyclopediaModal';
import { Search, Filter, BookOpen, MapPin, Sparkles, Layers, ShieldCheck } from 'lucide-react';

export const CodexView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<BiogeographicZone | 'Semua'>('Semua');
  const [selectedLevel, setSelectedLevel] = useState<BiodiversityLevel | 'Semua'>('Semua');
  const [selectedOrganism, setSelectedOrganism] = useState<Organism | null>(null);

  const filteredOrganisms = ORGANISMS_DATABASE.filter(org => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.habitat.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesZone = selectedZone === 'Semua' || org.zone === selectedZone;
    const matchesLevel = selectedLevel === 'Semua' || org.level === selectedLevel;

    return matchesSearch && matchesZone && matchesLevel;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 text-stone-100 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
            <BookOpen className="w-4 h-4" />
            Ensiklopedia Hayati Indonesia
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100">
            Kodeks Flora & Fauna Kehati
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm max-w-xl mt-1">
            Kumpulan komprehensif keanekaragaman hayati Indonesia (Tingkat Gen, Spesies, Ekosistem) di sepanjang Garis Wallace, Garis Weber, dan Laut Nusantara.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto text-xs font-mono bg-stone-950/80 p-3 rounded-2xl border border-stone-800">
          <div className="text-center px-2">
            <div className="text-lg font-bold text-emerald-400">{ORGANISMS_DATABASE.length}</div>
            <div className="text-stone-500 text-[10px]">Total Spesies</div>
          </div>
          <div className="w-px h-8 bg-stone-800" />
          <div className="text-center px-2">
            <div className="text-lg font-bold text-teal-400">4</div>
            <div className="text-stone-500 text-[10px]">Bioregion</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama spesies, latin, atau habitat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Zone Filter */}
        <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-xl px-3 py-1">
          <MapPin className="w-4 h-4 text-stone-500 shrink-0" />
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value as any)}
            className="w-full bg-transparent text-xs text-stone-300 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="Semua" className="bg-stone-900 text-stone-300">Semua Zona Wilayah</option>
            <option value="Oriental" className="bg-stone-900 text-stone-300">Zona Oriental (Asiatis)</option>
            <option value="Peralihan" className="bg-stone-900 text-stone-300">Zona Peralihan (Wallacea)</option>
            <option value="Australis" className="bg-stone-900 text-stone-300">Zona Australis (Papua/Maluku)</option>
            <option value="Bahari" className="bg-stone-900 text-stone-300">Zona Bahari & Pesisir</option>
          </select>
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-xl px-3 py-1">
          <Layers className="w-4 h-4 text-stone-500 shrink-0" />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as any)}
            className="w-full bg-transparent text-xs text-stone-300 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="Semua" className="bg-stone-900 text-stone-300">Semua Tingkat Kehati</option>
            <option value="Gen" className="bg-stone-900 text-stone-300">Tingkat Genetik</option>
            <option value="Spesies" className="bg-stone-900 text-stone-300">Tingkat Spesies / Jenis</option>
            <option value="Ekosistem" className="bg-stone-900 text-stone-300">Tingkat Ekosistem</option>
          </select>
        </div>
      </div>

      {/* Grid of Organisms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredOrganisms.map((org) => {
          return (
            <div
              key={org.id}
              onClick={() => setSelectedOrganism(org)}
              className="bg-stone-900/80 border border-stone-800 hover:border-emerald-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="text-3xl p-2.5 bg-stone-950 rounded-xl border border-stone-800 group-hover:scale-110 transition-transform">
                    {org.icon}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-medium border border-stone-700 bg-stone-800 text-stone-300">
                    {org.zone}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-100 group-hover:text-emerald-300 transition-colors">
                  {org.name}
                </h3>
                <p className="text-[11px] italic text-stone-400 font-mono line-clamp-1 mb-2">
                  {org.scientificName}
                </p>

                <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                  {org.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
                <span className="text-stone-500">Tingkat {org.level}</span>
                <span className="text-emerald-400 font-medium group-hover:underline flex items-center gap-1">
                  Detail <Sparkles className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOrganisms.length === 0 && (
        <div className="text-center py-16 bg-stone-900/40 border border-stone-800 rounded-2xl">
          <BookOpen className="w-8 h-8 text-stone-600 mx-auto mb-2" />
          <h4 className="text-stone-300 font-bold text-sm">Tidak Ditemukan Spesimen</h4>
          <p className="text-xs text-stone-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter wilayah.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrganism && (
        <EncyclopediaModal
          organism={selectedOrganism}
          onClose={() => setSelectedOrganism(null)}
          isNewDiscovery={false}
        />
      )}
    </div>
  );
};
