// Configuração do site. Tudo que Lucas pode querer mudar sem mexer em componente.

export const SITE = {
  url: 'https://ai.rangeltech.net',
  nome: 'Lucas Rangel',
  titulo: 'Lucas Rangel | Qual é o seu problema? Eu resolvo com você.',
  descricao:
    'Não é curso. É Lucas Rangel, 20 anos em tecnologia e 12 em inteligência artificial, do seu lado, resolvendo o problema que trava a sua vida ou a sua empresa. Pelo WhatsApp ou cara a cara. Garantia de 7 dias.',
};

// Back-end (área do aluno): quiz, agenda e dados de prova.
export const API = {
  base: 'https://user.rangeltech.net',
};

export const WHATSAPP = {
  numero: '5562985613482',
  mensagens: {
    rodape: 'Oi, Lucas! Vim pelo seu site.',
    empresa: 'Oi, Lucas! Tenho um problema na minha empresa que quero resolver com IA. Posso te contar?',
  },
  sufixoInstagram: ' (vim pelo Instagram)',
} as const;

export type WaKey = keyof typeof WHATSAPP.mensagens;

export function waHref(key: WaKey): string {
  return `https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(WHATSAPP.mensagens[key])}`;
}

// Vagas da mentoria individual: no máximo 4 alunos ao mesmo tempo. Quantas aparecem como "sobrando" segue a regra por parte do mês (src/lib/mes.ts).
export const VAGAS = { total: 4 };

// Métricas (Umami, sem cookie). Vazio = desligado.
export const UMAMI = {
  src: 'https://metricas.rangeltech.net/script.js',
  websiteId: '0b313bb2-4ae7-4a1b-9de8-f717b5a69dd8',
};

export const LINKS = {
  instagram: 'https://www.instagram.com/lucasranngels/',
  linkedin: 'https://www.linkedin.com/in/lucas-rangel-s-souza/',
  github: 'https://github.com/LucasRangelSSouza',
  kaggle: 'https://www.kaggle.com/lucasrangelss',
  portfolio: 'https://lucas.rangeltech.net/pt/',
  aluno: 'https://user.rangeltech.net/login',
};

// Link de compra do acompanhamento (R$ 1.000). O quiz leva direto para cá quando o resultado é "pelo WhatsApp".
// O cara a cara (R$ 5.000) não tem link na página: o pagamento vem depois da call de 30 minutos.
export const CHECKOUT = {
  acompanhamento: 'https://pay.cakto.com.br/qddg2xq',
};

export const PRECOS = { individual: 5000, acompanhamento: 1000 };

// Vídeo de "quem sou eu" (60 s). Até o arquivo chegar, a cena usa as fotos. Ver public/video/LEIA-ME.md.
export const VIDEO = {
  // número de quadros da sequência esfregada pela rolagem (0 = sem vídeo, usa foto)
  quadros: 0,
  pasta: '/video/quadros', // /video/quadros/desk/0001.webp e /video/quadros/mob/0001.webp
  mp4: '', // '/video/quem-sou-eu.mp4' quando existir (reprodução normal, com legenda)
  legendas: ['Você tem um problema que a IA resolve.', 'Não falta curso. Falta alguém que resolva com você.', '20 anos em tecnologia. 12 em IA.', 'Eu abro a tela. A gente resolve junto.'],
};

// Cena 3D (seção "como funciona"). false desliga sem novo código de página; o aparelho fraco desliga sozinho.
export const TRES_D = { ligado: false }; // substituido pelo cerebro (src/scripts/cerebro.ts)

// Depoimentos em vídeo (3 espaços). Preencha `mp4` (vertical, 30 a 60 s) e `capa` (imagem) quando os vídeos existirem; vazio = espaço reservado.
export const VIDEOS_CLIENTES: { mp4: string; capa: string; nome: string; cargo: string }[] = [
  { mp4: '', capa: '', nome: '', cargo: '' },
  { mp4: '', capa: '', nome: '', cargo: '' },
  { mp4: '', capa: '', nome: '', cargo: '' },
];

// Números de autoridade (os mesmos do portfólio lucas.rangeltech.net).
export const NUMEROS = { empresas: 50, artigos: 150, projetos: 20, anosIA: 12, anosTec: 20, kaggle: 31 };

// Quiz de qualificação (spec SITE_V2, seções 10 e 16.5). Uma pergunta por tela.
export const QUIZ = {
  situacoes: [
    { id: 'empresa', label: 'Tenho uma empresa', sub: 'e gasto com gente o que a IA faz mais barato' },
    { id: 'empregado', label: 'Estou empregado', sub: 'e quero mais do que o salário' },
    { id: 'desempregado', label: 'Estou desempregado', sub: 'e preciso de uma saída real' },
    { id: 'autonomo', label: 'Sou autônomo', sub: 'e troco hora por dinheiro' },
  ],
  objetivos: {
    empresa: [
      { id: 'atendimento', label: 'Atendimento que não dá conta' },
      { id: 'vendas', label: 'Vender mais, com menos gente' },
      { id: 'sistema', label: 'Sistema velho travando a operação' },
      { id: 'dados', label: 'Dado espalhado, decisão no escuro' },
      { id: 'custo', label: 'Cortar custo: tarefa cara que a IA faz melhor' },
      { id: 'outro', label: 'Outro problema' },
    ],
    pessoa: [
      { id: 'saas', label: 'Criar um software ou SaaS' },
      { id: 'renda', label: 'Ganhar renda online de verdade' },
      { id: 'tempo', label: 'Ganhar tempo com automação' },
      { id: 'carreira', label: 'Mudar de carreira para IA' },
      { id: 'aprender', label: 'Aprender IA do zero, com direção' },
      { id: 'outro', label: 'Outro' },
    ],
  },
  feedback: {
    empresa: 'Faz sentido. Empresa com problema parado perde dinheiro todo dia, e quase sempre a solução é menor do que parece. Me conta mais duas coisas e eu te digo por onde começar.',
    empregado: 'Então você já tem o mais difícil: disciplina. O que falta é alguém que transforme isso em projeto e em renda. Duas perguntas e eu te mostro o caminho.',
    desempregado: 'Esse é o momento em que mais gente muda de vida, porque não dá mais para adiar. Vamos usar isso a seu favor. Duas perguntas e eu te digo como.',
    autonomo: 'Você já vende o seu tempo. A IA é o jeito de parar de trocar hora por dinheiro. Duas perguntas e eu te mostro onde ela entra no seu negócio.',
  },
  custo: [
    { id: 'ate500', label: 'Até R$ 500 por mês', valor: 500 },
    { id: '500a2000', label: 'De R$ 500 a R$ 2.000', valor: 2000 },
    { id: '2000a10000', label: 'De R$ 2.000 a R$ 10.000', valor: 10000 },
    { id: 'mais10000', label: 'Mais de R$ 10.000', valor: 20000 },
    { id: 'naosei', label: 'Não sei dizer', valor: 0 },
  ],
  // empresa: quanto custa hoje a pessoa ou o processo que ela quer automatizar (salário + encargos, por mês)
  custoEmpresa: [
    { id: 'ate3000', label: 'Até R$ 3.000 por mês', valor: 3000 },
    { id: '3000a6000', label: 'De R$ 3.000 a R$ 6.000', valor: 6000 },
    { id: '6000a12000', label: 'De R$ 6.000 a R$ 12.000', valor: 12000 },
    { id: 'mais12000', label: 'Mais de R$ 12.000', valor: 20000 },
    { id: 'naosei', label: 'Não sei dizer', valor: 0 },
  ],
  prazo: [
    { id: 'semana', label: 'Esta semana' },
    { id: '30dias', label: 'Nos próximos 30 dias' },
    { id: '3meses', label: 'Em até 3 meses' },
    { id: 'pesquisando', label: 'Só estou pesquisando' },
  ],
  formato: [
    { id: 'cara_a_cara', label: 'Cara a cara comigo', sub: '3 encontros por semana por vídeo + WhatsApp. Antes, uma call de 30 min.' },
    { id: 'whatsapp', label: 'Pelo WhatsApp', sub: 'Você manda, eu destravo. No seu ritmo, sem reunião marcada.' },
  ],
  porte: [
    { id: 'so_eu', label: 'Só eu' },
    { id: '2a10', label: '2 a 10 pessoas' },
    { id: '11a50', label: '11 a 50 pessoas' },
    { id: 'mais50', label: 'Mais de 50 pessoas' },
  ],
  decisor: [
    { id: 'sim', label: 'Sou eu quem decide' },
    { id: 'parte', label: 'Decido junto com outras pessoas' },
    { id: 'nao', label: 'Não sou eu quem decide' },
  ],
};

export const EMPRESA = {
  nome: 'Rangel Technologia e Informação LTDA (Rangel Tech)',
  cnpj: '65.505.647/0001-10',
};
