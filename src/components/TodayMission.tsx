/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Brain,
  Zap,
  Target,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Activity,
} from 'lucide-react';
import { TODAY_MICRO_STEPS } from '../data/neuroCurriculum';

interface TodayMissionProps {
  completedTasks: string[];
  toggleTask: (taskId: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const TodayMission: React.FC<TodayMissionProps> = ({
  completedTasks,
  toggleTask,
  onNavigateToTab,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const isTodayComplete = completedTasks.includes('task-1-1');

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Card: Por que começar hoje */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Missão de Desbloqueio: Comece Hoje (20 Minutos)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Destrave a Neurobiologia usando o que você já sabe de IA
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              A paralisia inicial é comum: livros tradicionais de neurociência começam com anatomia descritiva em latim.
              Aqui, sua jornada começa pelo <span className="text-emerald-400 font-semibold">processamento de informação</span>: 
              o neurônio biológico calcula uma função ponderada idêntica à que você já conhece no Machine Learning!
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center min-w-[200px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xl font-bold">
              <Clock className="w-5 h-5" />
              20 Minutos
            </div>
            <span className="text-xs text-slate-400 mt-1">Tempo total para hoje</span>
            <div className="mt-3 w-full pt-3 border-t border-slate-800/80 flex justify-center">
              {isTodayComplete ? (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4" /> Missão de Hoje Concluída!
                </div>
              ) : (
                <span className="text-xs text-amber-400 font-medium animate-pulse">
                  Pronto para iniciar?
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Micro-Steps Interactive Accordion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            O Roteiro Fatiado em 3 Micro-Passos para Hoje
          </h3>
          <span className="text-xs text-slate-400">Passo {activeStep + 1} de 3</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TODAY_MICRO_STEPS.map((s, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-semibold text-indigo-400">Passo 0{s.step}</span>
                  <span className="flex items-center gap-1 font-mono">{s.time}</span>
                </div>
                <h4 className="text-sm font-semibold text-white line-clamp-2">{s.title}</h4>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-indigo-400">
                Passo {TODAY_MICRO_STEPS[activeStep].step} • {TODAY_MICRO_STEPS[activeStep].time}
              </div>
              <h4 className="text-xl font-bold text-white mt-1">
                {TODAY_MICRO_STEPS[activeStep].title}
              </h4>
              <p className="text-sm text-slate-300 mt-1">
                {TODAY_MICRO_STEPS[activeStep].summary}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800"
              >
                Anterior
              </button>
              <button
                onClick={() => setActiveStep((prev) => Math.min(2, prev + 1))}
                disabled={activeStep === 2}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Próximo Passo
              </button>
            </div>
          </div>

          {/* Interactive Comparison Diagram (If Step 0: Neuron vs Perceptron) */}
          {activeStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-5 rounded-xl border border-slate-800/80">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <Brain className="w-4 h-4" />
                  No Neurônio Biológico
                </div>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Dendritos:</strong> Árvores que recebem os neurotransmissores de outros neurônios (entradas x).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Sinapses:</strong> O ponto de conexão com peso específico (+ Glutamato ou - GABA).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Soma:</strong> O corpo celular onde a corrente iônica é somada continuamente.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Cone Axonal:</strong> Se a voltagem chegar a -55mV, dispara o Potencial de Ação!</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-5">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                  <Zap className="w-4 h-4" />
                  Na Inteligência Artificial (Perceptron)
                </div>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span><strong>Entradas (x₁, x₂, ..., xₙ):</strong> Sinais numéricos que alimentam a camada.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span><strong>Pesos (w₁, w₂, ..., wₙ):</strong> Parâmetros aprendíveis multiplicados pelas entradas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span><strong>Somatório Ponderado:</strong> z = ∑(wᵢ · xᵢ) + b.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span><strong>Função de Ativação:</strong> f(z) = ReLU, Sigmoid ou Heaviside Step.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Points list for active step */}
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-slate-200">Pontos Essenciais para Absorver:</h5>
            <div className="space-y-2">
              {TODAY_MICRO_STEPS[activeStep].points.map((pt, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs sm:text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>{pt}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reflection box */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
              <span className="font-semibold text-emerald-300">Insight Cognitivo:</span>{' '}
              {TODAY_MICRO_STEPS[activeStep].reflection}
            </div>
          </div>

          {/* Action button: mark as done / go to simulator */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleTask('task-1-1')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                  isTodayComplete
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isTodayComplete ? 'text-white' : 'text-slate-400'}`} />
                {isTodayComplete ? 'Missão de Hoje Marcada como Feita!' : 'Concluir Missão de 20 min de Hoje'}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onNavigateToTab('datalab')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <Activity className="w-4 h-4" />
                <span>Oficina IA & Dados (Prática)</span>
              </button>
              <button
                onClick={() => onNavigateToTab('lab')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-indigo-600/20"
              >
                <span>Bioeletricidade</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* O Escudo Anti-Sobrecarga: 3 Regras de ouro para a pós */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            O Escudo Anti-Sobrecarga para Alunos de Dados & IA na Pós
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="text-indigo-400 font-semibold flex items-center gap-1.5">
              <span>1. Princípio da Função</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Não perca noites decorando onde fica cada núcleo talâmico ou sulco cortical. Sempre pergunte: <em>"Que cálculo ou sinal biológico esse nó processa?"</em>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span>2. O Dado Observável</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Como esse fenômeno vira dado? Ex: Um potencial de membrana vira spike train; a sincronia de sinapses vira a onda de EEG; o fluxo sanguíneo vira voxel no fMRI.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="text-purple-400 font-semibold flex items-center gap-1.5">
              <span>3. A Micro-Dose Diária</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              15 a 20 minutos por dia superam maratonas de fim de semana. A neuroplasticidade humana precisa de ciclos de sono para consolidar conexões sinápticas!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
