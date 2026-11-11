import React, { useState, useEffect } from 'react';
import { NoteName, DynamicLevel } from '../types/music';
import { audioEngine } from '../utils/audioEngine';
import { narrator } from '../utils/narrator';
import { X, Play, RotateCcw, ArrowRight, ArrowLeft, Volume2, CheckCircle2, Sparkles } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHighlightPitch: (pitch: NoteName | null) => void;
}

interface TutorialStep {
  stage: number;
  title: string;
  subtitle: string;
  narration: string;
  explanation: string;
  targetPitches: NoteName[];
  demoType: 'piano_intro' | 'solfege_scale' | 'staff_read' | 'rhythm_beat' | 'dynamics' | 'simple_tune';
}

const TUTORIAL_STAGES: TutorialStep[] = [
  {
    stage: 1,
    title: 'Tahap 1: Mengenal Piano',
    subtitle: 'Tuts Putih, Tuts Hitam, dan Posisi Nada',
    narration: 'Selamat datang di Tahap 1. Piano memiliki tuts putih untuk nada alami dan tuts hitam untuk nada kromatis. Tuts tersusun dari nada rendah di sebelah kiri hingga nada tinggi di sebelah kanan.',
    explanation: 'Amati tuts piano digital di bawah. Tuts hitam tersusun dalam kelompok dua tuts dan tiga tuts. Tuts putih persis di sebelah kiri dua tuts hitam adalah nada C atau Do!',
    targetPitches: ['C4', 'D4', 'E4'],
    demoType: 'piano_intro',
  },
  {
    stage: 2,
    title: 'Tahap 2: Mengenal Nada',
    subtitle: 'Do, Re, Mi, Fa, Sol, La, Si',
    narration: 'Di Tahap 2, kita mengenal tujuh nada pokok: Do, Re, Mi, Fa, Sol, La, dan Si. Dengarkan dan tirukan urutan nada berikut.',
    explanation: 'Setiap nada memiliki frekuensi yang semakin tinggi saat bergerak ke kanan: C4 (Do), D4 (Re), E4 (Mi), F4 (Fa), G4 (Sol), A4 (La), B4 (Si), hingga C5 (Do Tinggi).',
    targetPitches: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
    demoType: 'solfege_scale',
  },
  {
    stage: 3,
    title: 'Tahap 3: Membaca Not Balok',
    subtitle: 'Hubungan Lima Garis Paranada dengan Tuts Piano',
    narration: 'Pada Tahap 3, kita membaca not balok pada lima garis paranada dengan kunci G. Perhatikan not yang disorot, lalu temukan tuts yang sesuai.',
    explanation: 'Not C4 (Do) berada di garis bantu di bawah paranada. Not E4 (Mi) berada tepat di garis pertama, dan not G4 (Sol) berada di garis kedua tempat lekukan Kunci G berada.',
    targetPitches: ['C4', 'E4', 'G4'],
    demoType: 'staff_read',
  },
  {
    stage: 4,
    title: 'Tahap 4: Belajar Irama',
    subtitle: 'Mengikuti Ketukan Stabil Birama 4/4',
    narration: 'Tahap 4 melatih ketukan irama. Irama adalah detak jantung sebuah lagu. Dengarkan ketukan metronom dan mainkan tuts tepat pada ketukan!',
    explanation: 'Birama 4/4 berarti terdapat 4 ketukan dalam satu birama. Tekan nada C4 secara teratur mengikuti bunyi ketukan satu, dua, tiga, empat!',
    targetPitches: ['C4', 'C4', 'C4', 'C4'],
    demoType: 'rhythm_beat',
  },
  {
    stage: 5,
    title: 'Tahap 5: Belajar Dinamika',
    subtitle: 'Keras dan Lembutnya Suara (p, mf, f)',
    narration: 'Tahap 5 adalah belajar dinamika. Musik memiliki perasaan! Piano p bersuara lembut, mezzo-forte mf bersuara sedang, dan forte f bersuara kuat.',
    explanation: 'Cobalah gunakan tombol dinamika di atas piano: pilih LEMBUT (p) lalu mainkan nada, kemudian ganti ke KUAT (f) dan dengarkan perbedaannya!',
    targetPitches: ['C4', 'E4', 'G4'],
    demoType: 'dynamics',
  },
  {
    stage: 6,
    title: 'Tahap 6: Memainkan Komposisi',
    subtitle: 'Memadukan Nada, Irama, dan Dinamika',
    narration: 'Luar biasa! Kini kamu siap memainkan melodi sederhana. Ikuti alunan melodi dan mainkan nada dengan percaya diri!',
    explanation: 'Selamat! Kamu telah menguasai dasar piano digital. Tekan tombol Demonstrasi untuk melihat contoh lagu, lalu coba mainkan sendiri!',
    targetPitches: ['C4', 'D4', 'E4', 'C4', 'E4', 'G4'],
    demoType: 'simple_tune',
  },
];

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onHighlightPitch,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [practiceSuccess, setPracticeSuccess] = useState<boolean>(false);

  const step = TUTORIAL_STAGES[currentStageIdx];

  useEffect(() => {
    if (isOpen) {
      setPracticeSuccess(false);
      onHighlightPitch(null);
      narrator.speak(step.narration);
    }
  }, [isOpen, currentStageIdx]);

  if (!isOpen) return null;

  // Run Demonstration
  const handleDemonstration = () => {
    setIsPlayingDemo(true);
    setPracticeSuccess(false);

    let delay = 0;
    const noteTime = 600;

    step.targetPitches.forEach((pitch, i) => {
      setTimeout(() => {
        onHighlightPitch(pitch);
        audioEngine.startNote(pitch, 'mf');
        setTimeout(() => {
          audioEngine.stopNote(pitch);
        }, 400);
      }, delay);
      delay += noteTime;
    });

    setTimeout(() => {
      onHighlightPitch(null);
      setIsPlayingDemo(false);
      narrator.speak('Sekarang giliranmu! Tekan tombol Coba Sendiri untuk berlatih.');
    }, delay + 200);
  };

  // Try it yourself mode
  const handleTryYourself = () => {
    setPracticeSuccess(true);
    narrator.speak('Hebat! Kamu telah mencoba sendiri dengan sangat baik. Lanjutkan ke tahap berikutnya!');
  };

  const handleNext = () => {
    if (currentStageIdx < TUTORIAL_STAGES.length - 1) {
      setCurrentStageIdx(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStageIdx > 0) {
      setCurrentStageIdx(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/85 backdrop-blur-md">
      <div className="bg-stone-900 border-2 border-teal-600/80 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-linear-to-r from-teal-950 via-teal-900 to-emerald-950 px-6 py-3.5 border-b border-teal-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-teal-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                TUTORIAL INTERAKTIF PIANO · KELAS V SD
              </div>
              <h2 className="text-lg font-extrabold text-white font-display">
                {step.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              narrator.stop();
              onHighlightPitch(null);
              onClose();
            }}
            className="p-2 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage Progress Stepper (1 to 6) */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-stone-950 border-b border-stone-800">
          {TUTORIAL_STAGES.map((s, idx) => (
            <button
              key={s.stage}
              onClick={() => setCurrentStageIdx(idx)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                idx === currentStageIdx
                  ? 'bg-amber-400 text-teal-950 shadow ring-2 ring-amber-300'
                  : idx < currentStageIdx
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600/60'
                  : 'bg-stone-900 text-stone-500'
              }`}
            >
              <span>{s.stage}</span>
              <span className="hidden sm:inline">
                {idx === 0 ? 'Piano' : idx === 1 ? 'Nada' : idx === 2 ? 'Not Balok' : idx === 3 ? 'Irama' : idx === 4 ? 'Dinamika' : 'Lagu'}
              </span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 flex flex-col gap-4">
          <div className="bg-teal-950/70 border border-teal-700/50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-amber-300 font-display">
                {step.subtitle}
              </h3>
              <button
                onClick={() => narrator.speak(step.narration)}
                className="flex items-center gap-1 text-xs text-teal-300 hover:text-white bg-teal-900/80 px-2.5 py-1 rounded-lg border border-teal-700"
                title="Dengarkan Narator"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Ulangi Narasi</span>
              </button>
            </div>
            <p className="text-sm text-stone-200 leading-relaxed">
              {step.explanation}
            </p>
          </div>

          {/* Interactive Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDemonstration}
              disabled={isPlayingDemo}
              className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                isPlayingDemo
                  ? 'bg-amber-400 text-teal-950 animate-pulse'
                  : 'bg-teal-700 hover:bg-teal-600 text-white'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isPlayingDemo ? 'DEMONSTRASI BERJALAN...' : 'DEMONSTRASI'}</span>
            </button>

            <button
              onClick={handleTryYourself}
              className="py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-teal-950 shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>COBA SENDIRI</span>
            </button>
          </div>

          {/* Feedback banner if tried */}
          {practiceSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-xs font-bold text-emerald-200 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bagus sekali! Kamu telah menyelesaikan pemahaman tahap ini.</span>
              </div>
              <button
                onClick={handleNext}
                className="px-3 py-1 rounded bg-amber-400 text-teal-950 text-xs font-extrabold hover:bg-amber-300 transition-colors"
              >
                Lanjut
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-stone-950 px-6 py-3 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStageIdx === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <button
            onClick={() => {
              setPracticeSuccess(false);
              onHighlightPitch(null);
              narrator.speak(step.narration);
            }}
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Tahap Ini</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-teal-950 text-xs font-extrabold shadow-sm transition-colors"
          >
            <span>{currentStageIdx === TUTORIAL_STAGES.length - 1 ? 'Selesai Tutorial' : 'LANJUT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
