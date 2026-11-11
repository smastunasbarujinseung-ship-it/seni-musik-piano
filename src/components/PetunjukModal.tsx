import React from 'react';
import { X, HelpCircle, Touchpad, Keyboard, Music, Award } from 'lucide-react';

interface PetunjukModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PetunjukModal: React.FC<PetunjukModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/85 backdrop-blur-md">
      <div className="bg-stone-900 border-2 border-teal-600/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-linear-to-r from-teal-950 via-teal-900 to-emerald-950 px-6 py-3.5 border-b border-teal-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-teal-950">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                PANDUAN PENGGUNAAN · SD TERAMIA
              </div>
              <h2 className="text-lg font-extrabold text-white font-display">
                PETUNJUK BERMAIN & PENGGUNAAN LAYAR SENTUH 75 INCI
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
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 text-stone-200 text-xs leading-relaxed">
          {/* Section 1: Touch Screen Hisense 75 Inch */}
          <div className="bg-teal-950/70 border border-teal-700/60 rounded-xl p-4 flex flex-col gap-2">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Touchpad className="w-4 h-4 text-teal-400" />
              <span>1. Penggunaan pada Interactive Flat Panel Hisense 75 Inci (Landscape)</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-stone-300">
              <li>Aplikasi dirancang dengan rasio 16:9 <strong>Single-Screen Fixed Layout</strong> tanpa scrolling. Seluruh tombol dan tuts piano terlihat utuh dalam satu layar.</li>
              <li>Siswa dapat berdiri di depan layar dan menyentuh tuts piano langsung dengan jari. Ukuran tuts sangat besar (64–90px+) sehingga nyaman untuk jari anak SD.</li>
              <li>Mendukung sentuhan multi-touch: siswa dapat menekan beberapa nada sekaligus untuk memainkan akord harmoni.</li>
              <li>Durasi sentuh dibaca secara presisi: sentuhan kilat menghasilkan nada pendek (staccato), dan menahan tuts menghasilkan nada panjang (legato/sustain).</li>
            </ul>
          </div>

          {/* Section 2: Keyboard PC Shortcuts */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col gap-2">
            <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-amber-400" />
              <span>2. Kontrol Keyboard Komputer / Laptop</span>
            </h3>
            <p className="text-stone-300">
              Jika menggunakan komputer atau laptop saat persiapan guru, tuts piano dapat dimainkan langsung menggunakan tombol keyboard:
            </p>
            <div className="p-2 bg-stone-900 rounded-lg font-mono text-[11px] grid grid-cols-2 gap-2 text-stone-300">
              <div>
                <strong className="text-amber-400 block mb-1">Tuts Putih (Oktaf 4 & 5):</strong>
                A (C4), S (D4), D (E4), F (F4), G (G4), H (A4), J (B4), K (C5), L (D5), ; (E5), ' (F5), Z (G5), X (A5), C (B5), V (C6)
              </div>
              <div>
                <strong className="text-teal-400 block mb-1">Tuts Hitam:</strong>
                W (C#4), E (D#4), T (F#4), Y (G#4), U (A#4), O (C#5), P (D#5), [ (F#5), ] (G#5), \ (A#5)
              </div>
            </div>
          </div>

          {/* Section 3: Scoring Rules */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col gap-2">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>3. Sistem Penilaian Musik (Total Maksimal 100 Poin)</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-stone-900 rounded-lg border border-teal-800">
                <span className="text-base font-black text-amber-400 font-mono">40 Poin</span>
                <span className="text-[11px] block font-bold text-white">Ketepatan Nada</span>
                <span className="text-[10px] text-stone-400">Menekan tuts yang benar</span>
              </div>
              <div className="p-2 bg-stone-900 rounded-lg border border-teal-800">
                <span className="text-base font-black text-amber-400 font-mono">30 Poin</span>
                <span className="text-[11px] block font-bold text-white">Ketepatan Tempo</span>
                <span className="text-[10px] text-stone-400">Tepat waktu pada ketukan</span>
              </div>
              <div className="p-2 bg-stone-900 rounded-lg border border-teal-800">
                <span className="text-base font-black text-amber-400 font-mono">20 Poin</span>
                <span className="text-[11px] block font-bold text-white">Ketepatan Durasi</span>
                <span className="text-[10px] text-stone-400">Lama menahan tuts</span>
              </div>
              <div className="p-2 bg-stone-900 rounded-lg border border-teal-800">
                <span className="text-base font-black text-amber-400 font-mono">10 Poin</span>
                <span className="text-[11px] block font-bold text-white">Dinamika</span>
                <span className="text-[10px] text-stone-400">Lembut, sedang, kuat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-950 px-6 py-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white font-bold transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
