/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Activity,
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
  TrendingUp,
  Cpu,
  Copy,
  Check,
  Brain,
  Zap,
  BarChart2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Code2,
} from 'lucide-react';
import {
  generateSyntheticEEG,
  calculateTDErrorDopamine,
  EEGSimulationResult,
} from '../utils/dataNeuroLabLogic';

export const InteractiveDataLab: React.FC = () => {
  const [activeActivity, setActiveActivity] = useState<'eeg' | 'rl'>('eeg');

  // Activity 1: EEG Pipeline State
  const [eegState, setEegState] = useState<'alpha_relaxed' | 'theta_focused' | 'blink_artifact'>('alpha_relaxed');
  const [applyFilter, setApplyFilter] = useState(true);
  const [applyICA, setApplyICA] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Activity 2: Dopamine RL State
  const [expectedValue, setExpectedValue] = useState(0.3);
  const [receivedReward, setReceivedReward] = useState(1.0);
  const [learningRate, setLearningRate] = useState(0.3);
  const [discountGamma, setDiscountGamma] = useState(0.9);

  // Compute live EEG result
  const eegResult: EEGSimulationResult = generateSyntheticEEG(
    eegState,
    128,
    applyFilter,
    applyICA
  );

  // Compute live Dopamine TD-Error result
  const tdResult = calculateTDErrorDopamine(
    expectedValue,
    receivedReward,
    learningRate,
    discountGamma,
    0
  );

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const pythonEEGCode = `# Pipeline Real de EEG com MNE-Python e Scikit-Learn
import mne
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# 1. Carregar dados brutos (ex: 64 canais a 256Hz)
raw = mne.io.read_raw_fif("dados_participante_raw.fif", preload=True)

# 2. Filtragem Passa-Faixa (remover drift térmico e ruído de 60Hz)
raw.filter(l_freq=0.5, h_freq=45.0)

# 3. Remoção de Artefatos de Piscar de Olhos com ICA
ica = mne.preprocessing.ICA(n_components=20, random_state=42)
ica.fit(raw)
# Identifica e exclui a componente correlacionada aos olhos (EOG)
ica.exclude = [0]  # componente de piscar
raw_clean = ica.apply(raw.copy())

# 4. Extração de Features Espectrais (Bandpower: Teta, Alfa, Beta)
psds, freqs = mne.time_frequency.psd_array_welch(
    raw_clean.get_data(), sfreq=256, fmin=1, fmax=45
)
# X contém a densidade de potência das bandas; y contém os estados cognitivos
# 5. Treinar classificador para decodificar foco vs relaxamento
# clf = RandomForestClassifier().fit(X_train, y_train)`;

  const pythonRLCode = `# Simulação da Dopamina como TD-Error no Q-Learning
import numpy as np

alpha = ${learningRate}  # Taxa de aprendizado
gamma = ${discountGamma}  # Fator de desconto

# V(s) = valor esperado estimado pelo cérebro
V_s = ${expectedValue}
# R = recompensa real obtida do ambiente
R = ${receivedReward}
V_next = 0.0

# O neurônio dopaminérgico calcula exatamente o TD-Error:
td_error = R + gamma * V_next - V_s

# Disparo biológico fásico de dopamina (baseline = 100%):
# delta > 0 -> rajada fásica; delta < 0 -> silenciamento
print(f"TD-Error (δ): {td_error:.3f}")

# Atualização Hebbiana mediada por dopamina:
V_s_novo = V_s + alpha * td_error
print(f"Novo Valor Esperado V(s): {V_s_novo:.3f}")`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Activity Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Atividade Prática Interativa
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Oficina Hands-on: Dados e Inteligência Artificial Aplicada
            </h2>
            <p className="text-sm text-slate-300">
              Interaja diretamente com pipelines reais de processamento de séries temporais de neurociência e algoritmos de Reinforcement Learning.
            </p>
          </div>

          {/* Activity Switcher */}
          <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
            <button
              onClick={() => setActiveActivity('eeg')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeActivity === 'eeg'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              1. Pipeline EEG & ML
            </button>
            <button
              onClick={() => setActiveActivity('rl')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeActivity === 'rl'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              2. Dopamina & Q-Learning
            </button>
          </div>
        </div>
      </div>

      {/* ================= ACTIVITY 1: EEG & MACHINE LEARNING PIPELINE ================= */}
      {activeActivity === 'eeg' && (
        <div className="space-y-6">
          {/* Controls Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Passo 1: Selecione o Cenário Experimental do Participante
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setEegState('alpha_relaxed')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  eegState === 'alpha_relaxed'
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-white mb-0.5">
                  A. Olhos Fechados / Relaxado
                </div>
                <p className="text-[11px] text-slate-400">
                  Ritmo Berger dominante: onda sinusoidal síncrona na faixa Alfa (~10 Hz).
                </p>
              </button>

              <button
                onClick={() => setEegState('theta_focused')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  eegState === 'theta_focused'
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-white mb-0.5">
                  B. Sobrecarga de Memória (N-Back)
                </div>
                <p className="text-[11px] text-slate-400">
                  Aumento de Teta Frontal (~6 Hz) e Beta (~20 Hz) com decréscimo de Alfa.
                </p>
              </button>

              <button
                onClick={() => setEegState('blink_artifact')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  eegState === 'blink_artifact'
                    ? 'bg-rose-950/30 border-rose-500 shadow-md ring-1 ring-rose-500/50'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-rose-300 mb-0.5">
                  C. Contaminação por Piscar de Olhos
                </div>
                <p className="text-[11px] text-slate-400">
                  Artefato muscular e ocular (EOG): pico de baixa frequência (~80 µV).
                </p>
              </button>
            </div>

            {/* Pipeline Stage Toggles */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-4">
              <span className="text-xs font-semibold text-slate-300">
                Pré-Processamento no Pipeline:
              </span>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={applyFilter}
                  onChange={(e) => setApplyFilter(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Filtro Passa-Faixa (0.5 - 45 Hz)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={applyICA}
                  onChange={(e) => setApplyICA(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-emerald-400 font-medium">Remoção de Artefato com ICA</span>
              </label>
            </div>
          </div>

          {/* Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Time Series Waveform (7 cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                    Série Temporal do EEG (Canal Cz / Fz)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Sinal elétrico pós-sináptico em microvolts (µV) ao longo de 1 segundo
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                  {applyICA ? 'Sinal Limpo (ICA)' : applyFilter ? 'Filtrado' : 'Bruto'}
                </span>
              </div>

              {/* Dynamic SVG Waveform */}
              <div className="h-44 w-full bg-slate-950 rounded-xl p-3 border border-slate-800 relative flex flex-col justify-between overflow-hidden">
                <div className="absolute top-2 left-3 text-[10px] text-slate-500 font-mono">
                  +50 µV
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 border-b border-dashed border-slate-800 pointer-events-none" />
                <div className="absolute bottom-2 left-3 text-[10px] text-slate-500 font-mono">
                  -50 µV
                </div>

                <svg className="w-full h-full" viewBox="0 0 240 100" preserveAspectRatio="none">
                  {eegResult.rawSignal.length > 1 && (
                    <path
                      d={eegResult.rawSignal.reduce((acc, v, i) => {
                        const signalToUse = applyICA
                          ? eegResult.cleanSignal[i]
                          : applyFilter
                          ? eegResult.filteredSignal[i]
                          : v;
                        const x = (i / (eegResult.rawSignal.length - 1)) * 240;
                        // Map -50µV to +50µV into 0-100 y coords
                        const clamped = Math.max(-55, Math.min(55, signalToUse));
                        const y = 50 - (clamped / 55) * 40;
                        return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke={applyICA ? '#10b981' : eegState === 'blink_artifact' ? '#f43f5e' : '#6366f1'}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  )}
                </svg>

                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>0 ms</span>
                  <span>500 ms</span>
                  <span>1000 ms</span>
                </div>
              </div>

              {/* Biological hint */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                <span className="font-semibold text-slate-200">Insight de Dados:</span>{' '}
                {eegState === 'blink_artifact' && !applyICA ? (
                  <span className="text-rose-300">
                    O piscar de olhos gerou uma deflexão gigantesca (quase 80µV), destruindo as frequências cerebrais. Marque <strong>"Remoção de Artefato com ICA"</strong> para ver a mágica do algoritmo separando a fonte independente!
                  </span>
                ) : (
                  <span>
                    Note a periodicidade rítmica. Em vez de analisar ponto a ponto no tempo, a IA extrai a densidade espectral via <strong>Transformada Rápida de Fourier (FFT)</strong>.
                  </span>
                )}
              </div>
            </div>

            {/* FFT Bandpowers & ML Classifier (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Bandpowers Bar Chart */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                    Densidade Espectral (PSD / FFT)
                  </h4>
                  <span className="text-[11px] text-slate-400">Features p/ ML</span>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Delta (0.5-4 Hz)', val: eegResult.bandPowers.delta, color: 'bg-blue-500' },
                    { name: 'Teta (4-8 Hz)', val: eegResult.bandPowers.theta, color: 'bg-purple-500' },
                    { name: 'Alfa (8-12 Hz)', val: eegResult.bandPowers.alpha, color: 'bg-emerald-500' },
                    { name: 'Beta (13-30 Hz)', val: eegResult.bandPowers.beta, color: 'bg-amber-500' },
                    { name: 'Gama (30-45 Hz)', val: eegResult.bandPowers.gamma, color: 'bg-rose-500' },
                  ].map((band) => (
                    <div key={band.name} className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300">{band.name}</span>
                        <span className="font-mono text-white font-semibold">{band.val} µV²/Hz</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`${band.color} h-full rounded-full transition-all duration-300`}
                          style={{ width: `${Math.min(100, (band.val / 25) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Machine Learning Model Output Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    Classificador de IA (RandomForest / SVM)
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {(eegResult.confidence * 100).toFixed(0)}% Confiança
                  </span>
                </div>

                <div>
                  <div className="text-xs text-slate-400">Estado Cognitivo Previsto:</div>
                  <div className="text-base font-extrabold text-white mt-0.5">
                    {eegResult.predictedState}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                  <span className="text-indigo-300 font-semibold">Banda Dominante:</span>{' '}
                  <span className="font-mono font-bold text-emerald-400">{eegResult.dominantBand}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Exportable Python Code Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Script Python Pronto para sua Pós (MNE-Python & Scikit-Learn)
              </h4>
              <button
                onClick={() => copyToClipboard(pythonEEGCode)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
              <code>{pythonEEGCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* ================= ACTIVITY 2: DOPAMINE & REINFORCEMENT LEARNING ================= */}
      {activeActivity === 'rl' && (
        <div className="space-y-6">
          {/* Controls Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Parâmetros do Agente de Reinforcement Learning & Estímulo
            </h3>
            <p className="text-xs text-slate-300">
              Ajuste os valores abaixo para ver em tempo real o cálculo do <strong>TD-Error</strong> e a resposta biológica dos <strong>neurônios dopaminérgicos do mesencéfalo (VTA / Substância Negra)</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Expected Value Slider */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Predição V(s):</span>
                  <span className="font-mono text-white font-bold">{expectedValue.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={expectedValue}
                  onChange={(e) => setExpectedValue(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Recompensa esperada</span>
              </div>

              {/* Received Reward Slider */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Recompensa Real R:</span>
                  <span className="font-mono text-emerald-400 font-bold">{receivedReward.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={receivedReward}
                  onChange={(e) => setReceivedReward(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Entregue pelo ambiente</span>
              </div>

              {/* Learning Rate Slider */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Taxa de Aprendizado α:</span>
                  <span className="font-mono text-indigo-400 font-bold">{learningRate.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Velocidade de ajuste</span>
              </div>

              {/* Discount Factor Slider */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Fator Desconto γ:</span>
                  <span className="font-mono text-amber-400 font-bold">{discountGamma.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.99"
                  step="0.05"
                  value={discountGamma}
                  onChange={(e) => setDiscountGamma(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Horizonte futuro</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-slate-500">Cenários Clássicos de Wolfram Schultz:</span>
              <button
                onClick={() => {
                  setExpectedValue(0.1);
                  setReceivedReward(1.0);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
              >
                1. Recompensa Inesperada (+δ)
              </button>
              <button
                onClick={() => {
                  setExpectedValue(1.0);
                  setReceivedReward(1.0);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
              >
                2. Recompensa Totalmente Prevista (δ = 0)
              </button>
              <button
                onClick={() => {
                  setExpectedValue(0.9);
                  setReceivedReward(0.0);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
              >
                3. Omissão da Recompensa (-δ)
              </button>
            </div>
          </div>

          {/* Results Side-by-Side: Math vs Biology */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Math (Q-Learning / TD Error) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  Na Matemática de RL (Q-Learning)
                </span>
                <span className="text-xs font-mono text-slate-400">Sutton & Barto (1998)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-xs text-slate-400">Erro de Diferença Temporal (TD-Error):</div>
                <div
                  className={`text-3xl font-mono font-extrabold ${
                    tdResult.tdError > 0
                      ? 'text-emerald-400'
                      : tdResult.tdError < 0
                      ? 'text-rose-400'
                      : 'text-slate-300'
                  }`}
                >
                  δ = {tdResult.tdError > 0 ? `+${tdResult.tdError}` : tdResult.tdError}
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  δ = R + γ·V(s') - V(s) = {receivedReward} - {expectedValue}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Atualização do Valor V(s):</span>
                  <span className="font-mono text-white font-semibold">
                    {expectedValue.toFixed(2)} → {tdResult.updatedValue.toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  V_novo = V_antigo + α · δ
                </div>
              </div>
            </div>

            {/* The Biology (Dopamine neurons firing) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" />
                  Nos Neurônios Dopaminérgicos (VTA)
                </span>
                <span className="text-xs font-mono text-slate-400">Wolfram Schultz (1997)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-xs text-slate-400">Taxa de Disparo de Dopamina:</div>
                <div className="text-3xl font-mono font-extrabold text-white flex items-center justify-center gap-2">
                  <span>{tdResult.dopaminePhasicResponse}%</span>
                  <span className="text-xs px-2 py-0.5 rounded font-sans font-medium bg-slate-800 text-slate-300">
                    {tdResult.dopaminePhasicResponse > 110
                      ? '⚡ Rajada Fásica'
                      : tdResult.dopaminePhasicResponse < 90
                      ? '🛑 Silenciamento'
                      : 'Equilíbrio Basal (4 Hz)'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  (100% = taxa tônica de repouso)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-emerald-400 block mb-1">
                  O que o cérebro está fazendo agora:
                </span>
                {tdResult.interpretation}
              </div>
            </div>
          </div>

          {/* Exportable Python Code Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Script Python de Q-Learning & Dopamina para seus Experimentos
              </h4>
              <button
                onClick={() => copyToClipboard(pythonRLCode)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
              <code>{pythonRLCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
