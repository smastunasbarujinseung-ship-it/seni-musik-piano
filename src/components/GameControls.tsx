import React from 'react';
import { Composition } from '../types/music';
import { Play, Square, RotateCcw, Volume2, Award, Music2, Layers } from 'lucide-react';

interface GameControlsProps {
  composition: Composition;
  isPlaying: boolean;
  isDemoPlaying: boolean;
  countdown: number | null;
  currentBarIndex: number; // 0 to 9
  currentScore: number;
  showFallingNotes: boolean;
  gameMode: 'practice' | 'exam';
  onToggleViewMode: () => void;
  onToggleGameMode: () => void;
  onStartPlay: () => void;
  onStopPlay: () => void;
  onPlayDemo: () => void;
  onOpenLevelSelect: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  composition,
  isPlaying,
  isDemoPlaying,
  countdown,
  currentBarIndex,
  currentScore,
  showFallingNotes,
  gameMode,
  onToggleViewMode,
  onToggleGameMode,
  onStartPlay,
  onStopPlay,
  onPlayDemo,
  onOpenLevelSelect,
}) => {
  return (
    <div className="w-full bg-teal-950/90 border border-teal-800/80 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-md select-none shrink-0">
      {/* Left: Active Song Title & Level Details */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenLevelSelect}
          className="flex flex-col text-left group cursor-pointer hover:opacity-90"
          title="Klik untuk memilih lagu/tantangan lain"
        >
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-teal-950 text-[11px] font-extrabold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              Level {composition.level} · Tantangan {composition.challengeNumber}
            </span>
            <span className="text-teal-300 text-xs font-semibold">
              (Ganti Lagu)
            </span>
          </div>
          <h2 className="text-base font-extrabold text-white tracking-wide font-display group-hover:text-amber-300 transition-colors">
            {composition.title}
          </h2>
          <p className="text-[11px] text-teal-200/80 truncate max-w-sm">
            {composition.subtitle}
          </p>
        </button>
      </div>

      {/* Center: Play, Demo, Stop Action Controls */}
      <div className="flex items-center gap-2">
        {/* Countdown Indicator */}
        {countdown !== null && (
          <div className="flex items-center gap-2 bg-amber-400 text-teal-950 font-black px-4 py-1.5 rounded-xl shadow-lg animate-pulse text-sm">
            <span>SIAP-SIAP:</span>
            <span className="text-lg font-mono">{countdown}</span>
          </div>
        )}

        {/* Demo Button */}
        <button
          onClick={onPlayDemo}
          disabled={isPlaying}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isDemoPlaying
              ? 'bg-amber-400 text-teal-950 ring-2 ring-amber-300 animate-pulse'
              : 'bg-teal-800 hover:bg-teal-700 text-white disabled:opacity-50'
          }`}
          title="Dengarkan contoh komposisi sebelum bermain"
        >
          <Volume2 className="w-4 h-4 text-amber-300" />
          <span>{isDemoPlaying ? 'CONTOH BERMAIN...' : 'DENGARKAN CONTOH'}</span>
        </button>

        {/* Start / Stop Game Button */}
        {!isPlaying ? (
          <button
            onClick={onStartPlay}
            disabled={isDemoPlaying}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-black transition-all bg-emerald-500 hover:bg-emerald-400 text-teal-950 shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Mulai Bermain Tantangan Ini"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>MULAI BERMAIN</span>
          </button>
        ) : (
          <button
            onClick={onStopPlay}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95"
            title="Hentikan Permainan"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>BERHENTI</span>
          </button>
        )}

        <button
          onClick={() => {
            onStopPlay();
            onStartPlay();
          }}
          disabled={!isPlaying && !isDemoPlaying}
          className="p-2 rounded-xl bg-teal-900/80 hover:bg-teal-800 text-teal-200 hover:text-white transition-colors disabled:opacity-40"
          title="Ulangi Tantangan dari Awal"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Mode Switchers (Partitur vs Not Jatuh & Latihan vs Ujian) & Live Score */}
      <div className="flex items-center gap-3">
        {/* Toggle View Mode: Partitur vs Not Jatuh */}
        <button
          onClick={onToggleViewMode}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-900/80 hover:bg-teal-800 text-teal-100 text-xs font-semibold border border-teal-700/60 transition-colors"
          title="Pilih Tampilan Partitur Musik atau Not Jatuh"
        >
          <Layers className="w-3.5 h-3.5 text-teal-300" />
          <span>{showFallingNotes ? 'MODE NOT JATUH' : 'MODE PARTITUR'}</span>
        </button>

        {/* Toggle Game Mode: Latihan vs Ujian */}
        <button
          onClick={onToggleGameMode}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
            gameMode === 'exam'
              ? 'bg-rose-950/80 border-rose-500 text-rose-300'
              : 'bg-teal-900/80 border-teal-700/60 text-teal-200'
          }`}
          title="Ubah antara Mode Latihan (dengan petunjuk) atau Mode Ujian Musik"
        >
          {gameMode === 'exam' ? 'MODE UJIAN' : 'MODE LATIHAN'}
        </button>

        {/* Score & Bar Indicator */}
        <div className="flex items-center gap-2 bg-teal-950 px-3 py-1.5 rounded-xl border border-teal-800">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-teal-400 font-bold uppercase">Skor Sementara</span>
            <span className="text-sm font-extrabold text-amber-300 font-mono-num leading-tight flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              {currentScore} / 100
            </span>
          </div>

          <div className="h-6 w-px bg-teal-800 mx-1" />

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-teal-400 font-bold uppercase">Progres Bar</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono-num leading-tight">
              {currentBarIndex + 1} / 10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
