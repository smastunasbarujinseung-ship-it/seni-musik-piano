import React, { useState } from 'react';
import { Composition, TeamConfig, TeamScoreRecord } from '../types/music';
import { ALL_COMPOSITIONS } from '../data/compositions';
import { audioEngine } from '../utils/audioEngine';
import { narrator } from '../utils/narrator';
import confetti from 'canvas-confetti';
import { X, Users, Trophy, Play, RotateCcw, Award, CheckCircle, Flame } from 'lucide-react';

interface TeamMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMatchRound: (comp: Composition, currentTeam: 'A' | 'B', roundIdx: number) => void;
  activeMatchRecord: TeamScoreRecord[];
  onResetMatch: () => void;
}

export const TeamMatchModal: React.FC<TeamMatchModalProps> = ({
  isOpen,
  onClose,
  onStartMatchRound,
  activeMatchRecord,
  onResetMatch,
}) => {
  const [teamA, setTeamA] = useState<TeamConfig>({ name: 'Tim Tosca Hebat', color: 'tosca', membersCount: 5 });
  const [teamB, setTeamB] = useState<TeamConfig>({ name: 'Tim Emas Juara', color: 'gold', membersCount: 5 });
  const [matchLevel, setMatchLevel] = useState<1 | 2 | 3>(1);
  const [roundsCount, setRoundsCount] = useState<number>(3);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [turn, setTurn] = useState<'A' | 'B'>('A');
  const [matchFinished, setMatchFinished] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalScoreA = activeMatchRecord.reduce((acc, r) => acc + r.teamAScore, 0);
  const totalScoreB = activeMatchRecord.reduce((acc, r) => acc + r.teamBScore, 0);

  // Trigger victory fanfare and confetti
  const handleAnnounceWinner = () => {
    setMatchFinished(true);
    audioEngine.playVictoryFanfare();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    if (totalScoreA > totalScoreB) {
      narrator.speak(`Selamat kepada ${teamA.name}! Kalian memenangkan pertandingan dengan total nilai ${totalScoreA} poin!`);
    } else if (totalScoreB > totalScoreA) {
      narrator.speak(`Selamat kepada ${teamB.name}! Kalian memenangkan pertandingan dengan total nilai ${totalScoreB} poin!`);
    } else {
      narrator.speak(`Hasil pertandingan adalah seri! Kedua tim tampil luar biasa dengan skor sama ${totalScoreA} poin!`);
    }
  };

  const handleStartNextTurn = () => {
    const levelComps = ALL_COMPOSITIONS.filter(c => c.level === matchLevel);
    const comp = levelComps[(currentRound - 1) % levelComps.length];

    narrator.speak(`Sekarang giliran ${turn === 'A' ? teamA.name : teamB.name} untuk memainkan lagu ${comp.title}!`);
    onStartMatchRound(comp, turn, currentRound);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/85 backdrop-blur-md">
      <div className="bg-stone-900 border-2 border-teal-600/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-linear-to-r from-teal-950 via-teal-900 to-amber-950 px-6 py-3.5 border-b border-teal-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-teal-950">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                KOMPETISI MUSIK KELAS V SD · SD TERAMIA
              </div>
              <h2 className="text-lg font-extrabold text-white font-display">
                PERTANDINGAN ANTARTIM (VS MODE)
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {/* Team Versus Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team A Card */}
            <div className="bg-teal-950/80 border-2 border-teal-500 rounded-xl p-4 flex flex-col gap-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="bg-teal-500 text-teal-950 text-xs font-black px-2.5 py-0.5 rounded uppercase">
                  TIM A
                </span>
                <span className="text-xs text-teal-300 font-semibold font-mono">
                  Total: {totalScoreA} Poin
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-stone-300 font-semibold">Nama Tim A:</label>
                <input
                  type="text"
                  value={teamA.name}
                  onChange={(e) => setTeamA({ ...teamA, name: e.target.value })}
                  className="bg-stone-900 text-white font-bold text-sm px-3 py-1.5 rounded-lg border border-teal-700 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-stone-300">
                <span>Jumlah Siswa:</span>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={teamA.membersCount}
                  onChange={(e) => setTeamA({ ...teamA, membersCount: parseInt(e.target.value) || 1 })}
                  className="w-16 bg-stone-900 text-white font-mono px-2 py-1 rounded border border-teal-800 text-right"
                />
              </div>
            </div>

            {/* Team B Card */}
            <div className="bg-amber-950/60 border-2 border-amber-500 rounded-xl p-4 flex flex-col gap-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="bg-amber-400 text-teal-950 text-xs font-black px-2.5 py-0.5 rounded uppercase">
                  TIM B
                </span>
                <span className="text-xs text-amber-300 font-semibold font-mono">
                  Total: {totalScoreB} Poin
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-stone-300 font-semibold">Nama Tim B:</label>
                <input
                  type="text"
                  value={teamB.name}
                  onChange={(e) => setTeamB({ ...teamB, name: e.target.value })}
                  className="bg-stone-900 text-white font-bold text-sm px-3 py-1.5 rounded-lg border border-amber-700 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-stone-300">
                <span>Jumlah Siswa:</span>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={teamB.membersCount}
                  onChange={(e) => setTeamB({ ...teamB, membersCount: parseInt(e.target.value) || 1 })}
                  className="w-16 bg-stone-900 text-white font-mono px-2 py-1 rounded border border-amber-800 text-right"
                />
              </div>
            </div>
          </div>

          {/* Match Settings Strip */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-300">Tingkat Level:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setMatchLevel(lvl as 1 | 2 | 3)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      matchLevel === lvl
                        ? 'bg-teal-600 text-white shadow'
                        : 'bg-stone-900 text-stone-400 hover:text-white'
                    }`}
                  >
                    Level {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-300">Jumlah Ronde:</span>
              <select
                value={roundsCount}
                onChange={(e) => setRoundsCount(parseInt(e.target.value))}
                className="bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-stone-700"
              >
                <option value={3}>3 Ronde (Cepat)</option>
                <option value={5}>5 Ronde (Standar)</option>
                <option value={10}>10 Ronde (Lengkap)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">Giliran Saat Ini:</span>
              <span className={`px-2.5 py-1 rounded-lg font-black text-xs ${
                turn === 'A' ? 'bg-teal-500 text-teal-950' : 'bg-amber-400 text-teal-950'
              }`}>
                {turn === 'A' ? teamA.name : teamB.name}
              </span>
            </div>
          </div>

          {/* Match History Table */}
          <div className="bg-stone-950/80 rounded-xl border border-stone-800 overflow-hidden">
            <div className="px-4 py-2.5 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wide">
                Riwayat Skor Ronde Pertandingan
              </span>
              <span className="text-xs text-teal-400 font-mono">
                Ronde Selesai: {activeMatchRecord.length} / {roundsCount}
              </span>
            </div>

            {activeMatchRecord.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-400">
                Belum ada ronde yang dimainkan. Tekan tombol <strong className="text-amber-400">"Mulai Mainkan Ronde"</strong> di bawah!
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-900/60 text-stone-400 font-semibold border-b border-stone-800">
                  <tr>
                    <th className="p-2.5">Ronde</th>
                    <th className="p-2.5">Lagu Komposisi</th>
                    <th className="p-2.5 text-center text-teal-300">{teamA.name}</th>
                    <th className="p-2.5 text-center text-amber-300">{teamB.name}</th>
                    <th className="p-2.5 text-right">Pemenang Ronde</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 text-stone-200">
                  {activeMatchRecord.map((rec) => (
                    <tr key={rec.challengeNumber}>
                      <td className="p-2.5 font-bold font-mono">Ronde {rec.challengeNumber}</td>
                      <td className="p-2.5">{rec.challengeTitle}</td>
                      <td className="p-2.5 text-center font-bold text-teal-400 font-mono">{rec.teamAScore}</td>
                      <td className="p-2.5 text-center font-bold text-amber-400 font-mono">{rec.teamBScore}</td>
                      <td className="p-2.5 text-right font-bold">
                        {rec.teamAScore > rec.teamBScore ? (
                          <span className="text-teal-400">{teamA.name}</span>
                        ) : rec.teamBScore > rec.teamAScore ? (
                          <span className="text-amber-400">{teamB.name}</span>
                        ) : (
                          <span className="text-stone-400">SERI</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-stone-950 px-6 py-3.5 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={onResetMatch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-850 text-stone-400 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Pertandingan</span>
          </button>

          <div className="flex items-center gap-2">
            {activeMatchRecord.length > 0 && (
              <button
                onClick={handleAnnounceWinner}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-teal-950 text-xs font-extrabold shadow-sm"
              >
                <Trophy className="w-4 h-4" />
                <span>Umumkan Pemenang</span>
              </button>
            )}

            <button
              onClick={handleStartNextTurn}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-teal-950 text-xs font-black shadow-md hover:scale-105 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>MULAI MAINKAN RONDE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
