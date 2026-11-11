/**
 * PIANO CERIA - SD TERAMIA
 * Seni Musik Kelas V SD
 * "Kenali Nadanya, Mainkan Lagunya, Tunjukkan Bakatmu!"
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Composition, NoteName, DynamicLevel, ChallengeScore, AppSettings, TeamScoreRecord, ReflectionData } from './types/music';
import { ALL_COMPOSITIONS, getCompositionById } from './data/compositions';
import { Header } from './components/Header';
import { DigitalPiano } from './components/DigitalPiano';
import { ScoreStaff } from './components/ScoreStaff';
import { FallingNotesRoll } from './components/FallingNotesRoll';
import { GameControls } from './components/GameControls';
import { LevelSelectModal } from './components/LevelSelectModal';
import { TutorialModal } from './components/TutorialModal';
import { TeamMatchModal } from './components/TeamMatchModal';
import { MateriMusikModal } from './components/MateriMusikModal';
import { PetunjukModal } from './components/PetunjukModal';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { ScoreHistoryModal } from './components/ScoreHistoryModal';
import { RefleksiModal } from './components/RefleksiModal';
import { VictoryModal } from './components/VictoryModal';
import { audioEngine } from './utils/audioEngine';
import { narrator } from './utils/narrator';
import { evaluatePerformance, calculateBarBeatLengthMs, NoteAttempt } from './utils/rules';
import { Music, Sparkles } from 'lucide-react';

const STORAGE_KEY_SCORES = 'piano_ceria_scores_v1';
const STORAGE_KEY_SETTINGS = 'piano_ceria_settings_v1';
const STORAGE_KEY_MATCH = 'piano_ceria_match_v1';
const STORAGE_KEY_REFLECTIONS = 'piano_ceria_reflections_v1';

export default function App() {
  // App views
  const [activeView, setActiveView] = useState<'game' | 'freeplay'>('game');

  // Modals state
  const [modalLevelSelect, setModalLevelSelect] = useState<boolean>(false);
  const [modalTutorial, setModalTutorial] = useState<boolean>(false);
  const [modalTeamMatch, setModalTeamMatch] = useState<boolean>(false);
  const [modalMateri, setModalMateri] = useState<boolean>(false);
  const [modalPetunjuk, setModalPetunjuk] = useState<boolean>(false);
  const [modalSettings, setModalSettings] = useState<boolean>(false);
  const [modalHistory, setModalHistory] = useState<boolean>(false);
  const [modalReflection, setModalReflection] = useState<boolean>(false);
  const [modalVictory, setModalVictory] = useState<boolean>(false);

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      masterVolume: 0.85,
      soundDynamic: 'mf',
      keyLabelMode: 'both',
      narratorEnabled: true,
      narratorVolume: 0.9,
      narratorRate: 1.0,
      metronomeEnabled: true,
      showFallingNotes: false,
      gameMode: 'practice',
    };
  });

  // Current Composition
  const [currentComp, setCurrentComp] = useState<Composition>(ALL_COMPOSITIONS[0]);

  // Scores and History Storage
  const [savedScores, setSavedScores] = useState<Record<string, ChallengeScore>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCORES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [teamMatchHistory, setTeamMatchHistory] = useState<TeamScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MATCH);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [savedReflections, setSavedReflections] = useState<ReflectionData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REFLECTIONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Narrator state
  const [narratorSpeaking, setNarratorSpeaking] = useState<boolean>(false);
  const [narratorText, setNarratorText] = useState<string>('');

  // Game clock & playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentBarIndex, setCurrentBarIndex] = useState<number>(0); // 0 to 9
  const [currentBeat, setCurrentBeat] = useState<number>(0); // 0 to 4
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [highlightedPitch, setHighlightedPitch] = useState<NoteName | null>(null);
  const [liveFeedback, setLiveFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [liveFeedbackMsg, setLiveFeedbackMsg] = useState<string | null>(null);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [latestCompletedScore, setLatestCompletedScore] = useState<ChallengeScore | null>(null);

  // Active Team Match context if current game is a team round
  const [activeTeamMatchContext, setActiveTeamMatchContext] = useState<{
    roundIdx: number;
    team: 'A' | 'B';
  } | null>(null);

  // Note attempts accumulated during current song play
  const noteAttemptsRef = useRef<NoteAttempt[]>([]);
  const gameClockTimerRef = useRef<number | null>(null);
  const demoClockTimerRef = useRef<number | null>(null);

  // Subscribe to narrator speech events
  useEffect(() => {
    const unsub = narrator.subscribe((speaking, text) => {
      setNarratorSpeaking(speaking);
      setNarratorText(text);
    });

    // Welcome speech on initial mount
    const timer = setTimeout(() => {
      narrator.speak(
        'Halo, teman-teman SD TERAMIA! Selamat datang di Piano Ceria. Yuk, kenali nada, pelajari not balok, dan mainkan piano bersama!'
      );
    }, 800);

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, []);

  // Update localStorage when scores/settings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(savedScores));
    } catch {}
  }, [savedScores]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MATCH, JSON.stringify(teamMatchHistory));
    } catch {}
  }, [teamMatchHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REFLECTIONS, JSON.stringify(savedReflections));
    } catch {}
  }, [savedReflections]);

  // Fullscreen toggle logic
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        alert('Layar penuh didukung pada perangkat. Gunakan tombol F11 jika diperlukan.');
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Handle Note Played on Digital Piano
  const handleNotePlay = useCallback(
    (pitch: NoteName, heldMs: number, playedDynamic: DynamicLevel) => {
      if (!isPlaying) return;

      const currentBar = currentComp.bars[currentBarIndex];
      if (!currentBar) return;

      // Find the closest expected note in current bar around current beat
      const targetNote = currentBar.notes.find(
        (n) => !n.isRest && Math.abs(n.beatOffset - currentBeat) <= 0.8
      );

      const beatMs = calculateBarBeatLengthMs(currentComp.tempo);
      const expectedDurationMs = targetNote ? targetNote.durationBeats * beatMs : 500;

      if (targetNote && targetNote.pitch === pitch) {
        // Correct note hit!
        audioEngine.playSuccessChime();
        setLiveFeedback('correct');
        setLiveFeedbackMsg('Hebat! Nada tepat!');
        setTimeout(() => setLiveFeedback(null), 700);

        const timingOffsetMs = Math.round((currentBeat - targetNote.beatOffset) * beatMs);

        noteAttemptsRef.current.push({
          expectedPitch: targetNote.pitch,
          playedPitch: pitch,
          timingOffsetMs,
          heldDurationMs: heldMs,
          expectedDurationMs,
          expectedDynamic: targetNote.dynamic,
          playedDynamic,
        });

        setCurrentScore((prev) => Math.min(100, prev + Math.round(100 / 30)));
      } else {
        // Missed or incorrect pitch
        audioEngine.playMissSound();
        setLiveFeedback('wrong');
        setLiveFeedbackMsg('Perhatikan posisi not!');
        setTimeout(() => setLiveFeedback(null), 700);

        if (targetNote) {
          noteAttemptsRef.current.push({
            expectedPitch: targetNote.pitch,
            playedPitch: pitch,
            timingOffsetMs: 500,
            heldDurationMs: heldMs,
            expectedDurationMs,
            expectedDynamic: targetNote.dynamic,
            playedDynamic,
          });
        }
      }
    },
    [isPlaying, currentComp, currentBarIndex, currentBeat]
  );

  // Stop Song Game Playback
  const handleStopPlay = useCallback(() => {
    if (gameClockTimerRef.current) {
      clearInterval(gameClockTimerRef.current);
      gameClockTimerRef.current = null;
    }
    if (demoClockTimerRef.current) {
      clearInterval(demoClockTimerRef.current);
      demoClockTimerRef.current = null;
    }
    setIsPlaying(false);
    setIsDemoPlaying(false);
    setCountdown(null);
    setCurrentBarIndex(0);
    setCurrentBeat(0);
    setActiveNoteId(null);
    setHighlightedPitch(null);
  }, []);

  // Finish 10-bar Song and Open Evaluation
  const handleFinishSong = useCallback(() => {
    handleStopPlay();

    // Total expected notes across the 10 bars
    const totalExpectedNotes = currentComp.bars.reduce(
      (acc, bar) => acc + bar.notes.filter((n) => !n.isRest).length,
      0
    );

    const evaluation = evaluatePerformance({
      attempts: noteAttemptsRef.current,
      totalExpectedNotes,
      level: currentComp.level,
    });

    const finalScore: ChallengeScore = {
      challengeId: currentComp.id,
      pitchScore: evaluation.pitchScore,
      rhythmScore: evaluation.rhythmScore,
      durationScore: evaluation.durationScore,
      dynamicScore: evaluation.dynamicScore,
      totalScore: evaluation.totalScore,
      stars: evaluation.stars,
      completedDate: new Date().toLocaleDateString('id-ID'),
      accuracyPercent: evaluation.accuracyPercent,
    };

    setLatestCompletedScore(finalScore);

    // Save score if better than previous
    setSavedScores((prev) => {
      const prevRec = prev[currentComp.id];
      if (!prevRec || finalScore.totalScore > prevRec.totalScore) {
        return { ...prev, [currentComp.id]: finalScore };
      }
      return prev;
    });

    // If part of team match, record team score
    if (activeTeamMatchContext) {
      const { roundIdx, team } = activeTeamMatchContext;
      setTeamMatchHistory((prev) => {
        const existing = prev.find((r) => r.challengeNumber === roundIdx);
        if (existing) {
          return prev.map((r) => {
            if (r.challengeNumber === roundIdx) {
              return {
                ...r,
                ...(team === 'A'
                  ? { teamAScore: finalScore.totalScore, teamAPercent: finalScore.accuracyPercent }
                  : { teamBScore: finalScore.totalScore, teamBPercent: finalScore.accuracyPercent }),
              };
            }
            return r;
          });
        } else {
          return [
            ...prev,
            {
              challengeNumber: roundIdx,
              challengeTitle: currentComp.title,
              teamAScore: team === 'A' ? finalScore.totalScore : 0,
              teamBScore: team === 'B' ? finalScore.totalScore : 0,
              teamAPercent: team === 'A' ? finalScore.accuracyPercent : 0,
              teamBPercent: team === 'B' ? finalScore.accuracyPercent : 0,
            },
          ];
        }
      });
      setActiveTeamMatchContext(null);
      // Re-open team match scoreboard
      setModalTeamMatch(true);
    } else {
      setModalVictory(true);
    }
  }, [currentComp, activeTeamMatchContext, handleStopPlay]);

  // Start Song Game Playback (with 3, 2, 1 Countdown)
  const handleStartPlay = () => {
    handleStopPlay();
    noteAttemptsRef.current = [];
    setCurrentScore(0);
    setCurrentBarIndex(0);
    setCurrentBeat(0);

    narrator.speak('Siap-siap!');

    // Countdown: 3, 2, 1
    let cd = 3;
    setCountdown(cd);

    const cdInterval = window.setInterval(() => {
      cd -= 1;
      if (cd > 0) {
        setCountdown(cd);
      } else {
        clearInterval(cdInterval);
        setCountdown(null);
        setIsPlaying(true);

        const beatMs = calculateBarBeatLengthMs(currentComp.tempo);
        const tickResolution = 20; // tick every 20ms
        let bar = 0;
        let beat = 0;

        gameClockTimerRef.current = window.setInterval(() => {
          beat += tickResolution / beatMs;

          // Metronome tick at each integer beat
          if (Math.floor(beat) > Math.floor(beat - tickResolution / beatMs)) {
            const beatNumber = Math.floor(beat);
            if (settings.metronomeEnabled && beatNumber < 4) {
              audioEngine.playMetronome(beatNumber === 0);
            }
          }

          if (beat >= 4) {
            // Next bar
            beat = 0;
            bar += 1;
            if (bar >= 10) {
              // 10 bars complete!
              handleFinishSong();
              return;
            }
            setCurrentBarIndex(bar);
          }

          setCurrentBeat(beat);

          // Find current note in this bar to highlight
          const activeBarNotes = currentComp.bars[bar]?.notes;
          const currentNote = activeBarNotes?.find(
            (n) => !n.isRest && beat >= n.beatOffset && beat < n.beatOffset + n.durationBeats
          );

          if (currentNote) {
            setActiveNoteId(currentNote.id);
            if (settings.gameMode === 'practice') {
              setHighlightedPitch(currentNote.pitch);
            }
          } else {
            setActiveNoteId(null);
            if (settings.gameMode === 'practice') {
              setHighlightedPitch(null);
            }
          }
        }, tickResolution);
      }
    }, 900);
  };

  // Demo Playback helper (plays automatically)
  const handlePlayDemo = () => {
    handleStopPlay();
    setIsDemoPlaying(true);
    setCurrentBarIndex(0);
    setCurrentBeat(0);

    const beatMs = calculateBarBeatLengthMs(currentComp.tempo);
    const tickResolution = 25;
    let bar = 0;
    let beat = 0;
    let lastPlayedNoteId: string | null = null;

    demoClockTimerRef.current = window.setInterval(() => {
      beat += tickResolution / beatMs;
      if (beat >= 4) {
        beat = 0;
        bar += 1;
        if (bar >= 10) {
          handleStopPlay();
          narrator.speak('Contoh selesai! Sekarang giliranmu menekan tombol Mulai Bermain.');
          return;
        }
        setCurrentBarIndex(bar);
      }
      setCurrentBeat(beat);

      const activeBarNotes = currentComp.bars[bar]?.notes;
      const currentNote = activeBarNotes?.find(
        (n) => !n.isRest && beat >= n.beatOffset && beat < n.beatOffset + n.durationBeats
      );

      if (currentNote) {
        setActiveNoteId(currentNote.id);
        setHighlightedPitch(currentNote.pitch);

        if (currentNote.id !== lastPlayedNoteId) {
          lastPlayedNoteId = currentNote.id;
          audioEngine.startNote(currentNote.pitch, currentNote.dynamic);
          setTimeout(() => {
            audioEngine.stopNote(currentNote.pitch);
          }, currentNote.durationBeats * beatMs * 0.85);
        }
      } else {
        setActiveNoteId(null);
        setHighlightedPitch(null);
      }
    }, tickResolution);
  };

  // Switch to next composition
  const handleNextChallenge = () => {
    const currentIndex = ALL_COMPOSITIONS.findIndex((c) => c.id === currentComp.id);
    if (currentIndex !== -1 && currentIndex < ALL_COMPOSITIONS.length - 1) {
      setCurrentComp(ALL_COMPOSITIONS[currentIndex + 1]);
    }
  };

  // Reset entire application progress
  const handleResetAllProgress = () => {
    localStorage.removeItem(STORAGE_KEY_SCORES);
    localStorage.removeItem(STORAGE_KEY_MATCH);
    localStorage.removeItem(STORAGE_KEY_REFLECTIONS);
    setSavedScores({});
    setTeamMatchHistory([]);
    setSavedReflections([]);
    narrator.speak('Data belajar telah berhasil direset.');
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col justify-between bg-stone-950 text-slate-100 font-sans select-none">
      {/* 1. Header (School identity, class, slogan, main navigation, narrator) */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenTutorial={() => setModalTutorial(true)}
        onOpenTeamMatch={() => setModalTeamMatch(true)}
        onOpenMateri={() => setModalMateri(true)}
        onOpenPetunjuk={() => setModalPetunjuk(true)}
        onOpenSettings={() => setModalSettings(true)}
        onOpenLevelSelect={() => setModalLevelSelect(true)}
        onOpenHistory={() => setModalHistory(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        narratorSpeaking={narratorSpeaking}
        narratorText={narratorText}
        narratorEnabled={settings.narratorEnabled}
        onToggleNarrator={() => {
          const next = !settings.narratorEnabled;
          narrator.setEnabled(next);
          setSettings((s) => ({ ...s, narratorEnabled: next }));
        }}
        onRepeatNarrator={() => narrator.repeat()}
      />

      {/* 2. Middle Stage Container (Score Staff or Freeplay Canvas or Falling Notes) */}
      <main className="flex-1 w-full px-4 py-2 flex flex-col justify-between overflow-hidden gap-2">
        {activeView === 'game' ? (
          <>
            {/* Game Controls Toolbar */}
            <GameControls
              composition={currentComp}
              isPlaying={isPlaying}
              isDemoPlaying={isDemoPlaying}
              countdown={countdown}
              currentBarIndex={currentBarIndex}
              currentScore={currentScore}
              showFallingNotes={settings.showFallingNotes}
              gameMode={settings.gameMode}
              onToggleViewMode={() =>
                setSettings((s) => ({ ...s, showFallingNotes: !s.showFallingNotes }))
              }
              onToggleGameMode={() =>
                setSettings((s) => ({
                  ...s,
                  gameMode: s.gameMode === 'practice' ? 'exam' : 'practice',
                }))
              }
              onStartPlay={handleStartPlay}
              onStopPlay={handleStopPlay}
              onPlayDemo={handlePlayDemo}
              onOpenLevelSelect={() => setModalLevelSelect(true)}
            />

            {/* Visual Musical Staff or Falling Notes Roll */}
            <div className="flex-1 flex flex-col justify-center min-h-0">
              {settings.showFallingNotes ? (
                <FallingNotesRoll
                  bars={currentComp.bars}
                  currentBarIndex={currentBarIndex}
                  currentBeat={currentBeat}
                  tempo={currentComp.tempo}
                />
              ) : (
                <ScoreStaff
                  bars={currentComp.bars}
                  currentBarIndex={currentBarIndex}
                  currentBeat={currentBeat}
                  activeNoteId={activeNoteId}
                  lastPlayedAccuracy={liveFeedback}
                  lastPlayedMessage={liveFeedbackMsg}
                  tempo={currentComp.tempo}
                />
              )}
            </div>
          </>
        ) : (
          /* Freeplay Mode View */
          <div className="flex-1 bg-stone-900/80 border border-teal-800/80 rounded-xl p-4 flex items-center justify-between shadow-xl">
            <div className="flex flex-col gap-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-teal-950 font-black px-2.5 py-0.5 rounded text-xs uppercase tracking-wider">
                  MODE LATIHAN BEBAS
                </span>
                <span className="text-teal-300 text-xs font-semibold">
                  Eksplorasi Mandiri & Pengenalan Nada
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white font-display">
                Mainkan Piano Sesukamu!
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                Di mode ini, kamu bebas mencoba seluruh 25 tuts piano dari C4 hingga C6, melatih kelenturan jari, mendengarkan perbedaan nada staccato dan legato, serta bereksperimen dengan dinamika suara lembut (p), sedang (mf), dan kuat (f).
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setActiveView('game');
                    setModalLevelSelect(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-xs shadow-md transition-all"
                >
                  Masuk ke Game Tantangan 30 Lagu
                </button>
                <button
                  onClick={() => setModalTutorial(true)}
                  className="px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
                >
                  Buka Tutorial
                </button>
              </div>
            </div>

            {/* Realistic Piano Banner Illustration */}
            <div className="hidden lg:block w-72 h-36 rounded-xl overflow-hidden border border-teal-700/60 shadow-lg relative shrink-0">
              <img
                src="/src/assets/images/piano_ceria_header_1794375560327.jpg"
                alt="Piano Ceria SD TERAMIA"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-teal-950/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[11px] font-extrabold text-amber-300 font-display">
                  SD TERAMIA GRAND PIANO
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. Bottom Piano: Digital Piano Keyboard with 25 keys */}
        <DigitalPiano
          currentDynamic={settings.soundDynamic}
          onChangeDynamic={(dyn) => {
            audioEngine.setDynamic(dyn);
            setSettings((s) => ({ ...s, soundDynamic: dyn }));
          }}
          keyLabelMode={settings.keyLabelMode}
          highlightedPitch={highlightedPitch}
          onNotePlay={handleNotePlay}
        />
      </main>

      {/* Modals & Dialogs */}
      <LevelSelectModal
        isOpen={modalLevelSelect}
        onClose={() => setModalLevelSelect(false)}
        onSelectComposition={(comp) => {
          handleStopPlay();
          setCurrentComp(comp);
          setActiveView('game');
        }}
        selectedCompositionId={currentComp.id}
        savedScores={savedScores}
      />

      <TutorialModal
        isOpen={modalTutorial}
        onClose={() => setModalTutorial(false)}
        onHighlightPitch={setHighlightedPitch}
      />

      <TeamMatchModal
        isOpen={modalTeamMatch}
        onClose={() => setModalTeamMatch(false)}
        onStartMatchRound={(comp, currentTeam, roundIdx) => {
          handleStopPlay();
          setCurrentComp(comp);
          setActiveView('game');
          setActiveTeamMatchContext({ roundIdx, team: currentTeam });
          handleStartPlay();
        }}
        activeMatchRecord={teamMatchHistory}
        onResetMatch={() => setTeamMatchHistory([])}
      />

      <MateriMusikModal
        isOpen={modalMateri}
        onClose={() => setModalMateri(false)}
      />

      <PetunjukModal
        isOpen={modalPetunjuk}
        onClose={() => setModalPetunjuk(false)}
      />

      <AudioSettingsModal
        isOpen={modalSettings}
        onClose={() => setModalSettings(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings((s) => ({ ...s, ...newVals }))}
        onResetAllProgress={handleResetAllProgress}
      />

      <ScoreHistoryModal
        isOpen={modalHistory}
        onClose={() => setModalHistory(false)}
        savedScores={savedScores}
        teamMatchHistory={teamMatchHistory}
        onResetProgress={handleResetAllProgress}
      />

      <RefleksiModal
        isOpen={modalReflection}
        onClose={() => setModalReflection(false)}
        onSaveReflection={(data) => {
          setSavedReflections((prev) => [data, ...prev]);
        }}
        savedReflection={savedReflections[0]}
      />

      {latestCompletedScore && (
        <VictoryModal
          isOpen={modalVictory}
          onClose={() => setModalVictory(false)}
          composition={currentComp}
          score={latestCompletedScore}
          onReplay={handleStartPlay}
          onNextChallenge={handleNextChallenge}
          onOpenReflection={() => setModalReflection(true)}
        />
      )}
    </div>
  );
}
