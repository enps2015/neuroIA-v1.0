/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConceptItem, StudyTask } from '../utils/neuroLogic';

export interface ModuleInfo {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  icon: string;
  color: string;
  description: string;
  whyItMattersForAI: string;
  coreConcepts: string[];
  tasks: StudyTask[];
}

export interface QuizQuestion {
  id: string;
  module: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  aiConnection: string;
}

export interface ResourceItem {
  id: string;
  category: 'livro' | 'video' | 'python' | 'dataset' | 'artigo';
  title: string;
  authorOrSource: string;
  description: string;
  directRecommendation: string; // e.g. "Leia apenas o Capítulo 3 e 4 primeiro"
  badge: string;
  linkText: string;
  linkUrl: string;
}

export const TODAY_MICRO_STEPS = [
  {
    step: 1,
    time: '6 minutos',
    title: 'A Desmistificação: O Neurônio Biológico é uma Função Ponderada',
    summary: 'Entenda a anatomia básica através do que você já sabe de Machine Learning.',
    points: [
      'Dendritos = Vetor de Entradas (x₁, x₂, ..., xₙ). Recebem sinais de outros neurônios.',
      'Sinapses = Pesos Sinápticos (w₁, w₂, ..., wₙ). O Glutamato age como peso positivo (excitatório); o GABA como peso inibitório negativo.',
      'Soma (Corpo Celular) = O Somatório Ponderado ∑(wᵢ · xᵢ). Aqui os potenciais se acumulam.',
      'Cone Axonal = O Limiar de Ativação / Bias (-55 mV). Se a soma ultrapassar esse valor, dispara um Potencial de Ação!',
      'Axônio = A Saída do Sinal (Saída do nó). Transmite a informação para a próxima camada.',
    ],
    reflection: 'Você já pensa em termos de álgebra linear e computação; na neurobiologia, basta associar os nomes biológicos aos nós da sua rede.',
  },
  {
    step: 2,
    time: '8 minutos',
    title: 'O Experimento Prático do Limiar (-70mV para -55mV)',
    summary: 'Abra o simulador e observe o princípio do Tudo-ou-Nada na prática.',
    points: [
      'Em repouso, a membrana do neurônio está em -70 milivolts (graças aos íons de Sódio Na+ fora e Potássio K+ dentro).',
      'Quando receptores se abrem, íons positivos entram: isso é a DESPOLARIZAÇÃO.',
      'Se o potencial atingir -55 mV (limiar de disparo), canais de sódio abrem em cascata: o neurônio dispara até +30 mV!',
      'Isso é o princípio do "TUDO OU NADA": não existe meio potencial de ação (assim como uma função de ativação degrau Heaviside ou Spiking Neuron).',
    ],
    reflection: 'Em dados de EEG ou Spike Sorting, o que você detecta são exatamente essas oscilações e disparos maciços.',
  },
  {
    step: 3,
    time: '6 minutos',
    title: 'A Regra de Ouro da Pós-Graduação para Cientistas de Dados',
    summary: 'A blindagem contra a sobrecarga de termos em latim e anatomia descritiva.',
    points: [
      '1. NÃO tente memorizar todos os nomes anatômicos no primeiro dia. Neuroanatomia é vasta demais.',
      '2. Sempre faça as 3 perguntas de ouro: (a) Qual informação entra aqui? (b) Que computação biológica ocorre? (c) Qual o correlato disso em IA / Dados?',
      '3. Reserve de 15 a 25 minutos diários. Consistência sináptica (Plasticidade Hebbiana) funciona por repetição diária espaçada, não por maratonas exaustivas.',
    ],
    reflection: 'Seu cérebro aprende como um modelo treinado com taxa de aprendizado moderada e múltiplas épocas pequenas!',
  },
];

export const STUDY_MODULES: ModuleInfo[] = [
  {
    id: 1,
    title: 'Módulo 1: Bioeletricidade & A Célula Neural',
    subtitle: 'Do Potencial de Repouso (-70mV) ao Potencial de Ação (+30mV)',
    duration: '1ª e 2ª Semana (15 min/dia)',
    difficulty: 'Iniciante',
    icon: 'Zap',
    color: 'emerald',
    description: 'Compreenda a física e a química fundamental do neurônio: gradientes iônicos, canais de membrana, despolarização e o disparo elétrico.',
    whyItMattersForAI: 'Base direta para Spiking Neural Networks (SNNs), funções de ativação com limiar e processamento de séries temporais de EEG/eletrofisiologia.',
    coreConcepts: [
      'Potencial de Membrana em Repouso (-70mV)',
      'Gradiente eletroquímico e Bomba Na+/K+ ATPase',
      'Potencial de Ação (Despolarização, Pico, Repolarização)',
      'Período Refratário Absoluto e Relativo (limite de taxa de disparo)',
      'Bainha de Mielina e Condução Saltatória',
    ],
    tasks: [
      {
        id: 'task-1-1',
        module: 1,
        title: 'Compreender o Potencial de Repouso (-70mV)',
        estimatedMinutes: 15,
        description: 'Descubra por que a célula viva mantém uma carga interna negativa em relação ao exterior através dos íons Na+ e K+.',
        quickTakeaway: 'O neurônio é como uma bateria recarregada pronta para descarregar um pulso de informação binária.',
        aiLink: 'Equivalente ao baseline de voltagem ou bias negativo que mantém um nó inativo até receber sinal suficiente.',
        actionItem: 'Identifique no simulador o valor de repouso e a diferença de 15mV necessária para atingir o limiar.',
        isTodayStarter: true,
      },
      {
        id: 'task-1-2',
        module: 1,
        title: 'O Disparo Tudo-ou-Nada e o Limiar (-55mV)',
        estimatedMinutes: 15,
        description: 'Veja como a abertura em cascata dos canais de Na+ controlados por voltagem gera o pico do potencial de ação.',
        quickTakeaway: 'Não importa a intensidade do estímulo: ultrapassou -55mV, o pico vai até ~+30mV com a mesma amplitude.',
        aiLink: 'Inspiração histórica para o perceptron de McCulloch & Pitts e a função degrau unitário (Heaviside).',
        actionItem: 'No simulador, adicione estímulos graduais até encontrar o ponto exato de transição de fase.',
      },
      {
        id: 'task-1-3',
        module: 1,
        title: 'Período Refratário & Frequência de Disparo',
        estimatedMinutes: 20,
        description: 'Por que um neurônio não dispara infinitas vezes por segundo? Entenda a inativação dos canais de sódio.',
        quickTakeaway: 'A informação no cérebro é codificada pela taxa de disparo (Frequência em Hz), não pela altura do pico.',
        aiLink: 'Rate Coding vs Temporal Coding em Spiking Neural Networks (SNNs) e filtragem de ruído de alta frequência.',
        actionItem: 'Anote a analogia: taxa de disparo = ativação contínua (como valor contínuo de uma ReLU).',
      },
    ],
  },
  {
    id: 2,
    title: 'Módulo 2: A Sinapse & Neurotransmissores',
    subtitle: 'A fenda sináptica, pesos excitatórios e inibitórios, e neuromodulação',
    duration: '3ª e 4ª Semana (20 min/dia)',
    difficulty: 'Iniciante',
    icon: 'Radio',
    color: 'blue',
    description: 'Descubra como os neurônios conversam através da liberação química de vesículas e como moléculas moldam o processamento computacional.',
    whyItMattersForAI: 'Dopamina é a base biológica do Reinforcement Learning; Glutamato e GABA são os pesos positivos e inibitórios que equilibram redes neurais.',
    coreConcepts: [
      'Fenda Sináptica e Fusão de Vesículas por Cálcio (Ca2+)',
      'Glutamato: O principal neurotransmissor excitatório (EPSP)',
      'GABA: O principal neurotransmissor inibitório (IPSP)',
      'Dopamina e Reward Prediction Error (Erro de Predição Temporal)',
      'Serotonina e Noradrenalina (Controle de ruído e temperatura de exploração)',
    ],
    tasks: [
      {
        id: 'task-2-1',
        module: 2,
        title: 'Glutamato vs GABA: O Balanço Excitatório/Inibitório (E/I)',
        estimatedMinutes: 20,
        description: 'Entenda como o cérebro evita sobrecarga epiléptica mantendo neurônios inibitórios GABAérgicos ativos.',
        quickTakeaway: 'Sem inibição, uma rede neural entra em colapso por saturação de ativação (exploding gradients).',
        aiLink: 'Batch Normalization, Dropout e pesos negativos em redes convolucionais e transformadores.',
        actionItem: 'Teste no simulador ativar um input inibitório GABA junto com Glutamato e veja o cancelamento do sinal.',
      },
      {
        id: 'task-2-2',
        module: 2,
        title: 'Dopamina: O Sinal de Aprendizado por Reforço Biológico',
        estimatedMinutes: 25,
        description: 'Desmistifique o mito da dopamina como "química do prazer": na verdade, ela codifica surpresa e erro de predição!',
        quickTakeaway: 'Dopamina = Recompensa Real - Recompensa Esperada (Temporal Difference Error, TD-Error).',
        aiLink: 'A fundação matemática do Q-Learning e algoritmos de Policy Gradient desenvolvidos por Sutton & Barto e DeepMind.',
        actionItem: 'Revise o conceito de TD-Error no Dicionário Ponte e guarde essa equação para a pós.',
      },
      {
        id: 'task-2-3',
        module: 2,
        title: 'Neuromodulação Global vs Conexões Locais',
        estimatedMinutes: 15,
        description: 'Enquanto a sinapse é como um cabo de rede ponto a ponto, neuromoduladores funcionam como Wi-Fi que altera o estado do cérebro inteiro.',
        quickTakeaway: 'A noradrenalina ajusta o estado de alerta; a acetilcolina sinaliza necessidade de plasticidade imediata.',
        aiLink: 'Hiperparâmetros globais em IA: Learning Rate decay, Temperatura no sampling de LLMs, Momentum.',
        actionItem: 'Visualize a diferença entre "peso local w_ij" e "hiperparâmetro global η".',
      },
    ],
  },
  {
    id: 3,
    title: 'Módulo 3: Circuitos, Plasticidade & Conectoma',
    subtitle: 'Como neurônios aprendem: Regra de Hebb, LTP e organização laminar',
    duration: '5ª e 6ª Semana (20 min/dia)',
    difficulty: 'Intermediário',
    icon: 'Network',
    color: 'purple',
    description: 'Passe do nível de um único neurônio para circuitos neurais: a Regra de Hebb, receptores NMDA como portas lógicas AND e o córtex cerebral.',
    whyItMattersForAI: 'Inspiração direta das Convolutional Neural Networks (Hubel & Wiesel no córtex visual) e algoritmos de aprendizado não supervisionado / auto-associativo.',
    coreConcepts: [
      'Regra de Hebb (1949): Disparo coincidente fortalece a sinapse',
      'Potenciação de Longo Prazo (LTP) e Depressão de Longo Prazo (LTD)',
      'Receptor NMDA: Sensor molecular de coincidência',
      'Córtex Visual Primário (V1) e Filtros de Gabor',
      'Camadas Corticais I a VI: Feedforward e Feedback',
    ],
    tasks: [
      {
        id: 'task-3-1',
        module: 3,
        title: 'A Regra de Hebb e o Receptor NMDA',
        estimatedMinutes: 20,
        description: 'Por que o receptor NMDA só abre se houver despolarização prévia que expulse o magnésio (Mg2+) da sua fenda?',
        quickTakeaway: 'O receptor NMDA é uma porta lógica AND biológica: exige pré-sinapse ativa E pós-sinapse despolarizada.',
        aiLink: 'A atualização hebbiana Δw = η · x · y, precursora do aprendizado de representações em redes de Hopfield.',
        actionItem: 'Anote a frase clássica de Donald Hebb: "Neurons that fire together, wire together".',
      },
      {
        id: 'task-3-2',
        module: 3,
        title: 'O Córtex Visual V1 e o Nascimento das CNNs',
        estimatedMinutes: 25,
        description: 'Conheça o experimento histórico de Hubel e Wiesel (1959) com campos receptivos orientados a bordas e linhas.',
        quickTakeaway: 'O cérebro decompõe imagens em bordas simples antes de reconhecer objetos complexos no córtex inferotemporal.',
        aiLink: 'O Neocognitron de Fukushima e as CNNs modernas (Yann LeCun, AlexNet): kernels convolucionais aprendendo filtros de Gabor!',
        actionItem: 'Verifique no módulo visual como o campo receptivo biológico mapeia para uma matriz de kernel 3x3.',
      },
      {
        id: 'task-3-3',
        module: 3,
        title: 'Conectoma e Teoria dos Grafos em Neurociência',
        estimatedMinutes: 20,
        description: 'Como dados de ressonância com tensor de difusão (DTI) constroem grafos da fiação cerebral.',
        quickTakeaway: 'O cérebro exibe topologia de "Mundo Pequeno" (Small-World): alto agrupamento local com atalhos de longo alcance eficientes.',
        aiLink: 'Graph Neural Networks (GNNs), análise de centralidade e matrizes de adjacência aplicadas a fMRI funcional.',
        actionItem: 'Identifique os conceitos de hubs cerebrais e sua semelhança com nós centrais em redes complexas de dados.',
      },
    ],
  },
  {
    id: 4,
    title: 'Módulo 4: Macrossistemas & Métodos de Dados',
    subtitle: 'Hipocampo, Córtex Pré-Frontal, EEG e fMRI em Data Science',
    duration: '7ª e 8ª Semana (25 min/dia)',
    difficulty: 'Avançado',
    icon: 'Brain',
    color: 'amber',
    description: 'Compreenda as grandes estruturas de comportamento (tomada de decisão, memória episódica, emoção) e os sinais reais que você analisará na pós.',
    whyItMattersForAI: 'Essencial para lidar com dados de EEG (Fourier, Wavelets, PSD, ICA) e fMRI (BOLD, pré-processamento, GLM) em pesquisas acadêmicas.',
    coreConcepts: [
      'Hipocampo: Consolidação de Memória e Replay (Replay Buffer em DQN)',
      'Córtex Pré-Frontal: Funções executivas e Memória de Trabalho',
      'Amígdala e Sistema Límbico: Valência emocional e relevância de estímulos',
      'Sinais de EEG: Ritmos cerebrais (Delta, Teta, Alfa, Beta, Gama) e ERPs',
      'Sinal BOLD do fMRI e hemodinâmica',
    ],
    tasks: [
      {
        id: 'task-4-1',
        module: 4,
        title: 'Hipocampo vs Córtex: Aprendizado Rápido vs Lento',
        estimatedMinutes: 25,
        description: 'Entenda a Teoria dos Sistemas de Aprendizado Complementares (McClelland): por que o cérebro tem dois sistemas de memória?',
        quickTakeaway: 'O hipocampo grava memórias de relance (one-shot); à noite, o replay transfere esse conhecimento lentamente ao córtex para não apagar o passado.',
        aiLink: 'Solução biológica para o Esquecimento Catastrófico (Catastrophic Forgetting) em redes neurais e inspiração para Replay Buffers e RAGs.',
        actionItem: 'Relacione o hipocampo ao conceito de Vector Store de curto prazo na arquitetura de IA.',
      },
      {
        id: 'task-4-2',
        module: 4,
        title: 'EEG na Prática: Frequências e Potenciais Relacionados a Eventos (ERP)',
        estimatedMinutes: 25,
        description: 'Como o somatório de milhares de neurônios piramidais gera as ondas captadas por eletrodos no couro cabeludo.',
        quickTakeaway: 'Alta resolução temporal (milissegundos), mas baixa resolução espacial. Ruído de piscar de olhos e batimentos musculares são desafios chave de dados.',
        aiLink: 'Processamento de séries temporais: Transformada Rápida de Fourier (FFT), Espectrogramas, Decomposição em Componentes Independentes (ICA) e Wavelets.',
        actionItem: 'Explore a biblioteca MNE-Python na seção de recursos para rodar seu primeiro pipeline de EEG.',
      },
      {
        id: 'task-4-3',
        module: 4,
        title: 'fMRI e o Sinal BOLD: Da Oxigenação aos Mapas Estatísticos',
        estimatedMinutes: 25,
        description: 'Entenda o sinal dependente do nível de oxigênio no sangue (Blood-Oxygen-Level-Dependent) e o Modelo Linear Geral (GLM).',
        quickTakeaway: 'Alta resolução espacial (milímetros), mas resposta hemodinâmica lenta (atraso de 4 a 6 segundos).',
        aiLink: 'Visão computacional 3D, voxel-wise regression, redução de dimensionalidade (PCA/t-SNE) e classificação com SVMs e Deep Learning.',
        actionItem: 'Acesse o OpenNeuro na seção de bibliotecas e veja como datasets abertos de fMRI estão estruturados.',
      },
    ],
  },
];

export const BRIDGE_DICTIONARY: ConceptItem[] = [
  {
    id: 'neuron-perceptron',
    category: 'celular',
    neuroTerm: 'Neurônio Piramidal / Biológico',
    aiTerm: 'Perceptron / Unidade Artificial',
    shortSummary: 'Unidade fundamental de processamento de informação.',
    neurobiologyExplanation: 'Célula especializada com árvore dendrítica para recepção, soma para integração eletroquímica e axônio mielinizado para emissão de potenciais de ação.',
    aiAnalogy: 'O nó básico de uma rede neural artificial: computa a soma ponderada das entradas somada ao bias z = ∑(w·x) + b e aplica uma função não-linear.',
    practicalDataApplication: 'Em modelos biofísicos de Spiking Neural Networks (SNNs), simula-se a dinâmica da membrana usando equações diferenciais como Hodgkin-Huxley ou Leaky Integrate-and-Fire (LIF).',
    pythonOrFormulaExample: 'V[t+1] = V[t] + (-(V[t] - V_rest) + R*I[t]) / tau_m',
    tag: 'Fundamental',
  },
  {
    id: 'synapse-weight',
    category: 'sinapse',
    neuroTerm: 'Força Sináptica (Plasticidade)',
    aiTerm: 'Peso Sináptico (Weight - w)',
    shortSummary: 'A intensidade da conexão comunicativa entre dois nós.',
    neurobiologyExplanation: 'Determinada pelo número de vesículas liberadas pré-sinapticamente e pela densidade de receptores pós-sinápticos (AMPA/NMDA) na espinha dendrítica.',
    aiAnalogy: 'O parâmetro escalar multiplicativo w_ij que pondera a transmissão do valor do neurônio i para o neurônio j. O aprendizado da rede consiste em ajustar esses pesos.',
    practicalDataApplication: 'Na pós-graduação, matrizes de pesos aparecem em análises de conectividade funcional (ex: matriz de correlação de Pearson entre canais de EEG ou ROIs de fMRI).',
    pythonOrFormulaExample: 'fc_matrix = np.corrcoef(eeg_channels_data)',
    tag: 'Álgebra Linear',
  },
  {
    id: 'action-potential-activation',
    category: 'celular',
    neuroTerm: 'Potencial de Ação & Limiar (-55mV)',
    aiTerm: 'Função de Ativação / Threshold',
    shortSummary: 'Decisão não-linear de disparar ou não a informação adiante.',
    neurobiologyExplanation: 'Abertura rápida e coordenada de canais iônicos de Na+ que inverte a polaridade da célula quando a despolarização atinge o limiar crítico (-55mV).',
    aiAnalogy: 'A não-linearidade essencial em Deep Learning (como ReLU, Sigmoid ou Heaviside). Sem isso, qualquer rede profunda de 100 camadas se reduziria a uma única regressão linear.',
    practicalDataApplication: 'Detecção de espículas (Spike Sorting) em eletrofisiologia com microeletrodos: identificar momentos exatos em que a voltagem ultrapassa 4 ou 5 desvios padrões do ruído basal.',
    pythonOrFormulaExample: 'spike_indices = np.where(voltage > threshold_mv)[0]',
    tag: 'Não-linearidade',
  },
  {
    id: 'gaba-glutamate-ei',
    category: 'sinapse',
    neuroTerm: 'Glutamato (+) e GABA (-)',
    aiTerm: 'Pesos Positivos vs Inibitórios / Dropout',
    shortSummary: 'O balanço entre excitação e inibição para manter a rede estável.',
    neurobiologyExplanation: 'Glutamato despolariza a membrana (abre canais de Na+/Ca2+), enquanto GABA hiperpolariza (abre canais de Cloreto Cl-), funcionando como um potente freio celular.',
    aiAnalogy: 'Pesos positivos aumentam a ativação; pesos negativos ou mecanismos como Dropout e Batch Normalization impedem que os nós saturem ou causem explosão de gradientes.',
    practicalDataApplication: 'Desbalanços na razão E/I (excitação/inibição) são biomarcadores de epilepsia, TEA (espectro autista) e esquizofrenia detectados via densidade de potência espectral de EEG.',
    pythonOrFormulaExample: 'ei_ratio = spectral_power_gamma / spectral_power_alpha',
    tag: 'Neuroquímica',
  },
  {
    id: 'hebbian-learning-backprop',
    category: 'circuitos',
    neuroTerm: 'Plasticidade Hebbiana & LTP',
    aiTerm: 'Otimização / Atualização de Pesos',
    shortSummary: 'Mecanismo fundamental pelo qual experiências alteram conexões.',
    neurobiologyExplanation: 'Neurônios que disparam conjuntamente fortalecem suas sinapses mútuas (LTP - Long-Term Potentiation), enquanto descompassos temporais causam enfraquecimento (LTD).',
    aiAnalogy: 'Em IA, a analogia direta é o aprendizado associativo e o Backpropagation com Gradient Descent, embora a biologia use regras locais (como STDP) em vez de derivar uma loss global.',
    practicalDataApplication: 'Modelagem de memórias auto-associativas (Hopfield Networks) e redes de pesos plásticos locais em neuromorphic computing.',
    pythonOrFormulaExample: 'delta_w = learning_rate * pre_activity * post_activity',
    tag: 'Aprendizado',
  },
  {
    id: 'dopamine-rl',
    category: 'sinapse',
    neuroTerm: 'Dopamina no VTA / Estriado',
    aiTerm: 'Reward Prediction Error (TD-Error em RL)',
    shortSummary: 'O sinal químico de erro de predição de recompensa.',
    neurobiologyExplanation: 'Neurônios dopaminérgicos da área tegmental ventral não disparam quando a recompensa é recebida conforme esperado; disparam quando a recompensa é MELHOR do que o previsto (surpresa positiva) e silenciam quando é pior.',
    aiAnalogy: 'A equação exata do Temporal Difference Error: δ_t = R_t+1 + γ·V(S_t+1) - V(S_t). Sutton & Barto e Wolfram Schultz demonstraram nos anos 90 que a dopamina calcula literalmente esse δ.',
    practicalDataApplication: 'Treinamento de agentes em Reinforcement Learning (RLHF em LLMs, robótica e jogos) e análise de tomada de decisão comportamental em dados de neuroeconomia.',
    pythonOrFormulaExample: 'td_error = reward + gamma * next_state_value - current_state_value',
    tag: 'Reinforcement Learning',
  },
  {
    id: 'hubel-wiesel-cnn',
    category: 'circuitos',
    neuroTerm: 'Córtex Visual Primário (V1)',
    aiTerm: 'Camadas Convolucionais (CNNs)',
    shortSummary: 'Hierarquia de processamento espacial de características visuais.',
    neurobiologyExplanation: 'Células simples em V1 respondem a bordas orientadas em ângulos específicos; células complexas integram múltiplos sinais com invariância à posição.',
    aiAnalogy: 'A inspiração direta para arquiteturas convolucionais: a primeira camada de uma ResNet ou ConvNet aprende espontaneamente filtros de Gabor (orientação de bordas e frequências espaciais).',
    practicalDataApplication: 'Decodificação neural visual: prever qual imagem um participante está olhando a partir dos padrões de ativação dos voxels de V1 medidos por fMRI.',
    pythonOrFormulaExample: 'clf = RidgeCV().fit(X_fmri_voxels, y_image_features)',
    tag: 'Visão Computacional',
  },
  {
    id: 'hippocampus-memory-replay',
    category: 'sistemas',
    neuroTerm: 'Hipocampo & Replay Noturno',
    aiTerm: 'Replay Buffer (DQN) & Vector Store (RAG)',
    shortSummary: 'Armazenamento rápido de experiências para consolidação lenta.',
    neurobiologyExplanation: 'O hipocampo indexa memórias episódicas de alta dimensionalidade em um único disparo; durante o sono de ondas lentas, "reproduz" (replay) em alta velocidade esses disparos para o córtex.',
    aiAnalogy: 'O Experience Replay Buffer em Deep Q-Networks (DQN) evita o esquecimento catastrófico permitindo que o modelo treine com amostras aleatórias de episódios passados.',
    practicalDataApplication: 'Análise de Sharp-Wave Ripples (SWRs) em gravações eletrofisiológicas de roedores para decodificar replay espacial de trajetórias em labirintos.',
    pythonOrFormulaExample: 'replay_buffer.sample(batch_size=64)',
    tag: 'Memória & Agentes',
  },
  {
    id: 'prefrontal-working-memory',
    category: 'sistemas',
    neuroTerm: 'Córtex Pré-Frontal Dorsolateral',
    aiTerm: 'Context Window / Memória de Trabalho / Transformer Attention',
    shortSummary: 'Capacidade de manter e manipular informações temporárias ativas.',
    neurobiologyExplanation: 'Redes de neurônios que mantêm disparos sustentados em circuito fechado reverberante para segurar objetivos e planos mesmo na ausência do estímulo sensorial.',
    aiAnalogy: 'A janela de contexto de um LLM ou o estado oculto de uma arquitetura baseada em Atenção: decide onde focar dinamicamente para raciocinar em múltiplos passos.',
    practicalDataApplication: 'Testes de N-Back ou Stroop combinados com EEG frontal (especialmente na banda Teta frontal média - 4 a 8 Hz) para mensurar sobrecarga cognitiva.',
    pythonOrFormulaExample: 'frontal_theta = bandpower(eeg_data, sfreq, [4, 8], "Fz")',
    tag: 'Funções Executivas',
  },
  {
    id: 'eeg-frequency-bands',
    category: 'dados',
    neuroTerm: 'Ritmos Eletroencefalográficos (EEG)',
    aiTerm: 'Análise Espectral de Fourier & Feature Extraction',
    shortSummary: 'Oscilações síncronas de potenciais pós-sinápticos em larga escala.',
    neurobiologyExplanation: 'Bandas de frequência clássicas: Delta (0.5-4 Hz, sono profundo), Teta (4-8 Hz, memória/atenção), Alfa (8-12 Hz, relaxamento com olhos fechados), Beta (13-30 Hz, vigília ativa), Gama (>30 Hz, integração cognitiva).',
    aiAnalogy: 'Features no domínio da frequência extraídas com FFT (Fast Fourier Transform) ou Wavelets para alimentar classificadores de Machine Learning.',
    practicalDataApplication: 'Classificação de estados de sono (hipnograma), interfaces cérebro-computador (BCI baseada em P300 ou ritmos sensório-motores) e detecção de crises epilépticas.',
    pythonOrFormulaExample: 'freqs, psd = scipy.signal.welch(eeg_signal, fs=256)',
    tag: 'Séries Temporais',
  },
  {
    id: 'fmri-bold-glm',
    category: 'dados',
    neuroTerm: 'Sinal BOLD e Hemodinâmica (fMRI)',
    aiTerm: 'Convolução de Resposta ao Impulso & Regressão Linear Múltipla',
    shortSummary: 'Mapeamento indireto da atividade neural via consumo de oxigênio.',
    neurobiologyExplanation: 'Neurônios ativos consom oxigênio; os vasos sanguíneos locais aumentam o aporte de oxi-hemoglobina (diamagnética), alterando o sinal de ressonância magnética com um pico de 4 a 6 segundos depois.',
    aiAnalogy: 'Modelado matematicamente como a convolução entre o trem de eventos de estímulo e uma Função de Resposta Hemodinâmica (HRF), seguido por ajuste de regressão linear (GLM).',
    practicalDataApplication: 'Análise multivariada de padrões (MVPA - Multi-Voxel Pattern Analysis) e Representational Similarity Analysis (RSA) para comparar representações neurais e camadas de redes neurais profundas.',
    pythonOrFormulaExample: 'design_matrix = make_first_level_design_matrix(frame_times, events, hrf_model="glover")',
    tag: 'Neuroimagem',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    module: 1,
    question: 'Qual é a principal consequência do princípio do "Tudo-ou-Nada" no potencial de ação de um neurônio?',
    options: [
      'A amplitude do disparo elétrico varia proporcionalmente à intensidade do estímulo de entrada.',
      'Uma vez que o limiar de despolarização (~ -55mV) é atingido, o potencial de ação ocorre com amplitude máxima e invariável.',
      'O neurônio só dispara se todos os dendritos receberem neurotransmissores simultaneamente.',
      'A velocidade da condução axonal diminui se o estímulo for fraco.',
    ],
    correctIndex: 1,
    explanation: 'O potencial de ação é binário no que tange ao disparo: ou o limiar é alcançado e o disparo total ocorre, ou não ocorre disparo propagado. A intensidade da informação biológica é codificada na frequência (número de disparos por segundo) e não na altura do pico elétrico!',
    aiConnection: 'Semelhante a uma unidade binária de spiking neuron ou à transição nítida de uma função de ativação com threshold.',
  },
  {
    id: 'q2',
    module: 2,
    question: 'No aprendizado por reforço (Reinforcement Learning), a dopamina biológica é historicamente análoga a qual termo matemático?',
    options: [
      'À taxa de aprendizado estática (Learning Rate)',
      'À probabilidade de exploração ε no algoritmo epsilon-greedy',
      'Ao Erro de Predição de Diferença Temporal (Temporal Difference Error / TD-Error)',
      'Ao decaimento de pesos (L2 Weight Regularization)',
    ],
    correctIndex: 2,
    explanation: 'Wolfram Schultz e os fundadores do RL moderno (Sutton & Barto) provaram que neurônios dopaminérgicos do mesencéfalo disparam proporcionalmente à diferença entre a recompensa observada e o valor esperado (Reward Prediction Error).',
    aiConnection: 'A dopamina fornece o sinal escalar de ajuste que diz se o resultado foi melhor ou pior do que a estimativa da rede.',
  },
  {
    id: 'q3',
    module: 3,
    question: 'Por que o receptor NMDA é frequentemente comparado a uma porta lógica "AND" em computação biológica?',
    options: [
      'Ele requer a presença de Glutamato E a despolarização da membrana pós-sináptica para expulsar o íon Magnésio (Mg2+).',
      'Ele responde tanto a sinais excitatórios quanto inibitórios alternadamente.',
      'Ele só funciona se dois neurônios enviarem sinais com polaridades opostas.',
      'Ele processa apenas sinais digitais de alta voltagem sem neurotransmissores.',
    ],
    correctIndex: 0,
    explanation: 'O receptor NMDA é bloqueado em repouso por um íon Mg2+. Para abrir seu canal e deixar o Cálcio (Ca2+) entrar (iniciando o fortalecimento sináptico LTP), ele precisa de DOIS eventos simultâneos: Glutamato liberado (pré-sinapse) E despolarização suficiente para repelir eletrostaticamente o Mg2+ (pós-sinapse). Uma autêntica porta AND!',
    aiConnection: 'Essa é a base biofísica direta da Regra de Hebb: o fortalecimento ocorre exatamente quando duas entidades estão ativas juntas.',
  },
  {
    id: 'q4',
    module: 4,
    question: 'Em um projeto de ciência de dados analisando sinais de EEG de participantes durante uma tarefa cognitiva, qual o primeiro passo crítico de pré-processamento?',
    options: [
      'Aplicar uma rede neural convolucional diretamente nos dados brutos sem calibrar.',
      'Remoção de artefatos (piscares de olhos e ruído muscular) usando ICA e filtragem passa-faixa (ex: 0.5 a 45 Hz).',
      'Excluir todos os canais frontais para evitar interferência do córtex pré-frontal.',
      'Aumentar artificialmente a voltagem multiplicando o sinal por 1000.',
    ],
    correctIndex: 1,
    explanation: 'Sinais de EEG têm amplitude diminuta (microvolts µV) e são facilmente mascarados por potenciais elétricos gerados pelos olhos (EOG) e contrações musculares (EMG). A filtragem passa-faixa e a Decomposição em Componentes Independentes (ICA) são o padrão ouro de limpeza antes de qualquer modelagem preditiva.',
    aiConnection: 'A clássica máxima da ciência de dados: "Garbage In, Garbage Out". Em neurodados, o pipeline de pré-processamento é 70% do sucesso.',
  },
];

export const CURATED_RESOURCES: ResourceItem[] = [
  {
    id: 'book-bear',
    category: 'livro',
    title: 'Neurociências: Desvendando o Sistema Nervoso',
    authorOrSource: 'Mark F. Bear, Barry W. Connors, Michael A. Paradiso',
    description: 'O livro de cabeceira mais amigável, visual e didático já escrito para neurobiologia celular e de sistemas.',
    directRecommendation: 'Para a pós com foco em IA: NÃO leia o livro inteiro de uma vez! Comece estritamente pelos Capítulos 2 (Neurônios e Glia), 3 (Membrana em repouso), 4 (Potencial de ação) e 5 (Transmissão sináptica). Esses 4 capítulos dão 90% da base que você precisa.',
    badge: 'Leitura Recomendada nº 1',
    linkText: 'Ver detalhes didáticos',
    linkUrl: 'https://www.google.com/search?q=Neurociencias+Desvendando+o+Sistema+Nervoso+Bear',
  },
  {
    id: 'book-kandel',
    category: 'livro',
    title: 'Princípios da Neurociência (Kandel)',
    authorOrSource: 'Eric R. Kandel (Prêmio Nobel de Fisiologia/Medicina)',
    description: 'A "bíblia" monumental da neurociência. É denso, mas perfeito para consultas pontuais.',
    directRecommendation: 'Use apenas como enciclopédia de consulta quando seu professor na pós citar um mecanismo molecular específico. Não use como primeiro livro de cabeceira para não travar.',
    badge: 'Referência Avançada',
    linkText: 'Guia de consulta pontual',
    linkUrl: 'https://www.google.com/search?q=Principios+de+Neurociencia+Kandel',
  },
  {
    id: 'channel-2min',
    category: 'video',
    title: '2-Minute Neuroscience (YouTube)',
    authorOrSource: 'Neuroscientifically Challenged',
    description: 'Mini-aulas de 2 minutos com ilustrações desenhadas à mão explicando exatamente um conceito por vídeo.',
    directRecommendation: 'Assista hoje: "Action Potential", "Synaptic Transmission", "Glutamate", "GABA" e "Long-Term Potentiation (LTP)". Em menos de 15 minutos você visualiza dinâmicas que levariam horas no texto.',
    badge: 'Visual & Ultra-Rápido',
    linkText: 'Buscar playlist essencial',
    linkUrl: 'https://www.youtube.com/results?search_query=2+minute+neuroscience+action+potential',
  },
  {
    id: 'python-mne',
    category: 'python',
    title: 'MNE-Python (Análise de Dados de EEG & MEG)',
    authorOrSource: 'MNE-Tools Community (Open Source)',
    description: 'A biblioteca Python padrão da comunidade científica para carregar, filtrar, limpar (ICA), calcular densidade de potência (PSD) e analisar dados de EEG.',
    directRecommendation: 'Instale via `pip install mne`. Os tutoriais oficiais têm datasets públicos embutidos que você baixa com uma linha de código Python para treinar suas análises.',
    badge: 'Ferramenta de Dados Chave',
    linkText: 'mne.tools/stable',
    linkUrl: 'https://mne.tools/',
  },
  {
    id: 'python-nilearn',
    category: 'python',
    title: 'Nilearn (Machine Learning para Neuroimagem / fMRI)',
    authorOrSource: 'Nilearn Community & Inria',
    description: 'Integração perfeita com Scikit-Learn para aplicar algoritmos de ML diretamente em dados cerebrais 3D/4D (fMRI, GLM, conectividade funcional).',
    directRecommendation: 'Ideal para o seu objetivo de unir neurociência e IA: permite decodificar estados mentais usando modelos de regressão e classificação do scikit-learn com sintaxe Python nativa.',
    badge: 'Ponte Python & IA',
    linkText: 'nilearn.github.io',
    linkUrl: 'https://nilearn.github.io/',
  },
  {
    id: 'dataset-openneuro',
    category: 'dataset',
    title: 'OpenNeuro Archive',
    authorOrSource: 'Stanford Center for Reproducible Neuroscience',
    description: 'O maior repositório aberto do mundo de dados de neuroimagem e eletrofisiologia padronizados no formato BIDS (Brain Imaging Data Structure).',
    directRecommendation: 'Excelente para o seu TCC ou projeto prático da pós: você pode baixar gravações reais de participantes em experimentos de tomada de decisão, visão ou repouso.',
    badge: 'Datasets Abertos Gratuitos',
    linkText: 'openneuro.org',
    linkUrl: 'https://openneuro.org/',
  },
];
