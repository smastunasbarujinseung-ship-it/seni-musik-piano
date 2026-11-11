import React, { useEffect } from 'react';
import { Composition, ChallengeScore } from '../types/music';
import { audioEngine } from '../utils/audioEngine';
import { narrator } from '../utils/narrator';
import confetti from 'canvas-confetti';
import { Trophy, Star, RotateCcw, ArrowRight, MessageSquare, X } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  composition: Composition;
  score: ChallengeScore;
  onReplay: () => void;
  onNextChallenge: () => void;
  onOpenReflection: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onClose,
  composition,
  score,
  onReplay,
  onNextChallenge,
  onOpenReflection,
}) => {
  useEffect(() => {
    if (isOpen) {
      audioEngine.playVictoryFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      narrator.speak(`Luar biasa! Kamu berhasil menyelesaikan sepuluh birama lagu ${composition.title} dengan total nilai ${score.totalScore} poin!`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/85 backdrop-blur-md">
      <div className="bg-stone-900 border-2 border-amber-500 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-600 via-amber-500 to-amber-600 p-4 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-amber-700/60 hover:bg-amber-800 text-teal-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex p-3 rounded-full bg-white/20 text-teal-950 mb-1">
            <Trophy className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-black text-teal-950 tracking-wider font-display">
            LUAR BIASA! 10 BIRAMA SELESAI!
          </h2>
          <p className="text-xs font-bold text-teal-950/90">
            {composition.title} · Level {composition.level}
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 flex flex-col items-center gap-5 text-stone-200">
          {/* Animated Stars */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((starIdx) => (
              <div
                key={starIdx}
                className={`p-2 rounded-2xl transition-all duration-300 ${
                  score.stars >= starIdx
                    ? 'bg-amber-400/20 scale-110 text-amber-400'
                    : 'bg-stone-950 text-stone-700'
                }`}
              >
                <Star
                  className={`w-10 h-10 ${
                    score.stars >= starIdx ? 'fill-amber-400 animate-bounce' : ''
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Total Score Banner */}
          <div className="text-center">
            <div className="text-4xl font-black text-amber-400 font-mono-num tracking-tight">
              {score.totalScore} <span className="text-lg text-stone-400">/ 100</span>
            </div>
            <div className="text-xs text-emerald-400 font-bold mt-1">
              Akurasi Permainan: {score.accuracyPercent}%
            </div>
          </div>

          {/* 4 Score Pillars Grid */}
          <div className="w-full grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 flex justify-between items-center">
              <span className="text-stone-300 font-medium">Ketepatan Nada:</span>
              <span className="font-mono font-bold text-emerald-400">{score.pitchScore} / 40</span>
            </div>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 flex justify-between items-center">
              <span className="text-stone-300 font-medium">Ketepatan Tempo:</span>
              <span className="font-mono font-bold text-teal-400">{score.rhythmScore} / 30</span>
            </div>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 flex justify-between items-center">
              <span className="text-stone-300 font-medium">Ketepatan Durasi:</span>
              <span className="font-mono font-bold text-amber-400">{score.durationScore} / 20</span>
            </div>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 flex justify-between items-center">
              <span className="text-stone-300 font-medium">Ketepatan Dinamika:</span>
              <span className="font-mono font-bold text-sky-400">{score.dynamicScore} / 10</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                onClose();
                onNextChallenge();
              }}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-xs flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all"
            >
              <span>LANJUT KE TANTANGAN BERIKUTNYA</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenReflection();
                }}
                className="py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span>Isi Refleksi Siswa</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onReplay();
                }}
                className="py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Lagu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
