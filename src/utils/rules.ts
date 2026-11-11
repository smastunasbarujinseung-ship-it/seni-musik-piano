/**
 * Scoring and Game Rules Engine for Piano Ceria SD TERAMIA
 * Weighted Scoring:
 * - Pitch Accuracy (Ketepatan Nada): max 40 points
 * - Rhythm & Tempo Timing (Ketepatan Ritme & Tempo): max 30 points
 * - Duration Accuracy (Ketepatan Durasi): max 20 points
 * - Dynamics Accuracy (Ketepatan Dinamika): max 10 points
 * Total: 100 points per challenge.
 */

import { ChallengeScore, DynamicLevel } from '../types/music';

export interface NoteAttempt {
  expectedPitch: string;
  playedPitch: string;
  timingOffsetMs: number; // difference from expected beat in ms (0 = perfect)
  heldDurationMs: number; // how long the key was held
  expectedDurationMs: number; // theoretical duration based on BPM
  expectedDynamic: DynamicLevel;
  playedDynamic: DynamicLevel;
}

export interface EvaluationInput {
  attempts: NoteAttempt[];
  totalExpectedNotes: number;
  level: 1 | 2 | 3;
}

export function evaluatePerformance(input: EvaluationInput): {
  pitchScore: number;
  rhythmScore: number;
  durationScore: number;
  dynamicScore: number;
  totalScore: number;
  stars: number;
  accuracyPercent: number;
} {
  const { attempts, totalExpectedNotes, level } = input;
  if (totalExpectedNotes <= 0 || attempts.length === 0) {
    return {
      pitchScore: 0,
      rhythmScore: 0,
      durationScore: 0,
      dynamicScore: 0,
      totalScore: 0,
      stars: 0,
      accuracyPercent: 0,
    };
  }

  // Tolerance threshold in ms depending on level (gentler for grade 5 beginners)
  const timingToleranceMs = level === 1 ? 320 : level === 2 ? 260 : 200;
  const durationToleranceRatio = level === 1 ? 0.6 : 0.45;

  let correctPitchCount = 0;
  let rhythmScoreAcc = 0;
  let durationScoreAcc = 0;
  let dynamicScoreAcc = 0;

  for (const att of attempts) {
    // 1. Pitch accuracy
    if (att.playedPitch === att.expectedPitch) {
      correctPitchCount++;
    }

    // 2. Timing offset accuracy
    const absOffset = Math.abs(att.timingOffsetMs);
    if (absOffset <= timingToleranceMs * 0.4) {
      rhythmScoreAcc += 1.0; // Perfect
    } else if (absOffset <= timingToleranceMs) {
      rhythmScoreAcc += 0.75; // Good
    } else if (absOffset <= timingToleranceMs * 1.5) {
      rhythmScoreAcc += 0.4; // Fair
    }

    // 3. Held duration accuracy
    const durationRatio = att.expectedDurationMs > 0 ? Math.abs(att.heldDurationMs - att.expectedDurationMs) / att.expectedDurationMs : 1;
    if (durationRatio <= durationToleranceRatio) {
      durationScoreAcc += 1.0;
    } else if (durationRatio <= durationToleranceRatio * 1.6) {
      durationScoreAcc += 0.6;
    } else {
      durationScoreAcc += 0.2;
    }

    // 4. Dynamics accuracy
    if (att.playedDynamic === att.expectedDynamic) {
      dynamicScoreAcc += 1.0;
    } else {
      dynamicScoreAcc += 0.5;
    }
  }

  const pitchRatio = Math.min(1, correctPitchCount / totalExpectedNotes);
  const rhythmRatio = Math.min(1, rhythmScoreAcc / totalExpectedNotes);
  const durationRatio = Math.min(1, durationScoreAcc / totalExpectedNotes);
  const dynamicRatio = Math.min(1, dynamicScoreAcc / totalExpectedNotes);

  const pitchScore = Math.round(pitchRatio * 40);
  const rhythmScore = Math.round(rhythmRatio * 30);
  const durationScore = Math.round(durationRatio * 20);
  const dynamicScore = Math.round(dynamicRatio * 10);

  const totalScore = Math.min(100, pitchScore + rhythmScore + durationScore + dynamicScore);
  const accuracyPercent = Math.round(pitchRatio * 100);

  let stars = 0;
  if (totalScore >= 88) stars = 3;
  else if (totalScore >= 70) stars = 2;
  else if (totalScore >= 50) stars = 1;

  return {
    pitchScore,
    rhythmScore,
    durationScore,
    dynamicScore,
    totalScore,
    stars,
    accuracyPercent,
  };
}

export function determineTeamWinner(teamAScore: number, teamBScore: number, teamAName: string, teamBName: string): {
  winner: 'teamA' | 'teamB' | 'draw';
  winnerName: string;
  isDraw: boolean;
  scoreDifference: number;
} {
  const diff = Math.abs(teamAScore - teamBScore);
  if (teamAScore > teamBScore) {
    return {
      winner: 'teamA',
      winnerName: teamAName,
      isDraw: false,
      scoreDifference: diff,
    };
  }
  if (teamBScore > teamAScore) {
    return {
      winner: 'teamB',
      winnerName: teamBName,
      isDraw: false,
      scoreDifference: diff,
    };
  }
  return {
    winner: 'draw',
    winnerName: 'SERI',
    isDraw: true,
    scoreDifference: 0,
  };
}

export function calculateBarBeatLengthMs(tempoBpm: number): number {
  // 60,000 ms per minute / BPM = ms per beat (quarter note)
  return 60000 / tempoBpm;
}
