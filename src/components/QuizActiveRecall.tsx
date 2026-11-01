/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, HelpCircle, Sparkles, Award } from 'lucide-react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/neuroCurriculum';

export const QuizActiveRecall: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [showResults, setShowResults] = useState<{ [qId: string]: boolean }>({});

  const handleSelectOption = (qId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
    setShowResults((prev) => ({ ...prev, [qId]: true }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults({});
  };

  const answeredCount = Object.keys(showResults).length;
  const correctCount = Object.entries(selectedAnswers).filter(([qId, selectedIdx]) => {
    const q = QUIZ_QUESTIONS.find((item) => item.id === qId);
    return q && q.correctIndex === selectedIdx;
  }).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Quiz Intro Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Active Recall: Consolidação Sináptica
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Desafios de Fixação Rápida (Neuro ↔ IA)
            </h2>
            <p className="text-sm text-slate-300">
              Testar o conhecimento imediatamente após a leitura ativa ativa a potenciação de longo prazo (LTP) no seu próprio cérebro!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400">Pontuação Atual</span>
              <div className="text-xl font-mono font-bold text-emerald-400">
                {correctCount} / {QUIZ_QUESTIONS.length}
              </div>
            </div>
            <button
              onClick={handleResetQuiz}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Reiniciar Desafios"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {QUIZ_QUESTIONS.map((q: QuizQuestion, index: number) => {
          const isAnswered = showResults[q.id];
          const selectedIdx = selectedAnswers[q.id];
          const isCorrect = isAnswered && selectedIdx === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-2xl border transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-rose-950/20 border-rose-500/40'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-indigo-400">Questão 0{index + 1} • Fase 0{q.module}</span>
                {isAnswered && (
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      isCorrect ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correto!
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Resposta Incorreta
                      </>
                    )}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white mb-4 leading-snug">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((option, optIdx) => {
                  const isThisSelected = selectedIdx === optIdx;
                  const isThisCorrect = q.correctIndex === optIdx;

                  let optionStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300';
                  if (isAnswered) {
                    if (isThisCorrect) {
                      optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-medium';
                    } else if (isThisSelected && !isThisCorrect) {
                      optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                    } else {
                      optionStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
                    >
                      <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <div className="flex-1">{option}</div>
                    </button>
                  );
                })}
              </div>

              {/* Pedagogical Explanation and AI connection when answered */}
              {isAnswered && (
                <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                      Explicação Didática:
                    </div>
                    <p className="leading-relaxed text-slate-300">{q.explanation}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-indigo-300">Conexão com Machine Learning:</span>{' '}
                      {q.aiConnection}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {answeredCount === QUIZ_QUESTIONS.length && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/60 to-emerald-900/60 border border-indigo-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Parabéns! Você completou os desafios de fixação!
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Você acertou {correctCount} de {QUIZ_QUESTIONS.length} questões com base sólida nos fundamentos.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetQuiz}
            className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            Refazer Teste
          </button>
        </div>
      )}
    </div>
  );
};
