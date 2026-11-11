import React from 'react';
import { ChallengeScore, TeamScoreRecord } from '../types/music';
import { ALL_COMPOSITIONS } from '../data/compositions';
import { X, Award, Star, Trophy, RotateCcw } from 'lucide-react';

interface ScoreHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedScores: Record<string, ChallengeScore>;
  teamMatchHistory: TeamScoreRecord[];
  onResetProgress: () => void;
}

export const ScoreHistoryModal: React.FC<ScoreHistoryModalProps> = ({
  isOpen,
  onClose,
  savedScores,
  teamMatchHistory,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const scoreList = Object.values(savedScores);
  const totalStars = scoreList.reduce((acc, s) => acc + s.stars, 0);
  const completedCount = scoreList.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/85 backdrop-blur-md">
      <div className="bg-stone-900 border-2 border-teal-600/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-linear-to-r from-teal-950 via-teal-900 to-emerald-950 px-6 py-3.5 border-b border-teal-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-teal-950">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                SD TERAMIA · RAPOR BELAJAR MUSIK
              </div>
              <h2 className="text-lg font-extrabold text-white font-display">
                RIWAYAT SKOR & PENCAPAIAN SISWA
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

        {/* Summary Metric Ribbon */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-stone-950 border-b border-stone-800 px-6">
          <div className="p-3 bg-stone-900 rounded-xl border border-teal-800 flex flex-col items-center">
            <span className="text-[10px] text-teal-300 font-bold uppercase">Lagu Diselesaikan</span>
            <span className="text-xl font-black text-white font-mono">{completedCount} / 30</span>
          </div>
          <div className="p-3 bg-stone-900 rounded-xl border border-amber-800 flex flex-col items-center">
            <span className="text-[10px] text-amber-300 font-bold uppercase">Total Bintang</span>
            <span className="text-xl font-black text-amber-400 font-mono flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" />
              {totalStars} / 90
            </span>
          </div>
          <div className="p-3 bg-stone-900 rounded-xl border border-emerald-800 flex flex-col items-center">
            <span className="text-[10px] text-emerald-300 font-bold uppercase">Pertandingan Tim</span>
            <span className="text-xl font-black text-emerald-400 font-mono flex items-center gap-1">
              <Trophy className="w-4 h-4 text-emerald-400" />
              {teamMatchHistory.length} Ronde
            </span>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wide">
            Daftar Skor Tantangan Musik:
          </h3>

          {scoreList.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400 bg-stone-950/60 rounded-xl border border-stone-800">
              Belum ada tantangan yang diselesaikan. Mulai bermain di menu GAME TANTANGAN!
            </div>
          ) : (
            <div className="space-y-2">
              {scoreList.map((rec) => {
                const comp = ALL_COMPOSITIONS.find(c => c.id === rec.challengeId);
                return (
                  <div
                    key={rec.challengeId}
                    className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-amber-400 font-bold block">
                        {comp ? comp.title : 'Tantangan Lagu'}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        Level {comp?.level} · Nada: {rec.pitchScore}/40 · Ritme: {rec.rhythmScore}/30 · Durasi: {rec.durationScore}/20 · Dinamika: {rec.dynamicScore}/10
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map(s => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              rec.stars >= s ? 'text-amber-400 fill-amber-400' : 'text-stone-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-extrabold text-emerald-400 font-mono text-sm">
                        {rec.totalScore} Poin
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-950 px-6 py-3 border-t border-stone-800 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (confirm('Yakin ingin mereset seluruh data riwayat skor?')) {
                onResetProgress();
              }
            }}
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Riwayat</span>
          </button>

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
