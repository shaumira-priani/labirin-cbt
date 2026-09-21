import React, { useState } from 'react';
import { BiogeographicZone, LevelConfig } from '../types/kehati';
import { ORGANISMS_DATABASE } from '../data/kehatiData';
import { Sliders, Play, Sparkles, Shield, Compass, MapPin } from 'lucide-react';

interface CustomMazeBuilderProps {
  onPlayCustomMaze: (customLevel: LevelConfig) => void;
}

export const CustomMazeBuilder: React.FC<CustomMazeBuilderProps> = ({ onPlayCustomMaze }) => {
  const [title, setTitle] = useState<string>('Ekosistem Kustom Penjelajah');
  const [zone, setZone] = useState<BiogeographicZone>('Oriental');
  const [width, setWidth] = useState<number>(13);
  const [height, setHeight] = useState<number>(11);
  const [specimenCount, setSpecimenCount] = useState<number>(4);
  const [questionCount, setQuestionCount] = useState<number>(3);

  const handleLaunch = () => {
    const customConfig: LevelConfig = {
      id: `custom-${Date.now()}`,
      title: title.trim() || 'Labirin Konservasi Kustom',
      subtitle: `Zona ${zone} - Kustomisasi Mandiri`,
      zone,
      themeColor: '#10B981',
      badge: '🛠️ Labirin Kustom',
      description: `Labirin eksplorasi kustom dengan ${specimenCount} spesimen flora/fauna dan ${questionCount} checkpoint kuis biologi.`,
      mazeSize: { width, height },
      targetSpecimens: specimenCount,
      targetQuestions: questionCount,
      unlockedByDefault: true
    };
    onPlayCustomMaze(customConfig);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 text-stone-100 animate-in fade-in duration-300">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8">
        <div className="text-xs uppercase font-bold tracking-wider text-teal-400 flex items-center gap-1.5 mb-1">
          <Sliders className="w-4 h-4" />
          Laboratorium Kreator
        </div>
        <h2 className="text-2xl font-bold text-stone-100">
          Rancang Labirin Kehati Sendiri
        </h2>
        <p className="text-stone-400 text-xs sm:text-sm mt-1">
          Buat tantangan labirin edukasi keanekaragaman hayati sesuai keinginan untuk latihan kelas, olimpiade biologi, atau tantangan mandiri.
        </p>
      </div>

      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-6 shadow-xl">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-300">Nama Labirin / Misi</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
            placeholder="Contoh: Ekspedisi Hutan Karst Maros"
          />
        </div>

        {/* Bioregion selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-300">Pilih Bioregion / Zona</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { z: 'Oriental' as BiogeographicZone, label: 'Oriental (Asiatis)', icon: '🐅' },
              { z: 'Peralihan' as BiogeographicZone, label: 'Peralihan (Wallacea)', icon: '🦎' },
              { z: 'Australis' as BiogeographicZone, label: 'Australis (Sahul)', icon: '🦜' },
              { z: 'Bahari' as BiogeographicZone, label: 'Bahari (Laut/Pesisir)', icon: '🪸' },
            ].map(item => (
              <button
                key={item.z}
                type="button"
                onClick={() => setZone(item.z)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center text-center gap-1.5 ${
                  zone === item.z
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:bg-stone-800'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-medium leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid dimensions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-stone-300">
              <span>Lebar Labirin:</span>
              <span className="font-mono font-bold text-emerald-400">{width} Blok</span>
            </div>
            <input
              type="range"
              min={9}
              max={21}
              step={2}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-stone-300">
              <span>Tinggi Labirin:</span>
              <span className="font-mono font-bold text-emerald-400">{height} Blok</span>
            </div>
            <input
              type="range"
              min={7}
              max={15}
              step={2}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Items configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-stone-300">
              <span>Jumlah Spesimen Flora/Fauna:</span>
              <span className="font-mono font-bold text-teal-400">{specimenCount} Spesies</span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              value={specimenCount}
              onChange={(e) => setSpecimenCount(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-stone-300">
              <span>Jumlah Checkpoint Soal:</span>
              <span className="font-mono font-bold text-amber-400">{questionCount} Soal</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Action */}
        <div className="pt-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={handleLaunch}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950"
          >
            <Play className="w-4 h-4 fill-current" />
            Bangun & Mainkan Labirin
          </button>
        </div>
      </div>
    </div>
  );
};
