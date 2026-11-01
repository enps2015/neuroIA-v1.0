/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
  Target,
  Brain,
  Radio,
  Network,
} from 'lucide-react';
import { STUDY_MODULES, ModuleInfo } from '../data/neuroCurriculum';
import { StudyTask } from '../utils/neuroLogic';

interface TrackModulesProps {
  completedTasks: string[];
  toggleTask: (taskId: string) => void;
  onSelectTaskForSimulator?: (task: StudyTask) => void;
}

export const TrackModules: React.FC<TrackModulesProps> = ({
  completedTasks,
  toggleTask,
}) => {
  const [expandedModuleId, setExpandedModuleId] = useState<number>(1);

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return Zap;
      case 'Radio':
        return Radio;
      case 'Network':
        return Network;
      case 'Brain':
      default:
        return Brain;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          Currículo Estruturado em 4 Fases
        </div>
        <h2 className="text-2xl font-bold text-white">
          A Trilha Completa da Neurobiologia à Ciência de Dados
        </h2>
        <p className="text-sm text-slate-300">
          Dividida em doses diárias de 15 a 25 minutos. Cada módulo conecta os conceitos biológicos essenciais diretamente à sua aplicação em análise de dados, redes neurais e pipelines de IA.
        </p>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {STUDY_MODULES.map((mod: ModuleInfo) => {
          const Icon = getModuleIcon(mod.icon);
          const isExpanded = expandedModuleId === mod.id;
          const completedInModule = mod.tasks.filter((t) =>
            completedTasks.includes(t.id)
          ).length;
          const progressPercent = Math.round(
            (completedInModule / mod.tasks.length) * 100
          );

          return (
            <div
              key={mod.id}
              className={`rounded-2xl border transition-all ${
                isExpanded
                  ? 'bg-slate-900/90 border-slate-700 shadow-xl'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Module Accordion Header */}
              <button
                onClick={() => setExpandedModuleId(isExpanded ? 0 : mod.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                aria-expanded={isExpanded}
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                        Fase 0{mod.id}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {mod.duration}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                        {mod.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{mod.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      {mod.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-mono font-semibold text-slate-300">
                      {completedInModule} / {mod.tasks.length}
                    </span>
                    <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Module Content Expanded */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-6">
                  {/* Why it matters for AI highlight */}
                  <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-3">
                    <Cpu className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        Por que esse módulo é crucial para você em Dados & IA:
                      </h4>
                      <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                        {mod.whyItMattersForAI}
                      </p>
                    </div>
                  </div>

                  {/* Core Concepts Badges */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400">
                      Conceitos Fundamentais Abordados:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {mod.coreConcepts.map((concept, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-400" />
                      Micro-Tarefas Diárias (15 a 25 min cada):
                    </h4>

                    <div className="space-y-3">
                      {mod.tasks.map((task) => {
                        const isDone = completedTasks.includes(task.id);
                        return (
                          <div
                            key={task.id}
                            className={`p-4 rounded-xl border transition-all ${
                              isDone
                                ? 'bg-slate-950/90 border-emerald-500/40'
                                : 'bg-slate-950 border-slate-800'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <button
                                  onClick={() => toggleTask(task.id)}
                                  className="mt-1 text-slate-500 hover:text-emerald-400 cursor-pointer transition-colors"
                                  title={isDone ? 'Desmarcar' : 'Concluir tarefa'}
                                >
                                  <CheckCircle2
                                    className={`w-5 h-5 ${
                                      isDone ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-600'
                                    }`}
                                  />
                                </button>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5
                                      className={`text-sm font-bold ${
                                        isDone ? 'text-emerald-300 line-through' : 'text-white'
                                      }`}
                                    >
                                      {task.title}
                                    </h5>
                                    {task.isTodayStarter && (
                                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                                        Recomendado Hoje
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                    {task.description}
                                  </p>
                                </div>
                              </div>

                              <span className="text-xs font-mono text-slate-400 shrink-0 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {task.estimatedMinutes}m
                              </span>
                            </div>

                            {/* Takeaway & AI link */}
                            <div className="mt-3 pt-3 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-slate-300">
                                <span className="font-semibold text-emerald-400 block mb-0.5">
                                  💡 A Frase de Ouro:
                                </span>
                                {task.quickTakeaway}
                              </div>
                              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-slate-300">
                                <span className="font-semibold text-indigo-400 block mb-0.5">
                                  ⚡ Conexão com IA & Dados:
                                </span>
                                {task.aiLink}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
