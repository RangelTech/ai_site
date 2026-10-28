// Configuração do site. Tudo que Lucas pode querer mudar sem mexer em componente.

export const SITE = {
  url: 'https://ai.rangeltech.net',
  nome: 'Lucas Rangel',
  titulo: 'Lucas Rangel | Especialista em IA: mentoria e projetos',
  descricao:
    'Especialista em IA com 12 anos de experiência. Eu resolvo o problema da sua empresa com IA ou ensino você a construir o seu produto. Mentoria individual e com acompanhamento.',
};

export const WHATSAPP = {
  numero: '5562985613482',
  // Mensagem pré-preenchida de cada botão (spec, COPY.md seção 16).
  mensagens: {
    hero: 'Oi, Lucas! Vim pelo seu site e quero entender como a IA pode me ajudar.',
    b2b: 'Oi, Lucas! Tenho um problema na minha empresa que quero resolver com IA. Posso te contar?',
    individual: 'Oi, Lucas! Quero a Mentoria Individual. Ainda tem vaga aberta?',
    acompanhamento: 'Oi, Lucas! Quero entrar na Mentoria com Acompanhamento. Como funciona para começar?',
    final: 'Oi, Lucas! Vi o seu site e quero conversar sobre um projeto.',
    flutuante: 'Oi, Lucas! Vim pelo seu site.',
  },
  sufixoInstagram: ' (vim pelo Instagram)',
} as const;

export type WaKey = keyof typeof WHATSAPP.mensagens;

export function waHref(key: WaKey): string {
  return `https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(WHATSAPP.mensagens[key])}`;
}

// Vagas da mentoria individual: no máximo 4 alunos ao mesmo tempo.
// ATENÇÃO: `restantes` precisa refletir a realidade. Lucas atualiza à mão a cada aluno que entra ou sai.
export const VAGAS = {
  total: 4,
  restantes: 2,
};

// Bônus das duas mentorias. Valores = preço avulso de cada item (spec: área do aluno R$ 197, pacote de skills R$ 97).
// `ate` é o último dia em que o bônus vale (AAAA-MM-DD). Depois dessa data o aviso de prazo some sozinho.
// Só mantenha uma data que você de fato vai cumprir.
export const BONUS = {
  itens: [
    { nome: 'Minha área do aluno', valor: 197 },
    { nome: 'As habilidades técnicas que eu uso no dia a dia', valor: 97 },
  ],
  ate: '2026-11-30',
  ateTexto: '30 de novembro',
};

// Métricas (spec 4.6): Umami sem cookie. Vazio = desligado (nada é enviado).
export const UMAMI = {
  src: '', // ex.: 'https://stats.rangeltech.net/script.js'
  websiteId: '',
};

export const LINKS = {
  instagram: 'https://www.instagram.com/lucasranngels/',
  linkedin: 'https://www.linkedin.com/in/lucas-rangel-s-souza/',
  github: 'https://github.com/LucasRangelSSouza',
  kaggle: 'https://www.kaggle.com/lucasrangelss',
  portfolio: 'https://lucas.rangeltech.net/',
  hub: 'https://github.com/LucasRangelSSouza/gpu-ai-benchmark-hub',
  luar: 'https://luar.rangeltech.net',
};

export const EMPRESA = {
  nome: 'Rangel Technologia e Informação LTDA (Rangel Tech)',
  cnpj: '65.505.647/0001-10',
};
