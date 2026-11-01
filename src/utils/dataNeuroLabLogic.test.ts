/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSyntheticEEG, calculateTDErrorDopamine } from './dataNeuroLabLogic';

test('generateSyntheticEEG correctly computes dominant band for alpha state', () => {
  const result = generateSyntheticEEG('alpha_relaxed', 128, true, true);
  assert.equal(result.dominantBand, 'Alfa');
  assert.ok(result.bandPowers.alpha > result.bandPowers.theta);
  assert.equal(result.confidence > 0.8, true);
  assert.match(result.predictedState, /Alfa/i);
});

test('generateSyntheticEEG detects eye blink artifact when uncleaned', () => {
  const resultWithArtifact = generateSyntheticEEG('blink_artifact', 128, false, false);
  assert.match(resultWithArtifact.predictedState, /Artefato/i);

  // When ICA is applied, artifact is suppressed
  const resultClean = generateSyntheticEEG('blink_artifact', 128, true, true);
  assert.doesNotMatch(resultClean.predictedState, /Artefato/i);
});

test('calculateTDErrorDopamine computes positive TD Error and dopamine burst', () => {
  // Expected = 0.2, Received = 1.0 (Reward was much better than predicted)
  const result = calculateTDErrorDopamine(0.2, 1.0, 0.3, 0.9, 0);

  assert.equal(result.tdError, 0.8);
  assert.ok(result.dopaminePhasicResponse > 150); // Burst
  assert.match(result.interpretation, /Surpresa Positiva/i);
  assert.ok(result.updatedValue > 0.2); // Value updated upwards
});

test('calculateTDErrorDopamine computes negative TD Error and dopamine dip', () => {
  // Expected = 1.0, Received = 0.0 (Omission of reward)
  const result = calculateTDErrorDopamine(1.0, 0.0, 0.3, 0.9, 0);

  assert.equal(result.tdError, -1.0);
  assert.ok(result.dopaminePhasicResponse < 50); // Dip/pause
  assert.match(result.interpretation, /Decepção/i);
  assert.ok(result.updatedValue < 1.0); // Value updated downwards
});
