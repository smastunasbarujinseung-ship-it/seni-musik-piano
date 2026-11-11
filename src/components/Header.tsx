import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, BookOpen, HelpCircle, Settings, Users, PlayCircle, Music, Sparkles, Award } from 'lucide-react';

interface HeaderProps {
  activeView: 'game' | 'freeplay';
  onSelectView: (view: 'game' | 'freeplay') => void;
  onOpenTutorial: () => void;
  onOpenTeamMatch: () => void;
  onOpenMateri: () => void;
  onOpenPetunjuk: () => void;
  onOpenSettings: () => void;
  onOpenLevelSelect: () => void;
  onOpenHistory: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  narratorSpeaking: boolean;
  narratorText: string;
  narratorEnabled: boolean;
  onToggleNarrator: () => void;
  onRepeatNarrator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  onOpenTutorial,
  onOpenTeamMatch,
  onOpenMateri,
  onOpenPetunjuk,
  onOpenSettings,
  onOpenLevelSelect,
  onOpenHistory,
  isFullscreen,
  onToggleFullscreen,
  narratorSpeaking,
  narratorText,
  narratorEnabled,
  onToggleNarrator,
  onRepeatNarrator,
}) => {
  return (
    <header className="w-full bg-linear-to-r from-teal-950 via-teal-900 to-emerald-950 border-b border-teal-700/50 px-4 py-2 flex items-center justify-between shadow-lg select-none z-30 shrink-0">
      {/* Left: School Identity & Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 text-teal-950 font-black shadow-md border border-amber-300">
          <Music className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded text-xs tracking-wider border border-amber-400/40">
              SD TERAMIA
            </span>
            <span className="text-teal-200 text-xs font-semibold">
              Seni Musik · Kelas V SD
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-wide font-display flex items-center gap-1.5">
            PIANO CERIA
            <span className="text-xs font-medium text-emerald-300 hidden xl:inline-block ml-2 opacity-90 font-sans">
              "Kenali Nadanya, Mainkan Lagunya, Tunjukkan Bakatmu!"
            </span>
          </h1>
        </div>
      </div>

      {/* Center: Main Primary Game & Learning Navigation Buttons */}
      <div className="flex items-center gap-1.5 bg-teal-950/70 p-1 rounded-xl border border-teal-800/80">
        <button
          onClick={onOpenLevelSelect}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-emerald-500 hover:bg-emerald-400 text-teal-950 shadow-sm"
          title="Pilih Level dan Tantangan Lagu"
        >
          <PlayCircle className="w-4 h-4" />
          <span>MULAI BELAJAR</span>
        </button>

        <button
          onClick={onOpenTutorial}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-teal-800 hover:bg-teal-700 text-white"
          title="6 Tahapan Tutorial Piano Interaktif"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>TUTORIAL PIANO</span>
        </button>

        <button
          onClick={() => onSelectView('freeplay')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeView === 'freeplay'
              ? 'bg-amber-400 text-teal-950 shadow'
              : 'bg-teal-900/60 hover:bg-teal-800 text-teal-100'
          }`}
          title="Latihan Bebas Memainkan Piano"
        >
          <Music className="w-4 h-4" />
          <span>LATIHAN BEBAS</span>
        </button>

        <button
          onClick={() => {
            onSelectView('game');
            onOpenLevelSelect();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeView === 'game'
              ? 'bg-teal-700 text-white shadow'
              : 'bg-teal-900/60 hover:bg-teal-800 text-teal-100'
          }`}
          title="Mainkan 30 Tantangan Komposisi Musik"
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>GAME TANTANGAN</span>
        </button>

        <button
          onClick={onOpenTeamMatch}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-teal-950 shadow-sm"
          title="Pertandingan Musik Antartim Tim A vs Tim B"
        >
          <Users className="w-4 h-4" />
          <span>PERTANDINGAN ANTARTIM</span>
        </button>

        <button
          onClick={onOpenMateri}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-teal-900/80 hover:bg-teal-800 text-teal-100"
          title="Materi Musik Kelas V SD"
        >
          <BookOpen className="w-4 h-4 text-emerald-300" />
          <span>MATERI MUSIK</span>
        </button>
      </div>

      {/* Right: Sound, Guidance, History & Fullscreen Controls */}
      <div className="flex items-center gap-2">
        {/* Indonesian TTS Live Speech Balloon if speaking */}
        {narratorSpeaking && narratorText && (
          <div
            onClick={onRepeatNarrator}
            className="hidden lg:flex items-center gap-2 bg-amber-400/90 text-teal-950 text-xs font-semibold px-3 py-1 rounded-full shadow cursor-pointer animate-pulse max-w-xs truncate"
            title="Klik untuk mengulangi suara narator"
          >
            <span className="w-2 h-2 rounded-full bg-teal-900" />
            <span className="truncate">{narratorText}</span>
          </div>
        )}

        <button
          onClick={onToggleNarrator}
          className={`p-2 rounded-lg text-xs font-medium transition-colors ${
            narratorEnabled ? 'bg-teal-800 text-amber-300 hover:bg-teal-700' : 'bg-teal-950 text-teal-500 hover:bg-teal-900'
          }`}
          title={narratorEnabled ? 'Narator Suara Aktif (Klik untuk Mematikan)' : 'Narator Suara Mati (Klik untuk Menyalakan)'}
        >
          {narratorEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenPetunjuk}
          className="p-2 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-teal-200 hover:text-white transition-colors"
          title="Petunjuk Permainan & Touchscreen 75 Inci"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenHistory}
          className="p-2 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-teal-200 hover:text-white transition-colors"
          title="Riwayat Skor & Progres Belajar"
        >
          <Award className="w-4 h-4 text-amber-300" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-teal-200 hover:text-white transition-colors"
          title="Pengaturan Suara, Label Tuts & Aplikasi"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleFullscreen}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs border border-teal-600 transition-colors"
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Masuk Layar Penuh (Hisense 75")'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span className="hidden sm:inline">LAYAR PENUH</span>
        </button>
      </div>
    </header>
  );
};
