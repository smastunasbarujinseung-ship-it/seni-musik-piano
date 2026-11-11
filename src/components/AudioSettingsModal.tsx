import React, { useState } from 'react';
import { AppSettings, DynamicLevel } from '../types/music';
import { audioEngine } from '../utils/audioEngine';
import { narrator } from '../utils/narrator';
import { X, Settings, Volume2, RotateCcw, AlertTriangle } from 'lucide-react';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetAllProgress: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetAllProgress,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/85 backdrop-blur-md">
      <div className="bg-stone-900 border-2 border-teal-600/80 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-linear-to-r from-teal-950 via-teal-900 to-emerald-950 px-6 py-3.5 border-b border-teal-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-teal-950">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                SD TERAMIA · KELAS V SD
              </div>
              <h2 className="text-lg font-extrabold text-white font-display">
                PENGATURAN SUARA & APLIKASI
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
        <div className="p-6 flex flex-col gap-5 text-stone-200 text-xs">
          {/* Master Volume Slider */}
          <div className="flex flex-col gap-2 bg-stone-950 p-3.5 rounded-xl border border-stone-800">
            <div className="flex items-center justify-between">
              <label className="font-bold text-white flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-teal-400" />
                <span>Volume Suara Piano:</span>
              </label>
              <span className="font-mono text-amber-400 font-bold">
                {Math.round(settings.masterVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.masterVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                audioEngine.setMasterVolume(val);
                onUpdateSettings({ masterVolume: val });
              }}
              className="w-full accent-teal-500 cursor-pointer"
            />
          </div>

          {/* Key Label Display Mode */}
          <div className="flex flex-col gap-2 bg-stone-950 p-3.5 rounded-xl border border-stone-800">
            <label className="font-bold text-white">Tampilan Label pada Tuts Piano:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'both', label: 'Do Re Mi & C D E' },
                { val: 'solfege', label: 'Do Re Mi Saja' },
                { val: 'letter', label: 'C D E Saja' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => onUpdateSettings({ keyLabelMode: opt.val as any })}
                  className={`p-2 rounded-lg font-bold transition-all border ${
                    settings.keyLabelMode === opt.val
                      ? 'bg-teal-700 text-white border-teal-400'
                      : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Narrator Voice Settings */}
          <div className="flex flex-col gap-2.5 bg-stone-950 p-3.5 rounded-xl border border-stone-800">
            <div className="flex items-center justify-between">
              <label className="font-bold text-white">Narator Suara Bahasa Indonesia:</label>
              <button
                onClick={() => {
                  const nextVal = !settings.narratorEnabled;
                  narrator.setEnabled(nextVal);
                  onUpdateSettings({ narratorEnabled: nextVal });
                }}
                className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                  settings.narratorEnabled
                    ? 'bg-emerald-500 text-teal-950'
                    : 'bg-stone-800 text-stone-400'
                }`}
              >
                {settings.narratorEnabled ? 'AKTIF' : 'NONAKTIF'}
              </button>
            </div>

            <div className="flex items-center justify-between text-stone-400 pt-1">
              <span>Kecepatan Bicara Narator:</span>
              <div className="flex items-center gap-1">
                {[0.85, 1.0, 1.15].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      narrator.setRate(rate);
                      onUpdateSettings({ narratorRate: rate });
                    }}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      settings.narratorRate === rate
                        ? 'bg-amber-400 text-teal-950'
                        : 'bg-stone-900 text-stone-400 hover:text-white'
                    }`}
                  >
                    {rate === 1.0 ? 'Normal' : rate < 1.0 ? 'Pelan' : 'Cepat'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset All Progress (With Confirmation) */}
          <div className="bg-rose-950/40 border border-rose-900/60 p-3.5 rounded-xl flex flex-col gap-2">
            {!showResetConfirm ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-rose-300 block">Reset Seluruh Progres Belajar</span>
                  <span className="text-[11px] text-stone-400">Menghapus riwayat skor dan refleksi siswa</span>
                </div>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-1.5 rounded-lg bg-rose-800 hover:bg-rose-700 text-white font-bold"
                >
                  Reset Progres
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-2 bg-rose-950/80 rounded-lg">
                <div className="flex items-center gap-2 text-rose-200 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Apakah kamu yakin ingin mereset seluruh data nilai dan pertandingan?</span>
                </div>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1 rounded bg-stone-800 text-stone-300 font-bold"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      onResetAllProgress();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold"
                  >
                    Ya, Reset Sekarang
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-950 px-6 py-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
