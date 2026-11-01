/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EEGBandPowers {
  delta: number; // 0.5 - 4 Hz
  theta: number; // 4 - 8 Hz
  alpha: number; // 8 - 12 Hz
  beta: number;  // 13 - 30 Hz
  gamma: number; // 30 - 45 Hz
}

export interface EEGSimulationResult {
  timePoints: number[];
  rawSignal: number[];
  filteredSignal: number[];
  cleanSignal: number[];
  frequencies: number[];
  psd: number[];
  bandPowers: EEGBandPowers;
  dominantBand: 'Delta' | 'Teta' | 'Alfa' | 'Beta' | 'Gama';
  predictedState: string;
  confidence: number;
}

export interface TDErrorSimulationResult {
  step: number;
  expectedValue: number;
  receivedReward: number;
  tdError: number;
  dopaminePhasicResponse: number; // baseline = 100%, surge = 250%, pause = 20%
  updatedValue: number;
  interpretation: string;
}

/**
 * Generates synthetic EEG signals simulating real experimental paradigms.
 */
export function generateSyntheticEEG(
  state: 'alpha_relaxed' | 'theta_focused' | 'blink_artifact',
  samplesCount: number = 128,
  filterApplied: boolean = false,
  icaApplied: boolean = false
): EEGSimulationResult {
  const samplingRate = 128; // 128 Hz
  const dt = 1 / samplingRate;
  const timePoints: number[] = [];
  const rawSignal: number[] = [];
  const filteredSignal: number[] = [];
  const cleanSignal: number[] = [];

  for (let i = 0; i < samplesCount; i++) {
    const t = i * dt;
    timePoints.push(Math.round(t * 1000)); // in ms

    // Base pink/gaussian noise
    const noise = (Math.random() - 0.5) * 6;

    let ampDelta = 4;
    let ampTheta = 4;
    let ampAlpha = 4;
    let ampBeta = 3;
    let ampGamma = 2;
    let blinkArtifact = 0;

    if (state === 'alpha_relaxed') {
      // Strong 10 Hz rhythm (posterior alpha with eyes closed)
      ampAlpha = 24;
      ampBeta = 2;
    } else if (state === 'theta_focused') {
      // Frontal midline theta (6 Hz) during cognitive load / working memory
      ampTheta = 22;
      ampBeta = 12;
      ampAlpha = 3;
    } else if (state === 'blink_artifact') {
      // Massive low frequency deflection around t = 0.4s to 0.6s
      if (t >= 0.35 && t <= 0.65) {
        blinkArtifact = Math.sin((t - 0.35) * Math.PI * 3.33) * 80;
      }
    }

    const sDelta = ampDelta * Math.sin(2 * Math.PI * 2 * t);
    const sTheta = ampTheta * Math.sin(2 * Math.PI * 6 * t);
    const sAlpha = ampAlpha * Math.sin(2 * Math.PI * 10 * t);
    const sBeta = ampBeta * Math.sin(2 * Math.PI * 20 * t);
    const sGamma = ampGamma * Math.sin(2 * Math.PI * 35 * t);

    // Raw signal contains everything + drift + artifact
    const rawVal = sDelta + sTheta + sAlpha + sBeta + sGamma + noise + blinkArtifact;
    rawSignal.push(rawVal);

    // Filtered signal: attenuates drift
    const filteredVal = filterApplied
      ? sDelta * 0.5 + sTheta + sAlpha + sBeta + sGamma + noise * 0.7 + (blinkArtifact ? blinkArtifact * 0.8 : 0)
      : rawVal;
    filteredSignal.push(filteredVal);

    // Clean signal: after ICA artifact suppression
    const cleanVal = icaApplied
      ? sDelta * 0.5 + sTheta + sAlpha + sBeta + sGamma + noise * 0.5
      : filteredVal;
    cleanSignal.push(cleanVal);
  }

  // Calculate Band Powers based on the signal that is active (clean if ICA, filtered if filter, else raw)
  const activeSignal = icaApplied ? cleanSignal : filterApplied ? filteredSignal : rawSignal;

  // Discrete Fourier Transform approximation for visualization of frequency bins
  const frequencies: number[] = [2, 6, 10, 20, 35];
  const psd: number[] = frequencies.map((freq) => {
    let re = 0;
    let im = 0;
    for (let i = 0; i < samplesCount; i++) {
      const angle = (2 * Math.PI * freq * i) / samplingRate;
      re += activeSignal[i] * Math.cos(angle);
      im -= activeSignal[i] * Math.sin(angle);
    }
    return Math.sqrt(re * re + im * im) / samplesCount;
  });

  const bandPowers: EEGBandPowers = {
    delta: Math.round(psd[0] * 10) / 10,
    theta: Math.round(psd[1] * 10) / 10,
    alpha: Math.round(psd[2] * 10) / 10,
    beta: Math.round(psd[3] * 10) / 10,
    gamma: Math.round(psd[4] * 10) / 10,
  };

  // Find dominant band
  let dominantBand: EEGBandPowers[keyof EEGBandPowers] = bandPowers.alpha;
  let dominantName: EEGSimulationResult['dominantBand'] = 'Alfa';

  if (bandPowers.delta > dominantBand) {
    dominantBand = bandPowers.delta;
    dominantName = 'Delta';
  }
  if (bandPowers.theta > dominantBand) {
    dominantBand = bandPowers.theta;
    dominantName = 'Teta';
  }
  if (bandPowers.beta > dominantBand) {
    dominantBand = bandPowers.beta;
    dominantName = 'Beta';
  }
  if (bandPowers.gamma > dominantBand) {
    dominantBand = bandPowers.gamma;
    dominantName = 'Gama';
  }

  // Predicted state from Classifier
  let predictedState = 'Estado Indeterminado';
  let confidence = 0.65;

  if (state === 'blink_artifact' && !icaApplied) {
    predictedState = 'Artefato Detectado (Piscar de Olhos / Ruído)';
    confidence = 0.94;
  } else if (dominantName === 'Alfa') {
    predictedState = 'Vigília Relaxada / Olhos Fechados (Ritmo Berger Alfa)';
    confidence = 0.92;
  } else if (dominantName === 'Teta') {
    predictedState = 'Alto Engajamento Cognitivo / Memória de Trabalho (Teta Frontal)';
    confidence = 0.89;
  } else if (dominantName === 'Beta') {
    predictedState = 'Alerta Ativo / Processamento Motor';
    confidence = 0.81;
  }

  return {
    timePoints,
    rawSignal,
    filteredSignal,
    cleanSignal,
    frequencies,
    psd,
    bandPowers,
    dominantBand: dominantName,
    predictedState,
    confidence,
  };
}

/**
 * Simulates Temporal Difference Error (TD-Error) and biological dopamine firing.
 */
export function calculateTDErrorDopamine(
  expectedValue: number,
  receivedReward: number,
  learningRateAlpha: number = 0.3,
  discountGamma: number = 0.9,
  nextStateValue: number = 0
): TDErrorSimulationResult {
  // Classic TD Error equation: delta = R + gamma * V(s') - V(s)
  const tdError = receivedReward + discountGamma * nextStateValue - expectedValue;

  // New value after learning: V(s) = V(s) + alpha * delta
  const updatedValue = expectedValue + learningRateAlpha * tdError;

  // Biological dopamine firing response:
  // Baseline = 100%
  // Positive surprise: bursts up to ~280%
  // Negative surprise: pause / dip down to ~15%
  let dopaminePhasicResponse = 100;
  let interpretation = '';

  if (tdError > 0.05) {
    dopaminePhasicResponse = Math.min(300, 100 + tdError * 150);
    interpretation = 'Surpresa Positiva! O resultado superou a predição. O VTA dispara uma rajada fásica de dopamina para fortalecer as sinapses cortico-estriatais.';
  } else if (tdError < -0.05) {
    dopaminePhasicResponse = Math.max(10, 100 + tdError * 120);
    interpretation = 'Decepção / Omissão de Recompensa! O resultado foi pior do que o modelo previa. Os neurônios dopaminérgicos silenciam (queda fásica abaixo do basal).';
  } else {
    dopaminePhasicResponse = 100;
    interpretation = 'Recompensa 100% prevista. O modelo interno está calibrado. A dopamina permanece em sua taxa tônica basal (~4-5 Hz).';
  }

  return {
    step: 1,
    expectedValue,
    receivedReward,
    tdError: Math.round(tdError * 100) / 100,
    dopaminePhasicResponse: Math.round(dopaminePhasicResponse),
    updatedValue: Math.round(updatedValue * 100) / 100,
    interpretation,
  };
}
