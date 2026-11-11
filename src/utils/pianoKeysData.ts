import { PianoKeyData, NoteName } from '../types/music';

export const PIANO_KEYS: PianoKeyData[] = [
  // Octave 4
  { pitch: 'C4', midi: 60, frequency: 261.63, isBlack: false, solfege: 'Do', letter: 'C', octave: 4, keyboardShortcut: 'A', staffPosition: 0 },
  { pitch: 'C#4', midi: 61, frequency: 277.18, isBlack: true, solfege: 'Do', letter: 'C#', octave: 4, keyboardShortcut: 'W', staffPosition: 0 },
  { pitch: 'D4', midi: 62, frequency: 293.66, isBlack: false, solfege: 'Re', letter: 'D', octave: 4, keyboardShortcut: 'S', staffPosition: 1 },
  { pitch: 'D#4', midi: 63, frequency: 311.13, isBlack: true, solfege: 'Re', letter: 'D#', octave: 4, keyboardShortcut: 'E', staffPosition: 1 },
  { pitch: 'E4', midi: 64, frequency: 329.63, isBlack: false, solfege: 'Mi', letter: 'E', octave: 4, keyboardShortcut: 'D', staffPosition: 2 },
  { pitch: 'F4', midi: 65, frequency: 349.23, isBlack: false, solfege: 'Fa', letter: 'F', octave: 4, keyboardShortcut: 'F', staffPosition: 3 },
  { pitch: 'F#4', midi: 66, frequency: 369.99, isBlack: true, solfege: 'Fa', letter: 'F#', octave: 4, keyboardShortcut: 'T', staffPosition: 3 },
  { pitch: 'G4', midi: 67, frequency: 392.00, isBlack: false, solfege: 'Sol', letter: 'G', octave: 4, keyboardShortcut: 'G', staffPosition: 4 },
  { pitch: 'G#4', midi: 68, frequency: 415.30, isBlack: true, solfege: 'Sol', letter: 'G#', octave: 4, keyboardShortcut: 'Y', staffPosition: 4 },
  { pitch: 'A4', midi: 69, frequency: 440.00, isBlack: false, solfege: 'La', letter: 'A', octave: 4, keyboardShortcut: 'H', staffPosition: 5 },
  { pitch: 'A#4', midi: 70, frequency: 466.16, isBlack: true, solfege: 'La', letter: 'A#', octave: 4, keyboardShortcut: 'U', staffPosition: 5 },
  { pitch: 'B4', midi: 71, frequency: 493.88, isBlack: false, solfege: 'Si', letter: 'B', octave: 4, keyboardShortcut: 'J', staffPosition: 6 },

  // Octave 5
  { pitch: 'C5', midi: 72, frequency: 523.25, isBlack: false, solfege: 'Do Tinggi', letter: 'C', octave: 5, keyboardShortcut: 'K', staffPosition: 7 },
  { pitch: 'C#5', midi: 73, frequency: 554.37, isBlack: true, solfege: 'Do Tinggi', letter: 'C#', octave: 5, keyboardShortcut: 'O', staffPosition: 7 },
  { pitch: 'D5', midi: 74, frequency: 587.33, isBlack: false, solfege: 'Re', letter: 'D', octave: 5, keyboardShortcut: 'L', staffPosition: 8 },
  { pitch: 'D#5', midi: 75, frequency: 622.25, isBlack: true, solfege: 'Re', letter: 'D#', octave: 5, keyboardShortcut: 'P', staffPosition: 8 },
  { pitch: 'E5', midi: 76, frequency: 659.25, isBlack: false, solfege: 'Mi', letter: 'E', octave: 5, keyboardShortcut: ';', staffPosition: 9 },
  { pitch: 'F5', midi: 77, frequency: 698.46, isBlack: false, solfege: 'Fa', letter: 'F', octave: 5, keyboardShortcut: '\'', staffPosition: 10 },
  { pitch: 'F#5', midi: 78, frequency: 739.99, isBlack: true, solfege: 'Fa', letter: 'F#', octave: 5, keyboardShortcut: '[', staffPosition: 10 },
  { pitch: 'G5', midi: 79, frequency: 783.99, isBlack: false, solfege: 'Sol', letter: 'G', octave: 5, keyboardShortcut: 'Z', staffPosition: 11 },
  { pitch: 'G#5', midi: 80, frequency: 830.61, isBlack: true, solfege: 'Sol', letter: 'G#', octave: 5, keyboardShortcut: ']', staffPosition: 11 },
  { pitch: 'A5', midi: 81, frequency: 880.00, isBlack: false, solfege: 'La', letter: 'A', octave: 5, keyboardShortcut: 'X', staffPosition: 12 },
  { pitch: 'A#5', midi: 82, frequency: 932.33, isBlack: true, solfege: 'La', letter: 'A#', octave: 5, keyboardShortcut: '\\', staffPosition: 12 },
  { pitch: 'B5', midi: 83, frequency: 987.77, isBlack: false, solfege: 'Si', letter: 'B', octave: 5, keyboardShortcut: 'C', staffPosition: 13 },

  // C6 (Final top key)
  { pitch: 'C6', midi: 84, frequency: 1046.50, isBlack: false, solfege: 'Do', letter: 'C', octave: 6, keyboardShortcut: 'V', staffPosition: 14 }
];

export const WHITE_KEYS = PIANO_KEYS.filter(k => !k.isBlack);
export const BLACK_KEYS = PIANO_KEYS.filter(k => k.isBlack);

export function getNoteData(pitch: NoteName): PianoKeyData {
  const found = PIANO_KEYS.find(k => k.pitch === pitch);
  if (!found) {
    return PIANO_KEYS[0];
  }
  return found;
}
