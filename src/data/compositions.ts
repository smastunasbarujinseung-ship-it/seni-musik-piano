/**
 * 30 Original Musical Compositions for SD TERAMIA - Piano Ceria
 * 3 Levels x 10 Challenges = 30 Challenges
 * Each Challenge has EXACTLY 10 BARS in 4/4 (summing to 4.0 beats per bar).
 * Total = 300 Bars.
 */

import { Composition, Bar, NoteItem, DynamicLevel, NoteType, NoteName } from '../types/music';

interface RawNoteDef {
  pitch: NoteName;
  dur: number; // 4, 2, 1, 0.5
  isRest?: boolean;
  dyn?: DynamicLevel;
}

function createBar(barNumber: number, notesDef: RawNoteDef[], defaultDyn: DynamicLevel): Bar {
  let currentOffset = 0;
  const notes: NoteItem[] = [];

  for (let i = 0; i < notesDef.length; i++) {
    const def = notesDef[i];
    let type: NoteType = 'quarter';
    if (def.dur >= 4) type = 'whole';
    else if (def.dur >= 2) type = 'half';
    else if (def.dur >= 1) type = 'quarter';
    else type = 'eighth';

    notes.push({
      id: `b${barNumber}-n${i}`,
      pitch: def.pitch,
      beatOffset: currentOffset,
      durationBeats: def.dur,
      type,
      dynamic: def.dyn || defaultDyn,
      isRest: def.isRest || false,
    });
    currentOffset += def.dur;
  }

  // Double check 4 beats integrity; if slightly under, pad with rest to exactly 4 beats
  if (currentOffset < 4) {
    const rem = 4 - currentOffset;
    notes.push({
      id: `b${barNumber}-rest-pad`,
      pitch: 'C4',
      beatOffset: currentOffset,
      durationBeats: rem,
      type: rem >= 2 ? 'half' : 'quarter',
      dynamic: defaultDyn,
      isRest: true,
    });
  }

  return {
    barNumber,
    notes,
  };
}

// -------------------------------------------------------------
// LEVEL 1: PETUALANGAN NADA CERIA (Challenges 1 - 10)
// Focus: C4 - G4, tempo 60-76 BPM, quarter & half notes, simple rests
// -------------------------------------------------------------

function generateLevel1Compositions(): Composition[] {
  const titles = [
    { num: 1, title: 'Langkah Pertama C-D-E', sub: 'Mengenal tiga nada pertama yang ceria', tempo: 64, pitches: ['C4', 'D4', 'E4'] },
    { num: 2, title: 'Senandung Tiga Nada', sub: 'Melodi santai Do, Re, dan Mi', tempo: 66, pitches: ['C4', 'E4', 'D4'] },
    { num: 3, title: 'Menyapa Fa dan Sol', sub: 'Menjelajah nada keempat dan kelima', tempo: 68, pitches: ['E4', 'F4', 'G4'] },
    { num: 4, title: 'Tangga Nada Ceria', sub: 'Mendaki tangga nada C4 ke G4 perlahan', tempo: 70, pitches: ['C4', 'D4', 'E4', 'F4', 'G4'] },
    { num: 5, title: 'Ketukan Langkah Santai', sub: 'Belajar mempertahankan ketukan stabil', tempo: 70, pitches: ['C4', 'E4', 'G4'] },
    { num: 6, title: 'Gema Bukit Hijau', sub: 'Menirukan gema nada bolak-balik', tempo: 72, pitches: ['G4', 'F4', 'E4', 'D4', 'C4'] },
    { num: 7, title: 'Burung Kecil Bernyanyi', sub: 'Kicauan riang di taman sekolah Teramia', tempo: 72, pitches: ['E4', 'G4', 'E4', 'C4'] },
    { num: 8, title: 'Jam Dinding Berdetak', sub: 'Irama teratur tik-tok dua ketuk', tempo: 74, pitches: ['D4', 'F4', 'E4', 'C4'] },
    { num: 9, title: 'Melodi Lima Sahabat', sub: 'Kombinasi nada Do sampai Sol yang kompak', tempo: 74, pitches: ['C4', 'D4', 'E4', 'F4', 'G4'] },
    { num: 10, title: 'Lagu Pagi SD Teramia', sub: 'Komposisi penutup level 1 menyambut mentari', tempo: 76, pitches: ['C4', 'E4', 'G4', 'F4', 'D4', 'C4'] }
  ];

  return titles.map((item) => {
    const bars: Bar[] = [];
    const p = item.pitches as NoteName[];

    for (let b = 1; b <= 10; b++) {
      let notesDef: RawNoteDef[];
      if (b % 4 === 0) {
        // Bar with half notes and quarter notes
        const n1 = p[(b - 1) % p.length];
        const n2 = p[(b) % p.length];
        notesDef = [
          { pitch: n1, dur: 2 },
          { pitch: n2, dur: 1 },
          { pitch: p[0], dur: 1 }
        ];
      } else if (b === 10) {
        // Final bar: hold final note for 4 full beats!
        notesDef = [{ pitch: 'C4', dur: 4 }];
      } else if (b % 2 === 1) {
        // 4 quarter notes
        notesDef = [
          { pitch: p[(b - 1) % p.length], dur: 1 },
          { pitch: p[(b) % p.length], dur: 1 },
          { pitch: p[(b + 1) % p.length], dur: 1 },
          { pitch: p[(b + 2) % p.length], dur: 1 }
        ];
      } else {
        // 2 half notes
        notesDef = [
          { pitch: p[(b) % p.length], dur: 2 },
          { pitch: p[(b + 1) % p.length], dur: 2 }
        ];
      }
      bars.push(createBar(b, notesDef, 'mf'));
    }

    return {
      id: `comp-lvl1-${item.num}`,
      level: 1,
      challengeNumber: item.num,
      title: item.title,
      subtitle: item.sub,
      description: `Tantangan ${item.num} Level 1: Melodi 10 birama tempo ${item.tempo} BPM untuk melatih pengenalan nada dan ketukan dasar.`,
      tempo: item.tempo,
      timeSignature: '4/4',
      defaultDynamic: 'mf',
      bars
    };
  });
}

// -------------------------------------------------------------
// LEVEL 2: PETUALANGAN IRAMA (Challenges 11 - 20)
// Focus: C4 - C5, tempo 70-90 BPM, eighth notes, rests, rhythmic variety
// -------------------------------------------------------------

function generateLevel2Compositions(): Composition[] {
  const titles = [
    { num: 1, title: 'Ayunan Nada Melompat', sub: 'Melompat antarnada Do ke Sol dan La', tempo: 74, pitches: ['C4', 'E4', 'G4', 'A4'] },
    { num: 2, title: 'Langkah Cepat Berirama', sub: 'Memperkenalkan not seperdelapan yang lincah', tempo: 76, pitches: ['D4', 'F4', 'A4', 'G4'] },
    { num: 3, title: 'Tarian Kupu-kupu', sub: 'Melodi meliuk indah di taman bunga', tempo: 78, pitches: ['E4', 'G4', 'B4', 'A4'] },
    { num: 4, title: 'Ombak Pantai Teramia', sub: 'Gerakan ombak naik turun dengan tanda diam', tempo: 80, pitches: ['C4', 'D4', 'E4', 'G4', 'C5'] },
    { num: 5, title: 'Percakapan Dua Oktaf', sub: 'Menjangkau dari Do rendah sampai Do tinggi', tempo: 80, pitches: ['C4', 'G4', 'C5', 'G4'] },
    { num: 6, title: 'Riak Air Terjun', sub: 'Not seperdelapan mengalir deras dan jernih', tempo: 82, pitches: ['G4', 'A4', 'B4', 'C5'] },
    { num: 7, title: 'Kereta Api Ceria', sub: 'Irama ritmis berdenyut seperti roda kereta', tempo: 84, pitches: ['C4', 'E4', 'G4', 'E4'] },
    { num: 8, title: 'Detak Jantung Musisi', sub: 'Kombinasi ketukan rapat dan jeda istirahat', tempo: 86, pitches: ['F4', 'A4', 'C5', 'A4'] },
    { num: 9, title: 'Hujan Rintik-Rintik', sub: 'Tetesan nada yang teratur dan anggun', tempo: 88, pitches: ['E4', 'G4', 'A4', 'C5', 'B4'] },
    { num: 10, title: 'Gemintang Malam Teramia', sub: 'Puncak level 2 dengan variasi melodi 10 bar', tempo: 90, pitches: ['C4', 'F4', 'A4', 'B4', 'C5'] }
  ];

  return titles.map((item, idx) => {
    const bars: Bar[] = [];
    const p = item.pitches as NoteName[];
    const overallNum = 11 + idx;

    for (let b = 1; b <= 10; b++) {
      let notesDef: RawNoteDef[];
      if (b === 10) {
        // Final resolution
        notesDef = [
          { pitch: 'G4', dur: 2 },
          { pitch: 'C5', dur: 2 }
        ];
      } else if (b % 3 === 0) {
        // Bar with eighth notes: 2 eighths (1 beat) + 3 quarters (3 beats) = 4 beats
        notesDef = [
          { pitch: p[0], dur: 0.5 },
          { pitch: p[1 % p.length], dur: 0.5 },
          { pitch: p[2 % p.length], dur: 1 },
          { pitch: p[1 % p.length], dur: 1 },
          { pitch: p[0], dur: 1 }
        ];
      } else if (b % 3 === 1) {
        // Quarter + 2 eighths + half = 1 + 1 + 2 = 4 beats
        notesDef = [
          { pitch: p[(b) % p.length], dur: 1 },
          { pitch: p[(b + 1) % p.length], dur: 0.5 },
          { pitch: p[(b + 2) % p.length], dur: 0.5 },
          { pitch: p[(b + 3) % p.length], dur: 2 }
        ];
      } else {
        // Quarter + rest + 2 quarters = 1 + 1 + 1 + 1 = 4 beats
        notesDef = [
          { pitch: p[(b) % p.length], dur: 1 },
          { pitch: p[(b) % p.length], dur: 1, isRest: true },
          { pitch: p[(b + 1) % p.length], dur: 1 },
          { pitch: p[(b + 2) % p.length], dur: 1 }
        ];
      }
      bars.push(createBar(b, notesDef, 'mf'));
    }

    return {
      id: `comp-lvl2-${overallNum}`,
      level: 2,
      challengeNumber: item.num,
      title: item.title,
      subtitle: item.sub,
      description: `Tantangan ${item.num} Level 2 (No. ${overallNum}): Melodi 10 birama tempo ${item.tempo} BPM mengasah kepekaan ritme dan not seperdelapan.`,
      tempo: item.tempo,
      timeSignature: '4/4',
      defaultDynamic: 'mf',
      bars
    };
  });
}

// -------------------------------------------------------------
// LEVEL 3: PETUALANGAN MUSIK HEBAT (Challenges 21 - 30)
// Focus: Full range C4 - C6, tempo 80-100 BPM, dynamic markings p, mf, f, expressive
// -------------------------------------------------------------

function generateLevel3Compositions(): Composition[] {
  const titles = [
    { num: 1, title: 'Pawai Musisi Cilik', sub: 'Dinamika sedang (mf) dengan langkah tegap', tempo: 82, dyn: 'mf' as DynamicLevel, pitches: ['C4', 'E4', 'G4', 'C5', 'D5'] },
    { num: 2, title: 'Bisikan Angin Lembut', sub: 'Dinamika lembut (p) yang merdu menentramkan', tempo: 80, dyn: 'p' as DynamicLevel, pitches: ['E4', 'G4', 'A4', 'B4', 'C5'] },
    { num: 3, title: 'Semangat Pagi Membara', sub: 'Dinamika kuat (f) dengan melodi penuh energi', tempo: 88, dyn: 'f' as DynamicLevel, pitches: ['G4', 'C5', 'E5', 'G5'] },
    { num: 4, title: 'Tari Tradisi Ceria', sub: 'Melodi gembira dengan perubahan dinamika', tempo: 86, dyn: 'mf' as DynamicLevel, pitches: ['C4', 'D4', 'F4', 'G4', 'A4', 'C5'] },
    { num: 5, title: 'Simfoni Mini Kelas Lima', sub: 'Harmoni indah penuh ekspresi musikal', tempo: 88, dyn: 'mf' as DynamicLevel, pitches: ['E4', 'G4', 'C5', 'E5'] },
    { num: 6, title: 'Gelombang Dinamika', sub: 'Latihan transisi p (lembut) ke f (kuat)', tempo: 90, dyn: 'p' as DynamicLevel, pitches: ['C4', 'F4', 'A4', 'C5', 'F5'] },
    { num: 7, title: 'Melodi Cita-Cita', sub: 'Mendaki nada tinggi dengan keyakinan', tempo: 92, dyn: 'f' as DynamicLevel, pitches: ['D4', 'G4', 'B4', 'D5', 'G5'] },
    { num: 8, title: 'Derap Langkah Sang Juara', sub: 'Irama gagah persiapan pertandingan', tempo: 94, dyn: 'f' as DynamicLevel, pitches: ['C4', 'G4', 'C5', 'G4', 'C6'] },
    { num: 9, title: 'Gema Nada Teramia', sub: 'Melodi khas sekolah yang berkumandang megah', tempo: 96, dyn: 'mf' as DynamicLevel, pitches: ['C4', 'E4', 'G4', 'C5', 'E5', 'G5'] },
    { num: 10, title: 'Mahakarya Piano Ceria', sub: 'Komposisi agung penutup 30 tantangan musik', tempo: 100, dyn: 'f' as DynamicLevel, pitches: ['C4', 'G4', 'C5', 'E5', 'G5', 'C6'] }
  ];

  return titles.map((item, idx) => {
    const bars: Bar[] = [];
    const p = item.pitches as NoteName[];
    const overallNum = 21 + idx;

    for (let b = 1; b <= 10; b++) {
      let notesDef: RawNoteDef[];
      // Alternate dynamics for songs with dynamic progressions
      const barDyn: DynamicLevel = (b <= 3) ? (item.dyn === 'f' ? 'mf' : 'p') : (b <= 7 ? 'mf' : 'f');

      if (b === 10) {
        // Triumphant whole note or 2 half notes
        notesDef = [
          { pitch: p[p.length - 2] || 'G5', dur: 2, dyn: 'f' },
          { pitch: p[p.length - 1] || 'C6', dur: 2, dyn: 'f' }
        ];
      } else if (b % 4 === 1) {
        // 4 eighth notes (2 beats) + 2 quarter notes (2 beats) = 4 beats
        notesDef = [
          { pitch: p[0], dur: 0.5, dyn: barDyn },
          { pitch: p[1 % p.length], dur: 0.5, dyn: barDyn },
          { pitch: p[2 % p.length], dur: 0.5, dyn: barDyn },
          { pitch: p[3 % p.length], dur: 0.5, dyn: barDyn },
          { pitch: p[2 % p.length], dur: 1, dyn: barDyn },
          { pitch: p[1 % p.length], dur: 1, dyn: barDyn }
        ];
      } else if (b % 4 === 2) {
        // Half note + 2 quarter notes = 2 + 1 + 1 = 4 beats
        notesDef = [
          { pitch: p[(b) % p.length], dur: 2, dyn: barDyn },
          { pitch: p[(b + 1) % p.length], dur: 1, dyn: barDyn },
          { pitch: p[(b + 2) % p.length], dur: 1, dyn: barDyn }
        ];
      } else if (b % 4 === 3) {
        // Quarter + 2 eighths + quarter + rest = 1 + 1 + 1 + 1 = 4 beats
        notesDef = [
          { pitch: p[(b) % p.length], dur: 1, dyn: barDyn },
          { pitch: p[(b + 1) % p.length], dur: 0.5, dyn: barDyn },
          { pitch: p[(b + 2) % p.length], dur: 0.5, dyn: barDyn },
          { pitch: p[(b + 3) % p.length], dur: 1, dyn: barDyn },
          { pitch: p[0], dur: 1, isRest: true, dyn: barDyn }
        ];
      } else {
        // 4 quarter notes
        notesDef = [
          { pitch: p[(b) % p.length], dur: 1, dyn: barDyn },
          { pitch: p[(b + 1) % p.length], dur: 1, dyn: barDyn },
          { pitch: p[(b + 2) % p.length], dur: 1, dyn: barDyn },
          { pitch: p[(b + 3) % p.length], dur: 1, dyn: barDyn }
        ];
      }
      bars.push(createBar(b, notesDef, barDyn));
    }

    return {
      id: `comp-lvl3-${overallNum}`,
      level: 3,
      challengeNumber: item.num,
      title: item.title,
      subtitle: item.sub,
      description: `Tantangan ${item.num} Level 3 (No. ${overallNum}): Melodi 10 birama tempo ${item.tempo} BPM menguji kepekaan dinamika dan ketangkasan piano.`,
      tempo: item.tempo,
      timeSignature: '4/4',
      defaultDynamic: item.dyn,
      bars
    };
  });
}

export const ALL_COMPOSITIONS: Composition[] = [
  ...generateLevel1Compositions(),
  ...generateLevel2Compositions(),
  ...generateLevel3Compositions()
];

export function getCompositionById(id: string): Composition | undefined {
  return ALL_COMPOSITIONS.find(c => c.id === id);
}

export function getCompositionsByLevel(level: 1 | 2 | 3): Composition[] {
  return ALL_COMPOSITIONS.filter(c => c.level === level);
}
