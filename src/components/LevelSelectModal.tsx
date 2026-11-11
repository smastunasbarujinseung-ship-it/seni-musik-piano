import React, { useState } from 'react';
import { Composition, ChallengeScore } from '../types/music';
import { ALL_COMPOSITIONS } from '../data/compositions';
import { X, Star, Play, Music, Sparkles } from 'lucide-react';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComposition: (comp: Composition) => void;
  selectedCompositionId: string;
  savedScores: Record<string, ChallengeScore>;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectComposition,
  selectedCompositionId,
  savedScores,
}) => {
  const [activeTabLevel, setActiveTabLevel] = useState<1 | 2 | 3>(1);

  if (!isOpen) return null;

  const currentLevelCompositions = ALL_COMPOSITIONS.filter(c => c.level === activeTabLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/80 backdrop-blur-md">
      <div className="bg-stone-900 border-2 border-teal-600/80 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-teal-950 via-teal-900 to-emerald-950 px-6 py-3.5 border-b border-teal-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-teal-950">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                SD TERAMIA · Seni Musik Kelas V SD
              </div>
              <h2 className="text-xl font-extrabold text-white font-display">
                PILIH LEVEL & TANTANGAN MUSIK (30 KOMPOSISI)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Tabs (All 3 Unlocked!) */}
        <div className="flex items-center gap-2 p-3 bg-stone-950 border-b border-stone-800 px-6">
          <button
            onClick={() => setActiveTabLevel(1)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between ${
              activeTabLevel === 1
                ? 'bg-teal-700 text-white shadow ring-2 ring-teal-400'
                : 'bg-stone-900 text-stone-400 hover:bg-stone-850 hover:text-stone-200'
            }`}
          >
            <div>
              <div className="text-amber-300 font-extrabold">LEVEL 1</div>
              <div className="font-semibold text-sm">Petualangan Nada Ceria</div>
            </div>
            <span className="text-[11px] font-mono opacity-80">10 Lagu · C4–G4</span>
          </button>

          <button
            onClick={() => setActiveTabLevel(2)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between ${
              activeTabLevel === 2
                ? 'bg-teal-700 text-white shadow ring-2 ring-teal-400'
                : 'bg-stone-900 text-stone-400 hover:bg-stone-850 hover:text-stone-200'
            }`}
          >
            <div>
              <div className="text-amber-300 font-extrabold">LEVEL 2</div>
              <div className="font-semibold text-sm">Petualangan Irama</div>
            </div>
            <span className="text-[11px] font-mono opacity-80">10 Lagu · C4–C5</span>
          </button>

          <button
            onClick={() => setActiveTabLevel(3)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between ${
              activeTabLevel === 3
                ? 'bg-teal-700 text-white shadow ring-2 ring-teal-400'
                : 'bg-stone-900 text-stone-400 hover:bg-stone-850 hover:text-stone-200'
            }`}
          >
            <div>
              <div className="text-amber-300 font-extrabold">LEVEL 3</div>
              <div className="font-semibold text-sm">Petualangan Musik Hebat</div>
            </div>
            <span className="text-[11px] font-mono opacity-80">10 Lagu · Dinamika & Ekspresi</span>
          </button>
        </div>

        {/* 10 Challenges Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-stone-900/60">
          {currentLevelCompositions.map((comp) => {
            const scoreRecord = savedScores[comp.id];
            const isSelected = comp.id === selectedCompositionId;

            return (
              <div
                key={comp.id}
                onClick={() => {
                  onSelectComposition(comp);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-950/90 border-teal-400 ring-2 ring-teal-500 shadow-lg'
                    : 'bg-stone-950/70 border-stone-800 hover:border-teal-700 hover:bg-stone-850/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-amber-400/40">
                        Tantangan #{comp.challengeNumber}
                      </span>
                      <span className="text-stone-400 text-xs font-mono">
                        {comp.tempo} BPM · 10 Bar
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white font-display">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-stone-300 mt-0.5">
                      {comp.subtitle}
                    </p>
                  </div>

                  {/* Stars if completed */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-4 h-4 ${
                          scoreRecord && scoreRecord.stars >= starIdx
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 mt-2">
                  <div className="text-xs text-stone-400">
                    {scoreRecord ? (
                      <span className="text-emerald-400 font-bold">
                        Skor Terbaik: {scoreRecord.totalScore}/100
                      </span>
                    ) : (
                      <span>Belum dimainkan</span>
                    )}
                  </div>

                  <button
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 text-teal-950 shadow'
                        : 'bg-teal-800 text-white hover:bg-teal-700'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isSelected ? 'Lagu Terpilih' : 'Pilih Lagu'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-stone-950 px-6 py-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span>Semua level dan tantangan dapat dipilih secara langsung tanpa syarat.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
