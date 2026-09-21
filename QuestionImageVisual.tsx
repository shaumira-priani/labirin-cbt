import React, { useState } from 'react';
import { Layers, Navigation, ShieldAlert, ShieldCheck, ZoomIn, X, ImageOff } from 'lucide-react';

interface QuestionImageVisualProps {
  imageType?: 'cat_variety' | 'panthera_species' | 'biogeography_map' | 'forest_road_fragmentation' | 'insitu_exsitu_conservation';
  imageUrl?: string;
  images?: { label: string; url: string; caption?: string }[];
  caption?: string;
}

export const QuestionImageVisual: React.FC<QuestionImageVisualProps> = ({
  imageType,
  imageUrl,
  images,
  caption
}) => {
  const [zoomImg, setZoomImg] = useState<{ url: string; title: string } | null>(null);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});

  const handleImageError = (url: string) => {
    setFailedUrls((prev) => ({ ...prev, [url]: true }));
  };

  if (!imageType && !imageUrl && (!images || images.length === 0)) return null;

  return (
    <div className="my-5 rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden shadow-xs">
      {/* CASE 1: Multiple Images (e.g. Soal 5: Taman Nasional Komodo & Kebun Raya Bogor) */}
      {images && images.length > 0 && (
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
            <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Perbandingan Program Konservasi Keanekaragaman Hayati
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              In-Situ &amp; Ex-Situ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((imgItem, idx) => {
              const isError = failedUrls[imgItem.url];
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs flex flex-col group"
                >
                  <div className="px-3.5 py-2 bg-stone-100/90 border-b border-stone-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">
                      {imgItem.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomImg({ url: imgItem.url, title: imgItem.label })}
                      className="text-stone-500 hover:text-emerald-800 text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Perbesar</span>
                    </button>
                  </div>

                  <div className="relative w-full h-48 sm:h-56 bg-stone-100 flex items-center justify-center overflow-hidden">
                    {!isError ? (
                      <img
                        src={imgItem.url}
                        alt={imgItem.label}
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(imgItem.url)}
                        onClick={() => setZoomImg({ url: imgItem.url, title: imgItem.label })}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-stone-400 text-center">
                        <ImageOff className="w-8 h-8 mb-1 text-stone-300" />
                        <span className="text-xs font-medium text-stone-500">{imgItem.label}</span>
                        <span className="text-[10px] text-stone-400">Pratinjau visual gambar</span>
                      </div>
                    )}
                  </div>

                  {imgItem.caption && (
                    <div className="p-2.5 bg-stone-50 text-[11px] text-stone-600 border-t border-stone-100">
                      {imgItem.caption}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CASE 2: Single Direct Image URL (Soal 1, 2, 3, 4) */}
      {imageUrl && (!images || images.length === 0) && (
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3.5">
            <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              {imageType === 'cat_variety' && <Layers className="w-4 h-4 text-emerald-700" />}
              {imageType === 'panthera_species' && <Layers className="w-4 h-4 text-amber-700" />}
              {imageType === 'biogeography_map' && <Navigation className="w-4 h-4 text-blue-700" />}
              {imageType === 'forest_road_fragmentation' && <ShieldAlert className="w-4 h-4 text-rose-600" />}
              <span>
                {imageType === 'cat_variety' && 'Gambar: Variasi Fenotipe dalam Satu Spesies Kucing (Felis catus)'}
                {imageType === 'panthera_species' && 'Gambar: Perbandingan Spesies Berbeda Famili Felidae (Genus Panthera)'}
                {imageType === 'biogeography_map' && 'Gambar: Peta Garis Biogeografi Indonesia (Angka 1 & Angka 2)'}
                {imageType === 'forest_road_fragmentation' && 'Gambar: Foto Udara Pembukaan Jalan yang Membelah Hutan Alam'}
                {!imageType && 'Ilustrasi Soal'}
              </span>
            </span>

            <button
              type="button"
              onClick={() => setZoomImg({ url: imageUrl, title: caption || 'Pratinjau Gambar Soal' })}
              className="text-stone-500 hover:text-emerald-800 text-xs font-medium inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Perbesar Gambar</span>
            </button>
          </div>

          <div className="relative w-full rounded-xl overflow-hidden bg-white border border-stone-200 shadow-2xs flex items-center justify-center min-h-[220px] max-h-[380px] group">
            {!failedUrls[imageUrl] ? (
              <img
                src={imageUrl}
                alt={caption || 'Gambar Pendukung Soal'}
                referrerPolicy="no-referrer"
                onError={() => handleImageError(imageUrl)}
                onClick={() => setZoomImg({ url: imageUrl, title: caption || 'Gambar Soal' })}
                className="w-full h-auto max-h-[360px] object-contain object-center group-hover:scale-[1.01] transition-transform duration-200 cursor-zoom-in"
                loading="eager"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-stone-400 text-center">
                <ImageOff className="w-10 h-10 mb-2 text-stone-300" />
                <span className="text-xs font-semibold text-stone-600">Gambar Referensi Soal</span>
                <span className="text-[11px] text-stone-400 mt-0.5">{caption}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Caption footer */}
      {caption && (
        <div className="px-4 py-2.5 bg-stone-100/80 border-t border-stone-200 text-center text-xs text-stone-600 font-medium">
          {caption}
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      {zoomImg && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          onClick={() => setZoomImg(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-stone-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 bg-stone-950 border-b border-stone-800 text-white">
              <span className="text-sm font-semibold truncate pr-4">{zoomImg.title}</span>
              <button
                type="button"
                onClick={() => setZoomImg(null)}
                className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title="Tutup Pratinjau (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 bg-stone-900 overflow-auto flex items-center justify-center">
              <img
                src={zoomImg.url}
                alt={zoomImg.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
