import React from 'react';
import { Bar, NoteName } from '../types/music';
import { WHITE_KEYS, getNoteData } from '../utils/pianoKeysData';

interface FallingNotesRollProps {
  bars: Bar[];
  currentBarIndex: number;
  currentBeat: number; // 0 to 4
  tempo: number;
}

export const FallingNotesRoll: React.FC<FallingNotesRollProps> = ({
  bars,
  currentBarIndex,
  currentBeat,
}) => {
  // Current composition progress in absolute beats (0 to 40 beats)
  const currentTotalBeats = currentBarIndex * 4 + currentBeat;
  // Window of visibility: 6 beats ahead
  const visibleBeatRange = 6;

  // Gather notes from current and next 2 bars
  const candidateBars = bars.slice(currentBarIndex, currentBarIndex + 3);

  // Key horizontal mapping: 15 white keys (0 to 14)
  const getKeyLeftPercent = (pitch: NoteName): number => {
    const whiteIdx = WHITE_KEYS.findIndex(k => k.pitch === pitch);
    if (whiteIdx !== -1) {
      return (whiteIdx + 0.5) * (100 / 15);
    }
    // For black keys, estimate middle position
    const note = getNoteData(pitch);
    const prevWhite = WHITE_KEYS.findIndex(k => k.midi === note.midi - 1);
    if (prevWhite !== -1) {
      return (prevWhite + 1.0) * (100 / 15);
    }
    return 50;
  };

  return (
    <div className="w-full h-36 md:h-40 bg-stone-950 border border-teal-800/80 rounded-xl relative overflow-hidden shadow-inner select-none">
      {/* 15 Vertical Track Lane Dividers */}
      <div className="absolute inset-0 flex pointer-events-none">
        {WHITE_KEYS.map((k, idx) => (
          <div
            key={k.pitch}
            className={`flex-1 h-full border-r border-stone-850/60 ${
              idx % 2 === 0 ? 'bg-stone-900/20' : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Target Baseline Hit Bar at bottom (where notes must be played) */}
      <div className="absolute bottom-2 inset-x-0 h-4 bg-teal-500/20 border-y-2 border-teal-400 flex items-center justify-between px-3 z-10">
        <span className="text-[10px] font-bold text-teal-300 uppercase tracking-widest">
          GARIS TEKAN NADA (HIT LINE)
        </span>
        <span className="text-[10px] font-mono text-amber-300 font-bold">
          Sentuh tuts saat balok menyentuh garis ini!
        </span>
      </div>

      {/* Falling Note Blocks */}
      {candidateBars.flatMap(bar =>
        bar.notes.map(note => {
          if (note.isRest) return null;

          const noteTotalBeat = (bar.barNumber - 1) * 4 + note.beatOffset;
          const beatDiff = noteTotalBeat - currentTotalBeats;

          // If note is too far ahead (> visibleBeatRange) or already passed (< -0.8)
          if (beatDiff < -0.8 || beatDiff > visibleBeatRange) return null;

          // Calculate vertical position:
          // beatDiff = 0 => bottom = 12px (at hit line)
          // beatDiff = visibleBeatRange => top of container
          const bottomPercent = Math.max(0, (1 - beatDiff / visibleBeatRange) * 85);
          const blockHeight = Math.max(16, (note.durationBeats / 4) * 60);
          const leftPercent = getKeyLeftPercent(note.pitch);
          const isAtHitLine = Math.abs(beatDiff) < 0.25;

          const noteData = getNoteData(note.pitch);

          return (
            <div
              key={note.id}
              className={`absolute rounded-lg flex items-center justify-center font-bold text-xs shadow-md transition-all duration-75 z-20 ${
                isAtHitLine
                  ? 'bg-linear-to-b from-amber-300 to-amber-500 text-teal-950 scale-105 ring-2 ring-amber-300 ring-offset-1 ring-offset-stone-950 animate-pulse'
                  : 'bg-linear-to-b from-teal-400 to-emerald-500 text-teal-950'
              }`}
              style={{
                left: `calc(${leftPercent}% - 20px)`,
                bottom: `${bottomPercent}%`,
                width: '40px',
                height: `${blockHeight}px`,
              }}
            >
              <div className="flex flex-col items-center leading-none">
                <span className="text-[11px] font-black">{noteData.solfege}</span>
                <span className="text-[9px] opacity-80">{note.pitch}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
