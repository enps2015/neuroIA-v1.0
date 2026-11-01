/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SynapticInput {
  id: string;
  name: string;
  type: 'excitatory' | 'inhibitory';
  neurotransmitter: 'Glutamato' | 'GABA' | 'Dopamina' | 'Acetilcolina';
  weight: number; // For example: +15 for Glutamate, -20 for GABA
  active: boolean;
}

export interface MembraneState {
  voltage: number; // in mV
  phase: 'resting' | 'depolarizing' | 'action_potential' | 'repolarizing' | 'hyperpolarization';
  spiked: boolean;
  threshold: number; // -55 mV
  restingPotential: number; // -70 mV
}

export interface ArtificialNeuronComparison {
  weightedSum: number;
  bias: number;
  linearOutput: number;
  heavisideSpike: boolean;
  sigmoid: number;
  relu: number;
  biologicalEquivalent: string;
}

export interface ConceptItem {
  id: string;
  category: 'celular' | 'sinapse' | 'circuitos' | 'sistemas' | 'dados';
  neuroTerm: string;
  aiTerm: string;
  shortSummary: string;
  neurobiologyExplanation: string;
  aiAnalogy: string;
  practicalDataApplication: string;
  pythonOrFormulaExample?: string;
  tag: string;
}

export interface StudyTask {
  id: string;
  module: 1 | 2 | 3 | 4;
  title: string;
  estimatedMinutes: number;
  description: string;
  quickTakeaway: string;
  aiLink: string;
  actionItem: string;
  isTodayStarter?: boolean;
}

export const RESTING_POTENTIAL = -70; // mV
export const THRESHOLD_POTENTIAL = -55; // mV
export const PEAK_POTENTIAL = +30; // mV
export const HYPERPOLARIZATION_POTENTIAL = -80; // mV

/**
 * Calculates membrane voltage based on current synaptic input sum and previous state.
 */
export function simulateMembraneStep(
  inputs: SynapticInput[],
  currentVoltage: number,
  isRefractory: boolean
): { nextVoltage: number; phase: MembraneState['phase']; spiked: boolean; isRefractory: boolean } {
  if (isRefractory) {
    // Gradually recover from refractory period back to resting potential
    const nextVoltage = currentVoltage < RESTING_POTENTIAL 
      ? Math.min(RESTING_POTENTIAL, currentVoltage + 3)
      : RESTING_POTENTIAL;
    return {
      nextVoltage,
      phase: 'hyperpolarization',
      spiked: false,
      isRefractory: nextVoltage < RESTING_POTENTIAL,
    };
  }

  // Sum active inputs (EPSPs and IPSPs)
  const synapticCurrent = inputs.reduce((sum, input) => {
    if (!input.active) return sum;
    return sum + input.weight;
  }, 0);

  const potential = currentVoltage + synapticCurrent * 0.4;

  if (potential >= THRESHOLD_POTENTIAL) {
    // All-or-none spike triggered!
    return {
      nextVoltage: PEAK_POTENTIAL,
      phase: 'action_potential',
      spiked: true,
      isRefractory: true,
    };
  } else if (potential > RESTING_POTENTIAL) {
    return {
      nextVoltage: Math.min(potential, THRESHOLD_POTENTIAL - 1),
      phase: 'depolarizing',
      spiked: false,
      isRefractory: false,
    };
  } else {
    // Decay back to resting
    const decayed = currentVoltage + (RESTING_POTENTIAL - currentVoltage) * 0.3;
    return {
      nextVoltage: Math.max(HYPERPOLARIZATION_POTENTIAL, Math.min(RESTING_POTENTIAL, decayed)),
      phase: 'resting',
      spiked: false,
      isRefractory: false,
    };
  }
}

/**
 * Compares biological summation with Artificial Perceptron / Activation functions.
 */
export function compareBiologicalWithPerceptron(
  inputs: { weight: number; value: number }[],
  bias: number,
  threshold: number = THRESHOLD_POTENTIAL
): ArtificialNeuronComparison {
  const weightedSum = inputs.reduce((acc, curr) => acc + curr.weight * curr.value, 0);
  const linearOutput = weightedSum + bias;
  
  // Biological: All-or-none above threshold
  const heavisideSpike = linearOutput >= threshold;

  // Sigmoid activation: 1 / (1 + e^-z), scaled for visualization
  // Normalize linearOutput for sigmoid curve around threshold
  const normalizedZ = (linearOutput - threshold) / 10;
  const sigmoid = 1 / (1 + Math.exp(-normalizedZ));

  // ReLU activation: max(0, z)
  const relu = Math.max(0, linearOutput - threshold);

  let biologicalEquivalent = 'Potencial Sublimiar: estímulo insuficiente, sem disparo do axônio.';
  if (heavisideSpike) {
    biologicalEquivalent = 'Disparo Tudo-ou-Nada: Despolarização massiva ultrapassou o limiar de -55mV! O axônio propaga o sinal.';
  }

  return {
    weightedSum,
    bias,
    linearOutput,
    heavisideSpike,
    sigmoid,
    relu,
    biologicalEquivalent,
  };
}

/**
 * Calculates study progress and streaks.
 */
export function calculateStudyProgress(completedTaskIds: string[], totalTasksCount: number) {
  const completedCount = completedTaskIds.length;
  const percentage = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;
  
  let currentLevel = 'Iniciante Curioso';
  let badge = '🌱 Primeiro Disparo';
  
  if (percentage >= 100) {
    currentLevel = 'Neuro-Engenheiro Master';
    badge = '🧠 Cérebro Conectoma Completo';
  } else if (percentage >= 75) {
    currentLevel = 'Arquiteto de Redes Neurais Biológicas';
    badge = '⚡ Plasticidade Hebbiana Ativa';
  } else if (percentage >= 50) {
    currentLevel = 'Desbravador das Sinapses';
    badge = '🔬 Domador de Neurotransmissores';
  } else if (percentage >= 25) {
    currentLevel = 'Explorador da Bioeletricidade';
    badge = '🔋 Potencial de Ação Desbloqueado';
  }

  return {
    completedCount,
    totalTasksCount,
    percentage,
    currentLevel,
    badge,
  };
}

/**
 * Filters the bridge dictionary by category and search keyword.
 */
export function filterDictionary(items: ConceptItem[], query: string, category: string): ConceptItem[] {
  const normalizedQuery = query.toLowerCase().trim();
  return items.filter(item => {
    const matchesCategory = category === 'all' || item.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;

    return (
      item.neuroTerm.toLowerCase().includes(normalizedQuery) ||
      item.aiTerm.toLowerCase().includes(normalizedQuery) ||
      item.shortSummary.toLowerCase().includes(normalizedQuery) ||
      item.tag.toLowerCase().includes(normalizedQuery)
    );
  });
}
