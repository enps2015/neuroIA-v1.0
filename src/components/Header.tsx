/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Brain, Zap, BookOpen, Activity, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  progressPercentage: number;
  completedTasksCount: number;
  totalTasksCount: number;
  currentLevel: string;
  badge: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  progressPercentage,
  completedTasksCount,
  totalTasksCount,
  currentLevel,
  badge,
}) => {
  const tabs = [
    { id: 'today', label: 'Começar Hoje', icon: Sparkles, badge: 'Passo 1' },
    { id: 'datalab', label: 'Oficina IA & Dados', icon: Activity, badge: 'Interativo' },
    { id: 'track', label: 'Trilha em 4 Níveis', icon: BookOpen },
    { id: 'lab', label: 'Bioeletricidade', icon: Zap },
    { id: 'bridge', label: 'Ponte Neuro ↔ IA', icon: Sparkles },
    { id: 'quiz', label: 'Fixação & Quiz', icon: CheckCircle2 },
    { id: 'library', label: 'Biblioteca & Datasets', icon: Brain },
    { id: 'tutor', label: 'Mentor IA', icon: Sparkles },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  NeuroIA
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                    Pós-Graduação & Dados
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                A ponte descomplicada entre Neurobiologia, Ciência de Dados e Inteligência Artificial
              </p>
            </div>
          </div>

          {/* Gamification Status Bar */}
          <div className="flex items-center gap-3 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
            <div className="flex flex-col">
              <span className="text-slate-400 font-medium text-[11px]">Nível Atual:</span>
              <span className="text-emerald-400 font-semibold">{currentLevel}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex flex-col min-w-[130px]">
              <div className="flex justify-between items-center text-[11px] mb-1">
                <span className="text-slate-400">Progresso da Trilha</span>
                <span className="text-white font-mono font-semibold">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="hidden sm:flex items-center text-slate-300 font-medium">
              <span className="mr-1">{badge.split(' ')[0]}</span>
              <span className="text-[11px] text-slate-300 truncate max-w-[110px]">{badge.split(' ').slice(1).join(' ')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60" aria-label="Navegação da Aplicação">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
