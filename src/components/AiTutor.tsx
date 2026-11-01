/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Loader2, Lightbulb, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: 'gemini' | 'local_curated';
}

export const AiTutor: React.FC = () => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Olá! Sou seu Mentor em **Neurobiologia Computacional e Análise de Dados**. 
Estou aqui para traduzir conceitos biológicos densos em analogias com **IA, Machine Learning, Python e Processamento de Sinais**.

Qual conceito da sua pós ou do seu estudo de hoje você gostaria de desmistificar?`,
      source: 'local_curated',
    },
  ]);

  const suggestedPrompts = [
    'Qual a diferença entre a bioeletricidade de membrana e os sinais de EEG captados no couro cabeludo?',
    'Explique o receptor NMDA com uma analogia com a porta lógica AND em programação.',
    'Como a dopamina biológica se relaciona com o TD-Error no Reinforcement Learning?',
    'Quais artefatos são mais comuns ao tratar dados brutos de EEG com Python?',
    'Estou me sentindo ansioso com os nomes anatômicos da pós. O que priorizar hoje?',
  ];

  const handleSend = async (questionToSend?: string) => {
    const text = questionToSend || inputQuestion;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });

      if (!res.ok) {
        throw new Error('Falha ao obter resposta do mentor');
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer || 'Sem resposta disponível.',
          source: data.source,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Desculpe, ocorreu uma instabilidade na consulta. Lembre-se: em caso de dúvida sobre um conceito, a aba "Ponte Neuro ↔ IA" contém resumos imediatos de todos os termos-chave!',
          source: 'local_curated',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mentor Intro */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Mentor Especialista Dedicado
        </div>
        <h2 className="text-2xl font-bold text-white">
          Tire Dúvidas da Pós com o Mentor Neuro-IA
        </h2>
        <p className="text-sm text-slate-300">
          Pergunte sobre qualquer tópico das aulas, metodologias de análise de dados (EEG, ERP, fMRI, spike sorting) ou peça analogias diretas com Machine Learning e Python.
        </p>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="space-y-2">
        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Perguntas Frequentes de Alunos de Dados em Pós de Neurociências:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className="text-left text-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Area */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg flex flex-col h-[520px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.content}
                {msg.source === 'gemini' && (
                  <div className="mt-2 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Resposta via Gemini 3.8 Flash
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>O Mentor está sintetizando a analogia neuro-computacional...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua dúvida de neurobiologia ou análise de dados..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuestion.trim() || isLoading}
            className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shadow-indigo-600/20"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
