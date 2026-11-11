import React, { useState } from 'react';
import { ReflectionData } from '../types/music';
import { narrator } from '../utils/narrator';
import { X, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';

interface RefleksiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveReflection: (data: ReflectionData) => void;
  savedReflection?: ReflectionData | null;
}

export const RefleksiModal: React.FC<RefleksiModalProps> = ({
  isOpen,
  onClose,
  onSaveReflection,
  savedReflection,
}) => {
  const [level, setLevel] = useState<'sangat_paham' | 'mulai_paham' | 'perlu_latihan'>(
    savedReflection?.understandingLevel || 'sangat_paham'
  );
  const [favoritePart, setFavoritePart] = useState<string>(savedReflection?.favoritePart || '');
  const [difficultPart, setDifficultPart] = useState<string>(savedReflection?.difficultPart || '');
  const [notes, setNotes] = useState<string>(savedReflection?.notes || '');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveReflection({
      understandingLevel: level,
      favoritePart,
      difficultPart,
      notes,
      submittedAt: new Date().toLocaleDateString('id-ID'),
    });
    setIsSaved(true);
    narrator.speak('Terima kasih atas refleksimu! Guru dan teman-teman bangga atas usaha belajarmu hari ini.');
    setTimeout(() => {
      onClose();
      setIsSaved(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/85 backdrop-blur-md">
      <div className="bg-stone-900 border-2 border-teal-600/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-linear-to-r from-teal-950 via-teal-900 to-emerald-950 px-6 py-3.5 border-b border-teal-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-teal-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                PEMBELAJARAN MENDALAM · SENI MUSIK KELAS V SD
              </div>
              <h2 className="text-lg font-extrabold text-white font-display">
                LEMBAR REFLEKSI BELAJAR SISWA
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 text-stone-200 text-xs">
          {/* Understanding Level Radio Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-amber-300">
              1. Bagaimana tingkat pemahamanmu terhadap nada dan partitur hari ini?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 'sangat_paham', label: 'Sudah Sangat Paham' },
                { val: 'mulai_paham', label: 'Mulai Memahami' },
                { val: 'perlu_latihan', label: 'Masih Perlu Latihan' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.val}
                  onClick={() => setLevel(opt.val as any)}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    level === opt.val
                      ? 'bg-teal-700 text-white border-teal-400 shadow ring-2 ring-teal-400'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Favorite Part */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-stone-300">
              2. Bagian mana atau lagu apa yang paling menyenangkan bagimu?
            </label>
            <input
              type="text"
              placeholder="Contoh: Saat memainkan tuts nada cepat dan pertandingan antartim..."
              value={favoritePart}
              onChange={(e) => setFavoritePart(e.target.value)}
              className="bg-stone-950 text-white p-2.5 rounded-lg border border-stone-800 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Question 3: Difficult Part */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-stone-300">
              3. Bagian mana yang paling menantang dan perlu kamu latih lagi?
            </label>
            <input
              type="text"
              placeholder="Contoh: Menjaga ketukan stabil saat not seperdelapan..."
              value={difficultPart}
              onChange={(e) => setDifficultPart(e.target.value)}
              className="bg-stone-950 text-white p-2.5 rounded-lg border border-stone-800 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Question 4: Notes & Thoughts */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-stone-300">
              4. Catatan atau pesan untuk gurumu di SD TERAMIA:
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan pengalaman belajarmu hari ini..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-stone-950 text-white p-2.5 rounded-lg border border-stone-800 focus:outline-none focus:border-teal-500 resize-none"
            />
          </div>

          {isSaved && (
            <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Refleksi berhasil disimpan!</span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black shadow-md transition-all"
            >
              Simpan Refleksi Siswa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
