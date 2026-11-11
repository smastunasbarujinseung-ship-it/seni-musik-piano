import React, { useState, useEffect, useRef } from 'react';
import { NoteName, DynamicLevel } from '../types/music';
import { PIANO_KEYS, WHITE_KEYS, BLACK_KEYS, getNoteData } from '../utils/pianoKeysData';
import { audioEngine } from '../utils/audioEngine';
import { Volume1, Volume2, Sparkles } from 'lucide-react';

interface DigitalPianoProps {
  currentDynamic: DynamicLevel;
  onChangeDynamic: (dynamic: DynamicLevel) => void;
  keyLabelMode: 'both' | 'solfege' | 'letter' | 'none';
  highlightedPitch?: NoteName | null;
  onNotePlay?: (pitch: NoteName, heldMs: number, dynamic: DynamicLevel) => void;
  disabled?: boolean;
}

export const DigitalPiano: React.FC<DigitalPianoProps> = ({
  currentDynamic,
  onChangeDynamic,
  keyLabelMode,
  highlightedPitch,
  onNotePlay,
  disabled = false,
}) => {
  const [activeKeys, setActiveKeys] = useState<Set<NoteName>>(new Set());
  const [heldDurationMs, setHeldDurationMs] = useState<number>(0);
  const activeNoteStartTimes = useRef<Map<NoteName, number>>(new Map());
  const durationTimerRef = useRef<number | null>(null);

  // Handle note start
  const handleNoteStart = (pitch: NoteName) => {
    if (disabled) return;
    if (activeNoteStartTimes.current.has(pitch)) return;

    const now = performance.now();
    activeNoteStartTimes.current.set(pitch, now);
    setActiveKeys(prev => new Set(prev).add(pitch));

    audioEngine.startNote(pitch, currentDynamic);

    // Start live duration tracker if this is first active key
    if (activeNoteStartTimes.current.size === 1) {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
      durationTimerRef.current = window.setInterval(() => {
        const firstStart = Array.from(activeNoteStartTimes.current.values())[0];
        if (firstStart) {
          setHeldDurationMs(Math.round(performance.now() - firstStart));
        }
      }, 30);
    }
  };

  // Handle note stop
  const handleNoteStop = (pitch: NoteName) => {
    if (disabled) return;
    const startTime = activeNoteStartTimes.current.get(pitch);
    const heldMs = startTime ? Math.round(performance.now() - startTime) : 150;

    activeNoteStartTimes.current.delete(pitch);
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.delete(pitch);
      return next;
    });

    audioEngine.stopNote(pitch);

    if (activeNoteStartTimes.current.size === 0) {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
      setTimeout(() => setHeldDurationMs(0), 400);
    }

    if (onNotePlay) {
      onNotePlay(pitch, heldMs, currentDynamic);
    }
  };

  // Physical Computer Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || disabled) return;
      // Don't intercept typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const keyUpper = e.key.toUpperCase();
      const matched = PIANO_KEYS.find(k => k.keyboardShortcut.toUpperCase() === keyUpper);
      if (matched) {
        e.preventDefault();
        handleNoteStart(matched.pitch);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const keyUpper = e.key.toUpperCase();
      const matched = PIANO_KEYS.find(k => k.keyboardShortcut.toUpperCase() === keyUpper);
      if (matched) {
        e.preventDefault();
        handleNoteStop(matched.pitch);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [currentDynamic, disabled]);

  // Demo note play helper
  const handlePlayDemoChord = () => {
    const demoSequence: { pitch: NoteName; delay: number; dur: number }[] = [
      { pitch: 'C4', delay: 0, dur: 400 },
      { pitch: 'E4', delay: 200, dur: 400 },
      { pitch: 'G4', delay: 400, dur: 400 },
      { pitch: 'C5', delay: 600, dur: 700 }
    ];

    demoSequence.forEach(item => {
      setTimeout(() => handleNoteStart(item.pitch), item.delay);
      setTimeout(() => handleNoteStop(item.pitch), item.delay + item.dur);
    });
  };

  // Calculate black key horizontal offset based on standard piano geometry
  // 15 white keys: C4 to C6. Index 0 to 14.
  const getBlackKeyOffsetPercent = (pitch: NoteName): number => {
    // White key indices:
    // C4=0, D4=1, E4=2, F4=3, G4=4, A4=5, B4=6
    // C5=7, D5=8, E5=9, F5=10, G5=11, A5=12, B5=13
    // C6=14
    const keyWidthPercent = 100 / 15; // ~6.666%
    const whiteIdxMap: Record<string, number> = {
      'C#4': 0.65,
      'D#4': 1.75,
      'F#4': 3.6,
      'G#4': 4.65,
      'A#4': 5.75,
      'C#5': 7.65,
      'D#5': 8.75,
      'F#5': 10.6,
      'G#5': 11.65,
      'A#5': 12.75,
    };
    const factor = whiteIdxMap[pitch] ?? 0;
    return factor * keyWidthPercent;
  };

  return (
    <div className="w-full flex flex-col items-center select-none shrink-0">
      {/* Piano Top Fallboard Bar: Wooden texture, brand, dynamic controls, duration meter */}
      <div className="w-full bg-linear-to-b from-stone-900 via-stone-850 to-stone-900 border-t-2 border-amber-600/60 border-b border-stone-950 px-4 py-2 rounded-t-xl flex items-center justify-between shadow-inner">
        {/* Left: Brand Emblem & Demo Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-extrabold text-xs tracking-widest uppercase font-display">
              SD TERAMIA GRAND
            </span>
            <span className="text-stone-500 text-xs">·</span>
            <span className="text-stone-400 text-xs font-mono">25 Tuts (C4 - C6)</span>
          </div>

          <button
            onClick={handlePlayDemoChord}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold border border-stone-700 transition-colors"
            title="Dengarkan Suara Contoh Harmoni Piano"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tes Akord C</span>
          </button>
        </div>

        {/* Center: Live Held Note Duration Meter (Staccato vs Legato Visualizer) */}
        <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1 rounded-full border border-stone-800">
          <span className="text-stone-400 text-xs font-semibold">Durasi Sentuh:</span>
          <div className="w-28 h-2.5 bg-stone-800 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-75 ${
                heldDurationMs > 600
                  ? 'bg-amber-400'
                  : heldDurationMs > 250
                  ? 'bg-teal-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (heldDurationMs / 1200) * 100)}%` }}
            />
          </div>
          <span className="text-amber-300 text-xs font-mono-num w-14 text-right">
            {heldDurationMs > 0 ? `${heldDurationMs} ms` : '0 ms'}
          </span>
          <span className="text-xs text-stone-400 hidden md:inline">
            {heldDurationMs === 0
              ? '(Sentuh tuts)'
              : heldDurationMs < 250
              ? '(Staccato)'
              : heldDurationMs < 750
              ? '(Sedang)'
              : '(Legato)'}
          </span>
        </div>

        {/* Right: Dynamic Volume Controls (LEMBUT, SEDANG, KUAT) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-300 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Dinamika:</span>
          </span>
          <div className="flex items-center bg-stone-950 p-0.5 rounded-lg border border-stone-800">
            <button
              onClick={() => onChangeDynamic('p')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                currentDynamic === 'p'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Dinamika Piano (p): Lembut"
            >
              LEMBUT (p)
            </button>
            <button
              onClick={() => onChangeDynamic('mf')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                currentDynamic === 'mf'
                  ? 'bg-teal-500 text-teal-950 shadow font-extrabold'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Dinamika Mezzo-Forte (mf): Sedang"
            >
              SEDANG (mf)
            </button>
            <button
              onClick={() => onChangeDynamic('f')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                currentDynamic === 'f'
                  ? 'bg-amber-400 text-teal-950 shadow font-extrabold'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Dinamika Forte (f): Kuat"
            >
              KUAT (f)
            </button>
          </div>
        </div>
      </div>

      {/* Main Piano Keyboard Area */}
      <div className="w-full relative h-48 md:h-56 bg-stone-950 p-2 rounded-b-xl shadow-2xl border-x-4 border-b-4 border-stone-850">
        <div className="relative w-full h-full flex">
          {/* 15 White Keys */}
          {WHITE_KEYS.map((key) => {
            const isActive = activeKeys.has(key.pitch);
            const isHighlighted = highlightedPitch === key.pitch;

            return (
              <div
                key={key.pitch}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  handleNoteStart(key.pitch);
                }}
                onPointerUp={(e) => {
                  try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
                  handleNoteStop(key.pitch);
                }}
                onPointerCancel={(e) => {
                  try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
                  handleNoteStop(key.pitch);
                }}
                className={`piano-key relative h-full flex-1 rounded-b-md border border-stone-300 transition-all duration-75 cursor-pointer flex flex-col justify-end items-center pb-3 ${
                  isActive
                    ? 'bg-linear-to-b from-teal-100 via-teal-200 to-teal-300 shadow-inner transform translate-y-1.5'
                    : isHighlighted
                    ? 'bg-linear-to-b from-amber-100 via-amber-200 to-amber-300 ring-4 ring-amber-400 shadow-lg'
                    : 'bg-linear-to-b from-white via-stone-50 to-stone-200 shadow-[0_6px_4px_rgba(0,0,0,0.3)] hover:brightness-95'
                }`}
                style={{
                  touchAction: 'none',
                }}
              >
                {/* Visual Key 3D Lip Highlight */}
                <div className="absolute inset-x-0 bottom-0 h-2 bg-stone-300/80 rounded-b-md border-t border-stone-400/40" />

                {/* Guide glow when highlighted by lesson */}
                {isHighlighted && !isActive && (
                  <div className="absolute top-2 w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                )}

                {/* Key Labels according to user preferences */}
                <div className="flex flex-col items-center pointer-events-none z-10">
                  {/* Solfege name (Do, Re, Mi) */}
                  {(keyLabelMode === 'both' || keyLabelMode === 'solfege') && (
                    <span className={`font-bold text-sm leading-tight ${isActive ? 'text-teal-900' : isHighlighted ? 'text-amber-900' : 'text-teal-800'}`}>
                      {key.solfege}
                    </span>
                  )}

                  {/* Letter note (C4, D4...) */}
                  {(keyLabelMode === 'both' || keyLabelMode === 'letter') && (
                    <span className="text-xs font-semibold text-stone-500 leading-tight">
                      {key.letter}{key.octave}
                    </span>
                  )}

                  {/* Keyboard shortcut key hint */}
                  <span className="mt-1 text-[10px] font-mono font-bold text-stone-400 bg-stone-100/90 px-1.5 py-0.2 rounded border border-stone-300/80 shadow-xs">
                    {key.keyboardShortcut}
                  </span>
                </div>
              </div>
            );
          })}

          {/* 10 Black Keys (positioned with absolute coordinates overlaying white keys) */}
          {BLACK_KEYS.map((key) => {
            const isActive = activeKeys.has(key.pitch);
            const isHighlighted = highlightedPitch === key.pitch;
            const leftPercent = getBlackKeyOffsetPercent(key.pitch);

            return (
              <div
                key={key.pitch}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  handleNoteStart(key.pitch);
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
                  handleNoteStop(key.pitch);
                }}
                onPointerCancel={(e) => {
                  e.stopPropagation();
                  try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
                  handleNoteStop(key.pitch);
                }}
                className={`piano-key absolute top-0 h-[62%] rounded-b-md transition-all duration-75 cursor-pointer z-20 flex flex-col justify-end items-center pb-2 ${
                  isActive
                    ? 'bg-linear-to-b from-teal-600 via-teal-700 to-teal-800 shadow-inner transform translate-y-1'
                    : isHighlighted
                    ? 'bg-linear-to-b from-amber-500 via-amber-600 to-amber-700 ring-2 ring-amber-300'
                    : 'bg-linear-to-b from-stone-850 via-stone-900 to-black shadow-[2px_6px_6px_rgba(0,0,0,0.6)] hover:brightness-125'
                }`}
                style={{
                  left: `${leftPercent}%`,
                  width: '4.2%',
                  touchAction: 'none',
                }}
              >
                {/* 3D Top bevel */}
                <div className="absolute inset-x-1 top-0 h-full border-t border-stone-600/50 pointer-events-none" />

                {/* Key Label */}
                <div className="flex flex-col items-center pointer-events-none z-10 mb-0.5">
                  <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-stone-300'}`}>
                    {key.letter}
                  </span>
                  <span className="text-[9px] font-mono text-stone-400 bg-stone-950/70 px-1 rounded">
                    {key.keyboardShortcut}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
