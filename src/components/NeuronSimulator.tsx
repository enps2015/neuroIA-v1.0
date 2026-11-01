/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Zap, Activity, Info, ShieldAlert, Cpu } from 'lucide-react';
import {
  simulateMembraneStep,
  compareBiologicalWithPerceptron,
  RESTING_POTENTIAL,
  THRESHOLD_POTENTIAL,
  PEAK_POTENTIAL,
  SynapticInput,
} from '../utils/neuroLogic';

export const NeuronSimulator: React.FC = () => {
  const [inputs, setInputs] = useState<SynapticInput[]>([
    { id: 'ampa1', name: 'Sinapse Excitatória 1 (AMPA)', type: 'excitatory', neurotransmitter: 'Glutamato', weight: 15, active: false },
    { id: 'ampa2', name: 'Sinapse Excitatória 2 (AMPA)', type: 'excitatory', neurotransmitter: 'Glutamato', weight: 15, active: false },
    { id: 'nmda1', name: 'Sinapse Forte (NMDA)', type: 'excitatory', neurotransmitter: 'Glutamato', weight: 20, active: false },
    { id: 'gaba1', name: 'Sinapse Inibitória (GABA-A)', type: 'inhibitory', neurotransmitter: 'GABA', weight: -25, active: false },
  ]);

  const [voltage, setVoltage] = useState<number>(RESTING_POTENTIAL);
  const [voltageHistory, setVoltageHistory] = useState<number[]>([RESTING_POTENTIAL]);
  const [phase, setPhase] = useState<'resting' | 'depolarizing' | 'action_potential' | 'repolarizing' | 'hyperpolarization'>('resting');
  const [isRefractory, setIsRefractory] = useState(false);
  const [spikeCount, setSpikeCount] = useState(0);

  // Toggle input active state
  const toggleInput = (id: string) => {
    setInputs((prev) =>
      prev.map((inp) => (inp.id === id ? { ...inp, active: !inp.active } : inp))
    );
  };

  // Trigger a step simulation
  const handleStimulate = () => {
    const stepResult = simulateMembraneStep(inputs, voltage, isRefractory);
    setVoltage(stepResult.nextVoltage);
    setPhase(stepResult.phase);
    setIsRefractory(stepResult.isRefractory);

    if (stepResult.spiked) {
      setSpikeCount((c) => c + 1);
    }

    setVoltageHistory((prev) => {
      const updated = [...prev, stepResult.nextVoltage];
      return updated.slice(-24); // Keep last 24 points
    });
  };

  // Reset to resting baseline
  const handleReset = () => {
    setVoltage(RESTING_POTENTIAL);
    setVoltageHistory([RESTING_POTENTIAL]);
    setPhase('resting');
    setIsRefractory(false);
    setInputs((prev) => prev.map((inp) => ({ ...inp, active: false })));
  };

  // Automatic decay or pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Natural membrane leak decay towards -70mV if no inputs active and not refractory
      const anyActive = inputs.some((i) => i.active);
      if (!anyActive && voltage > RESTING_POTENTIAL && !isRefractory) {
        setVoltage((v) => {
          const next = Math.max(RESTING_POTENTIAL, v - 2);
          setVoltageHistory((h) => [...h.slice(-23), next]);
          if (next === RESTING_POTENTIAL) setPhase('resting');
          return next;
        });
      } else if (isRefractory) {
        setVoltage((v) => {
          const next = Math.min(RESTING_POTENTIAL, v + 2);
          setVoltageHistory((h) => [...h.slice(-23), next]);
          if (next >= RESTING_POTENTIAL) {
            setIsRefractory(false);
            setPhase('resting');
          }
          return next;
        });
      }
    }, 400);

    return () => clearInterval(interval);
  }, [inputs, voltage, isRefractory]);

  // Comparison with Perceptron
  const activeInputValues = inputs.map((inp) => ({
    weight: inp.weight,
    value: inp.active ? 1 : 0,
  }));
  const comparison = compareBiologicalWithPerceptron(activeInputValues, -70, THRESHOLD_POTENTIAL);

  // Phase color & text
  const phaseDetails = {
    resting: { label: 'Potencial de Repouso (-70 mV)', color: 'text-slate-400', badge: 'bg-slate-800 text-slate-300' },
    depolarizing: { label: 'Despolarização Gradual (Entrada de Na+)', color: 'text-amber-400', badge: 'bg-amber-950 text-amber-300 border-amber-800' },
    action_potential: { label: '⚡ POTENCIAL DE AÇÃO (+30 mV)!', color: 'text-emerald-400', badge: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
    repolarizing: { label: 'Repolarização (Saída de K+)', color: 'text-indigo-400', badge: 'bg-indigo-950 text-indigo-300 border-indigo-800' },
    hyperpolarization: { label: 'Período Refratário (Bomba Na+/K+ restaurando)', color: 'text-purple-400', badge: 'bg-purple-950 text-purple-300 border-purple-800' },
  }[phase];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title & Introduction */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5" />
          Simulador Eletrofisiológico Interativo
        </div>
        <h2 className="text-2xl font-bold text-white">
          Laboratório do Neurônio: Da Membrana Biológica ao Perceptron
        </h2>
        <p className="text-sm text-slate-300">
          Experimente como sinapses excitatórias (Glutamato) somam milivolts e sinapses inibitórias (GABA)
          subtraem carga. Veja o momento exato em que a membrana ultrapassa o limiar de <strong className="text-amber-400">-55 mV</strong> e
          dispara um potencial de ação no axônio!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Synaptic Inputs Control (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                Sinapses Dendríticas (Entradas)
              </h3>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Reiniciar membrana"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Resetar
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Clique para ativar ou desativar os botões sinápticos e aperte em <strong>"Aplicar Estímulo"</strong>:
            </p>

            <div className="space-y-2.5">
              {inputs.map((inp) => (
                <div
                  key={inp.id}
                  onClick={() => toggleInput(inp.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    inp.active
                      ? inp.type === 'excitatory'
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-sm'
                        : 'bg-rose-950/40 border-rose-500/80 shadow-sm'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        inp.active
                          ? inp.type === 'excitatory'
                            ? 'bg-emerald-500 border-emerald-400'
                            : 'bg-rose-500 border-rose-400'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{inp.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {inp.neurotransmitter} ({inp.type === 'excitatory' ? 'Excitatório' : 'Inibitório'})
                      </div>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      inp.type === 'excitatory'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {inp.weight > 0 ? `+${inp.weight}mV` : `${inp.weight}mV`}
                  </span>
                </div>
              ))}
            </div>

            {/* Stimulate Action Button */}
            <div className="pt-2">
              <button
                onClick={handleStimulate}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-indigo-900/30"
              >
                <Play className="w-4 h-4 fill-white" />
                Aplicar Estímulo Sináptico
              </button>
            </div>
          </div>

          {/* Quick biological explanation box */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              Somação Espacial & Temporal:
            </div>
            <p className="text-slate-400 leading-relaxed">
              Um único sinal excitatório raramente dispara o neurônio. Ele precisa de <em>somação espacial</em> (múltiplas sinapses ativas ao mesmo tempo) ou <em>somação temporal</em> (mesma sinapse disparando em alta frequência) para alcançar os <strong>-55 mV</strong>.
            </p>
          </div>
        </div>

        {/* Right Column: Oscilloscope / Voltage Graph & AI Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Membrane Voltage Graph */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Potencial de Membrana Atual</span>
                <div className="text-3xl font-mono font-extrabold text-white flex items-center gap-2">
                  <span>{voltage} mV</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-sans font-medium ${phaseDetails.badge}`}>
                    {phaseDetails.label}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Total de Disparos</span>
                <div className="text-2xl font-mono font-bold text-emerald-400">{spikeCount} spikes</div>
              </div>
            </div>

            {/* SVG Live Voltage Oscilloscope */}
            <div className="h-44 w-full bg-slate-950 rounded-xl p-3 border border-slate-800 relative overflow-hidden flex flex-col justify-between">
              {/* Threshold reference line (-55 mV) */}
              <div
                className="absolute left-0 right-0 border-b border-dashed border-rose-500/60 pointer-events-none flex justify-between px-2 text-[10px] text-rose-400 font-mono"
                style={{ top: '35%' }}
              >
                <span>Limiar de Disparo (-55 mV)</span>
                <span>Threshold</span>
              </div>

              {/* Resting line (-70 mV) */}
              <div
                className="absolute left-0 right-0 border-b border-slate-700/60 pointer-events-none flex justify-between px-2 text-[10px] text-slate-500 font-mono"
                style={{ top: '75%' }}
              >
                <span>Repouso (-70 mV)</span>
                <span>Resting V_m</span>
              </div>

              {/* Dynamic SVG Waveform */}
              <svg className="w-full h-full overflow-visible z-10" viewBox="0 0 240 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="voltageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Plot line */}
                {voltageHistory.length > 1 && (
                  <path
                    d={voltageHistory.reduce((acc, v, i) => {
                      const x = (i / (voltageHistory.length - 1)) * 240;
                      // Map -80mV (y=90) to +30mV (y=10)
                      // Range is 110mV (-80 to +30)
                      const clampedV = Math.max(-80, Math.min(35, v));
                      const y = 90 - ((clampedV - (-80)) / 115) * 80;
                      return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }, '')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Current voltage pulse circle */}
                {voltageHistory.length > 0 && (
                  <circle
                    cx="240"
                    cy={90 - ((Math.max(-80, Math.min(35, voltage)) - (-80)) / 115) * 80}
                    r="4.5"
                    className="fill-emerald-400 animate-ping"
                  />
                )}
              </svg>

              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono z-20">
                <span>Passado Recente (ms)</span>
                <span>Tempo Real (t)</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side: Biological vs Artificial Activation */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Equivalente em Machine Learning (PyTorch / Scikit-Learn)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400">Somatório Linear z:</span>
                <div className="font-mono font-bold text-white text-base">
                  z = {comparison.linearOutput.toFixed(1)}
                </div>
                <p className="text-[10px] text-slate-500">∑(w · x) + bias</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400">Saída ReLU:</span>
                <div className="font-mono font-bold text-emerald-400 text-base">
                  {comparison.relu.toFixed(1)}
                </div>
                <p className="text-[10px] text-slate-500">max(0, z - threshold)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400">Saída Sigmoid:</span>
                <div className="font-mono font-bold text-indigo-400 text-base">
                  {comparison.sigmoid.toFixed(3)}
                </div>
                <p className="text-[10px] text-slate-500">1 / (1 + e^-z)</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
              <span className="font-semibold text-indigo-300">Conclusão Computacional:</span>{' '}
              {comparison.biologicalEquivalent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
