import React, { useState } from 'react';
import { audioEngine } from '../utils/audioEngine';
import { narrator } from '../utils/narrator';
import { X, BookOpen, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

interface MateriMusikModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MateriMusikModal: React.FC<MateriMusikModalProps> = ({ isOpen, onClose }) => {
  const [activeChapter, setActiveChapter] = useState<string>('piano');

  if (!isOpen) return null;

  const chapters = [
    { id: 'piano', label: 'A. Mengenal Piano', icon: '🎹' },
    { id: 'nada', label: 'B. Mengenal Nada', icon: '🎵' },
    { id: 'not_balok', label: 'C. Mengenal Not Balok', icon: '🎼' },
    { id: 'irama', label: 'D. Irama & Ketukan', icon: '⏱️' },
    { id: 'dinamika', label: 'E. Mengenal Dinamika', icon: '🔊' },
    { id: 'teknik', label: 'F. Teknik Dasar Piano', icon: '🖐️' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/85 backdrop-blur-md">
      <div className="bg-stone-900 border-2 border-teal-600/80 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-linear-to-r from-teal-950 via-teal-900 to-emerald-950 px-6 py-3.5 border-b border-teal-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-teal-950">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                MATERI PEMBELAJARAN SENI MUSIK KELAS V SD · SD TERAMIA
              </div>
              <h2 className="text-lg font-extrabold text-white font-display">
                MODUL PEMBELAJARAN PIANO DIGITAL & TEORI MUSIK
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              narrator.stop();
              onClose();
            }}
            className="p-2 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapter Tabs */}
        <div className="flex items-center gap-1.5 p-3 bg-stone-950 border-b border-stone-800 px-6 overflow-x-auto no-scrollbar">
          {chapters.map((chap) => (
            <button
              key={chap.id}
              onClick={() => setActiveChapter(chap.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeChapter === chap.id
                  ? 'bg-teal-700 text-white shadow ring-2 ring-teal-400'
                  : 'bg-stone-900 text-stone-400 hover:bg-stone-850 hover:text-white'
              }`}
            >
              <span>{chap.icon}</span>
              <span>{chap.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-900/80 text-stone-200 flex flex-col gap-5">
          {activeChapter === 'piano' && (
            <div className="flex flex-col gap-4">
              <div className="bg-teal-950/60 border border-teal-700/60 rounded-xl p-4 flex flex-col gap-2">
                <h3 className="text-base font-extrabold text-amber-300 font-display flex items-center justify-between">
                  <span>A. Mengenal Piano Digital</span>
                  <button
                    onClick={() => narrator.speak('Piano adalah alat musik tuts yang dapat menghasilkan melodi dan harmoni yang indah. Tuts putih menghasilkan nada alami, sedangkan tuts hitam menghasilkan nada kromatis.')}
                    className="flex items-center gap-1 text-xs text-teal-300 hover:text-white bg-teal-900 px-2.5 py-1 rounded"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Dengarkan</span>
                  </button>
                </h3>
                <p className="text-sm leading-relaxed">
                  Piano adalah instrumen musik yang dimainkan dengan menekan tuts. Pada piano akustik sungguhan, menekan tuts akan menggerakkan palu kecil (hammer) yang memukul senar baja di dalamnya. Pada piano digital, sensor mendeteksi sentuhan jari dan menghasilkan sampel suara akustik beresolusi tinggi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <h4 className="text-sm font-bold text-teal-300 mb-2">Tuts Putih (Natural Keys)</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Tuts putih menghasilkan nada-nada alami: C, D, E, F, G, A, dan B (Do, Re, Mi, Fa, Sol, La, Si). Pada piano kelas V kita, terdapat 15 tuts putih yang membentang dari C4 (Do tengah) hingga C6 (Do dua oktaf di atasnya).
                  </p>
                </div>

                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <h4 className="text-sm font-bold text-amber-300 mb-2">Tuts Hitam (Accidental Keys)</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Tuts hitam menghasilkan nada kres (#) atau mol (b). Tuts hitam tersusun dalam kelompok dua tuts (C# dan D#) dan kelompok tiga tuts (F#, G#, A#). Ini menjadi patokan utama musisi untuk menemukan letak nada C!
                  </p>
                </div>
              </div>

              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                <h4 className="text-sm font-bold text-emerald-400 mb-2">Bagian-Bagian Utama Piano:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-300">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>Keybed & Keys:</strong> Papan tuts tempat jari menekan nada.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>Damper & Release:</strong> Peredam getaran senar saat jari dilepas.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>Fallboard:</strong> Penutup tuts piano dengan lambang SD TERAMIA.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>Pedal Sustain:</strong> Menjaga nada tetap bergema meskipun jari sudah diangkat.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeChapter === 'nada' && (
            <div className="flex flex-col gap-4">
              <div className="bg-teal-950/60 border border-teal-700/60 rounded-xl p-4 flex flex-col gap-2">
                <h3 className="text-base font-extrabold text-amber-300 font-display flex items-center justify-between">
                  <span>B. Mengenal Nada & Tangga Nada Diatonis</span>
                  <button
                    onClick={() => narrator.speak('Nada adalah bunyi yang teratur getarannya. Tangga nada diatonis mayor terdiri dari Do, Re, Mi, Fa, Sol, La, Si, Do.')}
                    className="flex items-center gap-1 text-xs text-teal-300 hover:text-white bg-teal-900 px-2.5 py-1 rounded"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Dengarkan</span>
                  </button>
                </h3>
                <p className="text-sm leading-relaxed">
                  Nada adalah bunyi yang memiliki frekuensi getaran teratur setiap detiknya. Makin cepat getarannya, makin tinggi nadanya. Tangga nada standar yang kita pelajari di kelas V adalah tangga nada C Mayor (Diatonis Mayor).
                </p>
              </div>

              {/* Solfege Interactive Scale Buttons */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-3">
                  Klik untuk Mendengarkan Nada Tangga C Mayor:
                </h4>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {[
                    { p: 'C4', sol: 'Do', num: '1' },
                    { p: 'D4', sol: 'Re', num: '2' },
                    { p: 'E4', sol: 'Mi', num: '3' },
                    { p: 'F4', sol: 'Fa', num: '4' },
                    { p: 'G4', sol: 'Sol', num: '5' },
                    { p: 'A4', sol: 'La', num: '6' },
                    { p: 'B4', sol: 'Si', num: '7' },
                    { p: 'C5', sol: 'Do Tinggi', num: 'i' },
                  ].map((n) => (
                    <button
                      key={n.p}
                      onClick={() => {
                        audioEngine.startNote(n.p as any, 'mf');
                        setTimeout(() => audioEngine.stopNote(n.p as any), 350);
                      }}
                      className="p-3 bg-teal-900/60 hover:bg-teal-700 border border-teal-600 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95"
                    >
                      <span className="text-lg font-black text-amber-300 font-display">{n.num}</span>
                      <span className="text-xs font-bold text-white">{n.sol}</span>
                      <span className="text-[10px] text-teal-300 font-mono">{n.p}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <h4 className="text-sm font-bold text-teal-300 mb-1">Nada Rendah vs Nada Tinggi</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Sisi kiri keyboard menghasilkan nada bass yang rendah dan berat. Saat bergerak ke kanan, nada terdengar semakin tinggi, nyaring, dan cerah.
                  </p>
                </div>
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <h4 className="text-sm font-bold text-amber-300 mb-1">Konsep Oktaf</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Oktaf adalah rentang antara satu nada dengan nada berikutnya yang bernama sama tetapi berfrekuensi dua kali lipat lebih tinggi, misalnya dari C4 ke C5.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'not_balok' && (
            <div className="flex flex-col gap-4">
              <div className="bg-teal-950/60 border border-teal-700/60 rounded-xl p-4 flex flex-col gap-2">
                <h3 className="text-base font-extrabold text-amber-300 font-display">
                  C. Mengenal Not Balok & Lima Garis Paranada
                </h3>
                <p className="text-sm leading-relaxed">
                  Not balok ditulis pada sistem <strong>lima garis sejajar</strong> yang disebut <strong>paranada (staff)</strong>. Garis dihitung dari bawah ke atas: garis 1, garis 2, garis 3, garis 4, dan garis 5. Ruang di antara dua garis disebut <strong>spasi</strong> (spasi 1, 2, 3, 4).
                </p>
              </div>

              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col gap-3">
                <h4 className="text-sm font-bold text-teal-300">Letak Nada pada Garis & Spasi (Kunci G):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-stone-300">
                  <div className="p-3 bg-stone-900 rounded-lg border border-stone-800">
                    <strong className="text-amber-400 block mb-1">Nada pada Garis Paranada:</strong>
                    <ul className="space-y-1">
                      <li>• Garis 1: Nada <strong>E (Mi)</strong></li>
                      <li>• Garis 2: Nada <strong>G (Sol)</strong> — Tempat pusaran Kunci G!</li>
                      <li>• Garis 3: Nada <strong>B (Si)</strong></li>
                      <li>• Garis 4: Nada <strong>D (Re Tinggi)</strong></li>
                      <li>• Garis 5: Nada <strong>F (Fa Tinggi)</strong></li>
                    </ul>
                  </div>

                  <div className="p-3 bg-stone-900 rounded-lg border border-stone-800">
                    <strong className="text-emerald-400 block mb-1">Nada pada Spasi Paranada:</strong>
                    <ul className="space-y-1">
                      <li>• Spasi 1: Nada <strong>F (Fa)</strong></li>
                      <li>• Spasi 2: Nada <strong>A (La)</strong></li>
                      <li>• Spasi 3: Nada <strong>C (Do Tinggi)</strong></li>
                      <li>• Spasi 4: Nada <strong>E (Mi Tinggi)</strong></li>
                      <li>• Garis Bantu Bawah: Nada <strong>C (Do Tengah / C4)</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'irama' && (
            <div className="flex flex-col gap-4">
              <div className="bg-teal-950/60 border border-teal-700/60 rounded-xl p-4 flex flex-col gap-2">
                <h3 className="text-base font-extrabold text-amber-300 font-display">
                  D. Mengenal Irama, Ketukan, dan Nilai Not
                </h3>
                <p className="text-sm leading-relaxed">
                  Irama adalah panjang pendeknya bunyi yang teratur. Ketukan (beat) dihitung seperti detik jam. Pada birama 4/4, setiap satu birama (bar) berisi tepat 4 ketukan.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex flex-col items-center text-center">
                  <span className="text-2xl font-black text-amber-300">𝅝</span>
                  <strong className="text-xs text-white mt-1">Not Penuh (Whole)</strong>
                  <span className="text-xs text-teal-400 font-bold">4 Ketukan</span>
                  <span className="text-[10px] text-stone-400 mt-1">Bunyi ditahan selama 4 ketuk penuh.</span>
                </div>

                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex flex-col items-center text-center">
                  <span className="text-2xl font-black text-amber-300">𝅗𝅥</span>
                  <strong className="text-xs text-white mt-1">Not Setengah (Half)</strong>
                  <span className="text-xs text-teal-400 font-bold">2 Ketukan</span>
                  <span className="text-[10px] text-stone-400 mt-1">Bunyi ditahan selama 2 ketukan.</span>
                </div>

                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex flex-col items-center text-center">
                  <span className="text-2xl font-black text-amber-300">𝅘𝅥</span>
                  <strong className="text-xs text-white mt-1">Not Seperempat (Quarter)</strong>
                  <span className="text-xs text-teal-400 font-bold">1 Ketukan</span>
                  <span className="text-[10px] text-stone-400 mt-1">Satu ketukan standar detak lagu.</span>
                </div>

                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex flex-col items-center text-center">
                  <span className="text-2xl font-black text-amber-300">𝅘𝅥𝅮</span>
                  <strong className="text-xs text-white mt-1">Not Seperdelapan (Eighth)</strong>
                  <span className="text-xs text-teal-400 font-bold">1/2 Ketukan</span>
                  <span className="text-[10px] text-stone-400 mt-1">Ketukan cepat setengah beat.</span>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'dinamika' && (
            <div className="flex flex-col gap-4">
              <div className="bg-teal-950/60 border border-teal-700/60 rounded-xl p-4 flex flex-col gap-2">
                <h3 className="text-base font-extrabold text-amber-300 font-display">
                  E. Mengenal Dinamika Musik
                </h3>
                <p className="text-sm leading-relaxed">
                  Dinamika adalah tanda kuat dan lemahnya volume suara pada musik. Dinamika memberi jiwa dan ekspresi agar musik tidak terdengar kaku!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-stone-950 rounded-xl border border-teal-800 flex flex-col gap-2">
                  <span className="text-2xl font-serif italic font-black text-teal-400">p</span>
                  <strong className="text-sm text-white">Piano (Lembut)</strong>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Dimainkan dengan lembut, tenang, dan santai seperti bisikan angin sepoi-sepoi.
                  </p>
                </div>

                <div className="p-4 bg-stone-950 rounded-xl border border-teal-600 flex flex-col gap-2">
                  <span className="text-2xl font-serif italic font-black text-emerald-400">mf</span>
                  <strong className="text-sm text-white">Mezzo-Forte (Sedang)</strong>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Volume sedang wajar, nyaman didengar, seperti suara kita berbicara santai di kelas.
                  </p>
                </div>

                <div className="p-4 bg-stone-950 rounded-xl border border-amber-600 flex flex-col gap-2">
                  <span className="text-2xl font-serif italic font-black text-amber-400">f</span>
                  <strong className="text-sm text-white">Forte (Kuat)</strong>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Dimainkan dengan suara lantang, megah, dan tegas seperti lagu perjuangan atau pawai juara.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'teknik' && (
            <div className="flex flex-col gap-4">
              <div className="bg-teal-950/60 border border-teal-700/60 rounded-xl p-4 flex flex-col gap-2">
                <h3 className="text-base font-extrabold text-amber-300 font-display">
                  F. Teknik Dasar Memainkan Piano
                </h3>
                <p className="text-sm leading-relaxed">
                  Postur dan posisi tangan yang benar membuat siswa dapat bermain piano dengan nyaman, luwes, dan tidak cepat lelah saat berada di depan layar sentuh 75 inci.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <h4 className="text-sm font-bold text-teal-300 mb-2">1. Bentuk Jari Memegang Bola</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Jari-jemari harus melengkung santai seperti sedang menggenggam bola tenis atau buah apel. Ujung bantalan jari yang menyentuh tuts, jangan menekan dengan jari lurus atau tegang.
                  </p>
                </div>

                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <h4 className="text-sm font-bold text-amber-300 mb-2">2. Penomoran Jari (Fingering)</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Jari 1: Ibu jari (Jempol)<br />
                    Jari 2: Jari Telunjuk<br />
                    Jari 3: Jari Tengah<br />
                    Jari 4: Jari Manis<br />
                    Jari 5: Jari Kelingking
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-950 px-6 py-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span>Modul Seni Musik Kurikulum Merdeka Kelas V SD TERAMIA.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white font-bold transition-colors"
          >
            Tutup Materi
          </button>
        </div>
      </div>
    </div>
  );
};
