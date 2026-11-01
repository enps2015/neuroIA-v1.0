/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TodayMission } from './components/TodayMission';
import { TrackModules } from './components/TrackModules';
import { NeuronSimulator } from './components/NeuronSimulator';
import { InteractiveDataLab } from './components/InteractiveDataLab';
import { BridgeDictionary } from './components/BridgeDictionary';
import { QuizActiveRecall } from './components/QuizActiveRecall';
import { CuratedLibrary } from './components/CuratedLibrary';
import { AiTutor } from './components/AiTutor';
import { calculateStudyProgress } from './utils/neuroLogic';
import { STUDY_MODULES } from './data/neuroCurriculum';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('today');

  // Load completed tasks from localStorage
  const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('neuroia_completed_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Calculate total task count across all modules
  const allTasks = STUDY_MODULES.flatMap((m) => m.tasks);
  const totalTasksCount = allTasks.length;

  // Compute progress, levels, and badges
  const progress = calculateStudyProgress(completedTasks, totalTasksCount);

  // Save to localStorage when completedTasks change
  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => {
      const updated = prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId];
      try {
        localStorage.setItem('neuroia_completed_tasks', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save progress to localStorage', err);
      }
      return updated;
    });
  };

  // Support ?autostart=1 or direct tab routing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['today', 'datalab', 'track', 'lab', 'bridge', 'quiz', 'library', 'tutor'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        progressPercentage={progress.percentage}
        completedTasksCount={progress.completedCount}
        totalTasksCount={progress.totalTasksCount}
        currentLevel={progress.currentLevel}
        badge={progress.badge}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'today' && (
          <TodayMission
            completedTasks={completedTasks}
            toggleTask={toggleTask}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'datalab' && <InteractiveDataLab />}

        {activeTab === 'track' && (
          <TrackModules
            completedTasks={completedTasks}
            toggleTask={toggleTask}
          />
        )}

        {activeTab === 'lab' && <NeuronSimulator />}

        {activeTab === 'bridge' && <BridgeDictionary />}

        {activeTab === 'quiz' && <QuizActiveRecall />}

        {activeTab === 'library' && <CuratedLibrary />}

        {activeTab === 'tutor' && <AiTutor />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            NeuroIA • Projetado especificamente para estudantes de Pós-Graduação em Neurociências aplicados a IA & Análise de Dados.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Dose Diária: 15-20 min</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('today')}
              className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
            >
              Reiniciar Missão de Hoje
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
