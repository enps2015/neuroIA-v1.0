/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Video, Code2, Database, ExternalLink, Bookmark, CheckCircle } from 'lucide-react';
import { CURATED_RESOURCES, ResourceItem } from '../data/neuroCurriculum';

export const CuratedLibrary: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos os Recursos' },
    { id: 'livro', label: 'Livros Essenciais' },
    { id: 'video', label: 'Vídeos Curtos' },
    { id: 'python', label: 'Bibliotecas Python' },
    { id: 'dataset', label: 'Datasets Abertos' },
  ];

  const filteredResources = CURATED_RESOURCES.filter(
    (item) => filterCategory === 'all' || item.category === filterCategory
  );

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'livro':
        return BookOpen;
      case 'video':
        return Video;
      case 'python':
        return Code2;
      case 'dataset':
      default:
        return Database;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <Bookmark className="w-3.5 h-3.5" />
          Curadoria Enxuta & Não Intimidante
        </div>
        <h2 className="text-2xl font-bold text-white">
          Fontes Certeiras para Quem Faz Pós com Foco em Dados & IA
        </h2>
        <p className="text-sm text-slate-300">
          Você não precisa ler tratados médicos de 1.200 páginas de capa a capa. Aqui está o filtro inteligente: exatamente quais capítulos ler e quais ferramentas Python instalar hoje.
        </p>

        {/* Filter pills */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === c.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((res: ResourceItem) => {
          const Icon = getCategoryIcon(res.category);
          return (
            <div
              key={res.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {res.badge}
                  </span>
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{res.title}</h3>
                  <span className="text-xs text-slate-400">{res.authorOrSource}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {res.description}
                </p>

                {/* Direct recommendation highlighted */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Como usar sem se sobrecarregar:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {res.directRecommendation}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <a
                  href={res.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  <span>{res.linkText}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[11px] text-slate-500 capitalize">{res.category}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
