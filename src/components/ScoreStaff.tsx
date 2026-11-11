import React, { useRef, useEffect } from 'react';
import { Bar, NoteItem, DynamicLevel } from '../types/music';
import { getNoteData } from '../utils/pianoKeysData';

interface ScoreStaffProps {
  bars: Bar[];
  currentBarIndex: number; // 0 to 9
  currentBeat: number; // 0 to 4 within current bar
  activeNoteId?: string | null;
  lastPlayedAccuracy?: 'correct' | 'wrong' | null;
  lastPlayedMessage?: string | null;
  tempo: number;
}

export const ScoreStaff: React.FC<ScoreStaffProps> = ({
  bars,
  currentBarIndex,
  currentBeat,
  activeNoteId,
  lastPlayedAccuracy,
  lastPlayedMessage,
  tempo,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll staff container to follow current bar if window is narrower
  useEffect(() => {
    if (containerRef.current) {
      const activeBarElem = containerRef.current.querySelector(`[data-bar-index="${currentBarIndex}"]`);
      if (activeBarElem) {
        activeBarElem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentBarIndex]);

  // Staff geometry constants
  // 5 lines: y = 30, 42, 54, 66, 78 (spacing = 12px)
  // Staff line 5 (top) = 30
  // Staff line 4 = 42
  // Staff line 3 = 54
  // Staff line 2 = 66 (G line)
  // Staff line 1 (bottom) = 78
  // Ledger line below: C4 (y = 90)
  const getNoteY = (staffPosition: number): number => {
    // staffPosition 0 (C4) = 90
    // staffPosition 2 (E4, line 1) = 78
    // staffPosition 4 (G4, line 2) = 66
    // staffPosition 6 (B4, line 3) = 54
    // staffPosition 8 (D5, line 4) = 42
    // staffPosition 10 (F5, line 5) = 30
    // Each staff position step is 6px (half the 12px line spacing)
    return 90 - staffPosition * 6;
  };

  return (
    <div className="w-full flex flex-col bg-stone-900/90 border border-teal-800/80 rounded-xl p-3 shadow-xl backdrop-blur-sm relative overflow-hidden select-none">
      {/* Top Staff Header Info */}
      <div className="flex items-center justify-between px-2 mb-2 border-b border-stone-800 pb-2">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-extrabold text-sm tracking-wide flex items-center gap-1.5 font-display">
            <span>PARTITUR MUSIK</span>
            <span className="text-xs bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-700/60 font-mono">
              Birama 4/4 · 10 Bar
            </span>
          </span>

          <span className="text-xs text-stone-400 font-mono-num bg-stone-950/80 px-2.5 py-0.5 rounded border border-stone-800">
            Tempo: <strong className="text-white">{tempo} BPM</strong>
          </span>
        </div>

        {/* Live Feedback Toast if note was hit/missed */}
        {lastPlayedAccuracy && (
          <div
            className={`px-3 py-0.5 rounded-full text-xs font-bold transition-all animate-bounce ${
              lastPlayedAccuracy === 'correct'
                ? 'bg-emerald-500 text-teal-950 shadow-md'
                : 'bg-rose-500 text-white shadow-md'
            }`}
          >
            {lastPlayedMessage || (lastPlayedAccuracy === 'correct' ? 'Tepat!' : 'Periksa kembali nada!')}
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">Birama Aktif:</span>
          <span className="px-2 py-0.5 rounded bg-teal-800 text-amber-300 font-black font-mono-num text-xs border border-teal-600">
            Bar {currentBarIndex + 1} / 10
          </span>
        </div>
      </div>

      {/* Main Staff Notation Horizontal Scroll / View Container */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto flex items-center py-2 px-1 relative scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Clef & Time Signature Fixed Legend */}
        <div className="shrink-0 flex items-center pl-2 pr-3 border-r-2 border-teal-600/40 mr-1 bg-stone-900/90 z-10">
          <svg width="60" height="110" viewBox="0 0 60 110" className="overflow-visible">
            {/* 5 Staff lines */}
            {[30, 42, 54, 66, 78].map((y, i) => (
              <line key={i} x1="0" y1={y} x2="60" y2={y} stroke="#78716c" strokeWidth="1.5" />
            ))}
            {/* Treble Clef Symbol (Stylized SVG G-Clef) */}
            <path
              d="M 22,86 C 18,88 12,82 16,74 C 20,68 28,66 28,58 C 28,46 22,30 23,16 C 24,10 27,10 27,15 C 27,24 23,38 23,54 C 23,66 33,66 33,76 C 33,88 20,92 20,84 C 20,80 24,80 24,84"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* 4/4 Time Signature */}
            <text x="44" y="52" fill="#38bdf8" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="Outfit">
              4
            </text>
            <text x="44" y="76" fill="#38bdf8" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="Outfit">
              4
            </text>
          </svg>
        </div>

        {/* 10 Bars Rendered Sequentially */}
        <div className="flex items-center gap-0">
          {bars.map((bar, bIdx) => {
            const isCurrentBar = bIdx === currentBarIndex;
            const barWidth = 140; // width per bar

            return (
              <div
                key={bar.barNumber}
                data-bar-index={bIdx}
                className={`relative shrink-0 flex flex-col items-center transition-colors duration-200 ${
                  isCurrentBar ? 'bg-teal-950/60 ring-2 ring-teal-500/80 rounded-lg' : ''
                }`}
                style={{ width: `${barWidth}px` }}
              >
                {/* Bar Number Label */}
                <div className="text-[10px] font-bold text-stone-400 mb-0.5">
                  Bar {bar.barNumber}
                </div>

                {/* SVG Staff for this bar */}
                <svg width={barWidth} height="110" viewBox={`0 0 ${barWidth} 110`} className="overflow-visible">
                  {/* 5 Staff lines */}
                  {[30, 42, 54, 66, 78].map((y, i) => (
                    <line key={i} x1="0" y1={y} x2={barWidth} y2={y} stroke={isCurrentBar ? '#5eead4' : '#78716c'} strokeWidth="1.5" />
                  ))}

                  {/* Bar Line at right edge */}
                  <line
                    x1={barWidth - 1}
                    y1="30"
                    x2={barWidth - 1}
                    y2="78"
                    stroke={bIdx === 9 ? '#fbbf24' : '#a8a29e'}
                    strokeWidth={bIdx === 9 ? '3.5' : '2'}
                  />
                  {bIdx === 9 && (
                    <line x1={barWidth - 6} y1="30" x2={barWidth - 6} y2="78" stroke="#fbbf24" strokeWidth="1.5" />
                  )}

                  {/* Playhead indicator within current active bar */}
                  {isCurrentBar && (
                    <line
                      x1={Math.min(barWidth - 4, (currentBeat / 4) * barWidth)}
                      y1="16"
                      x2={Math.min(barWidth - 4, (currentBeat / 4) * barWidth)}
                      y2="94"
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                      strokeDasharray="3 2"
                      className="animate-pulse"
                    />
                  )}

                  {/* Notes in this bar */}
                  {bar.notes.map((note) => {
                    const noteInfo = getNoteData(note.pitch);
                    const noteX = (note.beatOffset / 4) * (barWidth - 30) + 18;
                    const noteY = getNoteY(noteInfo.staffPosition);
                    const isNoteActive = isCurrentBar && activeNoteId === note.id;
                    const hasLedgerBelow = noteInfo.staffPosition <= 0; // C4 Middle C
                    const hasLedgerAbove = noteInfo.staffPosition >= 12; // A5 or higher

                    if (note.isRest) {
                      // Draw rest symbol
                      return (
                        <g key={note.id} transform={`translate(${noteX}, 54)`}>
                          <path
                            d="M -3,-8 L 3,-4 L -2,2 L 2,6"
                            stroke="#94a3b8"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                          />
                        </g>
                      );
                    }

                    return (
                      <g
                        key={note.id}
                        className={`transition-all duration-150 ${
                          isNoteActive ? 'scale-125 transform origin-center' : ''
                        }`}
                      >
                        {/* Middle C Ledger line (C4) */}
                        {hasLedgerBelow && (
                          <line
                            x1={noteX - 10}
                            y1="90"
                            x2={noteX + 10}
                            y2="90"
                            stroke="#78716c"
                            strokeWidth="1.5"
                          />
                        )}
                        {/* High A5 / C6 Ledger lines */}
                        {hasLedgerAbove && (
                          <line
                            x1={noteX - 10}
                            y1="18"
                            x2={noteX + 10}
                            y2="18"
                            stroke="#78716c"
                            strokeWidth="1.5"
                          />
                        )}

                        {/* Note Head Oval */}
                        <ellipse
                          cx={noteX}
                          cy={noteY}
                          rx="6"
                          ry="4.5"
                          transform={`rotate(-20 ${noteX} ${noteY})`}
                          fill={
                            isNoteActive
                              ? '#34d399' // Glowing green on active
                              : note.type === 'whole' || note.type === 'half'
                              ? '#ffffff'
                              : '#f8fafc'
                          }
                          stroke={isNoteActive ? '#10b981' : '#0f172a'}
                          strokeWidth={note.type === 'whole' || note.type === 'half' ? '2.5' : '1'}
                          className={isNoteActive ? 'filter drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]' : ''}
                        />

                        {/* Note Stem (for half, quarter, eighth) */}
                        {note.type !== 'whole' && (
                          <line
                            x1={noteInfo.staffPosition < 6 ? noteX + 5.5 : noteX - 5.5}
                            y1={noteY}
                            x2={noteInfo.staffPosition < 6 ? noteX + 5.5 : noteX - 5.5}
                            y2={noteInfo.staffPosition < 6 ? noteY - 26 : noteY + 26}
                            stroke={isNoteActive ? '#34d399' : '#ffffff'}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        )}

                        {/* Eighth Note Flag */}
                        {note.type === 'eighth' && (
                          <path
                            d={
                              noteInfo.staffPosition < 6
                                ? `M ${noteX + 5.5},${noteY - 26} C ${noteX + 12},${noteY - 20} ${noteX + 10},${noteY - 14} ${noteX + 13},${noteY - 12}`
                                : `M ${noteX - 5.5},${noteY + 26} C ${noteX + 2},${noteY + 20} ${noteX},${noteY + 14} ${noteX + 3},${noteY + 12}`
                            }
                            fill="none"
                            stroke={isNoteActive ? '#34d399' : '#ffffff'}
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        )}

                        {/* Note Solfege & Letter Label under/above note */}
                        <text
                          x={noteX}
                          y={noteY > 54 ? noteY - 12 : noteY + 18}
                          fill={isNoteActive ? '#fbbf24' : '#e2e8f0'}
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="Outfit"
                        >
                          {noteInfo.solfege}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
