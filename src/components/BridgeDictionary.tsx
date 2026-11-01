/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Zap, Code, Database, Brain, Sparkles, Filter } from 'lucide-react';
import { BRIDGE_DICTIONARY } from '../data/neuroCurriculum';
import { filterDictionary, ConceptItem } from '../utils/neuroLogic';

export const BridgeDictionary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Todos os Termos' },
    { id: 'celular', label: 'Célula & Membrana' },
    { id: 'sinapse', label: 'Sinapse & Neuroquímica' },
    { id: 'circuitos', label: 'Circuitos & Redes' },
    { id: 'sistemas', label: 'Macrossistemas' },
    { id: 'dados', label: 'Dados (EEG & fMRI)' },
  ];

  const filteredItems = filterDictionary(
    BRIDGE_DICTIONARY,
    searchQuery,
    selectedCategory
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Search */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Dicionário Bidirecional Interativo
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Ponte Conceitual: Neurobiologia ↔ Inteligência Artificial
            </h2>
            <p className="text-sm text-slate-300">
              Traduza instantaneamente o jargão biológico da sua pós para a matemática, arquitetura e análise de dados que você já entende.
            </p>
          </div>
        </div>

        {/* Search bar & Category filters */}
        <div className="space-y-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por termo biológico, conceito de IA, ou fórmula (ex: EEG, Hebb, Dopamina, ReLU, MNE)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filtrar:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dictionary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item: ConceptItem) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-sm flex flex-col justify-between"
          >
            {/* Term Title & Tag */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                  {item.tag}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  {item.category}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-emerald-400 font-bold text-base sm:text-lg">
                  {item.neuroTerm}
                </span>
                <span className="text-slate-500 text-xs">↔</span>
                <span className="text-indigo-400 font-bold text-base sm:text-lg">
                  {item.aiTerm}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium">
                {item.shortSummary}
              </p>
            </div>

            {/* Neuro vs AI Side-by-side Explanations */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" />
                  Mecanismo Biológico:
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {item.neurobiologyExplanation}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="text-indigo-400 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Equivalente em IA & Algoritmos:
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {item.aiAnalogy}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  Aplicação Prática em Análise de Dados:
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {item.practicalDataApplication}
                </p>
              </div>

              {/* Code snippet or formula if available */}
              {item.pythonOrFormulaExample && (
                <div className="p-2.5 rounded-lg bg-black border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto flex items-center gap-2">
                  <Code className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <code>{item.pythonOrFormulaExample}</code>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-slate-400 text-sm">
            Nenhum conceito encontrado para a busca "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-slate-800 text-xs text-white hover:bg-slate-700 cursor-pointer"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
};
