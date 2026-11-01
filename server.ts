/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route for AI Tutor
app.post('/api/tutor', async (req, res) => {
  const { question, contextModule } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Pergunta inválida' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isRealKey = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 15;

  if (isRealKey) {
    try {
      const ai = new GoogleGenAI();
      const systemInstruction = `Você é um renomado professor e mentor em Neurociência Computacional e Neurobiologia Aplicada à Inteligência Artificial e Ciência de Dados.
Seu aluno está fazendo uma pós-graduação em Neurociências e Comportamento com o objetivo de aprimorar suas análises de dados e modelos de IA/ML.
Ele tem um perfil analítico e precisa compreender a base biológica profunda de forma descomplicada, sem se afogar em jargões puramente anatômicos.

Diretrizes da sua resposta:
1. Responda em Português Brasileiro claro, didático, rigoroso e acolhedor.
2. Sempre faça a ponte entre o mecanismo biológico (ex: íons, receptores, fenda sináptica, oscilações) e a analogia/equivalente em Ciência de Dados, IA ou Computação (ex: funções de ativação, regularização, SGD, RL, FFT, filtros convolucionais).
3. Seja conciso: use seções curtas, tópicos com marcadores e formule um "Ponto Chave para a sua Pós".
4. Se o aluno pedir conselho de estudo, dê uma micro-tarefa prática de 10 a 15 minutos que ele possa executar hoje mesmo.`;

      const prompt = `Contexto do Módulo: ${contextModule ? `Módulo ${contextModule}` : 'Geral (Fundamentos de Neurobiologia)'}
Dúvida do Aluno: "${question}"`;

      // 4-second timeout race so client never hangs
      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\n${prompt}` }] },
        ],
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout de consulta Gemini')), 2500)
      );

      const response = await Promise.race([geminiPromise, timeoutPromise]);
      const replyText = response.text || 'Não foi possível gerar a resposta no momento.';
      return res.json({ answer: replyText, source: 'gemini' });
    } catch (err: any) {
      console.warn('Gemini API fallback acionado:', err?.message || err);
      // Fallback seamlessly to local intelligent response below
    }
  }

  // Fallback intelligent responses when GEMINI_API_KEY is not available
  const qLower = question.toLowerCase();
  let fallbackAnswer = '';

  if (qLower.includes('eeg') || qLower.includes('eletroencefalo') || qLower.includes('frequência') || qLower.includes('onda')) {
    fallbackAnswer = `### Análise de Sinais de EEG para Ciência de Dados e IA

**1. O que é biologicamente:**
O sinal de EEG captado no couro cabeludo NÃO é o disparo elétrico de um único neurônio (o potencial de ação dura ~1ms e é fraco demais). Ele é a **soma espacial e temporal dos potenciais pós-sinápticos (EPSPs e IPSPs)** de centenas de milhares de neurônios piramidais orientados perpendicularmente à superfície cortical.

**2. A Ponte com Análise de Dados:**
- **Resolução Temporal:** Altíssima (~1 milissegundo), excelente para rastrear dinâmicas rápidas de tomada de decisão.
- **Resolução Espacial:** Baixa (o crânio age como um filtro passa-baixa espacial difuso).
- **Processamento de Sinais Chave:**
  - **Filtros Passa-Faixa:** Habitualmente 0.5 a 45 Hz (elimina ruído de rede de 60Hz e drift térmico).
  - **ICA (Independent Component Analysis):** Fundamental para isolar artefatos de piscar de olhos (EOG) e eletromiografia muscular (EMG) sem descartar os ensaios.
  - **Extração de Features:** Transformada Rápida de Fourier (FFT), Espectrogramas Wavelet e conectividade de fase (Phase Locking Value - PLV).

**3. Dica Prática para a Pós:**
Comece hoje explorando a biblioteca **MNE-Python** (\`import mne\`). Ela é o padrão da indústria e carrega dados brutos em poucos comandos.`;
  } else if (qLower.includes('hebb') || qLower.includes('nmda') || qLower.includes('plasticidade') || qLower.includes('peso')) {
    fallbackAnswer = `### Plasticidade Sináptica, Regra de Hebb e Backpropagation

**1. O Princípio Biológico:**
Donald Hebb propôs em 1949: *"Quando o axônio da célula A excita repetidamente a célula B, algum processo metabólico fortalece a eficiência de A sobre B."*
Em termos moleculares, o protagonista é o **receptor NMDA**: ele é bloqueado por Magnésio (Mg2+) em repouso. Ele só deixa o Cálcio (Ca2+) entrar e ativar as enzimas de fortalecimento (LTP) se houver:
- Glutamato liberado pelo axônio pré-sináptico, **E**
- Despolarização da membrana pós-sináptica.
Ou seja: uma autêntica porta lógica AND molecular!

**2. A Ponte com IA e Redes Neurais:**
- **Diferença crucial:** O cérebro faz aprendizado com **regras puramente locais** (STDP - Spike-Timing-Dependent Plasticity), onde o peso $w_{ij}$ se altera apenas com informações presentes na sinapse entre $i$ e $j$.
- **Backpropagation:** O backprop em PyTorch exige conhecimento global de erro propagado pela transposta da matriz de pesos, algo biofisicamente improvável (o chamado "Weight Transport Problem").
- **Áreas de ponta:** Neuromorphic Computing e Spiking Neural Networks (SNNs) usam regras hebbianas locais para treinar modelos com baixíssimo consumo de energia.`;
  } else if (qLower.includes('dopamina') || qLower.includes('reforço') || qLower.includes('rl') || qLower.includes('recompensa')) {
    fallbackAnswer = `### Dopamina e Aprendizado por Reforço (Reinforcement Learning)

**1. O que a biologia realmente faz:**
Diferente do mito popular de que dopamina é o "hormônio do prazer", neurônios dopaminérgicos da Área Tegmentar Ventral (VTA) e da Substância Negra disparam para **Erro de Predição de Recompensa (Reward Prediction Error)**.
- Se você espera uma recompensa e a recebe: disparo basal constante (sem surpresa).
- Se a recompensa é **inesperada ou maior**: explosão fásica de dopamina (valor positivo).
- Se a recompensa esperada **não vem**: queda abrupta na taxa de disparo basal (valor negativo).

**2. A Ponte com IA:**
Essa é a equação exata do **Temporal Difference Error (TD-Error)** de Sutton & Barto (1988):
$$\\delta_t = R_{t+1} + \\gamma V(S_{t+1}) - V(S_t)$$
A dopamina fornece exatamente o termo $\\delta_t$ que pondera a atualização da função de valor do estado no Q-Learning!

**3. Para a sua pós:**
Entender essa ponte permitirá que você analise dados comportamentais de tempo de reação e escolhas de risco modelando o sujeito experimental como um agente de RL com parâmetros de $\\alpha$ (taxa de aprendizado) e $\\beta$ (temperatura de exploração).`;
  } else {
    fallbackAnswer = `### Como Estruturar Seus Estudos de Neurobiologia para Dados & IA

**1. Foco Seletivo:**
A neurociência possui centenas de anos de descrições anatômicas. Como seu objetivo são dados e IA, filtre seu foco em:
- **Computação Celular:** Como o neurônio integra sinais (Soma) e dispara não-linearmente (Potencial de Ação).
- **Conectividade:** Excitação (Glutamato) vs Inibição (GABA) e plasticidade (LTP/Hebb).
- **Macroarquiteturas:** Hipocampo (memória/replay) e Córtex Pré-Frontal (memória de trabalho/atenção).

**2. Seu Passo Prático para Hoje:**
Reserve **15 minutos** para:
1. Abrir a aba **"Laboratório & Simulador"** deste app e observar o disparo do potencial de ação ao atingir -55mV.
2. Ler a seção de **Glutamato vs GABA** no Dicionário Ponte.
3. Fazer o mini-quiz do Módulo 1 para testar o active recall.

*Você já possui o raciocínio analítico e computacional; a neurobiologia será apenas uma nova camada de abstração em cima das estruturas de dados que você já domina!*`;
  }

  return res.json({ answer: fallbackAnswer, source: 'local_curated' });
});

// Serve frontend in dev or prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
