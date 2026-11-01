/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  simulateMembraneStep,
  compareBiologicalWithPerceptron,
  calculateStudyProgress,
  filterDictionary,
  RESTING_POTENTIAL,
  THRESHOLD_POTENTIAL,
  PEAK_POTENTIAL,
  type SynapticInput,
  type ConceptItem,
} from './neuroLogic';

test('simulateMembraneStep triggers action potential spike when reaching or exceeding threshold', () => {
  const inputs: SynapticInput[] = [
    { id: '1', name: 'Glutamato AMPA', type: 'excitatory', neurotransmitter: 'Glutamato', weight: 40, active: true },
  ];

  // Resting is -70mV. Adding 40 * 0.4 = +16 mV brings it to -54 mV, which exceeds threshold (-55 mV)
  const result = simulateMembraneStep(inputs, RESTING_POTENTIAL, false);

  assert.equal(result.spiked, true);
  assert.equal(result.nextVoltage, PEAK_POTENTIAL);
  assert.equal(result.phase, 'action_potential');
  assert.equal(result.isRefractory, true);
});

test('simulateMembraneStep stays subthreshold when inputs are insufficient', () => {
  const inputs: SynapticInput[] = [
    { id: '1', name: 'Leve estímulo', type: 'excitatory', neurotransmitter: 'Glutamato', weight: 5, active: true },
  ];

  // -70 + (5 * 0.4) = -68mV (below -55mV threshold)
  const result = simulateMembraneStep(inputs, RESTING_POTENTIAL, false);

  assert.equal(result.spiked, false);
  assert.equal(result.phase, 'depolarizing');
  assert.ok(result.nextVoltage < THRESHOLD_POTENTIAL);
});

test('compareBiologicalWithPerceptron computes correct spike and activation values', () => {
  const inputs = [
    { weight: 2, value: 10 }, // 20
    { weight: 3, value: 5 },  // 15
  ];
  // sum = 35. With bias = -90, total is -55 (matches threshold)
  const comp = compareBiologicalWithPerceptron(inputs, -90, -55);

  assert.equal(comp.weightedSum, 35);
  assert.equal(comp.linearOutput, -55);
  assert.equal(comp.heavisideSpike, true);
  assert.equal(comp.sigmoid, 0.5); // at normalizedZ = 0, sigmoid is 0.5
  assert.equal(comp.relu, 0); // linearOutput - threshold = 0
});

test('calculateStudyProgress returns correct milestone and percentage', () => {
  const total = 10;
  const progress0 = calculateStudyProgress([], total);
  assert.equal(progress0.percentage, 0);
  assert.equal(progress0.currentLevel, 'Iniciante Curioso');

  const progressHalf = calculateStudyProgress(['1', '2', '3', '4', '5'], total);
  assert.equal(progressHalf.percentage, 50);
  assert.equal(progressHalf.currentLevel, 'Desbravador das Sinapses');

  const progressFull = calculateStudyProgress(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], total);
  assert.equal(progressFull.percentage, 100);
  assert.equal(progressFull.currentLevel, 'Neuro-Engenheiro Master');
});

test('filterDictionary filters by category and search keyword', () => {
  const dummyItems: ConceptItem[] = [
    {
      id: 'synapse-weight',
      category: 'sinapse',
      neuroTerm: 'Sinapse Química',
      aiTerm: 'Peso Conexão (Weight)',
      shortSummary: 'Transmissão química entre neurônios.',
      neurobiologyExplanation: 'Vesículas liberam neurotransmissores.',
      aiAnalogy: 'Multiplicação da entrada pelo peso.',
      practicalDataApplication: 'Matriz de adjacência do conectoma.',
      tag: 'Conectividade',
    },
    {
      id: 'action-pot',
      category: 'celular',
      neuroTerm: 'Potencial de Ação',
      aiTerm: 'Spiking / Step Activation',
      shortSummary: 'Disparo tudo-ou-nada.',
      neurobiologyExplanation: 'Canais de sódio e potássio.',
      aiAnalogy: 'Threshold em SNNs.',
      practicalDataApplication: 'Análise de spike trains em eletrofisiologia.',
      tag: 'Bioeletricidade',
    },
  ];

  const searchSynapse = filterDictionary(dummyItems, 'química', 'all');
  assert.equal(searchSynapse.length, 1);
  assert.equal(searchSynapse[0].id, 'synapse-weight');

  const filterCategory = filterDictionary(dummyItems, '', 'celular');
  assert.equal(filterCategory.length, 1);
  assert.equal(filterCategory[0].id, 'action-pot');
});
