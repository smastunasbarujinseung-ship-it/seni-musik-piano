/**
 * Types for Piano Ceria - SD TERAMIA
 * Seni Musik Kelas V SD
 */

export type SolfegeName = 'Do' | 'Re' | 'Mi' | 'Fa' | 'Sol' | 'La' | 'Si' | 'Do Tinggi';
export type NoteName = 'C4' | 'C#4' | 'D4' | 'D#4' | 'E4' | 'F4' | 'F#4' | 'G4' | 'G#4' | 'A4' | 'A#4' | 'B4' |
                       'C5' | 'C#5' | 'D5' | 'D#5' | 'E5' | 'F5' | 'F#5' | 'G5' | 'G#5' | 'A5' | 'A#5' | 'B5' | 'C6';

export type DynamicLevel = 'p' | 'mf' | 'f'; // Lembut, Sedang, Kuat
export type NoteType = 'whole' | 'half' | 'quarter' | 'eighth'; // Penuh, Setengah, Seperempat, Seperdelapan

export interface PianoKeyData {
  pitch: NoteName;
  midi: number;
  frequency: number;
  isBlack: boolean;
  solfege: SolfegeName;
  letter: string; // C, D, E...
  octave: number;
  keyboardShortcut: string; // e.g. 'A', 'W', 'S'
  staffPosition: number; // 0 = middle C (C4) on ledger line, 1 = D4, 2 = E4 (1st line), 3 = F4, 4 = G4 (2nd line), etc.
}

export interface NoteItem {
  id: string;
  pitch: NoteName;
  beatOffset: number; // 0, 1, 2, 3 (within a 4-beat bar)
  durationBeats: number; // 4 = whole, 2 = half, 1 = quarter, 0.5 = eighth
  type: NoteType;
  dynamic: DynamicLevel;
  isRest?: boolean;
  fingerHint?: number; // 1 = Jempol, 2 = Telunjuk, 3 = Tengah, 4 = Manis, 5 = Kelingking
}

export interface Bar {
  barNumber: number; // 1 to 10
  notes: NoteItem[];
}

export interface Composition {
  id: string;
  level: 1 | 2 | 3;
  challengeNumber: number; // 1 to 10 in level, 1 to 30 overall
  title: string;
  subtitle: string;
  description: string;
  tempo: number; // BPM (e.g. 64, 76, 84, 96)
  timeSignature: '4/4';
  defaultDynamic: DynamicLevel;
  bars: Bar[]; // Exactly 10 bars
}

export interface ChallengeScore {
  challengeId: string;
  pitchScore: number; // max 40
  rhythmScore: number; // max 30
  durationScore: number; // max 20
  dynamicScore: number; // max 10
  totalScore: number; // max 100
  stars: number; // 1, 2, or 3
  completedDate: string;
  accuracyPercent: number;
}

export interface TeamConfig {
  name: string;
  color: string; // 'tosca' | 'gold' | 'mint' | 'cyan'
  membersCount: number;
}

export interface TeamScoreRecord {
  challengeNumber: number;
  challengeTitle: string;
  teamAScore: number;
  teamBScore: number;
  teamAPercent: number;
  teamBPercent: number;
}

export interface AppSettings {
  masterVolume: number; // 0 to 1
  soundDynamic: DynamicLevel; // 'p' | 'mf' | 'f'
  keyLabelMode: 'both' | 'solfege' | 'letter' | 'none'; // 'Do Re Mi' or 'C D E'
  narratorEnabled: boolean;
  narratorVolume: number; // 0 to 1
  narratorRate: number; // 0.8 to 1.2
  metronomeEnabled: boolean;
  showFallingNotes: boolean; // false = Partitur, true = Not Jatuh
  gameMode: 'practice' | 'exam'; // Latihan vs Ujian
}

export interface ReflectionData {
  understandingLevel: 'sangat_paham' | 'mulai_paham' | 'perlu_latihan';
  favoritePart: string;
  difficultPart: string;
  notes: string;
  submittedAt: string;
}
