import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePerformance, determineTeamWinner, calculateBarBeatLengthMs } from './rules';
import { ALL_COMPOSITIONS } from '../data/compositions';

test('tempo beat length calculation', () => {
  assert.equal(calculateBarBeatLengthMs(60), 1000);
  assert.equal(calculateBarBeatLengthMs(120), 500);
});

test('evaluates perfect performance with maximum 100 points and 3 stars', () => {
  const attempts = [
    { expectedPitch: 'C4', playedPitch: 'C4', timingOffsetMs: 10, heldDurationMs: 1000, expectedDurationMs: 1000, expectedDynamic: 'mf' as const, playedDynamic: 'mf' as const },
    { expectedPitch: 'D4', playedPitch: 'D4', timingOffsetMs: 15, heldDurationMs: 1000, expectedDurationMs: 1000, expectedDynamic: 'mf' as const, playedDynamic: 'mf' as const },
  ];

  const result = evaluatePerformance({
    attempts,
    totalExpectedNotes: 2,
    level: 1,
  });

  assert.equal(result.pitchScore, 40);
  assert.equal(result.rhythmScore, 30);
  assert.equal(result.durationScore, 20);
  assert.equal(result.dynamicScore, 10);
  assert.equal(result.totalScore, 100);
  assert.equal(result.stars, 3);
  assert.equal(result.accuracyPercent, 100);
});

test('evaluates flawed performance accurately', () => {
  const attempts = [
    { expectedPitch: 'C4', playedPitch: 'D4', timingOffsetMs: 500, heldDurationMs: 200, expectedDurationMs: 1000, expectedDynamic: 'mf' as const, playedDynamic: 'p' as const },
  ];

  const result = evaluatePerformance({
    attempts,
    totalExpectedNotes: 1,
    level: 1,
  });

  assert.equal(result.pitchScore, 0); // wrong pitch
  assert.equal(result.stars, 0);
  assert.equal(result.accuracyPercent, 0);
});

test('team winner resolution identifies winner or draw', () => {
  const winA = determineTeamWinner(95, 80, 'Tim Tosca', 'Tim Emas');
  assert.equal(winA.winner, 'teamA');
  assert.equal(winA.winnerName, 'Tim Tosca');
  assert.equal(winA.scoreDifference, 15);
  assert.equal(winA.isDraw, false);

  const winB = determineTeamWinner(70, 88, 'Tim Tosca', 'Tim Emas');
  assert.equal(winB.winner, 'teamB');
  assert.equal(winB.winnerName, 'Tim Emas');

  const draw = determineTeamWinner(90, 90, 'Tim Tosca', 'Tim Emas');
  assert.equal(draw.winner, 'draw');
  assert.equal(draw.isDraw, true);
});

test('composition dataset integrity checks: 30 compositions, 10 bars each, 4 beats per bar', () => {
  assert.equal(ALL_COMPOSITIONS.length, 30, 'Must have exactly 30 compositions');

  let totalBars = 0;
  ALL_COMPOSITIONS.forEach((comp, idx) => {
    assert.equal(comp.bars.length, 10, `Composition ${comp.id} (#${idx + 1}) must have exactly 10 bars`);
    totalBars += comp.bars.length;

    comp.bars.forEach(bar => {
      let totalDuration = 0;
      bar.notes.forEach(note => {
        totalDuration += note.durationBeats;
      });
      assert.ok(Math.abs(totalDuration - 4.0) < 0.001, `Bar ${bar.barNumber} in ${comp.title} must have exactly 4 beats, got ${totalDuration}`);
    });
  });

  assert.equal(totalBars, 300, 'Must have exactly 300 bars across all 30 compositions');
});
