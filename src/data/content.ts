import { LINKS } from './config';

const GH = 'https://github.com/LucasRangelSSouza/';

// 23 marcas da faixa (spec 4.2). `ext` é a extensão do arquivo em /public/logos.
export const LOGOS: { slug: string; nome: string; ext: string; h?: number }[] = [
  { slug: 'drogasil', nome: 'Drogasil', ext: 'svg' },
  { slug: 'bradesco', nome: 'Bradesco', ext: 'png' },
  { slug: 'scpc.w', nome: 'SCPC', ext: 'png' },
  { slug: 'cielo', nome: 'Cielo', ext: 'png' },
  { slug: 'drogaria-sao-paulo', nome: 'Drogaria São Paulo', ext: 'svg' },
  { slug: 'sem-parar', nome: 'Sem Parar', ext: 'svg' },
  { slug: 'smarttbot', nome: 'Smarttbot', ext: 'png', h: 32 },
  { slug: 'cogna', nome: 'Cogna Educação', ext: 'svg' },
  { slug: 'totvs', nome: 'TOTVS', ext: 'svg' },
  { slug: 'senai', nome: 'SENAI IST', ext: 'png' },
  { slug: 'cinemark', nome: 'Cinemark', ext: 'svg' },
  { slug: 'uisa', nome: 'UISA', ext: 'png' },
  { slug: 'lunelli', nome: 'Lunelli', ext: 'svg' },
  { slug: 'capital-certo.w', nome: 'Capital Certo', ext: 'png' },
  { slug: 'jump', nome: 'Jump', ext: 'svg' },
  { slug: 'triggo-labs.w', nome: 'Fleetcore (Triggo Labs)', ext: 'png', h: 34 },
  { slug: 'bulk.w', nome: 'Bulk', ext: 'png', h: 34 },
  { slug: 'eduk', nome: 'Eduk', ext: 'svg' },
  { slug: 'mindlab', nome: 'MindLab', ext: 'svg' },
  { slug: 'leega', nome: 'Leega', ext: 'svg' },
  { slug: 'quality-digital', nome: 'Quality Digital', ext: 'svg' },
  { slug: 'sysmap.w', nome: 'SysMap', ext: 'png' },
  { slug: 'semantix', nome: 'Semantix', ext: 'png' },
];

export type Motif = 'agents' | 'data' | 'vision' | 'chip' | 'wave' | 'sensor' | 'code' | 'flow';
export type Grupo = 'empresas' | 'fisico' | 'ia' | 'automacao' | 'proprios';

export const GRUPOS: Record<Grupo, string> = {
  empresas: 'Para empresas',
  fisico: 'Visão e sensores',
  ia: 'IA própria',
  automacao: 'Automação e agentes',
  proprios: 'Produtos e laboratório',
};

export interface Projeto {
  titulo: string;
  frase: string;
  grupo: Grupo;
  motif: Motif;
  link?: { rotulo: string; href: string };
  destaque?: number; // ordem entre os seis visíveis
}

const gh = (repo: string) => ({ rotulo: 'GitHub', href: GH + repo });

// Os 26 cards de COPY.md seção 11. Ordem dos visíveis: 1, 2, 11, 15, 24, 25.
export const PROJETOS: Projeto[] = [
  { titulo: 'Plataforma de agentes de IA', frase: 'Agentes especializados por empresa, cada um com as suas ferramentas, todos numa única plataforma.', grupo: 'empresas', motif: 'agents', destaque: 1 },
  { titulo: 'Cliente 360 e CRM', frase: 'Juntamos vários sistemas num painel só e criamos as análises que a diretoria usa para decidir.', grupo: 'empresas', motif: 'data', destaque: 2 },
  { titulo: 'IA que ajuda a decidir', frase: 'Agentes que trocam planilha por recomendação na hora de definir preço e produção.', grupo: 'empresas', motif: 'agents' },
  { titulo: 'Recomendação para varejo', frase: 'Sugestões que aumentam a venda, testadas em produção.', grupo: 'empresas', motif: 'data' },
  { titulo: 'Dados e previsão de demanda', frase: 'Os dados da empresa organizados e a previsão do que vai sair.', grupo: 'empresas', motif: 'data' },
  { titulo: 'Risco de crédito com dados', frase: 'Lago de dados, painéis e um motor que separa risco financeiro de má-fé.', grupo: 'empresas', motif: 'data' },
  { titulo: 'Modernização de sistema antigo', frase: 'Tiramos do caminho o sistema velho que trava a operação, sem parar a empresa.', grupo: 'empresas', motif: 'code' },
  { titulo: 'ERP e SaaS do zero', frase: 'Sistema sob medida, multiempresa, do banco de dados à tela.', grupo: 'empresas', motif: 'code', link: gh('Projeto-Sistema-ERP') },
  { titulo: 'Chat com os documentos da empresa', frase: 'Pergunte em português e receba a resposta tirada dos seus próprios arquivos.', grupo: 'empresas', motif: 'agents', link: gh('rag-chat') },
  { titulo: 'Painéis de BI prontos', frase: 'Painéis de gestão no ar em poucos dias, em servidor da própria empresa.', grupo: 'empresas', motif: 'data', link: gh('metabase-postgres-docker') },
  { titulo: 'Visão computacional', frase: 'Máquinas que enxergam: detectam, seguem e medem objetos em imagem e vídeo.', grupo: 'fisico', motif: 'vision', link: gh('vision-detection-tracking-bench'), destaque: 3 },
  { titulo: 'Câmeras inteligentes (em desenvolvimento)', frase: 'Vídeo de câmera virando evento que dá para pesquisar e investigar.', grupo: 'fisico', motif: 'vision', link: gh('multi-camera-rtsp-capacity') },
  { titulo: 'Sensores e chão de fábrica', frase: 'Do sensor à nuvem: medir, enviar, analisar e agir.', grupo: 'fisico', motif: 'sensor', link: gh('sensoriamento_esp32') },
  { titulo: 'Da foto ao 3D e gêmeo digital', frase: 'Transformar imagem em modelo 3D, com o que funcionou e o que não.', grupo: 'fisico', motif: 'vision', link: gh('image-to-3d-and-digital-twin') },
  { titulo: 'IA própria, com custo sob controle', frase: 'O seu próprio modelo de IA rodando no seu servidor, com a sua API.', grupo: 'ia', motif: 'chip', link: gh('llm-serving-engines-bench'), destaque: 4 },
  { titulo: 'IA mais leve, mesma qualidade', frase: 'Versões compactadas do mesmo modelo que cabem em máquina menor sem piorar a resposta.', grupo: 'ia', motif: 'chip', link: gh('quantization-and-offload-lab') },
  { titulo: 'Voz que ouve e fala', frase: 'Transcrição de áudio e voz sintética em tempo real.', grupo: 'ia', motif: 'wave', link: gh('voice-stt-tts-bench') },
  { titulo: 'Imagem e vídeo gerados por IA', frase: 'Geração de imagem e vídeo com custo conhecido por resultado.', grupo: 'ia', motif: 'wave', link: gh('image-video-generation-bench') },
  { titulo: 'IA que corrige código', frase: 'Acha o problema e abre a correção; a decisão final é de uma pessoa.', grupo: 'ia', motif: 'code' },
  { titulo: 'Assistente de código no editor', frase: 'Uma extensão que leva o agente de IA para dentro do editor do programador.', grupo: 'ia', motif: 'code', link: gh('hermes-vscode') },
  { titulo: 'Automação de navegador', frase: 'Robôs que usam sites como uma pessoa, testados em ambiente isolado.', grupo: 'automacao', motif: 'flow', link: gh('web-automation-lab') },
  { titulo: 'Agentes mais baratos', frase: 'Técnicas que reduzem o custo de rodar agentes, dizendo com clareza o que não foi provado.', grupo: 'automacao', motif: 'flow', link: gh('agent-tooling-token-savings') },
  { titulo: 'Dados públicos em escala', frase: 'Transformamos dado aberto do governo em produto e painel.', grupo: 'automacao', motif: 'data' },
  { titulo: 'LUAR, atendimento com IA', frase: 'O nosso produto: caixa de entrada com IA, Kanban e agentes que trabalham nos computadores da empresa.', grupo: 'proprios', motif: 'agents', link: { rotulo: 'Site do LUAR', href: LINKS.luar }, destaque: 5 },
  { titulo: 'Testamos IA em oito placas de vídeo', frase: 'Medimos o que roda, quanto custa e o que vale a pena, e publicamos tudo.', grupo: 'proprios', motif: 'chip', link: { rotulo: 'Hub', href: LINKS.hub }, destaque: 6 },
  { titulo: '83 ferramentas abertas testadas', frase: 'Instalamos e testamos ferramentas de código aberto em ambiente descartável, para saber quais usar.', grupo: 'proprios', motif: 'flow', link: gh('app-platforms-smoke-tests') },
];

export const FAQ: { p: string; r: string }[] = [
  { p: 'Preciso saber programar?', r: 'Não. Quem está começando recebe de bônus a minha área do aluno para pegar o básico, e eu te acompanho desde o primeiro passo, inclusive criar as contas e montar o ambiente.' },
  { p: 'É uma turma?', r: 'Não. As duas mentorias são individuais. Ninguém divide o seu horário.' },
  { p: 'Quanto tempo dura?', r: 'Depende do que você quer construir. A gente combina na conversa, antes de você pagar.' },
  { p: 'Qual a diferença entre as duas?', r: 'Na individual eu te vejo três vezes por semana por vídeo. No acompanhamento, tudo acontece no WhatsApp, no seu ritmo.' },
  { p: 'R$ 5.000 é caro?', r: 'É o valor de três encontros por semana comigo, com o ambiente e as ferramentas que eu uso nos meus clientes. Se em 7 dias você achar que não vale, eu devolvo tudo.' },
  { p: 'Vou ganhar dinheiro garantido?', r: 'Ninguém sério garante isso. Eu garanto o caminho, as ferramentas e eu do seu lado. O resultado depende do que você constrói e de quanto você vende.' },
  { p: 'E se eu travar?', r: 'É para isso que a mentoria existe. Você manda a travada e a gente resolve.' },
  { p: 'Vocês fazem o projeto da minha empresa?', r: 'Fazemos. É o serviço para empresas: me chama no WhatsApp e conta o problema.' },
  { p: 'Como pago?', r: 'Você conversa comigo antes e eu te mando um link de pagamento na conversa. Você escolhe Pix, cartão ou parcelado.' },
  { p: 'E se eu me arrepender?', r: 'Você tem 7 dias para pedir o reembolso integral, sem explicar o motivo.' },
];

// DEPOIMENTOS FICTÍCIOS (decisão de Lucas, 28/10/2026): ficam no ar durante a revisão e
// são trocados pelos reais quando existirem. Ver spec 4.9 e 4.12.
export const DEPOIMENTOS = [
  { ficticio: true, texto: 'Eu achava que IA era só o ChatGPT. Na mentoria a gente montou o atendimento automático da minha clínica, e eu entendo cada peça do que está rodando. Quando quebra, eu mesma conserto.', nome: 'Carla M.', arroba: '@carla.exemplo', cidade: 'Goiânia, GO', produto: 'Mentoria individual' },
  { ficticio: true, texto: 'Eu sempre travava na hora de colocar no ar. O Lucas me mostrou o ambiente certo na primeira semana. Hoje vendo automação como serviço, com o meu CNPJ.', nome: 'Rafael T.', arroba: '@rafa.exemplo', cidade: 'Curitiba, PR', produto: 'Mentoria individual' },
  { ficticio: true, texto: 'Fiquei no acompanhamento pelo WhatsApp. Toda vez que a IA não obedecia, eu mandava o print no grupo e saía de lá destravada.', nome: 'Juliana P.', arroba: '@ju.exemplo', cidade: 'Recife, PE', produto: 'Mentoria com acompanhamento' },
];
