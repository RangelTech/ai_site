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

export type Motif = 'agents' | 'data' | 'vision' | 'chip' | 'wave' | 'sensor' | 'code' | 'flow' | 'dash' | 'rag' | 'mesh' | 'erp';
export type Grupo = 'empresas' | 'fisico' | 'ia' | 'automacao' | 'proprios';

export const GRUPOS: Record<Grupo, string> = {
  empresas: 'Para empresas',
  fisico: 'Visão computacional e eletrônica',
  ia: 'IA própria, sem limites',
  automacao: 'Automação com agentes',
  proprios: 'Produtos e pesquisa',
};

export interface Projeto {
  titulo: string;
  frase: string;
  grupo: Grupo;
  motif: Motif;
  link?: { rotulo: string; href: string };
  destaque?: number; // ordem entre os seis visíveis
  img?: string; // arquivo em /img/projetos (print real ou imagem de exemplo); sem ele vale a ilustração do `motif`
}

const gh = (repo: string) => ({ rotulo: 'GitHub', href: GH + repo });

// Cards de projeto: título pelo resultado que o cliente leva, nunca pelo nome da ferramenta. Ordem dos visíveis: destaque 1 a 6.
export const PROJETOS: Projeto[] = [
  { titulo: 'Agentes de IA que trabalham pela sua empresa', frase: 'Uma plataforma onde cada agente tem a sua função, as suas ferramentas e a memória do seu negócio.', grupo: 'empresas', motif: 'agents', destaque: 1 },
  { titulo: 'Cliente 360 e CRM', frase: 'Vários sistemas num painel só, com as análises que a diretoria usa para decidir.', grupo: 'empresas', motif: 'dash', destaque: 2 },
  { titulo: 'Agentes que decidem preço e produção', img: 'precos', frase: 'Troque a planilha por uma recomendação pronta na hora de definir preço e mix.', grupo: 'empresas', motif: 'agents' },
  { titulo: 'Recomendação que aumenta a venda', img: 'recomendacao', frase: 'Sugestões de produto testadas em produção, para vender mais para quem já compra.', grupo: 'empresas', motif: 'data' },
  { titulo: 'Previsão de vendas e de demanda', img: 'previsao', frase: 'Os dados da empresa organizados e a previsão do que vai sair, semana a semana.', grupo: 'empresas', motif: 'data' },
  { titulo: 'Motor de risco de crédito', img: 'risco', frase: 'Lago de dados, painéis e um modelo que separa risco financeiro de má-fé.', grupo: 'empresas', motif: 'data' },
  { titulo: 'Clonamos o seu sistema obsoleto em tecnologia nova', img: 'clonar', frase: 'O sistema velho que trava a operação ganha uma versão moderna, sem a empresa parar.', grupo: 'empresas', motif: 'code' },
  { titulo: 'ERP e SaaS do zero', frase: 'Sistema sob medida, multiempresa, do banco de dados à tela.', grupo: 'empresas', motif: 'erp', link: gh('Projeto-Sistema-ERP') },
  { titulo: 'Agente de IA que conversa com os seus documentos', frase: 'Pergunte em português e receba a resposta tirada dos arquivos da sua empresa, com a fonte.', grupo: 'empresas', motif: 'rag', link: gh('rag-chat') },
  { titulo: 'Painéis de BI para a diretoria', img: 'bi', frase: 'Painéis de gestão no ar em poucos dias, rodando no servidor da própria empresa.', grupo: 'empresas', motif: 'dash', link: gh('metabase-postgres-docker') },
  { titulo: 'Câmeras que enxergam, seguem e medem', img: 'cameras', frase: 'Visão computacional que detecta pessoas, veículos e objetos em imagem e em vídeo.', grupo: 'fisico', motif: 'vision', link: gh('vision-detection-tracking-bench'), destaque: 3 },
  { titulo: 'Câmeras inteligentes', img: 'cameras2', frase: 'O vídeo das câmeras vira evento que dá para pesquisar, investigar e agir.', grupo: 'fisico', motif: 'vision', link: gh('multi-camera-rtsp-capacity') },
  { titulo: 'Prototipagem de sensores e eletrônica', frase: 'Do circuito na bancada à nuvem: placa, firmware, leitura do sensor e painel.', grupo: 'fisico', motif: 'sensor', link: gh('sensoriamento_esp32') },
  { titulo: 'Da foto ao modelo 3D', frase: 'Transformar imagens em modelo 3D e em gêmeo digital de um local ou de uma peça.', grupo: 'fisico', motif: 'mesh', link: gh('image-to-3d-and-digital-twin') },
  { titulo: 'IA própria, rodando no seu servidor', img: 'propria', frase: 'O seu próprio modelo de IA, com a sua API e o custo sob controle, sem mandar dado para fora.', grupo: 'ia', motif: 'chip', link: gh('llm-serving-engines-bench'), destaque: 4 },
  { titulo: 'IA sem limites e sem recusa', img: 'semlimites', frase: 'Modelo próprio sem as travas dos serviços públicos, para quem precisa de resposta e não de sermão.', grupo: 'ia', motif: 'chip' },
  { titulo: 'IA compacta que cabe em máquina pequena', img: 'compacta', frase: 'Versões enxutas do mesmo modelo, que rodam em equipamento barato sem perder qualidade.', grupo: 'ia', motif: 'chip', link: gh('quantization-and-offload-lab') },
  { titulo: 'Voz que ouve e fala', img: 'voz', frase: 'Transcrição de áudio e voz sintética em tempo real.', grupo: 'ia', motif: 'wave', link: gh('voice-stt-tts-bench') },
  { titulo: 'Clonagem de voz e deepfake em tempo real', img: 'deepfake', frase: 'Avatar com o seu rosto e a sua voz para gravar vídeo sem estar na frente da câmera.', grupo: 'ia', motif: 'wave' },
  { titulo: 'Imagens e vídeos gerados por IA', img: 'imagemia', frase: 'Geração de imagem e de vídeo rodando no seu próprio servidor, sem depender nem pagar plataformas externas.', grupo: 'ia', motif: 'wave', link: gh('image-video-generation-bench') },
  { titulo: 'IA que corrige código', img: 'cursor', frase: 'Acha o problema e abre a correção; a decisão final é de uma pessoa.', grupo: 'ia', motif: 'code' },
  { titulo: 'Assistente de código dentro do editor', img: 'codigo', frase: 'Uma extensão que leva o agente de IA para dentro do editor do programador.', grupo: 'ia', motif: 'code', link: gh('hermes-vscode') },
  { titulo: 'Robôs que usam sites por você', img: 'robos', frase: 'Automação de navegador: preenche, consulta e confere como uma pessoa faria.', grupo: 'automacao', motif: 'flow', link: gh('web-automation-lab') },
  { titulo: 'Agentes de IA mais baratos', img: 'baratos', frase: 'Técnicas que reduzem o custo de rodar agentes, dizendo com clareza o que foi provado.', grupo: 'automacao', motif: 'flow', link: gh('agent-tooling-token-savings') },
  { titulo: 'Dados públicos em escala', img: 'publicos', frase: 'Transformamos dado aberto do governo em produto e painel.', grupo: 'automacao', motif: 'data' },
  { titulo: 'Roteirização, desenho 3D e produção de conteúdo', img: 'conteudo', frase: 'Dezenas de ferramentas testadas e transformadas em fluxos prontos: o que você recebe é o resultado, não a ferramenta.', grupo: 'automacao', motif: 'flow', link: gh('app-platforms-smoke-tests') },
  { titulo: 'LUAR, atendimento com IA', img: 'luar', frase: 'O nosso produto: caixa de entrada com IA, Kanban e agentes que trabalham nos computadores da empresa.', grupo: 'proprios', motif: 'agents', link: { rotulo: 'Site do LUAR', href: LINKS.luar }, destaque: 5 },
  { titulo: 'Cluster multi-GPU para IA em massa', img: 'cluster', frase: 'Infraestrutura própria de placas de vídeo para processar IA em grande volume, com custo por resultado medido e publicado.', grupo: 'proprios', motif: 'chip', link: { rotulo: 'Hub', href: LINKS.hub }, destaque: 6 },
];

export const FAQ: { p: string; r: string }[] = [
  { p: 'Preciso saber programar?', r: 'Não. Quem está começando recebe de bônus a minha área do aluno para pegar o básico, e eu te acompanho desde o primeiro passo, inclusive criar as contas e montar o ambiente.' },
  { p: 'É uma turma?', r: 'Não. As duas mentorias são individuais. Ninguém divide o seu horário.' },
  { p: 'Quanto tempo dura?', r: 'Depende do que você quer construir. A gente combina na conversa, antes de você decidir.' },
  { p: 'Qual a diferença entre as duas?', r: 'Na individual eu te vejo três vezes por semana por vídeo. No acompanhamento, tudo acontece no WhatsApp, no seu ritmo.' },
  { p: 'R$ 5.000 é caro?', r: 'É o valor de três encontros por semana comigo, com o ambiente e as ferramentas que eu uso nos meus clientes. Se em 7 dias você achar que não vale, eu devolvo tudo.' },
  { p: 'Vou ganhar dinheiro garantido?', r: 'Ninguém sério garante isso. Eu garanto o caminho, as ferramentas e eu do seu lado. O resultado depende do que você constrói e de quanto você vende.' },
  { p: 'E se eu travar?', r: 'É para isso que a mentoria existe. Você manda a travada e a gente resolve.' },
  { p: 'Vocês fazem o projeto da minha empresa?', r: 'Fazemos. O limite é a sua imaginação e o quanto você pode investir. Me chama no WhatsApp, conta o problema e eu volto com a solução.' },
  { p: 'Como funciona o pagamento?', r: 'Você conversa comigo e a gente negocia direto. Para empresas, o formato é por contrato, do jeito que fizer sentido para vocês: boleto, cartão ou o que combinarmos.' },
  { p: 'E se eu me arrepender?', r: 'Você tem 7 dias para pedir o reembolso integral, sem explicar o motivo.' },
];

// Depoimentos: trocar pelos reais quando existirem (ver README, seção "Conteúdo de exemplo").
export const DEPOIMENTOS = [
  { texto: 'Eu achava que IA era só o ChatGPT. Na mentoria a gente montou o atendimento automático da minha clínica, e eu entendo cada peça do que está rodando. Quando quebra, eu mesma conserto.', nome: 'Carla M.', arroba: '@carla.exemplo', cidade: 'Goiânia, GO', produto: 'Mentoria individual' },
  { texto: 'Eu achava que inteligência artificial era só chat. Hoje eu entendo que existe um universo de ferramentas: geração de imagem, previsão de demanda, visão computacional, e eu sei qual usar em cada problema.', nome: 'Rafael T.', arroba: '@rafa.exemplo', cidade: 'Curitiba, PR', produto: 'Mentoria individual' },
  { texto: 'Fiquei no acompanhamento pelo WhatsApp. Toda vez que a IA não obedecia, eu mandava o print no grupo e saía de lá destravada.', nome: 'Juliana P.', arroba: '@ju.exemplo', cidade: 'Recife, PE', produto: 'Mentoria com acompanhamento' },
];
